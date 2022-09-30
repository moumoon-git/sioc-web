<template>
  <div ref="mapPupopWrap" class="mapPupopWrap">
    <MapDialog ref="mapDialogs" :visible="visible" @close="close">
      <!-- 弹窗标题栏 -->
      <template #title>
        <div class="task-dynamic-dialog__title">
          <div :class="'task-dynamic-dialog__title__left ' + (1 === 1 ? 'star' : 'star--disabled')">
            {{ dynamicData.timeDivision }}
          </div>
          <div class="task-dynamic-dialog__title__right">
            {{ dynamicData.taskTitle }}
          </div>
        </div>
      </template>

      <!-- 弹窗内容框 -->
      <div class="task-dynamic-dialog__content">
        <div class="task-dynamic-dialog__content__text">{{ dynamicData.text }}</div>

        <div
          v-if="dynamicData.attachments.images.length > 0"
          class="task-dynamic-dialog__content__images"
        >
          <div v-for="item in dynamicData.attachments.images" :key="item.id" class="task-image">
            <img :src="`${baseURL}${item.url}`" alt="" class="image" />
          </div>
        </div>

        <div
          v-if="dynamicData.attachments.videos.length > 0"
          class="task-dynamic-dialog__content__images"
        >
          <div v-for="item in dynamicData.attachments.videos" :key="item.id" class="task-image">
            <video :src="`${baseURL}${item.url}`" class="image" />
          </div>
        </div>

        <div
          :class="
            'task-dynamic-dialog__content__address ' +
              (dynamicData.longitude && dynamicData.latitude ? 'haveIcon' : '')
          "
        >
          {{ dynamicData.address }}
        </div>
      </div>

      <div :class="$style['task-dynamic-dialog-animation']"></div>
    </MapDialog>
  </div>
</template>

<script lang="ts">
// 地图弹窗
import MapDialog from '@/product/CommandBrain3.0/Generalparts/map/MapDialog/MapDialog.vue';
import { defineComponent, onMounted, ref } from 'vue';
interface config {
  location?: object;
  longitude?: number;
  latitude?: number;
  map?: any;
}
export default defineComponent({
  name: 'TaskDynamicDialog',
  components: {
    // 地图弹窗
    MapDialog,
  },
  props: {
    dynamicData: {
      type: Object,
      default: () => {
        return {
          timeDivision: '',
          longitude: '',
          latitude: '',
          address: '',
          text: '',
          attachments: {
            images: [],
            videos: [],
          },
        };
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    close: null,
  },
  setup(props, { emit }) {
    const { dynamicData } = props;

    // 图片显示路径
    const baseURL = (window as any).config.baseURL;
    const mapDialogs = ref<HTMLElement | null | any>(null);
    const mapPupopWrap = ref<HTMLElement | null | any>(null);

    /**
     * @description 关闭弹窗
     */
    function close() {
      emit('close');
    }

    /**
     * @description 在地图上创建打开弹窗
     */
    function openDialog() {
      const id = `map-dialog--${Math.floor(Math.random() * 100000000)}`;
      const data = {
        id,
        longitude: dynamicData.longitude,
        latitude: dynamicData.latitude,
        class: mapPupopWrap.value,
      };
      (window as any).map.mapPopup(data);
      // 五秒后隐藏弹窗
      if (dynamicData?.timingToHide) {
        setTimeout(() => {
          emit('close');
        }, 5000);
      }
    }

    onMounted(() => {
      setTimeout(() => {
        openDialog();
      });
    });

    return {
      mapPupopWrap,
      mapDialogs,
      close,
      openDialog,
      baseURL,
    };
  },
});
</script>

<style lang="scss">
@use './assets/css/taskDynamicDialog.scss';
</style>
<style lang="scss" module>
@use './assets/css/animation.scss';
</style>
