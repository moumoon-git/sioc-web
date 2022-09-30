<template>
  <HeaderSearch
    v-if="!isShowSearch"
    v-model="searchVlaue"
    v-bind="$attrs"
    :search-result="searchResultMock"
    @change="change"
    @click="showPoint"
  />
  <FlightPatrol
    v-if="controlDisplay"
    :point-data="pointData"
    title="巡查点详情"
    @close="handleClose"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FlightPatrol from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightPatrol.vue';
import HeaderSearch from './Search.vue';
import { getFlightPatrolSearch } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';

export default defineComponent({
  name: 'Flightheader',
  components: {
    HeaderSearch,
    FlightPatrol,
  },
  props: {},
  data() {
    return {
      searchResultMock: [],
      searchVlaue: '', // 搜索
      searchArrTemp: [],
      controlDisplay: false,
      pointData: {} as any, // 资源检索传递的点的数据
      isShowSearch: (window as any).config.isShenXianProject,
    };
  },
  methods: {
    handleClose() {
      this.controlDisplay = false;
    },
    change(e: string): void {
      this.controlDisplay = false;
      (window as any).map.searchPOIdata(e as any).then((res: any) => {
        this.searchResultMock = res;
        this.showSearchPoint(this.searchResultMock);
      });
    },
    // 创建搜索点的图层并在地图显示搜索点的图标
    showSearchPoint(arr: Array<any>): void {
      const tempArr: Array<any> = []; // 规范后的点数据数组
      if (arr && arr.length > 0) {
        (this.searchArrTemp as any) = arr;
        arr.forEach((item, index) => {
          const tempItem: any = {};
          tempItem.longitude = item.transFromLonLat.slice(0, 18);
          tempItem.latitude = item.transFromLonLat.slice(19, 36);
          tempItem.wd = 44;
          tempItem.Hg = 50;
          // eslint-disable-next-line import/no-dynamic-require
          tempItem.src = require(`./assets/pointIcon/iconr${index + 1}.svg`);
          tempItem.imgInfo = item;
          tempArr.push(tempItem);
        });
        (window as any).map.setMultiMarker(
          (window as any).mapCoverageName.search,
          tempArr,
          {
            click(e: any, mark: any) {
              console.log(mark);
            },
          },
        );
      } else {
        (window as any).map.clearAtPresentMarkData(
          (window as any).mapCoverageName.search,
        );
      }
    },
    // 点击列表
    showPoint(data: any): void {
      let lastNumber;
      if (localStorage.getItem('lastNumber')) {
        lastNumber = localStorage.getItem('lastNumber'); // 上一次设置的搜索范围
      } else {
        lastNumber = 300;
      }

      this.controlDisplay = true;
      const tempArr = [];
      const tempAddr: string = data.transFromLonLat;
      const tempName = data.name;
      const lon: any = data.transFromLonLat.slice(0, 18);
      const lat: any = data.transFromLonLat.slice(19, 36);

      const params = {
        currentPage: 1,
        latitude: lat,
        longitude: lon,
        radius: 300 / 1000,
        resoureType: 101,
        solrType: 1,
      };
      getFlightPatrolSearch(params).then((response: any) => {
          const arr = response.data.monitorCameraVOS;
          this.pointData.cameraData = response.data.monitorCameraVOS
            ? response.data.monitorCameraVOS
            : [];
          this.pointData.appLabelDeviceVOS = response.data.appLabelDeviceVOS
            ? response.data.appLabelDeviceVOS
            : [];
          this.pointData.type = 'point';
          this.pointData.lon = lon;
          this.pointData.lat = lat;
          this.pointData.r = 300;
          // this.pointData.mapdata = this.tempLayerData;
        })
        .catch((error: any) => {
          (this as any).$message.error(
            `获取摄像头数据失败，错误信息：${error}`,
          );
        });
      (window as any).map.setCentent(
        {
          longitude: lon,
          latitude: lat,
        },
        15,
      );
      const tempLonlat: any = {};
      tempLonlat.longitude = lon;
      tempLonlat.latitude = lat;
      (window as any).map.clearAtPresentMarkData(
        (window as any).mapCoverageName.search,
      ); // 清空图层
      for (let i = 0; i < this.searchArrTemp.length; i++) {
        const tempItem: any = {};
        tempItem.longitude = (
          this.searchArrTemp[i] as any
        ).transFromLonLat.slice(0, 18);
        tempItem.latitude = (
          this.searchArrTemp[i] as any
        ).transFromLonLat.slice(19, 36);
        tempItem.wd = 44;
        tempItem.Hg = 50;
        tempItem.imgInfo = this.searchArrTemp[i];
        if (tempAddr === (this.searchArrTemp[i] as any).transFromLonLat) {
          // eslint-disable-next-line import/no-dynamic-require
          tempItem.src = require(`./assets/pointIcon/iconb${i + 1}.svg`);
        } else {
          // eslint-disable-next-line import/no-dynamic-require
          tempItem.src = require(`./assets/pointIcon/iconr${i + 1}.svg`);
        }
        tempArr.push(tempItem);
      }
      (window as any).map.setMultiMarker(
        (window as any).mapCoverageName.search,
        tempArr,
        {
          click(e: any, mark: any) {
            console.log(mark);
          },
        },
      );
    },
  },
});
</script>
