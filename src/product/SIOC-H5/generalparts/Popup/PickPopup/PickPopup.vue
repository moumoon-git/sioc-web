<template>
  <div ref="pickPopupRef">
    <van-field
      v-model="value"
      readonly
      clickable
      :label="label"
      :placeholder="placeholder"
      right-icon="arrow-down"
      @click="showPicker = true"
    />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :title="title"
        :columns="columns"
        :columns-field-names="customFieldName"
        :loading="loading"
        :item-height="'1rem'"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject } from 'vue'
export default defineComponent({
  name: 'PickPopup',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 标签
    label: {
      type: String,
      default: ''
    },
    // 占位文字
    placeholder: {
      type: String,
      default: ''
    },
    // 默认的值
    defaultValue: {
      type: String,
      default: ''
    },
    // 下拉框数据
    columns: {
      type: Array,
      default: () => ([])
    },
    // 自定义列的结构
    customFieldName: {
      type: Array,
      default: () => ([])
    }
  },
  emits: {
    cancel: null,
    confirm: null
  },
  setup(props, {emit}) {
    // 显示弹出层-选择框
    const showPicker = ref(false);
    const loading = inject('loading');
    const value = ref('');
    console.log(props.title)
    /**
     * @description 取消选择
     */
    function onCancel() {
      showPicker.value = false
      emit('cancel')
    }
    /**
     * @description 确定选择
     */
    function onConfirm(item: any) {
      showPicker.value = false
      emit('confirm', item)
      console.log(item[item.length - 1].name)
      value.value = item[item.length - 1].name;
    }
    return { 
      showPicker,
      loading,
      value,
      onCancel,
      onConfirm
    }
  }
})
</script>