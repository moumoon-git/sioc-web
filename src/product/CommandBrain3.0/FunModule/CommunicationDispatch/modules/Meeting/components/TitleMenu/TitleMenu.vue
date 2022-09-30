<template>
  <ul :class="$style.container">
    <li
      v-for="(menu, menuIndex) in menuList"
      :key="menuIndex"
      :class="{
        [$style.activeItem]: menuIndex === modelValue,
      }"
      @click.stop="$emit('update:modelValue', menuIndex)"
    >
      {{ menu }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TitleMenu',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    menuList: {
      type: Array,
      required: true,
    },
  },
  emits: [
    'update:modelValue',
  ],
  setup() {
    return {};
  },
});
</script>

<style lang="scss" module>
.container {
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0 20px 0 45px;
  flex: 1;
  justify-content: space-between;
  user-select: none;
  & > li {
    height: 51px;
    line-height: 50px;
    position: relative;
    cursor: pointer;
    transition: color .3s;
    font-size: inherit;
    &:hover {
      color: #00ECFF;
    }
    &.activeItem {
      color: #00ECFF;
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        position: absolute;
        bottom: 0;
        left: 0;
        color: inherit;
        background: currentColor;
      }
    }
  }
}
</style>
