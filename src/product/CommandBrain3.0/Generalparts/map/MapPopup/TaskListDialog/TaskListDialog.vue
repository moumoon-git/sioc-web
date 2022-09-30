// 实时动态-地图弹窗
<template>
  <!-- 弹窗内容 -->
  <div class="task-list-dialog">
    <!-- 头部 -->
    <header>
      <span
        :style="{
          color:
            currentDetail?.endTime
            && calculateRestTime(currentDetail?.endTime).match(/^超时/)
              ? '#F66E6E'
              : '#56E9FF',
        }"
      >
        {{ currentDetail?.endTime ? calculateRestTime(currentDetail?.endTime) : '无时限' }}
      </span>
      <!-- 任务状态标识 -->
      <span
        :class="[
          'task-list-dialog__status',
          {
            'task-list-dialog__status--complete': currentDetail?.statusName === '已完成',
            'task-list-dialog__status--cancel': currentDetail?.statusName === '已取消',
          },
        ]"
      >{{ currentDetail?.statusName || '-' }}</span>
    </header>
    <!-- 表单内容 -->
    <main>
      <div class="task-list-dialog__item">
        <label>任务类型：</label>
        <div>{{ currentDetail?.typeName || '-' }}</div>
      </div>
      <div class="task-list-dialog__item">
        <label>任务时限：</label>
        <div>{{ currentDetail?.endTime || '无时限' }}</div>
      </div>
      <div class="task-list-dialog__item">
        <label>负责人：</label>
        <div>
          {{ currentDetail?.responsiblePerson?.name || '未知' }}
          ({{
            currentDetail?.responsiblePerson?.workUnit || '暂无单位'
          }}/{{
            currentDetail?.responsiblePerson?.position || '暂无职务'
          }})
          <ContactMoreButton
            :id="currentDetail?.responsiblePerson?.id"
          />
        </div>
      </div>
      <div class="task-list-dialog__item">
        <label>任务说明：</label>
        <div>{{ currentDetail?.content }}</div>
      </div>
      <div
        v-viewer
        class="task-list-dialog__imgs"
      >
        <img
          v-for="img in currentDetail?.appAttachments?.filter(i => i?.title?.match(/(svg|png|jpe?g|webp|gif)$/i)) || []"
          :key="img.url"
          :src="`${baseURL}${img.url}`"
        >
        <a
          v-for="file in currentDetail?.appAttachments?.filter(i => !i?.title?.match(/(svg|png|jpe?g|webp|gif)$/i)) || []"
          :key="file.url"
          :href="`${baseURL}${file.url}`"
          target="_blank"
          :download="`${file.title}`"
        >
          {{ `${file.title}` }}
        </a>
      </div>
      <Address style="margin-left: -4px;">
        {{ currentDetail?.address }}
      </Address>
      <div class="task-list-dialog__labels">
        <div
          v-for="(label, labelIndex) in currentDetail?.labels || []"
          :key="labelIndex"
        >
          {{ label?.name || '-' }}
        </div>
      </div>
    </main>
    <!-- 底部按钮组 -->
    <!-- <footer>
      <button @click="$emit('order')">
        指令下达
      </button>
      <button @click="$emit('pano')">
        任务全景
      </button>
      <button @click="$emit('route')">
        队伍轨迹
      </button>
      <button @click="$emit('detail')">
        任务详情
      </button>
    </footer> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Address from '@/product/CommandBrain3.0/Generalparts/right/Address/Address.vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import loadSetup from './scripts';

export default defineComponent({
  name: 'TaskListDialog',
  components: {
    // 地址栏
    Address,
    // 联系人更多操作按钮
    ContactMoreButton,
  },
  props: {
    composeData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [
    // 指令下达
    'order',
    // 任务全景
    'pano',
    // 队伍轨迹
    'route',
    // 任务详情
    'detail',
  ],
  setup(props) {
    console.log(props.composeData, 'composeData');
    /* 千万不要用这种隐式变量
     * return loadSetup()
     * 最好是解构出来 不然找起来很迷惑
     * const {xxx,xxx} = loadSetup()
     * return {xxx,xxx}
    */
    const {
      currentDetail,
      calculateRestTime,
    } = loadSetup();
    // 如果是全局弹窗调的话就合并下渲染数据
    Object.assign(currentDetail, props.composeData.responseData);

    console.log(currentDetail, 'currentDetail');
    return {
      currentDetail,
      calculateRestTime,
    };
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
});
</script>

<style lang="scss" src="./styles/index.scss"></style>
