<template>
  <div :class="$style.taskForm">
    <!-- 固定标题 -->
    <h5>
      <span>任务类型</span>
      <span>总数</span>
      <span>已完成</span>
      <span>执行中</span>
      <span>完成率</span>
    </h5>
    <!-- 内容 -->
    <div>
      <div v-if="listData?.length">
        <ul>
          <li v-for="(item, index) in listData" :key="index">
            <span>{{ item.typeName }}</span>
            <span>{{ item.total }}</span>
            <span>{{ item.finished }}</span>
            <span>{{ item.handling }}</span>
            <span>{{ item.rate ? item.rate : 0 }}</span>
          </li>
        </ul>
      </div>
      <EmptyHint v-else />
    </div>
  </div>
</template>

<script>
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';

export default {
  components: {
    EmptyHint,
  },
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style module lang="scss">
.taskForm {
  position: relative;
  padding-top: 27px;
  box-sizing: border-box;
  height: 100%;
  & > div {
    height: 100%;
    width: 101%;
    overflow: hidden;
    & > div {
      height: 100%;
      overflow-y: auto;
      /* 定义滚动条样式 */
      &::-webkit-scrollbar {
        width: 3px;
        height: 5px;
        /* background-color: rgba(100, 104, 105, 1); */
        border-radius: 10px;
      }
      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
        border-radius: 10px;
        background-color: rgba(100, 104, 105, 1);
      }
      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
        background-color: rgba(86, 233, 255, 1);
      }
    }
  }
  h5 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    color: #00ecff;
    background: linear-gradient(
      90deg,
      rgba(0, 193, 222, 0.35) 0%,
      rgba(24, 38, 50, 0) 100%
    );
  }
  ul {
    width: 100%;
  }
  li {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    width: 100%;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 2px;
      height: 28px;
      background: #56e9ff;
      opacity: 0;
    }
    &:hover {
      background: linear-gradient(
        90deg,
        rgba(0, 193, 222, 0.65) 0%,
        rgba(24, 38, 50, 0) 100%
      );
    }
    &:hover:before {
      opacity: 1;
    }
  }
  li:nth-child(2n) {
    background: linear-gradient(
      90deg,
      rgba(0, 193, 222, 0.35) 0%,
      rgba(24, 38, 50, 0) 100%
    );
  }
}
.taskForm li,
.taskForm h5 {
  padding: 3px 4px 3px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.taskForm li span,
.taskForm h5 span {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
</style>
