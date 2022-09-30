<template>
  <ul :class="$style.buttonList">
    <li :class="[$style.phone, { [$style.disabled]: state.phoneList.value?.length === 0 }]">
      <div>电话呼叫</div>
      <ul v-if="state.phoneList.value?.length" :class="$style.subList">
        <div>电话呼叫</div>
        <li
          v-for="item in state.phoneList.value"
          :key="item.value"
          :title="item.value"
          @click="dispatch({ type: 'phone', payload: item.value })"
        >
          {{ item.name }}
        </li>
      </ul>
    </li>
    <li :class="[$style.sms, { [$style.disabled]: state.smsList.value?.length === 0 }]">
      <div>短信呼叫</div>
      <ul v-if="state.smsList.value?.length" :class="$style.subList">
        <div>短信呼叫</div>
        <li
          v-for="item in state.smsList.value"
          :key="item.value"
          :title="item.value"
          @click="dispatch({ type: 'sms', payload: item.value })"
        >
          {{ item.name }}
        </li>
      </ul>
    </li>
    <li
      :class="[
        $style.voice,
        { [$style.disabled]: !state.isOnline.value || state.clusterList.value?.length === 0 },
      ]"
    >
      <div>语音点呼</div>
      <ul v-if="state.isOnline.value && state.clusterList.value?.length" :class="$style.subList">
        <div>语音点呼</div>
        <li
          v-for="item in state.clusterList.value"
          :key="item.value"
          :title="item.value"
          @click="dispatch({ type: 'voice', payload: item })"
        >
          {{ item.name }}
        </li>
      </ul>
    </li>
    <li
      :class="[
        $style.video,
        { [$style.disabled]: !state.isOnline.value || state.clusterList.value?.length === 0 },
      ]"
    >
      <div>视频点呼</div>
      <ul v-if="state.isOnline.value && state.clusterList.value?.length" :class="$style.subList">
        <div>视频点呼</div>
        <li
          v-for="item in state.clusterList.value"
          :key="item.value"
          :title="item.value"
          @click="dispatch({ type: 'video', payload: item })"
        >
          {{ item.name }}
        </li>
      </ul>
    </li>
    <li :class="[$style.live, { [$style.disabled]: true }]">
      现场直播
    </li>
    <li
      :class="[$style.track, { [$style.disabled]: !state.canTrack.value }]"
      @click="dispatch({ type: 'track' })"
    >
      轨迹跟踪
    </li>
    <li
      :class="[
        $style.meeting,
        { [$style.disabled]: !state.phoneList.value?.length && !state.deviceList.value?.length },
      ]"
    >
      <div>邀请会议</div>
      <ul
        v-if="state.phoneList.value?.length || state.deviceList.value?.length"
        :class="$style.subList"
      >
        <div>邀请会议</div>
        <li
          v-for="item in [...(state.phoneList.value || []), ...(state.deviceList.value || [])]"
          :key="item.value"
          :title="item.value"
          @click="dispatch({ type: 'meeting', payload: item })"
        >
          {{ item.name }}
        </li>
      </ul>
    </li>
    <li
      :class="[
        $style.monitor,
        { [$style.disabled]: !state.hasLngLat.value },
      ]"
      @click="dispatch({ type: 'searchMonitor' })"
    >
      附近监控
    </li>
    <li
      :class="[
        $style.search,
        { [$style.disabled]: !state.hasLngLat.value },
      ]"
      @click="dispatch({ type: 'search' })"
    >
      周边检索
    </li>
    <li :class="$style.task" @click="dispatch({ type: 'task' })">
      发布任务
    </li>
    <li :class="$style.detail" @click="dispatch({ type: 'detail' })">
      详细信息
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ContactOperation',
  props: {
    state: {
      type: Object,
      required: true,
    },
    dispatch: {
      type: Function as PropType<(action: { type: string; payload?: any }) => void>,
      required: true,
    },
  },
});
</script>

<style lang="scss" module>
.buttonList {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: max-content;
  & > li {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    position: relative;
    margin: 5px;
    .subList {
      max-height: 0;
      position: absolute;
      left: -1px;
      top: -1px;
      width: 100%;
      overflow: hidden;
      background: #000;
      z-index: 2;
      text-align: center;
      color: #fff;
      & > div {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #56e9ff;
      }
      & > li:hover {
        background: linear-gradient(90deg, #00c1de 0%, rgba(24, 38, 50, 0) 100%);
      }
      & > li {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &:hover {
      color: #56e9ff;
      .subList {
        max-height: 200px;
        border: 1px solid #008abf;
      }
    }
    &::before,
    .subList > div:first-child::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 16px;
      color: inherit;
      background: currentColor;
      margin-right: 10px;
    }
    &.disabled {
      color: #a6adb4;
      cursor: not-allowed;
      pointer-events: none;
    }
    $icon-list: detail, live, meeting, monitor, phone, search, sms, task, track, video, voice;
    @each $icon in $icon-list {
      &.#{$icon}::before,
      &.#{$icon} > .subList > div:first-child::before {
        mask: no-repeat center/100% 100% url('./assets/imgs/#{$icon}.svg');
      }
    }
  }
}
</style>
