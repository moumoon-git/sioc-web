import { getCurrentInstance } from 'vue';

let TaskScheduleListInstance: any = null;

export function jumpToTaskDetail(task: any) {
  if (TaskScheduleListInstance) {
    TaskScheduleListInstance.checkoutTaskDetail(task);
  }
}

export default function () {
  TaskScheduleListInstance = getCurrentInstance()?.proxy;
}
