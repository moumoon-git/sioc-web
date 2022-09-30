// 设置分类
<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="设置分类"
    :width="643"
  >
    <main class="setType">
      <div class="setType__left">
        <div
          v-for="(item,index) in lefttabData"
          :key="index"
          class="setType__left__item"
          :class="{'setType__left__item--active':index===selectTab}"

          @click="changeTab(index)"
        >
          {{ item.fileName }}
        </div>
      </div>
      <div class="setType__center">
        <div class="setType__center__top">
          <div
            v-for="(item,index) in centerShowData"
            :key="index"
            class="setType__center__item"
            :style="{
              background: `url('${baseURL}${item.defaultStatus?.iconUrl||''}') no-repeat`,
            }"
          >
            {{ item.className }}
            <div
              :class="['setType__center__item--check',{'setType__center__item--check--active':item.check === true}]"
              @click="changeCheckStatus(item.id)"
            />
          </div>
        </div>

        <div class="setType__center__bottom">
          <div
            class="setType__center__bottom__item"
            @click="selectAll"
          >
            全选
          </div>
          <div
            class="setType__center__bottom__item"
            @click="selectReAll"
          >
            反选
          </div>
        </div>
      </div>
      <div class="setType__right">
        <div class="setType__right__title">
          已选择
        </div>
        <div class="setType__right__content">
          <div
            v-for="(item,index) in rightData"
            :key="index"
            class="setType__right__item"
            :style="{
              background: `url('${baseURL}${item.defaultStatus?.iconUrl||''}') no-repeat`,
            }"
          >
            {{ item.className }}
            <div
              class="setType__right__item--delete"
              @click="removeSelect(item.id)"
            />
          </div>
        </div>
        <div
          class="setType__right__delete"
          @click="deleteAll"
        >
          全部清空
        </div>
      </div>
    </main>
    <footer class="setType__footer">
      <div class="setType__footer__left">
        总数:<span>{{ allNum }}</span>
      </div>
      <div class="setType__footer__right">
        <ElButton
          class="sv-button"
          type="primary"
          @click="makeSure"
        >
          确认
        </ElButton>
        <ElButton
          class="sv-button"
          @click="close()"
        >
          取消
        </ElButton>
      </div>
    </footer>
  </ElDialog>
</template>

<script lang="ts">
import {
  defineComponent, ref, getCurrentInstance, watchEffect, onMounted,
} from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  props: {
    selectPlatId: {
      type: Number,
      default: 0,
    },
  },
  emits: ['setPointEmit'],
  setup(props, context) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const showDialog = ref(false);
    const renderData = ref([]);
    const lefttabData = ref<any>([]); // 左侧tab页数据
    const centerData = ref<any>([]);// 中间切换数据
    const centerShowData = ref([]); // 中间显示的数据
    const rightData = ref<any>([]);// 右侧选中数据
    const allNum = ref(0);
    const selectTab = ref(0);
    // 获取分类列表
    function getIconsList() {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistclassfile/listByType',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          basicClassType: '0',
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          // getTreeData(thisMapId.value);
          renderData.value = response.data.data;
          console.log(renderData.value);
          dealData();
        } else {
          ElMessage.error(`获取图标失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取图标失败，错误信息：${error}`);
      });
    }
    // 处理返回值，获得以上三个数据
    const dealData = () => {
      lefttabData.value = [];
      centerData.value = [];
      renderData.value.forEach((item :any) => {
        lefttabData.value.push(item);
        centerData.value.push(item.basicClassList);
      });
      console.log(lefttabData.value);
      console.log(centerData.value);
    };
    // 切换tab
    const changeTab = (index:number) => {
      console.log(index);
      selectTab.value = index;
      centerShowData.value = centerData.value[index];
      console.log(centerShowData.value);
    };
    // 判断是否已经勾选
    const isCheked = (id:number) => {
      const ids:any = [];
      rightData.value.forEach((item:any) => {
        ids.push(item.id);
      });
      allNum.value = rightData.value.length;
      if (ids.includes(id)) {
        return true;
      }
      return false;
    };
    // 单个勾选
    const changeCheckStatus = (id:number) => {
      // 已勾选
      if (isCheked(id)) {
        rightData.value.forEach((item :any, index:number) => {
          if (item.id === id) {
            rightData.value.splice(index, 1);
          }
        });
        allNum.value = rightData.value.length;
        centerShowData.value.forEach((item:any) => {
          if (item.id === id) {
            item.check = false;
          }
        });
      } else {
      // 未勾选
        centerShowData.value.forEach((item:any) => {
          if (item.id === id) {
            rightData.value.push(item);
            allNum.value = rightData.value.length;
            item.check = true;
          }
        });
      }
      console.log('中间的数据：');
      console.log(centerShowData.value);
      console.log('右侧的数据：');
      console.log(rightData.value);
    };
    // 全选
    const selectAll = () => {
      rightData.value = []; // 置空
      centerShowData.value.forEach((item:any) => {
        rightData.value.push(item);
        allNum.value = rightData.value.length;
        item.check = true;
      });
    };
    // 反选
    const selectReAll = () => {
      rightData.value = []; // 置空
      centerShowData.value.forEach((item:any) => {
        if (item.check) {
          item.check = false;
        } else {
          item.check = true;
          rightData.value.push(item);
        }
      });
      allNum.value = rightData.value.length;
    };
    // 单个清除
    const removeSelect = (id:number) => {
      rightData.value.forEach((item :any, index:number) => {
        if (item.id === id) {
          rightData.value.splice(index, 1);
        }
      });
      allNum.value = rightData.value.length;
      centerShowData.value.forEach((item:any) => {
        if (item.id === id) {
          item.check = false;
        }
      });
    };
    // 全部清除
    const deleteAll = () => {
      rightData.value = [];
      allNum.value = rightData.value.length;
      centerShowData.value.forEach((item:any) => {
        item.check = false;
      });
    };

    const open = () => {
      showDialog.value = true;
    };
    const close = () => {
      showDialog.value = false;
    };
    // 确认
    const makeSure = () => {
      const ids:any = [];
      rightData.value.forEach((item:any) => {
        ids.push(item.id);
      });
      context.emit('setPointEmit', ids);
      showDialog.value = false;
    };
    onMounted(() => {
      getIconsList();
      dealData();
    });
    return {
      showDialog,
      open,
      close,
      renderData, // 列表渲染的数据
      dealData,
      allNum,
      selectTab,
      lefttabData,
      centerData,
      rightData,
      changeTab,
      centerShowData,
      changeCheckStatus,
      removeSelect,
      deleteAll,
      selectAll,
      selectReAll,
      makeSure,
      getIconsList,
    };
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
});
</script>

