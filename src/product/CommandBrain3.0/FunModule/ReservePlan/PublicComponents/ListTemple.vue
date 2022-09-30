<template>
  <!-- 头部 -->
  <!-- useHead设为false就可以只用列表了 -->
  <header
    v-if="useHead"
    class="headerStyle"
    :style="useHeaderIcon ? '' : 'height: auto;background: none'"
  >
    <!-- 长方块 -->
    <div
      v-if="!useHeaderIcon"
      class="headerRect"
    />
    <!-- 自定义icon -->
    <slot
      class="headerIcon"
      name="headerIcon"
    />
    <!-- 标题 -->
    <div
      class="headerText"
      :style="useHeaderIcon ? '' : 'color: #56E9FF;margin: 10px 0px 0px 0px;'"
    >
      {{ title }}<span v-if="useCount">({{ countAll }})</span>
    </div>
    <!-- 右边 -->
    <slot name="headerRight" />
  </header>
  <!-- 搜索框 -->
  <Search
    v-if="useSearch"
    v-model="keyword"
    :placeholder="placeholder"
    class="search"
    @change="handleChange"
  />
  <!-- 树 -->
  <!-- 列表 -->
  <!-- useList设为false就可以只用头了 -->
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
      <!-- 勾选框 -->
      <label
        v-if="useCheck"
        class="checkLabel"
      >
        <div class="checkLabelDiv">
          <input
            class="checkBox"
            v-model="item.isChecked"
            type="checkbox"
            @change="handleCheck(item)"
          >
          <i class="checkIcon" />
        </div>
      </label>
      <div :style="useCheck?'margin-left: 22px;':''">
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
        <!-- label -->
        <div
          v-if="useLabel"
          :class="item.label===highLabel ? 'highLabel' : 'lowLabel'"
        >
          <p>{{ item.labelName }}</p>
        </div>
        <!-- 名字 -->
        <div class="listText">
          {{ item.name || '-' }}
          <span v-if="usePosition">
            ({{ `${item.workUnit || '-'}/${item.position || '-'}` }})
          </span>
          <!-- 详情按钮 -->
          <span v-if="useMore">
            <ContactMoreButton
              :id="item?.contactorId || item?.id"
            />
          </span>
        </div>
        <!-- 自定义操作 -->
        <slot name="operation" :data="item"/>
      </div>
    </div>
  </main>
</template>

<script setup>
import {
  ref,
} from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue'; // 搜索
// 树

const keyword = ref(''); // 搜索
const currentItem = ref(null); // 当前item
const currentInnerItem = ref(null); // 当前内列item
const baseURL = window.config.baseURL;
const chooseArr = ref([]); // 选中的所有人
const props = defineProps({
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
  emit('handleCheck', item);
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
  @mixin label {
    padding: 2px 8px;
    border-radius: 10px;
    float: left;
    margin: 0px 7px 0px 0px;
    p {
      text-align: center;
      font-size: 12px;
    }
  }
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
      margin: 15px 0px 0px 10px;
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
      float: left;
    }
  }
  .search {
    width: 95%;
    margin: 10px;
    border: none;
  }
  .scroll {
    width: 100%;
    // height: 100%;
    overflow: auto;
    .listStyle {
      cursor: pointer;
      color: #FFF;
      background: v-bind(listBackColor);
      border: v-bind(listBackBorder);
      margin: 10px;
      opacity: 0.7;
      padding: 10px;
      min-height: 22px;
      position: relative;
      .checkLabel {
        position: absolute;
        left: -9px;
      }
      .checkLabel .checkBox {
        visibility: hidden;
      }
      .checkLabel .checkBox + .checkIcon {
        color: #fff;
        width: 16px;
        height: 16px;
        border-radius: 2px;
        border: 1px solid #a6adb4;
        display: inline-block;
        visibility: visible;
        padding-left: 0px;
        text-align: center;
        content: " ";
        box-sizing: border-box;
        line-height: 16px;
        margin-top: 3px;
        cursor: pointer;
      }
      .checkLabel .checkBox[type="checkbox"]:checked + .checkIcon {
        background-color: #56e9ff;
        border: none;
        content: "✓";
        font-size: 14px;
        color: #000;
      }
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
      .highLabel {
        background: v-bind(highLabelColor);
        @include label;
      }
      .lowLabel {
        background: v-bind(lowLabelColor);
        @include label;
      }
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
