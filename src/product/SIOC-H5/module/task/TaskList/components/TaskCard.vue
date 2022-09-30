<template>
  <div class="task-card-container">
    <!-- 搜索框内容 -->
    <header>
      <label @click="$emit('update:screenVisible', true)">筛选</label>
      <van-search
        shape="round"
        v-model="search"
        placeholder="请搜索关键字"
        @click="$emit('update:searchVisible', true)"
      />
      <i class="add-icon" @click="handleAddTask"></i>
    </header>
    <!-- 主体内容 -->
    <main class="task-card-container__body" @scroll="scrollEvent">
      <van-pull-refresh v-model="loading" @refresh="onRefresh">
        <section
          class="task-card"
          v-for="(item, index) in taskList"
          :key="index"
          @click="$router.push({ path: `/TaskDetail/${item.id}` })"
        >
          <div class="task-card-title" :style="item?.labels?.length > 0 ? { paddingLeft:0 } : {}">
            <label
              v-if="item?.labels?.length !== 0"
              :class="item?.labels?.length !== 0 ? 'task-card-title__label' : ''"
              >{{ item?.labels?.[0]?.name }}</label
            >
            <label class="task-card-title__title">{{ item.title }}</label>
            <i
              :class="[
                item.readStatus === 1 ? 'task-card-title__status--read' : '',
                item.readStatus === 0 ? 'task-card-title__status--unread' : '',
              ]"
            />
            <!-- 注释原因：需求908 根据ui图调整样式 -->
            <!-- <i
              :class="[
                item.statusCode === 'handling' ? 'task-card-title__status--executingIcon' : '',
                item.statusCode === 'finished' ? 'task-card-title__status--completedIcon' : '',
                item.statusCode === 'cancel' ? 'task-card-title__status--canceledIcon' : '',
              ]"
            /> -->
          </div>
          <div class="surplus-time" v-if="item?.endTime">
            {{ item.endTime }}
          </div>
          <div class="task-card-content">
            <span v-if="item.statusCode === 'handling'" class="task-card-content__status--executing">执行中</span>
            <span v-if="item.statusCode === 'finished'" class="task-card-content__status--completed">已完成</span>
            <span v-if="item.statusCode === 'cancel'" class="task-card-content__status--canceled">已取消</span>
            {{ item.content }}
          </div>
          <div class="task-card-file">
            <template v-for="(fileItem, fileIndex) in item.appAttachments" :key="fileIndex">
              <!-- 图片 -->
              <img
                v-if="fileItem?.dictionaryType?.code === 'image'"
                :src="baseURL + fileItem.url"
              />
              <!-- 视频 -->
              <div
                v-if="fileItem?.dictionaryType?.code === 'video'"
                class="task-video"
              >
                <i class="icon-video"></i>
                <video
                  :src="baseURL + fileItem.url"
                />
              </div>
              <!-- 音频 -->
              <div v-if="fileItem?.dictionaryType?.code === 'audio'">
                <audio
                  controls
                  style="width: 48%;height: 0.98rem;margin: 0.05rem 0rem;"
                  :src="baseURL + fileItem.url"
                />
                <span>00:15 / 1:30</span>
              </div>
              <!-- 文件 -->
              <div v-if="fileItem?.dictionaryType?.code === 'file'">
                <TaskDocument :file="fileItem" color="#0091FF" style="font-size:0.3rem;" />
              </div>
            </template>
          </div>
          <div class="task-card-location">
            <i class="task-card-location-icon"></i>
            <label class="task-card-location-label">{{ item.address }}</label>
          </div>
          <div class="task-card-date">
            <i class="task-card-date-icon"></i>
            <label class="task-card-date-label">发布时间：{{ item.startTime }}</label>
            <label class="task-card-date-status">{{ item.unreadNum }}</label>
          </div>
        </section>
      </van-pull-refresh>
    </main>
  </div>
</template>

<script>
import { defineComponent, ref, getCurrentInstance } from 'vue';
import TaskDocument from '@/product/SIOC-H5/generalparts/FileExtensionImage/Document.vue';
import $time from '@/product/SIOC-H5/module/task/TaskDetail/assets/js/time.ts';

