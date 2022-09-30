// 标注
<template>
  <div :class="`${returnNewClass('MapTagSection')}`">
    <div :class="`${returnNewClass('MapTagSection')}__opertion`">
      <div :class="`${returnNewClass('MapTagSection')}__opertion__title`">
        <div
          v-for="(item,index) in tabsArr"
          :key="index"
          :class="[`${returnNewClass('MapTagSection')}__opertion__title__item`,(index===chooseId?`${returnNewClass('MapTagSection')}__opertion__title--active`:'')]"
          @click="clickFun(index)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div :class="`${returnNewClass('MapTagSection')}__content`">
      <Tagging
        :list-data="taggingData"
        @refrashFun="refrashFun"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance, onMounted,watch
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Tagging from '@/product/Coplotting/module/MapPlotting/PlottingMapDetail/component/Tagging.vue';
import { ElMessage } from 'element-plus';
import returnClass from '@/product/Coplotting/module/MapPlotting/script/useReturnClass';

export default defineComponent({
  components: {
    Tagging, // 列表
  },
  props: {
    from: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const thisMapId:any = ref(0); // 当前的地图id
    console.log('当前的地图id是：');
    const store = useStore(); // 使用vuex
    const route = useRoute();
    // if (props.from === 'commandBrain') {
    //   thisMapId.value = store.state.coplotting.mapId;
    // } else {
    //   thisMapId.value = route.query.mapId;
    // }
    thisMapId.value = store.state.coplotting.mapId;
    console.log(thisMapId.value);
    const chooseId = ref(0);
    const tabsArr = ref(['全部', '点', '线', '面', '其他']);
    const taggingData:any = ref([]); // 标注数据
    function clickFun(index:number) {
      chooseId.value = index;
      getTaggingData(thisMapId.value);
    }
    function refrashFun() {
      getTaggingData(thisMapId.value);
    }
    const { returnNewClass } = returnClass(props);
    // 根据地图id，类型id获取标注列表数据
    const getTaggingData = (id:number) => {
      const dataobj :any = {
        mapId: id,
      };
      if (chooseId.value === 1) {
        dataobj.type = 0;
      }
      if (chooseId.value === 2) {
        dataobj.type = 2;
      }
      if (chooseId.value === 3) {
        dataobj.type = 1;
      }
      if (chooseId.value === 4) {
        dataobj.type = 3;
      }
      console.log(dataobj);
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistmarkrecord/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params: dataobj,
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          taggingData.value = response?.data || [];
          
        } else {
          ElMessage.error(`获取分类数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取分类数据失败，错误信息：${error}`);
      });
    };
        // 监听完成或者取消的时候刷新分组列表
    watch(() => store.state.coplotting.cancelDraw, (val, old) => {
      getTaggingData(thisMapId.value); // 默认加载全部标注列表
    });
    // 删除图层数据的时候刷新分组列表
    watch(() => store.state.coplotting.deleteId, (val, old) => {
      getTaggingData(thisMapId.value); // 默认加载全部标注列表
    });
    // 添加图层数据的时候刷新分组列表
    watch(() => store.state.coplotting.saveId, (val, old) => {
      getTaggingData(thisMapId.value); // 默认加载全部标注列表
    });
    onMounted(() => {
      getTaggingData(thisMapId.value); // 默认加载全部标注列表
    });
    return {
      tabsArr,
      chooseId,
      clickFun,
      taggingData,
      refrashFun,
      returnNewClass,
    };
  },
});
</script>

<style lang="scss">
.MapTagSection {
  &__opertion {
  display: flex;
    align-items: center;
    height: 32px;
    justify-content: center;
    margin: 20px 0;
    &__title {
      width: 250px;
      height: 30px;
      background: #ffffff;
      border-radius: 3px;
      border: 1px solid #cccccc;
      display: flex;
      &__item {
        width: 50px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        // border-right: 1px solid rgba(204, 204, 204, 0.76);
      }
      &__item:not(:nth-child(5)) {
        border-right: 1px solid rgba(204, 204, 204, 0.76);
      }
      &--active {
        color: #fff;
        background: #3f92fe;
      }
    }
  }
  &__content {
  }
}
// 指挥大脑样式
.MapTagSectionc {
  margin-top: 21px;
  &__opertion {
  display: flex;
    align-items: center;
    height: 32px;
    justify-content: center;
    margin: 20px 0;
    &__title {
      display: flex;
      width: 360px;
      height: 32px;
      border: 1px solid #00c1de;
      &__item{
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        width: 72px;
        height: 32px;
        color: #00c1de;
        &:not(:nth-child(5)){
          border-right: 1px solid rgba(0, 193, 222, 1)
        }
      }
      &--active {
        color: #fff;
        background: rgba(0, 193, 222, 1);
      }
    }
  }
  &__content {
    margin-top: 30px;
    .taggingSection:empty::before{
      content: '暂无数据';
      width: 100%;
      height: 88%;
      position: absolute;
      left: 0;
      background: url(./assets/command/empty.svg) no-repeat;
      background-position: 50% 50%;
      line-height: 846px;
      color: rgba(184, 195, 217, 1);
      font-weight: 500;
    }
    .taggingSection__item {
        margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    width: 360px;
    height: 30px;
    background: rgba(0, 193, 222, 0.15);
    border: 0;
    border-radius: 0;
    border-left: 2px solid rgba(86, 233, 255, 0);
        &:hover{
          background: rgba(0, 193, 222, 0.7);
           border:none;
          border-left: 2px solid rgba(86, 233, 255, 1);

        }
    }
  }
}
</style>
