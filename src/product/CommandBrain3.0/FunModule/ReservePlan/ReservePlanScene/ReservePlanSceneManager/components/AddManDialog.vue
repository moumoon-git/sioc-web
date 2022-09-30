<template>
  <DialogBoat
    ref="DialogManBoat"
    title="添加人员"
  >
    <div style="width: 1160px; height: 76vh;position:relative;">
      <!-- 左边 -->
      <div :class="$style.left">
        <div
          v-for="itemone in [{name: '通讯录', id: 0}, {name: '专项指挥部', id: 1}]"
          :key="itemone.id"
        >
          <Collapse
            :item="itemone"
            :headerStyle="true"
          >
            <template #head>
              <div style="margin: 9px;">
                {{ itemone.name }}
              </div>
            </template>

            <template #main>
              <main v-if="itemone.id < 1">
                <!-- 通讯录树 -->
                <TreeComponent
                  :data="treeData"
                  :show-check-box="false"
                  @node-click="handleLeftListClick"
                />
              </main>
              <main v-else>
                <!-- 专项指挥部 -->
                <TreeComponent
                  :data="treeSpecial"
                  :show-check-box="false"
                  @node-click="handleSpecialListClick"
                />
              </main>
            </template>
          </Collapse>
        </div>
      </div>
      <!-- 中间 -->
      <div :class="$style.middle">
        <ListTemple
          :useList="false"
          :title="currTree ? currTree.name : ''"
          :useCount="false"
        />
        <!-- 应急负责人 -->
        <label :class="$style.respondCheck">
          <div :class="$style.respondCheckDiv">
            <input
              :class="$style.checkBox"
              v-model="chooseRespond"
              type="checkbox"
              @change="pushRespond"
            >
            <i :class="$style.checkIcon" />
            应急负责人
          </div>
        </label>
        <ListTemple
          :useHead="false"
          :useCheck="true"
          :useLabel="true"
          :usePosition="true"
          :useMore="true"
          :list="respondList"
          @handleCheck="checkBox"
        />
        <!-- 应急联络人 -->
        <label :class="$style.contactCheck">
          <div :class="$style.contactCheckDiv">
            <input
              :class="$style.checkBox"
              v-model="chooseContact"
              type="checkbox"
              @change="pushContact"
            >
            <i :class="$style.checkIcon" />
            应急联络人
          </div>
        </label>
        <ListTemple
          :useHead="false"
          :useCheck="true"
          :useLabel="true"
          :usePosition="true"
          :useMore="true"
          :list="contactList"
          @handleCheck="checkBox"
        />
        <div
          :class="$style.allMiddle"
          @click="chooseRespond=true,chooseContact=true,pushRespond(),pushContact()"
        >
          全选
        </div>
      </div>
      <!-- 右边 -->
      <div :class="$style.right">
        <ListTemple
          :title="'已选择'"
          :list="chooseList"
          :useLabel="true"
          :usePosition="true"
          :useMore="true"
          :count-all="chooseList.length"
        >
          <template #operation="{ data }">
            <div
              :class="$style.listIcon"
              @click="deleteMan(data)"
            />
          </template>
        </ListTemple>
        <div
          :class="$style.clearRight"
          @click="chooseList=[],chooseRespond=false,chooseContact=false,pushRespond(),pushContact()"
        >
          全部清除
        </div>
      </div>
      <div
        style="width: 100%;
        height: 0px;
        right: 0px;
        bottom: 60px;
        position: absolute;
        border: 1px solid rgba(255, 255, 255, 0.15)"
      />
      <!-- 按钮 -->
      <Button
        type="primary"
        style="right: 23px;position: absolute;bottom: 18px;"
        @click="commit"
      >
        确定
      </Button>
    </div>
  </DialogBoat>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex';
