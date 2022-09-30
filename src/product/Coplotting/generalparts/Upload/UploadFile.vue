<template>
  <div :class="$style.UploadFile">
    <!-- 上传文件的按钮 -->
    <input
      ref="fileUpload"
      :multiple="multiple"
      type="file"
      :accept="accept"
      @change="getUploadFile"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, watch } from 'vue';
import upFile from './upFile';

export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    result: {
      type: String,
      default: 'res', // res or file 二进制
    },
    accept: {
      type: String,
      default: `
        image/*,
        video/*,
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
        application/vnd.ms-excel,
        application/msword,
        application/pdf`,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http, $message }: any =
      instance?.appContext.config.globalProperties;
    // 上传后的文件回显数据
    const echo = ref<any>({ txt: [], videoAndImg: [] });
    const {
      // 上传文件的el
      fileUpload,
      // 激活input进行 上传文件选择 ★
      uploadFile,
      // 进行文件上传
      getUploadFile,
    } = upFile($http, 4, echo, props.result, $message, 4);
    function sendData(params: any) {
      context.emit('sendMsg', params);
    }
    watch(echo.value, (newV) => {
        console.log(newV);
      sendData(newV);
    });
    return {
      fileUpload,
      uploadFile,
      getUploadFile,
      echo,
    };
  },
});
</script>

<style lang="scss" module>
.UploadFile {
  display: none;
}
</style>
