import { ref, Ref } from 'vue';

export default (): [Ref<boolean>, () => void] => {
  const visible = ref(true);

  const toggleMarkerLabel = () => {
    visible.value = !visible.value;
    // 控制标题的显示隐藏
    (window as any).map.setCoverTextVis(visible.value);
  };

  return [visible, toggleMarkerLabel];
};
