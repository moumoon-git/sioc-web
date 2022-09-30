<template>
  <div style="transition: all 0.4s linear; margin-right: 10px">
    <ul :class="$style.container">
      <li :class="[$style.follow]" @click="handleFollow">
        关注
      </li>
    </ul>
    <ul :class="$style.container">
      <li :class="[$style.legend]" @click="toggleMapLegend('mapLegendVisible')">
        图例
      </li>
    </ul>
    <ul :class="$style.container">
      <li :class="[$style.locate]" @click="getLngLat">
        定位
      </li>
      <li :class="[$style.layer]" @click="switchLayer">
        图层
      </li>
      <li :class="capturing ? $style.capturing : $style.picture" @click="handleCapture">
        出图
      </li>
      <li :class="[$style.measure]" @click="handleMeasure">
        测距
      </li>
      <li :class="[$style.label]" @click="toggleMarkerLabel">
        {{ labelVisible ? '隐藏' : '显示' }}
      </li>

    </ul>
    <ul :class="$style.container">
      <li :class="[$style['zoom-in']]" @click="zoomIn">
        放大
      </li>
      <li :class="[$style['zoom-out']]" @click="zoomOut">
        缩小
      </li>
    </ul>
    <div v-if="imgURL" :class="$style.preview" @click="downloadMapShoot">
      <div>
        <span>点击下载</span>
        <button @click.stop="imgURL = ''" />
      </div>
      <img :src="imgURL" alt />
    </div>
    <!-- 测距工具 -->
    <RangeFinder ref="RangeFinderRef" />
    <!-- 图例弹窗 -->
    <MapLegend v-model:visible="dialogVisible.mapLegendVisible" />

  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, inject, reactive } from 'vue';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import useGeolocation from './scripts/useGeolocation';
import useSwitchLayer from './scripts/useSwitchLayer';
import useCaptureMapShoot from './scripts/useCaptureMapShoot';
import useZoom from './scripts/useZoom';
import useToggleMarkerLabel from './scripts/useToggleMarkerLabel';
// 测距工具
import RangeFinder from './components/RangeFinder/RangeFinder.vue';

export default defineComponent({
  name: 'MapTools',
  components: {
    RangeFinder,
    // 图例弹窗
    MapLegend: defineAsyncComponent({
      loader: () =>
        import(/* webpackChunkName: "Command__MapLegend" */ './components/MapLegend/MapLegend.vue'),
    }),
  },
  emits: ['setRightPopup', 'setCenter'],
  setup(props, contxt) {
    // 动态关注
    const tabModule = inject('$tabModules') as (val: any) => void;
    const handleFollow = () => {
      if (tabModule) {
        tabModule({
          name: '动态关注',
          icon: 'dynamic',
        });
      }
    };

    // 出图
    const capturing = ref(false);
    const { captureMapShoot, downloadMapShoot, imgURL } = useCaptureMapShoot();
    const handleCapture = () => {
      capturing.value = true;
      captureMapShoot().then(() => {
        capturing.value = false;
      });
    };

    // 测距
    const RangeFinderRef = ref<typeof RangeFinder | null>(null);
    const handleMeasure = () => {
      $message.info('点击地图绘制路径，双击结束', 5000);
      if (RangeFinderRef.value) {
        RangeFinderRef.value.activateDrawing();
      }
    };

    // 图例
    const dialogVisible = reactive({
      mapLegendVisible: false,
      mobileVisible: false,
    });
    const toggleMapLegend = (type: 'mapLegendVisible' | 'mobileVisible') => {
      const typeArr = ['mapLegendVisible', 'mobileVisible'];
      const initObj = {
        mapLegendVisible: false,
        mobileVisible: false,
      };
      Object.assign(dialogVisible, initObj);
      if (!typeArr.includes(type)) {
        return;
      }
      contxt.emit('setRightPopup');
      dialogVisible[type] = !dialogVisible[type];
    };

    // 切换标注文本标签显示
    const [labelVisible, toggleMarkerLabel] = useToggleMarkerLabel();

    // 定位
    const getLngLat = () => {
      contxt.emit('setCenter');
    };

    return {
      handleFollow,
      ...useGeolocation(),
      ...useSwitchLayer(),
      capturing,
      imgURL,
      handleCapture,
      downloadMapShoot,
      ...useZoom(),
      RangeFinderRef,
      handleMeasure,
      dialogVisible,
      toggleMapLegend,
      labelVisible,
      toggleMarkerLabel,
      getLngLat
    };
  },
});
</script>

<style lang="scss" module src="./styles/MapTools.scss" />
