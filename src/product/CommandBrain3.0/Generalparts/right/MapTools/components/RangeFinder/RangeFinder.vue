<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, ref, render, createVNode, VNode } from 'vue';
import Pupop from './components/Pupop.vue';
interface creatPopup {
  visContent: string;
  visDelete: boolean;
  longitude?: number;
  latitude?: number;
}
export default defineComponent({
  components: {
    Pupop,
  },
  setup(props, context) {
    // 线的图形
    const rangFinderLayer = ref<any>({});
    const layerKey = ref<string>('');
    function deleteLayerData(key: string) {
      let coverageName = (window as any).mapCoverageName.vector;
      if (rangFinderLayer.value[key]) {
        // console.log(rangFinderLayer.value[key]);
        let geometryId = rangFinderLayer.value[key].vetor.feature.geometry.id;
        (window as any).map.deleteSpecifiedData(coverageName, geometryId);
        rangFinderLayer.value[key].pointArr.forEach((e: any) => {
          (window as any).map.deleteSpecifiedData(coverageName, e.geometry.id);
        });
        rangFinderLayer.value[key].popupArr.forEach((e: any) => {
          (window as any).map.closeClearPopup(e);
        });
      }
    }
    // 生成弹窗
    function creatPopup(obj: creatPopup) {
      let promise = new Promise((resolve, reject) => {
        const container: HTMLDivElement = document.createElement('div');
        const vm: VNode = createVNode(Pupop, {}, null);
        vm.props!.visContent = obj.visContent;
        vm.props!.visDelete = obj.visDelete;
        if (obj.visDelete) {
          vm.props!.layerKey = layerKey.value;
          vm.props!.callback = deleteLayerData;
        }
        render(vm, container);
        const instance = vm.component;
        if (instance && instance.proxy) {
          (instance.proxy as any).open(obj).then((id: string) => {
            resolve(id);
          });
        }
      });
      return promise;
    }
    // 设置落点并弹窗 // 计算点与点之间的距离 并且对应的在地图上显示文字
    function setPonitAndVisMapPopup(pointData: any, coverageName: string) {
      let promise = new Promise((resolve, reject) => {
        // 收集点数据
        let pointArr: any = [];
        // 收集弹窗id
        let popupArr: any = [];
        // 记录距离
        let distanceArr: number[] = [];
        pointData.forEach((e: any, i: number) => {
          let obj = {
            lon: e.x,
            lat: e.y,
            style: {
              strokeColor: '#32C5FF',
              strokeWidth: 4,
              pointRadius: 6,
              fillColor: '#fff',
            },
          };
          // 每个点返回的对象
          (window as any).map.setPoint(coverageName, obj).then((ele: any) => {
            pointArr.push(ele);
          });
          // 计算点与点之间的距离 并且对应的在地图上显示文字
          if (i !== 0 && i <= pointData.length - 1) {
            let stated = {
              longitude: pointData[i - 1].x,
              latitude: pointData[i - 1].y,
            };
            let end = {
              longitude: e.x,
              latitude: e.y,
              visContent: '',
              visDelete: false,
            };
            (window as any).map
              .calculateLineDistance(stated, end)
              .then((r: any) => {
                let distance: number = Number((r / 1000).toFixed(2));
                if (distanceArr.length !== 0) {
                  distance = Number(
                    (distance + distanceArr[distanceArr.length - 1]).toFixed(2),
                  );
                }
                if (i === pointData.length - 1) {
                  end.visContent = `终点${distance}公里`;
                  end.visDelete = true;
                } else {
                  end.visContent = `${distance}公里`;
                }
                distanceArr.push(distance);
                // 创建地图弹窗并保存id
                creatPopup(end).then((x: any) => {
                  popupArr.push(x);
                });
              });
          } else if (i === 0) {
            let stated = {
              longitude: e.x,
              latitude: e.y,
              visContent: '起点',
              visDelete: false,
            };
            // 创建地图弹窗并保存id
            creatPopup(stated).then((x: any) => {
              popupArr.push(x);
            });
          }
        });
        resolve({ pointArr, popupArr });
      });
      return promise;
    }
    // 激活绘制
    function activateDrawing() {
      let coverageName = (window as any).mapCoverageName.vector;
      (window as any).map
        .newDrawFeature(coverageName, 'Path', {
          featureadded: (e: any) => {
            // console.log(e);
            // 设置落点
            let pointData = e.feature.geometry.components;
            layerKey.value = e.feature.id;
            setPonitAndVisMapPopup(pointData, coverageName).then((r: any) => {
              // 记录线的对象
              rangFinderLayer.value[e.feature.id] = {
                vetor: e,
                ...r,
              };
            });
            // 设置线的样式
            (window as any).map.setSingleStyle(e.feature, {
              strokeColor: '#32C5FF',
              strokeWidth: 4,
            });
            // 关闭绘制
            (window as any).map.closeActivateDrawFeature(coverageName);
          },
        })
        .then(() => {
          (window as any).map.activateDrawFeature(coverageName);
        });
    }
    return {
      activateDrawing,
    };
  },
});
</script>

<style lang="scss" module>
</style>