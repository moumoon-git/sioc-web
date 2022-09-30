//协作
<template>
  <div :class="`${returnNewClass('MapCoopSection')}`">
    <div :class="`${returnNewClass('MapCoopSection')}__opertion`">
      <ElButton
        :class="[`sv-button`, `${returnNewClass('MapCoopSection')}__opertion__btn`]"
        type="primary"
        :disabled="isDisabled"
        @click="importMapFun"
      >
        导入地图
      </ElButton>
      <ElCheckboxGroup v-model="labelFlag">
        <ElCheckbox
          label="全部显示"
          :checked="isChecked"
          @change="showAllLayerFun"
        />
        <ElCheckbox
          label="动态跟踪"
          :checked="isDynamic"
          @change="startDynamicFun"
        />
      </ElCheckboxGroup>
    </div>
    <div :class="`${returnNewClass('MapCoopSection')}__content`">
      <OperationTree
        ref="OperationTreeRef"
        :showcheckbox="true"
        :is-show-father-edit-icon="false"
        :tree-data="coopData"
        :delete-type="'coop'"
        :from="from"
        @importMap="getImportMapData"
        @lookFun="lookFun"
        @deletePlatForm="deletePlatForm"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance, onMounted, watch, watchEffect, nextTick,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import OperationTree from '@/product/Coplotting/module/MapPlotting/PlottingMapDetail/component/Operationtree.vue';
import { ElMessage } from 'element-plus';
import { truncate } from 'fs';
import { setTimeout } from 'timers';
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
    const coopData:any = ref([]); // 协作数据
    const importData = ref([]); // 要导入地图的数据
    const isDisabled = ref(false); // 是否禁用按钮
    function getImportMapData(Arr:any) {
      console.log(Arr);
      importData.value = Arr;
    }
    watchEffect(() => {
      if (importData.value.length === 0) {
        isDisabled.value = true;
      } else {
        isDisabled.value = false;
      }
    });
    const { returnNewClass } = returnClass(props);
    // 根据地图id获取协作列表数据
    const getCoopData = (id:number) => {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/getCooperateMarkRecord',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: id,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          coopData.value = response?.data || [];
          coopData.value = JSON.parse(
            JSON.stringify(coopData.value)
              .replace(/platformName/g, 'name')
              .replace(/mapGroupVoList/g, 'children')
              .replace(/groupName/g, 'name')
              .replace(/groupId/g, 'id')
              .replace(/markName/g, 'name')
              .replace(/platformId/g, 'id')
              .replace(/markRecordId/g, 'id')
              .replace(/markRecordVos/g, 'children'),
          );
          store.commit('coplotting/SET_REFRASHCOOP', false);
        } else {
          ElMessage.error(`获取协作数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取协作数据失败，错误信息：${error}`);
      });
      store.commit('coplotting/SET_REFRASHGROUP', true);
    };
    // 导入地图
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
    // 删除协作平台
    // id :平台id
    const deletePlatForm = (id:number) => {
      const tempIndex = coopData.value.findIndex((item:any) => {
        item.id = id;
      });
      coopData.value.splice(tempIndex, 1);
    };
    const OperationTreeRef:any = ref<null>(null);// 树形Ref
    // 全部显示或者全部隐藏当前地图的所有图层
    const showAllLayerFun = (e:any) => {
      console.log(e);
      if (e) {
        OperationTreeRef.value.showAllLayerFun(true);
      } else {
        OperationTreeRef.value.showAllLayerFun(false);
      }
    };
    const isChecked = ref(true);
    /**
    * @desc 开启关闭动态跟踪
    * @param {} params
    * @returns {} returns
    */
   const isDynamic = ref(true); // 默认选中动态跟踪
   const startDynamicFun = (e:any) => {
    console.log(e);
    store.commit('coplotting/SET_ISDYNAMIC', e);
   };
    // 监听刷新邀请协作列表
    watch(() => store.state.coplotting.isRefrashCoop, (val, old) => {
      if (val) {
        getCoopData(thisMapId.value); // 默认加载全部标注列表
        nextTick(() => {
                setTimeout(() => {
                  isChecked.value = true;
                  showAllLayerFun(true);
                }, 1000);
              });
      }
    });
    // 删除图层数据的时候刷新列表
    watch(() => store.state.coplotting.deleteId, (val, old) => {
      getCoopData(thisMapId.value); // 默认加载全部标注列表
    });
    // 添加图层数据的时候刷新列表
    watch(() => store.state.coplotting.saveId, (val, old) => {
      getCoopData(thisMapId.value); // 默认加载全部标注列表
    });
    onMounted(() => {
      getCoopData(thisMapId.value); // 默认加载全部标注列表
      nextTick(() => {
        setTimeout(() => {
          isChecked.value = true;
          showAllLayerFun(true);
        }, 1000);
      });
    });
    return {
      labelFlag,
      coopData, // 协作树数据
      importMapFun, // 导入地图方法
      importData, // 从子组件中获取的导入地图的数据
      getImportMapData, // 从子组件中获取的导入地图的数据方法
      deletePlatForm, // 删除平台
      isDisabled,
      returnNewClass,
      OperationTreeRef,
      showAllLayerFun,
      isChecked,
      startDynamicFun,
      isDynamic,
    };
  },
});
</script>

<style lang="scss">
.MapCoopSection {
  &__opertion {
    display: flex;
    align-items: center;
    height: 42px;
    justify-content: space-around;
    &__btn {
      margin-left: 10px;
      margin-right: 36px;
    }
  }
  &__content {
  }
}
// 指挥大脑样式
.MapCoopSectionc {
  &__opertion {
    display: flex;
    align-items: center;
    height: 42px;
    justify-content: space-between;
    &__btn {
      margin-left: 10px;
      margin-right: 36px;
      background: 0;
    }
    .el-button--primary.is-disabled {
      background: 0;
      border: 0;
      color: #56e9ff;
    }
    .el-checkbox__inner {
      background: 0;
    }
    .el-checkbox-group {
      margin-right: 21px;
      .el-checkbox {
        color: rgba(255, 255, 255, 1);
      }
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #fff;
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
</style>
