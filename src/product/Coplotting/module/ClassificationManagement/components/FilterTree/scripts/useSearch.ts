import {
  ref,
  Ref,
  toRefs,
  watch,
} from 'vue';
import { ElTree } from 'element-plus';

type ElTreeRef = Ref<typeof ElTree | null>;

const useSearch = (
  tree: ElTreeRef,
): {
  searchKeyword: Ref<string>,
  filterTreeData: (
    value: string,
    data: any
  ) => boolean,
} => {
  // 搜索关键词
  const searchKeyword = ref('');
  // 键入关键词触发筛选
  watch(searchKeyword, (newVal) => {
    if (tree.value) {
      tree.value.filter(newVal);
    }
  });
  // 筛选规则
  const filterTreeData = (value: string, data: any) => {
    const regex = new RegExp(value);
    return data?.className?.match(regex) || data?.fileName?.match(regex);
  };
  return {
    searchKeyword,
    filterTreeData,
  };
};

export default useSearch;
