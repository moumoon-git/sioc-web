<template>
  <div
    :class="
      'task-details-information-container ' +
        (isResponsiblePerson
          ? 'task-details-style_1'
          : 'task-details-style_2')
    "
  >
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
      <div
        v-if="loading"
        :class="
          'infomation-card ' +
            (isResponsiblePerson
              ? 'infomation-card-style_1'
              : 'infomation-card-style_2')
        "
      >
        <!-- 详细信息 -->
        <div v-if="taskInformation" class="infomation-card_container">
          <!-- 任务状态 -->
          <div
            :class="
              taskInformation.taskStatus === 'handling'
                ? 'infomation-card_status-handling'
                : taskInformation.taskStatus === 'finished'
                ? 'infomation-card_status-finished'
                : 'infomation-card_status-cancel'
            "
          ></div>

          <!-- 卡片 —— 头部 -->
          <div v-if="taskInformation.taskStatus !== 'cancel'" class="infomation-card_header">
            <!-- 任务耗时 -->
            <TaskExpendedTime
              :taskStatus="taskInformation.taskStatus"
              :taskIsOverTime="taskInformation.taskIsOverTime"
              :timeDescription="taskInformation.timeDescription"
              :taskEndTime="taskInformation.taskEndTime"
              :taskDeadline="taskInformation.taskDeadline"
              class="infomation-card_header_count-down"
            />
          </div>

          <!-- 事件标签 R1版本先不做 -->
          <!-- <EventTags /> -->

          <!-- 任务详情信息 -->
          <!-- 文本信息 -->
          <TaskInfo :taskInformation="taskInformation" />
        </div>

        <!-- 物资清单 -->
        <div class="infomation-card_container">
          <!-- 卡片 —— 头部 -->
          <div class="infomation-card_header">
            物资清单
          </div>

          <TaskInventory
            :allocationDetails="taskInformation.taskAllocationDetails"
          />
        </div>

        <!-- 任务成员 -->
        <div class="infomation-card_container">
          <!-- 卡片 —— 头部 -->
          <div class="infomation-card_header">
            {{
              taskInformation.taskMembers.length > 0
                ? '任务成员（' + taskInformation.taskMembers.length + '）'
                : '任务成员'
            }}
          </div>

          <TaskMember
            v-if="taskInformation.taskMembers"
            :memberList="taskInformation.taskMembers"
          />
        </div>
      </div>
    </van-pull-refresh>

    <!-- 页面 —— 底部按钮 -->
    <TaskInfoFooter
      v-if="isResponsiblePerson"
      :taskStatus="taskInformation.taskStatus"
      @finishTask="finishTask"
      @cancelTask="cancelTask"
      @reStartTask="reStartTask"
    />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRaw,
  watch,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
} from 'vue';
import EventTags from './components/EventTags.vue';
import TaskInfo from './components/TaskInfo.vue';
// 任务成员
import TaskMember from './components/TaskMember.vue';
import TaskInfoFooter from './components/TaskInfoFooter.vue';
import $file from '../assets/js/file';
import $time from '../assets/js/time';
import TaskExpendedTime from './components/TaskExpendedTime.vue';
// 物资清单
import TaskInventory from './components/TaskInventory.vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';

// 组件——提示弹窗
import { Notify } from 'vant';

