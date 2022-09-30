<!--组件：导航栏-->
<template>
  <div ref="navBarRef" class="nav-bar-container">
    <van-nav-bar :title="config.title" left-arrow @click-left="handleClickLeft">
      <template #left>
        <img
          v-if="config.type === 'close'"
          src="./assets/svg/close.svg"
          alt=""
          :class="$style.leftImg"
        />
        <img v-else-if="config.type === 'left'" src="./assets/svg/left.svg" alt="" :class="$style.leftImg" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'NavBar',
  props: {
    config: {
      type: Object,
      default: () => ({
        title: '',
        type: 'close',
        path: '',
      }),
    },
    /**
     * @description 重置跳转的方法
     */
    resetBack: {
      type: Boolean,
      default: false,
    }
  },
  emits: {
    back: null,
  },
  setup(props, {emit}) {
    const router = useRouter();
    /**
     * @description 点击左边按钮触发
     */
    function handleClickLeft() {
      // 关闭当前页面
      if (!props.resetBack) {
        if (props.config.type === 'close') {
          window.location.href = 'about:blank';
          window.close();
        } else {
          if (props.config.path !== '') {
            router.push({
              path: props.config.path,
            });
          } else {
            router.go(-1);
          }
        }
      } else {
        emit('back')
      }
    }
    return {
      handleClickLeft,
    };
  },
});
</script>

<style lang="scss" module>
.leftImg {
  width: 0.32rem;
  height: 0.32rem;
}
</style>

<style lang="scss">
.nav-bar-container {
  width: 100%;
  height: 0.88rem;

  // 导航栏
  .van-nav-bar {
    // position: fixed;
    // top: 0;
    // left: 0;
    width: 100%;
    height: 100%;

    .van-nav-bar__content {
      width: 100%;
      height: 100%;

      .van-nav-bar__title {
        font-size: 0.36rem;
        font-weight: 500;
        color: #333333;
        line-height: 0.5rem;
      }

      .van-nav-bar__left {
        padding: 0 0.32rem;
      }
    }
  }
}
</style>
