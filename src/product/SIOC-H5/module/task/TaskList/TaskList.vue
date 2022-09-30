<template>
  <div class="task-list-container">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" />
    <template v-if="!screenVisible&&!searchVisible">
      <van-tabs v-model:active="activeName" @click="onClickTab">
        <van-tab :title="`全部(${taskStatistic.total})`" name="全部"></van-tab>
        <van-tab :title="`执行中(${taskStatistic.handling})`" name="执行中"></van-tab>
        <van-tab :title="`已完成(${taskStatistic.finished})`" name="已完成"></van-tab>
        <van-tab :title="`已取消(${taskStatistic.cancel})`" name="已取消"></van-tab>
        <van-tab :title="`我发布`" name="我发布"></van-tab>
        <!-- <van-tab :title="`全部${taskStatistic.total}`" name="">
          <TaskCard v-model:screenVisible="screenVisible" v-model:searchVisible="searchVisible" v-model:search="search" v-model:startDate="startDate" v-model:endDate="endDate" v-model:taskStatus="taskStatus" v-model:taskType="taskType"/>
        </van-tab>
        <van-tab :title="`执行中${taskStatistic.handling}`" name="434">
          <TaskCard v-model:screenVisible="screenVisible" v-model:searchVisible="searchVisible" v-model:search="search" v-model:startDate="startDate" v-model:endDate="endDate" v-model:taskStatus="taskStatus" v-model:taskType="taskType"/>
        </van-tab>
        <van-tab :title="`已完成${taskStatistic.finished}`" name="435">
          <TaskCard v-model:screenVisible="screenVisible" v-model:searchVisible="searchVisible" v-model:search="search" v-model:startDate="startDate" v-model:endDate="endDate" v-model:taskStatus="taskStatus" v-model:taskType="taskType"/>
        </van-tab>
        <van-tab :title="`已取消${taskStatistic.cancel}`" name="436">
          <TaskCard v-model:screenVisible="screenVisible" v-model:searchVisible="searchVisible" v-model:search="search" v-model:startDate="startDate" v-model:endDate="endDate" v-model:taskStatus="taskStatus" v-model:taskType="taskType"/>
        </van-tab> -->
      </van-tabs>
      <TaskCard v-model:screenVisible="screenVisible" v-model:searchVisible="searchVisible" v-model:search="search" v-model:startDate="startDate" v-model:endDate="endDate" v-model:taskStatus="taskStatus" v-model:taskType="taskType" v-model:activeName="activeName"/>
    </template>
    <!-- tab内容 -->
    <template v-if="screenVisible">
      <TaskScreen v-model:screenVisible="screenVisible" v-model:startDate="startDate" v-model:endDate="endDate" v-model:taskType="taskType" v-model:taskStatus="taskStatus"/>
    </template>
    <template v-if="searchVisible">
      <Search v-model:search="search" v-model:searchVisible="searchVisible"/>
    </template>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import TaskCard from './components/TaskCard.vue';
import TaskScreen from './components/TaskScreen.vue';
import Search from './components/Search.vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';

