<template>
  <header :class="$style.headerStyle">
    <div :class="$style.headerIcon" />
    <div :class="$style.headerText">
      预案版本
    </div>
    <div :class="$style.headerRight">
      {{ plan.type }}
    </div>
  </header>
  <main :class="$style.mainStyle">
    <div
      :class="$style.info"
      @click="$emit('handleInfo')"
    >
      查看详情
    </div>
    <div :class="$style.adminPic" />
    <el-row gutter="24">
      <el-col :span="12">
        <p>预案版本: {{ plan.version }}</p>
        <p>编制单位: {{ plan.builder }}</p>
        <p>发布时间: {{ plan.publishDate }}</p>
        <p>适用区域: {{ plan.area }}</p>
        <p>备注: {{ plan.remark }}</p>
      </el-col>
      <el-col :span="12">
        <p>预案编码: {{ plan.code }}</p>
        <p>发布单位: {{ plan.publishUnit }}</p>
        <p>修订时间: {{ plan.publishDate }}</p>
      </el-col>
    </el-row>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ReservePlanVersion',
  emits: ['handleInfo'],
  props: {
    plan: {
      type: Object,
      default: () => ({}),
    },
  },
});
</script>

<style lang="scss" module>
  .headerStyle {
    width: 100%;
    height: 30px;
    color: #FFF;
    position: relative;
    .headerIcon {
      width: 6px;
      height: 13px;
      margin: 16px 10px 0px 10px;
      float: left;
      background: #56E9FF;
      box-shadow: 0px 0px 16px 0px #008CFF;
      border-radius: 2px;
    }
    .headerText {
      font-size: 16px;
      float: left;
      color: #56E9FF;
      margin: 10px 0px 0px 0px;
    }
    .headerRight {
      margin: 15px 10px 0px 0px;
      float: right;
    }
  }
  .mainStyle {
    width: 95%;
    border: 1px solid rgba(0, 193, 222, 0.58);
    background: rgba(0, 0, 0, 0.7);
    position: relative;
    color: #FFF;
    margin: 10px;
    padding: 10px;
    p {
      margin-bottom: 6px;
    }
    .info {
      color: rgba(86, 233, 255, 1);
      cursor: pointer;
      z-index: 1;
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
    .adminPic {
      width: 255px;
      height: 148px;
      background: url(../assets/adminPic.svg) no-repeat;
      position: absolute;
      right: 30px;
      bottom: 0px;
    }
  }
</style>
