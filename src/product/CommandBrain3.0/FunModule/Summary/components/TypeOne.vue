<template>
  <div :class="$style.list">
    <!-- 时间 -->
    <div :class="$style.time">
      {{ `${(item.time.split(' ')[1]).split(':')[0]}:${(item.time.split(' ')[1]).split(':')[1]}` }}
    </div>
    <!-- 整体样式 -->
    <div
      :class="$style.listStyle"
      @click="handleClick"
    >
      <div :class="$style.headerStyle">
        <!-- 标签 -->
        <div :class="$style.listOne" />
        <!-- 名字 -->
        <div :class="$style.listThree">
          {{ item.eventObj.dealOrder ? '接收事件续报' : '接收事件首报' }}
        </div>
      </div>
      <!-- 标题 -->
      <div :class="$style.listFour">
        事件标题：{{ item.eventObj.title }}
      </div>
      <!-- 简报 -->
      <div :class="$style.listFour">
        事件简报：{{ item.eventObj.reportDescription }}
      </div>
      <!-- 要素 -->
      <div
        v-for="itemone in item.eventObj.eventParams"
        :key="itemone.id"
        :class="$style.listTen"
      >
        <span>
          {{ itemone.name }}({{ itemone.unit }})：{{ itemone.value ? itemone.value : 0 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TypeOne',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['handleClick'],
  methods: {
    handleClick(item: any): void {
      this.$emit('handleClick', item);
    },
  },
});
</script>

<style lang="scss" module>
$label: url('../assets/one.svg');
@import '../assets/css/public.scss';
</style>
