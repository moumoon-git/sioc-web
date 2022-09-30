<template>
  <div :class="$style.structureChart">
    <div :id="uid" :class="$style.tree" />
  </div>
</template>

<script lang="ts">
import { watch } from 'vue';
import { useStore } from 'vuex';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// 放大true 缩小false num放大或者缩小的级别 0.1-2
// enlarge(boolean,num)
// 展开true 收起false
// openAway(boolean)
const datas = require('./data.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const createTree = require('./tree.js').default;

export default {
  props: {
    // 数据格式参考data.json leftChildren 是横显示的数据
    treeData: {
      type: Object,
      default: datas,
      requried: true,
    },
  },
  data() {
    return {
      tree: {},
      uid: `tree${Math.round(Math.random() * 1000)}`,
    };
  },
  mounted() {
    // (this as any).init();
  },
  setup() {
    const $store = useStore();
    watch(
      () => $store.state.reservePlan.currNode,
      (val) => {
        console.log(val);
      },
    );
  },
  methods: {
    // 使用数据格式请参考data.json 防止样式出现污染采用module方式
    //  初始化
    init() {
      // eslint-disable-next-line new-cap
      const tree = new createTree((this as any).uid, (this as any).$style);
      (this as any).tree = tree;
      console.log((this as any).treeData, '组织架构树的数据');
      tree.init((this as any).treeData);
    },
    // 放大true 缩小false num放大或者缩小的级别 0.1-2
    enlarge(flag: boolean, num: number) {
      (this as any).tree.enlarge(flag, num);
    },
    // 展开true 收起false
    openAway(flag: boolean) {
      (this as any).tree.openAway(flag);
    },
  },
};
</script>

<style module lang="scss">
.structureChart {
  width: 100%;
  height: 100%;
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
}

.tree {
  width: 100%;
  height: 100%;
  position: relative;
}

// el下的第一个根节点
.reserveStructure_wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  cursor: url('./assets/Pan.png'), auto;
}

.reserveStructure_tree-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: all 0.5s;
  user-select: none;
}

.reserveStructure_wrap-div {
  display: flex;
  margin: 46px 0 0;
  position: relative;
  min-width: 20px;
}

.reserveStructure_init-tree {
  text-align: center;
  width: 44px;
  line-height: 44px;
  writing-mode: vertical-lr;
  padding: 8px 0;
  margin: 0 10px;
}

.reserveStructure_o-st {
  white-space: nowrap;
  position: relative;
  background: #54a0ff;
  border-radius: 8px;
  padding: 10px 34px;
  box-sizing: border-box;
  background: url('./assets/bgr.svg') no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  min-width: 100px;
  font-size: 16px;
}

.reserveStructure_o-st::before {
  margin-right: 12px;
  content: '';
  display: block;
  width: 17px;
  height: 17px;
  background: url('./assets/flag.svg') no-repeat;
  background-size: 100% 100%;
}

.reserveStructure_t-st {
  height: 180px;
  background: #0091FF;
  border-radius: 22px;
}

.reserveStructure_havechild {
  height: 180px;
  background: #3D56DA;
  border-radius: 22px;
}

.reserveStructure_tr-st {
  background: #287999;
  border-radius: 22px;
}

.reserveStructure_f-st {
  background: transparent;
  border-radius: 22px;
  border: 1px solid #85EFFF;
}

.reserveStructure_fi-st {
  border-radius: 22px;
  border: 1px solid #85efff;
  background: rgba(20, 29, 31, 1);
}

.reserveStructure_arrow {
  position: absolute;
  top: -46px;
  left: -8px;
  right: 0;
  margin: 0 auto;
  height: 45px;
  width: 8px;
  border: 1px solid #98a3b2;
  border-radius: 0 9px 0 0;
  border-left: none;
  border-bottom: none;
}

.reserveStructure_arrow::after {
  content: '';
  width: 9px;
  height: 9px;
  position: absolute;
  bottom: -1px;
  right: 0px;
  left: 0;
  margin: auto;
  margin-right: -5px;
  background: url('./assets/arrow.svg') no-repeat;
  background-size: 100% 100%;
}

.reserveStructure_left-arrow {
  border: 1px solid #98a3b2;
  border-radius: 9px 0 0 0;
  border-right: none;
  border-bottom: none;
  left: 8px;
}

.reserveStructure_left-arrow::after {
  margin-right: 4px;
}

// 直线
.reserveStructure_straight-line {
  height: 50px;
  width: 1px;
  background: #98a3b2;
}

// 横线
.reserveStructure_horizontal-line {
  border-top: 1px solid #98a3b2;
  position: absolute;
  top: -46px;
  width: calc(50% - 8px);
}

.reserveStructure_horizontal-direction-left {
  left: 0;
}

.reserveStructure_horizontal-direction-right {
  right: 0;
}

