<template>
  <DialogBoat
    ref="DialogWorkBoat"
    title="功能组"
  >
    <div style="width: 874px; height: 87vh;position:relative;color: #FFF;">
      <!-- 上面 -->
      <div style="position:absolute;left: 20px;top: 10px;color: #A6ADB4;">
        功能组名称：
      </div>
      <input
        v-model="name"
        :class="$style.input"
      >
      <div style="position:absolute;left: 20px;top: 79px;color: #A6ADB4;">
        功能组职责：
      </div>
      <textarea
        v-model="remark"
        :class="$style.text"
      />
      <!-- 左边 -->
      <div :class="$style.left">
        <header :class="$style.leftHeaderStyle">
          <div :class="$style.headerText">
            成员单位
          </div>
          <div
            style="cursor: pointer;
              position: absolute;
              right: 15px;
              top: 15px;
              color: #00C1DE;"
            @click="openAddUnitDialog"
          >
            添加
          </div>
        </header>
        <main :class="$style.leftScroll">
          <ListTemple
            :list="unitMemberList"
            :useHead="false"
            @handleClick="handleClick"
          >
            <template #operation="{ data }">
              <span
                v-if="data.leadUnit===1"
                style="background: #F2B626;border-radius: 10px;padding: 1px 7px;font-size: 12px;"
              >牵头单位</span>
              <div
                :class="$style.listIcon"
                @click="deleteUnit(data)"
              />
            </template>
          </ListTemple>
          <ListTemple
            :list="unitList"
            :useHead="false"
            @handleClick="handleClick"
          >
            <template #operation="{ data }">
              <span
                v-if="data.leadUnit===1"
                style="background: #F2B626;border-radius: 10px;padding: 1px 7px;font-size: 12px;"
              >牵头单位</span>
              <div
                :class="$style.listIcon"
                @click="unitList=unitList.filter(el=>el.id!==data.id)"
              />
            </template>
          </ListTemple>
        </main>
      </div>
      <!-- 右边 -->
      <div :class="$style.right">
        <header :class="$style.rightHeaderStyle">
          <div :class="$style.headerText">
            单位信息
          </div>
          <div :class="$style.headerTextThree">
            <el-switch
              v-model="isLeaderUnit"
              active-text="设为牵头单位"
              @change="changeLeaderUint"
            />
          </div>
          <div :class="$style.headerTextOne">
            应急职责
          </div>
          <textarea
            v-model="content"
            :class="$style.headerTextTwo"
            @change="currUnit.remark=content"
          />
          <div
            :class="$style.headerTextFour"
            @click="commitUnitRemark"
          >
            保存
          </div>
        </header>
        <main :class="$style.rightScroll">
          <!-- 应急负责人列表 -->
          <div style="margin: 6px;">
            应急负责人:
          </div>
          <div
            v-for="(itemone, indexone) in respondList"
            :key="indexone"
            style="margin: 6px;"
          >
            <!-- 名字 -->
            <div :class="$style.listText">
              {{ itemone.name }} ({{ `${itemone.workUnit || '-'}/${itemone.position || '-'}` }})
            </div>
          </div>
          <!-- 应急联络人列表 -->
          <div style="margin: 6px;">
            应急联络人:
          </div>
          <div
            v-for="(itemone, indexone) in contactList"
            :key="indexone"
            style="margin: 6px;"
          >
            <!-- 名字 -->
            <div :class="$style.listText">
              {{ itemone.name }} ({{ `${itemone.workUnit || '-'}/${itemone.position || '-'}` }})
            </div>
          </div>
        </main>
      </div>
      <!-- 按钮 -->
      <Button
        type="primary"
        style="right: 14px;position: absolute;bottom: 12px;"
        @click="commit"
      >
        确定
      </Button>
    </div>
  </DialogBoat>
  <!-- 成员单位窗 -->
  <AddUnitDialog
    ref="AddUnitDialog"
    @commit="commitUnitlList"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex';
