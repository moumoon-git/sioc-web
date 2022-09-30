<template>
  <div :class="$style.CoplottingView">
    <Dialog
      ref="dialog"
      :visible="visible"
      :title="dialogTitle"
      @close="handleClose"
    >
      <keep-alive :include="['MapOperation']">
        <component
          :is="activeComponent"
          ref="component"
          enter="commandBrain"
          :from="`commandBrain`"
        />
      </keep-alive>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, computed, nextTick, watch } from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
// 标绘详情
import TaggingDetails from '@/product/Coplotting/module/TaggingDetails/TaggingDetails.vue';
import MapOperation from '@/product/Coplotting/module/MapPlotting/PlottingMapDetail/MapOperation.vue'; // 标绘页

export default defineComponent({
  name: 'CoplottingView',
  components: {
    Dialog,
    TaggingDetails,
    MapOperation, // 详情页
  },
  setup(prop, context) {
    const store = useStore(); // 使用vuex
    const component: any = ref<HTMLElement | null>(null);
    const handlePontData: any = ref({});
    handlePontData.value = store.state.coplotting.detailsPopUp.handleData;
    // 弹窗名字
    const dialogTitle = ref('');
    // 弹窗是否可见
    const visible = ref(true);
    const activeComponent = computed(() => {
      /**
       * @description 当前激活的弹窗内容模块
       * @return 模块组件名称
       */
      switch (dialogTitle.value) {
        case '标注详情': {
          return 'TaggingDetails';
        }
        case '协作标绘': {
          return 'MapOperation';
        }
        default: {
          return '';
        }
      }
    });
    // 获取图形绘制
    function getGraphical() {
      // 绘制完成的图形参数
      const graphicalObj = store.state.coplotting.graphicParameters;
      let typeNum = 0;
      switch (graphicalObj.type) {
        case 'spot':
          typeNum = 0;
          (window as any).map
            .markScreening(graphicalObj.convergeName, graphicalObj.typeId)
            .then((el: any) => {
              handlePontData.value = el;
            });
          break;
        case 'noodles':
          typeNum = 1;
          (window as any).map
            .getSpecifiedData(graphicalObj.convergeName, graphicalObj.typeId)
            .then((el: any) => {
              // console.log(el);
              handlePontData.value = el;
            });
          break;
        case 'line':
          typeNum = 2;
          (window as any).map
            .getSpecifiedData(graphicalObj.convergeName, graphicalObj.typeId)
            .then((el: any) => {
              // console.log(el);
              handlePontData.value = el;
            });
          break;
        case 'other':
          typeNum = 3;
          (window as any).map
            .getSpecifiedData(graphicalObj.convergeName, graphicalObj.typeId)
            .then((el: any) => {
              // console.log(el);
              handlePontData.value = el;
            });
          break;
        default:
          break;
      }
    }
    getGraphical();
    // 关闭弹窗
    function handleClose() {
      const { handleData } = store.state.coplotting.taggingInfo;
      const st = {
        src:
          (window as any).config.baseURL +
          handleData?.markRecord?.statusIconUrl,
      };
      // console.log('图标路径', st.src);
      // console.log(handlePontData.value);
      if (st.src.indexOf('undefined') === -1) {
        (window as any).map.setOneMarkerStyle(handlePontData.value, st);
      }
      const openDeta = {
        handleType: '', // 操作类型 add添加 vis显示 edit编辑
        handleData: {}, // 操作的数据 包括获取详情的id
        flag: false, // 打开或者关闭
        title: '标注详情', // 详情弹窗时的模块 标注详情
      };
      // 保存完成之后关闭弹窗
      const obj = {
        title: '', // 详情弹窗时的模块 标注详情
        flag: false, // 是否打开
        handleData: {}, // 传入的数据
      };
      store.commit('coplotting/SET_detailsPopUp', openDeta);
      store.commit('coplotting/SET_taggingInfo', obj);
      // console.log(component.value);
      // visible
      visible.value = false;
      context.emit('close');
    }
    // 初始化
    function init() {
      if (dialogTitle.value === '标注详情') {
        nextTick(() => {
          component.value.init();
        });
      }
    }
    watch(
      () => store.state.coplotting.detailsPopUp,
      (newV) => {
        getGraphical();
      },
    );
    return {
      component,
      handleClose,
      activeComponent,
      init,
      dialogTitle,
      visible,
    };
  },
});
</script>

<style lang="scss" module>
.CoplottingView {
  // width: 100%;
  // height: 100%;
}
</style>
