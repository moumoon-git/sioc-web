<template>
  <div :class="$style.DataPresentation">
    <ul v-cloak>
      <li v-for="(x, i) in renderData" :key="i">
        <h1 @click="x.openListFlag = !x.openListFlag">
          <!-- 勾选框 checkedBox-Active -->
          <div
            :class="[
              $style.checkedBox,
              x.checkFlag ? $style['checkedBox-Active'] : '',
            ]"
            v-show="checkedBoxFlag"
            @click.stop="selectAll(x)"
          ></div>
          <span>{{ x.laber }} ({{ x.children.length }})</span>
          <span :class="x.openListFlag ? $style.transfromSpan : ''"></span>
        </h1>
        <div>
          <ul
            :class="[
              $style.DataPresentationContent,
              !x.openListFlag ? $style.DataPresentationContentHg : '',
            ]"
          >
            <li
              v-for="(item, ind) in x.children"
              :key="ind"
              @click="clickLi(item)"
              :class="item.active?$style['DataPresentationContentActiveLi']:''"
            >
              <!-- 勾选框 -->
              <div
                :class="[
                  $style.checkedBox,
                  item.checkFlag ? $style['checkedBox-Active'] : '',
                ]"
                v-show="checkedBoxFlag && !item.checkedState"
                @click.stop="selectSingle(item, x)"
              ></div>
              <div v-show="checkedBoxFlag && item.checkedState"></div>
              <img :src="item.img" alt="" />
              <div>
                <p><span>{{ item.name || item.deviceName }}</span> <span>{{calculateDistance(item.score)}}</span></p>
                <p>{{ item.address }}</p>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <!-- 标绘数据显示 -->
    <ul v-show="plottingResultFlag" >
      <Expand
        v-for="(x, i) in plottingResultArr[0]?.children"
        :key="i"
        :ref="(el) => expandRefs.push(el)"
        :show-check="false"
        @fold-change="handleFoldChange"
      >
        <!-- 标题 -->
        <template #title>
          <div :class="$style.title">
            <span>{{ x.laber }}({{x.count}})</span>
            <!-- <i
              :class="[
                $style.titleIcon,
                x.active ? $style.iconVisible : $style.iconHide,
              ]"
              @click.stop="toggleFolder(x)"
            /> -->
          </div>
        </template>
        <!-- 展开列表 -->
        <template #list>
          <ul :class="$style.iconList">
            <li
              v-for="(item, ind) in x.children"
              :key="ind"
              :class="{ [$style.itemInactive]: false }"
              @click.stop="clickLiItem(item)"
            >
              <i
                :class="$style.listIcon"
                :style="{
                  backgroundImage: `url('${item.url}')`,
                }"
              />
              <!-- filter: item.drawn ? '' : 'grayscale(1)', -->
              <div>
                <div>
                  {{ item.markName }}
                </div>
                <span>
                  {{ item.address }}
                </span>
                <!-- {{ `（${item.children?.length}）` }} -->
              </div>
            </li>
          </ul>
        </template>
      </Expand>
    </ul>
    <div v-show="false">
      <MapPopup
        ref="mapPopupRef"
        enter="commandBrain"
        :vis-data="{}"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Expand from '@/product/CommandBrain3.0/Generalparts/right/Expand/Expand.vue';
import useExpandControl from '@/product/CommandBrain3.0/Generalparts/right/MapTools/components/MapLegend/scripts/useExpandControl';
import useMapDrawing from '@/product/CommandBrain3.0/Generalparts/right/MapTools/components/MapLegend/modules/PlottingData/scripts/useMapDrawing';
// import {processData} from '@/product/CommandBrain3.0/Generalparts/right/MapTools/components/MapLegend/modules/PlottingData/services/usePlottingData'
import {ClassItem,ListItem} from '@/product/CommandBrain3.0/Generalparts/right/MapTools/components/MapLegend/modules/PlottingData/services/usePlottingData.dto'
// 地图弹窗
import MapPopup from '@/product/Coplotting/generalparts/MapPopup/MapPopup.vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import spotOrLineOrNoodles from '@/product/Coplotting/module/mainLogicJS/spotOrLineOrNoodlesRender';

