<template>
  <div class="update-task-information-container reset-vant">
    <!-- 任务名称 -->
    <van-field v-model="taskForm.taskName" label="任务名称" placeholder="请输入任务名称" />

    <!-- 任务类型 -->
    <van-field
      v-model="taskForm.taskType.name"
      label="任务类型"
      right-icon="arrow"
      placeholder="请选择任务类型"
      readonly
      @click="taskTypeVisible = true"
    />

    <!-- 弹窗-任务类型 -->
    <van-popup
      v-model:show="taskTypeVisible"
      round
      position="bottom"
      close-icon-position="top-left"
    >
      <van-picker
        title="请选择任务类型"
        :columns="taskTypeColumns"
        @cancel="taskTypeVisible = false"
        @confirm="onTaskTypeConfirm"
      />
    </van-popup>

    <!-- 任务地点 -->
    <van-field
      v-model="taskForm.taskAddress"
      label="任务地点"
      right-icon="arrow"
      readonly
      placeholder="请选择任务地点"
      @click="toMap"
    />

    <!-- 执行时间 -->
    <div class="form-row" @click="taskExecutionTimeVisible = true">
      <div class="form-row__top">
        <div class="form-row__left">
          <span class="form-row__left__label">执行时间</span>
        </div>
        <div class="form-row__center">
          <span v-if="taskForm.taskExecutionType" class="form-row__center__value">{{
            taskForm.taskExecutionType
          }}</span>
          <span v-else class="form-row__center__placeholder">请选择执行时间</span>
          <span v-if="taskForm.taskExecutionType === '定时'" class="form-row__center__value">{{
            taskForm.taskExecutionTimeDate
          }}</span>
        </div>
        <div class="form-row__right">
          <van-icon name="arrow" size="0.3rem" color="#969799" />
        </div>
      </div>
    </div>

    <!-- 弹窗-执行时间 -->
    <van-popup
      v-model:show="taskExecutionTimeVisible"
      round
      position="bottom"
      close-icon-position="top-left"
    >
      <!-- :columns="['即时', '定时']" -->
      <van-picker
        v-if="!taskExecutionTimeDateVisible"
        title="请选择执行时间"
        :columns="['即时']"
        :confirm-button-text="confirmButtonText2"
        @cancel="taskExecutionTimeVisible = false"
        @confirm="onTaskExecutionTypeConfirm"
        @change="onTaskExecutionTypeChange"
      />
      <van-datetime-picker
        v-show="taskExecutionTimeDateVisible"
        v-model="taskForm.taskExecutionTimeDate"
        title="请选择执行时间"
        type="datetime"
        :cancel-button-text="'上一步'"
        :formatter="datePickerFormatter"
        :min-date="minDate"
        @cancel="taskTimeLimitTypeVisible = true"
        @change="onTaskExecutionTimeDateChange"
        @confirm="onTaskExecutionTimeDateConfirm"
      />
    </van-popup>

    <!-- 任务时限 -->
    <div class="form-row">
      <div
        class="form-row__top"
        @click="
          taskTimeLimitVisible = true;
          taskTimeLimitTypeVisible = true;
        "
      >
        <div class="form-row__left">
          <span class="form-row__left__label">任务时限</span>
        </div>
        <div class="form-row__center">
          <span v-if="taskForm.taskTimeLimit.typeName" class="form-row__center__value">{{
            taskForm.taskTimeLimit.typeName
          }}</span>
          <span v-else class="form-row__center__placeholder">请选择任务时限</span>
          <span v-if="taskForm.taskTimeLimit.date" class="form-row__center__value">{{
            taskForm.taskTimeLimit.value
          }}</span>
        </div>
        <div class="form-row__right">
          <van-icon name="arrow" size="0.3rem" color="#969799" />
        </div>
      </div>

      <div
        v-if="taskForm.taskTimeLimit.typeName && taskForm.taskTimeLimit.typeName !== '无时限'"
        class="alert-type-container"
      >
        <div
          v-for="item in taskForm.alertTypeOptions1"
          :key="item.id"
          :class="item.checked ? 'type--active' : 'type--default'"
          @click="handleAlertTypeChanged(item)"
        >
          <span class="type--label">{{ item.name }}</span>
          <div v-if="item.checked" class="active-status">
            <img src="./assets/images/gou.svg" alt="" class="active-status-icon" />
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗-任务时限 -->
    <van-popup
      v-model:show="taskTimeLimitVisible"
      round
      position="bottom"
      close-icon-position="top-left"
    >
      <van-picker
        v-show="taskTimeLimitTypeVisible"
        title="请选择任务时限"
        :columns="['无时限', '分钟', '小时', '天', '月', '自定义']"
        :confirm-button-text="confirmButtonText"
        @cancel="taskTimeLimitVisible = false"
        @confirm="onTaskTimeLimitTypeConfirm"
        @change="onTaskTimeLimitTypeChange"
      />
      <template v-if="!taskTimeLimitTypeVisible">
        <!-- '分钟', '小时', '天', '月' -->
        <van-picker
          v-show="taskForm.taskTimeLimit.index > 0 && taskForm.taskTimeLimit.index < 5"
          title="请选择任务时限"
          :columns="taskLimitDetailOptions"
          :cancel-button-text="'上一步'"
          @cancel="taskTimeLimitTypeVisible = true"
          @confirm="onTaskTimeLimitConfirm"
        />
        <!-- '自定义' -->
        <van-datetime-picker
          v-model="taskForm.taskTimeLimit.date"
          v-show="taskForm.taskTimeLimit.index === 5"
          title="请选择任务时限"
          type="datetime"
          :cancel-button-text="'上一步'"
          :formatter="datePickerFormatter"
          :min-date="minDate"
          @cancel="taskTimeLimitTypeVisible = true"
          @confirm="onTaskTimeLimitDateConfirm"
          @change="onTaskTimeLimitDateChange"
        />
      </template>
    </van-popup>

    <!-- 任务提醒 -->
    <!-- 任务时限选择了无时限时候，隐藏 -->
    <template v-if="taskForm.taskTimeLimit.index">
      <div class="form-row">
        <div class="form-row__top" @click="taskAlertTypeVisible = true">
          <div class="form-row__left">
            <span class="form-row__left__label">任务提醒</span>
          </div>
          <div class="form-row__center">
            <span v-if="taskForm.taskAlert.typeName" class="form-row__center__value">{{
              taskForm.taskAlert.typeName
            }}</span>
            <span v-else class="form-row__center__placeholder">请选择任务提醒</span>
            <span v-if="taskForm.taskAlert.date" class="form-row__center__value">{{
              taskForm.taskAlert.date
            }}</span>
          </div>
          <div class="form-row__right">
            <van-icon name="arrow" size="0.3rem" color="#969799" />
          </div>
        </div>

        <div v-if="taskForm.taskAlert.index" class="alert-type-container">
          <div
            v-for="item in taskForm.alertTypeOptions2"
            :key="item.id"
            :class="item.checked ? 'type--active' : 'type--default'"
            @click="handleAlertTypeChanged(item)"
          >
            <span class="type--label">{{ item.name }}</span>
            <div v-if="item.checked" class="active-status">
              <img src="./assets/images/gou.svg" alt="" class="active-status-icon" />
            </div>
          </div>
        </div>
      </div>

      <!-- 弹窗-任务提醒 -->
      <van-popup
        v-model:show="taskAlertTypeVisible"
        round
        position="bottom"
        close-icon-position="top-left"
      >
        <van-picker
          title="请选择任务提醒"
          v-show="!taskAlertDateVisible"
          :columns="taskReminderOptions"
          :confirm-button-text="confirmButtonText3"
          @cancel="taskAlertTypeVisible = false"
          @confirm="onTaskAlertTypeConfirm"
          @change="onTasAlertTypeChange"
        />
        <!-- '自定义' -->
        <van-datetime-picker
          v-model="taskForm.taskAlert.date"
          v-show="taskAlertDateVisible"
          title="请选择任务提醒"
          type="datetime"
          :cancel-button-text="'上一步'"
          :formatter="datePickerFormatter"
          :min-date="minDate"
          @cancel="taskAlertTypeVisible = false"
          @confirm="onAlertTypeDateConfirm"
          @change="onAlertTypeDateChange"
        />
      </van-popup>
    </template>

    <!-- 关联事件 -->
    <van-field
      v-model="taskForm.event.eventTitle"
      label="关联事件"
      right-icon="arrow"
      readonly
      placeholder="请选择事件"
      @click="eventVisible = true"
    />
    <!-- 弹窗-任务提醒 -->
    <van-popup v-model:show="eventVisible" round position="bottom" close-icon-position="top-left">
      <van-picker
        title="请选择事件"
        :columns="eventList"
        :columns-field-names="{
          text: 'title',
        }"
        @cancel="eventVisible = false"
        @confirm="onEventConfirm"
      />
      <div class="footer-button">
        <Button type="text" :font-size="'0.28rem'" @click="loadMoreEvent">
          加载更多
        </Button>
      </div>
    </van-popup>

    <!-- 上传附件 -->
    <div class="uploader-container">
      <p class="uploader__label">上传照片/视频</p>
      <div class="photos-list">
        <div class="uploader__inner" @click="showPopover = true">
          <div class="img-camera"></div>
          <span class="uploader__inner__label">上传照片/视频</span>
        </div>
        <!-- 图片 -->
        <template
          v-if="taskForm.taskAttachments.images && taskForm.taskAttachments.images.length > 0"
        >
          <div v-for="(el, _index) in taskForm.taskAttachments.images" class="photo-item">
            <div class="icon-close" @click.stop.prevent="handleDeleteImage(el, _index)"></div>
            <div v-if="el.loading" class="van-image">
              <van-loading type="spinner" size="20" />
            </div>
            <van-image v-else :src="el.url" @click="previewImage(taskForm.taskAttachments.images, _index)">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </div>
        </template>
        <!-- 视频 -->
        <template
          v-if="taskForm.taskAttachments.videos && taskForm.taskAttachments.videos.length > 0"
        >
          <div
            v-for="(el, _index) in taskForm.taskAttachments.videos"
            class="photo-item"
            @click="previewVideo(el.url)"
          >
            <div v-if="el.loading" class="van-image">
              <van-loading type="spinner" size="20" />
            </div>
            <template v-else>
              <video :src="el.url" width="200" height="200">
                您的浏览器不支持 video 标签。
              </video>
              <i class="icon-video"></i>
            </template>
            <div class="icon-close" @click.stop.prevent="handleDeleteVideo(el, _index)"></div>
          </div>
        </template>
      </div>
    </div>
    <div class="uploader-container">
      <p class="uploader__label">上传文件</p>
      <van-uploader
        :before-read="beforeUploadFiles"
        :after-read="afterRead"
        :accept="acceptFileType"
        :max-size="maxFileSize"
        @oversize="onOversize"
        lazy-load
      >
        <van-button icon="plus" type="default" size="small" plain>上传文件</van-button>
      </van-uploader>
      <!-- 文件 -->
      <div class="file-list">
        <TaskDocument
          v-for="(item, index) in taskForm.taskAttachments.files"
          :key="index"
          :file="item"
          :color="textColor"
          :showClose="showDocumentClose"
          @handleClose="handleDeleteFile(item, index)"
        />
      </div>
    </div>
    <!-- 任务说明 -->
    <div class="form-row__textarea">
      <p class="form-row__label">任务说明</p>
      <van-field
        v-model="taskForm.taskDescription"
        placeholder="请输入任务说明"
        type="textarea"
        autosize
        rows="2"
      />
    </div>
    <!-- 预览视频 -->
    <van-overlay :show="showVideoDialog" @click="closeVideoDialog">
      <div class="preview-video-dialog">
        <video id="video" :src="videoUrl" controls="controls" class="video-dialog">
          您的浏览器不支持 video 标签。
        </video>
        <van-icon name="cross" size="0.5rem" class="icon-cross" @click="showVideoDialog = false" />
      </div>
    </van-overlay>
    <!-- 上传图片、视频-弹出层 -->
    <van-popup v-model:show="showPopover" round position="bottom" :style="{ height: 'auto' }">
      <div class="reset-vant-popup-container-layout">
        <div class="reset-vant-popup-container-header">上传图片/视频</div>
        <div class="reset-vant-popup-container-body">
          <div class="body__label">
            <div class="body__label__inner">
              <van-uploader
                :after-read="afterRead"
                :before-read="beforeUpload"
                :max-size="maxFileSize"
                capture="camera"
                accept="image/*"
                lazy-load
                multiple
                @oversize="onOversize"
              >
                <div class="uploader__inner">
                  <div class="img-camera"></div>
                  <span class="uploader__inner__label">上传照片</span>
                </div>
              </van-uploader>
            </div>
          </div>
          <div class="body__label">
            <div class="body__label__inner">
              <van-uploader
                :after-read="afterRead"
                :before-read="beforeUpload"
                :max-size="maxFileSize"
                capture="camcorder"
                accept="video/*"
                lazy-load
                multiple
                @oversize="onOversize"
              >
                <div class="uploader__inner">
                  <div class="img-vidicon"></div>
                  <span class="uploader__inner__label">上传视频</span>
                </div>
              </van-uploader>
            </div>
          </div>
        </div>
        <div class="reset-vant-popup-container-footer" @click="showPopover = false">
          取消
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// 组件——提示弹窗
import { Toast, Notify, ImagePreview } from 'vant';
import { useStore } from 'vuex';
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';

