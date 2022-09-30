import { onBeforeUnmount } from 'vue';
import { ClassItem, ListItem } from '../services/usePlottingData';
import { listAllByBounds, sectionData } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';
// import { useStore } from 'vuex';
import { addMoveFun } from '@/product/CommandBrain3.0/mainCapacity/windowEvent/move';
import { mouseupLoading } from '@/product/CommandBrain3.0/mainCapacity/windowEvent/move';

function initMapLayer() {
  const { map } = window;
  // 创建图层
  map.createdMarkCoverage('图例-标绘数据');
  // 清空并删除图层
  onBeforeUnmount(() => {
    map.clearDeleteCoverage('图例-标绘数据');
  });
}

/**
 * 批量移除标注
 * @param markers 标注列表
 */
function removeMarker(markers: any[]) {
  const { map } = window;
  markers.forEach((marker) => {
    map.removeMark(marker);
  });
}

/**
 * @param markerClickHandler 标注点击的 handler 函数
 */
export default (markerClickHandler: any) => {
  const markerByRecord = new Map<ClassItem, any[]>();

  initMapLayer();

  /**
   * 批量绘制标注
   * @param item 分类
   * @returns 标绘对象列表
   */
  const drawMarker = async (item: ClassItem): Promise<any[]> => {
    const { map } = window;
    const markerSize = [64, 32, 24];
    const markers = await map.setMultiMarker(
      '图例-标绘数据',
      item.children.map((record) => ({
        longitude: record.longitude,
        latitude: record.latitude,
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
  // const store = useStore();
  // 数据量较大要进行切片的标绘点存储
  const pointStorage: any = [];
  // 数据量大时进行切片请求
  function sectionRequets(bounds: any, listType: any, basicClassId: number) {
    const promise = new Promise((resolve, reject) => {
      const otherParam = {
        // mapId: store.state.coplotting?.mapId, // 地图id useStore
        basicClassId, // 点类型
      };
      listAllByBounds(bounds, listType, 116, otherParam).then((response: any) => {
        let dataArr = [];
        if (response.data && response.data.length) {
          // dataArr = response.data[0]?.list || [];
          dataArr = response.data.reduce((pre: any, ele: any) => {
            pre = pre.concat(ele.list);
            return pre;
          }, []);
          dataArr.forEach((x: any) => {
            x.name = x.markName;
            x.url = encodeURI(x.statusIconUrl?.startsWith('http')
              ? x.statusIconUrl
              : `${(window as any).config.baseURL}${x.statusIconUrl}`);
            x.size = x.statusStyleJsonObject?.size ?? 1;
            x.latitude = x.latitude ?? x.laitude;
            x.object = {
              data: {
                dataId: x.id,
                latitude: x.latitude,
                longitude: x.longitude,
              },
            };
          });
        }
        resolve(dataArr);
      });
    });
    return promise;
  }

  // 聚合数据落图、事件绑定处理
  function polymerization(params: {
    key: string,
    data: any,
    ImgInfo: any
  }) {
    (window as any).map.drawConverge(params.key, params.data, params.ImgInfo, {
      click(e: any) {
        markerClickHandler(e);
      },
    });
  }

  // 发起切片请求
  function reqSection(map?: any) {
    const handlerMap = map || (window as any).map;
    /*
      先查看当前层级和最大层级，进行比较，如果相同就进行当前范围数据请求
      否则进行切片处理
    */
    handlerMap.getMapZoom().then((selfZoom: number) => {
      handlerMap.getMapMaxZoom().then((maxZoom: number) => {
        if (selfZoom === maxZoom) {
          // 获取当前范围
          handlerMap.getExtent().then((extent: any) => {
            pointStorage.forEach((x: any) => {
              if (x.drawn) {
                // 切片请求的数据
                sectionRequets([extent], 1, x.id).then((sectionRes: any) => {
                  // 进行聚合落图并进行事件绑定
                  polymerization({
                    key: `${x.name}${x.totalMarkRecord}`,
                    data: sectionRes,
                    ImgInfo: {
                      img: x.url,
                      width: 32,
                      height: 32,
                    },
                  });
                });
              }
            });
          });
        } else {
          // 获取切片
          sectionData(handlerMap).then((res: any) => {
            pointStorage.forEach((x: any) => {
              if (x.drawn) {
                // 切片请求的数据
                sectionRequets(res, 0, x.id).then((sectionRes: any) => {
                  // 进行聚合并进行事件绑定
                  polymerization({
                    key: `${x.name}${x.totalMarkRecord}`,
                    data: sectionRes,
                    ImgInfo: {
                      img: x.url,
                      width: 32,
                      height: 32,
                    },
                  });
                });
              }
            });
          });
        }
      });
    });
  }
  mouseupLoading();
  // 先把加载的方法添加到移动回调中
  addMoveFun(reqSection);

  /**
   * 切换显示某个分类的所有记录
   * @param item 分类
   */
  const toggleItem = (item: ClassItem, folder: ListItem) => {
    const flag = item.drawn;
    // item.totalMarkRecord<100 的时候进行全量查询
    if (item.totalMarkRecord <= 100) {
      sectionRequets([], 1, item.id).then((res: any) => {
        // res: 通过solr请求的数据，进行mark落图
        if (res && res.length) {
          const data: any = {
            children: res || [],
          };
          if (flag && data.children.length) {
            const markers = markerByRecord.get(item);
            removeMarker(markers!);
            markerByRecord.delete(item);
          } else if (data.children.length) {
            drawMarker(data).then((markers) => {
              markerByRecord.set(item, markers);
            });
          }
        }
      });
    } else {
      if (flag) {
        (window as any).map.clearDrawConvergeData(`${item.name}${item.totalMarkRecord}`);
      } else {
        // 把类型添加到切片中
        pointStorage.push(item);
        // 先进行切片处理
        reqSection();
      }
    }
    item.drawn = !item.drawn;
    // 检查是否所有分类都已被绘制
    if (folder.children.filter((i) => i.drawn).length === folder.children.length) {
      folder.allDrawn = true;
    } else {
      folder.allDrawn = false;
    }
  };

  /**
   * 切换显示某个文件夹所有分类的所有记录
   * @param folder 文件夹
   */
  const toggleFolder = (folder: ListItem) => {
    if (folder.allDrawn) {
      // 移除
      folder.children.forEach((item) => {
        item.drawn = true;
        toggleItem(item, folder);
      });
    } else {
      // 添加
      folder.children.forEach((item) => {
        item.drawn = false;
        toggleItem(item, folder);
      });
    }
    // folder.allDrawn = !folder.allDrawn;
  };

  /**
   * 清除所有标注
   */
  const clearMap = () => {
    const { map } = window;
    map.clearAtPresentMarkData('图例-标绘数据');
    markerByRecord.forEach((markers, item) => {
      // item.drawn = false;
    });
    markerByRecord.clear();
  };

  /**
   * 切换所有标注显示
   * @param isAllDrawn 是否已全部绘制
   */
  const toggleAll = (isAllDrawn: boolean, allData: ListItem[]) => {
    console.log(isAllDrawn, allData);
    if (isAllDrawn) {
      clearMap();
      allData.forEach((folder) => {
        folder.allDrawn = true;
        toggleFolder(folder);
        folder.allDrawn = false;
      });
    } else {
      allData.forEach((folder) => {
        folder.allDrawn = false;
        toggleFolder(folder);
        folder.allDrawn = true;
      });
    }
  };

  return {
    toggleItem,
    toggleFolder,
    toggleAll,
    clearMap,
  };
};
