<template>
  <div class="LayerData">
    <div class="LayerData-title-checked">
      <el-checkbox
        v-model="riskManagementBigChecked"
        :indeterminate="riskIsIndeterminate"
        @change="handleCheckAllChange"
      >
        风险管理
      </el-checkbox>
    </div>
    <!-- 下面的子类 -->
    <div class="LayerData-management">
      <el-checkbox-group v-model="riskManagementChecked">
        <el-checkbox
          v-for="(x, i) in riskManagementData"
          :key="i"
          :label="x.name"
          :value="x.id"
        />
      </el-checkbox-group>
    </div>
    <div class="LayerData-title-checked">
      <el-checkbox
        v-model="emergencyManagementBigChecked"
        :indeterminate="emergencyIsIndeterminate"
        @change="emergencyHandleCheckAllChange"
      >
        应急资源
      </el-checkbox>
    </div>
    <div class="LayerData-management">
      <el-checkbox-group v-model="emergencyManagementChecked">
        <el-checkbox
          v-for="(x, i) in emergencyManagementData"
          :key="i"
          :label="x.name"
          :value="x.id"
        />
      </el-checkbox-group>
    </div>
    <!-- <div class="LayerData-management">

    </div> -->
    <div class="LayerData-title-checked">
      <el-checkbox
        v-model="deviceManagementBigChecked"
        :indeterminate="deviceIsIndeterminate"
        @change="deviceHandleCheckAllChange"
      >
        终端设备
      </el-checkbox>
    </div>
    <div class="LayerData-management">
      <el-checkbox-group v-model="deviceManagementChecked">
        <el-checkbox
          v-for="(x, i) in deviceManagementData"
          :key="i"
          :label="x.name"
          :value="x.id"
        />
      </el-checkbox-group>
    </div>

    <div class="LayerData-title-checked">
      <el-checkbox
        v-model="personnelManagementBigChecked"
        :indeterminate="personnelIsIndeterminate"
        @change="personnelHandleCheckAllChange"
      >
        现场人员
      </el-checkbox>
    </div>
    <div class="LayerData-management">
      <el-checkbox-group v-model="personnelManagementChecked">
        <el-checkbox
          v-for="(x, i) in personnelManagementData"
          :key="i"
          :label="x.name"
          :value="x.id"
        />
      </el-checkbox-group>
    </div>

    <div class="LayerData-title-checked">
      <el-checkbox
        v-model="teamManagementBigChecked"
        :indeterminate="teamIsIndeterminate"
        @change="teamHandleCheckAllChange"
      >
        应急队伍
      </el-checkbox>
    </div>
    <div class="LayerData-management">
      <el-checkbox-group v-model="teamManagementChecked">
        <el-checkbox
          v-for="(x, i) in teamManagementData"
          :key="i"
          :label="x.name"
          :value="x.id"
        />
      </el-checkbox-group>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  onMounted,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import LayerData from './script/LayerData';