// 收起按钮
.reserveStructure_tree-btn {
  width: 20px;
  height: 20px;
  position: absolute;
  top: -55px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 9;
  cursor: pointer;
}

.reserveStructure_collect {
  background: url('./assets/collect.svg') no-repeat;
  background-size: 100% 100%;
}

.reserveStructure_discharge {
  background: url('./assets/discharge.svg') no-repeat;
  background-size: 100% 100%;
}

// 移动视口盒子
.moveViewBox {
  position: absolute;
  bottom: 37px;
  right: 23px;
  width: 146px;
  height: 146px;
  background: #ffffff;
  border: 1px solid #56e9ff;
  box-sizing: border-box;
  padding: 3px;
  z-index: 99;

  & > div {
    width: 100%;
    height: 100%;
    position: relative;
    background: rgba(20, 29, 31, 1);
    overflow: hidden;

    .move-box {
      position: absolute;
      width: 121px;
      height: 85px;
      background: transparent;
      border: 2px solid #ff6666;
      box-sizing: border-box;
      cursor: move;
    }

    .move-el {
      zoom: 0.11;
    }
  }
}

/* // 横元素 */
.transverse_tree {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 99;
  display: flex;
  align-items: center;
}

/* 盒子 */
.transverse_tree_wrap {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 40px;
  margin-right: 0;
  user-select: none;
}

.childBox {
  margin-left: 50px;
}

/* 内容 */
.transverse_tree_content {
  margin: 8px 0;
  height: 44px;
  background: transparent;
  border: 1px solid #85EFFF;
  border-radius: 22px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  min-width: 110px;
  text-align: center;
  white-space: nowrap;
}

.transverse_tree_first_content {
  position: relative;
  display: flex;
  align-items: center;
}

.transverse_tree_three_content {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 22px;
  border: 1px solid #85efff;
  text-align: center;
  height: 44px;
  line-height: 44px;
  padding: 0 15px;
  margin: 8px 0;
  box-sizing: border-box;
  white-space: nowrap;
  background: rgba(20, 29, 31, 1);
}

/* 竖线 */
.transverse_tree_verticalLine {
  left: -50px;
  bottom: 0;
  position: absolute;
  height: calc(50% - 8px);
  border-left: 1px solid #98a3b2;
}

.transverse_tree_verticalLine_top {
  top: 0;
}

/* 箭头 */
.transverse_tree_arrow {
  position: absolute;
  top: 8px;
  bottom: 0px;
  left: -50px;
  margin: auto;
  height: 8px;
  width: 45px;
  border: 1px solid #98a3b2;
  border-radius: 9px 0 0 0;
  border-right: none;
  border-bottom: none;
}

.transverse_tree_arrow_flip {
  transform: rotateX(180deg);
  top: -8px;
}

.transverse_tree_arrow::after {
  content: '';
  width: 9px;
  height: 9px;
  position: absolute;
  bottom: 0px;
  top: -9px;
  right: 0px;
  left: 0;
  margin: auto;
  margin-right: -5px;
  background: url(http://localhost:8081/img/arrow.4fd8dae3.svg) no-repeat;
  background-size: 100% 100%;
  transform: rotate(-90deg);
}

/* 分支线 */
.transverse_tree_branch {
  height: 1px;
  width: 50px;
  background: #98a3b2;
  position: absolute;
  top: 0;
  bottom: 0;
  right: -50px;
  margin: auto;
}

/* 按钮 */
.transverse_tree_btn {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: -50px;
  /* top: -55px; */
  margin: auto;
  z-index: 9;
  cursor: pointer;
}

.transverse_tree_btn_collect {
  background: url('./assets/collect.svg') no-repeat;
  background-size: 100% 100%;
}

.transverse_tree_btn_discharge {
  background: url('./assets/discharge.svg') no-repeat;
  background-size: 100% 100%;
}

.reserveStructure_horizon_detail {
  float: right;
  z-index: 18;
}

.reserveStructure_vertical_detail {
  float: right;
  z-index: 18;
  transform: rotate(90deg);
  margin-left: 11px;
}

.ellipseChief {
  padding: 3px 9px;
  background: #F66E6E;
  border-radius: 3px;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  margin-right: 6px;
}

.ellipseSecond {
  padding: 3px 9px;
  background: #0091FF;
  border-radius: 3px;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  margin-right: 6px;
}

.ellipseRespond {
  padding: 9px 3px;
  background: #F66E6E;
  border-radius: 3px;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  margin-bottom: 6px;
  writing-mode: vertical-lr;
}

.ellipseContact {
  padding: 9px 3px;
  background: #0091FF;
  border-radius: 3px;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  margin-bottom: 6px;
  writing-mode: vertical-lr;
}

.leadUnit {
  padding: 9px 3px;
  background: #F66E6E;
  border-radius: 3px;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  margin-bottom: 6px;
  writing-mode: vertical-lr;
}
</style>