export default defineComponent({
  name: 'TaskInfoViewer',
  components: {
    EventTags,
    TaskInfo,
    TaskMember,
    TaskExpendedTime,
    TaskInfoFooter,
    TaskInventory
  },
  props: {
    id: {
      type: [String, Number],
      default: 1,
    },
  },
  setup(props, {emit}) {
    const router = useRouter(); // 获取路由器实例
    const instance = getCurrentInstance();
    const { $http, $moment }: any = instance?.appContext.config.globalProperties;

    var taskInformation: Object = reactive({
      taskId: 0, // 任务ID
      taskDeadline: '', // 倒计时时长，单位毫秒 number | string
      taskIsOverTime: false,
      taskName: '', // 任务名称
      taskType: '', // 任务类型
      taskAddress: '', // 任务地点
      taskRemark: '', // 任务说明
      taskTimeLimit: '',
      taskAttachment: {
        files: [],
        images: [],
        videos: [],
      },
      taskMembers: [],
      timeDescription: '',
      taskStatus: '',
      taskAllocationDetails: [], // 物资
    });
    let taskId: any = props.id; // 任务id
    let isLoading = ref(false); // 下拉刷新-刷新中的效果
    let loading = ref(false); // 骨架屏
    /**
     * @description 下拉刷新
     */
    function onRefresh() {
      isLoading.value = true;
      const isRefresh = ref(true);
      getTaskDetail(taskId);
    }

    let newTaskInformation = reactive({});
    let timer: any = ref(); // 计时器

    /**
     * @param {string | number} taskId 任务id
     * @description 获取任务详情
     */
    function getTaskDetail(taskId: string | number) {
      const requestData: Object = reactive({
        method: 'get',
        service: 'app',
        url: '/task/getTaskDetail',
        params: {
          taskId: taskId,
        },
      });
      ($http as any)(requestData)
        .then((res: any) => {
          isLoading.value = false;
          loading.value = true;
          if (res.errorcode === 0) {
            newTaskInformation = {
              taskId: res.data.id, // 任务ID
              taskName: res.data.title, // 任务名称
              taskType: res.data.typeName, // 任务类型
              taskAddress: res.data.address, // 任务地点
              taskRemark: res.data.content, // 任务说明
              taskStatus: res.data.statusCode, // 任务状态
              taskLongitude: res.data.cgcsLongitude || res.data.longitude,
              taskLatitude: res.data.cgcsLatitude || res.data.latitude,
              taskAllocationDetails: res.data.allocationDetails, // 物资调度
            };
            Object.assign(taskInformation, newTaskInformation);

            // ----------------------- 任务时限业务处理逻辑 start -----------------------------------
            // 任务发布时间
            Object.assign(taskInformation, {
              startTime: res.data.startTime,
            }); // 任务时限
            // 任务时限
            let taskTimeLimit = ref(''); // 任务时限
            let timeLimitUnit = $time.getTimeLimit(res.data.timeLimitType); // 任务时限单位
            if (res.data.timeLimitType == 1) {
              taskTimeLimit.value = timeLimitUnit; // 时间：无时限
            } else if (res.data.timeLimitType == 6) {
              taskTimeLimit.value = res.data.timeLimit; // 时间：年月日时分秒
            } else {
              taskTimeLimit.value = res.data.timeLimit + timeLimitUnit; // 时间：天时分秒
            }
            Object.assign(taskInformation, {
              taskTimeLimit: taskTimeLimit.value,
            }); // 任务时限
            // ----------------------- 任务时限业务处理逻辑 end -----------------------------------

            // ----------------------- 任务附件业务处理逻辑 start -----------------------------------
            // 任务附件数据格式拼接：
            if (res.data.appAttachments.length > 0) {
              let files: Array<any> = reactive([]);
              let images: Array<any> = reactive([]);
              let videos: Array<any> = reactive([]);
              res.data.appAttachments.forEach((el: any) => {
                let file: any = {
                  id: el.id, // 文件ID
                  name: el.title, // 文件名字
                  title: el.title, // 文件名字
                  url: el.url, // 文件路径
                  size: el.size, // 文件大小
                  extension: $file.getExtensions(el.extension), // 文件后缀
                };
                // 文档类型:
                if (el.dictionaryType.code === 'file') {
                  files.push(file);
                }
                // 图片类型:
                if (el.dictionaryType.code === 'image') {
                  images.push(file);
                }
                // 视频类型:
                if (el.dictionaryType.code === 'video') {
                  videos.push(file);
                }
              });
              let taskAttachment = reactive({});
              Object.assign(taskAttachment, { files: files });
              Object.assign(taskAttachment, { images: images });
              Object.assign(taskAttachment, { videos: videos });
              Object.assign(taskInformation, {
                taskAttachment: taskAttachment,
              });
            }
            // ----------------------- 任务附件业务处理逻辑 end -----------------------------------

            // ----------------------- 任务成员业务处理逻辑 start -----------------------------------
            // 任务负责人
            let taskMembers: Array<any> = reactive([]);
            if (res.data.responsiblePerson) {
              // 分组 / 职位
              var memberPosition: any = ref('');
              if (
                res.data.responsiblePerson.groupName &&
                res.data.responsiblePerson.groupName !== ''
              ) {
                memberPosition.value = res.data.responsiblePerson.groupName;
                if (
                  res.data.responsiblePerson.position &&
                  res.data.responsiblePerson.position !== ''
                ) {
                  memberPosition.value =
                    res.data.responsiblePerson.groupName +
                    '/' +
                    res.data.responsiblePerson.position;
                }
              } else {
                if (
                  res.data.responsiblePerson.position &&
                  res.data.responsiblePerson.position !== ''
                ) {
                  memberPosition.value = res.data.responsiblePerson.position;
                } else {
                  memberPosition.value = '-';
                }
              }
              taskMembers.push({
                memberId: res.data.responsiblePerson.id, // 成员ID
                memberName: res.data.responsiblePerson.name, // 成员姓名
                memberPosition: memberPosition.value, // 分组 / 职位
                memberRole: '负责人', // 成员角色
                memberPhone: {
                  mobile1: res.data.responsiblePerson.mobile1,
                  mobile2: res.data.responsiblePerson.mobile2,
                  officeTel: res.data.responsiblePerson.officeTel,
                  otherTel: res.data.responsiblePerson.otherTel,
                  phone: res.data.responsiblePerson.phone,
                }, // 成员电话
              });
            }
            // 任务参与人
            if (res.data.member && res.data.member.length > 0) {
              res.data.member.forEach((el: any) => {
                // 分组 / 职位
                var memberPosition: any = ref('');
                if (el.groupName && el.groupName !== '') {
                  memberPosition.value = el.groupName;
                  if (el.position && el.position !== '') {
                    memberPosition.value = el.groupName + '/' + el.position;
                  }
                } else {
                  if (el.position && el.position !== '') {
                    memberPosition.value = el.position;
                  } else {
                    memberPosition.value = '-';
                  }
                }

                taskMembers.push({
                  memberId: el.id, // 成员ID
                  memberName: el.name, // 成员姓名
                  memberPosition: memberPosition.value, // 分组 / 职位
                  memberRole: '参与人', // 成员角色
                  memberPhone: {
                    mobile1: el.mobile1,
                    mobile2: el.mobile2,
                    officeTel: el.officeTel,
                    otherTel: el.otherTel,
                    phone: el.phone,
                  }, // 成员电话
                });
              });
            }
            // 任务抄送人
            if (res.data.cc && res.data.cc.length > 0) {
              res.data.cc.forEach((el: any) => {
                // 分组 / 职位
                var memberPosition: any = ref('');
                if (el.groupName && el.groupName !== '') {
                  memberPosition.value = el.groupName;
                  if (el.position && el.position !== '') {
                    memberPosition.value = el.groupName + '/' + el.position;
                  }
                } else {
                  if (el.position && el.position !== '') {
                    memberPosition.value = el.position;
                  } else {
                    memberPosition.value = '-';
                  }
                }
                taskMembers.push({
                  memberId: el.id, // 成员ID
                  memberName: el.name, // 成员姓名
                  memberPosition: memberPosition.value, // 分组 / 职位
                  memberRole: '抄送人', // 成员角色
                  memberPhone: {
                    mobile1: el.mobile1,
                    mobile2: el.mobile2,
                    officeTel: el.officeTel,
                    otherTel: el.otherTel,
                    phone: el.phone,
                  }, // 成员电话
                });
              });
            }
            Object.assign(taskInformation, { taskMembers: taskMembers });
            // ----------------------- 任务成员业务处理逻辑 end -----------------------------------

            // ----------------------- 任务耗时业务处理逻辑 start -----------------------------------
            handleTimeDescription(res.data.startTime, res.data.endTime, res.data.statusCode, res.data.finishTimeDescription)

            // ----------------------- 任务耗时业务处理逻辑 end -----------------------------------
            if (res.data.responsiblePerson) {
              handleResponsiblePerson(res.data.responsiblePerson.id); // 判断当前登录用户是否是该任务的负责人
            }
          } else {
            if (res.errorcode === 10006) {
              emit('hide')
            } else {
              Notify({
                type: 'danger',
                message: `获取任务详情失败，错误代码${res.errorcode}，错误信息：${res.msg}`,
              });
            }
          }
        })
        .catch((error: any) => {
          isLoading.value = false;
          loading.value = true;
          if (error.errorcode) {
            Notify({
              type: 'danger',
              message: `获取任务详情失败，错误代码${error.errorcode}，错误信息：${error.msg}`,
            });
          }
        });
    }

    const isRestartTask = ref(false);

    /**
     * @description 取消任务
     */
    function cancelTask() {
      isRestartTask.value = true;
      sessionStorage.setItem('taskObj', JSON.stringify({ operation: 'cancel', taskId:(taskInformation as any).taskId, taskAddress:(taskInformation as any).taskAddress, taskLatitude:(taskInformation as any).taskLatitude, taskLongitude:(taskInformation as any).taskLongitude}));
      router.push({
        path: `/CompleteCancelTask`,
      });
    }

    /**
     * @description 完成任务
     */
    function finishTask() {
      isRestartTask.value = true;
      sessionStorage.setItem('taskObj', JSON.stringify({ operation: 'finish', taskId:(taskInformation as any).taskId, taskAddress:(taskInformation as any).taskAddress, taskLatitude:(taskInformation as any).taskLatitude, taskLongitude:(taskInformation as any).taskLongitude}));
      router.push({
        path: `/CompleteCancelTask`,
      });
    }

    /**
     * @description 重启任务
     */
    function reStartTask() {
      isRestartTask.value = false;
      sessionStorage.setItem('taskObj', JSON.stringify({ operation: 'restart', taskId:(taskInformation as any).taskId, taskAddress:(taskInformation as any).taskAddress, taskLatitude:(taskInformation as any).taskLatitude, taskLongitude:(taskInformation as any).taskLongitude}));
      router.push({
        path: `/CompleteCancelTask`,
      });
    }
    let contactorId = !!(window as any)?.task?.getIsApp() ? Number((window as any)?.task?.getUserId()) : Number(localStorage.getItem('userId')) ; // 登录用户Id
    console.log('安卓-是否是安卓环境：', !!(window as any)?.task?.getIsApp())
    console.log('安卓-用户id：', Number((window as any)?.task?.getUserId()))
    console.log('H5-用户id：', Number(localStorage.getItem('userId')))
    let isResponsiblePerson = ref(false);
    
    /**
     * @param {array} id 任务负责人Id
     * @description 判断当前登录用户是否是该任务的负责人
     */
    function handleResponsiblePerson(id: number | string) {
      if (id === contactorId) {
        isResponsiblePerson.value = true;
      }
    }

    /**
     * @description 任务超时或耗时的描述
     */
    function startInterval(time: any) {
      return $time.setCalculagraph(time, '天时分秒'); // 计时器
    }
    
    /**
     * @description 处理任务时间
     * @param {string} statusCode 任务进行的状态
     * @param {string} startTime 开始时间
     * @param {string} endTime 结束时间
     * @param {string} finishTimeDescription 任务结束后的描述，由后端返回
     */
    function handleTimeDescription(startTime: string, endTime: string, statusCode: string, finishTimeDescription: string) {
      // 如果任务未完成，需要前端去计算剩余时间/用时
      if (statusCode === 'handling') {
        // 没有截止时间
        if (!endTime) {

          // 获取 startTime和现在时间的时间差
          let { time } = $time.getTaskDeadline(startTime.replace(/\-/g, "/"));
          
          Object.assign(taskInformation, {
            taskIsOverTime: false, // 任务是否超时
            taskEndTime: false, // 任务是否有结束时间
            timeDescription: '用时：' + startInterval(time), // 任务超时或耗时的描述
          });

          // 计时器
          timer.value = setInterval(() => {
            time = time + 1000; // 加一秒
            Object.assign(taskInformation, {
              taskIsOverTime: false, // 任务是否超时
              taskEndTime: false, // 任务是否有结束时间
              timeDescription: '用时：' + startInterval(time), // 任务超时或耗时的描述
            });
          }, 1000);
          
          return;
        }

        // isOvertime: 是否超时; time: 时间差
        let { isOvertime, time } = $time.getTaskDeadline(endTime.replace(/\-/g, "/"));

        // 如果任务超时了，前端要通过间隔一秒累加计时
        if (isOvertime) {
          // 启动定时器前先赋值

          Object.assign(taskInformation, {
            taskIsOverTime: isOvertime, // 任务是否超时
            taskEndTime: true, // 任务是否有结束时间
            timeDescription: '超时：' + startInterval(time), // 任务超时或耗时的描述
          });

          // 计时器
          timer.value = setInterval(() => {
            time = time + 1000; // 加一秒

            Object.assign(taskInformation, {
              taskIsOverTime: isOvertime, // 任务是否超时
              taskEndTime: true, // 任务是否有结束时间
              timeDescription: '超时：' + startInterval(time), // 任务超时或耗时的描述
            });

          }, 1000);

        } else {
          // 如果任务未超时了，前端通过vant传参时间去计算
          Object.assign(taskInformation, {
            taskIsOverTime: isOvertime, // 任务是否超时
            taskEndTime: true, // 任务是否有结束时间
            taskDeadline: time, // 剩余时间
          });
        }
      } else if (statusCode === 'finished') {
        // 如果任务已完成，后端返回算好的时间描述，不需要前端去计算
        Object.assign(taskInformation, {
          timeDescription: finishTimeDescription, // 任务完成时超时或耗时的描述
        });
      }

    }

    onMounted(() => {
      getTaskDetail(taskId); // 获取任务详情
    })

    onBeforeUnmount(() => {
      // 清楚定时器
      if (timer.value) {
        clearInterval(timer.value);
      }
    });
    return {
      taskInformation,
      getTaskDetail,
      timer,
      onRefresh,
      isLoading,
      cancelTask,
      finishTask,
      isRestartTask,
      reStartTask,
      loading,
      isResponsiblePerson,
    };
  },
});
</script>
<style lang="scss" scoped>
@import './assets/css/index';
.van-skeleton__title {
  background: #ffffff;
}
.van-pull-refresh { 
 	overflow: scroll;
}
</style>
