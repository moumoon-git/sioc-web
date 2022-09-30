<template>
  <div :class="$style.eventInfo">
    <!-- 事件等级 -->
    <EventTitle :class="$style.EventTitle" >
      <p :class="$style['eventInfo_p']" @click="eventDistributionSelect">
        事件下发
      </p>
    </EventTitle>
    <!-- 流程 -->
    <Process :process-data="processData" style="margin-top: 15px" />
    <!-- 标题 -->
    <Titles title="事件要素" style="margin-top: 15px">
      <span :class="$style.eventInfoTitle">更新时间：{{ upDataTime }}</span>
    </Titles>
    <!-- 要素 -->
    <div style="margin: 10px 0px; height: 20%">
      <EssentialFactor :list-data="listData" />
    </div>
    <!-- 标题 -->
    <Titles title="最新续报">
      <!-- <span :class="$style.seeSpan">查看</span> -->
    </Titles>
    <!-- 最新报告 -->
    <div style="margin: 15px 0px; height: 16%">
      <Resubmit :resubmit-data="resubmitData" />
    </div>
    <!-- 标题 -->
    <Titles title="基本信息" />
    <!-- 基本信息 -->
    <div :class="$style.essentialInfoWrap">
      <EssentialInfo :content="essentialInfoData" :info-obj="infoObj" />
    </div>
  </div>
  <!-- 选择联系人弹窗 -->
  <SelectContactDialog
    ref="SelectContactDialog"
    :judgeActivationApp="true"
    v-model="selectedContact"
    :multiple="contactType === 1 ? false : true"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  watch,
  onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
// import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';
// 蓝色标题
import Titles from '@/product/CommandBrain3.0/Generalparts/left/Title/Title.vue';
// 事件等级
import EventTitle from './info/Title.vue';
// 流程
import Process from './info/Process.vue';
// 要素
import EssentialFactor from './info/EssentialFactor.vue';
// 续报
import Resubmit from './info/Resubmit.vue';
// 基本信息
import EssentialInfo from './info/EssentialInfo.vue';
// 选择联系人
import SelectContactDialog from '@/product/CommandBrain3.0/Generalparts/dialog/SelectContactDialog/SelectContactDialog.vue';

// 连接websocket
const connectWebsocket =
  require('@/product/Coplotting/mainCapacity/websocket/websocket').default;

