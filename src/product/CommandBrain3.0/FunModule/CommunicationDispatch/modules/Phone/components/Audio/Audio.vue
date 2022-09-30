<template>
  <div class="audio-container">
    <audio
      :id="`audio${id}`"
      controls
      style="width:400px;display:none;"
      @timeupdate="timeupdate($event)"
    >
      <!-- 测试录音 -->
      <!-- <source src="./assets/music.mp3" type="audio/mpeg" /> -->
      <source :src="baseURL + audioData.recordFile" type="audio/wav" />
      您的浏览器不支持 audio 元素。
    </audio>
    <!-- 播放按钮 、 暂停按钮 -->
    <div class="audio-button" @click="handleAudioPlay">
      <button v-if="stop" class="icon-button">
        <img src="../../assets/svg/stop.svg" alt="暂停" class="audio-button_stop" />
      </button>
      <button v-else class="icon-button">
        <img src="../../assets/svg/play.png" alt="播放" class="audio-button_play" />
      </button>
    </div>

    <!-- 进度条 -->
    <div :class="`audio-progress audio-progress${id}`">
      <!-- <input
        :id="`audioInput${id}`"
        type="range"
        min="0"
        :value="inputValue"
        @change="handleInputChange($event, id)"
      /> -->
      <!-- 已经播放的进度条 -->
      <!-- <div :id="`audio-progress_ran_${id}`" class="audio-progress_ran"></div> -->
      <el-slider v-model="inputValue" :show-tooltip="false" @change="handleSliderChange($event, id)"></el-slider>
    </div>

    <!-- 时间：已拨放时长/总时长 -->
    <span class="audio-time">{{
      (playedDurationTime ? playedDurationTime : '00:00') +
        '/' +
        (durationTime ? durationTime : '00:00')
    }}</span>

    <!-- 下载按钮、语音转文字按钮 -->
    <button class="icon-button" @click="handleDownloadAudio">
      <img src="../../assets/svg/download.svg" alt="下载" />
    </button>
    <button class="icon-button" @click="handleTurnText">
      <img src="../../assets/svg/turnText.svg" alt="录音转文字" />
    </button>

    <!-- 语音转文字弹窗 -->
    <TurnTextDialog
      v-if="showTurnText"
      :audioText="audioText"
      :loading="loading"
      @handleCloseDialog="handleCloseDialog"
      @handleSaveAudioText="handleSaveAudioText"
      @handleTurnText="handleTurnText"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, getCurrentInstance } from 'vue';
import TurnTextDialog from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Phone/components/Dialog/TurnTextDialog.vue';
const audioTurnToText = require('@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Phone/assets/js/weblfasr')
  .default;
