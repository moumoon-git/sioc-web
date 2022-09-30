<template>
  <div class="search-result-container">
    <header>
      <!-- 导航栏 -->
      <NavBar :config="navBarConfig" />
      <!-- 搜索框 -->
      <Search
        ref="searchRef"
        v-model:modelValue="searchTxt"
        :placeholder="'请输入联系人姓名、单位、职务、电话关键字'"
      >
        <Button type="text" :font-size="'0.28rem'" @click="handleSearch">搜索</Button>
      </Search>
    </header>
    <!-- 主体内容 -->
    <main>
      <section class="search-record-title">
        <label class="search-record-title__label">搜索记录</label>
        <i class="search-record-title__delete" @click="showDeleteIcon"></i>
      </section>
      <ul class="search-record-content">
        <li
          v-if="searchHistory.length > 0"
          v-for="item in searchHistory"
          :key="item"
          @click="handleDelectSearchHistory(item)"
        >
          <label>{{ item }}</label>
          <i v-if="isDeleteVisible"></i>
        </li>
        <span v-else class="no-data">暂无数据</span>
      </ul>
    </main>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch, getCurrentInstance } from 'vue';
import Search from '@/product/SIOC-H5/generalparts/SearchInput/SearchInput.vue';
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';
import Contactor from '@/product/SIOC-H5/generalparts/Contactor/Contactor.vue';
import { Notify, Toast } from 'vant';
import { useStore } from 'vuex';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'SearchPage',
  components: {
    Search,
    Button,
    Contactor,
    NavBar,
  },
  setup() {
    const router = useRouter();
    const instance: any = getCurrentInstance();
    const { $http } = instance?.appContext.config.globalProperties;
    const store = useStore();
    const isDeleteVisible = ref(false);
    const searchTxt = ref('');
    const groupArray: any = ref([]); // 功能组
    const dutyPersonArray: any = ref([]); // 领导班子的负责人
    const deptArray: any = ref([]); // 部门
    const searchHistory: any = ref(
      store.state.reserve.searchHistory ? store.state.reserve.searchHistory : [],
    );
    const searchRef = ref<typeof Search | null>(null);
    // 导航栏配置
    const navBarConfig = ref({
      title: '现场指挥部',
      type: 'left',
      path: '',
    });
    /**
     * @description 取消搜索
     */
    function cancelSearch() {
      // isSearching.value = false;
    }

    /**
     * @description 开启删除历史
     */
    function showDeleteIcon() {
      isDeleteVisible.value = !isDeleteVisible.value;
    }

    /**
     * @description 删除历史
     */
    function handleDelectSearchHistory(item: string) {
      if (isDeleteVisible.value) {
        const _index: number = searchHistory.value.findIndex((el: string) => el === item);
        if (_index > -1) {
          searchHistory.value.splice(_index, 1);
        }
        store.commit('reserve/setSearchHistory', searchHistory.value);
      } else {
        if (searchRef.value) {
          searchRef.value.searchTxt = item;
          searchTxt.value = item;
          router.push({
            path: `/SearchResult/${searchTxt.value}`,
          });
          removeDuplicates(); // 搜索记录去重
        }
      }
    }

    /**
     * @description 搜索
     */
    function handleSearch() {
      if (searchTxt.value === '') {
        Toast({
          icon: 'close',
          message: '请先输入搜索内容',
        });
        return;
      }
      router.push({
        path: `/SearchResult/${searchTxt.value}`,
      });
      removeDuplicates(); // 搜索记录去重
    }

    /**
     * @description 搜索记录去重
     */
    function removeDuplicates() {
      const _index: number = searchHistory.value.findIndex((el: string) => el === searchTxt.value);
      if (_index > -1) {
        searchHistory.value.splice(_index, 1);
      }
      searchHistory.value.unshift(searchTxt.value);
      store.commit('reserve/setSearchHistory', searchHistory.value);
    }

    return {
      cancelSearch,
      showDeleteIcon,
      isDeleteVisible,
      searchTxt,
      groupArray,
      deptArray,
      dutyPersonArray,
      searchHistory,
      handleDelectSearchHistory,
      searchRef,
      navBarConfig,
      handleSearch,
    };
  },
});
</script>
<style lang="scss">
.search-result-container {
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;

  // 搜索框
  .search-container {
    box-sizing: border-box;
    height: 0.9rem;
    padding: 0.2rem 0.12rem 0.2rem 0.32rem;

    & > button {
      padding: 0 0.2rem;
    }
  }

  .contactors-container {
    background: #ffffff;
    padding: 0 0.32rem;
    box-sizing: border-box;
    border-bottom: 0.2rem solid #f5f5f5;
    border-top: 0.2rem solid #f5f5f5;
  }

  .groups-type__label {
    width: 100%;
    height: 0.8rem;
    font-size: 0.28rem;
    font-weight: 500;
    color: #333333;
    line-height: 0.8rem;
    box-sizing: border-box;
    border-bottom: 1px solid #dddddd;
  }

  // 单位
  .functional-groups {
    padding: 0 0.32rem;
    box-sizing: border-box;
    background: #ffffff;
    flex: 1;
    overflow: auto;

    .headquarters-unit-item {
      height: 0.9rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 0.01rem solid #dddddd;

      & > span {
        font-size: 0.28rem;
        font-weight: 400;
        color: #333333;
        line-height: 0.9rem;
      }

      & > img {
        width: 0.18rem;
        height: 0.3rem;
      }
    }
  }

  main {
    .search-record-title {
      margin: 0.05rem 0rem;
      padding: 0rem 4%;
      position: relative;
      display: flex;
      align-items: center;
      .search-record-title__label {
        color: #333333;
        font-size: 0.3rem;
        font-weight: 500;
      }
      .search-record-title__delete {
        cursor: pointer;
        width: 0.2rem;
        height: 0.2rem;
        display: inline-block;
        background: url(./assets/svg/deleteIcon.svg) no-repeat 0rem/0.2rem;
        position: absolute;
        right: 4%;
      }
    }
    .search-record-content {
      margin: 0.05rem 0rem;
      padding: 0rem 4%;
      position: relative;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      li {
        position: relative;
        margin: 2.5% 1.5%;

        label {
          color: #7e7e7e;
          background: #f8f8f8;
          border-radius: 1rem;
          padding: 0.1rem 0.3rem;
          white-space: nowrap;
          font-size: 0.24rem;
          font-weight: 400;
        }
        i {
          cursor: pointer;
          width: 0.2rem;
          height: 0.2rem;
          display: inline-block;
          background: url(./assets/svg/closeIcon.svg) no-repeat 0rem/0.2rem;
          position: absolute;
          top: -0.15rem;
          right: -0.02rem;
        }
      }
    }
  }
  .no-data {
    font-size: 0.28rem;
    color: #cccccc;
    height: 0.9rem;
    line-height: 0.9rem;
  }
}
</style>
