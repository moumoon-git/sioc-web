import { ref } from 'vue';

// 名称
const statusName = ref('正常');
// 设为默认状态
const isDefault = ref(true);
// 显示尺寸：0-大号，1-常规，2-小号
const iconSize = ref(1);
// 重置状态
const resetState = (): void => {
  statusName.value = '正常';
  isDefault.value = true;
  iconSize.value = 1;
};

export default {
  statusName,
  isDefault,
  iconSize,
  resetState,
};
