<template>
  <div :class="$style.PollingPopup">
    <header>批量轮询</header>
    <!-- <div>
      <span>轮询画面：</span>
      <Select v-model="pollingValue" :list="pollingData" />
    </div> -->
    <div>
      <span>翻页周期：</span>
      <Select v-model="cycleValue" :list="cycleData" />
    </div>
    <div>
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary">批量轮询</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import Select from '@/product/CommandBrain3.0/Generalparts/right/Select/Select.vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  components: {
    Select,
  },
  setup() {
    // const pollingData = ref([1, 4, 6, 9, 12, 16]);
    // const pollingValue = ref();
    const cycleData = ref(['1分钟', '3分钟', '5分钟', '10分钟']);
    const cycleValue = ref();
    return {
      //   pollingData,
      //   pollingValue,
      cycleData,
      cycleValue,
    };
  },
});
</script>

<style lang="scss" module>
.PollingPopup {
  position: absolute;
  bottom: 0;
  right: 454px;
  width: 197px;
  //   height: 161px;
  background: rgba(14, 23, 24, 0.8);
  padding: 10px 0;
  box-sizing: border-box;
  & > header {
    font-size: 14px;
    font-weight: 400;
    color: #56e9ff;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 13px;
      background: #56e9ff;
      box-shadow: 0px 0px 16px 0px #008cff;
      border-radius: 2px;
      margin-right: 6px;
    }
  }
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    & > span {
      font-size: 18px;
      font-weight: 400;
      color: #ffffff;
    }
    & > button {
      width: 64px;
      height: 32px;
      border-radius: 0;
      text-align: center;
      line-height: 32px;
      padding: 0;
      &:first-child {
        font-size: 14px;
        font-weight: 400;
        color: #a6adb4;
        background: transparent;
        border: 1px solid #a6adb4;
      }
      &:last-child {
        border: 1px solid #00c1de;
        background: #00c1de;
      }
    }
  }
}
</style>