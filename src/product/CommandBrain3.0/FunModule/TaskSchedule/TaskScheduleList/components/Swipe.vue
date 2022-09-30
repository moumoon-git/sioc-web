<template>
  <section :class="$style.Swipe">
    <i
      :class="$style['left-arrow']"
      @click="handleLeftMove"
    />
    <div :class="$style['appAttachment-wrap']" v-viewer ref="appAttachment-wrap" :style="{'--getWidth':getWidth}">
      <template v-for="(item, index) in panoramaArray" :key="index">
        <section
          :class="[$style.appAttachment, selectedIndex === getPosition(index)? $style.selectedIndex:'']"
          :style="{left: getPosition(index)}"
          @click="handleClick(item, index)"
        >
          <i :class="[
            item?.dictionaryType?.code==='image'?$style['image-appAttachment-icon']:'',
            item?.dictionaryType?.code==='file'?$style['file-appAttachment-icon']:'',
            item?.dictionaryType?.code==='video'?$style['video-appAttachment-icon']:'',
           ]"/>
          <div>
            {{`
              ${item?.dictionaryType?.code==='image'?'照片':''}
              ${item?.dictionaryType?.code==='video'?'视频':''}
              ${item?.dictionaryType?.code==='audio'?'音频':''}
              ${item?.dictionaryType?.code==='file'?'文件':''}
            `}}
          </div>
        </section>
      </template>
    </div>
    <i
      :class="$style['right-arrow']"
      @click="handleRightMove"
    />
  </section>
  <LiveMomentDialog ref="LiveMomentDialog" />
</template>

<script>
import { defineComponent } from 'vue';
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
import LiveMomentDialog from '../../LiveMomentDialog/LiveMomentDialog.vue';

export default defineComponent({
  name: 'Swipe',
  components: {
    LiveMomentDialog,
  },
  props: {
    // 轮播图数组
    panoramaArray: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      // 轮播移动的index
      moveIndex: 0,
      // 点击选中图片的index
      selectedIndex: '0px',
      // 每个轮播图片的宽度
      getWidth: '90px',
      // 文件服务器前缀
      baseURL: window.config.baseURL,
      // 地图单个落点
      tempMarker: null,
    };
  },
  watch: {
    panoramaArray (newValue, oldValue) {
      this.$nextTick(() => {
        this.getVarWidth();
      });
    },
  },
  mounted() {
    this.initMarker();
  },
  methods: {
    // 创建地图图层
    initMarker() {
      this.$nextTick(() => {
        window.map.createdMarkCoverage('任务全景落点');
      });
    },
    // 向右滑动
    handleRightMove() {
      if (this.moveIndex === -Math.floor(this.$refs['appAttachment-wrap'].getBoundingClientRect().width / Number(this.getWidth.split('px')[0]) / 2)) {
        const temp = this.panoramaArray.shift();
        this.panoramaArray.push(temp);
      } else {
        this.moveIndex -= 1;
      }
    },
    // 向左滑动
    handleLeftMove() {
      if (this.moveIndex === 0) {
        const temp = this.panoramaArray.pop();
        this.panoramaArray.unshift(temp);
      } else {
        this.moveIndex += 1;
      }
    },
    // 获取图片定位
    getPosition(index) {
      return ((this.moveIndex + index) * Number(this.getWidth.split('px')[0])) + 'px';
    },
    // 点击图片回调函数
    handleClick(item, index) {
      console.log("itemitemitemitem",item)
      this.selectedIndex = this.getPosition(index);
      this.$nextTick(() => {
        this.tempMarker && window.map.removeMark(this.tempMarker);
        window.map.setOneMarker('任务全景落点', {
          longitude: item.appEventTask.longitude, latitude: item.appEventTask.latitude, wd: 40, hg: 40, src: useMapMarker('联系人'),
        },
        {
          click: (el) => {
            console.log("elelelelelel",el,this.panoramaArray)
            const lon = el.object.data.longitude;
            const lat = el.object.data.latitude;
            const tempNode = this.panoramaArray.filter((item) => {
              return item.appEventTask.longitude=== lon && item.appEventTask.latitude === lat })[0];
            this.$refs['LiveMomentDialog'].open(tempNode.marker);
          },
        }).then((res) => {
          this.tempMarker = res;
        });
        window.map.setCentent({
          longitude: item.appEventTask.longitude,
          latitude: item.appEventTask.latitude,
        });
      });
    },
    // 计算每个轮播图片的宽度
    getVarWidth() {
      if (this.panoramaArray.length === 1) {
        this.getWidth = this.$refs['appAttachment-wrap'].getBoundingClientRect().width+'px';
      }
      if (this.panoramaArray.length > 1) {
        this.getWidth = (this.$refs['appAttachment-wrap'].getBoundingClientRect().width / this.panoramaArray.length) * 2+'px';
      }
    },
  },
});
</script>

<style lang="scss" module>
  .Swipe{
    position: relative;
    white-space: nowrap;
    width: 100%;
    .arrow {
      &::after {
        color: #A6ADB4;
        font-size: 25px;
        position: absolute;
        top: 30%;
        cursor: pointer;
      }
    }
    .left-arrow {
      &::after {
        @extend .arrow;
        content: "<";
        left: 2%;
        z-index: 1;
      }
    }
    .right-arrow {
      &::after {
        @extend .arrow;
        content: ">";
        right: 2%;
        z-index: 1;
      }
    }
    .appAttachment-wrap {
      width: 92%;
      height: 90px;
      margin: auto;
      overflow: hidden;
      position: relative;
      border-top: 10px solid rgba(255, 255, 255, 0.1);
      border-bottom: 10px solid rgba(255, 255, 255, 0.1);
      border-left: 20px solid rgba(255, 255, 255, 0.1);
      border-right: 20px solid rgba(255, 255, 255, 0.1);
    }
    .appAttachment {
      width: calc(var(--getWidth));
      height: 90px;
      position: absolute;
      transition: 'all 2s';
      color: #FFFFFF;
      background: rgba(0, 193, 222, 0.06);
      box-shadow: 0px 0px 4px 0px rgba(86, 233, 255, 0.15);
      .base-appAttachment-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        position: absolute;
        left: 50%;
        top: 42%;
        transform: translate(-50%, -50%);
      }
      & .image-appAttachment-icon {
        @extend .base-appAttachment-icon;
        background: url(../assets/imageIcon.svg) no-repeat 0px/20px;
      }
      & .video-appAttachment-icon {
        @extend .base-appAttachment-icon;
        background: url(../assets/videoIcon.svg) no-repeat 0px/20px;
      }
      & .file-appAttachment-icon {
        @extend .base-appAttachment-icon;
        background: url(../assets/fileIcon.svg) no-repeat 0px/20px;
      }
      & div {
        text-align: center;
        position: absolute;
        bottom: 0%;
        width: 100%;
        background: linear-gradient(90deg, #3F949F 0%, #1F3031 100%);
      }
    }
    .selectedIndex {
      border: 2px solid #56E9FF;
      box-sizing: border-box;
    }
  }
</style>
