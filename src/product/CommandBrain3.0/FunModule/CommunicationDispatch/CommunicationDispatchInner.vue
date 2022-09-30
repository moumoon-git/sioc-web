<template>
  <div
    :id="uid.slice(1)"
    :class="$style.container"
  >
    <!-- 左侧导航 -->
    <LeftNav v-model="activeIcon" />
    <!-- 右侧内容 -->
    <main>
      <component :is="activeComponent" />
    </main>
  </div>
</template>

<script lang="ts">
import {
 defineComponent, ref, computed, provide,
} from 'vue';
import {
  stepToFax,
  } from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS'; // 链接uds发送方法
import LeftNav from './modules/LeftNav/LeftNav.vue';
import Message from './modules/Message/Message.vue';
import Phone from './modules/Phone/Phone.vue';
import SMS from './modules/SMS/SMS.vue';
import Meeting from './modules/Meeting/Meeting.vue';
import Announcement from './modules/Announcement/Announcement.vue';
import Structure from './modules/Structure/Structure.vue';
import Device from './modules/Device/Device.vue';
import Fax from './modules/fax/FaxIndex.vue';

export default defineComponent({
  name: 'CommunicationDispatchInner',
  components: {
    // 左侧导航栏
    LeftNav,
    // 消息模块
    Message,
    // 电话模块
    Phone,
    // 短信模块
    SMS,
    // 会议模块
    Meeting,
    // 通告模块
    Announcement,
    // 组织架构模块
    Structure,
    // 设备模块
    Device,
    // 预留的传真模块
    Fax,
  },
  setup() {
    const uid = `#uid${Math.round(10000 * Math.random())}`;
    provide('containerId', uid);
    const activeIcon = ref('phone');
    // 子模块可以通过inject后修改值，从而切换模块
    provide('activeIcon', activeIcon);
    const activeComponent = computed(() => {
      switch (activeIcon.value) {
        case 'message': {
          stepToFax(); // uds跳转到传真模块;
          return 'Fax';
        }
        case 'phone': {
          return 'Phone';
        }
        case 'sms': {
          return 'SMS';
        }
        case 'meeting': {
          return 'Meeting';
        }
        case 'announcement': {
          return 'Announcement';
        }
        case 'structure': {
          return 'Structure';
        }
        case 'device': {
          return 'Device';
        }
        default:
          return '';
      }
    });
    return {
      uid,
      activeIcon,
      activeComponent,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  width: 1240px;
  height: 742px;
  display: flex;
  position: relative;
  & > main {
    // flex: 1;
    width: calc(100% - 88px);
  }
}
</style>
