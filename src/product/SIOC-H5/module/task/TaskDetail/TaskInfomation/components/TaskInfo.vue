<!-- 组件：任务详情 —— 任务的详细信息 -->
<template>
  <!-- 文本信息 -->
  <div class="infomation-container">
    <div class="info_row">
      <span class="info_col info_label">发布时间</span>
      <span class="info_col info_value">{{
        taskInformation.startTime ? taskInformation.startTime : '-'
      }}</span>
    </div>
    <div class="info_row">
      <span class="info_col info_label">任务名称</span>
      <span class="info_col info_value">{{
        taskInformation.taskName ? taskInformation.taskName : '-'
      }}</span>
    </div>
    <div class="info_row">
      <span class="info_col info_label">任务类型</span>
      <span class="info_col info_value">{{
        taskInformation.taskType ? taskInformation.taskType : '-'
      }}</span>
    </div>
    <div class="info_row">
      <span class="info_col info_label">任务地点</span>
      <span class="info_col info_value">{{
        taskInformation.taskAddress ? taskInformation.taskAddress : '-'
      }}</span>
    </div>
    <div class="info_row">
      <span class="info_col info_label">任务时限</span>
      <span class="info_col info_value">{{
        taskInformation.taskTimeLimit ? taskInformation.taskTimeLimit : '-'
      }}</span>
    </div>
    <div class="info_row">
      <span class="info_col info_label">任务说明</span>
      <span class="info_col info_value">{{
        taskInformation.taskRemark ? taskInformation.taskRemark : '-'
      }}</span>
    </div>
    <!-- 附件 -->
    <div
      v-if="
        taskInformation.taskAttachment &&
          (taskInformation.taskAttachment.images.length > 0 ||
            taskInformation.taskAttachment.files.length > 0)
      "
      class="info_attachment"
    >
      <span class="info_col info_label">附件</span>

      <div class="images-videos-list">
        <!-- 图片 -->
        <div
          v-if="
            taskInformation.taskAttachment.images && taskInformation.taskAttachment.images.length > 0
          "
          class="images_layout"
        >
          <van-image
            v-for="(item, index) in taskInformation.taskAttachment.images"
            fit="cover"
            :src="baseURL + item.url"
            @click="previewImage(taskInformation.taskAttachment.images, index)"
          />
        </div>

        <!-- 视频 -->
        <div
          v-if="
            taskInformation.taskAttachment.videos && taskInformation.taskAttachment.videos.length > 0
          "
          class="images_layout"
        >
          <div
            v-for="(item, index) in taskInformation.taskAttachment.videos"
            :key="item.id"
            @click="previewVideo(item.url)"
          >
            <video 
              :src="baseURL + item.url"
            >
              您的浏览器不支持 video 标签。
            </video>
            <i class="icon-video"></i>
          </div>
        </div>
      </div>
      <!-- 文件 -->
      <div
        v-if="
          taskInformation.taskAttachment.files && taskInformation.taskAttachment.files.length > 0
        "
        class="files-layout"
      >
        <div
          class="file-item"
          v-for="item in taskInformation.taskAttachment.files"
          @click="downloadFile(item)"
        >
          <FileExtensionImage :extension="item.extension" :fileColor="fileColor" />
          <span class="file-item_name">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 暂无附件 -->
    <div v-else class="info_row">
      <span class="info_col info_label">附件</span>
      <span class="info_col info_value">暂无附件</span>
    </div>
    <!-- 预览视频 -->
    <van-overlay :show="showVideoDialog" @click="closeVideoDialog">
      <div class="preview-video-dialog">
        <video id="video" :src="videoUrl" controls="controls" class="video-dialog">
          您的浏览器不支持 video 标签。
        </video>
        <van-icon name="cross" size="0.5rem" class="icon-cross" @click="showVideoDialog = false" />
      </div>
    </van-overlay>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import FileExtensionImage from '../../../../../generalparts/FileExtensionImage/FileExtensionImage.vue';
import $file from '../../assets/js/file';
import { Toast, ImagePreview } from 'vant';

