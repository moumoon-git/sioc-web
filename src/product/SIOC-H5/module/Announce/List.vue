<template>
  <!-- 列表 -->
  <div :class="$style.list">
    <!-- 横搜索框 -->
    <!-- <Search
      v-model="searchKey"
      placeholder="请输入关键字搜索"
      :class="$style.search"
      @change="SearchByKey"
    /> -->
    <!-- 竖搜索框 -->
    <Search
      ref="Search"
      v-model:modelValue="searchKey"
      :placeholder="'请输入关键字搜索'"
      :class="$style.search"
    >
      <Button
        type="primary"
        @click="SearchByKey"
      >
        搜索
      </Button>
    </Search>
    <!-- tab -->
    <van-tabs
      v-model:active="activeName"
      @click="onClickTab"
    >
      <van-tab
        :title="`全部${total}`"
        name="全部"
      />
      <van-tab
        :title="`通知${info}`"
        name="通知"
      />
      <van-tab
        :title="`公告${announce}`"
        name="公告"
      />
      <van-tab
        :title="`预警${warn}`"
        name="预警"
      />
    </van-tabs>
    <!-- loading -->
    <van-loading
      v-if="isLoading"
      color="#1989fa"
      size="60px"
      vertical
      :class="$style.loading"
    >
      努力加载中...
    </van-loading>
    <main
      v-else
      :class="$style.scroll"
    >
      <!-- 竖屏不要高亮
      :style="item?.id===currItem?.id?'background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0) 100%);':''"
      -->
      <div
        v-for="item in announceList"
        :key="item?.id"
        :class="$style.frame"
        @click="handleClick(item)"
      >
        <!-- 横屏直接用announceTitle -->
        <p
          :class="{
            [$style.announceTitle]: item?.coverImage,
            [$style.announceTitleWithNoCover]: !(item?.coverImage),
          }"
        >
          {{ item?.title || '-' }}
        </p>
        <p :class="$style.announceName">
          {{ item?.platformName || '-' }}
        </p>
        <div :class="$style.line" />
        <p :class="$style.announceTime">
          {{ item?.publishTime.substr(0,16) || '-' }}
        </p>
        <!-- 横屏不需要封面 -->
        <img
          v-if="item?.coverImage"
          :src="baseURL+item.coverImage"
          :class="$style.cover"
          :onerror="'./assets/svg/noImg.svg'"
        >
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  getCurrentInstance,
} from 'vue';
import { useRouter } from 'vue-router';
import Search from '@/product/SIOC-H5/generalparts/SearchInput/SearchInput.vue'; // 竖搜索框
// import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue'; // 横搜索框
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';

export default defineComponent({
  name: 'AnnounceList',
  components: {
    Search,
    Button,
  },
  emits: ['handleClick'],
  setup(props, { emit }) {
    const searchKey = ref(''); // 搜索
    const activeName = ref(''); // tab切换
    const announceList: any = ref([]); // 列表
    const isFirst = ref(true); // 是否第一次进来，第一次只让总列表赋值
    const total = ref(0); // 全部
    const info = ref(0); // 通知
    const announce = ref(0); // 公告
    const warn = ref(0); // 预警
    const currItem = ref(null); // 当前item
    const router = useRouter(); // 路由跳转
    const { $http, $websocket }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const baseURL = (window as any).config.baseURL;
    const isLoading = ref(true); // 是否正在加载中
    const contactorId = !!(window as any)?.task?.getIsApp() ? Number((window as any)?.task?.getUserId()) : Number(localStorage.getItem('userId')); // 登录用户Id
    // 获取列表
    function getAnnounce(type: number) {
      const request = {
        method: 'get',
        url: '/appManagement/recieve/noticeList',
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          title: searchKey.value || '', // 搜索关键字
          noticeType: type || '', // 0的时候不传0，传空
          contactorId, // 联系人id
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0 || response.errorcode === 0) {
          // 初始化且是0 或 非初始情况下
          if ((isFirst.value && !type) || (!isFirst.value)) {
            isFirst.value = false;
            announceList.value = response.page;
            isLoading.value = false;
            // 横屏会默认点击第一个
            // if (response.page.length) {
            //   // 默认点第一个
            //   handleClick(response.page[0]);
            // } else handleClick({ id: 0 });
          }
          switch (type) {
            case 1:
              info.value = response.page.length;
              break;
            case 2:
              announce.value = response.page.length;
              break;
            case 3:
              warn.value = response.page.length;
              break;
            default:
              total.value = response.page.length;
              break;
          }
        }
      });
    }
    // tab切换
    function onClickTab(name: string) {
      isLoading.value = true;
      switch (name) {
        case '通知':
          getAnnounce(1);
          break;
        case '公告':
          getAnnounce(2);
          break;
        case '预警':
          getAnnounce(3);
          break;
        default: // 全部
          getAnnounce(0);
          break;
      }
    }
    // 搜索
    function SearchByKey() {
      isFirst.value = true;
      isLoading.value = true;
      getAnnounce(3);
      getAnnounce(2);
      getAnnounce(1);
      getAnnounce(0);
      onClickTab('全部');
    }
    // 点列表某一个
    function handleClick(item: any) {
      currItem.value = item;
      // 竖屏
      router.push({
        path: `/AnnounceDetail/${item.id}`,
      });
      // 横屏
      // emit('handleClick', item);
    }
    onMounted(() => {
      SearchByKey();
      $websocket.connect([{
        subscribe: `/endpointOyzc/${localStorage.getItem('platformId')}/3ezs0bqb/websocket`,
        callback: (result: any) => {
          if (Number(result?.msgType) === 2001) {
            SearchByKey();
          }
        }, 
      }]);
    });
    return {
      searchKey,
      activeName,
      announceList,
      isFirst,
      total,
      info,
      announce,
      warn,
      currItem,
      getAnnounce,
      SearchByKey,
      onClickTab,
      handleClick,
      baseURL,
      isLoading,
      contactorId,
    };
  },
});
</script>

<style lang="scss" module>
@import './assets/css/verticalList.scss'; // 竖
// @import './assets/css/horizonList.scss'; // 横
</style>

<style lang='scss' scoped>
.van-tabs {
  :deep(.van-tabs__line) {
    // 横屏用#56E9FF  竖屏用#0091FF
    background-color: #0091FF;
  }
  :deep(.van-tab) {
    color: #666666;
    // 横屏用下面两个
    // color: #FFF;
    // background: #1D1F23;
  }
  :deep(.van-tab--active) {
    color: #333333;
  }
  // height: 100vh;
  background: #F5F5F5;
  :deep(.van-tabs__content) {
    // height: 100%;
  }
  :deep(.van-tab__pane) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
