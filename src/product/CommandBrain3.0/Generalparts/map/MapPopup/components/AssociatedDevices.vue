<template>
  <div :class="$style.AssociatedDevices">
    <h6>关联设备</h6>
    <ul>
      <li>
        <span>监控视频：</span>
        <div>
          <span>名称</span>
          <!-- 操作按钮 -->
          <i>眼睛</i>
          <i :class="$style.localtion"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({});
</script>

<style lang="scss" module>
.AssociatedDevices {
  h6 {
    width: 353px;
    line-height: 30px;
    padding-left: 10px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    height: 30px;
    background: linear-gradient(
      90deg,
      rgba(1, 75, 113, 0.6) 0%,
      rgba(1, 75, 113, 0) 100%
    );
  }
  ul {
    padding: 5px 0;
    box-sizing: border-box;
    list-style: none;
    li {
      display: flex;
      margin: 5px 10px;
      & > span {
        width: 80px;
        min-width: 80px;
      }
      & > div {
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
    }
  }
  .localtion {
    margin-left: 10px;
    display: block;
    width: 16px;
    height: 16px;
    background: url('../assets/localtion.svg') no-repeat;
    background-size: 100% 100%;
  }
}
</style>