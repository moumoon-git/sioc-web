import { onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
import { RoutesRecordItem, getRoutesRecordTaskDetail } from './useRoutesRecord';
import contactorIcon from '../imgs/map-contactor.svg';
import deviceIcon from '../imgs/map-device.svg';
import startIcon from '../imgs/map-start.svg';
import endIcon from '../imgs/map-end.svg';
import currentIcon from '../imgs/map-end-current.svg';

export default () => {
  const store = useStore();
  const { $mapDialog } = useGlobal();

  const { map } = window;
  map.createdVectorCoverage('轨迹跟踪');
  map.createdMarkCoverage('轨迹跟踪-起点终点');
  map.createdMarkCoverage('轨迹跟踪-标注');
  onBeforeUnmount(() => {
    map.clearDeleteCoverage('轨迹跟踪');
    map.clearDeleteCoverage('轨迹跟踪-起点终点');
    map.clearDeleteCoverage('轨迹跟踪-标注');
  });

  let taskDetailDialog: any;

  /**
   * 绘制轨迹线和关键点
   *
   * @param data 轨迹记录列表
   */
  function drawLine(data: RoutesRecordItem[]) {
    // 1. 清除上一次的路径
    map.clearAtPresentVectorData('轨迹跟踪');

    // 2. 地图中心移动到最后一条记录
    if (
      data[data.length - 1]?.longitude
      && data[data.length - 1]?.latitude
    ) {
      map.setCentent({
        longitude: data[data.length - 1].longitude,
        latitude: data[data.length - 1].latitude,
      }, 16);
    }

    // 3. 绘制轨迹
    map.renderGraph(
      '轨迹跟踪',
      data.map((item, i, arr) => {
        // 3-1. 绘制关键点
        if (
          item.type === 2
          && item.longitude
          && item.latitude
        ) {
          map.vectorDrawCir(
            '轨迹跟踪',
            {
              longitude: item.longitude,
              latitude: item.latitude,
              r: 4,
            },
            {
              fillOpacity: 1,
              fillColor: '#FFFFFF',
              strokeColor: '#FF7A45',
              strokeWidth: 3,
            },
            {
              click() {
                getRoutesRecordTaskDetail(item.resultId).then((res) => {
                  if (taskDetailDialog) {
                    taskDetailDialog.component.proxy.close();
                    taskDetailDialog = null;
                  }
                  taskDetailDialog = $mapDialog({
                    modle: 'taskTrack',
                  });
                  taskDetailDialog.open({
                    responseData: {
                      ...res,
                      title: `${res.reportTime} 任务`,
                    },
                  });
                });
              },
            },
          );
        }
        // 3-2. 异常数据跳过，绘制连线
        if (
          arr[i + 1]
          && item.longitude
          && item.latitude
          && arr[i + 1].longitude
          && arr[i + 1].latitude
        ) {
          const res = {
            type: 'GeoPolyline',
            cps: {
              controlPoints: [
                { x: item.longitude, y: item.latitude },
                { x: arr[i + 1].longitude, y: arr[i + 1].latitude },
              ],
            },
            style: {
              strokeWidth: 4,
              strokeColor: item.type === -1 ? '#666666' : '#32C5FF',
            },
          };
          return res;
        }
        return undefined;
      }).filter((i) => !!i),
    );
    // 4. 绘制起点、终点
    map.clearAtPresentMarkData('轨迹跟踪-起点终点').then(() => {
      if (data.length > 1) {
        if (data[0].longitude && data[0].latitude) {
          map.setOneMarker(
            '轨迹跟踪-起点终点',
            {
              longitude: data[0].longitude,
              latitude: data[0].latitude,
              wd: 46,
              hg: 22,
              src: startIcon,
            },
          );
        }
        const today = new Date();
        const formattedToday = `${
          today.getFullYear()
        }-${
          String(today.getMonth() + 1).padStart(2, '0')
        }-${
          String(today.getDate()).padStart(2, '0')
        }`;
        if (data[data.length - 1].longitude && data[data.length - 1].latitude) {
          map.setOneMarker(
            '轨迹跟踪-起点终点',
            {
              longitude: data[data.length - 1].longitude,
              latitude: data[data.length - 1].latitude,
              wd: 46,
              hg: 22,
              src: data[data.length - 1]?.reportTime?.split(' ')?.[1] === formattedToday ? currentIcon : endIcon,
            },
          );
        }
      }
    });
  }

  /**
   * 绘制标注
   *
   * @param data 轨迹记录项
   */
  function drawMarker(data: RoutesRecordItem | null) {
    map.clearAtPresentMarkData('轨迹跟踪-标注').then(() => {
      if (data?.longitude && data.latitude) {
        // 地图移动到中间
        map.setCentent({
          longitude: data.longitude,
          latitude: data.latitude,
        }, 16);
        // 绘制标注
        map.setOneMarker(
          '轨迹跟踪-标注',
          {
            longitude: data.longitude,
            latitude: data.latitude,
            wd: 30,
            hg: 30,
            src: data.contactorId ? contactorIcon : deviceIcon,
          },
          {
            click() {
              console.log('点击', data);
              const mapDialogInstance = $mapDialog({
                modle: data.contactorId ? 'contactor_contactor' : `deviceType_${data.deviceType}`,
              });

              mapDialogInstance.open({
                requestData: {
                  id: data.contactorId ? data.contactorId : data.deviceId,
                  eventId: store.state.event?.id,
                },
                lon: data.longitude,
                lat: data.latitude,
              });
            },
          },
        );
      }
      if (taskDetailDialog) {
        taskDetailDialog.component.proxy.close();
        taskDetailDialog = null;
      }
      if (data?.type === 2) {
        getRoutesRecordTaskDetail(data.resultId).then((res) => {
          taskDetailDialog = $mapDialog({
            modle: 'taskTrack',
          });
          taskDetailDialog.open({
            responseData: {
              ...res,
              title: `${res.reportTime} 任务`,
            },
          });
        });
      }
    });
  }

  return {
    drawLine,
    drawMarker,
  };
};
