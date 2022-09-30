<template>
  <div :class="$style.RightPopup">
    <Dialog
      ref="dialog"
      :visible="visible"
      :title="dialogTitle"
      @close="handleClose"
    >
      <div :class="$style.RightPopupWrap">
        <!-- 点线面头部 -->
        <SpotLineNoodlesHeader
          :selfModelData="selfModel"
          @sliderChange="sliderChange"
        />
        <!-- 范围检索 -->
        <div :class="$style.RightPopupMain">
          <!-- 路劲规划 -->
          <PathPlanning
            v-show="PathPlanningFlag === 'PathPlanning'"
            :listData="PathPlanningData"
            @selectPath="selectPath"
          />
          <!-- 筛选条件 -->
          <div style="margin-top: 10px">
            <Filter
              v-show="PathPlanningFlag === 'dataVis'"
              @sendMsg="getFilterMsg"
              :listData="listData"
            />
          </div>
          <!-- 数据显示 -->
          <main
            v-show="PathPlanningFlag === 'dataVis'"
            style="margin-top: 17px"
          >
            <DataPresentation
              ref="DataPresentations"
              :content-data="dataPresentationTransmitData"
              @handleNode="handleNode"
              :checked-box-flag="checkedBoxFlag"
              :modelValue="checkData"
            />
          </main>
        </div>
        <!-- 页脚 -->
        <footer>
          <FooterBtn :modelBtn="footerBtnData" @cancel="footerBtnCancel" />
        </footer>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, watch, computed, getCurrentInstance } from 'vue';
// 弹窗
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
// 点线面头部
import SpotLineNoodlesHeader from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/components/RightPopup/SpotLineNoodlesHeader.vue';
// 筛选
import Filter from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/components/RightPopup/Filter.vue';
// 数据显示
import DataPresentation from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/components/RightPopup/DataPresentation.vue';
// 路劲规划
import PathPlanning from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/components/RightPopup/PathPlanning.vue';
// 页脚
import FooterBtn from '@/product/CommandBrain3.0/FunModule/FastTrack/SearchScope/components/RightPopup/FooterBtn.vue';
// 获取图标
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';

