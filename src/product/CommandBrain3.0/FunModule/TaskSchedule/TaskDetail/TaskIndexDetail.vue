<template>
  <div class="detail__taskindex">
    <div class="detail__taskindex__top">
      <div
        class="detail__taskindex__top__back"
        @click="goBack"
      >
        返回
      </div>
      <div class="detail__taskindex__top__title">
        {{ taskInfo.title }}
      </div>
      <div class="detail__taskindex__top__status">
        {{ taskInfo.statusName }}
      </div>
    </div>
    <div class="detail__taskindex__tab">
      <a
        class="detail__taskindex__tab__item"
        :class="{ 'detail__taskindex__tab__item--active': panelId === 1 }"
        @click="panelId = 1"
      >基本信息</a>
      <a
        class="detail__taskindex__tab__item"
        :class="{ 'detail__taskindex__tab__item--active': panelId === 2 }"
        @click="panelId = 2"
      >情报文件</a>
      <a
        class="detail__taskindex__tab__item"
        :class="{ 'detail__taskindex__tab__item--active': panelId === 3 }"
        @click="panelId = 3"
      >任务动态</a>
    </div>
    <div class="detail__taskindex__content">
      <transition
        name="component-fade"
        mode="out-in"
      >
        <component
          :is="currentTabComponent"
          :task-id="taskId"
          :task-type="taskInfo.statusCode"
          @change="changeStatus"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TaskInfomation from './TaskInfomation.vue';
import TaskFile from './TaskFile.vue';
import TaskDynamic from './TaskDynamic.vue';

export default defineComponent({
  name: '',
  components: {
    TaskInfomation, // 基本信息
    TaskFile, // 情报文件
    TaskDynamic, // 任务动态
  },
  props: {
    taskId: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      panelId: 1, // 1基本信息,2文件，3动态
      taskInfo: {}, // 任务信息
    };
  },
  computed: {
    /**
    * @desc 动态组件
    * @param {} params
    * @returns {} returns
    */
    currentTabComponent() {
      switch (this.panelId) {
        case 1:
          return TaskInfomation;
        case 2:
          return TaskFile;
        case 3:
          return TaskDynamic;
        default:
          return TaskInfomation;
      }
    },
  },
  watch: {
    taskId: {
      handler(val) {
        this.getTaskInfo(val);
      },
      deep: true,
      immediate: true,
    },
    panelId: {
      handler(val) {
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
    * @desc 获取任务详情
    * @param {
    * @taskId 任务id
    * }
    * @returns {} returns
    */
    getTaskInfo(taskId: any) {
      const param = {
        taskId,
      };
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/event/task/getTaskDetail',
        headers: {
          'Content-Type': 'application/json',
        },
        data: param,
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          this.taskInfo = response.data;
        })
        .catch((error: any) => {
          (this as any).$message.error(
            `获取任务基本信息失败，错误信息：${error}`,
          );
        });
    },
    /**
    * @desc 改变任务状态
    * @param {}
    * @returns {} returns
    */
    changeStatus() {
      this.getTaskInfo(this.taskId);
    },
    /**
    * @desc 返回
    * @param {} params
    * @returns {} returns
    */
    goBack() {
      this.$emit('showDetail');
    },
  },
});
</script>

<style  lang="scss">
.detail__taskindex {
  width: 100%;
  height: 100%;
  .detail__taskindex__top {
    width: 390px;
    height: 40px;
    background: url(./assets/title.svg) no-repeat;
    margin-bottom: 10px;
    display: flex;
    .detail__taskindex__top__back {
      width: 91px;
      line-height: 27px;
      text-align: center;
      color: #fff;
      cursor: pointer;
      background: url(./assets/back.svg) no-repeat;
      background-position: 17% 22%;
    }
    .detail__taskindex__top__title {
      color: #00ecff;
      font-size: 18px;
      width: 216px;
      text-align: center;
      line-height: 40px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .detail__taskindex__top__status {
      width: 91px;
      color: #00ecff;
      line-height: 29px;
      text-align: center;
    }
  }
  .detail__taskindex__tab {
    width: 100%;
    height: 32px;
    display: flex;
    flex-wrap: nowrap;
    color: #a6adb4;
    background: linear-gradient(
      90deg,
      rgba(0, 193, 222, 0.3) 0%,
      rgba(24, 38, 50, 0) 100%
    );
    > a:nth-child(3) {
      border: 0;
    }
    .detail__taskindex__tab__item {
      width: 33.33%;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      font-size: 16px;
      border-right: 1px solid rgba(86, 233, 255, 0.29);
      &:active {
        color: rgba(0, 236, 255, 1);
      }
    }
    .detail__taskindex__tab__item--active {
      background: linear-gradient(
        90deg,
        rgba(0, 193, 222, 0.38) 50%,
        rgba(24, 38, 50, 0.38) 100%
      );
      // opacity: 0.38;
      color: rgba(0, 236, 255, 1);
    }
  }
  .detail__taskindex__content {
    // width: 360px;
    width: 100%;
    // height: 816px;
    margin: 0 auto;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to {
    opacity: 0;
  }
}
</style>
