<template>
  <!-- 右边 -->
  <div class="communication-dispatch-phone_right">
    <div
      class="communication-dispatch-phone_right_contactor"
      :style="{ height: showAudio ? '146px' : '52px' }"
    >
      <!-- <div class="communication-dispatch-phone_right_contactor"> -->
      <template v-if="selectedHistory.id">
        <CallHistory
          :historyData="selectedHistory"
          :showContactor="true"
          :showAudio="showAudio"
          @update="handleUpdateHistoryData"
          @hanleTurnText="hanleTurnText"
        />
      </template>
      <template v-else>
        <div v-if="!loading" class="noData">
          <img src="../../assets/svg/smile.svg" alt="" />
          暂无数据
        </div>
        <div v-else class="noData"><i class="el-icon-loading"></i>加载中</div>
      </template>
    </div>
    <div
      class="communication-dispatch-phone_right_Historys"
      :style="{ height: showAudio ? 'calc(100% - 156px)' : 'calc(100% - 62px)' }"
    >
      <!-- 头部 -->
      <div class="communication-dispatch-phone_right_Historys_header">
        <div class="header-left">
          历史记录
        </div>
        <div class="header-right">
          <Button
            v-for="(item, index) in historyCounts"
            :type="index === activeHistoryType ? 'active' : 'default'"
            @click="handleSwitchHistoryType(index, item)"
            >{{ item.name + item.count }}</Button
          >
        </div>
      </div>

      <!-- 身体 -->
      <div
        v-infinite-scroll="loadMore"
        class=" infinite-list communication-dispatch-phone_right_Historys_body"
      >
        <template v-if="contactorPhoneHistoryList && contactorPhoneHistoryList.length > 0">
          <CallHistory
            v-for="(item, index) in contactorPhoneHistoryList"
            :key="index"
            :historyData="item"
            :showContactor="showContactor"
            :showAudio="true"
            class="History-item"
            @update="handleUpdateHistoryData"
            @hanleTurnText="hanleTurnText"
          />
          <!-- <p v-if="noMore" class="noMore">没有更多了</p> -->
        </template>
        <template v-else>
          <div v-if="!loading" class="noData">
            <img src="../../assets/svg/smile.svg" alt="" />
            暂无数据
          </div>
          <div v-else class="noData"><i class="el-icon-loading"></i>加载中</div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import Button from '../../components/Button.vue';
import Contactor from '../Contactor/Contactor.vue';
import CallHistory from '../../components/CallHistory.vue';
import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue';

export default defineComponent({
  name: 'LeftModule',
  components: {
    Button,
    Contactor,
    CallHistory,
    Search,
  },
  props: {
    // 联系人的电话历史
    contactorPhoneHistoryList: {
      type: Array,
      default: () => [],
    },
    // 选中的历史
    selectedHistory: {
      type: Object,
      default: () => ({}),
    },
    // 电话历史数量
    historyCounts: {
      type: Array,
      default: () => [
        {
          type: 'all',
          name: '全部',
          count: 0,
        },
        {
          type: 'answered',
          name: '已接',
          count: 0,
        },
        {
          type: 'out',
          name: '呼出',
          count: 0,
        },
        {
          type: 'unanswer',
          name: '未接',
          count: 0,
        },
      ],
    },
    // 是否显示录音
    showAudio: {
      type: Boolean,
      default: true,
    },
    // 加载更多状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 没有更多了
    noMore: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    hanleTurnText: null,
    handleSwitchHistoryType: null,
    loadMore: null,
    update: null,
  },
  setup(props, { emit }) {
    //  --------------- tab的业务逻辑 start ---------------------
    // 激活的tabs下标
    const activeTab = ref(0);
    // tabs列表
    const tabList = ref([
      {
        tabName: '全部',
        className: 'tabs_all',
      },
      {
        tabName: '已接',
        className: 'tabs_received',
      },
      {
        tabName: '未接',
        className: 'tabs_missed-call',
      },
      {
        tabName: '呼出',
        className: 'tabs_dailed',
      },
      {
        tabName: '联系人',
        className: 'tabs_contactor',
      },
    ]);
    /**
     * @description 切换tabs
     */
    function handleSwitchTab(val: number) {
      activeTab.value = val;
    }
    //  --------------- tab的业务逻辑 end ---------------------

    const historyTypes = ref([
      {
        name: '全部',
        count: 5,
      },
      {
        name: '已接',
        count: 5,
      },
      {
        name: '未接',
        count: 5,
      },
      {
        name: '呼出',
        count: 5,
      },
    ]);
    const activeHistoryType = ref(0);
    /**
     * @description 切换电话类型
     */
    function handleSwitchHistoryType(index: number, item: object) {
      activeHistoryType.value = index;
      // console.log('切换', item);
      emit('handleSwitchHistoryType', item);
    }

    // 历史记录 业务
    const showContactor = ref(false); // 显示联系人

    function hanleTurnText() {
      emit('hanleTurnText');
    }

    /**
     * @description 加载更多
     */
    function loadMore() {
      emit('loadMore');
    }

    /**
     * @description 更新数据
     */
    function handleUpdateHistoryData(obj: any) {
      emit('update', obj);
    }

    watch(props.selectedHistory, (newValue: any, oldValue: any) => {
      // 监听当前选中的联系历史
      // console.log('监听当前选中的联系历史', newValue.id, oldValue.id);
    });

    return {
      handleSwitchTab,
      activeTab,
      tabList,
      historyTypes,
      activeHistoryType,
      handleSwitchHistoryType,
      showContactor,
      hanleTurnText,
      loadMore,
      handleUpdateHistoryData,
    };
  },
});
</script>
<style lang="scss">
@import './assets/css/RightModule';
</style>
