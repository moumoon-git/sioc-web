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
        <div
          v-if="item.eventObj.subType==='启动预案'
            ||item.eventObj.subType==='变更预案'
            ||item.eventObj.subType==='重启预案'"
        >
          <div :class="$style.listTwo">
            {{ item.eventObj.subType==='启动预案' ? '启动响应预案' :
              item.eventObj.subType==='变更预案' ? '调整响应预案' : '重启应急响应预案' }}
          </div>
          <div :class="$style.line" />
          <div :class="$style.listThree">
            {{ item.eventObj.content }}
          </div>
          <div :class="$style.listTwo">
            响应等级
          </div>
          <div :class="$style.line" />
          <div :class="$style.listThree">
            {{ item.levelName || '-' }}
          </div>
        </div>
        <div v-if="item.eventObj.subType==='发布通告'">
          <div :class="$style.listTwo">
            发布应急响应通告
          </div>
          <div :class="$style.line" />
          <div :class="$style.listTwo">
            已发送(人)：{{ item.hasSend }}
          </div>
          <div :class="$style.listTwo">
            已响应(人)：{{ item.hasAnnounce }}
          </div>
          <div :class="$style.listTwo">
            响应率：{{ item.annoRate }}
          </div>
        </div>
        <div v-if="item.eventObj.subType==='发布任务'">
          <div :class="$style.listTwo">
            发布应急预案响应任务
          </div>
          <div :class="$style.line" />
          <div :class="$style.listTwo">
            任务总数：{{ item.planTaskNum }}
          </div>
        </div>
        <div v-if="item.eventObj.subType==='结束预案'">
          <div :class="$style.listTwo">
            结束应急响应
          </div>
        </div>
        <div v-if="item.subType==='成立指挥部'">
          <div :class="$style.listTwo">
            成立
          </div>
          <div :class="$style.line" />
          <div :class="$style.listThree">
            现场指挥部
          </div>
        </div>
      </div>
      <!-- 定位 -->
      <div
        v-if="item.subType==='成立指挥部'"
        :class="isPosition
          ? $style.locationActive
          : $style.locationUnactive"
        @click="location(item)"
      />
      <!-- 定位哪里 -->
      <div
        v-if="item.subType==='成立指挥部'"
        :class="$style.listFour"
      >
        {{ item.eventObj.address }}
      </div>
      <!-- 备注 -->
      <div
        v-if="item.subType==='成立指挥部'"
        :class="$style.listFour"
      >
        备注:{{ item.eventObj.remark }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  location,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';

export default defineComponent({
  name: 'TypeTwo',
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
$label: url('../assets/two.svg');
@import '../assets/css/public.scss';
</style>
