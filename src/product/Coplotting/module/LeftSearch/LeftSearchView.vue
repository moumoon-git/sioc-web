<template>
  <div :class="$style.LeftSearch">
    <!-- 选择 -->
    <aside>
      <Select v-model="selectVal" />
    </aside>
    <main>
      <input
        v-model="searchVal"
        type="text"
        placeholder="请输入地址"
        @keydown.enter="getSearchData"
        @focus="placeFocus"
        @blur="placeBlur"
      />
    </main>
    <!-- 搜索按钮 -->
    <div :class="$style.searchBtn" @click="getSearchData">
      <div />
    </div>
    <div v-if="resultFlag && searchData.length" :class="$style.result">
      <Result :content-data="searchData" @sendMsg="getResultMsg" @close-panel="placeBlur(true)"/>
    </div>
    <div v-if="resultFlag && taggingData.length " :class="$style.result">
      <ul :class="$style.taggingUl" >
        <li v-for="(x,i) in taggingData" :key="i" @click="setMapCenter(x)" >
          <span>{{ x.markName }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import Select from './components/Select.vue';
import Result from './components/Result.vue';

export default defineComponent({
  components: {
    Select,
    Result,
  },
  emits: ['getSearchData', 'sendMsg'],
  setup(props, context) {
    const searchVal = ref('');
    const selectVal: any = ref({});
    const resultFlag: any = ref(false);
    const searchData: any = ref([]);
    const taggingData: any = ref([]);
    const focusFlag = ref(false);
    const route = useRoute();
    const thisMapId: any = ref(0); // 当前的地图id
    thisMapId.value = route.query.mapId;
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    onMounted(() => {
      setTimeout(() => {
        // console.log(window.map);
        window.map.createdMarkCoverage('search');
      }, 150);
    });
    // 搜索回调
    function searchCallBack(params:any) {
      resultFlag.value = true;
      taggingData.value = params;
    }
    // 获取搜索的数据
    function getSearchData() {
      if (selectVal.value.value.id === 1) {
        window.map.searchPOIdata(searchVal.value).then((res: any) => {
          searchData.value = res;
          const diffArr = res.reduce((pre:any, x:any) => {
            const obj = {
              x: x.transFromLonLat.split(',')[0],
              y: x.transFromLonLat.split(',')[1],
            };
            pre.push(obj);
            return pre;
          }, []);
          // 自动放到屏幕适应范围
          window.map.bboxPolygon(diffArr).then((r:any)=>{
            window.map.centerAccording(r);
          });
          resultFlag.value = true;
        });
      } else {
        context.emit('getSearchData', { val: searchVal.value, cbFun: searchCallBack });
      }
    }
    // 聚焦 并且 有搜索关键字 并且 有搜索结果
    function placeFocus() {
      focusFlag.value = true;
      if (searchVal.value && searchData.value.length !== 0) {
        resultFlag.value = true;
      }
    }
    // 失去焦点
    function placeBlur(doClear = false) {
      focusFlag.value = false;
      if (doClear === true) { searchVal.value = ''; }
      // 失去焦点时如果 搜索关键字为空就 隐藏并且清空数组
      if (!searchVal.value) {
        resultFlag.value = false;
        searchData.value = [];
        window.map.clearAtPresentMarkData('search');
      }
    }
    function getResultMsg(params: any) {
      context.emit('sendMsg', params);
    }
    // 设置中心点
    function setMapCenter(params: any) {
      (window as any).map.getMapZoom().then((res:any) => {
        (window as any).map.setCentent({
          latitude: params.latitude,
          longitude: params.longitude,
        }, res);
      });
    }
    return {
      Result,
      searchVal,
      selectVal,
      getSearchData,
      searchData,
      taggingData,
      placeFocus,
      placeBlur,
      resultFlag,
      getResultMsg,
      setMapCenter,
    };
  },
});
</script>

<style lang="scss" module>
.LeftSearch {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  & > aside {
    width: 65px;
    height: 100%;
  }
  & > main {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    & > input {
      padding-left: 8px;
      outline: none;
      border: none;
      box-sizing: border-box;
      font-size: 17px;
      font-weight: 400;
      color: #999999;
    }
  }
}
.searchBtn {
  width: 46px;
  height: 46px;
  background: #0091ff;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    width: 22px;
    height: 22px;
    background: url('./components/assets/shape.svg') no-repeat;
    background-size: 100% 100%;
  }
}
.result {
  width: 100%;
  position: absolute;
  top: 120%;
}

.taggingUl{
  list-style: none;
  padding: 0;
  background: #ffffff;
  margin: 0;
  &>li{
    box-sizing: border-box;
    padding:10px 0 10px 20px;
    cursor: pointer;
  }
}
</style>
