import { onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
import mapIconSet from '../../DynamicFollow/scripts/useMapIcons';

export default () => {
  const store = useStore();
  const { $mapDialog } = useGlobal();

  const { map }: any = window;
  // 创建图层
  map.createdMarkCoverage('人员在线');
  // 清空并删除图层
  onBeforeUnmount(() => {
    map.clearDeleteCoverage('人员在线');
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
   * @param list 人员在线列表
   */
  function drawMarkers(list: Record<string, any>[]): void {
    map.clearAtPresentMarkData('人员在线').then(() => {
      list.forEach(item => {
        let src = '';
        const personalSrc: Record<string, string> = {
          '-1': mapIconSet['contactor-online'], // app在线
          2: mapIconSet['contactor-device-2-online'], // 集群终端
          3: mapIconSet['contactor-device-3-online'], // wecomm
        };
        const equipmentSrc: Record<string, string> = {
          2: mapIconSet['device-2-online'], // 集群终端
          3: mapIconSet['device-3-online'], // wecomm
        };

        if (item.deviceType && item.type !== 'device') {
          src = personalSrc[item.deviceType];
        } else {
          src = equipmentSrc[item.deviceType];
        }
        map.setOneMarker(
          '人员在线',
          {
            longitude: item.longitude,
            latitude: item.latitude,
            wd: 48,
            hg: 48,
            src,
          },
          {
            click: () => {
              // TODO 点击弹窗
              console.log('点击', item);
              const mapDialogInstance = $mapDialog({
                modle: item.type === 'device' ? `${item.type}_${item.deviceType}` : item.type,
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
  }
  return {
    panTo,
    drawMarkers,
  };
};
