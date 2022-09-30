<template>
  <article
    :class="[
      'collapse-panel',
      { 'collapse-panel--collapsed': isCollapse },
    ]"
  >
    <div class="collapse-panel__container">
      <slot />
    </div>
    <button
      class="collapse-panel__trigger"
      @click.stop="toggleCollapse"
    />
  </article>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isCollapse = ref(false);

const toggleCollapse = () => { isCollapse.value = !isCollapse.value; };
</script>

<style lang="scss" scoped>
.collapse-panel {
  flex: 0 0;
  display: inline-block;
  height: 100%;
  margin-right: 10px;
  background: #FFF;
  border-radius: 4px;
  position: relative;
  box-shadow: 0px 4px 14px 2px rgb(54 121 225 / 9%);

  &--collapsed {
    margin-right: 0;
  }

  &--collapsed &__trigger::after {
    transform: rotate(180deg);
  }

  &--collapsed &__container {
    width: 0;
    overflow: hidden;
  }

  &__container {
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 100%;
    transition: width 0.3s ease;
  }

  &__trigger {
    width: 20px;
    height: 70px;
    background: #fff;
    border-top-right-radius: 30px  50px;
    border-bottom-right-radius: 30px 50px;
    box-shadow: 1px 0px 5px rgba(54, 121, 225, 0.15);

    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -20px;
    z-index: 1;

    &:hover::after {
      background: #0091ff;
    }

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      mask: no-repeat url('./assets/imgs/trigger.svg') center/60% 20%;
      background: #B8C9DA;
    }
  }
}
</style>
