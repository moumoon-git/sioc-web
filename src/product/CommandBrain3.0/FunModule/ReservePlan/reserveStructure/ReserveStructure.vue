<template>
  <div style="width: 1204px; height: 85vh;position:relative;">
    <p
      style="color: rgb(255, 255, 255);
      position: absolute;
      border: 1px solid #FFFFFF;
      padding: 5px;
      right: 90px;
      cursor: pointer;
      z-index: 100;"
      :style="title==='专项指挥部架构树'?'background:#00C1DE':''"
      @click="open('special')"
    >
      专项指挥部
    </p>
    <p
      style="color: rgb(255, 255, 255);
      position: absolute;
      border: 1px solid #FFFFFF;
      padding: 5px;
      right: 10px;
      cursor: pointer;
      z-index: 100;"
      :style="title==='现场指挥部架构树'?'background:#00C1DE':''"
      @click="open('scene')"
    >
      现场指挥部
    </p>
    <TreeDialog
      :is-unit="isUnit"
      :item="$store.state.reservePlan.currNode?$store.state.reservePlan.currNode:null"
    />
    <StructureChart
      ref="StructTree"
      :tree-data="treeData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 应急响应函数
import {
  getGroupResponseAndContactor,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';
import StructureChart from './structureChart.vue'; // 组织架构
import TreeDialog from './TreeDialog.vue'; // 架构内弹窗

export default defineComponent({
  name: 'ReserveStructure',
  components: {
    // 组织架构
    StructureChart,
    // 架构内弹窗
    TreeDialog,
  },
  data() {
    return {
      title: '专项指挥部架构树',
      isUnit: false,
      treeData: [{
        name: '',
        leftChildren: [],
        children: [],
        tempOuter: [{}],
      }], // 当前架构树数据
    };
  },
  mounted() {
    this.open('special');
  },
  methods: {
    open(item:any): void {
      (this as any).$store.commit('reservePlan/setCurrNode', null);
      this.treeData = [{
        name: '',
        leftChildren: [],
        children: [],
        tempOuter: [{}],
      }]; // 清空
      if (item === 'special') {
        this.isUnit = false;
        this.title = '专项指挥部架构树';
        // 领导
        getGroupResponseAndContactor(
          Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
          1,
          1,
        ).then((response: any) => {
          if (response.data && response.data.length > 0) {
            // 右树
            const temp = JSON.parse(JSON.stringify(response.data));
            temp.forEach((ele:any) => {
              this.treeData[0].tempOuter.push(
                {
                  name: ele.name,
                  remark: ele.remark,
                },
              );
              if (ele.children) {
                ele.children.forEach((el:any) => {
                  if (el.mailResponseList !== null) {
                    el.mailResponseList.forEach((eleM:any) => {
                      eleM.label = '应急负责人'; // 负责人
                      eleM.labelName = ele.name; // 总指挥
                      eleM.innerPosition = el.name; // 分管事件
                      (this as any).treeData[0].leftChildren.push(eleM);
                    });
                  }
                  if (el.mailContactorList !== null) {
                    el.mailContactorList.forEach((eleM:any) => {
                      eleM.label = '应急联络人'; // 联络人
                      eleM.labelName = ele.name; // 总指挥
                      eleM.innerPosition = el.name; // 分管事件
                      (this as any).treeData[0].leftChildren.push(eleM);
                    });
                  }
                });
              }
            });
            this.treeData[0].name = '专项指挥部';
            this.treeData[0].tempOuter.splice(0, 1);
            for (let i = 0; i < this.treeData[0].tempOuter.length; i++) {
              for (let j = i + 1; j < this.treeData[0].tempOuter.length; j++) {
                if ((this as any).treeData[0].tempOuter[i].name === (this as any).treeData[0].tempOuter[j].name) {
                  this.treeData[0].tempOuter.splice(j, 1);
                  j--;
                }
              }
            }
          }
        });
        // 单位
        getGroupResponseAndContactor(
          Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
          1,
          2,
        ).then((response: any) => {
          // 直树
          const temp = JSON.parse(JSON.stringify(response.data));
          temp.forEach((ele:any) => {
            const arr:any = [];
            if (ele.mailResponseList) {
              ele.mailResponseList.forEach((el:any) => {
                el.label = '应急负责人';
                arr.push(el);
              });
            }
            if (ele.mailContactorList) {
              ele.mailContactorList.forEach((el:any) => {
                el.label = '应急联络人';
                arr.push(el);
              });
            }
            ele.children = arr;
            (this as any).treeData[0].children.push(ele);
          });
          setTimeout(() => {
            (this as any).$refs.StructTree.init();
          }, 2000);
        });
      } else if (item === 'scene') {
        this.isUnit = true;
        this.title = '现场指挥部架构树';
        // 领导
        getGroupResponseAndContactor(
          Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
          2,
          1,
        ).then((response: any) => {
          if (response.data && response.data.length > 0) {
            // 右树
            const temp = JSON.parse(JSON.stringify(response.data));
            temp.forEach((ele:any) => {
              this.treeData[0].tempOuter.push(
                {
                  name: ele.name,
                  remark: ele.remark,
                },
              );
              if (ele.children) {
                ele.children.forEach((el:any) => {
                  if (el.mailResponseList !== null) {
                    el.mailResponseList.forEach((eleM:any) => {
                      eleM.label = '应急负责人'; // 负责人
                      eleM.labelName = ele.name; // 总指挥
                      eleM.innerPosition = el.name; // 分管事件
                      (this as any).treeData[0].leftChildren.push(eleM);
                    });
                  }
                  if (el.mailContactorList !== null) {
                    el.mailContactorList.forEach((eleM:any) => {
                      eleM.label = '应急联络人'; // 联络人
                      eleM.labelName = ele.name; // 总指挥
                      eleM.innerPosition = el.name; // 分管事件
                      (this as any).treeData[0].leftChildren.push(eleM);
                    });
                  }
                });
              }
            });
            this.treeData[0].name = '现场指挥部';
            this.treeData[0].tempOuter.splice(0, 1);
            for (let i = 0; i < this.treeData[0].tempOuter.length; i++) {
              for (let j = i + 1; j < this.treeData[0].tempOuter.length; j++) {
                if ((this as any).treeData[0].tempOuter[i].name === (this as any).treeData[0].tempOuter[j].name) {
                  this.treeData[0].tempOuter.splice(j, 1);
                  j--;
                }
              }
            }
          }
        });
        // 单位
        getGroupResponseAndContactor(
          Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
          2,
          2,
        ).then((response: any) => {
          // 直树
          const temp = JSON.parse(JSON.stringify(response.data));
          temp.forEach((ele:any) => {
            if (ele.children) {
              ele.children.forEach((el:any) => {
                const arr:any = [];
                if (el.mailResponseList !== null) {
                  el.mailResponseList.forEach((eleM:any) => {
                    eleM.label = '应急负责人'; // 负责人
                    arr.push(eleM);
                  });
                }
                if (el.mailContactorList !== null) {
                  el.mailContactorList.forEach((eleM:any) => {
                    eleM.label = '应急联络人'; // 联络人
                    arr.push(eleM);
                  });
                }
                el.children = arr;
              });
            }
            (this as any).treeData[0].children.push(ele);
          });
          setTimeout(() => {
            (this as any).$refs.StructTree.init();
          }, 2000);
        });
      } else this.title = '组织架构';
    },
  },
});
</script>
