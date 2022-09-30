<template>
  <section>
    <!-- 顶部标题 -->
    <header :class="$style['header-view']">
      <i :class="$style.transformation" @click="handleTransformation" />
      <section>
        <span @click="setStartOrEnd('start')"></span>
        <input
          v-model="startingPoint.pointName"
          type="text"
          :class="{
            [$style['input-move']]: isTransformating,
          }"
          @input="onHandleStartingPointInput"
          @focus="inpFocus('start')"
        />
        <i
          :class="{
            [$style['clear-icon']]: startingPoint.pointName,
          }"
          @click="startingPointPointVal('start')"
        />
        <ul
          :class="[
            {
              [$style['ul-visible']]: startingPointSearchResultList.length != 0,
            },
          ]"
        >
          <li
            v-for="(liItem, liIndex) in startingPointSearchResultList"
            :key="liIndex"
            :class="{
              [$style['li--active']]: searchResultActiveIndex === liIndex,
            }"
            @click="onHandleStartingPointClick(liItem)"
            @mouseover="searchResultActiveIndex = liIndex"
            @mouseleave="searchResultActiveIndex = ''"
          >
            <label>{{ liItem.name }}</label>
          </li>
        </ul>
      </section>
      <section>
        <span @click="setStartOrEnd('end')"></span>
        <input
          v-model="terminalPoint.pointName"
          type="text"
          :class="{
            [$style['input-move']]: isTransformating,
          }"
          @input="onHandleTerminalPointInput"
          @focus="inpFocus('end')"
        />
        <i
          :class="{
            [$style['clear-icon']]: terminalPoint.pointName,
          }"
          @click="startingPointPointVal('end')"
        />
        <ul
          :class="[
            {
              [$style['ul-visible']]: terminalPointSearchResultList.length != 0,
            },
          ]"
        >
          <li
            v-for="(liItem, liIndex) in terminalPointSearchResultList"
            :key="liIndex"
            :class="{
              [$style['li--active']]: searchResultActiveIndex === liIndex,
            }"
            @click="onHandleTerminalPointClick(liItem)"
            @mouseover="searchResultActiveIndex = liIndex"
            @mouseleave="searchResultActiveIndex = ''"
          >
            <label>{{ liItem.name }}</label>
          </li>
        </ul>
      </section>
    </header>
    <main :class="$style['main-view']" v-if="mapRouteResultList.length !== 0">
      <el-collapse>
        <el-collapse-item
          v-for="(collapseItem, collapseIndex) in mapRouteResultList"
          @mouseenter="enter(collapseItem)"
          :key="collapseIndex"
        >
          <template #title>
            <div>
              <label>{{
                (collapseIndex === 0 ? '推荐' : '') +
                (collapseIndex != 0 ? `方案${collapseIndex + 1}` : '')
              }}</label>
              <span @click.stop="share(collapseItem)">分享</span>
              <!-- <span @click.stop="flyingPatrol(collapseItem)">路线飞巡</span> -->
              <span @click.stop="routeSearch(collapseItem)">路线检索</span>
            </div>
            <p>
              <span>约{{ calculationDuration(collapseItem.duration) }}</span>
              <span>约{{ calculationDistance(collapseItem.distance) }}</span>
            </p>
            <!-- <p>途径：珠江西路、猎德大桥</p> -->
          </template>
          <div :class="$style['start-point']">
            {{ startingPoint.pointName }}
          </div>
          <div
            v-for="(stepItem, stepIndex) in collapseItem?.steps"
            :key="stepIndex"
            :class="[
              {
                [$style['turn-left']]:
                  stepItem?.action?.search &&
                  stepItem?.action?.search('左') != -1,
              },
              {
                [$style['turn-right']]:
                  stepItem?.action?.search &&
                  stepItem?.action?.search('右') != -1,
              },
              {
                [$style['turn-back']]:
                  stepItem?.action?.search &&
                  stepItem?.action?.search('掉') != -1,
              },
              {
                [$style['go-straight']]:
                  stepItem?.action?.search &&
                  stepItem?.action?.search('直') != -1,
              },
            ]"
            :style="{
              'padding-left':
                (stepItem?.action?.search &&
                  stepItem?.action?.search('左') == -1 &&
                  stepItem?.action?.search('右') == -1 &&
                  stepItem?.action?.search('掉') == -1 &&
                  stepItem?.action?.search('直') == -1) ||
                stepItem?.action?.length == 0 ||
                !stepItem?.action
                  ? '40px'
                  : '',
              'border-bottom': '1px solid rgba(255,255,255,0.15)',
              'white-space': 'nowrap',
            }"
            v-html="stepItem.instruction"
          >
          </div>
          <div :class="$style['terminal-point']">
            {{ terminalPoint.pointName }}
          </div>
        </el-collapse-item>
      </el-collapse>
    </main>
    <!-- 历史记录 要根据聚焦输入框的不同显示不同的历史记录,即起点的历史记录要和终点的历史记录分开 -->
    <div v-show="historyFlag && mapRouteResultList.length === 0">
      <RetrievalRecord
        :historyData="historyData"
        @deleteHistory="deleteHistory"
        @selectLi="selectLi"
      />
    </div>
  </section>

  <div :class="$style.fiexd">
    <component
      :is="'RightPopup'"
      :visible="RightPopupFlag"
      @sendMsg="getRightPopupMsg"
      @close="closeRightPopup"
      ref="RightPopups"
    />
    <!-- <RightPopup
      ref="RightPopups"
      v-show="RightPopupFlag"
    /> -->
  </div>
