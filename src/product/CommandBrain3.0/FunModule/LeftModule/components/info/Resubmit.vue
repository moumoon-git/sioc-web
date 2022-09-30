<template>
  <div :class="$style.resubmit" v-show="resubmitData.reportDescription">
    <div ref="scrollRef" @mouseover="pause = false" @mouseleave="pause = true">
      {{ resubmitData.reportDescription }}
    </div>
    <footer>
      <p><span>报告单位：</span>{{ resubmitData.accidentUnit }}</p>
      <p><span>报告时间：</span>{{ resubmitData.reportTime }}</p>
    </footer>
  </div>
  <div
    :class="$style.resubmit_not_data"
    v-show="!resubmitData.reportDescription"
  >
    <div></div>
    <span>暂无最新续报</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick } from 'vue';

export default defineComponent({
  props: {
    resubmitData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const scrollRef = ref<HTMLElement | null | any>(null);
    const nums = ref<number | any>(0);
    const animationFlag = ref<boolean | any>(true);
    const pause = ref<boolean | any>(true);
    let scrollSetInter: any = null;

    // 查找元素
    function findEl(): void {
      // 有值并且它的滚动距离不为0的时候
      // 或者进行了3次获取了
      if (
        (props.resubmitData.reportDescription &&
          scrollRef.value &&
          scrollRef.value.scrollHeight !== 0 &&
          animationFlag.value) ||
        (nums.value >= 3 && animationFlag.value)
      ) {
        // 这个元素是有高度的
        if (scrollRef.value && scrollRef.value.scrollHeight) {
          if (scrollSetInter) {
            clearInterval(scrollSetInter);
            scrollSetInter = null;
          }
          scrollSetInter = setInterval(() => {
            if (
              scrollRef.value?.scrollHeight - scrollRef.value?.offsetHeight >=
                scrollRef.value?.scrollTop &&
              pause.value
            ) {
              scrollRef.value.scrollTop += 1;
              if (
                scrollRef.value?.scrollTop >=
                scrollRef.value?.scrollHeight - scrollRef.value?.offsetHeight
              ) {
                scrollRef.value.scrollTop = 0;
              }
            }
          }, 100);
        }
        animationFlag.value = false;
        nums.value = 0;
        return;
      } else {
        setTimeout(() => {
          nums.value += 1;
          findEl();
        }, 500);
      }
    }

    onMounted(() => {
      findEl();
    });
    watch(
      () => props.resubmitData,
      () => {
        if (scrollRef.value) {
          scrollRef.value.scrollTop = 0;
        }
        findEl();
      },
    );
    return {
      scrollRef,
      pause,
    };
  },
});
</script>

<style module lang="scss">
.resubmit {
  width: 100%;
  height: 100%;
  padding: 5px 8px 4px 8px;
  box-sizing: border-box;
  background: linear-gradient(
    90deg,
    rgba(0, 193, 222, 0.25) 0%,
    rgba(24, 38, 50, 0) 100%
  );
  & > div {
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    margin-bottom: 10px;
    height: 60%;
    width: 106%;
    overflow: auto;
    padding-right: 6px;
    box-sizing: border-box;
    white-space: pre-wrap;
    /* text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; */
  }
  footer {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
    p {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 20px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        line-height: 20px;
      }
    }
  }
}
.resubmit_not_data {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > div {
    width: 118px;
    height: 92px;
    background: url('../auxiliary/assets/not_data.svg') no-repeat;
    background-size: 100% 100%;
  }
  & > span {
    font-size: 14px;
    font-weight: 500;
    color: #b8c3d9;
  }
}
/* 定义滚动条样式 */
.resubmit > div::-webkit-scrollbar {
  width: 3px;
  height: 5px;
  /* background-color: rgba(100, 104, 105, 1); */
  border-radius: 10px;
}

/*定义滚动条轨道 内阴影+圆角*/
.resubmit > div::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
  border-radius: 10px;
  background-color: rgba(100, 104, 105, 1);
}

/*定义滑块 内阴影+圆角*/
.resubmit > div::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
  background-color: rgba(86, 233, 255, 1);
}
</style>