export default defineComponent({
  props: {
    contentData: {
      type: Array,
      default: () => [],
    },
    // 控制选择框的显示
    checkedBoxFlag: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Expand,
    MapPopup,
  },
  setup(props, context) {
    const mapPopupRef = ref<any>(null);
    const { spotClickEvent } = spotOrLineOrNoodles($http, mapPopupRef);
    const markerClickHandler = (e: any) => {
      console.log('点击事件-----', e);
      spotClickEvent(e.object);
    };
    // 【展开/折叠】控制逻辑
    const {
      expandRefs,
      isAllExpanded,
      handleExpandAll,
      handleFoldChange,
    } = useExpandControl();
    // 绘制相关逻辑
    const {
      toggleFolder,
      clearMap,
    } = useMapDrawing(markerClickHandler);
    const plottingResultArr = ref<ListItem[]>([]);
    const renderData = ref<any>([]);
    const plottingResultFlag = ref<boolean>(false);
    function diffArr(arr: any, flag: boolean) {
      let a = props.modelValue.findIndex((x) => [...arr].every((y) => y === x));
      if (flag) {
        if (a === -1) {
          props.modelValue.push(arr[0]);
          context.emit('update:modelValue', props.modelValue);
        }
      } else {
        if (a !== -1) {
          props.modelValue.splice(a, 1);
          context.emit('update:modelValue', props.modelValue);
        }
      }
    }
    // 选择全部
    function selectAll(item: any) {
      item.checkFlag = !item.checkFlag;
      item.children.forEach((e: any) => {
        e.checkFlag = item.checkFlag;
        diffArr([e], e.checkFlag);
      });
    }
    // 选择单个
    function selectSingle(item: any, x: any) {
      item.checkFlag = !item.checkFlag;
      if (!item.checkFlag) {
        x.checkFlag = item.checkFlag;
      }
      diffArr([item], item.checkFlag);
    }
    // 点击了li
    function clickLi(param: any) {
      context.emit('handleNode', param);
    }
    async function drawMarker(item: ClassItem): Promise<any[]>{
      const { map } = window;
      const markerSize = [64, 32, 24];
      const markers = await map.setMultiMarker(
        '图例-标绘数据',
        item.children.map((record) => ({
          longitude: record.longitude,
          latitude: record.latitude || record.laitude,
          label: record.name,
          dataId: record.id,
          src: record.url,
          wd: markerSize[record.size],
          hg: markerSize[record.size],
        })),
        {
          click(e: any) {
            markerClickHandler(e);
          },
        },
      );
      return markers;
    };
    function clickLiItem(item:any){
      item.id = Number(item.id);
      item.latitude = item.laitude;
      spotClickEvent({
        data:item,
      });
    }
    // 计算距离
    function calculateDistance(param:string|number) {
      const num = Number(param);
      if(num<1){
        return `${Number(num.toFixed(2)) * 1000}m`;
      } else {
        return `${num.toFixed(2)}km`;
      }
    }
    watch(
      () => props.contentData,
      (newV) => {
        props.modelValue.splice(0);
        context.emit('update:modelValue', props.modelValue);
        renderData.value = JSON.parse(JSON.stringify(newV));
        if(renderData.value
        && renderData.value.length
        && renderData.value[renderData.value.length-1]['laber'] === '协作标绘') {
          clearMap();
          let hanldeArr = renderData.value.splice(renderData.value.length-1) || [];
          // arr = arr.length && arr[0].children || [];
          // let hanldeArr = processData(arr);
          hanldeArr = hanldeArr.filter((x:ListItem)=>{
            x.children = x.children.filter((el)=> {
              return el.children.length
            })
            x.count = x.children.reduce((pre,ele)=>{
              pre+= (ele.children.length || 0)
              return pre
            },0)
            return x.children.length
          })
          plottingResultArr.value = hanldeArr;
          console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', hanldeArr);
          (hanldeArr[0]?.children||[]).forEach((x:any) => {
            x.children.forEach((ele:any) => {
              ele.name = ele.markName;
              ele.statusStyle = ele.statusStyle?JSON.parse(ele.statusStyle):{size:0};
              ele.size = ele.statusStyle.size;
            });
            drawMarker(x);
          });
          // toggleAll(false, plottingResultArr.value, true);
          plottingResultFlag.value = true;
        } else {
          plottingResultFlag.value = false;
        }
        // renderData.value.forEach((x: any, i: number) => {
        //   x.children.forEach((e: any, ind: number) => {
        //     e.check_Id = `${i}_${ind}`;
        //   });
        // });
      },
    );
    onMounted(() => {
      // 禁用弹窗的编辑
      if (mapPopupRef.value) {
        mapPopupRef.value.editJurisdiction = false;
      }
    });
    return {
      clickLiItem,
      mapPopupRef,
      plottingResultArr,
      expandRefs,
      isAllExpanded,
      handleExpandAll,
      handleFoldChange,
      toggleFolder,
      clearMap,
      renderData,
      selectAll,
      selectSingle,
      clickLi,
      plottingResultFlag,
      calculateDistance,
    };
  },
});
</script>

