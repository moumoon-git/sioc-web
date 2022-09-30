<template>
  <div class="sign-container">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" />

    <!-- 签到状态 -->
    <Status v-if="isSign" :showButton="true" :config="StatusConfig" @jump="handleJumpCallback" />

    <div class="sign-container__body" v-else>
      <!-- 签到状态 -->
      <div :class="[$style.signStatusContainer]">
        <template v-if="!loading">
          <template v-if="isLocationSuccess">
            <img
              v-if="!isOverDistance"
              src="./assets/svg/success.svg"
              alt=""
              :class="$style.signStateIcon"
            />
            <img v-else src="./assets/svg/fail.svg" alt="" :class="$style.signStateIcon" />
              <div
                :class="$style.signStateText"
                :style="!isOverDistance ? 'color: #16C88B;' : 'color: #F94E36;'"
              >
                {{ !isOverDistance ? '已进入签到范围' : '超出签到范围,无法签到' }}
              </div>
          </template>
          <div
            v-else
            :class="$style.signStateText"
            :style="'color: rgb(25, 137, 250);'"
            @click="getCurrentLocation"
          >
            点击重新定位
          </div>
        </template>

        <template v-else>
          <div :class="$style.signStateText" :style="'color: #333333;'" @click="getCurrentLocation">
            <van-loading color="#1989fa" size="0.32rem" class="h5-loading">定位中...</van-loading>
          </div>
        </template>
      </div>
      <!-- 表单 -->
      <div class="sign-form">
        <PickPopup
          :label="'单位'"
          :title="pickerTitle"
          :placeholder="'请选择签到单位'"
          :columns="unitList"
          :customFieldName="customFieldName"
          @confirm="handleUnitChange"
        />
        <van-field v-model="position" label="职务" placeholder="请输入职务" />
        <van-field v-model="name" label="姓名" placeholder="请输入姓名" />
        <van-field v-model="phone" label="电话" type="tel" placeholder="请输入手机号码" />
        <van-field
          v-model="remark"
          rows="1"
          type="textarea"
          label="备注"
          autosize
          placeholder="请输入备注信息"
        />
        <Button
          @click="handleSign"
          class="sign-button"
          :type="isOverDistance ? 'disabled' : 'default'"
          >签到</Button
        >
        <!-- <div
          :class="isPosition
            ? $style.locationActive
            : $style.locationUnactive"
          @click="location"
        /> -->
        <!-- 定位 -->
        <Location :address="address" class="location" @click="showMap = true" />
        <!-- 以下部分是调试使用 start -->
        <!-- <div v-show="showMap" class="reset-van-overlay">
          <van-icon name="close" class="icon-class" @click="showMap = false" />
          <div id="mapContainer"></div>
        </div> -->
        <!-- 以下部分是调试使用 end -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import PickPopup from '@/product/SIOC-H5/generalparts/Popup/PickPopup/PickPopup.vue';
import Status from '@/product/SIOC-H5/generalparts/Status/Status.vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import Location from '@/product/SIOC-H5/module/task/TaskDetail/components/TaskLocation.vue';
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';
import { Toast, Notify } from 'vant';
import { useRouter } from 'vue-router';
const handleLocation = require('@/product/SIOC-H5/mainCapacity/Location/location').default;
const MapLoader: any = require('@/product/SIOC-H5/mainCapacity/AMap/AMap').default;

