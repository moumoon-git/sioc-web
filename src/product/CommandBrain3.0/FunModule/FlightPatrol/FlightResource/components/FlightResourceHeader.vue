<template>
  <div :class="$style['flight-resource-header']">
    <!-- 摄像头图标 -->
    <div :class="$style.camera" />
    <!-- 已选视频 -->
    <div :class="$style.left">
      <span :class="$style.title">已选视频</span>
      <div :class="$style.value">
        {{ treeCheckedNodes.length }}
      </div>
    </div>
    <!-- 视频总数 -->
    <div :class="$style.right">
      <span :class="$style.title">视频总数</span>
      <div :class="$style.value">
        {{ totalVideos }}
      </div>
    </div>
    <div
      style="
        position: absolute;
        bottom: 0%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
      "
    >
      <!-- 下拉选择器 -->
      <Select
        v-model="searchType"
        :clearable="false"
        :list="selectOptions"
        style="height: 38px; width: 20%"
        @change="handleSelectChange"
      />
      <!-- 搜索框 -->
      <Search
        v-model="keyword"
        placeholder="请输入监控/分组/标签名称"
        style="width: 80%"
        @change="handleInputChange"
      />
      <span :class="$style['function-button']" @click="batchAppendLabel"
        >批量设置标签</span
      >
      <span :class="$style['function-button']" @click="batchPreview"
        >批量预览</span
      >
      <span :class="$style['function-button']" @click="handleSaveAsGroup">
        存为分组
      </span>
      <span :class="$style['function-button']" @click="handleCreateVideoLink">
        创建视频链
      </span>
    </div>
  </div>
  <SaveAsGroup ref="SaveAsGroup" :device-list="treeCheckedNodes" />
  <CreateVideoLink ref="CreateVideoLink" :device-list="treeCheckedNodes" />
</template>

<script>
import { defineComponent } from 'vue';
import Select from '@/product/CommandBrain3.0/Generalparts/right/Select/Select.vue';
import Search from '@/product/CommandBrain3.0/Generalparts/right/Search/Search.vue';
import SaveAsGroup from '@/product/CommandBrain3.0/FunModule/FlightPatrol/components/SaveAsGroup/SaveAsGroup.vue';
import CreateVideoLink from '@/product/CommandBrain3.0/FunModule/FlightPatrol/components/CreateVideoLink/CreateVideoLink.vue';

export default defineComponent({
  name: 'FlightResourceHeader',
  components: {
    // 下拉框组件
    Select,
    // 输入框组件
    Search,
    // 存为分组弹窗组件
    SaveAsGroup,
    // 创建视频链组件
    CreateVideoLink,
  },
  props: {
    // 树状分组数据
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
    // 树状分组选中的数据
    treeCheckedNodes: {
      type: Array,
      default() {
        return [];
      },
    },
    // 组id
    groupId: {
      type: String,
      default: '',
    },
  },
  emits: ['update:treeData', 'update:groupId', 'getTreeData', 'append-label'],
  data() {
    return {
      // 已选视频数量
      selectedVideos: 0,
      // 视频总数
      totalVideos: 0,
      // 搜索框关键词
      keyword: '',
      // 搜索标签类型
      searchType: 0,
      // 下拉框的选项
      selectOptions: ['监控', '分组', '标签'],
    };
  },
  mounted() {
    this.getCameraData();
  },
  methods: {
    // 获取视频数据
    getCameraData() {
      const request = {
        method: 'get',
        service: 'flight',
        url: '/device/appdevice/countAll',
      };
      this.$http(request)
        .then((response) => {
          console.log('/device/appdevice/countAll response', response);
          if (response.code === 0 && response?.data?.count) {
            this.totalVideos = response.data.count;
          } else if (response?.data?.count !== 0) {
            this.$message.error(
              `获取视频数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error) => {
          this.$message.error(`获取视频数据失败，错误信息：${error}`);
        });
    },
    // 下拉选择器的回调函数
    handleSelectChange() {
      this.$emit('update:groupId', 0);
      this.handleInputChange();
    },
    // 搜索框的回调函数
    handleInputChange() {
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
          searchGroupName: this.searchType === 1 ? this.keyword : undefined,
          deviceName: this.searchType === 0 ? this.keyword : undefined,
          labelName: this.searchType === 2 ? this.keyword : undefined,
        },
      };
      if (!this.keyword) {
        this.$emit('getTreeData', undefined, undefined);
        return false;
      }
      this.$http(request)
        .then((response) => {
          if (
            response.code === 0 &&
            (response?.data?.devices || response?.data?.groups)
          ) {
            this.$emit(
              'update:treeData',
              response.data.devices || response.data.groups,
            );
          } else {
            this.$message.error(
              `获取分组数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error) => {
          this.$message.error(`获取分组数据失败，错误信息：${error}`);
        });
    },
    handleSaveAsGroup() {
      this.$refs.SaveAsGroup.open();
    },
    handleCreateVideoLink() {
      this.$refs.CreateVideoLink.open();
    },
    // 批量预览
    batchPreview() {
      this.$store.commit(
        'flightPatrol/SET_flightPatrolPreviewCachePool',
        this.treeCheckedNodes,
      );
    },
    // 批量设置标签
    batchAppendLabel() {
      this.$emit('append-label');
    },
  },
});
</script>

<style lang="scss" module>
.flight-resource-header {
  position: relative;
  height: 220px;
  margin-bottom: 20px;
  .camera {
    width: 100px;
    height: 100px;
    background: url(../assets/camera.svg) no-repeat 0px/100px;
    position: absolute;
    left: 50%;
    top: 12%;
    transform: translateX(-50%);
  }
  .left {
    text-align: center;
    position: absolute;
    left: 10%;
    top: 20%;
  }
  .right {
    text-align: center;
    position: absolute;
    right: 10%;
    top: 20%;
  }
  .title {
    font-size: 18px;
    color: #32c5ff;
  }
  .value {
    font-size: 30px;
    color: #ffffff;
  }
  .function-button {
    font-size: 16px;
    color: #56e9ff;
    cursor: pointer;
    margin: 5px 10px 5px 0px;
    display: inline-block;
    &:not(.function-button:nth-of-type(3))::after {
      content: '';
      width: 1px;
      height: 22px;
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      vertical-align: sub;
      margin-left: 10px;
    }
  }
}
</style>
