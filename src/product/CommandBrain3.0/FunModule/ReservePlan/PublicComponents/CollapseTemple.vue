<template>
  <!-- 头部 -->
  <ListTemple
    :title="title"
    :useHead="useHead"
    :useHeaderIcon="useHeaderIcon"
    :useCount="useCount"
    :countAll="countAll"
    :useSearch="useSearch"
    :useList="false"
  >
    <template #headerIcon>
      <slot name="headerIcon" />
    </template>
    <template #headerRight>
      <slot name="headerRight" />
    </template>
  </ListTemple>
  <!-- 列表 -->
  <main
    v-if="useList"
    class="scroll"
  >
    <div
      v-for="(item, index) in list"
      :key="index"
      class="listStyle"
      :style="currentItem===item?'opacity: 1':''"
      @click.stop="handleClick(item)"
    >
      <Collapse
        :item="item"
        :headerStyle="headerStyle"
      >
        <template #head>
          <slot name="head" :data="item" />
        </template>

        <template #main>
          <slot name="main" :data="item" />
        </template>
      </Collapse>
    </div>
  </main>
</template>

<script setup>
import {
  ref,
} from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue'; // 搜索
import Collapse from './Collapse.vue';
import ListTemple from './ListTemple.vue';
// 树

const keyword = ref(''); // 搜索
const currentItem = ref(null); // 当前item
const currentInnerItem = ref(null); // 当前内列item
const baseURL = window.config.baseURL;
const chooseArr = ref([]); // 选中的所有人
const props = defineProps({
  // 是否用head margin
  headerStyle: {
    type: Boolean,
    default: false,
  },
  // 列表
  list: {
    type: Array,
    default: () => [],
  },
  // 内列表
  innerList: {
    type: Array,
    default: () => [],
  },
  // 文件列表
  fileList: {
    type: Array,
    default: () => [],
  },
  // 要头吗
  useHead: {
    type: Boolean,
    default: true,
  },
  // 头用图标还是长方块
  useHeaderIcon: {
    type: Boolean,
    default: true,
  },
  // 计数吗
  useCount: {
    type: Boolean,
    default: true,
  },
  // 用搜索吗
  useSearch: {
    type: Boolean,
    default: false,
  },
  // 用列表吗
  useList: {
    type: Boolean,
    default: true,
  },
  // 用勾选吗
  useCheck: {
    type: Boolean,
    default: false,
  },
  // 用图标吗
  useIcon: {
    type: Boolean,
    default: false,
  },
  // 用标签吗
  useLabel: {
    type: Boolean,
    default: false,
  },
  // 用内列吗
  useInner: {
    type: Boolean,
    default: false,
  },
  // 用文件列吗
  useFile: {
    type: Boolean,
    default: false,
  },
  // 用联系人工作吗
  usePosition: {
    type: Boolean,
    default: false,
  },
  // 用联系人详情吗
  useMore: {
    type: Boolean,
    default: false,
  },
  // 标题
  title: {
    type: String,
    default: '领导小组',
  },
  // 头部icon
  headerIconUrl: {
    type: String,
    default: './assets/yellowSign.svg',
  },
  // 列表总数
  countAll: {
    type: Number,
    default: 0,
  },
  // 搜索框
  placeholder: {
    type: String,
    default: '请输入搜索关键字',
  },
  // 高级label的标准
  highLabel: {
    type: String,
    default: '应急负责人',
  },
  // 高级标签颜色
  highLabelColor: {
    type: String,
    default: '#0BD295',
  },
  // 低级标签颜色
  lowLabelColor: {
    type: String,
    default: '#00C1DE',
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
  // 自定义函数
  otherFunction: {
    type: String,
    default: '100%',
  },
});
const emit = defineEmits(['handleChange', 'handleClick', 'handleInnerClick', 'handleCheck', 'fresh']);
// 搜索
const handleChange = () => {
  emit('handleChange', keyword.value);
}
// 点击列表项
const handleClick = (item) => {
  currentItem.value = item;
  emit('handleClick', item);
}
// 点击里面列表的项
const handleInnerClick = (item) => {
  currentInnerItem.value = item;
  emit('handleInnerClick', item);
}
// 勾选
const handleCheck = (item) => {
  if (chooseArr.value.filter(el => el.id === item.id).length === 0) {
    chooseArr.value.push(item);
  } else { // 移除
    chooseArr.value = chooseArr.value.filter(el => el.id !== item.id);
  }
  emit('handleCheck', chooseArr.value);
}
// 调用完后允许列表刷新
const fresh = (item) => {
  emit('fresh', item);
}
defineExpose({
  chooseArr,
  handleClick,
});
</script>

<style lang="scss" scoped>
  .scroll {
    width: 100%;
    // height: 100%;
    overflow: auto;
    .listStyle {
      cursor: pointer;
      color: #FFF;
      opacity: 0.7;
      .listText {
        float: left;
        display: contents;
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
