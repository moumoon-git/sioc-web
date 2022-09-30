<template>
  <div :class="$style.listStyle">
    <!-- 图片 -->
    <div :class="$style.back" />
    <div :class="$style.scroll">
      <div :class="$style.listText">
        上报人：{{ item?.contactor?.name }}
        <span v-if="item.contactor">
          <ContactMoreButton
            :id="item?.contactor?.id"
          />
        </span>
      </div>
      <div :class="$style.listText">
        上报时间：{{ item.reportTime }}
      </div>
      <div :class="$style.listText">
        事件标题：{{ item.title }}
      </div>
      <div :class="$style.listText">
        事件类型：{{ item.caseClassName }}
      </div>
      <div :class="$style.listText">
        事发地点：{{ item.address }}
      </div>
      <div :class="$style.listText">
        事件描述：{{ item.content }}
      </div>
      <div :class="$style.listText">
        现场情况：
        <!-- 文件 -->
        <div
          v-for="itemone in item?.appAttachments"
          :key="itemone.id"
          v-viewer
        >
          <!-- 图片 -->
          <img
            v-if="itemone?.dictionaryType?.code==='image'"
            :class="$style.listText"
            style="width: 160px; height: 90px;"
            :src="baseURL+itemone?.url"
          >
          <!-- 文件 -->
          <a
            v-else-if="itemone?.dictionaryType?.code==='file'"
            :href="baseURL+itemone?.url"
            target="_blank"
            :class="$style.listText"
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
            :class="$style.listText"
            :src="baseURL+itemone?.url"
          />
          <!-- 音频 -->
          <audio
            v-else-if="itemone?.dictionaryType?.code==='audio'"
            controls
            style="width: 160px; height: 20px;"
            :class="$style.listText"
            :src="baseURL+itemone?.url"
          />
        </div>
      </div>
      <!-- 横线 -->
      <div :class="$style.line" />
      <div :class="$style.listText">
        续报：
        <div
          v-for="(itemone, indexone) in item.reportSupplements"
          :key="indexone"
          :class="$style.listInner"
        >
          <!-- 时间 -->
          <div :class="$style.listText">
            {{ itemone.reportTime }}
          </div>
          <!-- 描述 -->
          <div :class="$style.listText">
            {{ itemone.content }}
          </div>
          <!-- 文件 -->
          <div
            v-for="itemtwo in itemone?.appAttachments"
            :key="itemtwo.id"
          >
            <!-- 图片 -->
            <img
              v-if="itemtwo?.dictionaryType?.code==='image'"
              :class="$style.listText"
              style="width: 160px; height: 90px;"
              :src="baseURL+itemtwo?.url"
            >
            <!-- 文件 -->
            <a
              v-else-if="itemtwo?.dictionaryType?.code==='file'"
              :href="baseURL+itemtwo?.url"
              target="_blank"
              :class="$style.listText"
              style="text-decoration: none;color: #00C1DE;"
            >
              {{ itemtwo.title }}
            </a>
            <!-- 视频 -->
            <video
              v-else-if="itemtwo?.dictionaryType?.code==='video'"
              width="160"
              height="90"
              controls
              :class="$style.listText"
              :src="baseURL+itemtwo?.url"
            />
            <!-- 音频 -->
            <audio
              v-else-if="itemtwo?.dictionaryType?.code==='audio'"
              controls
              style="width: 160px; height: 20px;"
              :class="$style.listText"
              :src="baseURL+itemtwo?.url"
            />
          </div>
          <!-- 横线 -->
          <div :class="$style.line" />
          <!-- 定位 -->
          <div
            :class="isPosition
              ? $style.locationActive
              : $style.locationUnactive"
            @click.stop="location(itemone)"
          />
          <div :class="$style.listText">
            {{ itemone.address }}
          </div>
        </div>
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
  data() {
    return {
      isPosition: false,
      baseURL: (window as any).config.baseURL,
    };
  },
  methods: {
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
    width: 680px;
    height: 720px;
    color: #fff;
    position: relative;
    .back {
      background: url(../assets/back.png) no-repeat;
      width: 206px;
      height: 200px;
      background-size: 100%;
      right: 20px;
      top: 2px;
      position: absolute;
    }
    .scroll {
      overflow: auto;
      height: 717px;
      width: 100%;
      .listText {
        margin: 10px 20px;
      }
      .line {
        width: 94%;
        height: 1px;
        background: #FFFFFF;
        opacity: 0.15;
        margin-left: 20px;
      }
      .listInner {
        width: 640px;
        margin: 10px 0px;
        background: linear-gradient(90deg, #00C1DE 0%, rgba(24, 38, 50, 0) 100%);
        position: relative;
        opacity: 0.7;
        .listText {
          margin: 0px 0px 4px 10px;
          padding-top: 7px;
        }
        .locationActive {
          background: url(../assets/locationActive.svg) no-repeat;
          width: 13px;
          height: 16px;
          background-size: 100%;
          cursor: pointer;
          position: relative;
          margin: 5px 0px 0px 10px;
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
          margin: 5px 0px 0px 10px;
          z-index: 1;
          float: left;
          &:hover {
            background: url(../assets/locationActive.svg) no-repeat;
          }
        }
      }
      // 滚动条
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #56E9FF;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-corner {
        background: transparent;
      }
    }
  }
</style>
