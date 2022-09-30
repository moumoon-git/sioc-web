<template>
  <!-- 短信内容 -->
  <CardWrapper :class="$style['sms-content-wrapper']">
    <template #title>
      <h3>
        短信内容
      </h3>
      <label>{{smsDetail?.sendTime}}</label>
    </template>
    <template #default>
      <textarea v-model="smsContent" />
      <var @click="saveAsTemplate">存为模版</var>
    </template>
  </CardWrapper>
  <!-- 收信人内容 -->
  <CardWrapper :class="$style['Addressee-wrapper']">
    <template #title>
      <h3>
        收信人
      </h3>
      <button v-if="smsDetail.countAll">{{`总共${smsDetail?.countAll??0}人`}}</button>
      <button v-if="smsDetail.countSuccess">{{`发送成功${smsDetail?.countSuccess}`}}</button>
      <button v-if="smsDetail.countFailure">{{`发送失败${smsDetail?.countFailure}`}}</button>
    </template>
    <template #default>
      <ul :class="$style.list">
        <template v-for="(item, index) in smsDetail.smsContactorVoList" :key="index">
          <li
            :class="[
              {
                [$style['li--active']]:activeLiIndex===index
              },
            ]"
            @mouseover="activeLiIndex=index"
            @mouseleave="activeLiIndex=''"
          >
            <label>
              {{`${item?.contactorName || item?.phone} ${item?.contactorWorkUnit?'('+item?.contactorWorkUnit+')':''}`}}
              <!--  -->
              <ContactMoreButton
                :id="item.id || item.contactorId"
              />
            </label>
            <button
              :class="[
                {
                  [$style['success-button']]:item.success===1,
                  [$style['fail-button']]:item.success===0,
                },
              ]"
            >
              {{item?.success===1?'发送成功':'发送失败'}}
            </button>
            <span v-if="activeLiIndex===index" @click="sendSMSAgain(item.smsId)">补发</span>
          </li>
        </template>
      </ul>
      <var @click="openSaveAsSMSGroupDialog">存为短信分组</var>
    </template>
  </CardWrapper>
</template>

<script>
import {
  defineComponent,
  ref,
  watch,
  inject,
  getCurrentInstance,
} from 'vue';
// 联系人更多按钮
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import CardWrapper from '../../components/CardWrapper/CardWrapper.vue';

