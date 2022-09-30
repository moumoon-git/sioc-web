// 选择平台
<template>
  <ElDialog
    v-model="showDialog"
    :modal="false"
    custom-class="sv-dialog"
    title="添加平台"
    center
    :width="533"
  >
    <div class="shareSelectPlatformSection">
      <div class="shareSelectPlatformSection__search">
        <ElInput
          v-model="searchValue"
          class="sv-input--search"
          placeholder="请输入平台名称"
          clearable
          style="width: 234px"
          suffix-icon="el-icon-search"
        />
      </div>
      <div class="shareSelectPlatformSection__tree">
        <el-checkbox
          v-model="checkedAll"
          class="ShareCheckAll"
          @change="selectAll"
        >
          全部
        </el-checkbox>
        <ElTree
          ref="treeRef"
          class="sv-tree"
          icon-class="sv-tree__icon"
          :data="AllplatformData"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="true"
          :filter-node-method="filterTreeData"
          @check="clickCheckFun"
        >
          <template #default="{ node, data }">
            <div class="custom-share-tree-node">
              <div>{{ node.label }}</div>
              <div
                v-if="data.haveShared&&data.haveShared===1"
                class="shareStatus"
              >
                已分享
              </div>
            </div>
          </template>
        </ElTree>
      </div>
      <div class="shareSelectPlatformSection__footer">
        <div class="shareSelectPlatformSection__footer__left">
          已选择 ({{ allNum }})
        </div>
        <div class="shareSelectPlatformSection__footer__btns">
          <div
            class="shareSelectPlatformSection__footer__btns__next"
            @click="openSelectGroup"
          >
            下一步
          </div>
          <div
            class="shareSelectPlatformSection__footer__btns__cancle"
            @click="showDialog=false"
          >
            取消
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
  <SelectGroup
    ref="SelectGroupRef"
    :select-plat-form-data="allArr"
  />
</template>
<script lang="ts">
import {
 defineComponent, ref, getCurrentInstance, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import SelectGroup from '@/product/Coplotting/module/ShareSection/SelectGroup.vue'; // 选择分组组件

export default defineComponent({
    components: {
        SelectGroup,
    },
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showDialog = ref(false);
    const route = useRoute();
    const thisMapId: any = ref(0); // 当前的地图id
    thisMapId.value = route.query.mapId;
    const searchValue = ref(''); // 搜索值
    const checkedAll = ref(false); // 全选
    const treeRef = ref<null>(null); // 树
    const SelectGroupRef = ref<null>(null); // 选择分组
    const AllplatformData: any = ref([]); // 全部平台数据
    const defaultProps = ref({
          label: 'name',
        children: 'children',
        });
    // 打开
    const open = () => {
      showDialog.value = true;
    };
    // 关闭
    const close = () => {
      showDialog.value = false;
    };
    // 获取平台树
    const getPlatformTree = () => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/getAllPlatformTree',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          mapId: Number(thisMapId.value),
          type: 1, // 0:协作  1分享
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            AllplatformData.value = response?.data || [];
            AllplatformData.value = JSON.parse(
              JSON.stringify(AllplatformData.value)
                .replace(/platformName/g, 'name')
                .replace(/platformId/g, 'id'),
            );
          } else {
            ElMessage.error(
              `获取全部平台失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`获取全部平台失败，错误信息：${error}`);
        });
    };
    // 总平台数
    const allNum = ref(0); // 选择总数
    const allArr = ref([]); // 选择总节点数
    const changeNum = () => {
      allNum.value = (treeRef.value as any).getCheckedNodes(false, false).length;
      allArr.value = (treeRef.value as any).getCheckedNodes(false, false);
    };
    // 点击复选框方法
    const clickCheckFun = () => {
      changeNum();
    };
    /**
    * @desc 设置全选
    * @param {} params
    * @returns {} returns
    */
   const selectAll = () => {
     if (checkedAll.value) {
       (treeRef.value as any).setCheckedNodes(AllplatformData.value); // 全选
     } else {
       (treeRef.value as any).setCheckedKeys([]);
     }
     changeNum();
   };
    // 过滤
    const filterTreeData = (value: any, data: any) => {
        if (!value) return true;
      return data.name.indexOf(value) !== -1;
    };
    // 打开选择分组弹窗
    const openSelectGroup = () => {
        if (SelectGroupRef.value) {
            (SelectGroupRef.value as any).open();
            (SelectGroupRef.value as any).getGroupData();
        }
    };
    // 监听过滤
    watch(() => searchValue.value, (val, old) => {
      console.log(searchValue.value);
      (treeRef.value as any).filter(searchValue.value);
    });
    return {
      showDialog,
      open,
      close,
      searchValue,
      defaultProps,
      checkedAll,
      selectAll,
      filterTreeData,
      treeRef,
      SelectGroupRef,
      openSelectGroup,
      AllplatformData,
      getPlatformTree,
      allNum,
      clickCheckFun,
      allArr,
    };
  },
});
</script>

<style lang="scss" src="./style/SelectPlatform.scss"></style>
