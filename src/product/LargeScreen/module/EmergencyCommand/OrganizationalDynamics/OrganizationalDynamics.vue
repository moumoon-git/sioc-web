<template>
  <div :class="$style.OrganizationalDynamics">
    <h1>组织动态</h1>
    <!-- 顶部响应情况显示 -->
    <RotateCircle
      :class="$style.RotateCircles"
      width="660px"
      :rotate-circle-data="rotateCircleData"
    />
    <!-- 标题 -->
    <Title title="任务统计" tips="TASK STATISTICS"></Title>
    <div :class="$style.TaskStatistics">
      <!-- 完成度 -->
      <div :class="$style.completion">
        <Completion :list-data="taskStatisticsData" />
      </div>
      <!-- 表格 -->
      <div :class="$style.organizationFrom">
        <TaskForm :list-data="taskFormData" />
      </div>
    </div>
    <!-- 标题 -->
    <Title title="现场签到" tips="ON SITE SIGN IN"></Title>
    <!-- 签到情况 -->
    <div :class="$style.sign">
      <template v-if="$store.state.reservePlan?.currentReservePlan">
        <DateSwitcher
          :class="$style.dateSwitcher"
          :listen-event-change="true"
          @change="getAttendenceStat"
        />
        <Completion :class="$style.completions" :list-data="completionFirst" />
      </template>
      <EmptyHint v-else hint="暂未成立现场指挥部" />
    </div>
    <!-- 签到进度 -->
    <TaskProgress
      :class="$style.taskProgress"
      v-if="$store.state.reservePlan?.currentReservePlan"
      :list-data="listData"
    />
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, onMounted, watch } from 'vue';
// 顶部显示
import RotateCircle from '@/product/CommandBrain3.0/Generalparts/left/RotateCircle/RotateCircle.vue';
// 日期切换
import DateSwitcher from '@/product/CommandBrain3.0/Generalparts/left/DateSwitcher/DateSwitcher.vue';
// 暂无数据提示
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
// 表格
import TaskForm from '@/product/CommandBrain3.0/FunModule/LeftModule/components/organization/TaskForm.vue';
// 完成度
import Completion from '@/product/CommandBrain3.0/FunModule/LeftModule/components/organization/Completion.vue';
// 总体进度
import TaskProgress from '@/product/CommandBrain3.0/FunModule/LeftModule/components/organization/TaskProgress.vue';
// 业务
import OrganizationScript from '@/product/CommandBrain3.0/FunModule/LeftModule/components/organization/script/OrganizationScript';
// 标题
import Title from '@/product/LargeScreen/generalparts/Title/Title.vue';

export default defineComponent({
  components: {
    RotateCircle,
    DateSwitcher,
    EmptyHint,
    TaskForm,
    Completion,
    TaskProgress,
    Title,
  },
  setup(props) {
    const store = useStore(); // 使用vuex
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

    watch(
      () => store.state.event,
      (val) => {
        if (val) {
          const today = new Date();
          getAttendenceStat(`${today.getFullYear()
            }-${String(today.getMonth() + 1).padStart(2, '0')
            }-${String(today.getDate()).padEnd(2, '0')
            }`);
            init(val);
        }
      },
    );
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
    };
  },
});
</script>

<style lang="scss" module>
.OrganizationalDynamics {
  height: 100%;
  padding: 40px 35px 20px 35px;
  box-sizing: border-box;
  & > h1 {
    font-size: 60px;
    font-family: YouSheBiaoTiHei;
    color: #1bd8f2;
    line-height: 44px;
    letter-spacing: 2px;
    text-shadow: 0px 0px 13px rgba(10, 46, 57, 0.5);
  }
}
.RotateCircles {
  background: url('./assets/circleBgr.png') no-repeat;
  background-size: 100% 100%;
  height: calc(var(--getWidth) / 4.049);
  & > aside {
    & > ul {
      width: calc((100% / 2) / 2);
      &:first-child {
        margin-left: 30px;
      }
      &:last-child {
        margin-right: 30px;
      }
      & > li {
        & > span {
          font-size: 20px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.8);
        }
        & > div {
          & > p {
            font-size: 28px;
            font-family: DIN-Bold, DIN;
            font-weight: bold;
            color: #00ecff;
          }
          & > span {
            font-size: 17.28px;
            color: #00ecff;
          }
        }
      }
    }
  }
  & > div {
    width: calc(var(--getWidth) / 4.049) !important;
    & > div {
      & > div {
        &:nth-child(2) {
          & > img {
            width: 103%;
            height: 103%;
          }
        }
        &:nth-child(3) {
          & > img {
            margin-top: 10px;
            width: 30px;
          }
          & > span {
            &:nth-child(2) {
              font-size: 26px;
              font-weight: 400;
              color: #ffffff;
              width: 52px;
              white-space: pre-wrap;
            }
            &:last-child {
              cursor: auto;
            }
          }
        }
      }
    }
  }
}
.TaskStatistics {
  height: 285px;
  .completion {
    margin: 24px 0;
    & > div {
      & > ul {
        & > li {
          & > div {
            &:first-child {
              font-size: 28px;
              font-family: DIN-Bold, DIN;
              font-weight: bold;
              margin-bottom: 10px;
            }
            &:last-child {
              font-size: 16px;
              font-weight: 400;
              color: rgba(255, 255, 255, 0.8);
            }
          }
          &::after {
            height: 23px;
          }
        }
      }
    }
  }
  .organizationFrom {
    height: calc(100% - 76px);
    & > div {
      padding-top: 33px;
      & > h5 {
        padding: 6px 4px 6px 10px;
        font-size: 16px;
        font-weight: 500;
        color: #00ecff;
      }
      & li {
        padding: 6px 4px 6px 10px;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        &::before {
          height: 33px;
        }
      }
    }
  }
}
// 现场签到
.sign {
  display: flex;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px;
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
.dateSwitcher {
  display: flex;
  align-items: center;
  & > button {
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
    background: url('./assets/arrow.svg') no-repeat;
    background-size: 100% 100%;
    &:nth-child(1) {
      transform: rotate(180deg);
    }
  }
  & > span {
    font-size: 28px;
    font-family: DIN-Bold, DIN;
    font-weight: bold;
    color: #56e9ff;
    margin: 0 10px;
  }
}
.completions {
  ul {
    li {
      & > div {
        &:first-child {
          font-size: 28px;
          font-family: DIN-Bold, DIN;
          font-weight: bold;
          color: #56e9ff;
          margin-bottom: 10px;
        }
        &:last-child {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
        }
      }
      &::after {
        height: 23px;
      }
    }
  }
}
.taskProgress {
  height: 284px;
  & > ul {
    & > li {
      span {
        &:first-child {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
        }
        &:last-child {
          font-size: 16px;
          font-family: DIN-Bold, DIN;
          font-weight: bold;
          color: #56e9ff;
        }
      }
      & > div {
        width: 450px;
      }
    }
  }
}
</style>
