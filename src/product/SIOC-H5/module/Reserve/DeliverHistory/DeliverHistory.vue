<!--转交记录-->
<template>
  <div class="deliver-history-container">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" />

    <div class="deliver-history-container__body">
      <van-loading v-if="loading" size="0.72rem" color="#0094ff" vertical>加载中...</van-loading>
      <template v-else>
        <ul v-if="transferResponseList.length > 0" class="deliver-history-list">
          <li
            v-for="item in transferResponseList"
            :key="getRandom()"
            class="deliver-history-list__item"
          >
            <div class="item-header">
              {{ item.sendTime }}
            </div>
            <ul class="item-body">
              <li class="item-body__item">
                <span class="item-body__item__left">转交人</span>

                <div class="item-body__item__right">
                  <span> {{ item.sendContactorName }} </span>
                  <span v-if="item.sendContactorPosition && item.sendContactorWorkUnit">
                    {{ '（' + item.sendContactorWorkUnit + '/' + item.sendContactorPosition + '）' }}
                  </span>
                  <span v-else-if="item.sendContactorWorkUnit || item.sendContactorPosition">
                    {{ '（' + item.sendContactorWorkUnit + item.sendContactorPosition + '）' }}
                  </span>
                </div>
              </li>
              <li class="item-body__item">
                <span class="item-body__item__left">交接人</span>
                <div class="item-body__item__right">
                  <span> {{ item.recevieContactorName }} </span>
                  <span v-if="item.recevieContactorPosition && item.recevieContactorWorkUnit">
                    {{ '（' + item.recevieContactorWorkUnit + '/' + item.recevieContactorPosition + '）' }}
                  </span>
                  <span v-else-if="item.recevieContactorWorkUnit || item.recevieContactorPosition">
                    {{ '（' + item.recevieContactorWorkUnit + item.recevieContactorPosition + '）' }}
                  </span>
                </div>
              </li>
            </ul>
          </li>
        </ul>

        <div v-else class="noData">
          <img src="../Annunciate/assets/svg/noData.svg" alt="" class="noData__img" />
          <span class="noData__text">暂无数据</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, getCurrentInstance } from 'vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import { Notify, Toast } from 'vant';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'DeliverHistory',
  components: {
    NavBar,
  },
  setup() {
    const store = useStore();
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    // 导航栏配置
    const navBarConfig = ref({
      title: '转交记录',
      type: 'left',
      path: '',
    });
    // 转接记录
    const transferResponseList: any = ref([]);
    const loading = ref(true);

    /**
     * @description 获取随机数
     */
    function getRandom() {
      return Math.random() * 10;
    }
    // 获取任务列表数据
    function getTransferResponseList() {
      const request = {
        method: 'get',
        service: 'app',
        url: '/response/transferResponseList',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          distributionId: store.state.reserve.distributionId,
        },
      };
      $http(request).then((response: any) => {
        console.log(response);
        loading.value = false;
        if (response.errorcode === 0 && response?.data) {
          transferResponseList.value = [...response?.data];
          console.log(transferResponseList.value);
        } else {
          Notify({
            type: 'danger',
            message: `获取转交记录失败，错误代码${response.code}，错误信息：${response.msg}`,
          });
        }
      });
    }

    onMounted(() => {
      getTransferResponseList();
    });
    return {
      navBarConfig,
      transferResponseList,
      getRandom,
      loading
    };
  },
});
</script>

<style lang="scss">
.deliver-history-container {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &__body {
    width: 100%;
    flex: 1;
    background: #f5f5f5;
    padding: 0.2rem;
    box-sizing: border-box;
    overflow: scroll;

    .deliver-history-list {
      &__item {
        display: flex;
        flex-direction: column;
        background: #ffffff;
        padding: 0 0.2rem;
        margin-bottom: 0.2rem;

        .item-header {
          height: 0.9rem;
          line-height: 0.9rem;
          border-bottom: 0.01rem solid #dddddd;
        }

        .item-body {
          padding: 0.2rem 0;

          &__item {
            height: 0.6rem;
            line-height: 0.6rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &__left {
              font-size: 0.28rem;
              font-weight: 400;
              color: #999999;
            }

            &__right {
              font-size: 0.28rem;
              font-weight: 400;
              color: #333333;
            }
          }
        }
      }
    }

    .noData {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50%;

      &__text {
        font-size: 0.28rem;
        font-weight: 400;
        color: #999999;
      }

      &__img {
        width: 1.52rem;
        height: 1.37rem;
      }
    }
  }
}
</style>
