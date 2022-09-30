<template>
  <div :class="$style.essentialFactor">
    <ul>
      <li v-for="(item, index) in listData" :key="index">
        <div>{{ item.name }}</div>
        <div>
          {{ item.value ? item.value : 0 }} <span>{{ item.unit }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style module lang="scss">
.essentialFactor {
  width: 104%;
  padding-right: 8px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      display: flex;
      justify-content: space-between;
      padding: 3px 0 3px 9px;
      box-sizing: border-box;
      &:nth-child(2n-1) {
        background: linear-gradient(
          90deg,
          rgba(0, 193, 222, 0.25) 0%,
          rgba(24, 38, 50, 0) 100%
        );
      }
      &:nth-child(2n) {
        padding: 8px 0 8px 9px;
        /* background: red; */
      }
      & > div {
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        &:first-child {
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
        }
        &:last-child {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          text-align: right;
        }
      }
    }
  }
}
/* 定义滚动条样式 */
.essentialFactor::-webkit-scrollbar {
  width: 3px;
  height: 5px;
  /* background-color: rgba(100, 104, 105, 1); */
  border-radius: 10px;
}

/*定义滚动条轨道 内阴影+圆角*/
.essentialFactor::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
  border-radius: 10px;
  background-color: rgba(100, 104, 105, 1);
}

/*定义滑块 内阴影+圆角*/
.essentialFactor::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
  background-color: rgba(86, 233, 255, 1);
}
</style>
