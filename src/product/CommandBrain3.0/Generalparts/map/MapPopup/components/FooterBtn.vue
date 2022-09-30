<template>
  <div :class="$style.FooterBtn">
    <div :class="$style['btn-group']">
      <!-- 监控 和 会场终端都有会议 集群终端 wecomm -->
      <button
        v-if="
          selfModule === 'camera' ||
          selfModule === 'device' ||
          selfModule === 'colony' ||
          selfModule === 'wecomm'
        "
      >
        会议
      </button>
      <!-- 预览只有监控 -->
      <button v-if="selfModule === 'camera'">预览</button>
      <button
        v-if="
          selfModule !== 'camera' &&
          selfModule !== 'device' &&
          selfModule !== 'colony' &&
          selfModule !== 'wecomm'
        "
      >
        详情
      </button>
      <!-- 轨迹跟踪 -->
      <button v-if="selfModule === 'colony' || selfModule === 'wecomm'">
        轨迹跟踪
      </button>
      <!-- 公用 -->
      <button>附件监控</button>
      <button>周边检索</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  props: {
    selfModule: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    watch(
      () => props.selfModule,
      (newV) => {
        console.log(newV);
      },
    );
  },
});
</script>

<style lang="scss" module>
.FooterBtn {
  .btn-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 53px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    button {
      min-height: auto;
      margin-left: 0;
      margin-right: 10px;
      width: 76px;
      height: 32px;
      background: transparent;
      border: 1px solid #00c1de;
      color: #00c1de;
      text-align: center;
      font-size: 14px;
      padding: 0;
      cursor: pointer;
    }
  }
}
</style>