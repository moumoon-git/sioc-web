<template>
  <div class="addemerSection">
    <div class="addemerSection__tab">
      <div
        class="addemerSection__tab__item"
        :class="{'addemerSection__tab__item--active':select===1}"
        @click="getAllInfo(1)"
      >
        应急负责人
      </div>
      <div
        class="addemerSection__tab__item"
        :class="{'addemerSection__tab__item--active':select===2}"
        @click="getAllInfo(2)"
      >
        应急联络人
      </div>
    </div>
    <div class="addemerSection__content">
      <div class="addemerSection__content__item">
        <div class="addemerSection__content__item__title">
          <div class="addemerSection__content__item__title__left">
            分管类型
          </div>
          <div
            class="addemerSection__content__item__title__right"
            @click="showAddInput=true"
          >
            添加
          </div>
        </div>
        <div class="addemerSection__content__item__bottom">
          <input
            class="addemerSection__input"
            placeholder="请输入关键字检索"
          >
          <div class="addemerSection__table">
            <div
              v-for="(item,index) in typeList.value"
              :key="index"
              class="addemerSection__table__item"
              @click="getEventTypeList(index,item)"
            >
              <div class="addemerSection__table__item__name">
                {{ item.name }}
              </div>
              <div class="addemerSection__table__item__icons">
                <div class="addemerSection__table__item__icons__l" />
                <div
                  class="addemerSection__table__item__icons__r"
                  @click="deleteDept(item.id)"
                />
              </div>
            </div>
          </div>
          <div
            v-if="showAddInput"
            class="addemerSection__add"
          >
            <input
              v-model="groupName"
              type="text"
              class="addemerSection__add__input"
              placeholder="添加分管类型"
            >
            <div class="addemerSection__add__btns">
              <div
                class="addemerSection__add__btns__add"
                @click="addDept"
              />
              <div
                class="addemerSection__add__btns__back"
                @click="showAddInput=false"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="addemerSection__content__item">
        <div class="addemerSection__content__item__title">
          <div class="addemerSection__content__item__title__left">
            事件类型：全部
          </div>
          <div class="addemerSection__content__item__title__right" />
        </div>
        <div class="addemerSection__content__item__bottom">
          <Tree
            :show-check-box="true"
            :is-show-folder="false"
            :data="treeData"
            @node-check="checkFun"
          />
        </div>
      </div>
      <div class="addemerSection__content__item">
        <div class="addemerSection__content__item__title">
          <div class="addemerSection__content__item__title__left">
            分管人员
          </div>
          <div
            class="addemerSection__content__item__title__right"
            @click="openAddPeopleIndex"
          >
            添加
          </div>
        </div>
        <div class="addemerSection__content__item__bottom">
          <div class="addemerSection__peopleList">
            <div
              v-for="(item,index) in renderPeopleList"
              :key="index"
              class="addemerSection__peopleList__item"
            >
              <div class="addemerSection__peopleList__item__name">
                {{ item.name }}({{ item.workUnit }}/{{ item.position }})
              </div>
              <div class="addemerSection__peopleList__item__back" />
            </div>
          </div>
          <div class="addemerSection__clearPeopleList">
            <div class="addemerSection__clearPeopleList__clear">
              全部删除
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="addindex__container__bottom">
    <div
      class="addindex__container__bottom__item"
      @click="emit('close')"
    >
      取消
    </div>
    <div
      class="addindex__container__bottom__item"
      @click="saveSelectData"
    >
      确定
    </div>
  </div>
  <AddPeople
    ref="AddPeopleRef"
    :unitid="unitData.id"
    @selectEmit="getPeopleData"
  />
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, getCurrentInstance, onMounted,
} from 'vue';
import Tree from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/GroupTree/GroupTree.vue';
import AddPeople from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/addChargePeople/addIndex.vue';

