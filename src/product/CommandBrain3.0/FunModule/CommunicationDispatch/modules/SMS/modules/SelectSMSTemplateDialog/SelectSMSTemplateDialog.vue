<template>
  <ModalDialog v-model="visible" title="短信模版" @close="reset">
    <div :class="$style['left-container']">
      <header>
        <button @click="onHandleAddTreeNode({})">新建短信模版</button>
      </header>
      <main>
        <el-tree
          ref="treeRef"
          :current-node-key="0"
          :data="treeList"
          :expand-on-click-node="false"
          node-key="id"
          :props="{
            children: 'children',
            label: 'name',
            value: 'id',
          }"
          :highlight-current="true"
          @node-click="onHandleClickTree"
        >
          <template #default="{ node, data }">
            <div style="width:100%;" @mouseenter="treeNodeHoverIndex=node.id" @mouseleave="treeNodeHoverIndex=''">
              <label>{{ node.label }}</label>
              <div v-if="treeNodeHoverIndex === node.id" :class="$style['slot-icon-wrap']">
                <i class="el-icon-plus" @click="onHandleAddTreeNode(data)"></i>
                <i class="el-icon-delete-solid" @click="onHandleDeleteTreeNode(data)"></i>
              </div>
            </div>
          </template>
        </el-tree>
      </main>
    </div>
    <div :class="$style['right-container']">
      <header>
        编辑短信模版
      </header>
      <main>
        <div>
          <label>模版名称:</label>
          <input type="text" v-model="groupName">
        </div>
        <div>
          <label>所属分组:</label>
          <input :value="selectedSMSGroup?.name" type="text" @focus="selectSMSGroup">
        </div>
        <div>
          <label>模版内容:</label>
          <textarea v-model="template" />
        </div>
      </main>
      <footer>
        <button v-if="isEditing" @click="addSMSTemplate">新增模版</button>
        <button v-else @click="updateSMSTemplate">更新模版</button>
        <button @click="selectSMSTemplate">选取模版</button>
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
  onMounted,
} from 'vue';
import ModalDialog from '@/product/CommandBrain3.0/Generalparts/dialog/ModalDialog/ModalDialog.vue';

