<template>
  <header :class="$style.headerStyle">
    <div>应签到单位: {{ all }}</div>
    <div>已签到单位: {{ hasSign }}</div>
    <div>未签到单位: {{ notSign }}</div>
    <div>签到率: {{ signRate }}</div>
    <div>签到总人数: {{ signAll }}</div>
  </header>
  <main :class="$style.scroll">
    <CollapseTemple
      :useHead="false"
      :list="rightList"
    >
      <template #head="{ data }">
        <div style="margin: 9px;">
          <span
            :class="
              (data.signList.length > 0 && data?.groupId) ? $style.sign :
              (data.signList.length === 0 && data?.groupId) ? $style.notSign :
              $style.noGroup
            "
          >
            {{ (data.signList.length > 0 && data?.groupId) ? '已签到' :
              (data.signList.length === 0 && data?.groupId) ? '未签到' :
              '未分组签到人员'
            }}
          </span>
          <span
            v-if="data?.groupId"
            style="margin-left: 10px;"
          >
            单位：{{ data?.name }}
          </span>
          <span :style="data?.groupId ? 'margin-left: 40px;' : 'margin-left: 10px;'">
            人员：{{ data.signList.length }}
          </span>
          <span
            v-if="data?.groupId"
            style="margin-left: 40px;"
          >
            备注：{{ data?.remark || '-' }}
          </span>
        </div>
      </template>
      <template #main="{ data }">
        <div
          v-for="item in data.signList"
          :key="item.id"
          :class="$style.listStyle"
        >
          <!-- 名字 -->
          <div>
            {{ item?.name || '-' }} ({{ `${data?.name || '-'}/${item?.duty || '-'}` }})
            <!-- 打电话 -->
            <img
              src="../../../CommunicationDispatch/modules/Device/assets/phoneActive.svg"
              alt=""
              @click="handlePhone(item)"
            >
          </div>
          <!-- 备注 -->
          <div>
            备注：{{ item?.remark || '-' }}
          </div>
        </div>
      </template>
    </CollapseTemple>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { makePhoneCall } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import CollapseTemple from '../../PublicComponents/CollapseTemple.vue'; // 折叠列表模板

export default defineComponent({
  name: 'RightExpand',
  components: {
    // 折叠列表模板
    CollapseTemple,
  },
  props: {
    rightList: {
      type: Array,
      default: () => [],
    },
    // 应签到单位
    all: {
      type: Number,
      default: 0,
    },
    // 已签到单位
    hasSign: {
      type: Number,
      default: 0,
    },
    // 未签到单位
    notSign: {
      type: Number,
      default: 0,
    },
    // 签到率
    signRate: {
      type: String,
      default: '0%',
    },
    // 签到总人数
    signAll: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const store = useStore(); // 使用vuex
    function handlePhone(item: any) {
      makePhoneCall({
        phone: item.phone,
        type: 1,
        id: item.id,
        name: item.name,
      },
      [{
        key: 'eventId',
        value: store.state.event?.id,
        type: 1,
      }]);
    }
    return {
      handlePhone,
    };
  },
});
</script>

<style lang="scss" module>
  .headerStyle {
    width: 100%;
    height: 52px;
    background: linear-gradient(90deg, rgba(20, 98, 140, 0.35) 0%, rgba(14, 69, 100, 0.35) 35%);
    color: #FFFFFF;
    position: relative;
    div {
      float: left;
      margin: 16px;
    }
  }
  .scroll {
    width: 100%;
    height: 58vh;
    overflow: auto;
    color: #FFFFFF;
    position: relative;
    .sign {
      border-radius: 10px;
      padding: 0px 12px;
      background: #0BD295;
    }
    .notSign {
      border-radius: 10px;
      padding: 0px 12px;
      background: #F66E6E;
    }
    .noGroup {
      border-radius: 10px;
      padding: 0px 12px;
      background: #0091ff;
    }
    .hasCheck {
      color: #0BD295;
      float: right;
      margin: 2px 10px 0px;
    }
    .waitCheck {
      color: #F2B626;
      float: right;
      margin: 2px 10px 0px;
    }
    .notCheck {
      color: #F66E6E;
      float: right;
      margin: 2px 10px 0px;
    }
    .listStyle {
      margin: 0px 0px 0px 9px;
      img {
        cursor: pointer;
      }
    }
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
</style>
