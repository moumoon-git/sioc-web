<template>
  <div class="Auxiliary">
    <div class="Auxiliary-indent">
      <Title title="通用工具" class="Auxiliary-title" />
      <GeneralTools @sendMsg="getGeneralToolsMsg" />
      <Title title="模板标绘" class="Auxiliary-title">
        <span class="Auxiliary-seeSpan" @click="controlSTPopupFlag = true"
          >选择模板</span
        >
      </Title>
    </div>
    <div class="Auxiliary-distribution">
      <SelectTemplate
        ref="SelectTemplates"
        :list-data="listData"
        @sendMsg="getSelectTemplateMsg"
      />
      <TemplateContent
        :render-data="renderData"
        @sendMsg="getTemplateContentMsg"
      />
    </div>
    <div class="Auxiliary-indent">
      <!-- 协作标绘 -->
      <Title title="协作标绘" class="Auxiliary-title">
        <span class="Auxiliary-seeSpan" @click="InviteFun">发起邀请</span>
      </Title>
      <CollaborativePlotting
        :render-data="collaborativePlottingData"
        @deleteColl="deleteColl"
      />
      <!-- 图层数据 -->
      <!-- <Title title="图层数据" class="Auxiliary-title">
        <div class="Auxiliary-radio">
          <el-radio v-model="radio" label="1" @click="checkedAll($event)">
            全选
          </el-radio>
          <el-radio v-model="radio" label="2" @click="antiCheck($event)">
            反选
          </el-radio>
        </div>
      </Title> -->
      <!-- <LayerData ref="LayerDatas" @sendMsg="getLayerDataMsg" /> -->
    </div>
    <!-- 协作标绘地图弹窗 -->
    <div v-show="false">
      <MapPopup ref="MapPopups" enter="commandBrain" />
    </div>
    <!-- 弹窗选择模板 -->
    <SelectTemplatePopup
      v-if="controlSTPopupFlag"
      :check-data="checkList"
      enter="commandBrain"
      @sendMsg="getSelectTempMsg"
    />
  </div>
  <InvitePopStepOne ref="InvitePopStepOneRef" :from="`commandBrain`" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 蓝色标题
import Title from '@/product/CommandBrain3.0/Generalparts/left/Title/Title.vue';
// 协作标绘地图弹窗
import MapPopup from '@/product/Coplotting/generalparts/MapPopup/MapPopup.vue';
// 选择模板弹窗
import SelectTemplatePopup from '@/product/Coplotting/module/TemplateCoplotting/components/SelectTemplatePopup.vue';
// 邀请协作
import InvitePopStepOne from '@/product/Coplotting/module/MapPlotting/CooperationPanel/component/InvitePopStepOne.vue';
// 通用工具
import GeneralTools from './auxiliary/GeneralTools.vue';
// 标绘模板
import SelectTemplate from './auxiliary/SelectTemplate.vue';
// 选择模板
import TemplateContent from './auxiliary/TemplateContent.vue';
// 协作标绘
import CollaborativePlotting from './auxiliary/CollaborativePlotting.vue';
// 图层数据
// import LayerData from './auxiliary/LayerData.vue';
// 设置落点
import auxiliaryScript from './auxiliary/script/auxiliaryScript';

export default defineComponent({
  components: {
    Title,
    GeneralTools,
    SelectTemplate,
    TemplateContent,
    CollaborativePlotting,
    // LayerData,
    // 协作标绘地图弹窗
    MapPopup,
    // 选择模板弹窗
    SelectTemplatePopup,
    InvitePopStepOne,
  },
  setup() {
    return auxiliaryScript();
  },
  data() {
    return {
      radio: '1',
    };
  },
});
</script>

<style lang="scss">
.Auxiliary {
  width: 100%;
  height: 100%;
  padding: 8px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.Auxiliary-title {
  padding-right: 20px;
  box-sizing: border-box;
}
.Auxiliary-indent {
  padding: 0 0 0 20px;
}
.Auxiliary-distribution {
  height: calc(100% - 358px);
  display: flex;
  flex-direction: column;
}
.Auxiliary-seeSpan {
  font-size: 14px;
  font-weight: 600;
  color: #00ecff;
  cursor: pointer;
}
.Auxiliary-radio {
  span {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    &::after {
      width: 6px;
      height: 6px;
    }
  }
  .el-radio {
    margin-right: 10px;
  }
  .el-radio__label {
    padding-left: 4px;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #56e9ff;
    background: #56e9ff;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #ffffff;
  }
  .el-radio__inner {
    background: transparent;
  }
  label {
    &:last-child {
      margin: 0;
    }
  }
}
</style>
