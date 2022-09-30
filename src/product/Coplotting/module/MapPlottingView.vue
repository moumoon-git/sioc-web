<template>
  <transition name="component-fade" mode="out-in">
    <div v-if="isShowMapDialog" class="mapPlottingDialog">
      <div class="mapPlottingDialog__title">
        <div class="mapPlottingDialog__title__Name">
          {{ title }}
        </div>
        <div class="mapPlottingDialog__title__right">
          <div
            v-show="activeComponent === 'TemplateCoplotting'"
            class="mapPlottingDialog__title__right__template"
            @click="selectTemplate"
          />
          <div
            class="mapPlottingDialog__title__right__close"
            @click="closeDialog"
          />
        </div>
      </div>
      <div class="mapPlottingDialog__content">
        <component :is="activeComponent" ref="component" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
// 标绘详情
import TaggingDetails from '@/product/Coplotting/module/TaggingDetails/TaggingDetails.vue';
// 模板标绘
import TemplateCoplotting from '@/product/Coplotting/module/TemplateCoplotting/TemplateCoplotting.vue';
import MapOperation from './MapPlotting/PlottingMapDetail/MapOperation.vue';
// 详情
import cooperationAdmin from './MapPlotting/CooperationPanel/CooperationAdmin.vue';

export default defineComponent({
  name: 'MapPlottingDialog',
  components: {
    MapOperation,
    TaggingDetails,
    TemplateCoplotting,
    cooperationAdmin, // 协作标绘管理
  },
  props: {
    // 弹窗标题，用于模块切换
    title: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'MapPlottingViewEmit'],
  setup(props, context) {
    const store = useStore(); // 使用vuex
    // 组件显示控件
    const component: any = ref(null);
    /**
     * @description 当前激活的弹窗内容模块
     * @return 模块组件名称
     */
    const activeComponent = computed(() => {
      switch (props.title) {
        case '协作标绘': {
          return 'MapOperation';
        }
        case '标注详情': {
          return 'TaggingDetails';
        }
        case '协作标绘管理': {
          return 'cooperationAdmin';
        }
        case '模板标绘': {
          return 'TemplateCoplotting';
        }
        default: {
          return 'cooperationAdmin';
        }
      }
    });
    const isShowMapDialog = ref(false);
    function closeDialog() {
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
      store.commit('coplotting/SET_taggingInfo', obj);
      store.commit('coplotting/SET_detailsPopUp', openDeta);
      isShowMapDialog.value = false;
    }
    // 选择模板
    function selectTemplate() {
      component.value.controlSTPopupFlag = true;
      console.log('点击了选中模板');
    }
    return {
      component,
      activeComponent,
      isShowMapDialog,
      closeDialog,
      selectTemplate,
    };
  },
  watch: {
    // 模块切换时重置折叠状态
    title() {
      if (this.$refs.dialog) {
        (this.$refs.dialog as any).isHidden = false;
      }
    },
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss">
.mapPlottingDialog {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 20000;
  width: 530px;
  height: 90vh;
  background: #ffffff;
  box-shadow: -3px 0px 7px 0px rgba(230, 232, 244, 0.46);
  border-radius: 3px;
  &__title {
    width: 100%;
    height: 40px;
    background: #f1f4f6;
    border-radius: 3px 3px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__Name {
      width: 120px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      color: #333333;
      font-weight: 400;
    }
    &__right {
      display: flex;
      &__template {
        width: 20px;
        height: 20px;
        text-align: center;
        cursor: pointer;
        background: url(./MapPlotting/assets/selectTemplate.svg) no-repeat;
        margin-right: 27px;
        background-size: 80% 80%;
        background-position: 50% 50%;
      }
      &__close {
        width: 20px;
        height: 20px;
        text-align: center;
        cursor: pointer;
        background: url(./MapPlotting/assets/close.svg) no-repeat;
        margin-right: 11px;
        background-size: 80% 80%;
        background-position: 50% 50%;
      }
    }
  }
  &__content {
    width: 100%;
    height: calc(90vh - 40px);
    overflow: auto;
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
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.5s;
}
.component-fade-enter, .component-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
