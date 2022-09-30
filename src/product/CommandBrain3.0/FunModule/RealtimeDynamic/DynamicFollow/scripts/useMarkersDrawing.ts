import {
  onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
import mapIconSet from './useMapIcons';

export default () => {
  const store = useStore();
  const { $mapDialog } = useGlobal();

  const { map }: any = window;
  // 创建图层
  map.createdMarkCoverage('动态关注');
  // 清空并删除图层
  onBeforeUnmount(() => {
    map.clearDeleteCoverage('动态关注');
  });
  /**
   * 移动地图中心点
   * @param longitude 纬度
   * @param latitude 经度
   */
  function panTo(longitude: number, latitude: number) {
    if (longitude && latitude) {
      map.setCentent({ longitude, latitude }, 15);
    }
  }
  /**
   * 绘制落点
   * @param list 动态关注列表
   */
  function drawMarkers(list: {
    [key: string]: {
      longitude: number,
      latitude: number,
      type: string,
      isOnline?: 0 | 1,
      status?: 0 | 1,
      defaultDevice?: {
        type: number,
        status: 0 | 1,
      }
    }[]
  }): void {
    map.clearAtPresentMarkData('动态关注').then(() => {
      Object.keys(list).forEach((key) => {
        list[key].forEach((item: any) => {
          let src = '';
          switch (key) {
            case 'contactor': {
              // 默认设备类型，wecomm或联系人集群终端需要显示图标
              const defaultDeviceType = item?.defaultDevice?.type;
              // 联系人
              src = mapIconSet[`contactor${
                defaultDeviceType === 2 || defaultDeviceType === 3 ? `-device-${defaultDeviceType}` : ''
              }-${item.isOnline ? 'online' : 'offline'}`];
              break;
            }
            case 'task': {
              // 任务
              src = mapIconSet['task-online'];
              break;
            }
            case 'resource': {
              // 资源
              src = mapIconSet[`${item.type}-online`];
              break;
            }
            case 'person': {
              // 队伍且默认设备的类型是2或3（wecomm或集群终端）
              if (item?.defaultDevice?.type === 2 || item?.defaultDevice?.type === 3) {
                src = mapIconSet[`team-device-${item.defaultDevice.type}-${item.defaultDevice.status === 0 ? 'online' : 'offline'}`];
                break;
              }
              // 队伍
              src = mapIconSet['team-online'];
              break;
            }
            case 'riskDanger': {
              // 风险
              src = mapIconSet['riskDanger-online'];
              break;
            }
            case 'device': {
              // 设备
              src = mapIconSet[`device-${item.type}-${item.status === 0 ? 'online' : 'offline'}`];
              break;
            }
            default:
          }
          map.setOneMarker(
            '动态关注',
            {
              longitude: item.longitude,
              latitude: item.latitude,
              wd: 48,
              hg: 48,
              src,
            },
            {
              click: () => {
                const mapDialogInstance = $mapDialog({
                  modle: `${key}_${item.type}`,
                });

                mapDialogInstance.open({
                  requestData: {
                    id: item.id,
                    eventId: store.state.event?.id,
                  },
                });
              },
            },
          );
        });
      });
    });
  }
  return {
    panTo,
    drawMarkers,
  };
};
