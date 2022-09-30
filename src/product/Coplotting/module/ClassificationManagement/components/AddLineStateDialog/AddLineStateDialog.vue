<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="线分类-新增状态"
    width="650px"
    :before-close="handleClose"
  >
    <ElForm
      class="sv-form"
      label-position="right"
      label-width="200px"
      style="margin-top: 10px;"
    >
      <ElFormItem
        label="分类样式"
      >
        <ElRadioGroup v-model="styleType">
          <ElRadio :label="0">
            纯色填充
          </ElRadio>
          <!-- TODO: R2 再开放 -->
          <ElRadio
            :label="1"
            disabled
          >
            纹理填充（功能未开放）
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem
        label="颜色"
      >
        <ElColorPicker
          v-model="fillColor"
          class="sv-color-picker"
          popper-class="sv-color-picker-popper"
        />
      </ElFormItem>
      <ElFormItem
        v-if="styleType === 0"
        label="虚实线"
      >
        <ElRadioGroup v-model="lineType">
          <ElRadio :label="0">
            虚线
          </ElRadio>
          <ElRadio
            :label="1"
            style="margin-left: 28px;"
          >
            实线
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem
        label="填充透明度"
      >
        <ElSlider
          v-model="fillOpacity"
          class="sv-slider"
          style="width: 346px;"
          show-input
          :min="15"
        />
      </ElFormItem>
      <ElFormItem
        label="粗细"
      >
        <ElSelect
          v-model="lineHeight"
          class="sv-select"
          popper-class="sv-select__popper"
          style="width: 188px;"
        >
          <ElOption
            label="2px"
            :value="2"
          />
          <ElOption
            label="4px"
            :value="4"
          />
          <ElOption
            label="6px"
            :value="6"
          />
          <ElOption
            label="8px"
            :value="8"
          />
          <ElOption
            label="10px"
            :value="10"
          />
          <ElOption
            label="12px"
            :value="12"
          />
          <ElOption
            label="14px"
            :value="14"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        label="分类状态"
      >
        <ElInput
          v-model="statusName"
          class="sv-input"
          style="width: 188px; margin-right: 10px;"
          autofocus
        />
        <ElCheckbox
          v-model="isDefault"
          label="设为默认状态"
        />
      </ElFormItem>
    </ElForm>
    <div :class="$style.preview">
      <span>样式预览</span>
      <div :style="stylePreview" />
    </div>
    <footer :class="$style.footer">
      <ElButton
        class="sv-button"
        type="primary"
        @click="handleSave"
      >
        保存
      </ElButton>
      <ElButton
        class="sv-button"
        @click="handleClose"
      >
        取消
      </ElButton>
    </footer>
  </ElDialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';
import useState from './scripts/useState';

export default defineComponent({
  name: 'AddLineStateDialog',
  emits: [
    'save',
  ],
  setup(props, { emit }) {
    // 显示弹窗
    const showDialog = ref(false);
    const edittingIndex = ref(-1);
    // 管理状态值
    const {
      stylePreview,
      fillOpacity,
      lineType,
      lineHeight,
      fillColor,
      styleType,
      statusName,
      isDefault,
      resetState,
    } = useState;
    // 关闭弹窗
    const handleClose = () => {
      resetState();
      showDialog.value = false;
    };
    // 保存
    const handleSave = () => {
      if (!statusName.value) {
        ElMessage.error('请输入分类状态');
        return;
      }
      emit('save', {
        index: edittingIndex.value,
        name: statusName.value,
        isDefault: isDefault.value,
        fillOpacity: fillOpacity.value,
        styleType: styleType.value,
        fillColor: fillColor.value,
        lineType: lineType.value,
        lineHeight: lineHeight.value,
      });
      handleClose();
    };
    // 打开弹窗
    const open = (data?: any) => {
      edittingIndex.value = -1;
      if (data) {
        edittingIndex.value = data.index;
        statusName.value = data.statusType;
        isDefault.value = Boolean(data.isDefault);
        fillOpacity.value = data?.stylePropertyEntity?.fillOpacity || 70;
        styleType.value = data?.stylePropertyEntity?.styleType || 0;
        fillColor.value = data?.stylePropertyEntity?.fillColor || '#0091FF';
        lineType.value = data?.stylePropertyEntity?.lineType || 0;
        lineHeight.value = data?.stylePropertyEntity?.lineHeight || 4;
      }
      showDialog.value = true;
    };
    return {
      showDialog,
      open,
      stylePreview,
      fillOpacity,
      lineType,
      lineHeight,
      fillColor,
      styleType,
      statusName,
      isDefault,
      resetState,
      handleClose,
      handleSave,
    };
  },
});
</script>

<style lang="scss" module src="./styles/AddLineStateDialog.scss" />
