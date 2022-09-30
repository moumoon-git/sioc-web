<template>
  <div class="search-contactors-container">
    <header>
      <!-- 导航栏 -->
      <NavBar :config="navBarConfig" />
      <!-- 搜索框 -->
      <Search
        ref="searchRef"
        v-model:modelValue="searchTxt"
        placeholder="请输入联系人姓名、电话关键字"
        @blur="onSearchBlur"
      >
        <!-- <Button type="text" :fontSize="'0.28rem'" @click="handleSearch">搜索</Button> -->
        <Button type="text" :fontSize="'0.28rem'" @click="cancelSearch">取消</Button>
      </Search>
    </header>
    <!-- 主体内容 -->
    <main>
      <template v-if="searchTxt === ''">
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
      </template>
      <!-- <ul class="groups-list">
        <li class="group-item">
          <van-cell title="" is-link>
            <van-checkbox v-model="checked">
              最近联系人(5)
              <template #icon="props">
                <div :class="props.checked ? 'checkbox-selected' : 'checkbox-unSelected'"></div>
              </template>
            </van-checkbox>
          </van-cell>
           <van-cell title="" is-link>
            <van-checkbox v-model="checked">
              常用联系人(5)
              <template #icon="props">
                <div :class="props.checked ? 'checkbox-selected' : 'checkbox-unSelected'"></div>
              </template>
            </van-checkbox>
          </van-cell>
        </li>
      </ul> -->

      <ContactorSearchResult
        v-else 
        :contactorList="contactorList"
        :moduleName="moduleName"
        :loading="loading"
        @confirm="handleConfirm"
        @scroll="handleScroll"
      />
      
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
import ContactorSearchResult from '@/product/SIOC-H5/module/Reserve/Annunciate/components/SearchResult.vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'SearchPage',
  components: {
    Search,
    Button,
    Contactor,
    NavBar,
    ContactorSearchResult
  },
  watch: {
    searchTxt: {
      handler(newVal) {
        this.page = 1;
        if (newVal) {
          this.initData();
          this.getContactors();
        }
      }
    }
  },
  setup() {
    const router = useRouter();
    const instance: any = getCurrentInstance();
    const { $http } = instance?.appContext.config.globalProperties;
    const store = useStore();
    const isDeleteVisible = ref(false); // 是否可删除历史记录
    const searchTxt = ref(''); // 搜索框内容
    const groupArray: any = ref([]); // 分组
    const searchRef = ref<typeof Search | null>(null);
    const showResult = ref(false); // 显示结果
    // 搜索联系人页面的导航栏配置
    const navBarConfig = ref(store.state.searchContactorsPage.navBarConfig);
    // 搜索记录
    const searchHistory = ref(store.state.searchContactorsPage.searchHistory || []);
    // 选中的联系人
    const selectedContactors = ref(store.state.searchContactorsPage.selectedContactors || []);

    // 搜索页面被哪个模块使用： annunciate: 响应通告；
    const moduleName: any = ref(store.state.searchContactorsPage.moduleName || '');
    // 缓存里的搜素记录
    console.log('aaaaaa', store.state.searchContactorsPage);
    // 是否加载中
    const loading = ref(false);
    /**
     * @description 取消搜索
     */
    function cancelSearch() {
      // showResult.value = false;
      router.go(-1);
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
        store.commit('setSearchHistory', searchHistory.value);
      } else {
        if (searchRef.value) {
          searchRef.value.searchTxt = item;
          searchTxt.value = item;
          // router.push({
          //   path: `/SearchResult/${searchTxt.value}`,
          // });
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
      showResult.value = true;
      // router.push({
      //   path: `/SearchResult/${searchTxt.value}`,
      // });
      removeDuplicates(); // 搜索记录去重
    }

    /**
     * @description 搜索记录去重
     */
    function removeDuplicates() {
      if (searchTxt.value === '')
      return;
      const _index: number = searchHistory.value.findIndex((el: string) => el === searchTxt.value);
      if (_index > -1) {
        searchHistory.value.splice(_index, 1);
      }
      searchHistory.value.unshift(searchTxt.value);
      store.commit('setSearchHistory', searchHistory.value);
    }

    // 联系人列表
    const contactorList = ref([]);
    // 页码
    const page = ref(1);
    // 是否最后一页
    const isLastPage = ref(false);
    // 总页数
    const totalPages = ref(0);
    /**
     * @description 数据初始化
     */
    function initData() {
      isLastPage.value = false;
      contactorList.value = [];
      totalPages.value = 0;
    }
    /**
     * @description 获取联系人
     */
    function getContactors() {
      if (page.value === 1) {
        initData();
      }
      loading.value = true;
      const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailcontactor/list',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          limit: 20,
          page: page.value,
          search: searchTxt.value
        }
      };
      $http(request)
        .then((response: any) => {
          console.log(response);
          if (response.errorcode === 0 && response?.data) {
            contactorList.value = contactorList.value.concat(response.data.list);
            loading.value = false;
            totalPages.value = response.data.totalPage;
          } else {
            loading.value = false;
            Notify({
              type: 'danger',
              message: `搜索联系人失败，错误代码${response.code}，错误信息：${response.msg}`,
            });
          }
        })
    }
    // 选中分组
    const checked = ref(true);

    /**
     * @description 确定选中的联系人
     */
    function handleConfirm(val: any) {
    }

    /**
     * @description 搜索框失去焦点
     */
    function onSearchBlur() {
      removeDuplicates()
    }

    /**
     * @description 触底加载
     */
    function handleScroll() {
      page.value += 1;
      if (page.value > totalPages.value) {
        isLastPage.value = true;
      }
      console.log(page.value, isLastPage.value)
      if (!isLastPage.value) {
        getContactors();
      }
    }
    return {
      cancelSearch,
      showDeleteIcon,
      isDeleteVisible,
      searchTxt,
      groupArray,
      searchHistory,
      handleDelectSearchHistory,
      searchRef,
      navBarConfig,
      handleSearch,
      // placeholder,
      showResult,
      moduleName,
      checked,
      contactorList,
      getContactors,
      handleConfirm,
      onSearchBlur,
      handleScroll,
      initData,
      page,
      loading
    };
  },
});
</script>
<style lang="scss">
@use './assets/css/index.scss';

// 改写van样式
// .van-checkbox {
//   height: 100%;

//   .van-checkbox__icon {
//     height: auto;
//   }

//   .van-checkbox__label {
//     font-size: 0.32rem;
//     font-weight: 400;
//     color: #333333;
//   }

// }

// .van-cell--clickable {
//   display: flex;
//   align-items: center;
//   height: 100%;
//   .van-cell__title {
//     display: none;
//   }
//   .van-cell__right-icon {
//     font-size: 0.3rem;
//   }
// }
</style>
