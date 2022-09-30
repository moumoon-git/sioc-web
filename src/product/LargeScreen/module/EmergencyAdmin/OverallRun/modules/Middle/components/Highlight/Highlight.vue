<template>
  <div :class="$style.Highlight">
    <div :class="$style.backgroundImage">
      <div
        v-for="(item, index) in littleBallList"
        :key="index"
        :class="[$style.ball, $style['ball-' + index]]"
      >
        <el-tooltip effect="dark" :content="item.name" placement="top-start">
          <span :class="$style.dec">{{ item.name }}</span>
        </el-tooltip>

        <span>{{ item.num }}</span>
      </div>
      <EmptyHint v-if="!littleBallList.length" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';

export default defineComponent({
  name: 'Highlight',
  components: {
    EmptyHint,
  },
  props: {
    littleBallList: {
      type: Array,
      default: () => [
        {
          name: '安全生产',
          num: 379,
        },
        {
          name: '社会安全',
          num: 253,
        },
        {
          name: '其他事件',
          num: 128,
        },
        {
          name: '地质灾害',
          num: 105,
        },
        {
          name: '交通事故',
          num: 96,
        },
        {
          name: '危房',
          num: 40,
        },
        {
          name: '自然灾害',
          num: 30,
        },
        {
          name: '事故灾难',
          num: 20,
        },
        {
          name: '其他',
          num: 10,
        },
        {
          name: '洪水',
          num: 0,
        },
      ],
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" module>
@keyframes float-cloud {
  0% {
    transform: translate(-50%, -40%);
  }

  33% {
    transform: translate(-75%, -65%);
  }

  66% {
    transform: translate(-50%, -70%);
    animation-timing-function: ease-out;
  }

  100% {
    transform: translate(-40%, -65%);
  }
}
.Highlight {
  padding: 25px 0;
  .backgroundImage {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 489px;
    height: 303px;
    background: url('../../assets/hilghlight-bg.svg');
    .ball {
      display: flex;
      position: absolute;
      left: 50%;
      top: 50%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      cursor: pointer;
      color: var(--text-white);
      transform: translate(-50%, -40%);
      animation: float-cloud 4s linear 0s infinite alternate both;
      .dec {
        display: inline-block;
        overflow: hidden;
        width: 90%;
        text-overflow: ellipsis;
        text-align: center;
        font-size: 12px;
        white-space: nowrap;
      }
      > span:last-child {
        display: inline-block;
        overflow: hidden;
        width: 90%;
        text-overflow: ellipsis;
        text-align: center;
        font-size: 18px;
        white-space: nowrap;
      }
    }
    .ball-0 {
      width: 135px;
      height: 135px;
      background: linear-gradient(129deg, #6cf 0%, #5990ff 100%);
      box-shadow: 0 5px 13px 2px rgba(90, 146, 255, 0.3);
      animation-delay: -0.4s;
      > span:first-child {
        font-size: 22px;
      }
      > span:last-child {
        font-size: 24px;
      }
    }
    .ball-1 {
      left: 32%;
      top: 86%;
      width: 112px;
      height: 112px;
      background: linear-gradient(180deg, #ffadad 0%, #ff6161 100%);
      box-shadow: 0 5px 13px 2px rgba(255, 113, 113, 0.32);
      font-size: 21px;
      animation-delay: -0.2s;
      > span:first-child {
        font-size: 21px;
      }
      > span:last-child {
        font-size: 22px;
      }
    }
    .ball-2 {
      left: 75%;
      top: 52%;
      width: 90px;
      height: 90px;
      background: linear-gradient(135deg, #3bf3a8 0%, #46d0ed 100%);
      box-shadow: 0 4px 4px 0 rgba(67, 218, 217, 0.27);
      font-size: 14px;
      animation-delay: -0.4s;
      > span:first-child {
        font-size: 14px;
      }
    }
    .ball-3 {
      left: 59%;
      top: 10%;
      width: 84px;
      height: 84px;
      background: linear-gradient(360deg, #f6d365 0%, #fda085 100%);
      box-shadow: 0 4px 13px 2px rgba(255, 198, 90, 0.3);
      font-size: 14px;
      animation-delay: -0.2s;
      > span:first-child {
        font-size: 14px;
      }
    }
    .ball-4 {
      left: 82%;
      top: 82%;
      width: 77px;
      height: 77px;
      background: linear-gradient(135deg, #ffa07d 0%, #ff875c 100%);
      box-shadow: 0 5px 13px 2px rgba(255, 147, 108, 0.32);
      font-size: 14px;
      animation-delay: -0.6s;
      > span:first-child {
        font-size: 14px;
      }
    }

    .ball-5 {
      left: 61%;
      top: 86%;
      width: 72px;
      height: 72px;
      background: linear-gradient(129deg, #6cf 0%, #5990ff 100%);
      box-shadow: 0 2px 2px 0 rgba(90, 146, 255, 0.3);
      animation-delay: -0.8s;
    }
    .ball-6 {
      left: 28%;
      top: 31%;
      width: 65px;
      height: 65px;
      background: linear-gradient(190deg, #b8a9ff 0%, #6e84ff 100%);
      box-shadow: 0 3px 8px 2px rgba(90, 146, 255, 0.3);
      animation-delay: -0.6s;
    }
    .ball-7 {
      left: 18%;
      top: 53%;
      width: 60px;
      height: 60px;
      background: linear-gradient(152deg, #8a64fd 0%, #e089ea 100%);
      box-shadow: 0 5px 13px 2px rgba(220, 135, 234, 0.27);
      animation-delay: -0.4s;
    }
    .ball-8 {
      left: 39%;
      top: 13%;
      width: 55px;
      height: 55px;
      background: linear-gradient(129deg, #6cf 0%, #5990ff 100%);
      box-shadow: 0 5px 13px 2px rgba(90, 146, 255, 0.3);
      animation-delay: -0.8s;
    }
    .ball-9 {
      left: 78%;
      top: 18%;
      width: 50px;
      height: 50px;
      background: linear-gradient(129deg, #6cf 0%, #5990ff 100%);
      box-shadow: 0 5px 13px 2px rgba(90, 146, 255, 0.3);
      animation-delay: -0.4s;
    }
  }
}
</style>
