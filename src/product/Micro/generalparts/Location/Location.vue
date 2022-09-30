<template>
  <div class="location">
    <template v-if="!displayOnly">
      <div class="location__search">
        <input
          class="location__search__inner"
          placeholder="请输入要搜索的地点"
          v-model="searchKeyword"
          @input="handleSearch"
          @keydown="handleSearch"
        />
        <div class="location__search__button" @click="handleSearch"></div>
        <div
          class="location__search__result"
          v-if="searchKeyword"
          ref="searchResultContainer"
        >
          <span v-if="searchState.state && searchResult.length === 0"
            >&nbsp;&nbsp;正在搜索...</span
          >
          <span v-else-if="searchState.usedState && searchResult.length === 0"
            >&nbsp;&nbsp;没有搜索到数据</span
          >
          <ul v-else>
            <li
              v-for="(res, index) in searchResult"
              :key="index"
              @click="handleClickSearchResult(res)"
            >
              {{ res.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="location__hint">注：可鼠标点击手动定位</div>
    </template>
    <div class="location__map" ref="map" :id="uuid"></div>
    <div class="location__address">
      {{ currentAddress }}
      <el-button class="sbs-button location__confirm" plain @click="confirm" v-if="!displayOnly"
        >确定位置</el-button
      >
    </div>
  </div>
</template>

<script>
import handleMap from '@/capacity/mapJs/handleMapFun';
import icon from './location.png';
import $cookie from 'js-cookie';

/* eslint-disable */
export default {
  name: 'location',
  props: {
    // 初始地址
    address: {
      type: String,
      default: '',
    },
    // 初始经纬度
    lngLat: {
      type: Array,
    },
    // 只查看，不能搜索和定位
    displayOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uuid: `supermap_${~~(Math.random() * 1000)}`,
      // 当前的地图对象
      currentMap: '',
      // 当前地址
      currentAddress: '',
      // 当前经纬度
      currentLngLat: '',
      // 初始中心点所在的城市，用于限定搜索范围
      currentCity: '',
      // 搜索关键词
      searchKeyword: '',
      searchResult: [],
      // 当前的搜索组件对象
      currentPlaceSearch: '',
      // 当前的点击落点
      currentMarker: '',
      // 搜索状态
      searchState: {
        state: false,
        usedState: false,
      },
      // 点的详细信息
      spotInfo: {},
    };
  },
  methods: {
    /**
     * @method
     * @desc 初始化地图
     */
    init() {
      // 初始化并挂载超图（使用天地图图层）
      console.log(this.currentLngLat);
      const map = (this.currentMap = new handleMap().init(this.uuid, '矢量'));
      map.setCentent(
        // 初始中心点
        {
          longitude: this.currentLngLat[0],
          latitude: this.currentLngLat[1],
        },
        // 缩放级别
        15,
      );
      map.createdMarkCoverage('落点').then(() => {
        // if (this.address) {
        map.setOneMarker('落点', {
          longitude: this.currentLngLat[0],
          latitude: this.currentLngLat[1],
          wd: 25,
          hg: 30,
          src: icon,
        });
        // }
      });
      // 不是单纯展示的时候，增加点击定位操作
      if (!this.displayOnly) {
        map.clickDroppoint((res) => {
          // console.log(res);
          this.spotInfo = res.res.result.addressComponent;
          this.currentAddress = res.res.result.formatted_address;
          this.currentLngLat = [res.mapLocation.lon, res.mapLocation.lat];
          map.clearAtPresentMarkData('落点').then(() => {
            map.setOneMarker('落点', {
              longitude: this.currentLngLat[0],
              latitude: this.currentLngLat[1],
              wd: 25,
              hg: 30,
              src: icon,
            });
          });
        });
      }
    },
    /**
     * @method
     * @desc 确认位置，向父组件传递地址和经纬度
     */
    confirm() {
      if (
        this.currentLngLat[0] &&
        this.currentLngLat[1] &&
        this.currentAddress
      ) {
        this.$emit(
          'confirm',
          this.currentAddress,
          this.currentLngLat,
          this.spotInfo,
        );
      }
    },
    /**
     * @method
     * @desc 执行搜索
     */
    handleSearch() {
      this.searchState = {
        state: true,
        usedState: true,
      };
      this.currentMap.searchPOIdata(this.searchKeyword).then((res) => {
        if (res.length === 0) {
          this.searchState.state = false;
        }
        this.searchResult = res;
      });
    },
    async handleClickSearchResult(res) {
      this.searchKeyword = '';
      this.currentAddress =
        res.province + res.city + res.area + res.address + res.name;
      this.currentLngLat = res.location.split(',');
      if (window.config.mapConfig.mapBusiness === 'GD') {
        const transformResult = await this.currentMap.gdTrTdt(
          ...this.currentLngLat,
        );
        this.currentLngLat = [
          transformResult.longitude,
          transformResult.latitude,
        ];
        console.log(this.currentLngLat);
      }
      this.currentMap.setCentent(
        // 初始中心点
        {
          longitude: this.currentLngLat[0],
          latitude: this.currentLngLat[1],
        },
        // 缩放级别
        15,
      );
      this.currentMap.clearAtPresentMarkData('落点').then(() => {
        this.currentMap.setOneMarker('落点', {
          longitude: this.currentLngLat[0],
          latitude: this.currentLngLat[1],
          wd: 25,
          hg: 30,
          src: icon,
        });
      });
    },
  },
  mounted() {
    // 有初始值使用初始值，没有则使用平台的经纬度和地址
    console.log(this.lngLat);
    this.currentLngLat =
      this.lngLat[0] && this.lngLat[1]
        ? this.lngLat
        : [$cookie.get('longitude'), $cookie.get('latitude')];
    this.currentAddress = this.address ? this.address : '';
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {
    address: function (val) {
      this.currentLngLat =
        this.lngLat[0] && this.lngLat[1]
          ? this.lngLat
          : [$cookie.get('longitude'), $cookie.get('latitude')];
      this.currentAddress = this.address ? this.address : '';
      this.currentMap.clearAtPresentMarkData('落点').then(() => {
        if (this.address) {
          this.currentMap.setOneMarker('落点', {
            longitude: this.currentLngLat[0],
            latitude: this.currentLngLat[1],
            wd: 25,
            hg: 30,
            src: icon,
          });
          this.currentMap.setCentent(
            // 初始中心点
            {
              longitude: this.currentLngLat[0],
              latitude: this.currentLngLat[1],
            },
            // 缩放级别
            15,
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.location {
  position: relative;
  color: #666666;
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  &__search {
    transition: all 0.1s;
    border: 1px solid #dddddd;
    &:hover {
      border: 1px solid #b4b4b4;
    }
    &:focus-within {
      border: 1px solid #0091ff;
    }
    border-radius: 3px;
    display: flex;
    width: 250px;
    height: 30px;
    line-height: 30px;
    padding-left: 5px;
    font-size: 14px;
    margin-bottom: 15px;
    position: relative;
    &__inner {
      border: none;
      outline: none;
      flex: 1;
      &::-webkit-input-placeholder {
        color: #dddddd;
      }
    }
    &__button {
      width: 40px;
      height: 100%;
      background: #dddddd;
      cursor: pointer;
      position: relative;
      &::after {
        content: '';
        background: no-repeat center/100% 100%
          url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjAwNzM3MDEyMDkzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1MzMiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTg4My42MjY2NjcgODIzLjA0bC0xNDUuMDY2NjY3LTE0NC42NEEzMzcuOTIgMzM3LjkyIDAgMCAwIDgxMC42NjY2NjcgNDY5LjMzMzMzM2EzNDEuMzMzMzMzIDM0MS4zMzMzMzMgMCAxIDAtMzQxLjMzMzMzNCAzNDEuMzMzMzM0IDMzNy45MiAzMzcuOTIgMCAwIDAgMjA5LjA2NjY2Ny03Mi4xMDY2NjdsMTQ0LjY0IDE0NS4wNjY2NjdhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMCA2MC41ODY2NjcgMCA0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwIDAtNjAuNTg2NjY3ek0yMTMuMzMzMzMzIDQ2OS4zMzMzMzNhMjU2IDI1NiAwIDEgMSAyNTYgMjU2IDI1NiAyNTYgMCAwIDEtMjU2LTI1NnoiIHAtaWQ9IjE1MzQiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4=);
        display: block;
        width: 20px;
        height: 20px;
        position: absolute;
        right: 10px;
        top: 3px;
      }
      &:active::after {
        top: 4px;
      }
    }
    &:hover &__button {
      background: #b4b4b4;
    }
    &:focus-within &__button {
      background: #0091ff;
    }
    &__result {
      width: calc(100% + 2px);
      max-height: 400px;
      border-radius: 6px;
      background: #ffffff;
      box-shadow: 0px 5px 5px 3px rgba(0, 0, 0, 0.1);
      position: absolute;
      z-index: 2;
      left: -1px;
      top: 30px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0;
      }
      & > ul {
        list-style: none;
        cursor: pointer;
        margin: 0;
        padding: 10px;
        & > li {
          &:hover {
            color: #0091ff;
          }
        }
      }
    }
  }
  &__hint {
    position: absolute;
    top: 45px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: rgba(245, 248, 255, 0.86);
    z-index: 1;
    user-select: none;
  }
  &__map {
    width: 100%;
    min-height: 574px;
    flex: 1;
  }
  &__address {
    width: calc(100% - 150px);
    min-height: 50px;
    position: relative;
    margin: 15px 70px;
    &::before {
      content: '地址名称：';
      display: block;
      width: 70px;
      height: 50px;
      position: absolute;
      left: -70px;
      top: 0;
    }
  }
  &__confirm {
    position: absolute;
    right: -80px;
    top: 0;
  }
}
</style>