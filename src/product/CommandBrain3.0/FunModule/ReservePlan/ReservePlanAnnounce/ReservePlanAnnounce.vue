<template>
  <div style="width: 1160px; height: 85vh;position:relative;">
    <!-- 有响应 -->
    <div v-if="hasAnnounce">
      <!-- 手机预览 --> 
      <div v-if="isPreview">
        <div :class="$style.msgPreview">
          <div :class="$style.msgPreviewFrame">
            <!-- 预览关闭按钮 -->
            <div
              :class="$style.msgPreviewClose"
              @click="isPreview=false"
            />
            <!-- 预览文本 -->
            <div :class="$style.msgPreviewTextScroll">
              <p :class="$style.msgPreviewText">
                {{ $refs.MsgDetail.content }}
              </p>
            </div>
            <!-- 预览手机图片 -->
            <div :class="$style.msgPreviewPic" />
            <!-- 预览圆形层和蒙版 -->
            <div :class="$style.msgPreviewBack" />
          </div>
        </div>
      </div>
      <!-- 短信模板 -->
      <DialogBoat
        ref="MsgDialogBoat"
        title="短信模板"
      >
        <div :class="$style.mould">
          <!-- 树 -->
          <div :class="$style.mouldLeft">
            <header :class="$style.mouldLeftStyle">
              <div :class="$style.mouldLeftIcon" />
              <div :class="$style.mouldLeftText">
                模板分组
              </div>
              <div
                v-if="!isDelete"
                style="font-size: 14px;
                color: rgba(0, 193, 222, 1);
                position: absolute;
                right: 86px;
                top: 15px;
                cursor: pointer;"
                @click="isDelete=true,
                        isAddMould=false,
                        isAddGroup=false,
                        isEditMould=false,
                        isEditGroup=false,
                        checkNode=[]"
              >
                批量删除
              </div>
              <Button
                v-if="isDelete"
                type="primary"
                style="position: absolute;
                  top: 15px;
                  right: 144px;
                  width: 66px;
                  height: 25px;"
                @click="deleteGroup"
              >
                确定
              </Button>
              <Button
                v-if="isDelete"
                type="ghost"
                style="position: absolute;
                  top: 15px;
                  right: 73px;
                  width: 66px;
                  height: 25px;"
                @click="isDelete=false,
                        isAddMould=false,
                        isAddGroup=false,
                        isEditMould=false,
                        isEditGroup=false"
              >
                取消
              </Button>
              <div
                style="font-size: 14px;
                color: rgba(0, 193, 222, 1);
                position: absolute;
                right: 10px;
                top: 15px;
                cursor: pointer;"
                @click="addTreeGroup"
              >
                新增分组
              </div>
            </header>
            <main :class="$style.mouldLeftScroll">
              <GroupTree
                :current-tree-node="currentTreeNode"
                :is-check-box="isDelete"
                :data="treeData"
                @add="addTreeGroup"
                @edit="editTreeGroup"
                @deleteItem="deleteTreeGroup"
                @node-click="handleNodeClick"
                @node-check="handleNodeCheck"
                @node-uncheck="handleNodeUncheck"
              />
            </main>
          </div>
          <!-- 列表 -->
          <div :class="$style.mouldMiddle">
            <header :class="$style.mouldMiddleStyle">
              <div :class="$style.mouldMiddleIcon" />
              <div :class="$style.mouldMiddleText">
                短信模板
              </div>
              <div
                style="font-size: 14px;
                color: rgba(0, 193, 222, 1);
                position: absolute;
                right: 10px;
                top: 15px;
                cursor: pointer;"
                @click="isDelete=false,
                        isAddMould=true,
                        isAddGroup=false,
                        isEditMould=false,
                        isEditGroup=false,
                        modulName='',
                        modulContent=''"
              >
                新增模板
              </div>
            </header>
            <main :class="$style.mouldMiddleScroll">
              <div
                v-for="item in mouldList"
                :key="item.id"
                :class="$style.mouldMiddleList"
                :style="currentMouldItem?.id===item?.id ? 'opacity: 1' : ''"
                @click="handleMouldClick(item)"
              >
                <!-- 名字 -->
                <div :class="$style.mouldMiddleName">
                  {{ item.templateId }}
                </div>
                <!-- 按钮 -->
                <div
                  :class="$style.mouldDelete"
                  @click="deleteOne(item)"
                />
                <div
                  :class="$style.mouldEdit"
                  @click="editOne(item)"
                />
              </div>
            </main>
          </div>
          <!-- 模板内容 -->
          <div :class="$style.mouldRight">
            <header :class="$style.mouldRightStyle">
              <div :class="$style.mouldRightIcon" />
              <div
                v-if="isAddMould"
                :class="$style.mouldRightText"
              >
                新增模板
              </div>
              <div
                v-if="isEditMould"
                :class="$style.mouldRightText"
              >
                修改模板
              </div>
              <div
                v-if="isAddGroup"
                :class="$style.mouldRightText"
              >
                新增分组
              </div>
              <div
                v-if="isEditGroup"
                :class="$style.mouldRightText"
              >
                修改分组
              </div>
              <div
                v-if="!isAddMould&&!isAddGroup&&!isEditMould&&!isEditGroup"
                :class="$style.mouldRightText"
              >
                模板内容
              </div>
            </header>
            <main :class="$style.mouldRightScroll">
              <div v-if="!isAddMould&&!isAddGroup&&!isEditMould&&!isEditGroup">
                <textarea
                  v-model="modulContent"
                  style="resize: none;
                  box-sizing: border-box;
                  outline: none;
                  background: transparent;
                  width: 100%;
                  position: absolute;
                  height: 69vh;
                  border: none;
                  color: #FFFFFF;"
                />
              </div>
              <div
                v-else
                style="color:rgba(166, 173, 180, 1);position: absolute; top:60px;"
              >
                <div
                  v-if="isAddMould||isEditMould&&(!isAddGroup&&!isEditGroup)"
                  style="position: absolute; top:28px;left: 10px;width: 69px;"
                >
                  模板名称:
                </div>
                <div
                  v-if="(isAddGroup||isEditGroup)&&(!isAddMould&&!isEditMould)"
                  style="position: absolute; top:28px;left: 10px;width: 69px;"
                >
                  分组名称:
                </div>
                <textarea
                  v-model="modulName"
                  style="resize: none;
                    box-sizing: border-box;
                    outline: none;
                    background: transparent;
                    width: 257px;
                    position: absolute;
                    height: 4vh;
                    border: 1px solid rgb(166, 173, 180);
                    color: rgb(255, 255, 255);
                    top: 22px;
                    left: 80px;"
                />
              </div>
              <div
                v-if="(isAddMould||isEditMould)&&(!isAddGroup&&!isEditGroup)"
                style="color:rgba(166, 173, 180, 1);position: absolute; top:60px;"
              >
                <div style="position: absolute; top:84px;left: 10px;width: 69px;">
                  模板内容:
                </div>
                <textarea
                  v-model="modulContent"
                  style="resize: none;
                    box-sizing: border-box;
                    outline: none;
                    background: transparent;
                    width: 257px;
                    position: absolute;
                    height: 50vh;
                    border: 1px solid rgb(166, 173, 180);
                    color: rgb(255, 255, 255);
                    top: 87px;
                    left: 80px;"
                />
              </div>
              <Button
                v-if="isAddMould"
                type="primary"
                style="position: absolute;
                bottom: 15px;
                right: 14px;"
                @click="submit('isAddMould')"
              >
                确定
              </Button>
              <Button
                v-if="isAddGroup"
                type="primary"
                style="position: absolute;
                bottom: 15px;
                right: 14px;"
                @click="submit('isAddGroup')"
              >
                确定
              </Button>
              <Button
                v-if="isEditMould"
                type="primary"
                style="position: absolute;
                bottom: 15px;
                right: 14px;"
                @click="submit('isEditMould')"
              >
                确定
              </Button>
              <Button
                v-if="isEditGroup"
                type="primary"
                style="position: absolute;
                bottom: 15px;
                right: 14px;"
                @click="submit('isEditGroup')"
              >
                确定
              </Button>
              <Button
                v-if="isAddMould||isAddGroup||isEditMould||isEditGroup"
                type="ghost"
                style="position: absolute;
                bottom: 15px;
                right: 91px;"
                @click="isDelete=false,
                        isAddMould=false,
                        isAddGroup=false,
                        isEditMould=false,
                        isEditGroup=false"
              >
                取消
              </Button>
            </main>
          </div>
          <!-- 按钮 -->
          <Button
            type="primary"
            style="position: absolute; bottom: 18px; right: 10px;"
            @click="clickModul"
          >
            选取模板
          </Button>
        </div>
      </DialogBoat>
      <!-- 发送记录 -->
      <DialogBoat
        ref="SendRecordBoat"
        title="发送记录"
      >
        <div style="width: 494px; height: 66vh;position:relative;padding: 10px;">
          <CollapseTemple
            :useHead="false"
            :list="announceList"
          >
            <template #head="{ data }">
              <div style="margin: 9px;">
                <span>发送时间：{{ data.sendTime }}</span>
                <span style="margin-left: 9px;">发送人：{{ data.user.username }}</span>
                <span style="margin-left: 9px;">发送人数：{{ data.all }}</span>
              </div>
            </template>
            <template #main="{ data }">
              <div
                v-for="item in data.contactors"
                :key="item.id"
                style="margin: 0px 0px 3px 9px;"
              >{{ item.name }} ({{ `${item.position}` }})
              </div>
            </template>
          </CollapseTemple>
        </div>
      </DialogBoat>
      <!-- 响应头 -->
      <header
        :class="$style.headerStyle"
      >
        <div :class="$style.headerOne">
          发送时间：{{ announceForm.sendTime }}
        </div>
        <div :class="$style.headerTwo">
          发送人：{{ announceForm.sendMan }}
        </div>
        <!-- 竖线1 -->
        <div
          style="width: 1px;
          height: 48px;
          position: absolute;
          left: 306px;
          top: 6px;
          background: linear-gradient(rgba(86, 233, 255, 0),
          rgba(255, 255, 255, 1), rgba(86, 233, 255, 0));"
        />
        <div :class="$style.countAllNum">
          {{ announceForm.countAll }}
        </div>
        <div :class="$style.countAllText">
          总人数
        </div>
        <div :class="$style.headerThree">
          已发送：{{ announceForm.hasSend }}
        </div>
        <div :class="$style.headerFour">
          未发送：{{ announceForm.notSend }}
        </div>
        <!-- 竖线2 -->
        <div
          style="width: 1px;
          height: 48px;
          position: absolute;
          left: 521px;
          top: 6px;
          background: linear-gradient(rgba(86, 233, 255, 0),
          rgba(255, 255, 255, 1), rgba(86, 233, 255, 0));"
        />
        <div :class="$style.headerFive">
          已响应：{{ announceForm.hasRespond }}
        </div>
        <div :class="$style.headerSix">
          未响应：{{ announceForm.notRespond }}
        </div>
        <div :class="$style.respondRateNum">
          {{ `${announceForm.respondRate}%` }}
        </div>
        <div :class="$style.respondRateText">
          响应率
        </div>
        <Button
          type="ghost"
          style="position: absolute; bottom: 14px; right: 20px;"
          @click="handleHeaderClick"
        >
          发送记录
        </Button>
      </header>
      <!-- 响应体 -->
      <main>
        <div :class="$style.announceLeft">
          <!-- 领导小组 -->
          <LeaderTeam
            ref="LeaderTeam"
            :isAnnouce="true"
            :list="leaderTeamList"
            :respond-rate="leaderRespondRate"
            :count-all="leaderTeamCountAll"
            @handleClick="handleLeaderTeamClick"
          />
          <!-- 成员单位 -->
          <ListTemple
            ref="MemberUnit"
            :title="'成员单位'"
            :useHeaderIcon="false"
            :list="memberUnitList"
            :countAll="memberUnitCountAll"
            @handleClick="handleMemberUnitClick"
          >
            <template #headerRight>
              <span style="float: right;margin: 13px 10px 0px 0px;">
                整体响应率:{{ memberUnitRespondRate }}
              </span>
            </template>
            <template #operation="{ data }">
              <span style="float: right;margin-right: 10px;">
                响应率:{{ data.rate+'%' }}
              </span>
            </template>
          </ListTemple>
        </div>
        <div :class="$style.announceMiddle">
          <!-- 职责细节 -->
          <DutyDetail
            :leader-name="leaderName"
            :content="content"
          />
          <div :style="isUnit?'':'display:none'">
            <!-- 部门成员 -->
            <ListTemple
              :title="'部门成员'"
              :useHeaderIcon="false"
              :list="unitMemberList"
              :countAll="unitMemberCountAll"
              :useLabel="true"
              :usePosition="true"
              :useMore="true"
              :useCheck="true"
              @handleCheck="handleUnitMemberCheck"
            >
              <template #headerRight>
                <span style="float: right;margin: 13px 10px 0px 0px;">
                  已选中: {{ chooseUnitMemberArr.length }}
                </span>
              </template>
              <template #operation="{ data }">
                <div
                  style="float: right;"
                  :style="{'--getColor': getRespondStatus(data.statusName)}"
                >
                  {{ data.statusName }}
                </div>
                <div
                  :class="{
                    [$style.hasRespondIcon]: data.statusName=='已响应',
                    [$style.notRespondIcon]: data.statusName=='未响应',
                    [$style.notSendIcon]: data.statusName=='未发送',
                  }"
                />
                <div
                  v-if="data.statusName=='未响应'||data.statusName=='未发送'"
                  style="float: right;color: #56E9FF;margin-left: 8px;display: contents;"
                  @click="reSend(data)"
                >
                  补发
                </div>
              </template>
            </ListTemple>
          </div>
          <!-- 响应信息 -->
          <ListTemple
            :title="'响应信息'"
            :useHeaderIcon="false"
            :list="annoMsgList"
            :countAll="annoMsgList?.length || 0"
          >
            <template #operation="{ data }">
              <div :class="$style.line" />
              <div style="margin: 5px;">
                {{ data.content }}
              </div>
            </template>
          </ListTemple>
        </div>
        <div :class="$style.announceRight">
          <!-- 短信内容 -->
          <MsgDetail
            ref="MsgDetail"
            @reset="reset"
          />
        </div>
        <!-- 水平线 -->
        <div :class="$style.horizonLine" />
      </main>
      <!-- 响应底 -->
      <footer>
        <div style="position: absolute; bottom: 23px; left: 20px;color: #A6ADB4;">
          已选中{{
            ($refs.LeaderTeam?$refs.LeaderTeam.chooseArr.length:0)
              + chooseUnitMemberArr.length
          }}人
        </div>
        <Button
          type="ghost"
          style="position: absolute; bottom: 18px; right: 289px;"
          @click="sendToUnsend"
        >
          提醒
        </Button>
        <Button
          type="ghost"
          style="position: absolute; bottom: 18px; right: 218px;"
          @click="isPreview=true"
        >
          预览
        </Button>
        <Button
          type="ghost"
          style="position: absolute; bottom: 18px; right: 119px;"
          @click="openMsg"
        >
          短信模板
        </Button>
        <Button
          type="primary"
          style="position: absolute; bottom: 18px; right: 20px;width: 94px;"
          @click="oneClickSend"
        >
          {{ isFirstSend ? '一键发送' : '重 发' }}
        </Button>
      </footer>
    </div>
    <!-- 没有响应 -->
    <div v-else>
      <div :class="$style.noAnnounceDiv">
        暂未发送通告
      </div>
      <button
        :class="$style.noAnnounceButton"
        @click="hasAnnounce=true"
      >
        发 送 通 告
      </button>
    </div>
  </div>
  <!-- 弹窗 -->
  <MessageBox
    ref="MessageBox"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import DialogBoat from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue'; // 弹出框
