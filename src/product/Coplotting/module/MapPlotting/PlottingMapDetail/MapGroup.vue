<template>
  <div :class="`${returnNewClass('MapGroupSection')}`">
    <div :class="`${returnNewClass('MapGroupSection')}__opertion`">
      <ElButton
        v-if="thisMapType != 'coop'"
        :class="[
          'sv-button',
          `${returnNewClass('MapGroupSection')}__opertion__btn`,
        ]"
        type="primary"
        @click="showDialog = true"
      >
        新建分组
      </ElButton>
      <ElCheckbox v-model="isShowText" label="显示文字" @change="showText" />
      <ElCheckboxGroup
        v-model="labelFlag"
        :class="`${returnNewClass('checkboxGroup')}`"
      >
        <ElCheckbox
          label="全部显示"
          :checked="isChecked"
          @change="showAllLayerFun"
        />
      </ElCheckboxGroup>
    </div>
    <div :class="`${returnNewClass('MapGroupSection')}__content`">
      <OperationTree
        ref="OperationTreeRef"
        :showcheckbox="false"
        :is-show-child-icon="true"
        :tree-data="groupData"
        :delete-type="'group'"
        :from="from"
        @isDefaultFun="isDefaultFun"
        @lookFun="lookFun"
        @editGroupFun="editGroupFun"
        @deleteGroupFun="deleteGroupFun"
        @deleteItemFun="deleteItemFun"
      />
    </div>
  </div>
  <!-- // 新增分组 -->
  <ElDialog
    v-model="showDialog"
    :custom-class="[`sv-dialog`, from === 'commandBrain' ? 'sv-dialogAdd' : '']"
    title="新建分组"
    :width="380"
  >
    <div class="newGroupContent">
      <div class="newGroupContent__labelName">分组名称：</div>
      <el-input v-model="inputValue" placeholder="请输入内容" />
    </div>

    <footer class="newGroupContent__footer">
      <ElButton class="sv-button" type="primary" @click="newGroupFun">
        确认
      </ElButton>
      <ElButton class="sv-button" @click="showDialog = false"> 取消 </ElButton>
    </footer>
  </ElDialog>
  <!-- 编辑分组 -->
  <ElDialog
    v-model="showEditDialog"
    custom-class="sv-dialog"
    title="编辑分组"
    :width="412"
  >
    <div class="newGroupContent">
      <div class="newGroupContent__labelName">分组名称：</div>
      <el-input v-model="inputEditValue" placeholder="请输入内容" />
    </div>

    <footer class="newGroupContent__footer">
      <ElButton class="sv-button" type="primary" @click="saveNewGroupNameFun">
        确认
      </ElButton>
      <ElButton class="sv-button" @click="showEditDialog = false">
        取消
      </ElButton>
    </footer>
  </ElDialog>
  <!-- 删除分组 -->
  <ElDialog
    v-model="showDeleteDialog"
    :custom-class="[`sv-dialog`, from === 'commandBrain' ? 'sv-dialogAdd' : '']"
    title="删除分组"
    :width="380"
  >
    <div class="newGroupContent">
      <div
        v-if="isDefault"
        class="newGroupContent__delete"
      >
        默认分组包含“{{ childNums }}”项内容，确认清空默认分组数据？
      </div>
      <div
        v-else
        class="newGroupContent__delete"
      >
        当前分组包含“{{ childNums }}”项内容，确认将分组和内容同时删除？
      </div>
    </div>

    <footer class="newGroupContent__footer">
      <ElButton
        v-if="!isDefault"
        class="sv-button__onlyDeleteGroup"
        type="primary"
        @click="deletFun(0)"
      >
        仅删除分组
      </ElButton>
      <ElButton
        class="sv-button__deleteAll"
        type="primary"
        @click="deletFun(1)"
      >
        {{ isDefault ? '删除' : '全部删除' }}
      </ElButton>
      <ElButton class="sv-button" @click="showDeleteDialog = false">
        取消
      </ElButton>
    </footer>
  </ElDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
  watch,
  nextTick,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import OperationTree from '@/product/Coplotting/module/MapPlotting/PlottingMapDetail/component/Operationtree.vue';
