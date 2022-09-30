<template>
  <section :class="$style['task-schedule-list-header']">
    <!-- 全部任务 -->
    <div :class="$style.title" @click.stop="showType">
      <label>{{
        `${taskTypeTitle}（${eventTaskStatistic?.total ?? 0}）`
      }}</label>
      <Arrow
        :reverse="show_type"
        :class="$style['visualization-task-title__arrow']"
      />
      <!-- 下拉选择器 -->
      <List
        v-show="show_type"
        :class="$style.visualization_type"
        :list-data="taskType"
        @click="changeType"
      />
    </div>
    <!-- 任务状态 -->
    <div style="display: flex; justify-content: space-around; margin-top: 16px">
      <div :class="$style['task-status']">
        <label>{{ eventTaskStatistic?.total ?? 0 }}</label>
        <span>任务总数</span>
      </div>
      <div :class="$style['task-status']">
        <label>{{ eventTaskStatistic?.finished ?? 0 }}</label>
        <span>已完成</span>
      </div>
      <div :class="$style['task-status']">
        <label>{{ eventTaskStatistic?.handling ?? 0 }}</label>
        <span>执行中</span>
      </div>
      <div :class="$style['task-status']">
        <label>{{ eventTaskStatistic?.rate ?? 0 }}%</label>
        <span>完成率</span>
      </div>
    </div>
    <!-- 实时动态和任务列表 -->
    <div style="display: flex; justify-content: space-evenly">
      <div :class="$style['task-button']" @click="publishTask">发布任务</div>
      <!-- <div
        :class="$style['task-button']"
        @click="taskPanorama"
      >
        任务全景
      </div> -->
    </div>
  </section>
</template>

<script>
import {
  defineComponent,
  inject,
  getCurrentInstance,
  onBeforeUnmount,
} from 'vue';
import Arrow from '@/product/CommandBrain3.0/Generalparts/header/Arrow/Arrow.vue';
import List from '@/product/CommandBrain3.0/Generalparts/header/List/List.vue';

export default defineComponent({
  name: 'TaskScheduleListHeader',
  components: {
    Arrow,
    List,
  },
  emits: [
    'publishTask',
    'taskPanorama',
    'getRealTimeDynamicList',
    'getTaskList',
  ],
  setup() {
    const instance = getCurrentInstance();
    const { $ws } = instance?.appContext.config.globalProperties;
    // 事件任务状态变更，刷新数据
    const uns = $ws.subscribe(
      `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
      (msg) => {
        if (msg?.msgType === 60005) {
          instance.proxy.getTaskList();
        }
      },
    );
    onBeforeUnmount(uns);
    const reservePlanTask = inject('reservePlanTask');
    return {
      reservePlanTask,
    };
  },
  data() {
    return {
      // 任务统计
      eventTaskStatistic: {
        total: 0,
        finished: 0,
        handling: 0,
        rate: 0,
      },
      searchType: 0,
      // 下拉框的选项
      show_type: false,
      taskType: [], // 任务类型
      taskTypeTitle: '全部任务', // 当前选择任务类型
    };
  },
  mounted() {
    this.getTaskStatistics();
    this.getTaskType();
  },
  methods: {
    // 获取任务统计
    getTaskStatistics() {
      let taskId = '';
      const request1 = {
        method: 'post',
        service: 'eoc',
        url: '/emergency/preparation/dictionary/getByCodeAndParentCode',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          pcode: 'event_task_type',
          code: 'preplan',
        },
      };
      this.$http(request1)
        .then((response1) => {
          taskId = response1.data.id;
        })
        .then(() => {
          let request;
          if (this.reservePlanTask === 'reservePlanTask') {
            request = {
              method: 'get',
              service: 'eoc',
              url: '/event/info/eventTaskStatisticByType',
              params: {
                eventId: this.$store.state.event?.id,
                type: taskId,
              },
            };
          } else {
            request = {
              method: 'get',
              service: 'eoc',
              url: '/event/info/eventTaskStatistic',
              params: {
                eventId: this.$store.state.event?.id,
              },
            };
          }
          this.$http(request)
            .then((response) => {
              console.log('/event/event/info/eventTaskStatistic', response);
              if (response.errorcode === 0 && response?.data) {
                if (this.reservePlanTask === 'reservePlanTask')
                  this.eventTaskStatistic = response.data;
                else this.eventTaskStatistic = response.data.total;
              } else {
                this.$message.error(
                  `获取任务统计数据失败，错误代码${response.code}，错误信息：${response.msg}`,
                );
              }
            })
            .catch((error) => {
              this.$message.error(`获取任务统计数据失败，错误信息：${error}`);
            });
        });
    },
    publishTask() {
      this.$emit('publishTask');
    },
    // 任务类型下拉框
    showType() {
      this.show_type = !this.show_type;
    },
    taskPanorama() {
      this.$emit('taskPanorama');
    },
    // 获取任务类型
    getTaskType() {
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/emergency/preparation/dictionary/getByParentCode',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          pcode: 'event_task_type',
        },
      };
      this.$http(request).then((response) => {
        // this.taskType = response ? response.data : [];
        this.taskType = response?.data ?? [];
        this.taskType.unshift({
          id: '',
          name: '全部任务',
        });
      });
    },
    changeType(type) {
      this.taskTypeTitle = type.name;
      this.$emit('getRealTimeDynamicList', type.id);
      this.$emit('getTaskList', type.id);
    },
  },
});
</script>

<style lang="scss" module>
.task-schedule-list-header {
  position: relative;
  height: 100%;
  margin-bottom: 20px;
  .title {
    font-size: 18px;
    color: #00ecff;
    text-align: center;
    padding-top: 5px;
    background: rgba(132, 160, 193, 0.2);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 27px;
    .visualization-task-title__arrow {
      bottom: -5%;
    }
    label {
      cursor: pointer;
      line-height: 32px;
    }
    .visualization_type {
      width: 200px;
      position: absolute;
      left: 50%;
      top: 50px;
      z-index: 1;
      transform: translate(-50%, 0);
    }
    &::after {
      content: '';
      border-top: 10px solid rgba(132, 160, 193, 0.2);
      border-left: 30px solid transparent;
      border-right: 30px solid transparent;
      height: 0;
      width: 200px;
      position: absolute;
      bottom: -32%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .task-status {
    margin: 5px 10px 5px 0px;
    display: inline-block;
    text-align: center;
    position: relative;
    &:nth-of-type(4) {
      label {
        color: #f7b500;
      }
    }
    label {
      display: block;
      font-size: 18px;
      color: #56e9ff;
    }
    span {
      display: block;
      font-size: 14px;
      color: #ffffff;
    }
    &:not(.task-status:nth-of-type(4))::after {
      content: '';
      width: 1px;
      height: 20px;
      background: #e6e6e6;
      position: absolute;
      right: -50%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .task-button {
    border: 1px solid #00c1de;
    font-size: 14px;
    color: #00c1de;
    display: inline-block;
    padding: 5px 60px;
    cursor: pointer;
  }
}
</style>
