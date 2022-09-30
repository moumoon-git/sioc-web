<template>
  <TopHeader
    title="突发事件分析"
    :show-quarter="true"
    @change="handleQuarterChange"
  />
  <EventTotal ref="eventTotal" :totalData="totalData"></EventTotal>
  <Title title="重点突出类型" sub="KEY TYPES" />
  <Highlight :littleBallList="littleBallList"></Highlight>
  <Title title="重点区域" sub="KEY AREAS" />
  <KeyArea ref="keyArea" :areaOptions="areaOptions"></KeyArea>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from 'vue';
import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';
// 最顶部标题
import TopHeader from '../../components/TopHeader/TopHeader.vue';
// 小标题
import Title from '../../components/Title/Title.vue';

// 组件
import EventTotal from './components/EventTotal/EventTotal.vue';
import Highlight from './components/Highlight/Highlight.vue';
import KeyArea from './components/KeyArea/KeyArea.vue';

// module
import useEventTotal from './components/EventTotal/useEventTotal';
import useHighlight from './components/Highlight/useHighlight';
import useKeyArea from './components/KeyArea/useKeyArea';

export default defineComponent({
  name: 'Middle',
  components: {
    TopHeader,
    Title,
    EventTotal,
    Highlight,
    KeyArea,
  },
  setup() {
    const instance = getCurrentInstance();
    const { $ws }: any = instance?.appContext.config.globalProperties;
    const eventTotal = ref<HTMLElement | any>(null);
    const keyArea = ref<HTMLElement | any>(null);

    const { getTotalData, totalData } = useEventTotal();

    const { getLittleBallList, littleBallList } = useHighlight();

    const { getAreaOptions, areaOptions } = useKeyArea();

    const updateComponetMethods = () => {
      eventTotal.value.updateSwiper();
      keyArea.value.initEcharts();
    };

    let lastOption: { year: number; quarter: number };

    async function handleQuarterChange(option: {
      year: number;
      quarter: number;
    }) {
      lastOption = option;
      await getTotalData(option);
      await getLittleBallList(option);
      await getAreaOptions(option);
      updateComponetMethods();
    }

    onMounted(() => {
      handleQuarterChange({ year: '', quarter: '' } as any);
    });

    const un = $ws.subscribe(
      `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
      (msg: any) => {
        if (msg?.msgType === 60002) {
          handleQuarterChange(lastOption);
        }
      },
    );
    onBeforeUnmount(() => {
      un();
    });

    return {
      handleQuarterChange,
      totalData,
      littleBallList,
      areaOptions,
      eventTotal,
      keyArea,
    };
  },
});
</script>
