<template>
  <ModalDialog v-model="visible" title="所属短信分组" zIndex="200">
    <div v-loading="isLoading" :class="$style.container">
      <main>
        <el-tree
          node-key="id"
          :data="treeList"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </main>
      <footer>
        <button @click="onHandleCancel">取消</button>
        <button @click="onHandleConfirm">确定</button>
      </footer>
    </div>
  </ModalDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  watch,
  computed,
  getCurrentInstance,
} from 'vue';
import ModalDialog from '@/product/CommandBrain3.0/Generalparts/dialog/ModalDialog/ModalDialog.vue';

export default defineComponent({
  name: 'SaveAsSMSGroupDialog',
  components: {
    ModalDialog,
  },
  emits: [],
  setup() {
    const {
      $http,
      $message,
    }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const visible = ref(false);
    const isLoading = ref(false);
    const treeList:any = ref([]);
    const defaultProps = {
        children: 'children',
        label: 'name',
        value: 'id',
    };
    let res:any;
    let rej:any;
    let selectedSMSGroup:any = {};
    // 打开弹窗
    function open() {
      visible.value = true;
      isLoading.value = true;
      const request = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        service: 'soc',
        url: '/message/messageGroup/listTree',
        data: { },
      };
      $http(request).then((data :any) => {
          console.log('/message/messageGroup/listTree', data);
          if (data.code === 0) {
            // 插入顶级分组
            const topNode = {
              name: '顶级分组',
              id: 0,
              children: null,
            };
            treeList.value = [topNode, ...data.data];
          }
        })
        .finally(() => { isLoading.value = false; });
      return new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
      });
    }
    // 点击树状分组
    function handleNodeClick(data:any) {
        console.log(data);
        selectedSMSGroup = data;
    }
    // 点击取消
    function onHandleCancel() {
        visible.value = false;
        rej();
    }
    // 点击确定
    function onHandleConfirm() {
        visible.value = false;
        res(selectedSMSGroup);
    }
    return {
      visible,
      isLoading,
      treeList,
      defaultProps,
      open,
      handleNodeClick,
      onHandleCancel,
      onHandleConfirm,
    };
  },
});
</script>
<style lang="scss" module>
.container {
  width: 500px;
  color: #FFF;
  & > main {
    background: #000;
    min-height: 250px;
    padding: 20px 0px;
  }
  & > footer {
    display: flex;
    padding: 15px 0px;
    border-top: 0.1px solid rgba(255, 255, 255, 0.3);
    & button:first-child {
      border: 1px solid #ddd;
      background: #fff;
      color: #999;
      border-radius: 4px;
      padding: 6px 20px;
      cursor: pointer;
      margin-left: auto;
      margin-right: 10px;
    }
    & button:last-child {
      border: 1px solid #0091ff;
      background: #0091ff;
      color: #fff;
      border-radius: 4px;
      padding: 6px 20px;
      cursor: pointer;
      margin-right: 15px;
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep(.el-tree) {
    background: #000;
    color: #fff;
    & .el-tree-node:focus > .el-tree-node__content {
        background: rgba(255,255,255,0.3);
    }
    & .el-tree-node:hover > .el-tree-node__content {
        background: rgba(255,255,255,0.3);
    }
}
</style>
