<template>
  <div :class="$style.container">
    <h3 :class="$style.title">统计对象</h3>
    <ButtonSet
      v-if="!displayOnly"
      :class="$style.buttonSet"
      :icon-list="['edit', 'delete']"
      @click="handleClick"
    />
    <ul :class="$style.rankList">
      <li
        v-for="(item, index) in list"
        :key="index"
      >
        <div :class="$style.text">
          <span>top{{ index + 1 }}</span>
          <span>{{ item }}起</span>
          <span>{{ Number(100 * item / total).toFixed(1) }}%</span>
        </div>
        <div :class="$style.progress">
          <div
            :style="{
              width: `${Number(100 * item / total).toFixed(1)}%`,
            }"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, watch } from 'vue';
import ButtonSet from '../../../ButtonSet/ButtonSet.vue';

export default defineComponent({
  name: 'RankGraph',
  components: {
    ButtonSet,
  },
  props: {
    // 仅展示，隐藏操作按钮
    displayOnly: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array as any,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const list = toRefs(props).data;
    watch(list, () => {
      list.value.sort((a: number, b: number) => b - a);
    }, {
      deep: true,
      immediate: true,
    });
    const total = computed(() => list.value.reduce((sum: number, item: number) => sum + item, 0));
    /**
     * 点击按钮
     *
     * @param buttonType 按钮类型
     */
    function handleClick(buttonType: 'edit' | 'delete') {
      emit(buttonType);
    }
    return {
      list,
      total,
      handleClick,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  .title {
    position: absolute;
    top: 14px;
    left: 14px;
    margin: 0;
    font-weight: 500;
    color: #333;
    line-height: 14px;
    border-left: 2px solid #0091FF;
    padding-left: 8px;
    z-index: 1;
  }
  .buttonSet {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  }
  .rankList {
    position: absolute;
    width: 80%;
    left: 10%;
    top: 45px;
    list-style: none;
    margin: 0;
    padding: 0;
    & > li {
      .text {
        display: flex;
        align-items: center;
        & > span {
          &:first-child {
            color: #666;
            font-size: 12px;
          }
          &:nth-child(2) {
            color: #333;
            font-size: 10px;
            flex: 1;
            margin-left: 10px;
          }
          &:last-child {
            color: #999;
            font-size: 12px;
          }
        }
      }
      .progress {
        width: 100%;
        height: 10px;
        background: #F4F6F8;
        border-radius: 5px;
        margin: 5px 0 15px;
        & > div {
          background: #FBC958;
          height: 100%;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
