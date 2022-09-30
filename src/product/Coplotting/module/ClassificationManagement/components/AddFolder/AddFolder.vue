<template>
  <div :class="$style.container">
    <input v-model="value">
    <button
      v-if="value"
      @click="handleConfirm"
    />
    <button @click="handleCancel" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AddFolder',
  emits: [
    'cancel',
    'confirm',
  ],
  setup(props, { emit }) {
    const value = ref('');
    const handleCancel = () => {
      value.value = '';
      emit('cancel');
    };
    const handleConfirm = () => {
      if (value.value) {
        emit('confirm', value.value);
        value.value = '';
      }
    };
    return {
      value,
      handleCancel,
      handleConfirm,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  height: 30px;
  border: 1px solid #DDD;
  border-radius: 3px;
  align-items: center;
  padding: 0 10px;
  &:hover,
  &:focus-within {
    border-color: #0091FF;
  }
  & > input {
    border: 0;
    outline: 0;
    flex: 1;
    width: 10%;
  }
  & > button {
    outline: none;
    border: none;
    width: 14px;
    height: 14px;
    cursor: pointer;
    &:hover {
      opacity: .7;
    }
    &:nth-last-child(2) {
      background: no-repeat center/110% 110% url(./assets/tick.svg);
      margin: 0 5px;
    }
    &:last-child {
      background: no-repeat center/90% 90% url(./assets/cross.svg);
    }
  }
}
</style>
