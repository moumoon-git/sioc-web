<template>
  <div
    ref="MapPopup"
    :class="[
      $style.MapPopup,
      enter === 'commandBrain' ? $style.commandBrainMapPopup : '',
    ]"
  >
    <header>
      <span>{{ renderData ? renderData.name : '' }}</span>
      <span ref="closeMapPopup" />
      <div>{{ renderData ? renderData.addre : '' }}</div>
    </header>
    <!-- 中间展示 -->
    <main v-if="!popupType">
      <div>
        <FileExhibition :render-data="handleFiles" />
      </div>
      <DetailsInfo :render-data="tablePropertys" :enter="enter" />
    </main>
    <!-- 底部操作 -->
    <footer v-if="!popupType">
      <button v-if="editJurisdiction" @click="deleteFeature">删除</button>
      <button v-if="editJurisdiction" @click="edit($event)">编辑位置</button>
      <!-- <button v-if="editJurisdiction" @click="getDetails(1)">编辑属性</button> -->
      <button @click="getDetails">详情信息</button>
      <button v-if="enter === 'commandBrain'" @click="camera">附近监控</button>
      <button v-if="enter === 'commandBrain'" @click="peripheralRetrieval">周边检索</button>
    </footer>
    <!-- 转成标注 -->
    <div v-if="popupType === 'tagging'" :class="$style.tagging">
      <div @click="tagging">转换为标注</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { functionsIn } from 'node_modules/@types/lodash';
import FileExhibition from './components/FileExhibition.vue';
import DetailsInfo from './components/DetailsInfo.vue';

