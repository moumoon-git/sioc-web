<!-- 组件：Tab 标签页 -->
<template>
  <div class="tabs-container">
    <!-- tab -->
    <van-tabs
      ref="tabs"
      v-model:active="activeTabIndex"
      :color="tabsConfig.color"
      :title-active-color="tabsConfig.titleActiveColor"
      :title-inactive-color="tabsConfig.titleInactiveColor"
      @click="handleClickTab"
    >
      <van-tab
        v-for="(item, index) in tabList"
        :key="index"
        :title="item.tabName"
      />
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Tabs',
  props: {
    // 导航栏菜单默认显示下标
    active: {
      type: Number,
      default: 0
    },
    
    // 导航栏数据
    tabList: {
      type: Array,
      default: () => {
        return []
      }
    },

    // 导航栏样式：
    tabsConfig: {
      type: Object,
      default: () => {
        return {
          color: "#0091FF", // 标签主题色
          titleActiveColor: "#333333", // 标题选中态颜色
          titleInactiveColor: "#666666", // 标题默认态颜色
        }
      }
    }
  },
  emits: {
    handleClickTab: null
  },
  setup(props, {emit}) {
    const activeTabIndex = ref(props.active || 0); // 当前选中菜单的下标
    // 方法：切换tab
    function handleClickTab(val: any) {
      emit('handleClickTab', val);
    }
    return {
      activeTabIndex,
      handleClickTab
    }
  },
})
</script>
<style lang="scss">
.tabs-container {

  // 更改导航栏样式：
  & .van-tabs__wrap {
    height: 1rem !important;
  }
  & .van-tab--active .van-tab__text {
    font-weight: 600;
  }
  & .van-tab__text {
    font-size: 0.28rem !important;
  }
  & .van-tabs__line {
    width: 0.8rem;
  }
}
</style>
