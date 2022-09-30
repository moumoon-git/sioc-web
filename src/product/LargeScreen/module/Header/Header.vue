<template>
  <div :class="$style.Header">
    <!-- 左边线 -->
    <div>
      <div :class="$style.border_img"></div>
      <div :class="$style.border">
        <div :class="$style.leftshadow"></div>
      </div>
      <!-- 切换按钮 -->
      <div :class="$style.tabBtn_wrap">
        <TabBtn />
      </div>
    </div>
    <!-- 中间视口 -->
    <main>
      <!-- 天气和时间 -->
      <div :class="$style.weathAndClock">
        <div :class="$style.Weather_wrap">
          <Weather />
        </div>
        <div :class="$style.clock_wrap">
          <Clock />
        </div>
      </div>
      <!-- 标题 -->
      <div>
        <HeaderTitle />
        <!-- 事件选择 -->
        <div :class="$style.eventTitle" v-if="tabModleFlag">
          <Title
            :class="$style.title"
            :title="$store.state.event?.title || ''"
            :list-data="eventList"
            list-name="title"
            @click="changeEvent"
            @scroll-bottom="getEventList"
          />
        </div>
      </div>
      <!-- 预留占位 -->
      <div>
        <!-- 资源检索 -->
        <ResourceRetrievalView
          :class="$style.ResourceRetrievalView"
          v-if="tabModleFlag"
        />
      </div>
    </main>
    <!-- 右边线 -->
    <div>
      <div :class="$style.border">
        <div :class="$style.rightshadow"></div>
      </div>
      <div :class="[$style.border_img, $style.transform]"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, getCurrentInstance, watch } from 'vue';
import Clock from './Clock.vue';
import Weather from './Weather.vue';
import HeaderTitle from './HeaderTitle.vue';
import TabBtn from './TabBtn.vue';
// 事件选择
import Title from '@/product/CommandBrain3.0/Generalparts/header/Title/Title.vue';
// 资源检索
import ResourceRetrievalView from '@/product/CommandBrain3.0/FunModule/ResourceRetrieval/ResourceRetrievalView.vue';

