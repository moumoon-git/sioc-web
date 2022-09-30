<template>
  <div class="module-button">
    <ul>
      <li
        v-for="(item, index) in buttonArr"
        :key="index"
        :ref="'module-li' + index"
        :class="item.activeState ? 'active-li' : ''"
        @click="clickModuleBtn(item, index)"
      >
        <div :class="'icon-' + item.icon" />
        <div class="icon-Active" :class="'icon-' + item.icon + 'Active'" />
        {{ item.name }}
      </li>
      <childrenBtn
        ref="childrenBtns"
        :children-data="childrenBtnObj"
        @selectModule="selectModule"
      />
    </ul>
  </div>
</template>

<script lang="ts" >
import { defineComponent } from 'vue';
// 子按钮
import childrenBtn from './childrenBtn.vue';
import { useStore } from 'vuex';
import useFun from '@/product/CommandBrain3.0/FunModule/FlightPatrol/header/scripts/useEsc';
export default defineComponent({
  name: 'ModuleButton',
  components: {
    childrenBtn,
  },
  props: {
    // 按钮数据
    buttonArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 子按钮数据
      childrenBtnObj: {
        top: 0,
        left: 0,
        children: [],
      },
    };
  },
  computed: {
    closeModle() {
      return (this as any).$store.state.closeModle.closeModle;
    },
    isShowTip() {
      return (this as any).$store.state.flightPatrol.isShowFlightTip;
    },
  },
  watch: {
    closeModle(newV) {
      console.log(newV);
      if ((this as any).buttonArr) {
        let index: number = 0;
        (this as any).buttonArr.filter((x: any, i: number) =>
          x.children.filter((e: any) => {
            if (e.name === newV.name) {
              e.activeState = false;
              index = i;
            }
          }),
        );
        (this as any).childrenBtnData((this as any).buttonArr[index], index);
        (this as any).$emit('update:buttonArr', (this as any).buttonArr);
      }
    },
    isShowTip:{
      handler(data:any){
        this.closeActive()
      },
      immediate:true   
    }
  },
  methods: {
    // 取消所有选中效果
    closeActive(flag = false) {
      (this as any).buttonArr.forEach((ele: any) => {
        // eslint-disable-next-line no-param-reassign
        ele.activeState = false;
      });
      if (flag) {
        (this as any).$refs.childrenBtns.children = [];
      }
    },
    childrenBtnData(item: any, index: number) {
      (this as any).$store.commit('flightPatrol/SET_isShowFlightTip', false);
      (this as any).$store.commit('flightPatrol/SET_isShowFlightWin', false);
      console.log(item, 'item');
      this.closeActive();
      const moduleData: any = item;
      moduleData.activeState = true;
      const liEle = this.$refs[`module-li${index}`];
      const ulEle = (liEle as HTMLElement).parentElement;
      // 顶部距离
      const top = (liEle as HTMLElement).offsetTop;
      // 右边距离 10 是设计稿距离
      const left = (liEle as HTMLElement).offsetWidth + 10;
      (this as any).childrenBtnObj = {
        top,
        left,
        children: moduleData.children,
        ulEle,
        parentNode: moduleData.icon,
      };
      // 没有子节点的直接返回单前父节点
      if (
        (Array.isArray(moduleData.children) &&
          moduleData.children.length === 0) ||
        !moduleData.children
      ) {
        (this as any).$emit('tabModules', moduleData);
      }
    },
    // 点击模块按钮
    clickModuleBtn(item: any, index: number) {
      console.log(item, 'item');
      (this as any).closeActive();
      (this as any).childrenBtnData(item, index);
    },
    // 子按钮返回返回的数据
    selectModule(data: any) {
      if (data.type === 'putAway') {
        this.closeActive();
      } else {
        (this as any).$emit('tabModules', data);
      }
    },
    // 飞巡暂时切换按钮
    tabModule(item: any, ind: number) {
      let str = item.name;
      if (ind === 0) {
        str = '新增巡查';
      }
      (this as any).$emit('tabModules', str);
    },
  },
});
</script>

<style lang="scss">
.module-button {
  display: flex;
  // position: absolute;
  // margin-top: 56px;
  // z-index: 999;
  & > ul {
    padding: 0;
    position: relative;
  }
  & > ul > li {
    width: 65px;
    height: 65px;
    background: rgba(14, 23, 24, 0.8);
    backdrop-filter: blur(2px);
    border: 1px solid #00c1de;
    color: #fff;
    margin: 10px 0;
    cursor: pointer;
    list-style: none;
    display: flex;
    font-size: 14px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  & > ul > li:hover,
  .active-li {
    background: url('./assets/btnBrgActive.png') no-repeat;
    background-size: 100% 100%;
    border: 1px solid #56e9ff;
    color: #00ecff;
  }
  & > ul > li:hover > div,
  .active-li > div {
    display: none;
  }
  & > ul > li:hover .icon-Active,
  .active-li .icon-Active {
    display: block;
  }
  & > ul > li:first-child {
    margin: 0;
  }
  & > ul > li > div {
    width: 25px;
    height: 25px;
    margin-bottom: 5px;
  }
}
.icon-Active {
  display: none;
}
@each $animal in quick, communication, task, filghtPatrol, workingGroup,
  cuttingEdgeNews, reservePlan, support, dynamic, summary, report, mapFeature,
  route, video, people, meeting, searchScope, plotting, resource, knowledgeBase
{
  .icon-#{$animal} {
    background: url('./assets/#{$animal}.svg') no-repeat;
    background-size: 100% 100%;
  }
  .icon-#{$animal}Active {
    background: url('./assets/#{$animal}_Active.svg') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