<style lang="scss">
.setType {
  width: 100%;
  height: 330px;
  overflow: hidden;
  display: flex;
  border-bottom: 1px solid #f2f2f2;
  &__left {
    width: 193px;
    height: 100%;
    border-right: 1px solid #f2f2f2;
    overflow: auto;
    &__item {
      width: 93%;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      margin: 0 auto;
      overflow: hidden;
      padding-left: 13px;
      &:hover {
        background: rgba(63, 146, 254, 0.05);
      }
    }
    &__item--active {
      background: rgba(63, 146, 254, 0.05);
    }
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
  &__center {
    width: 222px;
    height: 100%;
    border-right: 1px solid #f2f2f2;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    &__top {
      width: 222px;
      height: 92%;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
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
    &__bottom {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: rgba(0, 145, 255, 1);
      cursor: pointer;
      padding-right: 7px;
      &__item {
        width: 32px;
        text-align: center;
        &:nth-child(1) {
          text-align: left;
        }
        &:nth-child(2) {
          text-align: right;
        }
      }
    }
    &__item {
      width: 60px;
      height: 60px;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid #dddddd;
      margin: 5px;
      cursor: pointer;
      position: relative;
      text-align: center;
      background-position: 50% 30% !important;
      background-size: 50% !important;
      line-height: 103px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      &--check {
        width: 14px;
        height: 14px;
        position: absolute;
        right: 0;
        top: 0;
        border: 1px solid #dddddd;
        border-top: 0;
        border-right: 0;
        // background: url(../assets/check.svg) no-repeat
      }
      &--check--active {
        background: url(../assets/check.svg) no-repeat;
      }
    }
  }
  &__right {
    width: 227px;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    &__title {
      height: 17px;
      line-height: 17px;
      margin: 7px 0;
      border-left: 2px solid rgba(0, 145, 255, 1);
      padding-left: 8px;
      color: #333333;
      font-weight: 500;
      margin-left: 7px;
    }
    &__delete {
      text-align: right;
      width: 100%;
      padding-right: 7px;
      cursor: pointer;
      color: #0091ff;
    }
    &__content {
      width: 227px;
      height: 84%;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
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
    &__item {
      width: 60px;
      height: 60px;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid #dddddd;
      margin: 5px;
      cursor: pointer;
      position: relative;
      text-align: center;
      background-position: 50% 30% !important;
      background-size: 50% !important;
      line-height: 103px;
      text-overflow: ellipsis;
      white-space: nowrap;
      &--delete {
        position: absolute;
        right: -8px;
        top: -6px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        background: url(../assets/delete.svg) no-repeat;
        &:hover{
          animation: rotate 0.3s forwards
        }
      }
    }
  }
  &__footer {
    height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    padding-left: 10px;
    &__left > span {
      color: #0091ff;
    }
  }
}
@keyframes rotate {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(90deg);
  }
}
</style>
