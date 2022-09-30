<template>
  <!-- ElButton -->
  <div>
    <ElButton class="sv-button" size="small">default-small</ElButton>
    <ElButton class="sv-button" size="small" type="primary">primary-small</ElButton>
    <ElButton class="sv-button">default</ElButton>
    <ElButton class="sv-button" type="primary">primary</ElButton>
  </div>
  <!-- ElInput -->
  <div>
    <ElInput class="sv-input" v-model="value" placeholder="请输入" clearable style="width: 200px;" />
    <ElInput class="sv-input--search" v-model="value" placeholder="请输入" clearable style="width: 200px;" suffix-icon="el-icon-search"/>
  </div>
  <!-- ElDialog -->
  <div>
    <ElButton class="sv-button" @click="dialogVisible = true">open dialog</ElButton>
    <ElDialog title="sv-dialog" custom-class="sv-dialog" v-model="dialogVisible">
      padding: 0;
    </ElDialog>
  </div>
  <!-- ElSelect -->
  <div>
    <ElSelect class="sv-select" popper-class="sv-select__popper" v-model="selectValue" clearable >
      <ElOption
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </ElSelect>
    <ElSelect class="sv-select" popper-class="sv-select__popper" v-model="selectValue" clearable disabled>
      <ElOption
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </ElSelect>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const value = ref('test');
const dialogVisible = ref(false);
const selectValue = ref(null);
const options = ref([{
  value: '选项1',
  label: '黄金糕',
}, {
  value: '选项2',
  label: '双皮奶',
}, {
  value: '选项3',
  label: '蚵仔煎',
}, {
  value: '选项4',
  label: '龙须面',
}, {
  value: '选项5',
  label: '北京烤鸭',
}]);
</script>

<script>
// import {
//   ElButton,
//   ElInput,
//   ElDialog,
//   ElSelect,
//   ElOption,
// } from 'element-plus';
// import 'element-plus/lib/theme-chalk/index.css';

export default {
  name: 'Element',
  // components: {
  //   ElButton,
  //   ElInput,
  //   ElDialog,
  //   ElSelect,
  //   ElOption,
  // },
};
</script>

<style lang="scss" src="./styles/index.scss"></style>
