<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="新增属性"
    width="650px"
    :before-close="handleClose"
  >
    <ElForm
      :class="[
        'sv-form',
        $style.form,
      ]"
      label-position="right"
      label-width="200px"
      style="margin-top: 10px;"
    >
      <ElFormItem
        label="属性名称"
      >
        <ElInput
          v-model="propName"
          class="sv-input"
          placeholder="请输入属性名称"
          style="width: 70%;"
          clearable
        />
      </ElFormItem>
      <ElFormItem
        label="属性类型"
      >
        <ElSelect
          v-model="selectType"
          class="sv-select"
          placeholder="请选择属性类型"
          style="width: 70%;"
          popper-class="sv-select__popper"
        >
          <ElOption
            label="文本"
            :value="0"
          />
          <ElOption
            label="数值"
            :value="1"
          />
          <ElOption
            label="日期"
            :value="2"
          />
          <ElOption
            label="电话"
            :value="3"
          />
          <ElOption
            label="终端号"
            :value="4"
          />
          <ElOption
            label="下拉选项"
            :value="5"
          />
          <ElOption
            label="时间"
            :value="6"
          />
        </ElSelect>
        <!-- 下拉选项 -->
        <OptionList
          v-show="selectType === 5"
          ref="OptionListRef"
          style="width: 315px; margin-left: 5px;"
        />
      </ElFormItem>
      <ElFormItem
        v-if="/* 数值类型才显示单位 */selectType === 1"
        label="单位"
      >
        <ElInput
          v-model="workplace"
          class="sv-input"
          placeholder="请输入单位"
          style="width: 70%;"
          clearable
        />
      </ElFormItem>
      <!-- 2021-07-20 其他模块搜索功能仍未实现，先隐藏 -->
      <!-- <ElFormItem
        label="设为搜索项"
      >
        <ElSwitch
          v-model="searchable"
        />
      </ElFormItem> -->
    </ElForm>
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
import OptionList from './components/OptionList/OptionList.vue';

export default defineComponent({
  name: 'AddPropDialog',
  components: {
    // 下拉选项列表
    OptionList,
  },
  emits: [
    'save',
  ],
  setup(props, { emit }) {
    // 显示弹窗
    const showDialog = ref(false);
    // 属性名称
    const propName = ref('');
    // 属性类型
    const selectType = ref(0);
    // 单位
    const workplace = ref('');
    // 是否设为搜索项
    const searchable = ref(false);
    // 选项列表
    const OptionListRef = ref<any>(null);
    // 正在编辑的属性项下标，-1为新增
    const edittingIndex = ref(-1);
    // 打开弹窗
    const open = (edit?: any) => {
      edittingIndex.value = -1;
      if (edit) {
        edittingIndex.value = edit.index;
        propName.value = edit.propName;
        selectType.value = edit.selectType;
        workplace.value = edit.workplace;
        searchable.value = edit.searchable;
        setTimeout(() => {
          if (OptionListRef.value) {
            OptionListRef.value.list = edit.options.map((item: any) => ({
              value: item.dictValue,
            }));
          }
        }, 0);
      }
      showDialog.value = true;
    };
    // 关闭弹窗
    const handleClose = () => {
      propName.value = '';
      selectType.value = 0;
      workplace.value = '';
      showDialog.value = false;
      searchable.value = false;
      if (OptionListRef.value) {
        OptionListRef.value.list = [];
      }
    };
    // 保存
    const handleSave = () => {
      if (!propName.value) {
        ElMessage.error('请输入属性名称');
        return;
      }
      const emittedVal = {
        propName: propName.value,
        selectType: selectType.value,
        workplace: selectType.value === 1 ? workplace.value : '',
        searchable: searchable.value,
        options: OptionListRef.value?.list,
        index: edittingIndex.value,
      };
      emit('save', emittedVal);
      handleClose();
    };
    return {
      showDialog,
      open,
      propName,
      selectType,
      workplace,
      searchable,
      handleSave,
      handleClose,
      OptionListRef,
    };
  },
});
</script>

<style lang="scss" module src="./styles/AddPropDialog.scss" />
