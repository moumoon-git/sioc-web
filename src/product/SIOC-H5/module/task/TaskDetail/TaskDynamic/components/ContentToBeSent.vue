<!-- 组件：待发送内容 -->
<template>
  <div>
    <!-- 文件列表 -->
    <div
      v-if="chatForm.attachments.files && chatForm.attachments.files.length > 0"
      class="footer-container_response-content_file-list"
    >
      <TaskDocument
        v-for="(item, index) in chatForm.attachments.files"
        :key="index"
        :file="item"
        :fileColor="fileColor"
        :showClose="showDocumentClose"
        @handleClose="handleDeleteFile(item)"
      />
    </div>

    <!-- 定位 -->
    <!-- R2的功能，R1先不做 -->
    <!-- <div
      v-if="chatForm.location.address && chatForm.location.address !== ''"
      class="footer-container_response-content_location"
    >
      <TaskLocation
        :address="chatForm.location.address"
        :showClose="showLocationClose"
        @handleClose="handleDeleteLocation(chatForm.location)"
      />
    </div> -->

    <!-- 图片、视频列表 -->
    <div
      v-if="chatForm.attachments.images && chatForm.attachments.images.length > 0"
      class="footer-container_response-content_images-list"
    >
      <TaskImage
        v-for="(item, index) in chatForm.attachments.images"
        :key="index"
        :image="item"
        :showClose="showLocationClose"
        @handleClose="handleDeleteImage(item)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TaskDocument from '../../../../../generalparts/FileExtensionImage/Document.vue';
import TaskLocation from '../../components/TaskLocation.vue';
import TaskImage from '../../components/TaskImage.vue';

export default defineComponent({
  name: 'ContentToBeSent',
  components: {
    TaskDocument,
    TaskLocation,
    TaskImage,
  },
  emits: {
    handleDeleteFile: null,
    handleDeleteLocation: null,
    handleDeleteImage: null,
  },
  props: {
    // 附件内容
    chatForm: {
      type: Object,
      default: () => {
        return {
          text: '', // 文字
          attachments: {
            images: [], // 图片
            files: [], // 文档
            // 视频 R1版本先不做
            videos: [], // 视频
          },
          // 定位
          location: {
            addresss: '', // 定位地址
            longitude: '', // 经度
            latitude: '', // 纬度
          },
        };
      },
    },
  },
  setup(props, { emit }) {
    // ------------------------- 文档组件数据 start --------------------------------
    const showDocumentClose = ref(true); // 文档组件-props传参-是否显示“关闭|删除“按钮
    const fileColor = ref('colored'); // 'colored'彩色图标 | 'gray'灰色图标
    /**
     * @param {Object} file 文件数据
     */
    function handleDeleteFile(file: any) {
      emit('handleDeleteFile', file); // 删除文件
    }
    // ------------------------- 文档组件数据 end ----------------------------------

    // ------------------------- 定位组件数据 start --------------------------------
    const showLocationClose = ref(true);
    /**
     * @param {Object} location 定位数据
     */
    function handleDeleteLocation(location: any) {
      emit('handleDeleteLocation', location); // 删除定位
    }
    // ------------------------- 定位组件数据 end-----------------------------------

    // ------------------------- 图片组件数据 start --------------------------------
    const showImageClose = ref(true);
    /**
     * @param {Object} image 图片数据
     */
    function handleDeleteImage(image: any) {
      emit('handleDeleteImage', image); // 删除图片
    }
    // ------------------------- 图片组件数据 end-----------------------------------

    return {
      showDocumentClose,
      fileColor,
      showLocationClose,
      showImageClose,
      handleDeleteFile,
      handleDeleteLocation,
      handleDeleteImage,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/css/common'; /*引入公共样式*/

// 待发送的内容
// .footer-container_response-content-container {
//   @extend .flex_style;
//   flex-direction: column;
//   padding: 0.2rem 0.02rem;
//   background: #ecf2f2;
//   box-shadow: 0rem -0.01rem 0.01rem 0rem rgba(116, 116, 116, 0.3);
//   max-height: 3rem;
//   overflow: scroll;

// 文件列表
.footer-container_response-content_file-list {
  padding: 0 0.14rem 0 0.18rem;

  // .file-list_layout {
  //   @extend .flex_style;
  //   justify-content: space-between;
  //   align-items: center;
  //   margin-bottom: 0.14rem;

  //   .file-name {
  //     flex: 1;
  //     color: $color_4;
  //     font-size: $font_size_2;
  //     padding: 0 0.06rem;
  //   }
  // }
}

// 定位
.footer-container_response-content_location {
  // @extend .flex_style;
  // justify-content: space-between;
  // align-items: center;
  padding: 0 0.14rem 0 0.18rem;
  // .location-name {
  //   flex: 1;
  //   color: $color_4;
  //   font-size: $font_size_2;
  //   padding: 0 0.14rem;
  // }
}

// 图片、视频列表
.footer-container_response-content_images-list {
  // @extend .flex_style;
  // justify-content: space-between;
  // align-items: center;
  padding-left: 0.04rem;
  margin-top: 0.14rem;
  overflow: hidden;

  // .images-list_layout {

  // .images-list_layout_item {
  //   float: left;
  //   position: relative;

  //   .van-image {
  //     width: 1.18rem;
  //     height: 1.14rem;
  //     margin: 0.12rem;
  //     display: block;
  //   }

  //   .img-close {
  //     position: absolute;
  //     right: 0rem;
  //     top: 0rem;
  //     z-index: 1;
  //   }
  // }
  // }
}
// }
</style>
