<template>
  <span>
    <button
      :class="[
        'visualization-header-button',
        `visualization-header-button--${type}`
      ]"
    >
      <span v-if="Math.abs(number) && type !== 'back'">
        {{ Math.abs(number) > 99 ? '99+' : Math.abs(number) }}
      </span>
    </button>
  </span>
</template>

<script>
export default {
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'info',
    },
    number: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss">
.visualization-header-button {
  width: 20px;
  height: 20px;
  border: none;
  outline: none;
  background: no-repeat center/100% 100% transparent;
  cursor: pointer;
  position: relative;
  vertical-align: top;
  &:active {
    transform: translateY(1px);
  }
  & > span {
    position: absolute;
    background: #F64545;
    display: inline-block;
    height: 14px;
    min-width: 14px;
    line-height: 14px;
    font-size: 10px;
    border-radius: 14px;
    color: #FFFFFF;
    top: -8px;
    right: -8px;
    padding: 0 2px;
    box-sizing: border-box;
  }
  &--info {
    background-image: url(./assets/info.svg);
    &:hover {
      background-image: url(./assets/info_hover.svg);
    }
  }
  &--book {
    background-image: url(./assets/book.svg);
    &:hover {
      background-image: url(./assets/book_hover.svg);
    }
  }
  &--exit {
    background-image: url(./assets/exit.svg);
    &:hover {
      background-image: url(./assets/exit_hover.svg);
    }
  }
  &--home {
    background-image: url(./assets/home.svg);
    &:hover {
      background-image: url(./assets/home_hover.svg);
    }
  }
  &--back {
    background-image: url(./assets/back.svg);
    width: 24px;
    height: 64px;
    &:hover {
      background-image: url(./assets/back_hover.svg);
    }
    &:active {
      transform: translateY(0) rotateY(20deg);
      transition: transform .1s;
      transform-origin: 0;
    }
  }
  &--hide {
    background-image: url(./assets/hide.svg);
    width: 23px;
    height: 92px;
    &:hover {
      background-image: url(./assets/hide_hover.svg);
    }
    &:active {
      transform: translateY(0) rotateY(20deg);
      transition: transform .1s;
      transform-origin: 0;
    }
  }
  &--unhide {
    background-image: url(./assets/unhide.svg);
    width: 23px;
    height: 92px;
    &:hover {
      background-image: url(./assets/unhide_hover.svg);
    }
    &:active {
      transform: translateY(0) rotateY(20deg);
      transition: transform .1s;
      transform-origin: 0;
    }
  }
}
</style>
