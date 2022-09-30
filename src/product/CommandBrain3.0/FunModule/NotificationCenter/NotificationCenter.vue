<template>
  <teleport to="body">
    <div :class="$style.container">
      <transition-group name="notification-popup">
        <NotificationPopup
          v-for="(notification, index) in notificationList"
          :key="notification.id"
          :class="$style.notification"
          :style="{
            bottom: `${(notificationList.length - index) * 15}px`,
          }"
          title="告警提醒"
          @close="closeNotification(index)"
        >
          <div :class="$style.notification">
            <div :class="$style.msg">您有任务即将超时，请尽快处理！</div>
            <div :class="$style.footer">
              <button :class="$style.ghostbtn" @click="closeNotification(index)">
                忽略
              </button>
              <button :class="$style.primarybtn" @click="checkoutTask(index)">查阅任务</button>
            </div>
          </div>
        </NotificationPopup>
      </transition-group>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';
import NotificationPopup from './components/NotificationPopup/NotificationPopup.vue';
import useUserAlertTaskList from './services/useUserAlertTaskList';
import { jumpToTaskDetail } from './hooks/useJumpToTaskDetail';

const [notificationList, getNotificationList] = useUserAlertTaskList();
getNotificationList();

ws.subscribe(
  `/platform/${document.cookie.match(/platformId=([^;]*)/)?.[1]}/message`,
  (msg: any) => {
    if (msg?.msgType === 60006) {
      getNotificationList();
    }
  },
);

const closeNotification = (index: number) => {
  notificationList.value.splice(index, 1);
};

const $tabModules = inject<Function>('$tabModules');

const checkoutTask = (index: number) => {
  if ($tabModules) {
    $tabModules({
      name: '任务调度',
      icon: 'task',
      type: '',
    });
    setTimeout(() => {
      jumpToTaskDetail(notificationList.value[index]);
      closeNotification(index);
    }, 100);
  }
};

</script>

<style lang="scss" module>
.container {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  width: 0;
  height: 0;
}
.notification {
  position: absolute;
  right: 10px;
  color: #fff;
  .msg {
    height: 60px;
    line-height: 60px;
    color: #fff;
  }
  .footer {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ghostbtn {
    width: 70px;
    border: 1px solid currentColor;
    border-radius: 4px;
    background: transparent;
    outline: none;
    color: #fff;
    cursor: pointer;
    margin-right: 20px;
    &:hover {
      color: #00c1de;
    }
  }
  .primarybtn {
    width: 70px;
    border-radius: 4px;
    background: #00c1de;
    border: 1px solid #00c1de;
    outline: none;
    color: #fff;
    cursor: pointer;
    &:hover {
      filter: brightness(110%);
    }
  }
}
</style>

<style scoped>
.notification-popup-enter-active,
.notification-popup-leave-active {
  transition: all 1s linear;
}
.notification-popup-enter-from,
.notification-popup-leave-to {
  opacity: 0;
}
</style>
