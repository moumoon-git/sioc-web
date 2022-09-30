<template>
  <div :class="$style.EventDynamic">
    <h1>事件动态</h1>
    <div :class="$style.content">
      <TaskScheduleList :from="`largeScreen`" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TaskScheduleList from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskScheduleList/TaskScheduleList.vue';
 // 任务动态
export default defineComponent({
  components: {
    TaskScheduleList, // 任务动态
  },
});
</script>

<style lang="scss" module>
.EventDynamic {
  & > h1 {
    font-size: 22px;
    font-weight: 500;
    color: #ffffff;
    padding: 0 17px;
    margin: 17px 0 8px 0;
    box-sizing: border-box;
  }
  .content{
    width: 100%;
    height: 975px;
    overflow: hidden;
  }
}
</style>
