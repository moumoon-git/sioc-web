<template>
  <!-- 流程顶部 -->
  <div :class="$style.scroll">
    <SpecialHorizonList
      :title="'响应流程'"
      :list="buttonList"
      :listBackColor="'#000'"
      :listBackBorder="'1px solid #00C1DE'"
      @handleClick="handleClick"
    >
      <template #headerIcon>
        <img
          src="../assets/respondFlow.svg"
          style="position: relative;
          margin: 13px 0px 0px 10px;
          float: left;"
        >
      </template>
    </SpecialHorizonList>
  </div>
  <!-- 流程底部 -->
  <div :class="$style.scrollBottom">
    <div
      v-for="(item, index) in levelProcessList"
      :key="index"
    >
      <Collapse :item="item">
        <template #head>
          <div style="margin: 9px;">
            {{ item?.name }}
          </div>
        </template>

        <template #main>
          <!-- <div style="margin: 0px 7px 5px 9px;">
            任务地点: {{ item?.address || '-' }}
          </div>
          <div style="margin: 7px 7px 5px 9px;">
            执行时间: {{ item?.startTime || '-' }}
          </div>
          <div style="margin: 7px 7px 5px 9px;">
            任务时限: {{ item?.timeLimit || '-' }}
          </div> -->
          <div style="margin: 7px 7px 5px 9px;">
            任务说明: {{ item?.content || '-' }}
          </div>
          <!-- <div style="margin: 7px 7px 5px 9px;">
            任务附件: {{ item?.attachments || '-' }}
          </div> -->
          <div style="margin: 7px 7px 5px 9px;display: inline-block;">
            负责单位({{ item?.responseGroup.length }}):
          </div>
          <div
            v-for="(itemone, indexone) in item.responseGroup"
            :key="indexone"
            :class="$style.listStyleBottom"
          >
            <div :class="$style.listTextBottom">
              {{ itemone?.name || '-' }}
            </div>
          </div>
          <div style="margin: 9px 7px 5px 9px;"></div>
          <div style="margin: 7px 7px 5px 9px;display: inline-block;">
            成员单位({{ item?.memberGroups.length }}):
          </div>
          <div
            v-for="(itemtwo, indextwo) in item.memberGroups"
            :key="indextwo"
            :class="$style.listStyleBottom"
          >
            <!-- 名字 -->
            <div :class="$style.listTextBottom">
              {{ itemtwo?.name || '-' }}
            </div>
          </div>
          <div style="margin: 9px 7px 5px 9px;"></div>
          <div style="margin: 9px 0px 5px 9px;display: inline-block;">
            负责人({{ item?.responsePerson.length }}):
          </div>
          <div
            v-for="(itemthree, indexthree) in item.responsePerson"
            :key="indexthree"
            :class="$style.listStyleBottom"
          >
            <!-- 名字 -->
            <div :class="$style.listTextBottom">
              {{ itemthree?.name || '-' }}
            </div>
            <!-- 详情按钮 -->
            <div :class="$style.detailIcon">
              <ContactMoreButton
                :id="itemthree?.id"
              />
            </div>
          </div>
          <div style="margin: 9px 7px 5px 9px;"></div>
          <div style="margin: 9px 0px 5px 9px;display: inline-block;">
            参与人({{ item?.members.length }}):
          </div>
          <div
            v-for="(itemfour, indexfour) in item.members"
            :key="indexfour"
            :class="$style.listStyleBottom"
          >
            <!-- 名字 -->
            <div :class="$style.listTextBottom">
              {{ itemfour?.name || '-' }}
            </div>
            <!-- 详情按钮 -->
            <div :class="$style.detailIcon">
              <ContactMoreButton
                :id="itemfour?.id"
              />
            </div>
          </div>
          <div style="margin: 9px 7px 5px 9px;"></div>
          <div style="margin: 9px 0px 5px 9px;display: inline-block;">
            抄送人({{ item?.cc.length }}):
          </div>
          <div
            v-for="(itemfive, indexfive) in item.cc"
            :key="indexfive"
            :class="$style.listStyleBottom"
          >
            <!-- 名字 -->
            <div :class="$style.listTextBottom">
              {{ itemfive?.name || '-' }}
            </div>
            <!-- 详情按钮 -->
            <div :class="$style.detailIcon">
              <ContactMoreButton
                :id="itemfive?.id"
              />
            </div>
          </div>
        </template>
      </Collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import Collapse from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/Collapse.vue'; // 折叠组件
import SpecialHorizonList from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/SpecialHorizonList.vue'; // 横向列表

export default defineComponent({
  name: 'WarningSign',
  components: {
    // 详情按钮
    ContactMoreButton,
    // 折叠组件
    Collapse,
    // 横向列表
    SpecialHorizonList,
  },
  props: {
    // 顶部按钮列表
    buttonList: {
      type: Array,
      default: () => [],
    },
    // 底部详情伸缩框列表
    levelProcessList: {
      type: Array,
      default: () => [],
    },
    // 成员
    chargeManList: {
      type: Array,
      default: () => [],
    },
    // 抄送
    contactManList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['handleClick'],
  methods: {
    // 点顶部节点
    handleClick(item: any): void {
      this.$emit('handleClick', item);
    },
  },
});
</script>

<style lang="scss" module>
  .scroll {
    white-space: nowrap;
    width: 100%;
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
  .scrollBottom {
    color: #FFF;
    padding: 0px 10px;
    .listStyleBottom {
      display: inline-block;
      color: #FFF;
      margin: 0px 0px 0px 9px;
      position: relative;
      width: 140px;
      height: 30px;
      border: 1px solid #979797;
      .listTextBottom {
        left: 2px;
        top: 5px;
        position: absolute;
      }
      .detailIcon {
        width: 16px;
        background-size: 80%;
        height: 26px;
        right: -5px;
        top: 7px;
        position: absolute;
      }
    }
  }
</style>
