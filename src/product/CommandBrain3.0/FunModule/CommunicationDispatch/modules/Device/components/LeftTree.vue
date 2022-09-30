<template>
  <div class="device">
    <div class="device__left">
      <div class="device__left__top">
        <div
          :class="['device__left__top__item',{'device__left__top__item--active':type==='监控视频'}]"
          @click="headButton('监控视频')"
        >
          <div class="device__left__top__icon1" />
          <div class="device__left__top__title">
            监控视频
          </div>
        </div>
        <div
          :class="['device__left__top__item',{'device__left__top__item--active':type==='会场终端'}]"
          @click="headButton('会场终端')"
        >
          <div class="device__left__top__icon2" />
          <div class="device__left__top__title">
            会场终端
          </div>
        </div>
        <div
          :class="['device__left__top__item',{'device__left__top__item--active':type==='集群终端'}]"
          @click="headButton('集群终端')"
        >
          <div class="device__left__top__icon3" />
          <div class="device__left__top__title">
            集群终端
          </div>
        </div>
        <!-- <div
          :class="['device__left__top__item',{'device__left__top__item--active':type==='手持终端'}]"
          @click="headButton('手持终端')"
        >
          <div class="device__left__top__icon4" />
          <div class="device__left__top__title">
            手持终端
          </div>
        </div> -->
        <div
          :class="['device__left__top__item',{'device__left__top__item--active':type==='APP终端'}]"
          @click="headButton('APP终端')"
        >
          <div class="device__left__top__icon4" />
          <div class="device__left__top__title">
            APP终端
          </div>
        </div>
      </div>
      <!-- 搜索框 -->
      <Search
        v-model="keyword"
        placeholder="请输入分组名或设备名"
        style="width: 95%;margin:10px 0px 10px 10px;border: none;"
        @change="handleChange"
      />
      <!-- 树 -->
      <div class="device__left__bottom">
        <TreeComponent
          :data="treeData"
          :show-check-box="false"
          :is-show-folder="true"
          @node-click="handleNodeClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue';
import TreeComponent from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/GroupTree/GroupTree.vue';

export default defineComponent({
  name: 'LeftTree',
  components: {
    // 左边-树
    TreeComponent,
    // 搜索框组件
    Search,
  },
  props: {
    // 列表数据
    treeData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['headButton', 'handleNodeClick', 'handleChange'],
  data() {
    return {
      keyword: '', // 搜索关键字
      type: '',
    };
  },
  watch: {
    keyword(newV: any) {
      if (newV === '') {
        this.headButton(this.type);
      }
    },
  },
  mounted() {
    this.headButton('监控视频'); // 初始化列表
  },
  methods: {
    // 点击头
    headButton(node:any) {
      this.type = node;
      this.$emit('headButton', node);
    },
    // 点击树节点
    handleNodeClick(node:any) {
      this.$emit('handleNodeClick', node);
    },
    // 搜索框的回调函数
    handleChange() {
      this.$emit('handleChange', this.keyword);
    },
  },
});
</script>

<style lang="scss" src="../assets/css/style.scss"></style>