// 应急响应函数
import {
  getGroupResponseAndContactor,
  getGroupManageEventTypeAndPeople,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';
import DialogBoat from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue'; // 弹出框
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import TreeComponent from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/GroupTree/GroupTree.vue';
import Collapse from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/Collapse.vue'; // 折叠组件
import ListTemple from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/ListTemple.vue'; // 列表模板

interface CurrTreeType {
  name: string,
  id: number,
}

export default defineComponent({
  name: 'ReservePlanScene',
  components: {
    // 弹出框
    DialogBoat,
    // 按钮
    Button,
    // 左边-树
    TreeComponent,
    // 折叠组件
    Collapse,
    // 列表模板
    ListTemple,
  },
  props: {
    // 当前职务
    currentPosition: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['init'],
  setup(prop, context) {
    const store = useStore(); // 使用vuex
    const keyword = ref(''); // 搜索关键词
    const treeData = ref<any[]>([]); // 通讯录树
    const treeSpecial = ref<any[]>(
      [
        { name: '领导小组', id: 0, children: [] },
        { name: '成员单位', id: 1, children: [] },
      ],
    ); // 专项树
    const currTree = ref<null | CurrTreeType>(null); // 当前左树节点
    const respondList = ref<any[]>([]); // 应急负责人
    const contactList = ref<any[]>([]); // 应急联络人
    const chooseList = ref<any[]>([]); // 已选择的所有人
    const isSpecial = ref(false);
    const chooseRespond = ref(false);
    const chooseContact = ref(false);
    const { $http, $message }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const DialogManBoat = ref<typeof DialogBoat | null>(null);
    // 开窗
    function openPopup() {
      if (DialogManBoat.value) {
        DialogManBoat.value.open();
      } else {
        setTimeout(() => openPopup(), 500);
      }
    }
    // 左数据初始化
    function getLeftList() {
      // 通讯录
      const request = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailgroup/list?platformId=',
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          treeData.value = response?.data || [];
        }
      });
      // 领导小组
      getGroupResponseAndContactor(
        Number(store.state?.reservePlan?.currentReservePlan?.versionId),
        1,
        1,
      ).then((response: any) => {
        treeSpecial.value[0].children = response?.data || [];
      });
      // 成员单位
      getGroupResponseAndContactor(
        Number(store.state?.reservePlan?.currentReservePlan?.versionId),
        1,
        2,
      ).then((response: any) => {
        treeSpecial.value[1].children = response?.data || [];
      });
    }
    // 切换回显
    function checkShow() {
      let count = 0;
      for (let i = 0; i < respondList.value.length; i ++) {
        for (let j = 0; j < chooseList.value.length; j ++) {
          if (
            respondList.value[i].id === chooseList.value[j].id
            && currTree.value?.id === chooseList.value[j].pid
          ) {
            respondList.value[i].isChecked = true;
            count += 1;
          }
          if (count === respondList.value.length) {
            chooseRespond.value = true;
          }
        }
      }
      count = 0;
      for (let i = 0; i < contactList.value.length; i ++) {
        for (let j = 0; j < chooseList.value.length; j ++) {
          if (
            contactList.value[i].id === chooseList.value[j].id
            && currTree.value?.id === chooseList.value[j].pid
          ) {
            contactList.value[i].isChecked = true;
            count += 1;
          }
          if (count === contactList.value.length) {
            chooseContact.value = true;
          }
        }
      }
    }
    // 右数据靠左得
    function handleLeftListClick(data: any) {
      chooseRespond.value = false;
      chooseContact.value = false;
      isSpecial.value = false;
      currTree.value = data;
      const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailgroup/getGroupManageEvent',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        data: {
          Ids: [data.id],
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          respondList.value = [];
          contactList.value = [];
          if (response.data) {
            response.data.forEach((el:any) => {
              el.groupResponsibleTypeList.forEach((ele:any) => {
                if (ele.malicontactorList) {
                  ele.malicontactorList.forEach((elem:any) => {
                    elem.label = '应急负责人';
                    elem.labelName = el.name;
                    respondList.value.push(elem);
                  });
                }
              });
              el.groupContactorTypeList.forEach((ele:any) => {
                if (ele.malicontactorList) {
                  ele.malicontactorList.forEach((elem:any) => {
                    elem.label = '应急联络人';
                    elem.labelName = el.name;
                    contactList.value.push(elem);
                  });
                }
              });
            });
          }
          checkShow();
        }
      });
    }
    // 专项右数据靠左得
    function handleSpecialListClick(data: any) {
      chooseRespond.value = false;
      chooseContact.value = false;
      isSpecial.value = true;
      currTree.value = data;
      respondList.value = [];
      contactList.value = [];
      // 领导小组
      if (data.id === 0) {
        if (data.children) {
          data.children.forEach((el:any) => {
            if (el.mailResponseList) {
              el.mailResponseList.forEach((ele:any) => {
                ele.label = '应急负责人';
                ele.labelName = data.name;
                respondList.value.push(ele);
              });
            }
            if (el.mailContactorList) {
              el.mailContactorList.forEach((ele:any) => {
                ele.label = '应急联络人';
                ele.labelName = data.name;
                contactList.value.push(ele);
              });
            }
          });
          checkShow();
        }
      } else { // 成员单位
        getGroupManageEventTypeAndPeople(
          data?.groupId || data?.id,
          Number(store.state.reservePlan.currentReservePlan.versionId),
        ).then((response: any) => {
          if (response.data) {
            response.data.forEach((el:any) => {
              el.groupResponsibleTypeList.forEach((ele:any) => {
                if (ele.malicontactorList) {
                  ele.malicontactorList.forEach((elem:any) => {
                    elem.label = '应急负责人';
                    elem.labelName = ele.name;
                    respondList.value.push(elem);
                  });
                }
              });
              el.groupContactorTypeList.forEach((ele:any) => {
                if (ele.malicontactorList) {
                  ele.malicontactorList.forEach((elem:any) => {
                    elem.label = '应急联络人';
                    elem.labelName = ele.name;
                    contactList.value.push(elem);
                  });
                }
              });
            });
            checkShow();
          }
        });
      }
    }
    // 勾负责人联络人,把里面的人推进选择人列表
    function pushRespond() {
      const currentChooseArr = chooseList.value.filter((item:any) => item.pid === currTree.value?.id && item.label !== '应急负责人');
      const otherChooseArr = chooseList.value.filter((item:any) => item.pid !== currTree.value?.id);
      chooseList.value = currentChooseArr.concat(otherChooseArr);
      respondList.value.forEach((el:any) => {
        el.pid = currTree.value?.id;
        if (chooseRespond.value) chooseList.value.push(el);
        el.isChecked = chooseRespond.value;
      });
    }
    // 勾负责人联络人,把里面的人推进选择人列表
    function pushContact() {
      const currentChooseArr = chooseList.value.filter((item:any) => item.pid === currTree.value?.id && item.label !== '应急联络人');
      const otherChooseArr = chooseList.value.filter((item:any) => item.pid !== currTree.value?.id);
      chooseList.value = currentChooseArr.concat(otherChooseArr);
      contactList.value.forEach((el:any) => {
        el.pid = currTree.value?.id;
        if (chooseContact.value) chooseList.value.push(el);
        el.isChecked = chooseContact.value;
      });
    }
    // 勾选
    function checkBox(el:any) {
      el.pid = currTree.value?.id;
      // 当前el不在arr里，放入
      if (el.isChecked) {
        chooseList.value.push(el);
      } else { // 移除
        chooseList.value.forEach((ele:any) => {
          if (ele.id === el.id) {
            ele.isChecked = false;
          }
        });
        chooseList.value = chooseList.value.filter((item:any) => item.id !== el.id);
      }
      const constone = respondList.value.filter((ele:any) => ele.isChecked === true).length;
      const consttwo = contactList.value.filter((ele:any) => ele.isChecked === true).length;
      chooseRespond.value = (constone === respondList.value.length);
      chooseContact.value = (consttwo === contactList.value.length);
    }
    // 右边叉
    function deleteMan(el:any) {
      respondList.value.forEach((ele:any) => {
        if (ele.id === el.id) {
          ele.isChecked = false;
        }
      });
      contactList.value.forEach((ele:any) => {
        if (ele.id === el.id) {
          ele.isChecked = false;
        }
      });
      chooseList.value = chooseList.value.filter((item:any) => item.id !== el.id);
      const constone = respondList.value.filter((ele:any) => ele.isChecked === true).length;
      const consttwo = contactList.value.filter((ele:any) => ele.isChecked === true).length;
      chooseRespond.value = (constone === respondList.value.length);
      chooseContact.value = (consttwo === contactList.value.length);
    }
    // 点击确定
    function commit() {
      // 关窗
      if (DialogManBoat.value) {
        DialogManBoat.value.close();
      }
      // 所有选的人
      const members = Array.from(chooseList.value, (el: any) => ({
        id: el.id,
        name: el.name,
        position: el.position ? el.position : '',
      }));
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/eventSceneConduct/addEventStuct',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          name: currTree.value?.name, // 左树名字
          type: 1, // 领导小组
          pid: prop.currentPosition.id, // 当前职务id
          structType: 2,
          eventId: store.state.event?.id,
          groupId: currTree.value?.id, // 当前左树的id 2030
          responsibles: members, // id:1234, name: 张三
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0) {
          $message.info('人员添加成功');
          respondList.value = []; // 清空
          contactList.value = []; // 清空
          chooseList.value = []; // 清空
          currTree.value = null; // 清空
          chooseRespond.value = false; // 清空
          chooseContact.value = false; // 清空
          context.emit('init');
        }
      });
    }
    onMounted(() => {
      getLeftList(); // 左数据初始化
    });
    return {
      keyword,
      chooseRespond,
      chooseContact,
      isSpecial,
      treeData,
      treeSpecial,
      currTree,
      respondList,
      contactList,
      chooseList,
      pushRespond,
      pushContact,
      deleteMan,
      checkBox,
      DialogManBoat,
      openPopup,
      commit,
      getLeftList,
      handleLeftListClick,
      handleSpecialListClick,
      checkShow,
    };
  },
});
</script>

