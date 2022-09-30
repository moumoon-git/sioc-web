<template>
  <div>
    <div v-loading="isLoading" class="task-publish-dialog">
      <!-- 顶部标签 -->
      <header>
        <TabList
          :list="tabList.map((tab) => tab.name)"
          :active-index="activeTabIndex"
          @switch="handleTabSwitch"
        />
      </header>
      <main>
        <!-- 左边栏 -->
        <div class="task-publish-dialog__left">
          <div>
            <span>任务标签：</span>
            <div
              style="
                border: 1px solid rgba(255, 255, 255, 0.65);
                padding: 5px 5px 0 5px;
                z-index: 1;
              "
            >
              <EntityLabel
                v-model="selectedTaskLabelList"
              />
            </div>
          </div>
          <div>
            <span>任务名称：</span>
            <div>
              <Input
                v-model="taskName"
                style="width: 100%"
                placeholder="请输入任务名称"
              />
            </div>
          </div>
          <div>
            <span>任务地点：</span>
            <div>
              <Input
                v-model="taskLocation"
                class="task-publish-dialog__left__address"
                :readonly="true"
                placeholder="点击选择地址"
                @click="pickLocation"
              />
            </div>
          </div>
          <div>
            <span>执行时间：</span>
            <div>
              <!-- :list="['即时', '定时']" -->
              <Select
                v-model="executionTimeIndex"
                :clearable="false"
                style="height: 32px; width: 156px"
                :list="['即时']"
              />
              <!-- 日期选择器 -->
              <DatePicker
                v-if="executionTimeIndex === 1"
                v-model="executionTimeDate"
                :min="executionTimeMinDate"
                style="margin: 0 10px"
              />
              <!-- 时间选择器 -->
              <TimePicker
                v-if="executionTimeIndex === 1"
                v-model="executionTimeClock"
              />
            </div>
          </div>
          <div>
            <span>任务时限：</span>
            <div>
              <Select
                v-model="taskLimitIndex"
                :clearable="false"
                style="height: 32px; width: 156px"
                :list="['无时限', '分钟', '小时', '天', '月', '自定义']"
              />
              <template v-if="taskLimitIndex === 5">
                <!-- 日期选择器 -->
                <DatePicker
                  v-model="taskLimitTimeDate"
                  :min="executionTimeMinDate"
                  style="margin: 0 10px"
                />
                <!-- 时间选择器 -->
                <TimePicker v-model="taskLimitTimeClock" />
              </template>
              <Select
                v-else-if="taskLimitIndex !== 0"
                v-model="taskLimitDetailIndex"
                :clearable="false"
                style="height: 32px; width: 80px; margin-left: 10px"
                :list="taskLimitDetailOptions"
              />
              <div v-if="taskLimitIndex !== 0" style="margin-top: 10px">
                <span
                  :class="[
                    'task-publish-dialog__checkbox',
                    {
                      'task-publish-dialog__checkbox--checked':
                        taskLimitCheckbox[0],
                    },
                  ]"
                  @click="taskLimitCheckbox[0] = !taskLimitCheckbox[0]"
                  >站内告警</span
                >
                <span
                  :class="[
                    'task-publish-dialog__checkbox',
                    {
                      'task-publish-dialog__checkbox--checked':
                        taskLimitCheckbox[1],
                    },
                  ]"
                  @click="taskLimitCheckbox[1] = !taskLimitCheckbox[1]"
                  >短信告警</span
                >
                <span
                  :class="[
                    'task-publish-dialog__checkbox',
                    {
                      'task-publish-dialog__checkbox--checked':
                        taskLimitCheckbox[2],
                    },
                  ]"
                  @click="taskLimitCheckbox[2] = !taskLimitCheckbox[2]"
                  >APP告警</span
                >
              </div>
            </div>
          </div>
          <div v-if="taskLimitIndex !== 0">
            <span>任务提醒：</span>
            <div>
              <Select
                v-model="taskReminderIndex"
                :clearable="false"
                style="height: 32px; width: 156px"
                :list="taskReminderOptions"
              />
              <!-- 日期选择器 -->
              <DatePicker
                v-if="taskReminderIndex === 8"
                v-model="taskReminderDate"
                :min="executionTimeMinDate"
                style="margin: 0 10px"
              />
              <!-- 时间选择器 -->
              <TimePicker
                v-if="taskReminderIndex === 8"
                v-model="taskReminderClock"
              />
              <div v-if="taskReminderIndex !== 0" style="margin-top: 10px">
                <span
                  :class="[
                    'task-publish-dialog__checkbox',
                    {
                      'task-publish-dialog__checkbox--checked':
                        taskReminderCheckbox[0],
                    },
                  ]"
                  @click="taskReminderCheckbox[0] = !taskReminderCheckbox[0]"
                  >站内告警</span
                >
                <span
                  :class="[
                    'task-publish-dialog__checkbox',
                    {
                      'task-publish-dialog__checkbox--checked':
                        taskReminderCheckbox[1],
                    },
                  ]"
                  @click="taskReminderCheckbox[1] = !taskReminderCheckbox[1]"
                  >短信告警</span
                >
                <span
                  :class="[
                    'task-publish-dialog__checkbox',
                    {
                      'task-publish-dialog__checkbox--checked':
                        taskReminderCheckbox[2],
                    },
                  ]"
                  @click="taskReminderCheckbox[2] = !taskReminderCheckbox[2]"
                  >APP告警</span
                >
              </div>
            </div>
          </div>
          <div>
            <span>任务说明：</span>
            <div style="font-size: 0">
              <Textarea
                v-model="taskDescription"
                style="width: 100%; height: 90px"
                placeholder="请输入任务说明"
              />
            </div>
          </div>
          <!-- 为物资调拨的按钮时 -->
          <div v-show="activeTabIndex === 3 || activeTabIndex === 4">
            <span>
              {{ `${activeTabIndex === 3 ? '调拨资源：' : '装备资源：'}` }}
            </span>
            <div>
              <button :class="$style.resAllocationBtn" @click="resAllocation()">
                {{ `${activeTabIndex === 3 ? '调拨调拨' : '装备调拨'}` }}
              </button>
              <HandleMaterial
                @setMapCenters="setMapCenters"
                @changeHouseArr="changeHouseArr"
                :list-data="selectedMaterialsData"
              />
            </div>
          </div>

          <div>
            <span>任务附件：</span>
            <div>
              <Upload v-model="taskAttachments" />
            </div>
          </div>
        </div>
        <!-- 右边栏 -->
        <div class="task-publish-dialog__right">
          <!-- 负责人 -->
          <div>
            <h3>
              <span>负责人：</span>
              <button @click="handleSelect(1)">选择</button>
              <span>
                已选
                <strong>{{ selectedResponsiblePerson?.length || 0 }}</strong>
              </span>
            </h3>
            <ul>
              <li
                v-for="(
                  responsiblePerson, responsiblePersonIndex
                ) in selectedResponsiblePerson"
                :key="responsiblePersonIndex"
              >
                <div>
                  {{ responsiblePerson?.name || '未知' }}（{{
                    responsiblePerson?.workUnit || '暂无单位信息'
                  }}/{{ responsiblePerson?.position || '暂无职位信息' }}）
                </div>
                <button
                  @click="
                    selectedResponsiblePerson.splice(
                      responsiblePersonIndex,
                      1,
                    )
                  "
                />
              </li>
            </ul>
          </div>
          <!-- 参与人 -->
          <div>
            <h3>
              <span>参与人：</span>
              <button @click="handleSelect(2)">选择</button>
              <span>
                已选
                <strong>{{ selectedParticipants?.length || 0 }}</strong>
              </span>
            </h3>
            <ul>
              <li
                v-for="(
                  participant, participantIndex
                ) in selectedParticipants"
                :key="participantIndex"
              >
                <div>
                  {{ participant?.name || '未知' }}（{{
                    participant?.workUnit || '暂无单位信息'
                  }}/{{ participant?.position || '暂无职位信息' }}）
                </div>
                <button
                  @click="selectedParticipants.splice(participantIndex, 1)"
                />
              </li>
            </ul>
          </div>
          <!-- 抄送人 -->
          <div>
            <h3>
              <span>抄送人：</span>
              <button @click="handleSelect(3)">选择</button>
              <span>
                已选
                <strong>{{ selectedCopytoPerson?.length || 0 }}</strong>
              </span>
            </h3>
            <ul>
              <li
                v-for="(
                  copytoPerson, copytoPersonIndex
                ) in selectedCopytoPerson"
                :key="copytoPersonIndex"
              >
                <div>
                  {{ copytoPerson?.name || '未知' }}（{{
                    copytoPerson?.workUnit || '暂无单位信息'
                  }}/{{ copytoPerson?.position || '暂无职位信息' }}）
                </div>
                <button
                  @click="selectedCopytoPerson.splice(copytoPersonIndex, 1)"
                />
              </li>
            </ul>
          </div>
        </div>
      </main>
      <!-- 底部按钮 -->
      <footer>
        <Button type="ghost" @click="handleClose"> 取消 </Button>
        <Button type="primary" @click="handleConfirm"> 确定 </Button>
      </footer>
    </div>
  </div>
  <!-- 选择联系人弹窗 -->
  <SelectContactDialog
    ref="SelectContactDialog"
    v-model="selectedContact"
    :multiple="contactType === 1 ? false : true"
  />
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import TabList from '@/product/CommandBrain3.0/Generalparts/dialog/TabList/TabList.vue';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue';
import Select from '@/product/CommandBrain3.0/Generalparts/dialog/Select/Select.vue';
import Input from '@/product/CommandBrain3.0/Generalparts/dialog/Input/Input.vue';
import Textarea from '@/product/CommandBrain3.0/Generalparts/dialog/Textarea/Textarea.vue';
import DatePicker from '@/product/CommandBrain3.0/Generalparts/dialog/DatePicker/DatePicker.vue';
import TimePicker from '@/product/CommandBrain3.0/Generalparts/dialog/TimePicker/TimePicker.vue';
import Upload from '@/product/CommandBrain3.0/Generalparts/dialog/Upload/Upload.vue';
import SelectContactDialog from '@/product/CommandBrain3.0/Generalparts/dialog/SelectContactDialog/SelectContactDialog.vue';
import ResAllocation from '@/product/CommandBrain3.0/FunModule/TaskSchedule/ResAllocation/ResAllocation.vue';
import HandleMaterial from '@/product/CommandBrain3.0/FunModule/TaskSchedule/ResAllocation/components/HandleMaterial.vue';
import EntityLabel from '@/product/CommandBrain3.0/Generalparts/dialog/LabelManagement/EntityLabel.vue';

