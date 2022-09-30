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
          {{ item.eventObj.subType==='审核通过' ? '审核通过' :
            item.eventObj.subType==='审核驳回' ? '审核驳回' : '确认完成支援' }}
        </div>
        <div :class="$style.line" />
        <div
          v-if="item.eventObj.subType!=='确认完成支援'"
          :class="$style.listThree"
        >
          {{ item.eventObj.title }}
        </div>
        <!-- 详情按钮 -->
        <div
          v-if="item.eventObj.subType!=='确认完成支援'"
          :class="$style.detailIcon"
        >
          <ContactMoreButton
            :id="item.eventObj?.contactorId || item.eventObj?.id"
          />
        </div>
        <div
          v-if="item.eventObj.subType!=='确认完成支援'"
          :class="$style.listTwo"
        >
          {{ item.eventObj.subType==='预案' ? '申请物资支援' : '物资支援申请' }}
        </div>
        <div :class="$style.listThree">
          {{ item.eventObj.subType }}
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
        v-if="item.eventObj"
        :class="isPosition
          ? $style.locationActive
          : $style.locationUnactive"
        @click="location(item)"
      />
      <!-- 定位哪里 -->
      <div
        v-if="item.eventObj"
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
$label: url('../assets/four.svg');
@import '../assets/css/public.scss';
</style>