export default defineComponent({
  setup(props, context) {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const store = useStore(); // 使用vuex
    // 风险管理
    const riskIsIndeterminate = ref(false);
    const riskManagementBigChecked = ref(false);
    const riskManagementChecked = ref<any>([]);
    const riskManagementData = ref([
      {
        name: '防护目标',
        id: 0,
      },
      {
        name: '风险隐患',
        id: 1,
      },
    ]);
    // 应急物资
    const emergencyIsIndeterminate = ref(false);
    const emergencyManagementBigChecked = ref(false);
    const emergencyManagementChecked = ref<any>([]);
    const emergencyManagementData = ref([
      {
        name: '避难场所',
        id: 0,
      },
      {
        name: '应急物资库',
        id: 1,
      },
    ]);
    // 终端设备
    const deviceIsIndeterminate = ref(false);
    const deviceManagementBigChecked = ref(false);
    const deviceManagementChecked = ref<any>([]);
    const deviceManagementData = ref([
      {
        name: '监控视频',
        id: 0,
      },
      {
        name: '会场终端',
        id: 1,
      },
      {
        name: '集群终端',
        id: 2,
      },
      {
        name: 'wecomm',
        id: 3,
      },
    ]);
    // 现场人员
    const personnelIsIndeterminate = ref(false);
    const personnelManagementBigChecked = ref(false);
    const personnelManagementChecked = ref<any>([]);
    const personnelManagementData = ref([
      {
        name: '现场人员',
        id: 0,
      },
    ]);
    // 应急队伍
    const teamIsIndeterminate = ref(false);
    const teamManagementBigChecked = ref(false);
    const teamManagementChecked = ref<any>([]);
    const teamManagementData = ref([
      {
        name: '应急队伍',
        id: 0,
      },
    ]);
    // 字段表
    const fieldTable = ref<any>({
      风险隐患: {
        key: 'risk',
        src: '',
      },
      防护目标: {
        key: 'protect',
        src: '',
      },
      应急物资库: {
        key: 'material',
        src: '',
      },
      避难场所: {
        key: 'refuge',
        src: '',
      },
      监控视频: {
        key: 'camera',
        src: '',
      },
      会场终端: {
        key: 'device',
        src: '',
      },
      集群终端: {
        key: 'colony',
        src: '',
      },
      wecomm: {
        key: 'wecomm',
        src: '',
      },
      现场人员: {
        key: 'personnel',
        src: '',
      },
      应急队伍: {
        key: 'team',
        src: '',
      },
    });
    // 选择之后的数据
    const allData = ref<any>([]);
    const riskCheckData = ['防护目标', '风险隐患'];
    const emergencyCheckData = ['避难场所', '应急物资库'];
    const deviceCheckData = ['监控视频', '会场终端', '集群终端', 'wecomm'];
    const personnelCheckData = ['现场人员'];
    const teamCheckData = ['应急队伍'];
    const { apiGetDataObj } = LayerData();

    function handleCheckAllChange(val: any) {
      riskManagementChecked.value = val ? riskCheckData : [];
      riskIsIndeterminate.value = false;
    }
    function emergencyHandleCheckAllChange(val: any) {
      emergencyManagementChecked.value = val ? emergencyCheckData : [];
      emergencyIsIndeterminate.value = false;
    }
    function deviceHandleCheckAllChange(val: any) {
      deviceManagementChecked.value = val ? deviceCheckData : [];
      deviceIsIndeterminate.value = false;
    }
    function personnelHandleCheckAllChange(val: any) {
      personnelManagementChecked.value = val ? personnelCheckData : [];
      personnelIsIndeterminate.value = false;
    }
    function teamHandleCheckAllChange(val: any) {
      teamManagementChecked.value = val ? teamCheckData : [];
      teamIsIndeterminate.value = false;
    }
    // 整合数据
    function handleData(data: any) {
      let promise = new Promise((resolve, reject) => {
        data.value.forEach((x: any) => {
          const typeData = fieldTable.value[x];
          const data = apiGetDataObj.value[typeData.key];
          const obj = {
            src: '',
            key: typeData.key,
            data,
          };
          allData.value.push(obj);
        });
        resolve(allData);
      });
      return promise;
    }
    // 传递数据
    function integrationData() {
      allData.value = [];
      Promise.all([
        handleData(riskManagementChecked),
        handleData(emergencyManagementChecked),
        handleData(deviceManagementChecked),
        handleData(personnelManagementChecked),
        handleData(teamManagementChecked),
      ]).then(() => {
        console.log(allData.value);
        context.emit('sendMsg', allData.value);
        const retrievalSelectType = allData.value.reduce((pre: any, e: any) => {
          let obj = {
            src: e.src,
            typeKey: e.key,
          };
          pre.push(obj);
          return pre;
        }, []);
        store.commit('retrieval/SET_retrievalSelectType', retrievalSelectType);
      });
    }
    // 风险管理单个选择
    watch(riskManagementChecked, (newV) => {
      if (newV.length !== riskManagementData.value.length) {
        riskManagementBigChecked.value = false;
      } else {
        riskManagementBigChecked.value = true;
      }
      integrationData();
    });
    // 应急物资
    watch(emergencyManagementChecked, (newV) => {
      if (newV.length !== emergencyManagementData.value.length) {
        emergencyManagementBigChecked.value = false;
      } else {
        emergencyManagementBigChecked.value = true;
      }
      integrationData();
    });
    // 终端设备
    watch(deviceManagementChecked, (newV) => {
      if (newV.length !== deviceManagementData.value.length) {
        deviceManagementBigChecked.value = false;
      } else {
        deviceManagementBigChecked.value = true;
      }
      newV.forEach((x: any) => {
        if (x === '监控视频') {
          getListByTypeAndViewportData(0);
        } else if (x === '会场终端') {
          getListByTypeAndViewportData(1);
        } else if (x === '集群终端') {
          getListByTypeAndViewportData(2);
        } else if (x === 'wecomm') {
          getListByTypeAndViewportData(3);
        }
      });
      integrationData();
    });
    // 现场人员
    watch(personnelManagementChecked, (newV) => {
      if (newV.length !== personnelManagementData.value.length) {
        personnelManagementBigChecked.value = false;
      } else {
        personnelManagementBigChecked.value = true;
      }
      integrationData();
    });
    // 应急队伍
    watch(teamManagementChecked, (newV) => {
      if (newV.length !== teamManagementData.value.length) {
        teamManagementBigChecked.value = false;
      } else {
        teamManagementBigChecked.value = true;
      }
      integrationData();
    });

    watch(
      () => store.state.event?.id,
      (newV) => {
        integrationData();
      },
    );

    // 全选
    function checkedAll() {
      riskManagementChecked.value = riskCheckData;
      emergencyManagementChecked.value = emergencyCheckData;
      deviceManagementChecked.value = deviceCheckData;
      personnelManagementChecked.value = personnelCheckData;
      teamManagementChecked.value = teamCheckData;
    }
    // 反选方法
    function antiFun(dataArr: any, diffArr: any) {
      let arr = [...dataArr].filter((x) => [...diffArr].every((y) => y !== x));
      return arr;
    }
    // 反选
    function antiCheck() {
      riskManagementChecked.value = antiFun(
        riskCheckData,
        riskManagementChecked.value,
      );
      emergencyManagementChecked.value = antiFun(
        emergencyCheckData,
        emergencyManagementChecked.value,
      );
      deviceManagementChecked.value = antiFun(
        deviceCheckData,
        deviceManagementChecked.value,
      );
      personnelManagementChecked.value = antiFun(
        personnelCheckData,
        personnelManagementChecked.value,
      );
      teamManagementChecked.value = antiFun(
        teamCheckData,
        teamManagementChecked.value,
      );
    }
    onMounted(() => {
      init();
      setTimeout(() => {
        Promise.all([
          getListByTypeAndViewportData(0),
          getListByTypeAndViewportData(1),
          getListByTypeAndViewportData(2),
          getListByTypeAndViewportData(3),
        ]).then(() => {
          // console.log('全选');
          checkedAll();
        });
      }, 500);
    });

    watch(
      () => store.state.event,
      (newV) => {
        init();
        setTimeout(() => {
          Promise.all([
            getListByTypeAndViewportData(0),
            getListByTypeAndViewportData(1),
            getListByTypeAndViewportData(2),
            getListByTypeAndViewportData(3),
          ]).then(() => {
            // console.log('全选');
            checkedAll();
          });
        }, 500);
      },
    );
    return {
      // 风险管理
      riskIsIndeterminate,
      riskManagementBigChecked,
      riskManagementChecked,
      riskManagementData,
      // 应急物资
      emergencyIsIndeterminate,
      emergencyManagementBigChecked,
      emergencyManagementChecked,
      emergencyManagementData,
      // 终端设备
      deviceIsIndeterminate,
      deviceManagementBigChecked,
      deviceManagementChecked,
      deviceManagementData,
      // 人员
      personnelManagementBigChecked,
      personnelIsIndeterminate,
      personnelManagementChecked,
      personnelManagementData,
      // 应急队伍
      teamManagementBigChecked,
      teamIsIndeterminate,
      teamManagementChecked,
      teamManagementData,

      handleCheckAllChange,
      emergencyHandleCheckAllChange,
      deviceHandleCheckAllChange,
      personnelHandleCheckAllChange,
      teamHandleCheckAllChange,
      // 全选
      checkedAll,
      // 反选
      antiCheck,
    };
  },
  data() {
    return {
      checked: [],
    };
  },
});
</script>

