<template>
  <div
    v-if="isHomePage"
    class="flight-Insect"
  >
    <header>
      <div class="detailTopItem">
        起点:花城广场
      </div>
      <div class="detailTopItem">
        终点:广州塔
      </div>
    </header>
    <main @scroll.prevent="handleScroll">
      <LineDetailList />
    </main>
    <footer>
      <div class="footer_l" />
      <div class="footer_r">
        <div class="footer_r-l">
          取消
        </div>
        <div class="footer_r-r">
          确定
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LineDetailList from './LineDetailList/LineDetailList.vue';

export default defineComponent({
  name: 'FlightLine',
  components: {
    LineDetailList,
  },
  props: {
    isHomePage: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style scoped lang="scss">
.flight-Insect {
  height: 100%;
  display: flex;
  flex-direction: column;
  header {
    display: flex;
    flex-direction: column;
    color: #fff;
    width: 380px;
    margin: 0 auto;
    margin-top: 21px;
    .detailTopItem {
      width: 100%;
    }
  }
  main {
    height: 730px;
    width: 389px;
    margin: 0 auto;
  }
  footer {
    width: 100%;
    display: flex;
    color: #fff;
    height: 52px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    .footer_l {
      display: flex;
      align-items: center;
      width: 240px;
      .footer_l_Item {
        min-width: 56px;
        cursor: pointer;
        margin: 0 5px;
      }
    }
    .footer_r {
      display: flex;
      align-items: center;
      .footer_r-r {
        background: #32c5ff;
        border: 0;
      }
      div {
        width: 64px;
        height: 32px;
        border: 1px solid #a6adb4;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
}
</style>
