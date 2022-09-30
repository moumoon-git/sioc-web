<template>
  <div :class="$style.Result">
    <!-- 头部 -->
    <header>
      <!-- 选择 -->
      <div>
        <el-radio v-model="radio" label="1"> 全选 </el-radio>
        <el-radio v-model="radio" label="2"> 反选 </el-radio>
      </div>
      <!-- 标注 -->
      <div @click="tagging">转换为标注</div>
      <!-- 关闭按钮 -->
      <button @click.stop.self="$emit('close-panel')">×</button>
    </header>
    <!-- 渲染列表 -->
    <main>
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="(item, index) in contentData"
          :key="index"
          :label="index"
        >
          <img v-if="item.active" src="./assets/blue.svg" alt="" />
          <img v-else src="./assets/place.svg" alt="" />
          <div>
            <p>{{ item.name }}</p>
            <p v-if="item.address && (typeof item.address !== 'object')">
              {{ item.address }}
            </p>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </main>
    <div v-show="false">
      <MapPopup
        ref="MapPopups"
        popup-type="tagging"
        @sendMsg="getMapPopupsMsg"
      />
    </div>
  </div>
  <AddTagging ref="AddTaggings" />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  getCurrentInstance,
} from 'vue';
import MapPopup from '@/product/Coplotting/generalparts/MapPopup/MapPopup.vue';
import AddTagging from './AddTagging.vue';

export default defineComponent({
  components: {
    MapPopup,
    AddTagging,
  },
  props: {
    contentData: {
      type: Array,
      dafault: () => [],
    },
  },
  emits: [
    'close-panel',
  ],
  setup(props: any, context: any) {
    const { $http, $message }: any =
      getCurrentInstance()?.appContext.config.globalProperties;
    const MapPopups: any = ref(null);
    const radio = ref('');
    const AddTaggings: any = ref(null);
    const checkList: any = ref([]);
    const mapSearchCov = 'search';
    // 设置落点
    function setSopt() {
      // 清空图层并落点
      window.map.clearAtPresentMarkData(mapSearchCov).then((res: any) => {
        const src = require('./assets/redDot.svg');
        const data = JSON.parse(JSON.stringify(props.contentData));
        data.forEach((ele: any, ind: any) => {
          const arr = ele.transFromLonLat.split(',');
          ele.longitude = Number(arr[0]);
          ele.latitude = Number(arr[1]);
          ele.wd = 59;
          ele.hg = 56;
          ele.src = src;
          ele.ind = ind;
        });
        if (data.length > 0) {
          // 绑定点击事件
          const eventObj = {
            click(e: any, mark: any) {
              console.log(mark);
              const id: string =
                mark.icon.imageDiv.id + Math.floor(Math.random() * 100000000);
              mark.data.id = id;
              const city = mark.data.city ? mark.data.city : '';
              const area = mark.data.area ? mark.data.area : '';
              const address = mark.data.address ? mark.data.address : '';
              mark.data.addre = city + area + address;
              console.log(mark.data);
              MapPopups.value.setMapPopup(mark.data, '', mark.data);
            },
          };
          // 进行地图落点
          window.map.setMultiMarker(mapSearchCov, data, eventObj);
        }
      });
    }
    onMounted(() => {
      setTimeout(() => {
        setSopt();
      }, 200);
    });
    // 设置图标激活样式
    function setActiveIcon(newVal: any, oldVal: any) {
      console.log(newVal, oldVal);
      // 获取当前图层的所有数据
      window.map.getCoverageData(mapSearchCov).then((mapData: any) => {
        // 先取消所有的激活状态
        props.contentData.map((ele: any) => {
          ele.active = false;
        });
        oldVal.forEach((eles: number) => {
          mapData.forEach((ele: any) => {
            if (ele.data.ind === eles) {
              let styles: any = {};
              styles = {
                wd: 59,
                hg: 56,
                src: require('./assets/redDot.svg'),
              };
              window.map.setOneMarkerStyle(ele, styles);
            }
          });
        });
        newVal.forEach((eles: number) => {
          mapData.forEach((ele: any) => {
            if (ele.data.ind === eles) {
              let style: any = {};
              style = {
                wd: 59,
                hg: 56,
                src: require('./assets/blueDot.svg'),
              };
              window.map.setOneMarkerStyle(ele, style);
            }
          });
        });
        // 设置当个激活状态
        newVal.forEach((ele: any) => {
          props.contentData[ele].active = true;
        });
      });
    }
    watch(radio, (newValue) => {
      // 直接监听
      // 全选
      if (newValue === '1') {
        props.contentData.forEach((ele: any, ind: number) => {
          checkList.value.push(ind);
        });
        setActiveIcon(checkList.value, []);
      } else if (newValue === '2') {
        // 反选
        const antiElection: any = [];
        props.contentData.forEach((ele: any, ind: number) => {
          if (checkList.value.indexOf(ind) === -1) {
            antiElection.push(ind);
          }
        });
        checkList.value = antiElection;
      }
    });
    watch(checkList, (newVal, oldVal) => {
      console.log(newVal, oldVal);
      let diffArr: any = [];
      // 有新增的数据时
      if (newVal.length > oldVal.length) {
        // 点击时移动到中心
        diffArr = newVal.filter((y: any) => oldVal.indexOf(y) === -1);
      } else if (newVal.length < oldVal.length) {
        // 点击时移动到中心
        diffArr = oldVal.filter((y: any) => newVal.indexOf(y) === -1);
      }
      console.log(diffArr);
      if (diffArr.length !== 0) {
        diffArr.forEach((ele: number) => {
          const diffData = props.contentData[ele];
          const handle = diffData.transFromLonLat.split(',');
          const dataObj = {
            longitude: handle[0],
            latitude: handle[1],
          };
          window.map.setCentent(dataObj, 14);
        });
      }
      setActiveIcon(newVal, oldVal);
    });
    // 获取地图弹窗消息
    function getMapPopupsMsg(params: any) {
      context.emit('sendMsg', params);
    }
    // 转换为标注
    function tagging() {
      console.log(checkList.value);
      if (checkList.value.length === 0) {
        $message.error('请先选择点');
        return;
      }
      const allData: any = [];
      checkList.value.forEach((x: any) => {
        allData.push(props.contentData[x]);
      });
      if (AddTaggings.value) {
        AddTaggings.value.visFlag = true;
        AddTaggings.value.init();
        AddTaggings.value.handleData = allData;
      }
    }
    watch(
      () => props.contentData,
      (newV) => {
        setSopt();
      },
    );
    return {
      AddTaggings,
      MapPopups,
      radio,
      checkList,
      getMapPopupsMsg,
      tagging,
    };
  },
});
</script>

