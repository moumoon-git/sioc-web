<template>
  <div :class="$style.rotatecircle" :style="{ '--getWidth': width }">
    <!-- 左右两边和背景 -->
    <aside>
      <!-- 左边 -->
      <ul>
        <li>
          <span>通告总数</span>
          <div>
            <p>{{ rotateCircleData.all }}</p>
            <span>人</span>
          </div>
        </li>
        <li>
          <span>已响应</span>
          <div>
            <p>{{ rotateCircleData.response }}</p>
            <span>人</span>
          </div>
        </li>
      </ul>
      <!-- 右边 -->
      <ul>
        <li>
          <span>响应率</span>
          <div>
            <p>{{ rotateCircleData.rate }}</p>
            <span>%</span>
          </div>
        </li>
        <li>
          <span>未响应</span>
          <div>
            <p>{{ rotateCircleData.unresponse }}</p>
            <span>人</span>
          </div>
        </li>
      </ul>
    </aside>
    <!-- 中间 -->
    <div :class="$style.wrap" @mouseenter="activeAnimat">
      <!-- 定位视口 -->
      <div>
        <!-- 顺时针旋转 -->
        <div :class="$style.along">
          <img
            :class="animationFlag ? $style.alongImg : ''"
            src="./assets/along.png"
            alt=""
          />
        </div>
        <!-- 逆时针旋转 -->
        <div :class="$style.inverse">
          <img
            :class="animationFlag ? $style.inverseImg : ''"
            src="./assets/inverse.png"
            alt=""
          />
        </div>
        <div :class="$style.handleDiv" v-if="planState" @click="seePlan">
          <!-- 呼吸闪烁 -->
          <img src="./assets/breathing.png" alt="" />
          <!-- 当前状态 -->
          <span>预案响应</span>
          <!-- 查看按钮 -->
          <span :class="$style.see" @click="seePlan">查看</span>
        </div>
        <div :class="$style.handleDiv" v-if="!planState" @click="startUp">
          <!-- 呼吸闪烁 -->
          <img src="./assets/breathing.png" alt="" />
          <!-- 当前状态 -->
          <span>预案响应</span>
          <span :class="$style.notStarted" @click="startUp">未启动</span>
        </div>
      </div>
    </div>
  </div>
  <!-- 弹窗 -->
  <MessageBox ref="MessageBox" />
</template>

<script lang="ts">
import MessageBox from '@/product/CommandBrain3.0/Generalparts/dialog/MessageBox/MessageBox.vue'; // 消息确认弹窗

export default {
  components: {
    // 消息确认弹窗
    MessageBox,
  },
  provide() {
    return {
      $MessageBox: (this as any).openMessageBox,
    };
  },
  inject: ['$tabModules'],
  props: {
    width: {
      type: String,
      default: '350px',
    },
    initAnima: {
      type: Boolean,
      default: true,
    },
    time: {
      type: Number,
      default: 800,
    },
    rotateCircleData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      animationFlag: false,
      overFlag: true,
      // 判断的预案启动和未启动
      planState: false,
    };
  },
  mounted() {
    // 生成时调用
    (this as any).init((this as any).initAnima);
  },
  computed: {
    // 切换事件
    events() {
      return (this as any).$store.state.event;
    },
    leftRefresh() {
      return (this as any).$store.state.reservePlan.leftRefresh;
    },
  },
  watch: {
    // 切换事件
    events() {
      (this as any).getPlanState();
    },
    leftRefresh() {
      (this as any).getPlanState();
    },
  },
  methods: {
    // 初始化
    init(flag: boolean) {
      const that = this;
      if (flag) {
        (this as any).animationFlag = true;
        setTimeout(() => {
          (that as any).animationFlag = false;
        }, (this as any).time);
      }
      if (!(this as any).$store.state.btnTab) {
        this.getPlanState();
      }
    },
    // 移入
    activeAnimat() {
      if ((this as any).overFlag) {
        this.init(true);
        (this as any).overFlag = false;
        setTimeout(() => {
          (this as any).overFlag = true;
        }, (this as any).time);
      }
    },
    // 查看预案是否启动
    getPlanState() {
      const request = {
        method: 'get',
        url: '/event/event/info/getEventStepStatus',
        params: {
          eventId: (this as any).$store.state.event?.id,
        },
      };
      (this as any).$http(request).then((res: any) => {
        if (res.data) {
          // 启动预案了
          if (res.data[0].status === 1) {
            (this as any).planState = true;
          } else {
            // 没有启动
            (this as any).planState = false;
          }
        }
      });
    },
    // 是否启动预案
    startUp() {
      const options = {
        type: 'prompt',
        title: '应急响应',
        message: '',
        tips: '未启动应急响应，是否启动响应',
        remark: false,
        placeholder: '',
      };
      (this as any).openMessageBox(options).then(() => {
        (this as any).$tabModules({
          activeState: true,
          disable: true,
          distinguishId: '',
          icon: 'reservePlan_Admin',
          name: '预案管理',
          parentNode: 'reservePlan',
          type: '',
        });
      });
    },
    // 查看
    seePlan() {
      (this as any).$tabModules({
        activeState: true,
        disable: false,
        distinguishId: '',
        icon: 'reservePlan_Announce',
        name: '响应通告',
        parentNode: 'reservePlan',
        type: '',
      });
    },
    openMessageBox(options: any) {
      return (this as any).$refs.MessageBox.init(options);
    },
  },
};
</script>

