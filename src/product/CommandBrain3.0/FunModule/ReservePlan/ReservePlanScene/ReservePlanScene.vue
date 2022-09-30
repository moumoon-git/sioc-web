<template>
  <!-- 没有预案并且在上一步 -->
  <div
    v-if="isBuild&&!isNext"
    style="width: 658px; height: 266px;position:relative;color: #FFF;"
  >
    <!-- 地址 -->
    <div style="position:absolute;top: 20px;left: 65px;color:#A6ADB4">
      任务地点:
    </div>
    <input
      v-model="address"
      :class="$style.input"
    >
    <div
      :class="isPosition
        ? $style.locationActive
        : $style.locationUnactive"
      @click="location"
    />
    <!-- 备注 -->
    <div style="position:absolute;top: 67px;left: 93px;color:#A6ADB4">
      备注:
    </div>
    <textarea
      v-model="remark"
      :class="$style.text"
    />
    <!-- 按钮 -->
    <Button
      type="primary"
      style="position:absolute;bottom:10px;right:16px;"
      @click="isNext=true"
    >
      下一步
    </Button>
  </div>
  <!-- 有没有预案并且在下一步 -->
  <div
    v-if="isNext"
    style="width: 874px; height: 81vh;position:relative;"
  >
    <!-- 现场指挥部 -->
    <ReservePlanSceneManager
      ref="ReservePlanSceneManager"
      :is-not-info="true"
      :is-next="isNext"
      :is-build="isBuild"
      @hide="hideWindow"
      @unhide="unhideWindow"
    />
    <!-- 按钮 没有预案 -->
    <Button
      v-if="isBuild"
      type="primary"
      style="position:absolute;bottom:10px;right:200px;"
      @click="closeWindow"
    >
      取消
    </Button>
    <Button
      v-if="isBuild"
      type="primary"
      style="position:absolute;bottom:10px;right:100px;"
      @click="isNext=false"
    >
      上一步
    </Button>
    <Button
      v-if="isBuild"
      type="primary"
      style="position:absolute;bottom:10px;right:16px;"
      @click="commit"
    >
      成立
    </Button>
  </div>
  <!-- 弹窗 -->
  <MessageBox
    ref="MessageBox"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import MessageBox from '@/product/CommandBrain3.0/Generalparts/dialog/MessageBox/MessageBox.vue'; // 消息确认弹窗
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import {
  copy,
  getManager,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';
import ReservePlanSceneManager from './ReservePlanSceneManager/ReservePlanSceneManager.vue'; // 现场指挥部

export default defineComponent({
  name: 'ReservePlanScene',
  components: {
    // 按钮
    Button,
    // 现场指挥部
    ReservePlanSceneManager,
    // 消息确认弹窗
    MessageBox,
  },
  provide() {
    return {
      $MessageBox: this.openMessageBox,
    };
  },
  props: {
    // 弹窗操作
    operation: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const isBuild = ref(false); // 不是建设状态，假设有预案
    const isNext = ref(true); // 在下一步
    const store = useStore(); // 使用vuex
    const address = ref('');
    const remark = ref('');
    const longitude = ref(0);
    const latitude = ref(0);
    const isPosition = ref(false);
    const { $http, $message }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const MessageBox = ref(null);
    const ReservePlanSceneManager = ref(null);
    function openMessageBox(options: any) {
      return (MessageBox as any).value.init(options);
    }
    function hideWindow() {
      if (props.operation.hide) {
        props.operation.hide();
      }
    }
    function unhideWindow() {
      if (props.operation.unhide) {
        props.operation.unhide();
      }
    }
    function closeWindow() {
      if (props.operation.unhide) {
        props.operation.close();
      }
    }
    // 点击定位
    function location() {
      isPosition.value = true;
      // 隐藏弹窗
      hideWindow();
      const mapInstance = (window as any).map;
      // 清空上一次绘制的落点和图层
      mapInstance.clearAtPresentMarkData('AdminMarker');
      // 开启点击地图获取地址、经纬度的功能
      mapInstance.setMouseStyle(require('../PublicComponents/assets/marker.svg'));
      mapInstance.clickDroppoint((clickInfo: {
        mapLocation: {
          lon: number,
          lat: number,
        },
        res: {
          result: {
            formatted_address: string,
          }
        }
      }) => {
        // 关闭点击地图获取地址、经纬度的功能
        mapInstance.closeClickDroppoint();
        mapInstance.restoreDefaultStyle();
        // 获取到地址、经纬度
        address.value = clickInfo.res.result.formatted_address;
        longitude.value = clickInfo.mapLocation.lon;
        latitude.value = clickInfo.mapLocation.lat;
        store.commit('reservePlan/setSceneMsg', {
          longitude: longitude.value,
          latitude: latitude.value,
          address: address.value,
          remark: remark.value,
        });
        // 绘制地点坐标
        mapInstance.setOneMarker(
          'AdminMarker',
          {
            longitude: clickInfo.mapLocation.lon,
            latitude: clickInfo.mapLocation.lat,
            wd: 30,
            hg: 30,
            src: require('../PublicComponents/assets/marker.svg'),
          },
        );
        // 取消隐藏弹窗
        unhideWindow();
      });
    }
    // 保存按钮
    function commit() {
      if (longitude.value && latitude.value) {
        const options = {
          type: 'prompt',
          title: '成立现场指挥部',
          message: '是否成立现场指挥部？',
          tips: '现场指挥部成立后，将通过短信形式通知相关现场指挥部成员',
          remark: false,
          placeholder: '',
        };
        openMessageBox(options).then(
          () => {
            const request = {
              method: 'post',
              url: '/eventconduct/add',
              service: 'soc',
              headers: {
                'Content-Type': 'application/json',
              },
              data: {
                address: address.value,
                longitude: longitude.value,
                latitude: latitude.value,
                deleted: 0,
                eventId: store.state.event?.id,
                duty: '',
                remark: remark.value,
              },
            };
            $http(request).then((response: any) => {
              if (response.code === 0) {
                store.commit('reservePlan/setLeftRefresh', true);
                $message.info('现场指挥部创建成功！');
                isBuild.value = false;
                isNext.value = true;
                // 马上驻点
                getManager(store.state.event?.id, store);
                copy(store.state.event?.id, store.state.reservePlan.currentReservePlan.currentId);
              }
            });
          },
        );
      } else {
        $message.error('请先选取位置');
      }
    }
    watch(
      () => remark.value,
      (val) => {
        store.commit('reservePlan/setSceneMsg', {
          longitude: longitude.value,
          latitude: latitude.value,
          address: address.value,
          remark: val,
        });
      },
    );
    onMounted(() => {
      if (store.state.reservePlan?.sceneMsg?.id) {
        isBuild.value = false;
        isNext.value = true;
      } else {
        isBuild.value = true;
        isNext.value = false;
        // 清空
        store.commit('reservePlan/setSceneMsg', null);
      }
    });
    // 如果选完点又不保存，退出的时候获取数据库的指挥部
    onBeforeUnmount(() => {
      getManager(store.state.event?.id, store);
    });
    return {
      openMessageBox,
      MessageBox,
      hideWindow,
      unhideWindow,
      closeWindow,
      isBuild,
      isNext,
      address,
      remark,
      longitude,
      latitude,
      isPosition,
      location,
      commit,
      ReservePlanSceneManager,
    };
  },
});
</script>

<style lang="scss" module>
  .headerStyle {
    position:relative;
    width: 874px;
    text-align: center;
    float: left;
    height: 78px;
    cursor: pointer;
    margin-left: 239px;
    margin-top: 14px;
    .headerText {
      border: 1px solid rgb(255, 255, 255);
      padding: 7px;
      width: 187px;
      float: left;
    }
  }
  .locationActive {
    background: url(../PublicComponents/assets/locationActive.svg) no-repeat;
    width: 14px;
    height: 17px;
    right: 97px;
    top: 28px;
    position: absolute;
    cursor: pointer;
  }
  .locationUnactive {
    background: url(../PublicComponents/assets/locationUnActive.svg) no-repeat;
    width: 14px;
    height: 17px;
    right: 97px;
    top: 28px;
    position: absolute;
    cursor: pointer;
    &:hover {
      background: url(../PublicComponents/assets/locationActive.svg) no-repeat;
    }
  }
  .input {
    color: #FFF;
    position:absolute;
    left: 135px;
    top: 20px;
    resize: none;
    border: none;
    box-sizing: border-box;
    outline: none;
    background: transparent;
    width: 433px;
    height: 32px;
    border: 1px solid #A6ADB4;
  }
  .text {
    color: #FFF;
    position:absolute;
    left: 135px;
    top: 69px;
    resize: none;
    border: none;
    box-sizing: border-box;
    outline: none;
    background: transparent;
    width: 433px;
    height: 108px;
    border: 1px solid #A6ADB4;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
</style>
