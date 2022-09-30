<template>
  <div :class="`${returnNewClass('MapClassSection')}`">
    <div :class="`${returnNewClass('MapClassSection')}__opertion`">
      <ElCheckbox label="显示文字" class="classShowText" v-model="isShowText" @change="showText"/>
      <ElCheckboxGroup v-model="labelFlag">
        <ElCheckbox
          label="全部显示"
          :checked="isChecked"
          @change="showAllLayerFun"
        />
      </ElCheckboxGroup>
    </div>
    <div :class="`${returnNewClass('MapClassSection')}__content`">
      <OperationTree
        ref="OperationTreeRef"
        :showcheckbox="false"
        :is-show-child-icon="false"
        :is-show-father-icon="true"
        :from="from"
        :delete-type="'class'"
        :is-show-father-edit-icon="false"
        :is-show-father-delete-icon="false"
        :tree-data="classData"
        @lookFun="lookFun"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance, onMounted, nextTick, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import OperationTree from '@/product/Coplotting/module/MapPlotting/PlottingMapDetail/component/Operationtree.vue';
import { ElMessage } from 'element-plus';
import returnClass from '@/product/Coplotting/module/MapPlotting/script/useReturnClass';

export default defineComponent({
  components: {
    OperationTree, // 树形组件
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
    const isShowText = ref(true); // 是否显示文字
    const classData:any = ref([]); // 分类数据
    function lookFun() {
      // alert('父组件的方法被调用了')
    }
    const { returnNewClass } = returnClass(props);
    // 根据地图id获取分类树形数据
    const getClassData = (id:number) => {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistmapclass/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: id,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          classData.value = response?.data || [];
          classData.value = JSON.parse(
            JSON.stringify(classData.value)
              .replace(/basicClassType/g, 'markType')
              .replace(/className/g, 'name')
              .replace(/records/g, 'children')
              .replace(/markName/g, 'name'),
          );
        } else {
          ElMessage.error(`获取分类数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取分类数据失败，错误信息：${error}`);
      });
    };
    const OperationTreeRef:any = ref<null>(null);// 树形Ref
    // 全部显示或者全部隐藏当前地图的所有图层
    const showAllLayerFun = (e:any) => {
      OperationTreeRef.value.showAllLayerFun(e);
    };
      /**
    * @desc  显示隐藏文字
    * @param {} params
    * @returns {} returns
    */
  const showText = () =>{
    window.map.setCoverTextVis(isShowText.value);
  }
    // 删除图层数据的时候刷新列表
    watch(() => store.state.coplotting.deleteId, (val, old) => {
      getClassData(thisMapId.value); // 默认加载列表
    });
    // 添加图层数据的时候刷新列表
    watch(() => store.state.coplotting.saveId, (val, old) => {
      getClassData(thisMapId.value); // 默认加载列表
    });
    const isChecked = ref(true);
    onMounted(() => {
      getClassData(thisMapId.value); // 默认加载列表
      nextTick(() => {
        setTimeout(() => {
          isChecked.value = true;
          showAllLayerFun(true);
        }, 1000);
      });
    });
    return {
      labelFlag,
      lookFun,
      classData, // 分组树形数据
      returnNewClass,
      OperationTreeRef,
      showAllLayerFun,
      isChecked,
      showText,
      isShowText,
    };
  },
});
</script>

<style lang="scss">
.MapClassSection {
  &__opertion {
    display: flex;
    align-items: center;
    height: 42px;
    justify-content: flex-end;
    margin-right: 10px;
    &__btn {
      margin-left: 10px;
      margin-right: 36px;
    }
  }
  &__content {
  }
}
// 指挥大脑样式
.MapClassSectionc {
  &__opertion {
    display: flex;
    align-items: center;
    height: 42px;
    justify-content: flex-end;
    margin-right: 10px;
    .el-checkbox-group{
      margin-right: 21px
    }
    .el-checkbox {
      color: #fff;
      .el-checkbox__inner {
        background: 0;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #fff;
      }
    }
    &__btn {
      margin-left: 10px;
      margin-right: 36px;
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
.classShowText{
  margin-right:20px !important
}
</style>
