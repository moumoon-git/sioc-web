<template>
  <div :class="$style.container">
    <!-- 1. 返回按钮，暂不使用 -->
    <!-- <Button type="back" /> -->
    <!-- 2. 时钟 -->
    <Clock />
    <Weather />
    <!-- 3. 标题 -->
    <Title
      :class="$style.title"
      :title="$store.state.event?.title || ''"
    />
    <!-- 4. 插槽 -->
    <div :class="$style.main">
      <div :class="$style.right">
        <slot name="right" />
      </div>
    </div>
    <!-- 消息弹窗 -->
    <InfoButton ref="InfoButton" />
    <!-- 5. 按钮集 -->
    <div :class="$style.buttonSet">
      <slot name="button">
        <!-- <Button type="book" /> -->
        <Button
          type="info"
          @click.stop="
            $refs.InfoButton
              ? ($refs.InfoButton.isWin = !$refs.InfoButton.isWin)
              : ''
          "
        />
        <Button type="home" @click.stop="gotoSBS"/>
        <Button type="exit" @click.stop="exit()"/>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import Clock from '@/product/CommandBrain3.0/Generalparts/header/Clock/Clock.vue';
import Title from '@/product/CommandBrain3.0/Generalparts/header/Title/Title.vue';
import Button from '@/product/CommandBrain3.0/Generalparts/header/Button/Button.vue';
import Weather from '@/product/CommandBrain3.0/Generalparts/header/Weather/Weather.vue';
import InfoButton from '@/product/CommandBrain3.0/FunModule/MsgDialog/ScaleWin/ScaleWin.vue';

export default defineComponent({
  name: 'MainHeader',
  components: {
    Clock,
    Title,
    Button,
    Weather,
    InfoButton,
  },
  setup() {
    const store = useStore();
    const exit = () => {
      window.close();
    };
    const gotoSBS = () => {
      window.open(`${(window as any).config.loginURL}/#/SecondaryPage`);
    };
    /**
     * 事件变更，设置地图中心点
     * @param eventObj 事件对象
     */
    watch(() => store.state.event, (eventObj: any) => {
      const { longitude, latitude } = eventObj;
      if (longitude && latitude) {
        window.map.setCentent({ longitude, latitude }, 10);
      } else {
        const mapCenter: any = (window as any).config?.mapConfig?.center;
        window.map.setCentent(
          { longitude: mapCenter.longitude, latitude: mapCenter.latitude },
          10,
        );
      }
    });
    return {
      exit,
      gotoSBS,
    }
  },
});
</script>

<style lang="scss" module>
.container {
  z-index: 3;
  background: #141d1f;
  display: flex;
  align-items: center;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  height: 64px;
  .title {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .main {
    flex: 1;
    .right {
      float: right;
    }
  }
  .buttonSet {
    & > * {
      margin: 0 10px;
    }
  }
}
</style>
