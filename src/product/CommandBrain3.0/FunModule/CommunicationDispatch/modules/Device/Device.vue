<template>
  <div style="display: flex; height: 100%">
    <!-- 左边-树 -->
    <LeftTree
      :tree-data="treeData"
      @headButton="headButton"
      @handleNodeClick="handleNodeClick"
      @handleChange="handleChange"
    />
    <!-- 右边-树对应的列表 -->
    <RightList
      ref="RightList"
      :type="type"
      :online="online"
      :offline="offline"
      :tree-list="treeList"
      :count-all="treeListCountAll"
      :current-node="currentNode"
      @headButton="headButton"
      @handleClick="handleClick"
    />
    <!-- 右边-列表-详细 -->
    <RightListDetail
      ref="RightListDetail"
      :detail="detail"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from 'vue';
import LeftTree from './components/LeftTree.vue';
import RightList from './components/RightList.vue';
import RightListDetail from './components/RightListDetail.vue';

export default defineComponent({
  name: 'Device',
  components: {
    // 左边-树
    LeftTree,
    // 右边-树对应的列表
    RightList,
    // 右边-点列表出详细
    RightListDetail,
  },
  setup() {
    const instance: any = getCurrentInstance();
    const { $ws }: any = getCurrentInstance()?.appContext.config.globalProperties;
    let uns: () => void;
    onMounted(() => {
      if (uns) uns();
      const seatInformation = document.cookie.match(
        /seatInformation=([^;]*)/,
      )?.[1];
      if (
        seatInformation !== 'null' &&
        seatInformation !== 'undefined' &&
        seatInformation
      ) {
        const str = (window as any).decodeURIComponent(seatInformation);
        const objs: any = JSON.parse(str);
        uns = $ws.subscribe(
          `/platform/${objs?.platformId}/message`,
          (result: any) => {
            if (Number(result?.msgType) === 50006) {
              instance.proxy.getOnline();
            }
          },
        );
      }
    });
    onBeforeUnmount(() => {
      if (uns) uns(); // 退出websocket
    });
  },
  data() {
    return {
      treeData: [], // 左树的数据
      isCheckBox: false, // 左是否打开勾选框
      type: 0, // 左当前点击的类型
      currentNode: null, // 左当前点的哪节点
      treeList: [], // 右列的数据
      treeListCountAll: 0, // 右列表长度
      online: 0, // 右在线人数
      offline: 0, // 右不在线人数
      detail: {}, // 右点一行出现细节
      currentItem: '', // 右当前点的哪项
    };
  },
  methods: {
    // 头部四按钮
    headButton(node: any) {
      switch (node) {
        case '会场终端':
          this.type = 1;
          break;
        case '集群终端':
          this.type = 2;
          break;
        // case '手持终端':
        //   this.type = 3;
        //   break;
        case 'APP终端':
          this.type = 4;
          break;
        case '选择':
          this.isCheckBox = true;
          break;
        case '取消':
          this.isCheckBox = false;
          break;
        default:
          this.type = 0;
          break;
      }
      // 左树值
      this.getTree();
      // 清空当前树
      this.currentNode = null;
      // 右统计
      this.getOnline();
      // 右列表清空
      this.treeList = [];
      this.treeListCountAll = 0;
      this.$nextTick(() => {
        (this as any).$refs.RightList.isPosition = false; // 切换时关掉上一次的落点
        if (this.$refs.DetailDialogBoat) {
          // 切换时关掉上一次的详情
          (this as any).$refs.DetailDialogBoat.close();
        }
        if (this.isCheckBox) {
          (this as any).$refs.RightList.chooseAll = false; // 关掉全选
        }
      });
    },
    // 得左边树
    getTree() {
      const request = {
        method: 'get',
        url: '/device/appdevicegroup/tree/all',
        service: 'flight',
        params: {
          groupId: 0,
          type: this.type,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.treeData = response.data;
        }
      });
    },
    // 点左边树得到右边列表，并同时回显
    handleNodeClick(node: any) {
      this.currentNode = node;
      const request = {
        method: 'get',
        url: '/device/appdevicegroup/tree',
        service: 'flight',
        params: {
          groupId: node.id,
          deviceType: this.type,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.treeList = response.data.devices;
          this.treeListCountAll = response.data.devices.length;
          // 回显
          if (this.isCheckBox) {
            (this as any).$nextTick(() => {
              (this as any).$refs.RightList.chooseAll = false;
              (this as any).$refs.RightList.checkShow();
            });
          }
        }
      });
      this.getOnline();
    },
    // 搜索
    handleChange(item: any) {
      this.currentNode = null;
      const request = {
        method: 'get',
        url: '/device/appdevicegroup/tree',
        service: 'flight',
        params: {
          key: item,
          deviceType: this.type,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.treeData = response.data.groups;
          this.treeList = response.data.devices;
          this.treeListCountAll = response.data.devices.length;
          // 回显
          if (this.isCheckBox) {
            (this as any).$nextTick(() => {
              (this as any).$refs.RightList.chooseAll = false;
              (this as any).$refs.RightList.checkShow();
            });
          }
        }
      });
    },
    // 点击一行看详情
    handleClick(item: any) {
      this.currentItem = item;
      let typeName = '';
      if (item.type === 0) typeName = '监控视频';
      if (item.type === 1) typeName = '会场终端';
      if (item.type === 2) typeName = '集群终端';
      // if (item.type === 3) typeName = '手持终端';
      if (item.type === 4) typeName = 'APP终端';
      (this as any).detail = {
        type: typeName,
        top: (this as any).currentNode?.name,
        deviceName: item?.name,
        deviceCode: item?.code,
        useCode: item?.code,
        address: item?.address,
        longitude: item?.longitude,
        latitude: item?.latitude,
        loginAddress: item?.loginUrl,
        loginPort: item?.loginPort,
        loginAccount: item?.loginUsername,
        mediaAddress: item?.streamMediaUrl,
      };
      this.$nextTick(() => {
        (this as any).$refs.RightListDetail.isPosition = false; // 切换时关掉上一次的落点
        (this as any).$refs.RightListDetail.openPopup();
      });
    },
    // 获取在线数量
    getOnline() {
      const request = {
        method: 'get',
        url: '/device/appdevice/statusStatistic',
        service: 'flight',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          groupId: (this as any).currentNode?.id || 0,
          type: this.type,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.online = response.data.online;
          this.offline = response.data.offline;
        }
      });
    },
  },
});
</script>

<style lang="scss" module></style>