export default defineComponent({
  name: 'TaskList',
  components: {
    // 任务列表卡片组件
    TaskCard,
    // 筛选组件
    TaskScreen,
    // 搜索组件
    Search,
    // 导航栏
    NavBar,
  },
  setup() {
    // 导航栏配置
    const navBarConfig = {
      title: '任务管理',
      type: !!window?.task?.getIsApp() ? '' : 'left',
      path: !!window?.task?.getIsApp() ? '' : '/HomePage',
    };
    let activeName = ref('');
    // 筛选组件是否可见
    const screenVisible = ref(false);
    // 搜索组件是否可见
    const searchVisible = ref(false);
    // 搜索框内容
    const search = ref('');
    // 开始日期
    const startDate = ref('');
    // 结束日期
    const endDate = ref('');
    // 任务状态
    const taskStatus = ref({id: ''});
    // 任务类型
    const taskType = ref({id:'', value: '全部'});
    // 当前用户的任务统计
    const taskStatistic = ref({
      cancel: 0,
      total: 0,
      handling: 0,
      finished: 0,
    });
    const taskStatusOptions = ref([]);
    // watch(taskStatus, (newValue, oldValue) => {
    //   activeName.value = String(newValue.id);
    // });
    return { activeName, screenVisible, searchVisible, search, startDate, endDate, taskStatus, taskType, taskStatistic, taskStatusOptions, navBarConfig };
  },
  data() {
    return {
    };
  },
  mounted() {
    this.resizeFontSize();
    this.getTaskStatistic();
    this.getTaskStatus();
    window.onresize = () => {
      this.resizeFontSize();
    };
  },
  methods: {
    // tab切换
    onClickTab(name, title) {
      console.log(name, title)
      this.activeName = name;
      console.log('任务状态：', this.taskStatusOptions);
      console.log(this.taskStatusOptions.filter((el) => el.code === 'handling'))
      switch (name) {
        case '执行中':
          this.taskStatus = {id: this.taskStatusOptions.filter((el) => el.code === 'handling')[0].id};
          // this.taskStatus = {id: 434};
          break;
        case '已完成':
          this.taskStatus = {id: this.taskStatusOptions.filter((el) => el.code === 'finished')[0].id};
          // this.taskStatus = {id: 435};
          break;
        case '已取消':
          this.taskStatus = {id: this.taskStatusOptions.filter((el) => el.code === 'cancel')[0].id};
          // this.taskStatus = {id: 436};
          break;
        default:
          this.taskStatus = {id: ''};
      }
    },
    resizeFontSize() {
      //获取根元素
      const docEl = document.documentElement;
      //获取设备宽度
      const clientWidth = docEl.clientWidth;
      // console.log("clientWidth", clientWidth);
      //若未获取到设备宽度，则终止函数执行
      if (!clientWidth) return;
      //计算rem基础配置：设计图以750px为准时，px rem比例为1：100
      const fs = 100 * (clientWidth / 750);
      //为根元素字体赋值
      // docEl.style.fontSize = fs + "px";
    },
    // 获取当前用户的任务统计
    getTaskStatistic() {
      const request = {
        method: 'post',
        url: '/app/task/userTaskStatistic',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {},
      };
      this.$http(request)
        .then((response) => {
          console.log('/app/task/userTaskStatistic', response);
          if (response.errorcode === 0) {
            // this.$notify({
            //   type: 'success',
            //   message: '获取当前用户的任务统计成功',
            // });
            this.taskStatistic = response.data;
          } else {
            this.$notify({
              type: 'danger',
              message: `获取当前用户的任务统计失败，错误代码${response.code}，错误信息：${response.msg}`,
            });
          }
        }).catch((error) => {
          this.$notify({
            type: 'danger',
            message: `获取当前用户的任务统计失败`,
          });
        });
    },
    /**
     * @description 获取任务类型
     */
    getTaskStatus() {
      const request = {
        method: 'post',
        service: 'app',
        url: '/emergency/preparation/dictionary/getByParentCode',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          pcode: 'event_task_status'
        },
      };
      this.$http(request)
        .then((response) => {
          console.log('/emergency/preparation/dictionary/getByParentCode', response);
          if (response.errorcode === 0) {
            this.taskStatusOptions = response.data;
          } else {
            this.$notify({
              type: 'danger',
              message: `获取任务类型失败，错误代码${response.code}，错误信息：${response.msg}`,
            });
          }
        })
    }
  },
});
</script>
<style lang='scss' scoped>
  .task-list-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .van-tabs {
    height: 1rem;
    :deep(.van-tabs__line) {
      background-color: #0091FF;
    }
    :deep(.van-tab) {
      color: #666666;
    }
    :deep(.van-tab--active) {
      color: #333333;
    }
    // height: 100vh;
    background: #F5F5F5;
    :deep(.van-tabs__content) {
      // height: 100%;
    }
    :deep(.van-tab__pane) {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    :deep(.van-tab__text) {
      font-size: 0.28rem !important;
    }
    :deep(.van-tabs__wrap) {
      height: 100%;
    }
    
  }
</style>
