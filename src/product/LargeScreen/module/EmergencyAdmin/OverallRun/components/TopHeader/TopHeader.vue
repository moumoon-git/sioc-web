<template>
  <h1 :class="$style.container">
    <span :class="$style.title"><slot name="title">{{ title }}</slot></span>
    <QuarterSelect
      v-if="showQuarter"
      placeholder="请选择季度"
      @change="$emit('change', $event)"
    />
  </h1>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import QuarterSelect from '../QuarterSelect/QuarterSelect.vue';

export default defineComponent({
  name: 'TopHeader',
  components: {
    // Select,
    QuarterSelect,
  },
  props: {
    title: {
      type: String,
      default: 'title',
    },
    showQuarter: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'change',
  ],
  setup() {
    const selectedIndex = ref(-1);
    return {
      selectedIndex,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  align-items: center;
  height: 78px;
  line-height: 78px;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  .title {
    font-size: 60px;
    color: #56E9FF;
    margin-right: auto;
    font-family: "YouSheBiaoTiHei";
  }
}
</style>
