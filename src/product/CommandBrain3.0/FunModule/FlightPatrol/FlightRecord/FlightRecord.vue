<template>
  <div
    v-show="!clickedItem"
    v-loading="isLoading"
    class="flight-record"
  >
    <header>
      <!-- 日期选择器 -->
      <DatePicker
        v-model="dateTime"
        @change="handleSearch"
      />
      <!-- 搜索框 -->
      <Search
        v-model.lazy="keyword"
        style="margin-left: 10px; width: 213px;"
        @change="handleSearch"
      />
    </header>
    <main @scroll.prevent="handleScroll">
      <ul>
        <!-- 列表项 -->
        <li
          v-for="(item, index) in listData"
          :key="index"
          @click="clickedItem = item"
        >
          <!-- 标题 -->
          <h4 :title="item?.name">
            {{ item?.name || '-' }}
          </h4>
          <!-- 时间 -->
          <p>
            <label>飞巡时间：</label>
            <span>{{ item?.beginTime || '-' }} - {{ item?.endTime || '-' }}</span>
          </p>
          <!-- 时长 -->
          <p>
            <label>巡查时长：</label>
            <span>{{ calculateDuration(item?.beginTime, item?.endTime) }}</span>
          </p>
        </li>
      </ul>
    </main>
  </div>
  <FlightRecordDetail
    v-if="clickedItem"
    :group-item="clickedItem"
    @go-back="clickedItem = null;"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DatePicker from '@/product/CommandBrain3.0/Generalparts/right/DatePicker/DatePicker.vue';
import Search from '@/product/CommandBrain3.0/Generalparts/right/Search/Search.vue';
import FlightRecordDetail from './FlightRecordDetail/FlightRecordDetail.vue';

export default defineComponent({
  name: 'FlightRecord',
  components: {
    // 日期选择器
    DatePicker,
    // 搜索输入框
    Search,
    // 详情页面
    FlightRecordDetail,
  },
  data() {
    return {
      // 主页
      isHomePage: true,
      // 列表数据
      listData: [],
      // 搜索关键词
      keyword: '',
      // 日期
      dateTime: '',
      // 正在载入
      isLoading: false,
      // 当前第几页
      currentPageIndex: 1,
      // 总共多少页
      totalPageCount: 1,
      // 点击的项目
      clickedItem: null,
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    getListData() {
      const request = {
        method: 'get',
        service: 'flight',
        url: '/device/appbrowselog/list',
        params: {
          limit: 10,
          key: this.keyword,
          date: this.dateTime,
          page: this.currentPageIndex,
        },
      };
      this.isLoading = true;
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0 && response?.data?.list?.list) {
          const dataSegments: any[] = response.data.list.list;
          (this.listData as any[]).push(...dataSegments);
          this.totalPageCount = response.data.list.totalPage;
        } else {
          (this as any).$message.error(`获取飞巡记录失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        (this as any).$message.error(`获取飞巡记录失败，错误信息：${error}`);
      }).finally(() => {
        this.isLoading = false;
      });
    },
    /**
     * 列表滚动到底时更新
     */
    handleScroll(event: Event): void {
      const DOM: HTMLElement = event.target as HTMLElement;
      if (DOM.clientHeight + DOM.scrollTop === DOM.scrollHeight) {
        if (this.currentPageIndex < this.totalPageCount) {
          this.currentPageIndex += 1;
          this.getListData();
        }
      }
    },
    /**
     * 筛选条件更改时请求数据
     */
    handleSearch() {
      this.currentPageIndex = 1;
      this.totalPageCount = 1;
      this.listData = [];
      this.getListData();
    },
    /**
     * 计算持续时间
     *
     * @param {String} start 开始时间
     * @param {String} end 结束时间
     */
    calculateDuration(start: string, end: string) {
      if (!start || !end) {
        return '-';
      }
      const startTime = new Date(start);
      const endTime = new Date(end);
      const div = endTime.getTime() - startTime.getTime();
      const seconds = Math.floor(div / 1000) % 60;
      const minutes = Math.floor(div / 1000 / 60) % 60;
      const hours = Math.floor(div / 1000 / 60 / 60) % 60;
      return `${hours}时${minutes}分${seconds}秒`;
    },
  },
});
</script>

<style lang="scss">
.flight-record {
  height: 100%;
  display: flex;
  flex-direction: column;
  // 顶部筛选栏
  & > header {
    padding: 10px;
  }
  // 列表内容
  & > main {
    height: calc(100% - 68px);
    flex: 1;
    overflow: hidden auto;
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
    & > ul {
      list-style: none;
      margin: 0;
      padding: 0;
      // 列表项
      & > li {
        background: linear-gradient(90deg, rgba(0, 193, 222, .3) 0%, rgba(24, 38, 50, 0) 100%);
        margin: 0 10px 10px;
        padding: 9px 7px;
        color: #FFFFFF;
        position: relative;
        cursor: pointer;
        &:hover {
          border-left: 2px solid #56E9FF;
          padding-left: 5px;
          background: linear-gradient(90deg, rgba(0, 193, 222, .7) 0%, rgba(24, 38, 50, 0) 100%);
        }
        // 标题
        & > h4 {
          color: #00ECFF;
          font-size: 18px;
          font-weight: 500;
          margin: 0 0 10px 0;
          padding: 0;
        }
        // 时间和时长
        & > p {
          margin: 0;
          padding: 0;
          white-space: nowrap;
          & > label {
            font-weight: 400;
          }
          & > span {
            font-weight: 500;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
