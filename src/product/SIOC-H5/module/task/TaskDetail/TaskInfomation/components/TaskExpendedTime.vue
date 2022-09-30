<!-- 组件：任务详情 —— 任务耗时 -->
<template>
  <div class="task-time-container">
    <!-- 任务未完成且还剩余时间 -->
    <template v-if="taskStatus === 'handling' && !taskIsOverTime">
      <!-- 有任务结束时间 -->
      <van-count-down v-if="taskEndTime" :time="taskDeadline" :format="format" class="text"/>
      <!-- 没有任务结束时间 -->
      <span v-else class="text">{{ timeDescription }}</span>
    </template>

    <!-- 任务未完成且超时 | 任务已完成 -->
    <template
      v-else-if="
        (taskStatus === 'handling' && taskIsOverTime) ||
          taskStatus === 'finished' ||
          taskStatus === 'cancel'
      "
    >
      <span class="text">{{ timeDescription }}</span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TaskExpendedTime',
  props: {
    // van-count-down倒计时的格式
    format: {
      type: String,
      default: '剩余：DD 天 HH 时 mm 分 ss 秒' , 
    },

    // 任务状态：handling(处理中)，finished(已完成)，cancel(已取消)
    taskStatus: {
      type: String,
      default: '',
    },

    // 任务是否超时
    taskIsOverTime: {
      type: Boolean,
      default: false,
    },

    // 描述：`剩余：${time}` | `用时：${time}`
    timeDescription: {
      type: String,
      default: '',
    },

    // 任务截止时间
    taskDeadline: {
      type: String,
      default: '',
    },

    // 是否有任务结束时间
    taskEndTime: {
      type: Boolean,
      default: true,
    }
  },
});
</script>
<style lang="scss">
@import '../../assets/css/common'; /*引入公共样式*/

.task-time-container {
  line-height: 0.5rem;

  .text {
    font-size: $font_size_1 !important;
    color: $warning_color !important;
    height: 100%;
    line-height: 0.5rem;
  }
}
</style>
