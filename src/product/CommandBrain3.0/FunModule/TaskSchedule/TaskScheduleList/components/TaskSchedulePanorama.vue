<template>
  <section :class="$style['task-schedule-panorama']" ref="task-schedule-panorama" @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseout="handleMouseUp">
    <!-- 任务全景顶部动态总数 -->
    <header>
      <span :class="$style['title__sign']" />
      <label :class="$style['title__label']">动态总数：{{ panoramaArray.length }}</label>
      <span
        :class="$style.close"
        @click="closeThat"
      />
    </header>
    <!-- 任务全景主题内容 -->
    <main>
      <div style="display: flex;align-items: center;">
        <div :class="$style['content__checkbox']">
          <input
            type="checkbox"
            class="panorame-checkbox"
            name="appAttachments"
            value="file"
            @click="handleCheck"
          >
          <label>纯文本{{ fileNum }}</label>
        </div>
        <div :class="$style['content__checkbox']">
          <input
            type="checkbox"
            class="panorame-checkbox"
            name="appAttachments"
            value="image"
            @click="handleCheck"
          >
          <label>图片{{ imgNum }}</label>
        </div>
        <div :class="$style['content__checkbox']">
          <input
            type="checkbox"
            class="panorame-checkbox"
            name="appAttachments"
            value="video"
            @click="handleCheck"
          >
          <label>视频{{ videoNum }}</label>
        </div>
        <div :class="$style['content__checkbox']">
          <input
            type="checkbox"
            class="panorame-checkbox"
            name="appAttachments"
            value="audio"
            @click="handleCheck"
          >
          <label>音频{{ audioNum }}</label>
        </div>
      </div>
      <Swipe ref="Swipe" :panorama-array="panoramaArray" />
    </main>
  </section>
</template>

<script>
import { defineComponent } from 'vue';
import Swipe from './Swipe.vue';

export default defineComponent({
  name: 'TaskSchedulePanorama',
  components: {
    // 轮播图组件
    Swipe,
  },
  data() {
    return {
      // 任务全景数组
      panoramaArray: [],
      tempArray: [],
      fileNum: 0,
      imgNum: 0,
      videoNum: 0,
      audioNum: 0,
    };
  },
  computed: {
    getEventId() {
      return this.$store.state.event.id;
    },
  },
  watch: {
    getEventId(newValue, oldValue) {
      this.getMissionPanorama();
    },
  },
  created() {
    this.getMissionPanorama();
  },
  methods: {
    // 获取任务全景数据
    getMissionPanorama() {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/event/task/getEventOverallView',
        params: {
          eventId: this.$store.state.event.id,
          resultType: [],
        },
      };
      this.$http(request).then((response) => {
        console.log('/event/event/task/getEventOverallView', response);
        if (response.errorcode === 0 && response?.data) {
          const tempArray = [];
          Promise.resolve(response.data.forEach((item) => {
            item.appAttachments.forEach((attachmentItem) => {
              attachmentItem.appEventTask = item.appEventTask;
              attachmentItem.marker = item;
              attachmentItem.marker.longitude = attachmentItem.appEventTask.longitude;
              attachmentItem.marker.latitude = attachmentItem.appEventTask.latitude;
              tempArray.push(attachmentItem);
              switch (attachmentItem.dictionaryType.code) {
                case 'file':
                  this.fileNum += 1; break;
                case 'image':
                  this.imgNum += 1; break;
                case 'video':
                  this.videoNum += 1; break;
                case 'audio':
                  this.audioNum += 1; break;
                default:
                  break;
              }
            });
          })).then(() => {
            this.panoramaArray = tempArray;
            this.tempArray = tempArray;
          });
        } else {
          this.$message.error(`获取任务全景数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取任务全景数据失败，错误信息：${error}`);
      });
    },
    // 多选框回调函数
    handleCheck() {
      this.panoramaArray = [];
      Array.from(document.querySelectorAll('.panorame-checkbox[type=\'checkbox\']:checked')).forEach((inputItem) => {
        this.tempArray.forEach((item) => {
          if (item.dictionaryType.code === inputItem.value) {
            this.panoramaArray.push(item);
          }
        });
      });
    },
    // 关闭本身
    closeThat() {
      this.$emit('closePanorama');
    },
    /**
     * 鼠标左键按下，开始拖动
     */
    handleMouseDown(event) {
      const dialog = this.$refs['task-schedule-panorama'];
      dialog.style.left = `${dialog.offsetLeft}px`;
      dialog.style.top = `${dialog.offsetTop}px`;
      dialog.style.cursor = 'move';
      this.divX = dialog.offsetLeft - event.x;
      this.divY = dialog.offsetTop - event.y;
      document.addEventListener('mousemove', this.handleMouseMove, true);
    },
    /**
     * 鼠标左键松开，结束拖动
     */
    handleMouseUp() {
      const dialog = this.$refs['task-schedule-panorama'];
      dialog.style.cursor = 'default';
      document.removeEventListener('mousemove', this.handleMouseMove, true);
    },
    /**
     * 鼠标移动，修改弹窗定位
     */
    handleMouseMove(event) {
      const dialog = this.$refs['task-schedule-panorama'];
      // 限制弹窗极限位置
      let newX = event.x + this.divX;
      if (newX < 0) {
        newX = 0;
      }
      if (newX > document.body.clientWidth - dialog.offsetWidth) {
        // newX = document.body.clientWidth - dialog.offsetWidth;
      }
      let newY = event.y + this.divY;
      if (newY < 0) {
        newY = 0;
      }
      if (newY > document.body.clientHeight - dialog.offsetHeight) {
        newY = document.body.clientHeight - dialog.offsetHeight;
      }
      dialog.style.left = `${newX}px`;
      dialog.style.top = `${newY}px`;
    },
  },
});
</script>

