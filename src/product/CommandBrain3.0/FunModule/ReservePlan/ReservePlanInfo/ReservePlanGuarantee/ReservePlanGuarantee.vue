<template>
  <!-- 保障资源 -->
  <div :class="$style.guaranteeLeft">
    <ListTemple
      :title="'保障资源'"
      :useCount="false"
      :list="guaranteeResourceList"
      :countAll="guaranteeResourceList.length"
      @handleClick="handleGuaranteeResourceClick"
    >
      <template #headerIcon>
        <img
          src="./assets/guaranteeResourceIcon.svg"
          style="position: relative;
          margin: 13px 0px 0px 10px;
          float: left;"
        >
      </template>
    </ListTemple>
  </div>
  <!-- 右边 -->
  <div :class="$style.guaranteeRight">
    <!-- 资源表格 -->
    <ResourceTable
      :is-not-detail="!isShowDetail"
      :table-head-list="tableHeadList"
      :resource-table-list="resourceTableList"
      :resource-table-item="resourceTableItem"
      :detail-name="detailName"
      @goBack="goBack"
      @handleClick="handleResourceTableClick"
    />
    <!-- 只有详情的接口有分页 -->
    <div
      v-if="resourceTableItem.length>0 && isShowDetail"
      style="width: 100%;position: absolute;bottom: 20px;"
    >
      <div style="color: rgb(255, 255, 255);position: relative;text-align: center;">
        <span
          type="text"
          style="cursor: pointer;padding: 3px 5px;
          border: 1px solid rgba(0, 193, 222, 0.58);margin: 5px;"
          @click="handlePageDown"
        >
          <img
            style="width:10px;height:10px;"
            src="../../PublicComponents/assets/left.svg"
            alt=""
          >
        </span>
        <span>共{{ `${page}/${Math.ceil(total/size)}` }}页</span>
        <span
          v-for="index in Math.ceil(total/size)"
          :key="index"
          style="cursor: pointer;padding: 3px 5px;
          border: 1px solid rgba(0, 193, 222, 0.58);margin: 5px;"
          :style="page === index ? 'background: rgba(0, 193, 222, 0.7);':'background:transparent'"
          @click="jumpToPage(index)"
        >
          {{ index }}
        </span>
        <span
          type="text"
          style="cursor: pointer;padding: 3px 5px;
          border: 1px solid rgba(0, 193, 222, 0.58);margin: 5px;"
          @click="handlePageUp"
        >
          <img
            style="width:10px;height:10px;"
            src="../../PublicComponents/assets/right.svg"
            alt=""
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ListTemple from '../../PublicComponents/ListTemple.vue'; // 列表模板
import ResourceTable from './components/ResourceTable.vue'; // 资源表格

