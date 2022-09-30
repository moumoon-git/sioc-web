<template>
  <CardWrapper style="height: 320px;">
    <template #title>
      <h3 :class="$style.title">
        会议纪要
      </h3>
      <button
        v-if="!isEditting"
        :class="$style.textButton"
        @click="isEditting = true;"
      >
        编辑
      </button>
      <template v-else>
        <button
          :class="$style.textButton"
          @click="handleSave"
        >
          保存
        </button>
        <button
          :class="$style.textButton"
          style="color: #FFF; margin-left: -2px;"
          @click="handleCancel"
        >
          取消
        </button>
      </template>
    </template>
    <template #default>
      <div :class="$style.log">
        <textarea
          v-model="logText"
          :class="$style.text"
          :disabled="!isEditting"
          :style="!isEditting && 'border: none;'"
        />
        <Upload
          v-model="attachmentList"
          :editable="isEditting"
          module-type="5"
          style="margin: 10px;"
        />
      </div>
    </template>
  </CardWrapper>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  Ref,
  toRefs,
  watch,
  getCurrentInstance,
} from 'vue';
import Upload from '@/product/CommandBrain3.0/Generalparts/dialog/Upload/Upload.vue';
import CardWrapper from '../../components/CardWrapper/CardWrapper.vue';
import { isImg } from '../../scripts/utils';

interface Attachment {
  name: string,
  url: string,
  id: number,
}

export default defineComponent({
  name: 'MeetingLog',
  components: {
    Upload,
    CardWrapper,
  },
  props: {
    attachments: {
      type: Array,
      required: true,
    },
    log: {
      type: String,
      required: true,
    },
    meetingId: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'update',
  ],
  setup(props, { emit }) {
    const { $http, $message }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const { attachments, log, meetingId } = toRefs(props);
    const logText = ref('');
    const attachmentList = ref<Attachment[]>([]);
    const isEditting = ref(false);
    watch(log, (newVal) => {
      logText.value = newVal;
      isEditting.value = false;
    }, {
      immediate: true,
    });
    watch(attachments, (newVal: any) => {
      attachmentList.value = newVal?.map((i: any) => ({
        name: i?.fileOriginalName,
        url: i?.fileUrl,
        id: i?.appAttachmentId,
      })) || [];
      isEditting.value = false;
    }, {
      immediate: true,
    });
    const isLoading = inject<Ref<number>>('isLoading');
    function handleSave() {
      const request = {
        method: 'post',
        service: 'flight',
        url: '/meeting/csMeetingFile/addMeetingFile',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          meetingId: meetingId.value,
          fileInfos: attachmentList.value.map((file: Attachment) => ({
            appAttachmentId: file.id,
            fileType: isImg(file.url) ? 1 : 2,
          })),
        },
      };
      isLoading!.value += 1;
      $http(request).then((response: any) => {
        if (response.code === 0) {
          // update log
          emit('update', {
            remark: logText.value,
          });
        } else {
          $message.error(`保存附件失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`保存附件失败，错误信息：${error}`);
      }).finally(() => {
        isLoading!.value -= 1;
      });
    }
    function handleCancel() {
      isEditting.value = false;
      attachmentList.value = attachments.value?.map((i: any) => ({
        name: i?.fileOriginalName,
        url: i?.fileUrl,
        id: i?.appAttachmentId,
      })) || [];
      logText.value = log.value;
    }
    return {
      logText,
      attachmentList,
      isEditting,
      handleSave,
      handleCancel,
    };
  },
});
</script>

<style lang="scss" module>
.title {
  font-size: 16px;
  font-weight: 500;
  margin-left: 10px;
  &::before {
    content: '';
    display: inline-block;
    width: 21px;
    height: 21px;
    vertical-align: -5px;
    background: no-repeat center/100% 100% url(./assets/icon-log.svg);
  }
}
.textButton {
  background: none;
  border: none;
  outline: none;
  color: #56E9FF;
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: filter .3s;
  margin-left: auto;
  margin-right: 20px;
  &:hover {
    filter: brightness(110%);
  }
  &:active {
    filter: brightness(90%);
  }
}
.log {
  box-sizing: border-box;
  width: 100%;
  font-size: 0;
  .text {
    color: #FFF;
    margin: 0;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    resize: none;
    outline: none;
    background: none;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, .15);
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
}
</style>
