<!-- 组件：任务详情 —— 任务标签 -->
<template>
  <!-- 事件标签 R1版本先不做 -->
  <div class="event-tags">
    <div class="blue">情报获取</div>
    <div class="purple">事件增援</div>
    <div class="orange">物资调度</div>
    <div class="blue">任务调度</div>
  </div>
</template>
<style lang="scss" scoped>
@import '../../assets/css/common'; /*引入公共样式*/

// 事件标签
.event-tags {
  @extend .flex_style;
  justify-content: space-around;
  padding: 0.2rem 0;

  // 公共样式
  .font-style {
    height: 0.36rem;
    border-radius: 0.18rem;
    line-height: 0.36rem;
    font-size: $font_size_2;
    padding: 0.04rem 0.08rem;
  }
  .blue {
    @extend .font-style;
    color: $color_5;
    background: $color_6;
  }
  .orange {
    @extend .font-style;
    color: $color_7;
    background: $color_8;
  }
  .purple {
    @extend .font-style;
    color: $color_9;
    background: $color_10;
  }
}
</style>
