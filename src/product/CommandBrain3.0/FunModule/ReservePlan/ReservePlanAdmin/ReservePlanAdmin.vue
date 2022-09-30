<template>
  <div style="width: 874px; height: 85vh;position:relative;">
    <!-- 详情 -->
    <ReservePlanInfo
      v-if="isInfo"
      @goBack="goBack"
    />
    <div v-else>
      <header :class="$style.headerStyle">
        <!-- 标题 -->
        <div :class="$style.headerText">
          {{ title }}
        </div>
        <!-- 箭头 -->
        <img
          v-if="status === '未启动' || isChange"
          style="position: absolute; right: 15px; top: 22px;cursor: pointer;"
          :class="isHeaderClick ? $style.headerRight : $style.headerRightReset"
          src="../PublicComponents/assets/down.svg"
          alt=""
          @click="isHeaderClick = !isHeaderClick"
        >
        <!-- 启动状态 -->
        <div
          :class="{
            [$style.start]: status!=='未启动'&&status!=='已结束',
            [$style.unstart]: status === '未启动',
            [$style.end]: status === '已结束',
          }"
        >
          <!-- 图标 -->
          <div
            :class="{
              [$style.startIcon]: status!=='未启动'&&status!=='已结束',
              [$style.unstartIcon]: status === '未启动',
              [$style.endIcon]: status === '已结束',
            }"
          />
          <!-- 文字 -->
          <div
            :class="{
              [$style.startText]: status!=='未启动'&&status!=='已结束',
              [$style.unstartText]: status === '未启动',
              [$style.endText]: status === '已结束',
            }"
          >
            {{ status }}
          </div>
          <!-- 三角 -->
          <img
            v-if="status !== '未启动'"
            style="width: 20px;
              height: 20px;
              cursor: pointer;
              position: absolute;
              left: 45px;
              top: 29px;"
            :class="isRectangeClick ? $style.headerRight : $style.headerRightReset"
            src="./assets/triangle.svg"
            alt=""
            @click="isRectangeClick = !isRectangeClick"
          >
        </div>
        <!-- 头部打开的列表 -->
        <div
          v-if="isHeaderClick"
          :class="$style.announceListStyle"
        >
          <div
            v-for="item in announceList"
            :key="item.id"
            :class="$style.listStyle"
            @click="handleHeadClick(item)"
          >
            <!-- 名字 -->
            <div :class="$style.listOne">
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- 三角打开的列表 -->
        <div
          v-if="isRectangeClick"
          :class="$style.historyListStyle"
        >
          <div
            v-for="item in historyList"
            :key="item.id"
            :class="$style.listStyle"
          >
            <!-- 对预案进行操作（启动，重启，结束）的时间 -->
            <div :class="$style.listOne">
              {{ item.oprTime }}
            </div>
            <!-- 样式竖线1 -->
            <div :class="$style.verticalLineOne" />
            <!-- 对预案进行过操作（启动，重启，结束）的负责人名字 -->
            <div :class="$style.listTwo">
              操作员：{{ item.operatorName }}
            </div>
            <!-- 样式竖线2 -->
            <div :class="$style.verticalLineTwo" />
            <div
              :class="{
                [$style.listStart]: item.subType,
                [$style.listRestart]: item.subType === '重启预案',
                [$style.listEnd]: item.subType === '结束预案',
                [$style.listChange]: item.subType === '变更预案',
              }"
            >
              {{ item.subType }}
            </div>
            <!-- 调整记录 -->
            <div :class="$style.listThree">
              {{ item.content }}
            </div>
            <!-- 备注 -->
            <div :class="$style.listFour">
              备注：{{ item.remark }}
            </div>
          </div>
        </div>
      </header>

      <main
        v-if="reservePlan.currentId !== 0"
        :class="$style.adminStyle"
        :style="status === '未启动'?'height: 66vh;':''"
      >
        <ReservePlanVersion
          :plan="reservePlan"
          @handleInfo="isInfo=true"
        />
        <SpecialHorizonList
          ref="SpecialHorizonListRef"
          :useHeaderIcon="false"
          :title="'事件等级'"
          :list="eventLevelList"
          :listBackColor="'#000'"
          :listBackBorder="'1px solid #00C1DE'"
          @handleClick="changeEventLevel"
        />
        <SpecialVerticalList
          ref="SpecialVerticalListRef"
          :title="'响应等级'"
          :list="levelButtonList"
          @handleClick="changeLevel"
        />
      </main>

      <footer v-if="reservePlan.currentId !== 0">
        <!-- 水平线 -->
        <div
          v-if="status === '未启动'"
          style="width: 100%;
          height: 1px;
          background: #FFFFFF;
          opacity: 0.15;
          position: absolute;
          bottom: 120px;"
        />
        <label
          v-if="
            historyList.filter(
              el =>
                el.subType === '启动预案' || el.subType === '重启预案' || el.subType === '发布任务',
            ).length === 0
          "
          :class="$style.sendSelect"
        >
          <input v-model="onlySend" type="checkbox" />
          <span></span>
        </label>
        <div
          v-if="
            historyList.filter(
              el =>
                el.subType === '启动预案' || el.subType === '重启预案' || el.subType === '发布任务',
            ).length === 0
          "
          style="position: absolute; bottom: 7px; left: 32px;color: #A6ADB4;"
        >
          以短信形式发送预案响应通告
        </div>
        <!-- 未启动 -->
        <div
          v-if="status === '未启动'"
          :class="$style.startButton"
        >
          <StartButton @click="startPlan" />
        </div>
        <div v-else>
          <!-- 水平线 -->
          <div
            style="width: 100%;
            height: 1px;
            background: #FFFFFF;
            opacity: 0.15;
            position: absolute;
            bottom: 54px;"
          />
          <Button
            type="ghost"
            style="position: absolute; bottom: 6px; right: 104px;margin: 6px"
            @click="isChange = true"
          >
            调整
          </Button>
          <Button
            v-if="(status === '已启动' || status === '已发布') && !isChange"
            type="danger"
            style="position: absolute; bottom: 6px; right: 4px;margin: 6px"
            @click="endPlan"
          >
            结束响应
          </Button>
          <Button
            v-if="status === '已结束' && !isChange"
            type="primary"
            style="position: absolute; bottom: 6px; right: 4px;margin: 6px"
            @click="restartPlan"
          >
            重启响应
          </Button>
          <Button
            v-if="isChange"
            type="primary"
            style="position: absolute; bottom: 6px; right: 4px;margin: 6px"
            @click="savePlan"
          >
            保存调整
          </Button>
        </div>
      </footer>
    </div>
  </div>
  <!-- 弹窗 -->
  <MessageBox ref="MessageBox" />
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import MessageBox from '@/product/CommandBrain3.0/Generalparts/dialog/MessageBox/MessageBox.vue'; // 消息确认弹窗
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import SpecialHorizonList from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/SpecialHorizonList.vue'; // 横向列表
import SpecialVerticalList from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/SpecialVerticalList.vue'; // 竖向列表
import ReservePlanInfo from '../ReservePlanInfo/ReservePlanInfo.vue'; // 预案详情
import ReservePlanVersion from './components/ReservePlanVersion.vue'; // 预案版本
import StartButton from './components/StartButton/StartButton.vue'; // 启动预案按钮
import * as ReservePlan from './ReservePlan'; // 初始化函数

