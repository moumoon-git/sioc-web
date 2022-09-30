<template>
  <main>
    <section class="upload-file">
      <label class="upload-file__label">上传附件</label>
      <van-uploader v-model="fileList" :after-read="afterRead" style="position:relative;">
        <div class="upload-wrap">
          <i class="upload-camera-icon"></i>
          <label class="upload-camera-label">上传附件</label>
        </div>
      </van-uploader>
    </section>
    <section class="remark">
      <label class="remark__label">备注说明</label>
      <input type="text" placeholder="请在此输入任务说明" v-model="remark">
    </section>
  </main>
  <footer :style="{'border-top': (remark||fileList.length!==0)?'0.01rem solid rgba(221, 221, 221, 0.3)':''}">
    <div :class="[remark||fileList.length!==0?'confirm-button__active':'confirm-button']" @click="confirm">确定</div>
    <div class="cancel-button" @click="router.go(-1)">取消</div>
  </footer>
</template>
<script>
import { defineComponent, ref, watch, getCurrentInstance, computed } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'

export default defineComponent({
  name: 'CompleteCancelTask',
  components: {
  },
  props: {
  },
  emits: [
  ],
  setup(prop, context) {
    // 获取路由器实例
    const router = useRouter();
    const task = JSON.parse(sessionStorage.getItem('taskObj')); // 任务id
    // 上传文件数组
    const fileList = ref([
    ]);
    // 备注说明
    const remark = ref('');
    return {
      router,
      task,
      fileList,
      remark,
    };
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    // 文件上传完毕回调函数
    afterRead(file) {
      file.status = 'uploading';
      file.message = '上传中...';
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('type', '3');
      const request = {
        method: 'post',
        url: '/fileupload/appAttachment/fileUploadAttachment',
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
        data: formData,
      };
      this.$http(request)
        .then((response) => {
          console.log('/appAttachment/fileUploadAttachment', response);
          if (response.errorcode === 0 && response?.data) {
            file.status = '';
            file.message = '';
            file.data=response.data;
          } else {
            file.status = 'failed';
            file.message = '上传失败';
          }
        }).catch((error) => {
          file.status = 'failed';
          file.message = '上传失败';
        });
    },
    // 确定提交反馈
    confirm() {
      if (!this.remark && this.fileList.length === 0) {
        return false;
      }
      const request = {
        method: 'post',
        url: '/app/task/setTaskStatus',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          taskId: this.task.taskId,
          operation: this.task.operation,
          data: {
            address: this.task.taskAddress,
            attachmentIds: this.fileList.map(item=>{return item.data.id}),
            content: this.remark,
            cgcsLatitude: this.task.taskLatitude,
            cgcsLongitude: this.task.taskLongitude,
            latitude: this.task.taskLatitude,
            longitude: this.task.taskLongitude,
          },
        },
      };
      this.$http(request)
        .then((response) => {
          console.log('/app/task/setTaskStatus', response);
          if (response.errorcode === 0) {
            this.$notify({
              type: 'success',
              message: '任务反馈成功',
            });
            this.router.go(-1);
          } else {
            this.$notify({
              type: 'danger',
              message: `任务反馈失败，错误代码${response.code}，错误信息：${response.msg}`,
            });
          }
        }).catch((error) => {
          this.$notify({
            type: 'danger',
            message: `任务反馈失败`,
          });
        });
    },
  },
});
</script>
<style lang='scss' scoped>
  main {
    > section {
        overflow: auto;
        padding: 0rem 4%;
        margin: 0.05rem 0rem;
    }
    .upload-file {
        margin: 0.1rem 0rem;
        position: relative;
      .upload-file__label {
        color: #333333;
        font-size: 0.3rem;
        font-weight: 500;
        display: block;
        margin: 0.1rem 0rem;
      }
      &::after {
        content: "";
        width: 100%;
        height: 0.01rem;
        background: rgba(221, 221, 221, 0.3);
        display: block;
        margin: auto;
        margin-top: 0.1rem;
      }
      .van-uploader {
        .upload-wrap {
          width: 1.55rem;
          height: 1.55rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 0.01rem solid #CCCCCC;
          border-style: dashed;
          .upload-camera-icon {
            cursor: pointer;
            width: 0.3rem;
            height: 0.3rem;
            display: inline-block;
            background: url(../assets/uploadCameraIcon.svg) no-repeat 0rem/0.3rem;
          }
          .upload-camera-label {
            margin-top: 0.05rem;
            color: #999999;
          }
        }
      }
    }
    .remark {
        margin: 0.1rem 0rem;
        position: relative;
        .remark__label {
            color: #333333;
            font-size: 0.3rem;
            font-weight: 500;
            display: block;
            margin: 0.1rem 0rem;
        }
        input {
            border: transparent;
            input::-webkit-input-placeholder {
                color: #CCCCCC;
            }
        }
    }
  }
  footer {
    position: fixed;
    bottom: 0%;
    width: 100%;
    .confirm-button {
        cursor: pointer;
        color: #FFFFFF;
        background: #D8D8D8;
        border-radius: 0.75rem;
        text-align: center;
        width: 80%;
        width: 80%;
        font-size: 0.35rem;
        padding: 0.2rem;
        margin: 0.2rem auto;
        &__active {
            cursor: pointer;
            background: linear-gradient(360deg, #2B80FF 0%, #65BCFF 100%);
            box-shadow: 0rem 0.06rem 0.12rem 0rem rgba(12, 126, 161, 0.35);
            border-radius: 0.75rem;
            color: #FFFFFF;
            text-align: center;
            width: 80%;
            width: 80%;
            font-size: 0.35rem;
            padding: 0.2rem;
            margin: 0.2rem auto;
        }
    }
    .cancel-button {
        cursor: pointer;
        color: #666666;
        font-size: 0.35rem;
        text-align: center;
        margin: 0.2rem auto;
    }
  }
</style>