<style lang="scss" module>
@use "@/product/CommandBrain3.0/Generalparts/right/MapTools/components/MapLegend/styles/common.scss";
.DataPresentation {
	overflow-x: hidden;
	overflow-y: auto;
	width: 100%;
	height: 100%;
	&::-webkit-scrollbar {
		border-radius: 10px;
		width: 3px;
		height: 5px;
	}
	&::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background-color: #56e9ff;

		-webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
	}
	&::-webkit-scrollbar-track {
		border-radius: 10px;
		background-color: #646869;

		-webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
	}
	ul {
		display: flex;
		overflow: hidden;
		list-style: none;
		flex-direction: column;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		width: 100%;
	}
	& > ul {
		& > li {
			margin-bottom: 10px;
			padding: 3px;
			border: 1px solid rgba(255, 255, 255, .1);
			transition: all .3s;
			&:hover {
				border-color: rgba(86, 233, 255, .5);
				& > h1 {
					border-color: #56e9ff;
					color: #56e9ff;
					&::before {
						border-left-color: #56e9ff;
						border-top-color: #56e9ff;
					}
					& > div {
						border-color: #56e9ff;
					}
					& > span:last-child {
						border-top-color: #56e9ff;
					}
					& > .checkedBox-Active {
						background: #56e9ff;
					}
				}
			}
			& > div {
				overflow-x: hidden;
				overflow-y: auto;
				max-height: 250px;
				&::-webkit-scrollbar {
					border-radius: 10px;
					width: 3px;
					height: 5px;
				}
				&::-webkit-scrollbar-thumb {
					border-radius: 10px;
					background-color: #56e9ff;

					-webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
				}
				&::-webkit-scrollbar-track {
					border-radius: 10px;
					background-color: #646869;

					-webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
				}
			}
		}
		h1 {
			display: flex;
			position: relative;
			align-items: center;
			box-sizing: border-box;
			margin: 0;
			padding-left: 17px;
			border: 1px solid rgba(166, 173, 180, .9);
			width: 100%;
			height: 32px;
			background: rgba(132, 160, 193, .11);
			cursor: pointer;
			font-weight: 400;
			font-size: 14px;
			color: #fff;
			& > span:last-child {
				position: absolute;
				right: 10px;
				top: 10px;
				border: 8px solid #a6adb4;
				border-left-color: transparent;
				border-right-color: transparent;
				border-bottom: 0;
				transition: .3s linear;
			}
			&::before {
				position: absolute;
				left: 3px;
				top: 3px;
				border: 3px solid #a6adb4;
				border-right-color: transparent;
				border-bottom-color: transparent;
				content: "";
			}
		}
	}
	:global(.visualization-right-expand) {
		margin: 0;
		margin-bottom: 10px;
	}
	.iconList {
		// flex-flow: wrap;
		color: #fff;
	}
}
.iconList > li{
  padding: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin-top: 13px;
  border-left: 2px solid transparent;
  height: 46px;
  .listIcon{
    margin-left: 6px;
    margin-right: 10px;
    width: 30px;
    height: 30px;
    min-width: 30px;
    min-height: 30px;
  }
  span{
    color: #a4adb5;
  }
}
.DataPresentationContent {
	transition: .3s linear;
	& > li {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		margin-top: 13px;
		border-left: 2px solid transparent;
		height: 46px;
		cursor: pointer;
		& > img {
			margin-left: 6px;
			margin-right: 10px;
			width: 30px;
			height: 30px;
		}
		& > div:first-child {
			margin-left: 10px;
			margin-right: 0;
		}
		& > div:nth-child(2) {
			margin-left: 10px;
			border: 1px solid #a4adb5;
			border-radius: 2px;
			width: 16px;
			min-width: 16px;
			height: 16px;
			min-height: 16px;
			background: #a4adb5;
		}
		& > div:last-child {
      flex: 1;
      padding-right: 5px;
      box-sizing: border-box;
      overflow: hidden;
			p {
				margin: 0;
				padding: 0;
				&:first-child {
					font-weight: 500;
					font-size: 14px;
					color: #fff;
          display: flex;
          justify-content: space-between;
				}
				&:last-child {
					font-weight: 400;
					font-size: 14px;
					color: #a4adb5;
					white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
				}
			}
		}
	}
}
.DataPresentationContentActiveLi {
	border-left-color: rgba(86, 233, 255, .7) !important;
	background: linear-gradient(90deg, rgba(0, 193, 222, .3) 0%, rgba(24, 38, 50, 0) 100%);
}
.DataPresentationContentHg {
	max-height: 0;
}
.transfromSpan {
	transform: rotate(180deg);
}
.checkedBox {
	position: relative;
	margin-right: 11px;
	border: 1px solid #fff;
	border-radius: 2px;
	width: 16px;
	min-width: 16px;
	height: 16px;
	min-height: 16px;
	cursor: pointer;
}
.checkedBox-Active {
	background: #fff;
	&::before {
		position: absolute;
		left: 5px;
		top: 0;
		border: 1px solid rgba(14, 23, 24, .8);
		border-left: 0;
		border-top: 0;
		width: 6px;
		height: 13px;
		content: "";
		transform: rotate(45deg);
	}
}

[v-cloak] {
	display: none;
}
</style>