export default defineComponent({
  name: 'ReservePlanAdmin',
  components: {
    // 横向列表
    SpecialHorizonList,
    // 竖向列表
    SpecialVerticalList,
    // 预案版本
    ReservePlanVersion,
    // 按钮
    Button,
    // 消息确认弹窗
    MessageBox,
    // 详情按钮
    ContactMoreButton,
    // 预案详情
    ReservePlanInfo,
    // 启动预案按钮
    StartButton,
  },
  provide() {
    return {
      $MessageBox: this.openMessageBox,
    };
  },
  setup() {
    const instance: any = getCurrentInstance();
    const $store = useStore();
    watch(
      () => $store.state.event?.id,
      (val) => {
        instance.proxy.initAdmin(val);
      },
    );
  },
  data() {
    return {
      title: '', // 当前预案标题
      status: '未启动', // 当前预案状态
      isHeaderClick: false, // 是否点了标题或它旁边小箭头
      isChange: false, // 是否更改
      isRectangeClick: false, // 是否点了左边小三角
      isInfo: false, // 是管理还是详情
      announceList: [], // 头部列表
      historyList: [], // 历史列表
      reservePlan: {
        // 当前预案信息
        currentId: 0, // 当前预案id
        name: '',
        type: '', // 事件类型名字
        typeId: 0, // 事件类型id
        version: '', // 版本名字
        versionId: 0, // 版本id
        unit: '',
        publishDate: '',
        area: '',
        remark: '',
        code: '',
        publishUnit: '',
        editTime: '',
        warn: 0, // 预警信号id，名字不需要
        level: 0, // 响应等级id，名字不需要
        eventLevelID: 0, // 事件等级id
        eventLevelName: '', // 事件等级名字
        builder: '', // 编制单位
      },
      warnButtonList: [], // 预警按钮列表
      levelButtonList: [], // 响应等级按钮列表
      eventLevelList: [], // 事件等级按钮列表
      onlySend: true, // 以短信形式发送预案响应通告
    };
  },
  mounted() {
    this.initAdmin((this as any).$store.state.event?.id); // 初始化列表
  },
  methods: {
    clear(): void {
      // 清空所有
      this.title = ''; // 清空标题
      this.status = '未启动'; // 清空状态
      (this as any).$store.commit('reservePlan/setStatus', this.status);
      this.announceList = []; // 头部列表
      this.historyList = []; // 历史列表
      this.reservePlan.currentId = 0; // 当前预案id
      this.reservePlan.name = ''; // 预案名字
      this.reservePlan.typeId = 0; // 事件类型id
      this.reservePlan.type = ''; // 类型名字
      this.reservePlan.version = ''; // 版本名字
      this.reservePlan.versionId = 0; // 版本id
      this.reservePlan.unit = '';
      this.reservePlan.publishDate = '';
      this.reservePlan.area = '';
      this.reservePlan.remark = '';
      this.reservePlan.code = '';
      this.reservePlan.publishUnit = '';
      this.reservePlan.editTime = '';
      // this.reservePlan.warn = 0;
      this.reservePlan.level = 0;
      this.reservePlan.eventLevelID = 0;
      this.reservePlan.eventLevelName = '';
      this.reservePlan.builder = ''; // 编制单位
      this.warnButtonList = []; // 清空预警按钮列表
      this.levelButtonList = []; // 清空响应等级按钮列表
      this.eventLevelList = []; // 清空事件等级按钮列表
      this.updateReservePlan(this.reservePlan); // 给版本
    },
    // 初始化列表
    initAdmin(id: any): void {
      this.clear();
      if (!id) return;
      // 用事件类型获得预案
      ReservePlan.getLatestEventDeal(id).then((res: any) => {
        if (res.data.caseClassId) {
          this.reservePlan.type = res.data.typeName; // 类型-自然灾害等
          this.reservePlan.typeId = res.data.caseClassId; // 类型id-43等
          ReservePlan.getPreplanByCaseId(res.data.caseClassId).then((res1: any) => {
            if (res1.errorcode === 0) {
              this.announceList = res1.data; // 获取caseClassId这个类型的所有预案
              ReservePlan.getDefault(id, this.reservePlan.typeId).then((res2: any) => {
                // 该类型有默认预案
                if (res2.errorcode === 0 && res2.data?.preplans) {
                  // this.reservePlan.warn = res2.data.signalId; // 默认信号id
                  this.reservePlan.level = res2.data.levelId; // 默认等级id
                  this.reservePlan.eventLevelID = res2.data?.level?.id; // 默认事件等级id，旧预案没有这个字段
                  // 高亮起按钮
                  this.handleHeadClick({
                    id: res2.data.preplans.id,
                  });
                } else if (this.announceList.length) {
                  // 没有默认就点击第一个
                  // this.reservePlan.warn = 0; // 默认信号id
                  this.reservePlan.level = 0; // 默认等级id
                  this.reservePlan.eventLevelID = 0; // 默认事件等级id
                  this.handleHeadClick(this.announceList[0]);
                }
              });
            }
          });
        }
      });
      ReservePlan.eventPreplanHistory(id).then((response: any) => {
        if (response.errorcode === 0) {
          this.historyList = response.data; // 预案历史操作列表
          if (response.data.length) this.status = response.data[0].status;
          else this.status = '未启动';
          (this as any).$store.commit('reservePlan/setStatus', this.status);
        }
      });
      ReservePlan.getManager(id, (this as any).$store);
    },
    // 事件等级列表，由于不受预案影响，只在获得等级id后调用就行
    getEventLevelList() {
      ReservePlan.getEventLevel().then((response3: any) => {
        if (response3.errorcode === 0) {
          this.eventLevelList = response3.data.parameter; // 事件等级按钮
          this.eventLevelList.forEach((ele: any) => {
            // 点亮对应事件等级
            if (ele.id === this.reservePlan.eventLevelID) {
              // this.$nextTick(() => {
                (this as any).$refs.SpecialHorizonListRef.handleClick(ele);
              // });
            }
          });
        }
      });
    },
    // 点预案列表。切换当前预案
    handleHeadClick(item: any): void {
      ReservePlan.getPreplanInfo(item.id).then((response: any)=>{
        if (response.errorcode === 0) {
          this.reservePlan.currentId = response.data.preplanId; // 预案id
          this.reservePlan.version = response.data.version; // 版本
          this.reservePlan.versionId = response.data.versionId; // 版本id
          this.title = response.data.name;
          this.reservePlan.name = response.data.name;
          this.reservePlan.builder = response.data.builder;
          this.reservePlan.unit = response.data.name;
          this.reservePlan.publishDate = response.data.publishDate;
          this.reservePlan.area = response.data.area;
          this.reservePlan.remark = response.data.remark;
          this.reservePlan.code = response.data.code;
          this.reservePlan.publishUnit = response.data.publishUnit;
          this.reservePlan.editTime = response.data.publishDate;
          this.isHeaderClick = false; // 关窗
          this.updateReservePlan(this.reservePlan); // 给版本
          // 在预案里拿到版本id，去要信号和流程和事件等级
          // ReservePlan.getWarnSign(this.reservePlan.versionId).then((response1: any) => {
          //   if (response1.errorcode === 0) {
          //     this.warnButtonList = response1.data; // 信号按钮
          //     this.warnButtonList.forEach((ele: any) => {
          //       // 点亮对应信号
          //       if (ele.id === this.reservePlan.warn) {
          //         this.$nextTick(() => {
          //           (this as any).$refs.SpecialHorizonListRef.handleClick(ele);
          //         });
          //       }
          //     });
          //   }
          // });
          ReservePlan.getRespondFlow(this.reservePlan.versionId).then((response2: any) => {
            if (response2.errorcode === 0) {
              this.levelButtonList = response2.data; // 等级按钮
              this.levelButtonList.forEach((ele: any) => {
                // 每个的内容赋值
                const detailRequest = {
                  method: 'POST',
                  url: '/emergency/preparation/preplan/getLevelInfo',
                  service: 'eoc',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  data: {
                    id: ele.id,
                  },
                };
                (this as any).$http(detailRequest).then((res: any) => {
                  if (res.errorcode === 0) {
                    ele.content = res.data.remark;
                  }
                });
                // 点亮对应等级
                if (ele.id === this.reservePlan.level) {
                  this.$nextTick(() => {
                    (this as any).$refs.SpecialVerticalListRef.handleClick(ele);
                  });
                }
              });
            }
          });
          this.getEventLevelList();
        }
      });
    },
    // 更新当前预案
    updateReservePlan(item: any): void {
      (this as any).$store.commit('reservePlan/setCurrentReservePlan', item);
      // 文档路径，使得文档只需要更换路径，窗内对pdf的处理可复用
      (this as any).$store.commit(
        'reservePlan/setDocument',
        `${(window as any).config.baseURL}/event/emergency/preparation/preplan/view?versionId=${
          item.versionId
        }`,
      );
      console.log('当前预案', item);
    },
    openMessageBox(options: any) {
      return (this.$refs.MessageBox as any).init(options);
    },
    // 启动预案
    startPlan(): void {
      if (this.isValid()) {
        const request = {
          method: 'POST',
          url: '/event/preplan/StartThePlan',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            eventId: (this as any).$store.state.event?.id, // 事件id
            levelId: this.reservePlan.level, // 响应等级id
            preplanId: this.reservePlan.currentId, // 预案id
            // signalId: this.reservePlan.warn, // 预警信号id
            responseLevelId: this.reservePlan.eventLevelID, // 事件等级id
            sendMessage: this.onlySend ? '1' : '0', // 以短信形式发送预案响应通告
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            this.status = '已启动';
            (this as any).$message.info('启动成功！');
            this.influenceLeft(this.reservePlan.eventLevelName);
          } else {
            (this as any).$message.error('启动失败！');
          }
        });
      }
    },
    // 重启响应
    restartPlan(): void {
      if (this.isValid()) {
        const options = {
          type: 'prompt',
          title: '提示',
          message: '是否重启预案响应？',
          tips:
            '重启预案响应后，预案任务未完成的预案任务重新启动，并通过短信及APP信息通知相关预案成员',
          remark: true,
          placeholder: '写点什么呢？',
        };
        this.openMessageBox(options).then((val: any) => {
          const request = {
            method: 'POST',
            url: '/event/preplan/restartPreplan',
            service: 'eoc',
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              eventId: (this as any).$store.state.event?.id,
              content: val,
            },
          };
          (this as any).$http(request).then((response: any) => {
            if (response.errorcode === 0) {
              this.status = '已启动';
              (this as any).$message.info('重启成功！');
              this.influenceLeft(this.reservePlan.eventLevelName);
            }
          });
        });
      }
    },
    // 结束响应
    endPlan(): void {
      const options = {
        type: 'delete',
        title: '提示',
        message: '是否结束预案？',
        tips: '结束预案后，预案任务将自动完成，并通过短信及APP信息通知相关预案成员。',
        remark: true,
        placeholder: '写点什么呢？',
      };
      this.openMessageBox(options).then((val: any) => {
        const request = {
          method: 'POST',
          url: '/event/preplan/endPreplan',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            eventId: (this as any).$store.state.event?.id,
            content: val,
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            this.status = '已结束';
            (this as any).$message.info('结束成功！');
            this.influenceLeft(this.reservePlan.eventLevelName);
          }
        });
      });
    },
    // 改预警信号，更新当前值
    changeWarn(item: any): void {
      this.reservePlan.warn = item.id;
    },
    // 改响应等级，更新当前值
    changeLevel(item: any): void {
      this.reservePlan.level = item.id;
    },
    // 改事件等级，更新当前值
    changeEventLevel(item: any): void {
      this.reservePlan.eventLevelID = item.id;
      this.reservePlan.eventLevelName = item.name;
    },
    // 保存调整
    savePlan(): void {
      if (this.isValid()) {
        const options = {
          type: 'prompt',
          title: '提示',
          message: '是否保存预案调整内容？',
          tips: '调整预案响应后，实时同步预案任务，并通过短信及APP信息通知相关预案成员。',
          remark: true,
          placeholder: '写点什么呢？',
        };
        this.openMessageBox(options).then((val: any) => {
          // 保存
          const request = {
            method: 'POST',
            url: '/event/preplan/changeLevel',
            service: 'eoc',
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              eventId: (this as any).$store.state.event?.id,
              levelId: this.reservePlan.level, // 响应等级id
              preplanId: this.reservePlan.currentId, // 预案id
              // signalId: this.reservePlan.warn, // 预警信号id
              responseLevelId: this.reservePlan.eventLevelID, // 事件等级id
            },
          };
          (this as any).$http(request).then((response: any) => {
            if (response.errorcode === 0) {
              (this as any).$message.info('保存成功！');
              this.influenceLeft(this.reservePlan.eventLevelName);
            } else {
              // 没有error
              (this as any).$message.error(response.msg);
            }
          });
        });
      }
    },
    // 返回预案管理
    goBack() {
      this.isInfo = false;
      this.initAdmin((this as any).$store.state.event?.id);
    },
    isValid() {
      // if ((this as any).reservePlan.warn === 0) {
      //   (this as any).$message.error('请先选择预警信号！');
      //   return false;
      // }
      if ((this as any).reservePlan.level === 0) {
        (this as any).$message.error('请先选择响应等级！');
        return false;
      }
      if ((this as any).reservePlan.eventLevelID === 0) {
        (this as any).$message.error('请先选择事件等级！');
        return false;
      }
      return true;
    },
    influenceLeft(name: string) {
      // 左边的'未设置等级'马上变成当前选的事件等级的名字
      let temp = (this as any).$store.state.event;
      temp.responseLevel = name;
      (this as any).$store.commit('changeEvent', temp);
      (this as any).$store.commit('reservePlan/setStatus', this.status); // 刷新状态
      ReservePlan.eventPreplanHistory((this as any).$store.state.event?.id); // 刷新历史
      (this as any).$store.commit('reservePlan/setLeftRefresh', true); // 刷新左边
      // 退出更改状态
      this.isChange = false;
    },
  },
});
</script>

