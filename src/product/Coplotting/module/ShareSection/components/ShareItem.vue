<template>
  <div class="shareListItem">
    <div class="shareListItem__name">
      {{ itemdata.cooperatePlatformName }}
    </div>
    <div class="shareListItem__btns">
      <div class="shareListItem__btns__name">
        分享权限：
      </div>
      <div
        class="shareListItem__btns__all2"
      >
        <SelectCheck
          :group-info="itemdata.groupRights"
          :is-disabled="true"
        />
      </div>

      <div
        class="shareListItem__btns__delete"
        @click="deleteEmit(itemdata.id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import SelectCheck from '@/product/Coplotting/module/ShareSection/components/SelectCheck.vue'; // 下拉选择复选框组件

export default defineComponent({
  components: {
    SelectCheck, // 下拉复选框组件
  },
  props: {
    itemdata: {
      type: Object,
      default: () => {},
    },
    allGroupData: {
      type: Array,
      default: [],
    },
  },
  emits: ['deleteFun'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showList = ref(false); // 显示分组列表
    const showListFun = () => {
        // (window as any).event.stopPropagation(); // 阻止冒泡
        showList.value = !showList.value;
    };
    const deleteEmit = (id:any) => {
      emit('deleteFun', id);
    };

    return {
        showList,
        showListFun,
        deleteEmit,
    };
  },
});
</script>

<style lang="scss">
.shareListItem{
  width: 498px;
    height: 37px;
    background: #F7F8FA;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 10px;
    position: relative;
&__name{
    margin-left: 12px;
}
&__btns{
        display: flex;
    align-items: center;
    margin-right: 10px;
    &__name{
            margin-right: 5px;
    }
    &__all{
            margin-right: 5px;
            color: rgba(0, 145, 255, 1);
            cursor: pointer;
            &::after{
                content:'';
                width: 10px;
                height:10px;
                background: url(./assets/arrow.svg) no-repeat;
                display: inline-block;
            }
            &:hover{
            opacity: 0.7;
        }
    }
    &__all--active{
            margin-right: 5px;
            color: rgba(0, 145, 255, 1);
            cursor: pointer;
            &::after{
                content:'';
                width: 10px;
                height:10px;
                background: url(./assets/arrow.svg) no-repeat;
                display: inline-block;
                transform: rotate(180deg)
            }
            &:hover{
            opacity: 0.7;
        }
    }
    &__delete{
        cursor: pointer;
        width: 14px;
        height: 15px;
        background: url(./assets/delete.svg) no-repeat;
        &:hover{
            background: url(./assets/deleteActive.svg) no-repeat;
        }
    }
}
.shareSelectList{
    width: 101px;
    height: 204px;
    background: #FFFFFF;
    box-shadow: 0px 2px 8px 0px rgb(0 0 0 / 10%);
    border-radius: 4px;
    position: absolute;
    top: 37px;
    right: -6px;
    z-index: 1;
    max-height: 0px;
    overflow: hidden;
}
.shareSelectList--active{
     transition: max-height 0.3s;
     max-height: 200px;
     overflow: auto
}
}
</style>
