<template>
  <div class="detail__dynamic">
    <div class="detail__dynamic__cards">
      <template v-for="(item, index) in dynamicData">
        <DynamicCard :dynamic-data="item" />
      </template>
    </div>
    <div class="detail__dynamic__send">
      <div class="detail__dynamic__send_panel">
        <div
          class="detail__dynamic__send__panelicon1"
          @click="selectImgFiles('img')"
        />
        <div
          class="detail__dynamic__send__panelicon2"
          @click="selectImgFiles('file')"
        />
        <!-- <div class="detail__dynamic__send__panelicon3" /> -->
      </div>
      <div v-viewer class="detail__dynamic__send__file">
        <div
          v-for="(item, index) in imageArr"
          :key="index"
          class="detail__dynamic__send__file__out"
        >
          <img :src="`${baseURL}${item.url}`" alt="" />
          <div
            class="delete__dynamic__send__file__img"
            @click="deleteImg(item.id, 'image', item.path)"
          />
        </div>

        <div
          v-for="(item, index) in videoArr"
          :key="index"
          class="detail__dynamic__send__file__out"
        >
          <video :src="`${baseURL}${item.url}`" />
          <div
            class="delete__dynamic__send__file__img"
            @click="deleteImg(item.id, 'video', item.path)"
          />
        </div>

        <p v-for="(item, index) in fileArr" :key="index">
          {{ item.name }}
        </p>
      </div>
      <div class="detail__dynamic__send_panel">
        <textarea
          id=""
          v-model="sendContent"
          placeholder="请输入信息"
          name=""
          cols="30"
          rows="5"
        />
      </div>
      <div class="detail__dynamic__send_panel__bottom">
        <div
          class="detail__dynamic__send_panel__btn"
          :class="{ 'detail__dynamic__send_panel__btn--no': !pointerFalse }"
          @click="submitInfo"
        >
          提交
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';
import DynamicCard from './components/DynamicCard.vue';
// import ImgCarousel from './components/ImgCarousel.vue';

