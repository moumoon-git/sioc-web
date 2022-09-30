<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="地图名称"
    :width="500"
  >
    <div class="inputValueContent">
      <div class="inputValueContent__labelName">
        地图名称：
      </div>
      <el-input
        v-model="inputValue"
        placeholder="请输入内容"
      />
    </div>
    <footer class="inputValueContent__footer">
      <ElButton
        class="sv-button"
        type="primary"
        @click="saveMap"
      >
        保存
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
import {
 defineComponent, ref, getCurrentInstance, onMounted,
} from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  emits: ['refresh'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showDialog = ref(false);
    const inputValue = ref(''); // 地图名称
    const open = () => {
      showDialog.value = true;
    };
    const close = () => {
      showDialog.value = false;
    };
    // 保存地图
    const saveMap = () => {
      if (inputValue.value === '') {
        ElMessage.error('请输入地图名称');
        return;
      }

      // 判断是否地图重名
          const request1: any = {
              method: 'get',
              service: 'coplotting',
              url: '/assist/assistmap/getMap',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                mapName: inputValue.value,
              },
            };
            $http(request1).then((response: any) => {
              if (response.code !== 0) {
                  ElMessage.error(`复制失败，错误代码${response.code}，错误信息：${response.msg}`);
              } else if (response.data.length === 0) {
                  // 没有重名

                  const request = {
                    method: 'post',
                    service: 'coplotting',
                    url: '/assist/assistmap/save',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    data: {
                      mapName: inputValue.value,
                    },
                  };
                  $http(request).then((response: any) => {
                    if (response.code === 0) {
                      console.log(response);
                      close();
                      emit('refresh');
                    } else {
                      ElMessage.error(`新增失败，错误代码${response.code}，错误信息：${response.msg}`);
                    }
                  }).catch((error: Error) => {
                    ElMessage.error(`新增失败，错误信息：${error}`);
                  });
                } else {
                  return ElMessage.error('新增失败，错误信息：有相同名称的地图存在，请修改');
                }
            }).catch((error: Error) => {

            });
      // 判断地图是否重名
    };
    onMounted(() => {
      inputValue.value = '';
    });
    return {
      showDialog,
      open,
      inputValue,
      saveMap,
      close,
    };
  },
});
</script>

<style lang="scss">
.inputValueContent{
     display: flex;
    height: 70px;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    &__labelName{
      width: 100px
    }
    &__footer{
          display: flex;
    justify-content: flex-end;
    height: 46px;
    padding-right: 19px;
    }
}
</style>
