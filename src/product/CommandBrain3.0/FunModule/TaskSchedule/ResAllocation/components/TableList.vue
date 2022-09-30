<template>
  <div :class="$style.TableList">
    <!-- 头部 -->
    <header>
      <ul :class="$style.tableUl">
        <li>物资名称</li>
        <li>所属仓库</li>
        <li>物资类型</li>
        <li>库存数量</li>
        <li>操作</li>
      </ul>
    </header>
    <!-- 列表数据 -->
    <aside>
      <ul @scroll="load">
        <!-- 渲染数据 -->
        <li v-for="(x, i) in listData" :key="i">
          <!-- 对应的上面一行 -->
          <div>
            <ul :class="$style.tableUl">
              <li>{{ x.name }}</li>
              <li @click="wareHouse(x)">
                {{ x.storehouseName||x.groupName }}
              </li>
              <li>{{ x.typeName }}</li>
              <li>{{ x.amount || x.number }}</li>
              <li :class="$style.add" @click="addMaterial(x)" />
            </ul>
          </div>
          <!-- 内容 -->
          <div>
            <div>
              <span />
              <div>地址：{{ x.address }}</div>
              <span
                :class="[$style.icon, $style['local-icon']]"
                @click="setMapCenters(x)"
              />
            </div>
            <div>
              <span
                >负责人：
                {{ x.contactorName }}
              </span>
              <ContactMoreButton :id="x.contactorId" />
            </div>
          </div>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import useGlobal from '@/product/CommandBrain3.0/globalHooks/useGlobal';

export default defineComponent({
  components: {
    // 详情按钮
    ContactMoreButton,
  },
  props: {
    listData: {
      type: Array,
      default: () => {},
    },
  },
  setup(props, contxt) {
    const store = useStore();
    // 获取全局参数
    const instance = getCurrentInstance();
    const { $mapDialog, $http } = useGlobal();
    // 添加到列表
    function addMaterial(params: any) {
      contxt.emit('addMaterial', params);
    }
    // 设置到地图中心
    function setMapCenters(params: any) {
      if (params.latitude && params.longitude) {
        (window as any).map.getMapMaxZoom().then((res: any) => {
          (window as any).map.setCentent(params, res);
        });
      }
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
          id: params.articleStorehouseId,
          eventId: store.state.event?.id,
        },
      });
    }

    // 滚动加载
    function load(e: Event): void {
      const dom = e.target as HTMLElement;
      if (dom.scrollHeight - dom.scrollTop === dom.clientHeight) {
        contxt.emit('scroll');
      }
    }
    return {
      addMaterial,
      setMapCenters,
      wareHouse,
      // 滚动加载
      load,
    };
  },
  mounted() {},
});
</script>

<style lang="scss" module>
.TableList {
  height: 100%;
  & > header {
    width: 100%;
    height: 48px;
    background: linear-gradient(
      90deg,
      rgba(20, 98, 140, 0.59) 0%,
      rgba(14, 69, 100, 0.49) 100%
    );
  }
  & > aside {
    height: calc(100% - 48px);
    & > ul {
      padding: 16px;
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
      & > li {
        width: 100%;
        height: 94px;
        border: 1px solid #00c1de;
        display: flex;
        flex-direction: column;
        margin-bottom: 18px;
        & > div {
          &:first-child {
            height: 50px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            & > ul {
              padding: 0 2%;
              & > li {
                &:nth-child(2) {
                  color: rgba(86, 233, 255, 1);
                  cursor: pointer;
                }
              }
            }
          }
          &:last-child {
            display: flex;
            color: #fff;
            flex: 1;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            & > div {
              display: flex;
              align-items: center;
              &:first-child {
                width: 60%;
                max-width: 60%;
                & > div {
                  width: 94%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
              & > span {
                &:last-child {
                  margin-left: 5px;
                }
              }
            }
          }
        }
        &:hover {
          border-color: rgba(86, 233, 255, 1);
        }
      }
      &:last-child::-webkit-scrollbar {
        width: 3px;
        height: 5px;
        /* background-color: rgba(100, 104, 105, 1); */
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
        background-color: #56e9ff;
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
        border-radius: 10px;
        background-color: #646869;
      }
    }
  }
}

.tableUl {
  display: flex;
  color: #ffffff;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 4%;
  & > li {
    &:nth-child(1) {
      width: 28%;
    }
    &:nth-child(2) {
      width: 30%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    &:nth-child(3) {
      width: 8%;
      white-space: nowrap;
    }
    &:nth-child(4) {
      width: 8%;
      white-space: nowrap;
    }
    &:nth-child(5) {
      width: 4%;
      white-space: nowrap;
    }
  }
}
.icon {
  display: block;
  width: 18px !important;
  height: 18px !important;
  cursor: pointer;
}
.local-icon {
  background: url('../assets/local.svg') no-repeat !important;
  background-size: 100% 100%;
  &:hover {
    background: url('../assets/local_active.svg') no-repeat !important;
    background-size: 100% 100%;
  }
}
.add {
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: url('../assets/add.svg') no-repeat !important;
  background-size: 100% 100%;
  &:hover {
    background: url('../assets/add_active.svg') no-repeat !important;
    background-size: 100% 100%;
  }
}
</style>
