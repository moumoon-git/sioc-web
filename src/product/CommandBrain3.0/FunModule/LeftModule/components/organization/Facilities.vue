<template>
  <div :class="$style.facilities">
    <ul
      v-cloak
      v-if="listData?.length"
    >
      <li
        v-for="(item,index) in listData"
        :key="index"
        :style="{'margin-right':((index+1)%4 === 0?'0px':'27px')}"
        :title="item.name"
      >
        <div>{{ item.name }}</div>
        <FloatingPoint
          width="65px"
          :member="item.number"
        />
      </li>
    </ul>
    <EmptyHint v-else />
  </div>
</template>

<script>
import FloatingPoint from '@/product/CommandBrain3.0/Generalparts/left/FloatingPoint/FloatingPoint.vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue';

export default {
  components: {
    FloatingPoint,
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
.facilities>ul{
  display: flex;
  flex-wrap: wrap;
  li{
    display: flex;
    flex-direction: column;
    align-content: center;
    font-size: 14px;
    font-weight: 500;
    color: #FFFFFF;
    margin-top: 10px;
    width: 69px;
    & > div:first-child {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
[v-cloak] { display: none }
</style>
