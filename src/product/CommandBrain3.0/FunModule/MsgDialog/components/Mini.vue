<template>
  <!-- 整体样式 -->
  <div
    :class="$style.listStyle"
    @click="handleClick"
  >
    <header :class="$style.headerStyle">
      <!-- 标签 -->
      <div :class="$style.listOne">
        {{ item.caseClassName }}
      </div>
      <!-- 标题 -->
      <div :class="$style.listTwo">
        {{ item.title }}
      </div>
      <!-- 叉 -->
      <div
        :class="$style.close"
        @click.stop="closeOne"
      />
      <!-- 线 -->
      <div :class="$style.line" />
    </header>
    <!-- 身体 -->
    <!-- 标签 -->
    <div
      :class="$style.listThree"
      :style="item.type===1?'background: #EDC463':''"
    >
      {{ item.type === 1 ? '续报' : '首报' }}
    </div>
    <!-- 描述 -->
    <div :class="$style.listSix">
      {{ item.content }}
    </div>
    <!-- 文件 -->
    <div
      v-for="itemone in item?.appAttachments"
      :key="itemone.id"
    >
      <!-- 图片 -->
      <img
        v-if="itemone?.dictionaryType?.code==='image'"
        :class="$style.listFour"
        style="width: 160px; height: 90px;"
        :src="baseURL+itemone?.url"
      >
      <!-- 文件 -->
      <a
        v-else-if="itemone?.dictionaryType?.code==='file'"
        :href="baseURL+itemone?.url"
        target="_blank"
        :class="$style.listFour"
        style="text-decoration: none;color: #00C1DE;"
      >
        {{ itemone.title }}
      </a>
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
      :class="isPosition
        ? $style.locationActive
        : $style.locationUnactive"
      @click.stop="location(item)"
    />
    <!-- 定位哪里 -->
    <div :class="$style.listFour">
      {{ item.address || '暂无地址信息' }}
    </div>
    <!-- 上报人 -->
    <div :class="$style.listFour">
      上报人：{{ item?.contactor?.name || '-' }}
      ({{ item?.contactor?.workUnit || '-' }}/{{ item?.contactor?.position || '-' }})
      <!-- 详情按钮 -->
      <span v-if="item.contactor">
        <ContactMoreButton
          :contact-more-props="{
            id: item.id,
            name: item.name,
            phone: item.mobile1,
            workUnit: item.workUnit,
            position: item.position,
          }"
        />
      </span>
    </div>
    <!-- 上报时间 -->
    <div :class="$style.listFour">
      上报时间：{{ item.reportTime }}
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
  emits: ['handleClick', 'closeOne'],
  data() {
    return {
      isPosition: false,
      baseURL: (window as any).config.baseURL,
    };
  },
  methods: {
    handleClick(): void {
      this.$emit('handleClick');
    },
    closeOne(): void {
      this.$emit('closeOne');
    },
    // 地图落点
    location(item: any) {
      this.isPosition = !this.isPosition;
      (window as any).map.clearAtPresentMarkData('MsgMarker');
      (window as any).map.clearDeleteCoverage('MsgMarker');
      (window as any).map.createdMarkCoverage('MsgMarker');
      if (this.isPosition) {
        location(item.longitude, item.latitude, 'MsgMarker');
      }
    },
  },
});
</script>

<style lang="scss" module>
  .listStyle {
    color: #FFFFFF;
    width: 94%;
    cursor: pointer;
    position: relative;
    float: left;
    margin: 5px 0px 5px 10px;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(0, 193, 222, 0.29);
    .headerStyle {
      width: 100%;
      height: 48px;
      .listOne {
        background: rgba(166, 173, 180, 0.25);
        box-shadow: 0px 0px 4px 0px #56E9FF;
        border-radius: 16px;
        float: left;
        position: relative;
        margin-top: 14px;
        margin-left: 10px;
        padding: 1px 8px;
        font-size: 12px;
        color: #56E9FF;
      }
      .listTwo {
        color: #56E9FF;
        position: relative;
        float: left;
        margin-top: 14px;
        margin-left: 6px;
      }
      .close {
        background: url(../assets/close.svg) no-repeat;
        width: 12px;
        height: 12px;
        float: right;
        position: relative;
        margin-top: 18px;
        margin-right: 10px;
        background-size: 94%;
        opacity: 64%;
        z-index: 5;
        cursor: pointer;
      }
      .line {
        width: 90%;
        height: 1px;
        float: left;
        position: relative;
        margin-top: 14px;
        margin-left: 10px;
        background: linear-gradient(to right, rgba(86, 233, 255, 0.7),
        rgba(86, 233, 255, 0.8), rgba(86, 233, 255, 0.1));
        filter: blur(0.8px);
      }
    }
    .listThree {
      background: #0BD295;
      border-radius: 10px;
      float: left;
      position: relative;
      margin-top: 10px;
      margin-left: 12px;
      padding: 1px 8px;
      font-size: 12px;
    }
    .listSix {
      position: relative;
      margin: 12px 0px 0px 44px;
    }
    .listFour {
      position: relative;
      margin: 5px 0px 5px 10px;
    }
    .locationActive {
      background: url(../assets/locationActive.svg) no-repeat;
      width: 13px;
      height: 16px;
      background-size: 100%;
      cursor: pointer;
      position: relative;
      margin: 7px 0px 0px 10px;
      z-index: 1;
      float: left;
    }
    .locationUnactive {
      background: url(../assets/locationUnActive.svg) no-repeat;
      width: 13px;
      height: 16px;
      background-size: 100%;
      cursor: pointer;
      position: relative;
      margin: 7px 0px 0px 10px;
      z-index: 1;
      float: left;
      &:hover {
        background: url(../assets/locationActive.svg) no-repeat;
      }
    }
  }
</style>
