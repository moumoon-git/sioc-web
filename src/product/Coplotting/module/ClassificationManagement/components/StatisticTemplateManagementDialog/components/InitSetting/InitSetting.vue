<template>
  <div :class="$style.container">
    <main>
      <ElForm label-width="100px">
        <ElFormItem label="统计类型">
          <ElSelect
            v-model="selectedStatisticTypeIndex"
            class="sv-select"
            placeholder="请选择类型"
            style="width: 240px;"
            popper-class="sv-select__popper"
            clearable
          >
            <ElOption
              v-for="(option, optionIndex) in statisticTypeOptions"
              :key="optionIndex"
              :label="option"
              :value="optionIndex"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          v-if="selectedStatisticTypeIndex === 0 || selectedStatisticTypeIndex === 1"
          label="汇总字段"
        >
          <ElSelect
            v-model="selectedSummaryFieldIndex"
            class="sv-select"
            placeholder="请选择字段"
            style="width: 240px;"
            popper-class="sv-select__popper"
            clearable
          >
            <ElOption
              v-for="option in summaryFieldOptions"
              :key="option.id"
              :label="option.name"
              :value="option.name"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          v-if="selectedStatisticTypeIndex === 0"
          label="时间字段"
        >
          <ElSelect
            v-model="selectedTimeFieldIndex"
            class="sv-select"
            placeholder="请选择字段"
            style="width: 240px;"
            popper-class="sv-select__popper"
            clearable
          >
            <ElOption
              v-for="option, in timeFieldOptions"
              :key="option.id"
              :label="option.name"
              :value="option.name"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          v-if="selectedStatisticTypeIndex === 2 || selectedStatisticTypeIndex === 3"
          label="横坐标"
        >
          <ElSelect
            v-model="selectedXAxisIndex"
            class="sv-select"
            placeholder="请选择坐标"
            style="width: 240px;"
            popper-class="sv-select__popper"
            clearable
          >
            <ElOption
              v-for="option, in xAxisOptions"
              :key="option.id"
              :label="option.name"
              :value="option.name"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          v-if="selectedStatisticTypeIndex === 2 || selectedStatisticTypeIndex === 3"
          label="纵坐标"
        >
          <ElSelect
            v-model="selectedYAxisIndex"
            class="sv-select"
            placeholder="请选择坐标"
            style="width: 240px;"
            popper-class="sv-select__popper"
            clearable
          >
            <ElOption
              v-for="option, in yAxisOptions"
              :key="option.id"
              :label="option.name"
              :value="option.name"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          v-if="selectedStatisticTypeIndex === 4 || selectedStatisticTypeIndex === 5"
          label="统计对象"
        >
          <ElSelect
            v-model="selectedStatisticObjectIndex"
            class="sv-select"
            placeholder="请选择对象"
            style="width: 240px;"
            popper-class="sv-select__popper"
            clearable
          >
            <ElOption
              v-for="option, in statisticObjectOptions"
              :key="option.id"
              :label="option.name"
              :value="option.name"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          v-if="selectedStatisticTypeIndex === 4 || selectedStatisticTypeIndex === 5"
          label="统计数值"
        >
          <ElSelect
            v-model="selectedStatisticNumericIndex"
            class="sv-select"
            placeholder="请选择数值"
            style="width: 240px;"
            popper-class="sv-select__popper"
            clearable
          >
            <ElOption
              v-for="option, in statisticNumericOptions"
              :key="option.id"
              :label="option.name"
              :value="option.name"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </main>
    <footer>
      <ElButton
        v-if="isValid"
        class="sv-button"
        type="primary"
        @click.prevent="handleConfirm"
      >
        完成
      </ElButton>
      <ElButton
        v-if="data.countType"
        class="sv-button"
        @click="$emit('cancel')"
      >
        取消
      </ElButton>
      <ElButton
        v-if="selectedStatisticTypeIndex !== ''"
        class="sv-button"
        @click="resetState"
      >
        重置
      </ElButton>
    </footer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  watch,
  computed,
} from 'vue';

