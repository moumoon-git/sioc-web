<!--组件：动作完成的状态-->
<template>
  <div class="status-container">
    <div :class="$style.statusContainerBody">
      <img
        v-if="config.actionState === 'success'"
        src="./assets/svg/success.svg"
        alt=""
        :class="$style.status"
      >
      <img
        v-else
        src="./assets/svg/fail.svg"
        alt=""
        :class="$style.status"
      >
      <div :class="$style.statusText">
        {{ config.actionStateText }}
      </div>
      <Button
        v-if="showButton"
        style="width:6.4rem; height:0.88rem;line-height:0.88rem;"
        @click="handleJumpTo"
        >{{ config.buttonText }}</Button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router';
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';
export default defineComponent({
  name: 'Status',
  components: {
    Button,
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        actionState: 'success', // 动作的状态：完成/失败
        actionStateText: '成功', // 动作的描述
        buttonText: '返回首页', // 按钮-文本
        buttonPath: '' // 按钮-跳转路径
      })
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    jump: null
  },
  setup(props, {emit}) {
    const router = useRouter();
    /**
     * @description 跳转
     */
    function handleJumpTo() {
      if (props.config.buttonPath && props.config.buttonPath !== '') {
        router.push({
          path: props.config.buttonPath
        })
      }
      emit('jump')
    }

    return {
      handleJumpTo
    }
  }
})
</script>
<style lang="scss">
.status-container {

  .van-button {
    width: 6.4rem;
    height: 0.88rem;
    background: linear-gradient(360deg, #2B80FF 0%, #65BCFF 100%);
    box-shadow: 0rem 0.06rem 0.12rem 0rem rgba(12, 126, 161, 0.35);
    border-radius: 0.75rem;
    font-size: 0.36rem;
    font-weight: 400;
    color: #FFFFFF;
  }
  :deep( .van-nav-bar__title ) {
    font-size: 0.36rem;
  }
}
</style>
<style lang="scss" module>
.statusContainerBody {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
}
.imgClose {
  width: 0.32rem;
  height: 0.32rem;
}
.status {
  width: 2rem;
  height: 2rem;
}
.statusText {
  font-size: 0.4rem;
  font-weight: 500;
  color: #333333;
  line-height: 0.56rem;
  margin: 0.5rem 0 1.3rem 0.13rem;
}
</style>