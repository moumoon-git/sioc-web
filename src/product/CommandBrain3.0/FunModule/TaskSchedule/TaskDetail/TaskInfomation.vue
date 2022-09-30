<template>
  <div class="detail__taskinfomation">
    <div class="detail__taskinfomation__butBox">
      <div class="detail__taskinfomation__butBox__but" @click="openPublishTask('编辑任务')">
        编辑
      </div>
      <div
        v-if="taskType === 'handling'"
        class="detail__taskinfomation__butBox__but"
        @click="overTask"
      >
        完成任务
      </div>
      <div
        v-if="taskType === 'handling'"
        class="
          detail__taskinfomation__butBox__but
          detail__taskinfomation__butBox__but--cancel
        "
        @click="cancleTask"
      >
        取消任务
      </div>
      <div
        v-if="taskType === 'finished' || taskType === 'cancel'"
        class="detail__taskinfomation__butBox__but"
        @click="openPublishTask('重启任务')"
      >
        重启任务
      </div>
    </div>
    <div class="detail__taskinfomation__taskInfo">
      <div class="detail__taskinfomation__taskInfo__top">
        <div class="taskInfo__top__time detail__title">
          <div class="detail__title__icon" />
          结束时间:{{ taskInfo.endTime || '无时限' }}<span />{{
            taskInfo.typeName
          }}
        </div>
        <div class="taskInfo__top__infolist">
          <div class="taskInfo__top__infolist__item">
            <div class="taskInfo__top__infolist__title">任务地点:</div>
            <div class="taskInfo__top__infolist__content">
              {{ taskInfo.address }}
            </div>
          </div>
          <div class="taskInfo__top__infolist__item">
            <div class="taskInfo__top__infolist__title">发布时间:</div>
            <div class="taskInfo__top__infolist__content">
              {{ taskInfo.startTime }}
            </div>
          </div>
          <div class="taskInfo__top__infolist__item">
            <div class="taskInfo__top__infolist__title">任务时限:</div>
            <div class="taskInfo__top__infolist__content">
              {{ taskLimit }}
            </div>
          </div>
          <div class="taskInfo__top__infolist__item">
            <div class="taskInfo__top__infolist__title">超时告警:</div>
            <div class="taskInfo__top__infolist__content">
              {{ getAlertWayName(alertWayName) }}
            </div>
          </div>
        </div>
      </div>
      <div class="detail__taskinfomation__taskInfo__border" />
      <div class="detail__taskinfomation__taskInfo__bot">
        <div class="taskinfomation__taskInfo__bot__text">
          {{ taskInfo.content }}
        </div>
        <div v-viewer class="taskinfomation__taskInfo__bot__imgs">
          <img
            v-for="(item, index) in returnfile(imgsArr, 'image')"
            :key="index"
            class="taskinfomation__taskInfo__bot__img"
            :src="`${baseURL}${item.url}`"
            alt=""
          />
        </div>
        <div
          v-for="(item, index) in taskInfo.appAttachments"
          :key="index"
          class="taskinfomation__taskInfo__bot__file"
        >
          <div class="taskInfo__bot__file__iconl" />
          <div class="taskInfo__bot__file__name">
            {{ item.title }}
          </div>
          <a
            :href="`${baseURL}${item.url}`"
            target="_blank"
            class="taskInfo__bot__file__iconr"
          />
        </div>
        <div class="taskinfomation__taskInfo__bot__types">
          <div
            v-for="(item, index) in labelsArr"
            :key="index"
            class="taskinfomation__taskInfo__bot__type"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- 资源调度 -->
    <!-- <div class="detail__taskinfomation__resource">
      <div class="taskinfomation__duty__dutytype__title">
        <div class="detail__title__icon" />
        <div class="taskinfomation__duty__dutytype__titlename">资源调度：</div>
      </div>
      <HandleMaterial :edit="false" :list-data="selectedMaterialsArr" />
    </div> -->

    <div class="detail__taskinfomation__duty">
      <!-- 明锦说暂时用不到这一块、先屏蔽 -->
      <!-- <div class="detail__taskinfomation__duty__dutytype">
        <div class="taskinfomation__duty__dutytype__title">
          <div class="detail__title__icon" />
          <div class="taskinfomation__duty__dutytype__titlename">
            负责单位
          </div>
        </div>
        <div class="taskinfomation__duty__dutytype__divs">
          <div class="taskinfomation__duty__dutytype__item">
            {{ taskInfo?.responsibleGroup?.name?taskInfo.responsibleGroup.name:'' }}
          </div>
        </div>
      </div> -->
      <!-- <div class="detail__taskinfomation__duty__dutytype">
        <div class="taskinfomation__duty__dutytype__title">
          <div class="detail__title__icon" />
          <div class="taskinfomation__duty__dutytype__titlename">
            成员单位
            <div
              class="taskinfomation__duty__dutytype__titlename__spread"
              @click="unitSoreadFun"
            >
              {{ unitSpreadName }}
            </div>
          </div>
        </div>
        <div
          class="taskinfomation__duty__dutytype__divs"
          :class="{'taskinfomation__duty__dutytype__divs--spread':unitSpread===true}"
        >
          <div
            v-for="(item,index) in menbergroup"
            :key="index"
            class="taskinfomation__duty__dutytype__item"
          >
            {{ item.name?item.name:'' }}
          </div>
        </div>
      </div> -->
      <div class="detail__taskinfomation__duty__dutytype">
        <div class="taskinfomation__duty__dutytype__title">
          <div class="detail__title__icon" />
          <div class="taskinfomation__duty__dutytype__titlename">负责人</div>
        </div>
        <div class="taskinfomation__duty__dutytype__divs">
          <div
            v-if="taskInfo?.responsiblePerson?.name"
            class="taskinfomation__duty__dutytype__item"
          >
            <span :class="['noRead', {'hasRead': taskInfo?.responsiblePerson?.readStatus}]">
              {{ taskInfo?.responsiblePerson?.readStatus ? '已读' : '未读' }}
            </span>
            {{
              `${
                taskInfo?.responsiblePerson?.name
                  ? taskInfo.responsiblePerson.name
                  : ''
              }(${
                taskInfo?.responsiblePerson?.groupName
                  ? taskInfo.responsiblePerson.groupName
                  : ''
              }/${
                taskInfo?.responsiblePerson?.position
                  ? taskInfo.responsiblePerson.position
                  : ''
              })`
            }}
            <div>
              <ContactMoreButton
                v-if="taskInfo?.responsiblePerson"
                :id="taskInfo?.responsiblePerson?.id"
              />
            </div>
            <span v-if="!taskInfo?.responsiblePerson?.readStatus">
              <div
                class="phoneStyle"
                @click.stop="callPhone(taskInfo?.responsiblePerson)"
              />
              <div
                class="smsStyle"
                @click.stop="sendSms(taskId, taskInfo?.responsiblePerson?.id)"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="detail__taskinfomation__duty__dutytype">
        <div class="taskinfomation__duty__dutytype__title">
          <div class="detail__title__icon" />
          <div class="taskinfomation__duty__dutytype__titlename">
            参与人({{ menber.length }}人)
            <div
              class="taskinfomation__duty__dutytype__titlename__spread"
              @click="peopleSoreadFun1"
            >
              {{ peopleSpreadName1 }}
            </div>
          </div>
        </div>
        <div
          class="taskinfomation__duty__dutytype__divs"
          :class="{
            'taskinfomation__duty__dutytype__divs--spread':
              peopleSpread1 === true,
          }"
        >
          <div
            v-for="(item, index) in menber"
            :key="index"
            class="taskinfomation__duty__dutytype__item"
          >
            <span :class="['noRead', {'hasRead': item.readStatus}]">
              {{ item.readStatus ? '已读' : '未读' }}
            </span>
            {{
              `${item.name ? item.name : ''}(${
                item.groupName ? item.groupName : ''
              }/${item.position ? item.position : ''})`
            }}
            <div>
              <ContactMoreButton :id="item.id" />
            </div>
            <span v-if="!item.readStatus">
              <div
                class="phoneStyle"
                @click.stop="callPhone(item)"
              />
              <div
                class="smsStyle"
                @click.stop="sendSms(taskId, item.id)"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="detail__taskinfomation__duty__dutytype">
        <div class="taskinfomation__duty__dutytype__title">
          <div class="detail__title__icon" />
          <div class="taskinfomation__duty__dutytype__titlename">
            抄送人({{ copyMan.length }}人)
            <div
              class="taskinfomation__duty__dutytype__titlename__spread"
              @click="peopleSoreadFun2"
            >
              {{ peopleSpreadName2 }}
            </div>
          </div>
        </div>
        <div
          class="taskinfomation__duty__dutytype__divs"
          :class="{
            'taskinfomation__duty__dutytype__divs--spread':
              peopleSpread2 === true,
          }"
        >
          <div
            v-for="(item, index) in copyMan"
            :key="index"
            class="taskinfomation__duty__dutytype__item"
          >
            <span :class="['noRead', {'hasRead': item.readStatus}]">
              {{ item.readStatus ? '已读' : '未读' }}
            </span>
            {{
              `${item.name ? item.name : ''}(${
                item.groupName ? item.groupName : ''
              }/${item.position ? item.position : ''})`
            }}
            <div>
              <ContactMoreButton :id="item.id" />
            </div>
            <span v-if="!item.readStatus">
              <div
                class="phoneStyle"
                @click.stop="callPhone(item)"
              />
              <div
                class="smsStyle"
                @click.stop="sendSms(taskId, item.id)"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import TaskPublishDialog from '@/product/CommandBrain3.0/FunModule/TaskSchedule/TaskPublishDialog/TaskPublishDialog.vue'; // 发布任务弹窗
