<template>
  <!-- 快捷通道 -->
  <div :class="$style.FastTrack">
    <SearchScope
      v-show="searchScopeVis"
      ref="SearchScope"
      :single-search-type="singleSearchType"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 任务发布弹窗
import TaskPublishDialog from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskPublishDialog/TaskPublishDialog.vue';
// 资源检索
import SearchScope from './SearchScope/SearchScope.vue';

export default defineComponent({
  components: {
    SearchScope,
  },
  inject: ['$addDialog'],
  data() {
    return {
      singleSearchType: '',
      searchScopeVis: (this as any).$store.state.closeModle.closeModle.flag,
      retrievalSelectType: [
        {
          typeKey: 'protect',
        },
        {
          typeKey: 'risk',
        },
        {
          typeKey: 'refuge',
        },
        {
          typeKey: 'material',
        },
        {
          typeKey: 'camera',
        },
        {
          typeKey: 'device',
        },
        {
          typeKey: 'colony',
        },
        // {
        //   typeKey: 'wecomm',
        // },
        {
          typeKey: 'personnel',
        },
        {
          typeKey: 'team',
        },
      ],
    };
  },
  computed: {
    closeModle() {
      return (this as any).$store.state.closeModle.closeModle;
    },
  },
  watch: {
    closeModle(newV) {
      console.log(newV.flag);
      (this as any).searchScopeVis = newV.flag;
    },
  },
  methods: {
    tabModel() {},
    /**
     * 打开任务发布弹窗
     */
    openTaskPublishDialog() {
      if ((this as any).$addDialog) {
        (this as any).$addDialog('任务发布', TaskPublishDialog);
      }
    },
    /**
     * 资源检索，检索所有资源
     */
    searchAllResources() {
      this.singleSearchType = '';
      (this as any).$store.commit(
        'retrieval/SET_retrievalSelectType',
        (this as any).retrievalSelectType,
      );
    },
    /**
     * 检索周边视频
     */
    searchNearbyVideo() {
      this.singleSearchType = 'video';
      this.$nextTick(() => {
        // vuex 状态改变时会发起请求所以先把半径设置为0
        (this as any).$refs.SearchScope.solrParams.r = 0;
        this.$message.info('请点击地图选择地点');
        (this as any).$store.commit('retrieval/SET_retrievalSelectType', [
          { typeKey: 'camera', src: '' },
        ]);
        (this as any).$refs.SearchScope.getCententModelBtn({
          handleModle: '周边视频',
          active: true,
          childrenFlag: false,
          icon: 'circular',
          name: '点检索',
          type: 'circular',
        });
      });
    },
    /**
     * 检索周边人员、现场人员
     */
    searchNearbyPeople() {
      this.singleSearchType = 'people';
      this.$nextTick(() => {
        // vuex 状态改变时会发起请求所以先把半径设置为0
        (this as any).$refs.SearchScope.solrParams.r = 0;
        this.$message.info('请点击地图选择地点');
        (this as any).$store.commit('retrieval/SET_retrievalSelectType', [
          { typeKey: 'personnel', src: '' },
        ]);
        (this as any).$refs.SearchScope.getCententModelBtn({
          handleModle: '现场人员',
          active: true,
          childrenFlag: false,
          icon: 'circular',
          name: '点检索',
          type: 'circular',
        });
      });
    },
    // 附近监控
    nearbyMonitoring() {
      // 附近监控
      this.singleSearchType = 'nearby';
      (this as any).$refs.SearchScope.loadingMap();
      const info = (this as any).$store.state.retrieval?.peripheralSearch
        ?.centerCircleData;
      info.address = info.address || info.location;
      (this as any).$refs.SearchScope.centerCircle = info;
      (this as any).$refs.SearchScope.solrParams.r = 500;
      (this as any).$refs.SearchScope.solrParams.longitude = info.longitude;
      (this as any).$refs.SearchScope.solrParams.latitude = info.latitude;
      (this as any).$refs.SearchScope.controlVisHeader({
        active: true,
        childrenFlag: false,
        icon: 'circular',
        name: '点检索',
        type: 'circular',
        address: {
          result: {
            formatted_address: (this as any).$store.state.retrieval
              .peripheralSearch.centerCircleData.address,
          },
        },
      });
      // 设置检索类型
      (this as any).$store.commit('retrieval/SET_retrievalSelectType', [
        { typeKey: 'camera' },
      ]);
      // 进行检索和绘制圆
      return (this as any).$refs.SearchScope.renderCircle(500);
    },
    // 周边检索
    peripheralSearch() {
      // 周边检索
      this.singleSearchType = 'peripheral';
      (this as any).$refs.SearchScope.loadingMap();
      const info = (this as any).$store.state.retrieval?.peripheralSearch
        ?.centerCircleData;
      console.log(info);
      (this as any).$refs.SearchScope.centerCircle = info;
      (this as any).$refs.SearchScope.solrParams.r = 500;
      (this as any).$refs.SearchScope.solrParams.longitude = info.longitude;
      (this as any).$refs.SearchScope.solrParams.latitude = info.latitude;
      (this as any).$refs.SearchScope.controlVisHeader({
        active: true,
        childrenFlag: false,
        icon: 'circular',
        name: '点检索',
        type: 'circular',
        address: {
          result: {
            formatted_address: (this as any).$store.state.retrieval
              .peripheralSearch.centerCircleData.address,
          },
        },
      });
      // 设置检索类型
      (this as any).$store.commit(
        'retrieval/SET_retrievalSelectType',
        (this as any).retrievalSelectType,
      );
      // 进行检索和绘制圆
      return (this as any).$refs.SearchScope.renderCircle(500);
    },
  },
});
</script>

<style lang="scss" module>
.FastTrack {
  background: #fff;
}
</style>
