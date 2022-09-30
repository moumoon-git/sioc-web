<template>
  <div
    ref="mapconterpopup"
    :class="[
      $style.MapConterPopup,
      enter === 'commandBrain' ? $style.commandBrainMapConterPopup : '',
    ]"
    :style="{
      '--map-conter-popup-top': top,
      '--map-conter-popup-left': left,
    }"
  >
    <el-button @click="cancelDraw(false)" @mousedown.stop=""> 取消绘制 </el-button>
    <!-- <el-button>撤销上一节点</el-button> -->
    <el-button type="primary" @click="save"  @mousedown.stop=""> 完成绘制 </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
// import { dragEl } from '@/capacity/handleEl/handleEl';


interface initParam {
  longitude?: number;
  x?: number;
  latitude?: number;
  y?: number;
  map?: any;
}
export default defineComponent({
  props: {
    enter: {
      type: String,
      // 空是协同标绘中进入， commandBrain 为指挥一张图时进入
      default: '',
    },
    left: {
      type: String,
      default: '50px',
    },
    top: {
      type: String,
      default: '20px',
    },
  },
  setup(props, context) {
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $http, $message }: any =
      instance?.appContext.config.globalProperties;
    const store = useStore(); // 使用vuex
    const params: any = ref({});
    const types = ref('');
    const mapconterpopup = ref<HTMLElement | null>(null);
    const mapId = ref<string>('');
    // 默认是编辑模板的时候打开
    const openType = ref('template');
    // 整个详情的数据
    const saveDatas: any = ref({
      markRecord: {
        mapId: 0, // 当前地图id
        id: 0, // 如果是修改的对象时需要id
        groupId: 0, // 分组id grouping
        basicClassId: 0, // 基础分类id
        markType: 0, // 标注类型（0：点，2：线，1：面，3：其他) ，必填字段
        markName: '', // markName
        address: '', //
        longitude: 0, // 若是点线面则填第一个点
        laitude: 0,
        classtStatus: 0, // 状态id
        statusName: '', // 状态名称
        styleConfigIconId: 0,
        statusIconUrl: '', // 状态图标
        statusStyleJsonObject: null, // 状态样式（json,线/面标绘时保存）
        isShowOnAddress: 1, // 是否显示在地图上（0：否，1：是）
        isShowMarkName: 0, // 是否显示标绘名称（0：否，1：是）
        propertyType: 1, // 属性类别 1表单 2表格
        coordinatesJsonObject: {},
      },
      tablePropertys: [],
      files: [],
      needSetValue: 1,
    });
    // 取消标绘
    function cancelDraw(flag: boolean) {
      // console.log(window.map.map.layers);
      const dataObj: any = {};
      const { graphicParameters } = store.state.coplotting;
      const { detailsPopUp } = store.state.coplotting;
      if (!flag) {
        openType.value =
          store.state.coplotting.editCovData.handleType || 'template';
        if (openType.value === 'mark') {
          window.map
            .markScreening(
              graphicParameters.convergeName,
              graphicParameters.typeId,
            )
            .then((editCovObj: any) => {
              // 关闭拖拽 并还原之前的显示
              window.map.closeMarkDrop(editCovObj);
            });
        } else if (openType.value === 'vector') {
          console.log(detailsPopUp.handleData.markRecord, '绘制的');
          // 关闭拖拽 并还原之前的显示
          window.map.closeVectorCoverageEdit(
            (window as any).mapCoverageName.edit,
          );
          window.map.deleteSpecifiedData(
            (window as any).mapCoverageName.edit,
            graphicParameters.typeId,
          );
          dataObj.handleType = 'vector';
          dataObj.editLocationData = [detailsPopUp.handleData.markRecord];
        }
      }
      const obj = {
        flag: true,
        handleData: dataObj,
      };
      store.commit('coplotting/SET_cancelDraw', obj);
      (window as any).map.closeClearPopup(mapId.value);
    }
    // 保存数据
    function saveData(data: any) {
      (window as any).map.closeClearPopup(mapId.value);
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmarkrecord/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: saveDatas.value,
      };
      $http(request).then((res: any) => {
        if (res.code === 0) {
          data.id = res.data.id;
          const dataObj = {
            handleType: '',
            editLocationData: [data],
          };
          const obj = {
            flag: true,
            handleData: dataObj,
          };
          store.commit('coplotting/SET_cancelDraw', obj);
          store.commit('coplotting/SET_saveId', data.id);
        } else {
          $message.error(res.msg);
        }
      });
    }
    // 修改数据
    function upData() {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmarkrecord/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: saveDatas.value,
      };
      $http(request).then((res: any) => {
        cancelDraw(true);
      });
    }
    // 保存绘制
    function save() {
      openType.value =
        store.state.coplotting.editCovData.handleType || 'template';
      // console.log(store.state.coplotting.editCovData);
      const { drawingWventsData } = store.state.coplotting;
      const { graphicParameters } = store.state.coplotting;
      const { detailsPopUp } = store.state.coplotting;
      // console.log(graphicParameters);
      // console.log(detailsPopUp);
      // console.log(drawingWventsData);
      // console.log(openType.value);
      if (openType.value === 'template') {
        window.map
          .getCoverageData(graphicParameters.convergeName)
          .then((res: any) => {
            // console.log(res);
            let markType = 0;
            // 第一个位置经纬度
            let oneLocation: any = {};
            // 所有的经纬度数据
            let spotObj: any = {};
            switch (graphicParameters.type) {
              case 'noodles':
                spotObj.controlPoints =
                  res[0].geometry.components[0].components.reduce(
                    (pre: any, ele: any) => {
                      const obj = {
                        x: ele.x,
                        y: ele.y,
                      };
                      pre.push(obj);
                      return pre;
                    },
                    [],
                  );
                saveDatas.value.markRecord.statusStyleJsonObject =
                  drawingWventsData.stylePropertyJson;
                oneLocation = spotObj.controlPoints[0];
                oneLocation.longitude = oneLocation.x;
                oneLocation.latitude = oneLocation.y;
                markType = 1;
                break;
              case 'line':
                spotObj.controlPoints =
                  res[0].geometry.components[0].components.reduce(
                    (pre: any, ele: any) => {
                      const obj = {
                        x: ele.x,
                        y: ele.y,
                      };
                      pre.push(obj);
                      return pre;
                    },
                    [],
                  );
                saveDatas.value.markRecord.statusStyleJsonObject =
                  drawingWventsData.stylePropertyJson;
                oneLocation = spotObj.controlPoints[0];
                oneLocation.longitude = oneLocation.x;
                oneLocation.latitude = oneLocation.y;
                markType = 2;
                break;
              case 'spot':
                oneLocation = res[0].data;
                spotObj.controlPoints = [
                  {
                    x: oneLocation.longitude,
                    y: oneLocation.latitude,
                  },
                ];
                let stylePropertyJson = drawingWventsData;
                if (drawingWventsData.stylePropertyJson) {
                  stylePropertyJson = drawingWventsData.stylePropertyJson;
                }
                saveDatas.value.markRecord.statusStyleJsonObject =
                  stylePropertyJson;
                markType = 0;
                break;
              case 'other':
                spotObj = JSON.parse(res[0].geometry.toJSON());
                saveDatas.value.markRecord.statusStyleJsonObject =
                  drawingWventsData.stylePropertyJson;
                oneLocation = spotObj.controlPoints[0];
                oneLocation.longitude = oneLocation.x;
                oneLocation.latitude = oneLocation.y;
                markType = 3;
                break;
              default:
                break;
            }
            saveDatas.value.markRecord.mapId = store.state.coplotting.mapId;
            saveDatas.value.markRecord.markType = markType;
            saveDatas.value.markRecord.markName = drawingWventsData.className;
            saveDatas.value.markRecord.basicClassId =
              drawingWventsData.basicClassId;
            saveDatas.value.markRecord.longitude = oneLocation.longitude;
            saveDatas.value.markRecord.latitude = oneLocation.latitude;
            saveDatas.value.markRecord.laitude = oneLocation.latitude;
            saveDatas.value.markRecord.coordinatesJsonObject = spotObj;
            window.map
              .acquisitionPoint({
                latitude: oneLocation.latitude,
                longitude: oneLocation.longitude,
                lon: oneLocation.longitude,
                lat: oneLocation.latitude,
              })
              .then((r: any) => {
                // console.log(r);
                if (r.res && r.res.result) {
                  const address = r.res.result.formatted_address
                    ? r.res.result.formatted_address
                    : '';
                  saveDatas.value.markRecord.address = Array.isArray(address)
                    ? '无'
                    : address;
                }
                // console.log(saveDatas.value);
                saveData(saveDatas.value.markRecord);
              });
          });
      } else if (openType.value === 'mark') {
        saveDatas.value = detailsPopUp.handleData;
        window.map
          .markScreening(
            graphicParameters.convergeName,
            graphicParameters.typeId,
          )
          .then((editCovObj: any) => {
            // console.log(editCovObj);
            // 获取点编辑之后的定位
            window.map.getAfterDragging(editCovObj).then((res: any) => {
              console.log(res);
              editCovObj.data.latitude = res.lat;
              editCovObj.data.longitude = res.lon;
              editCovObj.lonlat = res;
              saveDatas.value.markRecord = saveDatas.value.markRecord
                ? saveDatas.value.markRecord
                : {};
              saveDatas.value.markRecord.longitude = res.lon;
              saveDatas.value.markRecord.latitude = res.latitude;
              saveDatas.value.markRecord.laitude = res.lat;
              const responseObj: any = {
                longitude: res.lon,
                latitude: res.lat,
                lon: res.lon,
                lat: res.lat,
              };
              window.map.acquisitionPoint(responseObj).then((pointRes: any) => {
                if (pointRes.res && pointRes.res.result) {
                  const address = pointRes.res.result.formatted_address
                    ? pointRes.res.result.formatted_address
                    : '';
                  saveDatas.value.markRecord.address = Array.isArray(address)
                    ? '无'
                    : address;
                }
                // 发送更新请求
                upData();
              });
              const allEventObj: any = editCovObj.events.listeners;
              const eventObj: any = {};
              // 获取当前点绑定的数据
              for (const key in allEventObj) {
                if (allEventObj[key] && allEventObj[key].length !== 0) {
                  eventObj[key] = allEventObj[key][0].func;
                }
              }
              // console.log(eventObj);
              // 删除之前的就数据并且关闭拖拽，渲染新的数据
              window.map.removeMark(editCovObj);
              window.map.closeMarkDrop(editCovObj);
              window.map.setOneMarker(
                (window as any).mapCoverageName.mark,
                editCovObj.data,
                eventObj,
              );
            });
          });
      } else if (openType.value === 'vector') {
        saveDatas.value = detailsPopUp.handleData;
        // console.log('添加回原来的图层');
        window.map
          .getSpecifiedData(
            graphicParameters.convergeName,
            graphicParameters.typeId,
          )
          .then((res: any) => {
            console.log(res);
            const createFeaturesObj = {
              ...res.data,
            };
            const jsonDatas = JSON.parse(res.geometry.toJSON());
            createFeaturesObj.cps = jsonDatas;
            createFeaturesObj.coordinatesJsonObject = jsonDatas;
            return (window as any).map.createFeatures(createFeaturesObj);
          })
          .then((r: any) => {
            if (!r) {
              return;
            }
            window.map.closeVectorCoverageEdit(
              (window as any).mapCoverageName.edit,
            );
            window.map.specifyVectorLayerAdd(
              (window as any).mapCoverageName.vector,
              [r],
            );
            const jsonData: any = JSON.parse(r.geometry.toJSON());
            saveDatas.value.markRecord.coordinatesJsonObject = jsonData;
            window.map.deleteSpecifiedData(
              graphicParameters.convergeName,
              graphicParameters.typeId,
            );
            window.map
              .getCoverageCentet(jsonData.controlPoints)
              .then((response: any) => {
                const responseData: any = response.coordinates;
                const responseObj: any = {
                  longitude: responseData[0],
                  latitude: responseData[1],
                  lon: responseData[0],
                  lat: responseData[1],
                };
                window.map
                  .acquisitionPoint(responseObj)
                  .then((pointRes: any) => {
                    if (pointRes.res && pointRes.res.result) {
                      const address = pointRes.res.result.formatted_address
                        ? pointRes.res.result.formatted_address
                        : '';
                      saveDatas.value.markRecord.address = Array.isArray(
                        address,
                      )
                        ? '无'
                        : address;
                    }
                    upData();
                  });
              });
          });
      }
      const editCovData = {
        handleType: '', // mark vector
        flag: false, // 控制绘制弹窗的显示
      };
      store.commit('coplotting/SET_editCovData', editCovData);
    }
    function init(xy: any) {
      const promise = new Promise((resolve, reject) => {
        //   const id = `map-dialog--${Math.floor(Math.random() * 100000000)}`;
        //   const data = {
        //     id,
        //     longitude,
        //     latitude,
        //     class: mapconterpopup.value,
        //   };
        //   (window as any).map.mapPopup(data);
        //   mapId.value = id;
        //   resolve(id);
        // });
        const id = `map-dialog--${Math.floor(Math.random() * 100000000)}`;
        setTimeout(() => {
          (window as any).map
            .pixelToLatAndLon(xy || (window as any).xy)
            .then((res: any) => {
              const data = {
                id,
                longitude: res.lon,
                latitude: res.lat,
                class: mapconterpopup.value,
              };
              // console.log(data);
              (window as any).map.mapPopup(data).then((nodeEle:any) => {
                // dragEl(nodeEle);
              });
              mapId.value = id;
              resolve(id);
            });
        });
      });
      return promise;
    }
    return {
      openType,
      saveDatas,
      types,
      params,
      cancelDraw,
      save,
      mapconterpopup,
      init,
    };
  },
});
</script>

<style lang="scss" module>
.MapConterPopup {
  width: 169px;
  padding: 22px 0 5px;
  background: #ffffff;
  box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  position: absolute;
  z-index: 10000;
  top: var(--map-conter-popup-top);
  left: var(--map-conter-popup-left);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  & > button {
    margin: 0 0 17px 0 !important;
    width: 124px;
    height: 42px;
    border-radius: 4px;
  }
}
.commandBrainMapConterPopup {
  background: rgba(0, 36, 60, 0.82);
  border: 1px solid #014b71;
  border-radius: 0;
  & > button {
    font-size: 14px;
    font-weight: 400;
    color: #00c1de;
    border-radius: 0;
    border: 1px solid #00c1de;
    &:first-child {
      background: transparent;
    }
    &:first-child:hover {
      color: #00c1de;
    }
    &:last-child {
      background: #00c1de;
      color: #ffffff;
    }
    &:hover {
      border: 1px solid #00c1de;
    }
  }
}
</style>
