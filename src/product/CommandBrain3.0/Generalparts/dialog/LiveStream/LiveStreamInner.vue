// 实时直播弹窗
<template>
  <div
    ref="containerRef"
    :class="$style.container"
  >
    <!-- 视频画面 -->
    <div
      v-loading="!isPlaying"
      :class="$style.videoWrapper"
      @dblclick="toggleFullscreen"
    >
      <div
        :id="uuid"
        :class="$style.video"
      />
      <ul
        ref="listRef"
        :class="$style.list"
      >
        <li
          v-for="msg in messageHistory"
          :key="msg.ID"
        >
          <div
            :title="msg.from"
            :style="{
              backgroundColor: userID === msg.from ? '#F66E6E' : '#32C5FF',
            }"
          >
            {{ msg.from }}
          </div>
          <div>{{ msg.payload.text }}</div>
        </li>
      </ul>
      <div
        :class="[
          $style.playingStatus,
          {
            [$style.pausing]: !isPlaying,
          },
        ]"
      >
        {{ isPlaying ? '正在直播' : '暂无信号' }}
      </div>
      <div
        :class="$style.mute"
        :style="{
          backgroundColor: isSilent ? '#FF3F3F' : '#32c5ff',
        }"
        @click="toggleVolume"
      />
    </div>
    <!-- 人员 -->
    <div v-if="streamer">
      <span>{{ streamer.name }}</span>
      <ContactMoreButton :id="streamer.id" />
    </div>
    <!-- 地址 -->
    <Address v-if="streamer">{{ streamer.address }}</Address>
    <!-- 输入栏 -->
    <div v-if="isPlaying">
      <input
        v-model="text"
        @keyup.enter="handleSend"
      >
      <Button @click="handleSend">发送指令</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue';
import Address from '@/product/CommandBrain3.0/Generalparts/right/Address/Address.vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import useLiveStream, { userID } from './scripts/useLiveStream';

export default defineComponent({
  name: 'LiveStreamDialog',
  components: {
    // 按钮
    Button,
    // 地址栏
    Address,
    // 联系人更多按钮
    ContactMoreButton,
  },
  props: {
    // 房间号
    roomID: {
      type: [String, Number],
      required: true,
    },
    // 直播主
    streamer: {
      type: Object,
      default: () => ({}) as any,
    },
  },
  setup(props) {
    // 弹窗 DOM Ref
    const containerRef = ref<HTMLDivElement | null>(null);
    // ul DOM Ref
    const listRef = ref<HTMLUListElement | null>(null);
    // 消息记录列表
    const messageHistory = ref<any>([]);
    // 接收到消息的回调
    const onRecieved = (msg: any) => {
      messageHistory.value.push(msg);
    };
    const {
      uuid,
      sendMessage,
      isPlaying,
      isSilent,
      toggleVolume,
    } = useLiveStream(props.roomID, onRecieved);
    // 待发送的文字
    const text = ref('');
    // 发送文字
    const handleSend = () => {
      if (text.value) {
        sendMessage(text.value).then(onRecieved);
        text.value = '';
      }
    };
    // 接收到新的消息，显示列表并跳转显示最新的消息
    let timer: any;
    watch(messageHistory, () => {
      setTimeout(() => {
        if (listRef.value) {
          listRef.value.scrollTop = listRef.value.scrollHeight;
          listRef.value.style.opacity = '1';
          // 3秒后取消常显
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (listRef.value) {
              listRef.value.style.opacity = '';
            }
          }, 3000);
        }
      }, 0);
    }, { deep: true, immediate: true });
    // 设置全屏
    function toggleFullscreen() {
      if (containerRef.value) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          containerRef.value.requestFullscreen();
        }
      }
    }
    return {
      containerRef,
      listRef,
      uuid,
      text,
      handleSend,
      messageHistory,
      userID,
      isPlaying,
      toggleFullscreen,
      isSilent,
      toggleVolume,
    };
  },
});
</script>

<style lang="scss" src="./styles/index.scss" module />
