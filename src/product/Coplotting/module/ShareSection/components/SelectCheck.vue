/*
 * @Author: DGT
 * @Date: 2021-06-12 10:20:06
 * @Last Modified by: DGT_
    下拉选择分组信息组件
 * @Last Modified time: 2021-06-15 16:43:20
 */

<template>
  <div class="shareListItemComponent">
    <div
      class="shareListItemComponent__btns__all"
      :class="{'shareListItemComponent__btns__all--active':showList===true}"
      @click="showListFun"
    >
      全部
    </div>
    <div
      class="shareSelectListComponent"
      :class="{'shareSelectListComponent--active':showList===true}"
    >
      <div
        v-for="(item,index) in groupInfo"
        :key="index"
        class="shareSelectListComponent__item"
      >
        <input
          v-model="chooseCheckArr"
          type="checkbox"
          :disabled="isDisabled"
          :value="item.id"
          @change="getSelectList()"
        >
        <div class="shareSelectListComponent__item__name">
          {{ item.groupName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
 defineComponent, ref, getCurrentInstance, onMounted,
} from 'vue';

export default defineComponent({
  props: {
    groupInfo: {
      type: Array,
      default: [],
    },
    // 是否禁用复选框
    isDisabled: {
        type: Boolean,
        default: false,
    },
  },
  emits: ['checkEmit'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showList = ref(false); // 显示分组列表
      // 多选
    const chooseCheckArr:any = ref([]);
    const showListFun = () => {
        // (window as any).event.stopPropagation(); // 阻止冒泡
        chooseCheckArr.value = [];
        showList.value = !showList.value;
         props.groupInfo.forEach((element:any) => {
           if (element.check) {
             chooseCheckArr.value.push(element.id);
           }
         });
    };
      // 复选框勾选方法
    function getSelectList() {
      console.log(chooseCheckArr.value);
      emit('checkEmit', chooseCheckArr.value);
    }
    return {
        showList,
        showListFun,
        chooseCheckArr,
        getSelectList,
    };
  },
});
</script>

<style lang="scss">
.shareListItemComponent{
     width: 100%;
    height: 40px;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    position: relative;
&__btns{
        display: flex;
    align-items: center;
    margin-right: 10px;
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
}
.shareSelectListComponent{
    width: 101px;
    height: 204px;
    background: #FFFFFF;
    box-shadow: 0px 2px 8px 0px rgb(0 0 0 / 10%);
    border-radius: 4px;
    position: absolute;
    top: 37px;
    z-index: 1;
    max-height: 0px;
    overflow: hidden;
    left: 50%;
    margin-left: -50px;
    &__item{
height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &__name{
     color: #666666;
    margin-left: 5px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    }
    }
}
.shareSelectListComponent--active{
     transition: max-height 0.5s;
     max-height: 200px;
     overflow: auto;
     &::-webkit-scrollbar {
        background: transparent;
        width: 5px;
        height: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d5d5d5;
        border-radius: 5px;
      }
}
}

</style>
