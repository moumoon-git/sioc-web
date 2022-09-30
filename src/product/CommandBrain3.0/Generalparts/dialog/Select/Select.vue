<template>
  <div
    :class="[
      'visualization-dialog-select',
      {
        'visualization-dialog-select--expanded': isShow,
        'visualization-dialog-select--top': isTop,
      },
    ]"
    @click="handleClick"
  >
    <input
      v-if="editable && !list[modelValue]"
      :placeholder="placeholder"
      :value="inputValue"
      @input="$emit('update:inputValue', $event.target.value);"
    >
    <input
      v-else
      readonly
      :value="list[modelValue]"
      :placeholder="placeholder"
    >
    <button
      :class="{
        'visualization-dialog-select__clear': clearable && (list[modelValue] || !!inputValue)
      }"
      @click="handleClear"
    />
    <ul>
      <li
        v-for="(item, index) in list"
        :key="index"
        @click="handleSelect(index)"
      >
        {{ item }}
      </li>
      <li v-if="!list?.length">
        暂无数据
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Select',
  props: {
    // 下拉框还是上拉框
    isTop: {
      type: Boolean,
      default: false,
    },
    // 是否可一键清除
    clearable: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Number,
      required: true,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: false,
    },
    // 可编辑时的值
    inputValue: {
      type: String,
      default: '',
    },
  },
  emits: [
    'update:modelValue',
    'change',
    'update:inputValue',
  ],
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    handleClick(): void {
      if (!this.isShow) {
        this.isShow = true;
        document.addEventListener('click', this.clickCallback, true);
      } else {
        this.clickCallback();
      }
    },
    clickCallback(): void {
      setTimeout(() => {
        this.isShow = false;
        document.removeEventListener('click', this.clickCallback, true);
      }, 0);
    },
    handleSelect(index: number): void {
      this.$emit('update:modelValue', index);
      this.$emit('change', index);
    },
    handleClear(event: Event): void {
      if (this.clearable && (this.modelValue > -1 || !!this.inputValue)) {
        event.stopPropagation();
        this.$emit('update:modelValue', -1);
        this.$emit('update:inputValue', '');
      }
    },
  },
});
</script>

<style lang="scss">
.visualization-dialog-select {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.65);
  color: #FFFFFF;
  font-size: 18px;
  outline: none;
  display: inline-flex;
  box-sizing: border-box;
  width: 88px;
  height: 29px;
  padding: 0 7px 0 12px;
  text-align: center;
  vertical-align: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  vertical-align: middle;
  &:hover {
    border-color: #56E9FF;
  }
  & > input {
    flex: 1;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #FFFFFF;
    text-align: left;
    font-size: 14px;
    cursor: pointer;
  }
  & > button {
    align-self: center;
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    border: none;
    outline: none;
    background: no-repeat center/100% auto url('./assets/arrow.svg') transparent;
    cursor: pointer;
    transition: transform .3s;
  }
  & > ul {
    margin: 0;
    padding: 0;
    list-style: none;
    background: rgba(5, 5, 5, .9);
    width: 100%;
    position: absolute;
    bottom: -10px;
    left: -1px;
    transform: translateY(100%);
    max-height: 0;
    transition: max-height .3s;
    overflow-y: auto;
    z-index: 1;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    & > li {
      &:hover {
        color: #56E9FF;
      }
      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, .2);
      }
    }
  }
  &--expanded {
    & > ul {
      max-height: 135px;
      box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.8);
      border: 1px solid #00C1DE;
    }
    & > button:not(.visualization-dialog-select__clear) {
      transform: rotate(-180deg);
    }
  }
  &--top {
    & > ul {
      bottom: auto;
      top: -4px;
      transform: translateY(-100%);
    }
  }
  &__clear {
    transition: unset !important;
    background-image: url(./assets/clear.svg) !important;
    &:hover {
      background-image: url(./assets/clear-hover.svg) !important;
    }
  }
}
</style>
