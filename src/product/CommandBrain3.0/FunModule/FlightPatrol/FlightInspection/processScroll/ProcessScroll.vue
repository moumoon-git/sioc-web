<template>
  <div class="scrolldiv">
    <div
      ref="scroll"
      class="scrolldiv__scroll"
    >
      <div
        ref="bar"
        class="scrolldiv__scroll__bar"
      />
      <div
        ref="mask"
        class="scrolldiv__scroll__mask"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProcessScroll',
  props: {
    type: {
      type: String,
      default: () => '',
    },
  },
  emits: ['change-num-point', 'change-num-line', 'change-num-area'],
  data() {
    return {
      barLeft: Number,
    };
  },
  mounted() {
    const scroll = this.$refs.scroll as any;
    const bar = this.$refs.bar as any;
    const mask = this.$refs.mask as any;
    let barleft = 0;
    const self: any = this;
    bar.onmousedown = function (event: any) {
      var event = event || window.event;
      const leftVal = event.clientX - this.offsetLeft;
      const that = this;
      // 拖动一定写到 down 里面才可以
      document.onmousemove = function (event) {
        var event = event || window.event;
        barleft = event.clientX - leftVal;
        if (barleft < 0) barleft = 0;
        else if (barleft > scroll.offsetWidth - bar.offsetWidth) barleft = scroll.offsetWidth - bar.offsetWidth;
        mask.style.width = `${barleft}px`;
        that.style.left = `${barleft}px`;
      };
    };
    document.onmouseup = function () {
      document.onmousemove = null; // 弹起鼠标不做任何操作
      switch (self.type) {
        case 'point':
          self.$emit('change-num-point', barleft + 18);

          break;
        case 'line':
          self.$emit('change-num-line', barleft + 18);

          break;
        case 'area':
          self.$emit('change-num-area', barleft + 18);

          break;
        default:
          break;
      }
    };
  },
});
</script>

<style scoped lang="scss">
.scrolldiv {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .scrolldiv__scroll {
    margin: 0 auto;
    width: 100%;
    height: 2px;
    background: rgba(216, 216, 216, 0.3)
      linear-gradient(
        270deg,
        rgba(0, 241, 243, 0.3) 0%,
        rgba(0, 118, 204, 0.3) 100%
      );
    position: relative;
    border-radius: 1px;
    .scrolldiv__scroll__bar {
      border-radius: 50%;
      width: 18px;
      height: 18px;
      background: #32c5ff;
      background: url(../assets/scrollPoint.svg) no-repeat;
      position: absolute;
      top: -8px;
      left: 0;
      cursor: pointer;
    }
    .scrolldiv__scroll__mask {
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(216, 216, 216, 0.3)
        linear-gradient(
          270deg,
          rgba(0, 241, 243, 0.3) 0%,
          rgba(0, 118, 204, 0.3) 100%
        );
      width: 0;
      height: 2px;
    }
  }
}
</style>
