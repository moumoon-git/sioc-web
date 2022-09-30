<template>
    <section style="text-align: center;">
        <i class="operation-feedback-icon"></i>
        <label class="operation-feedback-label">{{ feedbackLabel }}</label>
        <div class="operation-feedback-button">返回任务详情</div>
    </section>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'TaskOperationFeedback',
  components: {
  },
  props: {
    // 反馈状态
    feedbackStatus: {
      type: String,
      default: 'success',
    },
    // 反馈文字
    feedbackLabel: {
      type: String,
      default: '转发成功',
    }
  },
  setup(prop, context) {
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },
});
</script>
<style lang='scss' scoped>
    .operation-feedback-icon {
        display: block;
        margin-top: 15%;
        width: 1rem;
        height: 1rem;
        display: inline-block;
        background: url(../assets/successIcon.svg) no-repeat 0rem/1rem;
    }
    .operation-feedback-label {
        display: block;
        color: #333333;
        font-size: 0.2rem;
        font-weight: bold;
        margin-top: 5%;
    }
    .operation-feedback-button {
        color: #FFFFFF;
        background: linear-gradient(360deg, #2B80FF 0%, #65BCFF 100%);
        box-shadow: 0rem 0.06rem 0.12rem 0rem rgba(12, 126, 161, 0.35);
        border-radius: 0.75rem;
        margin-top: 20%;
        width: 80%;
        display: inline-block;
        font-size: 0.2rem;
        padding: 0.1rem;
    }
</style>
