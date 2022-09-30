<!--响应通告-->
<template>
  <div class="annunciate-container">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" />
    <template v-if="!state">
      <div class="annunciate-container__body">
        <van-loading v-if="loading" size="0.72rem" color="#0094ff" vertical>加载中...</van-loading>
        <template v-else>
          <div class="annunciate-detail-container">
            <div class="annunciate-detail-container__header">
              <span class="annunciate-detail--context">事件概况</span>
              <Button
                :fontSize="'0.28rem'"
                type="text"
                @click="handleJumpToEvent"
                style="width:auto; height:auto"
              >
                <img src="./assets/svg/event.png" alt="" class="img-event" />
                事件详情
              </Button>
            </div>
            <div class="annunciate-detail-container__body">
              <van-field
                v-model="responseData.eventDescription"
                rows="1"
                autosize
                type="textarea"
                readonly
                class="annunciate-detail-input"
              />
            </div>
          </div>

          <div class="annunciate-detail-container">
            <div class="annunciate-detail__annunciate-state">
              <img
                v-if="responseData.preplanStatus === 1"
                src="./assets/svg/handling.png"
                alt=""
                class="state-img"
              />
              <img v-else src="./assets/svg/finished.png" alt="" class="state-img" />
            </div>
            <div class="annunciate-detail-container__header">
              <span class="annunciate-detail--context">预案信息</span>
            </div>
            <div class="annunciate-detail-container__body">
              <div class="annunciate-detail-item">
                <div class="annunciate-detail-item__label">预案名称</div>
                <div class="annunciate-detail-item__value">{{ responseData.preplan }}</div>
              </div>

              <div class="annunciate-detail-item">
                <div class="annunciate-detail-item__label">响应等级</div>
                <div class="annunciate-detail-item__value">{{ responseData.preplanLevel }}</div>
              </div>
            </div>
          </div>

          <div class="annunciate-detail-container">
            <div class="annunciate-detail-container__header">
              <span class="annunciate-detail--context">应急职责</span>
            </div>
            <div class="annunciate-detail-container__body">
              <div class="annunciate-detail-item">
                <div class="annunciate-detail-item__label">
                  {{ responseData.dutyType === 1 ? '指挥职务' : '所在公司' }}
                </div>
                <div class="annunciate-detail-item__value">{{ responseData.dutyName }}</div>
              </div>

              <div class="annunciate-detail-item">
                <div class="annunciate-detail-item__label">
                  {{ responseData.dutyType === 1 ? '职务职责' : '单位职责' }}
                </div>
                <div class="annunciate-detail-item__value">
                  {{ responseData.duty }}
                </div>
              </div>
            </div>
          </div>

          <div class="annunciate-detail-container">
            <div class="annunciate-detail-container__header">
              <span class="annunciate-detail--context">确认响应</span>
            </div>
            <div class="annunciate-detail-container__body">
              <van-field
                v-model="responseData.result"
                rows="4"
                autosize
                type="textarea"
                :readonly="responseData.statusCode === 'response' ? true : false"
                placeholder="请输入响应说明（选填）"
                class="annunciate-detail-textarea"
              />
            </div>
          </div>

          <!-- 注释原因：南海样式更改 -->
          <!-- <Button
            class="annunciate-button"
            :type="
              responseData.statusCode === 'response' || responseData.preplanStatus === 0
                ? 'disabled'
                : 'default'
            "
            @click="confirmAnnunciate"
            >{{ responseData.statusCode === 'response' ? '已响应' : '确定响应' }}</Button
          > -->
        </template>
      </div>
      <!-- 底部 -->
      <div v-if="!loading" class="annunciate-container__footer">
        <div class="annunciate-container__footer__left">
          <Button
            class="annunciate-container__footer__left__button"
            :type="'text'"
            @click="toDeliverHistory"
          >
            <img src="./assets/svg/list.svg" alt="" class="annunciate-container__footer__left__img" />
            <span class="annunciate-container__footer__left__text">转交记录</span>
          </Button>
        </div>
        <div class="annunciate-container__footer__center">
          <Button
            class="button-style"
            :type="responseData.transferStatus === 0 && responseData.statusCode !== 'response' ? 'text' : 'text--disabled'"
            @click="handleDeliver"
          >
            {{responseData.transferStatus === 0 ? '转交' : '已转交'}}
          </Button>
        </div>
        <div class="annunciate-container__footer__right">
          <Button
            class="button-style"
            :type="
              responseData.statusCode === 'response' || responseData.preplanStatus === 0
                ? 'text--disabled'
                : 'text--primary'
            "
            @click="confirmAnnunciate"
          >
            {{ responseData.statusCode === 'response' ? '已响应' : '确定响应' }}
          </Button>
        </div>
      </div>
    </template>
    <Status v-else :config="StatusConfig" @jump="handleJumpCallback" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';
