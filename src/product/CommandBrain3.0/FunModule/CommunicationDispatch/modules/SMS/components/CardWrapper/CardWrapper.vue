<template>
  <div :class="$style.container">
    <header>
      <div :class="$style.content">
        <slot name="title" />
      </div>
    </header>
    <main>
      <slot name="default" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardWrapper',
});
</script>

<style lang="scss" module>
.container {
  height: 200px;
  border: 1px solid rgba(0, 193, 222, .29);
  color: #FFF;
  box-sizing: border-box;
  & > header {
    height: 51px;
    background: rgba(14, 69, 100, 0.35);
    position: relative;
    &::after {
      content: '';
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background: rgba(255, 255, 255, .15);
    }
    .content {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      box-sizing: border-box;
    }
  }
  & > main {
    height: calc(100% - 51px);
    overflow-y: auto;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
}
</style>
