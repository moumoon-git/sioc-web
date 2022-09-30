<template>
  <div :class="$style.list">
    <!-- 时间 -->
    <div :class="$style.time">
      {{ `${(item.time.split(' ')[1]).split(':')[0]}:${(item.time.split(' ')[1]).split(':')[1]}` }}
    </div>
    <!-- 整体样式 -->
    <div
      :class="$style.listStyle"
      @click="handleClick"
    >
      <div :class="$style.headerStyle">
        <!-- 标签 -->
        <div :class="$style.listOne" />
        <div :class="$style.listTwo">
          上报{{ item.type.split('-')[1] }}
        </div>
      </div>
      <div v-if="item.type.split('-')[1]==='受损情况'">
        <div :class="$style.listFive">
          情况名称：{{ item.eventObj.name }}
        </div>
        <div :class="$style.line" />
        <div :class="$style.listFive">
          受损数量：{{ item.eventObj.value }}{{ item.eventObj.unit }}
        </div>
      </div>
      <div v-if="item.type.split('-')[1]==='救援力量'">
        <div style="height: 26px;">
          <div :class="$style.listFive">
            部门名称：{{ item.eventObj.name }}
          </div>
          <div :class="$style.line" />
          <div :class="$style.listFive">
            到场人数：{{ item.eventObj.value }}
          </div>
          <div :class="$style.line" />
          <div :class="$style.listFive">
            到场时间：{{ item.eventObj.sysDtLastUpdate }}
          </div>
        </div>
        <div :class="$style.back">
          <div :class="$style.listFour">
            装备：{{ item.eventObj.equipment }}
          </div>
          <div :class="$style.listFour">
            到达位置：{{ item.eventObj.address }}
          </div>
        </div>
      </div>
      <div v-if="item.type.split('-')[1]==='物资情况'">
        <div style="height: 26px;">
          <div :class="$style.listFive">
            物资名称：{{ item.eventObj.name }}
          </div>
          <div :class="$style.line" />
          <div :class="$style.listFive">
            使用数量：{{ item.eventObj.value }}{{ item.eventObj.unit }}
          </div>
        </div>
        <div :class="$style.back">
          <div :class="$style.listFour">
            存放地点：{{ item.eventObj.address }}
          </div>
          <div :class="$style.listFour">
            使用部门：{{ item.eventObj.dept }}
          </div>
        </div>
      </div>
      <div v-if="item.type.split('-')[1]==='疏散情况'">
        <div :class="$style.listFive">
          区域名称：{{ item.eventObj.name }}
        </div>
        <div :class="$style.line" />
        <div :class="$style.listFive">
          应疏散人数：{{ item.eventObj.evacuees }}
        </div>
        <div :class="$style.line" />
        <div :class="$style.listFive">
          实际疏散人数：{{ item.eventObj.actualevacuees }}
        </div>
      </div>
      <div v-if="item.type.split('-')[1]==='隐患情况'">
        <div :class="$style.listFive">
          单位名称：{{ item.eventObj.name }}
        </div>
        <div :class="$style.line" />
        <div :class="$style.listFive">
          已整顿数：{{ item.eventObj.rectified }}
        </div>
        <div :class="$style.line" />
        <div :class="$style.listFive">
          未整顿数：{{ item.eventObj.notrectified }}
        </div>
      </div>
      <div v-if="item.type.split('-')[1]==='情况报告'">
        <div :class="$style.listFive">
          {{ item.eventObj.name }} 
          <span
            style="margin-left: 10px;color: #00C1DE"
            @click="download(item)"
          >
            下载
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'TypeEight',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['handleClick'],
  methods: {
    handleClick(item: any): void {
      this.$emit('handleClick', item);
    },
    // 下载
    download(item: any): void {
      axios({
        url: `${(window as any).config.baseURL}/fileupload/eos/event/sum/downloadFile?fileName=${item.eventObj.name}&filePath=${item.eventObj.url}`,
        method: 'get',
        headers: {
          token: (window as any).globalToken || document.cookie.match(/token=([^;]*)/)?.[1],
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'arraybuffer',
      }).then((response: any) => {
        if (response) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = item.eventObj.name;
          a.href = window.URL.createObjectURL(new Blob([response?.data]));
          a.click();
        }
      });
    },
  },
});
</script>

<style lang="scss" module>
$label: url('../assets/eight.svg');
@import '../assets/css/public.scss';
</style>
