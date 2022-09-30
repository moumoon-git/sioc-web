<template>
  <div :class="$style.container">
    <!-- 1. 顶部栏 -->
    <header :class="$style.header">
      <!-- <span>总数 {{ totalNum }}</span> -->
      <span :class="$style.hideAll" @click.stop>
        {{ controlTotalFlag ? '全部显示' : '全部隐藏' }}
        <i
          :class="[
            $style.maskIcon,
            controlTotalFlag ? $style.iconVisible : $style.iconHide,
          ]"
          @click.stop="controlAllVis"
        />
      </span>
      <span
        :class="[$style.expandAll, { [$style.up]: isAllExpanded }]"
        @click="handleExpandAll"
        >{{ isAllExpanded ? '收起' : '展开' }}</span
      >
    </header>
    <!-- 2. 数据列表 -->
    <main :class="$style.main">
      <Expand
        v-for="(x, i) in listMenuData"
        :key="i"
        :ref="(el) => expandRefs.push(el)"
        :show-check="false"
        @fold-change="handleFoldChange"
      >
        <!-- 标题 -->
        <template #title>
          <div :class="$style.title">
            <span>{{ x.title }}</span>
            <i
              :class="[
                $style.titleIcon,
                x.active ? $style.iconVisible : $style.iconHide,
              ]"
              @click.stop="controlSelfChuildVis(x)"
            />
          </div>
        </template>
        <!-- 展开列表 -->
        <template #list>
          <ul :class="$style.iconList">
            <li
              v-for="(item, ind) in x.children"
              :key="ind"
              :class="{ [$style.itemInactive]: false }"
              @click.stop="controlVis(item, x)"
            >
              <i
                :class="$style.listIcon"
                :style="{
                  backgroundImage: `url(${useMapMarker(
                    item.name,
                    item.active,
                    true,
                  )})`,
                }"
              />
              <span>
                {{ item.name }}
                <!-- {{ `（${item.data?.length}）` }} -->
              </span>
            </li>
          </ul>
        </template>
      </Expand>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
