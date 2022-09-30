<template>
  <div :class="$style.organization">
    <!-- 顶部响应情况显示 -->
    <RotateCircle
      style="margin: 0 auto"
      :rotate-circle-data="rotateCircleData"
    />
    <!-- 任务统计 -->
    <Title title="任务统计">
      <span
        v-if="$store.state.reservePlan?.currentReservePlan"
        :class="$style.seeSpan"
        @click="$tabModules({ icon: 'task' })"
      >
        查看
      </span>
      <span v-else :class="[$style.seeSpan, $style.seeSpanDisabled]">
        查看
      </span>
    </Title>
    <!-- 完成度 -->
    <div :class="$style.completion">
      <Completion :list-data="taskStatisticsData" />
    </div>
    <!-- 表格 -->
    <div :class="$style.organizationFrom">
      <TaskForm :list-data="taskFormData" />
    </div>
    <!-- 现场签到 -->
    <Title title="现场签到">
      <span
        v-if="$store.state.reservePlan?.currentReservePlan"
        :class="$style.seeSpan"
        @click="handleOpenSignDialog"
      >
        查看
      </span>
      <span v-else :class="[$style.seeSpan, $style.seeSpanDisabled]">
        查看
      </span>
    </Title>
    <!-- 签到情况 -->
    <div :class="$style.sign">
      <template v-if="$store.state.reservePlan?.currentReservePlan">
        <DateSwitcher
          :class="$style.dateSwitcher"
          :listen-event-change="true"
          @change="getAttendenceStat"
        />
        <Completion :list-data="completionFirst" />
      </template>
      <EmptyHint v-else hint="暂未成立现场指挥部" />
    </div>
    <!-- 签到进度 -->
    <TaskProgress
      v-if="$store.state.reservePlan?.currentReservePlan"
      :list-data="listData"
    />
    <!-- 现场标绘 + 周边信息 -->
    <Title :title="['现场标绘', '周边信息']" @change="tabScene" />
    <!-- 悬浮小点 -->
    <Facilities
      :list-data="currentIndex === 0 ? classificationStat : resourceStat"
    />
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import {
  defineComponent,
  ref,
  getCurrentInstance,
  onMounted,
  inject,
  onBeforeUnmount,
} from 'vue';
// 蓝色标题
import Title from '@/product/CommandBrain3.0/Generalparts/left/Title/Title.vue';
// 顶部显示
import RotateCircle from '@/product/CommandBrain3.0/Generalparts/left/RotateCircle/RotateCircle.vue';
// 日期切换
import DateSwitcher from '@/product/CommandBrain3.0/Generalparts/left/DateSwitcher/DateSwitcher.vue';
// 现场签到弹窗
import ReservePlanSign from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanSign/ReservePlanSign.vue';
// 暂无数据提示
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
// import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';
// 底下显示
import Facilities from './organization/Facilities.vue';
// 表格
import TaskForm from './organization/TaskForm.vue';
// 完成度
import Completion from './organization/Completion.vue';
// 总体进度
import TaskProgress from './organization/TaskProgress.vue';
// 业务
import OrganizationScript from './organization/script/OrganizationScript';

export default defineComponent({
  components: {
    Title,
    RotateCircle,
    Completion,
    TaskProgress,
    Facilities,
    TaskForm,
    DateSwitcher,
    EmptyHint,
  },
  inject: ['$tabModules'],
  setup(props) {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http, $message, $ws }: any =
      instance?.appContext.config.globalProperties;
    const store = useStore(); // 使用vuex
    const $addDialog: any = inject('$addDialog');
    const {
      rotateCircleData,
      taskStatisticsData,
      taskFormData,
      completionFirst,
      listData,
      currentIndex,
      classificationStat,
      resourceStat,
      currentDate,
      tabScene,
      getRotateCircleData,
      getTaskStatistics,
      getAttendenceStat,
      getClassificationStat,
      getResourceStat,
      init,
    } = OrganizationScript();
    // 事件任务状态变更，刷新数据
    const uns = $ws.subscribe(
      `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
      (msg: any) => {
        if (msg?.msgType === 60005) {
          init(store.state.event);
        }
      },
    );
    onBeforeUnmount(uns);
    /**
     * 打开现场签到弹窗
     */
    function handleOpenSignDialog() {
      if (store.state.reservePlan.sceneMsg === null) {
        $message.error('请先成立现场指挥部再签到！');
        return;
      }
      $addDialog('现场签到', ReservePlanSign);
    }
    onMounted(() => {
      const today = new Date();
      getAttendenceStat(`${today.getFullYear()
        }-${String(today.getMonth() + 1).padStart(2, '0')
        }-${String(today.getDate()).padEnd(2, '0')
      }`);
      init(store.state.event);
    });
    return {
      rotateCircleData,
      taskStatisticsData,
      taskFormData,
      completionFirst,
      listData,
      currentIndex,
      classificationStat,
      resourceStat,
      currentDate,
      tabScene,
      getRotateCircleData,
      getTaskStatistics,
      getAttendenceStat,
      getClassificationStat,
      getResourceStat,
      init,
      handleOpenSignDialog,
    };
  },
});
</script>

<style lang="scss" module>
.organization {
  padding: 12px 20px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
.organizationFrom {
  height: 22.78%;
  margin-bottom: 1%;
}
.seeSpan {
  font-size: 14px;
  font-weight: 600;
  color: #00ecff;
  cursor: pointer;
  margin-left: 50px;
  &.seeSpanDisabled {
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
  }
}
.completion {
  height: 44px;
  margin-top: 10px;
}
// 现场签到
.sign {
  display: flex;
  align-items: center;
  margin: 10px 0;
  .dateSwitcher {
    flex-shrink: 0;
    margin-right: 20px;
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 1px;
      height: 38px;
      background: linear-gradient(to bottom, transparent, #fff, transparent);
      position: absolute;
      right: -15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