import MessageBox from '@/product/CommandBrain3.0/Generalparts/dialog/MessageBox/MessageBox.vue'; // 消息确认弹窗
import DutyDetail from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/DutyDetail.vue'; // 职责细节
import LeaderTeam from '../ReservePlanScene/ReservePlanSceneManager/components/LeaderTeam.vue'; // 领导小组
import MsgDetail from './components/MsgDetail.vue'; // 短信
import GroupTree from './components/MsgGroupTree.vue'; // 树状分组组件
import ListTemple from '../PublicComponents/ListTemple.vue'; // 列表模板
import CollapseTemple from '../PublicComponents/CollapseTemple.vue'; // 折叠列表模板

export default defineComponent({
  name: 'ReservePlanAnnounce',
  components: {
    // 列表模板
    ListTemple,
    // 折叠列表模板
    CollapseTemple,
    // 弹出框
    DialogBoat,
    // 领导小组
    LeaderTeam,
    // 职责细节
    DutyDetail,
    // 短信内容
    MsgDetail,
    // 树状分组组件
    GroupTree,
    // 按钮
    Button,
    // 详情按钮
    ContactMoreButton,
    // 消息确认弹窗
    MessageBox,
  },
  provide() {
    return {
      $MessageBox: this.openMessageBox,
    };
  },
  setup() {
    const instance: any = getCurrentInstance();
    const $store = useStore();
    const {
      $ws,
    }: any = getCurrentInstance()?.appContext.config.globalProperties;
    let uns: () => void;
    onMounted(() => {
      $ws.subscribe(
        '/topic/eventResponse/dynamic',
        (result: any) => {
          if (Number(result?.eventId) === $store.state.event?.id) {
            instance.proxy.initAnnounceList();
          }
        },
      );
    });
    onBeforeUnmount(() => {
      if (uns) uns(); // 退出websocket
    });
  },
  data() {
    return {
      // 响应列表
      announceForm: {
        sendTime: '',
        sendMan: '',
        hasSend: '',
        notSend: '',
        hasRespond: '',
        notRespond: '',
        countAll: 0,
        respondRate: '0%',
      },
      leaderRespondRate: '0%',
      memberUnitRespondRate: '0%',
      unitMemberRespondRate: '0%',
      leaderTeamCountAll: 0,
      memberUnitCountAll: 0,
      unitMemberCountAll: 0,
      currentTreeNode: null, // 当前模板树节点
      currentMouldItem: null, // 当前模板节点
      isAddGroup: false, // 新增分组
      isAddMould: false, // 新增分组
      isEditGroup: false, // 修改分组
      isEditMould: false, // 新增分组
      isDelete: false, // 删除
      modulName: '', // 短信模板名字
      modulContent: '', // 短信模板内容
      tempModulContent: '', // 临时短信模板内容
      announceList: [], // 响应列表
      hasAnnounce: false, // 有没有响应列表
      isPreview: false, // 手机预览
      isUnit: false, // 左边点的是领导班子还是成员单位
      leaderName: '', // 职责名字
      currUnit: null,
      content: '', // 职责内容
      treeData: [], // 短信模板树
      mouldList: [], // 短信模板列
      leaderTeamList: [], // 领导班子数据
      memberUnitList: [], // 成员单位数据
      unitMemberList: [], // 单位成员数据
      annoMsgList: [] as any, // 响应信息数据
      checkNode: [], // 勾选树组删除
      isFirstSend: true, // 第一次发送还是重发
      chooseUnitMemberArr: [], // 选中的所有人
      chooseUnitMemberAll: false, // 部门成员全选
    };
  },
  mounted() {
    this.isFirstSend = true;
    this.initAnnounceList();
  },
  methods: {
    // 初始化
    initAnnounceList() {
      // 获取响应通告下发历史
      const request = {
        method: 'post',
        url: '/response/dispatchHistory',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          eventId: (this as any).$store.state.event?.id,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0 && response.data.length > 0) {
          this.announceList = response.data;
          this.announceForm.sendTime = response.data[0].sendTime;
          this.announceForm.sendMan = response.data[0].user.username;
          if (this.announceList.length <= 0) {
            this.hasAnnounce = false;
            return;
          }
        }
      });
      this.hasAnnounce = true;
      // 统计领导班子 成员单位每个组的响应率
      const request1 = {
        method: 'post',
        url: '/response/getEventDispatchResult',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          eventId: (this as any).$store.state.event?.id,
          type: 1,
        },
      };
      (this as any).$http(request1).then((response: any) => {
        if (response.errorcode === 0 && response.data) {
          this.leaderTeamList = response.data;
          // 长度
          this.leaderTeamCountAll = 0;
          if (this.leaderTeamList !== []) {
            this.leaderTeamList.forEach((el:any) => {
              if (el?.children) {
                el.children.forEach((ele:any) => {
                  if (ele) {
                    this.leaderTeamCountAll += Number(ele.contanctor.length);
                    if (ele.contanctor.length) {
                      ele.contanctor.forEach((eleM:any) => {
                        eleM.remark = el.remark;
                        eleM.label = el?.name || '-';
                        eleM.labelName = el?.name || '-';
                      });
                    }
                  }
                });
              }
            });
          }
        }
      });
      // 统计成员单位 成员单位每个组的响应率
      const request2 = {
        method: 'post',
        url: '/response/getEventDispatchResult',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          eventId: (this as any).$store.state.event?.id,
          type: 2,
        },
      };
      (this as any).$http(request2).then((response: any) => {
        if (response.errorcode === 0 && response.data) {
          this.memberUnitList = response.data;
          // 长度
          this.memberUnitCountAll = this.memberUnitList.length;
          this.$nextTick(() => {
            (this as any).$refs.LeaderTeam.chooseArr = [];
            this.chooseUnitMemberArr = [];
            this.unitMemberFresh(response.data.length ? response.data[0] : null);
          });
        }
      });
      // 全部统计 头部（已发送未发送已响应未响应响应率），每个模块响应率，
      const request3 = {
        method: 'post',
        url: '/response/statisticDispatchResult',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          eventId: (this as any).$store.state.event?.id,
          type: 0,
        },
      };
      (this as any).$http(request3).then((response: any) => {
        if (response.errorcode === 0 && response.data) {
          this.announceForm.hasSend = response.data.send;
          this.announceForm.notSend = response.data.unsend;
          this.announceForm.hasRespond = response.data.response;
          this.announceForm.notRespond = response.data.unresponse;
          this.announceForm.countAll = response.data.total;
          this.announceForm.respondRate = response.data.rate;
        }
      });
      // 成员单位整体响应率
      const request4 = {
        method: 'post',
        url: '/response/statisticDispatchResult',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          eventId: (this as any).$store.state.event?.id,
          type: 2,
        },
      };
      (this as any).$http(request4).then((response: any) => {
        if (response.errorcode === 0 && response.data) {
          // 组响应率
          this.memberUnitRespondRate = `${response.data.rate}%`;
        }
      });
    },
    // 刷新单位成员
    unitMemberFresh(item: any) {
      if (this.currUnit) {
        this.$nextTick(() => {
          (this as any).$refs.MemberUnit.handleClick(this.currUnit);
        });
        return;
      }
      this.$nextTick(() => {
        (this as any).$refs.MemberUnit.handleClick(item);
      });
    },
    // 重置
    reset() {
      (this as any).$refs.MsgDetail.content = this.tempModulContent;
    },
    // 树所有东西初始化
    clearAll() {
      this.isDelete = false;
      this.isAddMould = false;
      this.isAddGroup = false;
      this.isEditMould = false;
      this.isEditGroup = false;
      this.modulName = '';
      this.modulContent = '';
      this.currentTreeNode = null;
      this.currentMouldItem = null;
      this.getTreeData();
    },
    // 处理响应通告列表
    handleAnnoMsg() {
      if (this.annoMsgList?.length) {
        this.annoMsgList.forEach((el: any) => {
          el.name = el.contactorName;
          el.workUnit = el.contactorGroupName;
          el.position = el.contactorPosition;
        });
      }
    },
    // 点击领导班子
    handleLeaderTeamClick(item: any) {
      // 领导名字
      this.leaderName = item.labelName;
      // 领导职责详细
      this.content = item.remark;
      // 点击领导不激活右边单位成员
      this.isUnit = false;
      // 当前响应通告
      this.annoMsgList = item?.response;
      this.handleAnnoMsg();
    },
    // 点击单位/组
    handleMemberUnitClick(item: any) {
      // 当前成员单位
      this.currUnit = item;
      // 组名字
      this.leaderName = item.name;
      // 组职责详细
      this.content = item.remark;
      // 点击组激活右边单位成员
      this.isUnit = true;
      // 单位成员对应数据
      this.unitMemberList = item.contanctor;
      this.unitMemberList.forEach((el:any) => {
        el.workUnit = el.groupName;
        el.label = item.name;
        el.labelName = item.name;
      });
      // 单位成员响应率
      this.unitMemberRespondRate = `${item.rate}%`;
      // 单位成员总数
      this.unitMemberCountAll = item.contanctor.length;
      // 当前响应通告
      this.annoMsgList = item.responseResults || [];
      this.handleAnnoMsg();
    },
    // 一键发送
    oneClickSend() {
      // 所有发送的人
      let arr = [...(this as any).$refs.LeaderTeam.chooseArr, ...this.chooseUnitMemberArr];
      // 去重
      arr = Array.from(new Set(arr));
      // 发送内容赋值
      arr.forEach((el:any) => {
        el.smsContent = (this as any).$refs.MsgDetail.content;
      });
      // 发送数量
      if (arr.length === 0) {
        (this as any).$message.error('请先勾选联系人！');
        return;
      }
      const request = {
        method: 'post',
        url: '/response/dispatch',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          eventId: (this as any).$store.state.event?.id,
          data: arr,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0) {
          const options = {
            type: 'success',
            title: '提示',
            message: '  ',
            tips: `通告发送成功！发送总数${arr.length}人`,
            remark: false,
            placeholder: '',
          };
          this.openMessageBox(options);
          (this as any).$store.commit('reservePlan/setLeftRefresh', true);
          this.isFirstSend = false; // 重发
          this.initAnnounceList(); // 初始化响应列表
        }
      });
    },
    // 弹窗
    openMessageBox(options: any) {
      return (this.$refs.MessageBox as any).init(options);
    },
    // 短信历史弹窗
    handleHeaderClick() {
      if (this.$refs.SendRecordBoat) {
        (this as any).$refs.SendRecordBoat.open();
      } else {
        setTimeout(() => this.handleHeaderClick(), 500);
      }
    },
    // 勾选
    handleUnitMemberCheck(el: any) {
      if (this.chooseUnitMemberArr.filter((item:any) => item.id === el.id).length === 0) {
        (this as any).chooseUnitMemberArr.push(el);
      } else { // 移除
        this.chooseUnitMemberArr = this.chooseUnitMemberArr.filter((item:any) => item.id !== el.id);
      }
      this.chooseUnitMemberAll = (this.chooseUnitMemberArr.length === this.unitMemberCountAll);
    },
    // 全选
    handleUnitMemberCheckAll() {
      // 全选 更新arr
      if (this.chooseUnitMemberAll) {
        this.chooseUnitMemberArr = []; // 预防一边勾选一边全选
        this.unitMemberList.forEach((el:any) => {
          if (el?.children) {
            el.children.forEach((ele:any) => {
              if (ele) {
                ele.contanctor.forEach((eleM:any) => {
                  if (eleM) {
                    (this as any).chooseUnitMemberArr.push(eleM);
                  }
                });
              }
            });
          }
        });
      } else { // 取消全选
        this.chooseUnitMemberArr = [];
      }
      // 列表的勾选框同步变形
      this.unitMemberList.forEach((el:any) => {
        if (el?.children) {
          el.children.forEach((ele:any) => {
            if (ele) {
              ele.contanctor.forEach((eleM:any) => {
                if (eleM) {
                  eleM.isChecked = this.chooseUnitMemberAll;
                }
              });
            }
          });
        }
      });
    },
    // 补发
    reSend(item:any): void {
      const request = {
        method: 'post',
        url: '/response/dispatch',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          eventId: (this as any).$store.state.event?.id,
          data: [item],
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0) {
          (this as any).$message.info('发送成功');
          this.$nextTick(() => {
            this.unitMemberFresh(response.data.length ? response.data[0] : null);
          });
        }
      });
    },
    // 动态选择响应状态字体颜色
    getRespondStatus(respondStatus: any) {
      let tempColor;
      switch (respondStatus) {
        case '已响应':
          tempColor = 'rgba(11, 210, 149, 1)';
          break;
        case '未响应':
          tempColor = 'rgba(246, 110, 110, 1)';
          break;
        case '未发送':
          tempColor = '#FFFFFF';
          break;
        default:
          break;
      }
      return tempColor;
    },
    // 一键发给未响应人
    sendToUnsend() {
      const request = {
        method: 'post',
        url: '/response/remind',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          eventId: (this as any).$store.state.event?.id,
        },
      };
      (this as any).$http(request).then((response:any) => {
        if (response) {
          (this as any).$message.info('发送给所有未响应人成功！');
        }
      });
    },
    // 模板选择框
    openMsg() {
      if (this.$refs.MsgDialogBoat) {
        (this as any).$refs.MsgDialogBoat.open();
      } else {
        setTimeout(() => this.openMsg(), 500);
      }
      this.isDelete = false;
      this.isAddMould = false;
      this.isAddGroup = false;
      this.isEditMould = false;
      this.isEditGroup = false;
      this.getTreeData();
    },
    // 获取短信分组树
    getTreeData() {
      const request = {
        method: 'post',
        url: '/smsTemplateType/tree',
        service: 'eoc',
      };
      (this as any).$http(request).then((response:any) => {
        if (response.errorcode === 0) {
          this.treeData = response.data;
          this.mouldList = []; // 清空
        }
      });
    },
    // 模板树-点击组-新增
    addTreeGroup(node:any) {
      this.isDelete = false;
      this.isAddMould = false;
      this.isAddGroup = true; // 新增
      this.isEditMould = false;
      this.isEditGroup = false;
      this.modulName = '';
      this.modulContent = '';
    },
    // 模板树-点击组-编辑
    editTreeGroup(node:any) {
      this.modulName = node.name;
      this.isEditGroup = true; // 修改
      this.isDelete = false;
      this.isAddMould = false;
      this.isAddGroup = false;
      this.isEditMould = false;
    },
    // 模板树-点击组
    handleNodeClick(node:any) {
      return new Promise((resolve,reject) => {
        this.currentTreeNode = node;
        console.log('树状分组点击回调', this.currentTreeNode);
        // 模板列表
        const request = {
          method: 'post',
          url: '/smsTemplate/getList',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            page: 1, // 页码
            size: 100, // 每页数量
            id: node.id, // 分组id，不传或0则查全部
            includeLowerLevel: 1, // 是否包含下级节点，1 是，其他否
          },
        };
        (this as any).$http(request).then((response:any) => {
          if (response.errorcode === 0) {
            this.mouldList = response.data.data;
            resolve(node);
          }
        });
      });
    },
    // 模板树-勾选组
    handleNodeCheck(node:any) {
      console.log(node);
      node.forEach((el:any) => {
        (this as any).checkNode.push(el);
      });
      console.log(this.checkNode);
    },
    // 模板树-取消勾选组
    handleNodeUncheck(node:any) {
      console.log(node);
      this.checkNode = this.checkNode.filter((item:any) => (item.id !== node[0].id));
      console.log(this.checkNode);
    },
    // 选取模板
    clickModul() {
      this.tempModulContent = this.modulContent;
      (this as any).$refs.MsgDetail.content = this.modulContent;
      (this as any).$refs.MsgDialogBoat.close();
    },
    // 模板树-批量删除组
    deleteGroup() {
      const arrays1: any = [];
      this.checkNode.forEach((data:any) => { arrays1.push(data.id); });
      const request = {
        method: 'POST',
        url: '/smsTemplateType/delete',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          ids: arrays1,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0) {
          (this as any).$message.info('删除成功！');
          this.clearAll();
        } else {
          (this as any).$message.error(response.msg);
        }
      });
    },
    // 模板树-单个删除组
    deleteTreeGroup(node:any) {
      this.handleNodeClick(node).then(() => {
        const request = {
          method: 'POST',
          url: '/smsTemplateType/delete',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            ids: [(this as any).currentTreeNode?.id],
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            (this as any).$message.info('删除分组成功');
            this.clearAll();
          } else {
            (this as any).$message.error(response.msg);
          }
        });
      });
    },
    // 模板列-单个删除模板
    deleteOne(item:any) {
      const request = {
        method: 'POST',
        url: '/smsTemplate/delete',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          ids: [item.id],
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0) {
          (this as any).$message.info('删除模板成功！');
          this.clearAll();
        }
      });
    },
    // 编辑模板
    editOne(item:any) {
      this.isDelete = false;
      this.isAddMould = false;
      this.isAddGroup = false;
      this.isEditMould = true;
      this.isEditGroup = false;
      this.handleMouldClick(item);
    },
    // 点击模板
    handleMouldClick(item:any) {
      this.currentMouldItem = item;
      this.modulName = item.templateId;
      this.modulContent = item.templateContent;
    },
    // 组和模板的保存
    submit(type:any) {
      // 编辑模板
      if (type === 'isEditMould') {
        const request = {
          method: 'POST',
          url: '/smsTemplate/update',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            data: {
              templateId: this.modulName,
              templateContent: this.modulContent,
              typeIds: [(this as any).currentTreeNode?.id || 0],
              id: (this as any).currentMouldItem?.id,
            },
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            (this as any).$message.info('编辑模板成功！');
            this.clearAll();
          } else {
            this.$message.error(`${response.msg}`);
          }
        });
      } else if (type === 'isAddMould') { // 新增模板
        const request = {
          method: 'POST',
          url: '/smsTemplate/add',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            data: {
              templateId: this.modulName,
              templateContent: this.modulContent,
              typeIds: [(this as any).currentTreeNode?.id || 0],
            },
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            (this as any).$message.info('新增模板成功！');
            this.clearAll();
          } else {
            this.$message.error(`${response.msg}`);
          }
        });
      } else if (type === 'isAddGroup') { // 新增分组
        const request = {
          method: 'POST',
          url: '/smsTemplateType/add',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            data: {
              name: this.modulName, // 分组名称
              pid: (this as any).currentTreeNode?.id || 0, // 父id
            },
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            (this as any).$message.info('新增分组成功！');
            this.clearAll();
          } else {
            this.$message.error(`${response.msg}`);
          }
        });
      } else if (type === 'isEditGroup') { // 编辑分组
        const request = {
          method: 'POST',
          url: '/smsTemplateType/update',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            data: {
              name: this.modulName, // 分组名称
              pid: (this as any).currentTreeNode?.pid || 0, // 父id
              id: (this as any).currentTreeNode?.id, // 自己id
            },
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            (this as any).$message.info('编辑分组成功！');
            this.clearAll();
          } else {
            this.$message.error(`${response.msg}`);
          }
        });
      }
    },
  },
});
</script>

