<template>
  <div :class="$style.wrapper">
    <div
      v-if="listData.length"
      :class="$style.container"
    >
      <transition-group name="emergency-supplies-slide">
        <div
          v-for="item in listData.slice(page * pageSize, (page + 1) * pageSize)"
          :key="item.uuid"
        >
          <div :class="$style.item">
            <div>{{ item.value }}</div>
            <div>{{ item.name }}</div>
            <ObliqueWave />
          </div>
        </div>
      </transition-group>
    </div>
    <EmptyHint v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
import ObliqueWave from './components/ObliqueWave.vue';
import usePageChange from '../../scripts/usePageChange';

export default defineComponent({
  name: 'EmergencySupplies',
  components: {
    EmptyHint,
    ObliqueWave,
  },
  props: {
    listData: {
      type: Array as PropType<{
        name: string,
        value: number,
      }[]>,
      default: () => [],
    },
    pageSize: {
      type: Number,
      default: 6,
    },
    interval: {
      type: Number,
      default: 5,
    },
  },
  setup(props) {
    const { page } = usePageChange(props);
    return {
      page,
    };
  },
});
</script>

<style lang="scss" module>
.wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 290px;
}
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.item {
  text-align: center;
  width: 150px;
  height: 115px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  & > div:first-child {
    color: #56E9FF;
    font-size: 30px;
    line-height: 1;
    font-family: 'DIN';
    font-weight: 600;
  }
  & > div:nth-child(2) {
    margin-top: 10px;
    color: #FFF;
    font-size: 18px;
  }
}
</style>

<style lang="scss">
.emergency-supplies-slide-enter-active,
.emergency-supplies-slide-leave-active {
  transition: all 1s linear;
}
.emergency-supplies-slide-enter-from,
.emergency-supplies-slide-leave-to {
  opacity: 0;
  left: -1000px;
  position: absolute;
  transform: translateX(30px);
}
</style>
