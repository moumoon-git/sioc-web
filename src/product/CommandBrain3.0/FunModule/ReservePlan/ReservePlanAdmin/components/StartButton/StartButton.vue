<template>
  <button :class="$style.container">
    <div>启动<br>预案</div>
  </button>
</template>

<style lang="scss" module>
.container {
  width: 100px;
  height: 100px;
  position: relative;
  background: none;
  outline: none;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  & > div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(to bottom, #32ACBE, #61EAFF);
    border-radius: 100px;
    width: 72px;
    height: 72px;
    box-shadow: 0 0 20px rgba(63, 146, 213, 0.45);
    color: #FFF;
    font-size: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover::before {
    animation-duration: 1s;
  }
  &:active {
    filter: brightness(110%);
  }
  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: no-repeat center/100% 100% url(./assets/circle.svg);
    border-radius: 100px;
    @keyframes startButtonRotate {
      from { transform: rotate(0); }
      from { transform: rotate(-360deg); }
    }
    animation: startButtonRotate infinite linear 15s;
  }
}
</style>
