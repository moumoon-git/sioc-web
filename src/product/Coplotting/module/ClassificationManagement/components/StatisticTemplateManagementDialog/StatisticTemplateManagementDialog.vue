<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="数据统计"
    width="800px"
  >
    <main
      v-loading="isLoading"
      :class="$style.container"
    >
      <div>
        <InitSetting
          v-if="isEditting[0]"
          :data="statTemplateList[0]"
          :options-list="optionsList"
          @confirm="handleConfirm($event, 0)"
          @cancel="handleCancel(0)"
        />
        <component
          :is="transformTypeToComp(statTemplateList?.[0]?.countType)"
          v-else
          :data="setDefaultValue(statTemplateList?.[0]?.countType)"
          @edit="handleEdit(0)"
          @delete="handleDelete(0)"
        />
      </div>
      <div>
        <InitSetting
          v-if="isEditting[1]"
          :data="statTemplateList[1]"
          :options-list="optionsList"
          @confirm="handleConfirm($event, 1)"
          @cancel="handleCancel(1)"
        />
        <component
          :is="transformTypeToComp(statTemplateList?.[1]?.countType)"
          v-else
          :data="setDefaultValue(statTemplateList?.[1]?.countType)"
          @edit="handleEdit(1)"
          @delete="handleDelete(1)"
        />
      </div>
      <div>
        <InitSetting
          v-if="isEditting[2]"
          :data="statTemplateList[2]"
          :options-list="optionsList"
          @confirm="handleConfirm($event, 2)"
          @cancel="handleCancel(2)"
        />
        <component
          :is="transformTypeToComp(statTemplateList?.[2]?.countType)"
          v-else
          :data="setDefaultValue(statTemplateList?.[2]?.countType)"
          @edit="handleEdit(2)"
          @delete="handleDelete(2)"
        />
      </div>
      <div>
        <InitSetting
          v-if="isEditting[3]"
          :data="statTemplateList[3]"
          :options-list="optionsList"
          @confirm="handleConfirm($event, 3)"
          @cancel="handleCancel(3)"
        />
        <component
          :is="transformTypeToComp(statTemplateList?.[3]?.countType)"
          v-else
          :data="setDefaultValue(statTemplateList?.[3]?.countType)"
          @edit="handleEdit(3)"
          @delete="handleDelete(3)"
        />
      </div>
    </main>
  </ElDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
} from 'vue';
import { ElMessage } from 'element-plus';
import InitSetting from './components/InitSetting/InitSetting.vue';
import SummaryGraph from './components/SummaryGraph/SummaryGraph.vue';
import PieGraph from './components/PieGraph/PieGraph.vue';
import LineGraph from './components/LineGraph/LineGraph.vue';
import CardGraph from './components/CardGraph/CardGraph.vue';
import RankGraph from './components/RankGraph/RankGraph.vue';
import BarGraph from './components/BarGraph/BarGraph.vue';

