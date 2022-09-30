<template>
  <div
    class="contact-more-button"
    @click.stop="handleClick"
  >
    <slot>
      <button class="contact-more-button__default-button" />
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useContactOperation from '../ContactOperation/useContactOperation';

export default defineComponent({
  name: 'ContactMoreButton',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const handleClick = (ev: MouseEvent) => {
      useContactOperation(
        props.id,
        ev.clientX,
        ev.clientY,
      );
    };

    return {
      handleClick,
    };
  },
});
</script>

<style lang="scss">
.contact-more-button {
  display: inline-flex;
  position: relative;
  align-items: center;
  vertical-align: -2px;
  &__default-button {
    position: relative;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    padding: 0;
    width: 10px;
    height: 14px;
    cursor: pointer;
    background: no-repeat center/100% 100% url(./assets/imgs/triple-dot.svg);
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
