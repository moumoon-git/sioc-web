<!-- 长得特别的横向列表 -->
<template>
  <!-- 头部 -->
  <header
    class="headerStyle"
    :style="useHeaderIcon ? '' : 'height: 30px;background: none'"
  >
    <!-- 自定义icon -->
    <slot
      v-if="useHeaderIcon"
      class="headerIcon"
      name="headerIcon"
    />
    <!-- 长方块 -->
    <div
      v-else
      class="headerRect"
    />
    <!-- 标题 -->
    <div
      class="headerText"
      :style="useHeaderIcon ? 'float: left;' : 'color: #56E9FF;margin: 10px 0px 0px 0px;line-height: 43px;'"
    >
      {{ title }}
    </div>
    <!-- 右边 -->
    <slot name="headerRight" />
  </header>
  <!-- 列表 -->
  <main class="scroll">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="listStyle"
      :style="currentItem===item?'opacity: 1':''"
      @click="handleClick(item)"
    >
      <!-- 图标 -->
      <div
        v-if="useIcon"
        :class="{
          iconBlue: item?.signalCode==='blue',
          iconYellow: item?.signalCode==='yellow',
          iconOrange: item?.signalCode==='orange',
          iconRed: item?.signalCode==='red',
        }"
      />
      <!-- 名字 -->
      <div class="listText">
        {{ item.name || '-' }}
      </div>
    </div>
  </main>
</template>

<script setup>
import {
  ref,
} from 'vue';
// 树

const currentItem = ref(null); // 当前item
const baseURL = window.config.baseURL;
const props = defineProps({
  // 列表
  list: {
    type: Array,
    default: () => [],
  },
  // 头用图标还是长方块
  useHeaderIcon: {
    type: Boolean,
    default: true,
  },
  // 用列表吗
  useList: {
    type: Boolean,
    default: true,
  },
  // 用图标吗
  useIcon: {
    type: Boolean,
    default: false,
  },
  // 标题
  title: {
    type: String,
    default: '',
  },
  // 列表总数
  countAll: {
    type: Number,
    default: 0,
  },
  // 列表背景色
  listBackColor: {
    type: String,
    default: 'linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0) 100%)',
  },
  // 列表背景框
  listBackBorder: {
    type: String,
    default: 'none',
  },
  // 列表多宽
  listWidth: {
    type: String,
    default: '100%',
  },
});
const emit = defineEmits(['handleClick', 'fresh']);
// 点击列表项
const handleClick = (item) => {
  currentItem.value = item;
  emit('handleClick', item);
}
// 调用完后允许列表刷新
const fresh = (item) => {
  emit('fresh', item);
}
defineExpose({
  handleClick,
});
</script>

<style lang="scss" scoped>
  @mixin icon {
    width: 25px;
    height: 25px;
    background-size: 80%;
    position: relative;
    margin: 0px;
    float: left;
  }
  .headerStyle {
    width: 100%;
    height: 52px;
    background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
    color: #FFF;
    .headerIcon {
      width: 19px;
      height: 19px;
      position: relative;
      margin: 15px 10px 0px 10px;
      float: left;
    }
    .headerRect {
      width: 6px;
      height: 13px;
      position: relative;
      margin: 16px 10px 0px 10px;
      float: left;
      background: #56E9FF;
      box-shadow: 0px 0px 16px 0px #008CFF;
      border-radius: 2px;
    }
    .headerText {
      position: relative;
      margin: 13px 0px 0px 10px;
      font-size: 16px;
    }
  }
  .scroll {
    width: 100%;
    min-height: 30px;
    // height: 100%;
    // overflow: auto;
    .listStyle {
      cursor: pointer;
      color: #FFF;
      background: v-bind(listBackColor);
      border: v-bind(listBackBorder);
      margin: 10px;
      opacity: 0.5;
      padding: 10px;
      display: inline-block;
      position: relative;
      min-width: 165px; //
      .iconBlue {
        background: url(./assets/blueSign.svg) no-repeat;
        @include icon;
      }
      .iconYellow {
        background: url(./assets/yellowSign.svg) no-repeat;
        @include icon;
      }
      .iconOrange {
        background: url(./assets/orangeSign.svg) no-repeat;
        @include icon;
      }
      .iconRed {
        background: url(./assets/redSign.svg) no-repeat;
        @include icon;
      }
      .listText {
        // float: left;
      }
      &:hover {
        opacity: 1;
      }
    }
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
</style>
