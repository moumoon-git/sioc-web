// 分享链接首页
<template>
  <div
    v-show="isShowBody"
    class="shareLinkBg"
  >
    <div class="shareLinkBg__title">
      协作标绘
    </div>
    <div class="shareLinkBg__card">
      <div class="shareLinkBg__card__bg">
        <div class="shareLinkBg__card__bg__title">
          请输入访问密码
        </div>
        <input v-model="visitePassword">
        <div class="shareLinkBg__card__bg__tip">
          密码区分大小写
        </div>
        <div
          class="shareLinkBg__card__bg__sure"
          @click="shareLoginFun"
        >
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
 defineComponent, ref, getCurrentInstance, watch, onMounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';

export default defineComponent({
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const route = useRoute();
    const router = useRouter();
    const store = useStore(); // 使用vuex
    const isShowBody = ref(false); // 是否显示页面
    const visitePassword:any = ref('');// 访问密码
    /**
    * @desc 分享登录
    * @param {} params
    * @returns {} returns
    */
   const shareLoginFun = () => {
     if (visitePassword.value === '' && Number(route.query.needPassword) === 1) {
       return ElMessage.warning('请输入访问密码');
     }
     if (!route.query.params) {
       return ElMessage.warning('分享链接缺少参数');
     }
     const formData:any = new FormData();
    formData.append('password', visitePassword.value);
    formData.append('publicShareId', Number(route.query.params));
     const request = {
      method: 'post',
      service: 'login',
      url: '/anonymoslogin',
      headers: {
        'Content-Type': 'application/json',
      },
      data: formData,
    };
    $http(request)
      .then((response: any) => {
        if (response.code === 0) {
          ElMessage.success('验证成功');
          const { token, platformId, isAdmin } = response;
          Cookies.set('token', token);
          Cookies.set('isAdmin', isAdmin || 0);
          Cookies.set('platformName', response.platform?.platformName || '');
          Cookies.set('password', response.user.password || '');
          Cookies.set('platformId', platformId || 0);
          Cookies.set('latitude', response.platform?.latitude || 0);
          Cookies.set('longitude', response.platform?.longitude || 0);
          getMapId(token);
        } else {
          ElMessage.error(
            `登录失败，错误代码${response.code}，错误信息：${response.msg}`,
          );
        }
      })
      .catch((error: Error) => {
        ElMessage.error(`登录失败，错误信息：${error}`);
      });
   };
   /**
   * @desc 获取跳转的地图id
   * @param {} params
   * @returns {} returns
   */
  const getMapId = (token:string) => {
    const request = {
      method: 'get',
      service: 'coplotting',
      url: '/assist/assistpublicshare/getMapId',
      headers: {
        'Content-Type': 'application/json',
        token,
      },
    };
    $http(request)
      .then((response: any) => {
        if (response.code === 0) {
          setTimeout(() => {
            getMapInfo(response.data);
          }, 500);
        } else {
          ElMessage.error(
            `获取地图失败，错误代码${response.code}，错误信息：${response.msg}`,
          );
        }
      })
      .catch((error: Error) => {
        ElMessage.error(`获取地图失败，错误信息：${error}`);
      });
  };
  // 获取地图详情并更新store
  const getMapInfo = (mapId:any) => {
       const request = {
        method: 'get',
        service: 'coplotting',
        url: `/assist/assistmap/info/${mapId}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };

        $http(request)
        .then((response: any) => {
          const mapsData = response.data.assistMap;
          store.state.coplotting.selfMap = mapsData;
          sessionStorage.setItem('selfMap', JSON.stringify(mapsData));
          router.push({ path: '/plottingIndex', query: { mapId, type: 'share', from: 'link' } });
        });
  };

    onMounted(() => {
      // 不需要密码直接进入地图
      if (Number(route.query.needPassword) === 0) {
        isShowBody.value = false;
        shareLoginFun();
      } else {
        isShowBody.value = true;
      }
    });
    return {
      shareLoginFun,
      visitePassword,
      isShowBody,
    };
  },
});
</script>

<style lang="scss">
.shareLinkBg {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f2f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &__title {
    font-size: 30px;
    font-weight: 600;
    color: #333333;
    width: 172px;
    height: 42px;
    margin-bottom: 30px;
    background: url(./components/assets/linkicon.svg) no-repeat;
    text-align: right;
    background-position: 0% 77%;
  }
  &__card {
    width: 418px;
    height: 250px;
    background: #ffffff;
    box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
    border-radius: 3px;

    &__bg {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      background: url(./components/assets/cardBg.svg) no-repeat;
      background-position: 100% 100%;
      &__title {
        color: #0091ff;
        font-size: 18px;
        margin-top: 41px;
      }
      &__tip {
        color: #999999;
        font-size: 14px;
        margin-top: 18px;
      }
      &__sure {
        width: 63px;
        height: 30px;
        background: #0091ff;
        border-radius: 3px;
        margin-top: 19px;
        color: #fff;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
      > input {
        width: 180px;
        height: 37px;
        background: #ffffff;
        border-radius: 3px;
        border: 1px solid #0091ff;
        margin-top: 20px;
        outline: 0;
      }
    }
  }
}
</style>
