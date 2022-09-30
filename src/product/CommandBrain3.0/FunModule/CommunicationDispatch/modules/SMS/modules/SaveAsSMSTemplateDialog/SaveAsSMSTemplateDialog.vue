<template>
  <ModalDialog v-model="visible" title="存为短信模版" @close="reset">
    <div :class="$style.container">
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
          <textarea :value="template" />
        </div>
      </main>
      <footer>
        <button @click="onHandleConcel">取消</button>
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
  name: 'SaveAsSMSTemplateDialog',
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
    // 短信模版
    const template:any = ref('');
    const openSelectSMSGroupDialog:any = inject('selectSMSGroup');
    // 打开弹窗
    function open(content:any) {
      visible.value = true;
      template.value = content;
    }
    function selectSMSGroup() {
      openSelectSMSGroupDialog().then((templateSelectedSMSGroup:any) => {
        console.log('所属分组', templateSelectedSMSGroup);
        selectedSMSGroup.value = templateSelectedSMSGroup;
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
        message: '确认存为短信模版?',
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
        $http(request).then((data:any) => {
            console.log('/message/messagetemple/savetemple', data);
            if (data.code === 0) {
              $message.success('存为短信模版成功');
            } else {
              $message.error(`保存失败，错误信息：${data.msg}`);
            }
        });
      });
    }
    function reset() {
      groupName.value = '';
      selectedSMSGroup.value = {};
      template.value = '';
    }
    return {
      visible,
      groupName,
      selectedSMSGroup,
      template,
      open,
      selectSMSGroup,
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
    & div {
      margin: 20px 0px;
      display: flex;
      justify-content: center;
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
