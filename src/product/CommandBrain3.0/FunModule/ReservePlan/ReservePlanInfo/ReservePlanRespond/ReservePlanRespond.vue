<template>
  <div :class="$style.respondLevel">
    <div :class="$style.frame">
      <!-- 响应等级 -->
      <SpecialHorizonList
        :title="'响应等级'"
        :list="buttonList"
        @handleClick="handleLevelClick"
      >
        <template #headerIcon>
          <img
            src="./assets/respondLevel.svg"
            style="position: relative;
            margin: 13px 0px 0px 10px;
            float: left;"
          >
        </template>
      </SpecialHorizonList>
    </div>
    <div :class="$style.frame">
      <!-- 等级详情 -->
      <WarnAndLevelDetail
        :title1="'信号颜色'"
        :title2="'事件等级'"
        :title3="'等级描述'"
        :prop2="detailList?.signalName"
        :prop3="detailList?.remark"
        :detail-list="detailList"
      />
    </div>
    <div :class="$style.frame">
      <!-- 响应流程 -->
      <RespondFlow
        :button-list="flowList"
        :level-process-list="levelProcessList"
        :charge-man-list="chargeManList"
        :contact-man-list="contactManList"
        @handleClick="handleFlowClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SpecialHorizonList from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/SpecialHorizonList.vue'; // 横向列表
import WarnAndLevelDetail from '../ReservePlanWarningSign/components/WarnAndLevelDetail.vue'; // 预警详情
import RespondFlow from './components/RespondFlow.vue'; // 响应流程

export default defineComponent({
  name: 'ReservePlanRespond',
  components: {
    // 横向列表
    SpecialHorizonList,
    // 详情
    WarnAndLevelDetail,
    // 响应流程
    RespondFlow,
  },
  data() {
    return {
      buttonList: [], // 等级按钮列表
      detailList: '', // 响应详情对象数据
      flowList: [], // 底部流程列表
      levelProcessList: [], // 底部详情伸缩框列表
      chargeManList: [], // 伸缩框里成员
      contactManList: [], // 伸缩框里抄送
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(): void {
      // 响应等级按钮列表
      const request = {
        method: 'POST',
        url: '/emergency/preparation/preplan/getLevels',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          type: 1, // 0：预警信号 1：响应等级
          versionId: Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0) {
          this.buttonList = response.data;
        }
      });
    },
    handleLevelClick(item: any): void {
      console.log(item);
      // 清空初始化
      this.levelProcessList = []; // 底部详情伸缩框列表
      this.chargeManList = []; // 伸缩框里成员
      this.contactManList = []; // 伸缩框里抄送
      // 响应详情对象数据
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
      // 底部流程列表
      const flowRequest = {
        method: 'POST',
        url: '/emergency/preparation/preplan/getLevelProcessList',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          levelId: item.id,
        },
      };
      (this as any).$http(flowRequest).then((response: any) => {
        if (response.errorcode === 0) {
          this.flowList = response.data;
        }
      });
    },
    handleFlowClick(item: any): void {
      // 底部流程列表点击
      const flowRequest = {
        method: 'POST',
        url: '/emergency/preparation/preplan/getLevelProcessTaskList',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          processId: item.id,
        },
      };
      (this as any).$http(flowRequest).then((response: any) => {
        if (response.errorcode === 0) {
          // 底部详情伸缩框列表
          this.levelProcessList = response.data;
        }
      });
    },
  },
});
</script>

<style lang="scss" module>
  .respondLevel {
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
