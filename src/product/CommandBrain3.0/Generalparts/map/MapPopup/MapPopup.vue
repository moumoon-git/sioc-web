<template>
  <div v-show="isVisible" :class="$style.MapPopup">
    <MapDialog ref="MapDialogs" :visible="visible" :is-map-dialog="isMapDialog" @close="close">
      <!-- 弹窗标题栏 -->
      <template #title>
        <div class="task-list-dialog__title">
          <div>{{ options.title || title || '-' }}</div>
          <!-- 图钉按钮 -->
          <!-- <button
            v-if="activeComponent === 'TaskDialog'"
            :class="{
              'task-list-dialog__title__pin': isPinned,
            }"
            @click="isPinned = !isPinned"
          /> -->
        </div>
      </template>
      <!-- 任务 -->
      <!-- <TaskDialog /> -->
      <!-- 联系人信息 -->
      <!-- <ContactInfoDialog /> -->
      <!-- 其他 -->
      <!-- <OtherDialog /> -->
      <component
        :is="activeComponent"
        :active-component="activeSupplementDialog"
        :self-module="selfModule"
        :vis-datais-data="visData"
        :compose-data="options"
      />
    </MapDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, PropType } from 'vue';
// 地图弹窗
import MapDialog from '../MapDialog/MapDialog.vue';
// 加载逻辑
import loadSetup from './scripts';
// 加载联系人详情
import ContactInfoDialog from './ContactInfoDialog/ContactInfoDialog.vue';
// 任务
import TaskDialog from './TaskListDialog/TaskListDialog.vue';
// 其他
import OtherDialog from './OtherDialog/OtherDialog.vue';
// 公用
import publicPopup from './publicPopup/publicPopup.vue';
// 事件弹窗
import Event from './Event/Event.vue';
// 动态轨迹任务弹窗
import TaskTrackDialog from './TaskTrackDialog/TaskTrackDialog.vue';

import StandbyDialog from './StandbyDialog/StandbyDialog.vue';
// import { useStore } from 'vuex';
import myStore from './StandbyDialog/store/useStore';

export default defineComponent({
  components: {
    // 地图弹窗
    MapDialog,
    // 加载联系人详情
    ContactInfoDialog,
    // 任务
    TaskDialog,
    // 其他
    OtherDialog,
    // 公用
    publicPopup,
    // 事件弹窗
    Event,
    StandbyDialog,
    TaskTrackDialog,
  },

  provide() {
    return {
      uid: this.uid,
      attentionPayload: {
        id: this.options.responseData?.id,
        dialogType: this.options.responseData?.dialogType,
      },
    };
  },
  props: {
    modle: {
      type: String,
      default: '', // task contact other
    },
    destroy: {
      type: Function,
      default: () => {
        console.warn('missing prop: destroy');
      },
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isMapDialog: {
      type: Boolean,
      default: false,
    },
    uid: {
      type: String,
      default: '1',
    },
  },
  setup(props) {
    console.log(props, 'propssss');
    // const $store = useStore()
    const { state, dispatch } = myStore();
    const instance = getCurrentInstance();

    const {
      title,
      // 激活的模块
      activeComponent,
      // 地图弹窗的元素
      MapDialogs,
      // 打开弹窗的参数
      open,
      // 补充弹窗的模块
      activeSupplementDialog,
      // 当前模块
      selfModule,
      // 显示的数据
      visData,
    } = loadSetup(props, instance);

    const ctx = instance!.appContext.config.globalProperties;
    console.log(instance, ctx, 'ctx');
    const isVisible = ref(props.visible);

    const getData = () => {
      console.log('我被调用了');
    };
    const close = () => {
      isVisible.value = false;
      // 关闭周边检索右边弹窗指令
      // $store.commit('retrieval/SET_isClosePeripheralSearch', true)
      dispatch({
        type: 'cleanUpCurrentStateAction',
        payload: {
          uid: props.uid,
        },
      }).then(() => {
        // 删除打开的弹窗keyId
        dispatch({
          type: 'delDialogOpenedStack',
          payload: {
            keyId: props.options.responseData.keyId,
          },
        });
        props.destroy();

        // 调用地图的方法卸载组件
        const mapInstance = (window as any).map || (window as any).admin_map;
        mapInstance.closeClearPopup(props.uid);
        // 初始化回去周边检索右边弹窗指令 不然触发不了watch
        // $store.commit('retrieval/SET_isClosePeripheralSearch', false)

        // 将promise.resolve出去
        state.promiseResolve();
      });
    };
    return {
      isVisible,
      getData,
      close,
      title,
      // 激活的模块
      activeComponent,
      // 地图弹窗的元素
      MapDialogs,
      // 打开弹窗的参数
      open,
      // 补充弹窗的模块
      activeSupplementDialog,
      // 当前模块
      selfModule,
      // 显示的数据
      visData,
    };
  },
  data() {
    return {
      // 是否钉着
      isPinned: false,
    };
  },
});
</script>

<style lang="scss" module>
.MapPopup {
}
</style>
