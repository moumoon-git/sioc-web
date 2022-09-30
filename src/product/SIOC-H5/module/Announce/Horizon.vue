<template>
  <div :class="$style.hori">
    <!-- 将页面画成水平 -->
    <div :class="$style.left">
      <List
        @handleClick="handleClick"
      />
    </div>
    <div :class="$style.right">
      <Detail
        v-if="isDetail"
        :item="currItem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
} from 'vue';
import List from './List.vue';
import Detail from './Detail.vue';

export default defineComponent({
  name: 'AnnounceHorizon',
  components: {
    List,
    Detail,
  },
  setup() {
    const isDetail = ref(false); // 是否详情
    const currItem = ref(null); // 当前item
    const instance: any = getCurrentInstance();
    const { $http } = instance?.appContext.config.globalProperties;
    const contactorId = !!(window as any)?.task?.getIsApp() ? Number((window as any)?.task?.getUserId()) : Number(localStorage.getItem('userId')); // 登录用户Id
    // 点列表某一个
    function handleClick(obj: any) {
      isDetail.value = true;
      const request: any = ref({
        method: 'get',
        service: 'soc',
        url: `/appManagement/notice/${obj.id}?contactorId=${contactorId}`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      ($http as any)(request.value).then((res: any) => {
        if (res.code === 0 || res.errorcode === 0) {
          currItem.value = res.data; // 详细信息
        }
      });
    }
    return {
      isDetail,
      currItem,
      handleClick,
      contactorId,
    };
  },
});
</script>

<style lang="scss" module>
.hori {
  position: relative;
  width: 1920px;
  height: 994px;
  background: #0F1012;
  .left {
    width: 583px;
    height: 954px;
    background: #1D1F23;
    border-radius: 3px;
    margin: 20px;
    float: left;
  }
  .right {
    width: 1277px;
    height: 954px;
    background: #1D1F23;
    border-radius: 3px;
    margin: 20px 0px;
    float: left;
  }
}
</style>
