<template>
  <div :class="$style.container">
    <!-- 1. 搜索框 -->
    <Search
      v-model="searchKeyword"
      style="width: 100%; margin: 10px 0; background: rgba(41, 47, 48, .77);"
      placeholder="请输入会议标题检索"
      @change="handleSearch"
    />
    <!-- 2. 会议历史记录列表 -->
    <ul
      v-if="historyList?.length"
      :class="$style.historyList"
      @scroll="handleScroll"
    >
      <li
        v-for="history in historyList"
        :key="history.id"
        :class="[
          $style.historyItem,
          {
            [$style.historyItemActive]:
              activeHistoryItem?.id
              && activeHistoryItem?.id === history.id,
          },
        ]"
        @click="activeHistoryItem = history"
      >
        <!-- 2-1. 会议标题 -->
        <h4>{{ history.title || '暂无标题' }}（{{ history.memberNum || 0 }}人）</h4>
        <!-- 2-2. 开始时间与持续时间 -->
        <p>
          <span>{{ history.startTime || '-' }}</span>
          <span>{{ formatDuration(history.duration) }}</span>
        </p>
        <!-- 2-3. 会议状态 -->
        <div
          v-if="history.meetingStatus === 0"
          :class="$style.meetingEnded"
        >
          已结束
        </div>
        <div v-else-if="history.meetingStatus === 1">
          会议中
        </div>
      </li>
    </ul>
    <EmptyHint
      v-else
      style="height: calc(100% - 58px);"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  onMounted,
  toRefs,
  getCurrentInstance,
  inject,
  Ref,
  watch,
} from 'vue';
import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue';
// 暂无数据提示
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
import { formatDuration } from '../../scripts/utils';

export default defineComponent({
  components: {
    Search,
    EmptyHint,
  },
  emits: [
    'change',
  ],
  setup(props, { emit }) {
    const { $http, $message }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const isLoading = inject<Ref<number>>('isLoading');
    const state = reactive({
      // 搜索关键词
      searchKeyword: '',
      // 历史记录列表
      historyList: [] as any[],
      // 当前页码
      pageIndex: 1,
      // 最大页数，用来判断滚动到底时是否继续请求数据
      maxPage: 1,
      // 点击选中的历史记录
      activeHistoryItem: null,
    });
    // 获取历史记录列表数据
    function getHistoryList() {
      isLoading!.value += 1;
      const request = {
        method: 'post',
        service: 'flight',
        url: '/meeting/csMeetingRecord/list',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          title: state.searchKeyword,
          currPage: state.pageIndex,
          pageSize: 10,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0 && response.data?.page) {
          // 坐席信息
          const seatInformation = JSON.parse(decodeURIComponent(
            document.cookie.match(
              /seatInformation=([^;]*)/,
            )?.[1]
            ?? '',
          ));
          const result = response.data.page.list?.filter((record: any) => {
            // 无论坐席，已结束会议全显示
            if (record.meetingStatus === 0) return true;
            // 只显示**当前坐席的会议中**的数据
            if (
              record.meetingStatus === 1
              // 根据坐席号筛选数据
              // TODO: 当前使用电话坐席，以后可能会修改
              && record.seatCode === seatInformation?.phoneSeatNumber
            ) return true;
            return false;
          }) || [];
          state.historyList.push(...result);
          state.maxPage = response.data.page.totalPage || 1;
          // 初始化时自动点选第一条数据
          if (state.activeHistoryItem === null) {
            state.activeHistoryItem = state.historyList?.[0] || null;
          }
          // 当第一页的数据全部都是会议中且非当前坐席时，会导致列表为空，且无法触发滚动刷新
          // 因此判断空列表时，如果还没到最后一页，主动加载
          if (state.historyList.length === 0 && state.pageIndex < state.maxPage) {
            state.pageIndex += 1;
            getHistoryList();
          }
        } else {
          $message.error(`获取会议记录失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取会议记录失败，错误信息：${error}`);
      }).finally(() => {
        isLoading!.value -= 1;
      });
    }
    // 滚动到底请求更多数据
    function handleScroll(e: Event) {
      const dom = e.target as HTMLElement;
      if (
        isLoading!.value === 0
        && state.pageIndex < state.maxPage
        && dom.scrollHeight - dom.scrollTop === dom.clientHeight
      ) {
        state.pageIndex += 1;
        getHistoryList();
      }
    }
    // 执行搜索
    function handleSearch() {
      state.pageIndex = 1;
      state.maxPage = 1;
      state.historyList = [];
      getHistoryList();
    }
    // 点击历史记录时通知父组件，请求详情
    watch(() => state.activeHistoryItem, (newVal) => {
      emit('change', newVal);
    });
    onMounted(() => {
      getHistoryList();
    });
    return {
      ...toRefs(state),
      handleScroll,
      handleSearch,
      formatDuration,
    };
  },
});
</script>

<style lang="scss" module src="./styles/HistoryList.scss" />
