// 协同标绘首页
<template>
  <div class="plottingIndex">
    <header class="plottingIndex__header">
      <div class="plottingIndex__header__title">
        协作标绘
      </div>
      <div class="plottingIndex__header__admin" />
    </header>
    <main class="plottingIndex__main">
      <div class="plottingIndex__main__tab">
        <div class="plottingIndex__main__tab__boxs">
          <div
            class="plottingIndex__tabitem"
            :class="{ 'plottingIndex__tabitem--active': panelId === 1 }"
            @click="getMapList(1)"
          >
            我的地图
          </div>
          <div
            class="plottingIndex__tabitem"
            :class="{ 'plottingIndex__tabitem--active': panelId === 2 }"
            @click="getMapList(2)"
          >
            协作地图
          </div>
          <div
            class="plottingIndex__tabitem"
            :class="{ 'plottingIndex__tabitem--active': panelId === 3 }"
            @click="getMapList(3)"
          >
            收到的地图
          </div>
          <div
            class="plottingIndex__tabitem"
            :class="{ 'plottingIndex__tabitem--active': panelId === 4 }"
            style="opacity: 0"
            @click="panelId = 4"
          >
            回收站
          </div>
        </div>
        <div class="plottingIndex__main__tab__adminBox">
          <ElInput
            v-model="searchValue"
            class="sv-input--search"
            placeholder="请输入地图名称"
            clearable
            style="width: 180px"
            suffix-icon="el-icon-search"
            @change="searchMap"
          />
          <div
            v-if="isAdmin === 1"
            class="plottingIndex__adminBox__adminName"
            @click="openBaseClassPop"
          >
            基础分类管理
          </div>
          <div
            class="plottingIndex__adminBox__adminName"
            @click="openClassPop"
          >
            分类管理
          </div>
          <div
            class="plottingIndex__adminBox__adminName"
            @click="openTempPop"
          >
            模板管理
          </div>
        </div>
      </div>
      <div class="plottingIndex__main__content">
        <!-- 我的地图 -->
        <template v-if="panelId === 1">
          <transition-group
            name="more"
            :css="false"
            @before-enter="beforeEnter"
            @enter="enter"
          >
            <Mapcard
              v-for="(item, index) in mapListData"
              :key="index"
              :mapdata="item"
              :data-index="index"
              :type="'old'"
              @changeList="getMapList(1)"
              @refresh="refresh"
            />
          </transition-group>
        </template>
        <!-- 协作地图 -->
        <template v-if="panelId === 2">
          <transition-group
            name="more"
            :css="false"
            @before-enter="beforeEnter"
            @enter="enter"
          >
            <Mapcard
              v-for="(item, index) in mapListData"
              :key="index"
              :mapdata="item"
              :type="'coop'"
              @changeList="getMapList(2)"
              @refresh="refresh"
              @refreshcoop="refreshcoop"
            />
          </transition-group>
        </template>
        <!-- 分享给我的地图 -->
        <template v-if="panelId === 3">
          <transition-group
            name="more"
            :css="false"
            @before-enter="beforeEnter"
            @enter="enter"
          >
            <Mapcard
              v-for="(item, index) in mapListData"
              :key="index"
              :mapdata="item"
              :type="'share'"
              @changeList="getMapList(3)"
              @refresh="refresh"
              @refreshshare="refreshshare"
            />
          </transition-group>
        </template>
      </div>
      <!-- 分页 -->
      <div class="plottingIndex__main__page">
        <el-pagination
          background
          :page-sizes="[20, 30, 40]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNums"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 新建地图 -->
      <div
        v-if="panelId === 1"
        class="plottingIndex__main__new"
        @click="openPop"
      >
        <div class="plottingIndex__main__new__text">
          新建地图
        </div>
      </div>
    </main>
  </div>
  <ClassificationManagement ref="classTypeRef" />
  <TemplateManagement ref="tempTypeRef" />
  <WsMessage
    ref="WsMessageRef"
    :to-path="'/plottingIndex'"
    :content="wsMessageContent"
    :map-id="wsMessageId"
  />
  <!-- 新增地图 -->
  <MessageTip
    ref="MessageTipRef"
    @refresh="refresh"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import ClassificationManagement from '@/product/Coplotting/module/ClassificationManagement/ClassificationManagement.vue'; // 分类管理弹窗
import TemplateManagement from '@/product/Coplotting/module/TemplateManagement/TemplateManagement.vue'; // 模板管理弹窗
import WsMessage from '@/product/Coplotting/module/components/WsMessage.vue'; // 消息弹窗
import utilFun from '@/product/Coplotting/module/ShareSection/script/useSlideList'; // 动态列表
import Cookies from 'js-cookie';
import Mapcard from '../components/MapCard.vue'; // 地图卡片
import MessageTip from '../components/Message.vue'; // 新增弹窗
import usePageFun from './script/page'; // 分页

