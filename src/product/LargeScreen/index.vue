<template>
  <!-- 大容器 -->
  <div :class="$style.LargeScreenWrap">
    <!-- 标题 -->
    <header>
      <Header />
    </header>
    <!-- 主内容 -->
    <main>
      <!--
        应急管理和应急指挥
        各自拥有和使用自己的地图，(共用时会重复初始化，分开时能降低初始化次数)
        进行地图的初始化、移动会占用网络带宽(250k/s)加载耗时40s - 1.5min
        及40%-80%的cpu 进行地图处理
        (型号：i5-9400 cpu 2.90GHz)
      -->
      <keep-alive>
        <component
          :is="activeComponent"
          ref="component"
        />
      </keep-alive>
      <!-- 右侧视频 -->
      <aside :class="$style.right_video">
        <div>
          <!-- 应急管理图例模块 -->
          <AdminLegend v-show="component === '应急管理'" :class="$style.AdminLegend" />
          <!-- 应急指挥图例模块 -->
          <CommandLegend v-if="component === '应急指挥'" :class="$style.LegendWrap" />
          <!-- 应急指挥事件动态模块 -->
          <EventDynamic v-show="component === '应急指挥'" :class="$style.EventDynamicWrap" />
          <VideoIndex />
        </div>
      </aside>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// import Cookies from 'js-cookie';
// 头部
import Header from '@/product/LargeScreen/module/Header/Header.vue';
// 应急管理
import EmergencyAdmin from '@/product/LargeScreen/module/EmergencyAdmin/EmergencyAdmin.vue';
// 应急值守
import EmergencyCommand from '@/product/LargeScreen/module/EmergencyCommand/EmergencyCommand.vue';
// 事件动态模块
import EventDynamic from '@/product/LargeScreen/module/EmergencyCommand/EventDynamic/EventDynamic.vue';
// 应急指挥图例模块
import CommandLegend from '@/product/LargeScreen/module/EmergencyCommand/Legend/Legend.vue';
// 应急管理图例模块
import AdminLegend from '@/product/LargeScreen/module/EmergencyAdmin/Legend/Legend.vue';
// 实时视频
import VideoIndex from '@/product/LargeScreen/module/VideoModule/VideoIndex.vue';
import {
  heartbeat,
  addCallback,
  stopVideoWall, // 关闭视频墙
  stopVideoPreview,
  uds,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
// 飞巡通讯链接
import FlightPatrolScript from '@/product/CommandBrain3.0/FunModule/FlightPatrol/script/script';

export default defineComponent({
  components: {
    // 头部标题
    Header,
    // 应急管理
    EmergencyAdmin,
    // 应急指挥
    EmergencyCommand,
    // 事件动态模块
    EventDynamic,
    // 应急指挥图例模块
    CommandLegend,
    // 应急管理图例模块
    AdminLegend,
    // 实时视频
    VideoIndex,
  },
  setup() {
    const { connectMq } = FlightPatrolScript();
    const route = useRoute(); // 南海可视化对接需要从链接获取token
    // 南海需求，可视化对接需要从地址栏获取token
 const changeToken = () => {
      if (route?.query?.token) {
        (window as any).globalToken = route.query.token; // 登录token
        (window as any).globalLon = route.query.longitude; // 平台经度
        (window as any).globalLat = route.query.latitude; // 平台纬度
        (window as any).globalUserName = route.query.userName; // 登录用户名
        (window as any).globalPassword = route.query.password; // 登录密码
      }
    };
    onMounted(() => {
      changeToken();
      connectMq();
    });
  },
  data() {
    return {
      component: '应急管理',
      // uds登录状态查看
      udsLoginState: false,
      beforeUnloadTime: '',
      gapTime: '',
    };
  },
  computed: {
    /**
     * @description 当前激活的弹窗内容模块
     * @return 模块组件名称
     */
    activeComponent(): string {
      switch ((this as any).component) {
        case '应急管理': {
          return 'EmergencyAdmin';
        }
        case '应急指挥': {
          return 'EmergencyCommand';
        }
        default: {
          return 'EmergencyAdmin';
        }
      }
    },
    btnData() {
      return (this as any).$store.state.btnTab.btnData;
    },
  },
  watch: {
    btnData: {
      handler(newVal) {
        if (newVal[0].active) {
          (this as any).component = '应急管理';
        } else {
          (this as any).component = '应急指挥';
        }
        console.log((this as any).component);
      },
      deep: true,
    },
  },
  mounted() {
    (this as any).udsHeartbeat();
    (window as any).addEventListener('beforeunload', (e: any) => this.beforeunloadHandler());
    (window as any).addEventListener('unload', (e: any) => this.unloadHandler());
  },
   unmounted() {
    (window as any).removeEventListener('beforeunload', (e:any) => this.beforeunloadHandler());
    (window as any).removeEventListener('unload', (e:any) => this.unloadHandler())
  },
  methods: {
    // 检测uds登录
    udsHeartbeat(): void {
      const that = this;
      if (uds.connected) {
        heartbeat();
        addCallback((this as any).udsHandleMQMessage);
        setTimeout(() => {
          if (!(that as any).udsLoginState) {
            uds.waken();
          }
        }, (window as any)?.config?.UDSMQConfig?.heartbeatAckTime * 1000 || 3000);
      }
    },
    udsHandleMQMessage(code: any, message: any) {
      if (code === 5) {
        console.log('【UDS】心跳检测');
        (this as any).udsLoginState = true;
      }
    },
    // 监听浏览器是否关闭
    beforeunloadHandler() {
      (this.beforeUnloadTime as any) = new Date().getTime();
    },
    unloadHandler() {
      (this.gapTime as any) = new Date().getTime() - Number(this.beforeUnloadTime);
      // 判断是窗口关闭还是刷新
      // if ((this.gapTime as any) <= 15) {
      //   stopVideoWall(); // 关闭视频墙
      // }
      stopVideoWall(); // 关闭视频墙
    },

  },
});
</script>

<style lang="scss" module>
ul,
li {
  list-style: none;
}
ul,
li,
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
}
.LargeScreenWrap {
  width: 7680px;
  height: 1080px;
  position: relative;
  & > header {
    width: 100%;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 5;
  }
  & > main {
    width: 100%;
    height: 100%;
  }
}
.right_video {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 4;
  width: 2100px;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(4, 7, 11, 0.5) 10%,
    rgba(10, 11, 11, 0.85) 100%
  );
  & > div {
    position: relative;
  }
}
.LegendWrap {
  position: absolute;
  left: -710px;
  top: 24px;
}
.AdminLegend {
  position: absolute;
  left: -294px;
  top: 24px;
}
.EventDynamicWrap {
  position: absolute;
  left: -420px;
  top: 24px;
  width: 400px;
  height: calc(100% - 45px);
  background: rgba(2, 5, 8, 0.81);
  border: 2px solid;
  border-image: linear-gradient(
    270deg,
    rgba(0, 199, 255, 0),
    rgba(86, 233, 255, 1),
    rgba(86, 233, 255, 1),
    rgba(0, 218, 255, 1),
    rgba(0, 206, 255, 0)
  );
}
</style>
