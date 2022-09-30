<template>
  <div class="double-template">
    <CollapsePanel>
      <slot name="left" />
    </CollapsePanel>
    <article class="double-template__right">
      <section class="double-template__right-top">
        <slot name="top" />
      </section>
      <section class="double-template__right-bottom">
        <slot name="right" />
      </section>
    </article>
  </div>
</template>

<script lang="ts" setup>
import CollapsePanel from './components/CollapsePanel/CollapsePanel.vue';
</script>

<style lang="scss" scoped>
.double-template {
  background: #f4f4f4;
  width: 100%;
  height: 100%;
  display: flex;

  &__right {
    flex: 1 1;
    display: flex;
    flex-direction: column;
    width: calc(100% - 310px);
    height: 100%;

    &-bottom {
      flex: 1;
      background: #FFF;
      border-radius: 4px;
      box-shadow: 0px 4px 14px 2px rgb(54 121 225 / 9%);
    }
  }
}
</style>
