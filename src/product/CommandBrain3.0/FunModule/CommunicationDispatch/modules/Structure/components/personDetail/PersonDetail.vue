// 人员详情弹窗
<template>
  <transition name="bounce">
    <div
      v-if="isShow"
      class="personDetailPop"
    >
      <div class="personDetailPop__title">
        <div class="personDetailPop__title__left">
          联系人详情
        </div>
        <div
          class="personDetailPop__title__close"
          @click="isShow=false"
        />
      </div>
      <div class="personDetailPop__content">
        <div class="personDetailPop__content__base">
          <div class="personDetailPop__content__base__iconDiv">
            <img
              :src="personInfoProps.value.images?.startsWith('http') ? personInfoProps.value.images : `${baseURL}${personInfoProps.value.images}`"
              class="personDetailPop__content__base__iconDiv__icon"
            >
            <div v-if="followable" class="personDetailPop__content__base__iconDiv__get" @click.stop="starFun(personInfoProps.value.commonlyUsed)">
              {{ personInfoProps.value.commonlyUsed===1?'已关注':'关注' }}
            </div>
          </div>
          <div class="personDetailPop__content__base__baseInfo">
            <div class="personDetailPop__content__base__baseInfo__item">
              <div class="personDetailPop__baseInfo__l">
                姓名
              </div>
              <div class="personDetailPop__baseInfo__r">
                {{ personInfoProps.value.name }}
              </div>
            </div>
            <div class="personDetailPop__content__base__baseInfo__item">
              <div class="personDetailPop__baseInfo__l">
                单位
              </div>
              <div class="personDetailPop__baseInfo__r">
                {{ personInfoProps.value.workUnit||'暂无' }}
              </div>
            </div>
            <div class="personDetailPop__content__base__baseInfo__item">
              <div class="personDetailPop__baseInfo__l">
                职位
              </div>
              <div class="personDetailPop__baseInfo__r">
                {{ personInfoProps.value.position }}
              </div>
            </div>
            <div class="personDetailPop__content__base__baseInfo__item">
              <div class="personDetailPop__baseInfo__l">
                岗位
              </div>
              <div class="personDetailPop__baseInfo__r">
                {{ personInfoProps.value.workUnit||'暂无' }}
              </div>
            </div>
          </div>
        </div>
        <div class="personDetailPop__content__contact">
          <div class="personDetailPop__content__contact__item">
            <div class="personDetailPop__content__contact__item__l">
              手机号码
            </div>
            <div
              class="personDetailPop__content__contact__item__r"
              @click="sendMqFun('phone',personInfoProps.value.mobile1)"
            >
              {{ personInfoProps.value.mobile1 }}
            </div>
          </div>
          <div class="personDetailPop__content__contact__item">
            <div class="personDetailPop__content__contact__item__l">
              办公室电话
            </div>
            <div
              class="personDetailPop__content__contact__item__r"
              @click="sendMqFun('phone',personInfoProps.value.officeTel)"
            >
              {{ personInfoProps.value.officeTel }}
            </div>
          </div>
          <div class="personDetailPop__content__contact__item">
            <div class="personDetailPop__content__contact__item__l">
              家庭电话
            </div>
            <div
              class="personDetailPop__content__contact__item__r"
              @click="sendMqFun('phone',personInfoProps.value.homeTel)"
            >
              {{ personInfoProps.value.homeTel }}
            </div>
          </div>
          <div class="personDetailPop__content__contact__item">
            <div class="personDetailPop__content__contact__item__l">
              其他电话
            </div>
            <div
              class="personDetailPop__content__contact__item__r"
              @click="sendMqFun('phone',personInfoProps.value.otherTel)"
            >
              {{ personInfoProps.value.otherTel }}
            </div>
          </div>
          <div class="personDetailPop__content__contact__item">
            <div class="personDetailPop__content__contact__item__l">
              邮箱
            </div>
            <div
              class="personDetailPop__content__contact__item__r"
              style="background: none;"
            >
              {{ personInfoProps.value.email }}
            </div>
          </div>
        </div>
        <div v-if="showLabel" class="personDetailPop__content__tag">
          <div class="personDetailPop__content__tag__add">
            +
          </div>
          <div class="personDetailPop__content__tag__item">
            事件增援
          </div>
          <div class="personDetailPop__content__tag__item">
            危房核实
          </div>
          <div class="personDetailPop__content__tag__item">
            任务调度
          </div>
          <div class="personDetailPop__content__tag__item">
            人员调派
          </div>
        </div>
        <div
          v-if="operation"
          class="personDetailPop__content__comu"
        >
          <ButtonList
            v-if="contactOperation.state"
            :state="contactOperation.state"
            :dispatch="dispatch"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
 defineComponent,
 ref,
 shallowRef,
 watch,
} from 'vue';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import ButtonList from '@/product/CommandBrain3.0/Generalparts/main/ContactOperation/ButtonList.vue';
import { createContactOperation } from '@/product/CommandBrain3.0/Generalparts/main/ContactOperation/useContactOperation';