export default defineComponent({
  name: 'SelectSMSTemplateDialog',
  components: {
    ModalDialog,
  },
  emits: [],
  setup() {
    const {
      $message,
      $MessageBox,
      $http,
    }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const visible = ref(false);
    const isLoading = ref(false);
    // 是否正在编辑
    const isEditing = ref(true);
    const treeRef:any = ref(null);
    const treeNodeHoverIndex = ref('');
    // 树状分组列表
    const treeList:any = ref([]);
    // 分组名称
    const groupName:any = ref('');
    // 所属分组
    const selectedSMSGroup:any = ref({});
    // 短信模版
    const template:any = ref('');
    // 选中的短信模版
    const selectedSMSTemplate:any = ref({});
    const openSelectSMSGroupDialog:any = inject('selectSMSGroup');
    let smsTemplate:any = inject('smsTemplate');
    function selectSMSGroup() {
      openSelectSMSGroupDialog().then((templateSelectedSMSGroup:any) => {
        console.log('所属分组', templateSelectedSMSGroup);
        selectedSMSGroup.value = templateSelectedSMSGroup;
      });
    }
    function reset() {
        isEditing.value = true;
        selectedSMSTemplate.value = {};
        groupName.value = '';
        selectedSMSGroup.value = {};
        template.value = '';
    }
    // 获取树状分组列表
    function getTreeList() {
      isLoading.value = true;
      const request = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        service: 'soc',
        url: '/message/messagetemple/listtemple',
      };
      $http(request).then((data:any) => {
          if (data.code === 0) {
            treeList.value = [...data.data];
          }
        }).finally(() => { isLoading.value = false; });
    }
    // 点击树状分组
    function onHandleClickTree(node:any) {
        console.log('onHandleClickTree', node);
        isEditing.value = false;
        selectedSMSTemplate.value = node;
        groupName.value = node.name;
        selectedSMSGroup.value.id = node.parentId || 0;
        selectedSMSGroup.value.name = node.parentName || '顶级分组';
        template.value = node.content;
    }
    // 新增树状分组
    function onHandleAddTreeNode(node:any) {
      isEditing.value = true;
      selectedSMSTemplate.value = {};
      treeRef.value.setCurrentKey(node.id);
      groupName.value = '新增模版';
      selectedSMSGroup.value.id = node.id || 0;
      selectedSMSGroup.value.name = node.name || '顶级分组';
      template.value = '';
    }
    // 删除树节点
    function onHandleDeleteTreeNode(node:any) {
      onHandleClickTree(node);
      $MessageBox({
        title: '删除提示',
        message: '确认要删除树节点吗?其下属模板也会一并删除，且数据不可恢复',
      }).then(() => {
        const ids:any = [];
        const findChildren = (parent:any) => {
          ids.push(parent.id);
          if (parent.children) {
            parent.children.forEach((child:any) => {
              findChildren(child);
            });
          }
        };
        findChildren(node);

        const request = {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          service: 'soc',
          url: 'message/messagetemple/delete',
          data: { ids },
        };
        $http(request).then((data: any) => {
          if (data.code === 0) {
            $message.success('删除成功');
            getTreeList();
          } else {
            $message.error(`删除失败，错误信息：${data.msg}`);
          }
        });
      });
    }
    // 更新短信模版
    function updateSMSTemplate() {
      // 提交数据验证
      if (!groupName.value) {
        $message.error('请输入模板名称');
        return;
      }
      if (!template.value) {
        $message.error('请输入模板内容');
        return;
      }
      // 提交数据
      const request = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        service: 'soc',
        url: '/message/messagetemple/updatetemple',
        data: {
          id: selectedSMSTemplate.value.id,
          content: template.value,
          parentId: selectedSMSGroup.value.id,
          name: groupName.value,
        },
      };
      $http(request)
        .then((data: any) => {
          if (data.code === 0) {
            $message.success('更新短信模板成功');
            selectedSMSTemplate.value = {
              ...selectedSMSTemplate.value,
              content: template.value,
              parentId: selectedSMSGroup.value.id,
              parentName: selectedSMSGroup.value.name,
              name: groupName.value,
            };
            getTreeList();
          } else {
            $message.error(`保存失败，错误信息：${data.msg}`);
          }
        })
        .catch((error:any) => { $message.error(`保存失败，错误信息：${error}`); });
    }
    // 新增短信模版
    function addSMSTemplate() {
      // 提交数据验证
      if (!groupName.value) {
        $message.error('请输入模板名称');
        return;
      }
      if (!template.value) {
        $message.error('请输入模板内容');
        return;
      }
      // 提交数据
      const request = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        service: 'soc',
        url: '/message/messagetemple/savetemple',
        data: {
          content: template.value,
          parentId: selectedSMSGroup.value.id,
          name: groupName.value,
        },
      };
      $http(request)
        .then((data: any) => {
          if (data.code === 0) {
            $message.success('新增短信模板成功');
            getTreeList();
            reset();
          } else {
            $message.error(`保存失败，错误信息：${data.msg}`);
          }
        })
        .catch((error:any) => { $message.error(`保存失败，错误信息：${error}`); });
    }
    // 选取短信模版
    function selectSMSTemplate() {
        if (!template.value) {
            $message.error('请先填写模版内容');
            return;
        }
        smsTemplate.value = template.value;
        visible.value = false;
    }
    // 打开弹窗
    function open() {
      visible.value = true;
      getTreeList();
    }
    return {
      visible,
      isLoading,
      isEditing,
      treeRef,
      treeNodeHoverIndex,
      treeList,
      groupName,
      selectedSMSGroup,
      template,
      selectedSMSTemplate,
      open,
      selectSMSGroup,
      reset,
      getTreeList,
      onHandleClickTree,
      onHandleAddTreeNode,
      onHandleDeleteTreeNode,
      updateSMSTemplate,
      addSMSTemplate,
      selectSMSTemplate,
    };
  },
});
</script>
<style lang="scss" module>
.left-container {
    border-right: 1px solid rgba(255, 255, 255, 0.3);
    & button {
        &::before {
            content: '+';
            color: #fff;
            margin-right: 5px;
        }
        border: 1px solid #0091ff;
        background: #0091ff;
        color: #fff;
        border-radius: 4px;
        padding: 8px 20px;
        cursor: pointer;
        font-size: 16px;
        margin: 20px 40px;
        white-space: nowrap;
    }
    & .slot-icon-wrap {
        display: inline-block;
        position: absolute;
        right: 5%;
        & i:last-child {
            margin-left: 10px;
        }
    }
}
.right-container {
  width: 500px;
  color: #FFF;
  & > header {
    font-size: 18px;
    line-height: 18px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    margin-top: 20px;
    &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 20px;
        background: #56E9FF;
        box-shadow: 0px 0px 16px 0px #008CFF;
        border-radius: 2px;
        margin-right: 10px;
    }
  }
  & > main {
    background: #000;
    & div {
      margin: 20px 0px;
      display: flex;
      & label {
        display: inline-block;
        width: 100px;
        text-align: right;
        font-size: 16px;
      }
      & input {
        width: 300px;
        height: 40px;
        margin-left: 10px;
        padding-left: 10px;
        box-sizing: border-box;
        background: transparent;
        border: 1px solid #ddd;
        border-radius: 4px;
        color: #FFF;
      }
      & textarea {
        color: #FFF;
        margin-left: 10px;
        padding: 10px;
        box-sizing: border-box;
        width: 300px;
        height: 100px;
        resize: none;
        outline: none;
        background: none;
        border: 1px solid #ddd;
        border-radius: 4px;
        &::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
      }
    }
  }
  & > footer {
    display: flex;
    justify-content: center;
    padding: 0px 0px 20px 0px;
    & button:first-child {
      border: 1px solid #ddd;
      background: #fff;
      color: #999;
      border-radius: 4px;
      padding: 6px 20px;
      cursor: pointer;
    }
    & button:last-child {
      border: 1px solid #0091ff;
      background: #0091ff;
      color: #fff;
      border-radius: 4px;
      padding: 6px 20px;
      cursor: pointer;
      margin-left: 15px;
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep(.visualization-modal-dialog) {
   & > main{
       display: flex;
   }
   & .el-tree{
        background: transparent;
        color: #FFF;
        & .el-tree-node.is-current>.el-tree-node__content {
            background: transparent;
            position: relative;
        }
        & .el-tree-node__content:hover,.el-tree-node:focus>.el-tree-node__content {
            background: linear-gradient(90deg, rgba(0, 193, 222, .7) 0%, transparent 100%);
        }
   }
}
</style>
