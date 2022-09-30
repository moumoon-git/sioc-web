<template>
  <div
    v-loading="isLoading"
    v-bind="$attrs"
    class="flight-record-detail"
  >
    <!-- 顶部 -->
    <TopHeader
      :show-back="false"
      @go-back="$emit('go-back')"
    >
      <!-- 标题 -->
      <template v-if="!isTitleEditting">
        <span
          :title="groupItem.name"
          style="font: inherit; margin-right: 5px;"
        >{{ groupItem.name || '暂无标题' }}</span>
        <OperationButton
          :list="['edit']"
          style="display: inline-block; position: relative; bottom: 2px;"
          @edit="isTitleEditting = true;"
        />
      </template>
      <!-- 编辑标题 -->
      <EditInput
        v-else
        style="width: 200px; font-size: 18px;"
        :value="groupItem.name || '暂无标题'"
        @confirm="handleTitleChange"
        @cancel="isTitleEditting = false;"
      />
      <!-- 摄像头总数统计 -->
      <template #right>
        <span class="flight-record-detail__header__right">{{ allCameraNum }}</span>
      </template>
    </TopHeader>
    <div
      class="flight-record-detail__header__add"
      @click="saveGroup"
    >
      存为分组
    </div>
    <!-- 绘图记录列表 -->
    <main>
      <ul>
        <li
          v-for="(item, index) in listData"
          :key="index"
          @click="goToDetail(item)"
          @mouseover="mouseIn(index)"
          @mouseout="getDetail"
        >
          <!-- 标题和操作按钮 -->
          <h5>
            <i
              :class="[
                'flight-record-detail__record__icon',
                {
                  'flight-record-detail__record__icon--dot': item.drawType === 0,
                  'flight-record-detail__record__icon--line': item.drawType === 2,
                  'flight-record-detail__record__icon--area': item.drawType === 1,
                },
              ]"
            />
            <!-- 编辑绘图记录名称 -->
            <EditInput
              v-if="edittingRecordIndex === index"
              style="width: 200px; font-size: 18px;"
              :value="item.title || '暂无标题'"
              @confirm="handleRecordEdit($event, item)"
              @cancel="edittingRecordIndex = -1;"
            />
            <span
              v-else
              :title="item.title"
            >{{ item.title }}</span>
            <OperationButton
              class="flight-record-detail__list-item__button"
              :list="manageButtonList(index)"
              @edit="edittingRecordIndex = index"
              @up="handleRecordMove('up', index)"
              @down="handleRecordMove('down', index)"
              @delete="handleRecordDelete(item, index)"
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
          <Address>{{ item?.beginCoordinateName || '-' }}（起点）</Address>
          <Address v-if="item?.endCoordinateName">
            {{ item?.endCoordinateName }}（终点）
          </Address>
        </li>
      </ul>
    </main>
    <!-- 底部巡查开关 -->
    <footer>
      <Button
        v-if="hasRepatrol && !isRePatrol && !isPatrolling"
        @click="isRePatrol = true"
      >
        重巡
      </Button>
      <PatrolSwitch
        v-else
        :task-name="groupItem.name"
        :task-type="0"
      />
    </footer>
  </div>
  <!-- 存为分组弹窗 -->
  <SaveGroup
    ref="SaveGroup"
    :task-data="listData"
    :device-list="deviceList"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TopHeader from '@/product/CommandBrain3.0/Generalparts/right/TopHeader/TopHeader.vue';
