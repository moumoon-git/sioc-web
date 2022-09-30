<template>
  <!-- 左边 -->
  <div :class="$style.specialItemManagerLeft">
    <div
      style="font-size: 14px;
      color: #00C1DE;
      position: absolute;
      right: 10px;
      top: 15px;
      cursor: pointer;
      z-index: 1;"
      @click="openStructDialog"
    >
      查看架构树
    </div>
    <ListTemple
      :list="leaderTeamList"
      :useLabel="true"
      :usePosition="true"
      :useMore="true"
      :countAll="leaderTeamCountAll"
      @handleClick="handleLeaderTeamClick"
    >
      <template #headerIcon>
        <img
          src="../../PublicComponents/assets/leaderTeamIcon.svg"
          style="position: relative;
          margin: 13px 0px 0px 10px;
          float: left;"
        >
      </template>
    </ListTemple>
    <ListTemple
      :title="'成员单位'"
      :useHeaderIcon="false"
      :list="memberUnitList"
      :countAll="memberUnitCountAll"
      @handleClick="handleMemberUnitClick"
    />
  </div>
  <!-- 右边 -->
  <div :class="$style.specialItemManagerRight">
    <!-- 职责细节 -->
    <DutyDetail
      :leaderName="leaderName"
      :content="content"
    />
    <!-- 单位成员 -->
    <ListTemple
      v-if="isUnit"
      :title="'单位成员'"
      :useHeaderIcon="false"
      :usePosition="true"
      :useMore="true"
      :list="unitMemberList"
      :useLabel="true"
      :countAll="unitMemberCountAll"
    />
  </div>
  <!-- 组织架构窗 -->
  <DialogBoat
    ref="DialogStructBoat"
    title="专项指挥部架构树"
  >
    <div style="width: 1204px; height: 85vh;position:relative;">
      <TreeDialog
        :is-unit="false"
        :item="$store.state.reservePlan.currNode?$store.state.reservePlan.currNode:null"
      />
      <ReserveStructure
        ref="ReserveInnerStructure"
        :tree-data="treeData"
      />
    </div>
  </DialogBoat>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 应急响应函数
