<!--预案响应列表-->
<template>
  <div class="reserve-list-container">
    <header class="reserve-list-container__header">
      <!-- 导航栏 -->
      <NavBar :config="navBarConfig" />
      <!-- 搜索框 -->
      <Search
        ref="searchRef"
        v-model:modelValue="searchTxt"
        :placeholder="'请输入预案名称/事件名称搜索'"
        class="search-container"
      >
        <Button :fontSize="'0.28rem'" type="primary" class="button-style" @click="handleShowPopup">
          筛选
          <img src="./assets/images/filter.svg" alt="" class="button-right" />
        </Button>
      </Search>
    </header>

    <main class="reserve-list-container__body">
      <van-pull-refresh v-model="isLoading" success-text="" @refresh="onRefresh">
        <div class="reserve-list" @scroll="scrollEvent">
          <ReserveItem
            v-for="item in reverseList"
            :key="item.id"
            :reserve-data="item"
            class="reserve-item"
            @click="handleJumptoAnnunciate(item)"
          />
        </div>
      </van-pull-refresh>
    </main>

    <footer>
      <van-popup v-model:show="showFooter" position="bottom" round :style="{ height: '25%' }">
        <div class="popup__header">
          <Button :fontSize="'0.28rem'" type="text" class="popup__header__left" @click="handleSearch()">
            重置
          </Button>
          <span class="popup__header__center">请选择筛选条件</span>
          <Button
            :fontSize="'0.28rem'"
            type="text"
            class="popup__header__right"
            @click="handleSearch(activeAnnunicateType)"
          >
            确定
          </Button>
        </div>
        <div class="popup__body">
          <div
            v-for="item in annunicateType"
            :key="item.id"
            :class="
              activeAnnunicateType === item.id
                ? 'annunicate-type--active'
                : 'annunicate-type--default'
            "
            @click="handleSelectaAnunicateType(item)"
          >
            <span class="annunicate-type--label">{{ item.name }}</span>
            <div v-if="activeAnnunicateType === item.id" class="active-status">
              <img src="./assets/images/gou.svg" alt="" class="active-status-icon" />
            </div>
          </div>
        </div>
      </van-popup>
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted, watch } from 'vue';
import Search from '@/product/SIOC-H5/generalparts/SearchInput/SearchInput.vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';
import ReserveItem from '@/product/SIOC-H5/module/Reserve/ReserveList/components/ReserveItem.vue';
import { useRouter } from 'vue-router';
// 组件——提示弹窗
import { Notify } from 'vant';

