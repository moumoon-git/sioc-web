<template>
  <!-- 预案管理里有头部tab所以管理指挥部的top会比现场指挥部的矮 -->
  <!-- 上面 现场指挥部信息 -->
  <div
    v-if="isNotInfo"
    :class="$style.sceneManagerTop"
  >
    <div style="float: left;">
      任务地点:
    </div>
    <input
      v-model="address"
      :disabled="!isEdit"
      :class="$style.text"
    >
    <!-- 落点按钮 -->
    <span
      :class="isPosition ? $style.locationActive : $style.locationUnactive"
      @click="location"
    />
    <div style="float: left;margin-left: 7px;">
      备注:
    </div>
    <input
      v-model="remark"
      :disabled="!isEdit"
      :class="$style.text"
    >
  </div>
  <!-- 左边 -->
  <div
    :class="$style.sceneManagerLeft"
    :style="isNotInfo?'margin-top: 31px':''"
  >
    <!-- 新加职务按钮 -->
    <div
      v-if="isNotInfo&&isEdit"
      :class="$style.positionButton"
      @click="openPositionDialog"
    >
      职务管理
    </div>
    <!-- 架构树按钮 -->
    <div
      v-if="!isEdit"
      :class="$style.structButton"
      @click="openStructDialog"
    >
      查看架构树
    </div>
    <!-- 领导小组 根据是否是管理区分 其他参数都一样 -->
    <component
      :is="activeComponent"
      ref="component"
      :list="leaderTeamList"
      :innerlist="innerlist"
      :useLabel="true"
      :usePosition="true"
      :useMore="true"
      :countAll="leaderTeamCountAll"
      :is-edit="isEdit"
      @fresh="init"
      @handleClick="handleLeaderTeamClick"
      @handleExpand="handleLeaderTeamExpand"
    >
      <template #headerIcon>
        <img src="../../PublicComponents/assets/leaderTeamIcon.svg"
          style="position: relative;
          margin: 13px 0px 0px 10px;
          float: left;"
        >
      </template>
    </component>
    <!-- 应急功能组 -->
    <div
      v-if="isNotInfo&&isEdit"
      :class="$style.unitButton"
      @click="openWorkDialog(0)"
    >
      添加
    </div>
    <!-- 应急功能组 -->
    <ListTemple
      :title="'应急功能组'"
      :useHeaderIcon="false"
      :list="memberUnitList"
      :count-all="memberUnitCountAll"
      @handleClick="handleEmergencyClick"
    >
      <template #operation="{ data }">
        <!-- 删除 -->
        <div
          v-if="isEdit"
          :class="$style.deleteIcon"
          @click.stop="deleteUnit(data)"
        />
      </template>
    </ListTemple>
  </div>
  <!-- 右边 -->
  <div
    :class="$style.sceneManagerRight"
    :style="isNotInfo?'margin-top: 31px':''"
  >
    <!-- 编辑 -->
    <div
      v-if="isNotInfo&&isEdit"
      :class="$style.editButton"
      @click="openWorkDialog(1)"
    >
      编辑
    </div>
    <!-- 职责细节 -->
    <DutyDetail
      :leader-name="leaderName"
      :content="content"
    />
    <!-- 成员单位 -->
    <CollapseTemple
      v-if="isUnit"
      :title="'成员单位'"
      :useHeaderIcon="false"
      :count-all="unitMemberCountAll"
      :list="unitMemberList"
      :headerStyle="true"
    >
      <template #head="{ data }">
        <div style="margin: 9px;">
          {{ data.name }}
          <span
            v-if="data.leadUnit===1"
            style="background: #F2B626;border-radius: 10px;padding: 1px 7px;font-size: 12px;"
          >牵头单位</span>
        </div>
      </template>
      <template #main="{ data }">
        <div style="margin: 0px 6px 6px 6px;">
          部门职责:{{ data?.remark }}
        </div>
        <div
          style="border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          height: auto;padding-bottom: 9px;"
        >
          <div style="margin: 6px;">
            应急负责人:
          </div>
          <div
            v-for="item in data?.contactors?.response || data?.mailResponseList"
            :key="item.id"
          >
            {{ item.name }} ({{ `${item.workUnit || '-'}/${item.position || '-'}` }})
            <span>
              <ContactMoreButton
                :id="item?.contactorId || item?.id"
              />
            </span>
          </div>
        </div>
        <div
          style="border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          height: auto;padding-bottom: 9px;"
        >
          <div style="margin: 6px;">
            应急联络人:
          </div>
          <div
            v-for="item in data?.contactors?.contacotr || data?.mailContactorList"
            :key="item.id"
          >
            {{ item.name }} ({{ `${item.workUnit || '-'}/${item.position || '-'}` }})
            <!-- 详情按钮 -->
            <span>
              <ContactMoreButton
                :id="item?.contactorId || item?.id"
              />
            </span>
          </div>
        </div>
      </template>
    </CollapseTemple>
  </div>
  <div v-if="isNotInfo">
    <!-- 下面 有预案并且在下一步 -->
    <div v-if="!isBuild&&isNext">
      <Button
        v-if="isEdit"
        type="primary"
        style="position: absolute;right: 80px;bottom: 10px;"
        @click="commit"
      >
        保存
      </Button>
      <Button
        v-if="isEdit"
        type="primary"
        style="position: absolute;right: 8px;bottom: 10px;"
        @click="cancel"
      >
        取消
      </Button>
      <Button
        v-if="!isEdit"
        type="primary"
        style="position: absolute;right: 8px;bottom: 10px;"
        @click="edit"
      >
        编辑
      </Button>
    </div>
  </div>
  <!-- 新增职务窗 -->
  <PositionDialog
    ref="PositionDialog"
    :leader-team-list="leaderTeamList"
    @init="init"
  />
  <!-- 功能组窗 -->
  <AddWorkDialog
    ref="AddWorkDialog"
    :unit-member-list="unitMemberList"
    @init="init"
  />
  <!-- 组织架构窗 -->
  <DialogBoat
    ref="DialogStructBoat"
    title="现场指挥部架构树"
  >
    <div style="width: 1204px; height: 85vh;position:relative;">
      <TreeDialog
        :is-unit="true"
        :item="$store.state.reservePlan.currNode?$store.state.reservePlan.currNode:null"
      />
      <ReserveStructure
        ref="ReserveStructTree"
        :tree-data="treeData"
      />
    </div>
  </DialogBoat>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 应急响应函数
