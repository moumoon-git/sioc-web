<template>
  <div :class="$style.listStyle">
    <div :class="$style.informationPic" />
    <div :class="$style.left">
      <p>预案名称:</p>
      <p>预案版本:</p>
      <p>所属分类:</p>
      <p>编码:</p>
      <p>编制单位:</p>
      <p>发布单位:</p>
      <p>发布时间:</p>
      <p>修订时间:</p>
      <p>适用区域:</p>
      <p>备注:</p>
    </div>
    <div :class="$style.right">
      <p>{{ currentReservePlan.name }}</p>
      <p>{{ currentReservePlan.version }}</p>
      <p>{{ currentReservePlan.type }}</p>
      <p>{{ currentReservePlan.code }}</p>
      <p>{{ currentReservePlan.builder }}</p>
      <p>{{ currentReservePlan.publishUnit }}</p>
      <p>{{ currentReservePlan.publishDate }}</p>
      <p>{{ currentReservePlan.publishDate }}</p>
      <p>{{ currentReservePlan.area }}</p>
      <p>{{ currentReservePlan.remark }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ReservePlanVersionInformation',
  setup() {
    const currentReservePlan:any = ref({});
    const store = useStore(); // 使用vuex
    onMounted(() => {
      currentReservePlan.value = store.state.reservePlan.currentReservePlan;
    });
    return {
      currentReservePlan,
    };
  },
});
</script>

<style lang="scss" module>
  .listStyle {
    width: 830px;
    height: 38vh;
    border: 1px solid #00C1DE;
    background: rgba(0, 0, 0, 0.29);
    margin: 12px 0px 0px 20px;
    color: #fff;
    position: relative;
    overflow: auto;
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
    .informationPic {
      background: url(./assets/informationPic.svg) no-repeat;
      width: 145px;
      height: 128px;
      position: absolute;
      right: 19px;
      top: 20px;
    }
    .left {
      margin: 20px 0px 0px 20px;
      position: absolute;
      p {
        height: 22px;
        margin-bottom: 10px;
      }
    }
    .right {
      margin: 20px 0px 0px 102px;
      position: absolute;
      p {
        height: 22px;
        margin-bottom: 10px;
      }
    }
  }
</style>
