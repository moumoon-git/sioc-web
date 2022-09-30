<template>
  <Dialog
    ref="dialog"
    :title="renderSendData.name"
  >
    <div class="addindex__container">
      <!-- 右侧内容 -->
      <main>
        <div class="addindex__container__top">
          <div
            class="addindex__container__top__item"
            :class="{'addindex__container__top__item--active':selectId===1}"
            @click="selectId = 1"
          >
            单位信息
          </div>
          <div
            class="addindex__container__top__item"
            :class="{'addindex__container__top__item--active':selectId===2}"
            @click="selectId = 2"
          >
            应急岗位
          </div>
        </div>
        <div class="addindex__container__center">
          <!-- <keep-alive> -->
          <AddUnit
            v-if="selectId===1"
            :unit-data="renderSendData"
            @close="close"
          />
          <!-- </keep-alive> -->
          <!-- <keep-alive> -->
          <AddEmer v-if="selectId===2" :unit-data="renderSendData" @close="close" />
          <!-- </keep-alive> -->
        </div>
      </main>
    </div>
  </Dialog>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, computed, watchEffect, reactive,getCurrentInstance
} from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue';
import AddUnit from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/addUnitAndEmergy/AddUnit.vue'; // 添加单位
import AddEmer from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/addUnitAndEmergy/AddEmergy.vue'; // 添加应急岗位
import { watch } from 'fs';

export default defineComponent({
  components: {
    Dialog,
    AddUnit,
    AddEmer,
  },
  props: {
    renderSendData: {
      type: Object,
      default: () => ({}),
    },
  },
  emit:['refrash'],
  setup(props,{emit}) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const dialog = ref<typeof Dialog | null>(null);
    const selectId = ref(1);

    // 打开
    const renderData = props.renderSendData.value;
    function open() {
      if (dialog.value) {
        dialog.value.open();
      }
    }
    // 关闭
    function close() {
      if (dialog.value) {
        dialog.value.close();
      }
      emit('refrash')
    }
    onMounted(() => {

    });
    return {
      dialog,
      open,
      close,
      selectId,
      renderData,
    };
  },
  watch: {

  },
});
</script>

<style lang="scss">
.addindex__container {
  width: 1240px;
  height: 742px;
  display: flex;
  & > main {
    flex: 1;
    .addindex__container__top {
      width: 100%;
      height: 56px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &__item {
        color: #fff;
        height: 100%;
        line-height: 56px;
        cursor: pointer;
        font-weight: 500;
        font-size: 16px;
        &:nth-child(1) {
          margin-left: 28px;
        }
        &:nth-child(2) {
          margin-left: 59px;
        }
        &--active {
          color: rgba(86, 233, 255, 1);
          border-bottom: 2px solid rgba(0, 236, 255, 1);
        }
      }
    }
    .addindex__container__center {
          width: 100%;
     height: 677px;
    display: flex;
    align-items: center;
    flex-direction: column;
    }

  }
}
</style>
