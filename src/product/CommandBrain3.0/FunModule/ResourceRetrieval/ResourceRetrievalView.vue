<template>
  <div
    :class="[
      $style.ResourceRetrievalView,
      { [$style['resource-retrieval-view-visible']]: keyword },
    ]"
  >
    <!-- 顶部搜索框和下拉框 -->
    <header>
      <Select
        v-if="!mapRouteVisible"
        v-model="searchType"
        :class="$style['visualization-right-select']"
        :clearable="false"
        :list="selectOptions"
        style="width: 20%; height: 100%"
        @change="handleSelectChange"
      />
      <Search
        ref="Search"
        v-model="keyword"
        v-model:mapRouteVisible="mapRouteVisible"
        v-model:mapRouteActiveIndex="mapRouteActiveIndex"
        placeholder="请输入搜索关键字"
        :style="{ width: mapRouteVisible ? '100%' : '80%', height: '100%' }"
        @change="handleInputChange"
        @onHandleMapRouteClick="onHandleMapRouteClick"
        @focus="focusFun"
        @blur="blurFun"
      />
    </header>
    <!-- 主体内容搜索结果 -->
    <main
      :class="[
        { [$style['main-visible']]: keyword || mainViewType === 'MapRoute' || focusFlag },
      ]"
    >
      <RetrievalList
        v-show="mainViewType === 'RetrievalList'"
        ref="RetrievalList"
        :retrievalList="retrievalList"
        v-model:resourceTypeActiveIndex="resourceTypeActiveIndex"
        v-model:retrievalDetail="retrievalDetail"
        @handleMapCovg="handleMapCovg"
        @handleResourceTypeChange="getRetrievalList"
        @changeIsOnline="changeIsOnline"
        @selectLi="selectLi"
      />
      <RetrievalDetail
        v-show="mainViewType === 'RetrievalDetail'"
        :retrievalDetail="retrievalDetail"
        :resourceTypeActiveIndex="resourceTypeActiveIndex"
        @handleResourceTypeChange="getRetrievalList"
      />
      <MapRoute
        v-if="mainViewType === 'MapRoute'"
        ref="MapRoute"
        :mapRouteActiveIndex="mapRouteActiveIndex"
      />
    </main>
    <!-- 区域搜索按钮 -->
    <div v-show="visRangeSearchBtn" :class="$style.rangeSearch" @click="rangeSearch" >搜索当前区域</div>
  </div>
</template>

<script>
import { defineComponent, ref, provide, watch } from 'vue';
import Select from '@/product/CommandBrain3.0/Generalparts/right/Select/Select.vue';
import Search from './components/Search/Search.vue';
import RetrievalList from './modules/RetrievalList/RetrievalList.vue';
import RetrievalDetail from './modules/RetrievalDetail/RetrievalDetail.vue';
import MapRoute from './modules/MapRoute/MapRoute.vue';
import {
  addFun,
} from '@/product/CommandBrain3.0/mainCapacity/windowEvent/windowEvent';
import { getRetrievalLists } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';

