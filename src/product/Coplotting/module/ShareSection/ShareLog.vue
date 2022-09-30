// 分享记录
<template>
  <ElDialog
    v-model="showDialog"
    :modal="false"
    custom-class="sv-dialog"
    title="分享记录"
    center
    :width="533"
  >
    <div class="shareLogSection">
      <el-table
        :data="publicShareData"
        style="width: 100%"
      >
        <el-table-column
          label="创建时间"
          width="120"
        >
          <template #default="scope">
            <span style="margin-left: 10px">{{ scope.row.createTime.substring(5, 16) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="分享权限"
          width="100"
        >
          <template #default="scope">
            <SelectCheck
              :is-disabled="true"
              :group-info="dealGroupData(scope.row.groupIds)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="访问密码"
          width="100"
        >
          <template #default="scope">
            <span style="margin-left: 10px">{{ scope.row.needPassword===0?'无需密码':scope.row.password }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="有效期"
          width="100"
        >
          <template #default="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.expired }}天</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <span
              class="copySpan"
              @click="handleEdit(scope.$index, scope.row)"
            />
            <span
              class="deleteSpan"
              @click="handleDelete(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <input
      id="shareLogLink"
      :value="shareLogLinkIngo"
    >
  </ElDialog>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance,
} from 'vue';
import { ElMessage } from 'element-plus';
import SelectCheck from '@/product/Coplotting/module/ShareSection/components/SelectCheck.vue'; // 下拉选择复选框组件
import usePublicShare from './script/usePublicShare'; // 公共分享

export default defineComponent({
  components: {
    SelectCheck, // 下拉选择复选框组件
  },
  props: {
    publicShareData: {
      type: Array,
      default: [],
    },
    publicShareGroupData: {
      type: Array,
      default: [],
    },
  },
  emits: ['refreshShareLogsEmit'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const {
      deletePublicShareLog,
    } = usePublicShare($http);
    const showDialog = ref(false);
    // 打开
    const open = () => {
      showDialog.value = true;
    };
    // 关闭
    const close = () => {
      showDialog.value = false;
    };
    // 处理数据
    const dealGroupData = (nowArr: any) => {
      const tempAllArr = JSON.parse(JSON.stringify(props.publicShareGroupData));
      tempAllArr.forEach((element: any) => {
        if (nowArr.includes(element.id)) {
          element.check = true;
        } else {
          element.check = false;
        }
      });
      return tempAllArr;
    };
    // 复制链接
    const shareLogLinkIngo = ref(''); // 链接地址
    const handleEdit = (index: any, row: any) => {
      const input: any = document.getElementById('shareLogLink');
      input.value = row.url; // 修改文本框的内容
      input.select(); // 选中文本
      document.execCommand('Copy'); // 执行浏览器复制命令
      ElMessage.success({
        message: '复制成功',
        type: 'success',
      });
    };
    // 删除记录
    const handleDelete = async (index: any, row: any) => {
      await deletePublicShareLog(row.id);
      emit('refreshShareLogsEmit');
    };
    return {
      showDialog,
      open,
      close,
      handleEdit,
      handleDelete,
      dealGroupData,
      shareLogLinkIngo,
    };
  },
});
</script>
<style lang="scss" src="./style/ShareLog.scss"></style>
