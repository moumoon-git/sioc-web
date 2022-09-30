<template>
  <div :class="$style.container">
    <div
      @click="togglePlay"
    >点击播放音频</div>
    <audio
      ref="audioRef"
      :src="src"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
} from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});

const audioRef = ref<HTMLAudioElement>();

const isPlaying = ref(false);

const togglePlay = () => {
  if (audioRef.value) {
    if (isPlaying.value) {
      if (audioRef.value.ended) {
        isPlaying.value = false;
        togglePlay();
      } else {
        audioRef.value.pause();
      }
    } else {
      audioRef.value.currentTime = 0;
      audioRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};
</script>

<style lang="scss" module>
.container {
  & > div {
    color: #fff;
    height: 20px;
    font-size: 12px;
    line-height: 20px;
    background: #0091FF;
    cursor: pointer;
    border-radius: 4px;
    &::before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      width: 14px;
      height: 14px;
      margin-left: 5px;
      background: no-repeat center/100% 100% url('../assets/imgs/audio.svg');
    }
  }
}
</style>
