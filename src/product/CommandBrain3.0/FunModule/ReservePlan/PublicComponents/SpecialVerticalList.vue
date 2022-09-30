<!-- 长得特别的竖向列表 -->
<template>
  <!-- 头部 -->
  <header
    v-if="useHeaderIcon"
    class="headerStyle"
  >
    <!-- 长方块 -->
    <div class="headerRect" />
    <!-- 标题 -->
    <div class="headerText">
      {{ title }}
    </div>
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
      <!-- 框 -->
      <div class="frame">
        <p>
          {{ item.eventLevelCode==='4' || item.signalName === '蓝' ? 'IV' :
            item.eventLevelCode==='3' || item.signalName === '黄' ? 'III' :
            item.eventLevelCode==='2' || item.signalName === '橙' ? 'II' :
            item.eventLevelCode==='1' || item.signalName === '红' ? 'I' : ''
          }}
        </p>
      </div>
      <!-- 名字 -->
      <div class="listText">
        {{ item.name || '-' }}
      </div>
      <!-- 样式水平线 -->
      <div class="line" />
      <!-- 内容 -->
      <div>
        {{ item.content || '-' }}
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
  // 用头吗
  useHeaderIcon: {
    type: Boolean,
    default: true,
  },
  // 用列表吗
  useList: {
    type: Boolean,
    default: true,
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
    default: '#000',
  },
  // 列表背景框
  listBackBorder: {
    type: String,
    default: '1px solid #00C1DE',
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
  .headerStyle {
    width: 100%;
    height: 30px;
    background: none;
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
      color: #56E9FF;
      margin: 10px 0px 0px 0px;
      position: relative;
      font-size: 16px;
      float: left;
    }
  }
  .scroll {
    width: 100%;
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
      position: relative;
      .frame {
        width: 28px;
        height: 28px;
        border: 1px solid #FFF;
        p {
          text-align: center;
          font-size: 16px;
        }
      }
      .listText {
        position: absolute;
        left: 49px;
        top: 14px;
      }
      .line {
        width: 100%;
        height: 1px;
        opacity: 0.5;
        margin: 10px 0px;
        background: #FFF;
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
