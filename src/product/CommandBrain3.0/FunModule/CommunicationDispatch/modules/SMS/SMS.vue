<template>
  <div :class="$style.container">
    <main>
      <!-- A: 短信列表 -->
      <nav>
        <!-- A-1: 发送短信按钮 -->
        <StartButton @click="currentMenuIndex = ''" />
        <!-- A-2: 短信类型Tab列表 -->
        <SMSTypeTab @tabChange="tabChange" @getSMSDetail="getSMSDetail" />
      </nav>
      <!-- B: 短信详情 -->
      <section>
        <!-- B-1: 发送短信TabItem -->
        <SendSMSTabItem
          v-if="currentMenuIndex === 1"
          ref="SendSMSTabItem"
          @getSMSDetail="getSMSDetail"
        />
        <!-- B-2: 回复短信TabItem -->
        <ReplySMSTabItem v-if="currentMenuIndex === 2" ref="ReplySMSTabItem" />
        <!-- B-3: 联系人TabItem -->
        <ContactorTabItem v-if="currentMenuIndex === 3" ref="ContactorTabItem" />
        <!-- B-4: 编写短信TabItem -->
        <WriteSMSTabItem v-if="currentMenuIndex === ''" ref="WriteSMSTabItem" />
      </section>
    </main>
    <!-- C: 底部内容 -->
    <footer>
      <i />
      <!-- <span>{{`短信余量：${surplusSMSSum}条`}}</span> -->
      <button
        v-if="currentMenuIndex === 1"
        :class="$style['send-sms-tabItem-button']"
        @click="sendMultipleSMSAgain"
      >
        全部补发
      </button>
      <button
        v-if="currentMenuIndex === 1"
        :class="$style['send-sms-tabItem-button']"
        @click="sendMultipleSMS"
      >
        重新发送
      </button>
      <button v-if="currentMenuIndex === ''" :class="$style['write-sms-tabItem-button']">
        取消
      </button>
      <button
        v-if="currentMenuIndex === ''"
        :class="$style['write-sms-tabItem-button']"
        @click="sendSMS"
      >
        发送
      </button>
      <button
        v-if="currentMenuIndex === 2"
        :class="$style['reply-sms-tabItem-button']"
        @click="replySMS"
      >
        发送短信
      </button>
      <button
        v-if="currentMenuIndex === 3"
        :class="$style['contactor-tabItem-button']"
        @click="sendSMSToContactor"
      >
        发送短信
      </button>
    </footer>
  </div>
  <!-- 添加联系人弹窗 -->
  <SelectMemberDialog ref="selectMemberDialogRef" :sms="true" />
  <!-- 存为短信分组弹窗 -->
  <SaveAsSMSGroupDialog ref="saveAsSMSGroupDialogRef" />
  <!-- 选择所属分组弹窗 -->
  <SelectSMSGroupDialog ref="selectSMSGroupDialog" />
  <!-- 存为短信模版弹窗 -->
  <SaveAsSMSTemplateDialog ref="saveAsSMSTemplateDialogRef" />
  <!-- 选择短信模版弹窗 -->
  <SelectSMSTemplateDialog ref="selectSMSTemplateDialogRef" />
</template>

<script>
import { defineComponent, provide, reactive, ref, getCurrentInstance } from 'vue';
import SelectMemberDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/SelectMemberDialog/SelectMemberDialog.vue';
import StartButton from './components/StartButton/StartButton.vue';
import SMSTypeTab from './modules/SMSTypeTab/SMSTypeTab.vue';
import SendSMSTabItem from './modules/SendSMSTabItem/SendSMSTabItem.vue';
import ReplySMSTabItem from './modules/ReplySMSTabItem/ReplySMSTabItem.vue';
import WriteSMSTabItem from './modules/WriteSMSTabItem/WriteSMSTabItem.vue';
import ContactorTabItem from './modules/ContactorTabItem/ContactorTabItem.vue';
import SaveAsSMSGroupDialog from './modules/SaveAsSMSGroupDialog/SaveAsSMSGroupDialog.vue';
import SelectSMSGroupDialog from './modules/SelectSMSGroupDialog/SelectSMSGroupDialog.vue';
import SaveAsSMSTemplateDialog from './modules/SaveAsSMSTemplateDialog/SaveAsSMSTemplateDialog.vue';
import SelectSMSTemplateDialog from './modules/SelectSMSTemplateDialog/SelectSMSTemplateDialog.vue';

