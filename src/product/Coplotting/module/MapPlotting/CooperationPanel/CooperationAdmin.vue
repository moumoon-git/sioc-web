<template>
  <transition
    name="component-fade"
    mode="out-in"
  >
    <div class="CooperationAdmin">
      <div class="CooperationAdmin__top">
        <Cooperationtree
          :tree-data="treeData"
          @deleteRecord="deleteRecord"
        />
      </div>
      <div class="CooperationAdmin__bottom">
        <ElButton
          class="sv-button"
          type="primary"
          @click="InviteFun"
        >
          邀请协作
        </ElButton>
      </div>
    </div>
  </transition>
  <InvitePopStepOne ref="InvitePopStepOneRef" />
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, getCurrentInstance, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import Cooperationtree from '@/product/Coplotting/module/MapPlotting/CooperationPanel/component/Cooperationtree.vue';
import InvitePopStepOne from '@/product/Coplotting/module/MapPlotting/CooperationPanel/component/InvitePopStepOne.vue';

interface AddStateDialog {
  open: () => void,
  getRecentPlatform:()=>void,
  getAllPlatform:()=>void,
  getInvitedPlatforms:()=>void,
}
export default defineComponent({
  name: 'CooperationAdmin',
  components: {
    Cooperationtree, // 树形组件
    InvitePopStepOne, // 选择平台
  },

  setup() {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    console.log('当前的地图id是：');
    const route = useRoute();
    const store = useStore(); // 使用vuex
    const thisMapId:any = ref(0); // 当前的地图id
    thisMapId.value = route.query.mapId;
    const InvitePopStepOneRef = ref<null | AddStateDialog>(null);
    const treeData = ref([]); // 树数据
    // 打开邀请协作弹框
    function InviteFun() {
      if (InvitePopStepOneRef.value) {
        InvitePopStepOneRef.value.open();
        InvitePopStepOneRef.value.getRecentPlatform();
        InvitePopStepOneRef.value.getInvitedPlatforms();
        InvitePopStepOneRef.value.getAllPlatform();
      }
    }
    // 获取邀请协作记录列表
    function getTreeData(id:number) {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/getInviteCooperateRecordList',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: id,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          // getTreeData();
          treeData.value = response.data.list;
          treeData.value = JSON.parse(
            JSON.stringify(treeData.value)
              .replace(/cooperatePlatformName/g, 'name')
              .replace(/groupRights/g, 'children')
              .replace(/groupName/g, 'name'),
          );
          store.commit('coplotting/SET_REFRASHCOOP', false);
        } else {
          ElMessage.error(`获取协作记录失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取协作记录失败，错误信息：${error}`);
      });
    }
    // 删除邀请协作记录
    function deleteRecord(id:number) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [id],
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getTreeData(thisMapId.value);
        } else {
          ElMessage.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除失败，错误信息：${error}`);
      });
    }
    // 监听刷新邀请协作列表
    watch(() => store.state.coplotting.isRefrashCoop, (val, old) => {
      if (val === true) {
        getTreeData(thisMapId.value);
      }
    });
    onMounted(() => {
      getTreeData(thisMapId.value);
    });
    return {
      InviteFun,
      InvitePopStepOneRef,
      treeData,
      deleteRecord,
    };
  },
});
</script>

<style lang="scss" src="./style/CooperationAdmin.scss"></style>
