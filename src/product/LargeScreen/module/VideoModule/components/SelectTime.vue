// 选择视频分组
<template>
  <ElDialog
    v-model="showDialog"
    :modal="false"
    custom-class="select-dialog"
    title="选择轮询时间"
    left
    :width="898"
  >
    <div :class="$style.container">
      <div :class="$style.content">
        <div :class="$style.list">
          <div
            v-for="(item,index) in list"
            :key="index"
            :class="[$style.item, {[$style.active]:index===isActive}]"
            @click="groupClickFun(item,index)"
          >
            {{item}}
          </div>
        </div>
      </div>
      <div :class="$style.footer">
        <div
          :class="$style.cancle"
          @click="close"
        >
          取消
        </div>
        <div
          :class="$style.sure"
          @click="changeTimeClickFun"
        >
          确定
        </div>
      </div>
    </div>
  </ElDialog>
</template>
<script lang="ts">
import {
    defineComponent, ref, getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export default defineComponent({
    components: {
    },
    props:{
        list:{
            type:Array,
            default:[]
        }
    },
    setup(props, { emit }) {
        const instance = getCurrentInstance();
        const { $http }: any = instance?.appContext.config.globalProperties;
        const store = useStore();
        const showDialog = ref(false);
        const optionArr = [30000, 60000, 180000, 300000, 420000, 540000]; // 轮询时间
        // 打开
        const open = () => {
            showDialog.value = true;
        };
        // 关闭
        const close = () => {
            showDialog.value = false;
        };
        const groupListData = ref([]); // 时间数据
        const searchName = ref(''); // 名称

       /**
       * @desc 时间点击方法
       * @param {} params
       * @returns {} returns
       */
      const isActive:any = ref(0);
      const groupClickFun = (item:any, index:number) => {
        isActive.value = index;
      };
      /**
      * @desc 选中某一项时间确认
      * @param {} params
      * @returns {} returns
      */
      const changeTimeClickFun = () =>{
        store.commit('SET_POLLINGTIME', optionArr[isActive.value]);
        close()
      }

        return {
            showDialog,
            groupListData,
            searchName,
            isActive,
            open,
            close,
            groupClickFun,
            changeTimeClickFun,
        };
    },
});
</script>
<style module lang="scss">
.container {
    height: 553px;
    .content {
        height: 487px;
        width: 100%;
        overflow: auto;
        border: 1px solid rgba(255, 255, 255, 0.15);
        .searchSection {
            width: 100%;
            height: 83px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .search {
                width: 272px;
                height: 46px;
                background: rgba(41, 47, 48, 0.77);
                outline: 0;
                border: 0;
                color: #fff;
                font-size: 20px;
                margin-left: 10px;
            }
        }

        .list {
            width: 100%;
            height: 400px;
            overflow: auto;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
        }
        .item {
            width: 272px;
            height: 56px;
            background: linear-gradient(
                90deg,
                rgba(0, 193, 222, 0.1) 0%,
                rgba(24, 38, 50, 0) 100%
            );
            font-size: 20px;
            font-weight: 500;
            color: #ffffff;
            text-align: center;
            line-height: 56px;
            margin: 10px;
            &:hover{
                background: linear-gradient(
                90deg,
                rgba(0, 193, 222, 0.7) 0%,
                rgba(24, 38, 50, 0) 100%
            );
            }
        }
        .active{
          background: linear-gradient(
                90deg,
                rgba(0, 193, 222, 0.7) 0%,
                rgba(24, 38, 50, 0) 100%
            );
        }
    }
    .footer {
        height: 65px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .cancle {
            width: 78px;
            height: 38px;
            border: 1px solid rgba(255, 255, 255, 0.45);
            font-size: 16px;

            color: rgba(255, 255, 255, 0.65);
            text-align: center;
            line-height: 38px;
            cursor: pointer;
            margin-right: 10px;
        }
        .sure {
            width: 78px;
            height: 38px;
            border: 1px solid rgba(255, 255, 255, 0.45);
            background: #00c1de;
            font-size: 16px;
            color: #fff;
            text-align: center;
            line-height: 38px;
            cursor: pointer;
            margin-right: 19px;
        }
    }
}
:global(.select-dialog) {
    background: rgba(20, 29, 31, 0.94);
    border: 1px solid #00c1de;
    :global(.el-dialog__title) {
        font-size: 20px;
        color: #fff;
        font-weight: 500;
    }
    :global(.el-dialog__body) {
        padding: 0;
    }
}
</style>
