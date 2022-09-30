<template>
  <!-- 上方标题 -->
  <header
    :class="$style.expandHeader"
    :style="headerStyle?'margin:10px 10px 0px 10px;':''"
    @click="currExpand = item?.id,isExpand=!isExpand"
  >
    <!-- 箭头 -->
    <img
      :class="currExpand===item.id && isExpand ? $style.headerDown : $style.headerDownReset"
      src="./assets/down.svg"
      alt=""
    >
    <slot name="head" />
  </header>
  <!-- 展开体 -->
  <main
    v-if="currExpand===item.id && isExpand"
    :class="currExpand===item.id && isExpand ? $style.expandMain : $style.expandMainReset"
    :style="headerStyle?'margin:0px 10px 0px 10px;':''"
  >
    <slot name="main" />
  </main>
</template>

<script setup>
import {
  ref,
  defineProps,
} from 'vue';

const currExpand = ref(''); // 当前展开项id
const isExpand = ref(false); // 当前项是否展开
const props = defineProps({
  // 当前项
  item: {
    type: Object,
    default: () => ({}),
  },
  // 是否用head margin
  headerStyle: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" module>
  @mixin main {
    position: relative;
    margin: 0px;
    border-left: 1px solid rgba(0, 193, 222, 0.58);
    border-right: 1px solid rgba(0, 193, 222, 0.58);
    border-bottom: 1px solid rgba(0, 193, 222, 0.58);
    background: #141D1F;
  }
  .headerDown {
    cursor: pointer;
    transform: rotate(180deg);
    transition: all .3s;
  }
  .headerDownReset {
    cursor: pointer;
    transform: rotate(0deg);
    transition: all .3s;
  }
  .expandMain {
    @include main;
    height: auto;
    transition: all .3s;
  }
  .expandMainReset {
    @include main;
    height: 0px;
    transition: all .3s;
  }
  .expandHeader {
    position: relative;
    color: #FFF;
    border: 1px solid rgba(0, 193, 222, 0.58);
    background: #141D1F;
    img {
      float: right;
      margin: 15px 10px 0px 0px;
    }
  }
</style>
