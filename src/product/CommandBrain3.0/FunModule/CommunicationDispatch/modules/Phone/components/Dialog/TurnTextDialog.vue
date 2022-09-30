<!--- 组件：语音转文字 --->
<template>
  <teleport :to="uid">
    <div class="dialog-turn-text-container">
      <div class="dialog-turn-text">
        <!-- 弹窗头部 -->
        <div class="dialog_header">
          <span>语音转文字 <i v-if="loading" class="el-icon-loading"></i></span>
          <button class="icon-button">
            <img src="./assets/svg/close.svg" alt="" @click="handleCloseDialog" />
          </button>
        </div>

        <!-- 弹窗中部 -->
        <div class="dialog_body">
          <textarea
            v-model="text"
            name="dialog-textarea"
            id="dialog-textarea"
            class="dialog-textarea"
            >{{ text }}</textarea
          >
        </div>

        <!-- 弹窗底部 -->
        <div class="dialog_footer">
          <Button :type="'default'" @click="handleTurnText">重新识别</Button>
          <Button @click="handleSaveAudioText">保存</Button>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, ref, inject, watch } from 'vue';
import Button from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Phone/components/Button.vue';
export default defineComponent({
  name: 'TurnTextDialog',
  components: {
    Button,
  },
  emits: {
    handleCloseDialog: null,
    handleTurnText: null,
    handleSaveAudioText: null,
  },
  props: {
    audioText: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    audioText: {
      handler(newVal: string) {
        this.text = newVal;
      },
      deep: true,
    },
  },
  setup(props, { emit }) {
    const uid = inject('containerId'); // 父组件id，将弹窗渲染到父组件里
    const text = ref('');
    text.value = props.audioText;
    /**
     * @description 重新识别语音转文字
     */
    function handleTurnText() {
      emit('handleTurnText');
    }
    /**
     * @description 关闭语音转文字
     */
    function handleCloseDialog() {
      emit('handleCloseDialog');
    }

    /**
     * @description 保存语音转文字结果
     */
    function handleSaveAudioText() {
      emit('handleSaveAudioText', text.value);
      emit('handleCloseDialog');
    }

    return {
      handleTurnText,
      handleCloseDialog,
      uid,
      text,
      handleSaveAudioText,
    };
  },
});
</script>

<style lang="scss">
@import './assets/css/turnTextDialog';
</style>
