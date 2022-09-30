// 标注列表组件
<template>
  <div class="taggingSection">
    <div
      v-for="(item,index) in listData"
      :key="index"
      class="taggingSection__item"
      @click="setCenter(item)"
    >
      <div class="taggingSection__item__left">
        <div :class="`taggingSection__item__left__icon--${item.markType}`" />
        <div class="taggingSection__item__left__name">
          {{ item.markName }}
        </div>
      </div>
      <div class="taggingSection__item__right">
        <el-tooltip
          class="item"
          effect="dark"
          content="编辑"
          placement="bottom"
          style="display:none"
        >
          <div class="taggingSection__item__right__icon" />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="查看属性"
          placement="bottom"
          style="display:none"
        >
          <div class="taggingSection__item__right__icon" />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="删除"
          placement="bottom"
        >
          <div
            class="taggingSection__item__right__icon"
            @click="deleteTagging(item.id)"
          />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="预览"
          placement="bottom"
        >
          <div
            class="taggingSection__item__right__icon"
            @click.stop="showLayer(item)"
          />
        </el-tooltip>
      </div>
    </div>
  </div>
  <div v-show="false">
    <MapPopup
      ref="mapPopupRef"
      :vis-data="renderData"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance, reactive, onMounted, watch,
} from 'vue';
import { useStore } from 'vuex';
import MapPopup from '@/product/Coplotting/generalparts/MapPopup/MapPopup.vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  components: {
    MapPopup,
  },
  props: {
    // 显示的列表数据
    listData: {
      type: Array,
      default: [],
    },
  },
  emits: ['refrashFun'],
  setup(props, context) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showLayerData = ref<any>([]); // 要显示的layer数据
    const mapPopupRef:any = ref(null);
    const renderData:any = reactive({}); // 标注数据
    const store = useStore(); // 使用vuex
    function handClick() {
      context.emit('refrashFun');
    }
    /**
    * @desc 删除
    * @param {} params
    * @returns {} returns
    */
    function deleteTagging(id:number) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistmarkrecord/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          context.emit('refrashFun');
        } else {
          ElMessage.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除失败，错误信息：${error}`);
      });
    }
    /**
    * @desc 处理数据
    * @param {} params
    * @returns {} returns
    */
    function showLayer(data:any) {
      showLayerData.value = props.listData;
      (window as any).map.clearAtPresentMarkData((window as any).mapCoverageName.mark);
      (window as any).map.clearAtPresentVectorData((window as any).mapCoverageName.vector);
      // 获取当前点击的dom节点
      const thisDom:any = (window as any).event.target;
      // 判断是否选中状态
      if (thisDom.getAttribute('class').indexOf('taggingSection__item__right__icon--active') > -1) {
        thisDom.classList.remove('taggingSection__item__right__icon--active');
        showLayerData.value.map((item:any) => {
          if (item.id === data.id) {
            item.show = false;
          }
        });
      } else {
        thisDom.classList.add('taggingSection__item__right__icon--active');
        showLayerData.value.map((item:any) => {
          if (item.id === data.id) {
            item.show = true;
          }
        });
      }
      renderLayer();
    }
    /**
    * @desc 渲染数据
    * @param {} params
    * @returns {} returns
    */
    function renderLayer() {
      const showData = showLayerData.value.filter((item:any) => item.show);
      // console.log(showData);
      const coverageBeforDraw:any = {
        // 操作类型 点和线或者面 spot line noodle other
        handleType: '',
        // 操作数据
        handleData: showData,
      };
      store.commit('coplotting/SET_coverageBeforDraw', coverageBeforDraw);
    }
    /**
    * @desc 点击设置为中心点
    * @param {} params
    * @returns {} returns
    */
    function setCenter(obj:any) {
      const { longitude, laitude } = obj;
      window.map.setCentent({ longitude, latitude: laitude }, 15);
    }
    // 总数据刷新图层数据
    watch(() => props.listData, (val, old) => {
      (window as any).map.clearAtPresentMarkData((window as any).mapCoverageName.mark);
      (window as any).map.clearAtPresentVectorData((window as any).mapCoverageName.vector);
      showLayerData.value = val;
      showLayerData.value.map((item:any) => {
            item.show = true;
        });
      renderLayer();
    },
     {
      immediate: true,
    });
    return {
      mapPopupRef,
      deleteTagging,
      showLayer,
      renderData,
      setCenter,
    };
  },
});
</script>

<style lang="scss">
.el-popper.is-dark {
  z-index: 9999999 !important;
}
.item {
}
.taggingSection {
  display: flex;
  flex-wrap: wrap;
  width: 338px;
  margin: 0 auto;
  &:empty::before {
    content: "暂无";
    display: block;
    text-align: center;
    color: #666;
    position: absolute;
    left: 50%;
  }
  &__item {
    width: 338px;
    height: 41px;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #e4e7ed;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    &:hover {
      .taggingSection__item__right {
        display: flex;
      }
    }
    &__left {
      display: flex;
      height: 100%;
      align-items: center;
      // &__icon {
      //   width: 20px;
      //   height: 20px;
      //   // border: 1px solid black;
      // }
      &__icon--0 {
        // 点
        width: 20px;
        height: 20px;
        background: url(../assets/point.svg) no-repeat;
        background-position: 50% 50%;
        margin-left: 11px;
        background-size: 100% 100%;
        // border: 1px solid black;
      }
      &__icon--1 {
        // 面
        width: 20px;
        height: 20px;
        background: url(../assets/area.svg) no-repeat;
        background-position: 50% 50%;
        margin-left: 11px;
        background-size: 100% 100%;
        // border: 1px solid black;
      }
      &__icon--2 {
        // 线
        width: 20px;
        height: 20px;
        background: url(../assets/line.svg) no-repeat;
        background-position: 50% 50%;
        margin-left: 11px;
        background-size: 100% 100%;
        // border: 1px solid black;
      }
      &__name {
        margin-left: 5px;
      }
    }
    &__right {
      display: none;
      align-items: center;
      .taggingSection__item__right__icon {
        width: 20px;
        height: 20px;
        &:nth-child(1) {
          width: 14px;
          height: 14px;
          background: url(../assets/opencil.svg) no-repeat;
          margin: 0 5px;
          &:hover {
            background: url(../assets/opencilActive.svg) no-repeat;
          }
        }
        &:nth-child(2) {
          width: 13px;
          height: 14px;
          background: url(../assets/odetail.svg) no-repeat;
          margin: 0 5px;
          &:hover {
            background: url(../assets/odetailActive.svg) no-repeat;
          }
        }
        &:nth-child(3) {
          width: 14px;
          height: 15px;
          background: url(../assets/odelete.svg) no-repeat;
          margin: 0 5px;
          &:hover {
            background: url(../assets/odeleteActive.svg) no-repeat;
          }
        }
        &:nth-child(4) {
          width: 17px;
          height: 12px;
          background: url(../assets/olook.svg) no-repeat;
          margin: 0 5px;
          &:hover {
            background: url(../assets/olookActive.svg) no-repeat;
          }
        }
      }
      .taggingSection__item__right__icon--active {
        background: url(../assets/olookActive.svg) no-repeat !important;
      }
    }

    &:hover {
      border: 1px solid #3f92fe;
      background: #ecf4ff;
      cursor: pointer;
    }
  }
}
</style>
