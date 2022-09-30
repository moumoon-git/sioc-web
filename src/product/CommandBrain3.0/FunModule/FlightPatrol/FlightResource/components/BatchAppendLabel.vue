<template>
  <div :class="$style.container">
    <div :class="$style.input">
      <EntityLabel
        v-model="selectedLabels"
        :type="LabelType.Monitor"
      />
    </div>
    <div :class="$style.footer">
      <span
        :class="$style.btn"
        @click="emit('close')"
      >取消</span>
      <span
        :class="$style.btn"
        @click="batchAppendLabel"
      >确定</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import EntityLabel from '@/product/CommandBrain3.0/Generalparts/dialog/LabelManagement/EntityLabel.vue';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue';
import { LabelItem, LabelType } from '@/product/CommandBrain3.0/Generalparts/dialog/LabelManagement/scripts/useLabelServices';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

const props = defineProps({
  deviceIds: {
    type: Array as PropType<number[]>,
    required: true,
  },
});

const emit = defineEmits(['close']);

const selectedLabels = ref<LabelItem[]>([]);

async function batchAppendLabel() {
  const request = {
    method: 'POST' as const,
    service: 'flight',
    url: '/device/applabeldevice/saveAll',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      deviceIds: props.deviceIds,
      labelIds: selectedLabels.value.map((item) => item.id),
    },
  };
  try {
    const response = await $http(request);
    if (response.code === 0) {
      $message.success('标签设置成功');
      emit('close');
    } else {
      throw Error(`代码${response.code}，${response.msg}`);
    }
  } catch (err) {
    $message.error(`标签设置失败，错误信息：${err}`);
  }
}
</script>

<style lang="scss" module>
.container {
  margin: -10px 10px 10px;
  z-index: 1;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.65);
  padding: 5px;
  display: flex;
  align-items: center;
  .btn {
    color: #56e9ff;
    cursor: pointer;
    margin: 0 5px;
    &:hover {
      opacity: .7;
    }
  }
  .footer {
    margin-left: auto;
    flex-shrink: 0;
    width: 80px;
  }
}
</style>
