<template>
  <div :class="$style.container">
    <!-- 1. 会议标题 -->
    <h3>
      <span
        v-if="data?.meetingStatus === 0"
        :class="$style.meetingEnded"
      >已结束</span>
      <span v-else-if="data?.meetingStatus === 1">会议中</span>
      <template v-if="!isEditting">
        <span :class="$style.title">{{ data?.title || '暂无数据' }}</span>
        <button @click="isEditting = true;" />
      </template>
      <EditInput
        v-else
        placeholder="请输入会议名称"
        :value="data?.title"
        @confirm="handleUpdateTitle"
        @cancel="isEditting = false;"
      />
    </h3>
    <!-- 2. 开始时间、持续时间与发起人 -->
    <p>
      <span>开始时间：<span style="font-weight: 500;">{{ data?.startTime || '-' }}</span></span>
      <span>会议时长：<span style="font-weight: 500;">{{ formatDuration(data?.duration) }}</span></span>
      <span>发起人：<span style="font-weight: 500;">{{ data?.createUserName || '-' }}</span></span>
    </p>
    <!-- 3. 会议中-邀请按钮 -->
    <button
      v-if="data?.meetingStatus === 1"
      @click="$emit('invite');"
    >
      邀请入会
    </button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
} from 'vue';
import EditInput from '@/product/CommandBrain3.0/Generalparts/right/EditInput/EditInput.vue';
import { formatDuration } from '../../scripts/utils';

export default defineComponent({
  name: 'MeetingStatus',
  components: {
    EditInput,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'invite',
    'update',
  ],
  setup(props, { emit }) {
    // 标题正在编辑的flag
    const isEditting = ref(false);
    // 详情数据切换时重置编辑状态
    watch(() => props.data, () => {
      isEditting.value = false;
    });
    // 确定编辑修改
    function handleUpdateTitle(newTitle: string) {
      if (newTitle && newTitle !== props.data?.title) {
        emit('update', {
          title: newTitle,
        });
      }
    }
    return {
      formatDuration,
      isEditting,
      handleUpdateTitle,
    };
  },
});
</script>

<style lang="scss" module src="./styles/MeetingStatus.scss" />