export default defineComponent({
  name: 'ResourceRetrievalView',
  components: {
    // 下拉框组件
    Select,
    // 搜索组件
    Search,
    // 检索列表组件
    RetrievalList,
    // 检索详情组件
    RetrievalDetail,
    // 地图路线输入框组件
    MapRoute,
  },
  data () {
    return{
      recordDis: {},
      visRangeSearchBtn: false,
      getListrequestParams: '',
    }
  },
  setup() {
    // 下拉框类型选项
    const searchType = ref(0);
    // 下拉框选项 ['关键字', '标签']
    const selectOptions = ref(['关键字']);
    // 搜索框关键字
    const keyword = ref('');
    // 资源类型activeindex
    const resourceTypeActiveIndex = ref(0);
    // 搜索结果列表
    const retrievalList = ref([]);
    // 地图路线输入框是否可见
    const mapRouteVisible = ref(false);
    // 控制mainView切换
    const mainViewType = ref('RetrievalList');
    const focusFlag = ref(false);
    // 存储点的经纬度
    const location = ref({});
    // 存储在线状态
    const isOnline = ref('');
    // 存储范围
    const polygon = ref({});
    watch(mapRouteVisible, (newValue, oldValue) => {
      if (newValue) {
        mainViewType.value = 'MapRoute';
      } else {
        mainViewType.value = 'RetrievalList';
      }
    });
    // 资源详情
    const retrievalDetail = ref({});
    provide('mainViewType', mainViewType);
    // 起点关键字
    const startingPoint = ref({ pointName: '' });
    provide('startingPoint', startingPoint);
    // 终点关键字
    const terminalPoint = ref({ pointName: '' });
    provide('terminalPoint', terminalPoint);
    // 地图路线ActiveInde
    const mapRouteActiveIndex = ref(0);
    const visibleState = ref({
      state:false,
      key:''
    });
    // 根据存储的key设置显示隐藏
    function setCovgVis(key = '') {
      const obj = visibleState.value;
      if(obj.key && obj.key !== key) {
        // 上一次的键
        if(obj.state) {
          window.map.setCoverageShow(obj.key);
        }else{
          window.map.setCoverageHide(obj.key);
        }
      }
    }
    watch(keyword,(newV)=>{
      console.log(newV);
      if (!newV) {
        // 清空之后再赋值的时候显示列表
        mainViewType.value = 'RetrievalList';
        window.map.clearAtPresentMarkData('资源搜索落点');
        window.map.clearAtPresentMarkData(window.mapCoverageName.retrievalMark)
        window.map.clearAtPresentVectorData(window.mapCoverageName.retrievalVector)
        setCovgVis()
        visibleState.value.state = false;
        visibleState.value.key = '';
      }
    });
    function focusFun () {
      focusFlag.value = true;
    }

    function blurFun () {
      setTimeout(()=>{
        focusFlag.value = false;
      },200);
    }
    function handleMapCovg(key) {
      if(visibleState.value.key === 116) {
        // 协作标绘的图层先进行清除
        window.map.clearAtPresentMarkData(window.mapCoverageName.retrievalMark)
        window.map.clearAtPresentVectorData(window.mapCoverageName.retrievalVector)
      } else {
        window.map.viewDisplay(key).then((visible)=>{
          setCovgVis(key);
          if(visibleState.value.key === key && visibleState.value.state === visible) {
            return
          }
          if(visible) {
            window.map.setCoverageHide(key);
          }else{
            window.map.setCoverageShow(key);
          }
          visibleState.value.state = visible
          visibleState.value.key = key || resourceTypeActiveIndex.value
        })
      }
    }
    return {
      searchType,
      selectOptions,
      keyword,
      resourceTypeActiveIndex,
      retrievalList,
      mapRouteVisible,
      focusFlag,
      focusFun,
      blurFun,
      mainViewType,
      retrievalDetail,
      mapRouteActiveIndex,
      location,
      isOnline,
      polygon,
      handleMapCovg,
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.map.clearDeleteCoverage('资源搜索落点');
      window.map.createdMarkCoverage('资源搜索落点');
    });
    // 鼠标左键抬起
    addFun('mouseup', (e) => {
      if (e.xy && window.xy) {
        const x = e.xy.x - window.xy.x;
        const y = e.xy.y - window.xy.y;
        if (Math.abs(x) < 200 && Math.abs(y) < 200 && this.retrievalList.length) {
          const computeX = this.recordDis.x + Math.abs(x);
          const computeY = this.recordDis.y + Math.abs(y);
          // 计算缓存和当前的移动距离超过200也进行切片
          if (computeX > 200 || computeY > 200) {
            // 显示搜索区域按钮
            this.visRangeSearchBtn = true;
          } else {
            // 没有超过200就进行存储
            this.recordDis = {
              x: computeX,
              y: computeY,
            }
          }
        } else if(this.retrievalList.length) {
          // 显示搜索区域按钮
          this.visRangeSearchBtn = true;
        }
      }
    });
  },
  methods: {
    // 下拉框回调函数
    handleSelectChange() {},
    // 输入框回调函数
    handleInputChange() {
      console.log(this.mainViewType);
      if (this.mainViewType === 'RetrievalList') {
        this.getRetrievalList();
      } else if(this.mainViewType === 'RetrievalDetail'){
        this.mainViewType = 'RetrievalList';
        this.getRetrievalList();
      }
    },
    // 进行检索历史数据的获取、修改、存储
    handleResourcesHistory(obj) {
      const resourcesHistory = localStorage.getItem('resourcesHistory');
      const data = resourcesHistory ? JSON.parse(resourcesHistory) : [];
      const diffArr = data.filter(x=> x.name === obj.name);
      if (!diffArr.length) {
        data.push(obj);
      }
      localStorage.setItem('resourcesHistory', JSON.stringify(data));
    },

    // 在线离线时的请求
    changeIsOnline(val, polygon) {
      this.isOnline = val;
      const obj = {
          resoureType: this.resourceTypeActiveIndex, // 资源类型
          keywords: this.keyword, // 搜索关键字
          currentPage: this.$refs.RetrievalList.currentPage,
          eventId: this.$store.state.event?.id, // 676 this.$store.state.event?.id, 事件id，任务搜索时非空
          longitude: this.location?.longitude, // 周边搜索，中心点经度
          latitude: this.location?.latitude, // 周边搜索，中心点纬度
      };
      // 人员的1是在线
      if (this.resourceTypeActiveIndex === 103) {
        obj.status = val ? 1 : '';
      } else {
        obj.status = val ? 0 : '';
      }
      if (polygon) {
        obj.polygon = polygon;
        obj.solrType = 6;
      }
      obj.id = this.$store.state.event?.id;
      this.getListrequest(obj);
    },

    // 资源列表请求处理
    getListrequest(params) {
      this.getListrequestParams = params;
      if(window.map) {
        window.map.clearAtPresentMarkData(window.mapCoverageName.retrievalMark)
        window.map.clearAtPresentVectorData(window.mapCoverageName.retrievalVector)
      }
      getRetrievalLists(params).then((response) => {
          console.log('/solr/searchResource', params, response);
          if (response.code === 0) {
            // this.$message.info('获取搜索资源列表成功');
            if(params.resoureType === 116) {
              response.data.list.forEach((el) => {
                el.name = el.markName;
                el.latitude = el.laitude;
                el.id = Number(el.id);
                el.dataId = Number(el.id);
              });
            }
            this.retrievalList = response.data.list;
            this.retrievalList.facet = response.data.facet || [];
            this.$refs.RetrievalList.totalCount = String(
              response.data.totalCount,
            );
            this.$refs.RetrievalList.pageSize = '10';
            if (this.retrievalList.length && this.resourceTypeActiveIndex !== 110) {
              const diffArr = this.retrievalList.reduce((pre, x) => {
                const obj = {
                  x: x.longitude,
                  y: x.latitude,
                };
                pre.push(obj);
                return pre;
              }, []);
              // 自动放到屏幕适应范围
              window.map.bboxPolygon(diffArr).then((res)=>{
                window.map.centerAccording(res);
              });
            }
          } else {
            this.$message.error(
              `获取搜索资源列表失败，错误代码${response.code}，错误信息：${response.message}`,
            );
          }
        })
        .catch((error) => {
          console.log(this);
          this.$message.error(`获取搜索资源列表失败，错误信息：${error}`);
        });
    },

    // 获取搜索资源列表
    getRetrievalList(keyword, place) {
      this.location = place;
      if (!this.keyword) {
        this.retrievalList = [];
        return;
      }
      // 设置检索历史
      this.handleResourcesHistory({
        name: this.keyword,
      });
      // 重新获取检索历史
      this.$refs.RetrievalList.getHistoryData();
      if (this.resourceTypeActiveIndex === 0) {
        const that = this;
        if (keyword) {
          this.keyword += keyword;
        }
        window.map.searchPOIdata(that.keyword).then((res) => {
          console.log('searchPOIdatasearchPOIdata', res);
          this.retrievalList = res;
          const diffArr = res.reduce((pre, x) => {
            const obj = {
              x: x.transFromLonLat.split(',')[0],
              y: x.transFromLonLat.split(',')[1],
            };
            pre.push(obj);
            return pre;
          }, []);
          // 自动放到屏幕适应范围
          window.map.bboxPolygon(diffArr).then((res)=>{
            window.map.centerAccording(res);
          });
          this.$refs.RetrievalList.totalCount = String(res.length);
          this.$refs.RetrievalList.pageSize = String(res.length);
        });
      } else {
        if (keyword) {
          this.keyword += keyword;
          this.$refs.RetrievalList.currentPage = '1';
        }
        this.getListrequest({
            resoureType: this.resourceTypeActiveIndex, // 资源类型
            keywords: this.keyword, // 搜索关键字
            currentPage: this.$refs.RetrievalList.currentPage,
            eventId: this.$store.state.event?.id, // 676 this.$store.state.event?.id, 事件id，任务搜索时非空
            longitude: place?.longitude, // 周边搜索，中心点经度
            latitude: place?.latitude, // 周边搜索，中心点纬度
            id: this.$store.state.event?.id,
        });
      }
    },
    // 地图路线类型切换
    onHandleMapRouteClick() {
      if (this.$refs.MapRoute) {
        this.$refs.MapRoute.searchMapRoute();
      }
    },
    // 选择历史
    selectLi(item) {
      console.log(item);
      this.keyword = item.name;
      setTimeout(() => {
        this.value = true;
        this.handleInputChange();
      }, 220);
    },
    rangeSearch() {
      if(this.resourceTypeActiveIndex === 0){
        window.map.rangeSearchData(this.keyword).then(res=>{
          this.retrievalList = res;
        });
      }else{
        window.map.getExtent().then(res => {
          this.changeIsOnline(this.isOnline, [`${res.right} ${res.top}`, `${res.right} ${res.bottom}`, `${res.left} ${res.bottom}`, `${res.left} ${res.top}`, `${res.right} ${res.top}`]);
        });
      }
    }
  },
  computed: {
    cancelDraw(){
      return this.$store.state.coplotting.cancelDraw;
    },
  },
  watch: {
    keyword(newVal) {
      if (!newVal) {
        this.retrievalList = [];
        this.visRangeSearchBtn = false;
        if (this.$refs.RetrievalList) {
          this.$refs.RetrievalList.currentPage = '1';
        }
      }
    },
    cancelDraw() {
      this.getListrequest(this.getListrequestParams)
    }
  },
});
</script>

<style lang="scss" module>
.ResourceRetrievalView {
	position: relative;
	// left: 525px;
	margin-left: 25px;
	// position: absolute;
	width: 380px;
	height: 48px;
	&.resource-retrieval-view-visible {
		height: fit-content;
	}
	> header {
		margin-bottom: 10px;
		border: 1px solid #00c1de;
		height: 48px;
		background: rgba(14, 23, 24, .8);
		& .visualization-right-select > input {
			font-size: 14px;
		}
	}
	> main {
		// transform: scaleY(0);
		display: none;
		border: 1px solid #00c1de;
		background: rgba(14, 23, 24, .8);
		// position: relative;
		transform-origin: 190px 0;
		&.main-visible {
			// transform: scaleY(1);
			display: block;
			transition: all .3s;
		}
	}
}
.rangeSearch {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 80px;
	margin: auto;
	width: 200px;
	height: 36px;
	background: #65a9fc;
	cursor: pointer;
	line-height: 36px;
	text-align: center;
	font-size: 14px;
	color: #fff;
}
</style>
