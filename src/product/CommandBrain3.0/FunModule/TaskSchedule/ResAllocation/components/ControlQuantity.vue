<template>
    <div :class="$style.ControlQuantity">
      <div :class="inputVal==1?$style.notCursor:''" @click="subtract" >-</div>
      <input type="number" v-model="inputVal" @change="inputChange" >
      <div :class="inputVal==max?$style.notCursor:''" @click="plus">+</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: 1,
    },
  },
  setup(props, contxt) {
    // 值
    const inputVal = ref<any>(Number(props.modelValue || 1));
    // 减
    function subtract() {
      if (inputVal.value > 1) {
        inputVal.value -= 1;
        contxt.emit('update:modelValue', inputVal.value);
      }
    }
    // 加
    function plus() {
      if (props.max > inputVal.value) {
        inputVal.value += 1;
        contxt.emit('update:modelValue', inputVal.value);
      }
    }
    // 值改变时
    function inputChange() {
      if (inputVal.value > props.max) {
        inputVal.value = props.max;
      } else if (inputVal.value < 1) {
        inputVal.value = 1;
      }
    }
    watch(inputVal, (val) => {
      // console.log(val);

      contxt.emit('update:modelValue', val);
      contxt.emit('change', val);
    });
    watch(() => props.modelValue, (val) => {
      inputVal.value = val;
    });
    return {
      inputVal,
      subtract,
      plus,
      inputChange,
    };
  },
});
</script>

<style lang="scss" module>
.ControlQuantity{
    width: 100%;
    height: 100%;
    display: flex;
    &>div{
      cursor: pointer;
      width: 23px;
      text-align: center;
      line-height: 22px !important;
      height: 22px;
      background: rgba(67, 70, 71, .5);
      border-radius: 1px 0px 0px 1px;
      color: rgba(204, 204, 204, 1);
    }
    &>input{
      color: #fff;
      width: 33px;
      box-sizing: border-box;
      height: 22px;
      background: rgba(67, 70, 71, .5);
      outline: none;
      border: none;
      text-align: center;
      border-left: 1px solid rgba(0, 0, 0, .5);
      border-right: 1px solid rgba(0, 0, 0, .5);
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button { -webkit-appearance: none; }
      &{ -moz-appearance: textfield; }
    }
    .notCursor{
      cursor: not-allowed;
    }
}
</style>
