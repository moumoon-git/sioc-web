<template>
  <!-- 左边模块 -->
  <div
    :class="
      $style.LeftModuleView +
      ' ' +
      (putAwayFlag ? $style.LeftModuleViewHidden : '')
    "
  >
    <!-- 头部按钮 -->
    <TabButton style="margin-bottom: 10px" @tabModule="tabModule" />
    <!-- 主功能 -->
    <main :class="$style.mainView">
      <EventInfo v-if="moduleName === 'eventInfo'" />
      <Organization v-else-if="moduleName === 'organization'" />
      <Auxiliary v-show="moduleName === 'auxiliary'" />
    </main>
    <!-- 收起展开按钮 -->
    <div :class="$style.putAway" @click="putAwayFlagFun">
      <img
        :class="putAwayFlag ? $style.transformImg : ''"
        src="./assets/Shape.png"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 切换按钮
import TabButton from './components/TabButton.vue';
// 事件信息
import EventInfo from './components/EventInfo.vue';
// 组织动态
import Organization from './components/Organization.vue';
// 协同标绘
import Auxiliary from './components/Auxiliary.vue';

export default defineComponent({
  name: 'LeftModuleView',
  components: {
    TabButton,
    EventInfo,
    Organization,
    Auxiliary,
  },
  emits: ['showRightEmit', 'showRightEmitclose'],
  data() {
    return {
      // 收起按钮
      putAwayFlag: false,
      // 根据模块名字加载对应模块
      moduleName: 'eventInfo',
    };
  },
  methods: {
    tabModule(btnData: any) {
      (this as any).moduleName = btnData.type;
      console.log(btnData.type);
      if (btnData.type === 'auxiliary') {
        (this as any).$emit('showRightEmit');
      } else {
        (this as any).$emit('showRightEmitclose');
      }
    },
    /**
     * @desc 展开收起
     * @param {} params
     * @returns {} returns
     */
    putAwayFlagFun() {
      this.putAwayFlag = !this.putAwayFlag;
      if (this.putAwayFlag) {
        (this as any).$store.commit('SET_POSITIONTOLEFT', false);
      } else {
        (this as any).$store.commit('SET_POSITIONTOLEFT', true);
      }
    },
  },
});
</script>

<style module >
.LeftModuleViewHidden {
  margin-left: -410px;
}
.LeftModuleView {
  position: relative;
  transition: all 0.5s;
  z-index: 999;
  width: 400px;
  margin-right: 25px;
}
.putAway {
  cursor: pointer;
  position: absolute;
  bottom: 57px;
  right: -23px;
  width: 23px;
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('./assets/Rectangle.png') no-repeat;
}
.putAway img {
  width: 11px;
  height: 23px;
}
.mainView {
  height: calc(100% - 62px);
  background: rgba(14, 23, 24, 0.8);
  border: 1px solid #00c1de;
}
.transformImg {
  transform: rotate(180deg);
}
</style>
