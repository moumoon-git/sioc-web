<template>
  <div
    :class="[
      `${returnNewClass('mapoperation')}`,
      isHide ? `${returnNewClass('mapoperation')}--active` : '',
    ]"
  >
    <div :class="`${returnNewClass('mapoperation')}__tabs`">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        :class="[
          `${returnNewClass('mapoperation')}__tabs__item`,
          index === chooseId
            ? `${returnNewClass('mapoperation')}__tabs__item--active`
            : '',
        ]"
        @click="tabFun(index)"
      >
        {{ item }}
      </div>
    </div>
    <div :class="`${returnNewClass('mapoperation')}__content`">
      <MapGroup
        v-if="chooseId === 0"
        :from="from"
      />
      <MapClassification
        v-if="chooseId === 1"
        :from="from"
      />
      <MapTagging
        v-if="chooseId === 2"
        :from="from"
      />
      <MapCooperation
        v-if="chooseId === 3"
        :from="from"
      />
      <MapImport
        v-if="chooseId === 4"
        :from="from"
      />
    </div>
    <div
      v-if="isHide"
      :class="`${returnNewClass('mapoperation')}__icon2`"
      @click="isHide = false"
    >
      <div :class="`${returnNewClass('mapoperation')}__icon2__arraw`" />
    </div>
    <div
      v-if="!isHide"
      :class="`${returnNewClass('mapoperation')}__icon`"
      @click="isHide = true"
    >
      <div :class="`${returnNewClass('mapoperation')}__icon__arraw`" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import returnClass from '@/product/Coplotting/module/MapPlotting/script/useReturnClass';
import MapGroup from './MapGroup.vue';
import MapClassification from './MapClassification.vue';
import MapTagging from './MapTagging.vue';
import MapCooperation from './MapCooperation.vue';
import MapImport from './MapImport.vue';

export default defineComponent({
  name: 'MapOperation',
  components: {
    MapGroup, // 分组
    MapClassification, // 分类
    MapTagging, // 标注
    MapCooperation, // 协作
    MapImport, // 地图导入
  },
  props: {
    from: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const route = useRoute();
    const showFlag = ref(false);
    const tabs = ref(['分组', '分类', '标注', '协作', '导入']);
    const chooseId = ref(0); // 选择的tab项
    const isHide = ref(false);
    function tabFun(index: number) {
      chooseId.value = index;
      if (index === 3) {
        localStorage.setItem('fromCoop', 'coop');
      } else {
        localStorage.setItem('fromCoop', 'other');
      }
    }
    const { returnNewClass } = returnClass(props);
    const isFromCoop = route.query.type;
    if (isFromCoop === 'share') {
      tabs.value = ['分组', '分类', '标注'];
    }
    if (isFromCoop === 'coop') {
      tabs.value = ['分组', '分类', '标注', '导入'];
    }
    return {
      tabs,
      chooseId,
      tabFun,
      isHide,
      showFlag,
      returnNewClass,
    };
  },
});
</script>
  <style  lang="scss" src="./style/index.scss"></style>
