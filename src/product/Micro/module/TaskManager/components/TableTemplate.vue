<template>
  <div style="margin-top: 13px;">
    <header>
      <div class="statistics">
        全部：{{ all }}
        <span style="margin-left: 17px;">执行中：</span>
        <span style="color: #F7C271;">{{ doing }}</span>
        <span style="margin-left: 17px;">已完成：</span>
        <span style="color: #0BD295;">{{ done }}</span>
        <span style="margin-left: 17px;">已取消：</span>
        <span style="color: #C8C9CC;">{{ cancel }}</span>
      </div>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        clearable
        class="sbs-date-picker"
        style="margin-left: 78px;"
        @change="fresh"
      />
      <el-select
        v-model="typeValue"
        placeholder="演练模式"
        class="sbs-select"
        clearable
        style="margin-left: 8px;width: 110px;"
        @change="fresh"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="statusValue"
        placeholder="任务状态"
        class="sbs-select"
        clearable
        style="margin-left: 8px;width: 110px;"
        @change="fresh"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="keyword"
        placeholder="请输入任务名称、事件名称、负责人关键字搜索"
        class="sbs-input"
        clearable
        style="margin-left: 8px;width: 286px;"
        @input="fresh"
      >
        <template #prefix>
          <i class="el-input__icon el-icon-search" />
        </template>
      </el-input>
      <el-button type="plain" @click="relateEvent" class="sbs-button" style="margin-left: 8px;color: #95A5BB;">批量关联事件</el-button>
      <el-button type="primary" @click="publishTask" class="sbs-button" style="margin-left: 8px;">发布任务</el-button>
    </header>
    <main style="margin: 20px 13px;">
      <el-table
        :data="tableData"
        class="sbs-table"
        border
        :cell-style="{ textAlign: 'center' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <!-- item.isSort 产品还没决定排序的规则 -->
        <el-table-column
          v-for="(item, index) in tableOptions"
          :key="index"
          :label="item.name"
          :prop="item.prop"
          :sortable="false"
          :sort-method="item.sortMethod"
          :resizable="false"
          :formatter="item?.formatter"
        >
          <template #default="scope">
            <span
              v-if="item?.formatter"
              :class="item.name==='负责人'?'reponsePerson':''"
            >
              {{ item.formatter(scope.row) }}
              <div
                v-if="item.name==='负责人'"
                :class="['phoneStyle', {'phoneStyleActive': isPhone&&currRow.id===scope.row.id}]"
                @click.stop="callPhone(scope.row)"
              />
              <div
                v-if="item.name==='负责人'"
                :class="['smsStyle', {'smsStyleActive': isSms&&currRow.id===scope.row.id}]"
                @click.stop="sendSms(scope.row.id, scope.row?.responsiblePerson?.id)"
              />
            </span>
            <span v-else-if="item.name===''">
              <span :class="['noRead', {'hasRead': scope.row.readStatus}]" />
              {{ scope.row.readStatus ? '已读' : '未读' }}
            </span>
            <span
              v-else-if="item.name==='任务状态'"
              :style="scope.row.statusCode==='handling'?'color:#F7C271'
                :scope.row.statusCode==='finished'?'color:#0BD295'
                  :'color:#C8C9CC'"
            >
              {{ scope.row.statusName }}
            </span>
            <span
              v-else
              :class="item.name==='关联事件'&&scope.row[item.prop]!=='无'?'reponsePerson':''"
            >
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="114"
          :resizable="false"
        >
          <template #default="scope">
            <div
              :class="['relateStyle', {'relateStyleActive': isRelate&&currRow.id===scope.row.id}]"
              @click.stop="relateTableEvent(scope.row)"
            />
            <div
              :class="['editStyle', {'editStyleActive': isEdit&&currRow.id===scope.row.id}]"
              @click.stop="handleUpdate(scope.row)"
            />
            <div
              :class="['seeStyle', {'seeStyleActive': isSee&&currRow.id===scope.row.id}]"
              @click.stop="handleDetail(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :total="tableTotal"
        layout="prev, pager, next, sizes, jumper"
        class="sbs-pagination"
        style="float: right;margin-right: 163px;margin-top: 18px;"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
    </main>
    <RelateEventDialog
      ref="RelateEventDialogRef"
      :task-ids="taskIds"
      :curr-event="{
        title: currRow?.eventTitle,
        id: currRow?.eventId
      }"
      @fresh="fresh"
      @openAddEventDialog="openAddEventDialog"
    />
    <TaskDialog
      ref="TaskDialogRef"
      @fresh="fresh"
      @openLocationDialog="openLocationDialog"
    />
    <el-dialog
      v-model="eventDialogVisible"
      title="新增事件"
      width="602px"
      custom-class="sbs-dialog"
    >
      <div style="height: 503px; overflow: auto;padding: 20px 28px;">
        <AddEventDialog
          ref="AddEventDialogRef"
          @close="eventDialogVisible=false"
          @fresh="RelateEventDialogRef.getEventOptions()"
          @openLocationDialog="openLocationDialog"
        />
      </div>
    </el-dialog>
    <LocationDialog
      ref="LocationDialogRef"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
} from 'vue';
import { ElMessage } from 'element-plus';
import { makePhoneCall } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import RelateEventDialog from './RelateEventDialog.vue'; // 批量关联事件
import TaskDialog from './TaskDialog.vue'; // 任务弹窗
import AddEventDialog from './AddEventDialog.vue'; // 事件新增窗
import LocationDialog from '../../../generalparts/Location/LocationDialog.vue';

