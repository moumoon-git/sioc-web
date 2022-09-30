import {
  ref,
  Ref,
  onMounted,
  onBeforeUpdate,
  nextTick,
} from 'vue';

export default (): {
  expandRefs: Ref<any[]>,
  isAllExpanded: Ref<boolean>,
  doRefresh: () => void,
  handleExpandAll: () => void,
  handleFoldChange: (isFolded: boolean) => void,
} => {
  /**
   * 是否已全部展开
   */
  const isAllExpanded = ref(true);

  /**
   * Expand.vue 组件实例引用
   */
  const expandRefs = ref<any[]>([]);

  // 已展开统计
  const expandedCount = ref(0);

  /**
   * 处理 Expand.vue 组件折叠变化
   * @param isFolded 是否折叠
   */
  const handleFoldChange = (isFolded: boolean) => {
    if (isFolded) {
      isAllExpanded.value = false;
      expandedCount.value -= 1;
    } else {
      expandedCount.value += 1;
      // 检查是否已全部展开
      if (expandedCount.value === expandRefs.value.length) {
        isAllExpanded.value = true;
      }
    }
  };

  // 执行全部展开/全部折叠
  const doExpandAll = (isExpand: boolean) => {
    nextTick(() => {
      expandRefs.value.forEach((instance) => {
        instance.isFolded = !isExpand;
      });
      expandedCount.value = isExpand ? expandRefs.value.length : 0;
      isAllExpanded.value = isExpand;
    });
  };

  /**
   * 【全部展开/全部折叠】按钮点击
   */
  const handleExpandAll = () => {
    doExpandAll(!isAllExpanded.value);
  };

  /**
   * 刷新数据时调用，恢复初始状态
   */
  const doRefresh = () => {
    doExpandAll(true);
    expandedCount.value = expandRefs.value.length;
  };

  onMounted(doRefresh);

  onBeforeUpdate(() => {
    // 清除 ref
    expandRefs.value.length = 0;
  });

  return {
    expandRefs,
    isAllExpanded,
    doRefresh,
    handleExpandAll,
    handleFoldChange,
  };
};
