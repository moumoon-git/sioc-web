<!--发布任务-->
<template>
  <div :class="$style['update-task-container']">
    <header>
      <!-- 导航栏 -->
      <NavBar :config="navBarConfig" />
      <!-- tabs页 -->
      <Tabs :active="activeNavIndex" :tabList="tabList" @handleClickTab="handleClickTab" />
    </header>

    <main :class="$style['main']">
      <!-- 任务信息 -->
      <UpdateTaskInformation v-show="activeNavIndex === 0" @formChange="handleFormChange" />
      <!-- 任务成员 -->
      <UpdateTaskMembers v-show="activeNavIndex === 1" />
    </main>

    <footer :class="$style['footer']">
      <Button
        :class="$style['button-style']"
        :type="buttonDisabled ? 'disabled' : 'default'"
        :font-size="'0.4rem'"
        @click="handlePublish"
      >
        发布
      </Button>
      <Button
        :class="$style['button-style']"
        type="primary"
        :font-size="'0.28rem'"
        @click="handleCancel"
      >
        取消
      </Button>
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import Tabs from '../../../generalparts/Tabs/Tabs.vue';
import UpdateTaskMembers from '@/product/SIOC-H5/module/task/UpdateTask/components/UpdateTaskMembers/UpdateTaskMembers.vue';
import UpdateTaskInformation from '@/product/SIOC-H5/module/task/UpdateTask/components/UpdateTaskInformation/UpdateTaskInformation.vue';
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
export default defineComponent({
  name: 'UpdateTask',
  components: {
    NavBar,
    Tabs,
    UpdateTaskMembers,
    UpdateTaskInformation,
    Button,
  },
  setup() {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const store = useStore();

    const router = useRouter(); // 获取路由器实例

    // 导航栏配置
    const navBarConfig = {
      title: '发布任务',
      type: 'left',
      path: '/TaskList',
    };
    // 当前激活的Tabs页面
    const activeNavIndex = ref(
      router.currentRoute.value.query?.activeTabIndex
        ? Number(router.currentRoute.value.query?.activeTabIndex)
        : 0,
    );
    // 按钮是否被禁用
    const buttonDisabled = ref(false);
    // Tabs页面菜单
    const tabList = [
      {
        tabName: '信息编辑',
      },
      {
        tabName: '任务成员',
      },
    ];
    // 切换Tabs页面菜单
    function handleClickTab(val: any) {
      activeNavIndex.value = val;
    }

    /**
     * @description 监听必填项
     */
    function handleFormChange() {
      const taskForm = store.state.task.taskForm;
      const taskContactors = store.state.task.taskContactors;
      if (
        !taskForm.taskName ||
        !taskForm.taskAddress ||
        !taskForm.taskLatitude ||
        !taskForm.taskLongitude ||
        !taskForm.taskDescription ||
        taskContactors.responsiblePerson.length === 0 ||
        (!taskForm.event.eventId && !taskForm.event.eventTitle) ||
        !taskForm.taskExecutionType ||
        (taskForm.taskExecutionType === '定时' && !taskForm.taskExecutionTimeDate) ||
        !taskForm.taskTimeLimit.typeName ||
        (taskForm.taskTimeLimit.typeName !== '无时限' && !taskForm.taskTimeLimit.date)
      ) {
        buttonDisabled.value = true;
        return false;
      }
      buttonDisabled.value = false;
      console.log('监听', buttonDisabled.value);
    }

    /**
     * @description 取消发布任务
     */
    function handleCancel() {
      router.push({
        path: '/TaskList',
      });
    }

    /**
     * @description 发布任务
     */
    function handlePublish() {
      const taskForm = store.state.task.taskForm;
      const taskContactors = store.state.task.taskContactors;
      if (buttonDisabled.value) {
        if (!taskForm.taskName) {
          Toast.fail('请输入任务标题');
        } else if (!taskForm.taskAddress || !taskForm.taskLatitude || !taskForm.taskLongitude) {
          Toast.fail('请选择任务地点');
        } else if (!taskForm.event.eventId && !taskForm.event.eventTitle) {
          Toast.fail('请选择关联事件');
        } else if (
          !taskForm.taskExecutionType ||
          (taskForm.taskExecutionType === '定时' && !taskForm.taskExecutionTimeDate)
        ) {
          Toast.fail('请选择执行时间');
        } else if (
          !taskForm.taskTimeLimit.typeName ||
          (taskForm.taskTimeLimit.typeName !== '无时限' && !taskForm.taskTimeLimit.date)
        ) {
          Toast.fail('请选择任务时限');
        } else if (!taskForm.taskDescription) {
          Toast.fail('请输入任务说明');
        } else if (taskContactors.responsiblePerson.length === 0) {
          Toast.fail('请选择任务负责人');
        }
        return false;
      }
      const request = {
        method: 'post',
        service: 'app',
        url: '/task/saveTask',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          data: {
            id: taskForm.taskId || undefined, // 任务id
            address: taskForm.taskAddress, // 任务地点
            content: taskForm.taskDescription, // 任务说明
            eventId: taskForm.event.eventId, // 事件ID
            labels: [], // 任务标签 R2开发
            cgcsLatitude: taskForm.taskLatitude, // 纬度
            cgcsLongitude: taskForm.taskLongitude, // 经度
            latitude: taskForm.taskLatitude, // 纬度
            longitude: taskForm.taskLongitude, // 经度
            startTime: taskForm.taskExecutionTimeDate, // 执行时间
            title: taskForm.taskName, // 任务名称
            members:
              taskContactors.members.length > 0
                ? taskContactors.members.map((el: any) => {
                    return {
                      groupId: el.groupId,
                      contactorId: el.id,
                    };
                  })
                : [], // 参与人
            cc:
              taskContactors.cc.length > 0
                ? taskContactors.cc.map((el: any) => {
                    return {
                      groupId: el.groupId,
                      contactorId: el.id,
                    };
                  })
                : [], // 抄送人
            responsiblePerson:
              taskContactors.responsiblePerson.length > 0
                ? taskContactors.responsiblePerson.map((el: any) => {
                    return {
                      groupId: el.groupId,
                      contactorId: el.id,
                    };
                  })[0]
                : null, // 负责人
            attachmentIds: taskForm.taskAttachments.fileList.map((file: { id: number }) => file.id), // 任务附件
            type: taskForm.taskType.id, // 任务类型
            alertTime: taskForm.taskAlert.date, // 任务提醒-自定义-日期
            alertTimeType: taskForm.taskAlert.index + 1, // 任务提醒方式
            // 任务提醒警告
            alertWay: taskForm.alertTypeOptions2
              .filter((el: any) => el.checked)
              .map((el: any) => el.id)
              .toString(),
            timeLimit: taskForm.taskTimeLimit.date, // 任务时限 数值/日期
            timeLimitType: taskForm.taskTimeLimit.index + 1, // 任务时限类型
            startTimeType: taskForm.taskExecutionType === '即时' ? 1 : 2, // 即时1 定时2
            // 任务时限警告
            overtimeAlertWay: taskForm.alertTypeOptions1
              .filter((el: any) => el.checked)
              .map((el: any) => el.id)
              .toString(),
          },
        },
      };
      $http(request).then((response: any) => {
        console.log(response);
        if (response.errorcode === 0) {
          store.commit('task/initTaskFormData');
          store.commit('setSearchContactorsPageContactors', []);
          Toast.success('任务发布成功');
          setTimeout(() => {
            router.push({
              path: '/TaskList',
            });
          }, 200);
        }
      });
    }

    return {
      navBarConfig,
      tabList,
      handleClickTab,
      activeNavIndex,
      handlePublish,
      handleCancel,
      buttonDisabled,
      handleFormChange,
    };
  },
});
</script>
<style lang="scss" module>
.update-task-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  border-top: 0.2rem solid #f5f5f5;
  overflow: scroll;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 2.3rem;
  background: #ffffff;
  box-shadow: 0rem -0.01rem 0.01rem 0rem rgba(116, 116, 116, 0.3);
  box-sizing: border-box;
  padding-top: 0.3rem;

  .button-style {
    width: 6.4rem;
    height: 0.9rem;
  }
}
</style>
