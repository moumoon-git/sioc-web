<template>
  <div :class="$style.list">
    <!-- 时间 -->
    <div :class="$style.time">
      {{ `${(item.time.split(' ')[1]).split(':')[0]}:${(item.time.split(' ')[1]).split(':')[1]}` }}
    </div>
    <!-- 整体样式 -->
    <div
      :class="$style.listStyle"
      @click="handleClick"
    >
      <div :class="$style.headerStyle">
        <!-- 标签 -->
        <div :class="$style.listOne" />
        <div :class="$style.listTwo">
          {{ item.eventObj.status === 434 ? '接收现场回传' : '发起现场回传' }}
        </div>
        <div :class="$style.line" />
        <div :class="$style.listThree">
          {{ item.eventObj.title }}
        </div>
        <!-- 详情按钮 -->
        <div :class="$style.detailIcon">
          <ContactMoreButton
            :id="item.eventObj?.contactorId || item.eventObj?.id"
          />
        </div>
      </div>
      <!-- 身体 -->
      <!-- 备注 -->
      <div :class="$style.listFour">
        {{ item.eventObj.content }}
      </div>
      <!-- 视频 -->
      <video
        width="160"
        height="90"
        controls
        :class="$style.listFour"
        :src="baseURL+item.eventObj.url"
      />
      <!-- 定位 -->
      <div
        :class="isPosition
          ? $style.locationActive
          : $style.locationUnactive"
        @click="location(item)"
      />
      <!-- 定位哪里 -->
      <div
        :class="$style.listFour"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import {
  location,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';

export default defineComponent({
  name: 'TypeFour',
  components: {
    // 详情按钮
    ContactMoreButton,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['handleClick'],
  data() {
    return {
      isPosition: false,
      baseURL: (window as any).config.baseURL,
    };
  },
  methods: {
    handleClick(item: any): void {
      this.$emit('handleClick', item);
    },
    // 地图落点
    location(item: any) {
      this.isPosition = !this.isPosition;
      (window as any).map.clearAtPresentMarkData('SummaryMarker');
      if (this.isPosition) {
        location(item.eventObj.longitude, item.eventObj.latitude, 'SummaryMarker');
      }
    },
  },
});
</script>

<style lang="scss" module>
$label: url('../assets/six.svg');
@import '../assets/css/public.scss';
</style>