export default defineComponent({
  name: 'StatisticTemplateManagementDialog',
  components: {
    InitSetting,
    SummaryGraph,
    PieGraph,
    LineGraph,
    CardGraph,
    RankGraph,
    BarGraph,
  },
  props: {
    classId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { $http }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const showDialog = ref(false);
    const isLoading = ref(false);
    const isEditting = ref([true, true, true, true]);
    const statTemplateList = ref<any[]>([]);
    // 获取数据模板统计列表
    function getStatTemplateList() {
      isLoading.value = true;
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistcounttemplate/list',
        params: {
          basicClassId: props.classId,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          statTemplateList.value = response.data || [];
          isEditting.value = [
            !statTemplateList.value?.[0],
            !statTemplateList.value?.[1],
            !statTemplateList.value?.[2],
            !statTemplateList.value?.[3],
          ];
        } else {
          ElMessage.error(`获取统计模板数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取统计模板数据失败，错误信息：${error}`);
      }).finally(() => {
        isLoading.value = false;
      });
    }
    // 所有6种下拉框选项
    const optionsList = ref<any>([[], [], [], [], [], []]);
    function getOptions() {
      for (let i = 1; i < 7; i += 1) {
        const request = {
          method: 'get',
          service: 'coplotting',
          url: '/assist/assistbasicclass/getProperty',
          params: {
            types: i,
            basicClassId: props.classId,
          },
        };
        $http(request).then((response: any) => {
          optionsList.value[i - 1] = response.data?.data || [];
        });
      }
    }
    // 打开弹窗
    function open() {
      getStatTemplateList();
      getOptions();
      showDialog.value = true;
    }
    // 新增保存
    function addStatTemplate(data: any) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistcounttemplate/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          ...data,
          basicClassId: props.classId,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getStatTemplateList();
        }
      });
    }
    // 更新
    function updateStatTemplate(data: any, index: number) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistcounttemplate/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          ...data,
          basicClassId: props.classId,
          id: statTemplateList.value[index].id,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getStatTemplateList();
        }
      });
    }
    // 确认修改
    function handleConfirm(data: any, index: number) {
      if (statTemplateList.value[index]) {
        // 更新数据
        updateStatTemplate(data, index);
      } else {
        // 新增数据
        addStatTemplate(data);
      }
    }
    // 将类型转换为对应组件名
    function transformTypeToComp(type: number) {
      switch (type) {
        case 1: {
          return 'SummaryGraph';
        }
        case 2: {
          return 'PieGraph';
        }
        case 3: {
          return 'LineGraph';
        }
        case 4: {
          return 'BarGraph';
        }
        case 5: {
          return 'RankGraph';
        }
        case 6: {
          return 'CardGraph';
        }
        default:
          return '';
      }
    }
    // 不同类型的默认数据
    function setDefaultValue(type: number) {
      switch (type) {
        case 1: {
          return [{
            name: '堤坝总长度',
            sum: 100,
            unit: '米',
            lastMonthPercent: -50,
            lastYearPercent: 50,
          }];
        }
        case 2: {
          return [
            { value: 1048, key: '应急医疗点' },
            { value: 735, key: '临时安置点' },
            { value: 580, key: '避难场所' },
            { value: 484, key: '物资供应点' },
            { value: 300, key: '集合点' },
          ];
        }
        case 3: {
          return [
            { value: 150, key: 'Mon' },
            { value: 230, key: 'Tue' },
            { value: 224, key: 'Wed' },
            { value: 218, key: 'Thu' },
            { value: 135, key: 'Fri' },
            { value: 147, key: 'Sat' },
            { value: 260, key: 'Sun' },
          ];
        }
        case 6: {
          return [
            { value: 150, name: 'Mon' },
            { value: 230, name: 'Tue' },
            { value: 224, name: 'Wed' },
            { value: 218, name: 'Thu' },
          ];
        }
        case 4: {
          return [
            { value: 150, key: '山体滑坡' },
            { value: 230, key: '山体滑坡' },
            { value: 224, key: '山体滑坡' },
            { value: 218, key: '山体滑坡' },
          ];
        }
        case 5: {
          return [10, 300, 50, 90, 80];
        }
        default:
          return '';
      }
    }
    // 开始编辑
    function handleEdit(type: number) {
      isEditting.value[type] = true;
    }
    // 删除模板
    function handleDelete(type: number) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistcounttemplate/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [
          statTemplateList.value[type].id,
        ],
      };
      isLoading.value = true;
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getStatTemplateList();
        } else {
          ElMessage.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除失败，错误信息：${error}`);
      }).catch(() => {
        isLoading.value = false;
      });
    }
    // 取消编辑
    function handleCancel(index: number) {
      isEditting.value[index] = false;
    }
    return {
      showDialog,
      open,
      isEditting,
      optionsList,
      handleConfirm,
      transformTypeToComp,
      isLoading,
      statTemplateList,
      handleEdit,
      handleDelete,
      handleCancel,
      setDefaultValue,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  height: 600px;
  display: grid;
  grid: 1fr 1fr/1fr 1fr;
  grid-gap: 1px;
  background: #E9ECF1;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  & > div {
    background: #FFF;
  }
}
</style>
