<template>
  <div class="visualization-left-empty-hint">
    <img
      src="./imgs/img-empty.svg"
      alt=""
      draggable="false"
    >
    <p>{{ hint }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyHint',
  props: {
    hint: {
      type: String,
      default: '暂无数据',
    },
  },
});
</script>

<style lang="scss">
.visualization-left-empty-hint {
  flex: 1;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  user-select: none;
  & > p {
    color: #B8C3D9;
  }
}
</style>
