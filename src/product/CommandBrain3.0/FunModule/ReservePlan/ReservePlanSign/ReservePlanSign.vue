<template>
  <div style="width: 998px; height: 74vh;position:relative;">
    <div :class="$style.top">
      <div style="position: absolute;left: 20px;top: 15px;">
        签到天数: {{ signDayTimes }}
      </div>
      <!-- 签到码 -->
      <Button
        type="primary"
        style="position: absolute;right: 94px;top: 10px;"
        @click="isCode=!isCode"
      >
        签到码
      </Button>
      <div
        v-if="isCode"
        :class="$style.code"
      >
        <div style="text-align: center;margin-top: 10px;">
          签到二维码
        </div>
        <img
          :src="codePath"
          style="width: 180px; height: 180px;margin-left: 16px;margin-top: 10px;"
        >
        <Button
          type="ghost"
          style="margin-left: 56px;margin-top: 10px;"
        >
          <a
            :href="downPath"
            style="text-decoration: none;color: #00C1DE;"
          >
            下载二维码
          </a>
        </Button>
      </div>
      <!-- 导出 -->
      <Button
        type="primary"
        style="position: absolute;right: 20px;top: 10px;"
        @click="downloadCode"
      >
        导出
      </Button>
    </div>
    <!-- 左边 -->
    <div :class="$style.left">
      <ListTemple
        ref="ListTempleRef"
        :title="'签到日期'"
        :list="leftList"
        :countAll="leftList.length"
        @handleClick="handleLeftListClick"
      >
        <template #headerIcon>
          <img src="./assets/sceneSign.svg">
        </template>
      </ListTemple>
    </div>
    <!-- 右边 -->
    <div :class="$style.right">
      <!-- 资源表格 -->
      <RightExpand
        :right-list="rightList"
        :all="all"
        :has-sign="hasSign"
        :not-sign="notSign"
        :sign-rate="signRate"
        :sign-all="signAll"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  getCurrentInstance,
  onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import ListTemple from '../PublicComponents/ListTemple.vue'; // 列表模板
import RightExpand from './components/RightExpand.vue'; // 右边

export default defineComponent({
  name: 'ReservePlanSign',
  components: {
    // 按钮
    Button,
    // 列表模板
    ListTemple,
    // 右边
    RightExpand,
  },
  setup() {
    const store = useStore(); // 使用vuex
    const signDayTimes = ref(0);
    const isCode = ref(false);
    const codePath = ref('');
    const downPath = ref('');
    const leftList: any = ref([]);
    const rightList: any = ref([]);
    const {
      $downFile,
      $http,
      $message,
      $ws,
    }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const all = ref(0);
    const hasSign = ref(0);
    const notSign = ref(0);
    const signRate = ref('0%');
    const signAll = ref(0);
    const ListTempleRef = ref(null);
    // 右数据靠左得
    function handleLeftListClick(item: any) {
      const request = {
        method: 'get',
        url: '/eventconduct/eventSceneonductSign/getUnitSginList',
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          eventId: store.state.event?.id,
          dateTime: item.name,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          rightList.value = response?.data || [];
          all.value = rightList.value.length;
          hasSign.value = 0;
          signAll.value = 0;
          rightList.value.forEach((el:any) => {
            hasSign.value += el?.signNumber > 0 ? 1 : 0;
            signAll.value += el?.signNumber || 0;
          });
          notSign.value = all.value - hasSign.value;
          if (all.value > 0) signRate.value = `${String(((100 * hasSign.value) / all.value).toFixed(0))}%`;
        }
      });
    }
    // 左数据初始化
    function getLeftList() {
      const request = {
        method: 'get',
        url: '/eventconduct/eventSceneonductSign/sginDateList',
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          eventId: store.state.event?.id,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          signDayTimes.value = response.data.length;
          leftList.value = Array.from(response.data, (el: any) => ({
            name: el,
          }));
          if (response.data.length) handleLeftListClick(leftList.value[0]);
        }
      });
    }
    function downloadCode() {
      const request = {
        method: 'get',
        url: `${(window as any).config.baseURL}/ser/eventconduct/eventSceneonductSign/xlsOutput`,
        headers: {
          'Content-Type': 'application/json',
          token: (window as any).globalToken || document.cookie.match(/token=([^;]*)/)?.[1],
        },
        params: {
          eventIds: store.state.event?.id,
        },
        responseType: 'arraybuffer',
      };
      $downFile(request).then((response: any) => {
      });
    }
    let un: () => void;
    onMounted(() => {
      getLeftList(); // 左数据初始化
      // 获取二维码
      codePath.value = (window as any).config.baseURL + store.state.reservePlan?.sceneMsg?.codePath;
      downPath.value = `${(window as any).config.baseURL}/fileupload/scgMailContactor/downloadQrcode?filePath=${store.state.reservePlan?.sceneMsg?.codePath}`;
      // 建立websocket
      const seatInformation = document.cookie.match(
        /seatInformation=([^;]*)/,
      )?.[1];
      if (
        seatInformation !== 'null'
        && seatInformation !== 'undefined'
        && seatInformation
      ) {
        const str = (window as any).decodeURIComponent(seatInformation);
        const objs: any = JSON.parse(str);
        un = $ws.subscribe(
          `/platform/${objs?.platformId}/message`,
          (result: any) => {
            if (Number(result?.msgType) === 51000) {
              getLeftList(); // 左数据初始化
            }
          },
        );
      }
    });
    onBeforeUnmount(() => {
      if (un) un(); // 退出websocket
    });
    return {
      signDayTimes,
      isCode,
      leftList,
      rightList,
      all,
      hasSign,
      notSign,
      signRate,
      signAll,
      getLeftList,
      handleLeftListClick,
      codePath,
      downPath,
      downloadCode,
      ListTempleRef,
    };
  },
});
</script>

<style lang="scss" module>
  .top {
    position:relative;
    width: 100%;
    height: 52px;
    background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
    color: #FFFFFF;
    .code {
      color: #FFF;
      position: absolute;
      right: 21px;
      top: 60px;
      width: 212px;
      height: 276px;
      border: 1px solid rgba(0, 193, 222, 0.58);
      background: rgba(0, 0, 0, 1);
      z-index: 9;
    }
  }
  .left {
    left: 20px;
    top: 71px;
    width: 200px;
    height: 64vh;
    position: absolute;
    border: 1px solid rgba(0, 193, 222, 0.58);
    background: rgba(0, 0, 0, 0.29);
    img {
      width: 19px;
      height: 19px;
      position: relative;
      margin: 15px 0px 0px 10px;
      float: left;
    }
  }
  .right {
    position: absolute;
    right: 20px;
    top: 71px;
    width: 738px;
    height: 64vh;
    border: 1px solid rgba(0, 193, 222, 0.58);
    background: rgba(0, 0, 0, 0.29);
  }
</style>
