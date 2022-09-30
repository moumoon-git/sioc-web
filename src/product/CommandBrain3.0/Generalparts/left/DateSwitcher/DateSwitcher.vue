<template>
  <div class="visualization-left-date-switcher">
    <button @click="move(true)" />
    <span>{{ mmdd }}</span>
    <button @click="move(false)" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'DateSwitcher',
  props: {
    listenEventChange: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'change',
  ],
  setup(props, { emit }) {
    const today = new Date();
    const date = ref(today);
    const getFormatted = () => `${date.value.getFullYear()}-${String(date.value.getMonth() + 1).padStart(2, '0')}-${String(date.value.getDate()).padStart(2, '0')}`;
    /**
     * `mm月dd日` 格式的日期
     */
    const mmdd = computed(() => {
      const month = String(date.value.getMonth() + 1);
      const day = String(date.value.getDate());
      return `${month.padStart(2, '0')}月${day.padStart(2, '0')}日`;
    });
    /**
     * 修改日期
     * @pram isPrev 前进还是后退
     */
    const move = (isPrev?: boolean) => {
      const oneDayTime = 24 * 60 * 60 * 1000;
      // 不能超过今天
      if (!isPrev && date.value.getTime() === today.getTime()) {
        return;
      }
      date.value = isPrev
        ? new Date(date.value.getTime() - oneDayTime)
        : new Date(date.value.getTime() + oneDayTime);
      emit('change', getFormatted());
    };

    // 监听事件变化
    if (props.listenEventChange) {
      const store = useStore();
      watch(() => store.state.event, () => {
        emit('change', getFormatted());
      }, { deep: true });
    }
    return {
      mmdd,
      move,
    };
  },
});
</script>

<style lang="scss">
.visualization-left-date-switcher {
  display: inline-block;
  color: #56E9FF;
  vertical-align: middle;
  & > span {
    font-size: 18px;
  }
  & > button {
    color: #56E9FF;
    border: none;
    outline: none;
    background: none;
    position: relative;
    width: 18px;
    height: 18px;
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: color .2s;
    vertical-align: middle;
    &:hover {
      opacity: .7;
    }
    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 8px;
      height: 1px;
      color: inherit;
      background: currentColor;
    }
    &:first-child {
      &::before {
        left: 0;
        top: 4px;
        transform: rotate(-35deg);
      }
      &::after {
        left: 0;
        top: 9px;
        transform: rotate(35deg);
      }
    }
    &:last-child {
      &::before {
        right: 0;
        top: 4px;
        transform: rotate(35deg);
      }
      &::after {
        right: 0;
        top: 9px;
        transform: rotate(-35deg);
      }
    }
  }
}
</style>
