<template>
  <div class="detailoutside">
    <div class="detailoutside_List">
      <div class="detailoutside_List__detailItem">
        <div class="detailoutside_List__detailItem_t">
          <div class="detailoutside_List__detailItem_t_Item">
            <div class="detailoutside_List__detailItem_t_Item__unitNum">
              0
            </div>
            <div class="detailoutside_List__detailItem_t_Item__uint">
              min
            </div>
          </div>
          <div class="detailoutside_List__detailItem_t_Item">
            <div class="detailoutside_List__detailItem_t_Item__unitNum">
              14
            </div>
            <div class="detailoutside_List__detailItem_t_Item__uint">
              Km
            </div>
          </div>
          <div class="detailoutside_List__detailItem_t_Item">
            <div class="detailoutside_List__detailItem_t_Item__unitNum">
              8
            </div>
            <div class="detailoutside_List__detailItem_t_Item__uint">
              红绿灯
            </div>
          </div>
        </div>
        <div class="detailoutside_List__detailItem_b">
          途径：珠江西路、猎德大桥、新港东路
        </div>
        <div class="detailoutside_List__detailItem__itemName">
          路程最短
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LineDetailList',
  components: {},
  props: {
    // 线巡查记录数组
    lineArr: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style lang="scss">
.detailOutside {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .detailoutside_List {
    width: 100%;
    height: 100%;
    overflow: auto;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    .detailoutside_List__detailItem {
      position: relative;
      width: 380px;
      height: 84px;
      background: linear-gradient(
        90deg,
        #00c1de -36%,
        rgba(24, 38, 50, 0.1) 100%
      );
      margin-bottom: 10px;
      .detailoutside_List__detailItem_t {
        display: flex;
        height: 60px;
        align-items: center;
        text-align: center;
        color: #fff;
        .detailoutside_List__detailItem_t_Item {
          width: 126px;
          font-size: 30px;
          border-right: 1px solid rgba(255, 255, 255, 0.15);
          height: 23px;
          display: flex;
          justify-content: center;
          .detailoutside_List__detailItem_t_Item__unitNum {
            font-size: 30px;
            line-height: 13px;
          }
          .detailoutside_List__detailItem_t_Item__uint {
            font-size: 14px;
            margin-left: 2px;
          }
        }

        > div:nth-child(3) {
          border: 0;
        }
      }
      .detailoutside_List__detailItem_b {
        color: #a6adb4;
        margin-left: 10px;
      }
      .detailoutside_List__detailItem__itemName {
        position: absolute;
        top: 0;
        right: 0;
        color: #fff;
        background: linear-gradient(45deg, #5abbe0 0%, #7f9fff 100%);
      }
    }
  }
}
</style>
