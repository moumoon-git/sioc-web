<template>
  <div :style="visible ? 'display:block;' : 'display:none'">
    <div
      ref="dialog"
      :class="{
        'visualization-map-dialog': true,
        documentDialog: visible && !isMapDialog,
      }"
      :style="visible ? 'max-width: 364px' : ''"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseout="handleMouseUp"
    >
      <header class="visualization-map-dialog__header">
        <slot name="title">
          {{ title }}
        </slot>
        <button class="visualization-map-dialog__header__close" @click="handleClose" />
      </header>
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface initParam {
  longitude?: number;
  latitude?: number;
  map?: any;
}

export default defineComponent({
  name: 'MapDialog',
  props: {
    title: {
      type: String,
      default: 'title',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isMapDialog: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  data() {
    return {
      // 弹窗实例
      popup: null,
      popupId: null,
      dialogRect: {},
      divX: 0,
      divY: 0,
      currentX: 0,
      currentY: 0,
      translate: 'translate(15%, -15%)',
      position: {
        toTop: 'translate(15%, -100%)',
        toLeft: 'translate(-100%, -15%)',
        toTopLeft: 'translate(-100%, -100%)',
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      const clHeight = document.documentElement.clientHeight;
      const clWidth = document.documentElement.clientWidth;
      const { bottom, right } = (this as any).$refs.dialog.getBoundingClientRect();
      if (bottom > clHeight && right <= clWidth) {
        // 弹窗超出下方
        this.translate = this.position.toTop;
      } else if (right > clWidth && bottom <= clHeight) {
        //弹窗超出右方
        this.translate = this.position.toLeft;
      } else if (right > clWidth && bottom > clHeight) {
        //弹窗超出右下方
        this.translate = this.position.toTopLeft;
      } else {
        this.translate = 'translate(15%, -15%)';
      }
    });
  },
  methods: {
    /**
     * @description 初始化弹窗
     * @param {Number} longtitude 经度
     * @param {Number} lattitude 纬度
     * @param {Object} map 地图实例
     */
    init({ longitude, latitude, map }: initParam) {
      const promise = new Promise((resolve, reject) => {
        // 地图实例
        const mapInstance = map || (window as any).map;
        // console.log(mapInstance);
        const id = `map-dialog--${Math.floor(Math.random() * 100000000)}`;
        (this as any).popupId = id;
        const data = {
          id,
          longitude,
          latitude,
          class: (this as any).$refs.dialog as HTMLElement,
        };
        mapInstance.mapPopup(data);
        resolve(id);
      });
      return promise;
    },
    /**
     * @description 关闭弹窗
     */
    close() {
      const mapInstance = (window as any).map || (window as any).admin_map;
      mapInstance.closeClearPopup((this as any).popupId);
    },

    /**
     * 鼠标左键按下，开始拖动
     */
    handleMouseDown(event: MouseEvent) {
      // event.preventDefault();
      const dialog = this.$refs.dialog as HTMLElement;

      const translates = (document as any).defaultView.getComputedStyle(dialog, null).transform;

      const result = translates.match(/\(([^)]*)\)/); // 正则()内容
      const matrix = result ? result[1].split(',') : translates.split(',');

      this.currentX = Number(matrix[4].trim());
      this.currentY = Number(matrix[5].trim());
      this.divX = event.x;
      this.divY = event.y;

      dialog.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px)`;
      dialog.style.cursor = 'move';
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
      event.preventDefault();
      const dialog = this.$refs.dialog as HTMLElement;

      const newX = this.currentX + event.x - this.divX;

      const newY = this.currentY + event.y - this.divY;

      dialog.style.transform = `translateX(${newX}px) translateY(${newY}px)`;
    },

    /**
     * @description 点击关闭按钮
     */
    handleClose() {
      this.close();
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss">
// 角落十字
@mixin corner {
  content: '';
  display: block;
  width: 11px;
  height: 11px;
  text-align: center;
  position: absolute;
  background: no-repeat center/100% 100% url(./assets/cross.svg);
}

.visualization-map-dialog {
  min-width: 150px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: v-bind(translate);
  z-index: 11111;
  background: rgba(0, 36, 60, 0.82);
  backdrop-filter: blur(2px);
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid #014b71;
  cursor: auto;
  &::before {
    @include corner;
    left: -6px;
    bottom: -6px;
  }
  &::after {
    @include corner;
    right: -6px;
    bottom: -6px;
  }
  // 顶部标题栏
  &__header {
    background: linear-gradient(90deg, #32b0ff 0%, rgba(24, 38, 50, 0) 100%);
    height: 42px;
    padding: 0 30px 0 13px;
    line-height: 42px;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    &::before {
      @include corner;
      left: -6px;
      top: -6px;
    }
    &::after {
      @include corner;
      right: -6px;
      top: -6px;
    }
    &__close {
      width: 12px;
      height: 12px;
      position: absolute;
      top: 17px;
      right: 14px;
      border: none;
      outline: none;
      cursor: pointer;
      background: no-repeat center/100% url(./assets/close.svg);
      z-index: 1;
      &:hover {
        opacity: 0.7;
      }
      &:active {
        top: 18px;
      }
    }
  }
}
.documentDialog {
  transform: translate(-50%, -50%);
}
</style>
