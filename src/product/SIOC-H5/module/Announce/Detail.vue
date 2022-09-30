<template>
  <!-- 横屏不要logo -->
  <div
    :class="$style.logo"
    @click="jump"
  >
    通知公告
  </div>
  <div :class="$style.list">
    <main v-if="!(item?.isWithdrew)">
      <div :class="$style.announceTitle">
        {{ item?.title || '-' }}
      </div>
      <div :class="$style.announceName">
        {{ item?.platformName || '-' }}
      </div>
      <div :class="$style.line" />
      <div :class="$style.announceTime">
        {{ item?.publishTime || '-' }}
      </div>
      <!-- 竖屏不要横线 -->
      <!-- <div :class="$style.horiline" /> -->
      <div
        v-html="dealContentFun(item?.content || '')"
        :class="$style.announceContent"
      />
      <!-- 图片 -->
      <img
        v-for="(itemone, indexone) in item?.pictures"
        :key="indexone"
        :src="baseURL+itemone?.vcUrl"
        @click="previewImage(item?.pictures, indexone)"
      >
      <!-- 文件 -->
      <div
        v-for="itemtwo in item?.files"
        :key="itemtwo.iid"
        :class="$style.listText"
      >
        <img src="./assets/svg/link.svg">
        {{ itemtwo.vcTitle }}
        <span @click="download(itemtwo)">
          下载
        </span>
      </div>
    </main>
    <main
      v-else
      :class="$style.withdrew"
    >
      <img src="./assets/svg/withdrew.svg">
      <p>抱歉，链接已失效</p>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
} from 'vue';
import { useRouter } from 'vue-router';
import { ImagePreview } from 'vant';
import $file from '../task/TaskDetail/assets/js/file';
import axios from 'axios';

export default defineComponent({
  name: 'AnnounceDetail',
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  // 横屏
  // props: {
  //   item: {
  //     type: Object,
  //     default: () => ({}),
  //   },
  // },
  setup() {
    const item = ref(null); // 当前项
    const baseURL = (window as any).config.baseURL;
    const router = useRouter(); // 路由
    const instance: any = getCurrentInstance();
    const { $http } = instance?.appContext.config.globalProperties;
    // 通知公告Id
    const noticeId: any = ref(router.currentRoute.value.params.noticeId || 0);
    const contactorId = !!(window as any)?.task?.getIsApp() ? Number((window as any)?.task?.getUserId()) : Number(localStorage.getItem('userId')); // 登录用户Id
    function jump() {
      router.push({
        path: '/Announce',
      });
    }
    function init() {
      const request: any = ref({
        method: 'get',
        service: 'soc',
        url: `/appManagement/notice/${noticeId.value}?contactorId=${contactorId}`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      ($http as any)(request.value).then((res: any) => {
        if (res.code === 0 || res.errorcode === 0) {
          item.value = res.data; // 详细信息
        }
      });
    }
    init();
    // 下载
    function download(item: any) {
      if (!item.vcUrl) {
        return;
      }
      const path: string = baseURL + item.vcUrl;
      $file.downloadFile(path, item.vcTitle);
      // axios({
      //   url: `${baseURL}/fileupload/appAttachment/download?appAttachmentId=${item.iid}&isForceDownload=1`,
      //   method: 'get',
      //   headers: {
      //     token: document.cookie.match(/token=([^;]*)/)?.[1],
      //     'Content-Type': 'application/json; charset=utf-8',
      //   },
      //   responseType: 'arraybuffer',
      // }).then((response: any) => {
      //   if (response) {
      //     const a = document.createElement('a');
      //     a.target = '_blank';
      //     a.download = item.vcTitle;
      //     a.href = window.URL.createObjectURL(new Blob([response.data]));
      //     a.click();
      //   }
      // });
    }
    function previewImage(images: any, index: any) {
      const imagesList = images.map((item: any) => baseURL + item.vcUrl);
      ImagePreview({
        images: imagesList,
        startPosition: index, // 指定图片的初始位置（索引值）
        closeable: true,
        // 监听图片预览的关闭事件
        onClose() {},
      });
    }
    // 处理内容
    function dealContentFun(str: string) {
      str = str.split('&lt;').join('<');
      str = str.split('&gt;').join('>');
      return str;
    }
    return {
      item,
      baseURL,
      noticeId,
      jump,
      previewImage,
      download,
      dealContentFun,
      contactorId,
    };
  },
});
</script>

<style lang="scss" module>
@import './assets/css/verticalDetail.scss';
// @import './assets/css/horizonDetail.scss';
</style>
