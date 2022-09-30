<template>
  <div :class="$style.FieldDeployment">
    <h1>现场部署</h1>
    <!-- 标题 -->
    <Title title="通用工具" tips="GENERAL TOOLS"></Title>
    <GeneralTools @sendMsg="getGeneralToolsMsg" :class="$style.GeneralTools" />
    <div>
      <SelectTemplate
        :class="$style.SelectTemplate"
        ref="SelectTemplates"
        :list-data="listData"
        @sendMsg="getSelectTemplateMsg"
      />
      <TemplateContent
        :class="$style.TemplateContent"
        :render-data="renderData"
        @sendMsg="getTemplateContentMsg"
      />
    </div>
    <Title title="协作标绘" tips="COLLABORATIVE PLOTTI"></Title>
    <CollaborativePlotting
      :render-data="collaborativePlottingData"
      @deleteColl="deleteColl"
      :class="$style.CollaborativePlotting"
    />
    <Title title="周边信息" tips="KEY PLACES">
      <span :class="$style.titleRight">范围：2公里</span>
    </Title>
    <!-- <PeripheralInformation /> -->
    <div :class="$style.KeyPlacess">
      <KeyPlaces v-if="peripheryFlag" :list-data="resourceStat" />
    </div>
    <!-- 协作标绘地图弹窗 -->
    <div v-show="false">
      <MapPopup ref="MapPopups" enter="commandBrain" />
    </div>
    <!-- name: "避难场所",
num: 54,value:54 -->
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, watch, onMounted } from 'vue';
// 标题
import Title from '@/product/LargeScreen/generalparts/Title/Title.vue';
// 通用工具
import GeneralTools from '@/product/CommandBrain3.0/FunModule/LeftModule/components/auxiliary/GeneralTools.vue';
// 标绘模板
import SelectTemplate from '@/product/CommandBrain3.0/FunModule/LeftModule/components/auxiliary/SelectTemplate.vue';
// 选择模板
import TemplateContent from '@/product/CommandBrain3.0/FunModule/LeftModule/components/auxiliary/TemplateContent.vue';
// 协作标绘
import CollaborativePlotting from '@/product/CommandBrain3.0/FunModule/LeftModule/components/auxiliary/CollaborativePlotting.vue';
// 周边信息
// import PeripheralInformation from './PeripheralInformation/PeripheralInformation.vue';
// 设置落点
import auxiliaryScript from '@/product/CommandBrain3.0/FunModule/LeftModule/components/auxiliary/script/auxiliaryScript';
// 重点场所
import KeyPlaces from '@/product/LargeScreen/module/EmergencyAdmin/OverallRun/modules/Right/modules/KeyPlaces/KeyPlaces.vue';
// 协作标绘地图弹窗
import MapPopup from '@/product/Coplotting/generalparts/MapPopup/MapPopup.vue';

import OrganizationScript from '@/product/CommandBrain3.0/FunModule/LeftModule/components/organization/script/OrganizationScript';

export default defineComponent({
  components: {
    Title,
    GeneralTools,
    SelectTemplate,
    TemplateContent,
    CollaborativePlotting,
    // PeripheralInformation,
    KeyPlaces,
    MapPopup,
  },
  setup() {
    const store = useStore(); // 使用vuex
    const { resourceStat, getResourceStat } = OrganizationScript();
    const peripheryFlag = ref<boolean | any>(false);
    // getResourceStat()
    const {
      // 模板内容数据
      renderData,
      // 地图弹窗
      MapPopups,
      // 标绘模板的数据
      listData,
      // SelectTemplate El
      SelectTemplates,
      // 已选择的模板的数据
      checkList,
      // 获取通用工具发送过来的消息
      getGeneralToolsMsg,
      // 获取从模板标绘发送过来的消息
      getSelectTemplateMsg,
      // 获取选中模板的数据
      getTemplateContentMsg,
      // 控制选择模板弹窗显示
      controlSTPopupFlag,
      // 选择模板弹窗传过来的消息
      getSelectTempMsg,
      // 协同标绘数据
      collaborativePlottingData,
      // 删除某个协助
      deleteColl,
      // 图层数据
      LayerDatas,
      // 全选
      checkedAll,
      // 反选
      antiCheck,
      // 从图层数据中获取到的数据
      getLayerDataMsg,
      InvitePopStepOneRef,
      InviteFun,
    } = auxiliaryScript();
    watch(
      () => store.state.event,
      (newVal) => {
        // console.log(newVal);
        getResourceStat(newVal);
      },
    );
    watch(resourceStat, () => {
      peripheryFlag.value = false;
      setTimeout(() => {
        peripheryFlag.value = true;
      });
    });
    // onMounted(() => {
    //   getResourceStat(store.state.event);
    // });
    return {
      resourceStat,
      // 模板内容数据
      renderData,
      // 地图弹窗
      MapPopups,
      // 标绘模板的数据
      listData,
      // SelectTemplate El
      SelectTemplates,
      // 已选择的模板的数据
      checkList,
      // 获取通用工具发送过来的消息
      getGeneralToolsMsg,
      // 获取从模板标绘发送过来的消息
      getSelectTemplateMsg,
      // 获取选中模板的数据
      getTemplateContentMsg,
      // 控制选择模板弹窗显示
      controlSTPopupFlag,
      // 选择模板弹窗传过来的消息
      getSelectTempMsg,
      // 协同标绘数据
      collaborativePlottingData,
      // 删除某个协助
      deleteColl,
      // 图层数据
      LayerDatas,
      // 全选
      checkedAll,
      // 反选
      antiCheck,
      // 从图层数据中获取到的数据
      getLayerDataMsg,
      InvitePopStepOneRef,
      InviteFun,
      // 控制周边信息显示
      peripheryFlag,
    };
  },
});
</script>

<style lang="scss" module>
.FieldDeployment {
  height: 100%;
  padding: 40px 35px 20px 35px;
  box-sizing: border-box;
  & > h1 {
    font-size: 60px;
    font-family: YouSheBiaoTiHei;
    color: #1bd8f2;
    line-height: 44px;
    letter-spacing: 2px;
    text-shadow: 0px 0px 13px rgba(10, 46, 57, 0.5);
    margin-bottom: 20px;
  }
}
.GeneralTools {
  ul {
    li {
      div {
        width: 55px;
        height: 55px;
      }
    }
  }
}
.SelectTemplate {
  height: 42px;
  & > div span {
    width: 15px;
    height: 18px;
  }
  ul {
    li {
      font-size: 18px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
.TemplateContent {
  max-height: 300px;
  min-height: 300px;
  & > header {
    & > ul {
      & > li {
        height: 35px;
        line-height: 35px;
      }
    }
  }
  & > main {
    & > ul {
      & > li {
        min-width: 98px;
        max-width: 98px;
        & > img {
          width: 34px;
          height: 34px;
        }
        & > span {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
}
.CollaborativePlotting {
  max-height: 190px;
  min-height: 190px;
  & > ul {
    & > li {
      font-size: 15px;
      padding: 0 8px;
    }
  }
}
.KeyPlacess {
  height: 200px;
  & > div {
    height: 100%;
    padding-right: 10px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    margin: 0;
    & > div {
      margin-top: 5px;
      width: 98%;
      height: 97%;
    }
    &::-webkit-scrollbar {
      width: 3px;
      height: 5px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
      background-color: #56e9ff;
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
      border-radius: 10px;
      background-color: #646869;
    }
  }
}
.titleRight {
  font-size: 16px;
  font-weight: 600;
  color: #00ecff;
}
</style>
