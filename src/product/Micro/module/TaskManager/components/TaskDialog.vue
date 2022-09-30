<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="1105px"
      custom-class="sbs-dialog"
      @close="emit('fresh')"
    >
      <div style="height: 666px;padding: 20px;">
        <div class="left">
          <el-form
            ref="dataFormRef"
            :model="dataForm"
            :rules="dataRule"
            label-width="90px"
            @submit.native.prevent
          >
            <el-form-item label="任务标签">
              <EntityLabel
                v-model="dataForm.labels"
                :editable="!disabled"
                style-template="sbs"
              />
            </el-form-item>
            <el-form-item
              label="任务模式"
              prop="modeType"
            >
              <el-radio-group v-model="dataForm.modeType">
                <el-radio :label="0">
                  正式模式
                </el-radio>
                <el-radio :label="1">
                  演练模式
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 新发布一个任务时不显示任务状态 -->
            <el-form-item
              v-if="!isNewTask"
              label="任务状态"
            >
              <el-input
                v-model="dataForm.statusName"
                disabled
                class="sbs-input"
              />
            </el-form-item>
            <el-form-item
              label="任务类型"
              prop="type"
            >
              <el-select
                v-model="dataForm.type"
                placeholder="请选择任务类型"
                :disabled="disabled"
                class="sbs-select"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="任务名称"
              prop="title"
            >
              <el-input
                v-model="dataForm.title"
                placeholder="请输入任务名称"
                :disabled="disabled"
                class="sbs-input"
              />
            </el-form-item>
            <el-form-item label="关联事件">
              <div
                v-if="eventDialogVisible"
                class="relateFrame"
              >
                <AddEventDialog
                  ref="AddEventDialogRef"
                  @close="eventDialogVisible=false"
                  @fresh="eventOptionsPage=0,getEventOptions()"
                  @openLocationDialog="openLocationDialog"
                />
              </div>
              <el-select
                v-else
                v-model="dataForm.eventTitle"
                placeholder="请选择关联事件"
                :disabled="disabled"
                class="sbs-select"
                style="width: 100%;"
                @change="changeEvent"
              >
                <el-option
                  v-show="false"
                  style="display: none;"
                />
                <div v-if="!eventDialogVisible">
                  <div style="width: 94%;display: inline-block;border-bottom: 1px solid #EBEDF0;margin-left: 14px;">
                    <p style="margin: 6px 0px 0px 7px;float: left;color:#646566;font-size: 15px;">
                      事件总数：{{ eventOptionsTotal }}
                    </p>
                    <el-button
                      type="text"
                      :disabled="disabled"
                      class="sbs-button"
                      style="margin-right: 11px;float: right;font-size: 15px;"
                      @click="openAddEventDialog"
                    >
                      新增
                    </el-button>
                  </div>
                  <el-option
                    v-for="item in eventOptions"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.title }}</span>
                    <span
                      v-if="item.id===dataForm.eventId"
                      style="float: right;color: #409eff;cursor: pointer;"
                      @click="cancelRelatedEvent"
                    >
                      取消关联
                    </span>
                  </el-option>
                  <el-button
                    class="sbs-button"
                    type="text"
                    style="margin-left: 19px;"
                    @click="getEventOptions"
                  >
                    加载更多
                  </el-button>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item label="任务地点">
              <el-input
                v-model="dataForm.address"
                placeholder="请选择任务地点"
                :disabled="disabled"
                class="sbs-input"
              />
            </el-form-item>
            <el-form-item label="任务时限">
              <el-select
                v-model="dataForm.timeLimitType"
                placeholder="请选择任务时限"
                :disabled="disabled"
                class="sbs-select"
              >
                <el-option
                  v-for="item in timeLimitOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <!-- 在当前条件下具体时限是多少 -->
              <el-select
                v-if="dataForm.timeLimitType > 1 && dataForm.timeLimitType < 6"
                v-model="dataForm.timeLimit"
                class="sbs-select"
                style="margin-left: 28px;"
                :disabled="disabled"
              >
                <el-option
                  v-for="item in returnList(dataForm.timeLimitType)"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <el-date-picker
                v-if="dataForm.timeLimitType > 5"
                v-model="dataForm.timeLimit"
                type="datetime"
                placeholder="选择日期时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                class="sbs-date-picker"
              />
              <div v-if="dataForm.timeLimitType > 1">
                <el-checkbox v-model="dataForm.warnOne" :disabled="disabled" label="站内告警" />
                <el-checkbox v-model="dataForm.warnTwo" :disabled="disabled" label="短信告警" />
                <el-checkbox v-model="dataForm.warnThree" :disabled="disabled" label="APP告警" />
              </div>
            </el-form-item>
            <!-- 任务提醒是否出现由任务时限决定 -->
            <el-form-item
              v-if="dataForm.timeLimitType > 1 && dataForm.timeLimitType < 6"
              label="任务提醒"
            >
              <el-select
                v-model="dataForm.alertTimeType"
                class="sbs-select"
                :disabled="disabled"
              >
                <el-option
                  v-for="item in alertOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-if="dataForm.alertTimeType > 8"
                v-model="dataForm.alertTime"
                type="datetime"
                placeholder="选择日期时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                class="sbs-date-picker"
                style="margin-left: 28px;"
                :disabled="disabled"
              />
              <div v-if="dataForm.alertTimeType > 1">
                <el-checkbox v-model="dataForm.remindOne" :disabled="disabled" label="站内告警" />
                <el-checkbox v-model="dataForm.remindTwo" :disabled="disabled" label="短信告警" />
                <el-checkbox v-model="dataForm.remindThree" :disabled="disabled" label="APP告警" />
              </div>
            </el-form-item>
            <el-form-item label="任务说明">
              <el-input
                v-model="dataForm.content"
                type="textarea"
                :rows="3"
                :disabled="disabled"
                class="sbs-input"
              />
            </el-form-item>
            <el-form-item label="附件">
              <el-upload
                action=""
                accept=".jpg, .jpeg, .png, .pdf, .doc"
                :http-request="uploadFileMethod"
                :on-preview="handlePreview"
                :file-list="dataForm.attachmentIds"
              >
                <el-button
                  v-if="!disabled"
                  class="sbs-button"
                  type="plain"
                  style="color: #95A5BB;"
                >
                  选择
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="负责人" prop="responsibleId">
              <span
                v-if="!disabled"
                class="el-upload__tip"
                style="color: #C8C9CC;float: right;"
              >
                注：仅支持设置一位负责人
              </span>
              <Contact
                ref="ContactRef"
                v-model:modelValue="dataForm.responsibleId"
                title=""
                :multiple="false"
                :detail="dataForm.responsiblePerson"
                :isDisabled="disabled"
                :taskId="dataForm.id"
                @change="handleResponsibleChange"
              />
            </el-form-item>
            <el-form-item label="参与人">
              <Contact
                ref="ContactRef"
                v-model:modelValue="dataForm.members"
                title=""
                :multiple="true"
                :isDisabled="disabled"
                :taskId="dataForm.id"
              />
            </el-form-item>
            <el-form-item label="抄送人">
              <Contact
                ref="ContactRef"
                v-model:modelValue="dataForm.cc"
                title=""
                :multiple="true"
                :isDisabled="disabled"
                :taskId="dataForm.id"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <TaskDynamic
            v-if="disabled"
            :taskId="dataForm.id"
            :ongoing="dataForm.statusName==='执行中'"
          />
          <Location
            v-else
            :address="dataForm.address"
            :lngLat="[dataForm.longitude, dataForm.latitude]"
            :displayOnly="disabled"
            @confirm="confirmLocation"
          />
        </div>
        <div v-if="disabled && (dataForm.statusName==='已取消' || dataForm.statusName==='已完成')" class="footer">
          <el-button class="sbs-button" @click="disabled=false" type="plain" style="color: #95A5BB;">编辑</el-button>
          <el-button class="sbs-button" type="primary" @click="reStart">重启任务</el-button>
        </div>
        <div v-else-if="disabled && dataForm.statusName==='执行中'" class="footer">
          <el-button class="sbs-button" @click="disabled=false" type="plain" style="color: #95A5BB;">编辑</el-button>
          <el-button class="sbs-button" type="danger" @click="cancelTask">取消任务</el-button>
          <el-button class="sbs-button" type="primary" @click="finishTask">完成任务</el-button>
        </div>
        <div v-else class="footer">
          <el-button class="sbs-button" @click="dialogVisible=false" type="plain" style="color: #95A5BB;">取消</el-button>
          <el-button class="sbs-button" type="primary" @click="submit">
            {{ isNewTask ? '发布' : '确定' }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import {
  ref,
  reactive,
  nextTick,
} from 'vue';
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import TaskDynamic from '../../../generalparts/TaskDynamic/TaskDynamic.vue';
import Location from '../../../generalparts/Location/Location.vue';
import Contact from '../../../generalparts/Temp/sv_select_contact.vue'; // 负责人联系人窗
import EntityLabel from '@/product/CommandBrain3.0/Generalparts/dialog/LabelManagement/EntityLabel.vue';
import AddEventDialog from './AddEventDialog.vue'; // 新增事件
import {
  getEventList,
  getTaskType,
  uploadFile,
} from './js/TaskManager';

const title = ref('发布任务'); // 标题
const dialogVisible = ref(false); // 开窗
const isNewTask = ref(false); // 编辑还是发布新的
const ContactRef: any = ref(null); // 联系人引用
const AddEventDialogRef: any = ref(null); // 新增事件引用
const dataForm: any = reactive({
  id: '', // 任务id
  labels: [], // 标签
  statusName: '', // 任务状态
  type: '', // 任务类型
  title: '', // 任务名称
  eventId: '', // 关联事件
  eventTitle: '', // 关联事件名字
  address: '', // 任务地点
  longitude: 0.0, // 经度
  latitude: 0.0, // 纬度
  timeLimitType: 1, // 任务时限
  alertTimeType: 1, // 任务提醒
  timeLimit: '', // 任务时限值是几
  alertTime: '', // 任务提醒自定义
  content: '', // 任务说明
  attachmentIds: [], // 附件
  responsiblePerson: null, // 负责人
  responsibleId: 0, // 负责人id
  responsibleGroupId: 0, // 负责人组id
  members: [], // 参与人
  cc: [], // 抄送人
  remindOne: true, // 任务提醒站内告警
  remindTwo: true, // 任务提醒短信告警
  remindThree: true, // 任务提醒app告警
  warnOne: true, // 任务时限站内告警
  warnTwo: true, // 任务时限短信告警
  warnThree: true, // 任务时限app告警
  modeType: 0, // 当前任务的modeType
}); // 表单
const dataRule = ref({
  type: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
  title: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
  responsibleId: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
  modeType: [
    { required: true, message: '不能为空', trigger: 'blur' },
  ],
}); // 规则
const disabled = ref(false); // 查看还是编辑
const typeOptions = ref([]); // 任务类型
const eventOptions: any = ref([]); // 关联事件
const eventOptionsTotal = ref(0); // 事件列表长度
const eventOptionsPage = ref(0); // 关联事件第几页
const timeLimitOptions = ref([
  {
    id: 1,
    name: '无时限',
  },
  {
    id: 2,
    name: '分钟',
  },
  {
    id: 3,
    name: '小时',
  },
  {
    id: 4,
    name: '天',
  },
  {
    id: 5,
    name: '月',
  },
  {
    id: 6,
    name: '自定义',
  },
]); // 任务时限
const alertOptions = ref([
  {
    id: 1,
    name: '不提醒',
  },
  {
    id: 2,
    name: '任务截止前15分钟',
  },
  {
    id: 3,
    name: '任务截止前30分钟',
  },
  {
    id: 4,
    name: '任务截止前1小时',
  },
  {
    id: 5,
    name: '任务截止前2小时',
  },
  {
    id: 6,
    name: '任务截止前1天',
  },
  {
    id: 7,
    name: '任务截止前2天',
  },
  {
    id: 8,
    name: '任务截止前3天',
  },
  {
    id: 9,
    name: '自定义',
  },
]); // 任务告警
const dataFormRef: any = ref(null);
const eventDialogVisible = ref(false); // 新增事件
const emit = defineEmits([
  'fresh',
  'openLocationDialog',
]);
// 把当前事件赋给结果
const changeEvent = (val: any) => {
  dataForm.eventId = val;
};
// 定位赋值
const confirmLocation = (currentAddress: any, currentLngLat: any, spotInfo: any) => {
  dataForm.address = currentAddress;
  dataForm.longitude = currentLngLat[0];
  dataForm.latitude = currentLngLat[1];
};
// 获取任务类型
const getTypeOptions = () => {
  getTaskType().then((response: any) => {
    typeOptions.value = response.data;
    if (!dataForm.type) dataForm.type = response.data[0].id; // 默认类型为自定义任务
  });
};
// 获取关联事件
const getEventOptions = () => {
  eventOptionsPage.value ++;
  getEventList(10, eventOptionsPage.value, '').then((response: any) => {
    eventOptions.value.push(...response.data.data);
    eventOptionsTotal.value = response.data.totalElements;
  });
};
// 点击关联事件新增
const openAddEventDialog = () => {
  eventDialogVisible.value = true;
};
// 取消关联
const cancelRelatedEvent = () => {
  const request: any = {
    method: 'post',
    url: '/event/task/batchLinkEvent',
    service: 'eoc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      eventId: 0,
      taskIds: [dataForm.id],
    },
  };
  $http(request).then((response) => {
    if (response.errorcode === 0) {
      ElMessage({
        type: 'success',
        message: '取消关联事件成功!',
      });
      dataForm.eventId = '';
      // emit('fresh'); // 马上刷新任务列表
    }
  });
};
// 根据时限的类型返回对应列表
const returnList = (type: any) => {
  switch (type) {
    case 2:
      return [30, 35, 40, 45, 50, 55, 60];
    case 3:
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24];
    case 4:
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    case 5:
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    default:
      return [];
  }
};
const openLocationDialog = () => {
  emit('openLocationDialog', 0.0, 0.0, '');
};
const handleResponsibleChange = (id: number, obj: any) => {
  dataForm.responsibleGroupId = obj?.groupId;
};
// 任务详情
const getTaskDetail = (id: number) => {
  dataForm.id = id;
  const request: any = {
    method: 'post',
    service: 'eoc',
    url: '/event/task/getTaskDetail',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      taskId: id,
    },
  };
  $http(request).then((response: any) => {
    if (response.errorcode === 0) {
      dataForm.id = response.data?.id || '';
      dataForm.statusName = response.data?.statusName || '';
      dataForm.address = response.data?.address || '';
      dataForm.cc = response.data?.cc || [];
      dataForm.content = response.data?.content || '';
      dataForm.eventId = response.data?.eventId || '';
      dataForm.eventTitle = response.data?.eventTitle || '';
      dataForm.labels = response.data?.labels || [];
      dataForm.latitude = response.data?.latitude || 0.0;
      dataForm.longitude = response.data?.longitude || 0.0;
      dataForm.members = response.data?.member || [];
      dataForm.responsiblePerson = response.data?.responsiblePerson || null;
      dataForm.responsibleId = response.data?.responsiblePerson?.id || 0;
      dataForm.title = response.data?.title || '';
      dataForm.type = response.data?.type || '';
      dataForm.alertTime = response.data?.alertTime || '';
      dataForm.alertTimeType = response.data?.alertTimeType || 1;
      dataForm.timeLimit = response.data?.timeLimit || '';
      dataForm.timeLimitType = response.data?.timeLimitType || 1;
      dataForm.startTimeType = 1;
      dataForm.modeType = response.data?.modeType || 0;
      if (response.data?.appAttachments) {
        dataForm.appAttachments = response.data.appAttachments;
        dataForm.appAttachments.forEach((el: any) => {
          el.name = el.title;
        });
      } else dataForm.appAttachments = [];
      dataForm.overtimeAlertWay = response.data?.overtimeAlertWay
        ? [response.data.overtimeAlertWay[0], response.data.overtimeAlertWay[2], response.data.overtimeAlertWay[4]]
        : [];
      dataForm.alertWay = response.data?.alertWay
        ? [response.data.alertWay[0], response.data.alertWay[2], response.data.alertWay[4]]
        : [];
    }
  });
};
// 附件
const uploadFileMethod = (param: any) => {
  const formData = new FormData();
  formData.append('files', param.file);// 参数规整
  formData.append('type', '11'); // 11是附件
  uploadFile(formData).then((response: any) => {
    if (response.errorcode === 0) {
      dataForm.attachmentIds = response.data || [];
    }
  });
};
const handlePreview = (file: any) => {
  axios({
    url: `${(window as any).config.baseURL}/fileupload/appAttachment/download?appAttachmentId=${file.id}&isForceDownload=1`,
    method: 'get',
    headers: {
      token: (window as any).globalToken || document.cookie.match(/token=([^;]*)/)?.[1],
      'Content-Type': 'application/json; charset=utf-8',
    },
    responseType: 'arraybuffer',
  }).then((response: any) => {
    if (response) {
      const a = document.createElement('a');
      a.target = '_blank';
      a.download = file.name;
      a.href = window.URL.createObjectURL(new Blob([response.data]));
      a.click();
    }
  });
};

