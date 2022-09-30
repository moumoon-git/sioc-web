<template>
  <div class="scrolldiv">
    <el-slider
      v-model="numberNum"
      :show-tooltip="false"
      @change="getNewData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ProcessScroll',
  props: {
    type: {
      type: String,
      default: () => '',
    },
    seachNum: {
      type: Number,
      default: 0,
    },
  },
  emits: ['change-num-point', 'change-num-line', 'change-num-area'],
setup(props, { emit }) {
    const numberNum = ref(props.seachNum / 100);
    /**
    * @desc 滑动滚动条后触发的事件
    * @param {} params
    * @returns {} returns
    */
    const getNewData = () => {
      console.log(numberNum.value);
    switch (props.type) {
        case 'point':
          emit('change-num-point', numberNum.value);
          break;
        case 'line':
          emit('change-num-line', numberNum.value);
          break;
        case 'area':
          emit('change-num-area', numberNum.value);
          break;
        default:
          break;
      }
    };
    return {
        numberNum,
        getNewData,
    };
},
});
</script>

<style scoped lang="scss">
.scrolldiv {
  width: 100%;
  height: 100%;
  .el-slider{
      height:100%;
      :deep(.el-slider__runway){
          margin: 21px 0;
          background: rgba(216, 216, 216, 0.3)
      linear-gradient(
        270deg,
        rgba(0, 241, 243, 0.3) 0%,
        rgba(0, 118, 204, 0.3) 100%
      );
      height:2px
  }
  :deep(.el-slider__bar){
       background: rgba(216, 216, 216, 0.3)
        linear-gradient(
          270deg,
          rgba(0, 241, 243, 0.3) 0%,
          rgba(0, 118, 204, 0.3) 100%
        );
        height:2px
  }
  :deep(.el-slider__button){
      border-radius: 50%;
      width: 18px;
      height: 18px;
      background: #32c5ff;
      background: url(../assets/scrollPoint.svg) no-repeat;
      border:0
  }
  :deep(.el-slider__button-wrapper){
      top:-17px
  }
  }
}
</style>
