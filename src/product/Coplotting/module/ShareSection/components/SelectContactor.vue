// 选择通讯录人员
<template>
  <ElDialog
    v-model="showDialog"
    :modal="false"
    custom-class="sv-dialog"
    title="选择通讯录"
    :width="853"
  >
    <div class="selectSahreContactor">
      <div class="selectSahreContactor__box">
        <div class="selectSahreContactor__box__l">
          <div class="selectSahreContactor__box__l__tree">
            <ContactorTree @groupPersonData="groupPersonDataFun" />
          </div>
          <div class="selectSahreContactor__box__l__list">
            <div class="selectSahreContactor__box__l__list__box">
              <div
                v-for="(item,index) in peopleListData"
                :key="index"
                class="selectSahreContactor__box__l__list__box__item"
              >
                <div class="selectSahreContactor__box__l__list__box__item__checkbox">
                  <input
                    v-model="chooseCheckArr"
                    type="checkbox"
                    :value="item.id"
                    @change="getSelectList()"
                  >
                </div>
                <div class="selectSahreContactor__box__l__list__box__item__name">
                  {{ item.name }}
                </div>
              </div>
            </div>
            <div class="selectSahreContactor__box__l__list__checkAll">
              <el-checkbox v-model="selectAllValue">
                全选
              </el-checkbox>
            </div>
          </div>
        </div>
        <div class="selectSahreContactor__box__r">
          <div class="selectSahreContactor__box__r__top">
            <div class="selectSahreContactor__box__r__top__title">
              已选联系人
            </div>
            <div
              class="selectSahreContactor__box__r__top__btn"
              @click="showAdd=true"
            >
              +手输号码
            </div>
          </div>
          <div class="selectSahreContactor__box__r__center">
            <transition name="bounce">
              <div
                v-if="showAdd"
                class="selectSahreContactor__box__r__center__add"
              >
                <input
                  v-model="addnumber"
                  class="selectSahreContactor__box__r__center__add__input"
                  placeholder="请输入号码"
                >
                <div class="selectSahreContactor__box__r__center__add__btn">
                  <div
                    class="selectSahreContactor__box__r__center__add__btn__sure"
                    @click="sureFun"
                  />
                  <div
                    class="selectSahreContactor__box__r__center__add__btn__delete"
                    @click="showAdd=false"
                  />
                </div>
              </div>
            </transition>
            <div
              v-for="(item,index) in selectPeopleAllData"
              :key="index"
              class="selectSahreContactor__box__r__center__item"
            >
              <div class="selectSahreContactor__box__r__center__item__name">
                {{ item.name }}
              </div>
              <div class="selectSahreContactor__box__r__center__item__delete" />
            </div>
          </div>
          <div class="selectSahreContactor__box__r__bottom">
            <div class="selectSahreContactor__box__r__bottom__num">
              共({{ selectPeopleAllData.length }})人
            </div>
            <div
              class="selectSahreContactor__box__r__bottom__remove"
              @click="clearAll"
            >
              全部清空
            </div>
          </div>
        </div>
      </div>
      <div class="selectSahreContactor__footer">
        <div
          class="selectSahreContactor__footer__cancle"
          @click="showDialog=false"
        >
          取消
        </div>
        <div
          class="selectSahreContactor__footer__sure"
          @click="senMsgFun"
        >
          确认
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script lang="ts">
import {
 defineComponent, ref, getCurrentInstance, watch,
} from 'vue';
import { ElMessage } from 'element-plus';
import ContactorTree from '@/product/Coplotting/module/ShareSection/components/ContactorTree.vue'; // 树组件
import useContactorFun from './script/useContactor';

