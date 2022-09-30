// 组织架构右侧
<template>
  <div class="structure__right">
    <div class="structure__right__title">
      <div
        class="structure__right__title__left"
      >
        {{ deptInfoObj.name }}
      </div>
      <div
        v-if="isFromTreeClick"
        class="structure__right__title__right"
        @click="openUnitPopFun(deptInfoObj)"
      >
        详情
      </div>
    </div>
    <div class="structure__right__content">
      <div class="structure__right__content__contact">
        <div class="structure__contact__section1">
          <div
            v-if="isFromTreeClick"
            class="structure__contact__section1-title"
          >
            应急负责人
          </div>
          <div class="structure__contact__section1-content">
            <template v-if="dealPersonList(deptInfoObj.groupResponsibleTypeList).length>0">
              <div
                v-for="(item,index) in dealPersonList(deptInfoObj.groupResponsibleTypeList)"
                :key="index"
              >
                <PersonCard
                  v-for="(itemtwo,indextwo) in item"
                  :key="indextwo"
                  :person-data="itemtwo"
                  @clickEmit="personCardClickFun(itemtwo)"
                  @updateUsePeopleEmit="refreshUsePeople"
                />
              </div>
            </template>
            <template v-else>
              <div
                v-if="isFromTreeClick"
                class="structure__contact__section2-content--empty"
              >
                <div class="structure__contact__section2-content--empty__out">
                  暂未设置应急负责人，<div
                    style="color:#56E9FF;"
                    @click="openAddIndex"
                  >
                    点击设置
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="structure__contact__section2">
          <div
            v-if="isFromTreeClick"
            class="structure__contact__section2-title"
          >
            应急联络人
          </div>
          <div class="structure__contact__section2-content">
            <template v-if="dealPersonList(deptInfoObj.groupContactorTypeList).length>0">
              <div
                v-for="(item,index) in dealPersonList(deptInfoObj.groupContactorTypeList)"
                :key="index"
              >
                <PersonCard
                  v-for="(itemtwo,indextwo) in item"
                  :key="indextwo"
                  :person-data="itemtwo"
                  @clickEmit="personCardClickFun(itemtwo)"
                  @updateUsePeopleEmit="refreshUsePeople"
                />
              </div>
            </template>
            <template v-else>
              <div
                v-if="isFromTreeClick"
                class="structure__contact__section2-content--empty"
              >
                <div class="structure__contact__section2-content--empty__out">
                  暂未设置应急联络人，<div
                    style="color:#56E9FF;"
                    @click="openAddIndex"
                  >
                    点击设置
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="structure__contact__section3">
          <div
            v-if="isFromTreeClick"
            class="structure__contact__section3-title"
          >
            单位人员
          </div>
          <div class="structure__contact__section3-content">
            <PersonCard
              v-for="(item,index) in deptInfoObj.groupContactor"
              :key="index"
              :person-data="item"
              @clickEmit="personCardClickFun(item)"
              @updateUsePeopleEmit="refreshUsePeople"
            />
          </div>
        </div>
      </div>
      <div class="structure__right__content__special" />
      <div class="structure__right__content__scene" />
    </div>
  </div>
  <!-- 添加单位和应急岗位弹框 -->
  <AddIndex
    ref="AddIndexRef"
    :render-send-data="deptInfoObj"
    @refrash="refrash"
  />
  <!-- 人员详情弹窗 -->
  <PersonDetail
    ref="PersonDetailRef"
    :person-info-props="personInfoProps"
  />
  <!-- 单位详情弹框 -->
  <UnitDetail
    ref="UnitDetailRef"
    :unit-info-props="unitInfoProps"
  />
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
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
    isFromTreeClick: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['refrash', 'changeUsePeopleEmit'],
  setup(props, { emit }) {
    const AddIndexRef = ref<any>(null); // 添加单位Ref
    const PersonDetailRef = ref<any>(null); // 人员详情Ref
    const UnitDetailRef = ref<any>(null); // 单位详情Ref
    const responsePeopleList = ref([]);// 责任人数组
    responsePeopleList.value = props?.deptInfoObj.groupResponsibleTypeList;
    // 处理数据，返回人员信息对象数组
    function dealPersonList(arr:any) {
      if (arr) {
        const newArr:any = [];
        arr.forEach((item:any) => {
          if (item.malicontactorList) {
            item.malicontactorList.forEach((item2:any) => {
              item2.typelist = item.eventTypeIdList;
            });
            newArr.push(...[item.malicontactorList]);
          }
        });
        return newArr;
      }
      return [];
    }

    // 添加人员和应急岗位弹框
    function openAddIndex() {
      console.log(props.deptInfoObj);
      if (AddIndexRef.value) {
        AddIndexRef.value.open();
      }
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
    // 打开单位详情弹窗
    const unitInfoProps = ref({});
    function openUnitPopFun(obj:any) {
      unitInfoProps.value = obj;
      if (UnitDetailRef.value) {
        UnitDetailRef.value.open();
      }
    }
    // 刷新当前panel
    function refrash() {
      emit('refrash');
    }
    // 刷新常用联系人
    function refreshUsePeople() {
      emit('changeUsePeopleEmit');
    }
    return {
      AddIndexRef,
      openAddIndex,
      PersonDetailRef,
      personCardClickFun,
      UnitDetailRef,
      openUnitPopFun,
      unitInfoProps,
      dealPersonList,
      personInfoProps,
      refrash,
      refreshUsePeople,
    };
  },
});
</script>

<style lang="scss">
.structure__right {
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
    padding-top: 15px;
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
    &__contact {
      .structure__contact__section1 {
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
          // overflow: hidden;
        }
      }
      .structure__contact__section2 {
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
      .structure__contact__section3 {
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
            content: "暂无单位人员";
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
    &__special {
    }
    &__scene {
    }
  }
}
</style>