// websocket
const connectWebsocket = require('@/product/Coplotting/mainCapacity/websocket/websocket').default;

export default defineComponent({
  name: 'PlottingIndex',
  components: {
    Mapcard, // 地图卡片
    ClassificationManagement, // 分类管理弹窗
    TemplateManagement, // 模板管理弹窗
    WsMessage, // 消息弹窗
    MessageTip, // 新增窗口
  },
  setup() {
    const classTypeRef = ref<null>(null); // 分类管理弹窗
    const tempTypeRef = ref<null>(null); // 模板管理弹窗
    const wsMessageContent = ref(''); // 消息内容
    const WsMessageRef = ref<null>(null);
    const store = useStore(); // 使用vuex
    const route = useRoute();
    const isAdmin = ref(0); // 当前登录用户是否是超管
    const MessageTipRef = ref<null>(null); // 新增地图弹窗
    // 列表动画
    const { beforeEnter, enter } = utilFun();
    // 分页
    const {
      handleCurrentChange,
      handleSizeChange,
      getMapList,
      totalNums,
      searchValue,
      panelId,
      mapListData,
    } = usePageFun();
    // 打开分类管理
    function openClassPop() {
      if (classTypeRef.value) {
        (classTypeRef.value as any).open();
      }
    }
    // 打开基础分类管理
    function openBaseClassPop() {
      if (classTypeRef.value) {
        (classTypeRef.value as any).open(true);
      }
    }
    // 打开模板管理
    function openTempPop() {
      if (tempTypeRef.value) {
        (tempTypeRef.value as any).open();
      }
    }
    // 刷新当前页面
    function refresh() {
      getMapList(1);
    }
    // 刷新协作页面
    function refreshcoop() {
      getMapList(2);
    }
    // 刷新分享页面
    function refreshshare() {
      getMapList(3);
    }
    // 搜索地图
    function searchMap() {
      getMapList(panelId.value);
    }
    // 打开新增地图
    function openPop() {
      if (MessageTipRef.value) {
        (MessageTipRef.value as any).open();
        (MessageTipRef.value as any).inputValue = '';
      }
    }
    // socket回调
    const wsMessageId = ref(0);
    function websocketCallback(params: any) {
      const result: any = JSON.parse(params.body);
      console.log('获得的数据', result);
      if (result.msgType === 3002) {
        // 刷新分组
        store.commit('coplotting/SET_REFRASHGROUP', true);
        // 刷新协作
        store.commit('coplotting/SET_REFRASHCOOP', true);
      } else if (result.msgType === 3001) {
        wsMessageContent.value = JSON.parse(result.content).msg;
        wsMessageId.value = JSON.parse(result.content).mapId;
        if (WsMessageRef.value) {
          (WsMessageRef.value as any).open();
        }
      }
    }
    onMounted(() => {
      // 嵌套在app时的判断
      console.log(document.cookie.match(/token=([^;]*)/), '设置前的token');
      if ((window as any).codraw) {
        const tokenValue = (window as any).codraw.getToken();
        (window as any).TOKEN = tokenValue;
        Cookies.set('token', tokenValue);
        console.log(document.cookie.match(/token=([^;]*)/), '获取到的token');
        console.log((window as any).TOKEN, '获取到的token');
      }
      connectWebsocket.connect(websocketCallback); // 链接websocket
      isAdmin.value = Number(document.cookie.match(/isAdmin=([^;]*)/)?.[1]) || 0;
      if (route.query.type) {
        switch (route.query.type) {
          case 'old':
            getMapList(1);
            break;
            case 'coop':
            getMapList(2);
            break;
            case 'share':
            getMapList(3);
            break;
          default:
            getMapList(1); // 默认加载我的地图列表
            break;
        }
      } else {
        getMapList(1); // 默认加载我的地图列表
      }
    });
    return {
      mapListData,
      getMapList,
      openClassPop,
      openTempPop,
      classTypeRef,
      tempTypeRef,
      openBaseClassPop,
      refresh,
      refreshcoop,
      searchValue,
      searchMap,
      panelId,
      wsMessageContent, // 消息内容
      WsMessageRef,
      wsMessageId,
      isAdmin,
      refreshshare,
      beforeEnter,
      enter,
      handleSizeChange,
      handleCurrentChange,
      totalNums,
      openPop,
      MessageTipRef,
    };
  },
});
</script>
<style lang="scss" src="./style/style.scss">
</style>
