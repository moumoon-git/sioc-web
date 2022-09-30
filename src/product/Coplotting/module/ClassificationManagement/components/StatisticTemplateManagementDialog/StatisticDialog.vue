// 协同标绘-数据统计弹窗
<template>
  <ElDialog
    v-model="visible"
    custom-class="sv-dialog"
    title="数据统计"
    width="1000px"
  >
    <div :class="$style.container">
      <!-- 1. 分类列表 -->
      <nav>
        <ul>
          <!-- TODO 分类预览 -->
          <li
            v-for="classification in classificationList"
            :key="classification?.id"
            :class="{
              [$style.activeItem]: classification === currentClassification,
            }"
            @click="handleClickClassification(classification)"
          >
            <!-- 点分类预览 -->
            <span v-if="classification?.basicClassType === 0">
              <div :class="$style.preview">
                <div
                  :class="$style.icon"
                  :style="{
                    backgroundImage: `url('${baseURL}${classification?.defaultStatus?.iconUrl}')`,
                  }"
                />
              </div>
            </span>
            <!-- 面分类预览 -->
            <span v-else-if="classification?.basicClassType === 1">
              <div :class="$style.preview">
                <div
                  :class="$style.area"
                  :style="{
                    borderColor: classification?.defaultStatus?.stylePropertyEntity?.strokeColor,
                    borderWidth: `${classification?.defaultStatus?.stylePropertyEntity?.lineHeight}px`,
                    borderStyle: classification?.defaultStatus?.stylePropertyEntity?.lineType ? 'solid' : 'dashed',
                  }"
                >
                  <div
                    :style="{
                      background: classification?.defaultStatus?.stylePropertyEntity?.fillColor,
                      opacity: classification?.defaultStatus?.stylePropertyEntity?.fillOpacity / 100,
                    }"
                  />
                </div>
              </div>
            </span>
            <!-- 线分类预览 -->
            <span v-else-if="classification?.basicClassType === 2">
              <div :class="$style.preview">
                <div
                  :class="$style.line"
                  :style="{
                    color: classification?.defaultStatus?.stylePropertyEntity?.fillColor,
                    borderTopWidth: `${classification?.defaultStatus?.stylePropertyEntity?.lineHeight}px`,
                    borderTopStyle: classification?.defaultStatus?.stylePropertyEntity?.lineType ? 'solid' : 'dashed',
                    opacity: classification?.defaultStatus?.stylePropertyEntity?.fillOpacity / 100,
                  }"
                />
              </div>
            </span>
            <!-- 其他分类预览 -->
            <span v-else-if="classification?.basicClassType === 3">
              <div :class="$style.preview">
                <div
                  :class="$style.other"
                  :style="{
                    background: classification?.defaultStatus?.stylePropertyEntity?.strokeColor,
                    height: `${classification?.defaultStatus?.stylePropertyEntity?.lineHeight}px`,
                    opacity: classification?.defaultStatus?.stylePropertyEntity?.fillOpacity / 100,
                  }"
                />
              </div>
            </span>
            <span>{{ classification.className }}</span>
          </li>
        </ul>
      </nav>
      <!-- 2. 图形 -->
      <div
        v-for="(graph, index) in graphList"
        :key="graph?.id ?? index"
      >
        <component
          :is="componentList[graph?.countType]"
          :display-only="true"
          :data="graph?.data || []"
        />
      </div>
    </div>
  </ElDialog>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import {
  defineComponent,
  getCurrentInstance,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';
// 六种图形
import BarGraph from './components/BarGraph/BarGraph.vue';
import CardGraph from './components/CardGraph/CardGraph.vue';
import LineGraph from './components/LineGraph/LineGraph.vue';
import PieGraph from './components/PieGraph/PieGraph.vue';
import RankGraph from './components/RankGraph/RankGraph.vue';
import SummaryGraph from './components/SummaryGraph/SummaryGraph.vue';

export default defineComponent({
  name: 'StatisticDialog',
  components: {
    BarGraph,
    CardGraph,
    LineGraph,
    PieGraph,
    RankGraph,
    SummaryGraph,
  },
  setup() {
    const { $http }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const mapId = Number(useRoute().query.mapId);
    // 当前选中的分类
    const currentClassification = ref<any>(null);
    // 图列表
    const graphList = ref<any>([]);
    // 分类列表
    const classificationList = ref([]);
    /**
     * 获取当前地图的分类列表
     */
    function getClassificationList() {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistbasicclass/listByMap',
        params: {
          mapId,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          classificationList.value = response?.data?.data || [];
          // 默认选定第一条
          if (classificationList.value.length) {
            handleClickClassification(classificationList.value[0]);
          }
        } else {
          ElMessage.error(`获取分类列表失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取分类列表失败，错误信息：${error}`);
      });
    }
    getClassificationList();
    /**
     * 获取具体的模板统计数据
     * @param templateData 模板数据
     */
    function getStatisticsData(templateData: any) {
      const request = {
        method: 'GET',
        service: 'coplotting',
        url: '/assist/assistbasicclass/dataCount',
        params: {
          // 统计类型：1-汇总，2-饼状，3-折线，4-柱状，5-排行，6-分类卡片
          countType: templateData.countType,
          firstParam: templateData.firstParam,
          secondParam: templateData.secondParam,
          basicClassId: templateData.basicClassId,
          mapId,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          templateData.data = response.data.data || [];
          if (templateData.data?.[0]) {
            if (templateData.countType !== 5 && templateData.countType !== 6) {
              templateData.data[0].name = templateData.firstParam;
            }
          }
        } else {
          ElMessage.error(`获取${currentClassification.value?.className}统计数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取${currentClassification.value?.className}统计数据失败，错误信息：${error}`);
      });
    }
    /**
     * 获取分类详情（模板类型）
     */
    function getClassificationDetail(id: number) {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistcounttemplate/list',
        params: {
          basicClassId: id,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          graphList.value = response.data || [];
          // 限定4条数据
          graphList.value.length = 4;
          graphList.value.forEach((graph: any) => {
            getStatisticsData(graph);
          });
        }
      });
    }
    /**
     * 点击分类
     * @param classification 分类对象
     */
    function handleClickClassification(classification: any) {
      if (classification !== currentClassification.value && classification?.id) {
        currentClassification.value = classification;
        getClassificationDetail(classification.id);
      }
    }
    const visible = ref(false);
    /**
     * 打开弹窗
     */
    function open() {
      visible.value = true;
      if (!classificationList.value.length) {
        getClassificationList();
      }
    }
    /**
     * 组件列表
     */
    const componentList = {
      1: 'SummaryGraph',
      2: 'PieGraph',
      3: 'LineGraph',
      4: 'BarGraph',
      5: 'RankGraph',
      6: 'CardGraph',
    };
    return {
      visible,
      open,
      classificationList,
      handleClickClassification,
      graphList,
      componentList,
      currentClassification,
    };
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  display: grid;
  width: 1000px;
  height: 600px;
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: 300px 300px;
  justify-content: center;
  background: #E9ECF1;
  gap: 1px;
  overflow: hidden;
  border-radius: 4px;
  & > * {
    background: #FFF;
  }
  & > nav:first-child {
    grid-row-start: span 2;
    overflow: auto;
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
    & > ul {
      margin: 0;
      padding: 0;
      list-style: none;
      & > li {
        padding: 5px 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        &:hover {
          background: rgba(63, 146, 254, .1);
        }
        &.activeItem {
          border-left: 2px solid #0091FF;
          padding-left: 12px;
          background: rgba(63, 146, 254, .1);
        }
        & > span:first-child {
          display: inline-block;
          width: 50px;
          transform: scale(.3);
          flex-shrink: 0;
        }
        & > span:last-child {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.preview {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  background: no-repeat center/100% 100%;
}
.line,
.other {
  width: 70px;
  border-color: currentColor;
}
.area {
  box-sizing: border-box;
  width: 70px;
  height: 32px;
  & > div {
    height: 100%;
  }
}
</style>
