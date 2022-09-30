<template>
  <main :class="$style['main-view']">
    <ul>
      <!-- 资源列表 -->
      <li
        v-for="(liItem, liIndex) in historyData"
        :key="liIndex"
        :class="{
          [$style['li--active']]: recordActiveIndex === liIndex,
        }"
        @mouseover="recordActiveIndex = liIndex"
        @mouseleave="recordActiveIndex = ''"
        @click="selectLi(liItem)"
      >
        <label>{{ liItem.name }}</label>
        <i
          @click.stop="deleteHistory('', liIndex)"
          v-if="recordActiveIndex === liIndex"
        />
      </li>
    </ul>
  </main>
  <footer v-if="historyData.length !== 0" :class="$style['footer-view']">
    <label @click="deleteHistory('all')">清除所有历史记录</label>
  </footer>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RetrievalRecord',
  props: {
    historyData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    // 搜索记录activeindex
    const recordActiveIndex = ref('');
    // 删除
    function deleteHistory(type, i) {
      let obj = {
        type,
        index: i,
      };
      context.emit('deleteHistory', obj);
    }
    // 选择单个
    function selectLi(item) {
      context.emit('selectLi', item);
    }
    return {
      recordActiveIndex,
      deleteHistory,
      selectLi,
    };
  },
  methods: {},
});
</script>

<style lang="scss" module>
.main-view {
  & ul {
    max-height: 230px;
    overflow: auto;
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
    list-style: none;
    li {
      height: 46px;
      display: flex;
      align-items: center;
      color: #ffffff;
      padding: 0px 18px;
      position: relative;
      cursor: pointer;
      &.li--active {
        background: linear-gradient(
          90deg,
          rgba(0, 193, 222, 0.7) 0%,
          transparent 100%
        );
        &::before {
          content: '';
          width: 2px;
          height: 46px;
          display: inline-block;
          background: #56e9ff;
          position: absolute;
          left: 0px;
        }
      }
      & label {
        display: flex;
        align-items: center;
        &::before {
          content: '';
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 6px;
          background: url(./assets/record-icon.svg) no-repeat center/100% 100%;
        }
      }
      & i {
        display: inline-block;
        width: 10px;
        height: 10px;
        position: absolute;
        right: 10px;
        cursor: pointer;
        background: url(./assets/close-icon.svg) no-repeat center/100% 100%;
      }
    }
  }
}
.footer-view {
  height: 37px;
  line-height: 37px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  label {
    color: #56e9ff;
    cursor: pointer;
  }
}
</style>
