<template>
  <!-- 弹窗身体部分内的div -->
  <div :class="$style.bodyStyle">
    <!-- 按钮 -->
    <div
      :class="hiddenRight?$style.RectangleHidden:$style.Rectangle"
      @click="hiddenRight=!hiddenRight"
    >
      <img
        style="position: absolute;right: 7px;top: 36px;width: 12px; height: 23px;"
        :class="hiddenRight?$style.arrow:$style.arrowReset"
        src="../PublicComponents/assets/right.svg"
        alt=""
      >
    </div>
    <!-- 窗体 -->
    <div
      :class="hiddenRight?$style.rightHidden:$style.right"
    >
      <div v-if="item?.flag===1 || (item?.flag===12 && !isUnit) || (item?.flag===13 && isUnit)">
        <ManDialog
          v-if="!hiddenRight"
          :item="item"
          @close="hiddenRight=true"
        />
      </div>
      <div v-else>
        <NodeDialog
          v-if="!hiddenRight"
          :item="item"
          :isUnit="isUnit"
          @close="hiddenRight=true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NodeDialog from './NodeDialog.vue'; // 结点详情
import ManDialog from './ManDialog.vue'; // 人详情
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮

export default defineComponent({
  components: {
    // 结点详情
    NodeDialog,
    // 人详情
    ManDialog,
    // 详情按钮
    ContactMoreButton,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    // false 领导小组 true 成员单位
    isUnit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hiddenRight: true, // 右边是否显示
    };
  },
});
</script>

<style lang="scss" module>
  .bodyStyle {
    color: rgba(255, 255, 255, 0.8);
    .right {
      width: 323px;
      height: 85vh;
      background: rgba(0, 0, 0, 0.29);
      box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(0, 193, 222, 0.29);
      position: absolute;
      right: 0px;
      bottom: 0px;
      z-index: 1001;
      overflow: auto;
      // 滚动条
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 193, 222, 0.5);
        border-radius: 5px;
      }
      &::-webkit-scrollbar-corner {
        background: transparent;
      }
    }
  }
  .rightHidden {
    width: 0px;
    height: 85vh;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid #00C1DE;
    position: absolute;
    right: 0px;
    bottom: 0px;
    z-index: 1001;
  }
  .Rectangle {
    background: url(./assets/Rectangle.svg) no-repeat;
    width: 23px;
    height: 92px;
    position: absolute;
    right: 323px;
    bottom: 329px;
    cursor: pointer;
    z-index: 1001;
    .arrowReset {
      transform: rotate(0deg);
      transition: all .3s;
    }
  }
  .RectangleHidden {
    background: url(./assets/Rectangle.svg) no-repeat;
    width: 23px;
    height: 92px;
    position: absolute;
    right: 0px;
    bottom: 329px;
    cursor: pointer;
    z-index: 1001;
    .arrow {
      transform: rotate(180deg);
      transition: all .3s;
    }
  }
</style>