export default defineComponent({
  name: 'ReservePlanGuarantee',
  components: {
    // 列表模板
    ListTemple,
    // 资源表格
    ResourceTable,
  },
  data() {
    return {
      isShowDetail: false, // 是否切换资源表格和表格详情
      guaranteeResourceList: [], // 保障资源列表
      tableHeadList: [{ name: '' }], // 表头
      resourceTableList: [], // 资源表格数据
      resourceTableItem: [], // 资源表格一行的所有属性名字
      detailName: '', // 资源表格详情头部显示名字
      page: 1, // 在第几页
      size: 10, // 每页多少数据
      total: 10, // 一共多少数据
      currentCode: '0', // code当前是几
      currentResource: '', // 资源当前点击哪行
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(): void {
      // 左列表初始化
      const request1 = {
        method: 'POST',
        url: '/preplan/support/getSelectedType',
        service: 'eoc',
        data: {
          versionId: Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      (this as any).$http(request1).then((response: any) => {
        if (response.errorcode === 0) {
          this.guaranteeResourceList = response.data;
        }
      });
    },
    // 点左边保障资源，获得右边资源表
    handleGuaranteeResourceClick(item: any): void {
      // 点击左边物资列表，不打开详情
      this.isShowDetail = false;
      // code当前是几
      this.currentCode = item.code;
      // 数据
      this.jumpToPage(1);
    },
    // 点资源表某一行，打开这行详情
    handleResourceTableClick(item: any): void {
      // 更新资源详情头部名字
      this.detailName = item.name;
      // 资源当前点击哪行
      this.currentResource = item;
      // 点击资源表行，打开详情
      this.isShowDetail = true;
      // 数据
      this.jumpToPage(1);
    },
    // 前一页
    handlePageDown(): void {
      if (this.page > 1) this.page -= 1;
      this.jumpToPage(this.page);
    },
    // 后一页
    handlePageUp(): void {
      if (this.page < this.total / this.size) this.page += 1;
      this.jumpToPage(this.page);
    },
    // 跳页
    jumpToPage(index:any): void {
      this.page = index;
      // 详情
      if (this.isShowDetail) {
        const request = {
          method: 'POST',
          url: '/preplan/support/getSupportClassDetail',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            page: this.page,
            size: this.size,
            type: this.currentCode,
            classIds: [(this as any).currentResource.id],
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            // 表头列属性
            switch (this.currentCode) {
              case '4': // 防护目标
                this.tableHeadList = [{ name: '目标名称' }, { name: '容纳人数（人）' }, { name: '负责人' }, { name: '联系电话' }, { name: '位置' }];
                (this as any).resourceTableItem = ['name', 'canuseNumber', 'contactsList', 'contactsList'];
                break;
              case '3': // 避难场所
                this.tableHeadList = [{ name: '场所名称' }, { name: '容纳人数（人）' }, { name: '负责人' }, { name: '联系电话' }, { name: '位置' }];
                (this as any).resourceTableItem = ['name', 'peopleNum', 'contactorlist', 'contactorlist'];
                break;
              case '2': // 专家
                this.tableHeadList = [{ name: '专家名称' }, { name: '专家职务' }, { name: '专业领域' }, { name: '联系电话' }];
                (this as any).resourceTableItem = ['name', 'duty', 'majorArea', 'phone'];
                break;
              case '1': // 队伍
                this.tableHeadList = [{ name: '队伍名称' }, { name: '负责人' }, { name: '联系电话' }, { name: '位置' }];
                (this as any).resourceTableItem = ['name', 'responsiblesList', 'responsiblesList'];
                break;
              default: // 物资
                this.tableHeadList = [{ name: '仓库名称' }, { name: '库存数量（个）' }, { name: '负责人' }, { name: '联系电话' }, { name: '位置' }];
                (this as any).resourceTableItem = ['name', 'amount', 'resoureArticleStorehouse', 'resoureArticleStorehouse'];
                break;
            }
            // 表
            this.resourceTableList = response.data.list;
            // 总数
            this.total = response.data.totalCount;
          }
        });
      } else { // 不是看详情
        const request = {
          method: 'POST',
          url: '/preplan/support/getSupportClass',
          service: 'eoc',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            versionId: Number((this as any).$store.state.reservePlan.currentReservePlan.versionId),
            type: this.currentCode,
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.errorcode === 0) {
            // 表头
            this.tableHeadList = [{ name: '名称' }];
            // 表
            this.resourceTableList = response.data;
            // 总数
            this.total = response.data.length;
            // 列属性
            (this as any).resourceTableItem = ['name'];
          }
        });
      }
    },
    // 从详情返回到资源表格
    goBack(): void {
      this.isShowDetail = false;
      this.jumpToPage(1);
    },
  },
});
</script>

<style lang="scss" module>
  .guaranteeLeft {
    position: absolute;
    left: 20px;
    top: 60px;
    width: 222px;
    height: 75vh;
    border: 1px solid rgba(0, 193, 222, 0.58);
    background: rgba(0, 0, 0, 0.29);
  }
  .guaranteeRight {
    position: absolute;
    right: 21px;
    top: 60px;
    width: 591px;
    height: 75vh;
    border: 1px solid rgba(0, 193, 222, 0.58);
    background: rgba(0, 0, 0, 0.29);
  }
</style>
