<template>
  <div :class="$style.ResAllocation">
    <!-- 主视口 -->
    <div :class="$style.main">
      <!-- 左边的显示 -->
      <aside :class="$style.left">
        <!-- 类型选择和搜索框 -->
        <div :class="$style.leftSelect">
          <ElCascader
            ref="elCascader"
            v-model="selVal"
            :options="options"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'name',
            }"
            placeholder="全部"
            :show-all-levels="false"
            :popper-append-to-body="false"
            @change="handleChange"
          >
            <template #default="{ data }">
              <span>{{ data.name }}</span>
            </template>
          </ElCascader>
          <input
            type="请输入物资名称关键字搜索"
            v-model="searchVal"
            @keydown.enter="searchFun"
            @input="changeInpVal"
          />
        </div>
        <!-- 数据显示 -->
        <div :class="$style.tableList">
          <TableList
            @setMapCenters="setMapCenters"
            @addMaterial="addMaterial"
            @scroll="tableListScroll"
            :list-data="listData"
          />
        </div>
      </aside>
      <!-- 右边的显示 -->
      <aside :class="$style.right">
        <!-- 标题 -->
        <div>已选物资</div>
        <!-- 数据列表 -->
        <div>
          <HandleMaterial
            @setMapCenters="setMapCenters"
            @changeHouseArr="changeHouseArr"
            :list-data="selectedMaterialsArr"
          />
        </div>
      </aside>
    </div>
    <!-- 页脚按钮 -->
    <div :class="$style.footer">
      <button @click="handleClose">取消</button>
      <button @click="material">确定</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, onMounted } from 'vue';
import { ElCascader } from 'element-plus';
// 列表展示
import TableList from './components/TableList.vue';
import HandleMaterial from './components/HandleMaterial.vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';

export default defineComponent({
  components: {
    // 列表展示
    TableList,
    // 操作物资数量
    HandleMaterial,
  },
  inject: ['$addDialog'],
  props: {
    // 弹窗操作
    operation: {
      type: Object,
      default: () => ({}),
    },
    // 回显显示
    selectedMaterialsData: {
      type: Array,
      default: () => [],
    },
    // 物资调拨和装备调拨的类型
    typeJudgment: {
      type: String,
      default: 'material', // material 为物资调拨, equipment 装备调拨
    },
  },
  setup(props, contxt) {
    const store = useStore();
    // 获取全局参数
    const { $http } = useGlobal();
    // ElCascader 引用
    const elCascader = ref<typeof ElCascader | null>(null);
    const executionTimeIndex = ref<any>(0);
    // 搜索时的分页
    const searchPage = ref<any>(1);
    // 总数
    const totalCount = ref<any>(0);
    // 连级选择器
    const selVal = ref<any>([]);
    const options = ref<any>([]);
    // 输入框值
    const searchVal = ref<any>('');
    // 已选物资存储对象
    const selectedMaterials = ref<any>({});
    const selectedMaterialsArr = ref<any>([]);
    // 列表的数据
    const listData = ref<any>([]);
    // 添加物资
    function addMaterial(params: any) {
      if (!params.amount && params.number) {
        params.amount = params.number;
      }
      if (params?.storehouseId) {
        params.value = params?.amount > 1 ? 1 : 1;
        if (selectedMaterials.value[params?.storehouseId]) {
          // articleTypeId
          const arr = selectedMaterials.value[
            params?.storehouseId
          ].wareHouseList.filter((x: any) => x.id === params.id);
          if (arr.length === 0) {
            selectedMaterials.value[params?.storehouseId].wareHouseList.push(
              params,
            );
          }
        } else {
          selectedMaterials.value[params?.storehouseId] = {
            wareHouse: params,
            wareHouseList: [params],
          };
        }
        selectedMaterialsArr.value = [];
        for (const key in selectedMaterials.value) {
          selectedMaterialsArr.value.push(selectedMaterials.value[key]);
        }
      }
    }
    // 设置地图中心点
    function setMapCenters(params: any) {
      // 隐藏弹窗
      if (props.operation.hide) {
        props.operation.hide();
      }
    }
    // 已选物资的数据进行改变时
    function changeHouseArr(params: any) {
      selectedMaterials.value = {};
      params.forEach((ele: any) => {
        selectedMaterials.value[ele.wareHouse.storehouseId] = ele;
      });
      selectedMaterialsArr.value = params;
    }
    // 确定
    function material() {
      store.commit(
        'resAllocation/SET_resAllocationData',
        selectedMaterialsArr.value,
      );
      if (props.operation.close) {
        props.operation.close();
      }
    }
    // 取消
    function handleClose() {
      if (props.operation.close) {
        props.operation.close();
      }
    }
    // 获取资源类型数据
    function getTypeData() {
      const request = {
        method: 'get',
        service: 'soc',
        url: '/resoure/resourearticletype/businessType/tree',
        headers: { 'Content-Type': 'application/json' },
        params: {
          apiVersion: '0.0.2',
        },
      } as const;
      $http(request).then((response: any) => {
        if (response?.code === 0 && response.data) {
          options.value = response.data;
        }
      });
    }

    // 获取装备类型
    function getEquipmentType() {
      const request = {
        method: 'get',
        service: 'soc',
        url: '/resoure/resoureequipmentgroup/list',
        headers: { 'Content-Type': 'application/json' },
        params: {},
      } as const;
      $http(request).then((response: any) => {
        if (response?.code === 0 && response.data) {
          options.value = response.data;
        }
      });
    }

    function handleChange(value: any) {
      // console.log(value);
    }

    // 搜索
    function searchFun() {
      const promise = new Promise((resolve, reject) => {
        const typeId = selVal.value[selVal.value.length - 1];
        const eventObj = store.state.event;
        const resoureType = props.typeJudgment === 'material' ? 105 : 111;
        const request = {
          method: 'post',
          service: 'soc',
          url: '/resource/allocation/searchResource',
          headers: { 'Content-Type': 'application/json' },
          data: {
            currentPage: searchPage.value, // 当前页
            keywords: searchVal.value, // 搜索关键字
            pageSize: 30, // 每页数量
            resoureType, // 资源类型，105物资，111装备
            longitude: eventObj.longitude, // 事件经度
            latitude: eventObj.latitude, // 事件维度
            typeId, // 资源类型id
          },
        } as const;
        $http(request).then((response: any) => {
          if (response?.code === 0 && response.data) {
            totalCount.value = response.data?.totalCount;
            if (searchPage.value === 1) {
              listData.value = response.data.list;
            }
            resolve(response.data.list);
          }
        });
      });
      return promise;
    }

    // 数据列表滚动时
    function tableListScroll() {
      // 代表正在进行的是搜索的接口查询
      if (Math.ceil(totalCount.value / 30) > searchPage.value) {
        searchPage.value += 1;
        searchFun().then((res: any) => {
          listData.value = listData.value.concat(res);
        });
      }
    }
    // 输入框的值发生修改
    function changeInpVal() {
      searchPage.value = 1;
    }

    onMounted(() => {
      changeHouseArr(props.selectedMaterialsData);
      // 获取类型
      if (props.typeJudgment === 'material') {
        getTypeData();
      } else if (props.typeJudgment === 'equipment') {
        getEquipmentType();
      }
      searchFun();
    });
    return {
      elCascader,
      executionTimeIndex,
      // 已选物资列表
      selectedMaterialsArr,
      addMaterial,
      setMapCenters,
      changeHouseArr,
      // 确定
      material,
      // 取消
      handleClose,
      selVal,
      options,
      handleChange,
      searchVal,
      searchFun,
      // 数据列表滚动时
      tableListScroll,
      // 列表的数据
      listData,
      // 值发生修改
      changeInpVal,
    };
  },
});
</script>