</template>

<script>
import { defineComponent, ref, inject, getCurrentInstance, watch } from 'vue';
import { useStore } from 'vuex';
import RetrievalRecord from '@/product/CommandBrain3.0/FunModule/ResourceRetrieval/modules/RetrievalRecord/RetrievalRecord.vue';
import RightPopup from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/components/RightPopup.vue';
import SelectContact from '@/product/CommandBrain3.0/Generalparts/SelectContact/SelectContact.vue';
import script from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/script';

export default defineComponent({
  name: 'MapRoute',
  components: {
    RetrievalRecord,
    RightPopup,
  },
  props: {
    // 地图路线ActiveInde
    mapRouteActiveIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    // 获取全局
    const instance = getCurrentInstance();
    const store = useStore(); // 使用vuex
    const modelName = 'route';
    const {
      RightPopups,
      solrParams,
      coverObj,
      RightPopupObj,
      lineAndNoodlesData,
      RightPopupFlag,
      centerCircle,
      renderCircle,
      renderLine,
      getRightPopupMsg,
      solrData,
      loadingMap,
      closeRightPopup,
    } = script(instance, store, modelName);
    // 起点关键字
    const startingPoint = inject('startingPoint');
    // 终点关键字
    const terminalPoint = inject('terminalPoint');
    const $addDialog = inject('$addDialog');
    // 是否正在转换起始点输入值
    const isTransformating = ref(false);
    // 起点输入框搜索结果
    const startingPointSearchResultList = ref([]);
    // 终点输入框搜索结果
    const terminalPointSearchResultList = ref([]);
    // 输入框搜索结果ActiveIndex
    const searchResultActiveIndex = ref('');
    // 地铁路径搜索结果
    const mapRouteResultList = ref([]);
    // 分享当前的路径信息
    const pathInformation = ref({});
    watch(
      startingPoint,
      (newValue, oldValue) => {
        if (!startingPoint.value.pointName) {
          mapRouteResultList.value = [];
        }
      },
      { deep: true },
    );
    watch(
      terminalPoint,
      (newValue, oldValue) => {
        if (!terminalPoint.value.pointName) {
          mapRouteResultList.value = [];
        }
      },
      { deep: true },
    );
    // 渲染路线的数据集合
    const laneCovNameArr = ref([]);
    // 控制历史记录的显示
    const historyFlag = ref(false);
    // 历史记录显示的数据
    const historyData = ref([]);
    // 单前显示的历史记录是开始 or 结束的
    const historyState = ref('');
    // 路线检索
    function routeSearch(collapseItem) {
      let spotData = [];
      if (collapseItem.steps) {
        spotData = collapseItem.steps.reduce((pre, x) => {
          pre = pre.concat(x.transFromLonLatSpot);
          return pre;
        }, []);
      }
      loadingMap();
      getRightPopupMsg({
        data: spotData,
        type: 'selectPath',
      });
      // 显示左侧弹窗
      RightPopupFlag.value = true;
      // 进行缓冲区绘制
      RightPopupObj.value = {
        address: {
          result: {
            formatted_address: startingPoint.value.pointName,
          },
        },
        endAddress: {
          result: {
            formatted_address: terminalPoint.value.pointName,
          },
        },
        selfModel: {
          active: true,
          icon: 'freeLine',
          name: '自由线',
          type: 'freeLine',
        },
      };
      if (RightPopups.value) {
        RightPopups.value.selfModel = {
          ...RightPopupObj.value,
          ...RightPopupObj.value.selfModel,
        };
      }
    }
    // 分享
    function share(collapseItem) {
      $addDialog('选择联系人', SelectContact, {
        pathInformation,
      });
      pathInformation.value = collapseItem;
      pathInformation.value.mapType = props.mapRouteActiveIndex;
      pathInformation.value.startingPoint = startingPoint.value.pointName;
      pathInformation.value.startingPointLonLat =
        startingPoint.value.transFromLonLat;
      pathInformation.value.terminalPoint = terminalPoint.value.pointName;
      pathInformation.value.terminalPointLonLat =
        terminalPoint.value.transFromLonLat;
    }
    // 路线飞巡
    function flyingPatrol(collapseItem) {
     console.log(collapseItem);
    }
    return {
      startingPoint,
      terminalPoint,
      isTransformating,
      startingPointSearchResultList,
      terminalPointSearchResultList,
      searchResultActiveIndex,
      mapRouteResultList,
      laneCovNameArr,
      // 历史记录
      historyFlag,
      historyData,
      historyState,
      // 检索
      routeSearch,
      RightPopupFlag,
      loadingMap,
      getRightPopupMsg,
      closeRightPopup,
      RightPopupObj,
      RightPopups,
      // 分享
      share,
      pathInformation,
      // 路线飞巡
      flyingPatrol,
    };
  },
  methods: {
    // 转换起始点输入值
    handleTransformation() {
      this.isTransformating = true;
      setTimeout(() => {
        this.isTransformating = false;
        const tempPoint = this.terminalPoint;
        this.terminalPoint = this.startingPoint;
        this.startingPoint = tempPoint;
        Promise.all([
          window.map.getFilterIdMark(
            window.mapCoverageName.mark,
            this.terminalPoint.spot,
          ),
          window.map.getFilterIdMark(
            window.mapCoverageName.mark,
            this.startingPoint.spot,
          ),
        ]).then((res) => {
          console.log(res);
          window.map.setOneMarkerStyle(res[0], {
            wd: 40,
            hg: 40,
            src: require('./assets/end.svg'),
          });
          window.map.setOneMarkerStyle(res[1], {
            wd: 40,
            hg: 40,
            src: require('./assets/start.svg'),
          });
          this.searchMapRoute();
        });
      }, 500);
    },
    // 起点输入框输入回调
    onHandleStartingPointInput() {
      const that = this;
      window.map.searchPOIdata(that.startingPoint.pointName).then((res) => {
        console.log('searchPOIdatasearchPOIdata', res);
        this.startingPointSearchResultList = res;
      });
    },
    // 终点输入框输入回调
    onHandleTerminalPointInput() {
      const that = this;
      window.map.searchPOIdata(that.terminalPoint.pointName).then((res) => {
        console.log('searchPOIdatasearchPOIdata', res);
        this.terminalPointSearchResultList = res;
      });
    },
    // 设置落点
    setSpot(location, src, flag = true) {
      let promise = new Promise((resolve, reject) => {
        let cententData = {
          longitude: location[0],
          latitude: location[1],
          wd: 40,
          hg: 40,
          src: src,
        };
        if (flag) {
          window.map.getMapMaxZoom().then((r) => {
            window.map.setCentent(cententData, r);
          });
        }
        window.map
          .setOneMarker(window.mapCoverageName.mark, cententData)
          .then((r) => {
            resolve(r);
          });
      });
      return promise;
    },
    // 选中起点输入框搜索结果
    onHandleStartingPointClick(liItem) {
      let location = liItem.transFromLonLat.split(',');
      this.setSpot(location, require('./assets/start.svg')).then((r) => {
        this.startingPoint.spot = r?.icon?.imageDiv.id;
      });
      this.startingPoint.data = JSON.parse(JSON.stringify(liItem));
      this.startingPoint.pointName = liItem.name || liItem.pointName;
      this.startingPoint.location = liItem.location;
      this.startingPoint.transFromLonLat = liItem.transFromLonLat;
      this.startingPointSearchResultList = [];
      if (this.startingPoint.pointName && this.terminalPoint.pointName) {
        this.searchMapRoute();
      }
    },
    // 选中终点输入框搜索结果
    onHandleTerminalPointClick(liItem) {
      let location = liItem.transFromLonLat.split(',');
      this.setSpot(location, require('./assets/end.svg')).then((r) => {
        this.terminalPoint.spot = r?.icon?.imageDiv.id;
      });
      this.terminalPoint.data = JSON.parse(JSON.stringify(liItem));
      this.terminalPoint.pointName = liItem.name || liItem.pointName;
      this.terminalPoint.location = liItem.location;
      this.terminalPoint.transFromLonLat = liItem.transFromLonLat;
      this.terminalPointSearchResultList = [];
      if (this.startingPoint.pointName && this.terminalPoint.pointName) {
        this.searchMapRoute();
      }
    },
    // 渲染行车线
    renderLaneLine(data, sourceData) {
      // 清楚里面的图层
      this.laneCovNameArr.forEach((e) => {
        window.map.clearDeleteCoverage(e);
      });
      this.laneCovNameArr = [];
      let oneCovName = '';
      data.forEach((e, i) => {
        // console.log(e);
        let color = '#97a09e';
        let covName = `laneLine_${Math.floor(Math.random() * 100000000)}_${i}`;
        sourceData[i].covName = covName;
        // 新建了那些图层，保存图层名
        this.laneCovNameArr.push(covName);
        window.map.createdVectorCoverage(covName);
        if (i === 0) {
          oneCovName = covName;
          color = '#08c189';
        }
        let obj = {
          type: 'SuperMap.Geometry.GeoPolyline',
          cps: {
            controlPoints: e,
          },
          style: {
            strokeColor: color,
            strokeWidth: 5,
            fillColor: 'skyblue',
            fillOpacity: 0.5,
            fontColor: 'pink',
            fontSize: '20px',
          },
          id: covName,
        };
        window.map.renderGraph(covName, [obj], '');
      });
      console.log(this.laneCovNameArr);
      window.map.setMapCovzIndex(oneCovName);
    },
    // 储存历史记录
    saveHistory(r) {
      let location = localStorage.getItem('historyLocation');
      if (location) {
        location = JSON.parse(location);
        let startSpot = location.startingPoint.filter(
          (e) => e.transFromLonLat === r[0].data.transFromLonLat,
        );
        let endSpot = location.terminalPoint.filter(
          (e) => e.transFromLonLat === r[1].data.transFromLonLat,
        );
        if (!startSpot.length) {
          location.startingPoint.push(r[0].data);
        }
        if (!endSpot.length) {
          location.terminalPoint.push(r[1].data);
        }
      } else {
        location = { startingPoint: [r[0].data], terminalPoint: [r[1].data] };
      }
      localStorage.setItem('historyLocation', JSON.stringify(location));
    },
    searchMapRoute() {
      console.log(this.startingPoint);
      if (
        (!this.startingPoint.pointName && !this.terminalPoint.pointName) ||
        !this.startingPoint.transFromLonLat ||
        !this.terminalPoint.transFromLonLat
      ) {
        return false;
      }
      const data = {
        origin:
          (this.startingPoint.longitude ||
            this.startingPoint.transFromLonLat.split(',')[0]) +
          ',' +
          (this.startingPoint.latitude ||
            this.startingPoint.transFromLonLat.split(',')[1]),
        destination:
          (this.terminalPoint.longitude ||
            this.terminalPoint.transFromLonLat.split(',')[0]) +
          ',' +
          (this.terminalPoint.latitude ||
            this.terminalPoint.transFromLonLat.split(',')[1]),
      };
      let driveType;
      this.saveHistory([this.startingPoint, this.terminalPoint]);
      // console.log('this.mapRouteActiveIndex', this.mapRouteActiveIndex);
      switch (this.mapRouteActiveIndex) {
        case 0:
          driveType = 'walk';
          break;
        case 1:
          driveType = 'cycling';
          break;
        case 2:
          driveType = 'drive';
          break;
        default:
      }
      this.loadingMap();
      window.map.pathPlanning(data, driveType).then((res) => {
        this.inpBlur();
        console.log('pathPlanning res', res);
        if (res.route && res.route.paths) {
          let data = res.route.paths;
          let allLine = data.reduce((pre, e) => {
            let lineData = [];
            e.steps.forEach((x) => {
              lineData.push(x.transFromLonLat);
            });
            let lineStr = lineData.join(';');
            let lineStrData = lineStr.split(';');
            // 把数据处理成地图所需要的格式
            let handleDATA = lineStrData.reduce((pres, x) => {
              let splitData = x.split(',');
              let obj = {
                x: Number(splitData[0]),
                y: Number(splitData[1]),
              };
              pres.push(obj);
              return pres;
            }, []);
            pre.push(handleDATA);
            return pre;
          }, []);
          this.renderLaneLine(allLine, data);
          this.mapRouteResultList = data;
        }
      });
    },
    // 输入框清空时
    startingPointPointVal(type) {
      if (type === 'start') {
        this.startingPoint.pointName = '';
        this.startingPointSearchResultList = [];
        this.clearPathingData(type);
        this.startingPoint = {};
      } else {
        this.terminalPoint.pointName = '';
        this.terminalPointSearchResultList = [];
        this.clearPathingData(type);
        this.terminalPoint = {};
      }
      this.loadingMap();
      this.RightPopupFlag = false;
      this.mapRouteResultList = [];
    },
    // 清空路径规划所用到的图层的落点数据和线的数据
    clearPathingData(type) {
      console.log(type);
      // 清楚里面的图层
      this.laneCovNameArr.forEach((e) => {
        window.map.clearDeleteCoverage(e);
      });
      this.laneCovNameArr = [];
      // 清除落点
      if (type === 'start' && this.startingPoint.spot) {
        window.map
          .getFilterIdMark(window.mapCoverageName.mark, this.startingPoint.spot)
          .then((r) => {
            console.log(r);
            window.map.removeMark(r);
          });
      } else if (type === 'end' && this.terminalPoint.spot) {
        window.map
          .getFilterIdMark(window.mapCoverageName.mark, this.terminalPoint.spot)
          .then((r) => {
            window.map.removeMark(r);
          });
      } else if (this.startingPoint.spot && this.terminalPoint.spot) {
        window.map
          .getFilterIdMark(window.mapCoverageName.mark, this.startingPoint.spot)
          .then((r) => {
            window.map.removeMark(r);
          });
        window.map
          .getFilterIdMark(window.mapCoverageName.mark, this.terminalPoint.spot)
          .then((r) => {
            window.map.removeMark(r);
          });
      }
    },
    // 渲染线颜色
    renderLane(covName, color, flag = false) {
      window.map.getCoverageData(covName).then((r) => {
        if (r.length !== 0) {
          let st = {
            strokeColor: color,
            strokeWidth: 5,
            fillColor: 'skyblue',
            fillOpacity: 0,
            fontColor: 'pink',
            fontSize: '20px',
          };
          window.map.setSingleStyle(r[0], st);
        }
      });
      window.map.reductionMapZindex(covName);
      if (flag) {
        window.map.setMapCovzIndex(covName);
      }
    },
    // 鼠标移入时
    enter(x) {
      this.mapRouteResultList.forEach((e) => {
        // 灰色
        this.renderLane(e.covName, '#97a09e');
      });
      // 绿色
      this.renderLane(x.covName, '#08c189', true);
    },
    // 设置起点或者终点
    setStartOrEnd(type) {
      console.log(type);
      let Img = '';
      if (type === 'start') {
        this.clearPathingData('start');
        Img = require('./assets/start.svg');
      } else {
        this.clearPathingData('end');
        Img = require('./assets/end.svg');
      }
      window.map.setMouseStyle(Img);
      // 获取点击的点信息
      window.map.clickDroppoint((res) => {
        let str = `${res.mapLocation.longitude},${res.mapLocation.latitude}`;
        let data = {
          name: res.res.result.formatted_address,
          transFromLonLat: str,
        };
        if (type === 'start') {
          this.startingPoint = { transFromLonLat: str };
          this.startingPoint.data = JSON.parse(JSON.stringify(data));
          this.startingPoint.pointName = res.res.result.formatted_address;
        } else {
          this.terminalPoint = { transFromLonLat: str };
          this.terminalPoint.data = JSON.parse(JSON.stringify(data));
          this.terminalPoint.pointName = res.res.result.formatted_address;
        }
        this.setSpot(str.split(','), Img, false).then((r) => {
          if (type === 'start') {
            this.startingPoint.spot = r?.icon?.imageDiv.id;
          } else {
            this.terminalPoint.spot = r?.icon?.imageDiv.id;
          }
          this.searchMapRoute();
        });
        // 恢复鼠标手
        window.map.restoreDefaultStyle();
        window.map.closeClickDroppoint();
      });
    },
    // 输入框聚焦
    inpFocus(type) {
      let location = localStorage.getItem('historyLocation');
      if (location) {
        location = JSON.parse(location);
      } else {
        location = { startingPoint: [], terminalPoint: [] };
      }
      if (type === 'start') {
        this.historyData = location.startingPoint;
      } else {
        this.historyData = location.terminalPoint;
      }
      console.log(type);
      this.historyState = type;
      this.historyFlag = true;
    },
    // 删除历史记录
    deleteHistory(obj) {
      let location = localStorage.getItem('historyLocation');
      if (location) {
        location = JSON.parse(location);
        console.log(obj);
        if (obj.type !== 'all') {
          if (this.historyState === 'start') {
            location.startingPoint.splice(obj.index, 1);
          } else {
            location.terminalPoint.splice(obj.index, 1);
          }
        } else {
          if (this.historyState === 'start') {
            location.startingPoint = [];
          } else {
            location.terminalPoint = [];
          }
        }
        localStorage.setItem('historyLocation', JSON.stringify(location));
        this.inpFocus(this.historyState);
      }
    },
    // 选择历史
    selectLi(item) {
      if (this.historyState === 'start') {
        this.onHandleStartingPointClick(item);
      } else {
        this.onHandleTerminalPointClick(item);
      }
      this.inpBlur();
    },
    // 失去焦点时
    inpBlur() {
      this.historyFlag = false;
    },
    // 计算距离
    calculationDistance(distance) {
      if (distance > 1000) {
        return `${Math.round((distance / 1000) * 100) / 100}公里`;
      } else {
        return `${distance}米`;
      }
    },
    // 计算时间
    calculationDuration(duration) {
      if (duration / 60 > 60) {
        return `${Math.round((duration / 60 / 60) * 100) / 100}小时`;
      } else {
        return `${Math.round((duration / 60) * 100) / 100}分钟`;
      }
    },
  },
  mounted() {
    if (this.startingPoint || this.terminalPoint) {
      if (this.startingPoint.transFromLonLat) {
        this.onHandleStartingPointClick(this.startingPoint);
      }
      if (this.terminalPoint.transFromLonLat) {
        this.onHandleTerminalPointClick(this.terminalPoint);
      }
    }
  },
  unmounted() {
    this.clearPathingData();
  },
});
</script>