export default defineComponent({
  components: {
    // 弹窗
    Dialog,
    // 筛选
    Filter,
    // 数据显示
    DataPresentation,
    // 点线面头部
    SpotLineNoodlesHeader,
    // 路劲规划
    PathPlanning,
    // 页脚
    FooterBtn,
  },
  props: {
    /**
     * 单一检索类型
     * @example '' 默认检索全部，显示顶部【点线面】按钮
     * @example 'video' 周边视频检索
     * @example 'people' 周边人员检索
     */
    singleSearchType: {
      type: String,
      default: '',
    },
    // 弹窗是否可见
    visible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {
    // 使用vuex
    const store = useStore();
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $mapSetSpot }: any = instance?.appContext.config.globalProperties;
    // 控制路径规划和数据筛查的显示
    const PathPlanningFlag = ref<string>('dataVis'); // dataVis数据显示 筛查显示 路劲规划
    // 弹窗标题
    const dialogTitle = computed(() => {
      switch (props.singleSearchType) {
        case 'video':
          return '周边视频';
        case 'people':
          return '现场人员';
        case 'nearby':
          return '附近监控';
        case 'peripheral':
          return '周边检索';
        default:
          return '范围检索';
      }
    });
    // 当前模块
    const selfModel = ref<any>({});
    // 筛选
    const Filters = ref<any>({});
    // 路径规划数据
    const PathPlanningData = ref<any>([]);
    // 控制页脚显示的数据
    const footerBtnData = ref<any>({});
    // 数据显示
    const dataPresentationData = ref<any>([]);
    // 数据显示 传递的数据
    const dataPresentationTransmitData = ref<any>([]);
    // 数据显示li点击时的旧数据和新数据记录
    const dataPresentLiOldandNew = ref<object | any>({ newV: {}, oldV: {} });
    // 控制选择框显示
    const checkedBoxFlag = ref(false);
    // 选择的数据
    const checkData = ref<any>([]);
    const listData = ref([
      {
        name: '集群组呼',
        active: 'default', // default true false
      },
      {
        name: '监控预览',
        active: 'default',
      },
      {
        name: '快捷会议',
        active: 'default',
      },
      {
        name: '快捷任务',
        active: 'default',
      },
      {
        name: '标绘数据',
        active: 'default',
      },
    ]);
    const DataPresentations:any = ref(null)
    // 激活类型的数据存储
    const activeTypeData = ref<any>({});
    // 初始化
    function init() {
      PathPlanningFlag.value = 'dataVis';
      selfModel.value = {};
      PathPlanningData.value = [];
      footerBtnData.value = {};
      listData.value.forEach((e: any) => {
        e.active = 'default';
      });
    }
    // 关闭弹窗
    function handleClose() {
      checkedBoxFlag.value = false;
      if(DataPresentations.value) {
        DataPresentations.value.clearMap();
      }
      (window as any).map.clearDrawConvergeData('检索点');
      context.emit('close');
    }
    // 滑竿值改变时
    function sliderChange(params: any) {
      let obj = {
        type: 'sliderChange',
        data: params,
      };
      context.emit('sendMsg', obj);
    }
    // 激活类型的数据筛选
    function activeTypeSelect(data: any) {
      data.handleData.forEach((e: any) => {
        if (e.active === 'true') {
          footerBtnData.value.active = e.active;
          footerBtnData.value.name = e.name;
          checkedBoxFlag.value = true;
        }
      });
      switch (footerBtnData.value.name) {
        case '集群组呼':
          dataPresentationTransmitData.value =
            dataPresentationData.value.reduce((pre: any, x: any) => {
              if (x.laber === '集群终端' || x.laber === 'wecomm终端') {
                pre.push(x);
              }
              return pre;
            }, []);
          break;
        case '快捷任务':
          dataPresentationTransmitData.value =
            dataPresentationData.value.reduce((pre: any, x: any) => {
              if (x.laber === '人员') {
                pre.push(x);
              }
              return pre;
            }, []);
          break;
        case '监控预览':
          dataPresentationTransmitData.value =
            dataPresentationData.value.reduce((pre: any, x: any) => {
              if (x.laber === '监控摄像头') {
                pre.push(x);
              }
              return pre;
            }, []);
          break;
        case '快捷会议':
          dataPresentationTransmitData.value =
            dataPresentationData.value.reduce((pre: any, x: any) => {
              if (
                x.laber === '监控摄像头' ||
                x.laber === 'wecomm终端' ||
                x.laber === '集群终端' ||
                x.laber === '会场终端' ||
                x.laber === '人员'
              ) {
                pre.push(x);
              }
              return pre;
            }, []);
          break;
        case '标绘数据':
          dataPresentationTransmitData.value =
            dataPresentationData.value.reduce((pre: any, x: any) => {
              if (x.laber === '协作标绘') {
                pre.push(x);
              }
              return pre;
            }, []);
          break;
        default:
          break;
      }
    }
    // 筛选按钮点击时或者显示隐藏资源按钮点击时
    function getFilterMsg(data: any) {
      if (data.type === 'selectModel') {
        activeTypeData.value = data;
        activeTypeSelect(data);
      } else if (data.type === 'switchChange') {
        if (data.handleData) {
          //显示隐藏资源
          store.commit('retrieval/SET_retrievalStartupStatus', true);
        } else {
          // 隐藏资源
          store.commit('retrieval/SET_retrievalStartupStatus', false);
        }
      }
    }
    // 点击取消
    function footerBtnCancel() {
      console.log(activeTypeData.value);
      activeTypeData.value.handleData.forEach((e: any) => {
        e.active = 'default';
      });
      footerBtnData.value.active = 'default';
      footerBtnData.value.name = '';
      checkedBoxFlag.value = false;
      dataPresentationTransmitData.value = dataPresentationData.value;
    }
    // 选择的录像
    function selectPath(x: any) {
      console.log(x);
      PathPlanningFlag.value = 'dataVis';
      selfModel.value.name = '自由线';
      selfModel.value.type = 'freeLine';
      let handleData: any = [];
      if (x.steps) {
        x.steps.forEach((e: any) => {
          if (e.transFromLonLatSpot) {
            handleData = handleData.concat(e.transFromLonLatSpot);
          }
        });
      }
      let obj = {
        type: 'selectPath',
        data: handleData,
        covName: x.covName,
      };
      context.emit('sendMsg', obj);
    }
    // 设置图片
    function setImg(
      key: string,
      condition: string,
      conditionData: any,
      img: any,
    ) {
      (window as any).map.modifyStyle(key, condition, conditionData, img);
    }
    // 对比条件
    function diffCondition(conditions: string) {
      let condition = 'id';
      switch (conditions) {
        case 'device':
          condition = 'deviceId';
          break;
        case 'wecomm':
          condition = 'deviceId';
          break;
        case 'camera':
          condition = 'deviceId';
          break;
        case 'colony':
          condition = 'deviceId';
          break;
        default:
          break;
      }
      return condition;
    }
    // 数据显示点击的li
    function handleNode(param: any) {
      console.log(param);
      $mapSetSpot.spotClickFun.open(
        param.handleType,
        { ...param },
        store.state.event?.id,
        (window as any).map,
      );
      const condition = diffCondition(param.handleType);
      // 新值和旧值的更改
      if (
        dataPresentLiOldandNew.value.newV['name'] &&
        dataPresentLiOldandNew.value.newV[condition] !== param[condition]
      ) {
        // 新值改变
        dataPresentLiOldandNew.value.oldV = dataPresentLiOldandNew.value.newV;
        const oldCondition = diffCondition(
          dataPresentLiOldandNew.value.oldV.handleType,
        );
        let oldImg = useMapMarker(dataPresentLiOldandNew.value.oldV.covName, 1);
        if (dataPresentLiOldandNew.value.oldV.checkedState) {
          oldImg = useMapMarker(dataPresentLiOldandNew.value.oldV.covName, 0);
        }
        dataPresentLiOldandNew.value.oldV.img = oldImg;
        dataPresentLiOldandNew.value.oldV.active = false;
        setImg(
          dataPresentLiOldandNew.value.oldV.covName,
          oldCondition,
          dataPresentLiOldandNew.value.oldV[oldCondition],
          {
            img: oldImg,
            height: 40,
            width: 40,
          },
        );
      }
      dataPresentLiOldandNew.value.newV = param;
      // 设置地图联动
      window.map.getMapMaxZoom().then((zoom: number) => {
        (window as any).map.setCentent(param, zoom);
      });
      let activeImg:any = useMapMarker(param.covName, 2);
      // 不在线的
      if (param.checkedState) {
        activeImg = useMapMarker(param.covName, -1);
      }
      param.active = true;
      // 延时渲染
      setTimeout(()=>{
        setImg(param.covName, condition, param[condition], {
          img: activeImg,
          height: 40,
          width: 40,
        });
      },500)
    }
    watch(PathPlanningData.value, (newV) => {
      console.log(newV);
    });
    watch(checkData.value, (newV) => {
      console.log(newV);
      footerBtnData.value.checkData = newV;
    });
    watch(dataPresentationData, (newV) => {
      dataPresentationTransmitData.value = newV;
      if (activeTypeData.value.handleData) {
        activeTypeSelect(activeTypeData.value);
      }
    });

    // change selfModel
    const changeSelfModel = (obj: any) => {
      Object.assign(selfModel.value, obj);
      console.log(
        '%c [ selfModel ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        selfModel,
      );
    };

    // context.expose({
    //   changeSelfModel,
    // });

    return {
      DataPresentations,
      Filters,
      init,
      listData,
      handleClose,
      sliderChange,
      selfModel,
      PathPlanningFlag,
      PathPlanningData,
      getFilterMsg,
      footerBtnData,
      selectPath,
      // 数据显示
      dataPresentationData,
      // 数据显示 传递的数据
      dataPresentationTransmitData,
      // 数据显示点击的li
      handleNode,
      // 控制选择框显示
      checkedBoxFlag,
      // 选择的数据
      checkData,
      // 点击取消
      footerBtnCancel,
      // 弹窗标题
      dialogTitle,
    };
  },
});
</script>

<style lang="scss" module>
.RightPopup {
	& > div {
		& > main {
			display: flex;
			flex-direction: column;
		}
	}
}
.RightPopupWrap {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
.RightPopupMain {
	display: flex;
	flex-direction: column;
	flex: 1;
	box-sizing: border-box;
	padding: 0 10px;
	// height: calc(100% - 94px);
	height: calc(100% - 155px);
	& > main {
		height: calc(100% - 94px);
		max-height: calc(100% - 94px);
		&::-webkit-scrollbar {
			width: 5px;
			height: 5px;
			background: transparent;
		}
		&::-webkit-scrollbar-corner {
			background: transparent;
		}
		&::-webkit-scrollbar-thumb {
			border-radius: 5px;
			background: #56e9ff;
		}
	}
}
</style>
