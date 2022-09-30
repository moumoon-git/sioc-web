<template>
  <!-- 左边 -->
  <div class="communication-dispatch-phone_left" :loading="loading">
    <!-- 头部：搜索框 + 拨打按钮-->
    <div class="communication-dispatch-phone_left_top">
      <Search
        v-model="searchKeyword"
        style="width: 342px; background: rgba(41, 47, 48, 0.7);"
        placeholder="请输入姓名/号码检索"
        @change="handleSearch"
      />
      <Button class="call-phone-icon" @click="handleDial">
        <img src="../../assets/svg/phone2.svg" alt="" />
      </Button>
    </div>

    <!-- 中间 -->
    <div class="communication-dispatch-phone_left_center">
      <!-- tabs页面 -->
      <div class="communication-dispatch-phone_left_center_header">
        <PhoneType
          v-for="(item, index) in tabList"
          :key="index"
          :active="activeTab === index ? 'active' : ''"
          :type="item.type"
          @click="handleSwitchTab(index)"
        >
          {{ item.tabName }}
        </PhoneType>
      </div>
      <!-- 历史数量 -->
      <div class="communication-dispatch-phone_left_center_history-total">
        <span class="number">
          {{ '全部：' + (eventPhoneCount.all ? eventPhoneCount.all : 0) }}
        </span>
        <span class="number">
          {{ '已接：' + (eventPhoneCount.answered ? eventPhoneCount.answered : 0) }}
        </span>
        <span class="number">
          {{ '未接：' + (eventPhoneCount.unanswer ? eventPhoneCount.unanswer : 0) }}
        </span>
        <span class="number">
          {{ '呼出：' + (eventPhoneCount.out ? eventPhoneCount.out : 0) }}
        </span>
      </div>
      <!-- 联系人 -->
      <div
        v-infinite-scroll="loadMore"
        class="communication-dispatch-phone_left_center_contactors infinite-list"
      >
        <template v-if="phoneHistoryList && phoneHistoryList.length > 0">
          <Contactor
            v-for="(item, index) in phoneHistoryList"
            :index="index"
            :key="index"
            :historyData="item"
            :isContactor="isContactor"
            :class="activeIndex === index ? 'contactor-active' : ''"
            @createOrAddMeeting="handleCreateOrAddMeeting"
            @click="handleSelectedHistory(item, index)"
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
  <!-- 发起会议弹窗 -->
  <StartMeetingDialog ref="startMeetingDialogRef" />
  <!-- 选择会议成员弹窗 -->
  <SelectMemberDialog ref="selectMemberDialogRef" />
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, inject, onMounted, provide } from 'vue';
import Contactor from '../Contactor/Contactor.vue';
import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue';
import PhoneType from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Phone/components/PhoneType/PhoneType.vue';
import { makePhoneCall } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import StartMeetingDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/StartMeetingDialog/StartMeetingDialog.vue';
import SelectMemberDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Meeting/modules/SelectMemberDialog/SelectMemberDialog.vue';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'LeftModule',
  components: {
    Contactor,
    Search,
    PhoneType,
    StartMeetingDialog,
    SelectMemberDialog,
  },
  emits: {
    switchTab: null,
    handleSearch: null,
    handleSelectedHistory: null,
    loadMore: null,
  },
  props: {
    // 电话历史
    phoneHistoryList: {
      type: Array,
      default: () => [],
    },
    // 电话历史记录数量
    eventPhoneCount: {
      type: Object,
      default: () => ({}),
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
  setup(props, { emit }) {
    const store = useStore();
    const { $dial, $http }: any = getCurrentInstance()?.appContext.config.globalProperties;
    // 激活的tabs下标
    const activeTab = ref(0);
    // 是否选中联系人tab
    const isContactor = ref(false);
    // 电话类型
    const callType = ref('');
    // 搜索关键字
    const searchKeyword = ref('');
    // 显示联系人
    const showContactor = ref(false);
    // 当前选中的电话历史数据的索引
    const activeIndex = ref(0);
    // 事件Id
    const eventId = store.state.event?.id || '';
    // tabs列表
    const tabList = ref([
      {
        tabName: '全部',
        className: 'tabs_all',
        type: '',
      },
      {
        tabName: '已接',
        className: 'tabs_received',
        type: 'received',
      },
      {
        tabName: '未接',
        className: 'tabs_missed-call',
        type: 'missed',
      },
      {
        tabName: '呼出',
        className: 'tabs_dailed',
        type: 'dailed',
      },
      {
        tabName: '联系人',
        className: 'tabs_contactor',
        type: '',
      },
    ]);
    const startMeetingDialogRef = ref<typeof StartMeetingDialog | null>(null);
    const selectMemberDialogRef = ref<typeof SelectMemberDialog | null>(null);
    let activeIcon: any = inject('activeIcon');

    /**
     * @description 加载更多
     */
    function loadMore() {
      emit('loadMore');
    }
    /**
     * @description 切换tabs
     */
    function handleSwitchTab(val: number) {
      activeTab.value = val;
      switch (val) {
        case 0:
          callType.value = ''; // 全部
          isContactor.value = false;
          break;
        case 1:
          callType.value = '已接'; // 全部
          isContactor.value = false;
          break;
        case 2:
          callType.value = '未接'; // 全部
          isContactor.value = false;
          break;
        case 3:
          callType.value = '呼出'; // 全部
          isContactor.value = false;
          break;
        default:
          callType.value = '联系人'; // 全部
          isContactor.value = true;
      }
      emit('switchTab', callType.value);
      activeIndex.value = 0;
    }

    /**
     * @description 搜索
     */
    function handleSearch() {
      emit('handleSearch', searchKeyword.value);
    }

    /**
     * @param {object} item 当前选中的电话历史数据
     * @param {number} index 当前选中的电话历史数据的索引
     * @description 当前选中的电话历史
     */
    function handleSelectedHistory(item: any, index: number) {
      activeIndex.value = index;
      emit('handleSelectedHistory', item);
    }

    /**
     * @description 拨号
     */
    function handleDial() {
      $dial({
        showContact: true,
        isPhone: true
      }).then((newNum: string) => {
        // console.log('电话号码', newNum);
        if (!newNum) {
          // 跳转到组织架构
          activeIcon.value = 'structure';
        } else {
          // 拨打号码
          const contactorInfo: any = getContactorInfo(newNum);
          makePhoneCall({
            phone: Number(newNum),
            type: 1,
            id: contactorInfo.id,
            name: contactorInfo.name,
          },
          [{
            key: 'eventId',
            value: store.state.event?.id,
            type: 1
          }]);
        }
      });
    }
    /**
     * @param {string | number} phoneNum 号码
     * @description 根据号码获取联系人数据
     */
    function getContactorInfo(phoneNum: string | number) {
      return new Promise((resolve, reject) => {
        $http({
          method: 'get',
          url: `/mail/mailcontactor/phoneNum?phoneNum=${phoneNum}`,
          service: 'soc',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        })
          .then((res: any) => {
            if (res.code === 0) {
              resolve(res.mailContactor);
            } else {
              reject(res);
            }
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }
    /**
     * @param {object} item 电话记录
     * @description 启动会议或创建会议
     */
    function handleCreateOrAddMeeting(item: any) {
      const contactorInfo: any = getContactorInfo(item.call);
      if (startMeetingDialogRef.value) {
        startMeetingDialogRef.value.createOrAddMeeting([
          {
            memberType: 1, // 1: 通讯录
            id: item.contactorId,
            name: item.contactor,
            phone: contactorInfo.phone ? contactorInfo.phone : '',
            mobile1: contactorInfo.mobile1 ? contactorInfo.mobile1 : '',
            mobile2: contactorInfo.mobile2 ? contactorInfo.mobile2 : '',
          },
        ]);
      }
    }
    /**
     * @description 打开选择会议成员弹窗
     */
    function openSelectMemberDialog(options?: any) {
      if (selectMemberDialogRef.value) {
        return selectMemberDialogRef.value.open(options);
      }
      return Promise.resolve();
    }
    provide('inviteMember', openSelectMemberDialog);

    return {
      handleSwitchTab,
      activeTab,
      tabList,
      showContactor,
      isContactor,
      handleSearch,
      searchKeyword,
      handleSelectedHistory,
      activeIndex,
      loadMore,
      handleDial,
      handleCreateOrAddMeeting,
      startMeetingDialogRef,
      selectMemberDialogRef,
    };
  },
});
</script>
<style lang="scss">
@import './assets/css/LeftModule';
</style>
