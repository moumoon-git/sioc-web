// 地图卡片
<template>
  <div>
    <div class="mapcard">
      <div
        v-if="type==='new'"
        class="mapcard--new"
      >
        <div
          class="mapcard--new__icon"
          @click="openPop"
        />
        <p class="mapcard--new__name">
          新建地图
        </p>
      </div>
      <div
        v-if="type==='old'"
        class="mapcard--old"
      >
        <div
          class="mapcard--old__top"
          @click="openMap(mapdata)"
        >
          <div class="mapcard--old__top__left" />
          <div class="mapcard--old__top__right">
            <p class="mapcard--old__top__right__item">
              {{ mapdata.mapName }}
            </p>
            <p class="mapcard--old__top__right__item">
              更新时间{{ mapdata.updateTime }}
            </p>
          </div>
        </div>
        <div class="mapcard--old__tabs">
          <div
            class="mapcard--old__shareTimes"
            style="display:none"
          >
            已分享：<span>0次</span>
          </div>
          <div class="mapcard--old__tabs__right">
            <div
              class="mapcard--old__tab"
              @click="openUpdatePop()"
            >
              修改
            </div>
            <div
              class="mapcard--old__tab"
              @click="openDeletePop()"
            >
              删除
            </div>
            <div
              class="mapcard--old__tab"
              @click="copyMap(mapdata.id)"
            >
              复制
            </div>
            <div
              class="mapcard--old__tab"
              style="display:none"
            >
              协作
            </div>
            <div
              class="mapcard--old__tab"
              style="display:none"
            >
              分享
            </div>
          </div>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          content="快捷显示"
          placement="bottom"
        >
          <div
            :class="['mapcard--old__emergyBtn',{'mapcard--old__emergyBtn--active':mapdata.isShowOnTop===1}]"
            @click="updateMapStatus(mapdata.isShowOnTop===1?0:1)"
          />
        </el-tooltip>
      </div>
      <div
        v-if="type==='coop'||type==='share'"
        class="mapcard--old"
      >
        <div
          class="mapcard--old__top"
          @click="openMap(mapdata)"
        >
          <div class="mapcard--old__top__left" />
          <div class="mapcard--old__top__right">
            <p class="mapcard--old__top__right__item">
              {{ mapdata.mapName }}
            </p>
            <p class="mapcard--old__top__right__item">
              更新时间{{ mapdata.updateTime }}
            </p>
          </div>
        </div>
        <div class="mapcard--old__tabs">
          <div class="mapcard--old__shareTimes" />
          <div class="mapcard--old__tabs__right">
            <div
              v-if="type==='coop'"
              class="mapcard--old__tab"
              @click="exitCoop(mapdata.inviteCooperateRecord)"
            >
              退出协作
            </div>
          </div>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          content="快捷显示"
          placement="bottom"
        >
          <div
            :class="['mapcard--old__emergyBtn',{'mapcard--old__emergyBtn--active':mapdata.isShowOnTop===1}]"
            @click="updateMapStatus(mapdata.isShowOnTop===1?0:1)"
          />
        </el-tooltip>
      </div>
    </div>
    <!-- 新增 -->
    <MessageTip
      ref="MessageTipRef"
      @refresh="refresh"
    />
    <!-- 删除 -->
    <DeleteMessage
      ref="DeleteMessageRef"
      :item="mapdata"
      @refresh="refresh"
    />
    <!-- 修改 -->
    <UpdateMessage
      ref="UpdateMessageRef"
      :item="mapdata"
      @refresh="refresh"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import MessageTip from './Message.vue';
import DeleteMessage from './DeleteMessage.vue';
import UpdateMessage from './UpdateMessage.vue';

interface AddStateDialog {
  open: () => void
}

export default defineComponent({
  name: 'Mapcard',
  components: {
    MessageTip, // 新增窗口
    DeleteMessage, // 删除提示
    UpdateMessage, // 修改提示
  },
  props: {
    type: {
      type: String,
      default: 'new',
    },
    mapdata: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['changeList', 'refresh', 'refreshcoop'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showPanel = ref(false);
    const MessageTipRef = ref<null | AddStateDialog>(null);
    const DeleteMessageRef = ref<null | AddStateDialog>(null);
    const UpdateMessageRef = ref<null | AddStateDialog>(null);
    // 打开新增地图
    function openPop() {
      if (MessageTipRef.value) {
        MessageTipRef.value.open();
      }
    }
    // 打开删除地图
    function openDeletePop() {
      if (DeleteMessageRef.value) {
        DeleteMessageRef.value.open();
      }
    }
    // 打开更新地图
    function openUpdatePop() {
      if (UpdateMessageRef.value) {
        UpdateMessageRef.value.open();
      }
    }
    // 复制地图
    function copyMap(id:number) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: `/assist/assistmap/copyMap/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          emit('refresh');
        } else {
          ElMessage.error(`复制失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`复制失败，错误信息：${error}`);
      });
    }
    // 刷新首页
    function refresh() {
      emit('refresh');
    }
    // 设置是否置顶智慧屏
    function updateMapStatus(isflag:number) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmap/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: props.mapdata.id,
          isShowOnTop: isflag,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          emit('changeList');
        } else {
          ElMessage.error(`置顶失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`置顶失败，错误信息：${error}`);
      });
    }
    // 退出协作
    function exitCoop(id:string) {
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
          ElMessage.success({
            message: '删除成功',
            type: 'success',
          });
           emit('changeList');
        } else {
          ElMessage.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除失败，错误信息：${error}`);
      });
    }
    return {
      openPop,
      openDeletePop,
      openUpdatePop,
      showPanel,
      MessageTipRef,
      DeleteMessageRef,
      UpdateMessageRef,
      copyMap,
      updateMapStatus,
      refresh,
      exitCoop,
    };
  },
  data() {
    return {
    };
  },
  methods: {
    openMap(mapdata:any) {
      this.$router.push({ path: '/plottingIndex', query: { mapId: mapdata.id, type: this.type } });
      (this as any).$store.commit('coplotting/SET_selfMap', mapdata);
      (this as any).$store.commit('coplotting/SET_NEW__MAPID', mapdata.id);
      console.log((this as any).$store.state);
      sessionStorage.setItem('selfMap', JSON.stringify(mapdata));
    },
  },
});
</script>
<style lang="scss" src="./mapcard.scss"></style>
