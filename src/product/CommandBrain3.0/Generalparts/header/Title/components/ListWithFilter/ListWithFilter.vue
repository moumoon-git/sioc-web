<template>
  <div
    v-loading="isLoading"
    :class="$style.container"
    :style="{
      maxHeight: !props.visible ? '0': undefined,
      border: !props.visible ? '0' : undefined,
    }"
    @click.stop
  >
    <!-- 1. 搜索栏 -->
    <div :class="$style.searchBar">
      <Search
        v-model.lazy="searchKeyword"
        placeholder="请输入事件名称关键词检索"
        style="flex:1;"
        @change="getEventList()"
      />
      <span
        :class="[
          $style.foldBtn,
          { [$style.reverse]: showFilter },
        ]"
        @click="toggleFilter"
      >更多</span>
    </div>
    <!-- 2. 筛选栏 -->
    <div
      v-show="showFilter"
      :class="$style.filterBar"
    >
      <div
        v-for="filterOption in filterOptions"
        :key="filterOption.name"
      >
        <span>{{ filterOption.name }}</span>
        <button
          v-for="(option, optionIndex) in filterOption.options"
          :key="option.name"
          :class="[
            $style.filterOption,
            {
              [$style.activeFilterOption]: filterOption.activeIndex === optionIndex,
              [$style.doubleFilterOption]: option.name === '自定义日期',
            },
          ]"
          @click="handleFilter(filterOption, optionIndex)"
        >
          {{ option.name }}
          <div
            v-if="option.name === '自定义日期'"
            :class="$style.filterPopup"
          >
            <DatePicker
              v-model="customStartTime"
              placeholder="起始时间"
              @change="handleCustomTime"
            />
            <DatePicker
              v-model="customEndTime"
              style="margin-top:6px;"
              placeholder="终止时间"
              @change="handleCustomTime"
            />
          </div>
        </button>
      </div>
      <div>
        <span>事件类型</span>
        <ElCascader
          v-model="eventTypeID"
          :class="$style.cascader"
          placeholder="请选择事件类型"
          :options="eventTypeList"
          clearable
          size="small"
          :props="{
            value: 'id',
            label: 'name',
            checkStrictly: true,
            emitPath: false,
          }"
          :show-all-levels="false"
          @change="getEventList()"
        />
      </div>
    </div>
    <!-- 3. 总数 -->
    <div :class="$style.totalCount">
      <span>事件总数</span>
      <span>{{ eventTotalCount }}</span>
    </div>
    <!-- 4. 列表 -->
    <ul
      v-if="eventList.length"
      @click="changeEvent"
      @scroll="handleScroll"
    >
      <li
        v-for="(event, index) in eventList"
        :key="event.id"
        :data-event-index="index"
        :class="[
          $style.listItem,
          { [$style.activeListItem]: store.state.event?.id === event.id },
        ]"
      >
        <div>
          <span
            :class="$style.eventStatus"
            :style="{ background: mapColorFromStatus(event.responseStatus) }"
          >{{ event.responseStatusName || '未知状态' }}</span>
          <span>{{ event.title ?? '暂无事件标题' }}</span>
          <span>{{ event.occurTime ?? '暂无事发时间' }}</span>
        </div>
        <Address>{{ event.address ?? '暂无地址' }}</Address>
      </li>
      <div v-if="eventList.length === eventTotalCount">没有更多数据了</div>
    </ul>
    <EmptyHint v-else />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { debounce } from 'lodash';
import { ElCascader } from 'element-plus';
import Address from '@/product/CommandBrain3.0/Generalparts/right/Address/Address.vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
import Search from '@/product/CommandBrain3.0/Generalparts/right/Search/Search.vue';
import DatePicker from '@/product/CommandBrain3.0/Generalparts/right/DatePicker/DatePicker.vue';
import useEventListService from './useEventListService';
import useEventTypeListService from './useEventTypeListService';
import {
  thisMonth,
  thisQuarter,
  thisYear,
  formattedDate,
} from './useDate';

const store = useStore();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const {
  searchKeyword,
  eventTotalCount,
  eventList,
  eventTypeID,
  isLoading,
  getEventList,
  loadEventList,
  responseStatus,
  startTime,
  endTime,
  resetState,
} = useEventListService();

