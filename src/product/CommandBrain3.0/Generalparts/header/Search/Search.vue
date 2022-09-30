<template>
  <div class="visualization-header-search">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      @change="handleChange"
      @input="handleInput"
      @focus="isListShowed = true;"
      @blur="isListShowed = false;"
    >
    <button
      :class="{ 'visualization-header-search__button--clear': modelValue }"
      @click="handleClear"
    />
    <List
      v-show="isListShowed"
      class="visualization-header-search__result"
      :list-data="searchResult"
      @click="$emit('click', $event);"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import List from '../List/List.vue';

export default defineComponent({
  name: 'Search',
  components: {
    List,
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
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
    };
  },
  methods: {
    handleInput(event: Event): void {
      if (!this.modelModifiers.lazy) {
        this.$emit('update:modelValue', (event.target as HTMLInputElement).value);
        this.$emit('change', (event.target as HTMLInputElement).value);
      }
    },
    handleChange(event: Event): void {
      if (this.modelModifiers.lazy) {
        this.$emit('update:modelValue', (event.target as HTMLInputElement).value);
        this.$emit('change', (event.target as HTMLInputElement).value);
      }
    },
    handleClear() {
      if (this.modelValue) {
        this.$emit('update:modelValue', '');
        this.$emit('change', '');
      }
    },
  },
});
</script>

<style lang="scss">
.visualization-header-search {
  border: 1px solid #050505;
  background: #050505;
  color: #A6ADB4;
  box-sizing: border-box;
  height: 44px;
  line-height: 44px;
  padding: 0 14px;
  position: relative;
  & > input {
    outline: none;
    border: none;
    background: transparent;
    color: #FFFFFF;
    font-size: 18px;
    width: calc(100% - 30px);
    &::placeholder {
      color: #A6ADB4;
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
      opacity: .5;
      transition: opacity .3s;
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
    top: 44px;
    transform: translate(-50%, 0);
    & > ul > li {
      font-size: 14px;
      line-height: 14px;
    }
  }
}
</style>
