import { ref, computed, watch } from 'vue';

// 名称
const statusName = ref('正常');
// 设为默认状态
const isDefault = ref(true);
// 分类样式：0-纯色，1-纹理
const styleType = ref(0);
// 填充颜色
const fillColor = ref('#0091FF');
// 线类型：0-虚线，1-实线
const lineType = ref(0);
// 填充透明度
const fillOpacity = ref(70);
// 粗细
const lineHeight = ref(4);
// 样式预览
const stylePreview = computed(() => ({
  background: lineType.value === 0 ? `repeat left/10px 100% linear-gradient(to right, ${fillColor.value} 50%, transparent 50%)` : fillColor.value,
  opacity: fillOpacity.value / 100,
  height: `${lineHeight.value}px`,
}));
// 防止填充颜色值为空
watch(fillColor, (newVal) => {
  if (!newVal) {
    fillColor.value = '#0091FF';
  }
});
// 重置所有取值
const resetState = (): void => {
  statusName.value = '正常';
  isDefault.value = true;
  styleType.value = 0;
  fillColor.value = '#0091FF';
  lineType.value = 0;
  fillOpacity.value = 70;
  lineHeight.value = 4;
};

export default {
  stylePreview,
  fillOpacity,
  lineType,
  lineHeight,
  fillColor,
  styleType,
  statusName,
  isDefault,
  resetState,
};
