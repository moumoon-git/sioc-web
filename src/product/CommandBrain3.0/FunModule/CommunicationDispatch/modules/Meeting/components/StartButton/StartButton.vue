<template>
  <button
    :class="$style.container"
    @click="!meetingStartTime ? $emit('click') : null"
  >
    {{ meetingStartTime ? '会议中 ' + duration : '发起会议' }}
  </button>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import { meetingStartTime } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import { formatDuration, calculateDuration } from '../../scripts/utils';

export default defineComponent({
  emits: [
    'click',
  ],
  setup() {
    let timer: any;
    const duration = ref('');
    watch(meetingStartTime, (val) => {
      clearInterval(timer);
      timer = setInterval(() => {
        duration.value = formatDuration(calculateDuration(val, String(new Date())));
      }, 1000);
    }, {
      immediate: true,
    });
    return {
      meetingStartTime,
      duration,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  display: block;
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  color: #FFF;
  font-size: 16px;
  background: no-repeat right 10px center/48px 40px url(./assets/background.svg)  #54A0FF;
  cursor: pointer;
  transition: all .3s;
  &:hover {
    filter: brightness(110%);
  }
  &:active {
    filter: brightness(90%);
  }
}
</style>
