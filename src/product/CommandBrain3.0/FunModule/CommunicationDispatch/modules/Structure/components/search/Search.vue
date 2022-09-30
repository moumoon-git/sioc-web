// 搜索框
<template>
  <div class="Dsearch">
    <div class="Dsearch__icon" />
    <input
      v-model="searchValue"
      :placeholder="placeholder"
      type="text"
      class="Dsearch__input"
      @keyup.enter="submitEmit"
      @blur="burEmit"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    placeholder: {
      type: String,
      default: '请输入关键字检索',
    },
  },
  emits: ['searchFun'],
  setup(props, { emit }) {
    const searchValue = ref('');
    // 回车触发
    function submitEmit() {
      emit('searchFun', searchValue.value);
    }
    // 失去焦点触发
    function burEmit() {
      if (searchValue.value === '') {
        emit('searchFun', '');
      } else {
        emit('searchFun', searchValue.value);
      }
    }
    return {
      searchValue,
      submitEmit,
      burEmit,
    };
  },
});
</script>

<style lang="scss">
.Dsearch{
    width: 100%;
    height: 38px;
    display: flex;
    background: rgba(41, 47, 48, 0.77);
    flex-direction: row;
    align-items: center;
    &__icon{
        width: 16px;
        height: 16px;
        background: url(./assets/search.svg)no-repeat;
        margin-left: 10px;
    }
    &__input{
        background: 0;
        outline: 0;
        border: 0;
        color: #fff;
        flex: 1;
        margin-left: 8px;
    }
}
</style>