export default defineComponent({
  components: { Tree, AddPeople },
  props: {
    unitData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http, $message }: any = instance?.appContext.config.globalProperties;
    const showAddInput = ref(false); // 显示添加输入框
    const AddPeopleRef = ref<any>(null);
    const select = ref(1); // 选择的tab项
    const groupName = ref('');// 添加分管类型名
    const typeList:any = reactive([]); // 要渲染的分组列表
    const treeData = ref([]);
    const treeCheckData:any = ref([]); // 树复选框选中的数据
    // 打开添加分管人员弹窗
    function openAddPeopleIndex() {
      if (AddPeopleRef.value) {
        AddPeopleRef.value.getTree();
        AddPeopleRef.value.open();
      }
    }
    // 切换tab项
    function tabFun(index:number) {
      select.value = index;
    }
    // 获取当前部门的全部信息
    function getAllInfo(tabId:number) {
      select.value = tabId;
      const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailgroup/getGroupManageEvent',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          Ids: [props.unitData.id],
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          console.log(response.data);
          console.log(select.value);
          // 应急负责人
          if (select.value === 1) {
            if (response.data.length === 0) {
              typeList.value = [];
            } else {
              typeList.value = response.data[0].groupResponsibleTypeList;
            }
          } else {
            // 应急联络人
            if (response.data.length === 0) {
              typeList.value = [];
            } else {
               typeList.value = response.data[0].groupContactorTypeList;
            }
          }
        } else {
          $message.error(`获取部门信息失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取部门信息失败，错误信息：${error}`);
      });
    }
    // 添加分管类型
    function addDept() {
      let typeId;
      if (select.value === 1) {
        typeId = 467;
      } else {
        typeId = 468;
      }
      const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailGroupManageType/add',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          contactorList: [],
          creatDate: '',
          emergencyStation: typeId,
          eventTypeIdList: [],
          groupId: props.unitData.id,
          isDeleted: 0,
          malicontactorList: [],
          name: groupName.value,
          parentId: '',
          platformId: null,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          console.log(response.data);
          getAllInfo(select.value);
          showAddInput.value = false;
          groupName.value = '';
        } else {
          $message.error(`获取部门信息失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取部门信息失败，错误信息：${error}`);
      });
    }
    // 删除分管类型
    function deleteDept(id:number) {
      const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailGroupManageType/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [id],
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getAllInfo(select.value);
        } else {
          $message.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`删除失败，错误信息：${error}`);
      });
    }
        /**
    * @desc 获取事件类型
    * @param {} params
    * @returns {} returns
    */
   function getEventTypesTreeData() {
    const request = {
        method: 'post',
        service: 'eoc',
        url: '/eos/caseClass/getTree',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {},
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0) {
          treeData.value = response.data;
        } else {
          $message.error(`获取事件类型失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取事件类型失败，错误信息：${error}`);
      });
   }
    // 获取应急负责人分管类型对应的分管人员
    // index：当前的分管类型的下标
    const renderPeopleList = ref([]); // 当前渲染的分管人员数据
    function getPeopleListByResponseType(index:number) {
      renderPeopleList.value = typeList.value[index].malicontactorList;
      console.log(renderPeopleList.value);
    }
    // 获取事件类型树
    const globalTypeObj:any = ref({});// 当前点击的分管类型的id
    function getEventTypeList(index:number, item:any) {
      globalTypeObj.value = item;
      getPeopleListByResponseType(index);
      getEventTypesTreeData();
    }
    // 返回当前选中的分管人员的id数组
    function returnIds(arr:any) {
      const newArr:any = [];
      if (arr && arr.length > 0) {
        arr.forEach((item:any) => {
          newArr.push(item.id);
        });
      }

      return newArr;
    }
    // 获取子组件所选择添加的分管人员
    function getPeopleData(arr:any) {
      if (renderPeopleList.value) {
        renderPeopleList.value = renderPeopleList.value.concat(arr);
      } else {
        renderPeopleList.value = arr;
      }
      console.log(renderPeopleList.value);
    }
    // 保存所选值
    function saveSelectData() {
      let sendData:any = {};
      if (select.value === 1) {
        sendData = {
          groupContactorTypeList: [{
            emergencyStation: 468,
            eventTypeIdList: [],
            contactorList: [],
          }],
          groupResponsibleTypeList: [{
            id: globalTypeObj.value.id,
            name: globalTypeObj.value.name,
            emergencyStation: 467,
            eventTypeIdList: treeCheckData.value,
            contactorList: returnIds(renderPeopleList.value),
          }],
          id: props.unitData.id,
          name: props.unitData.name,
          parentId: '0',
          remark: '',
        };
      } else {
        sendData = {
          groupContactorTypeList: [{
            emergencyStation: 468,
            eventTypeIdList: treeCheckData.value,
            contactorList: returnIds(renderPeopleList.value),
          }],
          groupResponsibleTypeList: [{
            id: globalTypeObj.value.id,
            name: globalTypeObj.value.name,
            emergencyStation: 467,
            eventTypeIdList: [],
            contactorList: [],
          }],
          id: props.unitData.id,
          name: props.unitData.name,
          parentId: '0',
          remark: '',
        };
      }

      const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailgroup/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: sendData,
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          emit('close');
        } else {
          $message.error(`保存失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`保存失败，错误信息：${error}`);
      });
    }
    // 勾选树复选框
    function checkFun(arr:any) {
      treeCheckData.value = [];
      console.log(arr);
      if (arr && arr.length > 0) {
        arr.forEach((item:any) => {
          treeCheckData.value.push(item.id);
        });
      }
      console.log(treeCheckData.value);
    }
    onMounted(() => {
      getAllInfo(1); // 默认加载应急负责人数据
      getEventTypesTreeData(); // 加载事件类型
    });
    return {
      showAddInput,
      treeData,
      AddPeopleRef,
      openAddPeopleIndex,
      select,
      tabFun,
      getAllInfo,
      typeList,
      addDept,
      groupName,
      deleteDept,
      getEventTypeList,
      renderPeopleList,
      saveSelectData,
      getPeopleData,
      checkFun,
    };
  },
});
</script>

<style lang="scss">
.addemerSection {
  color: #fff;
  display: flex;
  flex-direction: column;
  margin-top: 17px;
  &__tab {
    width: 260px;
    height: 32px;
    display: flex;
    &__item {
      width: 130px;
      height: 32px;
      background: linear-gradient(
        90deg,
        rgba(0, 193, 222, 0.3) 0%,
        rgba(24, 38, 50, 0) 100%
      );
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      font-weight: 500;
      font-size: 16px;
    }
     &__item--active {
      background: linear-gradient(
        90deg,
        rgba(0, 193, 222, 0.5) 0%,
        rgba(24, 38, 50, 0) 100%
      );
      color: #56E9FF;
    }
  }
  &__content {
    width: 1180px;
    height: 550px;
    background: rgba(0, 0, 0, 0.29);
    display: flex;
    border: 1px solid rgba(0, 193, 222, 0.29);
    &__item {
      &__title {
        width: 100%;
        height: 53px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        display: flex;
        justify-content: space-between;
        align-items: center;
        &__left {
          margin-left: 8px;
        }
        &__right {
          margin-right: 17px;
          color: rgba(86, 233, 255, 1);
          cursor: pointer;
        }
      }
      &__bottom {
        height: 496px;
        width: 100%;
        overflow: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        align-items:flex-start;
        // 滚动条
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background: #56e9ff;
          border-radius: 5px;
        }
        &::-webkit-scrollbar-corner {
          background: transparent;
        }
      }
    }
    &__item:nth-child(1) {
      width: 384px;
      height: 100%;
      overflow: hidden;
      .addemerSection__input {
        width: 361px;
        height: 38px;
        background: rgba(41, 47, 48, 0.77);
        color: #fff;
        border: 0;
        outline: 0;
        margin: 0 auto;
        margin-top: 12px;
      }
      .addemerSection__table {
        margin-top: 5px;
        &__item {
          width: 385px;
          height: 32px;
          line-height: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          border-left: 2px solid rgba(0, 0, 0, 0);
          &:hover {
            background: linear-gradient(
              90deg,
              rgba(0, 193, 222, 0.7) 0%,
              rgba(24, 38, 50, 0) 100%
            );
            border-left: 2px solid rgba(86, 233, 255, 1);
            .addemerSection__table__item__icons{
              display: flex
            }
          }
          &__name {
            margin-left: 12px;
          }
          &__icons {
            display: none;
            margin-right: 12px;
            &__l {
              width: 16px;
              height: 16px;
              border: none;
              outline: none;
              background: #FFF;
              mask: no-repeat center/100% 100% url(./assets/icon-edit.svg);
              cursor: pointer;
              transition: background .3s;
              vertical-align: -2px;
              margin-left: 10px;
              &:hover {
                background: #56E9FF;
              }
              &:active {
                vertical-align: -3px;
              }
            }
            &__r {
               width: 16px;
              height: 16px;
              border: none;
              outline: none;
              background: #FFF;
              mask: no-repeat center/100% 100% url(./assets/delete.svg);
              cursor: pointer;
              transition: background .3s;
              vertical-align: -2px;
              margin-left: 10px;
              &:hover {
                background: #56E9FF;
              }
              &:active {
                vertical-align: -3px;
              }
            }
          }
        }
      }
      .addemerSection__add {
        width: 360px;
        height: 26px;
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.65);
        display: flex;
        justify-content: space-between;
        &__input {
          outline: 0;
          background: 0;
          border: 0;
          color: #fff;
          width: 320px;
        }
        &__btns {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 37px;
          &__add {
            width: 15px;
            height: 12px;
            background: url(./assets/add.svg) no-repeat;
            cursor: pointer;
          }
          &__back {
            width: 12px;
            height: 12px;
            background: url(./assets/back.svg) no-repeat;
            cursor: pointer;
          }
        }
      }
    }
    &__item:nth-child(2) {
      width: 399px;
      height: 100%;
      overflow: hidden;
    }
    &__item:nth-child(3) {
      width: 395px;
      height: 100%;
      overflow: hidden;
      .addemerSection__peopleList {
        width: 100%;
        height: 470px;
        overflow-x: hidden;
        overflow-y: auto;
        &:empty::before{
          content: "暂无";
          width: 100%;
          height: 100%;
          display: block;
          line-height: 470px;
          text-align: center;
        }
        // 滚动条
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background: #56e9ff;
          border-radius: 5px;
        }
        &::-webkit-scrollbar-corner {
          background: transparent;
        }
        &__item {
          width: 385px;
          height: 32px;
          line-height: 32px;
          align-items: center;
          display: flex;
          justify-content: space-between;
          border-left: 2px solid rgba(0, 0, 0, 0);
          &:hover {
            background: linear-gradient(
              90deg,
              rgba(0, 193, 222, 0.7) 0%,
              rgba(24, 38, 50, 0) 100%
            );
            border-left: 2px solid rgba(86, 233, 255, 1);
          }
          &__name {
            height: 32px;
            line-height: 32px;
            margin-left: 6px;
          }
          &__back {
            width: 14px;
            height: 14px;
            background: url(./assets/delete.svg)no-repeat;
            cursor: pointer;
          }
        }
      }
      .addemerSection__clearPeopleList {
        display: flex;
        width: 100%;
        &__clear {
          color: #56e9ff;
          font-weight: 500;
          font-size: 16px;
          margin-left: 22px;
          cursor: pointer;
        }
      }
    }
    &__item:not(:last-child) {
      border-right: 1px solid rgba(255, 255, 255, 0.15);
    }
  }
}
.addindex__container__bottom {
          width: 100%;
    height: 56px;
    display: flex;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    justify-content: flex-end;
    align-items: center;
    margin-top: 16px;
      &__item {
        width: 65px;
        height: 32px;
        border: 1px solid rgba(255, 255, 255, 0.45);
        text-align: center;
        line-height: 32px;
        color: rgba(255, 255, 255, 0.65);
        cursor: pointer;
        &:nth-child(1) {
          color: rgba(255, 255, 255, 0.65);
          margin-right: 8px;
        }
        &:nth-child(2) {
          color: #fff;
            margin-right: 27px;
          background: #00c1de;
        }
      }
    }
</style>
