<template>
  <div :class="$style.RelatedEquipment">
    <div :class="$style.title">
      关联设备
    </div>
    <div
      v-for="(item, index) in relatedEquipmentList"
      :key="index"
      :class="$style['equipment-box']"
    >
      <label :class="$style['label-title']">{{ item.title }}：</label>
      <span :class="$style['text-dec']">{{ item.dec }}</span>
      <div
        v-if="item.title === '监控视频'"
        :class="$style['watch-eyes-icon']"
        @click="preview(item)"
      />
      <div :class="$style['target-icon']" @click="positionTo(item)" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';

export default defineComponent({
  name: 'RelatedEquipment',
  props: {
    relatedEquipmentList: {
      type: Array,
      default: (): Record<string, string>[] => [],
    },
  },

  setup(props) {
    const { $message } = useGlobal();

    const store = useStore();
    function positionTo(data: any) {
      const { longitude, latitude } = data;
      if (!longitude || !longitude) {
        $message.error('未定位');
        return;
      }
      window.map.setCentent({ longitude, latitude }, 15);
    }
    function preview(item: any) {
      store.commit('flightPatrol/SET_flightPatrolPreviewCachePool', [item]);
    }

    return {
      positionTo,
      preview,
    };
  },
});
</script>
<style lang="scss" module>
@mixin little-icon {
  cursor: pointer;
  margin-left: 15px;
  vertical-align: middle;
}
.RelatedEquipment {
  padding-bottom: 5px;
  .title {
    background: linear-gradient(90deg, rgba(1, 75, 113, 0.6) 0%, rgba(1, 75, 113, 0) 100%);
    line-height: 30px;
    margin-bottom: 10px;
    padding-left: 9px;
  }
  .equipment-box {
    height: 35px;
    line-height: 35px;
    padding-left: 9px;
    display: flex;
    align-items: center;
    .label-title {
      width: 78px;
    }
    .text-dec {
      width: 162px;
      color: #00c1de;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .watch-eyes-icon {
      width: 19px;
      height: 12px;
      background-image: url('../../assets/img/watch-eyes.png');
      @include little-icon;
    }

    .target-icon {
      width: 16px;
      height: 16px;
      background-image: url('../../assets/img/target-icon.png');
      @include little-icon;
    }
  }
}
</style>
