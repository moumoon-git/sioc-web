// 查看分类详情弹窗
<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="分类点详情"
    width="800px"
  >
    <div :class="$style.container">
      <label :class="$style.label">模板类型</label>
      <ElInput
        :model-value="templateType?.templateName"
        class="sv-input"
        style="width: 250px;"
        disabled
      />
      <FormDetail
        :selected-class="selectedClass"
        :use-folder-name="true"
      />
    </div>
  </ElDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormDetail from '../../../ClassificationManagement/components/FormDetail/FormDetail.vue';

export default defineComponent({
  name: 'LookupClassificationDialog',
  components: {
    FormDetail,
  },
  props: {
    // 模板类型
    templateType: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showDialog: false,
      selectedClass: null as any,
    };
  },
  methods: {
    open(id: number) {
      this.showDialog = true;
      this.selectedClass = { id };
    },
  },
});
</script>

<style lang="scss" module>
.container {
  margin: 20px 0 0 200px;
  padding-bottom: 10px;
  .label {
    display: inline-block;
    width: 87px;
    text-align: right;
    margin-right: 18px;
    margin-bottom: 30px;
  }
}
</style>