<style lang="scss" module>
.header-view {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  padding-left: 37px;
  & .transformation {
    display: inline-block;
    position: absolute;
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    width: 17px;
    height: 16px;
    background: url(./assets/transformation-icon.svg) no-repeat center/100% 100%;
  }
  & input {
    width: 75%;
    height: 40px;
    background: transparent;
    outline: none;
    border: none;
    color: #ffffff;
  }
  & section:nth-of-type(1) {
    display: flex;
    align-items: center;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    & > span {
      cursor: pointer;
      content: '';
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 10px;
      background: url(./assets/starting-point-icon.svg) no-repeat center/100%
        100%;
    }
    & .input-move {
      position: relative;
      animation: toBottom 1s 1;
    }
    & ul {
      position: absolute;
      left: 34px;
      top: 43px;
    }
  }
  @keyframes toBottom {
    0% {
      top: 0px;
    }
    50% {
      top: 40px;
    }
    100% {
      top: 0px;
    }
  }
  & section:nth-of-type(2) {
    display: flex;
    align-items: center;
    position: relative;
    & > span {
      cursor: pointer;
      content: '';
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 10px;
      background: url(./assets/terminal-point-icon.svg) no-repeat center/100%
        100%;
    }
    & .input-move {
      position: relative;
      animation: toTop 1s 1;
    }
    & ul {
      position: absolute;
      left: 34px;
      top: 43px;
    }
  }
  @keyframes toTop {
    0% {
      top: 0px;
    }
    50% {
      top: -40px;
    }
    100% {
      top: 0px;
    }
  }
  & .clear-icon {
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    cursor: pointer;
    background: url(./assets/clear.svg) center/100% 100%;
  }
  & ul {
    max-height: 230px;
    overflow: auto;
    width: 250px;
    border: 1px solid #00c1de;
    border-top: 0px;
    font-size: black;
    color: #ffffff;
    background: rgba(0, 0, 0);
    z-index: 999;
    transition: all 1s;
    transform-origin: 190px 0px;
    transform: scaleY(0);
    &.ul-visible {
      transform: scaleY(1);
    }
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
      border-top: 1px solid #00c1de;
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
          background: url(./assets/place-icon.svg) no-repeat center/100% 100%;
        }
      }
    }
  }
}
.main-view {
  & .start-point {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    &::before {
      content: '';
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid #0bd295;
      border-radius: 50%;
      box-sizing: border-box;
      margin: 0px 8px 0px 16px;
    }
  }
  & .turn-left {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    &::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 11px;
      background: url(./assets/turn-left-icon.svg) no-repeat center/100% 100%;
      margin: 0px 8px 0px 16px;
    }
  }
  & .turn-right {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    &::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 11px;
      background: url(./assets/turn-right-icon.svg) no-repeat center/100% 100%;
      margin: 0px 8px 0px 16px;
    }
  }
  & .turn-back {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    &::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 11px;
      background: url(./assets/turn-back-icon.svg) no-repeat center/100% 100%;
      margin: 0px 8px 0px 16px;
    }
  }
  & .go-straight {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    &::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 11px;
      background: url(./assets/go-straight-icon.svg) no-repeat center/100% 100%;
      margin: 0px 8px 0px 16px;
    }
  }
  & .terminal-point {
    &::before {
      content: '';
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid #f66e6e;
      border-radius: 50%;
      box-sizing: border-box;
      margin: 0px 8px 0px 16px;
    }
  }
}
.fiexd {
  position: fixed;
  right: 0;
  bottom: 0;
}
</style>
<style lang="scss" scoped>
::v-deep(.el-collapse) {
  border-left: initial;
  border-right: initial;
  border-top: initial;
  border-bottom: initial;
  max-height: 600px;
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
}
::v-deep(.el-collapse-item__header) {
  height: initial;
  flex-wrap: wrap;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  & > div {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 10px;
    & label {
      color: #ffffff;
      padding: 2px 12px;
      background: #00c1de;
      margin-left: 6px;
    }
    & span {
      color: #56e9ff;
      border: 1px solid #00c1de;
      cursor: pointer;
      border-radius: 10px;
    }
    & span:nth-of-type(1) {
      margin-right: 6px;
      padding: 2px 5px;
      margin-left: auto;
    }
    & span:nth-of-type(2) {
      margin-right: 10px;
      padding: 2px 17px;
    }
  }
  & > p {
    color: #ffffff;
    margin-top: 10px;
    padding-left: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  & p:nth-of-type(1) {
    display: flex;
    & span:nth-of-type(1) {
      margin-right: 8px;
    }
    & span:nth-of-type(2) {
      display: flex;
      align-items: center;
      &::before {
        content: '';
        display: inline-block;
        width: 1px;
        height: 14px;
        background: rgba(216, 216, 216, 0.2);
        margin-right: 8px;
      }
    }
  }
}
::v-deep(.el-collapse-item__wrap) {
  background: transparent;
  max-height: 510px;
  overflow: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
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
}
::v-deep(.el-collapse-item__content) {
  padding-bottom: initial;
  & > div {
    color: #ffffff;
    min-height: 40px;
    display: flex;
    align-items: center;
  }
}
</style>
