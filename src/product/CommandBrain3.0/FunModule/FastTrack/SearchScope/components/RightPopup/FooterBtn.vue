<template>
  <div :class="$style.FooterBtn" v-show="modelBtn && modelBtn.name">
    <span v-if="modelBtn.name !== '标绘数据'">已选 {{ modelBtn.checkData ? modelBtn.checkData.length : 0 }}</span>
    <span v-else></span>
    <!-- 快捷任务 -->
    <div v-if="modelBtn.name === '快捷任务'">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="release">发布</el-button>
    </div>
    <!-- 快捷会议 -->
    <div v-else-if="modelBtn.name === '快捷会议'">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="sponsorMeeting">发起会议</el-button>
    </div>
    <!-- 监控预览 -->
    <div v-else-if="modelBtn.name === '监控预览'">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="startPatrol">批量轮询</el-button>
      <el-button type="primary" @click="handlePreview">批量预览</el-button>
    </div>
    <!-- 集群组呼 -->
    <div v-else-if="modelBtn.name === '集群组呼'">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="handleCallGroupCluster">发起组呼</el-button>
    </div>
    <!-- 标绘数据 -->
    <div v-else-if="modelBtn.name === '标绘数据'">
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
  <StartMeetingDialog ref="startMeetingDialogRef" />
  <!-- 选择会议成员弹窗 -->
  <SelectMemberDialog ref="selectMemberDialogRef" />
  <!-- 批量轮询弹窗 -->
  <!-- <PollingPopup v-show="PollingPopupFlag" @cancel="PollingPopupCancel" /> -->
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, provide, getCurrentInstance } from 'vue';
// 批量轮询弹窗
// import PollingPopup from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/components/RightPopup/PollingPopup.vue';
// 发布任务弹窗
import TaskPublishDialog from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskPublishDialog/TaskPublishDialog.vue';
// 发起会议弹窗
import StartMeetingDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/StartMeetingDialog/StartMeetingDialog.vue';
// 选择会议成员弹窗
import SelectMemberDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/SelectMemberDialog/SelectMemberDialog.vue';
// 组呼
import {
  callGroupCluster,
  initiatePolling,
  uds,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';

export default defineComponent({
  components: {
    // 批量轮询弹窗
    // PollingPopup,
    // 发起会议弹窗
    StartMeetingDialog,
    // 选择会议成员弹窗
    SelectMemberDialog,
  },
  inject: ['$addDialog'],
  props: {
    modelBtn: {
      type: Object,
      default: () => {
        name: ''; //快捷任务 快捷会议 视频预览 集群群呼
        checkData: [];
      },
    },
  },
  setup(props, context) {
    // 使用vuex
    const store = useStore();
    const { $message }: any =
      getCurrentInstance()?.appContext.config.globalProperties;
    // 控制轮询弹窗显示
    const PollingPopupFlag = ref(false);
    // 发起会议弹窗
    const startMeetingDialogRef = ref<typeof StartMeetingDialog | null>(null);
    // 选择会议成员弹窗
    const selectMemberDialogRef = ref<typeof SelectMemberDialog | null>(null);
    // 发起预览
    function handlePreview() {
      store.commit(
        'flightPatrol/SET_flightPatrolPreviewCachePool',
        props.modelBtn.checkData,
      );
    }
    // 发起会议
    function sponsorMeeting() {
      props.modelBtn.checkData.forEach((e: any) => {
        e.id = e.id || e.deviceId;
        if (e.type === '0' || e.type === 0) {
          // 监控视频
          e.memberType = 5;
        } else if (e.type === '1' || e.type === 1) {
          // 会场终端
          e.memberType = 6;
        } else if (e.type === '2' || e.type === 2) {
          // 集群终端
          e.memberType = 8;
        } else if (e.type === '3' || e.type === 3) {
          // WeComm/手持终端
          e.memberType = 7;
        } else if (Object.prototype.hasOwnProperty.call(e, 'position')) {
          // 联系人
          e.memberType = 1;
        }
      });
      console.log(props.modelBtn.checkData);
      if (startMeetingDialogRef.value) {
        startMeetingDialogRef.value.open(props.modelBtn.checkData);
      }
    }
    // 组呼
    function handleCallGroupCluster() {
      if (!props.modelBtn.checkData?.length) {
        $message.error('请勾选组呼成员');
        return;
      }
      callGroupCluster(props.modelBtn.checkData.map((i: any) => ({
        id: i.id || i.deviceId,
        name: i.name || i.deviceName,
        num: i.code || i.number,
      })));
    }
    // 打开选择会议成员弹窗
    function openSelectMemberDialog(options?: any) {
      if (selectMemberDialogRef.value) {
        return selectMemberDialogRef.value.open(options);
      }
      return Promise.resolve();
    }
    provide('inviteMember', openSelectMemberDialog);
    // 轮询弹窗的取消事件
    function PollingPopupCancel() {
      PollingPopupFlag.value = false;
    }
    // 取消
    function cancel() {
      context.emit('cancel', '');
    }
    // 轮询
    function startPatrol() {
      if (!uds.client) {
        $message.error('连接通讯服务器失败，正在重连');
      }
      props.modelBtn.checkData.forEach((ele: any) => {
        ele.device = ele.codeNum || ele.number;
      });
      // 启动巡查
      const dispatchDeskData = JSON.parse(
        JSON.stringify(props.modelBtn.checkData),
      );
      const device: any = dispatchDeskData.reduce((pre: any, ele: any) => {
        let arr = pre;
        let obj = {
          id: ele.deviceId,
          name: ele.name,
          num: ele.device,
        };
        // 号码去重
        const diffArr = arr.filter(
          (x: any) => x.id === obj.id || x.num === obj.num,
        );
        if (diffArr.length === 0) {
          arr.push(obj);
        }
        return arr;
      }, []);
      console.log(dispatchDeskData, device);
      const randomNumber = `${Math.ceil(Math.random() * 10000)}`;
      store.commit('flightPatrol/SET_taskid', randomNumber);
      console.log(device);
      const date: string = new Date().toISOString().split('T')[0];
      const time: string = new Date().toTimeString().split(' ')[0];
      const taskName = `${`${date} ${time}`}飞巡任务`;
      initiatePolling(taskName,randomNumber,device)
      PollingPopupFlag.value = !PollingPopupFlag.value;
    }
    return {
      PollingPopupFlag,
      PollingPopupCancel,
      // 发起会议弹窗
      startMeetingDialogRef,
      // 发起会议
      sponsorMeeting,
      // 组呼
      handleCallGroupCluster,
      // 选择人员的弹窗
      selectMemberDialogRef,
      // 发起预览
      handlePreview,
      // 取消
      cancel,
      // 批量轮询
      startPatrol,
    };
  },
  methods: {
    // 发布任务
    release() {
      if ((this as any).$addDialog) {
        (this as any).$addDialog('发布任务', TaskPublishDialog, {
          initSelectedResponsiblePerson: this.modelBtn.checkData,
        });
      }
    },
  },
});
</script>

<style lang="scss" module>
.FooterBtn {
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	padding: 10px 10px 10px 20px;
	border-top: 1px solid rgba(255, 255, 255, .15);
	& > span {
		font-weight: 400;
		font-size: 14px;
		color: #fff;
	}
	button {
		padding: 0;
		border-radius: 0;
		width: 64px;
		height: 32px;
		line-height: 32px;
		text-align: center;
	}
	& > div {
		& > button {
			border: 1px solid #00c1de;
			background: #00c1de;
			font-weight: 400;
			font-size: 14px;
			color: #fff;
			&:hover,
			&:focus {
				border: 1px solid #00c1de;
				background: #00c1de;
			}
			&:first-child {
				border: 1px solid #a6adb4;
				background: transparent;
				color: #a6adb4;
				&:hover,
				&:focus {
					border: 1px solid #a6adb4;
					background: transparent;
				}
			}
		}
	}
}
</style>
