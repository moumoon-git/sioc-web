<template>
    <!-- 顶部收件人姓名 -->
  <header :class="$style['reply-header-wrapper']">
    <label>
      {{`${smsDetail?.smsContactorVoList?.[0]?.contactorName??''} ${smsDetail?.smsContactorVoList?.[0]?.contactorWorkUnit?'（'+smsDetail?.smsContactorVoList?.[0]?.contactorWorkUnit+'）':''}`}}
    </label>
  </header>
  <!-- 短信内容 -->
  <CardWrapper :class="$style['sms-content-wrapper']">
    <template #title>
      <h3>
        短信内容
      </h3>
      <label>{{smsDetail?.sendTime}}</label>
    </template>
    <template #default>
      <textarea :value="smsDetail.content"/>
    </template>
  </CardWrapper>
  <!-- 回复短信内容 -->
  <CardWrapper :class="$style['reply-sms-wrapper']">
    <template #title>
      <h3>
        收信人
      </h3>
    </template>
    <template #default>
      <textarea placeholder="请输入短信内容…" v-model="smsContent" />
    </template>
  </CardWrapper>
</template>

<script>
import {
  defineComponent,
  ref,
  watch,
} from 'vue';
import CardWrapper from '../../components/CardWrapper/CardWrapper.vue';

export default defineComponent({
  name: 'ReplySMSTabItem',
  components: {
    // 卡片容器组件
    CardWrapper,
  },
  props: {
  },
  emits: [
  ],
  setup(props, { emit }) {
    const isLoading = ref(false);
    // 短信详情
    const smsDetail = ref({});
    // 短信内容
    const smsContent = ref('');
    return {
      isLoading,
      smsDetail,
      smsContent,
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
          this.isLoading = false;
        } else {
          this.$message.error(`获取短信详情失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取短信详情失败，错误信息：${error}`);
      });
    },
    // 回复短信
    replySMS() {
      this.$MessageBox({
        title: '发送提示',
        message: '确认回复短信?',
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
            this.$message.success('回复短信成功');
          } else {
            this.$message.error(`回复短信失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error) => {
          this.$message.error(`回复短信失败，错误信息：${error}`);
        });
      });
    },
  },
});
</script>

<style lang="scss" module>
.reply-header-wrapper {
    height: 52px;
    background: rgba(0,0,0,.29);
    border: 1px solid rgba(0, 193, 222, 0.29);
    padding: 0px 10px;
    display: flex;
    align-items: center;
    & label {
        color: #FFFFFF;
        display: flex;
        &::after {
            content: '';
            display: inline-block;
            width: 5px;
            height: 20px;
            margin-left: 5px;
            background: url(../../assets/moreIcon.svg) no-repeat center/auto;
        }
    }
}
.sms-content-wrapper {
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
        background: no-repeat center/100% 100% url(../../assets/bluePoint.svg);
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
  }
}
.reply-sms-wrapper {
  height: calc(100% - 272px);
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
        background: no-repeat center/100% 100% url(../../assets/reply-sms-icon.svg);
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
  }
}
</style>
