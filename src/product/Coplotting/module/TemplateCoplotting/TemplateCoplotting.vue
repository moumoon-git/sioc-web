<template>
  <div :class="$style.TemplateCoplotting">
    <header>
      <RollModelTitle
        ref="RollModelTitles"
        :list-data="listData"
        @sendMsg="getRollModelTitleS"
      />
    </header>
    <main>
      <Option ref="Options" :list-data="listData" @option="getMsg" />
    </main>
    <!-- 弹窗选择模板 -->
    <SelectTemplatePopup
      v-if="controlSTPopupFlag"
      ref="SelectTemplates"
      :check-data="checkData"
      @sendMsg="getSelectTempMsg"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  onMounted,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import RollModelTitle from './components/RollModelTitle.vue';
import Option from './components/Option.vue';
import SelectTemplatePopup from './components/SelectTemplatePopup.vue';

export default defineComponent({
  components: {
    RollModelTitle,
    Option,
    SelectTemplatePopup,
  },
  setup(props, context) {
    // 使用vuex
    const store = useStore();
    const thisMapId: any = ref(0); // 当前的地图id
    thisMapId.value = store.state.coplotting.mapId;
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    // SelectTemplate El
    const SelectTemplates = ref<HTMLElement | any>(null);
    const checkData = ref<any>([]);
    // 控制选择模板弹窗显示
    const controlSTPopupFlag = ref(false);
    const RollModelTitles: any = ref<HTMLElement | null>(null);
    const Options: any = ref<HTMLElement | null>(null);
    // 模板数据
    const listData: any = ref([]);
    // 获取下层组件消息
    function getMsg(params: any) {
      console.log(params);
      if (params.type === 'other') {
        if (params.modelType === 'doubleArrow') {
          params.stylePropertyJson.CLASS_NAME =
            'SuperMap.Geometry.GeoDoubleArrow';
        } else if (params.modelType === 'arrow') {
          params.stylePropertyJson.CLASS_NAME =
            'SuperMap.Geometry.GeoDiagonalArrow';
        }
      } else if (params.type === 'spot' && params.stylePropertyJson) {
        params.stylePropertyJson.src = params.src
          ? params.src
          : (window as any).config.baseURL + params.iconUrl;
      }
      if (params.stylePropertyJson) {
        params.stylePropertyJson.strokeDashstyle =
          params.stylePropertyJson.lineType === 0 ? 'dash' : 'solid';
      }
      store.commit('coplotting/SET_drawingWventsData', params);
    }
    // 获取消息 mainData
    function getSelectTempMsg(params: any) {
      controlSTPopupFlag.value = false;
      if (params.type === 'checkData') {
        checkData.value = params.checkData.reduce((pre: any, e: any) => {
          pre.push(e.id);
          return pre;
        }, []);
        listData.value = params.checkData;
        RollModelTitles.value.getElNodeWd();
        if (Options.value) {
          Options.value.mainData = [];
        }
        if (RollModelTitles.value) {
          RollModelTitles.value.init();
        }
      }
    }
    // 获取模板类型列表
    function getTemplateList() {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistmaptemplatetyperelated/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: thisMapId.value,
        },
      };
      $http(request).then((res: any) => {
        console.log(res);
        if (res.code === 0 && res.data) {
          // console.log(Options.value);
          if (res.data.length !== 0) {
            res.data[0].active = true;
            listData.value = res.data;
            checkData.value = res.data.reduce((pre: any, e: any) => {
              pre.push(e.id);
              return pre;
            }, []);
            Options.value.reqData = res.data[0];
            Options.value.selectTemplate();
            RollModelTitles.value.getElNodeWd();
          }
        }
      });
    }
    // 在选择模板中发送的消息
    function getRollModelTitleS() {
      Options.value.selectTemplate();
    }
    onMounted(() => {
      getTemplateList();
    });
    return {
      SelectTemplates,
      RollModelTitles,
      Options,
      checkData,
      getMsg,
      listData,
      getSelectTempMsg,
      controlSTPopupFlag,
      getRollModelTitleS,
    };
  },
});
</script>

<style lang="scss" module>
.TemplateCoplotting {
  width: 100%;
  height: 100%;
  & > header {
    height: 56px;
  }
  & > main {
    height: calc(100% - 56px);
    padding-top: 21px;
    box-sizing: border-box;
  }
}
</style>
