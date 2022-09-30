<template>
  <div :class="$style.SelectContact">
    <div>
      <!-- <header>
        <span>选择联系人</span>
        <span @click="cancel"></span>
      </header> -->
      <main>
        <MailList @handleNodeClick="handleNodeClick" />
        <PersonnelSelection
          ref="PersonnelSelections"
          :contactListObj="contactListData"
          @sendMsg="getPersonnelSelectionMSG"
          :deleteData="deleteData"
        />
        <SelectResults
          :selectData="selectData"
          @deletes="deleteFun"
          @deleteAll="deleteAll"
        />
      </main>
      <footer>
        <button @click="cancel">取消</button>
        <button @click="share">分享</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';

import { defineComponent, ref, getCurrentInstance } from 'vue';
// 通讯录
import MailList from './components/MailList.vue';
// 人员选择
import PersonnelSelection from './components/PersonnelSelection.vue';
// 选择结果
import SelectResults from './components/SelectResults.vue';

export default defineComponent({
  components: {
    MailList,
    PersonnelSelection,
    SelectResults,
  },
  props: {
    // 弹窗操作
    operation: {
      type: Object,
      default: () => ({}),
    },
    pathInformation: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, contxt) {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http, $message }: any =
      instance?.appContext.config.globalProperties;
    const store = useStore(); // 使用vuex
    const contactListData = ref<any>({
      // 其他
      other: [],
      // 负责
      responsible: [],
      // 联络
      contact: [],
    });
    // 选择之后的数据
    const selectData = ref<any>([]);
    // 要清除的数据
    const deleteData = ref<any>({});
    const PersonnelSelections = ref<any | null>(null);
    // 取消
    function cancel() {
      if (props.operation.hide) {
        props.operation.close();
      }
    }
    // 点击了架构树
    function handleNodeClick(params: any) {
      // 获取通讯录分组成员列表
      const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailgroup/getGroupManageEvent',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          Ids: [params.id],
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            console.log(response.data);
            const data = response.data || [];
            /* eslint-disable */
            contactListData.value = data.reduce(
              (pre: any, i: any) => {
                // 联络人
                i?.groupContactorTypeList?.forEach((j: any) => {
                  j?.malicontactorList?.forEach((k: any) => {
                    k.workUnit = k.workUnit || params.name;
                  });
                  let arr = j?.malicontactorList || [];
                  pre.contact = pre.contact.concat(arr);
                });
                // 负责人
                i?.groupResponsibleTypeList?.forEach((j: any) => {
                  j?.malicontactorList?.forEach((k: any) => {
                    k.workUnit = k.workUnit || params.name;
                  });
                  let arr = j?.malicontactorList || [];
                  pre.responsible = pre.responsible.concat(arr);
                });
                // 其他
                i?.groupContactor?.forEach((j: any) => {
                  j.workUnit = j.workUnit || params.name;
                });
                // 其他
                pre.other = pre.other.concat(i?.groupContactor || []);
                return pre;
              },
              {
                // 其他
                other: [],
                // 负责
                responsible: [],
                // 联络
                contact: [],
              },
            );
            console.log(contactListData.value);
            /* eslint-enable */
          } else {
            $message.error(
              `获取分组详情失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          $message.error(`获取分组详情失败，错误信息：${error}`);
        });
    }
    // 选择的人员
    function getPersonnelSelectionMSG(params: any) {
      selectData.value = params;
    }
    // 清除单个选项
    function deleteFun(x: any) {
      deleteData.value = x;
      selectData.value.forEach((e: any, i: number) => {
        if (e.id === x.id) {
          selectData.value.splice(i, 1);
        }
      });
    }
    // 清除所有
    function deleteAll() {
      if (PersonnelSelections.value) {
        PersonnelSelections.value.deleteAll();
      }
    }
    // 分享
    function share() {
      const routeShareRecordEntities = selectData.value.reduce(
        (pre: any, x: any) => {
          let obj = {
            receiverPlatformId: x.platformId,
            receiverId: x.id,
            receiverMobile: x.mobile || x.mobile1 || x.mobile2,
          };
          pre.push(obj);
          return pre;
        },
        [],
      );
      const routeType =
        props.pathInformation.mapType === 0
          ? 3
          : props.pathInformation.mapType === 1
          ? 2
          : 0;
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistRoute/add',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          detailType: 0,
          detail: JSON.stringify(props.pathInformation),
          mapType: 1,
          routeShareRecordEntities,
          routeType, // 路径方式(0：驾车,2：骑行，3：步行)
          eventId: store.state.event?.id,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          $message.info('分享成功');
        } else {
          $message.error(`分享失败${response.msg}`);
        }
        deleteAll();
        selectData.value = [];
        if (props.operation.hide) {
          props.operation.close();
        }
      });
    }

    return {
      cancel,
      handleNodeClick,
      getPersonnelSelectionMSG,
      contactListData,
      selectData,
      deleteFun,
      deleteData,
      deleteAll,
      PersonnelSelections,
      share,
    };
  },
});
</script>

<style lang="scss" module>
.SelectContact {
  // position: fixed;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // margin: auto;
  // z-index: 9999;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    width: 1160px;
    height: 888px;
    background: #050505;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(166, 173, 180, 0.3);
    display: flex;
    flex-direction: column;
    & > header {
      height: 50px;
      padding: 0 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      & > span {
        &:first-child {
          font-size: 18px;
          font-weight: 500;
          color: #ffffff;
        }
        &:last-child {
          width: 16px;
          height: 16px;
          display: block;
          cursor: pointer;
          background: url('./assets/close2.svg') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    & > main {
      height: calc(100% - 60px);
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      & > div {
        flex: 1;
        height: 100%;
        max-width: 366px;
        margin-right: 10px;
        border: 1px solid rgba(235, 237, 240, 0.2);
        &:last-child {
          margin: 0;
        }
      }
    }
    & > footer {
      height: 60px;
      display: flex;
      justify-content: flex-end;
      padding-right: 23px;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      & > button {
        width: 64px;
        height: 32px;
        min-height: 32px;
        padding: 0;
        line-height: 32px;
        border-radius: 0px;
        text-align: center;
        background: transparent;
        border: 1px solid #fff;
        cursor: pointer;
        &:first-child {
          margin-right: 5px;
          font-size: 14px;
          font-weight: 400;
          color: #a6adb4;
        }
        &:last-child {
          background: rgba(0, 193, 222, 1);
          border: 1px solid #00c1de;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
}
</style>