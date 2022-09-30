<template>
  <span class="visualization-right-tag">
    <div>
      <slot />
    </div>
    <button
      v-if="showDelete"
      @click.stop="$emit('delete')"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Tag',
  props: {
    showDelete: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'delete',
  ],
});
</script>

<style lang="scss">
.visualization-right-tag {
  background: linear-gradient(90deg, rgba(0, 193, 222, .7) 0%, rgba(24, 38, 50, 0) 100%);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 400;
  display: inline-block;
  margin: 0;
  padding: 0 5px;
  width: 76px;
  height: 27px;
  line-height: 27px;
  text-align: center;
  border-radius: 25px;
  position: relative;
  & > div:first-child {
    height: 100%;
    line-height: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & > button:last-child {
    position: absolute;
    right: -2px;
    top: -5px;
    width: 14px;
    height: 14px;
    border-radius: 100%;
    background: no-repeat center/100% 100% url(./assets/close.svg);
    border: none;
    outline: none;
    cursor: pointer;
    display: none;
    &:hover {
      opacity: .7;
    }
  }
  &:hover > button:last-child {
    display: inline-block;
  }
}
</style>
