<template>
  <div>
    <div
      :class="$style.addBtn"
      @click.stop.prevent="handleAdd"
    >
      添加选项
    </div>
    <ul :class="$style.list">
      <li
        v-for="(option, index) in list"
        :key="index"
      >
        <ElInput
          v-model="option.value"
          class="sv-input"
          style="width: calc(100% - 80px);"
        />
        <ButtonSet
          :icon-list="calculateIconList(index)"
          @click="handleOptionClick($event, index)"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ButtonSet from '../../../ButtonSet/ButtonSet.vue';

interface Option {
  value: string,
}

export default defineComponent({
  name: 'OptionList',
  components: {
    ButtonSet,
  },
  setup() {
    const list = ref<Option[]>([]);
    // 点击新增选项
    const handleAdd = () => {
      list.value.push({
        value: '',
      });
    };
    // 选项按钮
    const handleOptionClick = (opt: string, index: number) => {
      switch (opt) {
        case 'delete': {
          list.value.splice(index, 1);
          break;
        }
        case 'up': {
          const tmp = list.value[index].value;
          list.value[index].value = list.value[index - 1].value;
          list.value[index - 1].value = tmp;
          break;
        }
        case 'down': {
          const tmp = list.value[index].value;
          list.value[index].value = list.value[index + 1].value;
          list.value[index + 1].value = tmp;
          break;
        }
        default:
      }
    };
    // 计算对应下标的按钮
    const calculateIconList = (index: number) => {
      if (index === 0) {
        if (list.value.length === 1) {
          return ['delete'];
        }
        return ['down', 'delete'];
      }
      if (index === list.value.length - 1) {
        return ['up', 'delete'];
      }
      return ['up', 'down', 'delete'];
    };
    return {
      list,
      handleAdd,
      handleOptionClick,
      calculateIconList,
    };
  },
});
</script>

<style lang="scss" module>
.addBtn {
  user-select: none;
  margin: 0;
  padding-left: 25px;
  text-align: left;
  height: 30px;
  line-height: 30px;
  background: none;
  border: 1px dashed #9FC8FE;
  border-radius: 3px;
  color: #0091FF;
  cursor: pointer;
  position: relative;
  &:hover {
    border-color: currentColor;
  }
  &:active {
    opacity: .7;
  }
  // 十字
  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 2px;
    background: #0091FF;
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 2px;
    background: #0091FF;
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
  }
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  & > li {
    background: #F1F6FF;
    border-radius: 3px;
    margin-top: 5px;
    padding: 0 10px;
  }
}
</style>
