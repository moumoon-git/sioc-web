<template>
  <div class="add-flight-camera">
    <!-- 顶部内容搜索框 -->
    <header>
      <!-- 搜索框 -->
      <Search
        v-model="keyword"
        placeholder="请输入关键词搜索"
        style="width: 95%;margin: 20px auto;display: block;"
        @change="handleChange"
      />
      <span class="checkedMember">{{ cameraTreeCheckedNodes.length }}</span>
    </header>
    <!-- 主体内容树状分组 -->
    <main v-loading="isLoading">
      <LazyTree
        ref="tree"
        :data="treeData"
        @node-click="handleNodeClick"
        @node-check="handleNodeCheck"
        @node-uncheck="handleNodeUncheck"
        @lazy-load="handleLazyLoad"
      >
        <template #default="{ item }">
          {{ item.name }}
        </template>
        <template #icon>
          摄像头
        </template>
      </LazyTree>
    </main>
    <!-- 底部内容巡查开关 -->
    <footer>
      <div
        class="cancel"
        @click="confirmAddFlightCamera"
      >
        取消
      </div>
      <div
        class="confirm"
        @click="confirmAddFlightCamera"
      >
        确定
      </div>
    </footer>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Search from '@/product/CommandBrain3.0/Generalparts/right/Search/Search.vue';
import LazyTree from '@/product/CommandBrain3.0/Generalparts/right/LazyTree/LazyTree.vue';

export default defineComponent({
  name: 'AddFlightCamera',
  components: {
    // 输入框组件
    Search,
    // 树状分组组件
    LazyTree,
  },
  emits: ['update:treeData', 'confirmAddFlightCamera'],
  data() {
    return {
      // 加载中
      isLoading: false,
      // 搜索框关键词
      keyword: '',
      // 树状分组id
      groupId: '',
      // 树状分组数据
      treeData: [],
      // 树状分组勾中的数据
      cameraTreeCheckedNodes: [],
      searchType: '',
    };
  },
  mounted() {
    this.getTreeData(undefined, undefined);
  },
  methods: {
    // 获取树状分组数据
    getTreeData(id, resolve) {
      this.isLoading = true;
      const request = {
        method: 'get',
        service: 'flight',
        url: '/device/appdevicegroup/tree',
        params: {
          groupId: id || 0,
        },
      };
      this.$http(request).then((response) => {
        console.log('/device/appdevicegroup/tree', response);
        if (response.code === 0 && response?.data?.groups) {
          if (!id) {
            this.treeData = response.data.groups;
          } else {
            resolve(response.data.devices);
          }
        } else {
          this.$message.error(`获取分组数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取分组数据失败，错误信息：${error}`);
      }).finally(() => {
        this.isLoading = false;
      });
    },
    // 搜索框的回调函数
    handleChange() {
      if (!this.keyword) {
        this.getTreeData(undefined, undefined);
        return false;
      }
      let url;
      switch (this.searchType) {
        case 0: {
          url = '/device/appdevice/list';
          break;
        }
        case 1: {
          url = '/device/appdevicegroup/list';
          break;
        }
        case 2: {
          url = '/device/appdevice/list';
          break;
        }
        default: {
          url = '/device/appdevice/list';
        }
      }
      const request = {
        method: 'get',
        service: 'flight',
        url,
        params: {
          groupId: this.groupId ? this.groupId : 0,
          searchGroupName: this.keyword, // this.searchType === 1 ? this.keyword : undefined,
          deviceName: this.keyword, // this.searchType === 0 ? this.keyword : undefined,
          labelName: this.keyword, // this.searchType === 2 ? this.keyword : undefined,
        },
      };
      this.$http(request).then((response) => {
        if (response.code === 0 && response?.data?.devices) {
          // this.$emit('update:treeData', response.data.devices);
          this.treeData = response.data.devices;
        } else {
          this.$message.error(`获取分组数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取分组数据失败，错误信息：${error}`);
      });
    },
    // 树状分组点击回调
    handleNodeClick(node) {
      console.log(node);
      this.groupId = node.id;
    },
    // 树状分组勾选回调
    handleNodeCheck(node) {
      console.log(node);
      this.cameraTreeCheckedNodes.push(node);
    },
    // 树状分组取消勾选回调
    handleNodeUncheck(node) {
      console.log(node);
      this.cameraTreeCheckedNodes = this.cameraTreeCheckedNodes.filter((item) => (item.id !== node.id));
    },
    // 树状分组懒加载
    handleLazyLoad(node, resolve) {
      console.log(node);
      this.getTreeData(node.id, resolve);
    },
    // 确认保存添加监控
    confirmAddFlightCamera() {
      this.$emit('confirmAddFlightCamera', this.cameraTreeCheckedNodes);
    },
  },
});
</script>

<style lang="scss">
  .add-flight-camera {
    display: flex;
    flex-direction: column;
    height: 100%;
    & .checkedMember {
      font-size: 16px;
      color: #FFFFFF;
      margin-left: 90%;
    }
    & > header {
      height: 100px;
    }
    // 列表主体
    & > main {
        flex: 1;
        height: calc(100% - 180px);
        overflow: hidden auto;
        // 滚动条
        &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background: transparent;
        }
        &::-webkit-scrollbar-thumb {
        background: #56E9FF;
        border-radius: 5px;
        }
        &::-webkit-scrollbar-corner {
        background: transparent;
        }
    }
    & > footer {
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-top: 1px solid rgba(84, 88, 96, .64);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      & > .cancel {
        cursor: pointer;
        border: 1px solid #A6ADB4;
        font-size: 14px;
        color: #A6ADB4;
        padding: 5px 20px;
        margin-right: 10px;
        }
      & > .confirm {
        cursor: pointer;
        background: #00C1DE;
        border: 1px solid #00C1DE;
        font-size: 14px;
        color: #FFFFFF;
        padding: 5px 20px;
        margin-right: 10px;
      }
    }
  }
</style>
