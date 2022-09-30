// 领导班子（专项）右侧
<template>
  <div class="specilLeader__right">
    <div class="specilLeader__right__title">
      <div class="specilLeader__right__title__left">
        专项领导班子
      </div>
    </div>
    <div class="specilLeader__right__content">
      <div
        v-if="showNodata"
        class="specilLeader__right__content__noData"
      >
        暂无数据
      </div>
      <div
        v-else
        class="specilLeader__right__content__contact"
      >
        <div
          v-for="(item,index) in leaderData"
          :key="index"
          class="specilLeader__contact__section1"
        >
          <div class="specilLeader__contact__section1-title">
            <div class="specilLeader__contact__section1-title__l">
              {{ item.name }}
            </div>
            <div class="specilLeader__contact__section1-title__r">
              职责
            </div>
                 <div class="specilLeader__contact__section1-title__tip">
              {{item.remark}}
            </div>
          </div>
          <div class="specilLeader__contact__section1-content">
            <PersonCard
              v-for="(item2,index2) in returnMenberData(item.children)"
              :key="index2"
              :person-data="item2"
              @clickEmit="personCardClickFun(item2)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 人员详情弹窗 -->
  <PersonDetail :person-info-props="personInfoProps" ref="PersonDetailRef" />
  
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, getCurrentInstance,reactive
} from 'vue';
import { useStore } from 'vuex';
import PersonCard from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/personCard.vue'; // 人员卡片
import AddIndex from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/addUnitAndEmergy/AddIndex.vue'; // 添加单位和应急岗位弹框
import PersonDetail from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/personDetail/PersonDetail.vue'; // 人员详情弹窗
import UnitDetail from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/unitDetail/UnitDetail.vue'; // 人员详情弹窗

export default defineComponent({
  components: {
    PersonCard, // 人员卡片
    AddIndex, // 添加单位和应急岗位弹框
    PersonDetail, // 人员详情弹窗
    UnitDetail, // 单位详情弹窗
  },
  props: {},
  setup() {
    const instance = getCurrentInstance();
    const { $http, $message }: any = instance?.appContext.config.globalProperties;
    const showNodata = ref(false);// 是否有数据
    const PersonDetailRef = ref<any>(null); // 人员详情Ref
    const leaderData = ref([]); // 领导班子数据
    const nowPreplanId = ref(0); // 现在的全局预案组织架构
    const store = useStore(); // 使用vuex
      // 获取默认预案的版本ID
    function getDefaultContingencyPlan() {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/eos/event/preplan/getDefault',
        params: {
          eventId: store.state.event?.id,
          caseId: store.state.event?.caseClassId,
          type: 1,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0) {
          const vid = response.data?.preplans?.versionId;
          // 存在版本ID说明启动了预案，查询预案对应的指挥部数据
          if (vid&&vid!=='') {
            nowPreplanId.value = vid;
            getLeaderData()
          }else{
            return $message.error('该事件未启动预案，无法查询');
          }
        }
      });
    }
    // 人员卡片点击方法
    const personInfoProps:any = reactive({});
    function personCardClickFun(obj:any) {
      (window as any).event.stopPropagation();
      console.log(obj);
      personInfoProps.value = obj;
      if (PersonDetailRef.value) {
        PersonDetailRef.value.open();
      }
    }
    // 获取领导班子数据
    function getLeaderData() {
      console.log(nowPreplanId.value)
      const request = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailgroup/getGroupResponseAndContactor',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          versionId: nowPreplanId.value, // 先写死
          structType: 1, // 1专项2现场指挥部
          type: 1, // 1领导班子2成员单位
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          console.log(response.data);
          // treeData.value = response.data;
          leaderData.value = response.data;
        } else {
          $message.error(`获取领导班子失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取领导班子失败，错误信息：${error}`);
      });
    }
    // 返回每个领导班子对应的成员数组
    function returnMenberData(arr:any) {
      const newArr:any = [];
      arr.forEach((item:any) => {
        if (item.mailContactorList) {
          newArr.push(...item.mailContactorList);
        }
      });
      return newArr;
    }
    onMounted(() => {
      getDefaultContingencyPlan()
    });
    return {
      showNodata,
      personCardClickFun,
      PersonDetailRef,
      getLeaderData,
      leaderData,
      returnMenberData,
      personInfoProps
    };
  },
});
</script>

