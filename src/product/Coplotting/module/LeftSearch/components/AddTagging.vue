<template>
  <div v-if="visFlag" :class="$style.AddTagging">
    <aside>
      <header>
        <span>新增标注</span>
        <span @click="visFlag = false" />
      </header>
      <main>
        <ul>
          <li>
            <span>分组</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              />
            </el-select>
          </li>
          <li>
            <span>分类</span>
            <SelectClass
              :select-hg="selectHg"
              :class-data="classData"
              @selecrData="selecrData"
            />
          </li>
          <li>
            <span>状态</span>
            <SelectClass
              ref="selectState"
              v-model="classStateEcho"
              :select-hg="selectHg"
              modelflag="stateSelect"
            />
          </li>
        </ul>
      </main>
      <footer>
        <el-button type="primary" @click="save"> 确定 </el-button>
        <el-button @click="visFlag = false"> 取消 </el-button>
      </footer>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

// 选择分类
import SelectClass from '@/product/Coplotting/module/TaggingDetails/components/SelectClass.vue';

export default defineComponent({
  components: {
    SelectClass,
  },
  setup() {
    const store = useStore(); // 使用vuex
    // 获取全局参数
    const instance = getCurrentInstance();
    const thisMapId: any = ref(store.state.coplotting.mapId); // 当前的地图id
    const { $http }: any = instance?.appContext.config.globalProperties;
    const selectHg = ref(100);
    const visFlag = ref(false);
    const options = ref([]);
    const classData = ref([]);
    const value = ref('');
    const classStateEcho = ref('');
    const classStateValue = ref('');
    const selectState: any = ref<HTMLElement | null>(null);
    const handleData = ref([]);
    // 获取分组信息
    function getGroupingOptions(mapId: number) {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistmapgroup/list/notChildren',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId,
        },
      };
      $http(request).then((res: any) => {
        if (res.code === 0) {
          options.value = res.data;
          console.log(res);
        }
      });
    }
    // 获取分类信息
    function getClassData(type = 0) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistclassfile/listByType',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          basicClassType: type, // 0123 绘图类型（0：点，1：面，2：线，3：其他）
          mapId: thisMapId.value,
        },
      };
      $http(request).then((res: any) => {
        if (res.code === 0) {
          const data: any = res.data ? res.data.data : [];
          data.map((e: any) => {
            if (e.basicClassList && Array.isArray(e.basicClassList)) {
              e.basicClassList.map((x: any) => {
                const flag =
                  x.statusList &&
                  Array.isArray(x.statusList) &&
                  x.statusList.length !== 0;
                const statusList = flag ? x.statusList[0] : {};
                if (statusList.stylePropertyEntity) {
                  x.style = statusList;
                  const obj = {
                    strokeWidth: statusList.stylePropertyEntity.lineHeight,
                    strokeOpacity:
                      statusList.stylePropertyEntity.fillOpacity / 100,
                    fillOpacity:
                      statusList.stylePropertyEntity.fillOpacity / 100,
                    strokeDashstyle:
                      statusList.stylePropertyEntity.lineType === 0
                        ? 'dash'
                        : 'solid',
                    strokeColor: statusList.stylePropertyEntity.strokeColor,
                  };
                  Object.assign(statusList.stylePropertyEntity, obj);
                  if (x.basicClassType === 2) {
                    statusList.stylePropertyEntity.strokeColor =
                      statusList.stylePropertyEntity.fillColor;
                  }
                }
                if (x.defaultStatus) {
                  x.src =
                    (window as any).config.baseURL + x.defaultStatus.iconUrl;
                }
              });
            }
          });
          console.log(data);
          classData.value = data;
        }
      });
    }
    // 获取状态信息
    function getStateData(id: number, flag: boolean) {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: `/assist/assistbasicclass/info/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: '',
      };
      $http(request).then((res: any) => {
        if (res.code === 0) {
          if (res.data && res.data.assistBasicClass) {
            const statusData = res.data.assistBasicClass.statusList;
            statusData.map((ele: any) => {
              ele.src = (window as any).config.baseURL + ele.iconUrl;
            });
            selectState.value.stateSelectData = statusData;
          }
        }
      });
    }
    // 选择了分类
    function selecrData(params: any) {
      classStateValue.value = params.id;
      getStateData(params.id, true);
    }
    function save() {
      //   console.log(handleData.value);
      //   console.log(value.value);
      //   console.log(selectState.value.stateData.id);
      //   console.log(classStateValue.value);
      handleData.value.forEach((e: any) => {
        thisMapId.value = store.state.coplotting.mapId;
        const lonlat = e.transFromLonLat.split(',');
        const obj: any = {
          markRecord: {
            mapId: thisMapId.value, // 当前地图id
            groupId: value.value, // 分组id grouping
            basicClassId: classStateValue.value, // 基础分类id
            markType: 0, // 标注类型（0：点，2：线，1：面，3：其他) ，必填字段
            markName: e.name, // markName
            address: e.address || '无', //
            longitude: lonlat[0], // 若是点线面则填第一个点
            laitude: lonlat[1],
            classtStatus: selectState.value.stateData.id, // 状态id
            statusName: selectState.value.stateData.statusType, // 状态名称
            styleConfigIconId: 1,
            statusIconUrl: selectState.value.stateData.iconUrl, // 状态图标
            statusStyle: null, // 状态样式（json,线/面标绘时保存）
            isShowOnAddress: 1, // 是否显示在地图上（0：否，1：是）
            isShowMarkName: 1, // 是否显示标绘名称（0：否，1：是）
            propertyType: 1, // 属性类别 1表单 2表格
            coordinatesJsonObject: {},
          },
          tablePropertys: [],
          files: [],
          needSetValue: 0,
        };
        const request = {
          method: 'post',
          service: 'coplotting',
          url: '/assist/assistmarkrecord/save',
          headers: {
            'Content-Type': 'application/json',
          },
          data: obj,
        };
        $http(request).then((res: any) => {
          if (res.code === 0 && res.data) {
            // ElMessage.success('转换成功');
            visFlag.value = false;
          }
        });
      });
    }

    function init(): void {
      getClassData();
      getGroupingOptions(thisMapId.value);
    }
    return {
      selectState,
      selectHg,
      visFlag,
      options,
      classData,
      value,
      classStateEcho,
      selecrData,
      save,
      handleData,
      init,
    };
  },
});
</script>

<style lang="scss" module>
.AddTagging {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  z-index: 10001;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  & > aside {
    width: 540px;
    height: 374px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
    border-radius: 7px;
    overflow: hidden;
    & > header {
      height: 56px;
      background: #f1f4f6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px 0 28px;
      box-sizing: border-box;
      span {
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        &:last-child {
          width: 15px;
          height: 15px;
          cursor: pointer;
          background: url(./assets/close.svg) no-repeat;
          background-size: 100% 100%;
          display: block;
        }
      }
    }
    & > main {
      height: calc(100% - 133px);
      padding: 28px;
      box-sizing: border-box;
      & > ul {
        list-style: none;
        margin: 0;
        padding: 0;
        & > li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          &:last-child {
            margin: 0;
          }
          & > span {
            font-size: 17px;
            font-weight: 400;
            color: #555555;
          }
          & > div {
            width: 422px;
            height: 42px;
          }
        }
      }
    }
    & > footer {
      height: 77px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 14px;
      box-sizing: border-box;
      border-top: 1px solid #f2f2f2;
      button {
        width: 73px;
        height: 42px;
      }
    }
  }
}
</style>
