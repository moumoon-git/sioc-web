<template>
  <div :class="$style.SelectResults">
    <Title :title="`已选择（${selectDatas.length}）`" />
    <main>
      <ul>
        <li v-for="(x, i) in selectDatas" :key="i">
          <span>{{ x.name }}（{{ x.workUnit }}）</span>
          <span @click="clear(i, x)"></span>
        </li>
      </ul>
    </main>
    <span @click="clearAll">全部清除</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import Title from './Title.vue';

export default defineComponent({
  props: {
    selectData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Title,
  },
  setup(props, contxt) {
    const selectDatas = ref<any>([]);
    function clear(i: number, x: any) {
      selectDatas.value.splice(i, 1);
      contxt.emit('deletes', x);
    }
    function clearAll() {
      selectDatas.value = [];
      contxt.emit('deleteAll', []);
      contxt.emit('update:selectData', []);
    }

    watch(
      () => props.selectData,
      (newV) => {
        selectDatas.value = JSON.parse(JSON.stringify(newV));
      },
    );

    return {
      selectDatas,
      clear,
      clearAll,
    };
  },
});
</script>

<style lang="scss" module>
.SelectResults {
  & > main {
    height: calc(100% - 96px);
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px 0;
    box-sizing: border-box;
    & > ul > li {
      height: 32px;
      line-height: 32px;
      padding-left: 12px;
      padding-right: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      cursor: pointer;
      border-left: 2px solid transparent;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover {
        background: linear-gradient(
          90deg,
          rgba(0, 193, 222, 0.7) 0%,
          rgba(24, 38, 50, 0) 100%
        );
        border-left-color: #56e9ff;
      }
      &:hover span:last-child {
        display: block;
      }
      & > span {
        &:last-child {
          width: 14px;
          height: 14px;
          background: url('../assets/close.svg') no-repeat;
          background-size: 100% 100%;
          display: none;
        }
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
  }
  & > span {
    margin: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #56e9ff;
    display: block;
    cursor: pointer;
  }
}
</style>