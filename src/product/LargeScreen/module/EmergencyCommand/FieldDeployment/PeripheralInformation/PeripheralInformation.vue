<template>
  <div :class="$style.PeripheralInformation">
    <ul>
      <li>
        <span>监控摄像头</span>
        <span>38</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({});
</script>

<style lang="scss" module>
.PeripheralInformation {
  & > ul {
    & > li {
      width: 281px;
      height: 59px;
      border: 2px solid;
      border-image: linear-gradient(
          90deg,
          rgba(0, 118, 204, 1),
          rgba(0, 241, 243, 1)
        )
        2 2;
      & > span {
        &:first-child {
          font-size: 24px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
        }
        &:last-child {
          font-size: 28px;
          font-family: DIN-Bold, DIN;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
  }
}
</style>