<style lang="scss">
.LayerData {
  flex: 1;
  width: 100%;
  height: calc(100% - 230px);
  padding-right: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  &-title-checked {
    margin-top: 10px;
    .el-checkbox__label {
      font-size: 16px;
      font-weight: 500;
      color: #56e9ff !important;
      padding-left: 6px;
    }
    .el-checkbox__inner {
      &::after {
        height: 9px;
        left: 3px;
        top: 0px;
        width: 5px;
        border-color: rgba(14, 23, 24, 0.8);
      }
    }
    .el-checkbox__inner {
      background: transparent;
      border-color: #56e9ff;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #56e9ff;
      border-color: #409eff;
    }
  }
  &-management {
    align-items: center;
    display: flex;
    margin-top: 5px;
    ul {
      flex: 1;
      display: flex;
      li {
        flex: 1;
        max-width: 114px;
      }
    }
    & > div {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 16px;
        z-index: 99;
      }
      & > label {
        &:first-child::before,
        &:nth-child(4)::before {
          content: '';
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url('./assets/arrow.png') no-repeat;
          background-size: 100% 100%;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #fff;
      border-color: #fff;
    }
    .el-checkbox__inner::after {
      height: 9px;
      left: 3px;
      top: 0px;
      width: 5px;
      border-color: rgba(14, 23, 24, 0.8);
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
    }
    .el-checkbox__label {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
    }
    .el-checkbox__inner {
      background: transparent;
      border: 1px solid #a6adb4;
    }
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border: 1px solid #a6adb4;
    }
  }
  &::-webkit-scrollbar {
    width: 3px;
    height: 5px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
    background-color: #56e9ff;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
    border-radius: 10px;
    background-color: #646869;
  }
}
</style>
