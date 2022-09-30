<template>
  <div class="event-information-container">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" />

    <div class="event-information-container__body">

      <!-- 事件信息 -->
      <div class="event-information-container__body__top">
        <div v-for="item in eventData" :key="item.key" class="event-information-item">
          <div class="event-information-item__label">{{ item.label }}</div>
          <div class="event-information-item__value">{{ item.value }}</div>
        </div>
      </div>

      <!-- 信息要素 -->
      <div class="event-information-container__body__label">信息要素</div>
      <div class="event-information-container__body__bottom">
        <div v-for="item in eventParamsData" :key="item.key" class="event-information-item">
          <div class="event-information-item__label">{{ item.label }}</div>
          <div class="event-information-item__value">{{ item.value }}</div>
        </div>
      </div>
      <!-- 扩展信息 -->
      <div class="event-information-container__body__label">扩展信息</div>
      <div class="event-information-container__body__bottom">
        <div v-for="item in expandData" :key="item.key" class="event-information-item">
          <div class="event-information-item__label">{{ item.label }}</div>
          <div class="event-information-item__value">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import { Toast, Notify } from 'vant';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'EventInformation',
  components: {
    NavBar
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const eventId = ref(router.currentRoute.value.params.eventId);
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const navBarConfig = ref({
      title: '事件详情',
      type: 'left',
      path: `/Annunciate/${store.state.reserve.distributionId}`,
    });
    const eventData: any = ref([]);
    const eventParamsData: any = ref([]);
    const expandData: any = ref([]);
    // eventInformation的key的顺序不能修改,会影响页面字段的排列！
    const eventInformation = ref({
      eventTitle: {
        key: '事件标题',
        value: '',
      },
      accidentTime: {
        key: '事发时间',
        value: '',
      },
      reportedTime: {
        key: '接报时间',
        value: '',
      },
      accidentUnit: {
        key: '事故单位',
        value: '',
      },
      range: {
        key: '辖区范围',
        value: '',
      },
      accidentAddress: {
        key: '事发地点',
        value: '',
      },
      remarkAddress: {
        key: '落图地点',
        value: '',
      },
      reportedUnit: {
        key: '报告单位',
        value: '',
      },
      eventType: {
        key: '事件类型',
        value: '',
      },
    });
    // 信息要素
    const eventParams = ref({
      injuredCount: {
        key: '受伤人数(人)',
        value: '',
      },
      lostCount: {
        key: '失踪人数(人)',
        value: '',
      },
      trappedCount: {
        key: '受困人数(人）',
        value: '',
      },
      // accidentReason: {
      //   key: '事发原因',
      //   value: '',
      // },
      // accidentResult: {
      //   key: '已造成后果',
      //   value: '',
      // },
      // developmentTrend: {
      //   key: '事件发展趋势',
      //   value: '',
      // },
      // measures: {
      //   key: '已采取措施',
      //   value: '',
      // },
    })
    // 拓展信息
    const expandInformation = ref({
      accidentReason: {
        key: '事发原因',
        value: '',
      },
      accidentResult: {
        key: '已造成后果',
        value: '',
      },
      developmentTrend: {
        key: '事件发展趋势',
        value: '',
      },
      measures: {
        key: '已采取措施',
        value: '',
      },
    })
    getEventDetail();
    /**
     * @description 获取事件详情
     */
    function getEventDetail() {
      let requestData: any = ref({
        method: "post",
        service: 'app',
        url: `/response/getEventDetail`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          eventId: eventId.value // 事件id
        },
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          if (res.errorcode === 0) {
            formatterData(res.data)
          }
        })
        .catch((error: any) => {
          if (error.errorcode) {
            Notify({
              type: "danger",
              message: `获取事件详情失败，错误代码${error.errorcode}，错误信息：${error.msg}`,
            });
          }
        });
    }
    /**
     * @description 格式化数据
     */
    function formatterData(data: any) {
      // 事件信息
      eventInformation.value.eventTitle.value = data.title;
      eventInformation.value.accidentTime.value = data.occurTime;
      eventInformation.value.reportedTime.value = data.reportTime;
      eventInformation.value.accidentUnit.value = data.accidentUnit;
      eventInformation.value.range.value = data.area;
      eventInformation.value.accidentAddress.value = data.address;
      eventInformation.value.remarkAddress.value = data.fallFigureAddress;
      eventInformation.value.reportedUnit.value = data.unit || data.department;
      eventInformation.value.eventType.value = data.typeName;
      eventData.value = getObjectKey(eventInformation.value);

      // 事件要素
      if(data.eventParams.length > 0) {
        eventParamsData.value = [];
        data.eventParams.forEach((el: any) => {
          eventParamsData.value.push({
            key: `key${el.sId}`,
            label: el.unit && el.unit !== '' && el.name && el.name !== '' ? `${el.name}（${el.unit}）` :  !el.unit && el.name && el.name !== '' ?  `${el.name}` : `（${el.unit}）`,
            value: el.value ? el.value : '',
          })
        })
      }

      // 拓展信息
      expandInformation.value.accidentReason.value = data.occurReason;
      expandInformation.value.accidentResult.value = data.consequences;
      expandInformation.value.developmentTrend.value = data.developmentTrend;
      expandInformation.value.measures.value = data.takeSteps;
      expandData.value = getObjectKey(expandInformation.value);
    }

    /**
     * @param {Object} list
     * @returns {Object} column
     */
    function getObjectKey(list: any) {
      let column = Object.keys(list).map((item, index) => ({
        key: `key${index}`,
        label: list[item].key,
        value: list[item].value,
      }));
      return column;
    }

    onMounted(() => {
      eventData.value = getObjectKey(eventInformation.value);
      expandData.value = getObjectKey(expandInformation.value);
      eventParamsData.value = getObjectKey(eventParams.value);
    })
    return {
      navBarConfig,
      eventData,
      eventParamsData,
      expandData
    };
  },
});
</script>
<style lang="scss">
// 事件详情
.event-information-container {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .context {
    font-size: 0.28rem;
    font-weight: 500;
    color: #333333;
  }
  // 身体
  .event-information-container__body {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding: 0.2rem 0;

    .event-information-container__body__top,
    .event-information-container__body__bottom {
      padding: 0 0.32rem;
      width: 100%;
      box-sizing: border-box;
    }

    .event-information-container__body__label {
      width: 100%;
      height: 0.6rem;
      background: #f2f2f2;
      font-size: 0.28rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.6rem;
      padding: 0 0.32rem;
      box-sizing: border-box;
    }

    .event-information-item {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: baseline;

      .event-information-item__label {
        font-size: 0.28rem;
        font-weight: 400;
        color: #999999;
        line-height: 0.6rem;
        // min-width: 2.08rem;
        margin-right: 0.4rem;
      }

      .event-information-item__value {
        flex: 1;
        @extend .context;
      }
    }
  }
}
</style>
