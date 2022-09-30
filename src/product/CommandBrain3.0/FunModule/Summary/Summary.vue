<template>
  <div style="width: 1000px; height: 81vh; position: relative;">
    <!-- 勾选框 -->
    <header :class="$style.headerStyle">
      <div :class="$style.headerCheck">
        <input
          v-model="checkTypeOne"
          type="checkbox"
          @change="getSummary"
        >
        <p
          :class="$style.listHeadText"
          :style="checkTypeOne?'color: #56E9FF':''"
        >
          事件接报
        </p>
      </div>
      <div :class="$style.headerCheck">
        <input
          v-model="checkTypeTwo"
          type="checkbox"
          @change="getSummary"
        >
        <p
          :class="$style.listHeadText"
          :style="checkTypeTwo?'color: #56E9FF':''"
        >
          预案响应
        </p>
      </div>
      <div :class="$style.headerCheck">
        <input
          v-model="checkTypeThree"
          type="checkbox"
          @change="getSummary"
        >
        <p
          :class="$style.listHeadText"
          :style="checkTypeThree?'color: #56E9FF':''"
        >
          通讯调度
        </p>
      </div>
      <!-- <div :class="$style.headerCheck">
        <input
          v-model="checkTypeFour"
          type="checkbox"
          @change="getSummary"
        >
        <p
          :class="$style.listHeadText"
          :style="checkTypeFour?'color: #56E9FF':''"
        >
          请求支援
        </p>
      </div> -->
      <div :class="$style.headerCheck">
        <input
          v-model="checkTypeFive"
          type="checkbox"
          @change="getSummary"
        >
        <p
          :class="$style.listHeadText"
          :style="checkTypeFive?'color: #56E9FF':''"
        >
          任务调度
        </p>
      </div>
      <!-- <div :class="$style.headerCheck">
        <input
          v-model="checkTypeSix"
          type="checkbox"
          @change="getSummary"
        >
        <p
          :class="$style.listHeadText"
          :style="checkTypeSix?'color: #56E9FF':''"
        >
          现场回传
        </p>
      </div> -->
      <!-- <div :class="$style.headerCheck">
        <input
          v-model="checkTypeSeven"
          type="checkbox"
          @change="getSummary"
        >
        <p
          :class="$style.listHeadTextRight"
          :style="checkTypeSeven?'color: #56E9FF':''"
        >
          通知公告
        </p>
      </div> -->
      <div :class="$style.headerCheck">
        <input
          v-model="checkTypeEight"
          type="checkbox"
          @change="getSummary"
        >
        <p
          :class="$style.listHeadText"
          :style="checkTypeEight?'color: #56E9FF':''"
        >
          处置情况
        </p>
      </div>
    </header>
    <!-- 时间轴 -->
    <main :class="$style.scroll">
      <!-- 日期列表没有id，用index -->
      <div
        v-for="(itemone, indexone) in summaryList"
        :key="indexone"
      >
        <!-- 头 哪天 -->
        <header :class="$style.listHeadTime">
          {{ itemone.date }}
        </header>
        <!-- 头 当天有没有现场指挥部 -->
        <header
          v-if="isBuild"
          :class="$style.listHead"
        >
          <div :class="$style.listHeadText">
            已签到单位: <span style="color:#0091FF;">{{ itemone.hasSign }}</span>
          </div>
          <div :class="$style.listHeadText">
            未签到单位: <span style="color:#FF4D4D;">{{ itemone.notSign }}</span>
          </div>
          <div :class="$style.listHeadText">
            签到人数: <span style="color:#56E9FF;">{{ itemone.signAll }}</span>
          </div>
          <div :class="$style.listHeadText">
            签到率: <span style="color:#F2B626;">{{ itemone.signRate }}</span>
          </div>
        </header>
        <header
          v-else
          :class="$style.listHead"
        >
          <div :class="$style.listHeadText">
            暂未成立现场指挥部
          </div>
        </header>
        <!-- 身体 -->
        <main
          v-for="(item, index) in itemone.array"
          :key="index"
        >
          <!-- 事件接报 -->
          <TypeOne
            v-if="item.type==='事件接报'"
            :item="item"
            @handleClick="handleClick"
          />
          <!-- 应急响应 -->
          <TypeTwo
            v-if="item.type==='应急响应'"
            :item="item"
            @handleClick="handleClick"
          />
          <!-- 通讯调度 -->
          <TypeThree
            v-if="(item.type).split('-')[0]==='通讯调度'"
            :item="item"
            @handleClick="handleClick"
          />
          <!-- 请求支援 -->
          <TypeFour
            v-if="item.type==='请求支援'"
            :item="item"
            @handleClick="handleClick"
          />
          <!-- 任务调度 -->
          <TypeFive
            v-if="item.type==='任务调度'"
            :item="item"
            @handleClick="handleClick"
          />
          <!-- 现场回传 -->
          <TypeSix
            v-if="item.type==='现场回传'"
            :item="item"
            @handleClick="handleClick"
          />
          <!-- 通知公告 -->
          <TypeSeven
            v-if="item.type==='通知公告'"
            :item="item"
            @handleClick="handleClick"
          />
          <!-- 处置情况 -->
          <TypeEight
            v-if="(item.type).split('-')[0]==='情况处置'"
            :item="item"
            @handleClick="handleClick"
          />
        </main>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import TypeOne from './components/TypeOne.vue'; // 事件接报
