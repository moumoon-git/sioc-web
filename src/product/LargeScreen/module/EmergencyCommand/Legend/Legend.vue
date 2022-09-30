<template>
  <div :class="$style.Legend">
    <h1>数据资源</h1>
    <main>
      <ul>
        <li v-for="(x, i) in legendData" :key="i" @click="controlVis(x)">
          <img
            :src="
              require(`./assets/${x.active ? x.name : x.name + '备份'}.svg`)
            "
            alt=""
          />
          <!-- <span>{{ x.name }}({{ x.data.length }})</span> -->
          <span>{{ x.name }}</span>
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import {
  defineComponent,
  ref,
  onMounted,
  getCurrentInstance,
  watch,
} from 'vue';
import LayerData from '@/product/CommandBrain3.0/FunModule/LeftModule/components/auxiliary/script/LayerData';

export default defineComponent({
  setup() {
    const store = useStore(); // 使用vuex
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $mapSetSpot }: any = instance?.appContext.config.globalProperties;
    // 图标管理
    const legendData = ref<any>([
      {
        name: '应急物资库',
        active: true,
        key: 'material',
        data: [],
      },
      {
        name: '风险隐患',
        active: true,
        key: 'risk',
        data: [],
      },
      {
        name: '监控设备',
        active: true,
        key: 'camera',
        data: [],
      },
      {
        name: '避难场所',
        active: true,
        key: 'refuge',
        data: [],
      },
      {
        name: '应急装备库',
        active: true,
        key: 'equipment',
        data: [],
      },
      {
        name: '防护目标',
        active: true,
        key: 'protect',
        data: [],
      },
      {
        name: '应急队伍',
        active: true,
        key: 'team',
        data: [],
      },
    ]);
    // 图标数据
    const { apiGetDataObj, addMapEvent } = LayerData();
    // 点击控制显示隐藏
    function controlVis(x: any) {
      console.log(x);
      x.active = !x.active;
      if (x.active && store.state.retrieval.retrievalStartupStatus) {
        (window as any).map.setCoverageShow(x.key);
      } else {
        (window as any).map.setCoverageHide(x.key);
      }
    }

    onMounted(() => {
      apiGetDataObj.value = {
        risk: [], // 风险隐患
        material: [], // 物资库
        protect: [], // 防护目标
        refuge: [], // 避难场所
        camera: [], // 摄像头
        team: [], // 应急队伍
        equipment: [], // 应急装备库
        // device: [], // 会场终端
        // colony: [], // 集群终端
        // wecomm: [], // wecomm
        // personnel: [], // 现场人员
      };
      addMapEvent();
    });

    // 监听资源检索启动情况
    watch(
      () => store.state.retrieval.retrievalStartupStatus,
      (newV) => {
        if (newV) {
          legendData.value.forEach((e: any) => {
            if (e.active) {
              (window as any).map.setCoverageShow(e.key);
            }
          });
        } else {
          legendData.value.forEach((e: any) => {
            (window as any).map.setCoverageHide(e.key);
          });
        }
      },
    );
    // 监听资源检索启动情况
    // watch(
    //   () => store.state.event,
    //   (newV) => {

    //   },
    // );
    return {
      legendData,
      controlVis,
    };
  },
});
</script>

<style lang="scss" module>
.Legend {
  width: 274px;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
  height: 447px;
  background: rgba(2, 5, 8, 0.81);
  opacity: 0.8;
  border: 2px solid;
  border-image: linear-gradient(
      270deg,
      rgba(0, 199, 255, 0),
      rgba(86, 233, 255, 1),
      rgba(86, 233, 255, 1),
      rgba(0, 218, 255, 1),
      rgba(0, 206, 255, 0)
    )
    2 2;
  & > h1 {
    font-size: 22px;
    font-weight: 500;
    color: #ffffff;
  }
  & > main {
    height: calc(100% - 33px);
    overflow-x: hidden;
    overflow-y: auto;
    & > ul {
      padding-bottom: 15px;
      box-sizing: border-box;
      & > li {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding-left: 18px;
        box-sizing: border-box;
        margin-top: 15px;
        & > img {
          width: 33px;
          height: 39px;
          margin-right: 17px;
        }
        & > span {
          font-size: 18px;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
    &::-webkit-scrollbar {
      width: 3px;
      height: 5px;
      /* background-color: rgba(100, 104, 105, 1); */
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
      background-color: rgba(100, 104, 105, 1);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
      border-radius: 10px;
    }
  }
}
</style>