export default defineComponent({
  components: {
    Clock,
    Weather,
    HeaderTitle,
    TabBtn,
    Title,
    ResourceRetrievalView,
  },
  data() {
    return {
      // 控制事件、资源检索的显示
      tabModleFlag: false,
    };
  },
  setup() {
    const { $http }: any =
      getCurrentInstance()?.appContext.config.globalProperties;
    const store = useStore();
    let isLoading = 0;
    let pageIndex = 1;
    let maxPage = 1;
    const eventList = ref<any[]>([]);
    /**
     * 选取事件，修改vuex，设置地图中心点
     * @param eventObj 事件对象
     */
    function changeEvent(eventObj: any) {
      store.commit('changeEvent', eventObj);
      const { longitude, latitude } = eventObj;
      if (longitude && latitude) {
        window.map.setCentent({ longitude, latitude }, 10);
      } else {
        const mapCenter: any = (window as any).config?.mapConfig?.center;
        window.map.setCentent(
          { longitude: mapCenter.longitude, latitude: mapCenter.latitude },
          10,
        );
      }
    }
    /**
     * 加载事件列表
     */
    function getEventList() {
      if (!isLoading && pageIndex <= maxPage) {
        isLoading += 1;
        const request = {
          method: 'post',
          service: 'eoc',
          url: '/eos/event/listBy',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            size: 12,
            page: pageIndex,
            name: '',
            reportType: 0,
          },
        };
        $http(request)
          .then((response: any) => {
            if (response.errorcode === 0) {
              eventList.value.push(...(response.data.data || []));
              maxPage = response.data.totalPages || 1;
              // 初始化时取第一条数据
              if (pageIndex === 1) {
                changeEvent(eventList.value?.[0] || null);
              }
              pageIndex += 1;
            }
          })
          .finally(() => {
            isLoading -= 1;
          });
      }
    }

    watch(() => store.state.event, (eventObj: any) => {
      const { longitude, latitude } = eventObj;
      if (longitude && latitude) {
        window.map.setCentent({ longitude, latitude }, 10);
      } else {
        const mapCenter: any = (window as any).config?.mapConfig?.center;
        window.map.setCentent(
          { longitude: mapCenter.longitude, latitude: mapCenter.latitude },
          10,
        );
      }
    });

    return {
      getEventList,
      eventList,
      changeEvent,
    };
  },
  computed: {
    btnData() {
      return (this as any).$store.state.btnTab.btnData;
    },
  },
  watch: {
    btnData: {
      handler(newVal) {
        if (newVal[0].active) {
          (this as any).tabModleFlag = false;
        } else {
          (this as any).getEventList();
          (this as any).tabModleFlag = true;
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" module>
.Header {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  & > main {
    width: 2420px;
    height: 110px;
    display: flex;
    z-index: 9;
    & > div {
      &:nth-child(2) {
        width: 900px;
        height: 100%;
        position: relative;
      }
      &:nth-child(1),
      &:nth-child(3) {
        position: relative;
        flex: 1;
        // pointer-events: none;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: rgba(2, 5, 8, 0.54)
            linear-gradient(
              50deg,
              #49d6ff 0%,
              #366aff 25%,
              #49d6ff 50%,
              #366aff 74%,
              #49d6ff 100%
            );
        }
      }
      &:nth-child(3) {
        display: flex;
        align-items: center;
        & > div {
          margin: 0;
          z-index: 9;
          & > header {
            border-radius: 4px;
            border: 1px solid #00c1de;
            box-sizing: border-box;
            & > div {
              border: none;
              &:first-child {
                border-radius: 4px 0 0 4px;
              }
              &:last-child {
                & > button {
                  border-radius: 0 4px 4px 0;
                  background: linear-gradient(183deg, #00f1f3 0%, #0076cc 100%);
                }
                & > i::before {
                  width: 1px;
                }
              }
              &:nth-child(2) {
                position: relative;
                & > button {
                  border-radius: 0 4px 4px 0;
                  background: linear-gradient(183deg, #00f1f3 0%, #0076cc 100%);
                }
                & > i::before {
                  display: none;
                }
                &::after,
                &::before {
                  content: '';
                  position: absolute;
                  width: 1px;
                  height: 36px;
                  opacity: 0.19;
                  background: #e6e6e6;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                }
                &::before {
                  left: 0;
                }
                &::after {
                  right: 80px;
                }
              }
            }
          }
        }
      }
      &:nth-child(1)::before {
        box-shadow: 240px 0px 240px 70px #000;
      }
      &:nth-child(3)::before {
        box-shadow: -240px 0px 240px 70px #000;
      }
    }
  }
  & > div {
    flex: 1;
    height: 6px;
    display: flex;
    position: relative;
  }
}
.tabBtn_wrap {
  position: absolute;
  bottom: -110px;
  right: 95px;
}
.border {
  flex: 1;
  height: 6px;
  background: rgba(2, 5, 8, 0.54)
    linear-gradient(
      50deg,
      #49d6ff 0%,
      #366aff 25%,
      #49d6ff 50%,
      #366aff 74%,
      #49d6ff 100%
    );
  position: relative;
  // box-shadow: 140px 0px 240px 70px #000;
}
.leftshadow {
  position: absolute;
  right: 0%;
  top: 0;
  height: 6px;
  width: 34%;
  box-shadow: 140px 0px 240px 70px #000;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 110px;
    width: 65%;
  }
}
.rightshadow {
  position: absolute;
  left: -27%;
  top: 0;
  height: 6px;
  width: 34%;
  box-shadow: 0px 8px 120px 17px #000;
}
.border_img {
  width: 85px;
  height: 18px;
  z-index: 9;
  background: url('./assets/border_img.svg') no-repeat;
  background-size: 101% 99%;
  // box-shadow: 0px 0px 20px 0px #36dbff;
}
.transform {
  transform: rotateY(180deg);
}
.weathAndClock {
  display: flex;
  justify-content: flex-end;
  & > div {
    position: inherit;
  }
}
.Weather_wrap {
  margin-right: 24px;
  margin-bottom: 7px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.clock_wrap {
  width: 210px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.eventTitle {
  position: absolute;
  bottom: -80px;
  left: 0;
  right: 0;
  z-index: 9;
  width: 1px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  & > h1 {
    height: 60px;
    line-height: 60px;
    min-width: 640px;
    box-sizing: border-box;
    background: rgba(2, 5, 8, 0.53);
    border-radius: 5px;
    border: 2px solid;
    border-image: linear-gradient(
        270deg,
        rgba(0, 199, 255, 0),
        rgba(86, 233, 255, 1),
        rgba(86, 233, 255, 1),
        rgba(0, 218, 255, 1),
        rgba(0, 206, 255, 0)
      )
      2 2;
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
  }
  :global(.visualization-header-arrow) {
    display: none;
  }
  :global(.visualization-header-list) {
    width: 100%;
    margin-top: 17px;
    background: rgba(2, 5, 8, 0.71);
    border: 2px solid;
    border-image: linear-gradient(
        270deg,
        rgba(0, 199, 255, 0),
        rgba(86, 233, 255, 1),
        rgba(86, 233, 255, 1),
        rgba(0, 218, 255, 1),
        rgba(0, 206, 255, 0)
      )
      2 2;
    box-sizing: border-box;
    & > ul > li {
      height: 54px;
      line-height: 54px;
      padding: 0;
      padding-left: 38px;
      color: #ffffff;
      font-size: 24px;
      font-weight: 400;
    }
    & > ul::-webkit-scrollbar-thumb {
      background: #646869;
      border-radius: 3px;
    }
    & > ul > li:hover {
      color: #56e9ff;
      background: linear-gradient(
        90deg,
        rgba(0, 236, 255, 0.32) 0%,
        rgba(3, 51, 70, 0.34) 100%
      );
    }
  }
}
.fiex-border {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.ResourceRetrievalView {
  height: 48px !important;
}
</style>
