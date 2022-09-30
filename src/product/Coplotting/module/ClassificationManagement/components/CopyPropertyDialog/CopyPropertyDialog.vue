<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="复制属性"
    width="650px"
    :before-close="handleClose"
  >
    <main>
      <div :class="$style.header">
        <span>分类名称</span>
        <ElSelect
          v-model="currentIndex"
          class="sv-select"
          placeholder="请选择"
          style="width: 310px"
          popper-class="sv-select__popper"
        >
          <ElOption
            v-for="item in options"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          />
        </ElSelect>
      </div>
      <table
        v-if="detail?.definedList?.length"
        :class="[
          'sv-table',
          $style.table,
        ]"
      >
        <thead>
          <th>属性名称</th>
          <th>属性类型</th>
          <th>单位</th>
        </thead>
        <tbody>
          <tr
            v-for="(prop, propIndex) in detail.definedList"
            :key="propIndex"
          >
            <td>{{ prop?.name }}</td>
            <td>
              {{ prop.type === 1 ? '文本' : '' }}
              {{ prop.type === 2 ? '数值' : '' }}
              {{ prop.type === 3 ? '日期' : '' }}
              {{ prop.type === 4 ? '电话' : '' }}
              {{ prop.type === 5 ? '终端号' : '' }}
              {{ prop.type === 6 ? '下拉选项' : '' }}
            </td>
            <td>{{ prop?.unit || '/' }}</td>
          </tr>
        </tbody>
      </table>
    </main>
    <footer :class="$style.footer">
      <ElButton
        v-if="detail?.definedList?.length"
        class="sv-button"
        type="primary"
        @click="handleSave"
      >
        保存
      </ElButton>
      <ElButton
        class="sv-button"
        @click="handleClose"
      >
        取消
      </ElButton>
    </footer>
  </ElDialog>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import {
  defineComponent, ref, getCurrentInstance, onMounted, inject, Ref, watch,
} from 'vue';

export default defineComponent({
  name: 'CopyPropertyDialog',
  emits: [
    'save',
  ],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showDialog = ref(false);
    const currentIndex = ref<number | null>(null);
    const detail = ref<any>(null);
    const handleClose = () => {
      showDialog.value = false;
      currentIndex.value = null;
      detail.value = null;
    };
    const getClassificationDetail = (id: number) => {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: `/assist/assistbasicclass/info/${id}`,
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          detail.value = response.data?.assistBasicClass;
        } else {
          ElMessage.error(`获取分类详情失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取分类详情失败，错误信息：${error}`);
      });
    };
    watch(currentIndex, (val) => {
      if (val) {
        getClassificationDetail(val);
      }
    });
    const type = inject('activeTabIndex') as Ref<number>;
    const options = ref<any>([]);
    const getClassificationList = () => {
      if ($http) {
        const request = {
          method: 'post',
          service: 'coplotting',
          url: '/assist/assistbasicclass/listOption',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            basicClassType: type.value,
          },
        };
        $http(request).then((response: any) => {
          if (response.code === 0) {
            currentIndex.value = null;
            options.value = response.data?.data || [];
          } else {
            ElMessage.error(`获取分类列表失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error: Error) => {
          ElMessage.error(`获取分类列表失败，错误信息：${error}`);
        });
      }
    };
    const handleSave = () => {
      emit('save', detail.value.definedList);
      handleClose();
    };
    onMounted(() => {
      getClassificationList();
    });
    const open = () => {
      showDialog.value = true;
      getClassificationList();
    };
    return {
      showDialog,
      open,
      handleClose,
      currentIndex,
      options,
      detail,
      handleSave,
    };
  },
});
</script>

<style lang="scss" module>
// 底部按钮
.footer {
  text-align: right;
  padding-right: 20px;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #E9ECF1;
}
.header {
  margin: 20px 0;
  padding-left: 120px;
  & > span:first-child {
    margin-right: 20px;
  }
}
.table {
  margin-left: 195px;
  margin-bottom: 20px;
}
</style>
