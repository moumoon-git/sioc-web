<template>
  <div
    :class="$style.frame"
    :style="isCheckBox ? 'height:654px' : ''"
  >
    <header :class="$style.headerStyle">
      <!-- 标题 -->
      <div :class="$style.headerText">
        设备信息
      </div>
      <!-- 按钮 -->
      <button
        v-if="type === 0"
        :class="$style.headerRightOne"
        @click="headButton('监控预览')"
      >
        监控预览
      </button>
      <button
        v-if="type > 1"
        :class="$style.headerRightOne"
        @click="headButton('终端组呼')"
      >
        终端组呼
      </button>
      <button
        :class="$style.headerRightTwo"
        @click="refreshDeviceStatus"
      >
        刷新状态
      </button>
      <button
        :class="$style.headerRightThree"
        @click="headButton('快捷会议')"
      >
        快捷会议
      </button>
      <!-- 终端头部 -->
      <div>
        <img
          :class="$style.onlineImg"
          src="../assets/greenSign.svg"
          alt=""
        >
        <p :class="$style.onlineText">
          在线：
          {{ online }}
        </p>
        <img
          :class="$style.onlineImg"
          src="../assets/redSign.svg"
          alt=""
        >
        <p :class="$style.onlineText">
          离线：
          {{ offline }}
        </p>
      </div>
    </header>
    <main
      :class="$style.scroll"
      :style="isCheckBox ? 'height:591px' : ''"
    >
      <!-- 列表 -->
      <div
        v-for="item in treeList"
        :key="item.id"
        :class="$style.listStyle"
        :style="currentItem === item ? 'opacity: 1' : ''"
      >
        <!-- 勾选框 -->
        <label
          v-if="isCheckBox"
          :class="$style.checkBoxStyle"
        >
          <div :class="$style.checkBoxStyleDiv">
            <input
              v-model="item.isChecked"
              :class="$style.checkBox"
              type="checkbox"
              @change="checkBox(item)"
            >
            <i :class="$style.checkBoxIcon" />
          </div>
        </label>
        <div
          style="width: 100%;"
          @click.stop="handleClick(item)"
        >
          <!-- 名字 -->
          <div :class="$style.listText">
            {{ item.name }}
          </div>
          <!-- 在线0 离线1或null -->
          <div
            :class="item.status === 0 ? $style.oneDeviceOnline : $style.oneDeviceOffline"
          >
            <p>
              {{ item.status === 0 ? '在线' : '离线' }}
            </p>
          </div>
          <div
            :class="$style.hoverShow"
            :style="currentItem === item ? 'display: block;' : ''"
          >
            <!-- 查看详情 -->
            <div
              v-if="type === 0"
              :class="item?.isDetail ? $style.detailIconActive : $style.detailIcon"
              @click.stop="handleDetail(item)"
            />
            <!-- 定位 -->
            <div
              :class="
                item?.isPosition ? $style.locationIconActive : $style.locationIcon
              "
              @click.stop="handlePosition(item)"
            />
            <!-- 视频电话 -->
            <div
              v-if="type > 1"
              :class="item?.isMedia ? $style.mediaIconActive : $style.mediaIcon"
              @click.stop="handleVideo(item)"
            />
            <!-- 打电话 -->
            <div
              v-if="type > 1"
              :class="item?.isPhone ? $style.phoneIconActive : $style.phoneIcon"
              @click.stop="handlePhone(item)"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
  <!-- 底部按钮 -->
  <div
    v-if="isCheckBox"
    :class="$style.footer"
  >
    <!-- 全选 -->
    <div
      style="left: 16px; bottom: 23px; position: absolute"
      :class="$style.headerCheck"
    >
      <p style="color: #56e9ff; font-size: 16px; display: inline">
        全选
      </p>
      <el-checkbox
        v-model="chooseAll"
        type="checkbox"
        @change="checkAll"
      />
    </div>
    <!-- 按钮 -->
    <button
      v-if="innerType === '监控预览'"
      :class="$style.funcFooterButtom"
      @click="view"
    >
      预览
    </button>
    <button
      v-if="innerType === '终端组呼'"
      :class="$style.funcFooterButtom"
      @click="groupCall"
    >
      组呼
    </button>
    <button
      v-if="innerType === '快捷会议'"
      :class="$style.funcFooterButtom"
      @click="holdMeeting"
    >
      发起会议
    </button>
    <button
      :class="$style.cancelFooterButtom"
      @click="cancel"
    >
      取 消
    </button>
  </div>
  <!-- 快捷会议 -->
  <StartMeetingDialog ref="StartMeetingDialog" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StartMeetingDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/StartMeetingDialog/StartMeetingDialog.vue'; // 发起会议弹窗
