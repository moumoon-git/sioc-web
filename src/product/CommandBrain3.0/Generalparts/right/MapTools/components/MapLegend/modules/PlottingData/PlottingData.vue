<template>
  <div :class="$style.container">
    <!-- 1. 顶部栏 -->
    <header :class="$style.header">
      <span>总数 {{ totalCount }}</span>
      <span
        :class="$style.hideAll"
        @click.stop="plottingData.length && toggleAll(isAllDrawn, plottingData)"
      >
        {{ isAllDrawn ? '全部隐藏' : '全部显示' }}
        <i
          :class="[
            $style.maskIcon,
            isAllDrawn ? $style.iconHide : $style.iconVisible
          ]"
        />
      </span>
      <span
        :class="[
          $style.expandAll,
          { [$style.up]: isAllExpanded },
        ]"
        @click="plottingData.length && handleExpandAll()"
      >{{ isAllExpanded ? '收起': '展开' }}</span>
    </header>
    <!-- 2. 数据列表 -->
    <main
      v-if="plottingData.length"
      :class="$style.main"
    >
      <Expand
        v-for="folder in plottingData"
        :key="folder.id"
        :ref="el => expandRefs.push(el)"
        :show-check="false"
        @fold-change="handleFoldChange"
      >
        <!-- 标题 -->
        <template #title>
          <div :class="$style.title">
            <span>{{ folder.name }}</span>
            <i
              :class="[
                $style.titleIcon,
                folder.allDrawn ? $style.iconHide : $style.iconVisible,
              ]"
              @click.stop="toggleFolder(folder)"
            />
          </div>
        </template>
        <!-- 展开列表 -->
        <template #list>
          <ul :class="$style.iconList">
            <li
              v-for="item in folder.children"
              :key="item.id"
              :class="{ [$style.itemInactive]: !item.drawn }"
              :title="`${item.name}（${item.children.length}）`"
              @click.stop="toggleItem(item, folder)"
            >
              <i
                :class="$style.listIcon"
                :style="{
                  backgroundImage: `url('${item.url}')`,
                  filter: item.drawn ? '' : 'grayscale(1)',
                }"
              />
              <span>
                {{ `${item.name}（${item.totalMarkRecord}）` }}
              </span>
            </li>
          </ul>
        </template>
      </Expand>
      <!-- 暂无数据提示 -->
    </main>
    <EmptyHint v-else />
  </div>
  <div v-show="false">
    <MapPopup
      ref="mapPopupRef"
      enter="commandBrain"
      :vis-data="{}"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';
// 地图标注
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
import Expand from '@/product/CommandBrain3.0/Generalparts/right/Expand/Expand.vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
// 地图弹窗
import MapPopup from '@/product/Coplotting/generalparts/MapPopup/MapPopup.vue';
import spotOrLineOrNoodles from '@/product/Coplotting/module/mainLogicJS/spotOrLineOrNoodlesRender';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import useExpandControl from '../../scripts/useExpandControl';
import usePlottingData from './services/usePlottingData';
import useMapDrawing from './scripts/useMapDrawing';

export default defineComponent({
  name: 'PlottingData',
  components: {
    Expand,
    EmptyHint,
    MapPopup,
  },
  setup() {
    // 【展开/折叠】控制逻辑
    const {
      expandRefs,
      isAllExpanded,
      handleExpandAll,
      handleFoldChange,
      doRefresh,
    } = useExpandControl();

    const store = useStore();

    const [plottingData, getPlottingData] = usePlottingData();

    // 记录总数
    const totalCount = computed(() => plottingData.value
      .reduce((prev, cur) => prev + cur.children
        .reduce((p, c) => p + c.totalMarkRecord, 0), 0));

    // 所有文件夹都绘制了落点
    const isAllDrawn = computed(() => {
      const DrawnFolderCount = plottingData.value.filter((folder) => folder.allDrawn).length;
      return DrawnFolderCount === plottingData.value.length;
    });

    // 地图点击弹窗组件与handler
    const mapPopupRef = ref<any>(null);
    const { spotClickEvent } = spotOrLineOrNoodles($http, mapPopupRef);
    const markerClickHandler = (e: any) => {
      console.log('点击事件-----', e);
      spotClickEvent(e.object);
    };
    onMounted(() => {
      // 禁用弹窗的编辑
      if (mapPopupRef.value) {
        mapPopupRef.value.editJurisdiction = false;
      }
    });

    // 绘制相关逻辑
    const {
      toggleItem,
      toggleFolder,
      toggleAll,
      clearMap,
    } = useMapDrawing(markerClickHandler);

    // 切换事件更新数据
    watch(() => store.state.coplotting?.mapId, (val) => {
      if (val) {
        getPlottingData();
      }
    }, { immediate: true });

    watch(plottingData, () => {
      nextTick(doRefresh);
      clearMap();
    });

    return {
      useMapMarker,
      expandRefs,
      isAllExpanded,
      handleExpandAll,
      handleFoldChange,
      plottingData,
      totalCount,
      isAllDrawn,
      toggleItem,
      toggleFolder,
      toggleAll,
      mapPopupRef,
    };
  },
});
</script>

<style lang="scss" module>
@use '../../styles/common.scss';
</style>