export default defineComponent({
  name: 'EventInfo',
  components: {
    EventTitle,
    Process,
    Titles,
    EssentialFactor,
    Resubmit,
    EssentialInfo,
    // 选择联系人弹窗
    SelectContactDialog,
  },
  setup() {
    const instance: any = getCurrentInstance();
    const { $ws } = instance?.appContext.config.globalProperties;
    const $store = useStore();
    watch(
      () => $store.state.reservePlan.leftRefresh,
      (val) => {
        if (val) instance.proxy.getProcessData($store.state.event.id);
      },
    );

    // 事件流程状态变更，刷新数据
    const uns = $ws.subscribe(
      `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
      (msg: any) => {
        if (msg?.msgType === 60004) {
          instance.proxy.init($store.state.event.id);
        }
      },
    );
    onBeforeUnmount(uns);
  },
  data() {
    return {
      // 流程状态
      processData: [],
      // 事件要素
      listData: [],
      // 更新时间
      upDataTime: '',
      // 续报
      resubmitData: {},
      // 基本信息
      essentialInfoData: '',
      infoObj: {},
      uns: {},
      // 选择联系人组件绑定值
      selectedContact: [] as any,
    };
  },
  computed: {
    event() {
      return (this as any).$store.state.event;
    },
  },
  watch: {
    event: {
      handler(newVal) {
        if (newVal) {
          console.log(newVal);
          (this as any).init(newVal.id);
        }
      },
      deep: true,
      immediate: true,
    },
    selectedContact: {
      handler(newVal) {
        if (newVal.length) {
          (this as any).eventDistribution();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 初始化
    init(eventId: any) {
      (this as any).getProcessData(eventId);
      (this as any).getEssentialFactorData(eventId);
      (this as any).getResubmitData(eventId);
      (this as any).getInfoData(eventId);
    },
    // 获取事件流程状态
    getProcessData(eventId: any) {
      const request = {
        method: 'get',
        url: '/event/event/info/getEventStepStatus',
        params: {
          eventId,
        },
      };
      (this as any).$http(request).then((res: any) => {
        if (res.data) {
          (this as any).processData = res.data;
        }
      });
    },
    // 获取事件要素
    getEssentialFactorData(eventId: any) {
      const request = {
        method: 'get',
        url: '/event/event/info/getLatestParams',
        params: {
          eventId,
        },
      };
      (this as any).$http(request).then((res: any) => {
        if (res.data && res.data.param) {
          (this as any).listData = res.data.param;
          (this as any).upDataTime = res.data.time.replace(/-/g, '/');
        }
      });
    },
    // 获取续报
    getResubmitData(eventId: any) {
      const request = {
        method: 'get',
        url: '/event/event/info/getLatestEventDeal',
        params: {
          eventId,
          ignoreFirst: 1,
        },
      };
      (this as any).$http(request).then((res: any) => {
        if (res.data) {
          res.data.reportDescription = res.data.reportDescription.trim();
          (this as any).resubmitData = res.data;
        }
      });
    },
    // 获取基本信息
    getInfoData(eventId: any) {
      const request = {
        method: 'get',
        url: '/event/event/info/getFirstEventDeal',
        params: {
          eventId,
        },
      };
      (this as any).$http(request).then((res: any) => {
        if (res.data) {
          // 处理文件路径和进行数据分割
          // 图片
          res.data.attachments_image = [];
          // 文档
          res.data.attachments_word = [];
          res.data.attachments.forEach((ele: any) => {
            ele.src = `${(window as any).config.baseURL}${
              (window as any).config.service.file
            }${ele.filePath}`;
            // 转成大写之后再做比较
            const upStr = ele.suffix?.toLocaleUpperCase();
            ele.handleType = upStr;
            if (upStr === 'PNG' || upStr === 'JPG' || upStr === 'GIF') {
              res.data.attachments_image.push(ele);
            } else if (
              upStr === 'TXT' ||
              upStr === 'DOC' ||
              upStr === 'XLSX' ||
              upStr === 'XLS' ||
              upStr === 'PDF' ||
              upStr === 'PPT'
            ) {
              res.data.attachments_word.push(ele);
            }
          });
          console.log(res.data.attachments);
          (this as any).essentialInfoData = res.data.reportDescription;
          (this as any).infoObj = res.data;
        }
      });
    },
    // 连接websocket
    connectWebsoket() {
      // const seatInformation = document.cookie.match(
      //   /seatInformation=([^;]*)/,
      // )?.[1];
      // if (
      //   seatInformation !== 'null' &&
      //   seatInformation !== 'undefined' &&
      //   seatInformation
      // ) {
      //   const str = (window as any).decodeURIComponent(seatInformation);
      //   const objs: any = JSON.parse(str);
      //   const url = `/platform/${objs?.platformId}/message`;
      //   (this as any).uns = (this as any).$ws.subscribe(url, (result: any) => {
      //     console.log(result);
      //     if (Number(result?.msgType) === 60001) {
      //       (this as any).handleMQMessage();
      //     }
      //   });
      // }
      connectWebsocket.connect((this as any).handleMQMessage);
    },
    // 操作消息
    handleMQMessage(params: any) {
      const result: any = JSON.parse(params.body);
      // console.log(result);
      if (Number(result?.msgType) === 60001) {
        if ((this as any).$store.state.event.id) {
          (this as any).getResubmitData((this as any).$store.state.event.id);
        }
      }
    },
    // 事件下发选择联系人
    eventDistributionSelect() {
      if ((this as any).$refs.SelectContactDialog) {
        (this as any).$refs.SelectContactDialog.open();
      }
    },
    // 事件下发
    eventDistribution() {
      const arr = (this as any).selectedContact.reduce((pre: any, ele: any) => {
        pre.push(ele.id);
        return pre;
      }, []);
      const request = {
        method: 'get',
        url: '/contactorEventDispatch/saveEventList',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          eventId: (this as any).$store.state.event?.id,
          userIds: arr.join(),
        },
      };
      (this as any).$http(request).then((res: any) => {
        console.log(res);
        if (res.code === 0) {
          (this as any).$message.success('事件下发成功');
        } else {
          (this as any).$message.error(`事件下发失败${res.msg}`);
        }
      });
    },
  },
  mounted() {
    (this as any).connectWebsoket();
  },
  onBeforeUnmount() {
    // if ((this as any).uns) (this as any).uns(); // 退出websocket
  },
});
</script>

<style module lang="scss">
.eventInfo {
  height: 100%;
  padding: 15px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .seeSpan {
    font-size: 14px;
    font-weight: 600;
    color: #00ecff;
    cursor: pointer;
  }
}
.EventTitle{
  &>*{
    white-space: nowrap;
  }
}
.eventInfoTitle {
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
}
.essentialInfoWrap {
  width: 104%;
  min-height: 27.84%;
  flex: 1;
  margin-top: 15px;
}
.eventInfo_p {
  cursor: pointer;
  color: #00ecff;
  margin-left: 10px;
  font-size: 15px;
}
</style>
