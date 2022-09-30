import { ref, computed, watch } from 'vue';

// 名称
const statusName = ref('正常');
// 设为默认状态
const isDefault = ref(true);
// 填充颜色
const fillColor = ref('#F66E6E');
// 线类型：0-虚线，1-实线
const lineType = ref(0);
// 填充透明度
const fillOpacity = ref(70);
// 线颜色
const strokeColor = ref('#0091FF');
// 粗细
const lineHeight = ref(2);
// 样式预览
const stylePreview = computed(() => ({
  background: {
    background: fillColor.value,
    opacity: fillOpacity.value / 100,
  },
  stroke: {
    border: `${lineHeight.value}px ${lineType.value ? 'solid' : 'dashed'} ${strokeColor.value}`,
  },
}));
// 防止填充颜色值为空
watch(fillColor, (newVal) => {
  if (!newVal) {
    fillColor.value = '#F66E6E';
  }
});
watch(strokeColor, (newVal) => {
  if (!newVal) {
    strokeColor.value = '#0091FF';
  }
});
// 重置所有取值
const resetState = (): void => {
  statusName.value = '正常';
  isDefault.value = true;
  fillColor.value = '#F66E6E';
  strokeColor.value = '#0091FF';
  lineType.value = 0;
  fillOpacity.value = 70;
  lineHeight.value = 2;
};

export default {
  stylePreview,
  fillOpacity,
  lineType,
  lineHeight,
  fillColor,
  statusName,
  isDefault,
  resetState,
  strokeColor,
};
