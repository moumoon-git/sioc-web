// （现场指挥部）右侧
<template>
  <div class="sceneLeader__right">
    <div class="sceneLeader__right__title">
      <div class="sceneLeader__right__title__left">
        {{ deptInfoObj.name }}
      </div>
    </div>
    <div class="sceneLeader__right__content">
      <div
        v-if="showNodata"
        class="sceneLeader__right__content__noData"
      >
        暂无数据
      </div>
      <div
        v-else
        class="sceneLeader__right__content__contact"
      >
        <div class="sceneLeader__contact__section1">
          <div class="sceneLeader__contact__section1-title">
            <div class="sceneLeader__contact__section1-title__l">
              联络人
            </div>
          </div>
          <div class="sceneLeader__contact__section1-content">
            <!-- 组长 -->
            <div class="sceneLeader__contact__section1-content__major">
              <div class="sceneLeader__contact__section1-content__major__title">
                组长
              </div>
              <div class="sceneLeader__contact__section1-content__major__content">
                <PersonCard
                  v-for="(item,index) in returnMajorData(deptInfoObj.children)"
                  :key="index"
                  :person-data="item"
                />
              </div>
            </div>
            <div class="sceneLeader__contact__section1-content__majorTwo">
              <div class="sceneLeader__contact__section1-content__majorTwo__title">
                副组长
              </div>
              <div class="sceneLeader__contact__section1-content__majorTwo__content">
                <PersonCard
                  v-for="(item,index) in returnMajorTwoData(deptInfoObj.children)"
                  :key="index"
                  :person-data="item"
                />
              </div>
            </div>
            <!-- 副组长 -->
          </div>
        </div>
        <div class="sceneLeader__contact__section2">
          <div class="sceneLeader__contact__section2-title">
            <div class="sceneLeader__contact__section2-title__l">
              成员单位
            </div>
          </div>
          <div class="sceneLeader__contact__section2-content">
            <div
              v-for="(item,index) in deptInfoObj.children"
              :key="index"
              class="sceneLeader__contact__section2-content__item"
            >
              <div class="sceneLeader__contact__section2-content__item__title">
                {{ `${item.name}${item.leadUnit===1?`牵头单位`:``}` }}
              </div>
              <div class="sceneLeader__contact__section2-content__item__content">
                <PersonCard
                  v-for="(item2,index2) in returnMenber(item)"
                  :key="index2"
                  :person-data="item2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, getCurrentInstance,
} from 'vue';
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
  props: {
    deptInfoObj: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showNodata = ref(false);
    // 返回组长数据
    function returnMajorData(arr:any) {
      const newArr:any = [];
      arr.forEach((item:any) => {
        if (item.leadUnit === 1) {
          newArr.push(...item.mailResponseList);
        }
      });
      return newArr;
    }
    // 返回副组长数据
    function returnMajorTwoData(arr:any) {
      const newArr:any = [];
      arr.forEach((item:any) => {
        if (item.leadUnit === 2) {
          newArr.push(...item.mailResponseList);
        }
      });
      return newArr;
    }
    // 返回成员单位数据
    function returnMenber(obj:any) {
      let newArr:any = [];
      newArr = [...obj.mailContactorList, ...obj.mailResponseList];
      return newArr;
    }
    onMounted(() => {
    });
    return {
      showNodata,
      returnMajorData,
      returnMajorTwoData,
      returnMenber,
    };
  },
});
</script>

<style lang="scss">
.sceneLeader__right {
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
      .sceneLeader__contact__section1 {
        &-title {
          font-weight: 500;
          color: #fff;
          width: 712px;
          margin: 0 auto;
          margin-top: 16px;
          margin-bottom: 14px;
          height: 44px;
          text-align: center;
          line-height: 24;
          background: url(../assets/leaderTitle.svg) no-repeat;
          background-size: 100% 100%;
          &__l {
            height: 100%;
            line-height: 44px;
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
          flex-direction: column;
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
          // 组长
          &__major{
            &__title{
              color:rgba(86, 233, 255, 1);
              font-size: 16px;
              font-weight: 500;
              margin-bottom: 15px;
            }
            &__content{
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
                display: block;
              }
            }
          }
          // 副组长
          &__majorTwo{
            &__title{
              color:rgba(86, 233, 255, 1);
              font-size: 16px;
              font-weight: 500;
              margin-bottom: 15px;
            }
            &__content{
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
                display: block;
              }
            }
          }
        }
      }
      .sceneLeader__contact__section2 {
        &-title {
          font-weight: 500;
          color: #fff;
          width: 712px;
          margin: 0 auto;
          margin-top: 16px;
          margin-bottom: 14px;
          height: 44px;
          text-align: center;
          line-height: 24;
          background: url(../assets/leaderTitle.svg) no-repeat;
          background-size: 100% 100%;
          &__l {
            height: 100%;
            line-height: 44px;
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
          flex-direction: column;
          &__item{
            &__title{
              color:rgba(86, 233, 255, 1);
              font-size: 16px;
              font-weight: 500;
              margin-bottom: 15px;
            }
            &__content{
              display: flex;
              width: 712px;
              flex-wrap: wrap;
              justify-content: flex-start;
              overflow: hidden;
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
                display: block;
              }
            }
          }
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
      .sceneLeader__contact__section3 {
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
