<template>
  <DialogBoat
    ref="DetailDialogBoat"
    :title="detail.deviceName"
  >
    <div :class="$style.deviceDivOut">
      <p>设备类型:{{ detail.type }}</p>
      <p>上级节点:{{ detail.top }}</p>
      <p>设备名称:{{ detail.deviceName }}</p>
      <p>设备编号:{{ detail.deviceCode }}</p>
      <p>调用编号:{{ detail.useCode }}</p>
      <p>
        设备地址:{{ detail.address }}
        <!-- 定位 -->
        <span
          :class="isPosition
            ? $style.locationIconActive
            : $style.locationIcon"
          @click="handlePosition"
        />
      </p>
      <p>经度:{{ detail.longitude }}</p>
      <p>纬度:{{ detail.latitude }}</p>
      <p>登录地址:{{ detail.loginAddress }}</p>
      <p>登录端口:{{ detail.loginPort }}</p>
      <p>登录账号:{{ detail.loginAccount }}</p>
      <p>流媒体地址:{{ detail.mediaAddress }}</p>
    </div>
  </DialogBoat>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DialogBoat from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue'; // 弹出框
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';

export default defineComponent({
  name: 'RightListDetail',
  components: {
    // 弹出框
    DialogBoat,
  },
  props: {
    detail: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isPosition: false,
    };
  },
  mounted() {
    if ((window as any).map) {
      (window as any).map.createdMarkCoverage('rightDetailMarker');
    }
  },
  beforeUnmount() {
    if ((window as any).map) {
      (window as any).map.clearDeleteCoverage('rightDetailMarker');
    }
  },
  methods: {
    // 开窗
    openPopup() {
      if (this.$refs.DetailDialogBoat) {
        (this as any).$refs.DetailDialogBoat.open();
      } else {
        setTimeout(() => this.openPopup(), 500);
      }
    },
    // 定位
    handlePosition() {
      this.isPosition = true;
      (window as any).map.setCentent(
        {
          longitude: this.detail.longitude,
          latitude: this.detail.latitude,
        },
        17,
      );
      (window as any).map.setOneMarker(
        'rightDetailMarker',
        {
          longitude: this.detail.longitude,
          latitude: this.detail.latitude,
          wd: 40,
          hg: 40,
          src: useMapMarker(),
        },
      );
    },
  },
});
</script>

<style lang="scss" module>
  @mixin icon {
    width: 13px;
    height: 14px;
    background-size: 90%;
    cursor: pointer;
    display: inline-block;
    margin-left: 5px;
  }
  .deviceDivOut {
    width: 362px;
    height: 478px;
    position: relative;
    overflow: auto;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56e9ff;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    p {
      margin: 10px 0px 0px 10px;
      float: left;
      color: #FFF;
      position: relative;
      width: 94%;
      .locationIcon {
        background: url(../assets/location.svg) no-repeat;
        @include icon;
      }
      .locationIconActive {
        background: url(../assets/locationActive.svg) no-repeat;
        @include icon;
      }
    }
  }
</style>
