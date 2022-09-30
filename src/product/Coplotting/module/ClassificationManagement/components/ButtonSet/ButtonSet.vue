<template>
  <span>
    <button
      v-for="(icon, index) in iconList"
      :key="index"
      :class="[
        $style.icon,
        $style[icon],
      ]"
      @click.stop.prevent="$emit('click', icon)"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: '',
  props: {
    iconList: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'click',
  ],
});
</script>

<style lang="scss" module>
.icon {
  border: none;
  outline: none;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  background: #0091FF;
  cursor: pointer;
  opacity: .4;
  margin: 0 5px;
  &:hover {
    opacity: 1;
  }
  &:active {
    position: relative;
    top: 1px;
  }
}
.edit {
  background: no-repeat center/100% 100% url(./assets/edit.svg);
}
.delete {
  background: no-repeat center/100% 100% url(./assets/delete.svg);
}
.up {
  background: no-repeat center/100% 100% url(./assets/up.svg);
}
.down {
  background: no-repeat center/100% 100% url(./assets/down.svg);
}
</style>