// 地图标注
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
import Expand from '@/product/CommandBrain3.0/Generalparts/right/Expand/Expand.vue';
import LayerData from '@/product/CommandBrain3.0/FunModule/LeftModule/components/auxiliary/script/LayerData';
import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';
import useExpandControl from '../../scripts/useExpandControl';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'BasicData',
  components: {
    Expand,
  },
  setup() {
    // 【展开/折叠】控制逻辑
    const {
      expandRefs,
      isAllExpanded,
      handleExpandAll,
      handleFoldChange,
      doRefresh,
    } = useExpandControl();
    const { apiGetDataObj, addMapEvent, section } = LayerData();
    // 总数
    const totalNum: any = ref(0);
    // 总数据
    const totalData: any = ref([]);
    // 列表数据
    const listMenuData: any = ref([]);
    // 控制全部的显示隐藏
    const controlTotalFlag: any = ref(true);
    // 作为检查全部显示的触发条件
    const inspectCondition: any = ref(true);
    const store = useStore(); // 使用vuex
    // 插入数据
    function initData() {
      listMenuData.value = [
        {
          title: '风险管理',
          active: true,
          children: [
            {
              name: '防护目标',
              active: true,
              key: 'protect',
              src: useMapMarker('防护目标', 1, true),
            },
            {
              name: '风险隐患',
              active: true,
              key: 'risk',
              src: useMapMarker('风险隐患', 1, true),
            },
          ],
        },
        {
          title: '应急资源',
          active: true,
          children: [
            {
              name: '避难场所',
              active: true,
              key: 'refuge',
              src: useMapMarker('避难场所', 1, true),
            },
            {
              name: '应急物资库',
              active: true,
              key: 'material',
              src: useMapMarker('应急物资库', 1, true),
            },
            {
              name: '应急装备库',
              active: true,
              key: 'equipment',
              src: useMapMarker('应急装备库', 1, true),
            },
          ],
        },
        {
          title: '终端设备',
          active: true,
          children: [
            {
              name: '监控视频',
              active: true,
              key: 'camera',
              src: useMapMarker('监控视频', 1, true),
            },
            {
              name: '会场终端',
              active: true,
              key: 'device',
              src: useMapMarker('会场终端', 1, true),
            },
            {
              name: '集群终端',
              active: true,
              key: 'colony',
              src: useMapMarker('集群终端', 1, true),
            },
          ],
        },
        {
          title: '现场人员',
          active: true,
          children: [
            {
              name: '现场人员',
              active: true,
              key: 'personnel',
              src: useMapMarker('联系人', 1, true),
            },
          ],
        },
        {
          title: '应急队伍',
          active: true,
          children: [
            {
              name: '应急队伍',
              active: true,
              key: 'team',
              src: useMapMarker('应急队伍', 1, true),
            },
          ],
        },
        {
          title: '医疗机构',
          active: true,
          children: [
            {
              name: '医疗机构',
              active: true,
              key: 'medical',
              src: useMapMarker('医疗', 1, true),
            },
          ],
        },
        {
          title: '任务',
          active: true,
          children: [
            {
              name: '任务',
              active: true,
              key: 'task',
              src: useMapMarker('任务', 1, true),
            },
          ],
        },
      ];
    }
    // 控制图例显示
    function controlVis(params: any, parentData: any) {
      params.active = !params.active;
      inspectCondition.value = !inspectCondition.value;
      // 父级的激活显示
      if (parentData.children) {
        const notActiveData = parentData.children.filter((x: any) => !x.active);
        if (notActiveData.length === 0) {
          parentData.active = true;
        } else {
          parentData.active = false;
        }
      }
      if (params.active) {
        (window as any).map.setCoverageShow(params.key);
      } else {
        (window as any).map.setCoverageHide(params.key);
      }
    }
    // 控制单个类型图例显示
    function controlSelfChuildVis(params: any) {
      params.active = !params.active;
      inspectCondition.value = !inspectCondition.value;
      if (params.active) {
        params.children.forEach((ele: any) => {
          ele.active = params.active;
          (window as any).map.setCoverageShow(ele.key);
        });
      } else {
        params.children.forEach((ele: any) => {
          ele.active = params.active;
          (window as any).map.setCoverageHide(ele.key);
        });
      }
    }
    // 控制全部的显示和隐藏
    function controlAllVis() {
      controlTotalFlag.value = !controlTotalFlag.value;
      store.commit('retrieval/SET_legendState', controlTotalFlag.value);
      listMenuData.value.forEach((ele: any) => {
        ele.active = controlTotalFlag.value;
        if (ele.children) {
          ele.children.forEach((x: any) => {
            x.active = controlTotalFlag.value;
            if (x.active) {
              (window as any).map.setCoverageShow(x.key);
            } else {
              (window as any).map.setCoverageHide(x.key);
            }
          });
        }
      });
    }
    onMounted(() => {
      initData();
      addMapEvent();
    });
    watch(inspectCondition, (newV) => {
      const notActiveData = listMenuData.value.filter((x: any) => !x.active);
      if (notActiveData.length === 0) {
        controlTotalFlag.value = true;
      } else {
        controlTotalFlag.value = false;
      }
    });
    // 设备位置、状态变更，刷新数据
    const uns = ws.subscribe(
      `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
      (msg: any) => {
        if (msg?.msgType === 50006 || msg?.msgType === 50007) {
          setTimeout(() => {
            section();
          }, 3000);
        }
      },
    );
    onBeforeUnmount(uns);
    return {
      // 列表数据
      listMenuData,
      useMapMarker,
      expandRefs,
      isAllExpanded,
      handleExpandAll,
      handleFoldChange,
      // 控制图例显示
      controlVis,
      // 控制单个类型图例显示
      controlSelfChuildVis,
      // 总数
      totalNum,
      // 控制全部的显示和隐藏
      controlAllVis,
      // 控制全部的显示隐藏
      controlTotalFlag,
    };
  },
});
</script>

<style lang="scss" module>
@use '../../styles/common.scss';
.container {
  :global(.visualization-right__header__sort) {
    display: none !important;
  }
}
</style>