<style module>
.rotatecircle {
  width: var(--getWidth);
  height: calc(var(--getWidth) / 3.24);
  display: flex;
  align-items: center;
  position: relative;
  background: url(./assets/circleBgr.png) no-repeat;
  background-size: 100% 100%;
}
.rotatecircle > aside {
  width: 100%;
  height: calc(100% / 1.59);
  padding: 4px 15px;
  display: flex;
  justify-content: space-between;
}
.rotatecircle > aside > ul {
  width: calc((100% / 1.59) / 2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
}
.rotatecircle > aside > ul > li {
  width: 100%;
  display: flex;
  white-space: nowrap;
  justify-content: space-between;
}
.rotatecircle > aside > ul > li > span {
  margin-right: 7px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
}
.rotatecircle > aside > ul > li > div {
  color: #00ecff;
  display: flex;
}
.rotatecircle > aside > ul > li > div > p {
  margin: 0;
  font-size: 18px;
  color: #00ecff;
}
.rotatecircle > aside > ul > li > div > span {
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 2px;
  font-size: 12px;
}
.rotatecircle .wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: calc(var(--getWidth) / 3.24);
  height: 100%;
}
.wrap > div {
  width: 100%;
  height: 100%;
  position: relative;
}
.handleDiv {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  align-items: center;
  padding: 20px 0;
  box-sizing: border-box;
  z-index: 3;
  position: inherit;
  cursor: pointer;
}
.handleDiv > img {
  animation: breathing infinite linear 5s;
}
.handleDiv > span {
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
}
.handleDiv > span:last-child {
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  /* opacity: 0; */
}
.handleDiv > .see {
  color: #00ecff;
}
.handleDiv > .notStarted {
  color: rgba(246, 110, 110, 1);
}
.along {
  padding: 8px 10px;
  box-sizing: border-box;
}
.inverse,
.along {
  width: 100%;
  height: 100%;
  position: absolute;
  top: -3px;
  left: -3px;
  z-index: 2;
}
.inverse > img,
.along > img {
  width: 106%;
  height: 106%;
}
.alongImg {
  animation: along 0.3s linear 0s 2;
}
.inverseImg {
  animation: inverse 0.3s linear 0s 2;
}
/* 顺时针 */
@keyframes along {
  0% {
    transform: rotate(0deg);
  }
  99% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
/* 逆时针 */
@keyframes inverse {
  0% {
    transform: rotate(0deg);
  }
  99% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
/* 呼吸效果 */
@keyframes breathing {
  50% {
    opacity: 0.4;
  }
}
</style>
