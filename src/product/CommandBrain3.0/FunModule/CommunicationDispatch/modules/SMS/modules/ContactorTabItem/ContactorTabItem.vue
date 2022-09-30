<template>
    <!-- 顶部收件人姓名 -->
  <header :class="$style['contactor-header-wrapper']">
    <label>
      {{`${smsRecordList?.contactor?.contactorName??''} ${smsRecordList?.contactor?.contactorPosition?'（'+smsRecordList?.contactor?.contactorPosition+'）':''}`}}
    </label>
  </header>
  <!-- 短信记录 -->
  <CardWrapper :class="$style['sms-record-wrapper']">
    <template #title>
      <h3>
        短信记录
      </h3>
      <button :class="{[$style['button-active']]:buttonActiveIndex==='全部'}" @click="buttonActiveIndex='全部'">{{`全部${smsRecordList?.countAll??''}`}}</button>
      <button :class="{[$style['button-active']]:buttonActiveIndex==='发送'}" @click="buttonActiveIndex='发送'">{{`发送${smsRecordList?.countSend??''}`}}</button>
      <button :class="{[$style['button-active']]:buttonActiveIndex==='回复'}" @click="buttonActiveIndex='回复'">{{`回复${smsRecordList?.countReceive??''}`}}</button>
    </template>
    <template #default>
      <ul :class="$style.list">
        <template v-for="(item, index) in smsRecordList?.smsList?.filter(item=>{if(buttonActiveIndex==='发送'){return item.direct=0}if(buttonActiveIndex==='回复'){return item.direct=1}if(buttonActiveIndex==='全部'){return item} })" :key="index">
          <li>
            <h3>
              <i
                :class="[
                  {
                    [$style.greenPoint]:item.direct===0,
                    [$style.bluePoint]:item.direct===1,
                  },
                ]"
              />
              <span>{{item?.direct===0?'发送':'回复'}}</span>
              <span>{{`时间：${item?.sendTime}`}}</span>
            </h3>
            <p>
              {{item?.content}}
            </p>
          </li>
        </template>
      </ul>
    </template>
  </CardWrapper>
  <!-- 发送短信 -->
  <CardWrapper :class="$style['send-sms-wrapper']">
    <template #title>
      <h3>
        发送短信
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
  name: 'ContactorTabItem',
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
    // 短信记录列表
    const smsRecordList = ref({});
    // 短信内容
    const smsContent = ref('');
    // buttonActiveIndex选中项
    const buttonActiveIndex = ref('全部');
    return {
      isLoading,
      smsRecordList,
      smsContent,
      buttonActiveIndex,
    };
  },
  methods: {
    // 获取短信详情
    getSMSDetail(phone, contactor) {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/eos/communication/sms/listByPhone',
        params: {
          phone,
          eventId: this.$store.state.event?.id,
        },
      };
      this.isLoading = true;
      this.$http(request).then((response) => {
        console.log('/eos/communication/sms/listByPhone', response);
        if (response.errorcode === 0 && response?.data) {
          this.isLoading = false;
          this.smsRecordList = response.data;
          this.smsRecordList.contactor = contactor;
        } else {
          this.$message.error(`获取短信记录失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取短信记录失败，错误信息：${error}`);
      });
    },
    sendSMS() {
      this.$MessageBox({
        title: '发送提示',
        message: '确认发送短信?',
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
            phoneNum: String(this.smsRecordList.contactor.phone),//发送的号码，多个号码逗号隔开
            contactorIds: String(this.smsRecordList.contactor.contactorId),//联系人id，多个联系人id逗号隔开
            eventId: this.$store.state.event?.id,//事件类型
          },
        };
        this.$http(request).then((response) => {
          console.log('/eos/communication/sms/addSmsQueue', response);
          if (response.errorcode === 0) {
            this.$message.success('发送短信成功');
          } else {
            this.$message.error(`发送短信失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error) => {
          this.$message.error(`发送短信失败，错误信息：${error}`);
        });
      });
    },
  },
});
</script>

<style lang="scss" module>
.contactor-header-wrapper {
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
.sms-record-wrapper {
    margin-top: 10px;
    height: calc(100% - 232px);
  & header {
    & h3 {
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
        background: no-repeat center/100% 100% url(../../assets/sms-record-icon.svg);
      }
    }
    & button:first-of-type {
      margin-left: auto;
      margin-right: 10px;
    }
    & button:not(:first-of-type) {
      margin-right: 10px;
    }
    & .button-active{
        background: #00C1DE;
        color: #FFFFFF;
    }
    & button{
        background: transparent;
        border: 1px solid #00C1DE;
        color: #00C1DE;
        padding: 4px 13px;
        cursor: pointer;
    }
  }
  & main {
    .list {
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
        list-style: none;
        height: 100%;
        overflow-y: auto;
        & > li {
          border-bottom: 1px solid rgba(255,255,255,.15);
          padding: 0 10px;
          position: relative;
          & h3 {
            height: 42px;
            display: flex;
            align-items: center;
            position: relative;
            &::after {
              content: '';
              position: absolute;
              bottom: -10%;
              left: 0%;
              width: 100%;
              height: 9px;
              background: url(../../assets/dividingLine.png) no-repeat center/100% 100%;
            }
            & .point {
              display: inline-block;
              width: 30px;
              height: 30px;
              margin-right: 5px;
            }
            & .greenPoint {
              @extend .point;
              background: url(../../assets/greenPoint.svg) no-repeat 0px/30px;
            }
            & .bluePoint {
              @extend .point;
              background: url(../../assets/bluePoint.svg) no-repeat 0px/30px;
            }
            & span:not(:last-child) {
              margin-right: 30px;
              position: relative;
              &::after {
                content: '';
                display: block;
                width: 2px;
                height: 22px;
                position: absolute;
                right: -15px;
                top: 50%;
                transform: translateY(-50%);
                background: linear-gradient(transparent, #FFF, transparent);
              }
            }
          }
          & p {
            padding: 10px 0px;
          }
        }
      }
  }
}
.send-sms-wrapper {
  margin-top: 10px;
  height: 160px;
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