const [
  eventTypeList,
  getEventTypeList,
] = useEventTypeListService();

// 根据事件状态计算对应的显示颜色
const mapColorFromStatus = (statusCode: number): string => {
  switch (statusCode) {
    case 0: return '#F2B626';
    case 1: return '#0091FF';
    case 2: return '#0BD295';
    default: return '#999999';
  }
};

// 滚动到底加载更多数据
const handleScroll = debounce((e: UIEvent) => {
  const target = e.target as HTMLUListElement;
  if (target.scrollHeight - target.clientHeight - target.scrollTop < 30) {
    loadEventList();
  }
}, 300);

// 切换事件，采用事件委托的方式触发
const changeEvent = (event: any) => {
  const index = typeof event === 'number' ? event : event.target.dataset?.eventIndex ?? -1;
  if (index !== -1) {
    const clickedEvent = eventList.value[index];
    if (store.state.event?.id !== clickedEvent.id) {
      store.commit('changeEvent', clickedEvent);
    }
  }
  emit('close');
};

// 从 SBS 直接跳转过来
if (window.opener) {
  const handler = (ev: MessageEvent) => {
    if (ev.data?.from === 'sbs' && ev.data?.type === 'changeEvent') {
      store.commit('changeEvent', ev.data.event);
      window.removeEventListener('message', handler);
    }
  };
  window.addEventListener('message', handler);
  window.opener.postMessage('get event', '*');
}

// 初始化选取第一个事件
const stopWatch = watch(eventList, (newVal) => {
  if (newVal.length) {
    if (!store.state.event) {
      changeEvent(0);
    }
    // 只需要执行一次
    stopWatch();
  }
}, { immediate: true, deep: true });

// 显示筛选栏
const showFilter = ref(false);

// 切换显示筛选栏
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const filterOptions = ref([
  {
    name: '响应状态',
    activeIndex: 0,
    options: [
      { name: '全部', value: -1 },
      { name: '待响应', value: 0 },
      { name: '响应中', value: 1 },
      { name: '已结束', value: 2 },
    ],
  },
  {
    name: '事发时间',
    activeIndex: 0,
    options: [
      { name: '全部', value: ['', ''] },
      { name: '本月', value: thisMonth },
      { name: '本季', value: thisQuarter },
      { name: '本年', value: thisYear },
      { name: '自定义日期' },
    ],
  },
]);

const customStartTime = ref('');
const customEndTime = ref('');

const handleFilter = (filterOption: any, optionIndex: number) => {
  if (filterOption.activeIndex !== optionIndex) {
    const newValue = filterOption.options[optionIndex].value;
    if (filterOption.name === '响应状态') {
      filterOption.activeIndex = optionIndex;
      responseStatus.value = newValue;
      getEventList();
    } else if (filterOption.name === '事发时间') {
      // 不是自定义日期
      if (optionIndex !== 4) {
        filterOption.activeIndex = optionIndex;
        [startTime.value, endTime.value] = newValue;
        customStartTime.value = '';
        customEndTime.value = '';
        getEventList();
      }
    }
  }
};

// 自定义时间
const handleCustomTime = () => {
  startTime.value = formattedDate(new Date(customStartTime.value));
  endTime.value = formattedDate(new Date(customEndTime.value));
  filterOptions.value[1].activeIndex = 4;
  getEventList();
};

// 关闭时重置数据
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      showFilter.value = false;
      customStartTime.value = '';
      customEndTime.value = '';
      filterOptions.value[0].activeIndex = 0;
      filterOptions.value[1].activeIndex = 0;
      resetState();
      getEventList();
    });
  }
});
</script>

