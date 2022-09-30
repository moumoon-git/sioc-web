<template>
  <div v-loading="isLoading" v-bind="$attrs" class="flight-group-detail">
    <!-- 顶部 -->
    <TopHeader @go-back="goBack">
      <!-- 标题 -->
      <template v-if="!isTitleEditting">
        <span :title="groupItem.name" style="font: inherit; margin-right: 5px">
          {{ (activeItem ? activeItem.name : groupItem.name) || '暂无标题' }}
        </span>
        <OperationButton
          v-if="!activeItem"
          :list="['edit']"
          style="display: inline-block; position: relative; bottom: 2px"
          @edit="isTitleEditting = true"
        />
      </template>
      <!-- 编辑标题 -->
      <EditInput
        v-else
        style="width: 200px; font-size: 18px"
        :value="groupItem.name || '暂无标题'"
        @confirm="handleTitleChange"
        @cancel="isTitleEditting = false"
      />
      <!-- 摄像头总数统计 -->
      <template #right>
        <span class="flight-group-detail__header__right">
          {{ activeItem ? activeItem.devices?.length ?? 0 : devicesCount }}
        </span>
      </template>
    </TopHeader>
    <!-- 绘图记录列表 -->
    <main>
      <ul v-show="!activeItem">
        <li v-for="(item, index) in listData" :key="index">
          <!-- 标题和操作按钮 -->
          <h5>
            <i
              :class="[
                'flight-group-detail__record__icon',
                {
                  'flight-group-detail__record__icon--dot': item.drawType === 0,
                  'flight-group-detail__record__icon--line':
                    item.drawType === 2,
                  'flight-group-detail__record__icon--area':
                    item.drawType === 1,
                },
              ]"
            />
            <!-- 编辑绘图记录名称 -->
            <EditInput
              v-if="edittingRecordIndex === index"
              style="width: 200px; font-size: 18px"
              :value="item.title || '暂无标题'"
              @confirm="handleRecordEdit($event, item)"
              @cancel="edittingRecordIndex = -1"
            />
            <span
              v-else
              :title="item.title"
              style="cursor: pointer;"
              @click="showItemDetail(item)"
            >
              {{ item.title }}
            </span>
            <OperationButton
              class="flight-group-detail__list-item__button"
              :list="manageButtonList(index)"
              @edit="edittingRecordIndex = index"
              @up="handleRecordMove('up', index)"
              @down="handleRecordMove('down', index)"
              @delete="handleRecordDelete(item)"
            />
          </h5>
          <!-- 设备标签 -->
          <p>
            <Tag
              v-for="(label, labelIndex) in labelList[index]"
              :key="labelIndex"
              :title="`${label.name}(${label.deviceList.length})`"
              @delete="handleLabelDelete(item, label)"
            >
              {{ label.name }}({{ label.deviceList.length }})
            </Tag>
          </p>
          <!-- 起点和终点 -->
          <Address> {{ item?.beginCoordinateName || '-' }}（起点） </Address>
          <Address v-if="item?.endCoordinateName">
            {{ item?.endCoordinateName }}（终点）
          </Address>
        </li>
      </ul>
      <MultiExpand
        v-if="activeItem"
        :group-data="[activeItem]"
        :show-preview="false"
        :show-edit="false"
        :show-check="false"
        :prop-setting="{
          id: 'id',
          name: 'name',
          children: 'devices',
          isOffline: 'isOffline',
        }"
      />
    </main>
    <!-- 底部巡查开关 -->
    <footer>
      <Button
        v-if="hasRepatrol && !isRePatrol && !isPatrolling"
        @click="isRePatrol = true"
      >
        重巡
      </Button>
      <PatrolSwitch v-else :task-name="groupItem.name" :task-type="1" />
    </footer>
  </div>
  <!-- 摄像头弹窗 -->
  <FlightCameraView ref="flight-camera-view" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import TopHeader from '@/product/CommandBrain3.0/Generalparts/right/TopHeader/TopHeader.vue';
