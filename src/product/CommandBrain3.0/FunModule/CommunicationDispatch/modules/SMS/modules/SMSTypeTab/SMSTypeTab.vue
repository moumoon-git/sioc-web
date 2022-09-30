<template>
  <div :class="$style.container">
    <!-- 1. 搜索框 -->
    <Search
      v-model="searchKeyword"
      style="width: 100%; margin: 10px 0; background: rgba(41, 47, 48, .77);"
      placeholder="请输入短信内容、联系人名称、手机号检索"
      @change="searchKeyWord"
    />
    <!-- 2. 短信类型Tab列表 -->
    <CardWrapper :class="$style['card-wrapper']">
      <template #title>
        <TitleMenu
          :class="$style['title-menu']"
          v-model="currentMenuIndex"
          :menu-list="menuList"
        />
      </template>
      <template #default>
        <p v-if="!searchKeyword" :class="$style['sms-type-number']">
          <span v-if="currentMenuIndex===0">{{`全部：${SMSTypeCount?.all??'0'}`}}</span>
          <span v-if="currentMenuIndex===0||currentMenuIndex===1">{{`发送：${SMSTypeCount?.send??'0'}`}}</span>
          <span v-if="currentMenuIndex===0||currentMenuIndex===2">{{`回复：${SMSTypeCount?.receive??'0'}`}}</span>
        </p>
        <p v-else :class="$style['sms-type-number']">
          <span v-if="currentMenuIndex===0">{{`全部：${SMSTypeCountWithSearch?.all??'0'}`}}</span>
          <span v-if="currentMenuIndex===0||currentMenuIndex===1">{{`发送：${SMSTypeCountWithSearch?.send??'0'}`}}</span>
          <span v-if="currentMenuIndex===0||currentMenuIndex===2">{{`回复：${SMSTypeCountWithSearch?.receive??'0'}`}}</span>
        </p>
        <ul :class="$style.list" v-if="currentMenuIndex===0||currentMenuIndex===1||currentMenuIndex===2">
          <template v-for="(item, index) in smsList" :key="index">
            <li
              :class="[
                {
                  [$style['li--active']]:activeLiIndex===index
                },
              ]"
              @mouseover="activeLiIndex=index"
              @mouseleave="activeLiIndex=''"
              @click="onHandleClickLi(item)"
            >
              <h3>
                <i
                  :class="[
                    {
                      [$style.greenPoint]:item.direct===0,
                      [$style.bluePoint]:item.direct===1,
                    },
                  ]"
                />
                <span>{{item?.sendTime}}</span>
                <span>{{item?.countAll!==1&&item?.direct===0?`共：${item?.countAll??0}人`:`${item?.contactorName} ${item?.contactorPosition?'('+item?.contactorPosition+')':''}`}}</span>
              </h3>
              <p>
                <label v-if="item.countFailure!==0&&item.direct===0">{{`发送失败${item?.countAll!==1?item?.countFailure:''}`}}</label>
                <span>{{item?.content}}</span>
              </p>
            </li>
          </template>
        </ul>
        <template v-if="currentMenuIndex===3">
          <PersonCard
            style="width: 100%;box-sizing: border-box;margin-top: 10px;"
            v-for="(item,index) in contactorList"
            :key="index"
            :person-data="item"
            @click="$emit('getSMSDetail',item)"
          />
        </template>
      </template>
    </CardWrapper>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  onMounted,
  toRefs,
  getCurrentInstance,
  ref,
  watch,
} from 'vue';
import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue';
import PersonCard from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/personCard.vue';
import CardWrapper from '../../components/CardWrapper/CardWrapper.vue';
import TitleMenu from '../../components/TitleMenu/TitleMenu.vue';

