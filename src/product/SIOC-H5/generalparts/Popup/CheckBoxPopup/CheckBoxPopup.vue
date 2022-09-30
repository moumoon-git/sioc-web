<template>
  <div class="checkbox-popup-container">
    <van-popup v-model:show="show" position="bottom" round :style="{ height: '25%' }">
      <div class="popup__header">
        <Button
          :fontSize="'0.28rem'"
          type="text"
          class="popup__header__left"
          @click="handleCancel()"
        >
          重置
        </Button>
        <span class="popup__header__center">请选择提醒方式</span>
        <Button
          :fontSize="'0.28rem'"
          type="text"
          class="popup__header__right"
          @click="handleConfirm()"
        >
          确定
        </Button>
      </div>
      <div class="popup__body">
        <template v-if="optionNumber === 'single'">
          <div
            v-for="item in options"
            :key="item.id"
            :class="activeId === item.id ? 'type--active' : 'type--default'"
            @click="handleChanged(item)"
          >
            <span class="type--label">{{ item.name }}</span>
            <div v-if="activeId === item.id" class="active-status">
              <img src="./assets/images/gou.svg" alt="" class="active-status-icon" />
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="item in options"
            :key="item.id"
            :class="item.checked ? 'type--active' : 'type--default'"
            @click="handleChanged(item)"
          >
            <span class="type--label">{{ item.name }}</span>
            <div v-if="item.checked" class="active-status">
              <img src="./assets/images/gou.svg" alt="" class="active-status-icon" />
            </div>
          </div>
        </template>
      </div>
    </van-popup>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'CheckBoxPopup',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    confirmText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    optionNumber: {
      type: String,
      default: 'multiple', // multiple(多选) or single(单选)
    },
    //
    //  多选时options结构为
    //    {
    //      id,
    //      name,
    //      checked
    //    }
    //  单选时options结构为
    //    {
    //      id,
    //      name
    //    }
    //
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const activeId = ref();
    const activeItems: any = ref([]);
    const { optionNumber, options } = props;
    /**
     * @description 取消选择
     */
    function handleCancel() {
      emit('cancel');
    }

    /**
     * @description 确定选择
     */
    function handleConfirm() {
      emit('confirm', activeItems);
    }

    /**
     * @description 选择改变时触发
     */
    function handleChanged(item: any) {
      if (optionNumber === 'single') {
        activeId.value = item.id;
        activeItems.value = [item];
      } else {
        item.checked = !item.checked;
        activeItems.value = options.filter((el: any) => el.checked);
      }
      emit('change', activeItems);
    }

    return {
      handleCancel,
      handleConfirm,
      handleChanged,
      activeId,
    };
  },
});
</script>

<style lang="scss">
@use './assets/css/index.scss';
</style>