export default defineComponent({
  components: {
    FileExhibition,
    DetailsInfo,
  },
  props: {
    popupType: {
      type: String,
      default: '', // 'tagging' or ''
    },
    visData: {
      type: Object,
      default: () => {},
    },
    enter: {
      type: String,
      // 空是协同标绘中进入， commandBrain 为指挥一张图时进入
      default: '',
    },
  },
  setup(props, context) {
    interface CoverObj {
      vector?:string,
      mark?: string,
    }
    const store = useStore(); // 使用vuex
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const renderData: any = ref({});
    const handleFiles: any = ref({});
    const tablePropertys: any = ref([]);
    const MapPopup = ref<HTMLElement | any>(null);
    const closeMapPopup: any = ref(null);
    const datas: any = ref({});
    const pointId = ref(0); // 标注id
    const handleEl: any = ref({});
    const handleId = ref(0); // 操作ID
    const coverObj = ref<CoverObj>({mark:'',vector:''}); // 图层名字
    // 控制编辑权限
    const editJurisdiction: any = ref(true);
    // 设置地图弹窗
    function setMapPopup(data: any, e: any, visData: any) {
      // console.log(data, e);
      // console.log(renderData.value);
      handleEl.value = e;
      pointId.value = data.dataId;
      datas.value = data;
      data.class = MapPopup.value;
      window.map.mapPopup(data);
      handleId.value = data.id;
      const { id } = data;
      closeMapPopup.value.onclick = function () {
        console.log(id);
        window.map.closeClearPopup(id);
      };
      // 设置当前弹窗id
      store.commit('coplotting/SET_selfPopupId', id);
      if (visData) {
        renderData.value = visData;
      }
    }
    // 删除
    function deleteFeature() {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmarkrecord/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: pointId.value,
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            window.map.closeClearPopup(handleId.value);
            if (handleEl.value.CLASS_NAME === 'SuperMap.Marker') {
              window.map.removeMark(handleEl.value);
            } else if (
              handleEl.value.CLASS_NAME === 'SuperMap.Feature.Vector'
            ) {
              // 删除当个图形
              window.map.deleteSpecifiedData(
                (window as any).mapCoverageName.vector,
                handleEl.value.geometry.id,
              );
            }
            store.commit('coplotting/SET_deleteId', pointId.value);
          } else {
            ElMessage.error(
              `删除失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`删除失败，错误信息：${error}`);
        });
    }
    // 转成标注
    function tagging() {
      // pointInformation
      renderData.value.mapLocation = {
        lon: renderData.value.longitude,
        lat: renderData.value.latitude,
        longitude: renderData.value.longitude,
        latitude: renderData.value.latitude,
      };
      // console.log(renderData.value);
      store.commit('coplotting/SET_pointInformation', renderData.value);
      const openDeta = {
        handleType: 'add', // 操作类型 add添加 vis显示 edit编辑
        handleData: {}, // 操作的数据 包括获取详情的id
        flag: true, // 打开或者关闭
        title: '标注详情', // 详情弹窗时的模块 标注详情
      };
      store.commit('coplotting/SET_detailsPopUp', openDeta);
    }
    // 获取详情
    function getDetails(type: number) {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: `/assist/assistmarkrecord/info/${pointId.value}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      $http(request).then((r: any) => {
        if (r.code === 0 && r.data) {
          const datas: any = r.data;
          const handleFile = datas.files.reduce(
            (pre: any, x: any) => {
              switch (x.fileType) {
                case 1:
                  pre.videoAndImg.push(x);
                  break;
                case 2:
                  pre.videoAndImg.push(x);
                  break;
                case 3:
                  pre.txt = [x];
                  break;
                case 4:
                  pre.txt.push(x);
                  break;
                default:
                  break;
              }
              if (x.fileType !== 4) {
                x.src = (window as any).config.baseURL + x.fileUrl;
              }
              return pre;
            },
            {
              videoAndImg: [],
              txt: [],
            },
          );
          // console.log(handleFile);
          if (store.state.coplotting.detailsPopUp.flag) {
            const openDeta = {
              handleType: '', // 操作类型 add添加 vis显示 edit编辑
              handleData: {}, // 操作的数据 包括获取详情的id
              flag: false, // 打开或者关闭
              title: '' || '', // 详情弹窗时的模块 标注详情
            };
            store.commit('coplotting/SET_detailsPopUp', openDeta);
          }
          const obj = {
            title: '标注详情', // 详情弹窗时的模块 标注详情
            flag: true, // 是否打开
            handleData: {
              CLASS_NAME: handleEl.value.CLASS_NAME,
              handleFile,
              editOrDisplay: type,
              ...datas,
            }, // 传入的数据
          };
          store.commit('coplotting/SET_taggingInfo', obj);
          const CLASS_NAME = handleEl.value.CLASS_NAME.split('.');
          const openDeta = {
            handleType: 'edit', // 操作类型 add添加 vis显示 edit编辑
            handleData: {}, // 操作的数据 包括获取详情的id
            flag: true, // 打开或者关闭
            title: '标注详情', // 详情弹窗时的模块 标注详情
          };
          store.commit('coplotting/SET_detailsPopUp', openDeta);
          const leg = CLASS_NAME.length;
          // 图形参数
          const graphicParameters: any = {
            type: '',
            typeId: '',
            convergeName: '',
            graphicalType: CLASS_NAME[leg - 1],
          };
          switch (handleEl.value.data.markType) {
            case 0:
              graphicParameters.type = 'spot';
              break;
            case 1:
              graphicParameters.type = 'noodles';
              break;
            case 2:
              graphicParameters.type = 'line';
              break;
            case 3:
              graphicParameters.type = 'other';
              break;
            default:
              break;
          }
          if (graphicParameters.graphicalType === 'Marker') {
            graphicParameters.typeId = handleEl.value.icon.imageDiv.id;
            graphicParameters.convergeName = (coverObj.value.mark || (window as any).mapCoverageName.mark);
          } else {
            graphicParameters.typeId = handleEl.value.geometry.id;
            graphicParameters.convergeName = (coverObj.value.vector || (window as any).mapCoverageName.vector);
          }
          // console.log(handleEl.value);
          // console.log(graphicParameters);
          store.commit('coplotting/SET_graphicParameters', graphicParameters);
        }
      });
    }
    // 编辑
    const edit = (e: any) => {
      // console.log(e);
      const xy: any = {};
      if (MapPopup.value) {
        // 它的父级
        const parentEl = MapPopup?.value?.parentElement;
        // 父级的父级
        const parentEls = parentEl.parentElement;
        const y = parentEl.offsetTop + parentEls.offsetTop;
        const x = parentEl.offsetLeft + parentEls.offsetLeft;
        xy.x = x;
        xy.y = y;
      }
      console.log(handleEl.value, '编辑的');
      // console.log(handleEl.value.data);
      // 关闭弹窗
      window.map.closeClearPopup(handleId.value);
      const request = {
        method: 'get',
        service: 'coplotting',
        url: `/assist/assistmarkrecord/info/${pointId.value}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      $http(request).then((r: any) => {
        if (r.data) {
          handleEl.value.data.statusStyleJsonObject = {
            CLASS_NAME: handleEl.value.data.type,
          };
          const obj = {
            handleType: 'edit', // 操作类型 add 添加 vis 显示 edit编辑
            handleData: r.data, // 操作的数据 包括获取详情的id
            flag: false, // 打开或者关闭
            title: '', // 详情弹窗时的模块 标注详情
          };
          store.commit('coplotting/SET_detailsPopUp', obj);
          const CLASS_NAME = handleEl.value.CLASS_NAME.split('.');
          const leg = CLASS_NAME.length;
          // 图形参数
          const graphicParameter: any = {
            type: '',
            typeId: '',
            convergeName: '',
            graphicalType: CLASS_NAME[leg - 1],
          };
          r.data.markRecord.latitude = r.data.markRecord.laitude;
          const editObj = {
            handleType: '', // mark vector
            position: r.data.markRecord,
            xy,
            flag: true, // 控制绘制弹窗的显示
          };
          if (handleEl.value.CLASS_NAME === 'SuperMap.Marker') {
            graphicParameter.typeId = handleEl.value.icon.imageDiv.id;
            graphicParameter.convergeName = (coverObj.value.mark || (window as any).mapCoverageName.mark)
            const { graphicParameters } = store.state.coplotting;
            if (graphicParameters.typeId) {
              window.map
                .markScreening(
                  graphicParameters.convergeName,
                  graphicParameters.typeId,
                )
                .then((editCovObj: any) => {
                  console.log('搜索数据');
                  // 关闭拖拽 并还原之前的显示
                  return window.map.closeMarkDrop(editCovObj);
                })
                .then(() => {
                  console.log('关闭拖拽');
                  // 给编辑的那个marker绑定拖动事件
                  window.map.oepnMarkDrop(handleEl.value).then((res: any) => {
                    // 开启了拖拽编辑同时也显示操作完成和取消弹窗
                    editObj.handleType = 'mark';
                  });
                });
            } else {
              // 给编辑的那个marker绑定拖动事件
              window.map.oepnMarkDrop(handleEl.value).then((res: any) => {
                // 开启了拖拽编辑同时也显示操作完成和取消弹窗
                editObj.handleType = 'mark';
              });
            }
            // 绘制完成之后的图形参数
            store.commit('coplotting/SET_graphicParameters', graphicParameter);
          } else if (handleEl.value.CLASS_NAME === 'SuperMap.Feature.Vector') {
            editObj.handleType = 'vector';
            graphicParameter.convergeName = (
              window as any
            ).mapCoverageName.edit;
            window.map
              .getSpecifiedData(
                (window as any).mapCoverageName.vector,
                handleEl.value.geometry.id,
              )
              .then((res: any) => {
                const createFeaturesObj = {
                  ...res.data,
                };
                return (window as any).map.createFeatures(createFeaturesObj);
              })
              .then((featuresr: any) => {
                if (!featuresr) {
                  return;
                }
                // 删除指定的数据图形
                (window as any).map.deleteSpecifiedData(
                  (window as any).mapCoverageName.vector,
                  handleEl.value.geometry.id,
                );
                // 在某个图层上填加刚刚删除的图形
                (window as any).map.specifyVectorLayerAdd(
                  (window as any).mapCoverageName.edit,
                  [featuresr],
                );
                // 打开图层编辑
                (window as any).map.openVectorCoverageEdit(
                  (window as any).mapCoverageName.edit,
                );
                // console.log(featuresr);
                graphicParameter.typeId = featuresr.geometry.id;
                // 绘制完成之后的图形参数
                store.commit(
                  'coplotting/SET_graphicParameters',
                  graphicParameter,
                );
              });
          }
          store.commit('coplotting/SET_editCovData', editObj);
        }
      });
    };
    function camera(){
      const obj = {
        latitude: datas.value.latitude || datas.value.laitude,
        location: datas.value.address || '',
        address: datas.value.address || '',
        longitude: datas.value.longitude,
      }
      const peripheralSearch = {
        type: 'nearbyMonitoring',
        centerCircleData: obj,
        sourceData: JSON.parse(JSON.stringify(obj)),
      };
      store.commit('retrieval/SET_peripheralSearch', peripheralSearch);
    }
    function peripheralRetrieval() {
       const obj = {
        latitude: datas.value.latitude || datas.value.laitude,
        location: datas.value.address || '',
        address: datas.value.address || '',
        longitude: datas.value.longitude,
      }
      const peripheralSearch = {
        type: 'peripheralSearch',
        centerCircleData: obj,
        sourceData: JSON.parse(JSON.stringify(obj)),
      };
      store.commit('retrieval/SET_peripheralSearch', peripheralSearch);
    }
    // 编辑完信息之后也要关闭这个弹窗
    watch(
      () => store.state.coplotting.detailsPopUp,
      (newV) => {
        if (!newV.flag) {
          closeMapPopup.value.click();
        }
      },
    );
    return {
      renderData,
      handleFiles,
      tablePropertys,
      deleteFeature,
      MapPopup,
      setMapPopup,
      closeMapPopup,
      tagging,
      getDetails,
      edit,
      editJurisdiction,
      coverObj,
      // 附近监控
      camera,
      // 周边检索
      peripheralRetrieval,
    };
  },
});
</script>

<style lang="scss" module>
.MapPopup {
	position: relative;
	box-sizing: border-box;
	margin-left: 65px;
	margin-top: -60px;
	// margin-left: 500px;
	// margin-top: -700px;
	width: 363px;
	background: #fff;
	box-shadow: 0 6px 18px -3px rgba(0, 0, 0, .1);
	header {
		position: relative;
		box-sizing: border-box;
		margin: 0 28px 10px;
		padding-top: 28px;
		& > span {
			font-weight: 500;
			font-size: 20px;
			color: #333;
			&:nth-child(2) {
				position: absolute;
				right: 0;
				top: 28px;
				width: 17px;
				height: 17px;
				background: url("./assets/close.svg") no-repeat;
				background-size: 100% 100%;
				cursor: pointer;
			}
		}
		& > div {
			box-sizing: border-box;
			padding-right: 20px;
			font-weight: 400;
			font-size: 17px;
			color: #999;
		}
	}
	main {
		& > div {
			&:first-child {
				margin-bottom: 17px;
				padding: 0 14px;
			}
		}
	}
	footer {
		display: flex;
		justify-content: flex-start;
		padding: 10px 14px;
		background: #fbfbfb;
		& > button {
			// margin-right: 10px;
			margin-right: 10px;
			border: 1px solid #c5defe;
			// padding: 4px 11px;
			border-radius: 1px;
			outline: none;
			background: #fff;
			cursor: pointer;
			font-weight: 400;
			font-size: 17px;
			// color: #fff;
			color: #54a1ff;
			&:hover {
				// background: #0091ff;
				color: #0091ff;
			}
			// &:nth-child(1) {
			//   background: url('./assets/info.svg') no-repeat 0px 3px;
			//   background-size: 16px 16px;
			//   &:hover {
			//     background: url('./assets/info_active.svg') no-repeat 0px 3px;
			//     background-size: 16px 16px;
			//   }
			// }
			// &:nth-child(2) {
			//   background: url('./assets/location.svg') no-repeat 0px 3px;
			//   background-size: 16px 16px;
			//   &:hover {
			//     background: url('./assets/location_active.svg') no-repeat 0px 3px;
			//     background-size: 16px 16px;
			//   }
			// }
			// &:nth-child(3) {
			//   background: url('./assets/info.svg') no-repeat 0px 3px;
			//   background-size: 16px 16px;
			//   &:hover {
			//     background: url('./assets/info_active.svg') no-repeat 0px 3px;
			//     background-size: 16px 16px;
			//   }
			// }
		}
	}
	&::after {
		position: absolute;
		left: -7px;
		top: 30px;
		border: 13px solid #fff;
		border-right: none;
		border-top: none;
		width: 1px;
		content: "";
		transform: rotate(45deg);
	}
}
.tagging {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 67px;
	background: #fbfbfb;
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #c5defe;
		border-radius: 1px;
		width: 112px;
		height: 34px;
		cursor: pointer;
		font-weight: 400;
		font-size: 17px;
		color: #54a1ff;
	}
}
.commandBrainMapPopup {
	background: rgba(0, 36, 60, .82);
	box-shadow: none;
	header {
		box-sizing: border-box;
		margin: 0;
		padding: 8px 10px;
		background: linear-gradient(90deg, #32b0ff 0%, rgba(24, 38, 50, 0) 100%);
		span {
			font-weight: 600;
			font-size: 16px;
			color: #fff;
			&:nth-child(2) {
				right: 10px;
				top: 18px;
				width: 9px;
				height: 9px;
				background: url("./assets/close2.svg") no-repeat;
				background-size: 100% 100%;
			}
		}
		div {
			font-weight: 400;
			font-size: 16px;
			color: #fff;
		}
	}
	main {
		box-sizing: border-box;
		padding: 10px;
		& > div {
			border-color: rgba(86, 233, 255, .2);
			background: transparent;
			&:first-child {
				margin-bottom: 10px;
				padding: 0;
				& > div {
					& > div {
						&:first-child {
							width: 335px;
							height: 188px;
							button {
								border: 1px solid #00c1de;
								width: 76px;
								height: 32px;
								background: #00c1de;
								font-weight: 400;
								font-size: 14px;
								color: #fff;
							}
						}
					}
				}
				ul {
					li {
						border-radius: 16px;
						width: 76px;
						height: 24px;
						background: rgba(166, 173, 180, .25);
						box-shadow: 0 0 3px 0 #56e9ff;
						line-height: 24px;
						font-weight: 400;
						font-size: 12px;
						&:nth-child(1) {
							color: #56e9ff;
						}
						&:nth-child(2) {
							color: #ff9c6e;
						}
						&:nth-child(3) {
							color: #b37feb;
						}
						&:nth-child(4) {
							color: #32c5ff;
						}
					}
				}
			}
			&:last-child {
				padding: 0;
				border-bottom: none;
				ul {
					li {
						& > span:first-child {
							width: 84px;
							text-align: right;
							font-weight: 400;
							font-size: 14px;
							color: #fff;
						}
						& > span:last-child {
							font-weight: 500;
							font-size: 14px;
							color: #fff;
						}
					}
				}
			}
		}
	}
	footer {
		position: relative;
		background: transparent;
		button {
			padding-left: 20px;
			padding-right: 10px;
			// border: 1px solid #00c1de;
			border: none;
			border-right: 1px solid rgba(255, 255, 255, .15);
			background: transparent;
			font-weight: 400;
			font-size: 14px;
			color: #fff;
			// color: #00c1de;
			&:hover {
				// background: transparent;
				color: #00c1de;
			}
			&:last-child {
				border: none;
			}
			&:nth-child(1) {
				background: url("./assets/del.svg") no-repeat 0 3px;
				background-size: 16px 16px;
				&:hover {
					background: url("./assets/del_active.svg") no-repeat 0 3px;
					background-size: 16px 16px;
				}
			}
			&:nth-child(2) {
				background: url("./assets/location.svg") no-repeat 0 3px;
				background-size: 16px 16px;
				&:hover {
					background: url("./assets/location_active.svg") no-repeat 0 3px;
					background-size: 16px 16px;
				}
			}
			&:nth-child(3) {
				background: url("./assets/info.svg") no-repeat 0 3px;
				background-size: 16px 16px;
				&:hover {
					background: url("./assets/info_active.svg") no-repeat 0 3px;
					background-size: 16px 16px;
				}
			}
		}
		&::before {
			position: absolute;
			left: 0;
			top: -3px;
			width: 100%;
			height: 7px;
			background: url("./assets/border.png") no-repeat;
			background-size: 100% 100%;
			content: "";
		}
	}
	&::after {
		display: none;
	}
}
// @each $animal in heat, info, msg, location {
//   .icon-#{$animal} {
//     background: url('./assets/#{$animal}.svg') no-repeat;
//     background-size: 100% 100%;
//   }
//   .icon-#{$animal}Active {
//     background: url('./assets/#{$animal}_Active.svg') no-repeat;
//     background-size: 100% 100%;
//   }
// }
</style>