export default defineComponent({
  name: 'TaskCard',
  components: {
    // 文件组件
    TaskDocument,
  },
  props: {
    // 筛选组件是否可见
    screenVisible: {
      type: Boolean,
      default: false,
    },
    // 搜索组件是否可见
    searchVisible: {
      type: Boolean,
      default: false,
    },
    // 搜索框内容
    search: {
      type: String,
      default: '',
    },
    // 开始日期
    startDate: {
      type: String,
      default: '',
    },
    // 结束日期
    endDate: {
      type: String,
      default: '',
    },
    // 任务状态
    taskStatus: {
      type: Object,
      default: () => ({}),
    },
    // 任务类型
    taskType: {
      type: Object,
      default: () => ({}),
    },
    activeName: {
      type: String,
      default: '',
    },
  },
  emits: ['update:screenVisible', 'update:searchVisible'],
  setup() {
    const internalInstance = getCurrentInstance();
    const { $websocket } = internalInstance?.appContext.config.globalProperties;
    const moment = internalInstance.appContext.config.globalProperties.$moment;
    const taskList = ref([]);
    // 当前页
    const currentPage = ref(1);
    // 每页记录数
    const itemsPerPage = ref(10);
    const loading = ref(false);
    // 文件服务器前缀
    const baseURL = window.config.baseURL;
    // 是否加载了最后一页
    const isLastPage = ref(false);
    // 总页数
    const totalPages = ref(0);
    return { taskList, currentPage, itemsPerPage, moment, loading, baseURL, $websocket, isLastPage, totalPages };
  },
  data() {
    return {};
  },
  watch: {
    taskStatus: {
      handler() {
        this.currentPage = 1;
        this.getTaskList(true);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.getTaskList(true);
    // 这个主题不知道干什么的，先注释掉
    // this.$websocket.connect([
    //   { subscribe: '/topic/phoneHistory/dynamic', callback: this.websocketCallback },
    // ]); // 链接websocket (之后要放到登录成功后连接)
    document.getElementsByClassName('task-card-container__body')[0].addEventListener('scroll', this.scrollEvent);
  },
  methods: {
    /**
     * @description 发布任务
     */
    handleAddTask() {
      // 数据初始化
      this.$store.commit('task/initTaskFormData');
      this.$store.commit('setSearchContactorsPageContactors', []);
      this.$router.push({
        path: '/UpdateTask'
      })
    },
    /**
     * @description 触底加载
     */
    scrollEvent(e) {
      const {scrollHeight, scrollTop, clientHeight} = e.target;
      if(scrollHeight - scrollTop === clientHeight) {
        this.currentPage += 1;
        if (this.currentPage > this.totalPages) {
          this.isLastPage = true;
        }
        if (!this.isLastPage) {
          this.getTaskList(false);
        }
      }
    },
    // 获取任务列表数据
    getTaskList(isRefresh) {
      const request = {
        method: 'post',
        service: 'app',
        url: '/task/getTaskList',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          page: this.currentPage,
          size: this.itemsPerPage,
          startTime: this.startDate
            ? this.moment(this.startDate).format('YYYY-MM-DD HH:mm:ss')
            : '',
          endTime: this.endDate ? this.moment(this.endDate).format('YYYY-MM-DD HH:mm:ss') : '',
          taskType: this.taskType.id ? [this.taskType.id] : [],
          status: this.taskStatus.id ? [this.taskStatus.id] : [],
          keyWord: this.search,
          myPublish: this.activeName === '我发布' ? 1 : '', // 1:查询自己发布的任务, 不传或其他值查全部
        },
      };
      this.$http(request)
        .then(response => {
          console.log('/app/task/getTaskList', response);
          if (response.errorcode === 0 && response?.data?.data) {
            if (isRefresh) {
              // 重新获取数据
              this.isLastPage = false;
              this.taskList = response.data.data.map(item => {
                item.messageId = [];
                if(item.endTime) {
                  item.endTime = this.getSurplusTime(item.endTime);
                }
                return item;
              });
            } else {
              // 触底加载-连接数组
              this.taskList = this.taskList.concat(response.data.data.map(item => {
                item.messageId = [];
                if(item.endTime) {
                  item.endTime = this.getSurplusTime(item.endTime);
                }
                return item;
              }));
            }
            // this.$notify({
            //   type: 'success',
            //   message: '获取任务列表数据成功',
            // });
            this.loading = false;
            this.totalPages = response.data.totalPages;
          } else {
            this.loading = false;
            this.$notify({
              type: 'danger',
              message: `获取任务列表数据失败，错误代码${response.code}，错误信息：${response.msg ||
                response.message}`,
            });
          }
        })
        .catch(error => {
          if (error) {
            this.$notify({
              type: 'danger',
              message: `获取任务列表数据失败`,
            });
          }
        });
    },
    // 获取任务超时或者剩余时间
    getSurplusTime(endTime) {
      // 苹果手机识别时间格式是2021/01/01，所以要把2021-01-01的时间格式转换成2021/01/01
      const seconds = new Date(endTime.replace(/\-/g, "/")).valueOf() / 1000 - new Date().valueOf() / 1000;
      return `${seconds > 0 ? '剩余：' : '已过：'}${$time.setCalculagraph(($time.getTaskDeadline(endTime.replace(/\-/g, "/")).time), '天时分')}`;
      // const day = seconds / 60 / 60 / 24;
      // const hour = (seconds / 60 / 60) % 24;
      // const minute = ((seconds / 60 / 60) % 24) % 1;
      // return `${seconds > 0 ? '剩余：' : '已过：'}${Math.abs(Math.floor(day))}天${Math.abs(
      //   Math.floor(hour),
      // )}时${Math.abs(Math.floor(minute))}分`;
    },
    // 下拉刷新回调函数
    onRefresh() {
      this.currentPage = 1;
      // this.itemsPerPage = String(Number(this.itemsPerPage) + 10);
      this.getTaskList(true);
    },
    /**
     * @description 拿到消息后的回调
     */
    websocketCallback(params) {
      let result = JSON.parse(params.body);
      console.log('获得的数据', result);
      this.taskList.forEach(item => {
        if (result.taskId === item.id) {
          item.messageId.push(result.data.id);
          item.messageId = [...new Set(item.messageId)];
        }
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.task-card-container {
  flex: 1;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  background: #f2f2f2;

  header {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    // height: 8%;
    background: #fff;
    border-top: 0.01rem solid #eeeeee;
    padding: 0.2rem 0.3rem;
    label {
      cursor: pointer;
      font-size: 0.3rem;
      color: #999999;
    }
    .add-icon {
      cursor: pointer;
      width: 0.5rem;
      height: 0.5rem;
      display: inline-block;
      background: url(../assets/addIcon.svg) no-repeat 0rem/0.5rem;
    }
    :deep(.van-search) {
      padding: 0rem;
      // width: 75%;
      margin: 0 0.14rem;
      flex: 1;

      .van-cell__value {
        display: flex;
        font-size: 0.24rem;
      }
      .van-search__content {
        background: #f2f2f2;
      }
      .van-field__control::-webkit-input-placeholder {
        color: #999999;
      }
      .van-search__field {
        height: 0.5rem;
      }
      .van-icon {
        font-size: 0.26rem;
      }
      .van-field__control {
        font-size: 0.24rem;
      }
    }
  }
  main {
    height: 100%;
    overflow: auto;
    flex: 1;
    background: #f2f2f2;
    .task-card {
      width: 95%;
      margin: 0.2rem auto;
      background: #ffffff;
      border-radius: 0.04rem;
      overflow: auto;
      padding: 0.2rem 0rem;
      & > div {
        position: relative;
        padding: 0rem 4%;
        margin: 0.1rem 0rem;
      }
      .task-card-title {
        display: flex;
        align-items: center;
        .task-card-title__label {
          padding: 0.01rem 0.1rem;
          margin-right: 0.1rem;
          height: 0.4rem;
          line-height: 0.4rem;
          background: #E9EDFF;
          border-radius: 0px 0.2rem 0.2rem 0px;
          color: rgba(104, 95, 207, 1);
          font-size: 0.24rem;
        }
        .task-card-title__title {
          color: #333333;
          font-weight: 500;
          font-size: 0.4rem;
        }
        .task-card-title__status {
          width: 0.8rem;
          height: 0.8rem;
          display: inline-block;
          position: absolute;
          right: 0%;
          top: -0.3rem;
        }
        .task-card-title__status--executingIcon {
          @extend .task-card-title__status;
          background: url(../assets/executingIcon.png) no-repeat 0rem/0.8rem;
        }
        .task-card-title__status--completedIcon {
          @extend .task-card-title__status;
          background: url(../assets/completedIcon.png) no-repeat 0rem/0.8rem;
        }
        .task-card-title__status--canceledIcon {
          @extend .task-card-title__status;
          background: url(../assets/canceledIcon.png) no-repeat 0rem/0.8rem;
        }
        .task-card-title__status--read {
          @extend .task-card-title__status;
          background: url(../assets/read.png) no-repeat 0rem/0.8rem;
        }
        .task-card-title__status--unread {
          @extend .task-card-title__status;
          background: url(../assets/unread.svg) no-repeat 0rem/0.8rem;
        }
      }
      .surplus-time {
        color: #f2b626;
      }
      .task-card-content {
        color: #666666;
        font-size: 0.25rem;
        &__status--executing {
          background: #0091FF;
          height: 0.32rem;
          font-size: 0.24rem;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 0.32rem;
          border-radius: 0.24rem;
          padding: 0 0.08rem;
        }
        &__status--completed {
          background: #36D1A1;
          height: 0.32rem;
          font-size: 0.24rem;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 0.32rem;
          border-radius: 0.24rem;
          padding: 0 0.08rem;
        }
        &__status--canceled {
          background: #CCCCCC;
          height: 0.32rem;
          font-size: 0.24rem;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 0.32rem;
          border-radius: 0.24rem;
          padding: 0 0.08rem;
        }
      }
      .task-card-file {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        & > div {
          width: 100%;
        }
        img {
          width: 48%;
          height: 1.76rem;
          margin: 0.05rem 0rem;
          object-fit: cover;
        }
        .task-video {
          width: 48%;
          height: 1.76rem;
          margin: 0.05rem 0rem;
          position: relative;
          border: 1px solid #DDDDDD;
          box-sizing: border-box;
          video {
            width: 100%;
            height: 100%;
          }
          .icon-video {
            width: 0.44rem;
            height: 0.44rem;
            position: absolute;
            right: calc(50% - 0.22rem);
            top: calc(50% - 0.22rem);
            z-index: 1;
            background-image: url('../assets/video.svg');
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }
        .task-card-file__file {
          color: #0091ff;
        }
        :deep(.document-list-layout) {
          .document_name {
            font-size: 0.25rem;
          }
        }
      }
      .task-card-location {
        .task-card-location-icon {
          width: 0.2rem;
          height: 0.2rem;
          display: inline-block;
          background: url(../assets/locationIcon.svg) no-repeat center;
          background-size: 100% 100%;
        }
        .task-card-location-label {
          color: #999999;
          margin-left: 0.05rem;
          font-size: 0.24rem;
        }
      }
      .task-card-date {
        .task-card-date-icon {
          width: 0.2rem;
          height: 0.2rem;
          display: inline-block;
          background: url(../assets/dateIcon.svg) no-repeat center;
          background-size: 100% 100%;
        }
        .task-card-date-label {
          color: #999999;
          margin-left: 0.05rem;
          font-size: 0.24rem;
        }
        .task-card-date-status {
          background: #ff6d49;
          border-radius: 0.17rem;
          padding: 0 0.08rem;
          color: #ffffff;
          white-space: nowrap;
          position: absolute;
          right: 3%;
          top: calc(50% - 0.2rem);
          font-size: 0.24rem;
          height: 0.3rem;
          line-height: 0.3rem;
          &::before {
            content: '最新动态:';
            color: #999999;
            position: absolute;
            left: -1.1rem;
            font-size: 0.24rem;
          }
        }
      }
    }
  }
}
</style>