// 取消任务
const cancelTask = () => {
  ElMessageBox.prompt('是否取消任务?', '取消任务', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then(({ value }) => {
    const a1: any = [];
    dataForm.attachmentIds.forEach((el: any) => {
      a1.push(el.id);
    });
    const request: any = {
      method: 'post',
      url: '/event/task/setTaskStatus',
      service: 'eoc',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        taskId: dataForm.id,
        status: 'cancel',
        operation: 'cancel',
        data: {
          address: dataForm.address,
          attachmentIds: a1,
          latitude: dataForm.latitude,
          longitude: dataForm.longitude,
          content: value,
        },
      },
    };
    $http(request).then((response: any) => {
      if (response.errorcode === 0) {
        ElMessage({
          type: 'success',
          message: '取消任务成功!',
        });
        emit('fresh'); // 马上刷新任务列表
        dialogVisible.value = false;
      }
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消操作',
    });
  });
};
// 完成任务
const finishTask = () => {
  ElMessageBox.prompt('是否完成任务?', '完成任务', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then(({ value }) => {
    const a1: any = [];
    dataForm.attachmentIds.forEach((el: any) => {
      a1.push(el.id);
    });
    const request: any = {
      method: 'post',
      url: '/event/task/setTaskStatus',
      service: 'eoc',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        taskId: dataForm.id,
        status: 'finish',
        operation: 'finish',
        data: {
          address: dataForm.address,
          attachmentIds: a1,
          latitude: dataForm.latitude,
          longitude: dataForm.longitude,
          content: value,
        },
      },
    };
    $http(request).then((response: any) => {
      if (response.errorcode === 0) {
        ElMessage({
          type: 'success',
          message: '完成任务成功!',
        });
        emit('fresh'); // 马上刷新任务列表
        dialogVisible.value = false;
      }
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消操作',
    });
  });
};
// 重启任务
const reStart = () => {
  title.value = '重启任务';
  disabled.value = false;
};
// 发布
const submit = () => {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      const a1: any = {
        groupId: dataForm.responsibleGroupId,
        contactorId: dataForm.responsibleId,
      };
      const a2: any = [];
      dataForm.members.forEach((el: any) => {
        a2.push({
          groupId: el?.groupId || 0,
          contactorId: el.id,
        });
      });
      const a3: any = [];
      dataForm.cc.forEach((el: any) => {
        a3.push({
          groupId: el?.groupId || 0,
          contactorId: el.id,
        });
      });
      const a4: any = [];
      dataForm.labels.forEach((el: any) => {
        a4.push(el.id);
      });
      const a5: any = [];
      dataForm.attachmentIds.forEach((el: any) => {
        a5.push(el.id);
      });
      let options: any = {
        id: dataForm.id,
        address: dataForm.address,
        attachmentIds: a5,
        content: dataForm.content,
        createUserId: '', // 忽略
        startTimeType: 1, // 执行时间即时1定时2
        startTime: '', // 定时任务需要传
        endTime: '', // 定时任务需要传
        eventId: dataForm.eventId,
        labels: a4,
        latitude: dataForm.latitude,
        longitude: dataForm.longitude,
        responsiblePerson: a1,
        members: a2,
        cc: a3,
        title: dataForm.title, // 任务标题
        type: dataForm.type, // 任务类型
        alertTime: dataForm.alertTime, // 任务提醒-自定义-日期
        alertTimeType: dataForm.alertTimeType,
        timeLimit: dataForm.timeLimit,
        timeLimitType: dataForm.timeLimitType,
        overtimeAlertWay: (dataForm.warnOne?'1,':'0,')+(dataForm.warnTwo?'2,':'0,')+(dataForm.warnThree?'3':'0'),
        alertWay: (dataForm.remindOne?'1,':'0,')+(dataForm.remindTwo?'2,':'0,')+(dataForm.remindThree?'3':'0'),
        allocations: [],
        modeType: dataForm.modeType,
      };
      const request: any = {
        method: 'post',
        url: '/event/task/saveTask',
        service: 'eoc',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          data: options,
        },
      };
      if (title.value === '重启任务') {
        ElMessageBox.prompt('是否重启任务?', '重启任务', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          options = {
            ...options,
            isRestart: 1,
            restartContent: value, // 重启任务说明
          }
          $http(request).then((response: any) => {
            if (response.errorcode === 0) {
              ElMessage({
                type: 'success',
                message: '重启成功!',
              });
              emit('fresh'); // 马上刷新任务列表
              dialogVisible.value = false;
              title.value = '发布任务';
            }
          });
        }).catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消重启',
          });
          title.value = '发布任务';
        });
      } else {
        $http(request).then((response: any) => {
          if (response.errorcode === 0) {
            ElMessage({
              type: 'success',
              message: '发布成功!',
            });
            emit('fresh'); // 马上刷新任务列表
            dialogVisible.value = false;
            title.value = '发布任务';
          }
        });
      }
    }
  });
};
const initContact = () => {
  nextTick(() => {
    ContactRef.value.init();
  });
};
const initLocation = (obj: any) => {
  nextTick(() => {
    AddEventDialogRef.value.dataForm.locationLongitude = obj?.longitude;
    AddEventDialogRef.value.dataForm.locationLatitude = obj?.latitude;
    AddEventDialogRef.value.dataForm.locationAddress = obj?.address;
  });
};
defineExpose({
  dialogVisible,
  disabled,
  dataForm,
  getEventOptions,
  getTypeOptions,
  eventOptions,
  eventOptionsPage,
  isNewTask,
  initContact,
  initLocation,
  getTaskDetail,
});
</script>

<style lang="scss" scoped>
.relateFrame {
  width: 85%;
  height: 200px;
  padding: 5px 25px;
  box-shadow: 0px 2px 11px 1px #e4e7ed;
  overflow-y: auto;
  overflow-x: hidden;
  // 滚动条
  &::-webkit-scrollbar {
    width: 2px;
    height: 5px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #DDDDDD;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
.footer {
  float: right;
  margin: 37px 4px 0px 0px;
}
.left {
  width: 57%;
  height: 90%;
  overflow-y: auto;
  overflow-x: hidden;
  float: left;
  padding-right: 10px;
  // 滚动条
  &::-webkit-scrollbar {
    width: 2px;
    height: 5px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #DDDDDD;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
.right {
  width: 40%;
  height: 90%;
  float: right;
}
</style>