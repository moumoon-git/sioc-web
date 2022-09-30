<template>
  <div :class="$style.EventTotal">
    <div :class="$style['total-img']">
      <div :class="$style['event-wrap']"></div>
      <div :class="$style['event-inner']">
        <div :class="$style['number-box']">
          <vue3-autocounter
            ref="autoCounter"
            :startAmount="0"
            :endAmount="totalData.eventAll"
            :duration="1"
            :autoinit="true"
          />
          <div>突发事件总数</div>
        </div>
      </div>
    </div>

    <div :class="$style.right">
      <ul :class="$style.swiper">
        <li v-for="(item, index) in totalData.list.slice(point, point + 2)" :key="index" :class="$style[eventTotalSlide]">
          <div :class="$style.top">
            <span :class="$style.title">{{ item.name }}</span>
            <div>

              <!-- <vue3-autocounter
                :class="$style.itemTotal"
                :startAmount="0"
                :endAmount="item.num"
                :duration="1"
                :autoinit="true"
              /> -->
              <span :class="$style.itemTotal"> {{item.num}} </span>
              <sub>件</sub>
            </div>
          </div>
          <div :class="$style.bottom" v-if=" item.tbDelta !== undefined">
            <span :class="$style.fontsize">同比：{{ item.tbDelta }}</span>
            <div :class="[$style['arrow-down'], { [$style['arrow-up']]: item.tbDelta > 0 }]"></div>
            <span :class="$style.partition">/</span>
            <span :class="$style.fontsize">环比：{{ item.hbDelta }}</span>
            <div :class="[$style['arrow-down'], { [$style['arrow-up']]: item.hbDelta > 0 }]"></div>
          </div>
        </li>
      </ul>
      <EmptyHint v-if="!totalData.list.length"></EmptyHint>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Vue3Autocounter from '../../../../components/vue3-autocounter/vue3-autocounter.vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';
import useEventTotal from './useEventTotal';

export default defineComponent({
  name: 'EventTotal',
  components: {
    Vue3Autocounter,
    EmptyHint,
  },
  props: {
    totalData: {
      type: Object,
      default: () => ({
        eventAll: 0,
        list: [],
      }),
    },
  },
  setup(props, { expose }) {
    const autoCounter = ref<HTMLElement | any>(null);
    const { point, eventTotalSlide, createSwiper } = useEventTotal();

    const swiper = createSwiper();

    const len = computed(() => !!(props.totalData.list.length % 2) ? props.totalData.list.length + 1 : props.totalData.list.length)

    const updateSwiper = () => {
      point.value = 0
      swiper({defaultLine: 2, length: len.value},
        () => {

          // autoCounter.value?.start();
        },
      );
    };

    expose({

      updateSwiper,
    });

    return {
      point,
      autoCounter,
      updateSwiper,
      eventTotalSlide
    };
  },
});
</script>
<style lang="scss" module>
/* 呼吸效果 */
@keyframes breathing {
	50% {
		opacity: .4;
	}
}
@keyframes clockWise {
	0% {
		transform: rotate(0deg);

		-webkit-transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);

		-webkit-transform: rotate(360deg);
	}
}


.EventTotal {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 0;
	color: var(--text-white);
	.total-img {
		position: relative;
		width: 460px;
		height: 460px;
		zoom: .6;

		justify-self: center;
		.event-wrap {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			width: 100%;
			height: 100%;
			background: url("../../assets/event-wrap.png") no-repeat;
			animation: clockWise 5s infinite linear;
		}

		.event-inner {
			display: flex;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			justify-content: center;
			align-items: center;
			margin: auto;
			width: 100%;
			height: 100%;
			background: url("../../assets/event-inner.png") no-repeat;
			animation: breathing 5s infinite linear;
			.number-box {
				margin-left: 13px;
				width: 172px;
				height: 42%;
				text-align: center;

				> span {
					zoom: 2;
					font-size: 40px;
				}
				> div {
					font-size: 28px;
				}
			}
		}
	}
	.right {
		overflow: hidden;
		width: 270px;
		height: 200px;
		.swiper {
			> li {
        box-sizing: border-box;
				padding: 10px 0;
        min-height: 105px;
        opacity: 1;
        transition: all 1s linear;
				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.title {
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						font-size: 28px;
						color: #acecf9;
					}
					.itemTotal {
						margin-right: 12px;
						line-height: 55px;
						font-family: "DIN";
						font-weight: bold;
						font-size: 45px;
						color: #32c5ff;
					}
					sub {
						font-family: PingFangSC-Semibold, PingFang SC;
						font-size: 26px;
					}
				}
				.bottom {
					display: flex;
					align-items: center;
					.fontsize {
						font-size: 18px;
					}
					.partition {
						margin: 0 25px;
						font-size: 18px;
					}
					.arrow-down {
						margin-left: 5px;
						width: 10px;
						height: 11px;
						background: url("../../assets/arrow-down.svg");
					}
					.arrow-up {
						background: url("../../assets/arrow-up.svg");
					}
				}
			}

      .event-total-slide {
        opacity: 0;
      }
		}
	}
}
</style>


