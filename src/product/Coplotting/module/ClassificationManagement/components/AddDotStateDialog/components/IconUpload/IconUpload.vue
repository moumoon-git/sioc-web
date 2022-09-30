<template>
  <div
    :class="$style.container"
  >
    <!-- 列表为空时 -->
    <div
      v-if="!iconList?.length"
      :class="$style.empty"
    >
      <div :class="$style.emptyIcon" />
      <span>
        暂无自定义图标，
        <ElButton
          type="text"
          @click="selectFiles"
        >
          点击上传
        </ElButton>
      </span>
    </div>
    <div
      v-else
      style="height: 100%;"
    >
      <main :class="$style.list">
        <div
          v-for="icon in iconList"
          :key="icon.id"
          :class="[
            $style.icon,
            {
              [$style.selectedIcon]: icon.iconUrl && icon.iconUrl === selectedIcon?.iconUrl,
            }
          ]"
          :style="{
            backgroundImage: `url('${baseURL}${icon.iconUrl}')`
          }"
          :title="icon.iconName?.split('_')?.[1] || icon.iconName"
          @click="$emit('icon-click', icon)"
        >
          <button
            @click.stop.prevent="handleDelete(icon)"
          />
        </div>
      </main>
      <footer :class="$style.footer">
        <ElButton
          type="text"
          @click="handleDelete()"
        >
          清空
        </ElButton>
        <ElButton
          type="text"
          @click="selectFiles"
        >
          继续上传
        </ElButton>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'IconUpload',
  props: {
    // 自定义图标的类型id
    iconTypeId: {
      type: Number,
      required: true,
    },
    // 已选择的图标
    selectedIcon: {
      type: Object,
      default: null,
    },
  },
  emits: [
    'icon-click',
    'icon-delete',
  ],
  data() {
    return {
      // 图标列表
      iconList: [],
      baseURL: (window as any).config.baseURL,
    };
  },
  mounted() {
    this.getIconList();
  },
  methods: {
    /**
     * 获取自定义图标列表
     */
    getIconList(): void {
      this.iconList = [];
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisticon/listByType',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          iconTypeId: this.iconTypeId,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0 && response?.data?.data) {
          this.iconList = response?.data?.data;
        } else {
          ElMessage.error(`获取自定义图标列表失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取自定义图标列表失败，错误信息：${error}`);
      });
    },
    /**
     * 点击上传
     */
    selectFiles() {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      input.onchange = () => {
        this.handleUpload(input.files as FileList);
        input.remove();
      };
      input.click();
    },
    /**
     * 执行上传
     *
     * @param files 选择的文件列表
     */
    handleUpload(files: FileList) {
      if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
        formData.append('type', '4');
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
            resList.forEach((file: { id: number, title: string, url: string }) => {
              this.saveUploadIcon({
                id: file.id,
                name: file.title,
                url: file.url,
              });
            });
          } else {
            ElMessage.error(`上传失败，错误代码${response.errorcode}，错误信息：${response.msg}`);
          }
        }).catch((error: Error) => {
          ElMessage.error(`上传失败，错误信息：${error}`);
        });
      }
    },
    /**
     * 将返回的文件地址保存形成新的图标
     *
     * @param iconObj 图标对象
     */
    saveUploadIcon(iconObj: {id: number, name: string, url: string}) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisticon/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          iconTypeId: this.iconTypeId,
          iconUrl: iconObj.url,
          iconName: iconObj.name,
          status: 0,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.getIconList();
        } else {
          ElMessage.error(`上传失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      });
    },
    /**
     * 删除图标
     *
     * @param iconObj 图标对象，没有则全部删除
     */
    handleDelete(iconObj?: { id: number }) {
      const data: number[] = [];
      if (iconObj) {
        data.push(iconObj.id);
      } else {
        data.push(...this.iconList.map((item: { id: number }) => item.id));
      }
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisticon/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.getIconList();
          this.$emit('icon-delete', data);
        } else {
          ElMessage.error(`删除图标失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除图标失败，错误信息：${error}`);
      });
    },
  },
});
</script>

<style lang="scss" module>
.container {
  height: 100%;
}
// 空白页
.empty {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &Icon {
    width: 45px;
    height: 45px;
    background: no-repeat center/100% 100% url(./assets/upload-tips.svg);
  }
  & > span {
    color: #999999;
  }
}
// 单个图标
.icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  background: no-repeat center/100% 100%;
  position: relative;
  margin: 10px;
  cursor: pointer;
  // 删除按钮
  & > button {
    display: none;
    margin: 0;
    padding: 0;
    position: absolute;
    top: -5px;
    right: -5px;
    width: 12px;
    height: 12px;
    border: none;
    outline: none;
    border-radius: 100%;
    background: rgba(0, 0, 0, .58);
    cursor: pointer;
    color: white;
    overflow: hidden;
    &:hover {
      background: rgba(246, 110, 110, .8);
    }
    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 1px;
      background: #FFF;
      transform: rotate(45deg);
      position: absolute;
      left: 1px;
      top: 5px;
    }
    &::after {
      content: '';
      display: block;
      width: 10px;
      height: 1px;
      background: #FFF;
      transform: rotate(-45deg);
      position: absolute;
      left: 1px;
      top: 5px;
    }
  }
  &:hover > button {
    display: block;
  }
  &.selectedIcon::after,
  &:hover::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 5px;
    background: #0091FF;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
}
// 图标列表
.list {
  height: calc(100% - 30px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
// 底部按钮
.footer {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
}
</style>
