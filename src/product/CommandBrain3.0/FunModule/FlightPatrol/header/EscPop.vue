<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog  esc-dialog"
    class="escDialog"
    title
    :width="500"
  >
    <div class="inputValueContent">
      <div class="inputValueContent__labelName">
        是否退出飞巡并清除当前飞巡数据？
      </div>
    </div>
    <footer class="inputValueContent__footer">
      <ElButton
        class="sv-button"
        type="primary"
        @click="sureFun"
      >
        退出
      </ElButton>
      <ElButton
        class="sv-button"
        @click="close()"
      >
        取消
      </ElButton>
    </footer>
  </ElDialog>
</template>

  <script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore(); // 使用vuex
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showDialog = ref(false);
    const open = () => {
      showDialog.value = true;
    };
    const close = () => {
      showDialog.value = false;
    };
    const sureFun = () => {
      store.commit('flightPatrol/SET_isShowFlightTip', false);
      store.commit('flightPatrol/SET_isShowFlightWin', false);
      showDialog.value = false;
    };
    return {
      showDialog,
      open,
      close,
      sureFun,
    };
  },
});
</script>
  <style lang="scss">
.esc-dialog {
  color: #fff;
  background: rgba(20, 29, 31, 0.94) !important;
  border: 1px solid #00c1de;
  .el-dialog__body {
    padding-bottom: 5px;
    padding-top: 10px;
  }
  .inputValueContent {
    display: flex;
    height: 70px;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    &__labelName {
      width: 100%;
      font-size: 16px;
      color: #fff;
    }
    &__footer {
      display: flex;
      justify-content: flex-end;
      height: 46px;
      padding-right: 19px;
      & > button:nth-child(1) {
        border: 1px solid rgba(255, 255, 255, 0);
        width: 64px;
        height: 32px;
        background: #00c1de;
        border-radius: 0;
        line-height: 32px;
        padding: 0;
        min-height: 32px;
      }
      & > button:nth-child(2) {
        border: 1px solid rgba(255, 255, 255, 0.45);
        width: 64px;
        height: 32px;
        background: 0;
        border-radius: 0;
        line-height: 32px;
        padding: 0;
        min-height: 32px;
        color: #fff;
      }
    }
  }
}
</style>
