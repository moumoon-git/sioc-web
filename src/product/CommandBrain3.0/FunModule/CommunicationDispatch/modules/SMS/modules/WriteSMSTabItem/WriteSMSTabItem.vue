<template>
  <!-- 回复短信内容 -->
  <CardWrapper :class="$style['send-sms-wrapper']">
    <template #title>
      <h3>
        发送短信
      </h3>
    </template>
    <template #default>
      <section :class="$style['sms-content-wrapper']">
        <header>
          <label>短信内容</label>
          <var @click="openSelectSMSTemplateDialog">选择模版</var>
        </header>
        <textarea v-model="smsContent" placeholder="请输入短信内容…" />
      </section>
      <section :class="$style['addressee-wrapper']">
        <header>
          <label>收信人</label>
          <button @click="onHandleOpenPhonePannel">输入号码</button>
          <button @click="addContactor">添加联系人</button>
        </header>
        <ul :class="$style.list">
          <template v-for="(item, index) in contactorList" :key="index">
            <li
              :class="[
                {
                  [$style['li--active']]:activeLiIndex===item.id
                },
              ]"
              @mouseover="activeLiIndex=item.id"
              @mouseleave="activeLiIndex=''"
            >
              <label>{{ `${item?.name} ${item?.position?'('+item?.position+')':''}` }}</label>
              <i v-if="activeLiIndex===item.id" @click="contactorList.splice(index,1)" />
            </li>
          </template>
        </ul>
      </section>
    </template>
  </CardWrapper>
</template>

<script>
import {
  defineComponent,
  inject,
  ref,
  watch,
} from 'vue';
import CardWrapper from '../../components/CardWrapper/CardWrapper.vue';

export default defineComponent({
  name: 'WriteSMSTabItem',
  components: {
    // 卡片容器组件
    CardWrapper,
  },
  props: {
  },
  emits: [
  ],
  setup(props, { emit }) {
    // list选中index
    const activeLiIndex = ref('');
    const openSelectMemberDialog = inject('addContactor');
    const openSelectSMSTemplateDialog = inject('selectSMSTemplate');
    const smsTemplate = inject('smsTemplate');
    // 添加联系人弹窗选中的联系人列表
    const contactorList = ref([]);
    function addContactor() {
      openSelectMemberDialog().then((res) => {
        contactorList.value = res;
      });
    }
    // 短信内容
    const smsContent = ref('');
    watch(smsTemplate, (newValue, oldValue) => {
      smsContent.value = newValue;
    });
    return {
      activeLiIndex,
      addContactor,
      contactorList,
      smsContent,
      openSelectSMSTemplateDialog,
    };
  },
  methods: {
    // 发送短信
    sendSMS() {
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
          phoneNum: this.contactorList.map((item) => {return item.mobile1 }).join(),//发送的号码，多个号码逗号隔开
          contactorIds: this.contactorList.map((item) => {return item.id }).join(),//联系人id，多个联系人id逗号隔开
          eventId: this.$store.state.event?.id,//事件类型
        },
      };
      this.$http(request).then((response) => {
        console.log('/eos/communication/sms/addSmsQueue', response);
        if (response.errorcode === 0) {
          this.$message.info('发送短信成功');
        } else {
          this.$message.error(`发送短信失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`发送短信失败，错误信息：${error}`);
      });
    },
    // 打开电话盘
  onHandleOpenPhonePannel() {
    this.$dial().then((newNum) => {
      this.contactorList.push({ name: newNum, id: 0, mobile1: newNum });
    });
  },
  },
});
</script>

<style lang="scss" module>
.send-sms-wrapper {
  height: 100%;
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
    & .sms-content-wrapper {
      padding: 0px 10px;
      margin-top: 10px;
      & header {
        height: 34px;
        display: flex;
        align-items: center;
        color: #56E9FF;
        & label {
            font-size: 16px;
            font-weight: 600;
            &::before {
                content: '';
                display: inline-block;
                width: 6px;
                height: 13px;
                background: #56E9FF;
                box-shadow: 0px 0px 16px 0px #008CFF;
                border-radius: 2px;
                margin-right: 10px;
            }
        }
        & var {
            margin-right: 0px;
            margin-left: auto;
            cursor: pointer;
        }
      }
      & textarea {
        color: #FFF;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
        height: 127px;
        resize: none;
        outline: none;
        background: none;
        border: 1px solid rgba(255, 255, 255, .15);
        &::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
        }
    }
    & .addressee-wrapper {
        padding: 0px 10px;
        margin-top: 10px;
        height: calc(100% - 186px);
        & header {
            height: 34px;
            display: flex;
            align-items: center;
            color: #56E9FF;
            & label {
                font-size: 16px;
                font-weight: 600;
                &::before {
                    content: '';
                    display: inline-block;
                    width: 6px;
                    height: 13px;
                    background: #56E9FF;
                    box-shadow: 0px 0px 16px 0px #008CFF;
                    border-radius: 2px;
                    margin-right: 10px;
                }
            }
            & button:first-of-type{
                margin-left: auto;
                margin-right: 10px;
                background: transparent;
                border: 1px solid #00C1DE;
                color: #00C1DE;
                padding: 3px 13px;
                cursor: pointer;
            }
            & button:not(:first-of-type) {
                margin-right: 0px;
                background: transparent;
                border: 1px solid #00C1DE;
                color: #00C1DE;
                padding: 3px 13px;
                cursor: pointer;
            }
        }
        & .list {
            list-style: none;
            height: calc(100% - 68px);
            overflow-y: auto;
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
                margin: 10px 0px;
                background: linear-gradient(90deg, rgba(0, 193, 222, .3) 0%, transparent 100%);
                padding: 0 10px;
                height: 48px;
                display: flex;
                align-items: center;
                position: relative;
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
                & i {
                    display: inline-block;
                    width:16px;
                    height: 16px;
                    margin-right: 10px;
                    margin-left: auto;
                    cursor: pointer;
                    background: no-repeat center/100% 100% url(../../assets/close-icon.svg);
                }
            }
        }
    }
  }
}
</style>