export default defineComponent({
  name: 'SMS',
  components: {
    // 启动会议按钮
    StartButton,
    // 短信类型Tab列表
    SMSTypeTab,
    // 发送短信TabItem
    SendSMSTabItem,
    // 回复短信TabItem
    ReplySMSTabItem,
    // 编写短信TabItem
    WriteSMSTabItem,
    // 联系人TabItem
    ContactorTabItem,
    // 添加联系人组件
    SelectMemberDialog,
    // 存为短信分组弹窗
    SaveAsSMSGroupDialog,
    // 选择短信分组
    SelectSMSGroupDialog,
    // 存为模版弹窗
    SaveAsSMSTemplateDialog,
    // 选择短信模版弹窗
    SelectSMSTemplateDialog,
  },
  setup(props, context) {
    const { $http, $message } = getCurrentInstance()?.appContext.config.globalProperties;
    // tab选中index
    const currentMenuIndex = ref(0);
    // 剩余短信余量
    const surplusSMSSum = ref('');
    const saveAsSMSGroupDialogRef = ref(null);
    const selectSMSGroupDialog = ref(null);
    const selectMemberDialogRef = ref(null);
    const saveAsSMSTemplateDialogRef = ref(null);
    const selectSMSTemplateDialogRef = ref(null);
    // 短信模版
    const smsTemplate = ref('');
    // 打开存为短信分组弹窗
    function openSaveAsSMSGroupDialog() {
      if (saveAsSMSGroupDialogRef.value) {
        return saveAsSMSGroupDialogRef.value.open();
      }
      return Promise.resolve();
    }
    // 选择短信分组
    function openSelectSMSGroupDialog() {
      if (selectSMSGroupDialog.value) {
        return selectSMSGroupDialog.value.open();
      }
      return Promise.resolve();
    }
    // 打开选择联系人弹窗
    function openSelectMemberDialog() {
      if (selectMemberDialogRef.value) {
        return selectMemberDialogRef.value.open();
      }
      return Promise.resolve();
    }
    // 打开存为短信模版弹窗
    function openSaveAsSMSTemplateDialog(content) {
      if (saveAsSMSTemplateDialogRef.value) {
        return saveAsSMSTemplateDialogRef.value.open(content);
      }
      return Promise.resolve();
    }
    // 打开选择短信模版弹窗
    function openSelectSMSTemplateDialog() {
      if (selectSMSTemplateDialogRef.value) {
        return selectSMSTemplateDialogRef.value.open();
      }
      return Promise.resolve();
    }
    provide('saveAsSMSGroup', openSaveAsSMSGroupDialog);
    provide('saveAsSMSTemplate', openSaveAsSMSTemplateDialog);
    provide('selectSMSGroup', openSelectSMSGroupDialog);
    provide('addContactor', openSelectMemberDialog);
    provide('selectSMSTemplate', openSelectSMSTemplateDialog);
    provide('smsTemplate', smsTemplate);
    return {
      currentMenuIndex,
      surplusSMSSum,
      saveAsSMSGroupDialogRef,
      selectSMSGroupDialog,
      selectMemberDialogRef,
      saveAsSMSTemplateDialogRef,
      selectSMSTemplateDialogRef,
    };
  },
  mounted() {
    this.getSurplusSMSSum();
  },
  methods: {
    // 短信分组tab切换
    tabChange(val) {
      this.currentMenuIndex = val;
    },
    // 发送短信
    sendSMS() {
      this.$MessageBox({
        title: '发送提示',
        message: '确认发送短信?',
      }).then(() => {
        this.$refs.WriteSMSTabItem.sendSMS();
      });
    },
    // 获取剩余短信
    getSurplusSMSSum() {
      const request = {
        method: 'get',
        service: 'soc',
        url: '/message/messageinfor/getSurplusMessageSum',
      };
      this.$http(request)
        .then(response => {
          console.log('/message/messageinfor/getSurplusMessageSum', response);
          if (response.code === 0) {
            this.surplusSMSSum = response.messageSum;
          } else {
            this.$message.error(
              `获取短信余量失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch(error => {
          this.$message.error(`获取短信余量失败，错误信息：${error}`);
        });
    },
    // 获取短信详情
    getSMSDetail(smsItem) {
      if (smsItem?.direct === 0) {
        this.currentMenuIndex = 1;
      }
      if (smsItem?.direct === 1) {
        this.currentMenuIndex = 2;
      }
      this.$nextTick(() => {
        if (smsItem?.direct === 0) {
          this.$refs.SendSMSTabItem.getSMSDetail(smsItem?.groupNum);
        }
        if (smsItem?.direct === 1) {
          this.$refs.ReplySMSTabItem.getSMSDetail(smsItem?.groupNum);
        }
        if (this.currentMenuIndex === 3) {
          this.$refs.ContactorTabItem.getSMSDetail(smsItem?.phone, smsItem);
        }
      });
    },
    // 批量补发短信
    sendMultipleSMSAgain() {
      this.$refs.SendSMSTabItem.sendMultipleSMSAgain();
    },
    // 批量重新发送短信
    sendMultipleSMS() {
      this.$refs.SendSMSTabItem.sendMultipleSMS();
    },
    // 回复短信
    replySMS() {
      this.$refs.ReplySMSTabItem.replySMS();
    },
    // 给联系人写短信
    sendSMSToContactor() {
      this.$refs.ContactorTabItem.sendSMS();
    },
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
      padding: 10px;
      width: 720px;
    }
  }
  & > footer {
    color: #ffffff;
    height: 59px;
    display: flex;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    & > * {
      margin-left: 10px;
    }
    & i {
      display: inline-block;
      width: 15px;
      height: 15px;
      background: url(./assets/exclamationPoint.svg) no-repeat 0px/15px;
    }
    .send-sms-tabItem-button:first-of-type {
      margin-left: auto;
      margin-right: 10px;
      border: 1px solid #00c1de;
      background: transparent;
      color: #00c1de;
      padding: 6px 14px;
      cursor: pointer;
    }
    .send-sms-tabItem-button:not(:first-of-type) {
      background: #00c1de;
      border: 1px solid #00c1de;
      margin-left: 0px;
      margin-right: 10px;
      color: #ffffff;
      padding: 6px 14px;
      cursor: pointer;
    }
    .write-sms-tabItem-button:first-of-type {
      margin-left: auto;
      margin-right: 10px;
      border: 1px solid rgba(255, 255, 255, 0.45);
      background: transparent;
      color: rgba(255, 255, 255, 0.65);
      padding: 6px 14px;
      cursor: pointer;
    }
    .write-sms-tabItem-button:not(:first-of-type) {
      background: #00c1de;
      border: 1px solid #00c1de;
      margin-left: 0px;
      margin-right: 10px;
      color: #ffffff;
      padding: 6px 14px;
      cursor: pointer;
    }
    .reply-sms-tabItem-button {
      background: #00c1de;
      border: 1px solid #00c1de;
      margin-left: auto;
      margin-right: 10px;
      color: #ffffff;
      padding: 6px 14px;
      cursor: pointer;
    }
    .contactor-tabItem-button {
      background: #00c1de;
      border: 1px solid #00c1de;
      margin-left: auto;
      margin-right: 10px;
      color: #ffffff;
      padding: 6px 14px;
      cursor: pointer;
    }
  }
}
</style>