export default defineComponent({
  name: 'TaskPublishDialogInner',
  components: {
    // 标签列表
    TabList,
    // 按钮
    Button,
    // 选择器
    Select,
    // 输入框
    Input,
    // 文本框
    Textarea,
    // 日期选择器
    DatePicker,
    // 时间选择器
    TimePicker,
    // 附件上传
    Upload,
    // 标签列表模块
    EntityLabel,
    // 选择联系人弹窗
    SelectContactDialog,
    // 资源调度数据展示
    HandleMaterial,
  },
  inject: ['$addDialog'],
  props: {
    // 弹窗操作
    operation: {
      type: Object,
      default: () => ({}),
    },
    // 初始已选的负责人
    initSelectedResponsiblePerson: {
      type: Array,
      default: () => [],
    },
    // 刷新
    refresh: {
      type: Function,
      default: () => () => {
        console.log('missing refresh callback.');
      },
    },
    // 编辑或重启任务时的任务id
    taskId: {
      type: Number,
      default: 0,
    },
    // 是否重启任务
    isRestart: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 编辑时的事件id
      eventId: 0,
      // 载入中
      isLoading: false,
      // 标签列表
      tabList: [] as any,
      // 当前激活的标签下标
      activeTabIndex: 0,
      // 任务名称
      taskName: '',
      // 任务地点
      taskLocation: '',
      // 任务地点经纬度
      taskLngLat: [0, 0],
      // 执行时间
      executionTimeIndex: 0,
      // 执行时间-日期
      executionTimeDate: '',
      // 执行时间-日期-最小值
      executionTimeMinDate: this.getTodayDate(),
      // 执行时间-时间
      executionTimeClock: '',
      // 任务时限
      taskLimitIndex: 0,
      // 任务时限-详细选项
      taskLimitDetailIndex: 0,
      // 任务时限-自定义-日期
      taskLimitTimeDate: '',
      // 任务时限-自定义-时间
      taskLimitTimeClock: '',
      // 任务时限-勾选框
      taskLimitCheckbox: [true, true, true],
      // 任务提醒
      taskReminderIndex: 0,
      // 任务提醒-选项
      taskReminderOptions: [
        '不提醒',
        '任务截止前15分钟',
        '任务截止前30分钟',
        '任务截止前1小时',
        '任务截止前2小时',
        '任务截止前1天',
        '任务截止前2天',
        '任务截止前3天',
        '自定义',
      ],
      // 任务提醒-勾选框
      taskReminderCheckbox: [true, true, true],
      // 任务提醒-自定义-日期
      taskReminderDate: '',
      // 任务提醒-自定义-时间
      taskReminderClock: '',
      // 任务说明
      taskDescription: '',
      // 任务附件
      taskAttachments: [],
      // 选中的任务标签列表
      selectedTaskLabelList: [] as any,
      // 选择联系人组件绑定值
      selectedContact: [] as any,
      contactType: 0,
      // 已选负责人
      selectedResponsiblePerson: [] as any,
      // 已选参与人
      selectedParticipants: [] as any,
      // 已选抄送人
      selectedCopytoPerson: [] as any,
      // 物资调拨显示的数据
      selectedMaterialsData: [] as any,
    };
  },
  computed: {
    // 任务时限-详细选项
    taskLimitDetailOptions() {
      switch (this.taskLimitIndex) {
        // 分钟
        case 1: {
          return [30, 35, 40, 45, 50, 55, 60];
        }
        // 小时
        case 2: {
          return [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24,
          ];
        }
        // 天
        case 3: {
          return [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
          ];
        }
        // 月
        case 4: {
          return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
        default: {
          return [];
        }
      }
    },
    resAllocationData() {
      return (this as any).$store.state.resAllocation.resAllocationData;
    },
  },
  watch: {
    // 执行时间 -> 改为即时 -> 重置定时选的值
    executionTimeIndex() {
      this.executionTimeDate = '';
      this.executionTimeClock = '';
    },
    taskLimitIndex(val) {
      this.taskLimitDetailIndex = 0;
      // 任务时限重新选择无时限时，重置任务提醒的值
      if (val === 0) {
        this.taskReminderIndex = 0;
        this.taskReminderCheckbox = [true, true, true];
        this.taskLimitCheckbox = [true, true, true];
      }
    },
    taskReminderIndex(val) {
      if (val === 0) {
        this.taskReminderCheckbox = [true, true, true];
      }
      if (val !== 8) {
        this.taskReminderDate = '';
        this.taskReminderClock = '';
      }
    },
    resAllocationData(val) {
      console.log(val);
      (this as any).selectedMaterialsData = val;
    },
    selectedContact: {
      deep: true,
      handler(val) {
        switch (this.contactType) {
          case 1: {
            this.selectedResponsiblePerson = [...val];
            break;
          }
          case 2: {
            this.selectedParticipants = [...val];
            break;
          }
          case 3: {
            this.selectedCopytoPerson = [...val];
            break;
          }
          default:
        }
      },
    },
  },
  created() {
    // 需要先获取完任务类型列表，才获取编辑时的任务详情，才能计算出正确的 tab 下标
    // @see 华为 BUG2021090466796
    this.getTabList().then(() => {
      if (this.taskId) {
        this.getTaskInfo();
      }
    });
  },
  mounted() {
    if (this.initSelectedResponsiblePerson.length) {
      this.selectedResponsiblePerson = [...this.initSelectedResponsiblePerson];
    }
  },
  beforeUnmount() {
    const mapInstance = (window as any).map;
    mapInstance.clearAtPresentMarkData('MapClickMarker');
  },
  methods: {
    /**
     * 获取任务类型列表
     */
    getTabList() {
      return new Promise((resolve) => {
        const request = {
          method: 'post',
          service: 'eoc',
          url: '/emergency/preparation/dictionary/getByParentCode',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            pcode: 'event_task_type',
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.code === 0) {
            this.tabList = response?.data || [];
            if (!this.tabList.length) {
              throw new Error('列表为空');
            }
            resolve(response);
          } else {
            this.$message.error(`获取任务类型列表失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error: Error) => {
          this.$message.error(`获取任务类型列表失败，错误信息：${error}`);
        });
      });
    },
    /**
     * 获取任务详情
     */
    getTaskInfo() {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/event/task/getTaskDetail',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          taskId: this.taskId,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0) {
          this.taskLocation = response.data.address;
          this.taskAttachments = (response.data.appAttachments || []).map(
            (i: any) => ({
              id: i.id,
              name: i.title,
              url: i.url,
            }),
          );
          this.selectedCopytoPerson = response.data.cc;
          this.taskDescription = response.data.content;
          this.eventId = response.data.eventId;
          this.selectedTaskLabelList = response.data.labels || [];
          this.taskLngLat = [response.data.longitude, response.data.latitude];
          this.selectedParticipants = response.data.member || [];
          this.selectedResponsiblePerson = [response.data.responsiblePerson];
          [this.executionTimeDate, this.executionTimeClock] =
            response.data.startTime?.split(' ') || ['', ''];
          this.taskName = response.data.title;
          this.activeTabIndex = this.tabList.findIndex(
            (i: any) => i.id === response.data.type,
          ) || 0;
          [this.taskReminderDate, this.taskReminderClock] =
            response.data.alertTime?.split(' ') || ['', ''];
          this.taskReminderIndex = response.data.alertTimeType - 1;
          this.taskReminderCheckbox = [false, false, false];
          response.data.alertWay?.split(',')?.forEach((i: any) => {
            this.taskReminderCheckbox[i - 1] = true;
          });
          this.taskLimitIndex = response.data.timeLimitType - 1;
          this.executionTimeIndex = response.data.startTimeType - 1;
          this.taskLimitCheckbox = [false, false, false];
          response.data.overtimeAlertWay?.split(',')?.forEach((i: any) => {
            this.taskLimitCheckbox[i - 1] = true;
          });
          if (this.taskLimitIndex === 5) {
            this.taskLimitDetailIndex = this.taskLimitDetailOptions.findIndex(
              (i: any) => i === response.data.timeLimit,
            );
          } else {
            [this.taskLimitTimeDate, this.taskLimitTimeClock] =
              response.data.timeLimit?.split(' ') || ['', ''];
          }
        } else {
          this.$message.error(
            `获取任务详情失败，错误代码${response.errorcode}，错误信息：${response.msg}`,
          );
        }
      });
      // .catch((error: Error) => {
      //   this.$message.error(`获取任务详情失败，错误信息：${error}`);
      // });
    },
    /**
     * 切换标签
     */
    handleTabSwitch(index: number) {
      (this as any).activeTabIndex = index;
      (this as any).$store.commit(
        'resAllocation/SET_resAllocationData',
        [],
      );
    },
    /**
     * 选择任务地点
     */
    pickLocation() {
      const mapInstance = (window as any).map;
      (this as any).$message.info('请点击地图选择地点');
      // 隐藏弹窗
      if (this.operation.hide) {
        this.operation.hide();
      }
      // 清空上一次绘制的落点和图层
      mapInstance.clearAtPresentMarkData('MapClickMarker');
      mapInstance.clearDeleteCoverage('MapClickMarker');
      // 开启点击地图获取地址、经纬度的功能
      mapInstance.setMouseStyle(require('./assets/location.svg'));
      mapInstance.clickDroppoint(
        (clickInfo: {
          mapLocation: {
            lon: number;
            lat: number;
          };
          res: {
            result: {
              formatted_address: string;
            };
          };
        }) => {
          // 关闭点击地图获取地址、经纬度的功能
          mapInstance.closeClickDroppoint();
          mapInstance.restoreDefaultStyle();
          // 获取到地址、经纬度
          this.taskLocation = clickInfo.res.result.formatted_address;
          this.taskLngLat = [
            clickInfo.mapLocation.lon,
            clickInfo.mapLocation.lat,
          ];
          // 绘制地点坐标
          mapInstance.createdMarkCoverage('MapClickMarker').then(() => {
            mapInstance.setOneMarker('MapClickMarker', {
              longitude: clickInfo.mapLocation.lon,
              latitude: clickInfo.mapLocation.lat,
              wd: 30,
              hg: 30,
              src: require('./assets/location.svg'),
            });
            // 取消隐藏弹窗
            if (this.operation.unhide) {
              this.operation.unhide();
            }
          });
        },
      );
    },
    /**
     * 计算今日的日期：yyyy-mm-dd
     */
    getTodayDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month > 9 ? month : `0${month}`}-${
        day > 9 ? day : `0${day}`
      }`;
    },
    /**
     * 新增标签
     *
     * @param {Object} label 标签对象
     */
    handleAddLabel(label: any) {
      this.selectedTaskLabelList.push(label);
    },
    /**
     * 选择联系人
     *
     * @param {Number} flag 类型：1-负责人，2-参与人，3-抄送人
     */
    handleSelect(flag: number) {
      this.contactType = flag;
      switch (flag) {
        case 1: {
          this.selectedContact = [...this.selectedResponsiblePerson];
          break;
        }
        case 2: {
          this.selectedContact = [...this.selectedParticipants];
          break;
        }
        case 3: {
          this.selectedContact = [...this.selectedCopytoPerson];
          break;
        }
        default: {
          this.selectedContact = [];
        }
      }
      (this as any).$refs.SelectContactDialog.open();
    },
    /**
     * 关闭弹窗
     */
    handleClose() {
      if (this.operation.close) {
        this.operation.close();
      }
      this.taskName = '';
      this.taskLocation = '';
      this.taskLngLat = [0, 0];
      this.executionTimeIndex = 0;
      this.executionTimeDate = '';
      this.executionTimeClock = '';
      this.taskLimitIndex = 0;
      this.taskLimitDetailIndex = 0;
      this.taskLimitCheckbox = [true, true, true];
      this.taskLimitTimeDate = '';
      this.taskLimitTimeClock = '';
      this.taskReminderIndex = 0;
      this.taskReminderCheckbox = [true, true, true];
      this.taskReminderDate = '';
      this.taskReminderClock = '';
      this.taskDescription = '';
      this.taskAttachments = [];
      this.selectedTaskLabelList = [];
      this.selectedContact = [];
      this.selectedResponsiblePerson = [];
      this.selectedParticipants = [];
      this.selectedCopytoPerson = [];
    },
    /**
     * 确认发布
     */
    async handleConfirm() {
      if (!this.validate()) {
        return;
      }
      let restartContent = '';
      if (this.isRestart) {
        restartContent = await this.$MessageBox({
          type: 'delete',
          title: '提示',
          message: '确认重启任务？',
          tips: '',
          remark: true,
        });
      }
      const request: any = {
        method: 'post',
        service: 'eoc',
        url: '/event/task/saveTask',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          data: {
            id: this.taskId || undefined,
            address: this.taskLocation,
            attachmentIds: this.taskAttachments.map(
              (file: { id: number }) => file.id,
            ),
            cc: this.selectedCopytoPerson.map((contact: any) => ({
              groupId: contact?.groupId,
              contactorId: contact?.id,
            })),
            content: this.taskDescription,
            eventId: this.eventId || (this as any).$store.state.event?.id,
            labels: this.selectedTaskLabelList.map((item: any) => item.id),
            latitude: this.taskLngLat[1],
            longitude: this.taskLngLat[0],
            members: this.selectedParticipants.map((contact: any) => ({
              groupId: contact?.groupId,
              contactorId: contact?.id,
            })),
            responsiblePerson: this.selectedResponsiblePerson.map(
              (contact: any) => ({
                groupId: contact?.groupId,
                contactorId: contact?.id,
              }),
            )?.[0],
            startTime: `${this.executionTimeDate} ${this.executionTimeClock}`,
            title: this.taskName,
            type: this.tabList[this.activeTabIndex]?.id,
            alertTime: `${this.taskReminderDate} ${this.taskReminderClock}`,
            alertTimeType: this.taskReminderIndex + 1,
            alertWay: this.taskReminderCheckbox
              .map((item, index) => ({
                value: index + 1,
                true: item,
              }))
              .filter((item) => item.true)
              .map((item) => item.value)
              .toString(),
            timeLimit:
              this.taskLimitIndex !== 5
                ? this.taskLimitDetailOptions[this.taskLimitDetailIndex]
                : `${this.taskLimitTimeDate} ${this.taskLimitTimeClock}`,
            timeLimitType: this.taskLimitIndex + 1,
            startTimeType: this.executionTimeIndex + 1,
            overtimeAlertWay: this.taskLimitCheckbox
              .map((item, index) => ({
                value: index + 1,
                true: item,
              }))
              .filter((item) => item.true)
              .map((item) => item.value)
              .toString(),
            // 是否重启任务
            isRestart: Number(this.isRestart),
            // 重启任务说明
            restartContent,
          },
        },
      };
      if (
        (this as any).activeTabIndex === 3 ||
        (this as any).activeTabIndex === 4
      ) {
        console.log(request);
        request.data.data.allocations = (
          this as any
        ).selectedMaterialsData.reduce((pre: any, ele: any) => {
          ele.wareHouseList.forEach((x: any) => {
            const obj = {
              num: x.value,
              resourceId: x.id,
              resourceStorehouseId: x.storehouseId,
              resourceType: (this as any).activeTabIndex === 3 ? 0 : 1, //0:物资，1：装备
            };
            pre.push(obj);
          });
          return pre;
        }, []);
      }
      this.isLoading = true;
      (this as any)
        .$http(request)
        .then((response: any) => {
          if (response.errorcode === 0) {
            if (this.taskId) {
              (this as any).$message.info(`${this.isRestart ? '重启' : '编辑'}任务保存成功`);
            } else {
              (this as any).$message.info('发布任务成功');
            }
            this.refresh();
            this.handleClose();
          } else {
            (this as any).$message.error(
              `${this.taskId ? '保存' : '发布'}失败，错误代码${response.errorcode}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          (this as any).$message.error(`${this.taskId ? '保存' : '发布'}失败，错误信息：${error}`);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    /**
     * 验证表单数据
     */
    validate() {
      const warn = (msg: string) => {
        (this as any).$message.error(`请填写${msg}`);
      };
      if (!this.taskName) {
        warn('任务名称');
        return false;
      }
      if (!this.selectedResponsiblePerson?.length) {
        warn('负责人');
        return false;
      }
      if (!this.tabList?.length) {
        warn('任务类型');
        return false;
      }
      if (this.taskLimitIndex === 5) {
        if (!this.taskLimitTimeClock || !this.taskLimitTimeDate) {
          warn('任务时限');
          return false;
        }
        const time = new Date(`${this.taskLimitTimeDate} ${this.taskLimitTimeClock}`).getTime();
        if (new Date().getTime() <= time) {
          (this as any).$message.error('自定义任务时限小于当前时间，请重新设置');
          return false;
        }
      }
      return true;
    },
    /*
     * 资源调拨
     */
    resAllocation() {
      if ((this as any).$addDialog) {
        (this as any).$addDialog('资源调拨', ResAllocation, {
          selectedMaterialsData: (this as any).selectedMaterialsData,
          typeJudgment:
            (this as any).activeTabIndex === 3 ? 'material' : 'equipment',
        });
      }
    },
    // 已选物资的数据进行改变时
    changeHouseArr(params: any) {
      (this as any).selectedMaterialsData = params;
    },
    // 设置地图中心点
    setMapCenters(params: any) {
      console.log(params);
      // 隐藏弹窗
      if ((this as any).operation.hide) {
        (this as any).operation.hide();
      }
    },
  },
});
</script>

<style lang="scss" src="./style/index.scss"></style>
<style lang="scss" module>
.resAllocationBtn {
  color: #00c1de;
  background: transparent;
  border: 1px solid currentColor;
  outline: none;
  height: 32px;
  vertical-align: middle;
  padding: 0 12px;
  cursor: pointer;
}
</style>