import Button from '@/product/CommandBrain3.0/Generalparts/right/Button/Button.vue';
import Tag from '@/product/CommandBrain3.0/Generalparts/right/Tag/Tag.vue';
import Address from '@/product/CommandBrain3.0/Generalparts/right/Address/Address.vue';
import EditInput from '@/product/CommandBrain3.0/Generalparts/right/EditInput/EditInput.vue';
import OperationButton from '@/product/CommandBrain3.0/Generalparts/right/OperationButton/OperationButton.vue';
import PatrolSwitch from '../components/PatrolSwitch/PatrolSwitch.vue';
import SaveGroup from './saveGroup.vue';

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
    SaveGroup, // 存为分组
  },
  inject: [
    '$MessageBox',
  ],
  props: {
    // 是否显示重巡按钮，用于非飞巡记录的其他页面
    hasRepatrol: {
      type: Boolean,
      default: false,
    },
    // 查看详情的分组项
    groupItem: {
      type: Object,
      required: true,
    },
    listData2: {
      type: Array,
      default: () => [],
    },
    allCameraNum: {
      type: Number,
      require: false,
    },
  },
  emits: ['go-back', 'go-detail', 'showPointDetail', 'showLineDetail', 'showAreaDetail'],
  data() {
    return {
      // 列表数据
      listData: [] as any[],
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
    // 所有设备列表
    deviceList() {
      let list: any[] = [];
      this.listData.forEach((item: { devices: any[] }) => {
        if (item?.devices?.length) {
          item.devices.forEach((device) => {
            // device.name = device.deviceName;
          });
          list.push(...item.devices);
        }
      });
      list = this.returnNewArr(list);
      return list;
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
          record.devices.forEach((device: { labels: any[], id: number }) => {
            // 该设备有标签
            if (device?.labels?.length) {
              device.labels.forEach((label: { name: string, id: number }) => {
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
  mounted() {
    (window as any).map.createdVectorCoverage('线缓冲图层', {
          strokeColor: '#ffffff',
          strokeWidth: 2,
          fillColor: '#fff',
          fillOpacity: 0.2,
        });
    this.getDetail();
  },
  beforeUnmount() {
    this.clearCovg();
  },
  methods: {
    // 存为分组
    saveGroup() {
      (this.$refs as any).SaveGroup.open();
    },
    /**
     * 获取详情
     */
    getDetail() {
      (window as any).map.clearAtPresentVectorData('标绘图层');
      (window as any).map.clearAtPresentVectorData('飞巡圆图层'); // 显示新的圆图层的时候先清除原有的数据
      (window as any).map.clearDrawConvergeData('飞巡结果聚合图层'); // 清空图层
      (window as any).map.clearAtPresentMarkData('巡查点maker'); // 清除巡查点图层
      (window as any).map.clearAtPresentVectorData('flightRecord');
      (window as any).map.clearAtPresentVectorData('线缓冲图层');
      // (window as any).map.setVectorCoverage('线缓冲图层', {
      //     strokeColor: '#fff',
      //     strokeWidth: 2,
      //     fillColor: '#fff',
      //     fillOpacity: 0.2,
      // });
      const sessionListData = sessionStorage.getItem('tempListData');
      this.listData = this.listData2?.length ? this.listData2 : this.jsonToArr(sessionListData);
      this.listData.forEach((element: any) => {
        const tempIds = [] as any;
        element.devices.forEach((element2: any) => {
          tempIds.push(Number(element2.id));
        });
        element.deviceIds = tempIds;
      });
      (this as any).$store.commit('flightPatrol/SET_dispatchDeskData', this.listData);

        const renderGraphData: any = [];
        const deviceList: any[] = [];
        // 线缓存区的数据
        const lineData: any = [];
            this.listData.forEach(
              (item: { order: number; devices: any[] }, index) => {
                const type = (item as any).type === 0 ? 'GeoCircle' : 'GeoPolygonEx';
                if ((item as any).type === 2) {
                  lineData.push({
                    lineParam: (item as any).layerShowObj.lineParam,
                    range: (item as any).layerShowObj.r,
                  });
                } else if ((item as any).controlPointseList) {
                    // 重新绘制所有绘图记录
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
      const styleObj: any = {
        width: 34,
        height: 45,
        img: require('./assets/camera.svg'),
      };
      mapInstance.drawConverge('飞巡结果聚合图层', tmp, styleObj, {
        click: (e: any) => {
          // this.cameraDetail = this.deviceList[e.index];
          // (this.$refs['flight-camera-view'] as any).cameraTitle = '监控详情';
          // (this as any).$refs['flight-camera-view'].initMap(
          //   this.cameraDetail.lon || this.cameraDetail.longitude,
          //   this.cameraDetail.lat || this.cameraDetail.latitude,
          // );
        },
      });
    },
    /**
     * 清空摄像头落点
     */
    clearAllDevices() {
        const mapInstance = window.map;
        mapInstance.clearDrawConvergeData('飞巡结果聚合图层');
    },
    // 绘制线缓冲区
    renderPolygon(data: any) {
      data.forEach((ele: any) => {
        (window as any).map.renderBuffer('线缓冲图层', ele.lineParam, ele.range, true);
      });
    },
    // json对象转数组
    jsonToArr(jsonStr: any) {
      const jsonObj = JSON.parse(jsonStr);
      const jsonStr1 = JSON.stringify(jsonObj);
      const jsonArr = [];
      for (let i = 0; i < jsonObj.length; i++) {
        jsonArr[i] = jsonObj[i];
      }
      return jsonArr;
    },
    /*
    * 清空当前图层
    */
    clearCovg() {
      (window as any).map.clearAtPresentVectorData('flightRecord');
      (window as any).map.clearAtPresentVectorData('线缓冲图层');
    },
    /*
    * 绘制图形
    */
    renderGraph(data: any) {
      console.log(data);
      (window as any).map.renderGraph('flightRecord', data);
    },
    /**
     * 修改顶部标题
     */
    handleTitleChange(name: string) {
      this.groupItem.name = name;
      this.isTitleEditting = false;
    },
    /**
     * 删除标签对应的所有设备
     *
     * @param {Object} item 绘图记录
     * @param {Object} label 标签对象
     */
    handleLabelDelete(
      item: any,
      label: { deviceList: number[] },
    ) {
      console.log(item, label);
      (this as any).$MessageBox({
        type: 'delete',
        title: '删除提示',
        message: '确认删除对应标签的所有设备？',
        tips: '删除后数据无法恢复',
      }).then(() => {
        this.listData.forEach((element: any) => {
          if (element.title === item.title) {
            element.devices.forEach((elementIn: any, index: any) => {
              if (label.deviceList.includes(elementIn.id)) {
                element.devices.splice(index, 1);
              }
            });
          }
        });
        console.log(this.listData);
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
    handleRecordEdit(title: string, record: { beginCoordinateName: string, title: string }) {
      // 新名称为空，或未改变，则不处理
      if (!title || title === record.title) {
        this.edittingRecordIndex = -1;
      }
      record.title = title;
      this.edittingRecordIndex = -1;
    },
    /**
     * 删除绘图记录
     *
     * @param {Object} record 绘图记录对象
     */
    handleRecordDelete(record: { beginCoordinateName: string }, index: number) {
      console.log(record.beginCoordinateName);
      (this as any).$MessageBox({
        type: 'delete',
        title: '删除提示',
        message: '确认删除该条记录？',
        tips: '删除后数据无法恢复',
      })
        .then(() => {
          this.listData.splice(index, 1);
          sessionStorage.setItem('tempListData', JSON.stringify(this.listData));
          this.clearCovg();
          this.clearAllDevices();
          this.getDetail();
        })
        .catch(() => null);
    },
    /**
     * 处理绘图记录上下移
     *
     * @param {String} flag 上移还是下移
     * @param {Number} index 绘图记录下标
     */
    handleRecordMove(
      flag: 'up' | 'down',
      index: number,
    ) {
      interface Order {
        id: number,
        order: number,
      }
      const result: Order[] = [];
      this.listData.forEach((item: Order) => {
        result.push({
          id: item.id,
          order: item.order,
        });
      });
      if (flag === 'up') {
        this.upFun(index, this.listData);
        this.resetOrder();
      } else {
        this.downFun(index, this.listData);
        this.resetOrder();
      }
    },
    /**
    * @desc 上移
    * @param {}
    * @returns {}
    */
    upFun(index: number, arr: any) {
      if (index !== 0) {
        arr[index] = arr.splice(index - 1, 1, arr[index])[0];
      } else {
        arr.push(arr.shift());
      }
    },
    /**
    * @desc 下移
    * @param {}
    * @returns {}
    */
    downFun(index: number, arr: any) {
      if (index !== arr.length - 1) {
        arr[index] = arr.splice(index + 1, 1, arr[index])[0];
      } else {
        arr.unshift(arr.splice(index, 1)[0]);
      }
    },
    /**
    * @desc 重新计算每一项的order并保存
    * @param {}
    * @returns {}
    */
    resetOrder() {
      this.listData.forEach((item:any, index:number) => {
        item.order = index;
      });
      console.log(this.listData);
    },
    // 数组对象去重
    returnNewArr(arr: any) {
      const hash: any = {};
      const newArray = arr.reduce((item: any, next: any) => {
        hash[next.id] ? '' : hash[next.id] = true && item.push(next);
        return item;
      }, []);
      return newArray;
    },
    // 查看详情
    goToDetail(item:any) {
      item.layerShowObj.appLabelDeviceVOS = this.returnDetailTreeData(item.devices, item.deviceIds);
      this.$emit('go-detail', item);
      (this as any).$store.commit('flightPatrol/SET_showChecked', false);
    },
    // 处理监控数据返回详情应该显示的数据
    returnDetailTreeData(arr:any, deviceIds:any) {
      const parentArr:any = [];
      arr.forEach((item:any) => {
        parentArr.push(item.parent);
      });
      const keyArr:any = [];
      parentArr.forEach((element:any) => {
            keyArr.push(element.labelId); // 通过key来判断
        });
      const newKeyArr:any = new Set(keyArr);
      const topicArr:any = [];
      newKeyArr.forEach((item:any) => {
        const index:number = keyArr.findIndex((item2:any) => item2 === item);
        topicArr.push(parentArr[index]);
      });
      topicArr.forEach((element:any) => {
        element.children.forEach((item:any, index:number) => {
          if (!deviceIds.includes(Number(item.id))) {
            element.children.splice(index, 1);
          }
        });
      });
      console.log('计算后的数据');
      console.log(topicArr);
      return topicArr;
    },
    // 鼠标移入显示对应的图形变色
    mouseIn(itemIndex:number) {
      (window as any).map.clearAtPresentVectorData('flightRecord');
      (window as any).map.clearAtPresentVectorData('线缓冲图层');
      const renderGraphData: any = [];
        // 线缓存区的数据
        const lineData: any = [];
            this.listData.forEach(
              (item: { order: number; devices: any[] }, index:number) => {
                // hover的图形的索引
                const type = (item as any).type === 0 ? 'GeoCircle' : 'GeoPolygonEx';
                if ((item as any).type === 2) {
                  lineData.push({
                    lineParam: (item as any).layerShowObj.lineParam,
                    range: (item as any).layerShowObj.r,
                  });
                } else if ((item as any).controlPointseList) {
                    // 重新绘制所有绘图记录
                    if (itemIndex === index) {
                      console.log(item);
                      (window as any).map.setVectorCoverage('线缓冲图层', {
                          strokeColor: 'blue',
                          strokeWidth: 2,
                          fillColor: '#fff',
                          fillOpacity: 0.2,
                      });
                      const obj: any = {
                      typeNum: (item as any).type,
                      type,
                      cps: {
                        controlPoints: (item as any).controlPointseList,
                      },
                      style: { strokeColor: 'blue', fillColor: '#fff' },
                    };
                    renderGraphData.push(obj);
                    } else {
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
              },
            );
            this.renderGraph(renderGraphData);
            this.renderPolygon(lineData);
    },
  },
});
</script>

<style lang="scss" src="./style/FlightList.scss">
</style>
