<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="图层分享"
    :width="540"
  >
    <div class="shareContent">
      <div class="shareContent__tabs">
        <div
          :class="['shareContent__tabs__item', { 'shareContent__tabs__item--active': selectId === 1 }]"
          @click="platformClick"
        >
          平台分享
        </div>
        <div
          :class="['shareContent__tabs__item', { 'shareContent__tabs__item--active': selectId === 2 }]"
          @click="shareClick"
        >
          公开分享
        </div>
      </div>
      <!-- 平台分享 -->
      <div
        v-if="selectId === 1"
        class="shareContent__content"
      >
        <div class="shareContent__content__top">
          <div class="shareContent__content__top__select">
            已分享的平台 ({{ shareData.length }})
          </div>
          <div class="shareContent__content__top__btns">
            <div
              v-if="shareData.length > 0"
              class="shareContent__content__top__btns__cancle"
              @click="cancleAll"
            >
              全部取消
            </div>
            <div
              class="shareContent__content__top__btns__add"
              @click="SelectPlatformFun"
            >
              +添加分享
            </div>
          </div>
        </div>
        <div class="shareContent__content__bot">
          <transition-group
            name="more"
            :css="false"
            @before-enter="beforeEnter"
            @enter="enter"
          >
            <ShareItem
              v-for="(item,index) in shareData"
              v-if="showShareItem"
              :key="item"
              :data-index="index"
              :itemdata="item"
              :all-group-data="allGroupData"
              @deleteFun="deleteSharePlatform"
            />
          </transition-group>
        </div>
      </div>
      <!-- 公开分享 -->
      <div
        v-if="selectId === 2"
        class="shareOpenContent__content"
      >
        <div class="shareOpenContent__content__top">
          <div class="shareOpenContent__content__top__labels">
            <div class="shareOpenContent__content__top__labels__share">
              <div class="shareOpenContent__content__top__labels__share__name">
                分享权限:
              </div>
              <div class="shareOpenContent__content__top__labels__share__operation">
                <SelectCheck
                  :is-disabled="false"
                  :group-info="allGroupData"
                  @checkEmit="getGroupIds"
                />
              </div>
            </div>
            <div class="shareOpenContent__content__top__labels__limit">
              <div class="shareOpenContent__content__top__labels__limit__name">
                有限期:
              </div>
              <div class="shareOpenContent__content__top__labels__limit__operation">
                <el-select
                  v-model="timeValue"
                  class="timeLimitSelect"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in timeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <el-checkbox v-model="isStartPassword">
              密码访问
            </el-checkbox>
          </div>
          <div class="shareOpenContent__content__top__btns">
            <div
              class="shareOpenContent__content__top__btns__log"
              @click="openLogFun"
            >
              分享记录
            </div>
            <div
              class="shareOpenContent__content__top__btns__offer"
              @click="onceShare"
            >
              一键生成
            </div>
          </div>
        </div>
        <div
          v-if="isShowBot"
          class="shareOpenContent__content__bot"
        >
          <div class="shareOpenContent__content__bot__link">
            <div class="shareOpenContent__content__bot__link__top">
              <div class="shareOpenContent__content__bot__link__top__l">
                <input
                  id="shareLink"
                  class="shareOpenContent__content__bot__link__top__l__link"
                  :value="linkInfo"
                >
                <div class="shareOpenContent__content__bot__link__top__l__status">
                  剩{{ timeValue }}天
                </div>
              </div>
              <div
                class="shareOpenContent__content__bot__link__top__r"
                @click="copyLink"
              >
                复制链接
              </div>
            </div>
            <div
              v-if="isStartPassword"
              class="shareOpenContent__content__bot__link__bot"
            >
              访问密码:

              <div class="shareOpenContent__content__bot__link__bot__password">
                {{ tempCode }}
              </div>
            </div>
          </div>
          <div class="shareOpenContent__content__bot__qrcode">
            <div class="shareOpenContent__content__bot__qrcode__img">
              <div
                ref="qrCodeUrl"
                class="qrcode"
              >
                <img
                  :src="ImgUrl"
                  alt
                >
              </div>
            </div>
            <div class="shareOpenContent__content__bot__qrcode__send">
              <div class="shareOpenContent__content__bot__qrcode__send__title">
                扫码分享或短信分享
              </div>
              <div class="shareOpenContent__content__bot__qrcode__send__btns">
                <div
                  class="shareOpenContent__content__bot__qrcode__send__btns__download"
                  @click="downLoadQrcode"
                >
                  下载二维码
                </div>
                <div
                  class="shareOpenContent__content__bot__qrcode__send__btns__sendMs"
                  @click="openSelectContactorFun"
                >
                  短信推送
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
  <SelectPlatform ref="SelectPlatformRef" />
  <ShareLog
    ref="ShareLogRef"
    :public-share-data="publicShareData"
    :public-share-group-data="publicShareGroupData"
    @refreshShareLogsEmit="refreshShareLogs"
  />
  <SelectContactor
    ref="SelectContactorRef"
    :link-info="linkInfo"
  />
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance, onMounted, watch,
} from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import ShareItem from '@/product/Coplotting/module/ShareSection/components/ShareItem.vue'; // 列表组件
import SelectPlatform from '@/product/Coplotting/module/ShareSection/SelectPlatform.vue'; // 选择平台组件
import ShareLog from '@/product/Coplotting/module/ShareSection/ShareLog.vue'; // 分享记录弹框组件
import SelectContactor from '@/product/Coplotting/module/ShareSection/components/SelectContactor.vue'; // 选择联系人组件
import SelectCheck from '@/product/Coplotting/module/ShareSection/components/SelectCheck.vue'; // 下拉选择复选框组件
import usePublicShare from './script/usePublicShare'; // 公共分享
import usePlatformShare from './script/usePlatformShare'; // 平台分享
import utilFun from './script/useCodeProduct'; // 随机验证码