<style lang="scss" module>
  .task-schedule-panorama{
    user-select: none;
    width: 924px;
    position: fixed;
    left: 50%;
    top: 75%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    background: rgba(5, 5, 5, 0.9);
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(166, 173, 180, 0.3);
    & > header {
        margin: 8px 0px;
        &::after{
          width: 98%;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
          display: block;
          content: '';
          margin: auto;
          position: relative;
          top: 8px;
        }
        .title__sign {
          width: 6px;
          height: 15px;
          display: inline-block;
          background: #56E9FF;
          box-shadow: 0px 0px 16px 0px #008CFF;
          border-radius: 2px;
        }
        .title__label {
          font-size: 16px;
          color: #56E9FF;
          margin-left: 8px;
        }
        .close {
          position: absolute;
          right: 1%;
          cursor: pointer;
          &::before{
            content: "\2716";
            width:20px;
            height: 20px;
            color: #FFFFFF;
          }
        }
    }
    // 列表主体
    & > main {
        flex: 1;
        height: calc(100% - 220px);
        overflow: hidden auto;
        // 滚动条
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background: #56E9FF;
          border-radius: 5px;
        }
        &::-webkit-scrollbar-corner {
          background: transparent;
        }
      .content__checkbox {
        display: flex;
        align-items: center;
        margin: 12px;
        label {
          font-size: 14px;
          color: #FFFFFF;
          margin-left: 5px;
        }
        input {
          position: relative;
          &::after {
            position: absolute;
            top: -1.5px;
            left: 0px;
            background: #050505;
            width: 13px;
            height: 13px;
            line-height: 13px;
            text-align: center;
            content: "";
            border-radius: 3px;
            border:1px solid #FFFFFF;
          }
          &:checked::after {
            position: absolute;
            top: -1.5px;
            left: 0px;
            background: #56E9FF;
            font-size: 12px;
            color: #050505;
            width: 13px;
            height: 13px;
            line-height: 13px;
            text-align: center;
            content: "✓";
            border-radius: 3px;
          }
        }
      }
    }
    & > footer {
        height: 137px;
        line-height: 137px;
        text-align: center;
        border-top: 1px solid rgba(84, 88, 96, .64);
    }
  }
</style>
