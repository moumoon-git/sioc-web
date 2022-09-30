<template>
  <section>
    <!-- 顶部标题 -->
    <header :class="$style['header-view']">
      <button @click="goBack" />
      <!-- <span :class="$style['team-label']">资源调度</span> -->
      <h3>
        {{
          (resourceTypeActiveIndex === 0 ||
          resourceTypeActiveIndex === 101 ||
          resourceTypeActiveIndex === 102 ||
          resourceTypeActiveIndex === 103 ||
          resourceTypeActiveIndex === 104 ||
          resourceTypeActiveIndex === 105 ||
          resourceTypeActiveIndex === 106 ||
          resourceTypeActiveIndex === 107 ||
          resourceTypeActiveIndex === 108 ||
          resourceTypeActiveIndex === 109 ||
          resourceTypeActiveIndex === 110 ||
          resourceTypeActiveIndex === 111 ||
          resourceTypeActiveIndex === 112 ||
          resourceTypeActiveIndex === 113 ||
          resourceTypeActiveIndex === 115 ||
          resourceTypeActiveIndex === 117
            ? retrievalDetail?.name ?? ''
            : '') +
          (resourceTypeActiveIndex === 1
            ? retrievalDetail?.deviceName ?? ''
            : '') +
          (resourceTypeActiveIndex === 4 ? retrievalDetail?.title ?? '' : '')
        }}
      </h3>
    </header>
    <main :class="$style['main-view']">
      <section>
        <!-- 定位地址 -->
        <div :class="$style['location-wrap']">
          <p>{{ retrievalDetail?.address ?? '' }}</p>
          <!-- <p style="color: #A4ADB5;">广州校区南校区--广州是海珠区新港西路135号</p> -->
        </div>
        <div :class="$style['function-wrap']">
          <button
            v-for="(funcItem, funcIndex) in funcList"
            :key="funcIndex"
            :class="{
              [$style['button--active']]: functionActiveIndex === funcIndex,
            }"
            @click="handleClickFuncButton(funcIndex)"
          >
            <i
              :class="{
                [$style['button__i--active']]:
                  functionActiveIndex === funcIndex,
              }"
            />
            <span>
              {{ funcItem?.name ?? '' }}
            </span>
          </button>
        </div>
      </section>
    </main>
    <!-- 选择联系人弹窗 -->
    <SelectContactDialog
      :zIndex="1000"
      ref="SelectContactDialog"
      v-model="selectedContact"
    />
  </section>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, ref, inject, watch, getCurrentInstance } from 'vue';
import Search from '@/product/CommandBrain3.0/Generalparts/header/Search/Search.vue';
import TaskPublishDialog from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskPublishDialog/TaskPublishDialog.vue';
import SelectContactDialog from '@/product/CommandBrain3.0/Generalparts/dialog/SelectContactDialog/SelectContactDialog.vue';

export default defineComponent({
  name: 'RetrievalDetail',
  components: {
    // 联系人弹窗
    SelectContactDialog,
  },
  inject: ['$addDialog'],
  props: {
    // 资源详情
    retrievalDetail: {
      type: Object,
      default: () => ({}),
    },
    // 资源类型ActiveIndex
    resourceTypeActiveIndex: {
      type: Number,
      default: 0,
    },
  },
  emits: ['handleResourceTypeChange'],
  setup(props) {
    const store = useStore(); // 使用vuex
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http, $message } = instance?.appContext.config.globalProperties;
    // 功能按钮列表
    const funcList = ref([
      {
        name: '发布任务',
      },
      {
        name: '发布定位',
      },
      {
        name: '周边检索',
      },
      {
        name: '到这里',
      },
      {
        name: '从这出发',
      },
    ]);
    // 功能按钮activeindex
    const functionActiveIndex = ref('');
    // 控制mainView切换
    const mainViewType = inject('mainViewType');
    // 资源落点
    const retrievalMarkerList = ref('');
    // 选择联系人组件绑定值
    const selectedContact = ref([]);
    // 起点关键字
    const startingPoint = inject('startingPoint');
    // 终点关键字
    const terminalPoint = inject('terminalPoint');
    // 发布定位
    function releasePositioning(params) {
      const routeShareRecordEntities = params.reduce((pre, x) => {
        const obj = {
          receiverPlatformId: x.platformId,
          receiverId: x.id,
          receiverMobile: x.mobile || x.mobile1 || x.mobile2,
        };
        pre.push(obj);
        return pre;
      }, []);
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistRoute/add',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          detailType: 1,
          detail: JSON.stringify(
            props.retrievalDetail.data
              ? props.retrievalDetail.data
              : props.retrievalDetail,
          ),
          mapType: 1,
          routeShareRecordEntities,
          eventId: store.state.event?.id,
        },
      };
      $http(request).then((response) => {
        if (response.code === 0) {
          $message.info('分享成功');
        } else {
          $message.error(`分享失败${response.msg}`);
        }
      });
    }
    watch(
      () => props.retrievalDetail,
      () => {
        functionActiveIndex.value = '';
      },
    );
    watch(selectedContact, (val) => {
      releasePositioning(val);
    });

    return {
      funcList,
      functionActiveIndex,
      mainViewType,
      retrievalMarkerList,
      startingPoint,
      terminalPoint,
      selectedContact,
    };
  },
  methods: {
    // 点击功能按钮
    handleClickFuncButton(funcIndex) {
      this.functionActiveIndex = funcIndex;
      if (funcIndex === 0) {
        this.$nextTick(() => {
          if (this.$addDialog) {
            this.$addDialog('发布任务', TaskPublishDialog);
          }
        });
      }
      if (funcIndex === 1) {
        this.$refs.SelectContactDialog.open();
      }
      if (funcIndex === 2) {
        // console.log('进行周边检索');
        this.$store.commit('retrieval/SET_peripheralSearch', {
            type: 'peripheralSearch',
            centerCircleData: this.retrievalDetail,
            sourceData: {},
        });
        this.$store.commit('retrieval/SET_isClosePeripheralSearch', false);
      }
      let pointName;
      if (funcIndex === 3 || funcIndex === 4) {
        switch (this.resourceTypeActiveIndex) {
          case 0:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
            pointName = this.retrievalDetail.name;
            break;
          case 1:
          case 2:
            pointName = this.retrievalDetail.address;
            break;
          default:
        }
      }
      this.retrievalDetail.transFromLonLat = `${this.retrievalDetail.longitude},${this.retrievalDetail.latitude}`;
      this.retrievalDetail.location = `${this.retrievalDetail.longitude},${this.retrievalDetail.latitude}`;
      this.retrievalDetail.data = JSON.parse(
        JSON.stringify(this.retrievalDetail),
      );
      if (funcIndex === 3) {
        this.mainViewType = 'MapRoute';
        this.terminalPoint = this.retrievalDetail;
        this.terminalPoint.pointName = pointName;
      }
      if (funcIndex === 4) {
        this.mainViewType = 'MapRoute';
        this.startingPoint = this.retrievalDetail;
        this.startingPoint.pointName = pointName;
      }
    },
    // 点击返回
    goBack() {
      this.mainViewType = 'RetrievalList';
      this.$store.commit('retrieval/SET_isClosePeripheralSearch', true);
    },
  },
});
</script>

