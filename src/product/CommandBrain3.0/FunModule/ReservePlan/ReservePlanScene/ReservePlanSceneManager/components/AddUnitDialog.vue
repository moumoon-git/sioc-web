<template>
  <DialogBoat
    ref="DialogUnitBoat"
    title="选择成员单位"
  >
    <div style="width: 700px; height: 87vh;position:relative;">
      <!-- 左边 -->
      <div :class="$style.left">
        <div
          v-for="itemone in [{name: '通讯录', id: 0}, {name: '专项指挥部', id: 1}]"
          :key="itemone.id"
          style="margin: 10px;"
        >
          <Collapse :item="itemone">
            <template #head>
              <div style="margin: 9px;">
                {{ itemone.name }}
              </div>
            </template>

            <template #main>
              <main v-if="itemone.id < 1">
                <!-- 通讯录树 -->
                <TreeComponent
                  :data="treeData"
                  :show-check-box="true"
                  @node-click="handleLeftListClick"
                  @node-check="handleNodeCheck"
                  @node-uncheck="handleNodeUncheck"
                />
              </main>
              <main v-else>
                <!-- 专项指挥部 -->
                <TreeComponent
                  :data="treeSpecial"
                  :show-check-box="true"
                  @node-click="handleSpecialListClick"
                  @node-check="handleNodeCheck"
                  @node-uncheck="handleNodeUncheck"
                />
              </main>
            </template>
          </Collapse>
        </div>
      </div>
      <!-- 右边 -->
      <div :class="$style.right">
        <main :class="$style.rightScroll">
          <ListTemple
            :title="'已选择'"
            :list="unitList"
            :useHeaderIcon="false"
            :countAll="unitList.length"
          />
        </main>
        <div
          :class="$style.clearRight"
          @click="unitList=[]"
        >
          全部清除
        </div>
      </div>
      <!-- 按钮 -->
      <Button
        type="primary"
        style="right: 15px;position: absolute;bottom: 7px;"
        @click="commit"
      >
        确定
      </Button>
    </div>
  </DialogBoat>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex';
// 应急响应函数
import {
  getGroupResponseAndContactor,
} from '@/product/CommandBrain3.0/FunModule/ReservePlan/ReservePlanAdmin/ReservePlan';
import Search from '@/product/CommandBrain3.0/Generalparts/right/Search/Search.vue'; // 搜索框组件
import DialogBoat from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue'; // 弹出框
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue'; // 按钮
import TreeComponent from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/GroupTree/GroupTree.vue';
import Collapse from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/Collapse.vue'; // 折叠组件
import ListTemple from '@/product/CommandBrain3.0/FunModule/ReservePlan/PublicComponents/ListTemple.vue'; // 列表模板

interface CurrTreeType {
  name: string,
  id: number,
}

export default defineComponent({
  name: 'ReservePlanScene',
  components: {
    // 搜索框组件
    Search,
    // 弹出框
    DialogBoat,
    // 按钮
    Button,
    // 左边-树
    TreeComponent,
    // 折叠组件
    Collapse,
    // 列表模板
    ListTemple,
  },
  emits: ['commit'],
  setup(props, context) {
    const store = useStore(); // 使用vuex
    const treeData = ref<any[]>([]); // 左边树
    const unitList = ref<any[]>([]); // 成员单位
    const { $http }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const DialogUnitBoat = ref<typeof DialogBoat | null>(null);
    const keyword = ref('');
    const treeSpecial = ref<any[]>(
      [
        { name: '领导小组', id: 0, children: [] },
        { name: '成员单位', id: 1, children: [] },
      ],
    ); // 专项树
    const currTree = ref<null | CurrTreeType>(null); // 当前左树节点
    // 开窗
    function openPopup() {
      if (DialogUnitBoat.value) {
        unitList.value = [];
        keyword.value = '';
        currTree.value = null;
        DialogUnitBoat.value.open();
      } else {
        setTimeout(() => openPopup(), 500);
      }
    }
    // 左数据初始化
    function getLeftList() {
      // 通讯录
      const request = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailgroup/list?platformId=',
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          treeData.value = response?.data || [];
        }
      });
      // 领导小组
      getGroupResponseAndContactor(
        Number(store.state?.reservePlan?.currentReservePlan?.versionId),
        1,
        1,
      ).then((response: any) => {
        treeSpecial.value[0].children = response?.data || [];
      });
      // 成员单位
      getGroupResponseAndContactor(
        Number(store.state?.reservePlan?.currentReservePlan?.versionId),
        1,
        2,
      ).then((response: any) => {
        treeSpecial.value[1].children = response?.data || [];
      });
      console.log(treeSpecial.value);
    }
    // 右数据靠左得
    function handleLeftListClick(data: any) {
      currTree.value = data;
    }
    // 专项右数据靠左得
    function handleSpecialListClick(data: any) {
      currTree.value = data;
    }
    // 勾选组
    function handleNodeCheck(node:any) {
      node.forEach((el:any) => {
        if (el.name !== '领导小组' && el.name !== '成员单位') {
          unitList.value.push(el);
        }
      });
      console.log('当前组', unitList.value);
      unitList.value = Array.from(new Set(unitList.value));
      console.log('当前组', unitList.value);
    }
    // 取消勾选组
    function handleNodeUncheck(node:any) {
      node.forEach((el:any) => {
        unitList.value = unitList.value.filter((item:any) => (item.id !== el.id));
      });
      unitList.value = Array.from(new Set(unitList.value));
    }
    // 点击确定
    function commit() {
      if (DialogUnitBoat.value) {
        DialogUnitBoat.value.close();
      }
      context.emit('commit', unitList.value);
    }
    onMounted(() => {
      getLeftList(); // 左数据初始化
    });
    return {
      treeData,
      unitList,
      DialogUnitBoat,
      openPopup,
      commit,
      getLeftList,
      handleLeftListClick,
      handleNodeCheck,
      handleNodeUncheck,
      keyword,
      treeSpecial,
      currTree,
      handleSpecialListClick,
    };
  },
});
</script>

<style lang="scss" module>
  .left {
    width: 351px;
    height: 81vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    position: absolute;
    left: 0px;
    top: 0px;
    overflow: auto;
    // 滚动条
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #56E9FF;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  .right {
    width: 346px;
    height: 81vh;
    background: rgba(0, 0, 0, 0.29);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    position: absolute;
    right: 0px;
    top: 0px;
    .rightScroll {
      height: 77vh;
      overflow: auto;
      // 滚动条
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #56E9FF;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-corner {
        background: transparent;
      }
    }
    .clearRight {
      position: absolute;
      left: 15px;
      bottom: 11px;
      font-size: 16px;
      color: #56E9FF;
      cursor: pointer;
    }
  }
</style>
