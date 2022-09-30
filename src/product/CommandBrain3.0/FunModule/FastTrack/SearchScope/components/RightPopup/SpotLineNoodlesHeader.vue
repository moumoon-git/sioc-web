<template>
  <div :class="$style.SpotLineNoodlesHeader">
    <!-- 点线 滑竿 范围数 -->
    <div
      v-if="
        selfModelData.type === 'circular' || selfModelData.type === 'freeLine'
      "
      :class="$style.header"
    >
      <!-- 最小数 -->
      <span>500</span>
      <!-- 滑竿 -->
      <div :class="$style.slider">
        <el-slider
          :min="500"
          :max="sliderMax"
          v-model="sliderVal"
          :show-tooltip="false"
          @change="sliderChange"
        ></el-slider>
      </div>
      <!-- 可编辑的最大数 -->
      <div>
        <input type="text" v-model="sliderVal" @change="sliderChange" />
        <span>米</span>
      </div>
    </div>
    <!-- 面的面积显示 -->
    <div v-if="selfModelData.type === 'rectangle'" :class="$style.acreage">
      检索面积：{{
        selfModelData.address.area ? selfModelData.address.area : ''
      }}
      米
    </div>
    <!-- 点面显示地点 -->
    <div
      v-if="
        selfModelData.type === 'rectangle' || selfModelData.type === 'circular'
      "
      :class="$style.spotNoodlesAddress"
    >
      <!-- <p>中山大学地铁站监控A</p> -->
      <p>
        {{ selfModelData.address.result?.formatted_address }}
      </p>
    </div>
    <!-- 线显示起点和终点 -->
    <div
      v-if="selfModelData.type === 'freeLine' || selfModelData.type === 'lane'"
      :class="$style.startingAndEnd"
    >
      <div>{{ selfModelData?.address?.result?.formatted_address }}</div>
      <div>{{ selfModelData?.endAddress?.result?.formatted_address }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    selfModelData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    // 滑竿的值
    const sliderVal = ref(500);
    // 滑竿的最大值
    const sliderMax = ref(10000);
    const store = useStore(); // 使用vuex
    function sliderChange() {
      if (sliderVal.value > sliderMax.value) {
        sliderMax.value = sliderVal.value;
      }
      context.emit('sliderChange', sliderVal.value);
    }
    watch(
      () => props.selfModelData,
      (newV) => {
        console.log(newV);
        if (newV.r) {
          sliderVal.value = newV.r;
        } else {
          sliderVal.value = 500;
        }
        if (newV.name) {
          store.commit('retrieval/SET_retrievalStartupStatus', false);
        } else {
          store.commit('retrieval/SET_retrievalStartupStatus', true);
        }
      },
    );
    return {
      sliderVal,
      sliderMax,
      sliderChange,
    };
  },
});
</script>

<style lang="scss" module>
.SpotLineNoodlesHeader {
}
.header {
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  align-items: center;
  background: rgba(132, 160, 193, 0.11);
  & > span {
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
    margin-right: 20px;
  }
  & > div:last-child {
    width: 80px;
    background: #141d1f;
    border: 1px solid #01607d;
    display: flex;
    & > input {
      box-sizing: border-box;
      padding-left: 7px;
      width: 60px;
      outline: none;
      border: none;
      background: transparent;
      font-size: 18px;
      font-weight: 400;
      color: #56e9ff;
    }
    & > span {
      font-size: 18px;
      font-weight: 400;
      color: #a6adb4;
    }
  }
}
.slider {
  flex: 1;
  min-width: 200px;
  margin-right: 15px;
  & > div {
    & > div {
      height: 2px;
      background: rgba(216, 216, 216, 0.3)
        linear-gradient(
          270deg,
          rgba(0, 241, 243, 0.3) 0%,
          rgba(0, 118, 204, 0.3) 100%
        );
      & > div {
        &:first-child {
          background: transparent;
        }
        &:last-child {
          top: -17px;
          & > div {
            width: 10px;
            height: 10px;
            background: #32c5ff;
            border: none;
            position: relative;
            &::after {
              box-sizing: border-box;
              content: '';
              width: 18px;
              height: 18px;
              border-radius: 50%;
              position: absolute;
              top: -4px;
              left: -4px;
              border: 1px solid rgba(50, 197, 255, 1);
            }
          }
        }
      }
    }
  }
}
.acreage {
  width: 100%;
  height: 60px;
  line-height: 60px;
  padding-left: 10px;
  box-sizing: border-box;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
}
.spotNoodlesAddress {
  width: 100%;
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(0, 193, 222, 0.3) 0%,
    rgba(24, 38, 50, 0) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 38px;
  box-sizing: border-box;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 13px;
    height: 16px;
    top: 12px;
    left: 19px;
    background: url('../../assets/address.svg') no-repeat;
    background-size: 100% 100%;
  }
  p {
    padding: 0;
    margin: 0;
    &:first-child {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
    }
    // &:last-child {
    //   font-size: 14px;
    //   font-weight: 400;
    //   color: #a4adb5;
    // }
  }
}
.startingAndEnd {
  margin: 10px 0;
  background: linear-gradient(
    90deg,
    rgba(0, 193, 222, 0.3) 0%,
    rgba(24, 38, 50, 0) 100%
  );
  padding: 10px 15px 10px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 108px;
  max-height: 108px;
  & > div {
    // padding-left: 33px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    &::before {
      display: block;
      width: 24px;
      height: 24px;
      min-width: 24px;
      min-height: 24px;
      border-radius: 50%;
      border: 1px solid #fff;
      line-height: 24px;
      text-align: center;
      margin-right: 10px;
    }
    &:first-child {
      margin-bottom: 10px;
      &::before {
        content: '起';
        background: #0bd295;
      }
    }
    &:last-child {
      margin-bottom: 10px;
      &::before {
        content: '终';
        background: #f66e6e;
      }
    }
  }
}
</style>