export default defineComponent({
  components: {
    ButtonList,
  },
  props: {
    personInfoProps: {
      type: Object,
      default: () => ({}),
    },
    // 显示扩展功能
    operation: {
      type: Boolean,
      default: true,
    },
    // 显示标签
    showLabel: {
      type: Boolean,
      default: true,
    },
    // 可以关注
    followable: {
      type: Boolean,
      default: true,
    },
    // 专家打电话要额外参数
    isExpert: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isShow = ref(false);
    // 打开弹窗
    function open() {
      isShow.value = true;
    }
    // 关闭弹窗
    function close() {
      isShow.value = false;
    }

    const isStar = ref(false);
    if (props.personInfoProps.value?.commonlyUsed === 1) {
      isStar.value = true;
    } else {
      isStar.value = false;
    }
    /**
    * @desc
    * @param {} starId 是否已关注，1是已关注，0是未关注
    * @returns {} returns
    */
    function starFun(starId :number) {
      const request:any = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailcontactor/updateIsCommonlyUsed',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      // if (isStar.value) {
      //   request.data = {
      //     contactId: props.personInfoProps.value.id,
      //     isCommonlyUsed: 0, // 1为是，0为否
      //   };
      //   isStar.value = false;
      //   $message.info('取消成功');
      // } else {
      //   request.data = {
      //     contactId: props.personInfoProps.value.id,
      //     isCommonlyUsed: 1, // 1为是，0为否
      //   };
      //   isStar.value = true;
      //   $message.info('关注成功');
      // }
      // 已关注则取消关注
      if (starId === 1) {
        request.data = {
          contactId: props.personInfoProps.value.id,
          isCommonlyUsed: 0, // 1为是，0为否
        };
        isStar.value = false;
        props.personInfoProps.value.commonlyUsed = 0;
        $message.info('取消成功');
      } else {
        // 未关注则关注
        request.data = {
          contactId: props.personInfoProps.value.id,
          isCommonlyUsed: 1, // 1为是，0为否
        };
        isStar.value = true;
        props.personInfoProps.value.commonlyUsed = 1;
        $message.info('关注成功');
      }
      $http(request).then((response: any) => {
        if (response.code === 0) {
          // emit('updateUsePeopleEmit'); // 更新常用联系人
        } else {
          $message.error(`操作失败，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`操作失败，错误信息：${error}`);
      });
    }

    const contactOperation = shallowRef<any>({});

    watch(() => props.personInfoProps, (newVal: any) => {
      if (newVal?.value?.id && props.operation) {
        contactOperation.value = createContactOperation(newVal.value.id);
      }
    }, { deep: true, immediate: true });

    function dispatch(action: { type: string; payload: any }) {
      switch (action.type) {
        case 'phone':
          contactOperation.value?.phone(action.payload);
          break;
        case 'sms':
          contactOperation.value?.sms(action.payload);
          break;
        case 'voice':
          contactOperation.value?.voice(action.payload);
          break;
        case 'video':
          contactOperation.value?.video(action.payload);
          break;
        case 'track':
          contactOperation.value?.track();
          break;
        case 'meeting':
          contactOperation.value?.meeting(action.payload);
          break;
        case 'task':
          contactOperation.value?.task();
          break;
        case 'search':
          contactOperation.value?.search();
          break;
        case 'searchMonitor':
          contactOperation.value?.searchMonitor();
          break;
        case 'detail':
          contactOperation.value?.detail();
          break;
        default:
      }
    }

    return {
      isShow,
      isStar,
      open,
      close,
      starFun,
      dispatch,
      contactOperation,
    };
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
});
</script>

<style lang="scss" src="./style/style.scss"></style>
