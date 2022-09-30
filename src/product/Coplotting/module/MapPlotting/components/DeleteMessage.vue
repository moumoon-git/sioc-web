<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="删除提示"
    :width="412"
  >
    <div class="deleteMapContent">
      <div class="deleteMapContent__left" />
      <div class="deleteMapContent__right">
        <div class="deleteMapContent__right__item1">
          是否确认要删除？
        </div>
        <div class="deleteMapContent__right__item2">
          删除后，数据不可恢复
        </div>
      </div>
    </div>

    <footer class="deleteMapContent__footer">
      <ElButton
        class="sv-button"
        type="primary"
        @click="check()"
      >
        确认
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
import { ElMessage } from 'element-plus';

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showDialog = ref(false);
    const open = () => {
      showDialog.value = true;
    };
    const close = () => {
      showDialog.value = false;
    };
    const check = () => {
      console.log(props.item.id);
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmap/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [String(props.item.id)],
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          close();
          emit('refresh');
        } else {
          ElMessage.error(`新增失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`新增失败，错误信息：${error}`);
      });
    };
    return {
      showDialog,
      open,
      close,
      check,
    };
  },
});
</script>

<style lang="scss">
.deleteMapContent {
  display: flex;
  height: 119px;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  border-bottom: 1px solid #f2f2f2;
  justify-content: center;
  &__left {
    width: 43px;
    height: 50px;
    background: url(./assets/waring.svg) no-repeat;
    margin-right: 12px;
  }
  &__right {
    &__item1 {
      color: #555555;
      font-size: 14px;
    }
    &__item2 {
      color: #888;
      font-size: 12px;
      margin-top: 7px;
    }
  }
  &__labelName {
    width: 100px;
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    height: 46px;
    padding-right: 19px;
    align-items: center;
  }
}
</style>
