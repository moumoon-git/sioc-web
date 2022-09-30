import { useStore } from 'vuex';
import { ref, getCurrentInstance, watch, onMounted } from 'vue';
import { getResourceStats } from '@/product/solrServerCoordinateTr/solrServerCoordinateTr';

function inits() {
  // 获取全局参数
  const instance = getCurrentInstance();
  const { $http, $message }: any =
    instance?.appContext.config.globalProperties;
  const store = useStore(); // 使用vuex
  // 响应数据
  const rotateCircleData = ref<any>({});
  // 任务统计
  const taskStatisticsData = ref<any>([
    {
      name: '任务总数',
      number: 0,
    },
    {
      name: '已完成',
      number: 0,
    },
    {
      name: '执行中',
      number: 0,
    },
    {
      name: '完成率',
      number: '0%',
    },
  ]);
  // 任务列表数据
  const taskFormData = ref<any>([]);
  // 签到情况
  const completionFirst = ref<any>([
    {
      name: '签到单位',
      number: '0',
    },
    {
      name: '签到率',
      number: '0%',
    }, {
      name: '签到人数',
      number: 0,
    },
  ]);
  // 响应数据
  const listData = ref<any>({});
  // 现场标绘-0，周边信息-1
  const currentIndex = ref<any>(0);
  // 现场标绘/分类统计数据
  const classificationStat = ref<any>([]);
  // 周边信息/资源统计
  const resourceStat = ref<any>([]);
  // 响应数据
  const currentDate = ref<any>('');

  /**
   * 现场标绘和周边信息切换
   * @param index 下标
   */
  function tabScene(index: number) {
    currentIndex.value = index;
  }

  // 获取响应
  function getRotateCircleData(eventId: any) {
    const request = {
      method: 'get',
      url: '/event/event/info/responseStatistic',
      params: {
        eventId,
      },
    };
    $http(request).then((res: any) => {
      if (res.data) {
        const { data } = res;
        data.rate = data.all
          ? Math.round((100 * data.response) / data.all)
          : 0;
        rotateCircleData.value = res.data;
      }
    });
  }

  // 获取任务统计
  function getTaskStatistics(eventId: any) {
    const request = {
      method: 'get',
      service: 'eoc',
      url: '/event/info/eventTaskStatistic',
      params: {
        eventId,
      },
    };
    $http(request).then((res: any) => {
      if (res.data && res.data.total) {
        const dataObj: any = res.data.total;
        const data: any = [
          {
            name: '任务总数',
            number: dataObj.total,
          },
          {
            name: '已完成',
            number: dataObj.finished,
          },
          {
            name: '执行中',
            number: dataObj.handling,
          },
          {
            name: '完成率',
            number: dataObj.rate ? dataObj.rate : 0,
          },
        ];
        taskStatisticsData.value = data;
        res.data.list.forEach((e: any) => {
          e.rate += '%';
        });
        taskFormData.value = res.data.list;
      }
    });
  }

  /**
   * 获取现场签到统计数据
   * @param dateTime yyyy-mm-dd 格式的日期
   */
  function getAttendenceStat(dateTime: string) {
    currentDate.value = dateTime;
    const request = {
      method: 'get',
      service: 'soc',
      url: '/eventconduct/eventSceneonductSign/getUnitSginGroupCount',
      params: {
        eventId: store.state.event?.id,
        dateTime,
      },
    };
    $http(request)
      .then((response: any) => {
        if (response.code === 0) {
          const groupList = response.data || [];
          let depCount = 0;
          let signedCount = 0;
          listData.value = groupList.map((group: any) => {
            // 分组下部门数
            const totalDepCount = group?.children?.length || 0;
            depCount += totalDepCount;
            // 分组下已签到部门数
            const signedDepCount = group?.children?.reduce(
              (acc: number, cur: any) =>
                acc + cur?.signList?.length ? 1 : 0,
              0,
            );
            signedCount += signedDepCount;
            // 签到率
            const signRate = totalDepCount
              ? signedDepCount / totalDepCount
              : 0;
            return {
              name: group.name,
              number: Math.round(signRate * 100),
              human:
                group?.children?.reduce(
                  (acc: number, cur: any) =>
                    acc + Number(cur?.signList?.length),
                  0,
                ) || 0,
            };
          });
          completionFirst.value = [
            {
              name: '签到单位',
              number: `${signedCount}/${depCount}`,
            },
            {
              name: '签到率',
              number: `${depCount ? Math.round(100 * (signedCount / depCount)) : 0
                }%`,
            },
            {
              name: '签到人数',
              number: listData.value.reduce(
                (acc: number, cur: any) => acc + cur.human,
                0,
              ),
            },
          ];
        } else {
          $message.error(
            `获取现场签到统计数据失败，错误代码${response.code}，错误信息：${response.msg}`,
          );
        }
      })
      .catch((error: Error) => {
        $message.error(`获取现场签到统计数据失败，错误信息：${error}`);
      });
  }

  /**
   * 获取分类统计数据
   * @param event 事件对象
   */
  async function getClassificationStat(event: {
    id: number;
    eventType: string | number;
  }) {
    const request: any = {
      method: 'post',
      service: 'coplotting',
      url: '/assist/assistmap/getAssistMapEntityVOList',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        eventId: event?.id,
        mapType: 1,
      },
    };
    const val = await $http(request).then((response: any) => {
      if (response.code === 0) {
        return Promise.resolve(response.data?.list || []);
      }
      $message.error(
        `获取地图id失败，错误代码${response.code}，错误信息：${response.msg}`,
      );
      return Promise.resolve();
    });
    if (val[0]) {
      request.method = 'get';
      request.url = '/assist/assistmarkrecord/countByClass';
      request.params = { mapId: val[0].id };
      $http(request).then((response: any) => {
        console.log(response);
        classificationStat.value =
          Array.isArray(response.data) ? response.data?.map((i: any) => ({
            name: i.classesName,
            number: i.count,
          })) || [] : '';
      });
    }
  }

  /**
   * 获取资源统计数据
   * @param event 事件对象
   */
  function getResourceStat(event: {
    longitude: number;
    latitude: number;
    id: number;
  }) {
    getResourceStats(event).then((response: any) => {
      if (response.code === 0) {
        resourceStat.value = response?.data?.map((i: any) => ({
          name: i.typeName,
          number: i.count,
          value: i.count,
        })) || [];
        resourceStat.value.push('');
        resourceStat.value.pop();
      } else {
        $message.error(
          `获取周边信息失败，错误代码${response.code}，错误信息：${response.message}`,
        );
      }
    })
      .catch((error: Error) => {
        $message.error(`获取周边信息失败，错误信息：${error}`);
      });
  }

  // 初始化
  function init(event: any) {
    getRotateCircleData(event?.id);
    getTaskStatistics(event?.id);
    getClassificationStat(event);
    getResourceStat(event);
  }

  watch(
    () => store.state.event,
    (val) => {
      if (val) {
        console.log(val, '-----------------------------------------------------------------');
        init(val);
      }
    },
  );

  watch(
    () => store.state.reservePlan,
    (val) => {
      console.log(val);
      if (val?.currentReservePlan) {
        let dateTime = currentDate.value;
        if (!dateTime) {
          const date = new Date();
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          dateTime = `${yyyy}-${mm}-${dd}`;
        }
        getAttendenceStat(dateTime);
      }
    },
  );

  return {
    rotateCircleData,
    taskStatisticsData,
    taskFormData,
    completionFirst,
    listData,
    currentIndex,
    classificationStat,
    resourceStat,
    currentDate,
    tabScene,
    getRotateCircleData,
    getTaskStatistics,
    getAttendenceStat,
    getClassificationStat,
    getResourceStat,
    init,
  };
}

export default inits
