<template>
  <div v-loading="isLoading > 0" :class="$style.container">
    <main>
      <!-- A: 会议列表 -->
      <nav>
        <!-- A-1: 启动会议按钮 -->
        <StartButton @click="openStartMeetingDialog" />
        <!-- A-2: 会议历史记录列表 -->
        <HistoryList ref="historyListRef" @change="getDetail" />
      </nav>
      <!-- B: 会议详情 -->
      <section>
        <!-- B-1: 会议状态 -->
        <MeetingStatus
          :data="curMeetingDetail?.meetingInfo"
          @invite="handleAddNewMember"
          @update="handleUpdate"
        />
        <!-- B-2: 会议成员 -->
        <MeetingMembers :data="curMeetingDetail?.members" />
        <!-- B-3: 会议纪要 -->
        <MeetingLog
          :attachments="curMeetingDetail?.files"
          :log="curMeetingDetail?.meetingInfo?.remark"
          :meeting-id="curMeetingDetail?.meetingInfo?.id"
          @update="handleUpdate"
        />
      </section>
    </main>
    <!-- C: 底部按钮 -->
    <footer>
      <Button
        v-if="/* 会议中 */ curMeetingDetail?.meetingInfo?.meetingStatus === 1"
        @click="rejoinMeeting"
      >
        重新入会
      </Button>
      <Button
        v-if="/* 会议中 */ curMeetingDetail?.meetingInfo?.meetingStatus === 1"
        type="danger"
        @click="handleStopMeeting"
      >
        结束会议
      </Button>
      <Button
        v-else-if="
          /* 已结束 */ curMeetingDetail?.meetingInfo?.meetingStatus === 0
        "
        @click="restartMeeting"
      >
        重启会议
      </Button>
    </footer>
  </div>
  <!-- 发起会议弹窗 -->
  <StartMeetingDialog ref="startMeetingDialogRef" @refresh="refreshList" />
  <!-- 选择会议成员弹窗 -->
  <SelectMemberDialog ref="selectMemberDialogRef" />
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  provide,
  getCurrentInstance,
  onBeforeUnmount,
} from 'vue';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue';
import {
  queryMeetingStatus,
  addCallback,
  createMeeting,
  removeCallback,
  stopMeeting,
  addMeetingMembers,
  uds,
  meetingStartTime,
  heartbeat,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import StartButton from './components/StartButton/StartButton.vue';
import HistoryList from './modules/HistoryList/HistoryList.vue';
import MeetingStatus from './modules/MeetingStatus/MeetingStatus.vue';
import MeetingMembers from './modules/MeetingMembers/MeetingMembers.vue';
import MeetingLog from './modules/MeetingLog/MeetingLog.vue';
import StartMeetingDialog from './modules/StartMeetingDialog/StartMeetingDialog.vue';
import SelectMemberDialog from './modules/SelectMemberDialog/SelectMemberDialog.vue';

export default defineComponent({
  name: 'Meeting',
  components: {
    Button,
    // 启动会议按钮
    StartButton,
    // 会议历史记录列表
    HistoryList,
    // 会议状态
    MeetingStatus,
    // 会议成员
    MeetingMembers,
    // 会议纪要
    MeetingLog,
    // 发起会议弹窗
    StartMeetingDialog,
    // 选择会议成员弹窗
    SelectMemberDialog,
  },
  setup() {
    // 切换模块时，刷新会议状态
    queryMeetingStatus();
    const {
      $http,
      $message,
    }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const state = reactive({});
    const isLoading = ref(0);
    provide('isLoading', isLoading);
    const curMeetingDetail = ref<any>(null);
    const startMeetingDialogRef = ref<typeof StartMeetingDialog | null>(null);
    const selectMemberDialogRef = ref<typeof SelectMemberDialog | null>(null);
    const historyListRef = ref<typeof HistoryList | null>(null);
    // uds登录状态查看
    const udsLoginState = ref(false);

    // 打开开始会议弹窗
    function openStartMeetingDialog() {
      if (startMeetingDialogRef.value) {
        startMeetingDialogRef.value.open();
      }
    }
    // 打开选择会议成员弹窗
    function openSelectMemberDialog(options?: any) {
      if (selectMemberDialogRef.value) {
        return selectMemberDialogRef.value.open(options);
      }
      return Promise.resolve();
    }
    provide('inviteMember', openSelectMemberDialog);
    // 获取会议详情
    function getDetail(meetingItem: any) {
      if (meetingItem) {
        const request = {
          method: 'get',
          service: 'flight',
          url: '/meeting/csMeetingRecord/info/',
          params: {
            id: meetingItem.id,
          },
        };
        isLoading.value += 1;
        curMeetingDetail.value = null;
        $http(request)
          .then((response: any) => {
            if (response.code === 0 && response.data?.detail) {
              curMeetingDetail.value = response.data?.detail;
            } else {
              $message.error(
                `获取会议记录详情失败，错误代码${response.code}，错误信息：${response.msg}`,
              );
            }
          })
          .catch((error: Error) => {
            $message.error(`获取会议记录详情失败，错误信息：${error}`);
          })
          .finally(() => {
            isLoading.value -= 1;
          });
      }
    }
    // 更新列表
    function refreshList() {
      if (historyListRef.value) {
        historyListRef.value.handleSearch();
      }
    }
    // 更新会议详情
    function handleUpdate(options: any) {
      const oldValue = curMeetingDetail.value?.meetingInfo;
      if (oldValue && options) {
        isLoading.value += 1;
        const request = {
          method: 'post',
          service: 'flight',
          url: '/meeting/csMeetingRecord/update',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            ...oldValue,
            ...options,
          },
        };
        $http(request)
          .then((response: any) => {
            if (response.code === 0) {
              $message.info('修改成功');
              getDetail(curMeetingDetail.value?.meetingInfo);
              refreshList();
            } else {
              $message.error(
                `更新失败，错误代码${response.code}，错误信息：${response.msg}`,
              );
            }
          })
          .catch((error: Error) => {
            $message.error(`更新失败，错误信息：${error}`);
          })
          .finally(() => {
            isLoading.value -= 1;
          });
      }
    }
    // 重启会议
    function restartMeeting() {
      queryMeetingStatus().then(() => {
        if (meetingStartTime.value) {
          $message.error('重启失败，请先结束 UDS 当前正在进行中的会议');
        } else {
          const members = curMeetingDetail.value?.members?.map((i: any) => ({
            Id: i.memberId || i.id,
            Type:
              i.memberType < 5
                ? 1
                : i.memberType === 8
                ? 4
                : i.memberType === 5
                ? 9
                : 8,
            Name: i.memberName || i.memberCode,
            Number: i.memberCode,
          }));
          const cb = (code: number, message: any) => {
            if (code === 103) {
              if (message.result) {
                $message.info('重启会议成功');
                refreshList();
                getDetail(curMeetingDetail.value?.meetingInfo);
              } else {
                $message.error('重启会议失败');
              }
              removeCallback(cb);
            }
          };
          addCallback(cb);
          createMeeting(
            curMeetingDetail.value?.meetingInfo?.title,
            members,
            curMeetingDetail.value?.meetingInfo?.eventId,
          );
        }
      });
    }
    // 停止会议
    function handleStopMeeting() {
      stopMeeting();
    }
    // 会议状态变化，刷新数据
    const cb = (code: number) => {
      if (code === 105 || code === 103 || code === 107) {
        refreshList();
        getDetail(curMeetingDetail.value?.meetingInfo);
      }
    };
    addCallback(cb);
    onBeforeUnmount(() => {
      removeCallback(cb);
    });
    // 会议中添加人员
    function handleAddNewMember() {
      openSelectMemberDialog().then((newMembers: any) => {
        addMeetingMembers(
          newMembers.map((i: any) => ({
            Id: i.joinType ? 0 : i.id,
            Type:
              i.memberType < 5
                ? 1
                : i.memberType === 8
                ? 4
                : i.memberType === 5
                ? 9
                : 8,
            Name: i.joinType ? '' : i.name,
            Number: i.joinType
              ? i.memberCode
              : i.contextValue || i.phone || i.mobile1 || i.mobile2 || i.meetingCode || i.code,
          })),
        );
      });
    }
    // 重新入会
    function rejoinMeeting() {
      udsHeartbeat();
    }
    
    // 检测uds登录
    function udsHeartbeat(): void {
      console.log('【UDS】收到心跳检测的延迟检验时间：', (window as any)?.config?.UDSMQConfig?.heartbeatAckTime)
      if (uds.connected) {
        heartbeat();
        addCallback(udsHandleMQMessage);
        setTimeout(() => {
          if (!udsLoginState.value) {
            uds.waken();
          }
        }, (window as any)?.config?.UDSMQConfig?.heartbeatAckTime * 1000 || 3000);
      }
    }

    // 收到心跳回复的回调
    function udsHandleMQMessage(code: any, message: any) {
      if (code === 5) {
        udsLoginState.value = true;
      }
    }
    
    return {
      state,
      openStartMeetingDialog,
      startMeetingDialogRef,
      selectMemberDialogRef,
      historyListRef,
      isLoading,
      getDetail,
      curMeetingDetail,
      handleUpdate,
      openSelectMemberDialog,
      refreshList,
      restartMeeting,
      handleStopMeeting,
      rejoinMeeting,
      handleAddNewMember,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  height: 100%;
  & > main {
    height: calc(100% - 60px);
    display: flex;
    & > nav {
      border-right: 1px solid rgba(255, 255, 255, 0.15);
      width: 410px;
      box-sizing: border-box;
      padding: 10px;
    }
    & > section {
      flex: 1;
      padding: 10px;
    }
  }
  & > footer {
    height: 59px;
    line-height: 59px;
    text-align: right;
    padding-right: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    & > * {
      margin-left: 10px;
    }
  }
}
</style>