export default defineComponent({
  name: 'Audio',
  components: {
    TurnTextDialog,
  },
  props: {
    // 通话历史Id
    id: {
      type: [Number, String],
      default: 0,
    },
    audioData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: {
    update: null,
  },
  setup(props, { emit }) {
    const { $http, $message }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const { allApiRequests } = audioTurnToText(); // 语音转文字方法
    let stop = ref(false); // 暂停/播放
    let inputValue = ref(0); // 进度
    let duration = ref(0); //总时长 （以秒计算）
    let durationTime = ref('00:00'); // 总时长
    let playedDurationTime = ref('00:00'); // 已播放时长
    const baseURL: string = (window as any).config.baseURL;
    const loading = ref(false); // 录音转文字的loading

    /**
     * @description 判断录音是否可以播放
     */
    function handleAudioIsPlay() {
      if (props.audioData.recordFile === '') {
        $message.error('播放失败，没有录音文件')
        return false;
      } else {
        return true;
      }
    }

    /**
     * @description 设置音频数据
     */
    function setAudio() {
      // console.log('id:', 'audio' + props.id);
      const audio: any = document.getElementById('audio' + props.id);
      // 添加定时器，解决刚挂载会获取不到音频时长问题
      setTimeout(() => {
        if (audio.duration) {
          // audio.duration 返回当前音频/视频的长度（以秒计）
          duration.value = audio.duration;
          // 获取音频时长
          durationTime.value = String(getDuration(audio.duration));
        }
      }, 100);

      // 监听播放
      audio.addEventListener('playing', () => {
        // 播放单条录音时，要将上一条录音的播放暂停
        const lastAudioId = localStorage.getItem('audioId');
        if (lastAudioId && lastAudioId !== 'audio' + props.id) {
          handleStopLastAudio(lastAudioId);
        }
        setTimeout(() => {
          // 当前播放的录音Id
          localStorage.setItem('audioId', 'audio' + props.id);
        }, 10);
      });
      // 监听暂停
      audio.addEventListener('pause', () => {
        localStorage.removeItem('audioId'); // 移除缓存：当前播放的录音Id
        // 将播放按钮改为暂停按钮
        stop.value = false;
      });
    }

    /**
     * @param {string} 上一条录音的Id
     * @description 播放单条录音时，要将上一条录音的播放暂停
     */
    function handleStopLastAudio(lastAudioId: string) {
      // 播放单条录音时，要将上一条录音的播放暂停
      // console.log('上一条录音：', lastAudioId);
      if (lastAudioId) {
        const lastAudio: any = document.getElementById(lastAudioId);
        lastAudio.pause(); // 暂停上一条播放的录音
      }
    }

    /**
     * @param {string | number} data 时间数字
     * @returns 返回 0x 格式的字符 或 原始data
     * @description 小于10的数字在前边加'0'
     */
    function ifNumBigTen(data: string | number) {
      if (Number(data) < 10) {
        return '0' + Number(data);
      }
      return data;
    }

    /**
     * @param {number} time 秒
     * @returns 返回 00:00 格式的时间
     * @description 将秒换算成 00:00 格式
     */
    function minute(time: number) {
      // 分钟以上级别
      if (time >= 60) {
        let AllTimeNum = ref(Number(time));
        let minutes = parseInt(String(AllTimeNum.value / 60));
        let second = parseInt(String(AllTimeNum.value % 60));
        let timeFmt: string = ifNumBigTen(minutes) + ':' + ifNumBigTen(second);
        return timeFmt ? timeFmt : '00:00';
      } else if (time < 60) {
        // 秒以下级别
        let timeFmt: string = '00:' + ifNumBigTen(parseInt(String(time)));
        return timeFmt ? timeFmt : '00:00';
      }
    }

    /**
     * @param {number} time 秒
     * @returns 返回 00:00:00 格式的时间
     * @description 将秒换算成 00:00:00 格式
     */
    function hour(time: number) {
      let hourTimeNum = ref(parseInt(String(time / 3600)));
      let remainder = ref(parseInt(String(time % 3600)));
      let minutes = minute(parseInt(String(remainder.value)));
      let timeFmt: string = ifNumBigTen(hourTimeNum.value) + ':' + minutes;
      return timeFmt ? timeFmt : '00:00:00';
    }

    /**
     * @param {object} e 鼠标对象
     * @description 当播放位置已更新时触发
     */
    function timeupdate(e: any) {
      // 音频/视频中的当前播放位置（以秒计）
      let currentTime = ref(e.target.currentTime);
      // 获取音频时长
      playedDurationTime.value = String(getDuration(currentTime.value));
      // 计算进度条百分比
      let progressBarWidth = ref(
        calculateProgressBarPercentage(e.target.currentTime, e.target.duration),
      );
      // 设置进度条的value
      inputValue.value = progressBarWidth.value;
      // 设置已播放进度条的长度
      // setProgressBarWidth(progressBarWidth.value);
    }

    /**
     * @param {object} e 鼠标对象
     * @description 进度条输入触发
     */
    function handleInput(e: any, id: number) {
      if (!handleAudioIsPlay()) return false;

      // 设置已播放进度条的长度
      setProgressBarWidth(e.target.value);
      // 设置音频/视频中的当前播放位置（以秒计）
      setAudioDuration(Number(e.target.value));
    }

    /**
     * @param {object} e 鼠标对象
     * @description 进度条输入触发
     */
    function handleInputChange(e: any, id: number) {
      if (!handleAudioIsPlay()) return false;

      // 设置已播放进度条的长度
      setProgressBarWidth(e.target.value);
      // 设置音频/视频中的当前播放位置（以秒计）
      setAudioDuration(Number(e.target.value));
    }

    /**
     * @param {object} e 鼠标对象
     * @description 进度条输入触发
     */
    function handleSliderChange(value: any) {
      // 设置音频/视频中的当前播放位置（以秒计）
      setAudioDuration(Number(value));
    }

    /**
     * @description 设置音频/视频中的当前播放位置（以秒计）
     */
    function setAudioDuration(val: number) {
      // audio对象
      const audio: any = document.getElementById('audio' + props.id);
      // 设置音频/视频中的当前播放位置（以秒计）
      audio.currentTime = (val * duration.value) / 100;
      // 播放录音
      audio.play();
      // "暂停"图标显示
      stop.value = true;
    }

    /**
     * @description 录音的播放和暂停
     */
    function handleAudioPlay() {
      if (!handleAudioIsPlay()) return false;
      stop.value = !stop.value;
      let audio: any = document.getElementById('audio' + props.id);
      if (stop.value) {
        audio.play();
      } else {
        audio.pause();
      }
    }

    /**
     * @param {number} currentDuration 当前已播放的音频时长
     * @param {number} totalDuration 音频总时长
     * @description 计算进度条百分比
     */
    function calculateProgressBarPercentage(currentDuration: number, totalDuration: number) {
      // let per: number = parseInt(String((currentDuration / totalDuration) * 100));
      let per: number = (currentDuration / totalDuration) * 100;
      return per;
    }

    /**
     * @param {number} w 长度
     * @description  设置已播放进度条的长度
     */
    function setProgressBarWidth(w: number) {
      console.log(w)
      // 进度条
      const progress: any = document.getElementsByClassName('audio-progress' + props.id)[0];
      // 已播放的进度条
      const ranProgress: any = document.getElementById('audio-progress_ran_' + props.id);
      // 进度条的长度
      // const progressWidth = (progress.offsetWidth * Number(w)) / 100;
      const progressWidth = (progress.offsetWidth * Number(w)) / 100;
      // 设置已播放的进度条长度
      ranProgress.style.cssText = `width:${progressWidth}px`;
      console.log('宽度', progressWidth);
    }

    /**
     * @param {number} duration 秒
     * @description 根据秒数 获取音频时长（以秒计）
     */
    function getDuration(duration: number) {
      if (duration >= 3600) {
        //小时以上级别
        return String(hour(Math.floor(duration)));
      } else if (duration < 3600) {
        //分钟以下级别
        return String(minute(Math.floor(duration)));
      }
    }

    // ------------- 语音转文字的业务 ------------------
    const showTurnText = ref(false);
    const audioText = ref(''); // 录音转文字结果
    /**
     * @description 语音转文字
     */
    async function handleTurnText() {
      if (props.audioData.recordFile === '') {
        $message.error(`录音不存在`);
        return;
      }
      if (props.audioData.remark !== '') {
        showTurnText.value = true;
        audioText.value = props.audioData.remark;
        // return;
      }
      showTurnText.value = true;
      loading.value = true;
      audioText.value = await allApiRequests(props.audioData.recordFile, props.audioData);
      // 测试数据
      // audioText.value = await allApiRequests('split_test.wav', props.audioData);
      loading.value = false;
      // console.log('结果', audioText.value);
    }
    /**
     * @param {String} id 录音数据id
     * @param {String} data 录音数据
     * @descripttion 更新录音
     */
    function updateRecord(id: string | number, result: string, eventId: string | number) {
      let params = new FormData();
      params.append('id', String(id)); // 当前录音数据id
      params.append('voiceTxt', result); // 转写结果
      params.append('eventId', String(eventId)); // 事件Id
      $http({
        method: 'post',
        service: 'eoc',
        url: '/eos/history/phone/updateCdr',
        contentType: 'application/x-www-from-urlencoded',
        data: params,
      })
        .then((res: any) => {
          if (res.errorcode === 0) {
            emit('update', {
              id: id,
              txt: result,
            });
            $message.info('更新录音成功');
          } else {
            $message.error(`更新录音成功失败，错误代码${res.code}，错误信息：${res.msg}`);
          }
        })
        .catch((error: any) => {
          $message.error(`更新录音成功失败，错误代码${error.code}，错误信息：${error.msg}`);
        });
    }
    /**
     * @param {string} result  录音转文字结果
     * @description 保存录音转文字结果
     */
    function handleSaveAudioText(result: string) {
      // console.log(result);
      updateRecord(props.audioData.id, result, props.audioData.eventId);
    }

    /**
     * @description 关闭语音转文字弹窗
     */
    function handleCloseDialog() {
      showTurnText.value = false;
    }
    /**
     * @param {String} url 录音地址
     * @descripttion 获取文件名字
     */
    function getFileName(url: string) {
      const pos: number = url.lastIndexOf('/');
      const fileName: string = url.substring(pos + 1); // 文件名带后缀
      return fileName;
    }
    /**
     * @description 下载录音
     */
    function handleDownloadAudio() {
      if (props.audioData.recordFile === '') {
        $message.error(`下载失败，录音不存在`);
        return;
      }
      const fileName: string = getFileName(props.audioData.recordFile);
      downloadFile(baseURL + props.audioData.recordFile, fileName);
    }

    /**
     * @param file 下载路径
     * @param fileName
     * @description 下载文件
     */
    function downloadFile(file: string, fileName: string) {
      let url = `${file}`;
      let eleLink: any = document.createElement('a');
      eleLink.download = fileName; // 文件名
      eleLink.href = url;
      eleLink.target = '_blank';
      eleLink.click();
      eleLink.remove();
    }

    onMounted(() => {
      setAudio();
    });

    return {
      handleInputChange,
      stop,
      handleAudioPlay,
      inputValue,
      showTurnText,
      handleTurnText,
      handleCloseDialog,
      timeupdate,
      durationTime,
      playedDurationTime,
      baseURL,
      handleSaveAudioText,
      handleDownloadAudio,
      audioText,
      loading,
      handleInput,
      handleSliderChange
    };
  },
});
</script>

<style lang="scss">
// 进度条滑块的样式
@use './assets/css/inputRange.scss';
@use './assets/css/audio.scss';
</style>
