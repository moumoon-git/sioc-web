<!--现场指挥部-->
<template>
  <div class="headquarters-contianer">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" />

    <div class="headquarters-contianer__header">
      <!-- 地址 -->
      <div
        v-if="unitBreadcrumb.length === 0"
        class="headquarters-contianer__header__location"
        @click="jumpToMap"
      >
        <Location :address="address" class="location" />
      </div>

      <!-- 搜索框 -->
      <Search
        :readonly="true"
        :placeholder="'请输入联系人姓名、单位、职务、电话关键字'"
        @click="handleStartSearch"
      />

      <!-- 面包屑 -->
      <div v-if="unitBreadcrumb.length > 0" class="headquarters-contianer__header__unit-breadcrumb">
        <span style="color:#0091ff;" @click="handleSwitchStruct">组织架构</span>
        <span v-if="unitBreadcrumb.length > 0" class="division">></span>
        <div v-for="(item, index) in unitBreadcrumb" @click="handleSwitchUnit(index, item)">
          <span :style="{ color: index === unitBreadcrumb.length - 1 ? '#999999' : '' }">{{
            item.unitName
          }}</span>
          <span v-if="index !== unitBreadcrumb.length - 1" class="division">></span>
        </div>
      </div>
    </div>

    <div class="headquarters-contianer__body">
      <!-- 功能职责 -->
      <div v-if="activeUnitIndex >= 0" class="headquarters-contianer__body__unit-function">
        <div class="unit-name">{{ activeUnitIndex === 0 ? '功能组职责' : '应急职责' }}</div>
        <div class="unit-description">{{ functionalDescription ? functionalDescription : '暂无描述' }}</div>
      </div>

      <!-- 现场指挥官 -->
      <div
        v-if="contactorList.length > 0"
        class="headquarters-contianer__body__headquarters-principal"
      >
        <Contactor
          v-for="(item, index) in contactorList"
          :key="item.id"
          :contactor="item"
          :style="{ border: index === contactorList.length - 1 ? 'none' : '' }"
          @click="jumpToContactorInformation(item)"
        />
      </div>

      <!-- 功能组/单位 -->
      <div class="headquarters-contianer__body__headquarters-units">
        <template v-if="isFunctional">
          <div
            v-for="(item, index) in functionalGroup"
            :key="item.id"
            class="headquarters-unit-item"
            @click="handleFunctionalGroup(item)"
          >
            <span>{{ item.name }}</span>
            <img src="./assets/svg/right.png" alt="" />
          </div>
        </template>
        <template v-else>
          <div
            v-for="(item, index) in unitGroup"
            :key="item.id"
            class="headquarters-unit-item"
            @click="handleSelectUnit(item)"
          >
            <div>
              <span class="unitName">{{ item.name }}</span>
              <span v-if="item.leadUnit === 1" class="leadUnit">牵头单位</span>
            </div>
            <img src="./assets/svg/right.png" alt="" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import Location from '@/product/SIOC-H5/module/task/TaskDetail/components/TaskLocation.vue';
import Contactor from '@/product/SIOC-H5/generalparts/Contactor/Contactor.vue';
import Search from '@/product/SIOC-H5/generalparts/SearchInput/SearchInput.vue';
import { useRouter } from 'vue-router';
import { Notify, Toast } from 'vant';
import { useStore } from 'vuex';
const { getRelations } = require('@/product/SIOC-H5/mainCapacity/utils/common.js').default;