<style lang="scss" module>
.ResAllocation {
  width: 1147px;
  height: 817px;
}
.main {
  height: 762px;
  width: 100%;
  display: flex;
}
.left {
  width: 791px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
}
.right {
  flex: 1;
  & > div {
    &:first-child {
      color: #ffffff;
      height: 48px;
      background: linear-gradient(
        90deg,
        rgba(20, 98, 140, 0.59) 0%,
        rgba(14, 69, 100, 0.49) 100%
      );
      line-height: 48px;
      padding-left: 16px;
      font-size: 14px;
    }
    &:last-child {
      height: calc(100% - 48px);
      overflow: auto;
      & > div {
        margin: auto;
      }
      &::-webkit-scrollbar {
        width: 3px;
        height: 5px;
        /* background-color: rgba(100, 104, 105, 1); */
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
  }
}
.footer {
  height: 54px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  box-sizing: border-box;
  & > button {
    width: 65px;
    height: 32px;
    font-size: 14px;
    font-weight: 400;
    background: transparent;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    &:first-child {
      color: rgba(255, 255, 255, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.45);
      margin-right: 10px;
    }
    &:last-child {
      border: none;
      background: #00c1de;
      color: #ffffff;
    }
  }
}
.leftSelect {
  display: flex;
  align-items: center;
  padding: 16px 22px;
  & > div {
    width: 161px;
    height: 38px !important;
    background: rgba(41, 47, 48, 0.77);
    margin-right: 16px;
    border: none;
    & input {
      background: transparent;
      border: none;
      color: #fff;
    }
  }
  & > input {
    width: 572px;
    height: 38px;
    background: rgba(41, 47, 48, 0.77);
    outline: none;
    box-sizing: border-box;
    border: none;
    padding-left: 33px;
    color: #ffffff;
    font-size: 14px;
  }
  :global(.el-cascader__dropdown) {
    background: transparent !important;
    border: none !important;
  }
  :global(.el-cascader-node) {
    background: transparent !important;
  }
  :global(.el-popper__arrow) {
    &::before {
      display: none;
    }
  }
  :global(.el-cascader-menu) {
    background: rgba(5, 5, 5, 0.9);
    border: 1px solid #56e9ff;
  }
}
.tableList {
  width: 100%;
  flex: 1;
  max-height: 694px;
}
</style>
