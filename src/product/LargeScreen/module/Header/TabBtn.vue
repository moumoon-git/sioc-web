<template>
  <div :class="$style.tabBtn">
    <div
      v-for="(x, i) in btnData"
      :key="i"
      :class="x.active ? $style.tabBtn_active : ''"
      @click="selectBtb(x)"
    >
      {{ x.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const store = useStore(); // 使用vuex
    const btnData = ref<any[]>(
      JSON.parse(JSON.stringify(store.state.btnTab.btnData)),
    );
    // 切换按钮
    function selectBtb(x: any) {
      btnData.value.forEach((e: any) => {
        e.active = false;
      });
      x.active = true;
      store.commit('btnTab/SET_btnData', btnData);
    }
    return {
      btnData,
      selectBtb,
    };
  },
});
</script>

<style lang="scss" module>
.tabBtn {
  display: flex;
  & > div {
    width: 183px;
    height: 67px;
    background: url('./assets/btn_bgr.svg') no-repeat;
    background-size: 100% 100%;
    font-size: 24px;
    font-weight: 400;
    color: #ffffff;
    line-height: 67px;
    text-align: center;
    cursor: pointer;
    margin-left: 26px;
  }
  .tabBtn_active {
    background: url('./assets/btn_bgr_active.svg') no-repeat;
    background-size: 100% 100%;
  }
}
</style>