import Button from '@/product/CommandBrain3.0/Generalparts/right/Button/Button.vue';
import Tag from '@/product/CommandBrain3.0/Generalparts/right/Tag/Tag.vue';
import Address from '@/product/CommandBrain3.0/Generalparts/right/Address/Address.vue';
import EditInput from '@/product/CommandBrain3.0/Generalparts/right/EditInput/EditInput.vue';
import OperationButton from '@/product/CommandBrain3.0/Generalparts/right/OperationButton/OperationButton.vue';
import PatrolSwitch from '../../components/PatrolSwitch/PatrolSwitch.vue';
import MultiExpand from '../../components/MultiVideoExpand/MultiVideoExpand.vue';
import FlightCameraView from '@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightCamera/FlightCameraView.vue';

export default defineComponent({
  name: 'FlightGroupDetail',
  components: {
    // 顶部标题栏
    TopHeader,
    // 底部重巡按钮
    Button,
    // 列表标签
    Tag,
    // 列表地址栏
    Address,
    // 操作按钮
    OperationButton,
    // 底部巡察开关
    PatrolSwitch,
    // 改名编辑框
    EditInput,
    // 飞巡摄像头
    FlightCameraView,
    // 设备详情
    MultiExpand,
  },
  props: {
    // 是否显示重巡按钮，用于非飞巡记录的其他页面
    hasRepatrol: {
      type: Boolean,
      default: true,
    },
    // 查看详情的分组项
    groupItem: {
      type: Object,
      required: true,
    },
  },
  emits: ['go-back'],
  data() {
    return {
      deviceList: [] as any,
      // 点击弹窗的摄像头对象
      cameraDetail: {} as any,
      // 列表数据
      listData: [],
      // 点击查看详情的列表项
      activeItem: null as any,
      // 是否重巡
      isRePatrol: false,
      // 载入中
      isLoading: false,
      // 标题开启编辑
      isTitleEditting: false,
      // 正在编辑名称的记录的下标
      edittingRecordIndex: -1,
      // 是否巡察中
      isPatrolling: (this as any).$store.state.flightPatrol.dispatchDeskState,
    };
  },
  computed: {
    // 设备总数
    devicesCount() {
      let total = 0;
      this.listData.forEach((item: { devices: any[] }) => {
        total += item?.devices?.length || 0;
      });
      return total;
    },
    // 标签列表
    labelList() {
      // 所有绘图记录的数据处理结果
      const result: any = [];
      this.listData.forEach((record: { devices: any[] }) => {
        // 单条绘图记录中标签与设备的映射
        const labelsMap = new Map();
        labelsMap.set(-1, {
          name: '无标签',
          list: new Set(),
        });
        if (record?.devices?.length) {
          record.devices.forEach((device: { labels: any[]; id: number }) => {
            // 该设备有标签
            if (device?.labels?.length) {
              device.labels.forEach((label: { name: string; id: number }) => {
                // 将设备id加入到对应标签的列表中
                if (!labelsMap.has(label.id)) {
                  labelsMap.set(label.id, {
                    name: label.name,
                    list: new Set(),
                  });
                }
                labelsMap.get(label.id).list.add(device.id);
              });
            } else {
              // 无标签
              labelsMap.get(-1).list.add(device.id);
            }
          });
        }
        // 单条绘图记录的数据处理结果
        const singleRecordResult: any = [];
        labelsMap.forEach((label, id) => {
          singleRecordResult.unshift({
            id,
            name: label.name,
            deviceList: Array.from(label.list),
          });
          // 无标签为空时去掉
          if (id === -1 && label.list.size === 0) {
            singleRecordResult.shift();
          }
          // 清除 Set
          label.list.clear();
        });
        // 清除 Map
        labelsMap.clear();
        result.push(singleRecordResult);
      });
      return result;
    },
  },
  provide() {
    return {
      cameraDetail: computed(() => this.cameraDetail),
    };
  },
  mounted() {
    this.getDetail();
  },
  beforeUnmount() {
    this.clearCovg();
    this.clearAllDevices();
  },
  methods: {
    /**
     * 获取详情
     */
    getDetail() {
      this.listData = [];
      this.isLoading = true;
      const request = {
        method: 'get',
        service: 'flight',
        url: '/device/appdraw/list',
        params: {
          groupId: this.groupItem.id,
        },
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          if (response.code === 0 && response?.data?.list) {
            this.listData = response.data.list;
            // 根据order排序
            this.listData.sort(
              (prev: { order: number }, next: { order: number }) =>
                prev.order - next.order,
            );
            const renderGraphData: any = [];
            const deviceList: any[] = [];
            this.listData.forEach(
              (item: { order: number; devices: any[] }, index) => {
                (item as any).name = (item as any).title;
                const type =
                  (item as any).type === '0' ? 'GeoCircle' : 'GeoPolygonEx';
                // 重新绘制所有绘图记录
                const obj: any = {
                  typeNum: (item as any).type,
                  type,
                  cps: {
                    controlPoints: (item as any).controlPointseList,
                  },
                  style: { strokeColor: '#fff', fillColor: '#fff' },
                };
                if ((item as any).controlPointseList) {
                  renderGraphData.push(obj);
                }
                /* eslint-disable no-param-reassign */
                // 修改绘图记录的 order，满足0开始递增1
                item.order = index;
                // 获取所有设备
                if (item?.devices?.length) {
                  deviceList.push(...item.devices);
                }
              },
            );
            // controlPoints
            const data = Array.isArray(this.listData) ? this.listData : [];
            // console.log(data);
            (this as any).$store.dispatch('flightPatrol/changeDeskData', data);
            this.renderGraph(renderGraphData);
            // 绘制摄像头落点
            this.drawAllDevices(deviceList);
          } else {
            (this as any).$message.error(
              `获取分组详情失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          (this as any).$message.error(`获取分组详情失败，错误信息：${error}`);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    /**
     * 点击返回
     */
    goBack() {
      if (this.activeItem) {
        this.activeItem = null;
      } else {
        this.$emit('go-back');
        this.clearCovg();
      }
    },
    /**
     * 清空当前图层
     */
    clearCovg() {
      (window as any).map.clearAtPresentVectorData('flightRecord');
    },
    /**
     * 绘制图形
     */
    renderGraph(data: any) {
      // console.log(data);
      (window as any).map.renderGraph('flightRecord', data);
    },
    /**
     * 绘制摄像头落点
     */
    drawAllDevices(deviceList: any[]) {
      this.deviceList = deviceList;
      const mapInstance = window.map;
      const tmp = deviceList.map((device, index) => ({
        index,
        longitude: device.lon || device.longitude,
        latitude: device.lat || device.latitude,
      }));
      tmp[0] &&
        mapInstance.setCentent(
          {
            longitude: (tmp as any)?.[0].lon || tmp?.[0].longitude,
            latitude: (tmp as any)?.[0].lat || tmp?.[0].latitude,
          },
          14,
        );
      let styleObj = {
        width: 34,
        height: 45,
        img: require('@/product/CommandBrain3.0/FunModule/FlightPatrol/FlightRecord/FlightRecordDetail/assets/marker.png'),
      };
      mapInstance.drawConverge('飞巡结果聚合图层', tmp, styleObj, {
        click: (e: any) => {
          this.cameraDetail = this.deviceList[e.index];
          (this.$refs['flight-camera-view'] as any).cameraTitle = '监控详情';
          (this as any).$refs['flight-camera-view'].initMap(
            this.cameraDetail.lon || this.cameraDetail.longitude,
            this.cameraDetail.lat || this.cameraDetail.latitude,
          );
        },
      });
    },
    /**
     * 清空摄像头落点
     */
    clearAllDevices() {
      if (this.deviceList?.length) {
        const mapInstance = window.map;
        mapInstance.clearDrawConvergeData('飞巡结果聚合图层');
      }
    },
    /**
     * 修改顶部标题
     */
    handleTitleChange(name: string) {
      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/appdrawgroup/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: this.groupItem.id,
          name,
        },
      };
      this.isLoading = true;
      (this as any)
        .$http(request)
        .then((response: any) => {
          if (response.code === 0) {
            this.isTitleEditting = false;
            const item = this.groupItem;
            item.name = name;
          } else {
            (this as any).$message.error(
              `修改分组名称失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          (this as any).$message.error(`修改分组名称失败，错误信息：${error}`);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    /**
     * 删除标签对应的所有设备
     *
     * @param {Object} item 绘图记录
     * @param {Object} label 标签对象
     */
    handleLabelDelete(item: { id: number }, label: { deviceList: number[] }) {
      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/appdrawdevicerelated/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          deviceIds: label.deviceList,
          drawId: item.id,
        },
      };
      (this as any)
        .$MessageBox({
          type: 'delete',
          title: '删除提示',
          message: '确认删除对应标签的所有设备？',
          tips: '删除后数据无法恢复',
        })
        .then(() => {
          this.isLoading = true;
          (this as any)
            .$http(request)
            .then((response: any) => {
              if (response.code === 0) {
                this.getDetail();
              } else {
                (this as any).$message.error(
                  `删除标签失败，错误代码${response.code}，错误信息：${response.msg}`,
                );
              }
            })
            .catch((error: Error) => {
              (this as any).$message.error(`删除标签失败，错误信息：${error}`);
            })
            .finally(() => {
              this.isLoading = false;
            });
        });
    },
    /**
     * 记录操作按钮控制，第一个没有下移，最后一个没有上移
     *
     * @param {Number} index 记录下标
     * @return 按钮列表
     */
    manageButtonList(index: number) {
      if (index === 0 && this.listData?.length === 1) {
        return ['edit', 'delete'];
      }
      switch (index) {
        case 0: {
          return ['down', 'edit', 'delete'];
        }
        case this.listData.length - 1: {
          return ['up', 'edit', 'delete'];
        }
        default: {
          return ['up', 'down', 'edit', 'delete'];
        }
      }
    },
    /**
     * 修改绘图记录的名称
     *
     * @param {String} title 新名称
     * @param {Object} record 绘图记录对象
     */
    handleRecordEdit(title: string, record: { id: number; title: string }) {
      // 新名称为空，或未改变，则不处理
      if (!title || title === record.title) {
        this.edittingRecordIndex = -1;
        return;
      }
      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/appdraw/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: record.id,
          title,
        },
      };
      this.isLoading = true;
      (this as any)
        .$http(request)
        .then((response: any) => {
          if (response.code === 0) {
            this.edittingRecordIndex = -1;
            this.getDetail();
          } else {
            (this as any).$message.error(
              `修改绘图记录名称失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          (this as any).$message.error(
            `修改绘图记录名称失败，错误信息：${error}`,
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    /**
     * 删除绘图记录
     *
     * @param {Object} record 绘图记录对象
     */
    handleRecordDelete(record: { id: number }) {
      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/appdraw/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: record.id,
        },
      };
      (this as any)
        .$MessageBox({
          type: 'delete',
          title: '删除提示',
          message: '确认删除该条记录？',
          tips: '删除后数据无法恢复',
        })
        .then(() => {
          this.isLoading = true;
          (this as any)
            .$http(request)
            .then((response: any) => {
              if (response.code === 0) {
                this.getDetail();
              } else {
                (this as any).$message.error(
                  `删除绘图记录失败，错误代码${response.code}，错误信息：${response.msg}`,
                );
              }
            })
            .catch((error: Error) => {
              (this as any).$message.error(
                `删除绘图记录失败，错误信息：${error}`,
              );
            })
            .finally(() => {
              this.isLoading = false;
            });
        })
        .catch(() => null);
    },
    /**
     * 处理绘图记录上下移
     *
     * @param {String} flag 上移还是下移
     * @param {Number} index 绘图记录下标
     */
    handleRecordMove(flag: 'up' | 'down', index: number) {
      interface Order {
        id: number;
        order: number;
      }
      const result: Order[] = [];
      this.listData.forEach((item: Order) => {
        result.push({
          id: item.id,
          order: item.order,
        });
      });
      if (flag === 'up') {
        // 上移
        result[index].order -= 1;
        result[index - 1].order += 1;
      } else {
        // 下移
        result[index].order += 1;
        result[index + 1].order -= 1;
      }
      this.isLoading = true;
      const request = {
        method: 'post',
        service: 'flight',
        url: '/device/appdraw/order',
        headers: {
          'Content-Type': 'application/json',
        },
        data: result,
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          if (response.code === 0) {
            this.getDetail();
          } else {
            (this as any).$message.error(
              `排序失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          (this as any).$message.error(`排序失败，错误信息：${error}`);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    /**
     * 点击列表项，显示该项的所有设备
     */
    showItemDetail(record: any) {
      this.activeItem = record;
      this.activeItem?.devices?.forEach((device: any) => {
        device.isOffline = device.status !== 0 && device.status !== '0';
      });
      this.activeItem?.devices?.sort((a: any, b: any) => Number(a.isOffline) - Number(b.isOffline));
    },
  },
});
</script>

<style lang="scss" src="./style/FlightGroupDetail.scss"></style>