<style lang="scss" module>
  .left {
    overflow: auto;
    width: 366px;
    height: 65vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: relative;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  .middle {
    overflow: auto;
    width: 366px;
    height: 65vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: relative;
    margin-left: 10px;
    margin-top: 20px;
    float: left;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    // 负责人勾选框
    .respondCheck {
      float: left;
      margin: 10px 0px 0px -10px;
    }
    .respondCheck .checkBox {
      visibility: hidden;
    }
    .respondCheck .checkBox + .checkIcon {
      color: #fff;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      border: 1px solid #a6adb4;
      display: inline-block;
      visibility: visible;
      padding-left: 0px;
      text-align: center;
      content: " ";
      box-sizing: border-box;
      line-height: 16px;
      margin-top: 3px;
      cursor: pointer;
    }
    .respondCheck .checkBox[type="checkbox"]:checked + .checkIcon {
      background-color: #56e9ff;
      border: none;
      content: "✓";
      font-size: 14px;
      color: #000;
    }
    // 联络人勾选框
    .contactCheck {
      float: left;
      margin: 10px 0px 0px -10px;
    }
    .contactCheck .checkBox {
      visibility: hidden;
    }
    .contactCheck .checkBox + .checkIcon {
      color: #fff;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      border: 1px solid #a6adb4;
      display: inline-block;
      visibility: visible;
      padding-left: 0px;
      text-align: center;
      content: " ";
      box-sizing: border-box;
      line-height: 16px;
      margin-top: 3px;
      cursor: pointer;
    }
    .contactCheck .checkBox[type="checkbox"]:checked + .checkIcon {
      background-color: #56e9ff;
      border: none;
      content: "✓";
      font-size: 14px;
      color: #000;
    }
    .allMiddle {
      position: absolute;
      left: 15px;
      bottom: 11px;
      font-size: 16px;
      color: #56E9FF;
      cursor: pointer;
    }
  }
  .right {
    overflow: auto;
    width: 366px;
    height: 65vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: relative;
    margin-right: 20px;
    margin-top: 20px;
    float: right;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    .listIcon {
      background: url(../../../PublicComponents/assets/close.svg) no-repeat;
      background-size: 100%;
      width: 10px;
      height: 10px;
      float: right;
      margin: 6px 0px 0px 0px;
    }
    .clearRight {
      font-size: 16px;
      color: #56E9FF;
      cursor: pointer;
      margin: 10px;
    }
  }
</style>
