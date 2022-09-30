<template>
  <teleport to="body">
    <div
      v-if="xy[0] && xy[1]"
      :class="$style.container"
      :style="{
        left: `${xy[0]}px`,
        top: `${xy[1]}px`,
      }"
    >
      <div :class="$style.title">入会方式</div>
      <div
        v-if="data.mobile"
        @click="$emit('add', 0)"
      >
        手机号码
      </div>
      <div
        v-if="data.mobile1"
        @click="$emit('add', 3)"
      >
        手机号码1
      </div>
      <div
        v-if="data.mobile2"
        @click="$emit('add', 4)"
      >
        手机号码2
      </div>
      <div
        v-if="data.officeTel"
        @click="$emit('add', 1)"
      >
        办公电话
      </div>
      <div
        v-if="data.homeTel"
        @click="$emit('add', 2)"
      >
        家庭电话
      </div>
      <template
        v-for="device in data.resources || []"
        :key="device.type"
      >
        <div
          v-for="item in device.data || []"
          :key="item.id"
          :title="`${device.name}: ${item?.entity?.code || item?.entity?.number}`"
          @click="$emit('add-device', item, device.type)"
        >
          {{ item?.entity?.name }}
        </div>
      </template>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    xy: {
      type: Array as PropType<number[]>,
      default: () => [0, 0],
    },
    data: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  },
  emits: [
    'add',
    'add-device',
  ],
});
</script>

<style lang="scss" module>
.container {
  position: fixed;
  z-index: 10010;
  background: #000;
  border: 1px solid;
  color: #FFF;
  text-align: center;
  .title {
    color: #00B5C6;
  }
  & > div {
    padding: 10px;
    cursor: pointer;
    &:not(:first-child):hover {
      background: #00B5C6;
    }
  }
}
</style>
