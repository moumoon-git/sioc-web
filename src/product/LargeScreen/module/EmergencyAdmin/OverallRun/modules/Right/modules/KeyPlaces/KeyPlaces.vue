<template>
  <div :class="$style.wrapper">
    <div v-if="listData.length" :class="$style.container">
      <transition-group name="key-places-slide">
        <div
          v-for="item in listData.slice(page * pageSize, (page + 1) * pageSize)"
          :key="item.name"
        >
          <div :class="$style.item">
            <span>{{ item.name }}</span>
            <span>{{ item.value }}</span>
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
import usePageChange from '../../scripts/usePageChange';

export default defineComponent({
  name: 'KeyPlaces',
  components: {
    EmptyHint,
  },
  props: {
    listData: {
      type: Array as PropType<
        {
          name: string;
          value: number;
        }[]
      >,
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
  position: relative;
  overflow: hidden;
}
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  flex: 1;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(2, 1fr);
  & > div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &:nth-child(2n) {
      justify-content: flex-end;
    }
  }
}
.item {
  color: #fff;
  width: 284px;
  height: 63px;
  line-height: 63px;
  box-sizing: border-box;
  padding: 0 20px;
  font-size: 24px;
  font-weight: 600;
  position: relative;
  background: no-repeat top/100% 100%
    url(./assets/imgs/key-places-background.svg);
  mask: no-repeat top/100% 100% url(./assets/imgs/key-places-mask.svg);
  -webkit-mask: no-repeat top/100% 100% url(./assets/imgs/key-places-mask.svg);
  display: flex;
  align-items: center;
  & > span:first-child {
    @keyframes key-places-shake-left {
      0% {
        margin-left: 0px;
      }
      20% {
        margin-left: 10px;
      }
      30% {
        margin-left: 0px;
      }
    }
    animation: key-places-shake-left infinite 5s;
    font-size: 24px;
  }
  & > span:last-child {
    margin-left: auto;
    font-family: 'DIN';
    @keyframes key-places-shake {
      0% {
        margin-right: 0;
      }
      20% {
        margin-right: 10px;
      }
      30% {
        margin-right: 0;
      }
    }
    animation: key-places-shake infinite 5s;
    font-size: 24px;
    font-weight: 600;
  }
  @keyframes key-places-slide {
    0% {
      left: 0%;
    }
    20% {
      left: 100%;
    }
    20.1% {
      left: -10%;
    }
    30% {
      left: 0%;
    }
  }
  &::before {
    content: '';
    display: block;
    top: 3px;
    border-radius: 4px;
    left: 0%;
    width: 110px;
    height: calc(100% - 6px);
    position: absolute;
    z-index: -1;
    background: no-repeat center/100% 100%
      url(./assets/imgs/key-places-slider.svg);
    animation: key-places-slide infinite 5s;
  }
}
</style>

<style lang="scss">
.key-places-slide-enter-active,
.key-places-slide-leave-active {
  transition: all 1s linear;
}
.key-places-slide-enter-from,
.key-places-slide-leave-to {
  opacity: 0;
  left: -1000px;
  position: absolute;
  transform: translateX(30px);
}
</style>