<style lang="scss" module>
  .mould {
    position: relative;
    width: 1160px;
    height: 85vh;
    .mouldLeft {
      width: 360px;
      height: 75vh;
      background: rgba(0, 0, 0, 0.29);
      border: 1px solid rgba(0, 193, 222, 0.58);
      color: #fff;
      position: absolute;
      left: 20px;
      top: 18px;
      .mouldLeftStyle {
        width: 100%;
        height: 52px;
        background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
        color: #FFFFFF;
        .mouldLeftIcon {
          background: url(./assets/mouldGroup.svg) no-repeat;
          background-size: 89%;
          width: 21px;
          height: 20px;
          position: absolute;
          left: 14px;
          top: 17px;
        }
        .mouldLeftText {
          position: absolute;
          left: 37px;
          top: 15px;
          font-size: 16px;
        }
      }
      .mouldLeftScroll {
        height: 70vh;
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
    .mouldMiddle {
      width: 360px;
      height: 75vh;
      background: rgba(0, 0, 0, 0.29);
      border: 1px solid rgba(0, 193, 222, 0.58);
      color: #fff;
      position: absolute;
      left: 400px;
      top: 18px;
      .mouldMiddleStyle {
        width: 100%;
        height: 52px;
        background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
        color: #FFFFFF;
        .mouldMiddleIcon {
          background: url(./assets/msgMould.svg) no-repeat;
          background-size: 89%;
          width: 21px;
          height: 20px;
          position: absolute;
          left: 14px;
          top: 17px;
        }
        .mouldMiddleText {
          position: absolute;
          left: 37px;
          top: 15px;
          font-size: 16px;
        }
      }
      .mouldMiddleScroll {
        height: 70vh;
        overflow: auto;
        .mouldMiddleList {
          cursor: pointer;
          color: #FFFFFF;
          width: 341px;
          height: 38px;
          background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0) 100%);
          margin: 10px 0px 10px 10px;
          position: relative;
          opacity: 0.7;
          .mouldMiddleName {
            position: absolute;
            left: 10px;
            top: 9px;
          }
          .mouldDelete {
            background: url(./assets/delete.svg) no-repeat;
            background-size: 100%;
            width: 16px;
            height: 16px;
            position: absolute;
            right: 14px;
            top: 12px;
            cursor: pointer;
          }
          .mouldEdit {
            background: url(./assets/edit.svg) no-repeat;
            background-size: 100%;
            width: 16px;
            height: 16px;
            position: absolute;
            right: 44px;
            top: 12px;
            cursor: pointer;
          }
        }
        .mouldMiddleList:hover {
          opacity: 1;
        }
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
    .mouldRight {
      width: 360px;
      height: 75vh;
      background: rgba(0, 0, 0, 0.29);
      border: 1px solid rgba(0, 193, 222, 0.58);
      color: #fff;
      position: absolute;
      right: 20px;
      top: 18px;
      .mouldRightStyle {
        width: 100%;
        height: 52px;
        background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
        color: #FFFFFF;
        .mouldRightIcon {
          background: url(./assets/message.svg) no-repeat;
          background-size: 100%;
          width: 21px;
          height: 20px;
          position: absolute;
          left: 14px;
          top: 17px;
        }
        .mouldRightText {
          position: absolute;
          left: 37px;
          top: 15px;
          font-size: 16px;
        }
      }
      .mouldRightScroll {
        height: 70vh;
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
  }
  .msgPreview {
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    width: 1160px;
    height: 888px;
    z-index: 20;
    .msgPreviewFrame {
      width: 432px;
      height: 577px;
      position:absolute;
      left: 360px;
      top:118px;
      .msgPreviewClose {
        background: url(../PublicComponents/assets/close.svg) no-repeat;
        width: 40px;
        height: 40px;
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 14;
        background-size: 35%;
        cursor: pointer;
      }
      .msgPreviewTextScroll {
        position: absolute;
        z-index: 13;
        left: 121px;
        top: 55px;
        width: 219px;
        height: 488px;
        overflow: auto;
        .msgPreviewText {
          color: #000000;
        }
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
      .msgPreviewPic {
        background: url(./assets/msgPreview.png) no-repeat;
        width: 320px;
        height: 600px;
        position: absolute;
        left: 77px;
        top: 0px;
        z-index: 12;
      }
      .msgPreviewBack{
        width: 480px;
        height: 480px;
        border-radius: 100%;
        background: linear-gradient(180deg, #00C1DE 0%, #B0E9FB 100%);
        position: absolute;
        left: 0px;
        top: 53px;
        z-index: 11;
      }
    }
  }
  .headerIcon {
    background: url(../PublicComponents/assets/left.svg) no-repeat;
    background-size: 100%;
    width: 10px;
    height: 17px;
    position: absolute;
    left: 8px;
    top: -33px;
    cursor: pointer;
  }
  .headerStyle {
    color: #FFFFFF;
    background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
    width: 100%;
    height: 60px;
    position: relative;
    margin-bottom: 10px;
    .headerOne {
      position: absolute;
      left: 20px;
      top: 9px;
    }
    .headerTwo {
      position: absolute;
      left: 34px;
      bottom: 9px;
    }
    .headerThree {
      position: absolute;
      left: 410px;
      top: 9px;
    }
    .headerFour {
      position: absolute;
      left: 410px;
      bottom: 9px;
    }
    .headerFive {
      position: absolute;
      left: 544px;
      top: 9px;
    }
    .headerSix {
      position: absolute;
      left: 544px;
      bottom: 9px;
    }
    .countAllNum {
      position: absolute;
      left: 327px;
      top: 8px;
      color: #56E9FF;
      font-size: 20px;
    }
    .countAllText {
      position: absolute;
      left: 327px;
      bottom: 10px;
    }
    .respondRateNum {
      position: absolute;
      left: 678px;
      top: 8px;
      color: #56E9FF;
      font-size: 20px;
    }
    .respondRateText {
      position: absolute;
      left: 678px;
      bottom: 7px;
    }
  }
  .announceLeft {
    width: 420px;
    height: 68vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: relative;
    margin-left: 10px;
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
  .announceMiddle {
    width: 420px;
    height: 68vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: relative;
    margin-left: 10px;
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
  .announceRight {
    width: 260px;
    height: 68vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.58);
    color: #fff;
    position: relative;
    margin-right: 20px;
    float: right;
  }
  .horizonLine {
    width: 100%;
    height: 1px;
    background: #FFFFFF;
    opacity: 0.15;
    position: absolute;
    bottom: 62px;
  }
  .noAnnounceDiv {
    color:#FFFFFF;
    position: absolute;
    bottom: 474px;
    right: 541px;
    font-size: 19px;
  }
  .noAnnounceButton {
    width: 198px;
    height: 68px;
    background:#00C1DE;
    color:#FFFFFF;
    position: absolute;
    bottom: 400px;
    right: 500px;
    font-size: 20px;
    border: none;
    cursor: pointer;
  }
  .line {
    width: 400px;
    height: 1px;
    position: relative;
    float: left;
    background: linear-gradient(to right, rgba(86, 233, 255, 0.7), rgba(86, 233, 255, 0.8), rgba(86, 233, 255, 0.1));
    filter: blur(0.8px);
  }
  .hasRespondIcon {
    background: url(./assets/greenSign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 81%;
    float: right;
  }
  .notRespondIcon {
    background: url(../PublicComponents/assets/redSign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 81%;
    float: right;
  }
  .notSendIcon {
    background: url(./assets/graySign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 81%;
    float: right;
  }
</style>
