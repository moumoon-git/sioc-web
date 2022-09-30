<template>
  <div class="visualization-header-search">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      @change="handleChange"
      @input="handleInput"
    >
    <button
      v-if="showSearch"
      @click="searchFun"
    />
    <button
      v-else
      :class="{ 'visualization-header-search__button--clear': modelValue }"
      @click="handleClear"
    />
    <FlightSearchList
      v-show="isListShowed"
      class="visualization-header-search__result"
      :list-data="searchResult"
      @showPointPop="showPointPop"
      @click="$emit('click', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FlightSearchList from './FlightSearchList.vue';

export default defineComponent({
  name: 'Search',
  components: {
    FlightSearchList,
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: () => [],
    },
    modelModifiers: {
      type: Object,
      default: () => ({}),
    },
    searchResult: {
      type: Array,
      default: (): Array<number | string> => [],
    },
    placeholder: {
      type: String,
      default: '请输入搜索关键词',
    },
  },
  emits: ['update:modelValue', 'change', 'click'],
  data() {
    return {
      isListShowed: false,
      showSearch: true,
    };
  },
  watch: {
    isListShowed(newV) {
      console.log(newV);
    },
  },
  methods: {
    showPointPop(obj: any) {
      console.log(obj);
    },
    handleInput(event: Event): void {
      if (!this.modelModifiers.lazy) {
        if ((event.target as HTMLInputElement).value === '') {
          this.isListShowed = false;
          this.showSearch = true;
        }
      }
    },
    handleChange(event: Event): void {
      if (!this.modelModifiers.lazy) {
        this.$emit(
          'update:modelValue',
          (event.target as HTMLInputElement).value,
        );
        this.$emit('change', (event.target as HTMLInputElement).value);
        this.isListShowed = true;
        this.showSearch = false;
      }
    },
    // 搜索
    searchFun() {
      console.log(this.modelValue);
      this.showSearch = false;
    },
    handleClear() {
      if (this.modelValue) {
        this.$emit('update:modelValue', '');
        this.$emit('change', '');
        this.isListShowed = false;
        (window as any).map.clearAtPresentMarkData(
          (window as any).mapCoverageName.search,
        );
        (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
      }
      this.showSearch = true;
    },
  },
});
</script>

<style lang="scss">
.visualization-header-search {
  border: 1px solid #050505;
  background: #050505;
  color: #a6adb4;
  box-sizing: border-box;
  height: 44px;
  line-height: 44px;
  padding: 0 14px;
  position: relative;
  & > input {
    outline: none;
    border: none;
    background: transparent;
    color: #ffffff;
    font-size: 18px;
    width: calc(100% - 30px);
    &::placeholder {
      color: #a6adb4;
    }
  }
  & > button {
    background: no-repeat center/100% 100% url(./assets/search.svg);
    width: 16px;
    height: 16px;
    border: none;
    outline: none;
    margin-left: 10px;
    &.visualization-header-search__button--clear {
      background-image: url(./assets/clear.svg) !important;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.3s;
      &:hover {
        opacity: 1;
      }
    }
  }
  &:focus-within,
  &:hover {
    & > button {
      background-image: url(./assets/search_active.svg);
    }
  }
  // 搜索结果
  &__result {
    position: absolute;
    width: 100%;
    left: 50%;
    top: 49px;
    z-index: 9;
    transform: translate(-50%, 0);
    & > ul > li {
      font-size: 14px;
      line-height: 14px;
      display: flex;
      align-items: center;
      position: relative;
    }
  }
}
</style>
