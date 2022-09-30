<template>
  <ModalDialog
    v-model="visible"
    title="发起会议"
    :z-index="10005"
  >
    <div
      v-loading="isLoading"
      :class="$style.container"
    >
      <header>
        <template v-if="!isEditting">
          <h2 :class="$style.title">
            {{ title }}
          </h2>
          <button
            :class="$style.editButton"
            @click="isEditting = true"
          />
        </template>
        <EditInput
          v-else
          :value="title"
          style="margin-left: 20px"
          @cancel="isEditting = false"
          @confirm="handleTitleChange"
        />
        <button @click="selectMembers">
          邀请入会
        </button>
      </header>
      <main>
        <mark
          v-if="addedMemberList.size === 0"
          :class="$style.emptyTips"
        >
          暂未添加会议成员
        </mark>
        <template v-else>
          <div :class="$style.menu">
            <TitleMenu
              v-model="currentMenuIndex"
              :menu-list="menuList.map((item) => `${item.name} ${item.count}`)"
              style="margin: 0 20px 0"
            />
          </div>
          <ul>
            <li
              v-for="item in memberList"
              :key="item.id"
              :class="$style[`type${item.memberType}`]"
            >
              {{ item.name }}
              <button
                :class="$style.deleteButton"
                @click="deleteMember(item)"
              />
            </li>
          </ul>
        </template>
      </main>
      <footer>
        <StartMeetingButton @click="start" />
      </footer>
    </div>
  </ModalDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  onBeforeUnmount,
  watch,
  computed,
  getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex';
