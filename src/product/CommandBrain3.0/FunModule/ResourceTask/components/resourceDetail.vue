// 资源任务详情弹窗
<template>
  <ElDialog
    v-model="showDialog"
    custom-class="resourcePop"
    title="现场支援"
    :width="546"
  >
    <div class="resourcePop__body">
      <div class="resourcePop__body__list">
        <div class="resourcePop__body__list__l">
          资源清单:
        </div>
        <div class="resourcePop__body__list__r">
          <div
            v-for="(item,index) in detailObj.resources"
            :key="index"
            class="resourcePop__body__list__r__items"
          >
            <div class="resourcePop__body__list__r__items__l">
              {{ item.name }}
            </div>
            <div class="resourcePop__body__list__r__items__r">
              {{ `${item.number}${item.unit}` }}
            </div>
          </div>
        </div>
      </div>
      <div class="resourcePop__body__list">
        <div class="resourcePop__body__list__l">
          申请时间:
        </div>
        <div class="resourcePop__body__list__r">
          2021-05-15 15:11
        </div>
      </div>
      <div class="resourcePop__body__list">
        <div class="resourcePop__body__list__l">
          申请名称:
        </div>
        <div class="resourcePop__body__list__r">
          {{ detailObj.name }}
        </div>
      </div>
      <div class="resourcePop__body__list">
        <div class="resourcePop__body__list__l">
          联系人:
        </div>
        <div class="resourcePop__body__list__r">
          {{ detailObj.contactName }}
        </div>
      </div>
      <div class="resourcePop__body__list">
        <div class="resourcePop__body__list__l">
          联系电话:
        </div>
        <div class="resourcePop__body__list__r">
          {{ detailObj.contactPhone }}
        </div>
      </div>
      <div class="resourcePop__body__list">
        <div class="resourcePop__body__list__l">
          到达时限:
        </div>
        <div class="resourcePop__body__list__r">
          {{ detailObj.arriveDate }}
        </div>
      </div>
      <div class="resourcePop__body__list">
        <div class="resourcePop__body__list__l">
          申请说明:
        </div>
        <div class="resourcePop__body__list__r">
          {{ detailObj.remark }}
        </div>
      </div>
      <div class="resourcePop__body__list">
        <div class="resourcePop__body__list__l">
          上传图片:
        </div>
        <div
          v-viewer
          class="resourcePop__body__list__r resourcePop__body__list__imgs"
        >
          <img
            v-for="(item,index) in detailObj.pics"
            :key="index"
            :src="`${baseurl}/fileupload${item.path}${item.name}`"
            alt
          >
        </div>
      </div>
    </div>
  </ElDialog>
</template>

  <script setup lang="ts">
import { ref, defineExpose } from 'vue';

const showDialog = ref(false);
const detailObj = ref({}); // 详情
const baseurl = (window as any).config.baseURL;
const open = () => {
    showDialog.value = true;
};
const close = () => {
    showDialog.value = false;
};
defineExpose({
    open,
    close,
    detailObj,
});

</script>
  <style lang="scss">
.resourcePop {
    background: rgba(20, 29, 31, 0.94);
    border: 1px solid #00c1de;
    .el-dialog__header {
        .el-dialog__title {
            color: #fff;
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: #909399;
            font-size: 24px;
        }
    }
    &__body {
        color: #fff;
        max-height: 500px;
        overflow: auto;
        // 滚动条
        &::-webkit-scrollbar {
            width: 5px;
            height: 5px;
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background: #56e9ff;
            border-radius: 5px;
        }
        &::-webkit-scrollbar-corner {
            background: transparent;
        }
        &__list {
            color: #fff;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            margin: 10px 0;
            &__l {
                color: #fff;
                min-width: 70px;
                text-align: right;
                margin-right: 10px;
            }
            &__r {
                color: #fff;
                &__items{
                  display: flex;
    width: 420px;
    justify-content: space-between;
             &__l{
              color: #fff;
             }
             &__r{
              color: #fff;
             }
            }
            }
            &__imgs {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                & > img {
                    width: 135px;
                    height: 76px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                }
            }

        }
    }
}
</style>