import HandleMaterial from '@/product/CommandBrain3.0/FunModule/TaskSchedule/ResAllocation/components/HandleMaterial.vue';
import { makePhoneCall } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';

export default defineComponent({
  name: 'TaskInfomation',
  components: {
    ContactMoreButton,
    // 资源调度
    HandleMaterial,
  },
  inject: ['$MessageBox', '$addDialog'],
  inheritAttrs: false,
  props: {
    taskId: {
      type: Number,
      default: 1,
    },
    taskType: {
      type: String,
      default: '',
    },
  },
  emits: ['change'],
  data() {
    return {
      baseURL: (window as any).config.baseURL,
      taskInfo: {} as any, // 任务详情
      menber: [] as any, // 参与人
      copyMan: [] as any, // 抄送人
      menbergroup: [], // 成员单位
      labelsArr: [], // 标签
      alertWayName: [], // 告警方式
      unitSpread: false, // 单位是否折叠
      unitSpreadName: '展开全部',
      peopleSpread1: false, // 人员是否折叠
      peopleSpreadName1: '展开全部',
      peopleSpread2: false, // 人员是否折叠
      peopleSpreadName2: '展开全部',
      imgsArr: [], // 任务的图片附件
      selectedMaterialsArr: [], // 资源回显
    };
  },
  computed: {
    // 任务时限
    taskLimit() {
      const taskLimitSet = ['无时限', '分钟', '小时', '天', '月', '自定义'];
      if (this.taskInfo.timeLimitType) {
        const index = this.taskInfo.timeLimitType - 1;
        // 无时限
        if (index === 0) {
          return '无时限';
        }
        // 自定义
        if (index === 5) {
          return this.taskInfo.timeLimit;
        }
        return `${this.taskInfo.timeLimit}${taskLimitSet[index]}`;
      }
      return '无时限';
    },
  },
  watch: {
    taskId: {
      handler(val) {
        console.log(this.taskId);
        this.getTaskInfo(this.taskId);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    // 折叠
    unitSoreadFun() {
      if (this.unitSpread) {
        this.unitSpread = false;
        this.unitSpreadName = '展开全部';
      } else {
        this.unitSpread = true;
        this.unitSpreadName = '收起全部';
      }
    },
    peopleSoreadFun1() {
      if (this.peopleSpread1) {
        this.peopleSpread1 = false;
        this.peopleSpreadName1 = '展开全部';
      } else {
        this.peopleSpread1 = true;
        this.peopleSpreadName1 = '收起全部';
      }
    },
    peopleSoreadFun2() {
      if (this.peopleSpread2) {
        this.peopleSpread2 = false;
        this.peopleSpreadName2 = '展开全部';
      } else {
        this.peopleSpread2 = true;
        this.peopleSpreadName2 = '收起全部';
      }
    },
    /**
     * @desc 获取任务基本信息
     * @param {} params
     * @returns {} returns
     */
    getTaskInfo(taskId: any) {
      const param = {
        taskId,
      };
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/event/task/getTaskDetail',
        headers: {
          'Content-Type': 'application/json',
        },
        data: param,
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          this.taskInfo = response.data;
          this.menber = [...response.data.member];
          this.copyMan = [...response.data.cc];
          this.menbergroup = response.data.memberGroup;
          this.labelsArr = response.data.labels;
          this.alertWayName = response.data.alertWayName;
          this.imgsArr = response.data.appAttachments; // 任务的附件
          if (response.data.allocationDetails) {
            response.data.allocationDetails.forEach((ele: any) => {
              ele.wareHouse = JSON.parse(JSON.stringify(ele));
              ele.wareHouse.name = ele.wareHouse.storehouseName;
              ele.resources.forEach((e: any) => {
                e.value = e.storehouseNum;
                e.name = e.resourceName;
              });
              ele.wareHouseList = ele.resources;
            });
            this.selectedMaterialsArr = response.data.allocationDetails;
          }
        })
        .catch((error: any) => {
          (this as any).$message.error(
            `获取任务基本信息失败，错误信息：${error}`,
          );
        });
    },
    /**
     * @desc  获取cookie的值
     * @param {} params
     * @returns {} returns
     */
    getCookie(cname: string) {
      const name = `${cname}=`;
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
      }
      return '';
    },
    /**
     * @desc 获取预警名字
     * @param {} params
     * @returns {} returns
     */
    getAlertWayName(arr: any): string {
      let str = '';
      arr.forEach((element: any, index: any) => {
        str += element;
        if (index < arr.length - 1) {
          str += ',';
        }
      });
      return str;
    },
    /**
     * @desc 完成任务
     * @param {} params
     * @returns {} returns
     */
    overTask() {
      (this as any)
        .$MessageBox({
          type: 'delete',
          title: '提示',
          message: '确认完成任务？',
          tips: '完成后任务将完成',
          remark: true,
        })
        .then((res: any) => {
          // 请求参数
          const param = {
            taskId: this.taskId,
            status: 'finish',
            operation: 'finish',
            data: {
              address:
                decodeURI(this.getCookie('platformName')) || '暂无地理位置信息',
              attachmentIds: [],
              latitude: '',
              longitude: '',
              content: res,
            },
          };
          const request = {
            method: 'post',
            service: 'eoc',
            url: '/event/task/setTaskStatus',
            headers: {
              'Content-Type': 'application/json',
            },
            data: param,
          };
          (this as any)
            .$http(request)
            .then((response: any) => {
              this.getTaskInfo(this.taskId);
              this.$emit('change', '');
            })
            .catch((error: any) => {
              (this as any).$message.error(`任务取消失败，错误信息：${error}`);
            });
        });
    },
    /**
     * @desc 取消任务
     * @param {} params
     * @returns {} returns
     */
    cancleTask() {
      (this as any)
        .$MessageBox({
          type: 'delete',
          title: '提示',
          message: '确认取消任务？',
          tips: '',
          remark: true,
        })
        .then((res: any) => {
          console.log(res);
          // 请求参数
          const param = {
            taskId: this.taskId,
            status: 'cancel',
            operation: 'cancel',
            data: {
              address:
                decodeURI(this.getCookie('platformName')) || '暂无地理位置信息',
              attachmentIds: [],
              latitude: '',
              longitude: '',
              content: res === '' ? '情况有变，任务取消' : res,
            },
          };
          const request = {
            method: 'post',
            service: 'eoc',
            url: '/event/task/setTaskStatus',
            headers: {
              'Content-Type': 'application/json',
            },
            data: param,
          };
          (this as any)
            .$http(request)
            .then((response: any) => {
              this.$emit('change', '');
            })
            .catch((error: any) => {
              (this as any).$message.error(`任务取消失败，错误信息：${error}`);
            });
        });
    },
    /**
     * @desc 重启任务
     * @param {} params
     * @returns {} returns
     */
    restartTask() {
      (this as any)
        .$MessageBox({
          type: 'delete',
          title: '提示',
          message: '确认重启任务？',
          tips: '',
          remark: true,
        })
        .then((res: any) => {
          console.log(res);
          // 请求参数
          const param = {
            taskId: this.taskId,
            status: 'restart',
            operation: 'restart',
            data: {
              address:
                decodeURI(this.getCookie('platformName')) || '暂无地理位置信息',
              attachmentIds: [],
              latitude: '',
              longitude: '',
              content: res,
            },
          };
          const request = {
            method: 'post',
            service: 'eoc',
            url: '/event/task/setTaskStatus',
            headers: {
              'Content-Type': 'application/json',
            },
            data: param,
          };
          (this as any)
            .$http(request)
            .then((response: any) => {
              this.$emit('change', '');
            })
            .catch((error: any) => {
              (this as any).$message.error(`任务重启失败，错误信息：${error}`);
            });
        });
    },
    // type文件类型 image、file、video
    /**
     * @desc 返回对应文件类型数组
     * @param {} params
     * @returns {} returns
     */
    returnfile(list: any, type: string) {
      const arr: any = [];
      list.forEach((element: any) => {
        if (element?.dictionaryType?.code === type) {
          arr.push(element);
        }
      });
      return arr;
    },
    /**
     * @desc  打开发布任务弹窗
     * @param {} params
     * @returns {} returns
     */
    openPublishTask(title: string) {
      if ((this as any).$addDialog) {
        (this as any).$addDialog(title, TaskPublishDialog, {
          taskId: this.taskId,
          refresh: () => this.getTaskInfo(this.taskId),
          isRestart: title === '重启任务',
        });
      }
    },
    // 打电话
    callPhone(item: any) {
      makePhoneCall({
        phone: item.mobile1,
        type: 1,
        id: item.id,
        name: item.name,
      });
    },
    // 发短信
    sendSms(taskId: string, contactorId: string) {
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/event/task/sendTaskNoticeMessage',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          taskId,
          contactorId,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.errorcode === 0 || response.code === 0) {
          (this as any).$message.success('短信发送成功！');
        }
      }).catch((error: any) => {
        (this as any).$message.error(`短信发送失败！错误信息：${error}`);
      });
    },
  },
});
</script>

<style lang="scss" src="./taskinfomation.scss"></style>
