<template>
  <div :class="$style.container">
    <button
      :class="{
        [$style.btnDisabled]: currentIndex === 0,
      }"
      @click.stop.prevent="prev"
    />
    <div>
      <span
        v-for="(tab, index) in listData.slice(currentIndex * 4, currentIndex * 4 + 4)"
        :key="tab.id"
        :class="{
          [$style.activeTab]: index === currentTabIndex,
        }"
        @click="$emit('tab-click', tab); currentTabIndex = index;"
      >
        {{ tab.typeName }}
      </span>
    </div>
    <button
      :class="{
        [$style.btnDisabled]: currentIndex * 4 + 4 >= listData.length,
      }"
      @click.stop.prevent="next"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TabSwitch',
  props: {
    // 标签列表数据
    listData: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'tab-click',
  ],
  data() {
    return {
      currentIndex: 0,
      currentTabIndex: 0,
    };
  },
  methods: {
    prev() {
      if (this.currentIndex !== 0) {
        this.currentTabIndex = 0;
        this.currentIndex -= 1;
        this.$emit('tab-click', this.listData[this.currentIndex * 4]);
      }
    },
    next() {
      if ((this.currentIndex + 1) * 4 < this.listData.length) {
        this.currentTabIndex = 0;
        this.currentIndex += 1;
        this.$emit('tab-click', this.listData[this.currentIndex * 4]);
      }
    },
  },
});
</script>

<style lang="scss" module>
.container {
  height: 40px;
  line-height: 40px;
  display: flex;
  // 左右按钮
  & > button {
    background: no-repeat center/100% 100% #FFF;
    width: 30px;
    outline: none;
    border: 1px solid #F2F2F2;
    cursor: pointer;
    position: relative;
    &:first-child {
      &::before,
      &::after {
        content: '';
        background: #CCCCCC;
        display: block;
        width: 10px;
        height: 1px;
        position: absolute;
        left: 8px;
      }
      &::before {
        top: 15px;
        transform: rotate(-45deg);
      }
      &::after {
        top: 22px;
        transform: rotate(45deg);
      }
    }
    &:last-child {
      &::before,
      &::after {
        content: '';
        background: #CCCCCC;
        display: block;
        width: 10px;
        height: 1px;
        position: absolute;
        right: 8px;
      }
      &::before {
        top: 15px;
        transform: rotate(45deg);
      }
      &::after {
        top: 22px;
        transform: rotate(-45deg);
      }
    }
    &:not(.btnDisabled):hover::after,
    &:not(.btnDisabled):hover::before {
      background: #0091FF;
    }
  }
  & > div {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
    // 标签页
    & > span {
      width: 25%;
      flex-shrink: 0;
      line-height: 38px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #666666;
      cursor: pointer;
      background: #FFF;
      border-top: 2px solid transparent;
      border-right: 1px solid #DDD;
      &:first-child {
        border-left: 1px solid #DDD;
      }
      &:not(.activeTab) {
        border-bottom: 1px solid #DDD;
      }
      &:hover {
        border-top: 2px solid #0091FF;
      }
    }
    .activeTab {
      border-top: 2px solid #0091FF;
      font-weight: 500;
    }
  }
}
.btnDisabled {
  cursor: not-allowed !important;
  background-color: #F2F2F2 !important;
}
</style>
