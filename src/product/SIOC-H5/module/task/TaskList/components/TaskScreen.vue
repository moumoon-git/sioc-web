<template>
  <!-- 主体内容 -->
  <main>
    <section class="task-status">
      <label class="task-status__label">任务状态</label>
      <div class="task-status-button">
        <label v-for="(item, index) in taskStatusList" :key="index" @click="selectTaskStatus(item)" :class="[selectedTaskStatus===item.name?'task-status--active':'']">
          {{ item.name }}
        </label>
      </div>
    </section>
    <van-cell title="任务类型" is-link :value="taskType.value" @click="taskTypeVisible = true"/>
    <van-popup v-model:show="taskTypeVisible" round position="bottom" close-icon-position="top-left">
      <van-picker
        title="请选择任务类型"
        :columns="taskTypeColumns"
        @cancel="taskTypeVisible = false"
        @confirm="onTaskTypeConfirm"
      />
    </van-popup>
    <van-cell title="开始日期" is-link :value="currentStartDate?moment(currentStartDate).format('YYYY-MM-DD HH:mm:ss'):'请选择时间'" @click="startDateVisible = true"/>
    <van-popup v-model:show="startDateVisible" round position="bottom" close-icon-position="top-left">
      <van-datetime-picker
        v-model="currentStartDate"
        type="datetime"
        title="请选择时间"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="startDateVisible = false"
        @confirm="startDateVisible = false"
      />
    </van-popup>
    <van-cell title="结束日期" is-link :value="currentEndDate?moment(currentEndDate).format('YYYY-MM-DD HH:mm:ss'):'请选择时间'" @click="endDateVisible = true"/>
    <van-popup v-model:show="endDateVisible" round position="bottom" close-icon-position="top-left">
      <van-datetime-picker
        v-model="currentEndDate"
        type="datetime"
        title="请选择时间"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="endDateVisible = false"
        @confirm="endDateVisible = false"
      />
    </van-popup>
  </main>
  <!-- 底部操作框 -->
  <footer>
    <span class="reset" @click="reset">重置</span>
    <span class="confirm" @click="$emit('update:screenVisible',false)">确定</span>
  </footer>
</template>
<script>
import { defineComponent, ref, watch, getCurrentInstance } from 'vue';

export default defineComponent({
  name: 'TaskScreen',
  components: {
  },
  props: {
    // 任务状态
    taskStatus: {
      type: Object,
      default: () => ({}),
    },
    // 任务类型
    taskType: {
      type: Object,
      default: () => ({}),
    },
    // 开始日期
    startDate: {
      type: String,
      default: '',
    },
    // 结束日期
    endDate: {
      type: String,
      default: '',
    },
    // 筛选组件是否可见
    screenVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update:taskStatus',
    'update:taskType',
    'update:startDate',
    'update:endDate',
    'update:screenVisible',
  ],
  setup(prop, context) {
    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;
    // 任务状态数组
    const taskStatusList = ref([]);
    // 任务类型数组
    const tempTaskTypeColumns = ref([]);
    const taskTypeColumns = ref([]);
    // 选中的任务状态
    const selectedTaskStatus = ref('');
    // 任务类型选择器是否可见
    const taskTypeVisible = ref(false);
    // 开始日期是否可见
    const startDateVisible = ref(false);
    // 结束日期是否可见
    const endDateVisible = ref(false);
    // 开始日期
    const currentStartDate = ref('');
    // 结束日期
    const currentEndDate = ref('');
    watch(currentStartDate, (newValue, oldValue) => {
      context.emit('update:startDate', newValue);
    });
    watch(currentEndDate, (newValue, oldValue) => {
      context.emit('update:endDate', newValue);
    });
    return {
      moment,
      taskStatusList,
      taskTypeColumns,
      tempTaskTypeColumns,
      selectedTaskStatus,
      taskTypeVisible,
      startDateVisible,
      endDateVisible,
      currentStartDate,
      currentEndDate,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
    };
  },
  data() {
    return {
    };
  },
  mounted() {
    this.getTaskStatus('event_task_status');
    this.getTaskStatus('event_task_type');
  },
  methods: {
    // 获取任务状态和任务类型
    getTaskStatus(pcode) {
      const request = {
        method: 'post',
        url: '/app/emergency/preparation/dictionary/getByParentCode',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          pcode,
        },
      };
      this.$http(request)
        .then((response) => {
          console.log('/app/emergency/preparation/dictionary/getByParentCode', response);
          if (response.errorcode === 0 && response?.data) {
            if (pcode === 'event_task_status') {
              this.taskStatusList = response.data;
            }
            if (pcode === 'event_task_type') {
              this.taskTypeColumns = response.data.map((item) => {return item.name});
              this.tempTaskTypeColumns = response.data;
            }
            this.$notify({
              type: 'success',
              message: `获取${pcode === 'event_task_status' ? '任务状态' : '任务类型'}数据成功`,
            });
          } else {
            this.$notify({
              type: 'danger',
              message: `获取${pcode === 'event_task_status' ? '任务状态' : '任务类型'}数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            });
          }
        })
        .catch((error) => {
          this.$notify({
            type: 'danger',
            message: `获取${pcode === 'event_task_status' ? '任务状态' : '任务类型'}数据失败`,
          });
        });
    },
    // 选择任务状态
    selectTaskStatus(item) {
      this.$emit('update:taskStatus', {id: item.id});
      this.selectedTaskStatus = item.name;
    },
    // 任务类型确认回调函数
    onTaskTypeConfirm(name, index) {
      console.log("name, index",name, index)
      this.$emit('update:taskType', {id: this.tempTaskTypeColumns[index].id, value: name});
      this.taskTypeVisible = false;
    },
    // 重置方法
    reset() {
      this.$emit('update:taskStatus', {id:''});
      this.$emit('update:taskType', {id:'', value: ''});
      this.$emit('update:startDate', '');
      this.$emit('update:endDate', '');
    },
  },
});
</script>
<style lang='scss' scoped>
  main {
    > section {
        overflow: auto;
        padding: 0rem 4%;
        margin: 0.05rem 0rem;
    }
    .task-status {
        margin: 0.1rem 0rem;
        position: relative;
      .task-status__label {
        color: #333333;
        font-size: 0.3rem;
        font-weight: 500;
        display: block;
        margin: 0.2rem 0rem 0.1rem 0rem;;
      }
      .task-status-button {
        margin: 0.05rem 0rem;
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        label {
            color: #333333;
            background: #F5F5F5;
            width: 28%;
            height: 0.7rem;
            line-height: 0.7rem;
            text-align: center;
            display: inline-block;
            margin: 0 3% 3% 0;
        }
        .task-status--active {
            background: rgba(0, 145, 255, 0.12);
            color: #0091FF;
        }
      }
    }
  }
  footer {
    position: absolute;
    bottom: 0%;
    width: 100%;
    .reset {
        display: inline-block;
        width: 50%;
        height: 0.9rem;
        line-height: 0.9rem;
        background: #E8F2FC;
        text-align: center;
        color: #0091FF;
        font-weight: 500;
        font-size: 0.3rem;
        cursor: pointer;
    }
    .confirm {
        display: inline-block;
        width: 50%;
        height: 0.9rem;
        line-height: 0.9rem;
        background: #0091FF;
        text-align: center;
        color: #FFFFFF;
        font-weight: 500;
        font-size: 0.3rem;
        cursor: pointer;
    }
  }
</style>
