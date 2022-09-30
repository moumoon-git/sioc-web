<template>
  <div :class="$style.container">
    <header :class="$style.title">
      <span>{{ title }}</span>
      <span style="margin-left: auto;">
        <slot name="close">
          <button
            :class="$style.close"
            @click="$emit('close')"
          />
        </slot>
      </span>
    </header>
    <main :class="$style.main">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: 'title',
  },
});
defineEmits(['close']);
</script>

<style lang="scss" module>
.container {
  width: 228px;
  background: #141D1F;
  .title {
    height: 36px;
    display: flex;
    padding: 0 10px;
    align-items: center;
    font-weight: 500;
    color: #FFF;
    background: no-repeat center/100% 100% url('./assets/imgs/header-bg.svg');
  }
  .close {
    width: 14px;
    height: 14px;
    border: none;
    outline: none;
    background: rgba(#FFF, .8);
    cursor: pointer;
    vertical-align: middle;
    mask: no-repeat center/100% 100% url('./assets/imgs/close.svg');
    &:hover {
      background: #FFF;
    }
  }
  .main {
    height: 104px;
  }
}
</style>
