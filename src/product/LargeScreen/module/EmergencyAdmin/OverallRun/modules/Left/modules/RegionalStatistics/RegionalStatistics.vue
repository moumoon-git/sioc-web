<template>
  <div :class="$style.container">
    <ul :class="$style.header">
      <li>
        <span
          v-for="header in headers"
          :key="header"
        >
          {{ header.name }}
        </span>
      </li>
    </ul>
    <ul
      v-if="listData?.length"
      ref="listRef"
      :class="$style.list"
      :style="{ height: `${line * 33}px`}"
      @mouseover="pause = true"
      @mouseleave="pause = false"
    >
      <li
        v-for="(item, index) in listData"
        :key="index"
      >
        <span
          v-for="header in headers"
          :key="header"
          :title="item?.[header.prop]"
        >
          {{ item?.[header.prop] }}
        </span>
      </li>
      <!-- 滚动拼接数据 -->
      <template v-if="listData.length > line">
        <li
          v-for="(item, index) in listData"
          :key="index"
        >
          <span
            v-for="header in headers"
            :key="header"
            :title="item?.[header.prop]"
          >
            {{ item?.[header.prop] }}
          </span>
        </li>
      </template>
    </ul>
    <EmptyHint v-else />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
} from 'vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';

export default defineComponent({
  name: 'RegionalStatistics',
  components: {
    EmptyHint,
  },
  props: {
    listData: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    line: {
      type: Number,
      default: 6,
    },
    headers: {
      type: Array as PropType<{
        name: string,
        prop: string,
      }[]>,
      default: () => [],
    },
    speed: {
      type: Number,
      default: 33,
    },
  },
  setup(props) {
    const listRef = ref<HTMLUListElement | null>(null);
    const pause = ref(false);
    let prevTime = 0;
    const scroll = (time: number) => {
      if (time - prevTime > props.speed && !pause.value && listRef.value) {
        prevTime = time;
        listRef.value.scrollTop += 1;
        if (listRef.value.scrollTop === Math.floor(listRef.value.scrollHeight / 2)) {
          listRef.value.scrollTop = 0;
        }
      }
      requestAnimationFrame(scroll);
    };
    requestAnimationFrame(scroll);
    return {
      listRef,
      pause,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  flex: 1;
  color: #FFF;
  margin: 20px 0;
  padding: 0;
  font-size: 16px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.header {
  list-style: none;
  margin: 0;
  padding: 0;
  & > li {
    font-weight: 500;
    color: #00ECFF;
    background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0.8) 100%);
    height: 37px;
    line-height: 37px;
    padding: 0 25px;
    display: flex;
    background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0.4) 100%);
    & > * {
      flex: 1;
      text-align: left;
      font-weight: 500;
      line-height: 37px;
      font-size: 16px;
    }
  }
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  & > li {
    height: 33px;
    line-height: 33px;
    padding: 0 25px;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    &:nth-child(2n + 1) {
      height: 33px;
      line-height: 33px;
      background: linear-gradient(90deg, rgba(#00C1DE, .7) 0%, rgba(24, 38, 50, 0.4) 100%);
    }
    & > * {
      flex: 1;
      text-align: left;
      line-height: 37px;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
