<template>
  <main :class="$style.OnlinePersonnel">
    <template
      v-for="(item, index) in OnlinePersonnelList"
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
              @mouseenter="mouseHover(index, i, true)"
              @mouseleave="mouseHover(index, i, false)"
              @click="panTo(member.longitude, member.latitude)"
            >
              <!-- 2-2-1. 图标 -->
              <img
                :src="require('../../imgs/'+ deviceType2Icon[member.deviceType] +'.svg')"
                alt=""
                draggable="false"
              >
              <!-- 2-2-2. 名称和地址 -->
              <div :class="$style.listContent">
                <p :class="$style.name">
                  {{ member.name || '暂无名称' }}
                  <!-- 联系人 -->
                  <ContactMoreButton
                    v-if="item.title.label === '联系人'"
                    :id="member.id"
                  />
                  <!-- 队伍，先对应负责人，再对应联系人 -->
                  <ContactMoreButton
                    v-if="
                      item.title.label === '应急队伍' &&
                        (member.contactorList?.length || member.responsiblesList?.length)
                    "
                    :id="member.responsiblesList?.[0].id ?? member.contactorList?.[0].id"
                  />
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
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
import { usePerson } from '../useHooks/currentOnlineModel';
import useMapDrawing from '../useHooks/useMapDrawing';

export default defineComponent({
  name: 'OnlinePersonnel',
  components: {
    ContactMoreButton,
    Expand,
  },
  setup() {
    const { $mapDialog } = useGlobal();
    const { panTo } = useMapDrawing();
    const activeNames = ref<number[]>([0, 1]);
    const { OnlinePersonnelList, mouseHover } = usePerson();

    const deviceType2Icon = {
      '-1': 'contactor-online', // app在线
      2: 'contactor-device-2-online', // 集群终端
      3: 'contactor-device-3-online', // wecomm
    };
    // 测试弹窗代码
    const show = (index:string) => {
      let modle = 'NotabLocation';
      if (index === '联系人') {
        modle = 'NoTabNormal';
      } else {
        modle = 'NotabLocation';
      }
      const mapDialogInstance = $mapDialog({
        modle,
      });
      console.log(modle, '12313312');

      mapDialogInstance.open({
        responseData: {
          latitude: 23,
          longitude: 113.41,
        },
      });
    };
    return {
      OnlinePersonnelList,
      activeNames,
      mouseHover,
      deviceType2Icon,
      show,
      panTo,
    };
  },

});
</script>
<style lang="scss" module src="../styles/currentOnline.scss">

</style>
