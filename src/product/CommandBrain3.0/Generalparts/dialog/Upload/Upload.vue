<template>
  <div class="visualization-dialog-upload">
    <!-- 按钮 -->
    <button
      v-if="editable"
      @click="selectFiles"
    >
      附件上传
    </button>
    <!-- 已上传图片列表 -->
    <div
      v-viewer
      class="visualization-dialog-upload__img-list"
    >
      <template
        v-for="(img, imgIndex) in modelValue"
        :key="img.url"
      >
        <div v-if="isImage(img.name)">
          <img
            :src="baseURL + img.url"
            :title="img.name"
          >
          <!-- 删除按钮 -->
          <button
            v-if="editable"
            @click.stop="handleDeleteImg(imgIndex)"
          />
        </div>
      </template>
    </div>
    <!-- 已上传文件列表 -->
    <div class="visualization-dialog-upload__file-list">
      <template
        v-for="(file, fileIndex) in modelValue"
        :key="file.url"
      >
        <a
          v-if="!isImage(file.name)"
          :download="file.name"
          :href="baseURL + file.url"
          :title="file.name"
        >
          <span>{{ file.name }}</span>
          <button
            v-if="editable"
            @click.stop.prevent="handleDeleteImg(fileIndex)"
          />
        </a>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Upload',
  props: {
    // 文件列表
    modelValue: {
      type: Array,
      default: () => [] as {
        id: number,
        name: string,
        url: string,
      }[],
      required: true,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true,
    },
    // 允许的文件扩展名
    accept: {
      type: String,
      default: `image/*,
        video/*,
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
        application/vnd.ms-excel,
        application/msword,
        application/pdf`,
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true,
    },
    // 模块类型
    // （0：系统文件 1 事件附件  2 预案附件  3 任务附件 4 协同标绘  5 通讯调度）
    moduleType: {
      type: [String, Number],
      default: 3,
    },
  },
  emits: [
    'update:modelValue',
  ],
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
  methods: {
    /**
     * 点击选择文件
     */
    selectFiles() {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = this.multiple;
      input.accept = this.accept;
      input.onchange = () => {
        this.handleUpload(input.files as FileList);
        input.remove();
      };
      input.click();
    },
    /**
     * 上传文件
     *
     * @param {Array} files 文件列表
     */
    handleUpload(files: FileList) {
      if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
        formData.append('type', String(this.moduleType));
        const request = {
          method: 'post',
          service: 'file',
          url: '/appAttachment/fileUploadAttachments',
          headers: {
            'Content-Type': 'multipart/form-data ',
          },
          data: formData,
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            const resList = response.data || [];
            const fileList = [...this.modelValue];
            fileList.push(...resList.map((file: { id: number, title: string, url: string }) => ({
              id: file.id,
              name: file.title,
              url: file.url,
            })));
            this.$emit('update:modelValue', fileList);
          }
        });
      }
    },
    /**
     * 判断文件名是否为图片
     *
     * @param {String} fileName 文件名
     * @return {Boolean}
     */
    isImage(fileName: string): boolean {
      if (fileName?.match(/\.(svg|png|jpe?g|webp|gif)$/i)) {
        return true;
      }
      return false;
    },
    /**
     * 删除文件
     *
     * @param {Number} index 文件所在数组下标
     */
    handleDeleteImg(index: number) {
      const fileList = [...this.modelValue];
      fileList.splice(index, 1);
      this.$emit('update:modelValue', fileList);
    },
  },
});
</script>

<style lang="scss">
.visualization-dialog-upload {
  // 附件上传按钮
  & > button:first-child {
    color: #00C1DE;
    background: transparent;
    border: 1px solid currentColor;
    outline: none;
    height: 32px;
    vertical-align: middle;
    padding: 0 12px;
    cursor: pointer;
    &:hover {
      opacity: .7;
    }
  }
  // 图片列表
  &__img-list {
    display: flex;
    flex-wrap: wrap;
    // 图片容器
    & > div {
      display: inline-block;
      width: 130px;
      height: 130px;
      vertical-align: middle;
      position: relative;
      margin: 10px 10px 0 0;
      // 图片
      & > img {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        cursor: zoom-in;
      }
      // 删除按钮
      & > button {
        display: none;
        border: none;
        outline: none;
        width: 20px;
        height: 20px;
        position: absolute;
        top: -10px;
        right: -10px;
        cursor: pointer;
        background: no-repeat center/100% 100% url(./assets/delete.svg);
        &:hover {
          opacity: .7;
        }
      }
      &:hover > button {
        display: inline-block;
      }
    }
  }
  // 文件列表
  &__file-list {
    & > a {
      display: flex;
      align-items: center;
      color: #FFFFFF;
      text-decoration: none;
      margin-top: 10px;
      &:hover {
        background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0) 100%);
        & > button {
          display: inline-block;
        }
      }
      &::before {
        content: '';
        flex-shrink: 0;
        display: block;
        width: 14px;
        height: 14px;
        margin-right: 5px;
        background: no-repeat center/100% 100% url(./assets/file.svg);
      }
      & > span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      // 删除按钮
      & > button {
        flex-shrink: 0;
        display: none;
        width: 14px;
        height: 14px;
        cursor: pointer;
        border: none;
        outline: none;
        background: no-repeat center/100% 100% url(./assets/delete.svg);
        &:hover {
          opacity: .7;
        }
      }
    }
  }
}
</style>
