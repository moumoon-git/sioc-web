<template>
  <div :class="$style.MailList">
    <Title title="通讯录" />
    <!-- 搜索 -->
    <aside>
      <span></span>
      <input type="text" placeholder="请输入关键字检索" />
    </aside>
    <!-- 树形数据加载 -->
    <main>
      <el-tree
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import Title from './Title.vue';

export default defineComponent({
  components: {
    Title,
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    };
  },
  methods: {
    handleNodeClick(data: any) {
      // console.log(data);
      (this as any).$emit('handleNodeClick', data);
    },
  },
  setup() {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const treeData = ref([]);

    function getTreeData() {
      const request = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailgroup/list',
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          treeData.value = response.data || [];
        } else {
        }
      });
    }
    getTreeData();
    return {
      treeData,
      getTreeData,
    };
  },
});
</script>

<style lang="scss" module>
.MailList {
  & > aside {
    margin: 10px auto;
    width: 346px;
    height: 38px;
    background: #292f30;
    display: flex;
    align-items: center;
    & > span {
      display: block;
      width: 14px;
      height: 14px;
      background: url('../assets/search.svg') no-repeat;
      background-size: 100% 100%;
      margin: 0 10px;
    }
    & > input {
      flex: 1;
      background: transparent;
      height: 100%;
      box-sizing: border-box;
      border: none;
      outline: none;
      color: #a6adb4;
    }
  }
  & > main {
    padding: 10px;
    height: calc(100% - 110px);
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    & > div {
      background: transparent;
      :global(.el-tree-node__content:hover) {
        background-color: transparent;
      }
      :global(.el-tree-node__content:hover span:last-child) {
        color: rgba(86, 233, 255, 1);
      }
      :global(.el-tree-node:focus > .el-tree-node__content) {
        background-color: transparent;
      }
      :global(.el-icon-caret-right:before) {
        content: '';
        display: block;
        width: 12px;
        height: 12px;
        background: url('../assets/arrow.svg') no-repeat;
        background-size: 100% 100%;
      }
      :global(.is-leaf:before) {
        content: '';
        display: none;
        width: 12px;
        height: 12px;
        background: url('../assets/arrow.svg') no-repeat;
        background-size: 100% 100%;
      }
    }
    :global(.el-tree-node__label) {
      color: #fff;
    }
    &::-webkit-scrollbar {
      width: 3px;
      height: 5px;
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
</style>