<style lang="scss" module>
.header-view {
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.5);
  position: relative;
  & button {
    display: inline-block;
    cursor: pointer;
    width: 8px;
    height: 14px;
    border: none;
    background: url(../../assets/pagination-icon.svg) no-repeat center/100% 100%;
    margin-left: 10px;
  }
  & .team-label {
    color: #ffffff;
    background: #00c1de;
    border-radius: 10px;
    padding: 0px 8px;
    margin-left: 10px;
    font-size: 12px;
  }
  & h3 {
    color: #ffffff;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
.main-view {
  > section:first-child {
    background: rgba(0, 0, 0, 0.5);
    overflow: auto;
  }
  .location-wrap {
    margin-top: 10px;
    padding: 0px 14px;
    display: flex;
    flex-wrap: wrap;
    p:first-child {
      color: #ffffff;
      &::before {
        content: '';
        display: inline-block;
        width: 13px;
        height: 16px;
        margin-right: 5px;
        position: relative;
        bottom: -3px;
        background: url(./assets/location-icon.svg) no-repeat center/100% 100%;
      }
    }
    & p:nth-child(2) {
      color: #a4adb5;
      margin-left: 18px;
    }
  }
  .function-wrap {
    display: flex;
    justify-content: center;
    margin: 10px 0px;
    & button {
      width: 95px;
      border: none;
      background: transparent;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;
      &:not(:last-child) {
        &::after {
          content: '';
          display: inline-block;
          width: 1px;
          height: 100%;
          background: rgba(255, 255, 255, 0.15);
          position: absolute;
          right: 0%;
          top: 0%;
        }
      }
      &:hover,
      &.button--active {
        color: #56e9ff;
      }
      & i {
        width: 16px;
        height: 18px;
        display: inline-block;
      }
      &:nth-of-type(1) i {
        background: url(./assets/publish-task-icon.svg) no-repeat center/100%
          100%;
        &.button__i--active {
          background: url(./assets/publish-task-icon--active.svg) no-repeat
            center/100% 100%;
        }
      }
      &:hover:nth-of-type(1) i {
        background: url(./assets/publish-task-icon--active.svg) no-repeat
          center/100% 100%;
      }
      &:nth-of-type(2) i {
        background: url(./assets/publish-location-icon.svg) no-repeat
          center/100% 100%;
        &.button__i--active {
          background: url(./assets/publish-location-icon--active.svg) no-repeat
            center/100% 100%;
        }
      }
      &:hover:nth-of-type(2) i {
        background: url(./assets/publish-location-icon--active.svg) no-repeat
          center/100% 100%;
      }
      &:nth-of-type(3) i {
        background: url(./assets/searchScope.svg) no-repeat center/100% 100%;
        &.button__i--active {
          background: url(./assets/searchScope_Active.svg) no-repeat
            center/100% 100%;
        }
      }
      &:hover:nth-of-type(3) i {
        background: url(./assets/searchScope_Active.svg) no-repeat
          center/100% 100%;
      }
      &:nth-of-type(4) i {
        background: url(./assets/come-here-icon.svg) no-repeat center/100% 100%;
        &.button__i--active {
          background: url(./assets/come-here-icon--active.svg) no-repeat
            center/100% 100%;
        }
      }
      &:hover:nth-of-type(4) i {
        background: url(./assets/come-here-icon--active.svg) no-repeat
          center/100% 100%;
      }
      &:nth-of-type(5) i {
        background: url(./assets/start-from-here--icon.svg) no-repeat
          center/100% 100%;
        &.button__i--active {
          background: url(./assets/start-from-here--icon--active.svg) no-repeat
            center/100% 100%;
        }
      }
      &:hover:nth-of-type(5) i {
        background: url(./assets/start-from-here--icon--active.svg) no-repeat
          center/100% 100%;
      }
      & span {
        margin-top: 4px;
        font-size: 12px;
      }
    }
  }

}
</style>
