<template>
  <div :class="$style.essentialInfo">
    <!-- 要点 -->
    <ul>
      <li>
        <span>事发时间：</span>
        <div>{{ infoObj.occurTime }}</div>
      </li>
      <li>
        <span>接报时间：</span>
        <div>{{ infoObj.reportTime }}</div>
      </li>
      <li>
        <span>事发类型：</span>
        <div>{{ infoObj.typeName }}</div>
      </li>
      <li>
        <span>事发地点：</span>
        <div>{{ infoObj.address }}</div>
      </li>
    </ul>
    <!-- 主要信息 -->
    <main :class="active ? '' : $style.mainHidden">
      {{ setStr(content) }}
      <span
        v-if="content"
        :class="active ? $style.putAway : ''"
        @click="active = !active"
      >
        {{ active ? '收起' : '展开' }}
      </span>
    </main>
    <!-- 图片视频 这里可能后面要做轮播或者别的方式呈现多文件-->
    <aside :class="$style.essentialInfoAside">
      <!-- 图片 -->
      <ImgVis :data="infoObj?.attachments_image || []" />
      <!-- 文档 -->
      <Txt :data="infoObj?.attachments_word || []" />
    </aside>
  </div>
</template>

<script lang="ts">
import ImgVis from './ImgVis.vue';
import Txt from './Txt.vue';

export default {
  components: {
    ImgVis,
    Txt,
  },
  props: {
    content: {
      type: String,
      default: '',
    },
    infoObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      active: false,
    };
  },
  methods: {
    setStr(str: string) {
      let s: any = str;
      if (!(this as any).active && str.length > 78) {
        s = `${s.substring(0, 78)}......`;
      }
      return s;
    },
  },
};
</script>

<style module lang="scss">
.essentialInfo {
  height: 100%;
  overflow: auto;
  width: 100%;
  box-sizing: border-box;
  padding-right: 9px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      display: flex;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
      }
      div {
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
  main {
    margin-top: 5px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #ffffff;
    position: relative;
    span {
      cursor: pointer;
      position: absolute;
      bottom: 3px;
      right: 18px;
      font-size: 16px;
      color: rgba(0, 236, 255, 1);
    }
    .putAway {
      bottom: -20px;
    }
  }
}
.essentialInfoAside {
  // height: 75px;
  overflow: hidden;
  & > div:first-child {
    margin-bottom: 10px;
  }
}

/* 定义滚动条样式 */
.essentialInfo::-webkit-scrollbar {
  width: 3px;
  height: 5px;
  /* background-color: rgba(100, 104, 105, 1); */
  border-radius: 10px;
}

/*定义滚动条轨道 内阴影+圆角*/
.essentialInfo::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
  border-radius: 10px;
  background-color: rgba(100, 104, 105, 1);
}

/*定义滑块 内阴影+圆角*/
.essentialInfo::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
  background-color: rgba(86, 233, 255, 1);
}
</style>
