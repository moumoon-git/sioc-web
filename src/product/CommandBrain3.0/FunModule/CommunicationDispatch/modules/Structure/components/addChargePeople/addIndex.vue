<template>
  <Dialog
    ref="dialog"
    title="添加分管人员"
  >
    <div class="addPeopleindex__container">
      <!-- 右侧内容 -->
      <main>
        <div class="addPeopleindex__container__top">
          <input
            type="text"
            class="addPeopleindex__container__top__input"
            placeholder="请输入关键字检索"
          >
        </div>
        <div class="addPeopleindex__container__center">
          <div class="addPeopleindex__container__center__item">
            <div class="addPeopleindex__container__center__item__title">
              <div class="addPeopleindex__container__center__item__title__div">
                {{ deptInfo.name }}
              </div>
            </div>
            <div class="addPeopleindex__container__center__item__content">
              <Tree
                :show-check-box="false"
                :is-show-folder="false"
                :data="[deptInfo]"
                @node-click="clickFun"
                @node-check="checkFun"
              />
            </div>
            <div class="addPeopleindex__container__center__item__selectAll" />
          </div>
          <div class="addPeopleindex__container__center__item">
            <div class="addPeopleindex__container__center__item__title">
              <div class="addPeopleindex__container__center__item__title__div">
                {{ deptInfo.name }}
              </div>
            </div>
            <div class="addPeopleindex__container__center__item__content">
              <div
                v-for="(item,index) in selectToData"
                :key="index"
                class="addPeopleindex__item"
              >
                <input
                  v-model="chooseCheckArr"
                  type="checkbox"
                  name="historyFile2"
                  :value="item"
                  @change="getSelectList()"
                >
                {{ item.name }}
              </div>
            </div>
            <div class="addPeopleindex__container__center__item__selectAll" />
          </div>
          <div class="addPeopleindex__container__center__item">
            <div class="addPeopleindex__container__center__item__title">
              <div class="addPeopleindex__container__center__item__title__div">
                已选择（{{ chooseCheckArr.length }}）人
              </div>
            </div>
            <div class="addPeopleindex__container__center__item__content">
              <div
                v-for="(item,index) in chooseCheckArr"
                :key="index"
                class="addPeopleindex__content__item"
              >
                <div class="addPeopleindex__content__item__name">
                  {{ item.name }}（{{ item.workUnit===""?'-':item.workUnit }}/{{ item.position }}）
                </div>
                <div
                  class="addPeopleindex__content__item__delete"
                  @click="deleteSelect(item.id)"
                />
              </div>
            </div>
            <div class="addPeopleindex__container__center__item__selectAll" />
          </div>
        </div>
        <div class="addPeopleindex__container__bottom">
          <div
            class="addPeopleindex__container__bottom__item"
            @click="close"
          >
            取消
          </div>
          <div
            class="addPeopleindex__container__bottom__item"
            @click="makeSure"
          >
            确定
          </div>
        </div>
      </main>
    </div>
  </Dialog>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, computed, getCurrentInstance, reactive,
} from 'vue';
import Dialog from '@/product/CommandBrain3.0/Generalparts/dialog/Dock/DialogBoat.vue';
import Tree from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/GroupTree/GroupTree.vue';

export default defineComponent({
  components: {
    Dialog, Tree,
  },
  props: {
    unitid: {
      type: Number,
      require: false,
    },
  },
  emit:['selectEmit'],
  setup(props,{emit}) {
    const instance = getCurrentInstance();
    const { $http, $message }: any = instance?.appContext.config.globalProperties;
    const dialog = ref<typeof Dialog | null>(null);
    const deptInfo = ref({}); // 部门信息
    function open() {
      if (dialog.value) {
        dialog.value.open();
      }
    }
    function close() {
      if (dialog.value) {
        dialog.value.close();
      }
    }
    // 获取树
    function getTree() {
      const request = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailgroup/getGroupChildrenTree',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          groupId: props.unitid,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          console.log(response.data);
          deptInfo.value = response.data;
        } else {
          $message.error(`获取失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取通失败，错误信息：${error}`);
      });
    }
    // 点击树节点
    const selectToData = ref([]);
    function clickFun(info:any) {
      console.log(info);
      const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailcontactor/list',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          groupId: [info.id],
          limit: 100,
          page: 1,
          platformId: '',
          t: '',
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          console.log(response.data);
          selectToData.value = response.data.list;
        } else {
          $message.error(`获取失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取通失败，错误信息：${error}`);
      });
    }
    // 勾选树节点
    function checkFun(arr:any){
      console.log(arr)
    }
    // 多选
    const chooseCheckArr:any = ref([]);
    function getSelectList() {
      console.log(chooseCheckArr.value);
    }
    // 删除
    function deleteSelect(id:number) {
      chooseCheckArr.value.forEach((item:any, index:number) => {
        if (item.id === id) {
          chooseCheckArr.value.splice(index, 1);
        }
      });
    }
    // 确定
    function makeSure(){
      emit('selectEmit',chooseCheckArr.value);
      close()
    }
    return {
      open,
      dialog,
      close,
      getTree,
      deptInfo,
      clickFun,
      getSelectList,
      chooseCheckArr,
      selectToData,
      deleteSelect,
      makeSure,
      checkFun
    };
  },
  watch: {

  },
});
</script>

