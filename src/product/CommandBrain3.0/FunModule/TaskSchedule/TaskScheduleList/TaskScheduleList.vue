<template>
  <section v-if="isHomePage" :class="$style['task-schedule-list']">
    <!-- 任务调度顶部标题和任务状态 -->
    <header v-if="!(from === `largeScreen`)">
      <TaskScheduleListHeader
        @publishTask="publishTask"
        @taskPanorama="taskPanorama"
        @getRealTimeDynamicList="getRealTimeDynamicList"
        @getTaskList="getTaskList"
      />
    </header>
    <!-- 任务调度主体内容 -->
    <main>
      <!-- 实时动态和任务列表tab -->
      <div
        v-if="!(from === `largeScreen`)"
        style="display: flex; justify-content: space-evenly; height: 6%"
      >
        <div
          :class="[
            isRealTimeDynamic ? $style['task-tab__active'] : $style['task-tab'],
          ]"
          @click="handleClickTab(1)"
        >
          实时动态
        </div>
        <div
          :class="[
            !isRealTimeDynamic
              ? $style['task-tab__active']
              : $style['task-tab'],
          ]"
          @click="handleClickTab(2)"
        >
          任务列表
        </div>
      </div>
      <!-- 搜索框 -->
      <Search
        v-if="!(from === `largeScreen`)"
        v-model="keyword"
        style="margin: 10px auto; width: 86%; height: 6%; display: block"
        placeholder="请输入任务信息关键字检索"
        @change="handleInputChange"
      />
      <div
        v-if="!(from === `largeScreen`)"
        style="margin: 10px auto; display: flex; justify-content: space-evenly"
      >
        <!-- 日期选择器 -->
        <DatePicker
          v-model="startTime"
          placeholder="请选择开始日期"
          @change="handleInputChange"
        />
        <!-- 日期选择器 -->
        <DatePicker
          v-model="endTime"
          placeholder="请选择结束日期"
          @change="handleInputChange"
        />
      </div>
      <!-- 实时动态列表 -->
      <template v-if="isRealTimeDynamic">
        <div
          v-if="realTimeDynamicList?.length"
          :class="$style['task-list-wrap']"
        >
          <section
            v-for="(item, index) in realTimeDynamicList"
            :key="item.id"
            v-loading="isLoading"
            :id="`taskDynamic${item.id}`"
            :class="[$style['task-list'], item.animation || '']"
            :style="{
              background: getBackgroundColor(item?.appEventTask?.endTime),
            }"
            @click="checkoutTaskDetail(item)"
          >
            <div style="display: flex; align-items: center">
              <span :class="$style['list-title__sign']" />
              <label :class="$style['list-title__label']">{{
                item.reportTime
              }}</label>
              <span :class="$style['list-title__division']" />
              <label :class="$style['list-title__label']">{{
                item?.appEventTask?.typeName
              }}</label>
              <i
                v-if="item?.operateTypeName"
                :class="[
                  {
                    [$style['list-title__icon--green']]:
                      item?.operateTypeName?.search('完成') != -1,
                  },
                  {
                    [$style['list-title__icon--blue']]:
                      item?.operateTypeName?.search('发布') != -1,
                  },
                  {
                    [$style['list-title__icon--red']]:
                      item?.operateTypeName?.search('取消') != -1,
                  },
                  {
                    [$style['list-title__icon--yellow']]:
                      item?.operateTypeName?.search('重启') != -1,
                  },
                ]"
              />
            </div>
            <div :class="$style['list-detail']">
              <!-- <i
                :class="[isCollection?$style['list-collection']:$style['list-uncollection']]"
                @click="isCollection=!isCollection"
              /> -->
              <label>任务名称:</label>
              <span>{{ item.appEventTask.title }}</span>
            </div>
            <div :class="$style['list-detail']">
              <label>负责人员:</label>
              <span>{{
                item.contactorTypeCode === 'admin'
                  ? `${item?.user?.name || '暂无数据'}`
                  : `${item?.mailContactorVo?.name || '暂无数据'}(${
                      item?.mailContactorVo?.workUnit || '暂无数据'
                    }/${item?.mailContactorVo?.position || '暂无数据'})`
              }}</span>
              <ContactMoreButton
                v-if="item?.mailContactorVo"
                :id="
                  item?.mailContactorVo?.id ||
                  item?.mailContactorVo?.contactorId
                "
              />
            </div>
            <div :class="$style['dividing-line']" />
            <div :class="$style['list-detail']">
              <span>{{ item.content }}</span>
            </div>
            <div v-viewer @click.stop>
              <template
                v-for="(fileItem, fileIndex) in item.appAttachments"
                :key="fileIndex"
              >
                <!-- 图片 -->
                <img
                  v-if="fileItem?.dictionaryType?.code === 'image'"
                  :class="$style['list-detail__img']"
                  :src="baseURL + fileItem.url"
                />
                <!-- 视频 -->
                <video
                  v-if="fileItem?.dictionaryType?.code === 'video'"
                  width="140"
                  height="80"
                  controls
                  :src="baseURL + fileItem.url"
                />
                <!-- 音频 -->
                <div
                  v-if="fileItem?.dictionaryType?.code === 'audio'"
                  :class="$style['list-detail']"
                >
                  <audio
                    controls
                    style="width: 230px; height: 20px"
                    :src="baseURL + fileItem.url"
                  />
                  <span>00:15 / 1:30</span>
                  <a
                    :class="$style['list-download']"
                    :href="baseURL + fileItem.url"
                    :download="fileItem.title"
                    target="_blank"
                  />
                </div>
                <!-- 文件 -->
                <div
                  v-if="fileItem?.dictionaryType?.code === 'file'"
                  :class="$style['list-detail']"
                >
                  <i :class="$style['list-paper-clip']" />
                  <span>{{ fileItem.title }}</span>
                  <a
                    :class="$style['list-download']"
                    :href="baseURL + fileItem.url"
                    :download="fileItem.title"
                    target="_blank"
                  />
                </div>
              </template>
            </div>
            <div :class="$style['list-detail']">
              <!-- <i
                v-if="item?.appEventTask?.address"
                :class="$style['list-location']"
              />
              <span>{{ item.appEventTask.address }}</span> -->
              <i
                v-if="!!item?.latitude && !!item?.latitude"
                :class="$style['list-location']"
              />
              <span>{{ item.address || '未获取定位信息' }}</span>
            </div>
            <div :class="$style['list-detail']">
              <label
                v-if="getTimeOut(item?.appEventTask?.endTime) === '即将超时'"
                >即将超时:</label
              >
              <label
                v-if="getTimeOut(item?.appEventTask?.endTime) === '任务超时'"
                >任务超时:</label
              >
              <label v-if="getTimeOut(item?.appEventTask?.endTime) === '无时限'"
                >无时限</label
              >
              <span
                v-if="getTimeOut(item?.appEventTask?.endTime) === '即将超时'"
                >剩余{{ getSurplusTime(item?.appEventTask?.endTime) }}</span
              >
              <span
                v-if="getTimeOut(item?.appEventTask?.endTime) === '任务超时'"
                >已超时{{ getSurplusTime(item?.appEventTask?.endTime) }}</span
              >
            </div>
          </section>
          <Pagination
            v-model:currentPage="currentPage"
            :total-items="totalItems"
            @change="getRealTimeDynamicList"
          />
        </div>
        <div v-else :class="$style['noData']">
          <EmptyHint />
        </div>
      </template>
      <!-- 任务列表列表 -->
      <template v-if="!isRealTimeDynamic">
        <div v-if="taskList?.length" :class="$style['task-list-wrap']">
          <section
            v-for="(item, index) in taskList"
            :key="index"
            v-loading="isLoading"
            :class="$style['task-list']"
            :style="{ background: getBackgroundColor(item?.endTime) }"
            @click="checkoutTaskDetail(item)"
          >
            <div
              style="display: flex; align-items: center; white-space: nowrap"
            >
              <span :class="$style['list-title__sign']" />
              <label
                v-if="!item.endTime"
                :class="$style['list-title__label']"
              >无时限</label>
              <template v-else>
                <label
                  v-if="item.statusCode === 'handling'"
                  :class="$style['list-title__label']"
                >
                  {{ calcHandlingTaskTime(item.endTime) }}
                </label>
                <label
                  v-else
                  :class="$style['list-title__label']"
                >
                  {{ calcOtherTaskTime(item.startTime, item.endTime) }}
                </label>
              </template>
              <span :class="$style['list-title__division']" />
              <label :class="$style['list-title__label']">{{
                item.typeName
              }}</label>
              <i
                v-if="item.statusCode === 'handling'"
                :class="$style['live-moment-dialog__status']"
                >执行中</i
              >
              <i
                v-if="item.statusCode === 'finished'"
                :class="[
                  $style['live-moment-dialog__status'],
                  $style['live-moment-dialog__status--complete'],
                ]"
                >已完成</i
              >
              <i
                v-if="item.statusCode === 'cancel'"
                :class="[
                  $style['live-moment-dialog__status'],
                  $style['live-moment-dialog__status--cancel'],
                ]"
                >已取消</i
              >
            </div>
            <div
              :class="[
                $style.noRead,
                { [$style.hasRead]: item.readStatus }
              ]"
            >
              <p>{{ item.readStatus ? '已读' : '未读' }}</p>
            </div>
            <div :class="$style['list-detail']">
              <!-- <i
                :class="[isCollection?$style['list-collection']:$style['list-uncollection']]"
                @click="isCollection=!isCollection"
              /> -->
              <label>任务名称:</label>
              <span>{{ item.title }}</span>
            </div>
            <div :class="$style['dividing-line']" />
            <div :class="$style['list-detail']">
              <span>{{ item.content }}</span>
            </div>
            <div v-viewer @click.stop>
              <template
                v-for="(fileItem, fileIndex) in item.appAttachments"
                :key="fileIndex"
              >
                <!-- 图片 -->
                <img
                  v-if="fileItem?.dictionaryType?.code === 'image'"
                  :class="$style['list-detail__img']"
                  :src="baseURL + fileItem.url"
                />
                <!-- 视频 -->
                <video
                  v-if="fileItem?.dictionaryType?.code === 'video'"
                  width="140"
                  height="80"
                  controls
                  :src="baseURL + fileItem.url"
                />
                <!-- 音频 -->
                <div
                  v-if="fileItem?.dictionaryType?.code === 'audio'"
                  :class="$style['list-detail']"
                >
                  <audio
                    controls
                    style="width: 230px; height: 20px"
                    :src="baseURL + fileItem.url"
                  />
                  <span>00:15 / 1:30</span>
                  <a
                    :class="$style['list-download']"
                    :href="baseURL + fileItem.url"
                    :download="fileItem.title"
                    target="_blank"
                  />
                </div>
                <!-- 文件 -->
                <div
                  v-if="fileItem?.dictionaryType?.code === 'file'"
                  :class="$style['list-detail']"
                >
                  <i :class="$style['list-paper-clip']" />
                  <span>{{ fileItem.title }}</span>
                  <a
                    :class="$style['list-download']"
                    :href="baseURL + fileItem.url"
                    :download="fileItem.title"
                    target="_blank"
                  />
                </div>
              </template>
            </div>
            <div :class="$style['list-detail']">
              <i v-if="item?.address" :class="$style['list-location']" />
              <span>{{ item.address || '未获取定位信息' }}</span>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <template
                v-for="(labelItem, labelIndex) in item.labels"
                :key="labelIndex"
              >
                <i :class="$style['list-label--cyan']">{{ labelItem?.name }}</i>
              </template>
            </div>
          </section>
        </div>
        <div v-else :class="$style['noData']">
          <EmptyHint />
        </div>
      </template>
    </main>
  </section>
  <TaskDetail v-if="!isHomePage" :task-id="taskId" @showDetail="showDetail" />
  <LiveMomentDialog ref="LiveMomentDialog" />
