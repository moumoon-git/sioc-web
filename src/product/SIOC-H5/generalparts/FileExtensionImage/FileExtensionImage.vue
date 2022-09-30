<!--组件：文件类型图标 -->
<template>
  <div :class="'icon-' + fileType + '_' + fileColor"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import  $file  from './assets/js/file'
export default defineComponent({
  name: 'FileExtensionImage',
  props: {
    // 文件后缀
    extension: {
      type: String,
      default: 'file'
    },
    // 图标颜色 colored（彩色） | gray（灰色）
    fileColor: {
      type: String,
      default: 'colored'
    }
  },
  setup(props) {
    const file = $file.getExtensionImage(props.extension, 'colored') // 文件后缀
    const fileType = file.fileType; // 文件后缀
    return {
      fileType
    }
  }
})
</script>
<style lang="scss">
@import "./assets/css/fileExtensionImage";
</style>