// 选择视频分组
<template>
  <ElDialog
    v-model="showDialog"
    :modal="false"
    custom-class="select-dialog"
    title="选择视频资源监控"
    left
    :width="898"
  >
    <div :class="$style.container">
      <div :class="$style.content">
        <div :class="$style.searchSection">
          <input
            v-model="searchName"
            :class="$style.search"
            placeholder="请输入关键字检索"
            @keyup.enter="getVideoGroups"
          >
        </div>
        <div :class="$style.list">
          <div
            v-for="(item,index) in groupListData"
            :key="index"
            :class="[$style.item, {[$style.active]:index===isActive}]"
            @click="groupClickFun(item,index)"
          >
            {{ item.name }}（{{ item.devices?.length||0 }}）
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
          @click="changeVideoArr"
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
    setup(props, { emit }) {
        const instance = getCurrentInstance();
        const { $http }: any = instance?.appContext.config.globalProperties;
        const store = useStore();
        const showDialog = ref(false);
        // 打开
        const open = () => {
            showDialog.value = true;
        };
        // 关闭
        const close = () => {
            showDialog.value = false;
        };
        const groupListData = ref([]); // 视频分组数据
        const searchName = ref(''); // 分组名称
        /**
        * @desc 获取视频分组
        * @param {} params
        * @returns {} returns
        */
       const selectArr = ref([]); // 选中的视频分组数据
       const selectGroupName = ref(''); // 选中的视频分组的名称
       const getVideoGroups = () => {
        const request = {
            method: 'get',
            service: 'flight',
            url: '/device/appdevicegroup/shortcutList',
            headers: {
            'Content-Type': 'application/json',
            },
            params: {
                groupName: searchName.value,
                },
        };
        $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            groupListData.value = response.data?.list || [];
          } else {
            ElMessage.error(
              `获取视频分组失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`获取视频分组失败，错误信息：${error}`);
        });
       };
       /**
       * @desc 分组点击方法
       * @param {} params
       * @returns {} returns
       */
      const isActive:any = ref('');
      const groupClickFun = (item:any, index:number) => {
        isActive.value = index;
        selectGroupName.value = item.name;
        selectArr.value = item.devices;
      };
       /**
       * @desc 改变轮询总视频数组
       * @param {} params
       * @returns {} returns
       */
      const changeVideoArr = () => {
        const tempArr:any = [];
        selectArr.value.forEach((item:any) => {
            tempArr.push({ id: item.id, name: item.name, code: item.code });
        });
        store.commit('SET_VIDEOARR', tempArr);
        store.commit('SET_GROUPNAME', selectGroupName.value);
        close();
      };
        return {
            showDialog,
            groupListData,
            searchName,
            isActive,
            open,
            close,
            getVideoGroups,
            changeVideoArr,
            groupClickFun,
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