import ModalDialog from '@/product/CommandBrain3.0/Generalparts/dialog/ModalDialog/ModalDialog.vue';
import EditInput from '@/product/CommandBrain3.0/Generalparts/right/EditInput/EditInput.vue';
import {
  createMeeting,
  addCallback,
  removeCallback,
  queryMeetingStatus,
  meetingStartTime,
  addMeetingMembers,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';
import StartMeetingButton from './components/StartMeetingButton/StartMeetingButton.vue';
import TitleMenu from '../../components/TitleMenu/TitleMenu.vue';

export default defineComponent({
  name: 'StartMeetingDialog',
  components: {
    ModalDialog,
    EditInput,
    // 开始会议按钮
    StartMeetingButton,
    TitleMenu,
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const store = useStore();
    const {
      $message,
    }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const visible = ref(false);
    const isLoading = ref(false);
    const inviteMember: any = inject('inviteMember');
    const addedMemberList = ref(new Map());
    const title = ref(
      `${document.cookie.match(/userName=([^;]*);?/)?.[1] || ''}发起的会议`,
    );
    const isEditting = ref(false);
    const currentMenuIndex = ref(0);
    const menuList = ref([
      { name: '全部', count: 0 },
      { name: '联系人', count: 0 },
      { name: '专家', count: 0 },
      { name: '监控视频', count: 0 },
      { name: '会场终端', count: 0 },
      { name: '集群', count: 0 },
      { name: '其他', count: 0 },
    ]);
    watch(
      addedMemberList,
      (newVal) => {
        currentMenuIndex.value = 0;
        const newValue = Array.from(newVal, (entry) => entry[1]);
        menuList.value = [
          { name: '全部', count: newValue?.length || 0 },
          {
            name: '联系人',
            count: newValue?.filter((i: any) => i.memberType < 4).length || 0,
          },
          {
            name: '专家',
            count: newValue?.filter((i: any) => i.memberType === 10).length || 0,
          },
          {
            name: '监控视频',
            count: newValue?.filter((i: any) => i.memberType === 5).length || 0,
          },
          {
            name: '会场终端',
            count: newValue?.filter((i: any) => i.memberType === 6 || i.memberType === 7).length || 0,
          },
          {
            name: '集群',
            count: newValue?.filter((i: any) => i.memberType === 8).length || 0,
          },
          {
            name: '其他',
            count:
              newValue?.filter(
                (i: any) => i.memberType === 4 || i.memberType === 9,
              ).length || 0,
          },
        ];
      },
      {
        deep: true,
      },
    );
    const memberList = computed(() => {
      const tmp = Array.from(addedMemberList.value, (entry) => entry[1]);
      switch (currentMenuIndex.value) {
        case 0: {
          return tmp || [];
        }
        case 1: {
          return tmp?.filter((i: any) => i.memberType < 4) || [];
        }
        case 2: {
          return tmp?.filter((i: any) => i.memberType === 10) || [];
        }
        case 3: {
          return tmp?.filter((i: any) => i.memberType === 5) || [];
        }
        case 4: {
          return tmp?.filter((i: any) => i.memberType === 6 || i.memberType === 7) || [];
        }
        case 5: {
          return tmp?.filter((i: any) => i.memberType === 8) || [];
        }
        case 6: {
          return (
            tmp?.filter((i: any) => i.memberType === 4 || i.memberType === 9)
            || []
          );
        }
        default:
          return [];
      }
    });
    onBeforeUnmount(() => {
      addedMemberList.value.clear();
    });
    function selectMembers() {
      const options = Array.from(addedMemberList.value, (entry) => entry[1]);
      inviteMember(options).then((res: any) => {
        res.forEach((i: any) => {
          addedMemberList.value.set(i.id, i);
        });
        console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', addedMemberList);
      });
    }
    // 打开弹窗
    function open(
      list?: {
        memberType: number;
        id: number;
        name: string;
        phone?: number;
        mobile1?: number;
        mobile2?: number;
        meetingCode?: number;
      }[],
    ) {
      addedMemberList.value.clear();
      if (list) {
        list.forEach((i) => {
          addedMemberList.value.set(i.id, i);
        });
      }
      title.value = `${
        document.cookie.match(/userName=([^;]*);?/)?.[1] || ''
      }发起的会议`;
      isEditting.value = false;
      visible.value = true;
    }
    /**
     * 打开弹窗创建会议或直接加入正在进行的会议
     */
    function createOrAddMeeting(
      list: {
        memberType: number;
        id: number;
        name: string;
        phone?: number;
        mobile1?: number;
        mobile2?: number;
        meetingCode?: number;
      }[],
    ) {
      queryMeetingStatus().then(() => {
        if (meetingStartTime.value) {
          $message.info('发起入会成功');
          addMeetingMembers(
            list.map((i: any) => ({
              Id: i.id,
              Name: i.name,
              Number: i.meetingCode || i.contextValue || i.phone || i.mobile1 || i.mobile2 || 0,
              Type: i.memberType < 5
                ? 1
                : i.memberType === 8
                ? 4
                : i.memberType === 5
                ? 9
                : 8,
            })),
          );
        } else {
          open(list);
        }
      });
    }
    // 启动会议
    function start() {
      if (addedMemberList.value.size) {
        const members = Array.from(addedMemberList.value, (entry) => ({
          Id: entry[1].joinType ? 0 : entry[1].id,
          Type:
            (entry[1].memberType < 5 || entry[1].memberType === 10)
              ? 1
              : entry[1].memberType === 8
              ? 4
              : entry[1].memberType === 5
              ? 9
              : 8,
          Name: entry[1].joinType ? '' : entry[1].name,
          Number: entry[1].joinType
            ? entry[1].memberCode
            : entry[1].meetingCode || entry[1].contextValue || entry[1].phone || entry[1].mobile1 || entry[1].mobile2 || entry[1].code,
        }));
        const cb = (code: number, message: any) => {
          visible.value = false;
          if (code === 103) {
            if (message.result) {
              $message.info('创建会议成功');
              emit('refresh');
            } else {
              $message.error('创建会议失败');
            }
            removeCallback(cb);
          }
        };
        addCallback(cb);
        createMeeting(title.value, members, store.state.event?.id);
      } else {
        $message.error('请选择与会成员');
      }
    }
    // 修改标题
    function handleTitleChange(newTitle: string) {
      title.value = newTitle
        || `${document.cookie.match(/userName=([^;]*);?/)?.[1] || ''}发起的会议`;
      isEditting.value = false;
    }
    // 移除与会成员
    function deleteMember(item: any) {
      addedMemberList.value.delete(item.id);
    }
    return {
      visible,
      open,
      addedMemberList,
      selectMembers,
      title,
      isEditting,
      currentMenuIndex,
      menuList,
      memberList,
      handleTitleChange,
      start,
      isLoading,
      deleteMember,
      createOrAddMeeting,
    };
  },
});
</script>

<style lang="scss" module src="./styles/StartMeetingDialog.scss" />
