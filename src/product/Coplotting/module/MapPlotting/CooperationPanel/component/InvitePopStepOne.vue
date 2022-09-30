// 选择平台
<template>
  <ElDialog
    v-model="showDialog"
    :custom-class="`${returnNewClass('sv-dialog')}`"
    title="选择平台"
    :width="from === 'commandBrain' ? 480 : 458"
  >
    <main class="selectPlatform">
      <div class="selectPlatform__search">
        <ElInput
          v-model="searchValue"
          class="sv-input--search"
          placeholder="请输入平台名称"
          clearable
          style="width: 420px"
          suffix-icon="el-icon-search"
        />
      </div>
      <div class="selectPlatform__content">
        <ElTree
          ref="treeOne"
          class="sv-tree"
          icon-class="sv-tree__icon"
          :data="useplatformData"
          node-key="id"
          :props="propsSetting"
          empty-text="暂无数据"
          :show-checkbox="true"
          :filter-node-method="filterTreeData"
          @check="clickCheckFun"
        />
        <ElTree
          ref="treeTwo"
          class="sv-tree"
          icon-class="sv-tree__icon"
          :data="AllplatformData"
          :default-checked-keys="selectIds"
          node-key="id"
          :props="propsSetting"
          empty-text="暂无数据"
          :show-checkbox="true"
          :filter-node-method="filterTreeData"
          @check="clickCheckFun"
        />
      </div>
    </main>
    <footer class="selectPlatform__footer">
      <div class="selectPlatform__footer__left">
        总数:<span>{{ allNum }}</span>
      </div>
      <div class="selectPlatform__footer__right">
        <ElButton
          class="sv-button"
          type="primary"
          @click="nextStep"
        >
          确认
        </ElButton>
        <ElButton
          class="sv-button"
          @click="close()"
        >
          取消
        </ElButton>
      </div>
    </footer>
  </ElDialog>
  <InvitePopStepTwo
    ref="InvitePopStepTwoRef"
    :select-plat-form-data="allArr"
    :from="from"
    @closeEmit="showDialog = false"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import InvitePopStepTwo from '@/product/Coplotting/module/MapPlotting/CooperationPanel/component/InvitePopStepTwo.vue';
import { ElMessage } from 'element-plus';
import returnClass from '@/product/Coplotting/module/MapPlotting/script/useReturnClass';

