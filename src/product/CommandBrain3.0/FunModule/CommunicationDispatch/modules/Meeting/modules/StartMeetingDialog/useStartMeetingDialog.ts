import { ref, provide } from 'vue';

const startMeetingDialogRef = ref<any>(null);
const selectMemberDialogRef = ref<any>(null);
// 打开开始会议弹窗
export function openStartMeetingDialog(list?: {
  memberType: number;
  id: number;
  name: string;
  phone?: number;
  mobile1?: number;
  mobile2?: number;
}[]): void {
  if (startMeetingDialogRef.value) {
    startMeetingDialogRef.value.open(list);
  }
}
export default () => {
  provide('$startMeeting', openStartMeetingDialog);
  // 打开选择会议成员弹窗
  function openSelectMemberDialog(options?: any) {
    if (selectMemberDialogRef.value) {
      return selectMemberDialogRef.value.open(options);
    }
    return Promise.resolve();
  }
  provide('inviteMember', openSelectMemberDialog);
  return {
    startMeetingDialogRef,
    selectMemberDialogRef,
    openStartMeetingDialog,
    openSelectMemberDialog,
  };
};
