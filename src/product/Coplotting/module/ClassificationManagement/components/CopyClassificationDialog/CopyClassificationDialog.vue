<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="复制"
    width="650px"
    :before-close="handleClose"
  >
    <main :class="$style.main">
      <span>选择文件夹：</span>
      <ElSelect
        v-model="selectedFolderId"
        class="sv-select"
        placeholder="请选择"
        style="width: 310px"
        popper-class="sv-select__popper"
      >
        <ElOption
          v-for="item in folderList"
          :key="item.id"
          :label="item.fileName"
          :value="item.id"
          :disabled="!isBasic.value && item.fileType !== 3"
        />
      </ElSelect>
    </main>
    <footer :class="$style.footer">
      <ElButton
        v-if="selectedFolderId"
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
import { defineComponent } from 'vue';

export default defineComponent({
  inject: [
    'isBasic',
  ],
  props: {
    folderList: {
      type: Array,
      required: true,
    },
  },
  emits: [
    'save',
  ],
  data() {
    return {
      showDialog: false,
      templateList: [] as any[],
      selectedFolderId: null as any,
    };
  },
  methods: {
    open() {
      this.showDialog = true;
    },
    handleClose() {
      this.showDialog = false;
      this.selectedFolderId = null;
    },
    handleSave() {
      this.$emit('save', this.selectedFolderId);
      this.handleClose();
    },
  },
});
</script>

<style lang="scss" module>
.main {
  padding: 20px 0 20px 140px;
}
// 底部按钮
.footer {
  text-align: right;
  padding-right: 20px;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #E9ECF1;
}
</style>