import TypeTwo from './components/TypeTwo.vue'; // 应急响应
import TypeThree from './components/TypeThree.vue'; // 通讯调度
import TypeFour from './components/TypeFour.vue'; // 请求支援
import TypeFive from './components/TypeFive.vue'; // 任务调度
import TypeSix from './components/TypeSix.vue'; // 现场回传
import TypeSeven from './components/TypeSeven.vue'; // 通知公告
import TypeEight from './components/TypeEight.vue'; // 处置情况

export default defineComponent({
  name: 'Summary',
  components: {
    TypeOne,
    TypeTwo,
    TypeThree,
    TypeFour,
    TypeFive,
    TypeSix,
    TypeSeven,
    TypeEight,
  },
  setup(props, context) {
    const store = useStore(); // 使用vuex
    const isBuild = ref(false); // 有没有现场指挥部
    const checkTypeOne = ref(true); // 事件接报
    const checkTypeTwo = ref(true); // 应急响应
    const checkTypeThree = ref(true); // 通讯调度
    const checkTypeFour = ref(false); // 请求支援
    const checkTypeFive = ref(true); // 任务调度
    const checkTypeSix = ref(false); // 现场回传
    const checkTypeSeven = ref(false); // 通知公告
    const checkTypeEight = ref(true); // 处置情况
    const summaryList: any = ref([]); // 列表
    const { $http }: any = getCurrentInstance()?.appContext.config.globalProperties;
    // 获取列表
    function getSummary() {
      const request = {
        method: 'get',
        url: `/gather/${store.state.event?.id}`,
        service: 'eoc',
        params: {
          eventTag: checkTypeOne.value ? '1' : '0', // 事件接报
          emRespTag: checkTypeTwo.value ? '1' : '0', // 应急响应
          coDispTag: checkTypeThree.value ? '1' : '0', // 通讯调度
          reqSptTag: checkTypeFour.value ? '1' : '0', // 请求支援
          taskSdTag: checkTypeFive.value ? '1' : '0', // 任务调度
          liveFdbTag: checkTypeSix.value ? '1' : '0', // 现场回传
          noticeTag: checkTypeSeven.value ? '1' : '0', // 通知公告
          handleTag: checkTypeEight.value ? '1' : '0', // 处置情况
        },
      };
      $http(request).then((response: any) => {
        if (response) {
          summaryList.value = response?.data || [];
          if (summaryList.value.length > 0) {
            summaryList.value.forEach((el:any) => {
              const request1 = {
                method: 'get',
                url: '/eventconduct/eventSceneonductSign/getUnitSginList',
                service: 'soc',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {
                  eventId: store.state.event?.id,
                  dateTime: el.date,
                },
              };
              $http(request1).then((res: any) => {
                if (res.code === 0) {
                  // 计算
                  const all = res.data.length;
                  el.hasSign = 0;
                  el.signAll = 0;
                  res.data.forEach((ele:any) => {
                    el.hasSign += ele.signNumber > 0 ? 1 : 0;
                    el.signAll += ele.signNumber;
                  });
                  el.notSign = all - el.hasSign;
                  if (all > 0) el.signRate = `${String(((100 * el.hasSign) / all).toFixed(0))}%`;
                }
              });
              el.array.forEach((ele:any) => {
                const request2 = {
                  method: 'get',
                  url: '/response/statisticDispatchResult',
                  service: 'eoc',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  params: {
                    eventId: store.state.event?.id,
                  },
                };
                $http(request2).then((res: any) => {
                  if (res.errorcode === 0) {
                    ele.hasSend = res.data.send; // 已发送
                    ele.hasAnnounce = res.data.response; // 已响应
                    ele.annoRate = `${res.data.rate}%`; // 响应率
                  }
                });
              });
            });
          }
        }
      });
    }
    // 勾选框
    function check() {
      getSummary();
    }
    // 打开详情-R2功能，目前没有设计
    function handleClick(item: any) {
    }
    watch(() => store.state.event?.id, (val: any) => {
      if (val) {
        isBuild.value = true;
      }
      summaryList.value = [];
      checkTypeOne.value = false;
      checkTypeTwo.value = false;
      checkTypeThree.value = false;
      checkTypeFour.value = false;
      checkTypeFive.value = false;
      checkTypeSix.value = false;
      checkTypeSeven.value = false;
      checkTypeEight.value = false;
    });
    onMounted(() => {
      if (store.state.reservePlan?.sceneMsg?.id) {
        isBuild.value = true;
      }
      getSummary();
      (window as any).map.clearAtPresentMarkData('SummaryMarker');
      (window as any).map.clearDeleteCoverage('SummaryMarker');
      (window as any).map.createdMarkCoverage('SummaryMarker');
    });
    onBeforeUnmount(() => {
      (window as any).map.clearAtPresentMarkData('SummaryMarker');
      (window as any).map.clearDeleteCoverage('SummaryMarker');
    });
    return {
      isBuild,
      summaryList,
      handleClick,
      getSummary,
      check,
      checkTypeOne,
      checkTypeTwo,
      checkTypeThree,
      checkTypeFour,
      checkTypeFive,
      checkTypeSix,
      checkTypeSeven,
      checkTypeEight,
    };
  },
});
</script>

