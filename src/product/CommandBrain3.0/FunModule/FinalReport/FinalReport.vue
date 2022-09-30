<template>
  <div />
</template>
<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  provide,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import Iframe from '@/product/CommandBrain3.0/FunModule/FinalReport/Iframe.vue';
import { debounce } from 'lodash';
export default defineComponent({
  components: {
    Iframe,
  },
  inject: ['$addDialog'],
  setup() {
    const instance = getCurrentInstance();
    const { $http, $message, $fileViewer }: any =
      instance?.appContext.config.globalProperties;
    const store = useStore();
    const fileName = ref('');
    const filePath = ref('');
    /**
     * @description 获取总结报告
     */
    function getFinalReport() {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/eos/event/eventSummaryReport',
        params: {
          eventId: store.state.event?.id,
        },
      };
      $http(request)
        .then((res: any) => {
          if (res.errorcode === 0) {
            filePath.value =
              (window as any).config.baseURL +
              (window as any).config.service.file +
              res.data.path;
            fileName.value = res.data.filename;
            store.commit('SET_fileViewerPath', filePath.value);
            // const result = (this as any).$addDialog(fileName.value, Iframe);
            $fileViewer({
              title: fileName.value,
              path: filePath.value,
            });
          } else {
            $message.error(`获取总结报告失败`);
          }
        })
        .catch((error: any) => {
          $message.error(`获取总结报告失败`);
        });
    }
    /**
     * @description 打开弹窗
     */
    function open() {
      debounce(() => getFinalReport(), 1000)();
    }
    onMounted(() => {});
    return {
      open,
    };
  },
});
</script>