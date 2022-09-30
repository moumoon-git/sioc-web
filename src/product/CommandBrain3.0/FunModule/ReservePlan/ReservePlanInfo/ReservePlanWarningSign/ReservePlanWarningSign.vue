<template>
  <div :class="$style.warningSign">
    <div :class="$style.frame">
      <!-- 预警信号 -->
      <SpecialHorizonList
        :title="'预警信号'"
        :list="buttonList"
        :useIcon="true"
        @handleClick="handleClick"
      >
        <template #headerIcon>
          <img
            src="./assets/warnSign.svg"
            style="position: relative;
            margin: 13px 0px 0px 10px;
            float: left;"
          >
        </template>
      </SpecialHorizonList>
    </div>
    <div :class="$style.frame">
      <!-- 预警详情 -->
      <WarnAndLevelDetail
        :title1="'信号颜色'"
        :title2="'事件等级'"
        :title3="'等级描述'"
        :prop2="detailList?.signalName"
        :prop3="detailList?.remark"
        :detail-list="detailList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SpecialHorizonList from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/SpecialHorizonList.vue'; // 横向列表
import WarnAndLevelDetail from './components/WarnAndLevelDetail.vue'; // 详情

export default defineComponent({
  name: 'ReservePlanWarningSign',
  components: {
    // 横向列表
    SpecialHorizonList,
    // 详情
    WarnAndLevelDetail,
  },
  data() {
    return {
      buttonList: [], // 信号按钮列表
      detailList: '', // 信号详情对象数据
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(): void {
      const request = {
        method: 'POST',
        url: '/emergency/preparation/preplan/getLevels',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          type: 0, // 0：预警信号 1：响应等级
          versionId: Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0) {
          this.buttonList = response.data;
        }
      });
    },
    handleClick(item: any): void {
      // 信号详情对象数据
      const detailRequest = {
        method: 'POST',
        url: '/emergency/preparation/preplan/getLevelInfo',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: item.id,
        },
      };
      (this as any).$http(detailRequest).then((response: any) => {
        if (response.errorcode === 0) {
          this.detailList = response.data;
        }
      });
    },
  },
});
</script>

<style lang="scss" module>
  .warningSign {
    width: 832px;
    height: 77vh;
    position: relative;
    margin-left: 20px;
    margin-top: 10px;
    overflow: auto;
    overflow-x: hidden;
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
    .frame {
      background: rgba(0, 0, 0, 0.29);
      border: 1px solid rgba(0, 193, 222, 0.58);
      margin-bottom: 10px;
    }
  }
</style>
