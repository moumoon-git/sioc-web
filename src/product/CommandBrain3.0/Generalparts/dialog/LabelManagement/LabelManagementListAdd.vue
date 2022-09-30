<template>
  <div class="label-management-list-add">
    <h4>
      新增标签
      <!-- 关闭按钮 -->
      <button @click="$emit('cancel')" />
    </h4>
    <!-- 搜索输入框 -->
    <div class="label-management-list-add__search">
      <input
        v-model="inputValue"
        @input="searchLabel(inputValue)"
      >
      <button
        v-if="inputValue"
        style="right: 30px;"
        @click="handleAddNewLabel"
      />
      <button
        v-if="inputValue"
        @click="inputValue = '';"
      />
      <ul v-if="inputValue && searchLabelResultList?.length">
        <li
          v-for="(result, resultIndex) in searchLabelResultList"
          :key="resultIndex"
          :title="result.name"
          @click="handleAddLabel(result)"
        >
          {{ result.name }}
        </li>
      </ul>
    </div>
    <div class="label-management-list-add__usual">
      <h5>— 常用标签 —</h5>
      <div
        v-for="(commonLabel, commonLabelIndex) in frequentlyUsedLabelList"
        :key="commonLabelIndex"
        @click="handleAddLabel(commonLabel)"
      >
        {{ commonLabel.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  useFrequentlyUsedLabelList,
  useSearchLabel,
  createLabel,
} from './scripts/useLabelServices';
import type { LabelType } from './scripts/useLabelServices';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

export default defineComponent({
  name: 'LabelManagementListAdd',
  props: {
    // 标签类型，对应后端的type
    // 1 - 监控标签
    // 2 - 任务标签
    // 3 - 联系人标签
    type: {
      type: Number as PropType<LabelType>,
      default: 1,
    },
  },
  emits: [
    'cancel',
    'add',
  ],
  setup(props) {
    // 常用标签
    const [frequentlyUsedLabelList, getFrequentlyUsedLabelList] = useFrequentlyUsedLabelList();
    getFrequentlyUsedLabelList(props.type).catch($message.error);

    const [searchLabelResultList, searchLabel] = useSearchLabel(props.type);

    return {
      frequentlyUsedLabelList,
      getFrequentlyUsedLabelList,
      searchLabelResultList,
      searchLabel,
    };
  },
  data() {
    return {
      // 搜索值
      inputValue: '',
    };
  },
  methods: {
    /**
     * 创建新标签
     */
    handleAddNewLabel() {
      let newLabel: any = this.searchLabelResultList.find(
        (result: { name: string }) => result.name === this.inputValue,
      );
      // 搜索结果中不存在新标签，则创建标签
      if (!newLabel) {
        createLabel(this.inputValue, this.type)
          .then(this.handleAddLabel)
          .catch($message.error);
      } else {
        this.handleAddLabel(newLabel);
      }
    },
    /**
     * 添加标签
     */
    handleAddLabel(label: any) {
      this.$emit('add', label);
      this.searchLabelResultList = [];
      this.inputValue = '';
    },
  },
});
</script>

<style lang="scss">
.label-management-list-add {
  // 标题
  & > h4 {
    margin: 0;
    font-size: 16px;
    position: relative;
    & > button {
      border: none;
      outline: none;
      width: 16px;
      height: 16px;
      background: no-repeat center/100% 100% url(./assets/close.svg);
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      &:hover { opacity: .7; }
    }
  }
  // 搜索框
  &__search {
    margin: 10px 0;
    padding: 0 55px 0 10px;
    height: 30px;
    line-height: 30px;
    border: 1px solid rgba(255, 255, 255, .65);
    position: relative;
    &:hover,
    &:focus-within {
      border-color: #00ECFF;
    }
    // 输入框
    & > input {
      width: 100%;
      color: #FFFFFF;
      border: none;
      outline: none;
      background: none;
    }
    // 新增按钮
    & > button {
      background: no-repeat center/100% 100% url(./assets/confirm.svg);
      border: none;
      outline: none;
      width: 14px;
      height: 14px;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      &:hover {
        opacity: .7;
      }
      // 删除按钮
      &:nth-child(3) {
        background-image: url(./assets/cancel.svg);
      }
    }
    & > ul {
      list-style: none;
      position: absolute;
      top: 40px;
      left: 0;
      width: 100%;
      max-height: 260px;
      margin: 0;
      padding: 0;
      background: #000000;
      border: 1px solid rgba(255, 255, 255, .65);
      overflow-y: auto;
      // 滚动条
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #56E9FF;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-corner {
        background: transparent;
      }
      & > li {
        padding: 5px 10px;
        &:not(:last-child) {
          border-bottom: 1px solid rgba(255, 255, 255, .2);
        }
        &:hover {
          color: #56E9FF;
          cursor: pointer;
        }
      }
    }
  }
  // 常用标签
  &__usual {
    // 标题
    & > h5 {
      text-align: center;
      margin: 0 5px;
      font-size: 14px;
    }
    // 标签
    & > div {
      display: inline-block;
      vertical-align: middle;
      height: 24px;
      line-height: 24px;
      padding: 0 16px;
      margin: 5px 5px 0 0;
      font-size: 12px;
      background: rgba(166, 173, 180, .25);
      border-radius: 16px;
      box-shadow: 0px 0px 3px 0px rgba(86, 233, 255, .25) inset;
      position: relative;
      max-width: 100px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        opacity: .7;
      }
      &:nth-child(4n) {
        color: #56E9FF;
      }
      &:nth-child(4n + 1) {
        color: #F2B626;
      }
      &:nth-child(4n + 2) {
        color: #F66E6E;
      }
      &:nth-child(4n + 3) {
        color: #0091FF;
      }
    }
  }
}
</style>
