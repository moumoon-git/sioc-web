<!--组件：任务详情 —— 定位 -->
<template>
  <!-- 定位 -->
  <div class="task-location-layout">
    <!-- 定位图标 -->
    <div
      v-if="showIcon"
      :class="color == '#666666' ? 'task-location_img-loaction2' : 'task-location_img-loaction3'"
    ></div>
    <!-- 定位地点 -->
    <div class="task-location-name" :style="{ color: color }">{{ address }}</div>
    <!-- 删除按钮 -->
    <div v-if="showClose" class="task-location_img-close" @click="handleClose(file)"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TaskLocation',
  props: {
    // 定位地点
    address: {
      type: String,
      default: '',
    },

    // 是否显示 关闭 | 删除 按钮
    showClose: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#666666',
    },
    // 是否显示定位图标
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    handleClose: null,
  },
  setup(props, { emit }) {
    /**
     * @author hxt
     * @createDate 2021年4月26日10:27:00
     * @param {Object} file 文件数据
     * @description 关闭 | 删除 方法
     */
    const handleClose = function(file: any) {
      emit('handleClose', file);
    };

    return {
      handleClose,
    };
  },
});
</script>
<style lang="scss">
@import '../assets/css/common'; /*引入公共样式*/

$img_close: url('../assets/images/icons/close.png'); // 图片-关闭
$img_location2: url('../assets/images/icons/location2.png'); // 图片-定位
$img_location3: url('../assets/images/icons/location3.png'); // 图片-定位

// 定位
.task-location-layout {
  @extend .flex_style;
  justify-content: space-between;
  align-items: center;
  // padding: 0 0.14rem 0 0.18rem;

  // 定位2
  .task-location_img-loaction2 {
    width: 0.2rem;
    height: 0.24rem;
    background-image: $img_location2;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  // 定位3
  .task-location_img-loaction3 {
    width: 0.2rem;
    height: 0.24rem;
    background-image: $img_location3;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .task-location-name {
    flex: 1;
    color: $color_4;
    font-size: $font_size_2;
    padding: 0 0.14rem;
  }

  // 关闭
  .task-location_img-close {
    width: 0.28rem;
    height: 0.28rem;
    background-image: $img_close;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