export default defineComponent({
  name: 'SendSMSTabItem',
  components: {
    // 联系人更多按钮
    ContactMoreButton,
    // 卡片容器组件
    CardWrapper,
  },
  props: {
  },
  emits: ['getSMSDetail'],
  setup(props, { emit }) {
    const {
      $message,
    } = getCurrentInstance()?.appContext.config.globalProperties;
    const isLoading = ref(false);
    // list选中index
    const activeLiIndex = ref('');
    // 短信详情
    const smsDetail = ref({});
    // 短信内容
    const smsContent = ref('');
    const openSaveAsSMSGroupDialog = inject('saveAsSMSGroup');
    const openSaveAsSMSTemplateDialog = inject('saveAsSMSTemplate');
    function saveAsTemplate() {
      if (!smsContent.value) {
        $message.error('请先编写模版内容');
        return;
      }
      openSaveAsSMSTemplateDialog(smsContent.value);
    }
    return {
      isLoading,
      activeLiIndex,
      smsDetail,
      smsContent,
      openSaveAsSMSGroupDialog,
      saveAsTemplate,
    };
  },
  methods: {
    // 获取短信详情
    getSMSDetail(groupNum) {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/eos/communication/sms/smsListByGroupNum',
        params: {
          groupNum,
        },
      };
      this.isLoading = true;
      this.$http(request).then((response) => {
        console.log('/eos/communication/sms/smsListByGroupNum', response);
        if (response.errorcode === 0 && response?.data) {
          this.smsDetail = response.data;
          this.smsContent = response.data.content;
          this.isLoading = false;
        } else {
          this.$message.error(`获取短信详情失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取短信详情失败，错误信息：${error}`);
      });
    },
    // 补发短信
    sendSMSAgain(smsId) {
      this.$MessageBox({
        title: '发送提示',
        message: '确认补发短信?',
      }).then(() => {
        const request = {
          method: 'post',
          service: 'eoc',
          url: '/eos/communication/sms/sendAgain',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            smsId,
          },
        };
        this.$http(request).then((response) => {
          console.log('/eos/communication/sms/sendAgain', response);
          if (response.errorcode === 0) {
            this.$message.success('补发短信成功');
            this.$emit('getSMSDetail', JSON.parse(sessionStorage.getItem('smsItem')));
          } else {
            this.$message.error(`补发短信失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error) => {
          this.$message.error(`补发短信失败，错误信息：${error}`);
        });
      });
    },
    // 批量补发短信
    sendMultipleSMSAgain() {
      this.$MessageBox({
        title: '发送提示',
        message: '确认批量补发短信?',
      }).then(() => {
        const request = {
          method: 'post',
          service: 'eoc',
          url: '/eos/communication/sms/findFailureAndSendAgain',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            groupNum: this.smsDetail.groupNum,
          },
        };
        this.$http(request).then((response) => {
          console.log('/eos/communication/sms/findFailureAndSendAgain', response);
          if (response.errorcode === 0) {
            this.$message.success('批量补发短信成功');
          } else {
            this.$message.error(`批量补发短信失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error) => {
          this.$message.error(`批量补发短信失败，错误信息：${error}`);
        });
      });
    },
    // 批量重新发送短信
    sendMultipleSMS() {
      this.$MessageBox({
        title: '发送提示',
        message: '确认批量重新发送短信?',
      }).then(() => {
        const request = {
          method: 'post',
          service: 'eoc',
          url: '/eos/communication/sms/addSmsQueue',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            smstypeId: '',
            caseId: 0,
            content: this.smsContent,//短信内容
            phoneNum: this.smsDetail.smsContactorVoList.map((item) => {return item.phone }).join(),//发送的号码，多个号码逗号隔开
            contactorIds: this.smsDetail.smsContactorVoList.map((item) => {return item.contactorId }).join(),//联系人id，多个联系人id逗号隔开
            eventId: this.$store.state.event?.id,//事件类型
          },
        };
        this.$http(request).then((response) => {
          console.log('/eos/communication/sms/addSmsQueue', response);
          if (response.errorcode === 0) {
            this.$message.success('重新发送短信成功');
          } else {
            this.$message.error(`重新发送短信失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error) => {
          this.$message.error(`重新发送短信失败，错误信息：${error}`);
        });
      });
    },
  },
});
</script>

<style lang="scss" module>
.sms-content-wrapper {
  & header {
    h3 {
      font-size: 16px;
      font-weight: 500;
      margin-left: 10px;
      &::before {
        content: '';
        display: inline-block;
        width: 21px;
        height: 21px;
        vertical-align: -5px;
        margin-right: 2px;
        background: no-repeat center/100% 100% url(../../assets/greenPoint.svg);
      }
    }
    label {
      display: flex;
      align-items: center;
      position: absolute;
      right: 10px;
      &::before {
        content: '';
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(../../assets/greenPoint.svg) no-repeat 0px/30px;
        margin-right: 5px;
      }
    }
  }
  & main {
    position: relative;
    textarea {
      color: #FFF;
      padding: 10px;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      resize: none;
      outline: none;
      background: none;
      border: none;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
    var {
      color: #56E9FF;
      position: absolute;
      right: 10px;
      bottom: 10px;
      cursor: pointer;
    }
  }
}
.Addressee-wrapper {
  height: calc(100% - 210px);
  margin-top: 10px;
  & header {
    h3 {
      font-size: 16px;
      font-weight: 500;
      margin-left: 10px;
      &::before {
        content: '';
        display: inline-block;
        width: 21px;
        height: 21px;
        vertical-align: -5px;
        margin-right: 2px;
        background: no-repeat center/100% 100% url(../../assets/memberIcon.svg);
      }
    }
    button:first-of-type{
      background: #00C1DE;
      margin-left: auto;
      margin-right: 10px;
      border: none;
      color: #fff;
      padding: 4px 20px;
      cursor: pointer;
    }
    button:not(:first-of-type) {
      background: rgba(14, 69, 100, 0.35);
      border: 1px solid #00C1DE;
      margin-right: 10px;
      color: #00C1DE;
      padding: 4px 20px;
      cursor: pointer;
    }
  }
  & main {
    position: relative;
    .list {
        list-style: none;
        & .li--active {
          background: linear-gradient(90deg, rgba(0, 193, 222, .7) 0%, transparent 100%);
          &::before {
            content: "";
            width: 2px;
            height: 48px;
            display: inline-block;
            background: #56E9FF;
            position: absolute;
            left: 0px;
          }
        }
        & > li {
          margin: 10px;
          background: linear-gradient(90deg, rgba(0, 193, 222, .3) 0%, transparent 100%);
          padding: 0 10px;
          height: 48px;
          display: flex;
          align-items: center;
          position: relative;
          & label {
            color: #FFFFFF;
            display: flex;
          }
          & .base-button {
            margin-left: auto;
            margin-right: 10px;
            border: none;
            padding: 4px 12px;
            cursor: pointer;
          }
          & .success-button {
            @extend .base-button;
            color: #0BD295;
            background: url(../../assets/button-background--success.svg) no-repeat center/100% 100%;
          }
          & .fail-button {
            @extend .base-button;
            color: #F66E6E;
            background: url(../../assets/button-background--fail.svg) no-repeat center/100% 100%;
          }
          & span {
            margin-right: 10px;
            color: #56E9FF;
            cursor: pointer;
            display: flex;
            align-items: center;
            &::before {
              content: "";
              display: inline-block;
              width: 2px;
              height: 25px;
              background: rgba(255, 255, 255, 0.15);
              margin-right: 10px;
            }
          }
        }
      }
    & > var {
      color: #56E9FF;
      position: absolute;
      right: 10px;
      bottom: 10px;
      cursor: pointer;
    }
  }
}
</style>
