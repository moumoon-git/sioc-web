<template>
  <teleport to="#rightContainer">
    <div
      v-show="visible && !isRoutesTrackShown"
      v-bind="$attrs"
      :class="[
        'visualization-right-dialog',
        {
          'visualization-right-dialog--hidden': isHidden,
        },
      ]"
    >
      <header>
        <span>{{ title }}</span>
        <button @click="$emit('close')" />
      </header>
      <main>
        <slot />
      </main>
      <HideButton
        class="visualization-right-dialog__hide-button"
        :type="isHidden ? 'unhide' : 'hide'"
        @click="isHidden = !isHidden"
      />
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isRoutesTrackShown } from '@/product/CommandBrain3.0/FunModule/RoutesTrack/scripts/useRoutesTrack';
import HideButton from '../../header/Button/Button.vue';

export default defineComponent({
  name: 'Dialog',
  components: {
    HideButton,
  },
  props: {
    title: {
      type: String,
      default: '标题',
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close'],
  setup() {
    return {
      isRoutesTrackShown,
    };
  },
  data() {
    return {
      // 是否隐藏
      isHidden: false,
    };
  },
});
</script>

<style lang="scss">
@keyframes visualization-right-dialog-show-up {
  from {
    right: -410px;
    margin-left: -410px;
  }
  to {
    right: 0px;
    margin-left: 0;
  }
}
.visualization-right-dialog {
  right: 0px;
  width: 400px;
  min-width: 400px;
  transition: all 0.4s linear;
  // z-index: 1;
  position: relative;
  animation: visualization-right-dialog-show-up 0.4s linear;
  transform: translate3d(0, 0, 0);
  &--hidden {
    right: -410px;
    margin-left: -410px;
  }
  & > header {
    height: 33px;
    line-height: 33px;
    & > span:first-child {
      display: inline-block;
      background: #5abbe0;
      color: #043056;
      font-size: 20px;
      font-weight: 500;
      height: 100%;
      line-height: inherit;
      padding: 0 37px 0 25px;
      clip-path: polygon(
        0 0,
        calc(100% - 25px) 0,
        100% calc(100% - 8px),
        100% 100%,
        0% 100%
      );
      position: relative;
      // 左上角发光点
      &::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 100%;
        position: absolute;
        color: #0bd295;
        background: currentColor;
        left: 6px;
        top: 6px;
        box-shadow: 0 0 3px currentColor;
        z-index: 1;
        @keyframes visualization-right-dialog__flash {
          50% {
            opacity: 0;
          }
        }
        animation: visualization-right-dialog__flash infinite linear 3s;
      }
      &::after {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 100%;
        position: absolute;
        background: #FFF;
        left: 6px;
        top: 6px;
      }
    }
    & > button:last-child {
      border: 0;
      outline: 0;
      background: no-repeat center/100% url(./assets/close.svg);
      border-radius: 100%;
      width: 25px;
      height: 25px;
      cursor: pointer;
      float: right;
      margin-top: 3px;
      &:hover {
        background-image: url(./assets/close-hover.svg);
      }
    }
  }
  & > main {
    height: calc(100vh - 120px);
    border: 1px solid #00c1de;
    background: rgba(14, 23, 24, 0.8);
    // backdrop-filter: blur(2px);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  &__hide-button {
    position: absolute;
    bottom: 57px;
    left: -23px;
    transform: rotate(180deg);
  }
}
</style>
