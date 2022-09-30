// 弹窗坞专用弹窗，可拖拽、最小化
<template>
  <div
    ref="dialog"
    :class="[
      'visualization-dock-dialog',
      { 'visualization-dock-dialog--hidden': isHidden },
    ]"
    :style="{'--zoom-ratio': scaleRatio}"
    tabindex="-1"
    @click.stop
  >
    <!-- 标题栏 -->
    <header
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseout="handleMouseUp"
    >
      {{ title }}
      <button @click.stop="handleHide" />
      <button @click.stop="$emit('close')" />
    </header>
    <!-- 内容挂载点 -->
    <main ref="container">
      <component
        v-bind="props"
        :is="asyncComp"
        :operation="operation"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, shallowRef, ref } from 'vue';

export default defineComponent({
  name: 'Dialog',
  props: {
    title: {
      type: String,
      default: 'title',
    },
    operation: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'close',
    'hide',
  ],
  setup() {
    const asyncComp = shallowRef<any>('');
    const props = ref<any>({});
    const setAsyncComp = (comp: any, customProps: any) => {
      asyncComp.value = comp;
      props.value = customProps || {};
    };
    return {
      asyncComp,
      setAsyncComp,
      props,
    };
  },
  data() {
    return {
      divX: 0,
      divY: 0,
      isHidden: false,
      // 最小化缩小比率
      scaleRatio: 0.3,
    };
  },
  watch: {
    // 取消隐藏时获取焦点
    isHidden(val) {
      if (!val) {
        (this.$refs.dialog as HTMLElement).focus();
      } else {
        // 计算缩小比率
        const dialog = this.$refs.dialog as HTMLElement;
        const width = dialog.offsetWidth;
        const height = dialog.offsetHeight;
        if (width > height) {
          this.scaleRatio = Number((76 / width).toFixed(2));
        } else {
          this.scaleRatio = Number((76 / height).toFixed(2));
        }
      }
    },
  },
  mounted() {
    setTimeout(() => {
      const dialog = this.$refs.dialog as HTMLElement;
      dialog.style.left = `${dialog.offsetLeft - dialog.offsetWidth / 2}px`;
      dialog.style.top = `${dialog.offsetTop - dialog.offsetHeight / 2}px`;
      dialog.focus();
      // 计算缩小比率
      const width = dialog.offsetWidth;
      const height = dialog.offsetHeight;
      if (width > height) {
        this.scaleRatio = Number((76 / width).toFixed(2));
      } else {
        this.scaleRatio = Number((76 / height).toFixed(2));
      }
    }, 0);
  },
  methods: {
    /**
     * 鼠标左键按下，开始拖动
     */
    handleMouseDown(event: MouseEvent) {
      const dialog = this.$refs.dialog as HTMLElement;
      dialog.style.left = `${dialog.offsetLeft}px`;
      dialog.style.top = `${dialog.offsetTop}px`;
      dialog.style.cursor = 'move';
      this.divX = dialog.offsetLeft - event.x;
      this.divY = dialog.offsetTop - event.y;
      document.addEventListener('mousemove', this.handleMouseMove, true);
    },
    /**
     * 鼠标左键松开，结束拖动
     */
    handleMouseUp() {
      const dialog = this.$refs.dialog as HTMLElement;
      dialog.style.cursor = 'default';
      document.removeEventListener('mousemove', this.handleMouseMove, true);
    },
    /**
     * 鼠标移动，修改弹窗定位
     */
    handleMouseMove(event: MouseEvent) {
      const dialog = this.$refs.dialog as HTMLElement;
      // 限制弹窗极限位置
      let newX = event.x + this.divX;
      if (newX < 0) {
        newX = 0;
      }
      if (newX > document.body.clientWidth - dialog.offsetWidth) {
        newX = document.body.clientWidth - dialog.offsetWidth;
      }
      let newY = event.y + this.divY;
      if (newY < 0) {
        newY = 0;
      }
      if (newY > document.body.clientHeight - dialog.offsetHeight) {
        newY = document.body.clientHeight - dialog.offsetHeight;
      }
      dialog.style.left = `${newX}px`;
      dialog.style.top = `${newY}px`;
    },
    /**
     * 隐藏弹窗
     */
    handleHide() {
      this.isHidden = true;
      this.$emit('hide');
    },
  },
});
</script>

<style lang="scss">
.visualization-dock-dialog {
  position: fixed;
  left: 50vw;
  top: 50vh;
  background: rgba(20, 29, 31, .90);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-sizing: border-box;
  outline: none;
  z-index: 50;
  cursor: default;
  &:focus,
  &:focus-within {
    z-index: 51;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.8);
    border-color: #00C1DE;
  }
  & > header {
    user-select: none;
    height: 50px;
    line-height: 50px;
    padding: 0 60px 0 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    color: #FFFFFF;
    font-size: 18px;
    font-weight: 500;
    position: relative;
    & > button {
      background: no-repeat center/100% url(./assets/minifier.svg);
      width: 16px;
      height: 16px;
      cursor: pointer;
      border: none;
      outline: none;
      vertical-align: middle;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 40px;
      &:hover {
        background-image: url(./assets/minifier-hover.svg);
      }
      &:last-child {
        right: 15px;
        background-image: url(./assets/close.svg);
        &:hover {
          background-image: url(./assets/close-hover.svg);
        }
      }
    }
  }
  // 弹窗最小化
  &--hidden {
    position: static;
    zoom: 0.3;
    zoom: var(--zoom-ratio);
    pointer-events: none;
    margin: auto;
  }
}
</style>