<style lang="scss" module>
$size: 673px;
$border-color: #56E9FF;
$border: 2px solid $border-color;
.container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  transition: max-height .3s;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: $size;
  height: $size;
  max-height: $size;
  background: rgba(#020508, .8);
  border-top: $border;
  border-bottom: $border;
  border-image: linear-gradient(
    to right,
    transparent 5%,
    rgba($border-color, .8),
    transparent 95%
  ) 1;
  // 列表
  & > ul {
    flex: 1;
    overflow-y: auto;
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
    // 没有更多数据了
    & > div:last-child {
      margin: 5px;
      color: #999;
    }
  }
}
// 搜索栏
.searchBar {
  display: flex;
  align-items: center;
  padding: 25px 0 8px 30px;
  .foldBtn {
    display: flex;
    align-items: center;
    color: $border-color;
    font-size: 16px;
    padding: 0 12px;
    cursor: pointer;
    &:hover { filter: brightness(150%); }
    &::after {
      content: '';
      display: inline-block;
      margin-left: 6px;
      width: 12px;
      height: 1em;
      cursor: pointer;
      transition: transform linear .2s;
      background: no-repeat center/100% 100% url(./assets/imgs/icon-arrow.svg);
    }
    &.reverse::after { transform: rotate(-180deg); }
  }
}
// 筛选栏
.filterBar {
  padding-left: 30px;
  margin: 7px 0 10px;
  & > div {
    display: flex;
    align-items: center;
    &:not(:last-child) { margin-bottom: 14px; }
    & > span:first-child {
      font-size: 16px;
      margin-right: 14px;
    }
  }
}
// 筛选按钮
.filterOption {
  $width: 82px;
  width: $width;
  height: 28px;
  background: transparent;
  font-size: 16px;
  color: #FFF;
  border: 1px solid rgba(#00C1DE, .8);
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 10px;
  }
  &.doubleFilterOption {
    width: $width * 2 + 10px;
    position: relative;
  }
  &.activeFilterOption,
  &:hover {
    color: $border-color;
    background: no-repeat center/150% 40px radial-gradient(
      ellipse at bottom, rgba(#00F0F3, 40%), transparent 60%
    ) rgba(#00C1DE, .05);
  }
  &:hover > .filterPopup {
    display: block;
  }
}
// 筛选气泡
.filterPopup {
  display: none;
  width: 100%;
  border: 1px solid rgba(#00C1DE, .8);
  border-top: 0;
  padding: 10px 0;
  position: absolute;
  left: -1px;
  background: #000;
  &:focus-within { display: block; }
}
// 事件总数
.totalCount {
  display: flex;
  align-items: center;
  text-align: left;
  padding: 5px 30px;
  & > span {
    &:first-child {
      font-size: 16px;
      margin-right: 8px;
    }
    &:nth-child(2) {
      font-size: 25px;
      color: $border-color;
    }
  }
}
// 列表项
.listItem {
  padding: 15px 25px;
  cursor: pointer;
  // 底部间隔白线
  &::not(:last-child) { border-bottom: 1px solid rgba(#FFF, .15); }
  &:hover,
  &.activeListItem {
    border-left: 2px solid $border-color;
    padding-left: 23px;
    background: linear-gradient(90deg, rgba(#00C1DE, .59) 0%, rgba(24, 38, 50, 0) 100%);
    // 高亮时地址显示白色
    & > div:last-child { color: #FFF; }
  }
  // 每一行内容
  & > div {
    display: flex;
    align-items: center;
    // 因为使用到事件委托，所以里面的内容要设置成不能点选
    pointer-events: none;
    // 第一行
    &:first-child > span {
      &:not(:first-child) { font-size: 16px; }
      &:nth-child(2) { font-weight: 500; }
      &:nth-child(3) { margin-left: auto; }
    }
    // 非高亮时地址显示灰色
    &:last-child {
      margin-top: 6px;
      color: #999999;
    }
  }
}
// 事件状态
.eventStatus {
  display: inline-block;
  min-width: 57px;
  height: 20px;
  padding: 0 5px;
  white-space: nowrap;
  background: #F2B626;
  border-radius: 10px;
  margin-right: 10px;
}
// 事件类型，element-plus 组件
.cascader {
  & > div > input {
    width: 266px;
    background: transparent;
    color: #FFF;
    border: 1px solid rgba(0, 193, 222, 0.8) !important;
    border-radius: 0;
    font-size: 16px;
    height: 28px !important;
    line-height: 28px !important;
    padding-top: 0;
    padding-bottom: 0;
    text-align: center;
    &:hover {
      color: #56E9FF;
      border-color: #56E9FF !important;
      background: no-repeat center/150% 40px radial-gradient(ellipse at bottom, rgba(0, 240, 243, 0.4), transparent 60%) rgba(0, 193, 222, 0.05);
    }
  }
}
</style>
