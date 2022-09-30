// 树形组件
<template>
  <ElTree
    ref="mapTree"
    class="sv-tree"
    icon-class="sv-tree__icon"
    default-expand-all
    :data="treeData"
    node-key="id"
    :props="propsSetting"
    empty-text="暂无数据"
    :show-checkbox="showcheckbox"
    :filter-node-method="filterTreeData"
    :default-checked-keys="selectIds"
    @node-click="nodeClick"
    @check="clickCheckFun"
  >
    <template #default="{ node, data }">
      <div v-if="data.children" class="groupItemSlot">
        <div class="groupItemSlot__left__box">
          <div
            v-if="isShowFatherIcon"
            :class="`groupItemSlot__left__icon__${returnIconClass(
              data.markType,
            )}`"
          />
          <div class="groupItemSlot__text">{{ data.name }}</div>
        </div>

        <div class="groupItemSlot__operation">
          <el-tooltip
            v-if="isShowFatherEditIcon && (deleteType === 'group' && data.isDefault !== 1) || data.rights === '1'"
            class="item"
            effect="dark"
            content="编辑"
            placement="bottom"
          >
            <div
              class="groupItemSlot__operation__item groupItemSlot__operation__item1"
              @click="editGroupFunEmit(data)"
            />
          </el-tooltip>
          <el-tooltip
            v-if="
              isShowFatherDeleteIcon && (deleteType === 'group') && node.level === 1 || data.rights === '1'
            "
            class="item"
            effect="dark"
            content="删除"
            placement="bottom"
          >
            <div
              class="groupItemSlot__operation__item groupItemSlot__operation__item2"
              @click="deleteFunEmit(data)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
            <div
              :class="[
                'groupItemSlot__operation__item',
                'groupItemSlot__operation__item3',
                'groupItemSlot__operation__item3--active',
              ]"
              @click.stop="handleTreeClick(data)"
            />
          </el-tooltip>
        </div>
      </div>
      <div v-else class="groupItemSlot">
        <div class="groupItemSlot__left">
          <div
            v-if="isShowChildIcon"
            :class="`groupItemSlot__left__icon__${returnIconClass(
              data.markType,
            )}`"
          />
          <div class="groupItemSlot__left__text">{{ data.name }}</div>
        </div>
        <div class="groupItemSlot__right">
          <el-tooltip
            v-if="deleteType === 'group'"
            class="item"
            effect="dark"
            content="删除"
            placement="bottom"
          >
            <div
              :class="[
                'groupItemSlot__operation__delete',
              ]"
              @click.stop="deletLayer(data)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
            <div
              :class="[
                'groupItemSlot__operation__look',
                { 'groupItemSlot__operation__look--active': data.show },
              ]"
              @click.stop="handClick(data)"
            />
          </el-tooltip>
        </div>
      </div>
    </template>
  </ElTree>
  <div v-show="false">
    <MapPopup ref="mapPopupRef" :vis-data="renderData" :enter="from" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex';
// 地图弹窗
import MapPopup from '@/product/Coplotting/generalparts/MapPopup/MapPopup.vue';
import { log } from 'util';
// 点线面的渲染
import spotOrLineOrNoodles from '@/product/Coplotting/module/mainLogicJS/spotOrLineOrNoodlesRender';
// 获取最后一层数据
import useReturnAllNodes from '@/product/Coplotting/module/MapPlotting/script/useReturnAllNodes';

export default defineComponent({
  components: {
    MapPopup,
  },
  props: {
    name: String,
    // 是否显示多选框
    showcheckbox: {
      type: Boolean,
      default: false,
    },
    // 是否显示子节点头部图标
    isShowChildIcon: {
      type: Boolean,
      default: false,
    },
    // 是否显示父节点头部图标
    isShowFatherIcon: {
      type: Boolean,
      default: false,
    },
    // 是否显示父节点编辑图标
    isShowFatherEditIcon: {
      type: Boolean,
      default: true,
    },
    // 是否显示父节点删除图标
    isShowFatherDeleteIcon: {
      type: Boolean,
      default: true,
    },
    // 要删除的类型
    deleteType: {
      type: String,
      default: 'group',
    },
    // 显示的树数据
    treeData: {
      type: Array,
      default: [],
    },
    // 弹窗来自指挥还是协作标绘
    from: {
      type: String,
      default: '',
    },
    // 默认勾选的节点ids
    selectIds: {
      type: Array,
      default: [],
    },
  },
  emits: [
    'lookFun',
    'deleteGroupFun',
    'editGroupFun',
    'importMap',
    'deletePlatForm',
    'deleteImport',
    'deleteItemFun',
    'isDefaultFun'
  ],
  setup(props, context) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const store = useStore(); // 使用vuex
    const labelFlag = ref([]);
    const showLayerData = ref([]);
    const datas = ref<any>([]);
    const mapPopupRef: any = ref(null);
    const renderData: any = reactive({}); // 标注数据
    // 渲染点线面的方法
    const { spotOrLineOrNoodlesRender } = spotOrLineOrNoodles(
      $http,
      mapPopupRef,
    );
    // 渲染要显示的图层数据
    function renderShowLayer() {
      console.log('显示显示');
      showLayerData.value.forEach((item: any) => {
        if (item.show) {
          const tempObj: any = JSON.parse(JSON.stringify(item));
          spotOrLineOrNoodlesRender([tempObj]);
        }
      });
      // 如果是协作tab进来则将标注弹框的编辑权限取消掉(华为缺陷BUG2021070896344)
      if (props.deleteType === 'coop') {
        if (mapPopupRef.value) {
          (mapPopupRef.value as any).editJurisdiction = false;
        }
        // store.commit('coplotting/SET_DISABLEDVALUE', true)
      }
    }
    const ids = ref<any>([]);
    function returnTreeIds(array: any) {
      array.forEach((item: any) => {
        if (item.children) {
          returnTreeIds(item.children);
        } else if (!item.children) {
          // 获得符合的 node
          ids.value.push(item.id);
        }
      });
    }
    // 树节点点击
    function handleTreeClick(data: any) {
      ids.value = []; // 置空
      datas.value = []; // 置空
      console.log(data);
      returnTreeIds(data.children); // 当前节点下面所有孩子id
      console.log(ids.value);
      // 每一次点击清空图层数据
      (window as any).map.clearAtPresentMarkData(
        (window as any).mapCoverageName.mark,
      );
      (window as any).map.clearAtPresentVectorData(
        (window as any).mapCoverageName.vector,
      );
      // 获取树形结构最后一层数据
      returnTreeData(props.treeData);
      showLayerData.value = datas.value;
      console.log('总共的数据：', showLayerData.value);
      // 获取当前点击的dom节点
      const thisDom: any = (window as any).event.target;
      // 判断是否选中状态
      if (
        thisDom
          .getAttribute('class')
          .indexOf('groupItemSlot__operation__item3--active') > -1
      ) {
        thisDom.classList.remove('groupItemSlot__operation__item3--active');
        showLayerData.value.forEach((item: any) => {
          if (ids.value.includes(item.id)) {
            item.show = false;
          }
        });
      } else {
        thisDom.classList.add('groupItemSlot__operation__item3--active');
        showLayerData.value.forEach((item: any) => {
          if (ids.value.includes(item.id)) {
            item.show = true;
          }
        });
      }
      console.log('处理后总共数据：', showLayerData.value);
      renderShowLayer(); // 渲染要显示的图层数据
    }
    // 点击节点显示对应的标绘
    function nodeClick(node: any, data: any) {
      console.log(node, data);
      if (!node.children) {
        // 是否是点
        if (node.markType === 0) {
          const { longitude, laitude } = node;
          (window as any).map.setCentent({ longitude, latitude: laitude }, 15);
        } else {
          // 不是点的
          const centerData = node?.coordinatesJsonObject?.controlPoints[0] || {};
          // console.log('不是点', centerData);
          (window as any).map.setCentent(
            { longitude: centerData.x, latitude: centerData.y },
            15,
          );
        }
      }
    }
    // 递归返回最后一层数据
    function returnTreeData(array: any) {
      array.forEach((item: any) => {
        if (item.children) {
          returnTreeData(item.children);
        } else if (!item.children) {
          // 获得符合的 node
          datas.value.push(item);
        }
      });
    }
    // 点击单个预览
    function handClick(data: any) {
      console.log(data);
      // 每一次点击清空图层数据
      datas.value = [];
      (window as any).map.clearAtPresentMarkData(
        (window as any).mapCoverageName.mark,
      );
      (window as any).map.clearAtPresentVectorData(
        (window as any).mapCoverageName.vector,
      );
      // 获取树形结构最后一层数据
      returnTreeData(props.treeData);
      showLayerData.value = datas.value;
      console.log('总共的数据：', showLayerData.value);
      // 获取当前点击的dom节点
      const thisDom: any = (window as any).event.target;
      // 判断是否选中状态
      if (
        thisDom
          .getAttribute('class')
          .indexOf('groupItemSlot__operation__look--active') > -1
      ) {
        thisDom.classList.remove('groupItemSlot__operation__look--active');
        showLayerData.value.forEach((item: any) => {
          if (item.id === data.id) {
            item.show = false;
          }
        });
      } else {
        thisDom.classList.add('groupItemSlot__operation__look--active');
        showLayerData.value.forEach((item: any) => {
          if (item.id === data.id) {
            item.show = true;
          }
        });
      }
      console.log('处理后总共的数据：', showLayerData.value);
      renderShowLayer(); // 渲染要显示的图层数据
    }
    // 分组树方法
    function deleteFunEmit(obj: any) {
      console.log(obj)
      // 删除分组
      if (props.deleteType === 'group') {
        context.emit('deleteGroupFun', obj.id);
        context.emit('isDefaultFun', obj.isDefault);
      }
      // 删除协作平台
      if (props.deleteType === 'coop') {
        context.emit('deletePlatForm', obj.id);
      }
      // 删除导入记录
      if (props.deleteType === 'import') {
        context.emit('deleteImport', obj.id);
      }
    }
    // 编辑
    function editGroupFunEmit(obj: Object) {
      context.emit('editGroupFun', obj);
    }
    // 子级删除
    function deletLayer(obj: any) {
      context.emit('deleteItemFun', obj.id);
    }
    // 返回类型对应的图标类名
    function returnIconClass(markType: number): string {
      let type = '';
      if (markType === 0) {
        // 点
        type = 'point';
      } else if (markType === 1) {
        // 面
        type = 'area';
      } else if (markType === 2) {
        // 线
        type = 'line';
      } else {
        type = 'point';
      }
      return type;
    }
    // 树最后一层数据
    const tempTreeData: any = ref([]);
    function returnAllNodes(arr: any) {
      arr.forEach((item: any) => {
        if (item.children) {
          returnAllNodes(item.children);
        } else if (!item.children) {
          // 获得符合的 node
          tempTreeData.value.push(item);
        }
      });
      return tempTreeData.value;
    }
    // 全选显示
    function showAllLayerFun(isShow: boolean) {
      tempTreeData.value = [];
      // 每一次点击清空图层数据
      datas.value = [];
      (window as any).map.clearAtPresentMarkData(
        (window as any).mapCoverageName.mark,
      );
      (window as any).map.clearAtPresentVectorData(
        (window as any).mapCoverageName.vector,
      );
      tempTreeData.value = returnAllNodes(props.treeData); // 树形数据
      showLayerData.value = tempTreeData.value;
      if (isShow) {
        showLayerData.value.forEach((item: any) => {
          item.show = true;
        });
      } else {
        showLayerData.value.forEach((item: any) => {
          item.show = false;
        });
      }
      renderShowLayer(); // 渲染要显示的图层数据
      showLayerData.value = [];
    }
    return {
      labelFlag,
      handleTreeClick,
      handClick,
      // 分组
      deleteFunEmit,
      editGroupFunEmit,
      nodeClick,
      returnIconClass, // 返回图标类名
      mapPopupRef,
      renderData,
      showAllLayerFun,
      deletLayer,
    };
  },
  data() {
    return {
      importMapData: [], // 要导入地图的数据
      // 树形参数配置
      propsSetting: {
        label: 'name',
        children: 'children',
      },
    };
  },
  methods: {
    // 修改要导入地图的数据
    clickCheckFun() {
      this.importMapData = (this.$refs.mapTree as any).getCheckedNodes(
        true,
        false,
      );
      console.log(this.importMapData);
      this.$emit('importMap', this.importMapData);
    },
  },
});
</script>

<style lang="scss">
// 树形组件样式
.groupItemSlot {
  width: 100%;
  height: 100%;
  line-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__left__box {
    display: flex;
  }
  &:hover {
    .groupItemSlot__operation__look {
      display: block;
    }
    .groupItemSlot__operation__delete {
      display: block;
    }
  }
  &__left {
    display: flex;
    &__icon__point {
      width: 17px;
      height: 20px;
      background: url(../assets/point.svg) no-repeat;
    }
    &__icon__line {
      width: 17px;
      height: 20px;
      background: url(../assets/line.svg) no-repeat;
    }
    &__icon__area {
      width: 17px;
      height: 20px;
      background: url(../assets/area.svg) no-repeat;
    }
    &__text {
      margin-left: 4px;
    }
  }
  &__text {
    margin-left: 4px;
  }
  &__operation {
    display: flex;
    margin-right: 12px;

    .groupItemSlot__operation__item {
      width: 17px;
      height: 12px;
      margin: 0 5px;
    }
    .groupItemSlot__operation__item1 {
      width: 14px;
      height: 14px;
      background: url(../assets/opencil.svg) no-repeat;
      margin: 0 5px;
      &:hover {
        background: url(../assets/opencilActive.svg) no-repeat;
      }
    }
    .groupItemSlot__operation__item2 {
      width: 14px;
      height: 15px;
      background: url(../assets/odelete.svg) no-repeat;
      margin: 0 12px;
      &:hover {
        background: url(../assets/odeleteActive.svg) no-repeat;
      }
    }
    .groupItemSlot__operation__item3 {
      width: 17px;
      height: 12px;
      background: url(../assets/olook.svg) no-repeat;
      margin: 0 5px;
      &:hover {
        background: url(../assets/olookActive.svg) no-repeat;
      }
    }
    .groupItemSlot__operation__item3--active {
      background: url(../assets/olookActive.svg) no-repeat;
    }
  }
  &__right {
    display: flex;
  }
  &__operation__delete {
    display: none;
    width: 14px;
    height: 15px;
    background: url(../assets/odelete.svg) no-repeat;
    margin-right: 17px;
    &:hover {
      background: url(../assets/odeleteActive.svg) no-repeat;
    }
  }
  &__operation__look {
    display: none;
    width: 17px;
    height: 12px;
    background: url(../assets/olook.svg) no-repeat;
    margin-right: 17px;
    &:hover {
      background: url(../assets/olookActive.svg) no-repeat;
    }
  }
  &__operation__look--active {
    display: block;
    background: url(../assets/olookActive.svg) no-repeat;
  }
}
.groupItemSlot__left__icon__point {
  width: 17px;
  height: 20px;
  background: url(../assets/point.svg) no-repeat;
  background-position: 50% 50%;
}
.groupItemSlot__left__icon__line {
  width: 17px;
  height: 20px;
  background: url(../assets/line.svg) no-repeat;
  background-position: 50% 50%;
}
.groupItemSlot__left__icon__area {
  width: 17px;
  height: 20px;
  background: url(../assets/area.svg) no-repeat;
  background-position: 50% 50%;
}
</style>