import { ElMessage } from 'element-plus';
import returnClass from '@/product/Coplotting/module/MapPlotting/script/useReturnClass';
import useReturnAllNodes from '@/product/Coplotting/module/MapPlotting/script/useReturnAllNodes';
import { setTimeout } from 'timers';

export default defineComponent({
  components: {
    OperationTree, // 树形组件
  },
  props: {
    from: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const instance: any = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const groupData: any = ref([]); // 分组数据
    const labelFlag = ref([]);
    const inputValue = ref(); // 分组名
    const inputEditValue = ref('');
    const showDialog = ref(false); // 添加分组弹框
    const showEditDialog = ref(false); // 编辑分组弹框
    const showDeleteDialog = ref(false); // 删除分组弹框
    const editGroupId = ref(0); // 要编辑的分组id
    const thisMapId: any = ref(0); // 当前的地图id
    const thisMapType: any = ref('old'); // 地图类型
    const store = useStore(); // 使用vuex
    const isFrashFlag = ref(false);
    const OperationTreeRef: any = ref<null>(null); // 树形Ref
    const isChecked = ref(true);
    const isShowText = ref(true); // 是否显示文字
    const childNums = ref(0); // 子级节点的数目
    const deleteType = ref(0); // 是否全部删除
    isFrashFlag.value = store.state.coplotting.isRefrashGroup; // 是否刷新分组列表
    const isDefault = ref(false); // 是否删除的是默认分组
    const route = useRoute();
    // if (props.from === 'commandBrain') {
    //   thisMapId.value = store.state.coplotting.mapId;
    // } else {
    //   thisMapId.value = route.query.mapId;
    // }
    thisMapId.value = store.state.coplotting.mapId;
    thisMapType.value = route.query?.type;
    console.log(thisMapId.value);

    function lookFun() {
      // alert('父组件的方法被调用了')
    }
    const { returnNewClass } = returnClass(props);
    // 根据地图id获取分组树形数据
    const getGroupData = (id: number) => {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistmapgroup/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: store.state.coplotting.mapId,
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            groupData.value = response?.data || [];
            groupData.value = JSON.parse(
              JSON.stringify(groupData.value)
                .replace(/groupName/g, 'name')
                .replace(/records/g, 'children')
                .replace(/markName/g, 'name'),
            );
          } else {
            ElMessage.error(
              `获取分组数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`获取分组数据失败，错误信息：${error}`);
        });
      store.commit('coplotting/SET_REFRASHGROUP', false);
    };
    // 新建分组
    const newGroupFun = () => {
      if (inputValue.value === '') {
        ElMessage.error('请输入分组名称');
        return;
      }
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmapgroup/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          groupName: inputValue.value,
          mapId: thisMapId.value,
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            showDialog.value = false;
            inputValue.value = '';
            getGroupData(thisMapId.value);
          } else {
            ElMessage.error(
              `新增失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`新增失败，错误信息：${error}`);
        });
    };
    /**
     * @desc 根据分组id获取该分组下级的所有子级节点的数量
     * @param {
     * id:分组id
     * }
     * @returns {
     * 子级节点的数量
     * }
     */
    const deleteGroupId: any = ref('');
    const returnNumsByGroupId = (id: number) =>
      groupData.value[groupData.value.findIndex((item: any) => item.id === id)]
        .children?.length || 0;
    // 删除分组
    const deleteGroupFun = (id: number) => {
      showDeleteDialog.value = true;
      console.log(returnNumsByGroupId(id));
      childNums.value = returnNumsByGroupId(id);
      deleteGroupId.value = id;
    };
    /**
     * @desc 删除
     * @param {}
     * @returns {}
     */
    const deletFun = (type: number) => {
      if (deleteGroupId.value === '') {
        return ElMessage.warning('分组不存在');
      }
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmapgroup/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          id: deleteGroupId.value,
          deleteType: type, // 0不删除分组里面的数据1完全删除分组的所有数据
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            showDeleteDialog.value = false;
            getGroupData(thisMapId.value);
            ElMessage.success('删除成功');
          } else if (response.msg === '默认分组不能删除') {
            ElMessage.warning('删除失败，请不要删除默认分组');
          } else {
            ElMessage.error(
              `删除失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`删除失败，错误信息：${error}`);
        });
    };
    // 编辑分组
    const editGroupFun = (obj: any) => {
      inputEditValue.value = obj?.name || '';
      editGroupId.value = obj?.id || 0;
      showEditDialog.value = true;
    };
    // 更新分组
    const saveNewGroupNameFun = () => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmapgroup/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: editGroupId.value,
          groupName: inputEditValue.value,
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            showEditDialog.value = false;
            getGroupData(thisMapId.value);
          } else {
            ElMessage.error(
              `修改失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`修改失败，错误信息：${error}`);
        });
    };
    // 删除子节点
    const deleteItemFun = (id: number) => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmarkrecord/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
        } else {
          ElMessage.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除失败，错误信息：${error}`);
      });
    };
    // 判定是否是删除默认分组
    const isDefaultFun = (isDefaultValue: any) => {
      console.log(isDefault);
      if (isDefaultValue === 1) {
        isDefault.value = true;
      } else {
        isDefault.value = false;
      }
    };
    // 全部显示或者全部隐藏当前地图的所有图层
    const showAllLayerFun = (e: any) => {
      console.log(e);
      if (e) {
        OperationTreeRef.value.showAllLayerFun(true);
      } else {
        OperationTreeRef.value.showAllLayerFun(false);
      }
    };
    /**
     * @desc  显示隐藏文字
     * @param {} params
     * @returns {} returns
     */
    const showText = () => {
      window.map.setCoverTextVis(isShowText.value);
    };
    /**
     * @desc 重新显示所有标绘数据
     * @param {} params
     * @returns {} returns
     */
    const renderAllLayers = () => {
      getGroupData(thisMapId.value);
      nextTick(() => {
        setTimeout(() => {
          isChecked.value = true;
          showAllLayerFun(true);
        }, 1000);
      });
    };
    // 监听是否刷新分组列表
    watch(
      () => store.state.coplotting.isRefrashGroup,
      (val, old) => {
        renderAllLayers();
      },
    );
    // 监听完成或者取消的时候刷新分组列表
    watch(
      () => store.state.coplotting.cancelDraw,
      (val, old) => {
        console.log('有标绘完成或取消');
        renderAllLayers();
      },
    );
    // 删除图层数据的时候刷新分组列表
    watch(
      () => store.state.coplotting.deleteId,
      (val, old) => {
        console.log('有标绘删除');
        getGroupData(thisMapId.value);
        renderAllLayers();
      },
    );
    // 添加图层数据的时候刷新分组列表
    watch(
      () => store.state.coplotting.saveId,
      (val, old) => {
        console.log('有标绘添加');
        renderAllLayers();
      },
    );
    // 切换事件的时候刷新分组列表
    watch(
      () => store.state.coplotting.mapId,
      (val, old) => {
        console.log('事件切换了');
        renderAllLayers();
      },
    );
    onMounted(() => {
      getGroupData(thisMapId.value);
      nextTick(() => {
        setTimeout(() => {
          isChecked.value = true;
          showAllLayerFun(true);
        }, 1000);
      });
    });
    return {
      labelFlag,
      lookFun,
      groupData,
      getGroupData,
      deleteGroupFun,
      editGroupFun,
      showDialog,
      inputValue,
      newGroupFun,
      inputEditValue,
      showEditDialog, // 编辑分组弹框
      saveNewGroupNameFun, // 更新分组
      returnNewClass,
      showAllLayerFun, // 全部显示
      OperationTreeRef,
      isChecked,
      showText,
      isShowText,
      thisMapType,
      showDeleteDialog,
      childNums,
      deleteType,
      deletFun,
      deleteItemFun,
      isDefault,
      isDefaultFun,
    };
  },
});
</script>

<style lang="scss">
.MapGroupSection {
  &__opertion {
    display: flex;
    align-items: center;
    height: 42px;
    justify-content: space-around;
    &__btn {
      margin-left: 10px;
      margin-right: 36px;
    }
  }
  &__content {
  }
}
.newGroupContent {
  width: 94%;
  height: 60px;
  display: flex;
  margin: 0 auto;
  align-items: center;
  &__labelName {
    width: 90px;
  }
}
.newGroupContent__footer {
  width: 97%;
  height: 45px;
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}
// 指挥大脑样式
.MapGroupSectionc {
  &__opertion {
    display: flex;
    align-items: center;
    height: 42px;
    justify-content: space-around;
    &__btn {
      margin-left: 10px;
      margin-right: 36px;
      background: 0;
      border: 0;
      font-size: 14px;
      color: #56e9ff;
      &:hover {
        background: 0;
        color: #56e9ff;
      }
      &:focus {
        background: 0;
        color: #56e9ff;
      }
    }
    & > div {
      & span {
        z-index: 0;
      }
    }
  }
  &__content {
    .sv-tree {
      color: #ffffff;
      background: 0;
      width: 360px;
      margin: 0 auto;
      .el-tree-node__children {
        .el-tree-node {
          margin: 10px 0;
          background: rgba(0, 193, 222, 0.15);
        }
      }
      .el-tree-node__content {
        background: rgba(0, 193, 222, 0.15);
      }
      .is-current {
        // margin-bottom: 10px;
      }
      .el-tree-node:focus > .el-tree-node__content {
        background: rgba(0, 193, 222, 0.7);
      }
      .el-tree-node:focus > .el-tree-node__children {
      }
      .el-tree-node__content {
      }
      .el-tree-node.is-expanded > .el-tree-node__children {
      }
      .el-tree-node__content:hover {
        background: rgba(0, 193, 222, 0.15);
      }
      .el-tree-node__content > .el-tree-node__expand-icon {
        width: 6px;
        height: 6px;
        position: relative;
        flex-shrink: 0;
        &::before {
          content: '';
          display: block;
          width: 7px;
          height: 1px;
          position: absolute;
          left: 6px;
          top: 10px;
          background: #c0c0c0;
          transform: rotate(-45deg);
        }
        &::after {
          content: '';
          display: block;
          width: 7px;
          height: 1px;
          position: absolute;
          left: 6px;
          top: 6px;
          background: #c0c0c0;
          transform: rotate(45deg);
        }
      }
      .el-tree-node__expand-icon.is-leaf {
        color: transparent;
        cursor: default;
        display: none;
      }
    }
  }
}
// 弹窗样式
.sv-dialogAdd {
  width: 410px;
  height: 242px;
  background: rgba(20, 29, 31, 0.94);
  border: 1px solid #00c1de;
  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__body {
    padding: 0;
    height: 186px;
    .newGroupContent {
      width: 100%;
      height: 135px;
      display: flex;
      margin: 0 auto;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      .newGroupContent__labelName {
        width: 90px;
        color: #ffffff;
      }
      .el-input__inner {
        width: 294px;
        height: 30px;
        border: 1px solid #a6adb4;
        background: 0;
        border-radius: 0;
        color: #fff;
      }
      .newGroupContent__delete {
        width: 100%;
        color: #fff;
        text-align: center;
      }
    }
    .newGroupContent__footer {
      height: 50px;
      display: flex;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      .el-button {
        background: 0;
        width: 65px;
        height: 32px;
        border: 1px solid rgba(255, 255, 255, 0.45);
        color: #fff;
        padding: 0;
        border-radius: 0;
        min-height: 32px;
        &:nth-child(1) {
          background: #00c1de;
        }
        &:nth-child(2) {
        }
      }
      .sv-button__onlyDeleteGroup {
        width: 81px;
        padding: 0 10px;
        min-height: 32px;
      }
      .sv-button__deleteAll {
        width: 81px;
        padding: 0 10px;
        min-height: 32px;
        background: #00c1de;
      }
    }
  }
}
.sv-button__onlyDeleteGroup {
  width: 81px;
  padding: 0 10px;
  min-height: 32px;
  height: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sv-button__deleteAll {
  width: 81px;
  padding: 0 10px;
  min-height: 32px;
  height: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