export default defineComponent({
    components: {
        ContactorTree, // 树
    },
    props: {
      linkInfo: {
        type: String,
        default: '',
      },
    },
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const { sendMsg } = useContactorFun($http);
    const showDialog = ref(false);
    const peopleListData = ref([]); // 人员数据
    const selectAllValue = ref(false); // 全选
    const showAdd = ref(false); // 显示添加号码
    const selectPeopleAllData = ref([]); // 右侧选中的所有数据
    const selectPeopleListData = ref([]); //  左侧复选框已选择的数据
    const addPhoneNumberData = ref([]); // 手写添加的数据
    // 打开
    const open = () => {
      showDialog.value = true;
    };
    // 关闭
    const close = () => {
      showDialog.value = false;
    };
       /*
    *@Description: 拼接全部
    *@MethodAuthor:  DGT
    *@param: {}
    *@Date: 2021-06-16 11:28:39
   */
  const getAllRightData = () => {
    selectPeopleAllData.value = [...addPhoneNumberData.value, ...selectPeopleListData.value];
  };
    // 多选
    const chooseCheckArr:any = ref([]);
    function getSelectList() {
      selectPeopleListData.value = [];
      peopleListData.value.forEach((element:any, index:number) => {
        if (chooseCheckArr.value.includes(element.id)) {
          (selectPeopleListData.value as any).push(element);
        }
      });
      console.log(selectPeopleListData.value);
      getAllRightData();
    }
    /*
     *@Description: 获取分组数据
     *@MethodAuthor:  DGT
     *@param: {}
     *@Date: 2021-06-16 10:40:41
    */
   const groupPersonDataFun = (data:any) => {
     console.log(data);
     peopleListData.value = data;
   };

  /*
   *@Description: 添加号码
   *@MethodAuthor:  DGT
   *@param: {}
   *@Date: 2021-06-16 11:42:30
  */
 const addnumber = ref('');
 const sureFun = () => {
  const tempObj:any = {
    name: addnumber.value,
    mobile1: addnumber.value,
  };
  (addPhoneNumberData.value as any).push(tempObj);
  showAdd.value = false;
  getAllRightData();
  addnumber.value = '';
 };
 /*
  *@Description: 清空全部
  *@MethodAuthor:  DGT
  *@param: {}
  *@Date: 2021-06-16 13:40:10
 */
 const clearAll = () => {
   selectPeopleAllData.value = [];
 };
 /*
  *@Description: 短信发送
  *@MethodAuthor:  DGT
  *@param: {}
  *@Date: 2021-06-16 13:49:46
 */
const senMsgFun = () => {
  console.log(props.linkInfo);
  if (props.linkInfo === '') {
    return ElMessage.error('未生成链接');
  }
  let numberString = '';
  selectPeopleAllData.value.forEach((element:any, index:number) => {
    numberString += element.mobile1;
    if (index < selectPeopleAllData.value.length - 1) {
    numberString += ',';
    }
  });
  const sendData:any = {
    smstypeId: '',
    caseId: 0,
    content: props.linkInfo,
    phoneNum: numberString,
    contactorIds: '',
};
  sendMsg(sendData);
  showDialog.value = false;
};

    watch(() => selectAllValue.value, (val, old) => {
      console.log(selectAllValue.value);
      if (selectAllValue.value) {
          chooseCheckArr.value = [];
          peopleListData.value.forEach((element:any) => {
            chooseCheckArr.value.push(element.id);
          });
      } else {
          chooseCheckArr.value = [];
      }
      selectPeopleListData.value = [];
      peopleListData.value.forEach((element:any, index:number) => {
        if (chooseCheckArr.value.includes(element.id)) {
          (selectPeopleListData.value as any).push(element);
        }
      });
      console.log(selectPeopleListData.value);
      getAllRightData();
    });
    return {
    showDialog,
      open,
      close,
      chooseCheckArr,
      getSelectList,
      peopleListData,
      selectAllValue,
      showAdd,
      groupPersonDataFun,
      selectPeopleAllData,
      sureFun,
      addnumber,
      clearAll,
      senMsgFun,
    };
  },
});
</script>

<style lang="scss" src="./style/SelectContactor.scss"></style>
