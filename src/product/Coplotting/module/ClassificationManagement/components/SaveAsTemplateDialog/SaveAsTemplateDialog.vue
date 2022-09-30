<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="存为模板"
    width="650px"
    :before-close="handleClose"
  >
    <main :class="$style.main">
      <span>选择模板：</span>
      <ElSelect
        v-model="selectedTemplateId"
        class="sv-select"
        placeholder="请选择"
        style="width: 310px"
        popper-class="sv-select__popper"
      >
        <ElOption
          v-for="item in templateList"
          :key="item.id"
          :label="item.templateName"
          :value="item.id"
        />
      </ElSelect>
    </main>
    <footer :class="$style.footer">
      <ElButton
        v-if="selectedTemplateId"
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
import { ElMessage } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    classId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showDialog: false,
      templateList: [] as any[],
      selectedTemplateId: null as any,
    };
  },
  mounted() {
    this.getTemplateList();
  },
  methods: {
    open() {
      this.showDialog = true;
    },
    handleClose() {
      this.showDialog = false;
      this.selectedTemplateId = null;
    },
    getTemplateList() {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assisttemplatetype/list',
      };
      (this as any).$http(request).then((response: any) => {
        this.templateList = response.data || [];
      });
    },
    handleSave() {
      if (this.selectedTemplateId && this.classId) {
        const request = {
          method: 'post',
          service: 'coplotting',
          url: '/assist/assisttemplatebasicclassrelated/save',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            templateTypeId: this.selectedTemplateId,
            classIds: [this.classId],
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.code === 0) {
            ElMessage.success('保存成功');
            this.handleClose();
          } else {
            ElMessage.error(`存为模板失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error: Error) => {
          ElMessage.error(`存为模板失败，错误信息：${error}`);
        });
      }
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
