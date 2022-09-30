<!-- 任务详情 视图总入口 -->
<template>
  <div class="task-details-module">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" />
    <!-- 导航栏 -->
    <!-- <van-nav-bar :title="navBarTitle" left-arrow @click-left="handleClickLeft"> </van-nav-bar> -->

    <template v-if="!isHidePage">
      <!-- tabs页 -->
      <Tabs :active="activeNavIndex" :tabList="tabList" @handleClickTab="handleClickTab" />

      <!-- 详情信息 -->
      <TaskDetailInfo v-if="activeNavIndex === 0" :id="id" @hide="hidePage"/>

      <!-- 任务动态 -->
      <TaskDynamic v-if="activeNavIndex === 1" :id="id" @clickRead="handleClickRead" />

      <!-- 关联信息 R1版本暂不开发 -->
      <!-- <div v-if="activeNavIndex === 2"></div> -->
    </template>

    <div v-else class="page-mask">
      <div class="page-mask-text">
        非任务成员无法查看任务信息
      </div>
    </div>
    <div v-if="showReadList" class="chatRecieverList">
      <ChatRecieverList :id="chatDynamicId" @back="handleBack"/>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import TaskDetailInfo from './TaskInfomation/TaskInfoViewer.vue';
import TaskDynamic from './TaskDynamic/TaskDynamicViewer.vue';
import Tabs from '../../../generalparts/Tabs/Tabs.vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import ChatRecieverList from '@/product/SIOC-H5/module/task/TaskDetail/TaskDynamic/ChatRecieverList.vue';

export default defineComponent({
  name: 'TaskDetail',
  components: {
    TaskDetailInfo,
    TaskDynamic,
    Tabs,
    NavBar,
    ChatRecieverList,
  },
  setup() {
    // 导航栏配置
    const navBarConfig = {
      title: '任务详情',
      type: 'left',
      path: '/TaskList',
    };
    /** ---------------------- 路由的相关业务逻辑 start ------------------ **/
    const router = useRouter(); // 获取路由器实例
    const route = useRoute(); // route是响应式对象,可监控器变化
    let id = router.currentRoute.value.params.id; // 任务id
    watch(
      () => route.params,
      params => {},
    );
    // 路由守卫——离开页面触发
    onBeforeRouteLeave((to, from) => {});
    /** ---------------------- 路由的相关业务逻辑 start ------------------ **/

    // ------------------------ Tabs页面业务逻辑 start ---------------------
    const activeNavIndex = ref(0); // 当前激活的Tabs页面
    // Tabs页面菜单
    const tabList = ref([
      {
        tabName: '详情信息',
      },
      {
        tabName: '任务动态',
      },
      // {
      //   tabName: "关联信息", // R1 版本不开发
      // }
    ]);
    // 切换Tabs页面菜单
    function handleClickTab(val: any) {
      activeNavIndex.value = val;
      showReadList.value = false;
    }
    // ------------------------- Tabs页面业务逻辑 end ---------------------

    // ------------------------ 导航栏业务逻辑 start ---------------------
    const navBarTitle = '任务详情';
    /**
     * @description 点击左侧按钮时触发
     */
    function handleClickLeft() {
      router.push({
        path: '/TaskList',
      });
    }
    // ------------------------ 导航栏业务逻辑 end ---------------------
    const isHidePage = ref(false);
    /**
     * @description 隐藏页面
     */
    function hidePage() {
      isHidePage.value = true;
    }

    // 已读未读列表显隐
    const showReadList = ref(false);
    // 任务动态id
    const chatDynamicId = ref('');
    /**
     * @description 查看消息已读未读情况
     */
    function handleClickRead(id: any) {
      chatDynamicId.value = id;
      showReadList.value = true;
    }

    /**
     * @description 消息接收人列表-返回按钮触发
     */
    function handleBack() {
      showReadList.value = false;
    }
    return {
      tabList,
      activeNavIndex,
      handleClickTab,
      id,
      handleClickLeft,
      navBarTitle,
      isHidePage,
      hidePage,
      navBarConfig,
      showReadList,
      handleClickRead,
      chatDynamicId,
      handleBack,
    };
  },
});
</script>
<style lang="scss">
@import './assets/css/common'; /*引入公共样式*/
.task-details-module {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;

  // & .van-tabs {
  //   width: 100%;
  //   position: fixed;
  //   top: 0.88rem;
  //   z-index: 1;
  //   background: #ffffff;
  // }

  // & .van-nav-bar__content {
  //   width: 100%;
  //   height: 0.88rem;
  //   position: fixed;
  //   top: 0;
  //   z-index: 1;
  //   background: #ffffff;
  //   font-size: 0.32rem;

  //   .van-nav-bar__title,
  //   .van-nav-bar__text {
  //     font-size: 0.32rem;
  //   }

  //   .van-icon {
  //     font-size: 0.48rem;
  //     color: #000000;
  //   }
  // }

  .page-mask {
    padding: 0.88rem 0 1.12rem 0;
    height: calc(100vh - 0.88rem);
    font-size: 0.32rem;
    color: #000000;
    background: #F5F5F5;

    .page-mask-text {
      font-size: 0.28rem;
      color: #000000;
      margin: 0.2rem;
      height: 3rem;
      background: #ffffff;
      text-align: center;
      line-height: 3rem;
    }

  }
}

.chatRecieverList {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
}
</style>