<style lang="scss" module>
.Result {
  width: 100%;
  background: #fff;
  border-radius: 4px 4px 0px 0px;
  max-height: 73vh;
  overflow: hidden;
  header {
    display: flex;
    height: 50px;
    padding: 0 14px;
    box-sizing: border-box;
    align-items: center;
    background: #f1f4f6;
    justify-content: space-between;
    div {
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0091ff;
      cursor: pointer;
      &:first-child {
        display: flex;
        & label {
          display: flex;
          align-items: center;
        }
        span {
          width: 20px;
          height: 20px;
          line-height: 1;
        }
      }
    }
    span {
      font-size: 17px;
      font-weight: 400;
      color: #666666 !important;
    }
    // 关闭按钮
    & > button:last-child {
      border: none;
      outline: none;
      background: none;
      padding: 0;
      margin: 0;
      font-size: 20px;
      cursor: pointer;
      &:hover { color: #0091FF; }
    }
  }
  main {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(73vh - 50px);
    & > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      & > label {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e6e6e6;
        margin: 0 14px;
        padding: 8px 0;
        & > span {
          &:first-child {
            & > span {
              width: 20px;
              height: 20px;
              &::after {
                height: 13px;
                left: 5px;
                position: absolute;
                top: 0px;
                width: 7px;
              }
            }
          }
          &:nth-child(2) {
            padding-left: 8px;
            display: flex;
            align-items: center;
            & > img {
              width: 24px;
              height: 28px;
            }
            & > div {
              margin-left: 6px;
            }
            & p {
              margin: 0;
              &:first-child {
                font-size: 17px;
                font-weight: 400;
                color: #333333;
              }
              &:last-child {
                font-size: 17px;
                font-weight: 400;
                color: #999999;
              }
            }
          }
        }
      }
    }
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
}
</style>
