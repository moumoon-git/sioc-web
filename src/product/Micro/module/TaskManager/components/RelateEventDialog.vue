<template>
  <el-dialog
    v-model="dialogVisible"
    title="关联事件"
    width="602px"
    custom-class="sbs-dialog"
    @close="keyword='',currentPage=1,pageSize=10"
  >
    <div :class="$style.container">
      <div
        v-if="taskIds.length===1"
        style="height: 34px;
        background: #F1F4F6;
        border-radius: 4px;"
      >
        <div style="float: left;margin: 6px 0px 0px 8px;">
          已关联事件：{{ currEvent?.title }}
        </div>
        <el-button
          type="text"
          class="sbs-button"
          style="float: right;margin: 1px 14px 0px 0px;"
          @click="cancelRelatedEvent"
        >
          取消关联
        </el-button>
      </div>
      <el-input
        v-model="keyword"
        placeholder="请输入事件名称"
        class="sbs-input"
        style="margin: 20px 0px;width: 82%;"
        @input="getEventOptions"
      />
      <el-button
        class="sbs-button"
        type="primary"
        style="margin-left: 8px;"
        @click="emit('openAddEventDialog')"
      >
        新增事件
      </el-button>
      <div
        v-for="event in eventOptions"
        :key="event.id"
        :class="$style.listItem"
        :style="event.id===currEvent?.id ? 'color: #0091FF;' : ''"
        @click="handleClick(event)"
      >
        {{ event.title }}
      </div>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :total="eventOptionsTotal"
        layout="prev, pager, next"
        class="sbs-pagination"
        style="text-align: center;"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
} from 'vue';
import { ElMessage } from 'element-plus';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import {
  getEventList,
} from './js/TaskManager';
const dialogVisible = ref(false); // 开窗
const keyword = ref(''); // 搜索
const eventOptions = ref([]); // 事件列表
const eventOptionsTotal = ref(0); // 事件列表长度
const currentPage = ref(1); // 在第几页
const pageSize = ref(10); // 每页几条
const props = defineProps({
  taskIds: {
    type: Array,
    default: () => [],
  },
  // 单个任务：当前关联事件
  currEvent: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits([
  'fresh',
  'openAddEventDialog',
  'update:currEvent',
]);
// 选了任何一个
const handleClick = (val: any) => {
  const request: any = {
    method: 'post',
    url: '/event/task/batchLinkEvent',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      eventId: val.id,
      taskIds: props.taskIds,
    },
  };
  $http(request).then((response) => {
    if (response.errorcode === 0) {
      ElMessage({
        type: 'success',
        message: '关联事件成功!',
      });
      emit('fresh'); // 马上刷新任务列表
      dialogVisible.value = false;
    }
  });
};
// 取消关联
const cancelRelatedEvent = () => {
  const request: any = {
    method: 'post',
    url: '/event/task/batchLinkEvent',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      eventId: 0,
      taskIds: props.taskIds,
    },
  };
  $http(request).then((response) => {
    if (response.errorcode === 0) {
      ElMessage({
        type: 'success',
        message: '取消关联事件成功!',
      });
      emit('fresh'); // 马上刷新任务列表
      dialogVisible.value = false;
    }
  });
};
// 获取事件列表
const getEventOptions = () => {
  getEventList(pageSize.value, currentPage.value, keyword.value).then((response: any) => {
    eventOptions.value = response.data.data;
    eventOptionsTotal.value = response.data.totalElements;
  });
};
// 翻页
const currentChange = (val: number) => {
  currentPage.value = val;
  getEventOptions();
};
// 每页几条
const sizeChange = (val: number) => {
  pageSize.value = val;
  getEventOptions();
};
defineExpose({
  dialogVisible,
  getEventOptions,
});
</script>

<style lang="scss" module>
.container {
  padding: 20px 28px;
  height: 503px;
}
.listItem {
  color: #323233;
  cursor: pointer;
  line-height: 29px;
  &:hover,
  &.activeListItem {
    background: rgba(#3F92FE, .1);
  }
}
</style>
