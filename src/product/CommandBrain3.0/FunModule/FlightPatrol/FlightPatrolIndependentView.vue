<template>
  <!-- 只有飞巡功能 -->
  <div :class="$style.app">
    <div :class="$style.btnStyle">
      <ModuleButton :button-arr="buttonArr" @tabModules="tabModules" />
    </div>
    <!-- 主要内容 -->
    <div :class="$style.FlightHeader">
      <FlightHeader />
    </div>
    <!-- 超图实例挂载点 -->
    <div id="superMap" :class="$style.superMap" />
    <component :is="activeComponent" ref="component" />
    <!-- 右边内容容器 -->
    <div id="rightContainer"></div>
    <!-- 主要内容 end-->

    <!-- 确认弹窗 -->
    <MessageBox ref="MessageBox" />
    <!-- 弹窗坞 -->
    <!-- <Dock ref="Dock" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent,onMounted } from 'vue';
import { hwe } from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';
import ModuleButton from '@/product/CommandBrain3.0/Generalparts/left/ModuleButton/ModuleButton.vue';
// 禅道13625 按钮组里面隐藏现场支援模块、以后再恢复
// {
//     "name": "现场支援",
//     "type": "",
//     "distinguishId": "",
//     "icon": "support",
//     "children": [],
//     "activeState": false
// },
import MessageBox from '@/product/CommandBrain3.0/Generalparts/dialog/MessageBox/MessageBox.vue';
// import Dock from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/Dock.vue';
// 头部
import FlightHeader from '@/product/CommandBrain3.0/FunModule/FlightPatrol/header/Header.vue';
// 飞巡模块
import FlightPatrolView from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightPatrolView.vue';
// 飞巡通讯链接
import FlightPatrolScript from '@/product/CommandBrain3.0/FunModule/FlightPatrol/script/script';

export default defineComponent({
  components: {
    FlightHeader,
    FlightPatrolView,
    // 功能模块按钮
    ModuleButton,
    // 消息确认弹窗
    MessageBox,
    // 弹窗坞
    // Dock,
  },
  provide() {
    return {
      $MessageBox: this.openMessageBox,
      $addDialog: this.addDialog,
    };
  },
  data() {
    return {
      component: '飞巡',
      buttonArr: [
        {
          name: '新增巡查',
          icon: 'filghtPatrol_Inspection',
          type: '',
          distinguishId: '',
          activeState: false,
        },
        {
          name: '飞巡记录',
          icon: 'filghtPatrol_record',
          type: '',
          distinguishId: '',
          activeState: false,
        },
        {
          name: '飞巡分组',
          icon: 'filghtPatrol_grouping',
          type: '',
          distinguishId: '',
          activeState: false,
        },
        {
          name: '飞巡资源',
          icon: 'filghtPatrol_resources',
          type: '',
          distinguishId: '',
          activeState: false,
        },
      ],
    };
  },
  computed: {
    /**
     * @description 当前激活的弹窗内容模块
     * @return 模块组件名称
     */
    activeComponent(): string {
      switch ((this as any).component) {
        case '飞巡': {
          return 'FlightPatrolView';
        }
        default: {
          return 'FlightPatrolView';
        }
      }
    },
  },
  mounted() {
    (this as any).initMap();
    this.loginAndSetCenter();
  },
  methods: {
    /**
     * @description 切换模块
     */
    tabModules(data: any) {
      const that = this;
      console.log(data);
      setTimeout(() => {
        (that as any).$refs.component.tabModules(data.name);
      }, 300);
    },
    /**
     * @description 初始化超图地图实例
     */
    initMap(): void {
      const map: any = new (window as any).HM().init('superMap');
      (window as any).map = map;
      // 头部搜索
      (window as any).map.createdMarkCoverage('搜索关键字Layer');
    },
    /**
     * @description 确认弹窗
     */
    openMessageBox(options: any) {
      return (this.$refs.MessageBox as any).init(options);
    },
    /**
     * @description 弹窗坞
     */
    addDialog(dialog: string, el: HTMLElement) {
      return (this.$refs.Dock as any).addDialog(dialog, el);
    },
    // 登录用户名密码写死，初始化从登录接口获取初始中心点经纬度、并设置层级。等登录页面完成后再改这块逻辑
    loginAndSetCenter() {
      const longitude = document.cookie.match(/longitude=([^;]*)/)?.[1];
      const latitude = document.cookie.match(/latitude=([^;]*)/)?.[1];
      (window as any).map.setCentent(
        {
          longitude,
          latitude,
        },
        14,
      );
    },
  },
  setup(){
    const { connectMq } = FlightPatrolScript();
    onMounted(() => {
      connectMq();
    });
  },
  beforeMount() {
    (window as any).mapCoverageName = {
      mark: '落点Layer',
      event: 'eventLayer',
      vector: '其他图形Layer',
      edit: '编辑图形Layer',
      search: '搜索关键字Layer',
    };
  },
});
</script>

<style module lang="scss">
.app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
  min-height: 768px;
  max-height: 1080px;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  .FlightHeader {
    width: 100%;
    background: #050505;
  }
  :global(.visualization-header-search) {
    width: 280px;
    margin-left: 200px;
  }
  .superMap {
    height: 100%;
    border: none;
    outline: none;
    flex: 1;
  }
  .btnStyle {
    position: absolute;
    top: 60px;
    left: 60px;
    z-index: 9;
  }
}
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}
.left-module-wrap {
  position: absolute;
  top: 74px;
  left: 0;
  height: calc(100% - 84px);
  & > aside {
    position: relative;
    height: 100%;
    padding-left: 10px;
    display: flex;
  }
}
:global(#rightContainer) {
  position: absolute;
  bottom: 0;
  right: 0;
  height: calc(100vh - 74px);
  padding-right: 10px;
  display: flex;
  align-items: flex-start;
}
</style>