import TaskDocument from '@/product/SIOC-H5/generalparts/FileExtensionImage/Document.vue';
// 逻辑——文件相关业务
const $file = require('@/product/SIOC-H5/module/task/TaskDetail/assets/js/file').default;
// 逻辑——时间相关业务
const $time: any = require('@/product/SIOC-H5/module/task/TaskDetail/assets/js/time').default;

export default defineComponent({
  name: 'UpdateTaskInformation',
  components: {
    Button,
    TaskDocument,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  computed: {
    // 任务时限-详细选项
    taskLimitDetailOptions() {
      switch (this.taskForm.taskTimeLimit.index) {
        // 分钟
        case 1: {
          return ['30', '35', '40', '45', '50', '55', '60'];
        }
        // 小时
        case 2: {
          return [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
          ];
        }
        // 天
        case 3: {
          return [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
          ];
        }
        // 月
        case 4: {
          return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        }
        default: {
          return [];
        }
      }
    },
  },
  watch: {
    taskForm: {
      handler(newVal, oldVal) {
        if (!this.loading) {
          console.log('监听taskForm', newVal);
          let newForm = { ...newVal };
          this.store.commit('task/setTaskForm', newForm);
          this.$emit('formChange');
        }
      },
      deep: true,
      immediate: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const router = useRouter();
    const loading = ref(true);
    const taskForm: any = ref({
      // 任务id
      taskId: '',
      // 任务名称
      taskName: '',
      // 任务类型
      taskType: {
        id: '',
        name: '',
      },
      // 任务地点
      taskAddress: '',
      // 任务经度
      taskLongitude: '',
      // 任务纬度
      taskLatitude: '',
      // 执行时间-即时、定时
      taskExecutionType: '即时',
      // 执行日期
      taskExecutionTimeDate: '',
      // 任务时限
      taskTimeLimit: {
        value: '', // 时限 + 类型
        index: 0, // 下标
        typeName: '无时限', // 类型的名字
        date: '', // 日期，时限
      },
      // 任务时限警告
      alertTypeOptions1: [
        {
          id: 1,
          name: '站内警告',
          checked: true,
        },
        {
          id: 2,
          name: '短信警告',
          checked: true,
        },
        {
          id: 3,
          name: 'APP警告',
          checked: true,
        },
      ],
      // 任务提醒警告
      alertTypeOptions2: [
        {
          id: 1,
          name: '站内警告',
          checked: true,
        },
        {
          id: 2,
          name: '短信警告',
          checked: true,
        },
        {
          id: 3,
          name: 'APP警告',
          checked: true,
        },
      ],
      // 任务提醒
      taskAlert: {
        index: 0,
        typeName: '不提醒',
        date: '', // 自定义-时间
      },
      // 上传附件
      taskAttachments: {
        fileList: [],
        images: [],
        files: [],
        videos: [],
      },
      // 任务说明
      taskDescription: '',
      // 事件
      event: {
        eventId: '', // 事件id
        eventTitle: '', // 事件标题
      },
    });
    // 获取当前时间
    // let minDate: any = $time.getNowTime();

    const showPopover = ref(false);

    // 显示/隐藏视频弹窗
    const showVideoDialog = ref(false);
    // 预览弹窗的视频路径
    const videoUrl = ref('');
    /**
     * @description 预览视频
     */
    function previewVideo(url: string) {
      showVideoDialog.value = true;
      videoUrl.value = baseURL + url;
    }
    /**
     * @description 关闭查看视频弹窗
     */
    function closeVideoDialog() {
      showVideoDialog.value = false;
      const video: any = document.getElementById('video');
      if (video.play) {
        video.pause();
      }
    }

    function addZero(val: number) {
      return val >= 10 ? val : '0' + val;
    }
    /**
     * @description 获取当前时间
     */
    function getNowTime() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      return (
        year +
        '/' +
        addZero(month) +
        '/' +
        addZero(day) +
        ' ' +
        addZero(hour) +
        ':' +
        addZero(minute)
      );
    }
    let minDate: any = new Date(getNowTime());

    /**
     * @description 默认填充store里的数据
     */
    function getTaskForm() {
      console.log('数据初始化：', store.state.task.taskForm);
      taskForm.value = {...store.state.task.taskForm};
      getTaskLocation();
      loading.value = false;
    }

    /** ------------------- 任务地点 start---------------- */
    /**
     * @description 获取缓存的任务地点
     */
    function getTaskLocation() {
      console.log('获取缓存的任务地点：', taskForm.value);
      const lng = store?.state?.task?.taskLocation?.transFromLonLat?.split(',') || '';
      taskForm.value.taskLongitude = lng[0] || '';
      taskForm.value.taskLatitude = lng[1] || '';
      taskForm.value.taskAddress = store?.state?.task.taskLocation?.address || '';
    }
    /**
     * @description 跳转到地图，选择任务地点
     */
    function toMap() {
      router.push({
        path: '/MapPOI',
      });
    }
    /** ---------------- 附件上传 start------------- */
    const maxFileSize = 30 * 1024 * 1024; // 30MB
    const acceptFileType = $file.acceptFileType; // 可支持上传的文件类型
    const images: any = ref([]);
    const files: any = ref([]);
    const videos: any = ref([]);
    const baseURL = (window as any).config.baseURL;
    const textColor = '#0091FF';
    const showDocumentClose = ref(true); // 文档组件-props传参-是否显示“关闭|删除“按钮

    /**
     * @param {Array} images 图片数组
     * @param {Nubmer}} index 下标
     * @description 图片预览
     */
    function previewImage(images: any, index: any) {
      const imagesList = images.map((item: any) => baseURL + item.url);
      ImagePreview({
        images: imagesList,
        startPosition: index, // 指定图片的初始位置（索引值）
        closeable: true,
        // 监听图片预览的关闭事件
        onClose() {},
      });
    }
    /**
     * @param {Object | Array} files 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 文件超出大小，给予提示
     */
    function onOversize(file: any) {
      Toast('文件大小不能超过 30MB');
    }

    /**
     * @param {Object | Array} files 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 上传文件之前，判断类型
     */
    function beforeUploadFiles(file: any) {
      if (file.length) {
        // 多个上传
        file.forEach((el: any) => {
          files.value.push({
            loading: true,
            filename: el.name,
            id: el.size,
            size: el.size,
            title: el.name,
            url: el.name,
          });
        });
      } else {
        // 单个上传
        files.value.push({
          loading: true,
          filename: file.name,
          id: file.size,
          size: file.size,
          title: file.name,
          url: file.name,
        });
      }
      Object.assign(taskForm.value.taskAttachments, { files: files.value });
      Object.assign(taskForm.value.taskAttachments, {
        fileList: images.value.concat(files.value).concat(videos.value),
      });
      return true;
    }
    /**
     * @param {Object | Array} files 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 上传文件之前，判断类型
     */
    function beforeUpload(files: any) {
      showPopover.value = false;
      if (files.length) {
        // 多个上传
        files.forEach((el: any) => {
          const file = {
            filename: el.name,
            id: el.size,
            size: el.size,
            title: el.name,
            url: window.URL.createObjectURL(el),
            loading: true,
          };
          if (el.type.indexOf('image') > -1) {
            images.value.push(file);
          } else if (el.type.indexOf('video') > -1) {
            videos.value.push(file);
          }
        });
      } else {
        // 单个上传
        const file = {
          filename: files.name,
          id: files.size,
          size: files.size,
          title: files.name,
          url: window.URL.createObjectURL(files),
          loading: true,
        };
        if (files.type.indexOf('image') > -1) {
          images.value.push(file);
        } else if (files.type.indexOf('video') > -1) {
          videos.value.push(file);
        }
      }
      Object.assign(taskForm.value.taskAttachments, { images: images.value });
      Object.assign(taskForm.value.taskAttachments, { videos: videos.value });
      Object.assign(taskForm.value.taskAttachments, {
        fileList: images.value.concat(files.value).concat(videos.value),
      });
      return true;
    }
    /**
     * @param {Object | Array} file 单个上传，拿到的是对象；多个上传，拿到的是数组
     * @description 上传文件后的回调方法
     */
    function afterRead(file: any) {
      if (file.length > 0) {
        // 多个上传
        file.forEach((el: any) => {
          fileUploadAttachment(el.file);
        });
      } else {
        // 单个上传
        fileUploadAttachment(file.file);
      }
    }
    /**
     * @description 文件上传方法
     */
    function fileUploadAttachment(file: FileList) {
      let fileData: any = ref(new FormData());
      fileData.value.append('file', file);
      fileData.value.append('type', '3'); // 文件类型（0：系统文件 1 事件附件  2 预案附件  3 任务附件 4 协同标绘）
      const requestData: any = {
        method: 'post',
        service: 'file',
        url: '/appAttachment/fileUploadAttachment',
        data: fileData.value,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      };
      ($http as any)(requestData).then((res: any) => {
        if (res.errorcode === 0 && res.data) {
          const extension = $file.getExtensions(res.data.title);
          if (res.data.fileContentType === 'image') {
            const _index = taskForm.value.taskAttachments.images.findIndex(
              (el: any) => el.filename === res.data.title,
            );
            if (_index > -1) {
              const file = {
                ...res.data,
                url: baseURL + res.data.url,
                loading: false,
              };
              images.value[_index] = file;
              taskForm.value.taskAttachments.images[_index] = file;
            }
          } else if (res.data.fileContentType === 'file') {
            const _index = taskForm.value.taskAttachments.files.findIndex(
              (el: any) => el.filename === res.data.title,
            );
            if (_index > -1) {
              const file = {
                ...res.data,
                url: baseURL + res.data.url,
                loading: false,
              };
              files.value[_index] = file;
              taskForm.value.taskAttachments.files[_index] = file;
            }
          } else if (res.data.fileContentType === 'video') {
            const _index = taskForm.value.taskAttachments.videos.findIndex(
              (el: any) => el.filename === res.data.title,
            );
            if (_index > -1) {
              const file = {
                ...res.data,
                url: baseURL + res.data.url,
                loading: false,
              };
              videos.value[_index] = file;
              taskForm.value.taskAttachments.videos[_index] = file;
            }
          }
          Object.assign(taskForm.value.taskAttachments, {
            fileList: images.value.concat(files.value).concat(videos.value),
          });
        } else {
          Notify({
            type: 'danger',
            message: `文件上传失败，错误代码${res.code}，错误信息：${res.msg}`,
          });
        }
      });
    }

    /**
     * @param {Object} file 文件数据
     * @description 删除文件
     */
    function handleDeleteFileList(file: any) {
      if (taskForm.value.taskAttachments.fileList.length > 0 && file) {
        const _index = taskForm.value.taskAttachments.fileList.findIndex(
          (el: any) => el.id === file.id,
        );
        if (_index > -1) {
          taskForm.value.taskAttachments.fileList.splice(_index, 1);
        }
      }
    }

    /**
     * @param {Object} file 文件数据
     * @param {number} index 下标
     * @description 删除文件
     */
    function handleDeleteFile(file: any, index: number) {
      deleteFile(file.url, file.id); // 删除文件
      if (index > -1) {
        taskForm.value.taskAttachments.files.splice(index, 1);
        files.value.splice(index, 1);
      }
      handleDeleteFileList(file);
    }
    /**
     * @param {Object} image 文件数据
     * @param {number} index 下标
     * @description 删除图片
     */
    function handleDeleteImage(image: any, index: number) {
      deleteFile(image.url, image.id); // 删除文件
      if (index > -1) {
        taskForm.value.taskAttachments.images.splice(index, 1);
        images.value.splice(index, 1);
      }
      handleDeleteFileList(image);
    }

    /**
     * @param {Object} video 文件数据
     * @description 删除视频
     * @param {number} index 下标
     */
    function handleDeleteVideo(video: any, index: number) {
      deleteFile(video.url, video.id); // 删除文件
      if (index > -1) {
        taskForm.value.taskAttachments.videos.splice(index, 1);
        videos.value.splice(index, 1);
      }
      handleDeleteFileList(video);
    }
    /**
     * @param {Object} file 文件数据
     * @description 删除文件
     */
    function deleteFile(filePath: string, fileId: string | number) {
      const requestData = {
        method: 'post',
        service: 'file',
        url: `/appAttachment/delFile?path=${filePath}&id=${fileId}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      ($http as any)(requestData).then((res: any) => {
        if (res.errorcode === 0) {
        } else {
          Notify({
            type: 'danger',
            message: `删除文件失败，错误代码${res.code}，错误信息：${res.msg}`,
          });
        }
      });
    }

    /** ---------------- 附件上传 end------------- */

    /** ----------------关联事件 start---------------- */
    const eventVisible = ref(false);
    const eventList = ref([]);
    const page = ref(1);
    /**
     * @description 获取事件列表
     */
    function getEventList(page: number) {
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/eos/event/listBy',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          name: '',
          page,
          reportType: 0,
          size: 20,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0 && response?.data) {
          eventList.value = eventList.value.concat(response.data.data);
        }
      });
    }
    /**
     * @description 关联事件确认选中回调
     */
    function onEventConfirm(item: any, index: number) {
      taskForm.value.event.eventId = item.id;
      taskForm.value.event.eventTitle = item.title;
      eventVisible.value = false;
    }
    function loadMoreEvent() {
      page.value += 1;
      getEventList(page.value);
    }
    /** ----------------关联事件 end---------------- */

    /** ----------------任务类型 start---------------- */
    // 任务类型选择器
    const taskTypeVisible = ref(false);
    const taskTypeColumns: any = ref([]);
    // 任务类型数组
    const tempTaskTypeColumns: any = ref([]);
    /**
     * @description 获取任务类型
     */
    function getByParentCode(pcode: string) {
      const request = {
        method: 'post',
        service: 'app',
        url: '/emergency/preparation/dictionary/getByParentCode',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          pcode,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0 && response?.data) {
          if (pcode === 'event_task_type') {
            // 注释原因：H5暂时只给选择自定义类型(20210827)
            // taskTypeColumns.value = response.data.map((item: any) => {
            //   return item.name;
            // });
            // H5暂时只给选择自定义类型
            taskTypeColumns.value = [
              response.data.filter((item: any) => item.name === '自定义任务')[0].name,
            ];
            // 默认选中自定义类型
            taskForm.value.taskType.name = response.data.filter(
              (item: any) => item.name === '自定义任务',
            )[0].name;
            taskForm.value.taskType.id = response.data.filter(
              (item: any) => item.name === '自定义任务',
            )[0].id;
            tempTaskTypeColumns.value = response.data;
          }
        }
      });
    }
    /**
     * @description 任务类型确认回调函数
     */
    function onTaskTypeConfirm(name: string, index: number) {
      taskForm.value.taskType.name = name;
      taskForm.value.taskType.id = tempTaskTypeColumns.value[index].id;
      taskTypeVisible.value = false;
    }
    /** ----------------任务类型 end---------------- */

    /** ----------------执行时间 start---------------- */
    // 选择执行时间类型-弹出窗
    const taskExecutionTimeVisible = ref(false);
    // 选择执行时间-弹出窗
    const taskExecutionTimeDateVisible = ref(false);
    // 选择执行时间类型-弹出窗-确定按钮
    const confirmButtonText2 = ref('确定');
    /**
     * @description 执行时间-自定义-确定回调
     */
    function onTaskExecutionTimeDateConfirm(val: any) {
      // 赋值-执行时间
      taskForm.value.taskExecutionTimeDate = $time.formatDate('yyyy-MM-dd hh:mm', val);
      // 隐藏-执行时间类型-弹出窗
      taskExecutionTimeVisible.value = false;
      // 隐藏-执行时间-弹出窗
      taskExecutionTimeDateVisible.value = false;
    }
    /**
     * @description 执行时间-自定义-改变回调
     */
    function onTaskExecutionTimeDateChange(val: any) {
      // 赋值-执行时间
      taskForm.value.taskExecutionTimeDate = $time.formatDate('yyyy-MM-dd hh:mm', val);
    }
    /**
     * @description 执行时间-改变回调
     */
    function onTaskExecutionTypeConfirm(name: string, index: number) {
      // 赋值-执行时间类型
      taskForm.value.taskExecutionType = name;
      // 隐藏-执行时间-弹出窗 -- 选中定时才显示时间选择器
      taskExecutionTimeDateVisible.value = name === '定时' ? true : false;
      // 隐藏-执行时间类型-弹出窗
      taskExecutionTimeVisible.value = name === '即时' ? false : true;
      // 选择即时时候，清空日期
      taskForm.value.taskExecutionTimeDate =
        name === '即时' ? '' : taskForm.value.taskExecutionTimeDate;
    }
    /**
     * @description 执行时间-确定类型回调
     */
    function onTaskExecutionTypeChange(name: string, index: number) {
      // 选择执行时间类型-弹出窗-确定按钮 -- 选中了“定时”，才可以选择执行日期
      confirmButtonText2.value = name === '定时' ? '下一步' : '确定';
    }
    /** ----------------执行时间 end---------------- */

    /** ----------------任务时限 start---------------- */
    // 显示选择任务时限弹窗（包含选择类型、时限、自定义日期）
    const taskTimeLimitVisible = ref(false);
    // 显示选择任务时限-选择类型弹窗
    const taskTimeLimitTypeVisible = ref(true);
    const confirmButtonText = ref('确定');
    // 日期选择器格式化
    const datePickerFormatter = (type: string, val: string) => {
      if (type === 'year') {
        return val + '年';
      }
      if (type === 'month') {
        return val + '月';
      }
      if (type === 'day') {
        return val + '日';
      }
      if (type === 'hour') {
        return val + '时';
      }
      if (type === 'minute') {
        return val + '分';
      }
      return val;
    };
    /**
     * @description 任务类型确认回调函数 ('分钟', '小时', '天', '月')
     */
    function onTaskTimeLimitConfirm(name: any, index: any) {
      taskForm.value.taskTimeLimit.date =
        taskForm.value.taskTimeLimit.index === 4 ? name + '个' : name;
      taskForm.value.taskTimeLimit.value =
        taskForm.value.taskTimeLimit.date + taskForm.value.taskTimeLimit.typeName;
      // 隐藏弹窗
      taskTimeLimitVisible.value = false;
      taskTimeLimitTypeVisible.value = false;
    }
    /**
     * @description 任务时限类型-改变任务时限类型回调
     */
    function onTaskTimeLimitTypeChange(name: any, index: any) {
      confirmButtonText.value = index === 0 ? '确定' : '下一步';
    }
    /**
     * @description 任务时限-改变自定义日期回调
     */
    function onTaskTimeLimitDateConfirm(val: any) {
      taskForm.value.taskTimeLimit.value = $time.formatDate('yyyy-MM-dd hh:mm', val);
      taskForm.value.taskTimeLimit.date = $time.formatDate('yyyy-MM-dd hh:mm', val);
      taskTimeLimitVisible.value = false;
      taskTimeLimitTypeVisible.value = false;
    }
    /**
     * @description 任务时限-改变自定义日期回调
     */
    function onTaskTimeLimitDateChange(val: any) {
      taskForm.value.taskTimeLimit.value = $time.formatDate('yyyy-MM-dd hh:mm', val);
      taskForm.value.taskTimeLimit.date = $time.formatDate('yyyy-MM-dd hh:mm', val);
    }
    /**
     * @description 任务时限类型确认
     */
    function onTaskTimeLimitTypeConfirm(name: any, index: any) {
      taskForm.value.taskTimeLimit.typeName = name;
      taskForm.value.taskTimeLimit.index = index;
      if (index === 0) {
        // 选了无时限
        taskForm.value.taskTimeLimit.date = '';
        taskForm.value.taskTimeLimit.value = name;
        taskTimeLimitVisible.value = false;
      } else {
        // 选了 '分钟', '小时', '天', '月', '自定义'
        taskTimeLimitTypeVisible.value = false;
        taskForm.value.taskTimeLimit.value = taskForm.value.taskTimeLimit.typeName;
      }
    }
    /** ----------------任务时限 end---------------- */

    /** ----------------任务提醒 start---------------- */
    const taskAlertTypeVisible = ref(false);
    // 选择执行时间类型-弹出窗-确定按钮
    const confirmButtonText3 = ref('确定');
    // 任务提醒-选项
    const taskReminderOptions = [
      '不提醒',
      '任务截止前15分钟',
      '任务截止前30分钟',
      '任务截止前1小时',
      '任务截止前2小时',
      '任务截止前1天',
      '任务截止前2天',
      '任务截止前3天',
      '自定义',
    ];
    // 任务提醒-自定义-选择日期
    const taskAlertDateVisible = ref(false);
    /**
     * @description 确定提醒方式
     */
    function onTaskAlertTypeConfirm(name: string, index: number) {
      taskForm.value.taskAlert.typeName = name;
      taskForm.value.taskAlert.index = index;
      taskAlertTypeVisible.value = taskForm.value.taskAlert.index === 8 ? true : false;
      taskAlertDateVisible.value = taskForm.value.taskAlert.index === 8 ? true : false;
    }
    /**
     * @description 提醒方式改变触发
     */
    function handleAlertTypeChanged(item: any) {
      item.checked = !item.checked;
    }

    /**
     * @description 任务提醒-改变类型回调
     */
    function onTasAlertTypeChange(name: string, index: number) {
      // 选择任务提醒类型-弹出窗-确定按钮 -- 选中了“定时”，才可以选择执行日期
      confirmButtonText3.value = name === '定时' ? '下一步' : '确定';
    }

    /**
     * @description 确定选中日期
     */
    function onAlertTypeDateConfirm(val: any) {
      taskForm.value.taskAlert.date = $time.formatDate('yyyy-MM-dd hh:mm', val);
      taskAlertTypeVisible.value = false;
      taskAlertDateVisible.value = false;
    }
    /**
     * @description 任务时限-改变自定义日期回调
     */
    function onAlertTypeDateChange(val: any) {
      taskForm.value.taskAlert.date = $time.formatDate('yyyy-MM-dd hh:mm', val);
    }
    /** ----------------任务提醒 end---------------- */

    onMounted(() => {
      getTaskForm();
      getByParentCode('event_task_type'); // 获取任务类型
      getEventList(page.value);
    });
    return {
      taskTypeVisible,
      taskTypeColumns,
      tempTaskTypeColumns,
      onTaskTypeConfirm,
      getByParentCode,
      taskForm,
      taskTimeLimitVisible,
      taskTimeLimitTypeVisible,
      onTaskTimeLimitConfirm,
      onTaskTimeLimitTypeChange,
      onTaskTimeLimitTypeConfirm,
      onTaskTimeLimitDateConfirm,
      onTaskTimeLimitDateChange,
      taskExecutionTimeVisible,
      taskExecutionTimeDateVisible,
      onTaskExecutionTypeConfirm,
      taskReminderOptions,
      onTaskAlertTypeConfirm,
      taskAlertTypeVisible,
      confirmButtonText,
      datePickerFormatter,
      eventVisible,
      eventList,
      onEventConfirm,
      loadMoreEvent,
      onTaskExecutionTimeDateConfirm,
      onTaskExecutionTimeDateChange,
      onTaskExecutionTypeChange,
      confirmButtonText2,
      afterRead,
      fileUploadAttachment,
      onOversize,
      maxFileSize,
      beforeUploadFiles,
      beforeUpload,
      acceptFileType,
      baseURL,
      previewImage,
      toMap,
      store,
      minDate,
      handleAlertTypeChanged,
      textColor,
      onTasAlertTypeChange,
      confirmButtonText3,
      onAlertTypeDateConfirm,
      onAlertTypeDateChange,
      taskAlertDateVisible,
      showDocumentClose,
      handleDeleteImage,
      handleDeleteFile,
      loading,
      handleDeleteVideo,
      previewVideo,
      showVideoDialog,
      videoUrl,
      closeVideoDialog,
      showPopover,
    };
  },
});
</script>

<style lang="scss">
@use './assets/css/resetVant.scss';
@use './assets/css/index.scss';
</style>
