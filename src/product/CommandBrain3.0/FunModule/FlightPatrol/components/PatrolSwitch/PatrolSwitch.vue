<template>
  <div class="patrol-switch">
    <p>
      <label>已巡时间：</label>
      <span v-if="isPatrolling">{{ countDown }}</span>
      <span v-else>未开始</span>
    </p>
    <!-- <p>
      <label>已巡数量：</label>
      <span v-if="isPatrolling">{{ numbers }}</span>
      <span v-else>未开始</span>
    </p> -->
    <!-- <p>
      <label>单画面巡查时间：</label>
      <span v-if="isPatrolling">{{ durationList[duration] }}</span>
      <Select
        v-else
        v-model="duration"
        :is-top="true"
        :list="durationList"
        :clearable="false"
      />
    </p> -->
    <Button :type="isPatrolling ? 'red' : 'blue'" @click="udsHeartbeat">
      {{ isPatrolling ? '停止巡查' : '启动巡查' }}
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Select from '@/product/CommandBrain3.0/Generalparts/right/Select/Select.vue';
import Button from '@/product/CommandBrain3.0/Generalparts/right/Button/Button.vue';
import {
  initiatePolling,
  cancelInitiatePolling,
  stopVideoPreview,
  heartbeat,
  addCallback,
  uds,
  removeCallback,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';

export default defineComponent({
  name: 'PatrolSwitch',
  components: {
    // 底部按钮
    Button,
    // 选择器
    Select,
  },
  props: {
    parentNode: {
      type: String,
      default: '',
    },
    taskName: {
      type: String, // 分组名
      default: '',
    },
    taskObj: {
      type: Object, // 分组名
      default: () => {},
    },
    taskType: {
      type: Number, // 类型
      default: () => 0,
    },
  },
  data() {
    return {
      // 是否巡察中
      isPatrolling: (this as any).$store.state.flightPatrol.dispatchDeskState,
      // 巡察计时
      countDown: '00:00',
      // 已巡数量
      numbers: 0,
      // 翻页周期
      duration: 0,
      durationList: ['1分钟', '3分钟', '5分钟', '10分钟'],
      // uds登录状态查看
      udsLoginState: false,
    };
  },
  watch: {
    isPatrolling(val) {
      if (val) {
        const time = Date.now();
        this.timeIng(time);
      } else {
        this.countDown = '00:00';
      }
    },
    '$store.state.flightPatrol.dispatchDeskState': {
      handler(newVal, oldVal) {
        // console.log(newVal, oldVal);
        this.isPatrolling = newVal;
      },
    },
  },
  methods: {
    calculateTime(time: number): string {
      const div = Date.now() - time;
      const minute = Math.floor(div / 1000 / 60) % 60;
      const second = Math.floor(div / 1000) % 60;
      return `${minute > 9 ? minute : `0${minute}`}:${
        second > 9 ? second : `0${second}`
      }`;
    },
    /*
     * 启动或者停止巡查
     */
    startPatrol() {
      if (!uds.client) {
        (this as any).$message.error('连接通讯服务器失败，请重新打开');
        uds.waken()
        return;
      }
      const date: string = new Date().toISOString().split('T')[0];
      const time: string = new Date().toTimeString().split(' ')[0];
      const taskName = this.taskName
        ? this.taskName
        : `${`${date} ${time}`}飞巡任务`;
      const recordObj: any = {
        name: taskName,
        type: this.taskType,
      };
      (this as any).$store.commit(
        'flightPatrol/SET_flightPatrolRecord',
        recordObj,
      );
      // uds已经登录
      if (this.udsLoginState) {
        // 启动巡查
        const dispatchDeskData = JSON.parse(
          JSON.stringify(
            (this as any).$store.state.flightPatrol.dispatchDeskData,
          ),
        );
        const device: any = dispatchDeskData.reduce(
          (pre: any, ele: any) => {
            let arr = pre;
            arr = pre.concat(ele.device);
            return arr;
          },
          [],
        );
        if (!this.isPatrolling) {
          // eslint-disable-next-line radix
          const interval = parseInt(this.durationList[this.duration]) * 60;
          // 进入巡查的时候生成 任务id 和 启动任务时间
          // console.log(device);
          const randomNumber = `${Math.ceil(Math.random() * 10000)}`;
          (this as any).$store.commit(
            'flightPatrol/SET_taskid',
            randomNumber,
          );
          // 在大屏发起视频轮询时
          if ((this as any).$store.state.btnTab) {
            device.forEach((ele:any) => {
              ele.code = ele.num;
            });
            (this as any).$store.commit('SET_isFlight', true);
            (this as any).$store.commit('SET_VIDEOARR', device);
            (this as any).$store.commit('SET_GROUPNAME', `${randomNumber}`);
            return;
          }
          initiatePolling(taskName,randomNumber,device)
        } else {
          const { taskid } = (this as any).$store.state.flightPatrol;
          // 在大屏停止视频轮询时
          if ((this as any).$store.state.btnTab) {
            const numberArr = device.reduce((pre:any,ele:any)=>{
              pre.push(ele.num);
              return pre;
            }, []);
            const deviceName = device.reduce((pre:any,ele:any)=>{
              pre.push(ele.name);
              return pre;
            }, []);
            const obj = {
              number: numberArr.join(),
              isFlight: 1,
              taskid,
              deviceName: deviceName.join(),
            }
            stopVideoPreview(obj);
            (this as any).$store.commit('SET_isFlight', false);
            (this as any).$store.commit('SET_VIDEOARR', []);
            (this as any).$store.commit('SET_GROUPNAME', '');
            console.log('暂停轮询');
          } else {
            cancelInitiatePolling(taskid)
          }
        }
      }
    },
    /*
     * 延续状态
     */
    continueSet() {
      // 如果已经在某个地方启动了巡查就继续它的及时和样式改变
      if ((this as any).isPatrolling) {
        const { startTime } = (this as any).$store.state.flightPatrol;
        const time = new Date(startTime).getTime();
        this.timeIng(time);
      }
    },
    /*
     * 计时
     */
    timeIng(time: number) {
      const intvl = setInterval(() => {
        this.countDown = this.calculateTime(time);
        if (!this.isPatrolling) {
          clearInterval(intvl);
        }
      }, 100);
    },
    // 检查uds的登录状态
    udsHeartbeat() {
      const that = this;
      heartbeat()
      let loginState:boolean = false;
      const cb = (code:number)=>{
        if(code === 5){
          loginState = true;
          that.udsLoginState = true;
          that.startPatrol()
        }
      }
      addCallback(cb);
      setTimeout(()=>{
        if(loginState) {
          removeCallback(cb)
        }else{
          uds.waken()
        }
      },1000)
    },
  },
});
</script>

<style lang="scss">
.patrol-switch {
  height: 100%;
  position: relative;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 26px;
  & > p {
    margin: 2px 0;
    padding: 0;
    color: #ffffff;
    font-weight: 400;
    line-height: 32px;
    & > :last-child {
      font-weight: 500;
    }
    & > span,
    & > label {
      font-size: 18px;
    }
  }
  // 按钮
  & > :last-child {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