import {
  getManager,
  getGroupResponseAndContactor,
  getStructTreeEventPC,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';
import DialogBoat from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue'; // 弹出框
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import DutyDetail from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/DutyDetail.vue'; // 职责细节
import ListTemple from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/ListTemple.vue'; // 领导小组
import CollapseTemple from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/CollapseTemple.vue'; // 折叠列表模板
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import LeaderTeam from './components/LeaderTeam.vue'; // 领导小组
import PositionDialog from './components/PositionDialog.vue'; // 新增职务窗
import AddWorkDialog from './components/AddWorkDialog.vue'; // 功能组窗
import ReserveStructure from '../../reserveStructure/structureChart.vue'; // 组织架构窗
import TreeDialog from '../../reserveStructure/TreeDialog.vue'; // 架构内弹窗

export default defineComponent({
  name: 'ReservePlanSpecialItemManager',
  components: {
    // 弹出框
    DialogBoat,
    // 按钮
    Button,
    // 现场样式的领导小组
    LeaderTeam,
    // 专项样式的领导小组
    ListTemple,
    // 折叠列表模板
    CollapseTemple,
    // 详情按钮
    ContactMoreButton,
    // 职责细节
    DutyDetail,
    // 新增职务窗
    PositionDialog,
    // 功能组窗
    AddWorkDialog,
    // 组织架构
    ReserveStructure,
    // 架构内弹窗
    TreeDialog,
  },
  inject: ['$addDialog'],
  props: {
    // 是管理里的指挥部还是现场里的
    isNotInfo: {
      type: Boolean,
      default: false,
    },
    // 是否点击了下一步，下一步没有编辑按钮
    isNext: {
      type: Boolean,
      default: false,
    },
    // 是否是正在创建现场指挥部，是则用自己数据，不是用copy数据
    isBuild: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['hide', 'unhide'],
  data() {
    return {
      isPosition: false,
      isEdit: false,
      content: '', // 职责内容
      longitude: 0,
      latitude: 0,
      address: '', // 现场指挥部-地址
      remark: '', // 现场指挥部-备注
      leaderTeamList: [], // 领导班子数据
      innerlist: [], // 领导班子数据
      memberUnitList: [], // 成员单位数据
      leaderName: '', // 职责名字
      isUnit: false, // 左边点的是领导班子还是成员单位
      unitMemberList: [] as any, // 单位成员数据
      leaderTeamCountAll: 0, // 领导班子总数
      memberUnitCountAll: 0, // 功能组总数
      unitMemberCountAll: 0, // 单位成员总数
      currentWorkGroup: '', // 当前功能组
      treeData: [
        {
          name: '',
          leftChildren: [],
          children: [],
          tempOuter: [{}],
        },
      ], // 当前架构树数据
    };
  },
 computed: {
    activeComponent(): any {
      switch (this.isNotInfo) {
        case true: { // 现场指挥部会注入true，这时用现场的领导
          return 'LeaderTeam';
        }
        default: { // 管理或其他情况用专项的领导
          return 'ListTemple';
        }
      }
    },
  },
  mounted() {
    // 不是在预案管理，有经纬度
    if (this.isNotInfo) {
      this.setLocation();
    }
    // 有现场指挥部，并且不是在预案管理，用指挥部数据
    if ((this as any).$store.state.reservePlan?.sceneMsg?.id && this.isNotInfo) {
      this.init();
    } else { // 没有现场指挥部，或者在预案管理，都用自己数据
      this.initNotBuild();
    }
  },
  // 如果选完点又不保存，退出的时候获取数据库的指挥部
  beforeUnmount() {
    getManager((this as any).$store.state.event?.id, (this as any).$store);
  },
  methods: {
    // 取消
    cancel() {
      this.isPosition = false;
      this.isEdit = false;
      this.setLocation();
      (window as any).map.clearAtPresentMarkData('AdminMarker');
      (window as any).map.setOneMarker(
        'AdminMarker',
        {
          longitude: this.longitude,
          latitude: this.latitude,
          wd: 30,
          hg: 50,
          src: require('../../PublicComponents/assets/marker.svg'),
        },
      );
    },
    // 编辑
    edit() {
      this.isPosition = false;
      this.isEdit = true;
      (window as any).map.clearAtPresentMarkData('AdminMarker');
    },
    // 初始化位置
    setLocation() {
      this.longitude = (this as any).$store.state.reservePlan?.sceneMsg?.longitude;
      this.latitude = (this as any).$store.state.reservePlan?.sceneMsg?.latitude;
      this.address = (this as any).$store.state.reservePlan?.sceneMsg?.address;
      this.remark = (this as any).$store.state.reservePlan?.sceneMsg?.remark;
    },
    // 有指挥部，要指挥部
    init() {
      // 清空
      this.content = '';
      this.unitMemberList = [];
      this.unitMemberCountAll = 0;
      // 领导
      getStructTreeEventPC(
        (this as any).$store.state.event?.id,
        1,
      ).then((response: any) => {
        this.leaderTeamList = response.data.struct; // 列表
        this.leaderTeamCountAll = 0;
        // 右树
        const temp = JSON.parse(JSON.stringify(response.data.struct));
        temp.forEach((ele: any) => {
          this.treeData[0].tempOuter.push({
            name: ele.name,
            remark: ele.remark,
          });
          if (ele.children) {
            ele.children.forEach((el: any) => {
              if (el?.contactors?.response && el?.contactors?.response.length) {
                this.leaderTeamCountAll += Number(el.contactors.response.length);
                el.contactors.response.forEach((eleM: any) => {
                  eleM.label = '应急负责人'; // 负责人
                  eleM.labelName = ele.name; // 总指挥
                  eleM.innerPosition = el.name; // 分管事件
                  (this as any).treeData[0].leftChildren.push(eleM); // 用来画树
                });
              }
              if (el?.contactors?.contacotr && el?.contactors?.contacotr.length) {
                this.leaderTeamCountAll += Number(el.contactors.contacotr.length);
                el.contactors.contacotr.forEach((eleM: any) => {
                  eleM.label = '应急联络人'; // 联络人
                  eleM.labelName = ele.name; // 总指挥
                  eleM.innerPosition = el.name; // 分管事件
                  (this as any).treeData[0].leftChildren.push(eleM); // 用来画树
                });
              }
            });
          }
        });
        this.treeData[0].name = '现场指挥部';
        this.treeData[0].tempOuter.splice(0, 1);
        for (let i = 0; i < this.treeData[0].tempOuter.length; i++) {
          for (let j = i + 1; j < this.treeData[0].tempOuter.length; j++) {
            if (
              (this as any).treeData[0].tempOuter[i].name ===
              (this as any).treeData[0].tempOuter[j].name
            ) {
              this.treeData[0].tempOuter.splice(j, 1);
              j--;
            }
          }
        }
      });
      // 单位
      getStructTreeEventPC(
        (this as any).$store.state.event?.id,
        2,
      ).then((response: any) => {
        this.memberUnitList = response.data.struct;
        this.memberUnitCountAll = Number(this.memberUnitList.length);
        // 直树
        const temp = JSON.parse(JSON.stringify(response.data.struct));
        temp.forEach((ele:any) => {
          if (ele.children) {
            ele.children.forEach((el:any) => {
              const arr:any = [];
              if (el?.contactors?.response && el?.contactors?.response.length) {
                el.contactors.response.forEach((eleM: any) => {
                  eleM.label = '应急负责人'; // 负责人
                  arr.push(eleM);
                });
              }
              if (el?.contactors?.contacotr && el?.contactors?.contacotr.length) {
                el.contactors.contacotr.forEach((eleM: any) => {
                  eleM.label = '应急联络人'; // 联络人
                  arr.push(eleM);
                });
              }
              el.children = arr;
            });
          }
          (this as any).treeData[0].children.push(ele);
        });
      });
    },
    // 没有就把当前指挥部塞进来
    initNotBuild() {
      // 领导
      getGroupResponseAndContactor(
        Number((this as any).$store.state.reservePlan?.currentReservePlan?.versionId),
        2,
        1,
      ).then((response: any) => {
        // 长度
        this.leaderTeamCountAll = 0;
        if (this.leaderTeamList && this.leaderTeamList.length > 0) {
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
                el.contactors = {
                  response: [],
                  contacotr: [],
                };
                if (el?.mailResponseList && el?.mailResponseList.length) {
                  this.leaderTeamCountAll += Number(el.mailResponseList.length);
                  el.mailResponseList.forEach((eleM:any) => {
                    eleM.innerPosition = el.name; // 分管事件
                    eleM.label = '应急负责人';
                    eleM.labelName = ele.name; // 总指挥
                    eleM.remark = ele.remark; // 总指挥的
                    (this as any).treeData[0].leftChildren.push(eleM); // 用来画树
                    el.contactors.response.push(eleM); // 用来渲染数据
                  });
                }
                if (el?.mailContactorList && el?.mailContactorList.length) {
                  this.leaderTeamCountAll += Number(el.mailContactorList.length);
                  el.mailContactorList.forEach((eleM:any) => {
                    eleM.innerPosition = el.name; // 分管事件
                    eleM.label = '应急联络人';
                    eleM.labelName = ele.name; // 总指挥
                    eleM.remark = ele.remark; // 总指挥的
                    (this as any).treeData[0].leftChildren.push(eleM); // 用来画树
                    el.contactors.contacotr.push(eleM); // 用来渲染数据
                  });
                }
              });
            }
          });
          this.leaderTeamList = (this as any).treeData[0].leftChildren;
          this.treeData[0].name = '现场指挥部';
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
        Number((this as any).$store.state.reservePlan?.currentReservePlan?.versionId),
        2,
        2,
      ).then((response: any) => {
        this.memberUnitList = response.data;
        this.memberUnitCountAll = Number(this.memberUnitList.length);
        // 直树
        const temp = JSON.parse(JSON.stringify(response.data));
        temp.forEach((ele:any) => {
          if (ele.children) {
            ele.children.forEach((el:any) => {
              const arr:any = [];
              if (el?.mailResponseList && el?.mailResponseList.length) {
                el.mailResponseList.forEach((eleM:any) => {
                  eleM.label = '应急负责人'; // 负责人
                  arr.push(eleM);
                });
              }
              if (el?.mailContactorList && el?.mailContactorList.length) {
                el.mailContactorList.forEach((eleM:any) => {
                  eleM.label = '应急联络人'; // 联络人
                  arr.push(eleM);
                });
              }
              el.children = arr;
            });
          }
          (this as any).treeData[0].children.push(ele);
        });
      });
    },
    // 地图落点
    location() {
      (window as any).map.clearAtPresentMarkData('AdminMarker');
      this.isPosition = true;
      this.$emit('hide');
      if (this.isEdit && this.isPosition) {
        const mapInstance = (window as any).map;
        // 开启点击地图获取地址、经纬度的功能
        mapInstance.setMouseStyle(require('../../PublicComponents/assets/marker.svg'));
        mapInstance.clickDroppoint((clickInfo: {
          mapLocation: {
            lon: number,
            lat: number,
          },
          res: {
            result: {
              formatted_address: string,
            }
          }
        }) => {
          // 关闭点击地图获取地址、经纬度的功能
          mapInstance.closeClickDroppoint();
          mapInstance.restoreDefaultStyle();
          // 获取到地址、经纬度
          this.address = clickInfo.res.result.formatted_address;
          this.longitude = clickInfo.mapLocation.lon;
          this.latitude = clickInfo.mapLocation.lat;
          // 绘制地点坐标
          mapInstance.setOneMarker(
            'AdminMarker',
            {
              longitude: clickInfo.mapLocation.lon,
              latitude: clickInfo.mapLocation.lat,
              wd: 30,
              hg: 30,
              src: require('../../PublicComponents/assets/marker.svg'),
            },
          );
          // 取消隐藏弹窗
          this.$emit('unhide');
        });
      } else if (!this.isEdit && this.isPosition) {
        (window as any).map.setCentent(
          {
            longitude: this.longitude,
            latitude: this.latitude,
          },
          17,
        );
        (window as any).map.setOneMarker(
          'AdminMarker',
          {
            longitude: this.longitude,
            latitude: this.latitude,
            wd: 30,
            hg: 50,
            src: require('../../PublicComponents/assets/marker.svg'),
          },
        );
      }
    },
    // 职务窗
    openPositionDialog() {
      (this as any).$nextTick(() => {
        (this as any).$refs.PositionDialog.openPopup();
      });
    },
    // 功能组窗
    openWorkDialog(item: any) {
      // 编辑
      if (item) {
        if (this.currentWorkGroup === '') {
          this.$message.error('请选择要修改的功能组');
          return;
        }
        (this as any).$nextTick(() => {
          (this as any).$refs.AddWorkDialog.workGroupId = (this as any).currentWorkGroup.id;
          (this as any).$refs.AddWorkDialog.name = (this as any).currentWorkGroup.name;
          (this as any).$refs.AddWorkDialog.remark = (this as any).currentWorkGroup.remark;
          (this as any).$refs.AddWorkDialog.openPopup();
        });
      } else { // 添加
        this.currentWorkGroup = ''; // 清空
        this.unitMemberList = []; // 清空，不然旧数据会给新增
        this.unitMemberCountAll = 0; // 清空
        (this as any).$nextTick(() => {
          (this as any).$refs.AddWorkDialog.workGroupId = 0;
          (this as any).$refs.AddWorkDialog.name = '';
          (this as any).$refs.AddWorkDialog.remark = '';
          (this as any).$refs.AddWorkDialog.openPopup();
        });
      }
    },
    // 组织架构窗
    openStructDialog() {
      (this as any).$store.commit('reservePlan/setCurrNode', null);
      setTimeout(() => {
        (this as any).$refs.DialogStructBoat.open();
        (this as any).$refs.ReserveStructTree.init();
      }, 500);
    },
    // 点击领导班子
    handleLeaderTeamClick(labelName: any, remark: any) {
      // 领导名字
      this.leaderName = labelName;
      // 领导职责详细
      this.content = remark;
      // 点击领导不激活右边单位成员
      this.isUnit = false;
    },
    // 点击领导班子展开
    handleLeaderTeamExpand(item: any) {
      (this as any).innerlist = [];
      if (item.children) {
        item.children.forEach((el: any) => {
          if (el?.contactors?.response && el?.contactors?.response.length) {
            el.contactors.response.forEach((eleM: any) => {
              eleM.label = '应急负责人';
              eleM.labelName = item.name; // 总指挥
              eleM.remark = item.remark; // 总指挥的
              (this as any).innerlist.push(eleM);
            });
          }
          if (el?.contactors?.contacotr && el?.contactors?.contacotr.length) {
            el.contactors.contacotr.forEach((eleM: any) => {
              eleM.label = '应急联络人';
              eleM.labelName = item.name; // 总指挥
              eleM.remark = item.remark; // 总指挥的
              (this as any).innerlist.push(eleM);
            });
          }
        });
      }
    },
    // 点击单位/组
    handleEmergencyClick(item: any) {
      // 设置当前组
      this.currentWorkGroup = item;
      // 组名字
      this.leaderName = item?.name;
      // 组职责详细
      this.content = item?.remark;
      // 点击组激活右边单位成员
      this.isUnit = true;
      // 组对应数据
      this.unitMemberList = item?.children;
      // 单位成员总数
      this.unitMemberCountAll = Number(item?.children.length);
    },
    // 删除
    deleteUnit(item: any) {
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/eventSceneConduct/delEventStruct',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: item.id,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0) {
          (this as any).$message.info('删除成功！');
          // 刷新
          this.init();
        }
      });
    },
    // 保存按钮
    commit() {
      this.isEdit = !this.isEdit; // 恢复不可编辑状态
      const request = {
        method: 'post',
        url: '/eventconduct/add',
        service: 'soc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: (this as any).$store.state.reservePlan.sceneMsg.id, // 当前现场指挥部节点id
          eventId: (this as any).$store.state.event?.id,
          address: this.address,
          longitude: this.longitude,
          latitude: this.latitude,
          remark: this.remark,
          duty: '',
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.$message.info('保存成功');
          getManager((this as any).$store.state.event?.id, (this as any).$store);
        }
      });
    },
  },
});
</script>

