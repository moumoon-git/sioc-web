<!--组件 —— 按钮-->
<template>
  <div class="communication-dispatch-phone-contactor">
    <img
      v-if="historyData.direct === '已拨'"
      src="../../assets/svg/circle-blue.svg"
      alt=""
      class="phone-type"
    />
    <img
      v-else-if="historyData.direct === '未接'"
      src="../../assets/svg/circle-red.svg"
      alt=""
      class="phone-type"
    />
    <img v-else src="../../assets/svg/circle-green.svg" alt="" class="phone-type" />
    <div class="contactor-info">
      <div class="contactor-name">
        {{
          (historyData.contactor
            ? historyData.contactor
            : historyData.callType === 0
            ? historyData.calling
            : historyData.called) +
            (historyData.workUnit || historyData.position
              ? '（' +
                (historyData.workUnit ? historyData.workUnit + '/' : '') +
                (historyData.position ? historyData.position : '') +
                '）'
              : '')
        }}
      </div>

      <!-- 电话通话开始时间&通话时长 -->
      <div v-if="!isContactor" class="contactor-time">
        <span class="time">{{ historyData.startTime ? historyData.startTime : '' }}</span>
        <span v-if="historyData.diffTime" class="duration">{{ historyData.diffTime }}</span>
      </div>

      <!-- 电话类型&数量 -->
      <div v-else class="contactor-phone-type">
        <template v-if="historyData.counts">
          <div class="contactor-phone-type_item">
            <img src="../../assets/svg/circle-green.svg" alt="" />
            {{ '已接：' + (historyData.counts.answered ? historyData.counts.answered : 0) }}
          </div>
          <div class="contactor-phone-type_item">
            <img src="../../assets/svg/circle-red.svg" alt="" />
            {{ '未接：' + (historyData.counts.unanswer ? historyData.counts.unanswer : 0) }}
          </div>
          <div class="contactor-phone-type_item">
            <img src="../../assets/svg/circle-blue.svg" alt="" />
            {{ '呼出：' + (historyData.counts.out ? historyData.counts.out : 0) }}
          </div>
        </template>
      </div>
    </div>

    <!-- 弹窗 -->
    <div class="dialog_more" @click.stop.prevent>
      <!-- <button class="dialog_more_button">
        <img src="../../assets/svg/flag.svg" alt="指令" />
        <span class="button_text">指令</span>
      </button> -->
      <button class="dialog_more_button" @click="handleCreateOrAddMeeting(historyData)">
        <img src="../../assets/svg/meeting.svg" alt="会议" />
        <span class="button_text">会议</span>
      </button>
      <button class="dialog_more_button" @click="handleMakeCall(historyData)">
        <img src="../../assets/svg/phone-white.svg" alt="拨打" />
        <span class="button_text">拨打</span>
      </button>
      <button class="dialog_more_button">
        <ContactMoreButton :id="contactMoreProps.id">
          <img src="../../assets/svg/more2.svg" alt="更多" />
          <span class="button_text">更多</span>
        </ContactMoreButton>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, inject } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import { makePhoneCall } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Contactor',
  components: {
    ContactMoreButton,
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    historyData: {
      type: Object,
      default: () => ({}),
    },
    isContactor: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    createOrAddMeeting: null,
  },
  setup(props, { emit }) {
    const store = useStore();

    // 更多按钮的props
    const contactMoreProps = reactive({
      id: props.historyData.contactorId,
      phone: props.historyData.call || props.historyData.called,
      modle: 'contactor_contactor',
    });

    const phoneTypeList = ref([
      {
        name: '已接',
        count: 1,
      },
      {
        name: '未接',
        count: 1,
      },
      {
        name: '呼出',
        count: 1,
      },
    ]);
    /**
     * @description 拨打电话
     */
    function handleMakeCall(item: any) {
      makePhoneCall(
        {
          phone: item.call,
          type: 1,
          id: item.contactorId,
          name: item.contactor,
        },
        [
          {
            key: 'eventId',
            value: store.state.event?.id,
            type: 1,
          },
        ],
      );
    }
    /**
     * @description 发起会议
     */
    function handleCreateOrAddMeeting(item: any) {
      emit('createOrAddMeeting', item);
    }
    return {
      phoneTypeList,
      handleCreateOrAddMeeting,
      handleMakeCall,
      contactMoreProps,
    };
  },
});
</script>

<style lang="scss">
@import './assets/css/contactor';
</style>