export default defineComponent({
  components: {
    // 搜索框
    Search,
    // 卡片容器组件
    CardWrapper,
    // tab组件
    TitleMenu,
    // 人员卡片
    PersonCard,
  },
  emits: [
    'tabChange', 'getSMSDetail',
  ],
  setup(props, { emit }) {
    const { $http, $message } = getCurrentInstance()?.appContext.config.globalProperties;
    const isLoading = ref(false);
    // 搜索框搜索内容
    const searchKeyword = ref('');
    // tab选中index
    const currentMenuIndex = ref(0);
    // list选中index
    const activeLiIndex = ref('');
    // tab类型
    const menuList = ref(['全部', '发送', '回复', '联系人']);
    // 短信列表
    const smsList = ref([]);
    // 联系人列表
    const contactorList = ref([]);
    // 短信类型数量
    const SMSTypeCount = ref({});
    // 搜索时显示的短信类型数量
    const SMSTypeCountWithSearch = ref({});
    return {
      searchKeyword,
      currentMenuIndex,
      activeLiIndex,
      menuList,
      smsList,
      contactorList,
      SMSTypeCount,
      SMSTypeCountWithSearch,
    };
  },
  watch: {
    currentMenuIndex(newValue, oldValue) {
      this.$emit('tabChange', newValue);
      switch (this.currentMenuIndex) {
        case 0:
          this.getSMSGroup();
          break;
        case 1:
          this.getSMSGroup('0');
          break;
        case 2:
          this.getSMSGroup('1');
          break;
        case 3:
          this.getContactorList();
          break;
        default:
      }
    },
  },
  mounted() {
    this.getSMSGroup();
    this.getSMSTypeCount();
  },
  methods: {
    // 获取tabItem列表
    getSMSGroup(tabType) {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/eos/communication/sms/smsGroupByEvent',
        params: {
          eventId: this.$store.state.event?.id,
          key: this.searchKeyword,
          direct: tabType,
          page: '1',
          size: '10000',
        },
      };
      this.isLoading = true;
      this.$http(request).then((response) => {
        console.log('/eos/communication/sms/smsGroupByEvent', response);
        if (response.errorcode === 0 && response.data?.data) {
          this.smsList = response.data.data;
          this.$emit('getSMSDetail', this.smsList[0]);
          this.isLoading = false;

          // 计算统计数量
          if (this.searchKeyword) {
            this.SMSTypeCountWithSearch = {
              send: 0,
              receive: 0,
              all: 0,
            };
            this.smsList.forEach((el) => {
              this.SMSTypeCountWithSearch.all += el.countAll;
              if (el.direct === 0) {
                this.SMSTypeCountWithSearch.send += el.countAll;
              } else {
                this.SMSTypeCountWithSearch.receive += el.countAll;
              }
            });
          }
        } else {
          this.$message.error(`获取短信分组失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取短信分组失败，错误信息：${error}`);
      });
    },
    // 获取联系人列表
    getContactorList() {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/eos/communication/sms/getEventSmsContactor',
        params: {
          eventId: this.$store.state.event?.id,
          page: '1',
          size: '10000',
          key: this.searchKeyword,
        },
      };
      this.isLoading = true;
      this.$http(request).then((response) => {
        console.log('/eos/communication/sms/getEventSmsContactor', response);
        if (response.errorcode === 0 && response?.data?.data) {
          this.contactorList = [];
          response.data.data.forEach(element => {
            this.contactorList.push({
              contactorId: element.contactorId,
              contactorImg: element.contactorImg,
              name: element.contactorName,
              position: element.contactorPosition,
              contactorSex: element.contactorSex,
              workUnit: element.contactorWorkUnit,
              count: element.count,
              phone: element.phone,
              smsId: element.smsId,
              success: element.success,
              images: element.contactorImg,
            });
          });
          console.log("this.contactorList",this.contactorList)
          this.isLoading = false;
        } else {
          this.$message.error(`获取联系人列表失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取联系人列表失败，错误信息：${error}`);
      });
    },
    searchKeyWord() {
      this.getSMSGroup(this.currentMenuIndex === 0 ? null : String(this.currentMenuIndex - 1));
    },
    onHandleClickLi(item) {
      this.$emit('getSMSDetail', item);
      sessionStorage.setItem('smsItem', JSON.stringify(item));
    },
    getSMSTypeCount() {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/eos/communication/sms/countByEventId',
        params: {
          eventId: this.$store.state.event?.id,
        },
      };
      this.$http(request).then((response) => {
        console.log('/eos/communication/sms/countByEventId', response);
        if (response.errorcode === 0) {
          this.SMSTypeCount = response.data;
        }
      });
    },
  },
});
</script>

<style lang="scss" module>
  .container {
    height: calc(100% - 40px);
    .card-wrapper {
      border: initial;
      height: calc(100% - 58px);
      overflow-y: auto;
      list-style: none;
      padding: 0;
      margin: 0;
      // 滚动条
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #56E9FF;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-corner {
        background: transparent;
      }
      .list {
        list-style: none;
        margin-top: 15px;
        & .li--active {
          background: linear-gradient(90deg, rgba(0, 193, 222, .7) 0%, transparent 100%);
          &::before {
            content: "";
            width: 2px;
            height: 125px;
            display: inline-block;
            background: #56E9FF;
            position: absolute;
            left: 0px;
          }
        }
        & > li {
          margin-top: 10px;
          background: linear-gradient(90deg, rgba(0, 193, 222, .3) 0%, transparent 100%);
          padding: 0 10px;
          overflow: hidden;
          position: relative;
          & h3 {
            height: 42px;
            display: flex;
            align-items: center;
            position: relative;
            &::after {
              content: '';
              position: absolute;
              bottom: -10%;
              left: -5%;
              width: 389px;
              height: 9px;
              background: url(../../assets/dividingLine.png) no-repeat center/100% 100%;
            }
            & .point {
              display: inline-block;
              width: 30px;
              height: 30px;
              margin-right: 5px;
            }
            & .greenPoint {
              @extend .point;
              background: url(../../assets/greenPoint.svg) no-repeat 0px/30px;
            }
            & .bluePoint {
              @extend .point;
              background: url(../../assets/bluePoint.svg) no-repeat 0px/30px;
            }
            & span:not(:last-child) {
              margin-right: 30px;
              position: relative;
              &::after {
                content: '';
                display: block;
                width: 2px;
                height: 22px;
                position: absolute;
                right: -15px;
                top: 50%;
                transform: translateY(-50%);
                background: linear-gradient(transparent, #FFF, transparent);
              }
            }
          }
          & p {
            height: 60px;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            margin: 12px 0px;
            & label {
              background: #F66E6E;
              border-radius: 12px;
              padding: 0px 6px;
              margin-right: 5px;
            }
          }
        }
      }
      & .title-menu {
        margin: 0px;
        li {
          width:20%;
          text-align: center;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          &:nth-child(2)::before {
            content: '';
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(../../assets/greenPoint.svg) no-repeat 0px/30px;
            margin-right: 5px;
          }
          &:nth-child(3)::before {
            content: '';
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(../../assets/bluePoint.svg) no-repeat 0px/30px;
            margin-right: 5px;
          }
        }
      }
      & .sms-type-number {
        margin-top: 15px;
        color: #FFFFFF;
        & > span:not(:last-child) {
          margin-right: 30px;
          position: relative;
          &::after {
            content: '';
            display: block;
            width: 2px;
            height: 10px;
            position: absolute;
            right: -15px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.15);
          }
        }
      }
    }
  }
</style>
