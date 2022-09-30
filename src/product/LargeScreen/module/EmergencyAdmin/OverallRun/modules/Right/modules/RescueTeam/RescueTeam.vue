<template>
  <div :class="$style.wrapper">
    <ul
      v-if="listData.length"
      :class="$style.container"
    >
      <transition-group name="rescue-team-slide">
        <li
          v-for="(item, index) in listData.slice(page * pageSize, (page + 1) * pageSize)"
          :key="item.uuid"
          :style="{
            top: `${40 * index}px`
          }"
        >
          <span :title="item.name">{{ item.name }}</span>
          <span
            :class="$style.progress"
            :style="{
              '--team-percent': `${item.percent}%`,
            }"
          />
          <span>{{ item.value }}<span style="font-size: 18px;">人</span></span>
        </li>
      </transition-group>
    </ul>
    <EmptyHint v-else />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
} from 'vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
import usePageChange from '../../scripts/usePageChange';

export default defineComponent({
  name: 'RescueTeam',
  components: {
    EmptyHint,
  },
  props: {
    listData: {
      type: Array as PropType<{
        name: string,
        value: number,
        percent: number,
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
  margin: 20px 0;
  min-height: 240px;
  position: relative;
  overflow: hidden;
}
.container {
  list-style: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  & > li {
    font-size: 18px;
    display: flex;
    align-items: center;
    height: 40px;
    width: 100%;
    position: absolute;
    left: 0;
    & > span:first-child {
      font-size: 24px;
      flex: 1;
      color: rgba(255, 255, 255, 0.75);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & > span:last-child {
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
      font-weight: 600;
      font-size: 28px;
      color: #FFF;
      display: inline-block;
      width: 120px;
      margin-left: 10px;
      flex-shrink: 0;
      text-align: right;
      font-family: 'DIN';
    }
  }
}
.progress {
  display: inline-block;
  flex-shrink: 0;
  width: 240px;
  height: 30px;
  background: rgba(255, 255, 255, 0.59) no-repeat left/var(--team-percent) 100% linear-gradient(
    270deg, #00F1F3 0%, #0076CC 100%
  );
  -webkit-mask: no-repeat center/100% 100% url(./assets/imgs/mask-rescue-team.svg);
  mask: no-repeat center/100% 100% url(./assets/imgs/mask-rescue-team.svg);
  @keyframes rescue-team-progress {
    0% {
      background: rgba(255, 255, 255, 0.59) no-repeat left/0 100% linear-gradient(
        270deg, #00F1F3 0%, #0076CC 100%
      );
    }
    20% {
      background: rgba(255, 255, 255, 0.59) no-repeat left/var(--team-percent) 100% linear-gradient(
        270deg, #00F1F3 0%, #0076CC 100%
      );
    }
  }
  animation: rescue-team-progress 5s infinite;
}
</style>

<style lang="scss">
.rescue-team-slide-enter-active,
.rescue-team-slide-leave-active {
  transition: all 1s linear;
}
.rescue-team-slide-enter-from,
.rescue-team-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
