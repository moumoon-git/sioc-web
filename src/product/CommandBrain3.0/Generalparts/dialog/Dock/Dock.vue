// 弹窗坞，通过addDialog方法添加弹窗，返回关闭弹窗的方法
// 需要在根组件provide以下方法($addDialog)
// addDialog(dialog: string, el: HTMLElement) {
//   return (this.$refs.Dock as any).addDialog(dialog, el);
// },
<template>
  <div :class="['visualization-dock', { 'visualization-dock--show': isShow }]">
    <!-- 底部开关 -->
    <div
      v-if="hideList.size"
      class="visualization-dock__info"
      @click="isShow = !isShow"
    >
      <span>最小化</span>
      <span>{{ hideList.size }}</span>
    </div>
    <!-- 最小化弹窗列表 -->
    <ul class="visualization-dock__list">
      <transition-group name="visualization-dock__dialog__popup">
        <li
          v-for="dialog in dialogList"
          :key="`dialog_${dialog}`"
          :class="{ 'visualization-dock__list--hide': hideList.has(dialog) }"
          @click="handleUnhide(dialog)"
        >
          <!-- 弹窗标题 -->
          <h1 :title="dialog">
            {{ dialog }}
            <button @click.stop="handleClose(dialog)" />
          </h1>
          <!-- 弹窗实例 -->
          <Dialog
            :ref="`dialog_${dialog}`"
            :title="dialog"
            :operation="{
              close: handleClose.bind(ctx, dialog),
              hide: handleHide.bind(ctx, dialog),
              unhide: handleUnhide.bind(ctx, dialog),
            }"
            @hide="handleHide(dialog)"
            @close="handleClose(dialog)"
          />
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Dialog from './components/Dialog.vue';
import useDock from './useDock';

export default defineComponent({
  name: 'DialogDocker',
  components: {
    Dialog,
  },
  setup() {
    useDock();
  },
  data() {
    return {
      // 弹窗集合
      dialogList: new Set(),
      // 隐藏的弹窗集合
      hideList: new Set(),
      // 任务列表是否显示
      isShow: true,
      ctx: this,
    };
  },
  beforeUnmount() {
    this.dialogList.clear();
    this.hideList.clear();
  },
  methods: {
    /**
     * 添加弹窗
     *
     * @param {String} dialog 弹窗名
     * @param {HTMLElement} el 弹窗内容的DOM元素
     * @return 关闭弹窗的函数
     */
    addDialog(dialog: string, el: HTMLElement | any, props: any) {
      if (this.dialogList.has(dialog)) {
        throw Error('同名弹窗已存在，请修改名称。');
      }
      this.dialogList.add(dialog);
      setTimeout(() => {
        if ('nodeType' in el) {
          // DOM元素
          (this.$refs[`dialog_${dialog}`] as any).$refs.container.appendChild(
            el,
          );
        } else {
          // 组件对象
          (this.$refs[`dialog_${dialog}`] as any).setAsyncComp(el, props);
        }
      }, 0);
      return {
        close: this.handleClose.bind(this, dialog),
        hide: this.handleHide.bind(this, dialog),
        unhide: this.handleUnhide.bind(this, dialog),
      };
    },
    /**
     * 隐藏弹窗
     */
    handleHide(dialog: string) {
      this.hideList.add(dialog);
      (this.$refs[`dialog_${dialog}`] as any).isHidden = true;
    },
    /**
     * 取消隐藏弹窗
     */
    handleUnhide(dialog: string) {
      this.hideList.delete(dialog);
      (this.$refs[`dialog_${dialog}`] as any).isHidden = false;
    },
    /**
     * 关闭、删除弹窗
     */
    handleClose(dialog: string) {
      this.dialogList.delete(dialog);
      this.hideList.delete(dialog);
    },
  },
});
</script>

<style lang="scss">
.visualization-dock {
  position: absolute;
  left: 517px;
  bottom: 0;
  z-index: 10001;
  &--show > &__info::before {
    background-image: url(./assets/dock-hover.svg);
  }
  &--show > &__list {
    top: auto;
    bottom: 38px;
  }
  &__info {
    background: rgba(18, 23, 24, 0.4);
    backdrop-filter: blur(2px);
    box-sizing: border-box;
    width: 120px;
    height: 38px;
    line-height: 38px;
    color: #ffffff;
    padding: 0 10px 0 35px;
    cursor: pointer;
    user-select: none;
    & > span {
      font-size: 18px;
      &:last-child {
        color: #56e9ff;
        font-weight: 500;
        margin-left: 10px;
      }
    }
    &::before {
      content: '';
      display: block;
      width: 21px;
      height: 21px;
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: no-repeat center/100% 100% url(./assets/dock.svg);
    }
  }
  &__list {
    position: absolute;
    left: 0;
    background: rgba(18, 23, 24, 0.4);
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    & > li {
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      &.visualization-dock__list--hide {
        padding: 0 5px 8px;
        backdrop-filter: blur(2px);
        overflow: hidden;
        height: 117px;
        & > h1 {
          display: block;
        }
      }
      &:hover {
        background: rgba(0, 0, 0, 0.75);
        & > h1 > button {
          display: inline-block;
        }
      }
      & > h1 {
        flex-shrink: 0;
        display: none;
        height: 34px;
        padding: 0 20px;
        width: 100%;
        min-width: 110px;
        box-sizing: border-box;
        line-height: 34px;
        margin: 0;
        color: #ffffff;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
        white-space: nowrap;
        flex-shrink: 0;
        & > button {
          border: none;
          outline: none;
          display: none;
          width: 12px;
          height: 12px;
          background: no-repeat center/100% 100% url(./assets/close.svg);
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
      }
    }
  }
}

// 弹窗渐入渐出
.visualization-dock__dialog__popup-enter-active,
.visualization-dock__dialog__popup-leave-active {
  transition: opacity 0.5s ease;
}

.visualization-dock__dialog__popup-enter-from,
.visualization-dock__dialog__popup-leave-to {
  opacity: 0;
}
</style>
