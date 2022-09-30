<template>
  <div :class="$style.Event">
    <ul>
      <li>事件类型：{{ composeData.responseData.typeName }}</li>
      <li>事件等级：{{ eventLevel }}</li>
      <li>事发地点：{{ composeData.responseData.address }}</li>
    </ul>
    <FooterOperation :compose-data="composeData" v-bind="$attrs" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import FooterOperation from '../FooterOperation/FooterOperation.vue';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
    FooterOperation,
  },
  props: {
    visData: {
      type: Object,
      default: () => ({}),
    },
    composeData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const store = useStore();
    console.log(
      '%c [ props ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      props.composeData,
    );
    return {
      eventLevel: store.state.event?.responseLevel || '未设置等级',
    };
  },
});
</script>

<style lang="scss" module>
.Event {
  width: 288px;
  padding: 7px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  ul:first-child {
    width: 100%;
    li {
      width: 100%;
      box-sizing: border-box;
      height: 35px;
      line-height: 35px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  button {
    margin-top: 10px;
    border: 1px solid #00c1de;
    width: 80px;
    height: 32px;
    box-sizing: border-box;
    background: transparent;
    font-size: 14px;
    font-weight: 400;
    color: #00c1de;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
}
</style>
