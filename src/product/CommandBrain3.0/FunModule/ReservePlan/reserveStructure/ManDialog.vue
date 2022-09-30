<template>
  <!-- 弹窗身体部分内的div -->
  <div :class="$style.right">
    <!-- 头 -->
    <div :class="$style.styleHead">
      <div :class="$style.styleHeadText">
        {{ item?.name }}
      </div>
      <!-- 叉 -->
      <div
        :class="$style.styleHeadClose"
        @click="$emit('close')"
      />      
    </div>
    <!-- 头像 -->
    <div :class="$style.styleHeadTwo">
      <div style="text-align: center;">
        <img
          :src="item?.images"
          style="width:66px; height:66px; border-radius:50px;margin: 10px 0px 3px 0px;"
          alt=""
        >
      </div>
      <div style="text-align: center;">
        <button
          :class="$style.follow"
          @click="collect"
        >
          {{ item.isAttention ? '取消关注' : '+关注' }}
        </button>
      </div>
    </div>
    <div :class="$style.row">
      性别：{{ item.sex ? '男' : '女' }}
    </div>
    <div :class="$style.row">
      单位：{{ item.address || '--' }}
      <!-- 定位 -->
      <span
        :class="isPosition
          ? $style.locationIconActive
          : $style.locationIcon"
        @click="handlePosition"
      />
    </div>
    <div :class="$style.row">
      职务：{{ item.position || '--' }}
    </div>
    <div :class="$style.row">
      联系方式：{{ item.mobile1 || '--' }}
      <!-- 打电话 -->
      <img
        v-if="item.mobile1"
        style="margin: 1px 3px;cursor: pointer;"
        src="../../CommunicationDispatch/modules/Device/assets/phone.svg"
        alt=""
        @click="handlePhone(item.mobile1)"
      >
      <!-- 短信 -->
      <img
        style="width: 18px;margin: 1px 3px;cursor: pointer;"
        src="./assets/2-m.svg"
        alt=""
        @click="handleSms(item.mobile1)"
      >
    </div>
    <div :class="$style.row">
      办公电话：{{ item.officeTel || '--' }}
      <!-- 打电话 -->
      <img
        v-if="item.officeTel"
        style="margin: 1px 3px;cursor: pointer;"
        src="../../CommunicationDispatch/modules/Device/assets/phone.svg"
        alt=""
        @click="handlePhone(item.officeTel)"
      >
      <!-- 短信 -->
      <img
        style="width: 18px;margin: 1px 3px;cursor: pointer;"
        src="./assets/2-m.svg"
        alt=""
        @click="handleSms(item.officeTel)"
      >
    </div>
    <div :class="$style.row">
      家庭电话：{{ item.homeTel || '--' }}
      <!-- 打电话 -->
      <img
        v-if="item.officeTel"
        style="margin: 1px 3px;cursor: pointer;"
        src="../../CommunicationDispatch/modules/Device/assets/phone.svg"
        alt=""
        @click="handlePhone(item.officeTel)"
      >
      <!-- 短信 -->
      <img
        style="width: 18px;margin: 1px 3px;cursor: pointer;"
        src="./assets/2-m.svg"
        alt=""
        @click="handleSms(item.officeTel)"
      >
    </div>
    <div :class="$style.row">
      传真号码：{{ item.fax || '--' }}
    </div>
    <div :class="$style.row">
      备注：{{ item.remark || '--' }}
    </div>
    <div :class="$style.rowhead">
      <p :class="$style.text">
        关联设备
      </p>
    </div>
    <div :class="$style.row">
      监控视频：<span style="color: rgba(86, 233, 255, 1);">{{ item.watchVideo || '--' }}</span>
      <!-- 定位 -->
      <span
        :class="isPosition
          ? $style.locationIconActive
          : $style.locationIcon"
        @click="handlePosition"
      />
      <!-- 查看详情 -->
      <span
        :class="isDetail
          ? $style.detailIconActive
          : $style.detailIcon"
        @click="handleDetail(item)"
      />
    </div>
    <div :class="$style.row">
      会场终端：<span style="color: rgba(86, 233, 255, 1);">{{ item.sceneTerminal || '--' }}</span>
      <!-- 定位 -->
      <span
        :class="isPosition
          ? $style.locationIconActive
          : $style.locationIcon"
        @click="handlePosition"
      />
    </div>
    <div :class="$style.row">
      集群终端：<span style="color: rgba(86, 233, 255, 1);">{{ item.groupTerminal || '--' }}</span>
      <!-- 定位 -->
      <span
        :class="isPosition
          ? $style.locationIconActive
          : $style.locationIcon"
        @click="handlePosition"
      />
    </div>
    <div :class="$style.row">
      WeComm：<span style="color: rgba(86, 233, 255, 1);">{{ item.wecomm || '--' }}</span>
      <!-- 定位 -->
      <span
        :class="isPosition
          ? $style.locationIconActive
          : $style.locationIcon"
        @click="handlePosition"
      />
    </div>
    <div :class="$style.rowtag">
      <span style="margin-left: 10px;">标签：</span>
      <div :class="$style.tag">
        事件增援
      </div>
      <div :class="$style.tag">
        危房核实
      </div>
      <div :class="$style.tag">
        任务调度
      </div>
      <div :class="$style.tag">
        人员调派
      </div>
    </div>
    <div :class="$style.tagline" />
    <div :class="$style.row">
      <div :class="$style.one">
        <div
          :class="$style.oneicon"
          @click="handlePhone(item.mobile1)"
        />
        <div :class="$style.name">
          电话呼叫
        </div>
      </div>
      <div :class="$style.one">
        <div
          :class="$style.twoicon"
          @click="handleSms"
        />
        <div :class="$style.name">
          短信呼叫
        </div>
      </div>
      <div :class="$style.one">
        <div
          :class="$style.threeicon"
          @click="handleVoice"
        />
        <div :class="$style.name">
          语音点呼
        </div>
      </div>
      <div :class="$style.one">
        <div
          :class="$style.fouricon"
          @click="handleVideo"
        />
        <div :class="$style.name">
          视频点呼
        </div>
      </div>
      <!-- <div :class="$style.one">
        <div
          :class="$style.fiveicon"
          @click="preview"
        />
        <div :class="$style.name">
          现场直播
        </div>
      </div> -->
      <div :class="$style.one">
        <div
          :class="$style.sixicon"
          @click="track"
        />
        <div :class="$style.name">
          轨迹跟踪
        </div>
      </div>
      <!-- <div :class="$style.one">
        <div
          :class="$style.sevenicon"
          @click="meeting"
        />
        <div :class="$style.name">
          邀请会议
        </div>
      </div>
      <div :class="$style.one">
        <div
          :class="$style.eighticon"
          @click="rim"
        />
        <div :class="$style.name">
          周边检索
        </div>
      </div>
      <div :class="$style.one">
        <div
          :class="$style.nineicon"
          @click="handleDetail"
        />
        <div :class="$style.name">
          附近监控
        </div>
      </div> -->
      <div :class="$style.one">
        <div
          :class="$style.tenicon"
          @click="publishTask"
        />
        <div :class="$style.name">
          发布任务
        </div>
      </div>
    </div>
  </div>
  <!-- 快捷会议 -->
  <StartMeetingDialog
    ref="StartMeetingDialog"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import {
  makePhoneCall,
  monitorPreview,
  callVideoCluster,
  callVoiceCluster,
  callGroupCluster,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
// 短信
import SMSShortcut from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/components/SMSShortcut/SMSShortcut';
// 轨迹跟踪
import { openRoutesTrack } from '@/product/CommandBrain3.0/FunModule/RoutesTrack/scripts/useRoutesTrack';
// 周边检索
import rimHandler from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/script';
// 发布任务
import TaskPublishDialog from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskPublishDialog/TaskPublishDialog.vue';
// 会议
import StartMeetingDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/StartMeetingDialog/StartMeetingDialog.vue'; // 发起会议弹窗

export default defineComponent({
  components: {
    // 详情按钮
    ContactMoreButton,
    // 发布任务
    TaskPublishDialog,
    // 发起会议弹窗
    StartMeetingDialog,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: [
    '$addDialog',
  ],
  emits: ['close'],
  setup() {
    const instance: any = getCurrentInstance();
    const $store = useStore();
    watch(
      () => $store.state.reservePlan.currNode,
      (val) => {
        instance.proxy.init(val?.id);
      },
    );
    return {
    };
  },
  data() {
    return {
      isPosition: false,
      isPhone: false, // 是否打电话
      isDetail: false,
      isMedia: false,
    };
  },
  methods: {
    init(id: any) {
      const request = {
        method: 'post',
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        url: `/mail/mailcontactor/info/${id}?eventId=${(this as any).$store.state.event.id}`,
        data: {},
      };
      (this as any).$http(request).then((response: any) => {
        this.item.isAttention = response?.mailContactor?.isAttention;
        this.item.watchVideo = '';
        this.item.sceneTerminal = '';
        this.item.groupTerminal = '';
        response?.device.forEach((el:any) => {
          this.item.groupTerminal += `${el?.name},`;
        });
        this.item.wecomm = '';
      });
    },
    // 打电话
    handlePhone(phone: any) {
      this.isPhone = true;
      makePhoneCall({
        phone: phone,
        type: 1,
        id: this.item.id,
        name: this.item.name,
      },
      [{
        key: 'eventId',
        value: (this as any).$store.state.event?.id,
        type: 1,
      }]);
    },
    // 发短信
    handleSms(phone: any) {
      SMSShortcut(
        phone || this.item.mobile1 || this.item.officeTel,
        this.item.id,
        (this as any).$store.state.event?.id,
      );
    },
    // 查看监控视频详情
    handleDetail(item: any) {
      this.isDetail = true;
      monitorPreview([{
        id: item.id,
        name: item.name,
        codeNum: item.code,
      }]);
    },
    // 视频电话
    handleVideo(item: any) {
      this.isMedia = true;
      callVideoCluster([{
        id: item.id,
        name: item.name,
        num: item.code,
      }]);
    },
    // 定位
    handlePosition() {
      if (!this.item.longitude) {
        (this as any).$message.error('暂无经纬度信息');
        return ;
      }
      if ((window as any).map) {
        (window as any).map.clearDeleteCoverage('treemanMarker');
        (window as any).map.createdMarkCoverage('treemanMarker');
      }
      this.isPosition = !this.isPosition;
      (window as any).map.setCentent(
        {
          longitude: this.item.longitude,
          latitude: this.item.latitude,
        },
        17,
      );
      (window as any).map.setOneMarker(
        'treemanMarker',
        {
          longitude: this.item.longitude,
          latitude: this.item.latitude,
          wd: 40,
          hg: 40,
          src: useMapMarker(),
        },
      );
    },
    // 收藏
    collect() {
      console.log(this.item);
      let url = '';
      let data:any = null;
      if (this.item.isAttention) {
        // 取消关注
        url = '/event/attention/delete';
        data = [{
          eventId: (this as any).$store.state.event.id,
          id: this.item.id,
          type: 'contactor',
        }];
      } else {
        // 关注
        url = '/event/attention/save';
        data = {
          eventId: (this as any).$store.state.event.id,
          attentionId: this.item.id,
          attentionType: 'contactor',
        };
      }
      const request = {
        method: 'post',
        service: 'soc',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      };
      (this as any).$http(request).then((response:any) => {
        if (response.code === 0 || response.errorcode === 0) {
          if (this.item.isAttention) (this as any).$message.success('取消关注成功!');
          else (this as any).$message.success('关注成功!');
          this.init(this.item?.id);
        } else {
          (this as any).$message.error(response.msg);
        }
      });
    },
    // 邀请会议
    meeting() {
      if (this.$refs.StartMeetingDialog) {
        const members = [{
          memberType: 5,
          id: this.item.id,
          name: this.item.name,
          mobile1: this.item.mobile1,
          mobile2: this.item.mobile2,
        }];
        (this as any).$refs.StartMeetingDialog.createOrAddMeeting(members);
      }
    },
    // 语音点呼
    handleVoice() {
      console.log('语音呼叫');
      callVoiceCluster([
        {
          id: this.item.id,
          name: this.item.name,
          num: this.item.phone,
        },
      ]);
    },
    // 现场直播
    preview() {
      console.log('现场直播');
    },
    // 发布任务
    publishTask() {
      (this as any).$addDialog('发布任务', TaskPublishDialog, {
        initSelectedResponsiblePerson: [this.item],
      });
    },
    // 轨迹跟踪
    track() {
      console.log('轨迹定位');
      const trackPayload = {
        contactorId: this.item.id,
      };
      openRoutesTrack(trackPayload);
    },
  },
});
</script>

<style lang="scss" module>
  .right {
    color: rgba(255, 255, 255, 0.8);
    width: 100%;
    height: 100%;
    .styleHead {
      height: 49px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      .styleHeadText {
        font-size: 16px;
        margin-left: 14px;
        margin-top: 13px;
        float: left;
      }
      .styleHeadClose {
        background: url(../PublicComponents/assets/close.svg) no-repeat;
        width: 16px;
        height: 16px;
        margin-right: 15px;
        margin-top: 16px;
        background-size: 100%;
        cursor: pointer;
        float: right;
        opacity: 0.45;
      }
    }
    .styleHeadTwo {
      height: 120px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      .follow {
        background: transparent;
        color: rgba(86, 233, 255, 1);
        border: 1px solid rgba(86, 233, 255, 1);
        cursor: pointer;
        height: 24px;
      }
    }
    .rowhead {
      width: 100%;
      height: 30px;
      background: linear-gradient(90deg, rgba(1, 75, 113, 0.6) 0%, rgba(1, 75, 113, 0) 100%);
      .text {
        padding: 5px 13px;
      }
    }
    .row {
      margin: 4px 10px;
      padding: 4px 0px 0px 5px;
      .detailIcon {
        background: url(../../CommunicationDispatch/modules/Device/assets/detail.svg) no-repeat;
        width: 15px;
        height: 17px;
        background-size: 100%;
        display: inline;
        float: right;
        cursor: pointer;
        margin: 1px 3px;
      }
      .detailIconActive {
        background: url(../../CommunicationDispatch/modules/Device/assets/detailActive.svg) no-repeat;
        width: 15px;
        height: 17px;
        background-size: 100%;
        display: inline;
        float: right;
        cursor: pointer;
        margin: 1px 3px;
      }
      .locationIcon {
        background: url(../../CommunicationDispatch/modules/Device/assets/location.svg) no-repeat;
        width: 15px;
        height: 17px;
        background-size: 93%;
        display: inline;
        float: right;
        cursor: pointer;
        margin: 1px 3px;
      }
      .locationIconActive {
        background: url(../../CommunicationDispatch/modules/Device/assets/locationActive.svg) no-repeat;
        width: 15px;
        height: 17px;
        background-size: 93%;
        display: inline;
        float: right;
        cursor: pointer;
        margin: 1px 3px;
      }
      .mediaIcon {
        background: url(../../CommunicationDispatch/modules/Device/assets/media.svg) no-repeat;
        width: 15px;
        height: 17px;
        background-size: 100%;
        display: inline;
        float: right;
        cursor: pointer;
        margin: 1px 3px;
      }
      .mediaIconActive {
        background: url(../../CommunicationDispatch/modules/Device/assets/mediaActive.svg) no-repeat;
        width: 15px;
        height: 17px;
        background-size: 100%;
        display: inline;
        float: right;
        cursor: pointer;
        margin: 1px 3px;
      }
      .one {
        float: left;
        margin: 5px 9px;
        .name {
          float: left;
        }
        .oneicon {
          background: url(./assets/1-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 95%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
        .twoicon {
          background: url(./assets/2-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 100%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
        .threeicon {
          background: url(./assets/3-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 100%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
        .fouricon {
          background: url(./assets/4-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 100%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
        .fiveicon {
          background: url(./assets/5-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 100%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
        .sixicon {
          background: url(./assets/6-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 100%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
        .sevenicon {
          background: url(./assets/7-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 100%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
        .eighticon {
          background: url(./assets/8-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 100%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
        .nineicon {
          background: url(./assets/9-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 100%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
        .tenicon {
          background: url(./assets/10-m.svg) no-repeat;
          width: 15px;
          height: 15px;
          background-size: 100%;
          cursor: pointer;
          float: left;
          margin: 4px;
        }
      }
    }
    .rowtag {
      margin: 10px 0px 4px 0px;
      padding: 4px 0px 0px 5px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      .tag {
        width: 80px;
        height: 24px;
        background: #FFFFFF;
        box-shadow: 0px 0px 3px 0px rgb(86 233 255 / 24%);
        background-size: 8px 8px;
        border-radius: 16px;
        color: rgba(86, 233, 255, 1);
        text-align: center;
        line-height: 24px;
        margin: 5px 3px;
        font-size: 12px;
        display: inline-block;
      }
    }
    .tagline {
      box-shadow: 0px 0px 4px 0px rgba(86, 233, 255, 0.3), 0px 0px 20px 2px rgba(86, 233, 255, 0.3);
      border: 1px solid rgba(86, 233, 255, 0.2);
    }
  }
</style>
