<template>
  <!-- 回到上一步箭头 -->
  <div
    :class="$style.headerIcon"
    @click="$emit('goBack')"
  />
  <!-- 头部tab -->
  <header>
    <ReservePlanTab
      @tabClick="tabClick"
    />
  </header>
  <!-- tab切换的所有页面 -->
  <main>
    <component
      :is="activeTab"
      ref="component"
      :is-not-info="false"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReservePlanSceneManager from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanScene/ReservePlanSceneManager/ReservePlanSceneManager.vue'; // 现场指挥部
import ReservePlanTab from './ReservePlanTab/ReservePlanTab.vue'; // 头部tab
import ReservePlanVersionInformation from './ReservePlanVersionInformation/ReservePlanVersionInformation.vue'; // 版本信息
import ReservePlanSpecialItemManager from './ReservePlanSpecialItemManager/ReservePlanSpecialItemManager.vue'; // 专项指挥部
import ReservePlanWarningSign from './ReservePlanWarningSign/ReservePlanWarningSign.vue'; // 预警信号
import ReservePlanRespond from './ReservePlanRespond/ReservePlanRespond.vue'; // 应急响应
import ReservePlanGuarantee from './ReservePlanGuarantee/ReservePlanGuarantee.vue'; // 应急保障

export default defineComponent({
  name: 'ReservePlanInfo',
  components: {
    // 头部tab
    ReservePlanTab,
    // 版本信息
    ReservePlanVersionInformation,
    // 专项指挥部
    ReservePlanSpecialItemManager,
    // 现场指挥部
    ReservePlanSceneManager,
    // 预警信号
    ReservePlanWarningSign,
    // 应急响应
    ReservePlanRespond,
    // 应急保障
    ReservePlanGuarantee,
  },

  emits: ['goBack'],
  data() {
    return {
      tab: 0,
    };
  },
 computed: {
    /**
     * @description 当前激活的弹窗内容模块
     * @return 模块组件名称
     */
    activeTab(): string {
      switch (this.tab) {
        case 1: {
          return 'ReservePlanSpecialItemManager';
        }
        case 2: {
          return 'ReservePlanSceneManager';
        }
        case 3: {
          return 'ReservePlanWarningSign';
        }
        case 4: {
          return 'ReservePlanRespond';
        }
        case 5: {
          return 'ReservePlanGuarantee';
        }
        default: {
          return 'ReservePlanVersionInformation';
        }
      }
    },
  },
  methods: {
    /**
     * @description 切换tab
     */
    tabClick(item:any) {
      this.tab = item;
    },
  },
});
</script>

<style lang="scss" module>
  .headerIcon {
    background: url(../PublicComponents/assets/left.svg) no-repeat;
    background-size: 100%;
    width: 10px;
    height: 17px;
    position: absolute;
    left: 8px;
    top: -33px;
    cursor: pointer;
  }
</style>
