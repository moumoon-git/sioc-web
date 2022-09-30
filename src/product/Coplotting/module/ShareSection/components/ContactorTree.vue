<template>
  <ElInput
    v-model="searchValue"
    class="sv-input--search contactorSearch"
    placeholder="请输入平台名称"
    clearable
    style="width: 234px"
    suffix-icon="el-icon-search"
  />
  <ElTree
    ref="treeRef"
    class="sv-tree"
    icon-class="sv-tree__icon"
    :data="contactorTreeData"
    node-key="id"
    :props="defaultProps"
    empty-text="暂无数据"
    :show-checkbox="true"
    :filter-node-method="filterTreeData"
    @node-click="nodeCheckFun"
    @check-change="nodeCheckboxFun"
  />
</template>

<script lang="ts">
import {
 defineComponent, ref, getCurrentInstance, watch, onMounted,
} from 'vue';
import useContactorFun from './script/useContactor';

export default defineComponent({
  emits: ['groupPersonData'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const {
      contactorTreeData, // 通讯录
      getContactor, // 获取通讯录树结构
      getPersonByGroupId, // 获取分组人员
      personListData, // 分组人员数据
    } = useContactorFun($http);
    const searchValue = ref(''); // 筛选值
    const treeRef = ref<null>(null); // 树
    const defaultProps = ref({
          children: 'children',
          label: 'name',
        });
    /*
     *@Description: 节点点击
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2021-06-16 10:21:01
    */
    function nodeCheckFun(data:any) {
      console.log(data);
      const sendData:any = {
          t: new Date().getTime(),
          limit: 100,
          page: 1,
          groupId: [data.id],
          platformId: '',
          };
        getPersonByGroupId(sendData);
        setTimeout(() => {
          emit('groupPersonData', personListData.value);
        }, 1000);
    }
    /**
    * @desc 复选框点击
    * @param {} params
    * @returns {} returns
    */
   const nodeCheckboxFun = (data:any,checkStatus:any) =>{
     console.log(data,checkStatus)
   }
    // 过滤
    const filterTreeData = (value: any, data: any) => {
        if (!value) return true;
      return data.name.indexOf(value) !== -1;
    };
    // 监听搜索框筛选树形组件
    watch(() => searchValue.value, (val, old) => {
      (treeRef.value as any).filter(searchValue.value);
    });
    onMounted(() => {
      getContactor();
    });
    return {
        filterTreeData,
        searchValue,
        defaultProps,
        treeRef,
        contactorTreeData,
        nodeCheckFun,
        nodeCheckboxFun
    };
  },
});
</script>

<style lang="scss">
.contactorSearch{
    margin: 10px auto;
}

</style>
