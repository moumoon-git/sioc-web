<template>
  <!-- 视频链底部功能按钮 -->
  <section :class="$style['flight-camera-function']">
    <div :class="$style['checkbox-wrap']">
      <label :class="$style['checkbox-circular']">
        <input type="checkbox" />
        <span />
      </label>
      <label>显示视频链监控</label>
    </div>
    <div :class="$style['button-wrap']">
      <div
        v-if="!editVisible && !flightCameraDetailVisible"
        :class="$style['common-button']"
        @click="$emit('update:editVisible', !editVisible)"
      >
        编辑视频链
      </div>
      <div
        v-if="!editVisible && !flightCameraDetailVisible"
        :class="$style['common-button']"
        @click="preview"
      >
        批量预览
      </div>
      <div
        v-if="!editVisible && !flightCameraDetailVisible"
        :class="$style['common-button']"
        @click="changeFlightResourceVisible"
      >
        添加监控
      </div>
      <div v-if="!editVisible && !flightCameraDetailVisible" :class="$style['common-button']" @click="rim">
        检索周边
      </div>
      <label
        v-if="editVisible && !flightCameraDetailVisible"
        :class="$style['edit-label']"
        @click="dismissCamera"
      >
        解散视频链
      </label>
      <label
        v-if="editVisible && !flightCameraDetailVisible"
        :class="$style['edit-label']"
        @click="changeFlightResourceVisible"
      >
        添加监控
      </label>
      <label
        v-if="editVisible && !flightCameraDetailVisible"
        :class="$style['edit-label']"
        @click="deleteCamera"
      >
        批量删除
      </label>
      <div
        v-if="editVisible && !flightCameraDetailVisible"
        :class="$style['edit-button-cancel']"
        @click="$emit('update:editVisible', !editVisible)"
      >
        取消
      </div>
      <div
        v-if="editVisible && !flightCameraDetailVisible"
        :class="$style['edit-button-save']"
        @click="saveFlightCamera"
      >
        保存
      </div>
      <div v-if="flightCameraDetailVisible" :class="$style['detail-button']" @click="preview">
        预览
      </div>
      <div v-if="flightCameraDetailVisible" :class="$style['detail-button']" @click="rim">
        检索周边
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FlightCameraFunction',
  props: {
    // 监控详情是否可见
    flightCameraDetailVisible: {
      type: Boolean,
      default: false,
    },
    // 是否编辑视频链
    editVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update:editVisible',
    'dismissCamera',
    'changeFlightResourceVisible',
    'deleteCamera',
    'preview',
    'saveFlightCamera',
    'rim',
  ],
  data() {
    return {
      isrim: false,
    };
  },
  methods: {
    // 编辑视频链保存
    saveFlightCamera() {
      this.$emit('update:editVisible', !this.editVisible);
      this.$emit('saveFlightCamera');
    },
    // 解散视频链
    dismissCamera() {
      this.$emit('dismissCamera');
    },
    // 添加监控
    changeFlightResourceVisible() {
      this.$emit('changeFlightResourceVisible');
    },
    // 批量删除视频链
    deleteCamera() {
      this.$emit('deleteCamera');
    },
    // 预览
    preview() {
      this.$emit('preview');
    },
    // 周边检索
    rim() {
      this.isrim = !this.isrim;
      this.$emit('rim', this.isrim);
    },
  },
});
</script>

<style lang="scss" module>
.flight-camera-function {
  padding: 8px 0px;
  border-top: 1px solid rgba(86, 233, 255, 0.2);
  & .checkbox-wrap {
    margin: 10px 0px;
    & > * {
      color: #a6adb4;
      margin-left: 10px;
    }
    & .checkbox-circular span {
      border-radius: 50%;
      border: 2px solid #a6adb4;
      width: 17px;
      height: 17px;
      line-height: 17px;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      cursor: pointer;
    }
    & .checkbox-circular input[type='checkbox'] {
      display: none;
    }
    & .checkbox-circular input[type='checkbox']:checked + span {
      position: relative;
      background: #00c1de;
      border: 2px solid #00c1de;
    }
    & .checkbox-circular input[type='checkbox']:checked + span:after {
      content: '';
      border-radius: 50%;
      top: 48%;
      transform: translate(-50%, -50%);
      position: absolute;
      background: #fff;
      border: #00c1de solid 2px;
      height: 12px;
      width: 12px;
    }
  }
  & .button-wrap {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    margin: 10px 0px;
    & .common-button {
      display: inline-block;
      font-size: 14px;
      color: #00c1de;
      border: 1px solid #00c1de;
      padding: 5px 10px;
      cursor: pointer;
    }
    & .edit-label {
      font-size: 12px;
      color: #ffffff;
      cursor: pointer;
      &:not(.edit-label:nth-of-type(3))::after {
        content: '';
        width: 1px;
        height: 16.4px;
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        vertical-align: sub;
        margin-left: 10px;
      }
    }
    & .edit-button-cancel {
      display: inline-block;
      font-size: 14px;
      color: #00c1de;
      border: 1px solid #00c1de;
      padding: 5px 20px;
      cursor: pointer;
    }
    & .edit-button-save {
      display: inline-block;
      font-size: 14px;
      color: #ffffff;
      border: 1px solid #00c1de;
      background-color: #00c1de;
      padding: 5px 20px;
      cursor: pointer;
    }
    & .detail-button {
      display: inline-block;
      font-size: 14px;
      color: #00c1de;
      border: 1px solid #00c1de;
      padding: 5px 10px;
      cursor: pointer;
      margin-right: -60%;
    }
  }
}
</style>
