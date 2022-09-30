import { ref, computed, watch } from 'vue';

// 名称
const statusName = ref('正常');
// 设为默认状态
const isDefault = ref(true);
// 边线颜色
const strokeColor = ref('#0091FF');
// 填充透明度
const fillOpacity = ref(70);
// 粗细
const lineHeight = ref(4);
// 样式预览
const stylePreview = computed(() => ({
  background: strokeColor.value,
  opacity: fillOpacity.value / 100,
  height: `${lineHeight.value}px`,
}));
// 防止填充颜色值为空
watch(strokeColor, (newVal) => {
  if (!newVal) {
    strokeColor.value = '#0091FF';
  }
});
// 重置所有取值
const resetState = (): void => {
  statusName.value = '正常';
  isDefault.value = true;
  strokeColor.value = '#0091FF';
  fillOpacity.value = 70;
  lineHeight.value = 4;
};

export default {
  stylePreview,
  fillOpacity,
  lineHeight,
  strokeColor,
  statusName,
  isDefault,
  resetState,
};