const RelateEventDialogRef: any = ref(null); // 批量关联事件引用
const AddEventDialogRef: any = ref(null); // 新增事件引用
const TaskDialogRef: any = ref(null); // 任务弹窗引用
const eventDialogVisible = ref(false); // 事件新增窗开窗
const LocationDialogRef: any = ref(null); // 定位窗引用
const taskIds: any = ref([]);
const tableChecked: any = ref([]);
const dateRange = ref([]); // 日期
const keyword = ref(''); // 搜索
const typeValue = ref(''); // 任务类型
const statusValue = ref(''); // 任务状态
const currentPage = ref(1); // 在第几页
const pageSize = ref(10); // 每页几条
const isSee = ref(false);
const isEdit = ref(false);
const isRelate = ref(false);
const isPhone = ref(false);
const isSms = ref(false);
const currRow: any = ref(null); // 当前行
const getSurplusTime = (endTime: any) => {
  const seconds = Math.abs(
    new Date(endTime).getTime() / 1000 - new Date().getTime() / 1000,
  );
  const day = seconds / 60 / 60 / 24;
  const hour = (seconds / 60 / 60) % 24;
  const minute = (seconds / 60) % 60;
  return `${Math.abs(Math.floor(day))}天${Math.abs(
    Math.floor(hour),
  )}时${Math.abs(Math.floor(minute))}分`;
};
// tableOptions列表
const tableOptions = ref([
  {
    name: '',
    prop: 'readStatus',
    isSort: false,
  },
  {
    name: '任务id',
    prop: 'id',
    isSort: false,
  },
  {
    name: '任务名称',
    prop: 'title',
    isSort: false,
  },
  {
    name: '任务类型',
    prop: 'typeName',
    isSort: true,
  },
  {
    name: '负责人',
    isSort: true,
    formatter: (row: any) => { return row?.responsiblePerson?.name || '-'; },
    sortMethod: () => {

    },
  },
  {
    name: '发布时间',
    isSort: true,
    formatter: (row: any) => { return String(row?.startTime).substr(0, 16); },
    sortMethod: () => {

    },
  },
  {
    name: '任务时限',
    isSort: true,
    formatter: (row: any) => {
      if (row.statusCode === 'handling' && row?.endTime) {
        const flag = new Date(row.endTime).getTime() <= new Date().getTime();
        return `${flag ? '超时：' : '剩余：'}${getSurplusTime(row.endTime)}`;
      } else if (!row.endTime) return '无时限';
      else {
        const endDateTime = new Date(row.endTime).getTime();
        const nowDateTime = new Date().getTime();
        const flag = endDateTime <= nowDateTime;
        if (flag) {
          return `超时：${getSurplusTime(row.endTime)}`;
        }
        const startDateTime = new Date(row.startTime).getTime();
        const diffSeconds = (nowDateTime - startDateTime) / 1000;
        const day = Math.floor(diffSeconds / 60 / 60 / 24);
        const hour = Math.floor(diffSeconds / 60 / 60) % 24;
        const minute = Math.floor(diffSeconds / 60) % 60;
        return `用时：${day}天${hour}时${minute}分`;
      }
    },
    sortMethod: () => {

    },
  },
  {
    name: '任务状态',
    prop: 'statusName',
    isSort: true,
  },
  {
    name: '关联事件',
    prop: 'eventTitle',
    isSort: true,
  },
]);
const props = defineProps({
  // 全部
  all: {
    type: Number,
    default: 0,
  },
  // 执行中
  doing: {
    type: Number,
    default: 0,
  },
  // 已完成
  done: {
    type: Number,
    default: 0,
  },
  // 已取消
  cancel: {
    type: Number,
    default: 0,
  },
  // 演练模式
  typeOptions: {
    type: Array,
    default: () => [],
  },
  // 任务状态
  statusOptions: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  // 表格总数量
  tableTotal: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(['fresh']);
// 列表刷新
const fresh = () => {
  const item = {
    startTime: dateRange.value[0] || '',
    endTime: dateRange.value[1] || '',
    status: statusValue.value ? [statusValue.value] : [], // 任务状态
    keyWord: keyword.value,
    page: currentPage.value,
    size: pageSize.value,
    modeType: typeValue.value,
  };
  isRelate.value = false;
  isSee.value = false;
  isEdit.value = false;
  emit('fresh', item);
};
// 点击关联事件新增
const openAddEventDialog = () => {
  eventDialogVisible.value = true;
};
// 批量关联事件
const relateEvent = () => {
  if (tableChecked.value.length < 1) {
    ElMessage({
      type: 'error',
      message: '请先勾选任务再关联事件!',
    });
    return;
  }
  taskIds.value = [];
  tableChecked.value.forEach((el: any) => {
    taskIds.value.push(el.id);
  });
  currRow.value = {
    eventTitle: tableChecked.value[0].eventTitle,
    eventId: tableChecked.value[0].eventId,
  };
  RelateEventDialogRef.value.dialogVisible = true;
  RelateEventDialogRef.value.getEventOptions();
};
// 打开定位窗
const openLocationDialog = () => {
  LocationDialogRef.value.open({
    longitude: 0.0,
    latitude: 0.0,
    address: '',
  }).then((obj: any) => {
    console.log(obj);
    if (eventDialogVisible.value) {
      AddEventDialogRef.value.dataForm.locationLongitude = obj?.longitude;
      AddEventDialogRef.value.dataForm.locationLatitude = obj?.latitude;
      AddEventDialogRef.value.dataForm.locationAddress = obj?.address;
    } else {
      TaskDialogRef.value.initLocation(obj);
    }
  });
};
// 任务的初始化
const taskOptionsInit = () => {
  TaskDialogRef.value.eventOptionsPage = 0;
  TaskDialogRef.value.eventOptions = [];
  TaskDialogRef.value.getTypeOptions();
  TaskDialogRef.value.getEventOptions();
};
// 数据赋值
const setData = (val: any) => {
  TaskDialogRef.value.getTaskDetail(val ? val.id : 0);
  taskOptionsInit();
};
// 发布任务
const publishTask = () => {
  setData(null); // 清空
  TaskDialogRef.value.isNewTask = true;
  TaskDialogRef.value.disabled = false;
  TaskDialogRef.value.dialogVisible = true;
  taskOptionsInit();
};
// 勾表
const handleSelectionChange = (val: any) => {
  tableChecked.value = val;
};
// 表格某行关联事件
const relateTableEvent = (val: any) => {
  currRow.value = val;
  isRelate.value = true;
  taskIds.value = [val.id];
  RelateEventDialogRef.value.dialogVisible = true;
  RelateEventDialogRef.value.getEventOptions();
};
// 编辑
const handleUpdate = (val: any) => {
  setData(val); // 数据赋值
  TaskDialogRef.value.isNewTask = false;
  currRow.value = val;
  isEdit.value = true;
  TaskDialogRef.value.disabled = false;
  TaskDialogRef.value.dialogVisible = true;
  TaskDialogRef.value.initContact(); // 初始化联系人选择窗
};
// 查看
const handleDetail = (val: any) => {
  setData(val); // 数据赋值
  TaskDialogRef.value.isNewTask = false;
  currRow.value = val;
  isSee.value = true;
  TaskDialogRef.value.disabled = true;
  TaskDialogRef.value.dialogVisible = true;
};
// 翻页
const currentChange = (val: number) => {
  currentPage.value = val;
  fresh();
};
// 每页几条
const sizeChange = (val: number) => {
  pageSize.value = val;
  fresh();
};
// 打电话
const callPhone = (item: any) => {
  isPhone.value = true;
  makePhoneCall({
    phone: item.mobile1,
    type: 1,
    id: item.id,
    name: item.name,
  });
};
// 发短信
const sendSms = (taskId: string, contactorId: string) => {
  isSms.value = true;
  const request: any = {
    method: 'post',
    service: 'eoc',
    url: '/event/task/sendTaskNoticeMessage',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      taskId,
      contactorId,
    },
  };
  $http(request).then((response) => {
    if (response.code === 0 || response.errorcode === 0) {
      $message.success('短信发送成功！');
    }
  }).catch((error) => {
    $message.error(`短信发送失败！${error}`);
  });
};
defineExpose({
  dateRange,
  typeValue,
  statusValue,
  keyword,
  handleUpdate,
});
</script>

<style lang="scss" scoped>
  .statistics {
    color: #646566;
    font-size: 12pt;
    margin-left: 10px;
    display: inline-block;
  }
  .reponsePerson {
    font-family: PingFangSC-Regular, PingFang SC;
    color: #0091FF;
  }
  .relateStyle {
    width: 16pt;
    height: 16pt;
    cursor: pointer;
    display: inline-block;
    background: url(../assets/relate.svg) no-repeat;
  }
  .relateStyleActive {
    background: url(../assets/relateActive.svg) no-repeat;
  }
  .editStyle {
    width: 16pt;
    height: 16pt;
    cursor: pointer;
    display: inline-block;
    background: url(../assets/edit.svg) no-repeat;
  }
  .editStyleActive {
    background: url(../assets/editActive.svg) no-repeat;
  }
  .seeStyle {
    width: 16pt;
    height: 16pt;
    cursor: pointer;
    display: inline-block;
    background: url(../assets/see.svg) no-repeat;
  }
  .seeStyleActive {
    background: url(../assets/seeActive.svg) no-repeat;
  }
  .phoneStyle {
    width: 16px;
    height: 15px;
    cursor: pointer;
    display: inline-block;
    margin-left: 2px;
    transform: translateY(2px);
    background: url(../assets/phone.svg) no-repeat;
  }
  .phoneStyleActive {
    background: url(../assets/phone.svg) no-repeat;
  }
  .smsStyle {
    width: 16px;
    height: 15px;
    cursor: pointer;
    display: inline-block;
    margin-left: 2px;
    transform: translateY(2px);
    background: url(../assets/sms.svg) no-repeat;
  }
  .smsStyleActive {
    background: url(../assets/sms.svg) no-repeat;
  }
  .noRead {
    width: 8px;
    height: 8px;
    background: #F66E6E;
    border-radius: 50px;
    display: inline-block;
  }
  .hasRead {
    background: #0BD295;
  }
</style>