<style lang="scss">
.addPeopleindex__container {
  width: 1240px;
  height: 742px;
  display: flex;
}
.addPeopleindex__container {
  width: 1240px;
  height: 742px;
  display: flex;
  & > main {
    flex: 1;
    .addPeopleindex__container__top {
      width: 100%;
      height: 56px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      display: flex;
      justify-content: center;
      align-items: center;
      &__input {
        width: 1176px;
        height: 38px;
        background: rgba(41, 47, 48, 0.77);
        border: 0;
        outline: 0;
        color: #fff;
      }
    }
    .addPeopleindex__container__center {
      width: 100%;
      height: 620px;
      display: flex;
      align-items: center;
      justify-content: center;
      &__item {
        width: 387px;
        height: 591px;
        background: rgba(0, 0, 0, 0.29);
        border: 1px solid rgba(0, 193, 222, 0.29);
        margin: 0 5px;
        &__title {
          width: 387px;
          height: 52px;
          background: linear-gradient(
            90deg,
            rgba(20, 98, 140, 0.35) 0%,
            rgba(14, 69, 100, 0.69) 100%
          );
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          line-height: 52px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          &__div {
            margin-left: 10px;
          }
        }
        &__content {
          height: 500px;
          overflow: auto;

          &:nth-child(2) {
            .addPeopleindex__item {
              display: flex;
              height: 32px;
              color: #fff;
              line-height: 32px;
              width: 95%;
              align-items: center;
              margin: 0 auto;
              &__checkbox {
                width: 14px;
                height: 14px;
                background: #ffffff;
                border-radius: 3px;
                border: 1px solid #dddddd;
              }
              &__name {
                margin-left: 10px;
              }
            }
          }
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
        }
        &__selectAll {
        }
      }
    }
    .addPeopleindex__container__bottom {
      width: 100%;
      height: 56px;
      display: flex;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      justify-content: flex-end;
      align-items: center;
      &__item {
        width: 65px;
        height: 32px;
        border: 1px solid rgba(255, 255, 255, 0.45);
        text-align: center;
        line-height: 32px;
        color: rgba(255, 255, 255, 0.65);
        cursor: pointer;
        &:nth-child(1) {
          color: rgba(255, 255, 255, 0.65);
          margin-right: 8px;
        }
        &:nth-child(2) {
          color: #fff;
          margin-right: 18px;
          background: #00c1de;
        }
      }
    }
  }
}
.addPeopleindex__content__item {
  width: 385px;
  height: 32px;
  color: #fff;
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover{
        background: linear-gradient(
    90deg,
    rgba(0, 193, 222, 0.7) 0%,
    rgba(24, 38, 50, 0) 100%
  );
    .addPeopleindex__content__item__delete{
        display: block
    }
  }
  &__name {
    margin-left: 12px;
  }
  &__delete {
       display: none;
    width: 14px;
    height: 14px;
    border: none;
    outline: none;
    background: #fff;
    mask: no-repeat center/100% 100% url(./assets/delete.svg);
    cursor: pointer;
    transition: background 0.3s;
    vertical-align: -2px;
    margin-left: 10px;
    &:hover {
      background: #56e9ff;
    }
    &:active {
      vertical-align: -3px;
    }
    cursor: pointer;
    margin-right: 28px;
  }
}
</style>
