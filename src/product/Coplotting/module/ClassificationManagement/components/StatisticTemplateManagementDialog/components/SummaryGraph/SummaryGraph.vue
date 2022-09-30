<template>
  <div :class="$style.container">
    <h3 :class="$style.title">统计对象</h3>
    <ButtonSet
      v-if="!displayOnly"
      :class="$style.buttonSet"
      :icon-list="['edit', 'delete']"
      @click="handleClick"
    />
    <svg
      :class="$style.dashboardLeft"
      viewBox="0 0 100 100"
      width="100px"
      height="100px"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#EEF0F3"
        stroke-width="4px"
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#blue)"
        stroke-width="9px"
        stroke-dasharray="282.6"
        :stroke-dashoffset="0"
        stroke-linecap="round"
        transform="rotate(-90, 50, 50)"
      />
      <text
        x="50"
        y="45"
        fill="#333"
        text-anchor="middle"
        dominant-baseline="middle"
        style="font-size: 20px; font-weight: 500;"
      >
        {{ data?.[0]?.lastYearPercent || '-' }}
      </text>
      <text
        x="50"
        y="65"
        fill="#999"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        同比
      </text>
      <polygon
        points="12 40, 22 40, 17 47"
        fill="url(#blue)"
        :transform="data?.[0]?.lastYearPercent > 0 ? 'rotate(180, 17, 44)' : ''"
      />
      <!-- 定义渐变色 -->
      <defs>
        <linearGradient id="blue">
          <stop
            offset="0%"
            stop-color="#8DCEFF"
          />
          <stop
            offset="100%"
            stop-color="#518AFB"
          />
        </linearGradient>
      </defs>
    </svg>
    <svg
      :class="$style.dashboardRight"
      viewBox="0 0 100 100"
      width="100px"
      height="100px"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#EEF0F3"
        stroke-width="4px"
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#green)"
        stroke-width="9px"
        stroke-dasharray="282.6"
        :stroke-dashoffset="0"
        stroke-linecap="round"
        transform="rotate(-90, 50, 50)"
      />
      <text
        x="50"
        y="45"
        fill="#333"
        text-anchor="middle"
        dominant-baseline="middle"
        style="font-size: 20px; font-weight: 500;"
      >
        {{ data?.[0]?.lastMonthPercent || '-' }}
      </text>
      <text
        x="50"
        y="65"
        fill="#999"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        环比
      </text>
      <polygon
        points="12 40, 22 40, 17 47"
        fill="url(#green)"
        :transform="data?.[0]?.lastMonthPercent > 0 ? 'rotate(180, 17, 44)' : ''"
      />
      <!-- 定义渐变色 -->
      <defs>
        <linearGradient id="green">
          <stop
            offset="0%"
            stop-color="#29DCC9"
          />
          <stop
            offset="100%"
            stop-color="#3AEBA6"
          />
        </linearGradient>
      </defs>
    </svg>
    <div :class="$style.content">
      <div>{{ data?.[0]?.sum ?? '-' }}<span>{{ data?.[0]?.unit ?? '-' }}</span></div>
      <div>{{ data?.[0]?.name ?? '-' }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonSet from '../../../ButtonSet/ButtonSet.vue';

export default defineComponent({
  name: 'SummaryGraph',
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
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    /**
     * 点击按钮
     *
     * @param buttonType 按钮类型
     */
    function handleClick(buttonType: 'edit' | 'delete') {
      emit(buttonType);
    }
    return {
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
}
.dashboardLeft {
  position: absolute;
  left: 160px;
  top: 110px;
}
.dashboardRight {
  position: absolute;
  left: 270px;
  top: 110px;
}
.content {
  position: absolute;
  left: 30px;
  top: 125px;
  & > div:first-child {
    color: #333;
    font-size: 32px;
    text-align: center;
    font-weight: 500;
    & > span {
      font-size: 22px;
      font-weight: 500;
    }
  }
  & > div:last-child {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    color: #999;
  }
}
</style>
