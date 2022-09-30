<template>
  <ListTemple
    :useList="false"
    :title="'短信内容'"
    :useCount="false"
  >
    <template #headerIcon>
      <img src="../assets/message.svg"
        style="position: relative;
        margin: 13px 0px 0px 10px;
        float: left;"
      >
    </template>
  </ListTemple>
  <textarea
    v-model="content"
    :class="$style.text"
  />
  <Button
    type="ghost"
    style="float: right;margin-right: 10px;margin-top: -30px;"
    @click="reset"
  >
    重置
  </Button>
  <!-- 自定义内容 -->
  <ListTemple
    :useList="false"
    :title="'自定义内容'"
    :useHeaderIcon="false"
    :useCount="false"
  />
  <textarea
    v-model="customContent"
    :class="$style.customMsgContent"
    placeholder="请输入自定义全局短信内容，自定义内容自动附加到所有短信中"
  />
  <!-- 横线 -->
  <div :class="$style.horizonLine" />
  <!-- 插入短信顶部 -->
  <label :class="$style.topSelect">
    <input
      v-model="top"
      type="checkbox"
      @change="insertTop"
    >
    <span></span>
  </label>
  <div :class="$style.topText">
    插入短信顶部
  </div>
  <!-- 竖线 -->
  <div :class="$style.verticalLine" />
  <!-- 插入短信底部 -->
  <label :class="$style.bottomSelect">
    <input
      v-model="bottom"
      type="checkbox"
      @change="insertBottom"
    >
    <span></span>
  </label>
  <div :class="$style.bottomText">
    插入短信底部
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import ListTemple from '../../PublicComponents/ListTemple.vue'; // 列表模板

export default defineComponent({
  name: 'MsgDetail',
  components: {
    // 按钮
    Button,
    // 列表模板
    ListTemple,
  },
  emits: ['reset'],
  data() {
    return {
      content: '', // 短信内容
      customContent: '', // 自定义内容
      top: false,
      bottom: false,
    };
  },
  methods: {
    // 插入自定义内容
    insertTop() {
      if (this.top) {
        this.content = this.customContent + this.content;
      } else {
        this.content = this.content.substr(this.customContent.length, this.content.length);
      }
    },
    insertBottom() {
      if (this.bottom) {
        this.content += this.customContent;
      } else {
        this.content = this.content.substr(0, this.content.length - this.customContent.length);
      }
    },
    // 重置文本为模板
    reset() {
      this.top = false;
      this.bottom = false;
      this.$emit('reset');
    },
  },
});
</script>

<style lang="scss" module>
  .text {
    resize: none;
    border: none;
    box-sizing: border-box;
    outline: none;
    background: transparent;
    color: #FFF;
    width: 100%;
    position: relative;
    height: 50%;
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
  }
  .customMsgContent {
    resize: none;
    border: none;
    box-sizing: border-box;
    outline: none;
    background: transparent;
    color: #FFF;
    width: 100%;
    position: relative;
    height: 31%;
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
  }
  .horizonLine {
    width: 100%;
    height: 1px;
    background: #FFF;
    opacity: 0.15;
    position: absolute;
    bottom: 26px;
  }
  .verticalLine {
    width: 1px;
    height: 13px;
    background: #FFF;
    opacity: 0.15;
    position: absolute;
    bottom: 6px;
    right: 129px;
  }
  .topSelect {
    width: 12px;
    height: 12px;
    background: #FFF;
    position: absolute;
    bottom: 8px;
    right: 235px;
    border-radius: 100%;
    & input[type=checkbox]{
      display: none;
    }
    & input[type=checkbox]:checked + span {
      position: relative;
      background: #00C1DE;
    }
    & input[type=checkbox]:checked + span:after{
      content: "";
      border-radius: 50%;
      position: absolute;
      background: #fff;
      border: #00C1DE solid 4px;
      height: 4px;
      width: 4px;
    }
  }
  .topText {
    position: absolute;
    bottom: 3px;
    right: 144px;
    color: #A6ADB4;
  }
  .bottomSelect {
    width: 12px;
    height: 12px;
    background: #FFF;
    position: absolute;
    bottom: 8px;
    right: 101px;
    border-radius: 100%;
    & input[type=checkbox]{
      display: none;
    }
    & input[type=checkbox]:checked + span {
      position: relative;
      background: #00C1DE;
    }
    & input[type=checkbox]:checked + span:after{
      content: "";
      border-radius: 50%;
      position: absolute;
      background: #fff;
      border: #00C1DE solid 4px;
      height: 4px;
      width: 4px;
    }
  }
  .bottomText {
    position: absolute;
    bottom: 3px;
    right: 10px;
    color: #A6ADB4;
  }
</style>