<style lang="scss" module>
.deleteIcon {
  background: url(../../PublicComponents/assets/close.svg) no-repeat;
  background-size: 100%;
  width: 10px;
  height: 10px;
  float: right;
  margin-top: 6px;
}
.sceneManagerTop {
  width: 95%;
  height: 22px;
  color: #fff;
  position: absolute;
  left: 21px;
  top: 8px;
}
.sceneManagerLeft {
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
  .positionButton {
    font-size: 14px;
    color: #00c1de;
    position: absolute;
    right: 10px;
    top: 15px;
    cursor: pointer;
    z-index: 1;
  }
  .structButton {
    font-size: 14px;
    color: #00C1DE;
    position: absolute;
    right: 10px;
    top: 15px;
    cursor: pointer;
    z-index: 1;
  }
  .unitButton {
    font-size: 14px;
    color: #00c1de;
    position: absolute;
    right: 10px;
    margin-top: 5px;
    cursor: pointer;
    z-index: 1;
  }
}
.sceneManagerRight {
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
  .editButton {
    font-size: 14px;
    color: #00c1de;
    position: absolute;
    right: 10px;
    top: 15px;
    cursor: pointer;
    z-index: 1;
  }
}
.locationActive {
  background: url(../../PublicComponents/assets/locationActive.svg) no-repeat;
  width: 14px;
  height: 17px;
  cursor: pointer;
  float: left;
  margin-left: 7px;
}
.locationUnactive {
  background: url(../../PublicComponents/assets/locationUnActive.svg) no-repeat;
  width: 14px;
  height: 17px;
  cursor: pointer;
  float: left;
  margin-left: 7px;
  &:hover {
    background: url(../../PublicComponents/assets/locationActive.svg) no-repeat;
  }
}
.text {
  border: none;
  color: #ffffff;
  background: transparent;
  float: left;
  width: 40%;
}
</style>
