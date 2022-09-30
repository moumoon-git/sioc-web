<template lang="">
  <div :class="$style.LocationPositioning">
    <div :class="$style[getPositionStatus.icon]">
      {{ getPositionStatus.text }}
    </div>
    <div :class="$style.positionText">
      {{ locationInfo.positionText }}
    </div>
    <div
      v-if="getPositionStatus.hasPosition"
      :class="$style['target-icon']"
      @click="positionTo(locationInfo)"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';

export default defineComponent({
  name: 'LocationPositioning',

  props: {
    locationInfo: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const { $message } = useGlobal();

    const positionMap: Record<string, any> = {
      currentPosition: {
        text: '当前位置',
        icon: 'currentPosition',
        hasPosition: true,
      },
      lastPosition: {
        text: '最后位置',
        icon: 'lastPosition',
        hasPosition: true,
      },
      offlinePosition: {
        text: '离线位置',
        icon: 'lastPosition',
        hasPosition: false,
      },
    };
    console.log(props, '132');

    const getPositionStatus = computed(() => positionMap[props.locationInfo.status]);
    function positionTo(data: any) {
      const { longitude, latitude } = data;
      if (!longitude || !longitude) {
        $message.error('未定位');
        return;
      }
      window.map.setCentent({ longitude, latitude }, 15);
    }
    return {
      getPositionStatus,
      positionTo,
    };
  },
});
</script>
<style lang="scss" module>
.LocationPositioning {
  height: 40px;
  line-height: 40px;
  border-top: 1px solid #2b4454;
  padding-left: 5px;
  display: flex;
  align-items: center;
  .positionText {
    margin-left: 6px;
    margin-right: 10px;
  }

  .target-icon {
    width: 16px;
    height: 16px;
    background-image: url('../../assets/img/target-icon.png');
    cursor: pointer;
  }
  .currentPosition {
    width: 68px;
    height: 26px;
    background: url('../../assets/img/current-position.svg') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 26px;
    color: #0cc890;
  }
  .lastPosition {
    width: 68px;
    height: 26px;
    background: url('../../assets/img/last-position.svg') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 26px;
    color: #6e777c;
  }
}
</style>