// 应急响应函数
import {
  getGroupManageEventTypeAndPeople,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';
import DialogBoat from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue'; // 弹出框
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import AddUnitDialog from './AddUnitDialog.vue'; // 成员单位窗
import ListTemple from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/ListTemple.vue'; // 列表模板

export default defineComponent({
  name: 'AddWorkDialog',
  components: {
    // 弹出框
    DialogBoat,
    // 按钮
    Button,
    // 成员单位窗
    AddUnitDialog,
    // 列表模板
    ListTemple,
  },
  props: {
    // 功能组下成员单位列表
    unitMemberList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['init'],
  setup(props, context) {
    const store = useStore(); // 使用vuex
    const workGroupId = ref(0); // 功能组id
    const name = ref(''); // 功能组名
    const remark = ref(''); // 功能组职责
    const content = ref(''); // 成员单位职责
    const unitList = ref<any[]>([]); // 勾选出的成员单位列表
    const respondList = ref<any[]>([]); // 应急负责人
    const contactList = ref<any[]>([]); // 应急联络人
    const currUnit:any = ref({}); // 成员单位当前
    const isLeaderUnit = ref(false); // 牵头单位，接口leadUnit 0非1是
    const { $http, $message }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const DialogWorkBoat = ref<typeof DialogBoat | null>(null);
    // 开窗
    function openPopup() {
      content.value = ''; // 清空
      currUnit.value = {}; // 清空
      isLeaderUnit.value = false; // 清空
      respondList.value = [];
      contactList.value = [];
      unitList.value = []; // 清空
      if (DialogWorkBoat.value) {
        DialogWorkBoat.value.open();
      } else {
        setTimeout(() => openPopup(), 500);
      }
    }
    // 设为牵头单位
    function changeLeaderUint() {
      if (isLeaderUnit.value) currUnit.value.leadUnit = 1;
      else currUnit.value.leadUnit = 2;
    }
    // 点成员单位
    function handleClick(item: any) {
      console.log('当前成员单位', item);
      currUnit.value = item;
      content.value = item.remark;
      isLeaderUnit.value = (item.leadUnit === 1);
      getGroupManageEventTypeAndPeople(
        item?.groupId || item?.id,
        Number(store.state.reservePlan.currentReservePlan.versionId),
      ).then((response: any) => {
        // 填充当前成员单位的负责人联络人
        respondList.value = [];
        contactList.value = [];
        if (response.data) {
          response.data.forEach((el:any) => {
            el.groupResponsibleTypeList.forEach((ele:any) => {
              if (ele.malicontactorList) {
                ele.malicontactorList.forEach((elem:any) => {
                  elem.labelName = ele.name;
                  respondList.value.push(elem);
                });
              }
            });
            el.groupContactorTypeList.forEach((ele:any) => {
              if (ele.malicontactorList) {
                ele.malicontactorList.forEach((elem:any) => {
                  elem.labelName = ele.name;
                  contactList.value.push(elem);
                });
              }
            });
          });
          item.responsibles = respondList.value;
          item.contactors = contactList.value;
        }
      });
    }
    // 点击成员单位职责确定
    function commitUnitRemark() {
      currUnit.value.remark = content.value;
      $message.info('保存成功');
    }
    // 成员单位窗点击确定
    function commitUnitlList(item: any) {
      unitList.value = item;
    }
    // 点击确定
    function commit() {
      if (DialogWorkBoat.value) {
        DialogWorkBoat.value.close();
      }
      // 新增单位
      const members1 = Array.from(unitList.value, (el: any) => ({
        remark: el.remark,
        leadUnit: el.leadUnit,
        groupId: (el.groupId ? el.groupId : el.id),
        name: el.name,
        type: 2,
        structType: 2,
        contactors: el.contactors,
        responsibles: el.responsibles,
        eventId: store.state.event?.id,
      }));
      // 已存在单位
      const members2 = Array.from(props.unitMemberList, (el: any) => ({
        remark: el.remark,
        leadUnit: el.leadUnit,
        groupId: (el.groupId ? el.groupId : el.id),
        name: el.name,
        type: 2,
        structType: 2,
        contactors: el.contactors,
        responsibles: el.responsibles,
        eventId: store.state.event?.id,
      }));
      const members = members1.concat(members2);
      if (workGroupId.value) { // id不为0,修改功能组
        const request = {
          method: 'post',
          url: '/eventSceneConduct/updateEventStuct',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            workGroupId: workGroupId.value,
            remark: remark.value,
            leadUnit: '',
            name: name.value,
            type: 2, // 成员单位
            pid: 0, // 用不上
            structType: 2, // 现场
            eventId: store.state.event?.id,
            unitList: members,
          },
        };
        $http(request).then((response: any) => {
          if (response.errorcode === 0) {
            $message.info('修改成功');
            name.value = ''; // 清空
            remark.value = ''; // 清空
            content.value = ''; // 清空
            unitList.value = []; // 清空
            currUnit.value = {}; // 清空
            isLeaderUnit.value = false; // 清空
            context.emit('init');
          }
        });
      } else { // 新增
        const request = {
          method: 'post',
          url: '/eventSceneConduct/addEventStuct',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            remark: remark.value,
            leadUnit: '',
            name: name.value,
            type: 2, // 成员单位
            pid: 0, // 用不上
            structType: 2, // 现场
            eventId: store.state.event?.id,
            unitList: members,
          },
        };
        $http(request).then((response: any) => {
          if (response.errorcode === 0) {
            $message.info('新增成功');
            name.value = ''; // 清空
            remark.value = ''; // 清空
            content.value = ''; // 清空
            unitList.value = []; // 清空
            currUnit.value = {}; // 清空
            isLeaderUnit.value = false; // 清空
            context.emit('init');
          }
        });
      }
    }
    // 成员单位-删除
    function deleteUnit(item: any) {
      if (DialogWorkBoat.value) {
        DialogWorkBoat.value.close();
      }
      const request = {
        method: 'post',
        url: '/eventSceneConduct/delEventStruct',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: item.id,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0) {
          $message.info('删除成功');
          name.value = ''; // 清空
          remark.value = ''; // 清空
          content.value = ''; // 清空
          unitList.value = []; // 清空
          currUnit.value = {}; // 清空
          isLeaderUnit.value = false; // 清空
          context.emit('init');
        }
      });
    }
    return {
      workGroupId,
      name,
      remark,
      content,
      currUnit,
      unitList,
      respondList,
      contactList,
      isLeaderUnit,
      changeLeaderUint,
      DialogWorkBoat,
      openPopup,
      commitUnitRemark,
      commitUnitlList,
      commit,
      handleClick,
      deleteUnit,
    };
  },
  methods: {
    // 成员单位窗
    openAddUnitDialog() {
      (this as any).$nextTick(() => {
        (this as any).$refs.AddUnitDialog.openPopup();
      });
    },
  },
});
</script>