export default defineComponent({
  name: 'InitSetting',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    optionsList: {
      type: Array,
      required: true,
    },
  },
  emits: [
    'confirm',
    'cancel',
  ],
  setup(props, { emit }) {
    // 1. 统计类型选项与取值
    const statisticTypeOptions = ref<string[]>(['汇总', '饼状图', '折线图', '柱状图', '重点排行', '分类统计卡片']);
    const selectedStatisticTypeIndex = ref<number | ''>('');
    // 2. 汇总字段选项与取值
    const summaryFieldOptions = ref<{ id: number, name: string }[]>([]);
    const selectedSummaryFieldIndex = ref<string>('');
    // 3. 时间字段选项与取值
    const timeFieldOptions = ref<string[]>([]);
    const selectedTimeFieldIndex = ref<string>('');
    // 4. 横坐标选项与取值
    const xAxisOptions = ref<string[]>([]);
    const selectedXAxisIndex = ref<string>('');
    // 5. 纵坐标选项与取值
    const yAxisOptions = ref<string[]>([]);
    const selectedYAxisIndex = ref<string>('');
    // 6. 统计对象选项与取值
    const statisticObjectOptions = ref<string[]>([]);
    const selectedStatisticObjectIndex = ref<string>('');
    // 7. 统计数值选项与取值
    const statisticNumericOptions = ref<string[]>([]);
    const selectedStatisticNumericIndex = ref<string>('');
    const { optionsList }: any = toRefs(props);
    // 输入是否有效
    const isValid = computed(() => {
      switch (selectedStatisticTypeIndex.value) {
        case 0: {
          if (selectedSummaryFieldIndex.value && selectedTimeFieldIndex.value) return true;
          break;
        }
        case 1: {
          if (selectedSummaryFieldIndex.value) return true;
          break;
        }
        case 2:
        case 3: {
          if (selectedXAxisIndex.value && selectedYAxisIndex.value) return true;
          break;
        }
        case 4:
        case 5: {
          if (selectedStatisticObjectIndex.value && selectedStatisticNumericIndex.value) return true;
          break;
        }
        default: return false;
      }
      return false;
    });
    watch([optionsList, selectedStatisticTypeIndex], ([options, type]) => {
      selectedSummaryFieldIndex.value = '';
      selectedTimeFieldIndex.value = '';
      selectedXAxisIndex.value = '';
      selectedYAxisIndex.value = '';
      selectedStatisticObjectIndex.value = '';
      selectedStatisticNumericIndex.value = '';
      summaryFieldOptions.value = (type === 0 ? [...options[1]] : [...options[0], ...options[5]]);
      timeFieldOptions.value = options[2] || [];
      xAxisOptions.value = options[2] || [];
      yAxisOptions.value = options[1] || [];
      statisticObjectOptions.value = options[5] || [];
      statisticNumericOptions.value = [...options[1]];
    }, {
      deep: true,
    });
    // 重置状态
    function resetState() {
      selectedStatisticTypeIndex.value = '';
      // summaryFieldOptions.value = [];
      selectedSummaryFieldIndex.value = '';
      // timeFieldOptions.value = [];
      selectedTimeFieldIndex.value = '';
      // xAxisOptions.value = [];
      selectedXAxisIndex.value = '';
      // yAxisOptions.value = [];
      selectedYAxisIndex.value = '';
      // statisticObjectOptions.value = [];
      selectedStatisticObjectIndex.value = '';
      // statisticNumericOptions.value = [];
      selectedStatisticNumericIndex.value = '';
    }
    watch(() => props.data, (newVal) => {
      if (newVal) {
        selectedStatisticTypeIndex.value = newVal.countType - 1;
        switch (selectedStatisticTypeIndex.value) {
          case 0: {
            selectedSummaryFieldIndex.value = newVal.firstParam;
            selectedTimeFieldIndex.value = newVal.secondParam;
            break;
          }
          case 1: {
            selectedSummaryFieldIndex.value = newVal.firstParam;
            break;
          }
          case 2:
          case 3: {
            selectedXAxisIndex.value = newVal.firstParam;
            selectedYAxisIndex.value = newVal.secondParam;
            break;
          }
          case 4:
          case 5: {
            selectedStatisticObjectIndex.value = newVal.firstParam;
            selectedStatisticNumericIndex.value = newVal.secondParam;
            break;
          }
          default: {
            resetState();
          }
        }
      } else {
        resetState();
      }
    }, {
      deep: true,
      immediate: true,
    });
    // 确定
    function handleConfirm() {
      let firstParam = '';
      let secondParam = '';
      switch (selectedStatisticTypeIndex.value) {
        case 0: {
          firstParam = selectedSummaryFieldIndex.value;
          secondParam = selectedTimeFieldIndex.value;
          break;
        }
        case 1: {
          firstParam = selectedSummaryFieldIndex.value;
          break;
        }
        case 2:
        case 3: {
          firstParam = selectedXAxisIndex.value;
          secondParam = selectedYAxisIndex.value;
          break;
        }
        case 4:
        case 5: {
          firstParam = selectedStatisticObjectIndex.value;
          secondParam = selectedStatisticNumericIndex.value;
          break;
        }
        default:
      }
      const result = {
        countType: Number(selectedStatisticTypeIndex.value) + 1,
        firstParam,
        secondParam,
      };
      emit('confirm', result);
    }
    return {
      statisticTypeOptions,
      selectedStatisticTypeIndex,
      summaryFieldOptions,
      selectedSummaryFieldIndex,
      timeFieldOptions,
      selectedTimeFieldIndex,
      xAxisOptions,
      selectedXAxisIndex,
      yAxisOptions,
      selectedYAxisIndex,
      statisticObjectOptions,
      selectedStatisticObjectIndex,
      statisticNumericOptions,
      selectedStatisticNumericIndex,
      resetState,
      isValid,
      handleConfirm,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  & > main {
    flex: 1;
    padding: 10px;
  }
  & > footer {
    height: 70px;
    line-height: 70px;
    text-align: center;
  }
}
</style>
