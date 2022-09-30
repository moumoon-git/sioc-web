<template>
  <FlightList
    v-if="groupItem.type === 0 && isRePatrol"
    :group-item="{ ...groupItem }"
    :list-data2="listData"
    :has-repatrol="false"
    @go-back="goBack"
  />
  <div
    v-else
    v-loading="isLoading"
    v-bind="$attrs"
    class="flight-record-detail"
  >
    <!-- 顶部 -->
    <TopHeader @go-back="goBack">
      <!-- 标题 -->
      <template v-if="!isTitleEditting">
        <span :title="title" style="font: inherit; margin-right: 5px">
          {{ title || '暂无标题' }}
        </span>
        <OperationButton
          v-if="isRePatrol"
          :list="['edit']"
          style="display: inline-block; position: relative; bottom: 2px"
          @edit="isTitleEditting = true"
        />
      </template>
      <!-- 编辑标题 -->
      <EditInput
        v-else
        style="width: 200px; font-size: 18px"
        :value="title || '暂无标题'"
        @confirm="handleTitleChange"
        @cancel="isTitleEditting = false"
      />
      <!-- 摄像头总数统计 -->
      <template #right>
        <span class="flight-record-detail__header__right">
          {{ devicesCount }}
        </span>
      </template>
    </TopHeader>
    <!-- 绘图记录列表 -->
    <main v-if="groupItem.type === 0">
      <ul>
        <li v-for="(item, index) in listData" :key="index">
          <!-- 标题和操作按钮 -->
          <h5>
            <i
              :class="[
                'flight-record-detail__record__icon',
                {
                  'flight-record-detail__record__icon--dot':
                    item.drawType === 0,
                  'flight-record-detail__record__icon--line':
                    item.drawType === 2,
                  'flight-record-detail__record__icon--area':
                    item.drawType === 1,
                },
              ]"
            />
            <span :title="item.title">
              {{ item.title }}
            </span>
          </h5>
          <!-- 设备标签 -->
          <p>
            <Tag
              v-for="(label, labelIndex) in labelList[index]"
              :key="labelIndex"
              :title="`${label.name}(${label.deviceList.length})`"
              :show-delete="false"
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
    </main>
    <!-- 分组列表 -->
    <main v-else>
      <div v-if="isRePatrol" class="flight-record-detail__top-operation">
        <button @click="handleBatchDelete">批量删除</button>
        <button @click="$refs.SaveAsGroup.open()">存为分组</button>
      </div>
      <MultiExpand
        v-model="checkedDevices"
        :group-data="listData"
        :show-check="isRePatrol"
        :show-preview="false"
        :show-edit="false"
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
      <PatrolSwitch v-else :task-name="title" :task-type="1" />
    </footer>
  </div>
  <!-- 存为分组弹窗 -->
  <SaveAsGroup ref="SaveAsGroup" :device-list="checkedDevices" />
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
import MultiExpand from '../../components/MultiVideoExpand/MultiVideoExpand.vue';
import PatrolSwitch from '../../components/PatrolSwitch/PatrolSwitch.vue';
import SaveAsGroup from '../../components/SaveAsGroup/SaveAsGroup.vue';
import FlightList from '../../FlightInspection/FlightList.vue';
import FlightCameraView from '../../FlightCamera/FlightCameraView.vue';

