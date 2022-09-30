<template>
  <div v-if="!clickedAreaItem" class="flight-group">
    <header class="flight-group__header">
      <!-- 顶部切换标签 -->
      <Tabs
        v-model="activeTabIndex"
        :list="['地图范围分组', '视频资源分组', '标签分组', '视频链分组']"
        @change="handleSwitchTab"
      />
      <div>
        <!-- 选择器 -->
        <Select
          v-if="activeTabIndex !== 0"
          v-model="searchType"
          :clearable="false"
          :list="selectOptions"
          style="width: 70px; height: 38px"
          @change="keyword ? handleSearch() : null"
        />
        <!-- 搜索框 -->
        <Search
          v-model.lazy="keyword"
          :placeholder="searchPlaceholder"
          class="flight-group__header__search"
          @change="handleSearch"
        />
      </div>
    </header>
    <!-- 操作按钮 -->
    <div class="flight-group__header__button">
      <button @click="handleBatchDelete">批量删除</button>
      <button v-if="activeTabIndex !== 0" @click="batchPreview">
        批量预览
      </button>
      <button
        v-if="activeTabIndex !== 3 && activeTabIndex !== 0"
        @click="handleCreateVideoLink"
      >
        创建视频链
      </button>
    </div>
    <!-- 主体内容，非地图范围分组 -->
    <template v-if="activeTabIndex !== 0">
      <!-- 数据列表 -->
      <main v-loading="isLoading">
        <MultiVideoExpand
          ref="MultiVideoExpand"
          v-model="checkedList"
          :group-data="groupData"
          :prop-setting="{
            id: 'id',
            name: 'name',
            children: 'devices',
            isOffline: 'isOffline',
          }"
          :show-edit="
            activeTabIndex === 0 || activeTabIndex === 3 ? false : true
          "
          @group-rename="handleGroupRename"
          @node-click="handleDrawDevice"
        />
      </main>
      <!-- 底部巡查开关 -->
      <footer>
        <PatrolSwitch :task-name="taskName" :task-type="1" />
      </footer>
    </template>
    <!-- 地图范围分组 -->
    <main v-else v-loading="isLoading">
      <TaskList ref="TaskList" :list="groupData" @click="handleAreaListClick">
        <template #default="{ item }">
          {{ item.name }}
        </template>
      </TaskList>
    </main>
  </div>
  <!-- 地图范围分组详情 -->
  <FlightRecordDetail
    v-else
    :has-repatrol="false"
    :group-item="clickedAreaItem"
    @go-back="clickedAreaItem = null"
  />
  <!-- 创建视频链弹窗 -->
  <CreateVideoLink
    ref="CreateVideoLink"
    :device-list="checkedList"
    @refresh="getGroupData(activeTabIndex)"
  />
  <!-- 摄像头弹窗 -->
  <FlightCameraView ref="flight-camera-view" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import useMapMarker from '@/product/CommandBrain3.0/Generalparts/utils/useMapMarker/useMapMarker';
import TaskList from '@/product/CommandBrain3.0/Generalparts/right/TaskList/TaskList.vue';
import Tabs from '@/product/CommandBrain3.0/Generalparts/right/Tabs/Tabs.vue';
import Select from '@/product/CommandBrain3.0/Generalparts/right/Select/Select.vue';
import Search from '@/product/CommandBrain3.0/Generalparts/right/Search/Search.vue';
import MultiVideoExpand from '../components/MultiVideoExpand/MultiVideoExpand.vue';
import PatrolSwitch from '../components/PatrolSwitch/PatrolSwitch.vue';
import CreateVideoLink from '../components/CreateVideoLink/CreateVideoLink.vue';
import FlightRecordDetail from './FlightGroupDetail/FlightGroupDetail.vue';
import FlightCameraView from '../FlightCamera/FlightCameraView.vue';

