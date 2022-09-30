// 巡查模式格子
<template>
  <div
    :class="[$style.modeSquare, $style[`modeSquare--${mode}`]]"
    @click="changeMode(mode)"
  >
    <div :class="[$style.mode, { [$style.active]: mode === modeIsActive }]">
      {{ mode }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance,
} from 'vue';

export default defineComponent({
  components: {
  },
  props: {
    mode: {
      type: Number,
      default: 1,
    },
  },
  emits: ['changeMode'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const modeIsActive = ref(1);
    /**
    * @desc 改变模式
    * @param {
    * mode:轮询模式
    * }
    * @returns {} returns
    */
    const changeMode = (mode: number) => {
      console.log(mode);
      modeIsActive.value = mode;
      emit('changeMode', mode);
    };
    return {
      changeMode,
      modeIsActive,
    };
  },
});
</script>
<style module  lang="scss">
.modeSquare {
  width: 48px;
  height: 48px;
  margin: 0 12px;
  cursor: pointer;
  text-align: center;
  line-height: 48px;
  .mode{
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 48px;
    font-size: 20px;
  }
}
.modeSquare--1 {
  background: url(../assets/mode1.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  &:hover {
    background: url(../assets/mode1a.png) no-repeat;
    background-size: 100% 100%;
  }
  //   .active{
  //     width: 100%;
  //     height: 100%;
  //     background: url(../assets/mode1a.png) no-repeat;
  //   background-size: 100% 100%;
  // }
}
.modeSquare--4 {
  background: url(../assets/mode4.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  &:hover {
    background: url(../assets/mode4a.png) no-repeat;
    background-size: 100% 100%;
  }
  //   .active{
  //     background: url(../assets/mode4a.png) no-repeat;
  //     background-size: 100% 100%;
  // }
}
.modeSquare--6 {
  background: url(../assets/mode6.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  &:hover {
    background: url(../assets/mode6a.png) no-repeat;
    background-size: 100% 100%;
  }
  //   .active{
  //     background: url(../assets/mode6a.png) no-repeat;
  //   background-size: 100% 100%;
  // }
}
.modeSquare--8 {
  background: url(../assets/mode8.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  &:hover {
    background: url(../assets/mode8a.png) no-repeat;
    background-size: 100% 100%;
  }
  //   .active{
  //     width: 100%;
  //     height: 100%;
  //     background: url(../assets/mode8a.png) no-repeat;
  //   background-size: 100% 100%;
  // }
}
.modeSquare--9 {
  background: url(../assets/mode9.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  &:hover {
    background: url(../assets/mode9a.png) no-repeat;
    background-size: 100% 100%;
  }
  //   .active{
  //     width: 100%;
  //     height: 100%;
  //     background: url(../assets/mode9a.png) no-repeat;
  //   background-size: 100% 100%;
  // }
}
.mode {
}
</style>
