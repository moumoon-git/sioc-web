<template>
  <div :class="$style.CollaborativePlotting">
    <ul v-if="renderData && renderData.length !== 0">
      <li v-for="(x, i) in renderData" :key="i">
        {{ x.cooperatePlatformName }}
        <img
          :src="require('./assets/delete.png')"
          alt=""
          @click="deleteColl(x)"
        />
      </li>
    </ul>
    <div v-else>
      <div></div>
      <span>暂无邀请单位</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    renderData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    // 删除某个协助
    function deleteColl(x: any) {
      context.emit('deleteColl', x);
    }
    return {
      deleteColl,
    };
  },
});
</script>

<style lang="scss" module>
.CollaborativePlotting {
  width: 100%;
  height: 100%;
  max-height: 180px;
  min-height: 180px;
  padding: 10px 0;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
  overflow-x: hidden;
  padding-right: 20px;
  li {
    height: 30px;
    background: rgba(166, 173, 180, 0.06);
    border: 1px solid rgba(166, 173, 180, 0.1);
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    line-height: 30px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    img {
      width: 10px;
      height: 12px;
      cursor: pointer;
      display: none;
    }
    &:hover {
      position: relative;
      background: rgba(86, 233, 255, 0.2);
      border: 1px solid rgba(86, 233, 255, 0.5);
      &::before {
        content: '';
        position: absolute;
        top: 1px;
        left: 1px;
        width: 1px;
        border: 2px solid transparent;
        border-top-color: #56e9ff;
        border-left-color: #56e9ff;
      }
    }
    &:hover img {
      display: block;
    }
  }
  &::-webkit-scrollbar {
    width: 3px;
    height: 5px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
    background-color: #56e9ff;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
    border-radius: 10px;
    background-color: #646869;
  }
  & > div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > div {
      width: 120px;
      height: 100px;
      background: url('./assets/not_data.svg') no-repeat;
      background-size: 100% 100%;
    }
    & > span {
      font-size: 14px;
      font-weight: 500;
      color: #b8c3d9;
    }
  }
}
</style>
