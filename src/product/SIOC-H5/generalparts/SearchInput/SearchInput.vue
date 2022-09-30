<template>
  <div class="search-container">
    <div class="search-container__left">
      <img src="./assets/images/search.png" alt="" class="search-img" />
      <input
        v-model="searchTxt"
        type="text"
        :readonly="readonly"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', searchTxt.trim())"
        @blur="$emit('blur', searchTxt.trim())"
      />
      <img v-if="searchTxt" src="./assets/images/close.svg" alt="" class="close-img" @click="searchTxt = ''" />
    </div>
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
export default defineComponent({
  name: 'Search',
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      dafault: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const searchTxt = ref('');
    return {
      searchTxt,
    };
  },
});
</script>
<style lang="scss">
.search-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 0.5rem;
  background: #ffffff;

  .search-container__left {
    flex: 1;
    border-radius: 0.25rem;
    background: #f2f2f2;
    height: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0 0.19rem;

    .search-img {
      width: 0.26rem;
      height: 0.27rem;
      margin-right: 0.14rem;
    }
    .close-img {
      width: 0.24rem;
      height: 0.24rem;
      margin-right: 0.18rem;
    }
    & > input {
      flex: 1;
      font-size: 0.28rem;
      font-weight: 400;
      line-height: 0.4rem;
      display: block;
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      margin: 0;
      padding: 0;
      color: #323233;
      text-align: left;
      background-color: transparent;
      border: 0;
      resize: none;
    }
    input[type='search'] {
      -webkit-appearance: none;
    }
    input::-webkit-input-placeholder {
      color: #cccccc;
    }
  }
}
</style>
