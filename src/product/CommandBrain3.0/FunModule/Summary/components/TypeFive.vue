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
          {{ item.eventObj.status === 434 ? '发布任务' :
            item.eventObj.status === 435 ? '完成任务' :
            item.eventObj.status === 436 ? '已取消任务' :
            item.eventObj.status === 440 ? '重启任务' : ''
          }}
        </div>
        <div :class="$style.line" />
        <div :class="$style.listThree">
          {{ item.eventObj.title }}
        </div>
      </div>
      <!-- 身体 -->
      <!-- 负责人 -->
      <div :class="$style.listFour">
        {{ item.eventObj.responsiblePerson?.name || '-' }}
        <!-- 详情按钮 -->
        <span v-if="item.eventObj.responsiblePerson">
          <ContactMoreButton
            :id="item.eventObj?.responsiblePerson?.id"
          />
        </span>
      </div>
      <!-- 备注 -->
      <div :class="$style.listFour">
        {{ item.eventObj.content }}
      </div>
      <div
        v-for="itemone in item.eventObj?.appAttachments"
        :key="itemone.id"
        v-viewer
      >
        <!-- 图片 -->
        <img
          v-if="itemone.dictionaryType.code==='image'"
          :class="$style.listFour"
          style="width: 160px; height: 90px;"
          :src="baseURL+itemone?.url"
        >
        <!-- 文件 -->
        <div
          v-else-if="itemone?.dictionaryType?.code==='file'"
          :class="$style.listFour"
        >
          {{ itemone.title }}
          <span
            style="color: #56E9FF;margin-left: 10px;cursor: pointer;"
            @click="downFax(itemone)"
          >下载</span>
        </div>
        <!-- 视频 -->
        <video
          v-else-if="itemone?.dictionaryType?.code==='video'"
          width="160"
          height="90"
          controls
          :class="$style.listFour"
          :src="baseURL+itemone?.url"
        />
        <!-- 音频 -->
        <audio
          v-else-if="itemone?.dictionaryType?.code==='audio'"
          controls
          style="width: 160px; height: 20px;"
          :class="$style.listFour"
          :src="baseURL+itemone?.url"
        />
      </div>
      <!-- 定位 -->
      <div
        v-if="item.eventObj.status === 434"
        :class="isPosition
          ? $style.locationActive
          : $style.locationUnactive"
        @click="location(item)"
      />
      <!-- 定位哪里 -->
      <div
        v-if="item.eventObj.status === 434"
        :class="$style.listFour"
      >
        {{ item.eventObj.address ? item.eventObj.address : '-' }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import axios from 'axios';
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
    // 传真下载
    downFax(item: any): void {
      axios({
        url: `${this.baseURL}/fileupload/appAttachment/download?appAttachmentId=${item.id}&isForceDownload=1`,
        method: 'get',
        headers: {
          token: (window as any).globalToken || document.cookie.match(/token=([^;]*)/)?.[1],
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'arraybuffer',
      }).then((response: any) => {
        if (response) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = item.title;
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
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
$label: url('../assets/five.svg');
@import '../assets/css/public.scss';
</style>