<style lang="scss" module>
  .headerStyle {
    width: 100%;
    height: 50px;
    color: #FFFFFF;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    .headerCheck {
      & > input[type="checkbox"] {
        cursor: pointer;
        position: relative;
        visibility: hidden;
        float: left;
        margin: 14px 6px 0px 20px;
      }
      & > input[type="checkbox"]::after {
        color: #fff;
        width: 15px;
        height: 15px;
        border-radius: 2px;
        border: 1px solid #A6ADB4;
        display: inline-block;
        visibility: visible;
        padding-left: 0px;
        text-align: center;
        content: " ";
        box-sizing: border-box;
        line-height: 16px;
        margin-top: 3px;
      }
      & > input[type="checkbox"]:checked::after {
        background-color: #56E9FF;
        border: none;
        content: "✓";
        font-size: 14px;
        color: #000;
      }
    }
    .listHeadText {
      position: relative;
      float: left;
      margin-top: 14px;
      margin-right: 53px;
    }
    .listHeadTextRight {
      position: relative;
      float: right;
      margin-top: 14px;
      margin-right: 22px;
    }
  }
  .scroll {
    color: #FFFFFF;
    width: 100%;
    height: 71vh;
    overflow: auto;
    float: left;
    .listHeadTime {
      float: left;
      position: relative;
      margin: 5px 0px 0px 20px;
      font-size: 20px;
    }
    .listHead {
      float: right;
      position: relative;
      margin: 10px 20px 10px 0px;
      .listHeadText {
        float: left;
        margin-left: 21px;
      }
    }
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
  }
</style>
