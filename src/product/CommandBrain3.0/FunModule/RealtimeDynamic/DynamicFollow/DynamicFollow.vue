<template>
  <Dialog
    title="动态关注"
    @close="handleExit"
  >
    <div
      v-loading="isLoading > 0"
      :class="$style.container"
    >
      <!-- 1. 类型单选器 -->
      <header :class="$style.header">
        <ButtonRadio
          v-model="dynamicFollowTypeListIndex"
          :list="dynamicFollowTypeList"
        />
      </header>
      <!-- 2. 列表 -->
      <main :class="$style.main">
        <template
          v-for="type in dynamicFollowTypeList"
          :key="type.name"
        >
          <Expand
            v-if="
              dynamicFollowList?.[type.key]
                && (dynamicFollowTypeList[dynamicFollowTypeListIndex] === type
                  || dynamicFollowTypeList[dynamicFollowTypeListIndex].name === '全部')
            "
            :show-check="false"
          >
            <!-- 2-1. 类型标题 -->
            <template #title>
              <div :class="$style.title">
                <span>{{ type.name }}（{{ type.value || 0 }}）</span>
                <button
                  v-if="type.value"
                  :class="$style.textBtn"
                  style="margin-left: auto;"
                  @click.stop="handleUnfollow(
                    dynamicFollowList[type.key].map(
                      (i) => ({
                        id: i.id,
                        type: typeof i.type === 'number' ? type.key : i.type || type.key,
                        eventId: $store.state.event?.id,
                      })
                    )
                  )"
                >
                  取消全部关注
                </button>
              </div>
            </template>
            <!-- 2-2. 具体列表 -->
            <template #list>
              <ul :class="$style.list">
                <li
                  v-for="item in dynamicFollowList[type.key] || []"
                  :key="item"
                  @click="panTo(item.longitude, item.latitude)"
                >
                  <!-- 2-2-1. 图标 -->
                  <div
                    :class="[
                      $style.icon,
                      $style[getIconClassName(type, item)],
                    ]"
                  />
                  <!-- 2-2-2. 名称和地址 -->
                  <div :class="$style.listContent">
                    <p>
                      <span>{{ item.name || item.title || item.source || '暂无名称' }}</span>
                      <ContactMoreButton
                        v-if="type.name === '人员'"
                        :id="item.id || item.contactorId"
                      />
                    </p>
                    <p>
                      {{ item.address || '暂无地址' }}
                    </p>
                  </div>
                  <!-- 2-2-3. 取消关注按钮 -->
                  <button
                    :class="$style.textBtn"
                    @click.stop="handleUnfollow([{
                      id: item.id,
                      type: typeof item.type === 'number' ? type.key : item.type || type.key,
                      eventId: $store.state.event?.id,
                    }])"
                  >
                    取消关注
                  </button>
                </li>
              </ul>
            </template>
          </Expand>
        </template>
      </main>
    </div>
  </Dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  watch,
} from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/right/Dialog/Dialog.vue';
import ButtonRadio from '@/product/CommandBrain3.0/Generalparts/right/ButtonRadio/ButtonRadio.vue';
import Expand from '@/product/CommandBrain3.0/Generalparts/right/Expand/Expand.vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import useDynamicFollowList from './scripts/useDynamicFollowList';
import { deleteDynamicFollow } from './scripts/useDeleteDynamicFollow';
import useMarkersDrawing from './scripts/useMarkersDrawing';

export default defineComponent({
  name: 'DynamicFollow',
  components: {
    Dialog,
    ButtonRadio,
    Expand,
    ContactMoreButton,
  },
  setup() {
    // 打开轨迹跟踪
    const openRoutesTrack = inject<() => void>('openRoutesTrack');
    // 切换父组件模块
    const $tabModules = inject<(data: any) => void>('$tabModules');
    const handleExit = () => {
      if ($tabModules) {
        $tabModules({ icon: '' });
      }
    };
    const isLoading = ref(0);
    const {
      // 列表数据
      dynamicFollowList,
      // 类型列表
      dynamicFollowTypeList,
      // 当前类型下标
      dynamicFollowTypeListIndex,
      // 获取列表数据
      getDynamicFollowList,
    } = useDynamicFollowList();
    const {
      // 移动地图中心点
      panTo,
      // 绘制落点
      drawMarkers,
    } = useMarkersDrawing();
    // 监听列表变化，绘制对应落点
    watch([dynamicFollowTypeListIndex, dynamicFollowList], ([newIndex, newList]) => {
      const type = dynamicFollowTypeList.value[newIndex];
      if (type.key) {
        // 绘制单个类型的落点
        drawMarkers({ [type.key]: newList[type.key] });
      } else {
        // 绘制所有落点
        drawMarkers(newList);
      }
    }, { immediate: true, deep: true });
    /**
     * 获取图标类名
     * @param type 列表类型
     * @param item 列表项
     */
    function getIconClassName(type: any, item: any) {
      switch (type.key) {
        case 'contactor': {
          // 默认设备类型，wecomm或联系人集群终端需要显示图标
          const defaultDeviceType = item?.defaultDevice?.type;
          // 联系人
          return `icon--contactor${
            defaultDeviceType === 2 || defaultDeviceType === 3 ? `-device-${defaultDeviceType}` : ''
          }-${item.isOnline ? 'online' : 'offline'}`;
        }
        case 'task': {
          // 任务
          return 'icon--task-online';
        }
        case 'resource': {
          // 资源
          return `icon--${item.type}-online`;
        }
        case 'person': {
          // 队伍且默认设备的类型是2或3（wecomm或集群终端）
          if (item?.defaultDevice?.type === 2 || item?.defaultDevice?.type === 3) {
            return `icon--team-device-${item.defaultDevice.type}-${item.defaultDevice.status === 0 ? 'online' : 'offline'}`;
          }
          // 队伍
          return 'icon--team-online';
        }
        case 'riskDanger': {
          // 风险
          return 'icon--riskDanger-online';
        }
        case 'device': {
          // 设备，只有wecomm和集群终端有离线状态
          return `icon--device-${item.type}-${
            item.status === 0 || item.type === 0 || item.type === 1
              ? 'online'
              : 'offline'
          }`;
        }
        default:
          return '';
      }
    }
    /**
     * 取消关注
     */
    function handleUnfollow(ids: { id: number, type: number, eventId: number }[]) {
      isLoading.value += 1;
      deleteDynamicFollow(ids)
        .then(getDynamicFollowList)
        .finally(() => {
          isLoading.value -= 1;
        });
    }
    return {
      handleExit,
      openRoutesTrack,
      isLoading,
      dynamicFollowList,
      dynamicFollowTypeListIndex,
      dynamicFollowTypeList,
      getIconClassName,
      handleUnfollow,
      panTo,
    };
  },
});
</script>

<style lang="scss" module src="./styles/DynamicFollow.scss" />