export default defineComponent({
  name: 'FlightRecordDetail',
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
    // 展开列表
    MultiExpand,
    // 飞巡列表，重巡后使用
    FlightList,
    // 存为分组弹窗
    SaveAsGroup,
    // 飞巡摄像头
    FlightCameraView,
  },
  provide() {
    return {
      cameraDetail: computed(() => this.cameraDetail),
    };
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
      // 列表数据
      listData: [],
      // 设备列表数据（地图绘制用）
      deviceList: [] as any,
      // 点击弹窗的摄像头对象
      cameraDetail: {} as any,
      // 是否重巡
      isRePatrol: false,
      // 载入中
      isLoading: false,
      // 标题
      title: this.groupItem.name,
      // 标题开启编辑
      isTitleEditting: false,
      // 正在编辑名称的记录的下标
      edittingRecordIndex: -1,
      // 勾选的设备
      checkedDevices: [],
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
        labelsMap.set('无标签', {
          name: '无标签',
          list: new Set(),
        });
        if (record?.devices?.length) {
          record.devices.forEach((device: { labels: any[]; id: number }) => {
            // 该设备有标签
            if (device?.labels?.length) {
              device.labels.forEach((label: { name: string; id: number }) => {
                // 将设备id加入到对应标签的列表中
                if (!labelsMap.has(label.name)) {
                  labelsMap.set(label.name, {
                    name: label.name,
                    list: new Set(),
                  });
                }
                labelsMap.get(label.name).list.add(device.id);
              });
            } else {
              // 无标签
              labelsMap.get('无标签').list.add(device.id);
            }
          });
        }
        // 单条绘图记录的数据处理结果
        const singleRecordResult: any = [];
        labelsMap.forEach((label, id) => {
          singleRecordResult.unshift({
            id: label.id,
            name: label.name,
            deviceList: Array.from(label.list),
          });
          // 无标签为空时去掉
          if (id === '无标签' && label.list.size === 0) {
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
  watch: {
    checkedDevices(newVal) {
      console.log(newVal);
      (this as any).$store.dispatch(
        'flightPatrol/saveDispatchDeskData',
        newVal,
      );
    },
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
        url: '/device/appbrowselog/listByType',
        params: {
          borwseLogId: this.groupItem.id,
        },
      };
      (this as any)
        .$http(request)
        .then((response: any) => {
          if (response.code === 0 && response?.data?.list) {
            this.listData = response.data.list;
            const sessionArr = response.data.list;
            sessionStorage.setItem('tempListData', JSON.stringify(sessionArr));
            // 根据order排序
            this.listData.sort(
              (prev: { order: number }, next: { order: number }) =>
                prev.order - next.order,
            );
            const renderGraphData: any = [];
            const deviceList: any[] = [];
            // 线缓存区的数据
            const lineData: any = [];
            console.log('飞巡记录所有的数据：')
            console.log(this.listData)
            this.listData.forEach(
              (item: { order: number; devices: any[] }, index) => {
                const type =
                  (item as any).type === '0' ? 'GeoCircle' : 'GeoPolygonEx';
                item.devices?.forEach((device) => {
                  device.isOffline = device.status !== 0 && device.status !== '0';
                });
                if ((item as any).type === '2') {
                  lineData.push((item as any).controlPointseList);
                } else {
                  // 重新绘制所有绘图记录
                  if ((item as any).controlPointseList) {
                    const obj: any = {
                      typeNum: (item as any).type,
                      type,
                      cps: {
                        controlPoints: (item as any).controlPointseList,
                      },
                      style: { strokeColor: '#fff', fillColor: '#fff' },
                    };
                    renderGraphData.push(obj);
                  }
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
            (this as any).$store.dispatch('flightPatrol/changeDeskData', data);
            this.renderGraph(renderGraphData);
            this.renderPolygon(lineData);
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
      this.$emit('go-back');
      this.clearCovg();
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
      // console.log(data1);
      (window as any).map.renderGraph('flightRecord', data);
    },
    // 绘制线缓冲区
    renderPolygon(data: any) {
      console.log(data);
      data.forEach((ele: any) => {
        (window as any).map.renderPolygon('flightRecord', ele);
      });
    },
    /**
     * 修改顶部标题
     */
    handleTitleChange(name: string) {
      this.title = name;
      this.isTitleEditting = false;
    },
    /**
     * 批量删除
     */
    handleBatchDelete() {
      this.listData.forEach((group: { devices: any[] }) => {
        if (group?.devices?.length) {
          group.devices = group.devices.filter(
            (device) =>
              !this.checkedDevices.find(
                (item: { id: number }) => item.id === device.id,
              ),
          );
        }
      });
      this.checkedDevices = [];
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
        img: require('./assets/marker.png'),
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
  },
});
</script>

<style lang="scss" src="./style/FlightRecordDetail.scss"></style>
