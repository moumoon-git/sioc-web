<template>
  <header class="visualization-right-top-header">
    <button @click="$emit('go-back')" v-if="showBack">
      返回
    </button>
    <h4>
      <slot />
    </h4>
    <span>
      <slot name="right" />
    </span>
  </header>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TopHeader',
  props:{
    showBack:{
      type:Boolean,
      default:true
    }
  },
  emits: ['go-back'],
  data() {
    return {

    };
  },
});
</script>

<style lang="scss">
.visualization-right-top-header {
  position: relative;
  height: 30px;
  background: #394649;
  margin-bottom: 20px;
  // 梯形
  &::after {
    content: '';
    display: block;
    width: 200px;
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 10px solid #394649;
  }
  // 返回按钮
  & > button:first-child {
    color: #FFFFFF;
    font-size: 14px;
    position: absolute;
    left: 24px;
    top: 5px;
    background: transparent;
    border: none;
    outline: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    &::before {
      content: '';
      display: block;
      width: 8px;
      height: 14px;
      position: absolute;
      left: -11px;
      top: 3px;
      background: no-repeat center/100% 100% url(./assets/left.svg);
    }
    &:hover {
      color: #00ECFF;
      &::before {
        background-image: url(./assets/left_hover.svg);
      }
    }
  }
  // 标题
  & > h4 {
    margin: 0;
    padding: 0;
    color: #00ECFF;
    font-size: 18px;
    text-align: center;
    position: absolute;
    top: 6px;
    left: 50%;
    width: 300px;
    transform: translateX(-50%);
    z-index: 1;
  }
  // 右侧数字
  & > span:last-child {
    position: absolute;
    color: #FFFFFF;
    right: 6px;
    top: 5px;
    text-align: right;
  }
}
</style>
