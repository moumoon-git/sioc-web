<template>
  <div style="width: 400px; height: 90vh; position: relative;">
    <header :class="$style.headerStyle">
      <p :class="$style.headerText">
        消息({{ msgList.length }})
      </p>
      <p
        :class="$style.headerRight"
        @click="closeAll"
      >
        全部清除
      </p>
    </header>
    <main :class="$style.scroll">
      <div
        v-for="(item, index) in msgList"
        :key="index"
      >
        <Mini
          :item="item"
          @handleClick="handleClick(item)"
          @closeOne="closeOne(item)"
        />
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
  inject,
} from 'vue';
import Mini from './components/Mini.vue'; // 事件接报
import Detail from './components/Detail.vue'; // 应急响应

export default defineComponent({
  name: 'Summary',
  components: {
    Mini,
  },
  inject: [
    '$addDialog',
  ],
  setup(props, context) {
    const msgList: any = ref([]); // 列表
    const { $http, $message, $ws }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const addDialog = inject<any>('$addDialog');
    const init = () => {
      const request = {
        method: 'post',
        url: '/event/info/getEventInfoReportMessage',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
        },
      };
      $http(request).then((response: any) => {
        if (response) {
          msgList.value = response?.data || [];
        }
      });
    };
    const handleClick = (item: any) => {
      const request = {
        method: 'post',
        url: '/event/info/getDetail',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: item.eventInfoId,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0 || response.code === 0) {
          if (addDialog) {
            addDialog(item.title, Detail, { item: response.data });
          }
        }
      });
    };
    const closeAll = () => {
      const request = {
        method: 'post',
        url: '/event/info/removeAllMessage',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0 || response.code === 0) {
          $message.success('删除成功');
          init();
        }
      });
    };
    const closeOne = (item: any) => {
      const request = {
        method: 'post',
        url: '/event/info/removeMessage',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          type: item.type,
          [item.type ? 'supplementId' : 'eventInfoId']: item.eventInfoId,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0 || response.code === 0) {
          $message.success('删除成功');
          init();
        }
      });
    };
    let un: () => void;
    onMounted(() => {
      init();
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
        $ws.whenConnected().then(() => {
          un = $ws.subscribe(
            `/platform/${str}/message`,
            (result: any) => {
              if (Number(result?.msgType) === 60003) {
                init();
              }
            },
          );
        });
      }
    });
    onBeforeUnmount(() => {
      un(); // 退出websocket
      (window as any).map.clearAtPresentMarkData('MsgMarker');
      (window as any).map.clearDeleteCoverage('MsgMarker');
    });
    return {
      init,
      msgList,
      handleClick,
      closeOne,
      closeAll,
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
    .headerText {
      position: relative;
      float: left;
      margin: 10px 0px 0px 20px;
      font-size: 18px;
    }
    .headerRight {
      position: relative;
      float: right;
      margin: 14px 10px 0px 0px;
      color: #32C5FF;
      cursor: pointer;
    }
  }
  .scroll {
    color: #FFFFFF;
    width: 100%;
    height: 83vh;
    overflow: auto;
    float: left;
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
