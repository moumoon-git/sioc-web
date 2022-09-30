<template>
  <div
    v-if="modelValue"
    :style="{
      '--z-index': zIndex,
    }"
  >
    <div class="visualization-modal-dialog">
      <header>
        <div>
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <button @click="close" />
      </header>
      <main>
        <slot />
      </main>
    </div>
    <div
      class="visualization-modal-dialog__modal"
      @click="close"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ModalDialog',
  props: {
    title: {
      type: String,
      default: 'Custom Title',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 100,
    },
  },
  emits: [
    'close',
    'update:modelValue',
  ],
  methods: {
    /**
     * 关闭弹窗
     */
    close() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss">
.visualization-modal-dialog {
  position: fixed;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  background: #FFF;
  border-radius: 4px;
  z-index: calc(var(--z-index) + 1);
  &__modal {
    background: rgba(0, 0, 0, .5);
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: var(--z-index);
  }
  & > header {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    display: flex;
    align-items: center;
    color: #333;
    font-weight: 400;
    padding: 10px 20px;
    background: #F1F4F6;
    & > div:first-child {
      flex: 1;
      font-size: 16px;
    }
    & > button:last-child {
      background: #85888E;
      mask: no-repeat center/100% url(./assets/close.svg);
      width: 13px;
      height: 13px;
      vertical-align: middle;
      outline: none;
      border: none;
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        background: #0091FF;
      }
    }
  }
}
</style>
