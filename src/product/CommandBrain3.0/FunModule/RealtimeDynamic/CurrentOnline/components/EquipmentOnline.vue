<template>
  <main :class="$style.EquipmentOnline">
    <template
      v-for="(item, index) in EquipmentOnlineList"
      :key="index"
    >
      <Expand
        :show-check="false"
      >
        <!-- 2-1. 类型标题 -->
        <template #title>
          <div :class="$style.title">
            <span>{{ item.title.label + item.title.count }}</span>
          </div>
        </template>
        <!-- 2-2. 具体列表 -->
        <template #list>
          <ul :class="$style.list">
            <li
              v-for="(member, i) in item.memberList"
              :key="i"
              @click="panTo(member?.longitude, member?.latitude)"
            >
              <!-- 2-2-1. 图标 -->
              <img
                :src="require('../../imgs/'+ deviceType2Icon(member?.deviceType, member?.status) +'.svg')"
                alt=""
                draggable="false"
              >
              <!-- 2-2-2. 名称和地址 -->
              <div :class="$style.listContent">
                <p :class="$style.name">
                  {{ member.name || '暂无名称' }}
                </p>
                <p :class="$style.address">
                  {{ member.address || '暂无地址' }}
                </p>
              </div>
            </li>
          </ul>
        </template>
      </Expand>
    </template>
  </main>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Expand from '@/product/CommandBrain3.0/Generalparts/right/Expand/Expand.vue';
import { useEquipment } from '../useHooks/currentOnlineModel';
import useMapDrawing from '../useHooks/useMapDrawing';

export default defineComponent({
  name: 'EquipmentOnline',
  components: {
    Expand,
  },
  setup() {
    const { panTo } = useMapDrawing();
    const activeNames = ref<number[]>([0, 1, 2]);
    const { EquipmentOnlineList } = useEquipment();

    // status 0 在线 1 离线
    const deviceType2Icon = (deviceType: number, status: number) => {
      // 0: 'device-0-online', // 监控视频
      // 1: 'device-1-online', // 会场终端
      // 2: 'device-2-online', // 集群终端
      // 3: 'device-3-online', // wecomm
      return `device-${deviceType}-${status === 0 ? 'online' : 'offline'}`

    };
    return {
      activeNames,
      EquipmentOnlineList,
      deviceType2Icon,
      panTo,
    };
  },

});
</script>
<style lang="scss" module src="../styles/currentOnline.scss">

</style>
