<!-- 视图入口：通讯调度 —— 电话 -->
<template>
  <div class="communication-dispatch-phone">
    <!-- 左边 -->
    <LeftModule
      :phoneHistoryList="phoneHistoryList"
      :eventPhoneCount="eventPhoneCount"
      :loading="leftModuleLoading"
      :noMore="leftModuleNoMore"
      @switchTab="handleSwitchTab"
      @handleSearch="handleSearch"
      @handleSelectedHistory="handleSelectedHistory"
      @loadMore="leftModuleLoadMore"
    />

    <!-- 右边 -->
    <RightModule
      :contactorPhoneHistoryList="contactorPhoneHistoryList"
      :showAudio="callType === '联系人' ? false : true"
      :selectedHistory="selectedHistory"
      :historyCounts="historyCounts"
      :loading="rightModuleLoading"
      :noMore="rightModuleNoMore"
      @update="handleUpdateHistoryData"
      @handleSwitchHistoryType="handleSwitchHistoryType"
      @loadMore="rightModuleLoadMore"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  reactive,
  onMounted,
  watch,
  onUnmounted,
  onBeforeUnmount,
  provide,
} from 'vue';
import LeftModule from './components/LeftModule/LeftModule.vue';
import RightModule from './components/RightModule/RightModule.vue';
import $phone from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Phone/script/phone';
import $time from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Phone/assets/js/time';
// import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'CommunicationPhone',
  components: {
    LeftModule,
    RightModule,
  },
  emits: {},
  computed: {
    eventId() {
      return (this as any).$store.state.event?.id;
    },
  },
  watch: {
    eventId: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.initData(); // 数据初始化
          this.getPhoneHistory();
          this.getEventPhoneCount();
        }
      },
    },
  },
  setup() {
    const { $http, $message, $ws }: any =
      getCurrentInstance()?.appContext.config.globalProperties;
    const store = useStore();
    // 已选中的历史记录
    const selectedHistory: any = ref({});
    // 格式化的时间格式
    const fmt = 'yyyy/MM/dd hh:mm';
    // 电话历史列表
    const phoneHistoryList = ref([]);
    // 电话类型
    const callType = ref('');
    // 搜索关键字
    const searchText = ref('');
    // 左边 页数
    const leftModulePage = ref(1);
    // 左边 每页条数
    const leftModuleSize = ref(10);
    // 左边 总页数
    const leftModuleTotalPage = ref(0);
    // 左边 总数据量
    const leftModuleTotalElements = ref(0);
    // 左边 加载中
    const leftModuleLoading = ref(false);
    // 左边 没有更多了
    const leftModuleNoMore = ref(false);

    // 是否聚合联系人 搜索联系人时使用
    const isGroupBy = ref(false);
    // 当前选中电话历史电话号码
    const phoneNumber = ref('');
    // 当前选中电话历史Id
    const historyId = ref('');
    // 电话数量
    const eventPhoneCount = ref({});
    // 右边-选中联系人的电话记录
    const contactorPhoneHistoryList = ref([]);
    // 右边-选中联系人的电话记录数量
    const historyCounts = ref([
      {
        type: 'all',
        name: '全部',
        count: 0,
      },
      {
        type: 'answered',
        name: '已接',
        count: 0,
      },
      {
        type: 'unanswer',
        name: '未接',
        count: 0,
      },
      {
        type: 'out',
        name: '呼出',
        count: 0,
      },
    ]);
    // 右边 页数
    const rightModulePage = ref(1);
    // 右边 每页条数
    const rightModuleSize = ref(10);
    // 右边 总页数
    const rightModuleTotalPage = ref(0);
    // 右边 总数据量
    const rightModuleTotalElements = ref(0);
    const rightModuleCallType = ref('');
    // 右边 加载中
    const rightModuleLoading = ref(false);
    // 右边 没有更多了
    const rightModuleNoMore = ref(false);
    const mqConfig = {
      subscribe: '/topic/phoneHistory/dynamic',
    };
    /** ------------------ 左边模块的方法 start -------------------------- */

    /**
     * @description 搜索框内容改变触发
     */
    function handleSearch(val: string) {
      searchText.value = val;
      initData(); // 数据初始化
      getPhoneHistory();
      getEventPhoneCount();
    }

    /**
     * @description 处理历史数据
     */
    function handleHistoryData(res: any) {
      let result = ref(res);
      if (result.value.length > 0) {
        result.value.forEach((item: any) => {
          // 开始时间
          item.startTime = $time.formatDate(fmt, item.startTime);

          // 时长
          if (item.diffTime) {
            item.diffTime = $time.formateTime(item.diffTime);
          }
        });

        return result.value;
      } else {
        result.value = [];
        return result.value;
      }
    }

    /**
     * @description 获取历史记录
     */
    function getPhoneHistory() {
      leftModuleLoading.value = true;
      let data = ref(new FormData());
      // 事件id
      data.value.append('eventId', store.state.event?.id.toString());
      // 呼叫类型中文
      data.value.append(
        'vcDirect',
        callType.value === '联系人' ? '' : callType.value,
      );
      // 搜索内容
      data.value.append('searchText', searchText.value);
      // 是否聚合联系人
      data.value.append('isGroupBy', isGroupBy.value.toString());
      // 第几页
      data.value.append('page', leftModulePage.value.toString());
      // 每页多少数据
      data.value.append('size', leftModuleSize.value.toString());
      $phone.getPhoneHistory(
        $http,
        data.value,
        getPhoneHistorySuccess,
        getPhoneHistoryError,
      );
    }

    /**
     * @description 数据初始化
     */
    function initData() {
      leftModulePage.value = 1;
      leftModuleTotalElements.value = 0;
      leftModuleTotalPage.value = 0;

      rightModulePage.value = 1;
      rightModuleTotalElements.value = 0;
      rightModuleTotalPage.value = 0;

      phoneHistoryList.value = [];
      contactorPhoneHistoryList.value = [];
    }

    /**
     * @param {string} type 电话类型
     * @description 切换tabs
     */
    function handleSwitchTab(type: string) {
      callType.value = type; // 电话类型
      isGroupBy.value = type === '联系人' ? true : false;
      initData(); // 数据初始化
      getPhoneHistory();
      getEventPhoneCount();
    }

    /**
     * @description 获取电话历史记录成功
     */
    function getPhoneHistorySuccess(res: any) {
      leftModuleLoading.value = false;

      // 处理数据
      let result = ref(handleHistoryData(res.data.data));

      // 总页数
      leftModuleTotalPage.value = res.data.totalPages;
      // 总数据
      leftModuleTotalElements.value = res.data.totalElements;
      if (result.value.length > 0) {
        // 左边-通话历史记录
        phoneHistoryList.value = phoneHistoryList.value.concat(result.value);
        // 默认选中第一个
        if (leftModulePage.value === 1) {
          handleSelectedHistory(phoneHistoryList.value[0]);
        }
      } else {
        phoneHistoryList.value = []; // 左右-通话历史记录
        for (let key in selectedHistory.value) {
          delete selectedHistory.value[key];
        }
      }
    }

    /**
     * @description 获取电话历史记录失败
     */
    function getPhoneHistoryError(error: any) {
      leftModuleLoading.value = false;
      if (error.errorcode) {
        $message.error(
          `获取电话历史记录失败，错误代码${error.errorcode}，错误信息：${error.msg}`,
        );
      }
      phoneHistoryList.value = [];
      for (let key in selectedHistory.value) {
        delete selectedHistory.value[key];
      }
    }

    /**
     * @description 获取电话历史记录数量
     */
    function getEventPhoneCount() {
      $phone.getEventPhoneCount(
        $http,
        store.state.event?.id,
        getEventPhoneCountSuccess,
        getEventPhoneCountError,
      );
    }

    /**
     * @description 获取电话历史记录数量成功
     */
    function getEventPhoneCountSuccess(res: any) {
      Object.assign(eventPhoneCount.value, res.data);
    }

    /**
     * @description 获取电话历史记录数量失败
     */
    function getEventPhoneCountError(error: any) {
      console.log(error);
      if (error.errorcode) {
        $message.error(
          `获取电话历史记录数量失败，错误代码${error.errorcode}，错误信息：${error.msg}`,
        );
      }
    }

    /**
     * @description 当前选中的电话历史
     */
    function handleSelectedHistory(history: any) {
      // todo: 根据类型判断
      phoneNumber.value = history.call;
      historyId.value = history.id;
      Object.assign(selectedHistory.value, history);

      // 数据初始化
      rightModulePage.value = 1;
      rightModuleTotalElements.value = 0;
      rightModuleTotalPage.value = 0;
      rightModuleCallType.value = '';
      contactorPhoneHistoryList.value = [];

      getContactorPhoneHistory(rightModuleCallType.value);
    }

    /** ------------------ 左边模块的方法 end -------------------------- */

    /** ------------------ 右边模块的方法 start -------------------------- */
    /**
     * @param {string} callType 电话历史类型：已接、未接、呼出
     * @description 获取联系人电话历史记录
     */
    function getContactorPhoneHistory(callType: string) {
      rightModuleLoading.value = true;
      let data = ref(new FormData());
      // 通话号码
      data.value.append('phoneNumber', phoneNumber.value);
      // 事件id
      data.value.append('eventId', store.state.event?.id.toString());
      // 呼叫类型中文
      data.value.append('vcDirect', callType ? callType : '');
      // 搜索内容
      data.value.append('searchText', searchText.value);
      // 是否聚合联系人
      data.value.append('isGroupBy', 'false');
      // 第几页
      data.value.append('page', rightModulePage.value.toString());
      // 每页多少数据
      data.value.append('size', rightModuleSize.value.toString());
      $phone.getPhoneHistory(
        $http,
        data.value,
        getContactorPhoneHistorySuccess,
        getContactorPhoneHistoryError,
      );
    }

    /**
     * @description 获取联系人电话历史记录成功
     */
    function getContactorPhoneHistorySuccess(res: any) {
      rightModuleLoading.value = false;
      // 处理数据
      let result = ref(handleHistoryData(res.data.data));
      // 总页数
      rightModuleTotalPage.value = res.data.totalPages;
      // 总数据
      rightModuleTotalElements.value = res.data.totalElements;
      if (result.value.length > 0) {
        contactorPhoneHistoryList.value =
          contactorPhoneHistoryList.value.concat(result.value);
      } else {
        contactorPhoneHistoryList.value = [];
      }
      if (res.data.counts) {
        // 右边-选中联系人的电话记录数量
        for (var key in res.data.counts) {
          historyCounts.value.map((item: any) => {
            if (item.type === key) {
              item.count = res.data.counts[key];
            }
          });
        }
      }
    }

    /**
     * @description 获取电话历史记录失败
     */
    function getContactorPhoneHistoryError(error: any) {
      if (error.errorcode) {
        $message.error(
          `获取电话历史记录失败，错误代码${error.errorcode}，错误信息：${error.msg}`,
        );
      }
      contactorPhoneHistoryList.value = [];
      rightModuleLoading.value = false;
    }

    /**
     * @description 右边-联系人电话历史记录
     */
    function handleSwitchHistoryType(item: any) {
      // 第几页
      rightModulePage.value = 1;
      // 每页多少数据
      rightModuleSize.value = 10;
      // 清空数据
      contactorPhoneHistoryList.value = [];
      rightModuleCallType.value = item.name === '全部' ? '' : item.name;
      getContactorPhoneHistory(rightModuleCallType.value);
    }

    /**
     * @description 左边-加载更多
     */
    function leftModuleLoadMore() {
      if (
        leftModulePage.value >= leftModuleTotalPage.value ||
        phoneHistoryList.value.length === leftModuleTotalElements.value
      ) {
        leftModuleNoMore.value = true;
      } else {
        leftModulePage.value++;
        getPhoneHistory();
        getEventPhoneCount();
      }
    }

    /**
     * @description 右边-加载更多
     */
    function rightModuleLoadMore() {
      if (
        rightModulePage.value >= rightModuleTotalPage.value ||
        contactorPhoneHistoryList.value.length ===
          rightModuleTotalElements.value
      ) {
        rightModuleNoMore.value = true;
      } else {
        rightModulePage.value++;
        getContactorPhoneHistory(rightModuleCallType.value);
      }
    }

    /** ------------------ 右边模块的方法 end -------------------------- */

    /**
     * @description 更新数据
     */
    function handleUpdateHistoryData(obj: any) {
      if (obj.id == selectedHistory.value.id) {
        selectedHistory.value.remark = obj.txt;
      }
      contactorPhoneHistoryList.value.forEach((el: any) => {
        if (el.id == obj.id) {
          el.remark = obj.txt;
        }
      });
    }

    /**
     * @description 拿到消息后的回调
     */
    function websocketCallback(msg: any, params: any) {
      let result = JSON.parse(params.body);
      let data = ref({}); // 数据
      console.log('websocket回调：', result);
      getPhoneHistory();
      getEventPhoneCount();
    }

    let un: () => void;
    onMounted(() => {
      getPhoneHistory();
      getEventPhoneCount();
      un = $ws.subscribe('/topic/phoneHistory/dynamic', websocketCallback);
    });
    onBeforeUnmount(() => {
      un(); // 离开页面要退出websocket链接
    });

    return {
      searchText,
      callType,
      phoneHistoryList,
      handleSwitchTab,
      getContactorPhoneHistory,
      handleSearch,
      eventPhoneCount,
      handleSelectedHistory,
      contactorPhoneHistoryList,
      selectedHistory,
      historyCounts,
      handleSwitchHistoryType,
      leftModuleLoadMore,
      rightModuleLoadMore,
      rightModuleLoading,
      leftModuleLoading,
      rightModuleNoMore,
      leftModuleNoMore,
      handleUpdateHistoryData,
      getPhoneHistory,
      getEventPhoneCount,
      initData,
    };
  },
});
</script>

<style lang="scss">
.communication-dispatch-phone {
  display: flex;
  height: 100%;
  position: relative;
}
</style>