<style lang="scss" module>
  .listIcon {
    background: url(../../../PublicComponents/assets/close.svg) no-repeat;
    background-size: 100%;
    width: 10px;
    height: 10px;
    float: right;
    margin: 6px 0px 0px 0px;
  }
  .input {
    position:absolute;
    left: 20px;
    top: 33px;
    resize: none;
    border: none;
    box-sizing: border-box;
    outline: none;
    background: transparent;
    color: #FFFFFF;
    width: 834px;
    height: 32px;
    border: 1px solid rgba(255, 255, 255, 0.65);
  }
  .text {
    position:absolute;
    left: 20px;
    top: 103px;
    resize: none;
    border: none;
    box-sizing: border-box;
    outline: none;
    background: transparent;
    color: #FFFFFF;
    width: 834px;
    height: 32px;
    border: 1px solid rgba(255, 255, 255, 0.65);
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
  .left {
    width: 402px;
    height: 590px;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: absolute;
    left: 20px;
    bottom: 73px;
    .leftHeaderStyle {
      width: 100%;
      height: 52px;
      background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
      color: #FFFFFF;
      .headerText {
        position: absolute;
        left: 20px;
        top: 15px;
      }
    }
    .leftScroll {
      height: 57vh;
      overflow: auto;
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
  }
  .right {
    width: 410px;
    height: 590px;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: absolute;
    right: 20px;
    bottom: 73px;
    .rightHeaderStyle {
      width: 100%;
      height: 52px;
      background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
      color: #FFFFFF;
      .headerText {
        position: absolute;
        left: 20px;
        top: 15px;
      }
      .headerTextOne {
        position: absolute;
        left: 15px;
        top: 60px;
        color: #56E9FF;
      }
      .headerTextTwo {
        position:absolute;
        left: 11px;
        top: 90px;
        resize: none;
        border: none;
        box-sizing: border-box;
        outline: none;
        background: transparent;
        color: #FFFFFF;
        width: 388px;
        height: 99px;
        border: 1px solid rgba(255, 255, 255, 0.65);
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
      .headerTextThree {
        position: absolute;
        right: 20px;
        top: 60px;
      }
      .headerTextFour {
        color: #56E9FF;
        position: absolute;
        right: 20px;
        top: 162px;
        cursor: pointer;
      }
    }
    .rightScroll {
      height: 36vh;
      overflow: auto;
      position: absolute;
      bottom: 20px;
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
  }
</style>
