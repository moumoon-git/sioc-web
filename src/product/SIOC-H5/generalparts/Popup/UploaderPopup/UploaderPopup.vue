<template>
  <div class="footer-container_popup-button-list">
    <van-popup v-model:show="show" position="bottom" round :style="{ height: '25%' }">
      <div class="popup-button_item margin-right_1">
        <van-uploader
          v-model="fileList"
          :preview-image="false"
          :before-read="beforeUploadFiles"
          :after-read="afterRead"
          multiple
          :max-size="maxFileSize"
          @oversize="onOversize"
          lazy-load
        >
          <div class="popup-button_item_image">
            <div class="img-picture"></div>
          </div>
        </van-uploader>
        <span class="popup-button_item_label">图片</span>
      </div>
      <div class="popup-button_item margin-right_1">
        <van-uploader
          v-model="fileList"
          :preview-image="false"
          :before-read="beforeUploadFiles"
          :after-read="afterRead"
          capture="camera"
          accept="image/*"
          :max-size="maxFileSize"
          @oversize="onOversize"
          lazy-load
        >
          <div class="popup-button_item_image">
            <div class="img-camera"></div>
          </div>
        </van-uploader>
        <span class="popup-button_item_label">拍摄</span>
      </div>
      <div class="popup-button_item margin-right_1">
        <van-uploader
          v-model="fileList"
          :preview-image="false"
          :before-read="beforeUploadFiles"
          :after-read="afterRead"
          :accept="acceptFileType"
          multiple
          :max-size="maxFileSize"
          @oversize="onOversize"
        >
          <div class="popup-button_item_image">
            <div class="img-file"></div>
          </div>
        </van-uploader>
        <span class="popup-button_item_label">文件</span>
      </div>
      <!-- <div class="popup-button_item">
      <div class="popup-button_item_image" @click="getLocation">
        <div class="img-location"></div>
      </div>
      <span class="popup-button_item_label">位置</span>
    </div>
    <div class="popup-button_item margin-right_1">
      <div class="popup-button_item_image">
        <div class="img-video"></div>
      </div>
      <span class="popup-button_item_label">短视频</span>
    </div>
    <div class="popup-button_item margin-right_1">
      <div class="popup-button_item_image">
        <div class="img-live"></div>
      </div>
      <span class="popup-button_item_label">直播</span>
    </div> -->
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, getCurrentInstance } from 'vue';

// 逻辑——文件相关业务
import $file from '@/product/SIOC-H5/module/task/TaskDetail/assets/js/file.ts';

// 组件——提示弹窗
import { Toast, Notify } from 'vant';

export default defineComponent({
  name: 'UploaderPopup',
  setup() {
    const show = ref(true);
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;

    let fileList: any = reactive([]);
    let images: any = ref([]);
    let files: any = ref([]);
    let videos: any = ref([]);
    const attachments: any = ref({
      images: [], // 图片
      files: [], // 文档
      videos: [], // 视频 R1版本先不做
    });
    /**
     * @description 文件上传方法
     */
    function fileUploadAttachment(file: FileList) {
      let fileData: any = ref(new FormData());
      fileData.value.append('file', file);
      fileData.value.append('type', '3'); // 文件类型（0：系统文件 1 事件附件  2 预案附件  3 任务附件 4 协同标绘）
      const requestData: any = {
        method: 'post',
        service: 'file',
        url: '/appAttachment/fileUploadAttachment',
        data: fileData.value,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      };
      ($http as any)(requestData)
        .then((res: any) => {
          if (res.errorcode === 0 && res.data) {
            const extension = $file.getExtensions(res.data.title);
            if (res.data.fileContentType === 'image') {
              images.value.push(res.data);
              Object.assign(attachments.value, { images: images.value });
            } else if (res.data.fileContentType === 'file') {
              files.value.push(res.data);
              Object.assign(attachments.value, { files: files.value });
            } else if (res.data.fileContentType === 'video') {
              videos.value.push(res.data);
              Object.assign(attachments.value, { videos: videos.value });
            }
          } else {
            Notify({
              type: 'danger',
              message: `文件上传失败，错误代码${res.code}，错误信息：${res.msg}`,
            });
          }
        })
        .catch((error: any) => {
          if (error.code) {
            Notify({
              type: 'danger',
              message: `文件上传失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    const maxFileSize = 30 * 1024 * 1024; // 30MB
    /**
     * @param {Object | Array} files 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 文件超出大小，给予提示
     */
    function onOversize(file: any) {
      Toast('文件大小不能超过 30MB');
    }

    /**
     * @param {Object | Array} files 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 上传文件之前，判断类型
     */
    function beforeUploadFiles(files: any) {
      console.log('调用相机：', files);
      return true;
    }

    /**
     * @param {Object | Array} file 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 上传文件后的回调方法
     *
     */
    function afterRead(file: any) {
      fileList.value = file;
      if (file.length > 0) {
        file.forEach((el: any) => {
          fileUploadAttachment(el.file);
          console.log('多个上传：', el.file);
        });
      } else {
        fileUploadAttachment(file.file);
        console.log('单个上传：', file.file);
      }
    }

    return {
      show,
      beforeUploadFiles,
      fileList,
      afterRead,
      fileUploadAttachment,
      onOversize,
      maxFileSize,
    };
  },
});
</script>

<style lang="scss">
$img_camera: url('../assets/images/icons/camera.png'); // 图片-相机
$img_video: url('../assets/images/icons/video.png'); // 图片-视频
$img_live: url('../assets/images/icons/live.png'); // 图片-直播
$img_file: url('../assets/images/icons/file.png'); // 图片-文件
$img_picture: url('../assets/images/icons/picture.png'); // 图片-照片
$img_location: url('../assets/images/icons/location.png'); // 图片-定位
$img_location2: url('../assets/images/icons/location2.png'); // 图片-定位
// 相机
.img-camera {
  width: 0.39rem;
  height: 0.34rem;
  background-image: $img_camera;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
// 视频
.img-video {
  width: 0.44rem;
  height: 0.32rem;
  background-image: $img_video;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
// 直播
.img-live {
  width: 0.4rem;
  height: 0.4rem;
  background-image: $img_live;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
// 文件
.img-file {
  width: 0.42rem;
  height: 0.31rem;
  background-image: $img_file;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
// 照片
.img-picture {
  width: 0.39rem;
  height: 0.32rem;
  background-image: $img_picture;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
// 定位
.img-location {
  width: 0.32rem;
  height: 0.43rem;
  background-image: $img_location;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
// 定位2
.img-location2 {
  width: 0.2rem;
  height: 0.24rem;
  background-image: $img_location2;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
// 弹出层按钮
.footer-container_popup-button-list {
  // height: 3.6rem; // 两排按钮的时候，用这个高度
  height: 2rem; // 一排按钮，用这个高度
  padding: 0 0 0 0.52rem;

  .popup-button_item {
    float: left;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin-top: 0.25rem;
  }

  .popup-button_item_image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.04rem;
    height: 1.04rem;
    background: #ffffff;
    border-radius: 0.08rem;
  }
  .popup-button_item_label {
    color: #333333;
    font-size: 0.2rem;
    margin-top: 0.08rem;
  }

  .margin-right_1 {
    margin-right: 0.77rem;
  }
}
</style>