export default defineComponent({
  name: 'ReserveList',
  components: {
    Search,
    NavBar,
    Button,
    ReserveItem,
  },

  setup() {
    const router = useRouter();
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;

    // 搜索框的值
    const searchTxt = ref('');
    // 导航栏配置
    const navBarConfig = ref({
      title: '响应通告',
      type: !!(window as any)?.task?.getIsApp() ? '' : 'left',
      path: !!(window as any)?.task?.getIsApp() ? '' : '/HomePage',
    });
    const showFooter = ref(false);
    const activeAnnunicateType: any = ref(''); // 当前选中的预案响应类型
    const isLoading = ref(false); // 下拉刷新-刷新中的效果
    const annunicateType: any = ref([]);
    const totalPages = ref(0); // 总页数
    const totalElements = ref(0); // 总条数
    const page = ref(1); // 页数
    const size = ref(10); // 每页数据条数
    const reverseList: any = ref([]);
    const isLastPage = ref(false); // 是否下拉加载到最新一页

    /**
     * @description 下拉刷新
     */
    function onRefresh() {
      page.value = 1;
      getReverseList(true);
    }

    /**
     * @description 显示弹出窗
     */
    function handleShowPopup() {
      showFooter.value = !showFooter.value;
    }

    /**
     * @description 搜索
     */
    function handleSearch(val: any) {
      activeAnnunicateType.value = val || '';
      page.value = 1;
      getReverseList(true);
      showFooter.value = false;
    }

    /**
     * @description 选中预案类型
     * @param item 选中的预案类型
     */
    function handleSelectaAnunicateType(item: any) {
      activeAnnunicateType.value = item.id;
    }

    /**
     * @description 获取预案列表
     * @param {Boolean} isRefresh true：要下拉刷新数据。false：不用下拉刷新数据
     */
    function getReverseList(isRefresh: any) {
      // 接口请求数据
      const requestData: any = ref({
        method: 'get',
        service: 'app',
        url: '/response/getResponseList',
        params: {
          keyWord: searchTxt.value, // 搜索关键字
          statusId: activeAnnunicateType.value, // 状态id，调用字典接口获取响应状态字典
          page: page.value, // 页码
          size: size.value, // 每页数据条数
        },
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          if (res.errorcode === 0) {
            isLoading.value = false;
            const { data } = res.data;
            totalPages.value = res.data.totalPages; // 总页数
            totalElements.value = res.data.totalElements; // 总条数

            if (isRefresh) {
              // 重新获取数据
              isLastPage.value = false;
              reverseList.value = data;
            } else {
              // 连接数组
              reverseList.value = reverseList.value.concat(data);
            }
            
          } else {
            Notify({
              type: 'danger',
              message: `获取预案响应列表失败，错误代码${res.code}，错误信息：${res.msg}`,
            });
          }
        })
        .catch((error: any) => {
          isLoading.value = false;
          if (error.code) {
            Notify({
              type: 'danger',
              message: `获取预案响应列表失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    /**
     * @description 获取任务类型列表
     */
    function getByParentCode() {
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/emergency/preparation/dictionary/getByParentCode',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          pcode: 'response_status',
        },
      };
      $http(request).then((response: any) => {
        annunicateType.value = response?.data || [];
      });
    }

    /**
     * @description 跳转到响应通告详情
     */
    function handleJumptoAnnunciate(item: any) {
      router.push({
        path: `/Annunciate/${item.distributionId}`,
      });
    }

    /**
     * @description 滚动到低就获取下一页的数据
     */
    function scrollEvent(e: any) {
      const {scrollHeight, scrollTop, clientHeight} = e.target;
      if(scrollHeight - scrollTop === clientHeight) {
        page.value += 1;
        if (page.value > totalPages.value) {
          isLastPage.value = true;
        }
        if (!isLastPage.value) {
          getReverseList(false);
        }
      }
    }

    watch(
      () => searchTxt.value,
      () => {
        page.value = 1;
        getReverseList(true);
      },
    );

    onMounted(() => {
      getReverseList(true);
      getByParentCode();
      document.getElementsByClassName('reserve-list-container__body')[0].addEventListener('scroll', scrollEvent)
    });

    return {
      searchTxt,
      navBarConfig,
      handleSearch,
      showFooter,
      annunicateType,
      activeAnnunicateType,
      handleSelectaAnunicateType,
      reverseList,
      onRefresh,
      getByParentCode,
      getReverseList,
      isLoading,
      page,
      size,
      handleJumptoAnnunciate,
      handleShowPopup,
      scrollEvent
    };
  },
});
</script>
<style lang="scss">
.reserve-list-container {
  height: 100vh;
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;

  // 头部
  .reserve-list-container__header {
    width: 100%;

    .search-container {
      display: flex;
      align-items: center;
      padding-left: 0.32rem;
      height: 1.1rem;
      box-sizing: border-box;

      .button-style {
        padding: 0 0.32rem;

        .button-right {
          width: 0.26rem;
          height: 0.26rem;
        }
      }
    }
  }

  // 身体
  .reserve-list-container__body {
    background: #f5f7fa;
    padding: 0.2rem;
    flex: 1;
    overflow: scroll;

    :deep(.van-pull-refresh) {
      height: 100%;
    }

    .reserve-list {
      overflow: auto;
    }
  }

  // 底部
  footer {
    // 弹出层
    .popup__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem;

      .popup__header__left {
        font-size: 0.32rem;
      }

      .popup__header__center {
        font-size: 0.36rem;
        font-weight: 500;
        color: #000000;
        line-height: 0.5rem;
      }

      .popup__header__right {
        font-size: 0.32rem;
      }
    }

    .popup__body {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0.05rem 0.4rem;

      .annunicate-type {
        &--active {
          width: 2.1rem;
          height: 0.66rem;
          line-height: 0.66rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #0091ff;
          background: rgba(0, 145, 255, 0.12);
          text-align: center;
          margin-right: 0.2rem;
          position: relative;

          .active-status {
            position: absolute;
            right: 0;
            top: 0;
            width: 0;
            height: 0;
            border-top: 0.16rem solid #0091ff;
            border-right: 0.16rem solid #0091ff;
            border-left: 0.16rem solid transparent;
            border-bottom: 0.16rem solid transparent;

            .active-status-icon {
              width: 0.16rem;
              height: 0.12rem;
              position: absolute;
              top: -0.1rem;
              right: -0.16rem;
            }
          }

          .annunicate-type--label {
            font-size: 0.28rem;
            font-weight: 400;
            color: #0091ff;
          }
        }

        &--default {
          width: 2.1rem;
          height: 0.66rem;
          line-height: 0.8rem;
          background: #f5f5f5;
          text-align: center;
          margin-right: 0.2rem;

          .annunicate-type--label {
            font-size: 0.28rem;
            font-weight: 400;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
