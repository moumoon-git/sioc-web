// 协作权限设置
<template>
  <ElDialog
    v-model="showDialog"
    :custom-class="`${returnNewClass('sv-dialog')}`"
    title="协作权限设置"
    :width="from === 'commandBrain' ? 480 : 458"
  >
    <main class="jurisdiction">
      <div
        v-for="(item, index) in templateRenderData"
        :key="index"
        class="jurisdiction__item"
      >
        <div class="jurisdiction__item__top">
          <div class="jurisdiction__item__top__left">
            {{ item.name }}
          </div>
          <div class="jurisdiction__item__top__right">
            <div
              v-if="from != 'commandBrain'"
              class="jurisdiction__item__top__setPoint"
              @click="nextStep(item.cooperatePlatformId)"
            >
              设置点分类
            </div>
            <div
              class="jurisdiction__item__top__delete"
              @click="deletePlatform(item.cooperatePlatformId)"
            >
              删除
            </div>
          </div>
        </div>
        <div class="jurisdiction__item__bottom">
          <div
            v-for="(item2, index2) in item.groupRights"
            :key="index2"
            class="jurisdiction__bottom__list"
          >
            <div class="jurisdiction__bottom__list__l">
              {{ item2.name }}
            </div>
            <div class="jurisdiction__bottom__list__r">
              <el-radio
                :class="{
                  'jurisdiction__bottom__list__r--active': item2.rights === '0',
                }"
                label="1"
                @click="
                  changeJurisdiction(
                    item.cooperatePlatformId,
                    item2.groupId,
                    '0',
                  )
                "
              >
                仅查看
              </el-radio>
              <el-radio
                label="2"
                :class="{
                  'jurisdiction__bottom__list__r--active': item2.rights === '1',
                }"
                @click="
                  changeJurisdiction(
                    item.cooperatePlatformId,
                    item2.groupId,
                    '1',
                  )
                "
              >
                可编辑
              </el-radio>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="jurisdiction__footer">
      <div class="jurisdiction__footer__right">
        <ElButton class="sv-button" type="primary" @click="addCoopFun">
          确认
        </ElButton>
        <ElButton class="sv-button" @click="close()"> 取消 </ElButton>
      </div>
    </footer>
  </ElDialog>
  <!-- 设置分类弹框 -->
  <InvitePopStepThree
    ref="InvitePopStepThreeRef"
    :select-plat-id="selectPlatId"
    @setPointEmit="setPointEmit"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  watchEffect,
  onMounted,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import InvitePopStepThree from '@/product/Coplotting/module/MapPlotting/CooperationPanel/component/InvitePopStepThree.vue';
import { ElMessage } from 'element-plus';
import returnClass from '@/product/Coplotting/module/MapPlotting/script/useReturnClass';

