<template>
  <div :class="$style.MapDataList">
    <Dialog
      ref="dialog"
      :visible="visible"
      :title="dialogTitle"
      @close="handleClose"
    >
      <div :class="$style.MapDataListVis">
        <p>总数{{ totalCount }}</p>
        <div>
          <ul @scroll="load">
            <li v-for="(x, i) in listData" :key="i" @click="openPopup(x)">
              {{ x.name }}
            </li>
          </ul>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, watch, getCurrentInstance } from 'vue';
// 弹窗
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
// import List from '@/product/CommandBrain3.0/Generalparts/header/List/List.vue';

export default defineComponent({
  components: {
    // 弹窗
    Dialog,
    // 列表
    // List,
  },
  setup(props, context) {
    const store = useStore();
    const visible = ref<any>(true);
    const dialogTitle = ref<any>(store.state.mapDataList.MapDataList.typeName);
    // 第一次渲染时进行直接赋值
    const listData = ref<any>(store.state.mapDataList.MapDataList.data);
    // 总数
    const totalCount = ref<any>(store.state.mapDataList.MapDataList.totalCount);
    // 页数
    const page = ref<any>(store.state.mapDataList.MapDataList.page);
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $mapSetSpot }: any = instance?.appContext.config.globalProperties;
    // 关闭弹窗
    function handleClose() {
      visible.value = false;
      dialogTitle.value = '';
      totalCount.value = 0;
      // listData.value = [];
      page.value = 1;
      store.commit('mapDataList/set_MapDataList', {
        openFlag: false,
        data: [],
        page: 1,
        maxPage: 1,
        request: false,
        typeName: '',
        totalCount: 0,
      });
      store.commit('mapDataList/set_TurnPages', {
        num: 0,
        state: false,
      });
    }

    // 滚动加载
    function load(e: Event): void {
      const dom = e.target as HTMLElement;
      // console.log(store.state.mapDataList.MapDataList);
      if (dom.scrollHeight - dom.scrollTop === dom.clientHeight) {
        if (
          Math.ceil(store.state.mapDataList.MapDataList.totalCount / 100) >
          page.value
        ) {
          page.value += 1;
          store.commit('mapDataList/set_TurnPages', {
            num: page.value,
            state: true,
          });
        }
      }
    }
    // 打开弹窗
    function openPopup(param: any) {
      console.log(param);
      $mapSetSpot.spotClickFun.open(
        store.state.mapDataList.MapDataList.handleType,
        { ...param },
        store.state.event?.id,
        (window as any).map,
      );
      // console.log(
      //   store.state.mapDataList.MapDataList.handleType,
      //   { ...param },
      //   store.state.event?.id,
      //   (window as any).map,
      // );
    }

    watch(
      () => store.state.mapDataList.MapDataList,
      (newV: any) => {
        visible.value = newV.openFlag;
        dialogTitle.value = newV.typeName;
        totalCount.value = newV.totalCount;
        if (
          store.state.mapDataList.turnPages.num !== 0 &&
          !store.state.mapDataList.turnPages.state
        ) {
          listData.value = listData.value.concat(newV.data);
        } else {
          listData.value = newV.data;
        }
      },
    );
    return {
      visible,
      dialogTitle,
      listData,
      totalCount,
      handleClose,
      load,
      openPopup,
    };
  },
});
</script>

<style lang="scss" module>
.MapDataList {
}
.MapDataListVis {
  height: 99%;
  color: #fff;
  & > p {
    margin-top: 5px;
    padding: 5px 10px;
  }
  & > div,
  & ul {
    height: calc(100% - 30px);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 5px;
    }
  }
  li {
    border: 1px solid rgba(166, 173, 180, 0.9);
    background: rgba(132, 160, 193, 0.11);
    cursor: pointer;
    color: #ffffff;
    font-size: 14px;
    font-weight: 400;
    height: 30px;
    line-height: 15px;
    position: relative;
    padding: 0 30px 0 16px;
    display: flex;
    align-items: center;
    margin: 5px 10px;
    &:hover {
      border-color: #56e9ff;
      color: #56e9ff;
      background: rgba(86, 233, 255, 0.11);
    }
  }
}
</style>
