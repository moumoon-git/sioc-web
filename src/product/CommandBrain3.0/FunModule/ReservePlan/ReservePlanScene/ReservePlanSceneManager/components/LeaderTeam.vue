<template>
  <CollapseTemple
    :countAll="countAll"
    :list="list"
    :headerStyle="true"
  >
    <template #headerIcon>
      <!-- 勾选框 -->
      <label 
        v-if="isAnnouce"
        :class="$style.headerCheck"
      >
        <div :class="$style.headerCheckDiv">
          <input
            :class="$style.checkBox"
            v-model="chooseAll"
            type="checkbox"
            @change="checkAll"
          >
          <i :class="$style.checkIcon" />
        </div>
      </label>
      <slot
        v-else
        name="headerIcon"
      />
    </template>
    <template #headerRight>
      <span
        v-if="isAnnouce"
        style="float: right;margin: 15px 10px 0px 0px;"
      >
        已选中: {{ chooseArr.length }}
      </span>
      <span
        v-if="isAnnouce"
        style="float: right;margin: 15px 10px 0px 0px;"
      >
        响应率: {{ respondRate }}
      </span>
    </template>
    <template #head="{ data }">
      <div
        @click="handleExpand(data)"
        style="margin: 9px;cursor: pointer;"
      >
        <p
          style="width: 76%;
          overflow: hidden;
          text-overflow: ellipsis;"
        >
          {{ data.name }}
        </p>
        <span
          v-if="isEdit"
          style="position: absolute;right: 31px;top: 9px;color: #00C1DE;cursor: pointer;"
          @click="openAddManDialog"
        >
          添加人员
        </span>
      </div>
    </template>
    <template #main="{ data }">
      <div
        v-for="itemtwo in data.children"
        :key="itemtwo.id"
      >
        <ListTemple
          :useHead="false"
          :useLabel="true"
          :usePosition="true"
          :useMore="true"
          :useCheck="isAnnouce"
          :highLabel="'总指挥长'"
          :list="isAnnouce?itemtwo.contanctor:innerlist"
          @handleClick="handleClick"
          @handleCheck="handleCheck"
        >
          <template #operation="{ data }">
            <div
              v-if="isAnnouce"
              style="float: right;"
              :style="{'--getColor': getRespondStatus(data.statusName)}"
            >
              {{ data.statusName }}
            </div>
            <div
              v-if="isAnnouce"
              :class="{
                [$style.hasRespondIcon]: data.statusName=='已响应',
                [$style.notRespondIcon]: data.statusName=='未响应',
                [$style.notSendIcon]: data.statusName=='未发送',
              }"
            />
            <div
              v-if="isEdit&&!isAnnouce"
              :class="$style.listIcon"
              @click.stop="deleteLeader(data)"
            />
          </template>
        </ListTemple>
      </div>
    </template>
  </CollapseTemple>
  <!-- 添加人员窗 -->
  <AddManDialog
    ref="AddManDialog"
    :current-position="currentPosition"
    @init="fresh"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AddManDialog from './AddManDialog.vue'; // 新增职务窗
import CollapseTemple from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/CollapseTemple.vue'; // 折叠列表模板
import ListTemple from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/ListTemple.vue'; // 列表模板

export default defineComponent({
  name: 'LeaderTeam',
  components: {
    // 添加人员窗
    AddManDialog,
    // 折叠列表模板
    CollapseTemple,
    // 列表模板
    ListTemple,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    innerlist: {
      type: Array,
      default: () => [],
    },
    // 响应率
    respondRate: {
      type: String,
      default: '',
    },
    // 总数由组决定
    countAll: {
      type: Number,
      default: 0,
    },
    // 是否可编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 现场指挥部还是响应通告
    isAnnouce: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['fresh', 'handleClick', 'handleExpand'],
  data() {
    return {
      currentPosition: null, // 当前职务
      chooseArr: [], // 选中的所有人
      chooseAll: false, // 是否全选，默认全选
    };
  },
  methods: {
    fresh() {
      this.$emit('fresh');
    },
    openAddManDialog() {
      (this as any).$nextTick(() => {
        (this as any).$refs.AddManDialog.openPopup();
      });
    },
    // 删除领导
    deleteLeader(item: any) {
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
          this.$emit('fresh');
        }
      });
    },
    // 勾选
    handleCheck(el: any): void {
      if (this.chooseArr.filter((item:any) => item.id === el.id).length === 0) {
        (this as any).chooseArr.push(el);
      } else {
        this.chooseArr = this.chooseArr.filter((item:any) => item.id !== el.id);
      }
      this.chooseAll = (this.chooseArr.length === this.countAll);
    },
    // 全选
    checkAll() {
      // 全选 更新arr
      if (this.chooseAll) {
        this.chooseArr = []; // 预防一边勾选一边全选
        this.list.forEach((el:any) => {
          if (el?.children) {
            el.children.forEach((ele:any) => {
              if (ele) {
                ele.contanctor.forEach((eleM:any) => {
                  if (eleM) {
                    (this as any).chooseArr.push(eleM);
                  }
                });
              }
            });
          }
        });
      } else { // 取消全选
        this.chooseArr = [];
      }
      // 列表的勾选框同步变形
      this.list.forEach((el:any) => {
        if (el?.children) {
          el.children.forEach((ele:any) => {
            if (ele) {
              ele.contanctor.forEach((eleM:any) => {
                if (eleM) {
                  eleM.isChecked = this.chooseAll;
                }
              });
            }
          });
        }
      });
    },
    handleClick(item: any): void {
      if (this.isAnnouce) this.$emit('handleClick', item);
      else this.$emit('handleClick', (this as any).currentPosition?.name, (this as any).currentPosition?.remark);
    },
    handleExpand(item: any) {
      this.currentPosition = item;
      this.$emit('handleExpand', item);
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
  },
});
</script>

<style lang="scss" module>
  .headerCheck {
    cursor: pointer;
    margin: 15px 0px 0px 0px;
    float: left;
  }
  .headerCheck .checkBox {
    visibility: hidden;
  }
  .headerCheck .checkBox + .checkIcon {
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
  .headerCheck .checkBox[type="checkbox"]:checked + .checkIcon {
    background-color: #56e9ff;
    border: none;
    content: "✓";
    font-size: 14px;
    color: #000;
  }
  .listIcon {
    background: url(../../../PublicComponents/assets/close.svg) no-repeat;
    background-size: 100%;
    width: 10px;
    height: 10px;
    margin-top: 7px;
    float: right;
  }
  .hasRespondIcon {
    background: url(../../../ReservePlanAnnounce/assets/greenSign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 81%;
    float: right;
  }
  .notRespondIcon {
    background: url(../../../PublicComponents/assets/redSign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 81%;
    float: right;
  }
  .notSendIcon {
    background: url(../../../ReservePlanAnnounce/assets/graySign.svg) no-repeat;
    width: 25px;
    height: 25px;
    background-size: 81%;
    float: right;
  }
</style>
