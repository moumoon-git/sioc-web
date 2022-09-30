<template>
  <div
    :class="$style.container"
    @click.stop
  >
    <input
      v-model="newName"
    >
    <button
      v-if="newName"
      @click="handleConfirm"
    />
    <button @click="handleCancel" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'EditTreeNode',
  props: {
    // 原来的名称
    origin: {
      type: String,
      default: '',
    },
  },
  emits: [
    'confirm',
    'cancel',
  ],
  setup(props, { emit }) {
    const newName = ref<string>(props.origin);
    /**
     * 确认修改
     */
    const handleConfirm = () => {
      if (newName.value === props.origin) {
        emit('cancel');
      } else {
        emit('confirm', newName.value);
      }
    };
    /**
     * 取消修改
     */
    const handleCancel = () => {
      newName.value = props.origin;
      emit('cancel');
    };
    return {
      newName,
      handleConfirm,
      handleCancel,
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
  background: #FFF;
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
