<template>
  <!-- 拉伸窗 -->
  <div
    ref="container"
    class="msg-dialog"
  >
    <!-- <span @click.stop="isWin = !isWin">
      <slot>
        <button />
      </slot>
    </span> -->
    <teleport to="body">
      <div
        :style="`top: ${y}px; left: ${x}px;`"
        :class="['msg-dialog__win', { 'msg-dialog__win--show': isWin }]"
      >
        <!-- 套入主体 -->
        <MsgDialog />
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 主体
import MsgDialog from '../MsgDialog.vue';

export default defineComponent({
  name: 'ScaleWin',
  components: {
    // 主体
    MsgDialog,
  },
  data() {
    return {
      isWin: false,
      x: 0,
      y: 0,
    };
  },
  watch: {
    isWin(val) {
      if (val) {
        const container = this.$refs.container as HTMLElement;
        this.x = container.getBoundingClientRect().x;
        this.y = container.getBoundingClientRect().y;
        document.body.addEventListener('click', this.clickOuterHandler, true);
      } else {
        document.body.removeEventListener('click', this.clickOuterHandler, true);
      }
    },
  },
  methods: {
    /**
     * 点击外部，关闭悬浮气泡
     *
     * @param {MouseEvent} event 点击事件
     */
    clickOuterHandler(event: MouseEvent): void {
      if (!(this.$refs.container as HTMLElement).contains(event.target as HTMLElement)) {
        // this.isWin = false;
      }
    },
  },
});
</script>

<style lang="scss">
.msg-dialog {
  display: inline-block;
  vertical-align: sub;
  position: relative;
  // & > span > button:first-child {
  //   position: relative;
  //   top: 1px;
  //   border: none;
  //   outline: none;
  //   margin: 0;
  //   padding: 0;
  //   width: 20px;
  //   height: 20px;
  //   cursor: pointer;
  //   background: no-repeat center/auto 100% url(./assets/info.svg);
  //   &:hover {
  //     opacity: 0.7;
  //   }
  // }
  // 气泡框
  &__win {
    user-select: none;
    display: inline-block;
    position: fixed;
    transform: translate(-185px, 45px) scale(0);
    transform-origin: top;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.5);
    border: 1px solid #00c1de;
    transition: transform 0.3s;
    z-index: 999999999;
    &--show {
      transform: translate(-370px, 45px) scale(1);
    }
    // 顶部三角形
    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      border-left: 1px solid #00c1de;
      border-top: 1px solid #00c1de;
      background: rgba(0, 0, 0, 0.8);
      position: absolute;
      top: -6px;
      left: 95%;
      transform: translateX(-50%) rotate(45deg);
    }
  }
}
</style>
