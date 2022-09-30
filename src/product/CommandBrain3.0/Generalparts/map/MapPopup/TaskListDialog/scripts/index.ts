import { onMounted, reactive, Ref } from 'vue';

// 打开弹窗所需参数类型
type TaskListDialogConfig = {
    // 任务坐标
    longitude?: number,
    latitude?: number,
    // 任务标题
    title?: string,
    // 任务类型
    typeName: string,
    // 任务时限
    endTime: string,
    // 任务状态
    statusName: string,
    // 负责人
    responsiblePerson: any,
    // 任务说明
    content: string,
    // 任务地址
    address: string
    // 任务附件
    appAttachments: {
      path: string,
      filename: string,
      extension: string,
    }[],
    // 任务标签
    labels: {
      name: string,
    }[],
}
// 当前详情
const currentDetail = reactive<TaskListDialogConfig>({
      title: '任务标题',
      typeName: '任务类型',
      endTime: '2021-04-27 11:09:14',
      statusName: '执行中',
      responsiblePerson: {
        name: '负责人',
      },
      content: '任务说明',
      address: '任务地址',
      appAttachments: [],
      labels: [{
        name: '标签1',
      }],
    });
/**
 * 计算剩余时间
 *
 * @param {String} time 任务时限
 */
const calculateRestTime = (time: string) => {
  const endTime = new Date(time).getTime();
  const nowTime = Date.now();
  const delta = nowTime - endTime;
  const day = Math.floor(Math.abs(delta / 1000 / 60 / 60 / 24));
  const hour = Math.floor(Math.abs(delta / 1000 / 60 / 60) % 24);
  const minute = Math.floor(Math.abs(delta / 1000 / 60) % 60);
  return `${delta > 0 ? '超时' : '剩余'}：${day}天${hour}小时${minute}分`;
};

export default () => {
  return {
    currentDetail,
    calculateRestTime,
  };
};
