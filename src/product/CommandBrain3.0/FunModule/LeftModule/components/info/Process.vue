<template>
  <div>
    <!-- 流程 -->
    <ul :class="$style.process">
      <li
        v-for="(item,index) in processData"
        :key="index"
      >
        <wave :type="item.status===1?'green':'red'">
          <span
            v-if="item.status===1"
            :class="$style.waveCompleteSpan"
          >✔</span>
          <span
            v-else
            :class="$style.waveSpan"
          >...</span>
          <!-- {{ item.complete?'✔':'...' }} -->
        </wave>
        <span :style="{color:(item.status===1?'#0BD295':'#F66E6E')}">{{ item.eventStepName }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
// 波浪效果
import wave from '@/product/CommandBrain3.0/Generalparts/left/Wave/Wave.vue';

export default {
  components: {
    wave,
  },
  props: {
    processData: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style module>
.process{
    list-style: none;
    display: flex;
    justify-content: space-between;
    color: #fff;
    margin: 0;
    padding: 0;
}
.process li{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    margin-bottom: 20px;
}
.process li > span {
  position: absolute;
  bottom: -20px;
  white-space: nowrap;
}
.waveCompleteSpan{
    font-size: 19px;
}
.waveSpan{
    font-size: 25px;
    line-height: 13px;
    display: block;
}
</style>