</template>

<script>
import {
  defineComponent,
  inject,
  getCurrentInstance,
  onBeforeUnmount,
} from 'vue';
import Search from '@/product/CommandBrain3.0/Generalparts/right/Search/Search.vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import TaskPublishDialog from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskPublishDialog/TaskPublishDialog.vue';
import TaskDetail from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskDetail/TaskIndexDetail.vue';
import DatePicker from '@/product/CommandBrain3.0/Generalparts/right/DatePicker/DatePicker.vue';
import EmptyHint from '@/product/CommandBrain3.0/Generalparts/left/EmptyHint/EmptyHint.vue'; // 暂无数据提示
import TaskScheduleListHeader from './components/TaskScheduleListHeader.vue';
import Pagination from './components/Pagination.vue';
import LiveMomentDialog from '../LiveMomentDialog/LiveMomentDialog.vue';
import loadSetup from '@/product/CommandBrain3.0/Generalparts/map/MapPopup/TaskDynamicDialog/script/setup.ts';
// import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
import useJumpToTaskDetail from '@/product/CommandBrain3.0/FunModule/NotificationCenter/hooks/useJumpToTaskDetail';

export default defineComponent({
  name: 'TaskScheduleList',
  components: {
    // 顶部标题栏组件
    TaskScheduleListHeader,
    // 输入框组件
    Search,
    // 联系人更多操作按钮
    ContactMoreButton,
    // 任务详情
    TaskDetail,
    // 分页组件
    Pagination,
    // 日期选择器
    DatePicker,
    // 实时动态弹窗
    LiveMomentDialog,
    // 暂无数据
    EmptyHint,
  },
  inject: ['$addDialog'],
  props: {
    // 判断是哪里引用的任务列表
    from: {
      type: String,
      default: '',
    },
  },
  emits: ['publishTask', 'transmitTaskPanorama'],
  setup() {
    const reservePlanTask = inject('reservePlanTask');
    const { setDynamicData } = loadSetup();

    /**
     * 获取组件实例，通知弹窗可以跳转过来
     */
    useJumpToTaskDetail();

    /**
     * @param {object} item 任务动态信息
     * @description 显示任务动态弹窗
     */
    function showTaskDynamicDialog(item) {
      let Taskdynamic = {};
      Taskdynamic.data = { ...item };
      Taskdynamic.taskId = this.taskId;
      Taskdynamic.eventId = this.nowEventId;
      setDynamicData(Taskdynamic, false);
    }

    const instance = getCurrentInstance();
    const { $ws } = instance.appContext.config.globalProperties;
    // 事件任务状态变更，刷新数据
    const uns = $ws.subscribe(
      `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
      (msg) => {
        if (msg?.msgType === 60005) {
          instance.proxy.getTaskList();
        }
      },
    );
    onBeforeUnmount(uns);

    return {
      reservePlanTask,
      showTaskDynamicDialog,
    };
  },
  data() {
    return {
      // 搜索框关键词
      keyword: '',
      // 是否实时动态
      isRealTimeDynamic: false,
      // 是否已收藏
      isCollection: false,
      // 加载中
      isLoading: false,
      // 实时动态列表
      realTimeDynamicList: [],
      // 任务列表
      taskList: [],
      isHomePage: true,
      taskId: 0, // 当前点击查看的任务id
      // 文件服务器前缀
      baseURL: window.config.baseURL,
      currentPage: '1',
      totalItems: '0',
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',
      // 地图单个落点
      tempMarker: null,
      // 任务类型id
      typeId: '',
      unConnectWebsocket: null,
    };
  },
  computed: {
    nowEventId() {
      return this.$store.state.event?.id;
    },
  },
  watch: {
    nowEventId: {
      handler(val) {
        this.getRealTimeDynamicList();
        this.getTaskList();
        this.initMarker();
      },
      deep: true,
      immediate: false,
    },
    taskId: {
      handler(val) {
        this.initMarker();
      },
      deep: true,
      immediate: true,
    },
    isRealTimeDynamic: {
      handler(val) {
        if (val) {
          this.realTimeDynamicList = this.realTimeDynamicList.map((item) => {
            item.animation = '';
            return item;
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    if (this.from !== 'largeScreen') {
      this.getRealTimeDynamicList();
      this.getTaskList();
      this.initMarker();
    }
    // WebSocket链接
    this.websocketConnect();
  },
  beforeUnmount() {
    this.unConnectWebsocket();
  },

  methods: {
    /**
     * @description WebSocket链接
     */
    websocketConnect() {
      this.unConnectWebsocket = this.$ws.subscribe(
        `/topic/eventTask/dynamic`,
        (msg, result) => {
          this.websocketCallback(result);
        },
      );
    },

    /**
     * @param {object} res websocket消息
     * @description 获取websocket的回调消息
     */
    websocketCallback(res) {
      const result = JSON.parse(res.body);
      console.log('websocket消息：', result);
      // this.getRealTimeDynamicList();
      this.getDynamicData(result);
    },

    /**
     * @param {object} result websocket消息
     * @description 设置任务动态数据
     */
    getDynamicData(result) {
      // 判断事件id
      if (result.eventId === this.$store.state.event?.id) {
        // 查重
        if (
          this.realTimeDynamicList.filter((item) => item.id === result.data.id)
            .length === 0
        ) {
          let dynamic = { ...result.data };
          this.realTimeDynamicList.unshift(dynamic);
          this.totalItems += 1;
          this.getAnimation(dynamic).then((res) => {
            dynamic.animation = res;
            this.realTimeDynamicList.unshift(dynamic);
            // 去重
            this.realTimeDynamicList = [...new Set(this.realTimeDynamicList)];
            this.totalItems += 1;
          });
        }
      }
    },

    /**
     * @param {object} item 任务动态信息
     * @description 实时动态,获取动画
     */
    getAnimation(item) {
      return new Promise((resolve) => {
        let className = '';
        const seconds =
          new Date(item?.appEventTask?.endTime).valueOf() / 1000 -
          new Date().valueOf() / 1000;
        const day = seconds / 60 / 60 / 24;
        if (seconds < 0) {
          className = 'animation1';
        } else if (day < 1) {
          className = 'animation2';
        } else {
          className = 'animation3';
        }
        resolve(className);
      });
    },

    // 点击跳转任务详情
    checkoutTaskDetail(item) {
      console.log('点击任务 item', item);
      if (this.isRealTimeDynamic) {
        this.taskId = item.appEventTask.id;
        // 点击实时动态，在地图上显示落点和弹窗
        if (!!item.latitude && !!item.longitude) {
          this.showTaskDynamicDialog(item);
        }
      } else {
        this.taskId = item.id;
      }
      if (this.from === 'largeScreen') {
        this.isHomePage = true;
      } else {
        this.isHomePage = false;
      }
      this.$nextTick(() => {
        item.longitude = item?.appEventTask?.longitude ?? item.longitude;
        item.latitude = item?.appEventTask?.latitude ?? item.latitude;
        if (!item.longitude && !item.latitude) {
          this.$message.error('该任务没有经纬度坐标');
          return false;
        }
        this.tempMarker && window.map.removeMark(this.tempMarker);
        window.map
          .setOneMarker(
            '任务调度落点',
            {
              longitude: item.longitude,
              latitude: item.latitude,
              wd: 40,
              hg: 40,
              src: useMapMarker('联系人'),
            },
            {
              click: (el) => {
                // console.log('elelelelelel', el);
                const lon = el.object.data.longitude;
                const lat = el.object.data.latitude;
                if (this.isRealTimeDynamic) {
                  const tempNode = this.realTimeDynamicList.filter(
                    (item) =>
                      item.appEventTask.longitude === lon &&
                      item.appEventTask.latitude === lat,
                  )[0];
                  this.$refs.LiveMomentDialog.open(tempNode);
                } else {
                  const tempNode = this.taskList.filter(
                    (item) => item.longitude === lon && item.latitude === lat,
                  )[0];
                  const mapDialogInstance = this.$mapDialog({
                    modle: 'task_1',
                  });
                  mapDialogInstance.open({
                    responseData: tempNode,
                  });
                }
              },
            },
          )
          .then((res) => {
            this.tempMarker = res;
          });
        window.map.setCentent({
          longitude: item.longitude,
          latitude: item.latitude,
        });
      });
    },
    // 显示隐藏详情页
    showDetail() {
      this.isHomePage = true;
      this.getTaskList();
      this.getRealTimeDynamicList();
    },
    // 搜索框的回调函数
    handleInputChange() {
      if (this.isRealTimeDynamic) {
        this.getRealTimeDynamicList(this.typeId);
      } else {
        this.getTaskList(this.typeId);
      }
    },
    // 实时动态和任务列表的tab点击回调函数
    handleClickTab(index) {
      switch (index) {
        case 2:
          this.isRealTimeDynamic = false;
          break;
        case 1:
        default:
          this.isRealTimeDynamic = true;
      }
    },
    // 获取实时动态
    getRealTimeDynamicList(typeId) {
      this.isLoading = true;
      let taskId = '';
      this.typeId = typeId;
      const request1 = {
        method: 'post',
        service: 'eoc',
        url: '/emergency/preparation/dictionary/getByCodeAndParentCode',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          pcode: 'event_task_type',
          code: 'preplan',
        },
      };
      this.$http(request1)
        .then((response1) => {
          taskId = response1.data.id;
        })
        .then(() => {
          const request = {
            method: 'get',
            service: 'eoc',
            url: '/event/task/getEventDistributionResult',
            params: {
              eventId: this.$store.state.event?.id,
              startTime: this.startTime,
              endTime: this.endTime,
              taskType:
                this.reservePlanTask === 'reservePlanTask' ? taskId : typeId,
              status: [],
              keyWord: this.keyword,
              page: this.currentPage,
              size: '10',
            },
          };
          this.$http(request)
            .then((response) => {
              // console.log('/event/task/getEventDistributionResult', response);
              if (response.errorcode === 0 && response?.data) {
                this.realTimeDynamicList = response.data.data;
                this.totalItems = response.data.totalElements;
              } else {
                this.$message.error(
                  `获取实时动态数据失败，错误代码${response.code}，错误信息：${response.msg}`,
                );
              }
            })
            .catch((error) => {
              this.$message.error(`获取实时动态数据失败，错误信息：${error}`);
            })
            .finally(() => {
              this.isLoading = false;
            });
        });
    },
    // 判断任务是超时还是即将超时
    getTimeOut(endTime) {
      if (!endTime) {
        return '无时限';
      }
      let tempStatus = '';
      const seconds =
        new Date(endTime).valueOf() / 1000 - new Date().valueOf() / 1000;
      const day = seconds / 60 / 60 / 24;
      if (seconds < 0) {
        tempStatus = '任务超时';
      } else if (day < 1) {
        tempStatus = '即将超时';
      } else {
        tempStatus = '未超时';
      }
      return tempStatus;
    },
    // 获取任务超时或者剩余时间
    getSurplusTime(endTime) {
      const seconds = Math.abs(
        new Date(endTime).getTime() / 1000 - new Date().getTime() / 1000,
      );
      const day = seconds / 60 / 60 / 24;
      const hour = (seconds / 60 / 60) % 24;
      const minute = (seconds / 60) % 60;
      return `${Math.abs(Math.floor(day))}天${Math.abs(
        Math.floor(hour),
      )}时${Math.abs(Math.floor(minute))}分`;
    },
    /**
     * 计算执行中的任务的时间状态，剩余/超时
     *
     * @param {string} endTime 截止时间
     * @return {string} 显示的状态
     */
    calcHandlingTaskTime(endTime) {
      const flag = new Date(endTime).getTime() <= new Date().getTime();
      return `${flag ? '超时：' : '剩余：'}${this.getSurplusTime(endTime)}`;
    },
    /**
     * 计算已完成和已取消的任务的时间状态，用时/超时
     * @param {string} startTime 起始时间
     * @param {string} endTime 截止时间
     * @return {string} 显示的状态
     */
    calcOtherTaskTime(startTime, endTime) {
      const endDateTime = new Date(endTime).getTime();
      const nowDateTime = new Date().getTime();
      const flag = endDateTime <= nowDateTime;
      if (flag) {
        return `超时：${this.getSurplusTime(endTime)}`;
      }
      const startDateTime = new Date(startTime).getTime();
      const diffSeconds = (nowDateTime - startDateTime) / 1000;
      const day = Math.floor(diffSeconds / 60 / 60 / 24);
      const hour = Math.floor(diffSeconds / 60 / 60) % 24;
      const minute = Math.floor(diffSeconds / 60) % 60;
      return `用时：${day}天${hour}时${minute}分`;
    },
    // 获取实时动态背景颜色
    getBackgroundColor(endTime) {
      let tempColor = '';
      const seconds =
        new Date(endTime).valueOf() / 1000 - new Date().valueOf() / 1000;
      const day = seconds / 60 / 60 / 24;
      if (seconds < 0) {
        tempColor =
          'linear-gradient(90deg, rgba(235,80,80,0.38) 0%, rgba(115, 83, 71, 0) 100%)';
      } else if (day < 1) {
        tempColor =
          'linear-gradient(90deg, rgba(228,181,85,0.38) 0%, rgba(115, 83, 71, 0) 100%)';
      } else {
        tempColor =
          'linear-gradient(90deg, rgba(0,193,222,0.38) 0%, rgba(24, 38, 50, 0) 100%)';
      }
      return tempColor;
    },
    // 获取任务列表
    getTaskList(typeId) {
      this.isLoading = true;
      let taskId = '';
      this.typeId = typeId;
      const request1 = {
        method: 'post',
        service: 'eoc',
        url: '/emergency/preparation/dictionary/getByCodeAndParentCode',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          pcode: 'event_task_type',
          code: 'preplan',
        },
      };
      this.$http(request1)
        .then((response1) => {
          taskId = response1.data.id;
        })
        .then(() => {
          const request = {
            method: 'get',
            service: 'eoc',
            url: '/event/task/getTaskList',
            params: {
              eventId: this.$store.state.event?.id,
              startTime: this.startTime,
              endTime: this.endTime,
              taskType:
                this.reservePlanTask === 'reservePlanTask' ? taskId : typeId,
              status: [],
              keyWord: this.keyword,
            },
          };
          this.$http(request)
            .then((response) => {
              // console.log('/event/event/task/getTaskList', response);
              if (response.errorcode === 0 && response?.data) {
                this.taskList = response.data;
              } else {
                this.$message.error(
                  `获取任务列表数据失败，错误代码${response.code}，错误信息：${response.msg}`,
                );
              }
            })
            .catch((error) => {
              this.$message.error(`获取任务列表数据失败，错误信息：${error}`);
            })
            .finally(() => {
              this.isLoading = false;
            });
        });
    },
    // 发布任务
    publishTask() {
      this.$nextTick(() => {
        if (this.$addDialog) {
          this.$addDialog('发布任务', TaskPublishDialog, {
            refresh: () => {
              this.getRealTimeDynamicList();
              this.getTaskList();
            },
          });
        }
      });
    },
    taskPanorama() {
      this.$emit('transmitTaskPanorama');
    },
    // 创建地图图层
    initMarker() {
      // window.map.createdMarkCoverage('任务调度落点');
      // this.$nextTick(() => {
      //   window.map.createdMarkCoverage('任务调度落点');
      // });
    },
  },
});
</script>

<style lang="scss" src="./style/TaskScheduleList.scss" module></style>
<style lang="scss" src="./style/animation.scss"></style>
