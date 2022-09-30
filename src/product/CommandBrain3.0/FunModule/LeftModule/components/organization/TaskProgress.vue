<template>
  <div :class="$style.taskProgress">
    <ul v-if="listData?.length">
      <li
        v-for="(item,index) in listData"
        :key="index"
      >
        <span>{{ item.name }}</span>
        <Percentage :value="item.number" />
        <span>{{ item.human }}人 (签到率{{ item.number }}%)</span>
      </li>
    </ul>
    <EmptyHint v-else />
  </div>
</template>

<script lang="ts">
// 进度条
import Percentage from '@/product/CommandBrain3.0/Generalparts/left/Percentage/Percentage.vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';

export default {
  components: {
    Percentage,
    EmptyHint,
  },
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style module lang="scss">
.taskProgress{
  min-height: 151px;
  li{
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    span{
      white-space: nowrap;
      &:first-child{
        width: 70px;
        font-size: 14px;
        color: #FFFFFF;
      }
      &:last-child{
        font-size: 14px;
        color: #56E9FF;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    &>div{
      margin: 0 10px;
      width: 146px;
      min-width: 146px;
    }
  }
}
</style>