export default defineComponent({
  name: 'FlightGroup',
  components: {
    // 顶部标签切换组件
    Tabs,
    // 选择器组件
    Select,
    // 搜索组件
    Search,
    // 视频分组列表组件
    MultiVideoExpand,
    // 底部巡察开关组件
    PatrolSwitch,
    // 任务列表组件
    TaskList,
    // 飞巡记录详情模块
    FlightRecordDetail,
    // 创建视频链模块
    CreateVideoLink,
    // 飞巡摄像头
    FlightCameraView,
  },
  provide() {
    return {
      cameraDetail: computed(() => this.cameraDetail),
    };
  },
  data() {
    return {
      // 激活的标签下标
      activeTabIndex: 0,
      // 搜索标签类型
      searchType: 0,
      // 搜索关键词
      keyword: '',
      // 分组数据
      groupData: [],
      // 勾选的摄像头列表
      checkedList: [],
      // 加载中
      isLoading: false,
      // 点击进入详情的地图范围分组项
      clickedAreaItem: null,
      // 飞巡任务名
      taskName: '',
      // 点击弹窗的摄像头对象
      cameraDetail: {} as any,
    };
  },
  computed: {
    // 搜索栏选择器的选项
    selectOptions(): any[] {
      switch (this.activeTabIndex) {
        case 1: {
          return ['主链', '副链'];
        }
        case 2: {
          return ['标签', '监控'];
        }
        case 3: {
          return ['分组', '监控'];
        }
        default: {
          return [];
        }
      }
    },
    // 搜索栏的 placeholder
    searchPlaceholder(): string {
      switch (this.activeTabIndex) {
        case 1: {
          return '请输入视频链名称';
        }
        case 2: {
          return '请输入监控、标签名称';
        }
        case 3: {
          return '请输入监控、分组名称';
        }
        case 0:
        default: {
          return '请输入监控名称';
        }
      }
    },
  },
  watch: {
    checkedList(newVal) {
      // console.log(newVal);
      // // 巡查时候使用的数据
      // console.log(data);
      (this as any).$store.dispatch(
        'flightPatrol/saveDispatchDeskData',
        newVal,
      );
    },
  },
  mounted() {
    this.getGroupData(0);
  },
  beforeUnmount() {
    window.map.clearDeleteCoverage('飞巡分组点击设备落点');
  },
  methods: {
    // 批量预览
    batchPreview() {
      (this as any).$store.commit(
        'flightPatrol/SET_flightPatrolPreviewCachePool',
        this.checkedList,
      );
    },
    /**
     * 标签页切换
     *
     * @param {Number} index 标签页下标
     */
    handleSwitchTab(index: number): void {
      this.searchType = 0;
      this.keyword = '';
      this.taskName = '';
      this.getGroupData(index);
      // 重置编辑状态
      if ((this as any).$refs?.MultiVideoExpand) {
        (this as any).$refs.MultiVideoExpand.edittingGroupIndex = -1;
      }
      // 清空预览落点
      window.map.clearDeleteCoverage('飞巡分组点击设备落点');
    },
    /**
     * 获取分组数据
     *
     * @param {Number} index 当前分组下标，用来在网络时延大的情况判断获取数据之后当前页面是否正确
     */
    getGroupData(index: number): void {
      this.groupData = [];
      this.checkedList = [];
      this.isLoading = true;
      let url;
      switch (this.activeTabIndex) {
        case 1: {
          url = '/device/appdevicegroup/shortcutList';
          break;
        }
        case 2: {
          url = '/device/appdevicegroup/labelList';
          break;
        }
        case 3: {
          url = '/device/appdevicegroup/listList';
          break;
        }
        case 0:
        default: {
          url = '/device/appdrawgroup/list';
        }
      }
      const params =
        this.searchType === 0
          ? { groupName: this.keyword }
          : { deviceName: this.keyword };
      const request = {
        method: 'get',
        service: 'flight',
        url,
        params,
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          if (response.code === 0 && response?.data?.list) {
            if (this.activeTabIndex === index) {
              // 处理devicesId 启动巡查或者预览时需要
              response.data.list.forEach((e: any) => {
                if (e.devices) {
                  e.devices.forEach((x: any) => {
                    x.deviceId = x.id;
                    x.isOffline = x.status !== 0 && x.status !== '0';
                  });
                  e.devices.sort((a: any, b: any) => Number(a.isOffline) - Number(b.isOffline));
                }
                // 视频链分组中，需要显示主链
                if (this.activeTabIndex === 3) {
                  const id = e.mainDeviceId;
                  e.devices?.forEach((device: any) => {
                    if (device.id === id) {
                      device.name += '（主链）';
                    }
                  });
                }
              });
              this.groupData = response.data.list;
            }
          } else {
            (this as any).$message.error(
              `获取分组数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          (this as any).$message.error(`获取分组数据失败，错误信息：${error}`);
        })
        .finally(() => {
          if (this.activeTabIndex === index) {
            this.isLoading = false;
          }
        });
    },
    /**
     * 执行搜索
     */
    handleSearch(): void {
      this.getGroupData(this.activeTabIndex);
    },
    /**
     * 创建视频链
     */
    handleCreateVideoLink() {
      (this.$refs as any).CreateVideoLink.open();
    },
    /**
     * 地图范围分组列表点击，进入详情页面
     *
     * @param {Object} item 列表项
     */
    handleAreaListClick(item: any) {
      console.log(item);
      this.taskName = item.name;
      this.clickedAreaItem = item;
    },
    /**
     * 批量删除
     */
    handleBatchDelete() {
      // 分组id列表
      const groupIds =
        this.activeTabIndex === 0
          ? (this.$refs.TaskList as any).checkedList
          : (this.$refs.MultiVideoExpand as any).checkedGroupIDList;
      // 关联设备id列表
      const deviceIds = this.checkedList.map(
        (device: { relatedId: number }) => device.relatedId,
      );
      // 没有勾选时不执行，直接返回
      if (!groupIds?.length && !deviceIds?.length) {
        return;
      }
      (this as any)
        .$MessageBox({
          type: 'delete',
          title: '删除提示',
          message: '确认删除勾选的数据？',
          tips: this.activeTabIndex === 3 ? '删除主链时，整个分组也会一并删除' : '',
        })
        .then(() => {
          // 请求参数
          let url1;
          let url2;
          switch (this.activeTabIndex) {
            case 0: {
              url1 = '/device/appdrawgroup/delete';
              break;
            }
            case 1: {
              url1 = '/device/appdeviceshortcut/delete';
              url2 = '/device/appdeviceshortcutrelated/delete';
              break;
            }
            case 2: {
              url1 = '/applabel/delete';
              url2 = '/device/applabeldevice/delete';
              break;
            }
            case 3: {
              url1 = '/device/appdevicelist/delete';
              url2 = '/device/appdevicelistrelated/delete';
              break;
            }
            default:
          }
          const request1 = {
            method: 'post',
            url: url1,
            service: 'flight',
            headers: {
              'Content-Type': 'application/json',
            },
            data: groupIds,
          };
          const request2 = {
            method: 'post',
            url: url2,
            service: 'flight',
            headers: {
              'Content-Type': 'application/json',
            },
            data: deviceIds,
          };
          this.isLoading = true;
          if (groupIds?.length) {
            (this as any)
              .$http(request1)
              .then((response: any) => {
                if (response.code === 0) {
                  if (deviceIds?.length && this.activeTabIndex !== 0) {
                    (this as any)
                      .$http(request2)
                      .then((res: any) => {
                        if (!(res.code === 0)) {
                          (this as any).$message(
                            `删除设备失败，错误代码${res.code}，错误信息：${res.msg}`,
                          );
                        } else {
                          this.getGroupData(this.activeTabIndex);
                        }
                      })
                      .catch((error: Error) => {
                        (this as any).$message(
                          `删除设备失败，错误信息：${error}`,
                        );
                      });
                  } else {
                    this.getGroupData(this.activeTabIndex);
                  }
                } else {
                  (this as any).$message(
                    `删除分组失败，错误代码${response.code}，错误信息：${response.msg}`,
                  );
                }
              })
              .catch((error: Error) => {
                (this as any).$message(`删除分组失败，错误信息：${error}`);
              })
              .finally(() => {
                this.isLoading = false;
              });
          } else if (deviceIds?.length && this.activeTabIndex !== 0) {
            (this as any)
              .$http(request2)
              .then((response: any) => {
                if (response.code === 0) {
                  this.getGroupData(this.activeTabIndex);
                } else {
                  (this as any).$message(
                    `删除设备失败，错误代码${response.code}，错误信息：${response.msg}`,
                  );
                }
              })
              .catch((error: Error) => {
                (this as any).$message(`删除设备失败，错误信息：${error}`);
              })
              .finally(() => {
                this.isLoading = false;
              });
          }
        });
    },
    /**
     * 视频链分组-删除分组内的摄像头
     */
    handleDeleteDevices() {
      const index = this.activeTabIndex;
      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/appdevicelistrelated/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: this.checkedList.map(
          (device: { relatedId: number }) => device.relatedId,
        ),
      };
      if (request.data?.length) {
        (this as any).$http(request).then((response: any) => {
          if (response?.code === 0) {
            this.getGroupData(index);
          }
        });
      }
    },
    /**
     * 分组改名
     */
    handleGroupRename(newVal: string, group: any) {
      console.log(newVal, group);
      let url;
      switch (this.activeTabIndex) {
        case 1: {
          url = '/device/appdeviceshortcut/update';
          break;
        }
        case 2: {
          url = '/applabel/update';
          break;
        }
        case 3: {
          url = '/device/appdevicelist/update';
          break;
        }
        default: {
          throw Error('非法标签下标');
        }
      }
      const request = {
        method: 'post',
        service: 'flight',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: group.id,
          name: newVal,
        },
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          if (response.code === 0) {
            (this as any).$refs.MultiVideoExpand.edittingGroupIndex = -1;
            this.getGroupData(this.activeTabIndex);
          } else {
            (this as any).$message.error(
              `标签改名失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          (this as any).$message.error(`标签改名失败，错误信息：${error}`);
        });
    },
    /**
     * 点击绘制摄像头
     *
     * @param {Object} device 摄像头对象
     */
    handleDrawDevice(device: any) {
      const mapInstance = window.map;
      mapInstance.clearDeleteCoverage('飞巡分组点击设备落点');
      mapInstance.createdMarkCoverage('飞巡分组点击设备落点');
      if (!(device.lon || device.longitude) && !(device.lat || device.latitude)) {
        this.$message.error(`该分组没有经纬度坐标`);
        return false;
      }
      mapInstance.setCentent(
        {
          longitude: device.lon || device.longitude,
          latitude: device.lat || device.latitude,
        },
        14,
      );
      mapInstance.setOneMarker(
        '飞巡分组点击设备落点',
        {
          longitude: device.lon || device.longitude,
          latitude: device.lat || device.latitude,
          wd: 40,
          hg: 40,
          src: useMapMarker('监控'),
        },
        {
          click: () => {
            this.cameraDetail = device;
            console.log(this.cameraDetail);
            (this.$refs[
              'flight-camera-view'
            ] as any).cameraTitle = device.isMain ? '视频链监控' : '监控详情';
            (this as any).$refs['flight-camera-view'].initMap(
              this.cameraDetail.lon || this.cameraDetail.longitude,
              this.cameraDetail.lat || this.cameraDetail.latitude,
            );
          },
        },
      );
    },
  },
});
</script>

<style lang="scss" src="./style/FlightGroup.scss"></style>
