<template>
  <div class="task-details-information_footer-container">
    <!-- 修订、转发 R1版本不做 -->
    <!-- <div class="footer-container_left-side">
        <div class="ordinary_button">
          <span class="icon-edit"></span>
          <span>修订</span>
        </div>
        <div class="ordinary_button">
          <span class="icon-transform"></span>
          <span>转发</span>
        </div>
      </div> -->

    <div class="footer-container_right-side">
      <div v-if="taskStatus === 'handling'">
        <van-button type="default" size="large" class="cancel" @click="cancelTask"
          >取消任务</van-button
        >
        <van-button type="primary" size="large" @click="finishTask">完成任务</van-button>
      </div>
      <!-- 重启任务先不做 -->
      <div v-else>
        <van-button
          type="primary"
          size="large"
          @click="reStartTask"
          style="width: 100%"
          >重启任务</van-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TaskInfoFooter',
  props: {
    // 任务状态：handling(执行中),finished(),cancel()
    taskStatus: {
      type: String,
      default: '',
    },
  },
  emits: {
    cancelTask: null,
    finishTask: null,
    reStartTask: null,
  },
  setup(props, { emit }) {
    /**
     * @description 取消任务
     */
    function cancelTask() {
      emit('cancelTask');
    }
    /**
     * @description 完成任务
     */
    function finishTask() {
      emit('finishTask');
    }
    /**
     * @description 重启任务
     */
    function reStartTask() {
      emit('reStartTask');
    }

    return {
      cancelTask,
      finishTask,
      reStartTask,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/css/common'; /*引入公共样式*/

.task-details-information_footer-container {
  // 左侧边按钮
  .footer-container_left-side {
    width: 2.06rem;
    @extend .flex_style;
    justify-content: space-around;
    align-items: center;
    position: relative;
    padding: 0 0.26rem;
    cursor: pointer;
    span {
      font-size: $font_size_2;
      color: $color_4;
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      right: 0;
      top: 0.32rem;
      height: 0.64rem;
      width: 0.01rem;
      background: $color_1;
    }
  }

  // 右侧边按钮
  .footer-container_right-side {
    flex: 1;
  }

  :deep(.van-button) {
    height: 1.12rem;
    width: 50%;
    font-size: 0.3rem;
  }
  :deep(.van-button__text) {
    font-size: 0.3rem;
  }
  :deep(.van-button--default) {
    border-color: transparent;
  }
  :deep(.cancel .van-button__text) {
    color: $error_color;
  }
}
</style>