export default defineComponent({
  name: 'Headquarters',
  components: {
    NavBar,
    Location,
    Contactor,
    Search,
  },
  setup() {
    const instance: any = getCurrentInstance();
    const { $http } = instance?.appContext.config.globalProperties;
    const store = useStore();
    // 路由
    const router = useRouter();
    // 事件Id
    const eventId = ref(
      router.currentRoute.value.params.eventId ? router.currentRoute.value.params.eventId : '',
    );
    store.commit('reserve/setEventId', eventId.value);
    // 导航栏配置
    const navBarConfig = ref({
      title: '现场指挥部',
      type: '',
      path: '',
    });
    // 面包屑
    const unitBreadcrumb: any = ref([]);
    // 接口数据
    const interfaceData: any = ref({});
    // 联系人
    const contactorList: any = ref([]);
    // 功能组
    const functionalGroup: any = ref([]);
    // 单位组
    const unitGroup: any = ref([]);
    // 当前级别是功能组还是单位
    const isFunctional = ref(true);
    // 功能组职责
    const functionalDescription = ref('');
    // 当前选中的功能组
    const activeUnitIndex = ref(-1);
    // 现场指挥部领导
    const leaderList = ref([]);
    // 地点
    const address = ref('');

    /**
     * @description 封装数据
     */
    function getData(data: any) {
      data.forEach((el: any) => {
        // 第一层是功能组，用来区分单位和功能组
        el.isFunctional = true;
      });
      // 功能组
      functionalGroup.value = data;
      // 是否是功能组
      isFunctional.value = true;
      // 面包屑
      unitBreadcrumb.value = Array.from([]);
      // 激活的面包屑
      activeUnitIndex.value = -1;
      // 清空联系人
      contactorList.value = Array.from([]);
      // 现场指挥部领导班子
      if (leaderList.value.length > 0) {
        leaderList.value.forEach((el: any) => {
          contactorList.value.push({
            contactorId: el.contactorId, // id
            sex: el.sex ? (el.sex === 0 ? '男' : '女') : '男', // 性别
            picture: el.images, // 头像图片
            name: el.name, // 姓名
            position: el.dutyName, // 职务
            unit: el.deptName, // 单位
            title: el.remark, // 头衔
          });
        });
      }
    }

    /**
     * @description 跳转到联系人详情
     */
    function jumpToContactorInformation(item: any) {
      router.push({
        path: `/ContactorInformation/${item.contactorId}`,
      });
    }

    /**
     * @description 切换
     */
    function handleSelectUnit(item: any) {
      isFunctional.value = false;
      // 应急职责
      functionalDescription.value = item.remark;
      // 联系人
      getContactorList(item);

      // 单位组
      if (item.children.length > 0) {
        unitGroup.value = item.children;
      } else {
        unitGroup.value = Array.from([]);
      }
      const newObj: any = {
        unitName: item.name,
        id: item.id,
        remark: item.remark
      };
      // 面包屑
      unitBreadcrumb.value.push(newObj);
      // 当前选中的功能组
      activeUnitIndex.value = unitBreadcrumb.value.length - 1;
    }

    /**
     * @description 获取联系人
     */
    function getContactorList(item: any) {
      // 联系人
      contactorList.value = Array.from([]);
      if (
        (item.contactors.response && item.contactors.response.length > 0) ||
        (item.contactors.contacotr && item.contactors.contacotr.length > 0)
      ) {
        const newArr: any = Array.from(item.contactors.response.concat(item.contactors.contacotr));
        newArr.forEach((el: any) => {
          contactorList.value.push({
            contactorId: el.contactorId, // id
            sex: el.sex ? (el.sex === 0 ? '男' : '女') : '男', // 性别
            picture: el.images, // 头像图片
            name: el.name, // 姓名
            position: el.dutyName, // 职务
            unit: el.deptName, // 单位
            title: el.remark, // 头衔
          });
        });
      }
    }

    /**
     * @description 切换
     */
    function handleFunctionalGroup(item: any) {
      // 功能职责
      functionalDescription.value = item.remark;
      // 联系人
      getContactorList(item);
      // 功能组
      isFunctional.value = false;
      const newObj: any = {
        unitName: item.name,
        id: item.id,
        remark: item.remark
      };
      unitBreadcrumb.value.push(newObj);
      // 当前选中的功能组
      activeUnitIndex.value = unitBreadcrumb.value.length - 1;
      if (item.children.length > 0) {
        unitGroup.value = item.children;
      } else {
        unitGroup.value = Array.from([]);
      }
    }

    /**
     * @description 切换到组织架构单位
     */
    function handleSwitchStruct() {
      getData(interfaceData.value);
    }

    /**
     * @param {number} index 当前选中单位下标
     * @param {object} item 当前选中单位数据
     * @description 切换单位
     */
    function handleSwitchUnit(index: number, item: any) {
      if (activeUnitIndex.value !== index) {
        unitBreadcrumb.value.splice(unitBreadcrumb.value.length - 1 - index, 1);
        activeUnitIndex.value = unitBreadcrumb.value.length - 1 - index;
        functionalDescription.value = item.remark;
        const filterArr: Array<any> = getRelations({
          arr: interfaceData.value,
          relationKey: ['id', 'unitName'],
          findKey: 'id',
          findValue: item.id,
        });
        if (filterArr.length > 0) {
          if (filterArr[filterArr.length - 1].isFunctional) {
            functionalGroup.value = [filterArr[filterArr.length - 1]];
            unitGroup.value = functionalGroup.value[0].children;
            isFunctional.value = false;
            // 联系人
            getContactorList(filterArr[filterArr.length - 1]);
          } else {
            unitGroup.value = [filterArr[filterArr.length - 1]];
            isFunctional.value = false;
            // 联系人
            getContactorList(filterArr[filterArr.length - 1]);
          }
        }
      }
    }

    /**
     * @description 跳转到地图
     */
    function jumpToMap() {
      router.push({
        path: '/Map',
      });
    }

    /**
     * @param {number} type 1:指挥部；2:为功能组
     * @description 获取现场指挥部数据
     */
    function getStructTreeEvent(type: number) {
      const formData = new FormData();
      formData.append('type', String(type)); // 1:指挥部2:为功能组
      formData.append('eventId', String(eventId.value)); // 事件Id
      formData.append('deptOnly', ''); // 传空串表示 包括部门下的人，不为空表示人
      let requestData: any = ref({
        method: 'post',
        service: 'soc',
        url: `/eventconduct/eventSceneonductSign/getStructTreeEvent?apiVersion=0.0.2`,
        // url: `/eventconduct/eventSceneonductSign/getStructTreeEvent`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          if (res.code === 0) {
            if (type === 2) {
              if (res.data.struct) {
                interfaceData.value = res.data.struct;
                getData(interfaceData.value);
              } else {
                Toast({
                  message: '暂无数据',
                  icon: 'close'
                })
              }
            } else {
              leaderList.value = res.data.struct;
              if (res.data.struct.length > 0) {
                res.data.struct.forEach((el: any) => {
                  contactorList.value.push({
                    contactorId: el.contactorId, // id
                    sex: el.sex ? (el.sex === 0 ? '男' : '女') : '男', // 性别
                    picture: el.images, // 头像图片
                    name: el.name, // 姓名
                    position: el.dutyName, // 职务
                    unit: el.deptName, // 单位
                    title: el.remark, // 头衔
                  });
                });
              } else {
                Toast({
                  message: '暂无数据',
                  icon: 'close'
                })
              }
            }
          }
        })
        .catch((error: any) => {
          if (error.code) {
            Notify({
              type: 'danger',
              message: `获取现场指挥部失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    /**
     * @description 开启搜索
     */
    function handleStartSearch() {
      router.push({
        path: '/Search/headquarters',
      });
    }

    /**
     * @description 获取预案事件的经纬度等信息
     */
    function getEventSceneConduct() {
      let form = new FormData();
      form.append('eventId', String(eventId.value));
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
            if (!res.data) {
              return;
            }
            address.value = res.data.address;
            store.commit('reserve/setLocation', {
              address: res.data.address,
              latitude: res.data.cgcsLatitude || res.data.latitude,
              longitude: res.data.cgcsLongitude || res.data.longitude,
            });
          }
        })
        .catch((error: any) => {
          if (error.code) {
            Notify({
              type: 'danger',
              message: `获取经纬度信息失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    onMounted(() => {
      getStructTreeEvent(1); // 获取现场指挥部数据
      getStructTreeEvent(2); // 获取现场指挥部数据
      getEventSceneConduct();
    });
    return {
      navBarConfig,
      jumpToContactorInformation,
      handleSelectUnit,
      handleFunctionalGroup,
      unitBreadcrumb,
      handleSwitchUnit,
      jumpToMap,
      handleStartSearch,
      functionalGroup,
      unitGroup,
      contactorList,
      isFunctional,
      functionalDescription,
      activeUnitIndex,
      handleSwitchStruct,
      address,
      interfaceData,
    };
  },
});
</script>
<style lang="scss">
@import './assets/css/headquarters';
</style>