export default defineComponent({
  name: 'Sign',
  components: {
    // 输入框+弹出层+下拉框
    PickPopup,
    Status,
    Location,
    NavBar,
    Button,
  },
  setup() {
    const router = useRouter();
    const instance: any = getCurrentInstance();
    const { getLocation, GDLocation } = handleLocation();
    const { $http, $location } = instance?.appContext.config.globalProperties;
    const headquartersLatitude: any = ref(); // 现场指挥部地址-天地图坐标系-纬度
    const headquartersLongitude: any = ref(); // 现场指挥部地址-天地图坐标系-经度
    const address: any = ref(''); // 定位的地址
    const latitude: any = ref(); // 纬度
    const longitude: any = ref(); // 经度
    const isLocationSuccess = ref(false);
    // 签到状态
    const status = ref('已签到');
    // 签到单位
    const unitList = ref([]);
    const eventstructId = ref('');
    const groupId = ref('');
    // 职位
    const position = ref('');
    // 姓名
    const name = ref('');
    // 电话
    const phone = ref('');
    // 备注
    const remark = ref('');
    const isPosition = ref(true);
    const isPick = ref(false);
    const isSign = ref(false);
    const columns = ref([]);
    const navBarConfig = ref({
      title: '现场签到',
      type: '',
      path: '',
    });
    // 事件Id
    const eventId: any = ref(
      router.currentRoute.value.params.eventId ? router.currentRoute.value.params.eventId : '',
    );
    const distance = ref(500); // 当前定位与签到地址的范围差为500米
    const customFieldName = ref({
      text: 'name',
    });
    const pickerTitle = '请选择签到单位';
    // 是否超出签到范围
    const isOverDistance = ref(true);
    // 状态配置
    const StatusConfig = ref({
      actionState: 'success', // 动作的状态：完成/失败
      actionStateText: '签到成功！', // 动作的描述
      buttonText: '返回', // 按钮-文本
      buttonPath: ``, // 按钮-跳转路径
    });
    // 定位状态
    const locationStatus = ref('loading');
    const loading = ref(true);

    // 点击定位
    function location() {
      isPosition.value = true;
    }

    /**
     * @param range 范围
     * @description 获取当前定位
     */
    function getCurrentLocation(distance: number) {
      loading.value = true;
      isLocationSuccess.value = false;
      GDLocation().then((res: any) => {
        console.log('高德-获取定位：', res);
        // 地址
        address.value = res.address;
        // 纬度
        latitude.value = res.latitude;
        // 经度
        longitude.value = res.longitude;

        console.log(`高德-您当前所在地址:${res.address}`);
        console.log(`高德-您当前所在地址经纬度:${latitude.value},${longitude.value}`);
        loading.value = false;
        if (res.latitude && res.longitude) {
          isLocationSuccess.value = true;
          computedRange();
        } else {
          isLocationSuccess.value = false;
        }
      });

      // 注释原因：使用高德定位
      // getLocation().then((res: any) => {
      //   // 地址
      //   address.value = res.value.address;
      //   // 纬度
      //   latitude.value = res.value.latitude;
      //   // 经度
      //   longitude.value = res.value.longitude;
      //   console.log(`您当前所在地址:${res.value.address}`)
      //   console.log(`您当前所在地址经纬度:${latitude.value},${longitude.value}`)
      //   computedRange
      // });
    }

    /**
     * @description 计算当前定位和现场指挥部的距离
     */
    function computedRange() {
      const map: any = new (window as any).HM();
      // 现场指挥部： 天地图转高德
      map.tdtTrGd(headquartersLongitude.value, headquartersLatitude.value).then((res: any) => {
        console.log(
          '现场指挥部经纬度-转换前：',
          headquartersLongitude.value,
          headquartersLatitude.value,
        );
        console.log('现场指挥部经纬度-转换后：', res);
        // 高德地图
        if (res.latitude && res.longitude) {
          MapLoader((window as any).config.mapConfig.mapBusinessAkey).then(
            (AMap: any) => {
              // 现场指挥部经纬度
              var p1 = [res.longitude, res.latitude]; // [经度longitude, 纬度latitude]
              // 当前定位经纬度
              var p2 = [longitude.value, latitude.value]; // [经度longitude, 纬度latitude]
              // 当前定位和现场指挥部的地面距离,单位：米
              const range = AMap.GeometryUtil.distance(p1, p2);
              // 是否超出范围
              isOverDistance.value = distance.value < range.toFixed(2) ? true : false;
              console.log('当前定位和现场指挥部的距离：', range.toFixed(2), ';签到范围：', distance.value);
              console.log('是否超出范围：', isOverDistance.value);
            },
            (e: any) => {
              console.log('地图加载失败', e);
            },
          );
        }
      });
    }

    /**
     * @description H5原生定位-测试使用
     */
    function getOriginLocation() {
      getLocation().then((res: any) => {
        console.log('H5原生定位结果：', res);

        console.log(`H5原生定位结果-您当前所在地址:${res.value.address}`);

        // 高德地图

        MapLoader((window as any).config.mapConfig.mapBusinessAkey).then(
          (AMap: any) => {
            var p1 = [headquartersLongitude.value, headquartersLatitude.value];

            var p2 = [res.value.latitude, res.value.longitude];

            // 返回 p1 到 p2 间的地面距离，单位：米

            const range = AMap.GeometryUtil.distance(p1, p2);

            console.log('H5原生定位结果-范围：', range);

            if (distance.value < range) {
              console.log('H5原生定位结果-超出范围，不能签到');
            } else {
              console.log('H5原生定位结果-未超出范围，可以签到');
            }
          },

          (e: any) => {
            console.log('地图加载失败', e);
          },
        );
      });
    }
    const showMap = ref(false);

    /**
     * @description 显示地图-测试使用
     */
    function handleShowMap() {
      return new Promise((resolve, reject) => {
        // showMap.value = true;

        // 高德定位

        MapLoader((window as any).config.mapConfig.mapBusinessAkey).then(
          (AMap: any) => {
            var map = new AMap.Map('mapContainer', {
              resizeEnable: true,
              zoom: 12,
            });
            AMap.plugin(
              ['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.MapType'],
              function() {
                // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                map.addControl(new AMap.ToolBar());

                // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
                map.addControl(new AMap.Scale());

                // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
                // map.addControl(new AMap.OverView({isOpen:true}));

                // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
                // map.addControl(new AMap.MapType());
              },
            );

            AMap.plugin('AMap.Geolocation', function() {
              var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 3000000, //超过10秒后停止定位，默认：5s
                convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                buttonPosition: 'RB', //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(15, 160), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
              });

              map.addControl(geolocation);

              geolocation.getCurrentPosition(function(status: any, result: any) {
                console.log(status, result);

                if (status == 'complete') {
                  onComplete(result);
                } else {
                  onError(result);
                }
              });
            });

            //解析定位结果

            function onComplete(data: any) {
              console.log('解析定位结果', data);

              var str = [];

              str.push('定位结果：' + data.position);

              str.push('定位类别：' + data.location_type);

              if (data.accuracy) {
                str.push('精度：' + data.accuracy + ' 米');
              } //如为IP精确定位结果则没有精度信息

              str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));

              console.log(str.join('<br>'));

              ($location as any)

                .geocoder_Gd({ longitude: data.position.lng, latitude: data.position.lat })

                .then((res: any) => {
                  console.log('经纬度解析地址：', res);

                  const address = res.regeocode.formatted_address;

                  console.log('经纬度解析地址：', address);
                });
            }

            //解析定位错误信息

            function onError(data: any) {
              console.log('定位失败：', data);
            }
          },

          (e: any) => {
            console.log('地图加载失败', e);
          },
        );
      });
    }
    /**
     * @description 点击签到
     */
    function handleSign() {
      if (isOverDistance.value) {
        Toast({
          icon: 'close',
          message: '超出签到范围,无法签到',
        });
        return;
      }
      if (
        eventstructId.value === '' ||
        groupId.value === '' ||
        name.value === '' ||
        phone.value === '' ||
        position.value === ''
      ) {
        Toast({
          icon: 'close',
          message: '请输入签到信息',
        });
        return;
      }
      const validate: boolean = validatePhone(phone.value);
      if (!validate) {
        Toast({
          icon: 'close',
          message: '电话格式不正确',
        });
        return;
      }
      memberSign();
    }

    /**
     * @description 校验手机号码或者座机号码
     */
    function validatePhone(value: string) {
      console.log(value);
      const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      const reg1 = /^(0\d{2,3}\-|0\d{2,3})?[1-9]\d{6,7}(\-\d{1,4})?$/;
      return !!(reg.test(value) || reg1.test(value));
    }
    /**
     * @param {string} eventId 事件id
     * @description 获取签到单位
     */
    function getStructTreeH5(eventId: string) {
      let form = new FormData();
      form.append('eventId', eventId);
      let requestData: any = ref({
        method: 'post',
        service: 'soc',
        url: `/eventconduct/eventSceneonductSign/getStructTreeH5`,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
        data: form,
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          if (res.code === 0) {
            unitList.value = res.data.map((el: any) => {
              if (el.children.length === 0) {
                el.children = null;
              }
              return el;
            });
          }
        })
        .catch((error: any) => {
          if (error.code) {
            Notify({
              type: 'danger',
              message: `获取签到单位失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    /**
     * @param {string} eventId 事件id
     * @description 获取预案事件的经纬度等信息
     */
    function geteventSceneConduct(eventId: string) {
      let form = new FormData();
      form.append('eventId', eventId);
      let requestData: any = ref({
        method: 'post',
        service: 'soc',
        url: `/eventconduct/geteventSceneConduct`,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
        data: form,
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          if (res.code === 0) {
            // 现场指挥部经纬度
            headquartersLongitude.value = res.data.cgcsLongitude || res.data.longitude;
            headquartersLatitude.value = res.data.cgcsLatitude || res.data.latitude;
            console.log('现场指挥部经纬度：', headquartersLongitude.value, headquartersLatitude.value)
            getCurrentLocation(distance.value); // 获取当前定位
            // getOriginLocation(); // 获取原生定位-测试使用
          }
        })
        .catch((error: any) => {
          if (error.code) {
            Notify({
              type: 'danger',
              message: `获取预案事件信息失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    /**
     * @description 数据初始化
     */
    function initData() {
      eventstructId.value = ''; // 选的单位的id
      groupId.value = ''; // 选择单位的单位关联的组的id
      name.value = '';
      phone.value = '';
      position.value = '';
    }

    /**
     * @description 签到
     */
    function memberSign() {
      const data = {
        eventstructId: eventstructId.value, // 选的单位的id
        groupId: groupId.value, // 选择单位的单位关联的组的id
        eventId: eventId.value,
        latitude: latitude.value,
        longitude: longitude.value,
        name: name.value,
        phone: phone.value,
        duty: position.value,
        remark: remark.value,
      };
      let requestData: any = ref({
        method: 'post',
        service: 'soc',
        url: `/eventconduct/eventSceneonductSign/sign`,
        headers: {
          'Content-Type': 'application/json ',
        },
        data: data,
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          if (res.code === 0) {
            isSign.value = true;
            Object.assign(StatusConfig, {
              actionState: 'success', // 动作的状态：完成/失败
              actionStateText: '签到成功！', // 动作的描述
              buttonText: '返回', // 按钮-文本
              buttonPath: ``, // 按钮-跳转路径
            });
            initData(); // 数据初始化
          } else if (res.code === 205) {
            Toast({
              message: '该电话号码今日已签到请勿重复签到！',
              icon: 'close',
            });
          } else if (res.code === 206) {
            Toast({
              message: '签到单位不存在',
              icon: 'close',
            });
          } else {
            Toast({
              message: res.msg || res.message || '',
              icon: 'close',
            });
          }
        })
        .catch((error: any) => {
          if (error.code) {
            isSign.value = true;
            Object.assign(StatusConfig, {
              actionState: 'fail', // 动作的状态：完成/失败
              actionStateText: '签到失败！', // 动作的描述
              buttonText: '返回', // 按钮-文本
              buttonPath: ``, // 按钮-跳转路径
            });
            Notify({
              type: 'danger',
              message: `签到单位失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    /**
     * @description 单位更改触发
     */
    function handleUnitChange(item: any) {
      eventstructId.value = item[item.length - 1].id;
      groupId.value = item[item.length - 1].groupId;
    }

    /**
     * @description 签到成功或失败，点击返回按钮
     */
    function handleJumpCallback() {
      isSign.value = false;
    }

    onMounted(() => {
      getStructTreeH5(eventId.value); // 获取签到单位
      geteventSceneConduct(eventId.value); // 获取预案事件的经纬度等信息
      // handleShowMap();
    });

    return {
      getCurrentLocation,
      status,
      unitList,
      position,
      name,
      phone,
      remark,
      isPosition,
      isPick,
      isSign,
      columns,
      location,
      handleSign,
      navBarConfig,
      customFieldName,
      handleUnitChange,
      pickerTitle,
      StatusConfig,
      handleJumpCallback,
      isOverDistance,
      address,
      locationStatus,
      loading,
      longitude,
      latitude,
      headquartersLongitude,
      headquartersLatitude,
      distance,
      handleShowMap,
      showMap,
      isLocationSuccess,
    };
  },
});
</script>

<style lang="scss" module>
@import './assets/css/sign.scss';
</style>

<style lang="scss">
.sign-container {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .sign-container__body {
    width: 100%;
    flex: 1;
    padding: 0 0.4rem;
    overflow: auto;
    box-sizing: border-box;

    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #ececec;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }

    // 表单
    .sign-form {
      .van-cell {
        border-bottom: 0.01rem solid #dddddd;
        min-height: 1.1rem;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0;

        .van-cell__title {
          span {
            display: block;
            width: 1.44rem;
            height: 1.12rem;
            font-size: 0.32rem;
            font-weight: 400;
            color: #333333;
            line-height: 1.12rem;
            text-align: left;
            margin-right: 0;
          }
        }
        .van-cell__value {
          input {
            // width: 4.2rem;
            height: 1.12rem;
            font-size: 0.32rem;
            font-weight: 400;
            line-height: 1.12rem;
          }

          textarea {
            padding-top: 0.06rem;
            width: 4.2rem;
            font-size: 0.32rem;
            font-weight: 400;
          }

          .van-field__right-icon {
            .van-icon {
              font-size: 0.32rem;
            }
          }
        }
      }

      // 按钮
      .van-button {
        margin-top: 0.8rem;
        width: 6.4rem;
        height: 0.88rem;
        background: linear-gradient(360deg, #2b80ff 0%, #65bcff 100%);
        box-shadow: 0rem 0.06rem 0.12rem 0rem rgba(12, 126, 161, 0.35);
        border-radius: 0.75rem;
        border: transparent;
        margin-bottom: 0.4rem;

        span {
          font-size: 0.36rem;
          font-weight: 400;
          color: #ffffff;
        }
      }

      .sign-button {
        margin: 0.8rem 0 0.4rem 0;
        width: 6.4rem;
        height: 0.88rem;
        line-height: 0.88rem;
      }

      // 下拉选择框
      .van-popup {
        .van-picker {
          .van-picker__toolbar {
            font-size: 0.36rem;
            font-weight: 400;
            color: #000000;
            height: 1rem;
          }
          .van-picker__cancel,
          .van-picker__confirm {
            font-size: 0.36rem;
            font-weight: 400;
            color: #0091ff;
            line-height: 0.5rem;
          }

          .van-picker__title {
            color: #000000;
            font-size: 0.36rem;
            font-weight: 400;
            line-height: 1rem;
          }
        }

        .van-picker__columns {
          .van-ellipsis {
            font-size: 0.32rem;
            font-weight: 400;
            // color: #CCCCCC;
          }

          .van-picker-column__item--selected {
            font-size: 0.36rem;
            font-weight: 400;
            color: #000000;
          }
        }
      }
    }
    // 定位
    .location {
      .task-location_img-loaction2 {
        width: 0.28rem;
        height: 0.34rem;
      }

      div {
        font-size: 0.28rem;
      }
    }

    .h5-loading {

    }
  }
}
.van-toast {
  background: rbga(0, 0, 0, 0.8);
  width: 3.2rem;
  padding: 0.34rem 0.2rem;
}
.reset-van-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  position: absolute;
  top: 0;
  left: 0;

  .icon-class {
    font-size: 0.5rem;
    color: #ffffff;
    position: absolute;
    right: 0.2rem;
    top: 1rem;
  }
  #mapContainer {
    width: 7rem;
    height: 10rem;
  }
}
</style>
