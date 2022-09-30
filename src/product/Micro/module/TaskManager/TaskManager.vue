<template>
  <div>
    <el-tabs
      v-model="activeName"
      class="sbs-tabs"
      @tab-click="handleTab"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.id"
        :label="item.name"
        :name="item.name"
      />
    </el-tabs>
    <TableTemplate
      ref="TableTemplateRef"
      :all="all"
      :doing="doing"
      :done="done"
      :cancel="cancel"
      :type-options="trainOptions"
      :status-options="statusOptions"
      :table-data="tableData"
      :table-total="tableTotal"
      @fresh="fresh"
    />
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  reactive,
} from 'vue';
import TableTemplate from './components/TableTemplate.vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import {
  getTaskType,
  getTaskList,
} from './components/js/TaskManager';

const TableTemplateRef = ref(null);
const activeName = ref('全部'); // 默认页面是全部
const all = ref(0); // 全部
const doing = ref(0); // 执行中
const done = ref(0); // 已完成
const cancel = ref(0); // 已取消
const tabList = ref([]); // tab是任务类型
const tableData = ref([]);
const tableTotal = ref(0);
const statusOptions = ref([]); // 任务状态
const params = reactive({}); // 参数
const trainOptions = ref([]); // 演练模式
// 获得tab列表
const getTabList = () => {
  getTaskType().then((response) => {
    tabList.value.push({ id: 0, name: '全部' });
    tabList.value.push(...response.data);
    handleTab();
    // 获得头
    getHeader();
  });
};
// 刷新参数值
const fresh = (item) => {
  // 参数刷新
  params.value = item;
  getTaskManager();
};
// 获取头部统计
const getHeader = () => {
  let tabId = 0;
  tabList.value.forEach((el) => {
    if (el.name === activeName.value) {
      tabId = el.id;
      return;
    }
  });
  const request = {
    method: 'post',
    url: '/event/task/statisticByType',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      type: tabId, // 任务类型
    },
  };
  $http(request).then((response) => {
    if (response.errorcode === 0) {
      all.value = response.data.total;
      doing.value = response.data.handling;
      done.value = response.data.finished;
      cancel.value = response.data.cancel;
    }
  });
};
// 获取任务状态
const getStatus = () => {
  const request = {
    method: 'post',
    url: '/emergency/preparation/dictionary/getByParentCode',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      pcode: 'event_task_status',
    },
  };
  $http(request).then((response) => {
    if (response.errorcode === 0) {
      statusOptions.value = response.data;
    }
  });
};
// 获取演练模式
const getTrain = () => {
  trainOptions.value = [
    {
      id: 0,
      name: '正式模式',
    },
    {
      id: 1,
      name: '演练模式',
    },
  ];
};
// 获取是预案任务还是普通任务
const getTask = () => {
  const promise = new Promise((resolve) => {
    const request = {
      method: 'post',
      url: '/emergency/preparation/dictionary/getByCodeAndParentCode',
      service: 'eoc',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        pcode: 'event_task_type',
        code: 'preplan',
      },
    };
    $http(request).then((response) => {
      if (response.errorcode === 0) {
        return resolve(response.data.id);
      }
    });
  });
  return promise;
};
// 切换tab
const handleTab = () => {
  // 组件初始化
  TableTemplateRef.value.dateRange = [];
  TableTemplateRef.value.typeValue = '';
  TableTemplateRef.value.statusValue = '';
  TableTemplateRef.value.keyword = '';
  // 参数初始化
  params.value = {
    startTime: '',
    endTime: '',
    keyWord: '',
    page: 1,
    size: 10,
  };
  getTaskManager();
};
// 获得列表
const getTaskManager = () => {
  let tabId = 0;
  tabList.value.forEach((el) => {
    if (el.name === activeName.value) {
      tabId = el.id;
      return;
    }
  });
  getTask().then((id) => {
    getTaskList({
      taskType: activeName.value === '预案任务' ? [id] :
                activeName.value === '全部' ? [] : [tabId], // 任务类型
      ...params.value,
    }).then((response) => {
      if (response.errorcode === 0) {
        tableData.value = response.data.data || [];
        tableTotal.value = response.data.totalElements || 0;
      }
    });
  });
};
onMounted(() => {
  getTabList();
  getStatus();
  getTrain();
  if (window?.microProps?.data?.isJump) TableTemplateRef.value.handleUpdate(window.microProps.data);
});
</script>