export default defineComponent({
  name: 'TaskDynamic',
  components: { DynamicCard },
  props: {
    taskId: {
      type: Number,
      default: () => 0,
    },
    taskType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
      dynamicData: [], // 动态列表
      sendContent: '', // 发送的内容
      accept: 'image/*,.mp4', // 接收上传的图片类型
      fileAccept: `image/*,
        video/*,
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
        application/vnd.ms-excel,
        application/msword,
        application/pdf`, // 接收上传的文件类型
      multiple: false, // 是否开启多图上传
      imageArr: [] as any, // 显示的图片列表
      videoArr: [] as any, // 显示的视频列表
      fileArr: [] as any, // 显示的文件列表
      pointerFalse: true,
      unsubscribe: () => {},
    };
  },
  watch: {
    taskId: {
      handler(val, old) {
        console.log(this.taskId);
        this.getDynamicList();
      },
      deep: true,
      immediate: true,
    },
    taskType: {
      handler(val, old) {
        console.log(this.taskType);
        if (this.taskType === 'finished' || this.taskType === 'cancel') {
          this.pointerFalse = false;
        } else {
          this.pointerFalse = true;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.unsubscribe = (this as any).$ws.subscribe(
      '/topic/eventTask/dynamic',
      this.getDynamicList,
    );
  },
  beforeUnmount() {
    this.unsubscribe(); // 离开页面要退出websocket链接
  },
  methods: {
    getDynamicList() {
      const param = {
        taskId: this.taskId,
      };
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/event/task/getTaskDistributionResult',
        headers: {
          'Content-Type': 'application/json',
          token: 'PC_166c9588e794dc5c743e9b4ac731ad3e',
        },
        data: param,
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          // this.taskInfo = response.data
          this.dynamicData = response.data;
        })
        .catch((error: any) => {
          (this as any).$message.error(`获取任务动态失败，错误信息：${error}`);
        });
    },
    // 获取cookie的值
    getCookie(cname: string) {
      const name = `${cname}=`;
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return '';
    },
    submitInfo() {
      console.log(this.taskType);
      if (this.taskType === 'finished' || this.taskType === 'cancel') {
        (this as any).$message.error('任务已完成、不能发送动态');
        this.pointerFalse = false;
        return;
      }
      console.log(this.sendContent);
      const allFileIdArr = [
        ...this.imageArr,
        ...this.fileArr,
        ...this.videoArr,
      ];
      const allFileIds = [] as any;
      allFileIdArr.forEach((item) => {
        allFileIds.push(item.id);
      });
      console.log(allFileIds);
      if (this.sendContent === '' && allFileIds.length === 0) {
        (this as any).$message.error('任务内容为空');
        return;
      }
      const param = {
        taskId: this.taskId,
        data: {
          address:
            decodeURI(this.getCookie('platformName')) || '暂无地理位置信息',
          attachmentIds: allFileIds,
          content: this.sendContent,
          latitude: '',
          longitude: '',
        },
      };
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/event/task/reportDistributionResult',
        headers: {
          'Content-Type': 'application/json',
          token: 'PC_166c9588e794dc5c743e9b4ac731ad3e',
        },
        data: param,
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          this.getDynamicList();
          this.sendContent = '';
          this.imageArr = [];
          this.videoArr = [];
          this.fileArr = [];
        })
        .catch((error: any) => {
          (this as any).$message.error(`提交失败失败，错误信息：${error}`);
        });
    },
    // 图片上传 ，点击选择文件
    selectImgFiles(type: string) {
      if (type === 'img') {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = this.multiple;
        input.accept = this.accept;
        input.onchange = () => {
          this.handleUpload(input.files as FileList);
          input.remove();
        };
        input.click();
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        // input.multiple = this.multiple;
        input.accept = this.fileAccept;
        input.onchange = () => {
          this.handleFileUpload(input.files as FileList);
          input.remove();
        };
        input.click();
      }
    },
    handleUpload(files: FileList) {
      if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
        formData.append('type', '3'); // 任务附件传3
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
            resList.forEach(
              (file: {
                id: number;
                title: string;
                url: string;
                fileContentType: string;
                path: string;
                filename: string;
              }) => {
                if (file.fileContentType === 'video') {
                  this.videoArr.push({
                    name: file.title,
                    url: file.url,
                    id: file.id,
                    path: file.path + file.filename,
                  });
                } else {
                  this.imageArr.push({
                    name: file.title,
                    url: file.url,
                    id: file.id,
                    path: file.path + file.filename,
                  });
                }
              },
            );
          }
        });
      }
    },
    handleFileUpload(files: FileList) {
      if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
        formData.append('type', '3'); // 任务附件传3
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
            resList.forEach(
              (file: { id: number; title: string; url: string }) => {
                this.fileArr.push({
                  name: file.title,
                  url: file.url,
                  id: file.id,
                });
              },
            );
          }
        });
      }
    },
    returnType(list: any, type: any) {
      const arr: any = [];
      list.forEach((element: any) => {
        if (element?.dictionaryType?.code === type) {
          arr.push(element);
        }
      });
      return arr;
    },
    deleteImg(id: any, type: string, path: string) {
      console.log(path);
      if (type === 'image') {
        this.imageArr.forEach((element: any, index: any) => {
          if (element.id === id) {
            this.imageArr.splice(index, 1);
          }
        });
      }
      if (type === 'video') {
        this.videoArr.forEach((element: any, index: any) => {
          if (element.id === id) {
            this.videoArr.splice(index, 1);
          }
        });
      }
      const request = {
        method: 'post',
        // TODO 开发阶段接口域名
        service: 'file',
        url: `/appAttachment/delFile?id=${id}&path=${path}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0 && response.data) {
          console.log('删除成功');
        }
      });
    },
  },
});
</script>
<style lang="scss" src="./taskdynamic.scss"></style>