export default defineComponent({
  components: {
    InvitePopStepThree, // 设置分类弹框
  },
  props: {
    selectPlatFormData: {
      type: Array,
      default: [],
    },
    from: {
      type: String,
      default: '',
    },
  },
  emits: ['closeEmit'],
  setup(props, { emit }) {
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
    const InvitePopStepThreeRef = ref<null>(null);
    const listData = ref([]); // 列表的数据
    const templateRenderData = ref([]); // 模板渲染的数据
    const selectPlatId = ref(0); // 要设置点分类的平台id
    const open = () => {
      showDialog.value = true;
    };
    const close = () => {
      showDialog.value = false;
    };
    const { returnNewClass } = returnClass(props);
    // 下一步
    // id:平台id
    function nextStep(id: number) {
      selectPlatId.value = id;
      if (InvitePopStepThreeRef.value) {
        (InvitePopStepThreeRef.value as any).open();
        (InvitePopStepThreeRef.value as any).getIconsList();
      }
    }
    // 将获取的数据处理成接口数据
    function returnListData(arr: any) {
      const tempArr = props.selectPlatFormData;
      console.log(tempArr, arr);
      tempArr.forEach((item: any) => {
        item.groupData = arr;
      });

      const sendArrObj: any = [];
      arr.forEach((item: any) => {
        const tempObj: any = {};
        tempObj.groupId = item.id;
        tempObj.name = item.groupName;
        tempObj.rights = '0';
        sendArrObj.push(tempObj);
      });
      const allData: any = [];
      tempArr.forEach((item: any) => {
        const sendObj: any = {};
        sendObj.cooperatePlatformId = item.id;
        sendObj.name = item.name;
        sendObj.enableBasicClassIds = [];
        sendObj.groupRights = sendArrObj;
        allData.push(sendObj);
      });
      (templateRenderData.value as any) = allData;
    }
    // 添加协作
    function addCoopFun() {
      const sendObjData = {
        cooperatePlatforms: templateRenderData.value,
        mapId: thisMapId.value,
        type: 0, //分享传1、协作传0
      };
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/addCooperate',
        headers: {
          'Content-Type': 'application/json',
        },
        data: sendObjData,
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            showDialog.value = false;
            emit('closeEmit'); // 关闭父级弹框
            store.commit('coplotting/SET_REFRASHCOOP', true);
            ElMessage.success({
              message: '添加成功',
              type: 'success',
            });
            //
          } else {
            ElMessage.error(
              `添加协作失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`添加协作失败失败，错误信息：${error}`);
        });
    }
    // 根据地图id获取分组树形数据
    const getGroupData = (id: number) => {
      if (props.from === 'commandBrain') {
        thisMapId.value = store.state.coplotting.mapId;
      } else {
        thisMapId.value = route.query.mapId;
      }
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
            console.log(response);
            listData.value = response.data;
            returnListData(listData.value);
          } else {
            ElMessage.error(
              `获取分组数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`获取分组数据失败，错误信息：${error}`);
        });
    };
    // 点击改变权限
    const changeJurisdiction = (
      platId: object,
      groupId: object,
      type: string,
    ) => {
      const tempData: any = JSON.parse(
        JSON.stringify(templateRenderData.value),
      );
      tempData.forEach((item: any) => {
        if (item.cooperatePlatformId === platId) {
          item.groupRights.forEach((item2: any) => {
            if (item2.groupId === groupId) {
              item2.rights = type;
            }
          });
        }
      });
      templateRenderData.value = tempData;
    };
    // 设置点分类
    const setPointEmit = (arr: any) => {
      console.log(arr);
      console.log(selectPlatId.value);
      templateRenderData.value.forEach((item: any) => {
        if (item.cooperatePlatformId === selectPlatId.value) {
          item.enableBasicClassIds = arr;
        }
      });
      console.log(templateRenderData.value);
    };
    // 删除平台
    const deletePlatform = (id: number) => {
      templateRenderData.value.splice(
        templateRenderData.value.findIndex(
          (item: any) => item.cooperatePlatformId === id,
        ),
        1,
      );
    };
    return {
      showDialog,
      setPointEmit,
      open,
      close,
      InvitePopStepThreeRef,
      nextStep,
      selectPlatId,
      getGroupData,
      templateRenderData,
      returnListData,
      addCoopFun,
      changeJurisdiction,
      returnNewClass,
      deletePlatform,
    };
  },
});
</script>

<style lang="scss">
.jurisdiction {
  width: 100%;
  height: 330px;
  overflow: auto;
  border-bottom: 1px solid #e9ecf1;
  &::-webkit-scrollbar {
    background: transparent;
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d5d5d5;
    border-radius: 5px;
  }
  &__item {
    width: 420px;
    margin: 0 auto;
    margin-top: 10px;
    &__top {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      align-items: center;
      height: 30px;
      border-bottom: 1px solid #e9ecf1;
      &__left {
        font-weight: 500;
        color: #333333;
      }
      &__right {
        display: flex;
        color: #0091ff;
        width: 109px;
        justify-content: space-between;
        cursor: pointer;
      }
    }
    &__bottom {
      .jurisdiction__bottom__list {
        display: flex;
        justify-content: space-between;
        height: 30px;
        align-items: center;
        border-bottom: 1px solid #e9ecf1;
        &__l {
        }
        &__r {
        }
      }
    }
  }

  &__footer {
    height: 55px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
    padding-left: 10px;
    &__left > span {
      color: #0091ff;
    }
  }
}
.jurisdiction__bottom__list__r--active {
  .el-radio__input {
    .el-radio__inner {
      background: rgba(63, 146, 254, 1);
    }
  }
}
// 指挥大脑样式
.sv-dialogc {
  height: 552px;
  .jurisdiction {
    width: 100%;
    min-height: 443px;
    overflow: auto;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
    &__item {
      width: 100%;
      margin: 0 auto;
      margin-top: 10px;
      &__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e9ecf1;
        height: 38px;
        background: linear-gradient(
          90deg,
          rgba(20, 98, 140, 0.35) 0%,
          rgba(14, 69, 100, 0.69) 100%
        );
        padding: 0;
        border: 0;
        &__left {
          font-weight: 500;
          color: #fff;
          margin-left: 20px;
        }
        &__right {
          display: flex;
          color: rgba(86, 233, 255, 1);
          width: 109px;
          justify-content: flex-end;
          cursor: pointer;
          margin-right: 20px;
        }
      }
      &__bottom {
        width: 90%;
        margin: 0 auto;
        .jurisdiction__bottom__list {
          display: flex;
          justify-content: space-between;
          height: 38px;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          &__l {
            margin-left: 0px;
            color: #fff;
          }
          &__r {
            // margin-right: 20px;
            .el-radio {
              color: #fff;
            }
          }
        }
      }
    }

    &__footer {
      height: 55px;
      display: flex;
      justify-content: flex-end;
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
  .jurisdiction__bottom__list__r--active {
    .el-radio__input {
      .el-radio__inner {
        background: rgba(0, 193, 222, 1);
      }
    }
  }
}
</style>