export default defineComponent({
  name: 'TaskInfo',
  components: {
    FileExtensionImage,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  props: {
    taskInformation: {
      type: Object,
      default: () => {
        return {
          deadline: '', // 倒计时时长，单位毫秒 number | string
          taskName: '', // 任务名称
          taskType: '', // 任务类型
          taskAddress: '', // 任务地点
          taskTimeLimit: '', // 任务时限
          taskRemark: '', // 任务说明
          taskAttachment: {
            images: [], // 图片
            files: [], // 文档
            videos: [], // 视频
          }, // 任务附件
        };
      },
    },
  },
  setup() {
    const fileColor = ref('colored'); // 'colored'彩色图标 | 'gray'灰色图标
    const baseURL: string = (window as any).config.baseURL;
    /**
     * @param {Object} file 文件信息
     * @description 下载文件
     */
    function downloadFile(file: any) {
      if (file.url === '') {
        return;
      }
      const path: string = baseURL + file.url;
      $file.downloadFile(path, file.name);
    }

    /**
     * @param {Array} images 图片数组
     * @param {Nubmer}} index 下标
     * @description 图片预览
     */
    function previewImage(images: any, index: any) {
      const imagesList = images.map((item: any) => baseURL + item.url);
      ImagePreview({
        images: imagesList,
        startPosition: index, // 指定图片的初始位置（索引值）
        closeable: true,
        // 监听图片预览的关闭事件
        onClose() {},
      });
    }
    // 显示/隐藏视频弹窗
    const showVideoDialog = ref(false);
    // 预览弹窗的视频路径
    const videoUrl = ref('');
    /**
     * @description 预览视频
     */
    function previewVideo(url: string) {
      showVideoDialog.value = true;
      videoUrl.value = baseURL + url;
    }
    /**
     * @description 关闭查看视频弹窗
     */
    function closeVideoDialog() {
      showVideoDialog.value = false;
      const video: any = document.getElementById('video');
      if (video.play) {
        video.pause();
      }
    }
    return {
      fileColor,
      downloadFile,
      baseURL,
      previewImage,
      showVideoDialog,
      videoUrl,
      previewVideo,
      closeVideoDialog
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/css/common'; /*引入公共样式*/

// 信息样式：
.infomation-container {
  padding-top: 0.28rem;

  .info_row {
    @extend .flex_style;
    justify-content: flex-start;
    padding: 0 0.18rem 0.2rem 0.18rem;
  }

  .info_label {
    width: 1.7rem;
    font-size: $font_size_1;
    color: $color_2;
  }

  .info_value {
    flex: 1;
    color: $color_3;
    font-size: $font_size_1;
  }
}

// 附件
.info_attachment {
  .info_col {
    padding: 0 0.18rem;
  }

  .images-videos-list {
    @extend .flex_style;
    flex-wrap: wrap;
    .icon-video {
      width: 0.44rem;
      height: 0.44rem;
      position: absolute;
      right: calc(50% - 0.22rem);
      top: calc(50% - 0.22rem);
      z-index: 1;
      background-image: url('../../assets/images/icons/video.svg');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  // 附件样式：
  .images_layout {
    @extend .flex_style;
    flex-wrap: wrap;
    overflow: hidden;
    position: relative;
    :deep(.van-image) {
      float: left;
      margin: 0.1rem;
      width: 3.13rem;
      height: 1.76rem;
    }
    video {
      float: left;
      margin: 0.1rem;
      width: 3.13rem;
      height: 1.76rem;
      border: 1px solid #DDDDDD;
      box-sizing: border-box;
    }
  }

  // 文件样式：
  .files-layout {
    padding: 0 0.08rem;
    .file-item {
      @extend .flex_style;
      align-items: center;
      margin-top: 0.1rem;
    }

    .file-item_name {
      flex: 1;
      color: $color_5;
      font-size: $font_size_1;
      padding-left: 0.08rem;
    }
  }
}
.van-overlay {
  z-index: 100;
  .preview-video-dialog {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .video-dialog {
      width: 100%;
      height: auto;
    }
    .icon-cross {
      position: absolute;
      right: 0.2rem;
      top: 0.2rem;
      color: #ffffff;
      z-index: 1;
    }
  }
}
</style>
