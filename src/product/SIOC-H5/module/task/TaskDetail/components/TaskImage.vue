<!--组件：任务详情 —— 图片 -->
<template>
  <div class="task-image-layout">
    <van-image fit="cover" :src="baseURL + image.url" class="task-image_name" />
    <div class="task-image_img-close" @click="handleClose"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TaskImage',
  props: {
    // 图片数据
    image: {
      type: Object,
      default: () => {
        return {
          id: '', // 文件ID
          name: '', // 文件名字
          url: '', // 文件路径
          size: '', // 文件大小
          extension: '', // 文件后缀
        };
      },
    },

    // 是否显示 关闭 | 删除 按钮
    showClose: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    handleClose: null,
  },
  setup(props, { emit }) {
    const baseURL = (window as any).config.baseURL;
    /**
     * @author hxt
     * @createDate 2021年4月26日10:27:00
     * @param {Object} file 文件数据
     * @description 关闭 | 删除 方法
     */
    const handleClose = function(file: any) {
      emit('handleClose', file);
    };

    return {
      handleClose,
      baseURL,
    };
  },
});
</script>
<style lang="scss">
@import '../assets/css/common'; /*引入公共样式*/

$img_close: url('../assets/images/icons/close.png'); // 图片-关闭

.task-image-layout {
  float: left;
  position: relative;

  .task-image_name {
    width: 1.18rem;
    height: 1.14rem;
    margin: 0.12rem;
    display: block;
  }

  .task-image_img-close {
    width: 0.28rem;
    height: 0.28rem;
    background-image: $img_close;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 0rem;
    top: 0rem;
    z-index: 1;
  }
}
</style>
