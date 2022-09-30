<template lang="">
  <ul :class="$style['option-wrap']">
    <li
      v-for="(operate, index) in operationList"
      :key="index"
      @click="operateClick(operate.type, index)"
    >
      <div
        :class="[
          $style['icon-' + operate.icon],
          $style.icon,
          $style['icon-' + operate.activeClass],
        ]"
      />
      <span :class="$style['text-' + operate.activeClass]">{{ operate.dec }}</span>
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, reactive, inject, watch, ref, computed } from 'vue';
import { useStore } from 'vuex';
import {
  addCallback,
  removeCallback,
  addMeetingMembers,
  queryMeetingStatus,
  meetingStartTime,
  makePhoneCall,
  callVoiceCluster,
  callVideoCluster,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
// 轨迹跟踪
import { openRoutesTrack } from '@/product/CommandBrain3.0/FunModule/RoutesTrack/scripts/useRoutesTrack';
// 邀请会议
import { openStartMeetingDialog } from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/StartMeetingDialog/useStartMeetingDialog';

import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
// 短信
import SMSShortcut from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/components/SMSShortcut/SMSShortcut';
import myStore from '../StandbyDialog/store/useStore';

import { createContactOperation } from '../../../main/ContactOperation/useContactOperation';

export default defineComponent({
  name: 'FooterOperation',

  props: {
    composeData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    // const {} = createContactOperation()
    const showMsgDialog = ref<boolean>(false);
    const { $http, $message } = useGlobal();
    const uid = inject<string>('uid');
    const store = useStore(); // 使用vuex
    const { dispatch } = myStore(); // 我的store
    const centerCircle = ref<any>({});
    // 注意vue3的响应式依赖文件的主来源是否来自外部文件 是的话不会销毁的 所以最好创建一份副本 不让其影响到源
    // 防止带来副作用 这是存在垃圾回收不了的情况
    const operationList: any = reactive(props.composeData.footerBtn);
    // 可视化应急管理的时候除了详细信息其他的不出现
    if (store.state.btnTab) {
      if (store.state.btnTab.btnData[0].active) {
        operationList.length = 0;
        operationList.push({
          activeClass: '',
          dec: '详细信息',
          icon: 'detail',
          type: 'detail',
        });
        if (
          props.composeData.responseData.dialogType === 'device' &&
          props.composeData.responseData.type === 0
        ) {
          operationList.push({
            activeClass: '',
            dec: '预览',
            icon: 'preview',
            type: 'preview',
          });
        }

        console.log(operationList);
      }
    }
    const operationParams = {
      id: props.composeData.responseData.id,
      name: props.composeData.responseData.name,
      phone:
        props.composeData.responseData.mobile1 || props.composeData.responseData.contactTelephone,
    };

    const hasWecomm = computed(() =>
      props.composeData.responseData.relatedEquipmentList.find((device: any) => device.type === 3),
    );
    // 底部按钮事件
    const operationEventMap: any = {
      // 打电话
      phone: () => {
        const params: any = {
          id: operationParams.id,
          name: operationParams.name,
          phone: operationParams.phone,
          type: 1,
        };
        const paramsArg = [
          {
            key: 'eventId',
            value: store.state.event?.id,
            type: 1,
          },
        ];
        makePhoneCall(params, paramsArg);
      },
      // 短信呼叫
      msg: () => {
        SMSShortcut(operationParams.phone, operationParams.id, store.state.event?.id);
      },

      // 语音点呼
      chat: () => {
        if (hasWecomm.value) {
          callVoiceCluster([
            {
              id: hasWecomm.value.id,
              name: hasWecomm.value.name,
              num: hasWecomm.value.code,
            },
          ]);
        } else {
          $message.error('联系人没有关联WeComm');
        }
      },

      // 预览
      preview: (index: number) => {
        if (operationList[index].activeClass) {
          operationList[index].activeClass = '';
          store.commit('flightPatrol/SET_cancelFlightPatrolPreview', [
            props.composeData.responseData,
          ]);
        } else {
          operationList[index].activeClass = 'preview-active';
          store.commit('flightPatrol/SET_flightPatrolPreviewCachePool', [
            props.composeData.responseData,
          ]);
        }
        const cb = (code: number, message: any) => {
          if (code === 293) {
            operationList[index].activeClass = '';
            removeCallback(cb);
          }
        };
        addCallback(cb);
        console.log(operationList);
      },

      // 视频点呼
      vedio: () => {
        console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', hasWecomm);

        if (hasWecomm.value) {
          callVideoCluster([
            {
              id: hasWecomm.value.id,
              name: hasWecomm.value.name,
              num: hasWecomm.value.code,
            },
          ]);
        } else {
          $message.error('联系人没有关联WeComm');
        }
      },
      // 现场直播
      play: () => {
        console.log(123);
      },
      // 轨迹跟踪
      track: () => {
        const trackPayload = {
          [props.composeData.responseData.isDevice === 1
            ? 'deviceId'
            : 'contactorId']: operationParams.id,
        };
        openRoutesTrack(trackPayload);
      },
      // 设备邀请会议
      // 联系人邀请会议通过 useContactOperation 生成
      conf: () => {
        const { type } = props.composeData.responseData;
        const memberType = type === 0 ? 5 : type === 1 ? 6 : type === 2 ? 8 : type === 3 ? 7 : 1;

        const member = {
          memberType,
          ...props.composeData.responseData,
        };
        // 查询当前 UDS 会议状态，已存在会议则添加成员，否则创建会议
        queryMeetingStatus().then(() => {
          if (meetingStartTime.value) {
            $message.info('存在进行中的会议，正在添加入会');
            const cb = (code: number, message: any) => {
              if (code === 107 && message?.member?.Id === member.id) {
                $message.info('入会成功');
                removeCallback(cb);
              }
            };
            addCallback(cb);
            addMeetingMembers([{
              // 0-监控，2-集群
              Type: type === 0 ? 9 : type === 2 ? 4 : 8,
              Name: member.name,
              Id: member.id,
              Number: member.meetingCode || member.code,
            }]);
          } else {
            $message.info('不存在进行中的会议，请创建会议');
            openStartMeetingDialog([member]);
          }
        });
      },
      // 周边检索
      rim: (index: number) => {
        if (!props.composeData.responseData.longitude && !props.composeData.responseData.latitude) {
          $message.error('暂无联系人定位数据');
          return;
        }

        centerCircle.value = props.composeData.responseData;
        console.log(
          '%c [ props.composeData.responseData ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          props.composeData.responseData,
        );
        // console.log(
        //   props.composeData.responseData,
        //   'props.composeData.responseData',
        // );
        const peripheralSearch = {
          type: 'peripheralSearch',
          centerCircleData: centerCircle.value,
          sourceData: JSON.parse(JSON.stringify(props.composeData.responseData)),
        };
        store.commit('retrieval/SET_peripheralSearch', peripheralSearch);
      },
      // 附近监控
      camera: (index: number) => {
        if (!props.composeData.responseData.longitude && !props.composeData.responseData.latitude) {
          $message.error('暂无联系人定位数据');
          return;
        }
        centerCircle.value = props.composeData.responseData;
        const peripheralSearch = {
          type: 'nearbyMonitoring',
          centerCircleData: centerCircle.value,
          sourceData: JSON.parse(JSON.stringify(props.composeData.responseData)),
        };
        store.commit('retrieval/SET_peripheralSearch', peripheralSearch);
        console.log(props.composeData.responseData, 'props.composeData.responseData');
      },
      // 详细信息
      detail: (index: number) => {
        if (operationList[index].activeClass) {
          operationList[index].activeClass = '';
          dispatch({
            type: 'isExpandAction',
            payload: {
              uid,
              status: false,
            },
          });
        } else {
          operationList[index].activeClass = 'detail-active';
          dispatch({
            type: 'isExpandAction',
            payload: {
              uid,
              status: true,
            },
          });
        }
      },
      // 物资应急库详细信息
      articleStoreHouseDetail: (index: number) => {
        if (operationList[index].activeClass) {
          operationList[index].activeClass = '';
          dispatch({
            type: 'articleStoreHouseDetailAction',
            payload: {
              uid,
              status: false,
            },
          }).then(() => {
            dispatch({
              type: 'isExpandAction',
              payload: {
                uid,
                status: false,
              },
            });
          });
        } else {
          operationList[index].activeClass = 'detail-active';
          dispatch({
            type: 'articleStoreHouseDetailAction',
            payload: {
              uid,
              status: true,
            },
          }).then(() => {
            dispatch({
              type: 'isExpandAction',
              payload: {
                uid,
                status: true,
              },
            });
          });
        }
      },
    };
    const operateClick = (type: string, index: number) => {
      operationEventMap[type](index);
    };

    return {
      showMsgDialog,
      operationList,
      operateClick,
    };
  },
});
</script>
<style lang="scss" module>
.option-wrap {
  position: relative;
  width: 100%;
  border-top: 1px solid #2e7b8d;
  display: flex;
  flex-wrap: wrap;
  padding-inline-start: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  padding: 10px 0;
  li:nth-child(4n) {
    border-right: none;
  }
  li:last-child {
    border-right: none;
  }
  li {
    width: 88px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid rgba(255, 255, 255, 0.15);
    margin: 5px 0;
    cursor: pointer;
    .icon {
      width: 16px;
      height: 16px;
    }

    &:hover span {
      color: #00c1de;
    }

    span {
      margin-left: 5px;
    }
  }

  @each $animal in phone, detail, camera, chat, conf, msg, play, rim, track, vedio, preview {
    .icon-#{$animal} {
      background: url('../StandbyDialog/assets/img/#{$animal}.svg') no-repeat;
      background-size: 100% 100%;
    }

    .icon-#{$animal}-active {
      background: url('../StandbyDialog/assets/img/#{$animal}_active.svg') no-repeat;
      background-size: 100% 100%;
    }
    .text-#{$animal}-active {
      color: #00c1de;
    }

    & li:hover .icon-#{$animal} {
      background: url('../StandbyDialog/assets/img/#{$animal}_active.svg') no-repeat;
      background-size: 100% 100%;
    }
  }
}
// .fiexd {
//   position: fixed;
//   right: 0;
//   bottom: 0;
// }
</style>
