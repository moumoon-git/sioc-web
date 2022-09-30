<template>
  <div :class="[$style.switchContainer, $style[`switchContainer__${activeType}`]]" @click="handleSwitch">
    <div :class="$style.circle"></div>
    <div :class="$style.txt">{{ activeType === 'inactive' ? '关' : '开' }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Switch',
  props: {
    type: {
      type: String,
      default: 'inactive'
    }
  },
  emits: {
    change: null
  },
  setup(props, {emit}) {
    const { type } = props
    const activeType = ref(type);
    
    /**
     * @description 切换开关
     */
    function handleSwitch() {
      activeType.value = activeType.value === 'active' ? 'inactive' : 'active';
      emit('change', activeType.value)
    }

    return {
      activeType,
      handleSwitch
    }
  }
})
</script>
<style lang="scss" module>
.switchContainer {
  width: 38px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
}
.switchContainer__inactive {
  background: #9BA09F;
  flex-direction: row;
  padding-right: 5px;
}
.switchContainer__active {
  background: #00C1DE;
  flex-direction: row-reverse;
  padding-left: 5px;
}

.circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #FFFFFF
}

.txt {
  font-size: 12px;
  font-weight: 400;
  color: #FFFFFF;
}

</style>