<style lang="scss" module>
@mixin allLine {
  width: 1px;
  height: 20px;
  position: relative;
  margin-top: 8px;
  background: linear-gradient(
    to bottom,
    rgba(86, 233, 255, 0),
    rgba(255, 255, 255, 1),
    rgba(86, 233, 255, 0)
  );
}
.headerStyle {
  width: 100%;
  height: 52px;
  background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
  color: #ffffff;
  position: relative;
  .headerText {
    position: relative;
    font-size: 18px;
    text-align: center;
    line-height: 51px;
  }
  .headerRight {
    transform: rotate(180deg);
    transition: all 0.3s;
  }
  .headerRightReset {
    transform: rotate(0deg);
    transition: all 0.3s;
  }
  .unstart {
    width: 71px;
    height: 52px;
    background: rgba(166, 173, 180, 1);
    border-radius: 0px 1px 21px 0px;
    position: absolute;
    top: 0px;
    left: 0px;
    .unstartIcon {
      width: 20px;
      height: 20px;
      background: url(./assets/unStart.svg) no-repeat;
      position: absolute;
      left: 24px;
      top: 5px;
    }
    .unstartText {
      position: absolute;
      left: 10px;
      top: 25px;
      font-size: 16px;
      text-align: left !important;
    }
  }
  .start {
    width: 71px;
    height: 52px;
    background: rgba(11, 210, 149, 1);
    border-radius: 0px 1px 21px 0px;
    position: absolute;
    top: 0px;
    left: 0px;
    .startIcon {
      width: 20px;
      height: 20px;
      background: url(./assets/start.svg) no-repeat;
      position: absolute;
      left: 24px;
      top: 5px;
    }
    .startText {
      position: absolute;
      left: 2px;
      top: 25px;
      font-size: 16px;
      text-align: left !important;
    }
  }
  .end {
    width: 71px;
    height: 52px;
    background: rgba(246, 110, 110, 1);
    border-radius: 0px 1px 21px 0px;
    position: absolute;
    top: 0px;
    left: 0px;
    .endIcon {
      width: 20px;
      height: 20px;
      background: url(./assets/end.svg) no-repeat;
      position: absolute;
      left: 24px;
      top: 5px;
    }
    .endText {
      position: absolute;
      left: 2px;
      top: 25px;
      font-size: 16px;
      text-align: left !important;
    }
  }
}
.announceListStyle {
  position: absolute;
  z-index: 10;
  top: 52px;
  height: 234px;
  width: 100%;
  overflow: auto;
  .listStyle {
    cursor: pointer;
    color: #ffffff;
    background: rgba(0, 0, 0, 1);
    border: 1px solid rgba(166, 173, 180, 0.3);
    height: 63px;
    position: relative;
    .listOne {
      position: relative;
      font-size: 18px;
      text-align: center;
      line-height: 51px;
    }
  }
  .listStyle:hover {
    background: linear-gradient(90deg, #00c1de 0%, rgba(24, 38, 50, 1) 100%);
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
}
.historyListStyle {
  position: absolute;
  z-index: 12;
  top: 52px;
  height: 234px;
  overflow: auto;
  .listStyle {
    cursor: pointer;
    color: #ffffff;
    background: rgba(0, 0, 0, 1);
    border: 1px solid rgba(166, 173, 180, 0.3);
    width: 476px;
    height: 117px;
    position: relative;
    .listOne {
      position: relative;
      margin-left: 8px;
      margin-top: 8px;
      float: left;
    }
    .verticalLineOne {
      @include allLine;
      margin-left: 8px;
      float: left;
    }
    .listTwo {
      position: relative;
      margin-left: 8px;
      margin-top: 8px;
      float: left;
    }
    .verticalLineTwo {
      @include allLine;
      margin-right: 70px;
      float: right;
    }
    .listStart {
      position: absolute;
      right: 8px;
      top: 8px;
      color: rgba(11, 210, 149, 1);
    }
    .listRestart {
      position: absolute;
      right: 8px;
      top: 8px;
      color: rgba(86, 233, 255, 1);
    }
    .listEnd {
      position: absolute;
      right: 8px;
      top: 8px;
      color: rgba(246, 110, 110, 1);
    }
    .listChange {
      position: absolute;
      right: 8px;
      top: 8px;
      color: #f2b626;
    }
    .listThree {
      width: 97%;
      position: relative;
      margin-left: 8px;
      margin-top: 8px;
      float: left;
    }
    .listFour {
      width: 97%;
      position: relative;
      margin-left: 8px;
      margin-top: 8px;
      float: left;
    }
  }
  .listStyle:hover {
    background: linear-gradient(90deg, #00c1de 0%, rgba(24, 38, 50, 1) 100%);
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
}
.adminStyle {
  width: 95%;
  height: 73vh;
  position: relative;
  margin-left: 20px;
  overflow: auto;
  overflow-x: hidden;
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
.sendSelect {
  width: 16px;
  height: 16px;
  position: absolute;
  bottom: 10px;
  background: #ffffff;
  left: 10px;
  border-radius: 100%;
  & input[type='checkbox'] {
    display: none;
  }
  & input[type='checkbox']:checked + span {
    position: relative;
    background: #00c1de;
  }
  & input[type='checkbox']:checked + span:after {
    content: '';
    border-radius: 50%;
    position: absolute;
    background: #fff;
    border: #00c1de solid 4px;
    height: 9px;
    width: 9px;
  }
}
.startButton {
  position: absolute;
  bottom: 10px;
  left: 392px;
  width: 110px;
  height: 101px;
}
</style>
