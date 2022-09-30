<template>
  <ModalDialog
    v-model="showDialog"
    :title="currItem?.name || '知识库'"
    @close="showDialog = false"
  >
    <div :class="$style.list">
      <div :class="$style.margin">
        所属分组：{{ currItem?.groupName || '' }}
      </div>
      <div :class="$style.margin">
        应急类型：{{ currItem?.caseClassNames || '' }}
      </div>
      <div :class="$style.margin">
        知识标签：
        <div
          v-for="(itemone, indexone) in currItem?.labels"
          :key="indexone"
          :class="$style.labelItem"
        >
          <span>
            {{ itemone?.name || '' }}
          </span>
        </div>
      </div>
      <div :class="$style.horiline" />
      <div
        v-html="dealContentFun(currItem?.content || '')"
        :class="$style.margin"
      />
    </div>
  </ModalDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
} from 'vue';
import axios from 'axios';
import { ImagePreview } from 'vant';
import ModalDialog from '@/product/CommandBrain3.0/Generalparts/dialog/ModalDialog/ModalDialog.vue';

export default defineComponent({
  name: 'Detail',
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
    ModalDialog,
  },
  setup() {
    const { baseURL } = (window as any).config;
    const instance: any = getCurrentInstance();
    const { $http } = instance?.appContext.config.globalProperties;
    const showDialog = ref(false); // 平台弹窗状态
    const currItem = ref({
      name: '',
      caseClassNames: '',
      groupName: '',
      labels: [],
      content: '',
    });
    function init(item: any) {
      const request = {
        method: 'post',
        url: `/resoure/resourceKnowledgeBase/info/${item?.id}`,
        service: 'soc',
      };
      $http(request).then((response :any) => {
        if (response.code === 0 || response.errorcode === 0) {
          currItem.value.name = response.data?.resourceKnowledge?.name || '';
          currItem.value.caseClassNames = response.data?.resourceKnowledge?.caseClassNames || '';
          currItem.value.groupName = response.data?.resourceKnowledge?.groupName || '';
          currItem.value.labels = JSON.parse(response.data?.resourceKnowledge?.labels) || [];
          currItem.value.content = response.data?.resourceKnowledge?.content || '';
        }
      });
      setTimeout(() => {
        showDialog.value = true;
      }, 500);
    }
    // 下载
    function download(item: any) {
      if (!item.vcUrl) {
        return;
      }
      axios({
        url: `${baseURL}/fileupload/appAttachment/download?appAttachmentId=${item.iid}&isForceDownload=1`,
        method: 'get',
        headers: {
          token: document.cookie.match(/token=([^;]*)/)?.[1],
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'arraybuffer',
      }).then((response: any) => {
        if (response) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = item.vcTitle;
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    }
    // 预览
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
      baseURL,
      currItem,
      showDialog,
      init,
      download,
      previewImage,
      dealContentFun,
    };
  },
});
</script>

<style lang="scss" module>
.list {
  width: 70vh;
  height: 58vh;
  overflow: auto;
  position: relative;
  color: #fff;
  padding: 10px;
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
  .margin {
    margin: 10px 0px;
  }
  .horiline {
    width: 98%;
    height: 1px;
    background: #414449;
    opacity: 0.5;
  }
  // 标签项
  .labelItem {
    display: inline-block;
    color: #FFF;
    vertical-align: middle;
    height: 24px;
    line-height: 24px;
    padding: 0 16px;
    margin: 0px 0px 0px 10px;
    font-size: 12px;
    border-radius: 16px;
    position: relative;
    max-width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &:nth-child(4n) {
      background: #f2b626;
    }
    &:nth-child(4n + 1) {
      background: #f66e6e;
    }
    &:nth-child(4n + 2) {
      background: #0091ff;
    }
    &:nth-child(4n + 3) {
      background: #56e9ff;
    }
  }
}
</style>
