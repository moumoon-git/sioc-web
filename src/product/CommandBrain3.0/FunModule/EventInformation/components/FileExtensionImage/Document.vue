<!-- 组件：文件图标 + 文件名字 + 删除按钮 -->
<template>
  <div class="document-list-layout">
    <!-- 文件图标 -->
    <FileExtensionImage
      :extension="file.extension"
      :fileColor="fileColor"
    />
    <!-- 文件名字 -->
    <div class="document_name" :style="{'color': color}" @click="downloadFile(file)">{{ file.name ? file.name: file.title }}</div>
    <!-- 删除按钮 -->
    <div v-if="showClose" class="document_img-close" @click="handleClose(file)"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FileExtensionImage from "./FileExtensionImage.vue";
import $file from './assets/js/file'
export default defineComponent({
  components: {
    FileExtensionImage
  },
  name: 'Document',
  props: {
    // 文件数据
    file: {
      type: Object,
      default: () => {
        return {
          // id: "", // 文件ID
          // name: "", // 文件名字
          // url: "", // 文件路径
          // size: "", // 文件大小
          // extension: "", // 文件后缀
        }
      }
    },

    // 'colored'彩色图标 | 'gray'灰色图标
    fileColor: {
      type: String,
      default: 'colored'
    },
    
    // 是否显示 关闭 | 删除 按钮
    showClose: {
      type: Boolean,
      default: false
    },

    // 文件名字的颜色
    color: {
      type: String,
      default: '#ffffff'
    },

    // 是否点击文件下载
    download: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    handleClose: null
  },
  setup(props, {emit}) {
    /**
     * @param {Object} file 文件数据
     * @description 关闭 | 删除 方法
     */
    function handleClose(file: any) {
      emit('handleClose', file);
    }

    /**
     * @param {Object} item 文件数据
     * @description 下载
     */
    function downloadFile(item: any) {
      if (props.download) {
        let path = (window as any).config.baseURL + item.url;
        $file.downloadFile(path, item.name);
      } 
    }

    return {
      handleClose,
      downloadFile
    }
  }
})
</script>
<style lang="scss">
@import "./assets/css/document";
</style>