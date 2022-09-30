<template>
  <div :class="`${returnNewClass('MapImportSection')}`">
    <div :class="`${returnNewClass('MapImportSection')}__opertion`">
      <ElButton
        :class="[`sv-button`, `${returnNewClass('MapImportSection')}__opertion__btn`]"
        type="primary"
        :disabled="isDisabled"
        @click="importMapFun"
      >
        导入地图
      </ElButton>
      <ElButton
        :class="[`sv-button`, `${returnNewClass('MapImportSection')}__opertion__btn`]"
        type="primary"
        @click="openPop"
      >
        导入图层
      </ElButton>
      <ElCheckboxGroup v-model="labelFlag">
        <ElCheckbox
          label="全部显示"
          :checked="isChecked"
          @change="showAllLayerFun"
        />
      </ElCheckboxGroup>
    </div>
    <div :class="`${returnNewClass('MapImportSection')}__content`">
      <OperationTree
        ref="OperationTreeRef"
        :showcheckbox="true"
        :is-show-father-edit-icon="false"
        :tree-data="treeData"
        :delete-type="'import'"
        :from="from"
        :select-ids="selectIds"
        @lookFun="lookFun"
        @deleteImport="deleteImport"
        @importMap="getImportMapData"
      />
    </div>
  </div>
  <ElDialog
    v-model="dialogVisible"
    :width="380"
    title="选择图层"
    :custom-class="[`sv-dialog`,from === 'commandBrain'?'sv-dialogMap':'']"
  >
    <div class="selectMapBox">
      <div class="selectMapBox__tabs">
        <div
          :class="['selectMapBox__tabs__item',{'selectMapBox__tabs__item--active':layerId===1}]"
          @click="changeLayerId(1)"
        >
          我的地图({{ myMapData.length }})
        </div>
        <div
          :class="['selectMapBox__tabs__item',{'selectMapBox__tabs__item--active':layerId===2}]"
          @click="changeLayerId(2)"
        >
          协作地图({{ coopMapData.length }})
        </div>
        <div
          :class="['selectMapBox__tabs__item',{'selectMapBox__tabs__item--active':layerId===3}]"
          @click="changeLayerId(3)"
        >
          我收到的地图({{ shareMapData.length }})
        </div>
      </div>
      <div class="selectMapBox__content">
        <div
          v-if="layerId===1"
          class="selectMapBox__content__top"
        >
          <el-checkbox-group v-model="checkList1">
            <el-checkbox
              v-for="(item,index) in myMapData"
              :key="index"
              :label="item.id"
            >
              {{ item.mapName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div
          v-if="layerId===2"
          class="selectMapBox__content__top"
        >
          <el-checkbox-group v-model="checkList2">
            <el-checkbox
              v-for="(item,index) in coopMapData"
              :key="index"
              :label="item.id"
            >
              {{ item.mapName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div
          v-if="layerId===3"
          class="selectMapBox__content__top"
        >
          <el-checkbox-group v-model="checkList3">
            <el-checkbox
              v-for="(item,index) in shareMapData"
              :key="index"
              :label="item.id"
            >
              {{ item.mapName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="selectMapBox__content__footer">
          <ElButton
            class="sv-button"
            type="primary"
            @click="importFun"
          >
            导入
          </ElButton>
          <ElButton
            class="sv-button"
            @click="dialogVisible=false"
          >
            取消
          </ElButton>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance, onMounted, watchEffect, nextTick, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import OperationTree from '@/product/Coplotting/module/MapPlotting/PlottingMapDetail/component/Operationtree.vue';
import { ElMessage } from 'element-plus';
import returnClass from '@/product/Coplotting/module/MapPlotting/script/useReturnClass';

export default defineComponent({
  components: {
    OperationTree, // 树形
  },
  props: {
    from: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const thisMapId:any = ref(0); // 当前的地图id
    console.log('当前的地图id是：');
    const store = useStore(); // 使用vuex
    const route = useRoute();
    // if (props.from === 'commandBrain') {
    //   thisMapId.value = store.state.coplotting.mapId;
    // } else {
    //   thisMapId.value = route.query.mapId;
    // }
    thisMapId.value = store.state.coplotting.mapId;
    console.log(thisMapId.value);
    const labelFlag = ref([]);
    const dialogVisible = ref(false);
    const layerId = ref(1);
    const checkList1 = ref([]); // 选中的数据
    const checkList2 = ref([]); // 选中的数据
    const checkList3 = ref([]); // 选中的数据
    const myMapData = ref([]); // 我的地图列表
    const shareMapData = ref([]); // 分享地图列表
    const coopMapData = ref([]); // 协作地图列表
    const treeData:any = ref([]); // 树数据
    const importData = ref([]); // 要导入地图的数据
    const isDisabled = ref(false); // 是否禁用按钮
     const isChecked = ref(true);
    function getImportMapData(Arr:any) {
      console.log(Arr);
      importData.value = Arr;
    }
    const { returnNewClass } = returnClass(props);
    watchEffect(() => {
      if (importData.value.length === 0) {
        isDisabled.value = true;
      } else {
        isDisabled.value = false;
      }
    });
    // 弹框tab页面切换
    function changeLayerId(index: number) {
      layerId.value = index;
      console.log(layerId);
    }
    // 打开导入地图弹窗，并请求数据
    function openPop() {
      dialogVisible.value = true;
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmap/getAllMap',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          mapId: thisMapId.value,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          myMapData.value = response.data.myMaps;
          shareMapData.value = response.data.fromShareMaps;
          coopMapData.value = response.data.cooperateMaps;
        } else {
          ElMessage.error(`获取地图数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取地图数据失败，错误信息：${error}`);
      });
    }
    // 导入方法
    function importFun() {
      const mapIds = [...checkList1.value, ...checkList2.value, ...checkList3.value];
      if (mapIds.length > 2) {
        ElMessage.warning('最多同时导入两条数据');
        return;
      }
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmap/importMap',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          aimMapId: thisMapId.value,
          mapIds,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          ElMessage.success({
            message: '导入成功',
            type: 'success',
          });
          dialogVisible.value = false;
          getTreeData();
        } else {
          ElMessage.error(`导入地图数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`导入地图数据失败，错误信息：${error}`);
      });
    }
    // 删除导入记录
    function deleteImport(id:number) {
      console.log(id);
      const ids = [id];
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistimportmaprecord/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: ids,
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          ElMessage.success({
            message: '删除成功',
            type: 'success',
          });
          getTreeData();
        } else {
          ElMessage.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除数据失败，错误信息：${error}`);
      });
    }
      // 递归返回最后一层已导入地图的图层的id
      const selectIds:any = ref([]);
      function returnTreeData(array: any) {
      array.forEach((item: any) => {
        if (item.children) {
          returnTreeData(item.children);
        } else if (!item.children) {
          // 获得符合的 node
          if (item.isImportedToAimMap === 1) {
            item.disabled = true;
            selectIds.value.push(item.id);
          }
        }
      });
    }
    // 获取列表树数据
    function getTreeData() {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/getMapImportRecords',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: thisMapId.value,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          selectIds.value = [];
          treeData.value = response.data;
          treeData.value = JSON.parse(
            JSON.stringify(treeData.value)
              .replace(/mapName/g, 'name')
              .replace(/mapGroupVoList/g, 'children')
              .replace(/groupName/g, 'name')
              .replace(/groupId/g, 'id')
              .replace(/markRecordVos/g, 'children')
              .replace(/markName/g, 'name')
              .replace(/markRecordId/g, 'id'),
          );
          returnTreeData(treeData.value);
          console.log(selectIds.value);
        } else {
          ElMessage.error(`获取数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取数据失败，错误信息：${error}`);
      });
    }

    // 导入地图到本地
    const importMapFun = () => {
      const ids:any = [];
      importData.value.forEach((item :any) => {
        ids.push(item.id);
      });
      const tempObj = { mapId: thisMapId.value, markRecordIds: ids };
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmap/importCooperateRecords',
        headers: {
          'Content-Type': 'application/json',
        },
        data: tempObj,
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          ElMessage.success({
            message: '导入成功',
            type: 'success',
          });
        } else {
          ElMessage.error(`导入失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`导入失败，错误信息：${error}`);
      });
    };
    // 全部显示或者全部隐藏当前地图的所有图层
    const OperationTreeRef:any = ref<null>(null);// 树形Ref
    const showAllLayerFun = (e:any) => {
      console.log(e);
      if (e) {
        OperationTreeRef.value.showAllLayerFun(true);
      } else {
        OperationTreeRef.value.showAllLayerFun(false);
      }
    };
    // 删除图层数据的时候刷新列表
    watch(() => store.state.coplotting.deleteId, (val, old) => {
      getTreeData();
    });
    // 添加图层数据的时候刷新列表
    watch(() => store.state.coplotting.saveId, (val, old) => {
      getTreeData();
    });
    onMounted(() => {
      getTreeData();
      nextTick(() => {
        setTimeout(() => {
          isChecked.value = true;
          showAllLayerFun(true);
        }, 1000);
      });
    });
    return {
      labelFlag,
      dialogVisible,
      layerId,
      changeLayerId,
      checkList1,
      checkList2,
      checkList3,
      openPop, // 打开导入地图弹窗，并请求数据
      myMapData,
      shareMapData,
      coopMapData,
      importFun,
      treeData,
      deleteImport,
      importData, // 从子组件中获取的导入地图的数据
      importMapFun, // 导入地图方法
      getImportMapData, // 从子组件中获取的导入地图的数据方法
      isDisabled,
      returnNewClass,
      OperationTreeRef,
      showAllLayerFun,
      isChecked,
      selectIds,
    };
  },
});
</script>

<style lang="scss">
.MapImportSection {
  &__opertion {
    display: flex;
    align-items: center;
    height: 42px;
    &__btn {
      margin-left: 10px;
      margin-right: 0;
    }
    .el-checkbox-group {
    font-size: 0;
    margin-left: 100px;
}
  }
  &__content {
  }
}
.selectMapBox {
  width: 100%;
  height: 251px;
  overflow: auto;
  &__tabs {
    width: 100%;
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-evenly;
    border-bottom: 1px solid #f5f5f5;
    &__item {
      color: rgba(51, 51, 51, 0.31);
      height: 100%;
      line-height: 40px;
      cursor: pointer;
    }
    &__item--active {
      color: #333333;
      font-weight: 500;
      border-bottom: 2px solid #0091ff;
    }
  }
  &__content {
    &__top {
      height: 154px;
      overflow: auto;
      border-bottom: 1px solid #f5f5f5;

      .el-checkbox-group {
        width: 82%;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        > label {
          margin-top: 11px;
        }
      }
      &::-webkit-scrollbar {
        background: transparent;
        width: 5px;
        height: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d5d5d5;
        border-radius: 5px;
      }
    }
    &__footer {
      height: 55px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 15px;
    }
  }
}

// 指挥大脑样式
.MapImportSectionc {
  &__opertion {
    display: flex;
    align-items: center;
    height: 42px;
    &__btn {
      background: 0;
      border: 0;
      color: rgba(86, 233, 255, 1);
      &:hover {
        background: 0;
        color: rgba(86, 233, 255, 1);
      }
    }
    .el-button--primary:focus {
      background: 0;
      color: rgba(86, 233, 255, 1);
    }
    .el-button--primary.is-disabled {
      background: 0;
      color: rgba(86, 233, 255, 0.8);
    }
    .el-checkbox {
      color: rgba(86, 233, 255, 0.8);
      .el-checkbox__inner {
        background: 0;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: rgba(86, 233, 255, 1);
      }
      .el-checkbox__input.is-checked .el-checkbox__inner {
        border-color: #fff;
      }
    }
  }
  &__content {
    .sv-tree {
      color: #ffffff;
      background: 0;
      width: 360px;
      margin: 0 auto;
      .el-tree-node__children{
        .el-tree-node {
          margin: 10px 0;
          background: rgba(0, 193, 222, 0.15);
        }
      }
      .el-tree-node__content{
        background: rgba(0, 193, 222, 0.15);
      }
      .is-current {
        // margin-bottom: 10px;
      }
      .el-tree-node:focus > .el-tree-node__content {
        background: rgba(0, 193, 222, 0.7);
      }
      .el-tree-node:focus > .el-tree-node__children {
      }
      .el-tree-node__content {
      }
      .el-tree-node.is-expanded > .el-tree-node__children {
      }
      .el-tree-node__content:hover {
        background: rgba(0, 193, 222, 0.15);
      }
      .el-tree-node__content > .el-tree-node__expand-icon {
        width: 6px;
        height: 6px;
        position: relative;
        flex-shrink: 0;
        &::before {
          content: "";
          display: block;
          width: 7px;
          height: 1px;
          position: absolute;
          left: 6px;
          top: 10px;
          background: #c0c0c0;
          transform: rotate(-45deg);
        }
        &::after {
          content: "";
          display: block;
          width: 7px;
          height: 1px;
          position: absolute;
          left: 6px;
          top: 6px;
          background: #c0c0c0;
          transform: rotate(45deg);
        }
      }
      .el-tree-node__expand-icon.is-leaf {
        color: transparent;
        cursor: default;
        display: none;
      }
    }
  }
}
.selectMapBoxc {
  width: 100%;
  height: 251px;
  overflow: auto;
  &__tabs {
    width: 100%;
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-evenly;
    border-bottom: 1px solid #f5f5f5;
    &__item {
      color: rgba(51, 51, 51, 0.31);
      height: 100%;
      line-height: 40px;
      cursor: pointer;
    }
    &__item--active {
      color: #333333;
      font-weight: 500;
      border-bottom: 2px solid #0091ff;
    }
  }
  &__content {
    &__top {
      height: 154px;
      overflow: auto;
      border-bottom: 1px solid #f5f5f5;
      .el-checkbox-group {
        width: 82%;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        > label {
          margin-top: 11px;
        }
      }
      &::-webkit-scrollbar {
        background: transparent;
        width: 5px;
        height: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d5d5d5;
        border-radius: 5px;
      }
    }
    &__footer {
      height: 55px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 15px;
    }
  }
}
.sv-dialogMap {
  width: 410px;
  height: 362px;
  background: rgba(20, 29, 31, 0.94);
  border: 1px solid #00c1de;
  .el-dialog__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    .el-dialog__title {
      color: #fff;
    }
  }
  .el-dialog__body {
    padding: 0;
    height: 305px;
    .selectMapBox {
      width: 100%;
      height: 305px;
      overflow: hidden;
      .selectMapBox__tabs {
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      }
      .selectMapBox__tabs__item {
        color: #fff;
        border-bottom: 2px solid rgba(86, 233, 255, 0);
      }
      .selectMapBox__tabs__item--active {
        color: rgba(86, 233, 255, 1);
        border-bottom: 2px solid rgba(86, 233, 255, 1);
      }
      .selectMapBox__content {
        height: 200px;
      }
    }
    .selectMapBox__content__top {
      height: 214px;
      border: 0;
      .el-checkbox {
        color: #fff;
        .el-checkbox__inner {
          background: 0;
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #fff;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          border: 1px solid #fff;
        }
      }
    }
    .selectMapBox__content__footer {
      height: 50px;
      display: flex;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      .el-button {
        background: 0;
        width: 65px;
        height: 32px;
        border: 1px solid rgba(255, 255, 255, 0.45);
        color: #fff;
        padding: 0;
        border-radius: 0;
        min-height: 32px;
        &:nth-child(1) {
          background: #00c1de;
        }
        &:nth-child(2) {
        }
      }
    }
  }
}
</style>