<style lang="scss">
.specilLeader__right {
  height: 699px;
  width: 753px;
  border: 1px solid rgba(0, 193, 222, 0.29);
  &__title {
    width: 100%;
    height: 52px;
    background: linear-gradient(
      90deg,
      rgba(20, 98, 140, 0.35) 0%,
      rgba(14, 69, 100, 0) 100%
    );
    // opacity: 0.35;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 193, 222, 0.29);
    &__left {
      color: #fff;
      font-size: 16px;
      margin-left: 20px;
    }
    &__right {
      font-size: 16px;
      width: 64px;
      height: 32px;
      border: 1px solid #56e9ff;
      cursor: pointer;
      color: #56e9ff;
      text-align: center;
      line-height: 32px;
      margin-right: 12px;
    }
  }
  &__content {
    width: 100%;
    height: 647px;
    overflow: auto;
    background: rgba(0, 0, 0, 0.29);
    // 滚动条
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
    &__noData {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 647px;
      color: #fff;
    }
    &__contact {
      .specilLeader__contact__section1 {
        &-title {
          font-weight: 500;
          color: #56e9ff;
          width: 712px;
          margin: 0 auto;
          margin-top: 16px;
          margin-bottom: 14px;
          display: flex;
          justify-content: space-between;
          &__l {
          }
          &__r {
            cursor: pointer;
          }
        }
        &-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          width: 712px;
          margin: 0 auto;
          &:empty::before {
            content: '暂无';
            color: #ffffff;
            font-size: 14px;
            text-align: center;
            width: 100%;
            height: 100px;
            line-height: 100px;
            background: url(../assets/noPeople.svg) no-repeat;
            background-position: 46% 50%;
          }
        }
      }
      .specilLeader__contact__section2 {
        &-title {
          font-weight: 500;
          color: #56e9ff;
          width: 712px;
          margin: 0 auto;
          margin-top: 16px;
          margin-bottom: 14px;
          display: flex;
          justify-content: space-between;
          &__l {
          }
          &__r {
            cursor: pointer;
          }
        }
        &-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          width: 712px;
          margin: 0 auto;
          &:empty::before {
            content: '暂无';
            color: #ffffff;
            font-size: 14px;
            text-align: center;
            width: 100%;
            height: 100px;
            line-height: 100px;
            background: url(../assets/noPeople.svg) no-repeat;
            background-position: 46% 50%;
          }
          &--empty {
            display: flex;
            width: 346px;
            height: 47px;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            color: #fff;
            background-position: 34% 50%;
            background: linear-gradient(
              90deg,
              rgba(0, 193, 222, 0.3) 0%,
              rgba(24, 38, 50, 0) 100%
            );
            &__out {
              display: flex;
              width: 100%;
              align-items: center;
              justify-content: center;
              background: url(../assets/noPeople.svg) no-repeat;
              background-position: 17% 50%;
            }
          }
        }
      }
      .specilLeader__contact__section3 {
        &-title {
          font-weight: 500;
          color: #56e9ff;
          width: 712px;
          margin: 0 auto;
          margin-top: 16px;
          margin-bottom: 14px;
        }
        &-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          width: 712px;
          margin: 0 auto;
          &:empty::before {
            content: '暂无单位人员';
            color: #ffffff;
            font-size: 14px;
            text-align: center;
            width: 100%;
            height: 100px;
            line-height: 100px;
            background: url(../assets/noPeople.svg) no-repeat;
            background-position: 42% 50%;
          }
        }
      }
    }
  }
}
</style>
