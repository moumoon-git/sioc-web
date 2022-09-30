<template>
  <div :class="$style.HandleMaterial" :style="{ width: `${width}px` }">
    <div :class="$style.dataVis" v-for="(x, i) in houseListData" :key="i">
      <!-- 显示和操作部分 -->
      <div :class="$style.header">
        <span @click="wareHouse(x)">{{ x.wareHouse.storehouseName||x.wareHouse.groupName }}</span>
        <div>
          <span
            @click="setMapCenters(x)"
            :class="[$style.icon, $style['local-icon']]"
          ></span>
          <span
            @click="delHouse(i)"
            v-if="edit"
            :class="[$style.icon, $style['del-icon']]"
          ></span>
        </div>
      </div>
      <!-- 数据展示和操作部分 -->
      <ul>
        <li
          :class="$style.dataVisLi"
          v-for="(o, ind) in x.wareHouseList"
          :key="ind"
        >
          <span>{{ o.name }}</span>
          <div v-if="edit">
            <!-- 操作数量 -->
            <ControlQuantity
              v-model="o.value"
              @change="handleChange"
              :min="1"
              :max="o.amount"
            />
            <!-- 删除 -->
            <span
              @click="delAppointMaterial(i, ind)"
              :class="[$style.icon, $style['del-icon']]"
            ></span>
          </div>
          <span v-else>{{ o.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, watch } from 'vue';
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';
import ControlQuantity from './ControlQuantity.vue';

export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 335,
    },
    edit: {
      type: Boolean,
      default: true,
    },
    listData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ControlQuantity,
  },
  emit: ['changeHouseArr'],
  setup(props: any, contxt) {
    const store = useStore();
    // 获取全局参数
    const { $mapDialog } = useGlobal();
    const houseListData = ref<any>(props.listData);
    // 控制数量
    function handleChange(value: any) {
      contxt.emit('changeHouseArr', houseListData.value);
    }
    // 设置到地图中心
    function setMapCenters(params: any) {
      (window as any).map.getMapMaxZoom().then((res: any) => {
        (window as any).map.setCentent(params.wareHouse, res);
      });
      contxt.emit('setMapCenters', params);
    }
    // 打开仓库信息
    function wareHouse(params: any) {
      $mapDialog(
        {
          modle: 'resource_articleStorehouse',
        },
        document.body,
      ).open({
        requestData: {
          id: params.wareHouse.storehouseId,
          eventId: store.state.event?.id,
        },
      });
    }
    // 删除仓库
    function delHouse(ind: number) {
      houseListData.value.splice(ind, 1);
      contxt.emit('changeHouseArr', houseListData.value);
    }
    // 删除仓库下的指定物资
    function delAppointMaterial(i: number, ind: number) {
      /*
        i:是仓库下标
        ind:是物资下标
      */
      houseListData.value[i].wareHouseList.splice(ind, 1);
      contxt.emit('changeHouseArr', houseListData.value);
    }

    watch(
      () => props.listData,
      (newV) => {
        houseListData.value = JSON.parse(JSON.stringify(newV));
      },
    );

    return {
      handleChange,
      setMapCenters,
      wareHouse,
      // 删除仓库
      delHouse,
      // 删除仓库下的指定物资
      delAppointMaterial,
      houseListData,
    };
  },
});
</script>

<style lang="scss" module>
.HandleMaterial {
  width: 100%;
  & > div {
    margin: 10px 0;
    border: 1px solid #56e9ff;
  }
}
.header {
  height: 44px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > span {
    &:first-child {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 14px;
      font-weight: 400;
      width: 80%;
      cursor: pointer;
      color: #56e9ff;
    }
  }
  & > div {
    display: flex;
    align-items: center;
    & > span {
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.dataVis {
  padding: 0 10px;
}
.dataVisLi {
  margin: 10px 0;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  & > span {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
  }
  & > div {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    & > div {
      margin-right: 10px;
      width: 80px;
      & > span {
        width: 23px;
        background: rgba(67, 70, 71, 1);
        top: 0;
        height: 100%;
        border-color: rgba(20, 29, 31, 1);
        line-height: 22px;
        border-radius: 0;
        color: #fff;
        &:hover {
          color: #fff;
        }
      }
      & > div {
        line-height: 0;
        & > input {
          color: #fff;
          padding: 0 !important;
          height: 22px;
          background: rgba(67, 70, 71, 1);
          border: 1px solid rgba(67, 70, 71, 1) !important;
        }
      }
    }
  }
}
.icon {
  display: block;
  width: 18px !important;
  height: 18px !important;
  cursor: pointer;
}

.del-icon {
  background: url('../assets/del.svg') no-repeat !important;
  background-size: 100% 100%;
  &:hover {
    background: url('../assets/del_active.svg') no-repeat !important;
    background-size: 100% 100%;
  }
}
.local-icon {
  background: url('../assets/local.svg') no-repeat !important;
  background-size: 100% 100%;
  &:hover {
    background: url('../assets/local_active.svg') no-repeat !important;
    background-size: 100% 100%;
  }
}
</style>
