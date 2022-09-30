// 标注列表组件
<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="新建分组"
    :width="380"
  >
    <div class="newGroupContent">
      <div class="newGroupContent__labelName">
        分组名称：
      </div>
      <el-input
        v-model="inputValue"
        placeholder="请输入内容"
      />
    </div>

    <footer class="newGroupContent__footer">
      <ElButton
        class="sv-button"
        type="primary"
        @click="newGroupFun"
      >
        确认
      </ElButton>
      <ElButton
        class="sv-button"
        @click="showDialog = false"
      >
        取消
      </ElButton>
    </footer>
  </ElDialog>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance, reactive,
} from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export default defineComponent({
  props: {},
  setup(props, context) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const store = useStore(); // 使用vuex
    // 打开弹窗
    const showDialog = ref(false);
    const open = () => {
      showDialog.value = true;
    };
    const close = ():void => {
      showDialog.value = false;
    };
    return {
        showDialog,
        open,
        close
    };
  },
});
</script>

<style lang="scss">

</style>