import { Toast, Notify } from 'vant';
import Status from '@/product/SIOC-H5/generalparts/Status/Status.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Annunciate',
  components: {
    NavBar,
    Button,
    Status,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    // 分发记录id
    const distributionId: any = ref(
      router.currentRoute.value.params.distributionId
        ? router.currentRoute.value.params.distributionId
        : 0,
    );
    // 将响应Id存放在vuex
    store.commit('reserve/setDistributionId', distributionId.value);
    // 是否显示响应后的状态
    const state = ref(false);
    // 加载
    const loading = ref(true);
    // 导航栏配置
    const navBarConfig = ref({
      title: '响应通告',
      type: 'left',
      path: '/ReserveList',
    });
    // 状态配置
    const StatusConfig = ref({
      actionState: 'success', // 动作的状态：完成/失败
      actionStateText: '响应成功！', // 动作的描述
      buttonText: '返回', // 按钮-文本
      buttonPath: ``, // 按钮-跳转路径
    });
    // 响应通告数据
    const responseData = ref({
      duty: '',
      dutyName: '',
      dutyType: 1, // 职责类型 1：职务职责，2 单位职责
      eventDescription: '',
      eventId: null,
      preplan: '',
      preplanLevel: '',
      preplanStatus: 1, // preplanStatus: 0 结束，1 启动
      preplanStatusName: '',
      result: '',
      status: null,
      statusCode: '',
      statusName: '',
      transferStatus: 0, // 是否转接 0：未转发，1：已转发
    });
    /**
     * @description 跳转到转接记录
     */
    function toDeliverHistory() {
      router.push({
        path: `/DeliverHistory`
      })
    }

    /**
     * @description 选择转交联系人
     */
    function handleDeliver() {
      const searchContactorsPage = {
        // 搜索联系人页面的导航栏配置
        navBarConfig: {
          title: '选择交接人',
          type: 'left',
          path: '',
        },
        // 搜索记录
        searchHistory: store.state.searchContactorsPage.searchHistory,
        // 选中的联系人
        selectedContactors: store.state.searchContactorsPage.selectedContactors,
        choiceNumber:  'single', // single or multiple
        moduleName: 'annunciate', // 模块名
      }
      if (responseData.value.transferStatus === 0 && responseData.value.statusCode !== 'response') {
        store.commit('setSearchContactorsPage', searchContactorsPage);
        router.push({
          path: '/SearchContactors',
        })
      }
    }

    
    /**
     * @param {string | number} distributionId 分发记录id
     * @description 获取通告响应详情
     */
    function getResponseDetail(distributionId: string | number) {
      loading.value = true;
      let form = new FormData();
      form.append('distributionId', String(distributionId));
      let requestData: any = ref({
        method: 'post',
        service: 'app',
        url: `/response/getResponseDetail`,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
        data: form,
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          loading.value = false;
          if (res.errorcode === 0) {
            Object.assign(responseData.value, res.data);
          }
        })
        .catch((error: any) => {
          loading.value = false;
          if (error.errorcode) {
            Notify({
              type: 'danger',
              message: `获取通告响应详情失败，错误代码${error.errorcode}，错误信息：${error.msg}`,
            });
          }
        });
    }

    /**
     * @param {string | number} distributionId 分发记录id
     * @description 确认响应
     */
    function confirm(distributionId: string) {
      let form = new FormData();
      form.append('distributionId', distributionId);
      form.append('content', responseData.value.result);
      let requestData: any = ref({
        method: 'post',
        service: 'app',
        url: `/response/confirm`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          data: {
            distributionId,
            content: responseData.value.result,
          },
        },
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          if (res.errorcode === 0) {
            Notify({
              type: 'success',
              message: `确认响应成功`,
            });
            state.value = true;
            getResponseDetail(distributionId);
          }
        })
        .catch((error: any) => {
          if (error.errorcode) {
            Notify({
              type: 'danger',
              message: `确认响应失败，错误代码${error.errorcode}，错误信息：${error.msg}`,
            });
          }
          state.value = true;
          // 状态配置
          Object.assign(StatusConfig.value, {
            actionState: 'fail', // 动作的状态：完成/失败
            actionStateText: '响应失败！', // 动作的描述
            buttonText: '返回', // 按钮-文本
            buttonPath: ``, // 按钮-跳转路径
          });
        });
    }

    /**
     * @description 确认响应
     */
    function confirmAnnunciate() {
      // preplanStatus: 0 结束，1 启动
      if (responseData.value.statusCode !== 'response' && responseData.value.preplanStatus === 0) {
        Toast({
          message: '响应已结束，无法确定响应！',
          icon: 'close',
        });
      }
      if (responseData.value.statusCode !== 'response' && responseData.value.preplanStatus === 1) {
        confirm(distributionId.value);
      }
    }
    /**
     * @description 跳转到事件详情页面
     */
    function handleJumpToEvent() {
      router.push({
        path: `/EventInformation/${responseData.value.eventId}`,
      });
    }

    /**
     * @description 响应成功后的回调
     */
    function handleJumpCallback() {
      state.value = false;
    }

    onMounted(() => {
      getResponseDetail(distributionId.value); // 获取通告响应详情
    });

    return {
      navBarConfig,
      confirmAnnunciate,
      handleJumpToEvent,
      responseData,
      state,
      StatusConfig,
      handleJumpCallback,
      loading,
      toDeliverHistory,
      handleDeliver
    };
  },
});
</script>
<style lang="scss">
@import './assets/css/annunciate.scss';
</style>
