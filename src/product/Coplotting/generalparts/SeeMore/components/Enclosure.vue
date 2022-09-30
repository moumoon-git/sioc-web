<template>
  <div :class="[$style.enclosure, enter ? $style.commandBrainEnclosure : '']">
    <!-- 上面的内容，内容过多时进行滚动 -->
    <aside>
      <ul :class="$style.enclosure_Ul">
        <li v-for="(x, i) in visData" :key="i">
          <!-- 显示内容 -->
          <div>
            <!-- xls -->
            <div
              v-if="x.fileSuffix === 'xls' || x.fileSuffix === 'xlsx'"
              :class="$style.xls"
            ></div>
            <!-- doc -->
            <div v-else-if="x.fileSuffix === 'doc'" :class="$style.doc"></div>
            <!-- pptx -->
            <div v-else-if="x.fileSuffix === 'pptx'" :class="$style.pptx"></div>
            <!-- pdf -->
            <div v-else-if="x.fileSuffix === 'pdf'" :class="$style.pdf"></div>
            <span>{{ x.fileName + '.' + x.fileSuffix }}</span>
          </div>
          <!-- 鼠标移上去后显示的内容 -->
          <div>
            <div v-if="enter"></div>
            <el-button type="primary" @click="download(x)">下载</el-button>
          </div>
        </li>
      </ul>
    </aside>
    <!-- 全部下载 -->
    <span @click="downloadAll">全部下载</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import EnclosureScript from './script/EnclosureScript';

export default defineComponent({
  props: {
    visData: {
      type: Array,
      default: () => [],
    },
    enter: {
      type: String,
      // 空是协同标绘中进入， commandBrain 为指挥一张图时进入
      default: '',
    },
  },
  setup(props) {
    const { download, downloadAll } = EnclosureScript(props);

    return {
      download,
      downloadAll,
    };
  },
});
</script>

<style lang="scss" module>
.enclosure {
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  & > aside {
    height: 630px;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
  & > span {
    font-size: 17px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0091ff;
    margin-left: 24px;
    margin-bottom: 22px;
    cursor: pointer;
  }
}
.enclosure_Ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  & > li {
    width: 148px;
    height: 177px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    & > div {
      width: 100%;
      height: 100%;
      &:first-child {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 10px;
        box-sizing: border-box;
        & > div {
          width: 69px;
          height: 84px;
          margin: 18px 0 14px;
        }
        .xls {
          background: url('../assets/xls.svg') no-repeat;
          background-size: 100% 100%;
        }
        .doc {
          background: url('../assets/word.svg') no-repeat;
          background-size: 100% 100%;
        }
        .pptx {
          background: url('../assets/ppt.svg') no-repeat;
          background-size: 100% 100%;
        }
        .pdf {
          background: url('../assets/pdf.svg') no-repeat;
          background-size: 100% 100%;
        }
      }
      &:last-child {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.49);
        display: none;
        & > div {
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(255, 255, 255, 0.15);
          width: 100%;
          height: 100%;
        }
      }
      &:last-child:hover {
        display: flex;
      }
      &:first-child:hover + div {
        display: flex;
      }
    }
  }
}
.commandBrainEnclosure {
  min-height: 580px;
  & > aside {
    height: 520px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }
  .enclosure_Ul {
    & > li {
      width: 120px;
      height: 150px;
      border-radius: 0;
      margin: 0 10px;
      & > div {
        &:first-child {
          & > div {
            width: 55px;
            height: 66px;
          }
          & > span {
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
          }
        }
        &:last-child {
          width: 120px;
          height: 150px;
          background: rgba(0, 193, 222, 0.1);
          border: 1px solid #00c1de;
          box-sizing: border-box;
          & > button {
            padding: 0;
            text-align: center;
            line-height: 24px;
            width: 48px;
            height: 24px;
            background: #00c1de;
            min-height: 0px;
            position: inherit;
            z-index: 9;
          }
        }
        &:last-child:hover div {
          filter: blur(13px);
        }
      }
    }
  }
  & > span {
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: block;
    width: 76px;
    height: 32px;
    background: #00c1de;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    line-height: 32px;
    text-align: center;
  }
}
</style>