<template>
  <div class="communication-dispatch-phone-call-history">
    <!-- 联系人 -->
    <div v-if="showContactor" class="call-history-contactor">
      <div class="call-history-contactor_left">
        <!-- callType: 0是呼入, 1是呼出 -->
        <span>{{
          (historyData.contactor ? historyData.contactor : historyData.callType === 0 ? historyData.calling : historyData.called) +
            (historyData.workUnit || historyData.position
              ? '（' +
                (historyData.workUnit ? historyData.workUnit + '/' : '') +
                (historyData.position ? historyData.position : '') +
                '）'
              : '')
        }}</span>
        <!-- <span class="more"></span> -->
        <ContactMoreButton
          :id="historyData.id || historyData.contactorId"
        />
      </div>
      <div class="call-history-contactor_right">
        <Button @click="handleMakeCall(historyData)">
          <img src="../assets/svg/phone1.svg" class="button_pre" />
          拨打
        </Button>
      </div>
    </div>

    <div v-if="showAudio" class="call-history-information">
      <!-- 类型 | 时间 | 时长 | 坐席 -->
      <div class="call-history-information_top">
        <div class="call-history-information_top_phone-type">
          <img v-if="historyData.direct === '已拨'" src="../assets/svg/circle-blue.svg" alt="" />
          <img
            v-else-if="historyData.direct === '未接'"
            src="../assets/svg/circle-red.svg"
            alt=""
          />
          <img v-else src="../assets/svg/circle-green.svg" alt="" />
          {{ historyData.direct === '已拨' ? '呼出' : historyData.direct }}
        </div>
        <span>{{ '时间：' + (historyData.startTime ? historyData.startTime : '-') }}</span>
        <span>{{ '时长：' + (historyData.diffTime ? historyData.diffTime : '-') }}</span>
        <span>{{ '坐席号码：' + (historyData.agentName ? historyData.agentName : '-') }}</span>
      </div>

      <!-- 进度条、下载、 语音转文字 -->

      <div class="call-history-information_center">
        <Audio
          :id="historyData.id + randomWord"
          :audioData="historyData"
          @hanleTurnText="hanleTurnText"
          @update="handleUpdateHistoryData"
        />
      </div>

      <!-- 备注 -->
      <div class="call-history-information_bottom">
        <span :title="historyData.remark">{{
          '备注：' + (historyData.remark ? historyData.remark : '-')
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject } from 'vue';
import Button from './Button.vue';
import Audio from './Audio/Audio.vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import { makePhoneCall } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import { useStore } from 'vuex';
const getRandomWord = require('@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Phone/assets/js/randomWord')
  .default;

export default defineComponent({
  name: 'CallHistory',
  components: {
    Button,
    Audio,
    ContactMoreButton,
  },
  props: {
    // 是否显示联系人
    showContactor: {
      type: Boolean,
      default: true,
    },
    // 是否显示录音
    showAudio: {
      type: Boolean,
      default: true,
    },
    // 联系人电话历史
    historyData: {
      type: Object,
      default: () => [],
    },
  },
  emits: {
    hanleTurnText: null,
    handleAudioPlay: null,
    update: null,
  },
  setup(props, { emit }) {
    const store = useStore();
    const randomWord = ref(''); // 随机数 用来区别audio的唯一性
    // 事件Id
    const eventId = store.state.event?.id || '';
    randomWord.value = getRandomWord(2);
    /**
     * @description 更新数据
     */
    function handleUpdateHistoryData(obj: any) {
      emit('update', obj);
    }

    /**
     * @description 语音转文字
     */
    function hanleTurnText() {
      emit('hanleTurnText');
    }

    /**
     * @description 拨打电话
     */
    function handleMakeCall(item: any) {
      // console.log(item);
      makePhoneCall({
        phone: item.call,
        type: 1,
        id: item.contactorId,
        name: item.contactor,
      },
      [{
        key: 'eventId',
        value: store.state.event?.id,
        type: 1
      }]);
    }

    watch(props.historyData, (newValue: any, oldValue: any) => {
      // 监听当前选中的联系历史
      // console.log('监听当前选中的联系历史', newValue.id, oldValue.id);
    });
    return {
      hanleTurnText,
      randomWord,
      handleMakeCall,
      handleUpdateHistoryData,
    };
  },
});
</script>

<style lang="scss">
.communication-dispatch-phone-call-history {
  width: 724px;
  // height: 146px;
  // border: 1px solid rgba(0, 193, 222, 0.29);
  box-sizing: border-box;

  // 联系人
  .call-history-contactor {
    width: 100%;
    height: 52px;
    line-height: 52px;
    padding: 0 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .call-history-contactor_left {
      color: #ffffff;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .more {
        width: 15px;
        height: 26px;
        background: url('../assets/svg/more.svg');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: block;
      }
    }
  }

  // 历史详情
  .call-history-information {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 93px;
    padding: 10px 0;
    box-sizing: border-box;

    span {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      padding: 0 20px;
    }

    .call-history-information_top {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .call-history-information_top_phone-type {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        padding: 0 20px 0 14px;
        position: relative;
      }

      span {
        position: relative;
      }

      & > span::after,
      .call-history-information_top_phone-type::after {
        content: '';
        display: block;
        position: absolute;
        z-index: 1;
        background: url('../assets/svg/division.png');
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 2px;
        height: 22px;
        top: 0px;
        right: 0px;
      }
      & > span:last-child:after {
        background: transparent;
      }
    }

    .call-history-information_center {
      height: 20px;
    }

    .call-history-information_bottom {
      & > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        display: block;
        box-sizing: border-box;
      }
    }
  }
}
</style>
