<template>
  <div :class="$style.MsgDialog">
    <div :class="$style['msg-header']">
      短信内容
      <button class="visualization-map-dialog__header__close" @click="handleClose" />
    </div>
    <div :class="$style['msg-body']">
      <el-input
        v-model="msgContent"
        type="textarea"
        rows="8"
        size="medium"
        show-word-limit
        maxlength="500"
        placeholder="请输入短信内容"
        :class="$style.inputContent"
      />
    </div>
    <div :class="$style.footer">
      <span>历史记录</span>

      <div>
        <el-button @click="handleClose">
          取消
        </el-button>
        <el-button type="primary" @click="$emit('sendMsg', msgContent)">
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  emits: ['msgClose', 'sendMsg'],
  setup(props, { emit }) {
    const msgContent = ref<string>('');
    const handleClose = () => {
      msgContent.value = '';
      emit('msgClose');
    };
    return {
      msgContent,
      handleClose,
    };
  },
});
</script>
<style lang="scss" module>
.MsgDialog {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 400px;
  .msg-header {
    height: 40px;
    background-color: #464646;
    color: #fff;
    text-align: center;
    line-height: 40px;
  }
  .inputContent {
    // :global(.el-textarea__inner) {
    //   background-color: #717171;
    // }
  }
  .footer {
    padding-right: 5px;
    background-color: #7b7b7b;
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: space-between;
    > span {
      margin-left: 20px;
      color: #7fe9e9;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
