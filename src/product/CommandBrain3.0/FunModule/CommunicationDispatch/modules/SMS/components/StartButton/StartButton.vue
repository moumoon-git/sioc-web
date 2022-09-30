<template>
  <button
    :class="$style.container"
  >
    发送短信
  </button>
</template>

<style lang="scss" module>
.container {
  display: block;
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  color: #FFF;
  font-size: 16px;
  background: no-repeat bottom 0px right/48px 28px url(./assets/background.svg) #54A0FF;
  cursor: pointer;
  transition: all .3s;
  &:hover {
    filter: brightness(110%);
  }
  &:active {
    filter: brightness(90%);
  }
}
</style>
