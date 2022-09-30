<template>
  <div style="display: none;">
    <div ref="container">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DialogBoat',
  inject: [
    '$addDialog',
  ],
  props: {
    // 标题
    title: {
      type: String,
      default: '弹窗标题',
    },
  },
  data() {
    return {
      closeCallback: null,
      hideCallback: null,
      unhideCallback: null,
    };
  },
  methods: {
    /**
     * 打开弹窗
     */
    open() {
      this.close();
      const callback = (this as any).$addDialog(this.title, this.$refs.container);
      this.closeCallback = callback.close;
      this.hideCallback = callback.hide;
      this.unhideCallback = callback.unhide;
    },
    /**
     * 关闭弹窗
     */
    close() {
      if (this.closeCallback) {
        (this.closeCallback as any)();
        this.closeCallback = null;
      }
    },
    /**
     * 隐藏弹窗
     */
    hide() {
      if (this.hideCallback) {
        (this.hideCallback as any)();
      }
    },
    /**
     * 取消隐藏弹窗
     */
    unhide() {
      if (this.unhideCallback) {
        (this.unhideCallback as any)();
      }
    },
  },
});
</script>
