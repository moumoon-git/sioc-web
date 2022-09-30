// 人员详情弹窗
<template>
  <transition name="bounce">
    <div v-if="isShow" class="unitDetailPop">
      <div class="unitDetailPop__title">
        <div class="unitDetailPop__title__left">
          {{ unitInfoProps.name }}
        </div>
        <div class="unitDetailPop__title__close" @click="isShow = false" />
      </div>
      <div class="unitDetailPop__content">
        <div class="unitDetailPop__content__tabs">
          <div
            :class="[
              'unitDetailPop__content__tabs__tab',
              { 'unitDetailPop__content__tabs__tab--active': selectId === 1 },
            ]"
            @click="selectId = 1"
          >
            应急岗位
          </div>
          <div
            :class="[
              'unitDetailPop__content__tabs__tab',
              { 'unitDetailPop__content__tabs__tab--active': selectId === 2 },
            ]"
            @click="selectId = 2"
          >
            单位信息
          </div>
        </div>
        <div v-if="selectId === 1" class="unitDetailPop__content__list">
          <div class="unitDetailPop__content__list__resonse">
            <div class="unitDetailPop__content__list__resonse__title">
              应急负责人
            </div>
            <div class="unitDetailPop__content__list__resonse__content">
              <!-- <Card :person-data="item[0]" v-for="(item,index) in dealPersonList(unitInfoProps.groupResponsibleTypeList)" :key="index" /> -->
              <PersonCard
                v-for="(item, index) in dealPersonList(
                  unitInfoProps.groupResponsibleTypeList,
                )"
                :key="index"
                :person-data="item[0]"
                @clickEmit="personCardClickFun(item[0])"
              />
            </div>
          </div>
          <div class="unitDetailPop__content__list__contact">
            <div class="unitDetailPop__content__list__contact__title">
              应急联络人
            </div>
            <div class="unitDetailPop__content__list__contact__content">
              <!-- <Card />
            <Card />
            <Card />
            <Card /> -->
              <PersonCard
                v-for="(item, index) in dealPersonList(
                  unitInfoProps.groupContactorTypeList,
                )"
                :key="index"
                :person-data="item[0]"
                @clickEmit="personCardClickFun(item[0])"
              />
            </div>
          </div>
        </div>
        <div v-if="selectId === 2" class="unitDetailPop__content__emergy">
          <div class="unitDetailPop__content__emergy__item">
            <div class="unitDetailPop__content__emergy__item__l">上级单位</div>
            <div class="unitDetailPop__content__emergy__item__r">
              {{ unitInfoProps.ancestors }}
            </div>
          </div>
          <div class="unitDetailPop__content__emergy__item">
            <div class="unitDetailPop__content__emergy__item__l">单位名称</div>
            <div class="unitDetailPop__content__emergy__item__r">
              {{ unitInfoProps.name }}
            </div>
          </div>
          <div class="unitDetailPop__content__emergy__item">
            <div class="unitDetailPop__content__emergy__item__l">单位地址</div>
            <div class="unitDetailPop__content__emergy__item__r">
              {{ unitInfoProps.address }}
            </div>
          </div>
          <div class="unitDetailPop__content__emergy__item">
            <div class="unitDetailPop__content__emergy__item__l">办公电话</div>
            <div class="unitDetailPop__content__emergy__item__r">
              {{ unitInfoProps.officePhone }}
            </div>
          </div>
          <div class="unitDetailPop__content__emergy__item">
            <div class="unitDetailPop__content__emergy__item__l">传真号码</div>
            <div class="unitDetailPop__content__emergy__item__r">
              {{ unitInfoProps.fax }}
            </div>
          </div>
          <div class="unitDetailPop__content__emergy__item">
            <div class="unitDetailPop__content__emergy__item__l">联系电话</div>
            <div class="unitDetailPop__content__emergy__item__r">
              {{ unitInfoProps.responsiblePhone }}
            </div>
          </div>
          <div class="unitDetailPop__content__emergy__item">
            <div class="unitDetailPop__content__emergy__item__l">电子邮箱</div>
            <div class="unitDetailPop__content__emergy__item__r">
              {{ unitInfoProps.email }}
            </div>
          </div>
          <div class="unitDetailPop__content__emergy__item">
            <div class="unitDetailPop__content__emergy__item__l">
              单位负责人
            </div>
            <div class="unitDetailPop__content__emergy__item__r">
              {{ unitInfoProps.responsible }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <!-- 人员详情弹窗 -->
  <PersonDetail ref="PersonDetailRef" :person-info-props="personInfoProps" />
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import Card from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/unitDetail/Card.vue'; // 应急负责人、联络人卡片
import PersonCard from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/personCard.vue'; // 人员卡片
import PersonDetail from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/personDetail/PersonDetail.vue'; // 人员详情弹窗

export default defineComponent({
  components: {
    Card, // 应急负责人、应急联络人卡片
    PersonCard, // 人员卡片
    PersonDetail, // 人员详情
  },
  props: {
    unitInfoProps: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const isShow = ref(false);
    const selectId = ref(1); // 选中的tab
    const PersonDetailRef = ref<any>(null); // 人员详情Ref
    // 打开弹窗
    function open() {
      isShow.value = true;
    }
    // 关闭弹窗
    function close() {
      isShow.value = false;
    }
    // 人员卡片点击方法
    const personInfoProps: any = reactive({});
    function personCardClickFun(obj: any) {
      (window as any).event.stopPropagation();
      console.log(obj);
      personInfoProps.value = obj;
      if (PersonDetailRef.value) {
        PersonDetailRef.value.open();
      }
    }
    // 处理数据，返回人员信息对象数组
    function dealPersonList(arr: any) {
      console.log(arr);
      const newArr: any = [];
      arr.forEach((item: any) => {
        if (item.malicontactorList) {
          newArr.push(...[item.malicontactorList]);
        }
      });
      console.log(newArr);
      return newArr;
    }
    return {
      isShow,
      open,
      close,
      selectId,
      dealPersonList,
      personInfoProps,
      PersonDetailRef,
      personCardClickFun,
    };
  },
  watch: {
    unitInfoProps: {
      handler(val) {
        console.log(val);
      },
      deep: true,
      immediate: true,
    },
  },
});
</script>

<style lang="scss" src="./style/style.scss"></style>
