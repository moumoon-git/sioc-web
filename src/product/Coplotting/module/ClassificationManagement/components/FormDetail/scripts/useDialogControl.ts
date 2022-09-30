import { Ref, inject } from 'vue';

interface AddStateDialog {
  open: (data?: any) => void
}

const useDialogControl = (
  // 点分类-新增状态弹窗引用
  AddDotStateDialogRef: Ref<null | AddStateDialog>,
  // 线分类-新增状态弹窗引用
  AddLineStateDialogRef: Ref<null | AddStateDialog>,
  // 面分类-新增状态弹窗引用
  AddAreaStateDialogRef: Ref<null | AddStateDialog>,
  // 其他分类-新增状态弹窗引用
  AddOtherStateDialogRef: Ref<null | AddStateDialog>,
  // 新增分类属性弹窗引用
  AddPropDialogRef: Ref<null | AddStateDialog>,
  // 复制分类属性弹窗引用
  CopyPropertyDialogRef: Ref<null | AddStateDialog>,
): {
  handleAddState: (
  ) => void,
  handleAddProp: (
  ) => void,
  handleCopyProp: (
  ) => void,
} => {
  // 当前的分类类型：0-点，1-面，2-线，3-其他
  const activeTabIndex: Ref<number> | undefined = inject('activeTabIndex');
  // 打开弹窗
  const handleAddState = () => {
    switch (activeTabIndex?.value) {
      // 点分类
      case 0: {
        if (AddDotStateDialogRef.value) {
          AddDotStateDialogRef.value.open();
        }
        break;
      }
      // 面分类
      case 1: {
        if (AddAreaStateDialogRef.value) {
          AddAreaStateDialogRef.value.open();
        }
        break;
      }
      // 线分类
      case 2: {
        if (AddLineStateDialogRef.value) {
          AddLineStateDialogRef.value.open();
        }
        break;
      }
      // 其他分类
      case 3: {
        if (AddOtherStateDialogRef.value) {
          AddOtherStateDialogRef.value.open();
        }
        break;
      }
      default:
    }
  };
  const handleAddProp = () => {
    if (AddPropDialogRef.value) {
      AddPropDialogRef.value.open();
    }
  };
  const handleCopyProp = () => {
    if (CopyPropertyDialogRef.value) {
      CopyPropertyDialogRef.value.open();
    }
  };
  return {
    handleAddState,
    handleAddProp,
    handleCopyProp,
  };
};

export default useDialogControl;