export default defineComponent({
  components: {
    ShareItem, // 列表组件
    SelectPlatform, // 选择平台组件
    ShareLog, // 分享记录弹窗
    SelectContactor, // 选择联系人组件
    SelectCheck, // 下拉选择复选框组件
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    // 公共分享
    const {
      linkInfo,
      isShowBot,
      publicShareData,
      timeList,
      publicShareGroupData,
      savePublicShare,
      getPublicShareLog,
      createQrcode,
      ImgUrl,
    } = usePublicShare($http);
    // 生成随机密码
    const {
      codeProductFun,
    } = utilFun();
    // 平台分享
    const {
      getAllGroupInfo,
      showShareItem,
      allGroupData, // 所有的分组列表
    } = usePlatformShare($http);
    const route = useRoute();
    const store = useStore(); // 使用vuex
    const thisMapId: any = ref(0); // 当前的地图id
    thisMapId.value = route.query.mapId;
    const showDialog = ref(false);
    const selectId = ref(1);// tab切换
    const SelectPlatformRef = ref<null>(null);// 选择平台组件
    const ShareLogRef = ref<null>(null); // 分享记录弹窗组件
    const SelectContactorRef = ref<null>(null); // 选择联系人组件
    const isStartPassword = ref(true); // 是否启用密码
    const timeValue = ref(7);
    // 打开
    const open = () => {
      showDialog.value = true;
    };
    // 关闭
    const close = () => {
      showDialog.value = false;
    };
    // 获取已分享的平台列表
    const shareData = ref([]); // 分享记录的平台
    const getShareList = () => {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/getInviteCooperateRecordList',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: thisMapId.value,
          type: 1,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          shareData.value = response.data.list;
          showShareItem.value = true;
          dealGroupData(shareData.value);
        } else {
          ElMessage.error(`获取分享记录失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取分享记录失败，错误信息：${error}`);
      });
    };
    // 处理数据
    const returnNewGroup = (arr: any) => {
      const tempArr: any = [];
      const arrIds: any = [];
      arr.forEach((element: any) => {
        arrIds.push(element.groupId);
      });
      const tempAllGroupArr = JSON.parse(JSON.stringify(allGroupData.value));
      tempAllGroupArr.forEach((element: any) => {
        if (arrIds.includes(element.id)) {
          element.check = true;
        } else {
          element.check = false;
        }
      });
      return tempAllGroupArr;
    };
    // 处理分组数据数据
    const dealGroupData = (arr: any) => {
      console.log('.................................');
      console.log(arr);
      arr.forEach((element: any) => {
        element.groupRights = returnNewGroup(element.groupRights);
      });
      console.log(arr);
    };
    // 新加公开分享编辑当前权限
    const selectIds = ref([]);
    const getGroupIds = (ids: any) => {
      console.log(ids);
      selectIds.value = ids;
    };
    // 删除已分享平台
    const deleteSharePlatform = (id: any) => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [id],
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getShareList();
        } else {
          ElMessage.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除失败，错误信息：${error}`);
      });
    };
    // 复制链接
    const copyLink = () => {
      const Url2: any = document.getElementById('shareLink');
      Url2.select(); // 选择对象
      document.execCommand('Copy'); // 执行浏览器复制命令
      ElMessage.success({
        message: '复制成功',
        type: 'success',
      });
    };
    // 打开选择平台弹窗
    const SelectPlatformFun = () => {
      if (SelectPlatformRef.value) {
        (SelectPlatformRef.value as any).open();
        (SelectPlatformRef.value as any).getPlatformTree();
        (SelectPlatformRef.value as any).checkedAll = false;
      }
    };
    // 打开分享记录弹窗
    const openLogFun = () => {
      getPublicShareLog(Number(thisMapId.value));// 获取分享记录
      if (ShareLogRef.value) {
        (ShareLogRef.value as any).open();
      }
    };
    // 打开添加联系人弹窗
    const openSelectContactorFun = () => {
      return ElMessage.warning('H5功能暂未开放');
      if (SelectContactorRef.value) {
        (SelectContactorRef.value as any).open();
      }
    };
    // 点击平台分享tab
    const platformClick = () => {
      shareData.value = [];
      selectId.value = 1;
      getAllGroupInfo(Number(thisMapId.value));
      console.log(allGroupData.value);
      setTimeout(() => {
        getShareList();
      }, 1000);
    };
    // 点击公共分享tab
    const shareClick = () => {
      selectId.value = 2;
    };
    // 取消全部
    const cancleAll = () => {
      const allPlatformIds: any = [];
      shareData.value.forEach((item: any) => {
        allPlatformIds.push(item.id);
      });
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: allPlatformIds,
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getShareList();
        } else {
          ElMessage.error(`取消失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`取消失败，错误信息：${error}`);
      });
    };
    // 更新验证码
    const tempCode = ref(''); // 验证码
    const getcodeNew = () => {
      tempCode.value = codeProductFun(4);
      localStorage.setItem('tempPasswordCode', tempCode.value);
      localStorage.setItem('isNeedPassword', '1');
    };
    // 更新生成二维码
    const createQrcodeFun = () => {
      if (!linkInfo.value || linkInfo.value === '') {
        return ElMessage.error('未生成链接');
      }
      createQrcode(linkInfo.value, 119, 118);
    };
    // 下载二维码
    const downLoadQrcode = () => {
      return ElMessage.warning('H5功能暂未开放');
      if (!linkInfo.value || linkInfo.value === '') {
        return ElMessage.error('二维码地址有误');
      }
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = ImgUrl.value;
      a.download = '二维码';
      a.click();
    };
    // 一键分享
    const onceShare = async () => {
      getcodeNew(); // 更新验证码
      const data = {
        mapId: Number(thisMapId.value),
        password: tempCode.value, // 密码
        expired: timeValue.value, // 过期时间，单位是天
        needPassword: isStartPassword.value ? 1 : 0, // 是否需要密码
        groupIds: selectIds.value, // 可见分组的id
      };
      await savePublicShare(data);
      createQrcodeFun(); // 生成二维码
    };
    // 更新分享记录列表
    const refreshShareLogs = () => {
      getPublicShareLog(Number(thisMapId.value));// 获取分享记录
    };
    // 列表优化
    function beforeEnter(el: any) {
      el.style.opacity = 0;
    }
    /**
    * @desc 防止滚动条闪烁
    * @param {} params
    * @returns {} returns
    */
    function setAnimation(el:any, done:any) {
      return new Promise((resolve, reject) => {
        const delay = el.dataset.index * 100;
        setTimeout(() => {
          el.style.transition = 'opacity .2s ';
          el.style.opacity = 1;
          el.style.animation = 'one-in .2s infinite';
          el.style['animation-iteration-count'] = 1;
          done();
          resolve(el);
        }, delay);
      });
    }
   async function enter(el: any, done: any) {
      await setAnimation(el, done);
      // 加载完最后一个数据的时候才设置外层容器的样式
      if (Number(el.dataset.index) === shareData.value.length - 1) {
        el.parentNode.style.overflow = 'auto';
      }
    }
    // 监听是否需要密码
    watch(
        () => isStartPassword.value,
        (val, old) => {
          isShowBot.value = false;
        },
        {
        immediate: true,
      },
    );
    // 监听是否刷新平台分享列表
    watch(
        () => store.state.coplotting.isRefreshShareList,
        (val, old) => {
          platformClick()
        },
        {
        immediate: true,
      },
    );
    onMounted(() => {
      platformClick();
    });
    return {
      beforeEnter,
      enter,
      showDialog,
      open,
      close,
      selectId,
      SelectPlatformRef,
      SelectPlatformFun,
      isStartPassword,
      ShareLogRef,
      openLogFun,
      SelectContactorRef,
      openSelectContactorFun,
      copyLink,
      timeList,
      timeValue,
      shareData,
      getGroupIds,
      deleteSharePlatform,
      platformClick,
      shareClick,
      cancleAll,
      savePublicShare,
      onceShare,
      getcodeNew,
      tempCode,
      linkInfo,
      isShowBot,
      publicShareData,
      refreshShareLogs,
      allGroupData,
      dealGroupData,
      publicShareGroupData,
      ImgUrl,
      downLoadQrcode,
      showShareItem,
    };
  },
});
</script>
<style lang="scss" src="./style/ShareIndexPop.scss"></style>
