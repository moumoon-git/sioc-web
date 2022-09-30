<template>
  <div class="waterLevelContainer">
    <div class="warning-table-container">
      <div class="section-label">水库实时预警</div>
      <div class="warning-table">

        <!-- 表头 -->
        <div class="table-header table-col">
          <span style="width: 167px">站名</span>
          <span class="count" style="width: 60px">水位(m)</span>
          <span class="count" style="width: 132px">超警值(m)</span>
        </div>
        <!-- 表身 -->
        <div class="table-body">
          <div class="table-col">
            <span style="width: 167px">大亚湾水库</span>
            <span class="count" style="width: 60px">122.54</span>
            <span class="count yellow" style="width: 132px">130</span>
          </div>
          <div class="table-col">
            <span style="width: 167px">川河水库</span>
            <span class="count" style="width: 60px">122.54</span>
            <span class="count yellow" style="width: 132px">130</span>
          </div>
          <div class="table-col">
            <span style="width: 167px">白石谣水库</span>
            <span class="count" style="width: 60px">122.54</span>
            <span class="count yellow" style="width: 132px">130</span>
          </div>
        </div>

      </div>
    </div>
    <div class="warning-table-container">
      <div class="section-label">河道实时预警</div>
      <div class="warning-table">

         <!-- 表头 -->
        <div class="table-header table-col">
          <span style="width: 167px">站名</span>
          <span class="count" style="width: 60px">水位(m)</span>
          <span class="count" style="width: 132px">超警值(m)</span>
        </div>
        <!-- 表身 -->
        <div class="table-body">
          <div class="table-col">
            <span style="width: 167px">大亚湾水库</span>
            <span class="count" style="width: 60px">122.54</span>
            <span class="count yellow" style="width: 132px">130</span>
          </div>
          <div class="table-col">
            <span style="width: 167px">川河水库</span>
            <span class="count" style="width: 60px">122.54</span>
            <span class="count yellow" style="width: 132px">130</span>
          </div>
          <div class="table-col">
            <span style="width: 167px">白石谣水库</span>
            <span class="count" style="width: 60px">122.54</span>
            <span class="count yellow" style="width: 132px">130</span>
          </div>
        </div>

      </div>
    </div>
    <div class="warning-table-container">
      <div class="section-label">降雨实时预警</div>
      <div class="warning-table">
        
         <!-- 表头 -->
        <div class="table-header table-col">
          <span style="width: 167px">站名</span>
          <span class="count" style="width: 60px">水位(m)</span>
          <span class="count" style="width: 132px">超警值(m)</span>
        </div>
        <!-- 表身 -->
        <div class="table-body">
          <div class="table-col">
            <span style="width: 167px">大亚湾水库</span>
            <span class="count" style="width: 60px">122.54</span>
            <span class="count yellow" style="width: 132px">130</span>
          </div>
          <div class="table-col">
            <span style="width: 167px">川河水库</span>
            <span class="count" style="width: 60px">122.54</span>
            <span class="count yellow" style="width: 132px">130</span>
          </div>
          <div class="table-col">
            <span style="width: 167px">白石谣水库</span>
            <span class="count" style="width: 60px">122.54</span>
            <span class="count yellow" style="width: 132px">130</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  
})
</script>

<style lang="scss" >
.waterLevelContainer {
  background: linear-gradient(90deg, rgba(0, 193, 222, 20%) 0%, rgba(24, 38, 50, 0) 100%);
  width: 100%;
  overflow: hidden;
  padding: 7px 8px;
  margin-top: 10px;

  // 表格
  .warning-table-container {

    .warning-table {
      margin: 11px 0 21px 0;
      .table-header {
        width: 100%;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid rgba(255,255,255,0.15);
        & > span {
          font-size: 14px;
          font-weight: 500;
          color: #32C5FF;
          line-height: 20px;
        }
        .count {
          text-align: right;
        }
      }

      .table-body {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        
        .table-col {
          width: 100%;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          & > span {
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 29px;
          }

          .yellow {
            font-size: 14px;
            font-weight: 400;
            color: #F7B500;
            line-height: 29px;
          }
          .count {
            text-align: right;
          }
        }
        
      }
    }

  }

  .section-label {
    font-size: 16px;
    font-weight: 500;
    color: #56e9ff;
    line-height: 22px;
    padding-left: 8px;
    position: relative;

    &::before {
      display: block;
      content: '';
      position: absolute;
      width: 6px;
      height: 13px;
      background: #56e9ff;
      box-shadow: 0px 0px 16px 0px #008cff;
      border-radius: 2px;
      left: -8px;
      top: calc(50% - 6px);
    }
  }
}
</style>