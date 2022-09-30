<template>
  <ModalDialog v-model="visible" title="存为短信分组" @close="reset">
    <div :class="$style.container">
      <main>
        <div>
          <label>分组名称:</label>
          <input type="text" v-model="groupName">
        </div>
        <div>
          <label>所属分组:</label>
          <input :value="selectedSMSGroup?.name" type="text" @focus="selectSMSGroup">
        </div>
        <div>
          <label>所属人员:</label>
          <input type="text" :value="selectedMemberList.map(item=>{return item.name}).join()" @focus="selectMember">
        </div>
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
      $message,
      $MessageBox,
      $http,
    }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const visible = ref(false);
    // 分组名称
    const groupName:any = ref('');
    // 所属分组
    const selectedSMSGroup:any = ref({});
    // 所属人员
    const selectedMemberList:any = ref([]);
    const openSelectSMSGroupDialog:any = inject('selectSMSGroup');
    const openSelectMemberDialog:any = inject('addContactor');
    // 打开弹窗
    function open() {
      visible.value = true;
    }
    function selectSMSGroup() {
      openSelectSMSGroupDialog().then((templateSelectedSMSGroup:any) => {
        console.log('所属分组', templateSelectedSMSGroup);
        selectedSMSGroup.value = templateSelectedSMSGroup;
      });
    }
    function selectMember() {
      openSelectMemberDialog().then((templateSelectedMemberList:any) => {
        console.log('所属人员', templateSelectedMemberList);
        selectedMemberList.value = templateSelectedMemberList;
      });
    }
    // 点击取消
    function onHandleCancel() {
      visible.value = false;
    }
    // 点击确定
    function onHandleConfirm() {
      $MessageBox({
        title: '保存提示',
        message: '确认存为短信分组?',
      }).then(() => {
        visible.value = false;
        if (!groupName.value) {
            $message.error('请填写分组名称');
            return;
          }
        if (!selectedSMSGroup.value) {
          $message.error('请选择所属分组');
          return;
        }
        if (selectedMemberList.value.length === 0) {
          $message.error('请选择所属人员');
          return;
        }
        const request = {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          service: 'soc',
          url: '/message/messageGroup/saveMessageContactorGroup',
          data: {
            name: groupName.value,
            parentId: selectedSMSGroup.value.id,
            phone: selectedMemberList.value.map(
              (selected:any) => (selected.phone || selected.mobile1),
            ).join(','),
            userIds: selectedMemberList.value.map((selected:any) => selected.id).join(','),
            id: -1,
            messageGroup: [],
            mailGroup: [],
          },
        };
        $http(request).then((data:any) => {
            console.log('/message/messageGroup/saveMessageContactorGroup', data);
            if (data.code === 0) {
              $message.success('保存成功');
            } else {
              $message.error(`保存失败，错误信息：${data.msg}`);
            }
        });
      });
    }
    function reset() {
      groupName.value = '';
      selectedSMSGroup.value = {};
      selectedMemberList.value = [];
    }
    return {
      visible,
      groupName,
      selectedSMSGroup,
      selectedMemberList,
      open,
      selectSMSGroup,
      selectMember,
      onHandleCancel,
      onHandleConfirm,
      reset,
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
    & div {
      margin: 20px 0px;
      text-align: center;
      & label {
        display: inline-block;
        width: 80px;
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
    }
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