import {
  monitorPreview,
  callVideoCluster,
  callVoiceCluster,
  callGroupCluster,
  addCallback,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
// 刷新设备状态
import refreshDeviceStatus from '../scripts/useRefreshDeviceStatusService';

export default defineComponent({
  name: 'RightList',
  components: {
    // 发起会议弹窗
    StartMeetingDialog,
  },
  props: {
    // 当前树节点
    currentNode: {
      type: Object,
      default: () => ({}),
    },
    // 列表类型
    type: {
      type: Number,
      default: 0,
    },
    // 在线人数
    online: {
      type: Number,
      default: 0,
    },
    // 离线人数
    offline: {
      type: Number,
      default: 0,
    },
    // 列表数据
    treeList: {
      type: Array,
      default: () => [],
    },
    // 总数由列表长度决定，用来判断是否全选
    countAll: {
      type: Number,
      default: 0,
    },
  },
  emits: ['headButton', 'handleClick'],
  setup() {
    return {
      refreshDeviceStatus,
    };
  },
  data() {
    return {
      chooseArr: [], // 选中的所有人
      chooseAll: false, // 是否全选，默认全选
      currentItem: '', // 当前item
      isCheckBox: false,
      innerType: '',
    };
  },
  mounted() {
    if ((window as any).map) {
      (window as any).map.createdMarkCoverage('rightMarker');
    }
    addCallback((this as any).addCallbacks);
  },
  beforeUnmount() {
    if ((window as any).map) {
      (window as any).map.clearDeleteCoverage('rightMarker');
    }
  },
  methods: {
    // 点击头
    headButton(node: any) {
      this.innerType = node;
      this.isCheckBox = !this.isCheckBox;
      // if(node==='监控预览'){
      //   this.$emit('headButton', '选择');
      // }
    },
    // 勾选
    checkBox(el: any) {
      // 当前el不在arr里，放入
      if (
        this.chooseArr.filter(
          (item: any) => item.data.id === el.id
            && item.pid === (this.currentNode?.id || -7)
            && item.memberType === this.type + 5,
        ).length === 0
      ) {
        (this as any).chooseArr.push({
          memberType: this.type + 5,
          pid: this.currentNode?.id || -7,
          data: el,
        });
      } else {
        // 移除
        const currentChooseArr = this.chooseArr.filter(
          (item: any) => item.data.id !== el.id && item.pid === (this.currentNode?.id || -7),
        );
        const otherChooseArr = this.chooseArr.filter(
          (item: any) => item.pid !== (this.currentNode?.id || -7),
        );
        this.chooseArr = currentChooseArr.concat(otherChooseArr);
      }
      if (
        this.chooseArr.filter(
          (item: any) => item.pid === (this.currentNode?.id || -7)
            && item.memberType === this.type + 5,
        ).length !== this.countAll
      ) {
        this.chooseAll = false;
      } else {
        this.chooseAll = true;
      }
      console.log('当前勾选', this.chooseArr);
    },
    // 全选
    checkAll() {
      // 当前点的全选按钮已经在队列里
      if (this.chooseAll) {
        this.treeList.forEach((el: any) => {
          (this as any).chooseArr.push({
            memberType: this.type + 5,
            pid: this.currentNode?.id || -7,
            data: el,
          });
        });
      } else {
        const currentChooseArr = this.chooseArr.filter(
          (item: any) => item.pid === (this.currentNode?.id || -7)
            && item.memberType !== this.type + 5,
        );
        const otherChooseArr = this.chooseArr.filter(
          (item: any) => item.pid !== (this.currentNode?.id || -7),
        );
        this.chooseArr = currentChooseArr.concat(otherChooseArr);
      }
      // 列表的勾选框同步变形
      this.treeList.forEach((el: any) => {
        el.isChecked = this.chooseAll;
      });
      console.log('当前勾选', this.chooseArr);
    },
    // 勾选回显
    checkShow() {
      let count = 0;
      this.treeList.forEach((el: any) => {
        this.chooseArr.forEach((ele: any) => {
          if (
            el.id === ele.data.id
            && (this.currentNode?.id || -7) === ele.pid
            && this.type + 5 === ele.memberType
          ) {
            el.isChecked = true;
            count += 1;
          }
          if (count === this.treeList.length) {
            this.chooseAll = true;
          }
        });
      });
    },
    // 点击一行看详情
    handleClick(item: any) {
      this.currentItem = item;
      this.$emit('handleClick', item);
    },
    // 查看监控视频详情
    handleDetail(item: any) {
      this.treeList.forEach((el: any) => {
        el.isDetail = false;
      });
      item.isDetail = true;
      monitorPreview([
        {
          id: item.id,
          name: item.name,
          codeNum: item.code,
        },
      ]);
    },
    // 定位
    handlePosition(item: any) {
      this.treeList.forEach((el: any) => {
        el.isPosition = false;
      });
      item.isPosition = true;
      (window as any).map.setCentent(
        {
          longitude: item.longitude,
          latitude: item.latitude,
        },
        17,
      );
      (window as any).map.setOneMarker('rightMarker', {
        longitude: item.longitude,
        latitude: item.latitude,
        wd: 40,
        hg: 40,
        src: useMapMarker(),
      });
    },
    // 视频电话
    handleVideo(item: any) {
      this.treeList.forEach((el: any) => {
        el.isMedia = false;
      });
      item.isMedia = true;
      callVideoCluster([
        {
          id: item.id,
          name: item.name,
          num: item.code,
        },
      ]);
    },
    // 打电话
    handlePhone(item: any) {
      this.treeList.forEach((el: any) => {
        el.isPhone = false;
      });
      item.isPhone = true;
      callVoiceCluster([
        {
          id: item.id,
          name: item.name,
          num: item.code,
        },
      ]);
    },
    // 批量预览
    view() {
      if (this.chooseArr.length === 0) {
        (this as any).$message.error('请先勾选预览监控');
        return;
      }
      const members = Array.from(this.chooseArr, (el: any) => ({
        id: el.data.id,
        name: el.data.name,
        codeNum: el.data.code,
      }));
      monitorPreview(members);
    },
    // 发起组呼
    groupCall() {
      if (this.chooseArr.length === 0) {
        (this as any).$message.error('请先勾选组呼人员');
        return;
      }
      (this as any).$message.info('发起组呼成功！');
      const members = Array.from(this.chooseArr, (el: any) => ({
        id: el.data.id,
        name: el.data.name,
        num: el.data.code,
      }));
      callGroupCluster(members);
    },
    // 发起会议
    holdMeeting() {
      if (this.chooseArr.length === 0) {
        (this as any).$message.error('请先勾选参会人员');
        return;
      }
      if (this.$refs.StartMeetingDialog) {
        const members = Array.from(this.chooseArr, (el: any) => ({
          memberType: el.memberType,
          id: el.data.id,
          name: el.data.name,
          phone: el.data.code,
          mobile1: el.data.code,
          mobile2: el.data.code,
          meetingCode: el.data.meetingCode,
        }));
        (this as any).$refs.StartMeetingDialog.createOrAddMeeting(members);
      }
    },
    // 取消
    cancel() {
      this.isCheckBox = false;
      this.$emit('headButton', '取消');
    },
    addCallbacks(code: number, message: any) {
      console.log(code, message);
      if (code === 291) {
        if (message.result === 1) {
          (this as any).$message.info('预览成功');
        } else {
          (this as any).$message.error('预览失败');
        }
      }
    },
  },
});
</script>

<style lang="scss" module>
@mixin allOneDevice {
  background: url(../assets/label.svg) no-repeat;
  width: 56px;
  height: 20px;
  position: absolute;
  right: 0px;
  top: 0px;
  background-size: 100%;
  font-size: 12px;
  p {
    margin: 1px 0px 0px 24px;
  }
}
@mixin allHeadButtom {
  width: 71px;
  height: 32px;
  position: absolute;
  top: 12px;
  background: transparent;
  border: 1px solid #56e9ff;
  color: #56e9ff;
  cursor: pointer;
}
@mixin allFooterButtom {
  cursor: pointer;
  width: 64px;
  height: 32px;
  position: absolute;
  bottom: 12px;
  border: none;
  font-size: 13px;
}
@mixin detail {
  width: 16px;
  height: 17px;
  position: absolute;
  right: 39px;
  top: 32px;
  cursor: pointer;
  background-size: 100%;
}
@mixin position {
  width: 15px;
  height: 17px;
  position: absolute;
  cursor: pointer;
  right: 11px;
  top: 29px;
  background-size: 95%;
}
@mixin video {
  width: 15px;
  height: 17px;
  position: absolute;
  right: 61px;
  top: 30px;
  cursor: pointer;
  background-size: 100%;
}
@mixin voice {
  width: 15px;
  height: 17px;
  position: absolute;
  right: 36px;
  top: 30px;
  cursor: pointer;
  background-size: 100%;
}
.frame {
  position: relative;
  width: 753px;
  height: 707px;
  float: left;
  margin-top: 16px;
  margin-left: 19px;
  border: 1px solid rgba(0, 193, 222, 0.58);
  color: #fff;
  .headerStyle {
    width: 100%;
    height: 52px;
    background: linear-gradient(
      90deg,
      rgba(20, 98, 140, 0.35) 0%,
      rgba(14, 69, 100, 0.35) 50%
    );
    .headerText {
      margin-left: 20px;
      margin-top: 14px;
      font-size: 16px;
      float: left;
    }
    .onlineImg {
      float: left;
      margin-left: 10px;
      margin-top: 14px;
      width: 25px;
    }
    .onlineText {
      float: left;
      font-size: 16px;
      margin-left: 3px;
      margin-top: 15px;
    }
    .headerRightOne {
      @include allHeadButtom;
      right: 94px;
    }
    .headerRightTwo {
      @include allHeadButtom;
      right: 180px;
    }
    .headerRightThree {
      @include allHeadButtom;
      right: 10px;
    }
  }
  .scroll {
    height: 645px;
    overflow: auto;
    .listStyle {
      cursor: pointer;
      color: #fff;
      width: 346px;
      height: 75px;
      background: linear-gradient(90deg, #00c1de 0%, rgba(24, 38, 50, 0) 100%);
      margin: 16px 0px 0px 20px;
      position: relative;
      opacity: 0.7;
      display: inline-flex;
      .hoverShow {
        display: none;
      }
      &:hover {
        opacity: 1;
        .hoverShow {
          display: block;
        }
      }
      .oneDeviceOnline {
        color: #0BD295;
        @include allOneDevice;
      }
      .oneDeviceOffline {
        color: #F66E6E;
        @include allOneDevice;
      }
      .checkBoxStyle {
        position: absolute;
        left: 3px;
        top: -7px;
        width: 16px;
        height: 16px;
      }
      .checkBoxStyle .checkBox {
        visibility: hidden;
      }
      .checkBoxStyle .checkBox + .checkBoxIcon {
        color: #fff;
        width: 16px;
        height: 16px;
        border-radius: 2px;
        border: 1px solid #ffffff;
        display: inline-block;
        visibility: visible;
        padding-left: 0px;
        text-align: center;
        content: ' ';
        box-sizing: border-box;
        line-height: 16px;
        margin-top: 3px;
        cursor: pointer;
      }
        .checkBoxStyle .checkBox[type="checkbox"]:checked + .checkBoxIcon {
        background-color: #56e9ff;
      }
      .checkBoxStyle .checkBox[type="checkbox"]:checked + .checkBoxIcon::after {
        content: '✓';
        font-size: 14px;
        color: #000;
      }
      .listText {
        font-size: 16px;
        position: absolute;
        left: 27px;
        top: 12px;
      }
      .detailIcon {
        @include detail;
        background: url(../assets/detail.svg) no-repeat;
        &:hover {
          background: url(../assets/detailActive.svg) no-repeat;
        }
      }
      .detailIconActive {
        @include detail;
        background: url(../assets/detailActive.svg) no-repeat;
      }
      .locationIcon {
        @include position;
        background: url(../assets/location.svg) no-repeat;
        &:hover {
          background: url(../assets/locationActive.svg) no-repeat;
        }
      }
      .locationIconActive {
        @include position;
        background: url(../assets/locationActive.svg) no-repeat;
      }
      .mediaIcon {
        @include video;
        background: url(../assets/media.svg) no-repeat;
        &:hover {
          background: url(../assets/mediaActive.svg) no-repeat;
        }
      }
      .mediaIconActive {
        @include video;
        background: url(../assets/mediaActive.svg) no-repeat;
      }
      .phoneIcon {
        @include voice;
        background: url(../assets/phone.svg) no-repeat;
        &:hover {
          background: url(../assets/phoneActive.svg) no-repeat;
        }
      }
      .phoneIconActive {
        @include voice;
        background: url(../assets/phoneActive.svg) no-repeat;
      }
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
}
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  width: 790px;
  height: 53px;
  position: absolute;
  bottom: 0px;
  right: 0px;
}
.headerCheck {
  & > input[type='checkbox'] {
    cursor: pointer;
    position: absolute;
    left: 35px;
    top: -1px;
    display: inline;
    visibility: hidden;
  }
  & > input[type='checkbox']::after {
    color: #fff;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    border: 1px solid #a6adb4;
    display: inline-block;
    visibility: visible;
    padding-left: 0px;
    text-align: center;
    content: ' ';
    box-sizing: border-box;
    line-height: 16px;
    margin-top: 3px;
  }
  & > input[type='checkbox']:checked::after {
    background-color: #56e9ff;
    border: none;
    content: '✓';
    font-size: 14px;
    // font-weight: bold;
    color: #000;
  }
}
.funcFooterButtom {
  @include allFooterButtom;
  right: 18px;
  background: #00c1de;
  color: rgba(255, 255, 255, 1);
}
.cancelFooterButtom {
  @include allFooterButtom;
  right: 90px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
}
</style>