import {
  getGroupResponseAndContactor,
  getGroupManageEventTypeAndPeople,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';
import DialogBoat from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue'; // 弹出框
import DutyDetail from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/DutyDetail.vue'; // 职责细节
import ReserveStructure from '../../reserveStructure/structureChart.vue'; // 组织架构
import ListTemple from '../../PublicComponents/ListTemple.vue'; // 列表模板
import TreeDialog from '../../reserveStructure/TreeDialog.vue'; // 架构内弹窗

export default defineComponent({
  name: 'ReservePlanSpecialItemManager',
  components: {
    // 弹出框
    DialogBoat,
    // 组织架构
    ReserveStructure,
    // 列表模板
    ListTemple,
    // 职责细节
    DutyDetail,
    // 架构内弹窗
    TreeDialog,
  },
  data() {
    return {
      leaderTeamList: [], // 领导班子数据
      memberUnitList: [], // 成员单位数据
      leaderName: '', // 职责名字
      content: '', // 职责内容
      isUnit: false, // 左边点的是领导班子还是成员单位
      unitMemberList: [], // 单位成员数据
      leaderTeamCountAll: 0,
      memberUnitCountAll: 0,
      unitMemberCountAll: 0, // 单位成员总数
      treeData: [{
        name: '',
        leftChildren: [],
        children: [],
        tempOuter: [{}],
      }], // 当前架构树数据
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(): void {
      // 领导
      getGroupResponseAndContactor(
        Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
        1,
        1,
      ).then((response: any) => {
        // 长度
        this.leaderTeamCountAll = 0;
        if (response.data && response.data.length > 0) {
          // 右树
          const temp = JSON.parse(JSON.stringify(response.data));
          temp.forEach((ele:any) => {
            this.treeData[0].tempOuter.push(
              {
                name: ele.name,
                remark: ele.remark,
              },
            );
            if (ele.children) {
              ele.children.forEach((el:any) => {
                if (el.mailResponseList !== null) {
                  this.leaderTeamCountAll += Number(el.mailResponseList.length);
                  el.mailResponseList.forEach((eleM:any) => {
                    eleM.innerPosition = el.name; // 分管事件
                    eleM.label = '应急负责人';
                    eleM.labelName = ele?.name || '-'; // 总指挥
                    eleM.remark = ele.remark; // 总指挥的
                    (this as any).treeData[0].leftChildren.push(eleM);
                  });
                }
                if (el.mailContactorList !== null) {
                  this.leaderTeamCountAll += Number(el.mailContactorList.length);
                  el.mailContactorList.forEach((eleM:any) => {
                    eleM.innerPosition = el.name; // 分管事件
                    eleM.label = '应急联络人';
                    eleM.labelName = ele?.name || '-'; // 总指挥
                    eleM.remark = ele.remark; // 总指挥的
                    (this as any).treeData[0].leftChildren.push(eleM);
                  });
                }
              });
            }
          });
          this.leaderTeamList = (this as any).treeData[0].leftChildren;
          this.treeData[0].name = '专项指挥部';
          this.treeData[0].tempOuter.splice(0, 1);
          for (let i = 0; i < this.treeData[0].tempOuter.length; i++) {
            for (let j = i + 1; j < this.treeData[0].tempOuter.length; j++) {
              if ((this as any).treeData[0].tempOuter[i].name === (this as any).treeData[0].tempOuter[j].name) {
                this.treeData[0].tempOuter.splice(j, 1);
                j--;
              }
            }
          }
        }
      });
      // 单位
      getGroupResponseAndContactor(
        Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
        1,
        2,
      ).then((response: any) => {
        this.memberUnitList = response.data;
        this.memberUnitCountAll = Number(this.memberUnitList.length);
        // 直树
        const temp = JSON.parse(JSON.stringify(response.data));
        temp.forEach((ele:any) => {
          const arr:any = [];
          if (ele.mailResponseList) {
            ele.mailResponseList.forEach((el:any) => {
              el.label = '应急负责人';
              arr.push(el);
            });
          }
          if (ele.mailContactorList) {
            ele.mailContactorList.forEach((el:any) => {
              el.label = '应急联络人';
              arr.push(el);
            });
          }
          ele.children = arr;
          (this as any).treeData[0].children.push(ele);
        });
      });
    },
    // 点击领导班子
    handleLeaderTeamClick(item: any): void {
      // 领导名字
      this.leaderName = item.labelName;
      // 领导职责详细
      this.content = item.remark;
      // 点击领导不激活右边单位成员
      this.isUnit = false;
    },
    // 点击单位/组
    handleMemberUnitClick(item: any): void {
      // 组名字
      this.leaderName = item.name;
      // 组职责详细
      this.content = item.remark;
      // 点击组激活右边单位成员
      this.isUnit = true;
      // 组对应数据
      getGroupManageEventTypeAndPeople(
        item.groupId,
        Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
      ).then((response: any) => {
        this.unitMemberList = [];
        // 单位成员总数
        this.unitMemberCountAll = 0;
        if (response.data && response.data.length > 0) {
          response.data.forEach((el:any) => {
            if (el.groupResponsibleTypeList) {
              el.groupResponsibleTypeList.forEach((ele:any) => {
                if (ele.malicontactorList !== null) {
                  this.unitMemberCountAll += Number(ele.malicontactorList.length);
                  ele.malicontactorList.forEach((eleM:any) => {
                    eleM.label = '应急负责人';
                    eleM.labelName = ele?.name || '-';
                    (this as any).unitMemberList.push(eleM);
                  });
                }
              });
            }
            if (el.groupContactorTypeList) {
              el.groupContactorTypeList.forEach((ele:any) => {
                if (ele.malicontactorList !== null) {
                  this.unitMemberCountAll += Number(ele.malicontactorList.length);
                  ele.malicontactorList.forEach((eleM:any) => {
                    eleM.label = '应急联络人';
                    eleM.labelName = ele?.name || '-';
                    (this as any).unitMemberList.push(eleM);
                  });
                }
              });
            }
          });
        }
      });
    },
    // 组织架构窗
    openStructDialog(): void {
      (this as any).$store.commit('reservePlan/setCurrNode', null);
      setTimeout(() => {
        (this as any).$refs.DialogStructBoat.open();
        (this as any).$refs.ReserveInnerStructure.init();
      }, 500);
    },
  },
});
</script>

<style lang="scss" module>
  .specialItemManagerLeft {
    width: 402px;
    height: 72vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: relative;
    margin-left: 21px;
    margin-top: 10px;
    float: left;
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
  .specialItemManagerRight {
    width: 410px;
    height: 72vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: relative;
    margin-right: 21px;
    margin-top: 10px;
    float: right;
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
</style>
