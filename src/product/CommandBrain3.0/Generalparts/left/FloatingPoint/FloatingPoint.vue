<template>
  <div
    class="floating_point"
    :style="{'--getWidth':width}"
  >
    <span class="member">{{ member }}</span>
    <div class="point" />
    <div class="point" />
    <div class="point" />
    <div class="point" />
    <div class="point" />
  </div>
</template>
<script>
export default {
  name: 'FloatingPoint',
  props: {
    member: {
      type: Number,
      default: 0,
    },
    width: {
      type: String,
      default: '110px',
    },
  },
};
</script>

<style lang="scss">
  .floating_point {
    width: var(--getWidth);
    height: calc(var(--getWidth)/1.16);
    background:  url('./assets/background.png') no-repeat ;
    background-size: 100% 100%;
    position: relative;
    .member {
        color: #99ffff;
        font-size: calc(var(--getWidth)/3.3);
        position: absolute;
        top: 46%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .point:nth-of-type(1) {
        width: calc(var(--getWidth)/11);
        height: calc(var(--getWidth)/11);
        background: url('./assets/orange_point.svg') no-repeat 0px/calc(var(--getWidth)/11);
        animation: floating_point-1 8441ms infinite;
    }
    @keyframes floating_point-1 {
        0% {
            transform: translate3d(calc(var(--getWidth)/1.4), calc(var(--getWidth)/1.8), 0);
        }
        20% {
            transform: translate3d(calc(var(--getWidth)/1.3), calc(var(--getWidth)/2), 0);
        }
        40% {
            transform: translate3d(calc(var(--getWidth)/1.5), calc(var(--getWidth)/2.5), 0);
        }
        60% {
            transform: translate3d(calc(var(--getWidth)/1.4), calc(var(--getWidth)/3.5), 0);
        }
        80% {
            transform: translate3d(calc(var(--getWidth)/1.3), calc(var(--getWidth)/2.5), 0);
        }
        100% {
            transform: translate3d(calc(var(--getWidth)/1.4), calc(var(--getWidth)/1.8), 0);
        }
    }
    .point:nth-of-type(2) {
        width: calc(var(--getWidth)/10);
        height: calc(var(--getWidth)/10);
        background: url('./assets/blue_point-large.svg') no-repeat 0px/calc(var(--getWidth)/10);
        animation: floating_point-2 7642ms infinite;
    }
    @keyframes floating_point-2 {
        0% {
            transform: translate3d(calc(var(--getWidth)/1.5), calc(var(--getWidth)/1.9), 0);
        }
        20% {
            transform: translate3d(calc(var(--getWidth)/1.6), calc(var(--getWidth)/2.2), 0);
        }
        40% {
            transform: translate3d(calc(var(--getWidth)/1.5), calc(var(--getWidth)/2.5), 0);
        }
        60% {
            transform: translate3d(calc(var(--getWidth)/1.65), calc(var(--getWidth)/3.5), 0);
        }
        80% {
            transform: translate3d(calc(var(--getWidth)/1.4), calc(var(--getWidth)/2.5), 0);
        }
        100% {
            transform: translate3d(calc(var(--getWidth)/1.5), calc(var(--getWidth)/1.9), 0);
        }
    }
    .point:nth-of-type(3) {
        width: calc(var(--getWidth)/11);
        height: calc(var(--getWidth)/11);
        background: url('./assets/blue_point-medium.svg') no-repeat 0px/calc(var(--getWidth)/11);
        animation: floating_point-3 6642ms infinite;
    }
    @keyframes floating_point-3 {
        0% {
            transform: translate3d(calc(var(--getWidth)/5), calc(var(--getWidth)/3), 0);
        }
        20% {
            transform: translate3d(calc(var(--getWidth)/6), calc(var(--getWidth)/3.4), 0);
        }
        40% {
            transform: translate3d(calc(var(--getWidth)/4.5), calc(var(--getWidth)/3.8), 0);
        }
        60% {
            transform: translate3d(calc(var(--getWidth)/7), calc(var(--getWidth)/4.5), 0);
        }
        80% {
            transform: translate3d(calc(var(--getWidth)/6.5), calc(var(--getWidth)/3.3), 0);
        }
        100% {
            transform: translate3d(calc(var(--getWidth)/4), calc(var(--getWidth)/3), 0);
        }
    }
    .point:nth-of-type(4) {
        width: calc(var(--getWidth)/20);
        height: calc(var(--getWidth)/20);
        background: url('./assets/blue_point-mini.svg') no-repeat 0px/calc(var(--getWidth)/20);
        animation: floating_point-4 3642ms infinite;
    }
    @keyframes floating_point-4 {
        0% {
            transform: translate3d(calc(var(--getWidth)/4.0), calc(var(--getWidth)/6), 0);
        }
        20% {
            transform: translate3d(calc(var(--getWidth)/4.4), calc(var(--getWidth)/6.8), 0);
        }
        40% {
            transform: translate3d(calc(var(--getWidth)/4.0), calc(var(--getWidth)/7.2), 0);
        }
        60% {
            transform: translate3d(calc(var(--getWidth)/3.6), calc(var(--getWidth)/8.0), 0);
        }
        80% {
            transform: translate3d(calc(var(--getWidth)/3.8), calc(var(--getWidth)/6.7), 0);
        }
        100% {
            transform: translate3d(calc(var(--getWidth)/4.0), calc(var(--getWidth)/6), 0);
        }
    }
    .point:nth-of-type(5) {
        width: calc(var(--getWidth)/24);
        height: calc(var(--getWidth)/24);
        background: url('./assets/blue_point-small.svg') no-repeat 0px/calc(var(--getWidth)/24);
        animation: floating_point-5 5642ms infinite;
    }
    @keyframes floating_point-5 {
        0% {
            transform: translate3d(calc(var(--getWidth)/1.6), calc(var(--getWidth)/30), 0);
        }
        50% {
            transform: translate3d(calc(var(--getWidth)/1.6), calc(var(--getWidth)/5), 0);
        }
        100% {
            transform: translate3d(calc(var(--getWidth)/1.6), calc(var(--getWidth)/30), 0);
        }
    }
  }
</style>