export default defineComponent({
  components: {
    InvitePopStepTwo,
  },
  props: {
    from: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const thisMapId: any = ref(0); // 当前的地图id
    console.log('当前的地图id是：');
    const store = useStore(); // 使用vuex
    const route = useRoute();
    if (props.from === 'commandBrain') {
      thisMapId.value = store.state.coplotting.mapId;
    } else {
      thisMapId.value = route.query.mapId;
    }
    console.log(thisMapId.value);
    const showDialog = ref(false);
    const useplatformData: any = ref([]);
    const AllplatformData: any = ref([]);
    const InvitePopStepTwoRef = ref<null>(null);
    const open = () => {
      showDialog.value = true;
    };
    const close = () => {
      showDialog.value = false;
    };
    const { returnNewClass } = returnClass(props);
    // 获取最近的平台数据
    const getRecentPlatform = () => {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/getRecentCooperatePlatforms',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            useplatformData.value = [
              { name: '最近选择平台', id: 1, children: response?.data || [] },
            ];
            useplatformData.value = JSON.parse(
              JSON.stringify(useplatformData.value)
                .replace(/platformName/g, 'name')
                .replace(/platformId/g, 'id'),
            );
          } else {
            ElMessage.error(
              `获取最近选择平台失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`获取最近选择平台失败，错误信息：${error}`);
        });
    };

    // 获取所有可选择的平台数据
    const getAllPlatform = () => {
      getInvitedPlatforms();
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/getAllPlatformTree',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          mapId: Number(thisMapId.value),
          type: 0, // 0:协作  1分享
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            AllplatformData.value = [
              { name: '全部平台', id: 1, children: response?.data || [] },
            ];
            AllplatformData.value = JSON.parse(
              JSON.stringify(AllplatformData.value)
                .replace(/platformName/g, 'name')
                .replace(/platformId/g, 'id'),
            );
          } else {
            ElMessage.error(
              `获取最近选择平台失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`获取全部平台失败，错误信息：${error}`);
        });
    };
    /**
    * @desc 获取当前平台已邀请的平台数据
    * @param {}
    * @returns {}
    */
   const getInvitedPlatforms = () => {
      // 获取邀请协作记录列表
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/getInviteCooperateRecordList',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: thisMapId.value,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          console.log(response);
          returnPlatformIds(response.data.list)
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取协作记录失败，错误信息：${error}`);
      });
   };
   const treeTwo = ref<null>(null);
    const selectIds:any = ref([])
    // 获取已经分享的平台的id数组
    function returnPlatformIds(topicArr:any) {
      const arr:any = [];
      topicArr.forEach((item:any) => {
        arr.push(item.cooperatePlatformId);
      });
      selectIds.value = arr;
      // return arr;
    }
    // 确认
    function nextStep() {
      if (InvitePopStepTwoRef.value) {
        (InvitePopStepTwoRef.value as any).open();
        (InvitePopStepTwoRef.value as any).getGroupData(thisMapId.value);
      }
    }
    return {
      showDialog,
      open,
      close,
      InvitePopStepTwoRef, // 配置权限
      useplatformData, // 常用平台
      AllplatformData, // 全部平台
      nextStep, // 确认操作
      getRecentPlatform, // 获取最近的平台数据
      getAllPlatform, // 获取所有可选择的平台数据
      getInvitedPlatforms,
      returnNewClass, // 动态绑定类名
      treeTwo,
      selectIds,
    };
  },
  data() {
    return {
      // 树形参数配置
      propsSetting: {
        label: 'name',
        children: 'children',
      },
      searchValue: '',
      allNum: 0,
      allArr: [],
    };
  },
  watch: {
    searchValue(val: any) {
      (this.$refs.treeOne as any).filter(val);
      (this.$refs.treeTwo as any).filter(val);
    },
  },
  methods: {
    filterTreeData(value: any, data: any) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 总平台数
    changeNum() {
      this.allNum = (this.$refs.treeOne as any)
        .getCheckedNodes(false, false)
        .concat(
          (this.$refs.treeTwo as any).getCheckedNodes(false, false),
        ).length;
      this.allArr = (this.$refs.treeOne as any)
        .getCheckedNodes(false, false)
        .concat((this.$refs.treeTwo as any).getCheckedNodes(false, false));
    },
    clickCheckFun() {
      this.changeNum();
    },
  },
});
</script>

<style lang="scss">
.selectPlatform {
  width: 100%;
  height: 330px;
  overflow: hidden;

  &__search {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e9ecf1;
  }
  &__content {
    width: 100%;
    height: 278px;
    overflow: auto;
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
  &__footer {
    height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    padding-left: 10px;
    &__left > span {
      color: #0091ff;
    }
  }
}
// 指挥大脑样式
.sv-dialogc {
  background: rgba(20, 29, 31, 0.94);
  border: 1px solid #00c1de;
  .el-dialog__header {
    height: 50px;
    padding: 0;
    font-size: 18px;
    color: #ffffff;
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    .el-dialog__title {
      line-height: 50px;
      font-size: 18px;
      color: #fff;
      margin-left: 20px;
    }
  }
  .el-dialog__body {
    padding: 0;
    .selectPlatform {
      width: 100%;
      min-height: 443px;
      overflow: hidden;

      &__search {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 440px;
        height: 32px;
        margin: 14px auto;
        border: 0;
        .el-input {
          height: 100%;

          > input {
            background: 0;
            height: 32px;
            outline: none;
            color: #fff;
          }
        }
      }
      &__content {
        width: 100%;
        min-height: 382px;
        overflow: auto;
        .el-tree {
          background: 0;
          color: #fff;
          .el-tree-node:focus > .el-tree-node__content {
            background: linear-gradient(
              90deg,
              rgba(20, 98, 140, 0.35) 0%,
              rgba(14, 69, 100, 0.69) 100%
            );
          }
          .el-tree-node:focus > .el-tree-node__children {
            background: 0;
          }
          .el-tree-node__content {
            background: 0;
            height: 38px;
          }
          .el-tree-node.is-expanded > .el-tree-node__children {
            background: 0;
            .el-tree-node {
              border-bottom: 1px solid rgba(255, 255, 255, 0.15);
              min-height: 38px;
              // display: flex;
              align-items: center;
              .el-tree-node__content {
                width: 100%;
                height: 38px;
              }
            }
          }
          .el-tree-node__content:hover {
            background: rgba(0, 193, 222, 0.15);
          }
          .el-checkbox__inner {
            background: 0;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background: 0;
            border-color: #fff;
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
        &::-webkit-scrollbar {
          background: transparent;
          width: 5px;
          height: 5px;
        }
        &::-webkit-scrollbar-thumb {
          background: #d5d5d5;
          border-radius: 5px;
        }
      }
      &__footer {
        height: 55px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 10px;
        padding-left: 10px;
        border-top: 1px solid rgba(225, 225, 225, 0.15);
        &__left > span {
          color: #0091ff;
        }
        &__right {
          > button:nth-child(1) {
            border: 1px solid rgba(255, 255, 255, 0);
            width: 64px;
            height: 32px;
            background: #00c1de;
            border-radius: 0;
            line-height: 32px;
            padding: 0;
            min-height: 32px;
            &:hover {
              color: rgba(225, 225, 225, 0.8);
              background: rgba(0, 193, 222, 0.8);
            }
          }
          > button:nth-child(2) {
            border: 1px solid rgba(255, 255, 255, 0.45);
            width: 64px;
            height: 32px;
            background: 0;
            border-radius: 0;
            line-height: 32px;
            padding: 0;
            min-height: 32px;
            color: #fff;
            &:hover {
              color: rgba(225, 225, 225, 0.8);
            }
          }
        }
      }
    }
  }
}
</style>
