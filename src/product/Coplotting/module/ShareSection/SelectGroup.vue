// 选择分组
<template>
  <ElDialog
    v-model="showDialog"
    :modal="false"
    custom-class="sv-dialog"
    title="添加分组"
    center
    :width="533"
  >
    <div class="shareSelectGroupSection">
      <div class="shareSelectGroupSection__search">
        <div class="shareSelectGroupSection__search__left">
          设置分享的标绘分组
        </div>
        <div class="shareSelectGroupSection__search__btns">
          <div class="shareSelectGroupSection__search__btns__name">
            全部分组
          </div>
          <div class="shareSelectGroupSection__search__btns__open">
            <el-switch
              v-model="selectAllValue"
              active-color="#0091FF"
              inactive-color="#999"
            />
          </div>
        </div>
      </div>
      <div class="shareSelectGroupSection__tree">
        <div
          v-for="(item, index) in allGroupData"
          :key="index"
          class="shareSelectGroupSection__tree__item"
        >
          <div class="shareSelectGroupSection__tree__item__checkbox">
            <input
              v-model="chooseCheckArr"
              type="checkbox"
              :disabled="isDisabled"
              :value="item.id"
              @change="getSelectList()"
            />
          </div>
          <div class="shareSelectGroupSection__tree__item__name">
            {{ item.groupName }}
          </div>
        </div>
      </div>
      <div class="shareSelectGroupSection__footer">
        <div class="shareSelectGroupSection__footer__left">
          已选择 ({{ chooseCheckArr.length }})
        </div>
        <div class="shareSelectGroupSection__footer__btns">
          <div
            class="shareSelectGroupSection__footer__btns__next"
            @click="showDialog = false"
          >
            上一步
          </div>
          <div
            class="shareSelectGroupSection__footer__btns__cancle"
            @click="addShareFun"
          >
            分享
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    selectPlatFormData: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const route = useRoute();
    const store = useStore(); // 使用vuex
    const thisMapId: any = ref(0); // 当前的地图id
    thisMapId.value = route.query.mapId;
    const showDialog = ref(false);
    const selectAllValue = ref(false); // 开关
    const allGroupData = ref(['上海', '北京', '广州', '深圳']);
    const templateRenderData = ref([]); // 模板渲染的数据
    const isDisabled = ref(false);
    // 打开
    const open = () => {
      showDialog.value = true;
    };
    // 关闭
    const close = () => {
      showDialog.value = false;
    };
    // 获取分组数据
    const allGroupListData = ref([]);
    const getGroupData = () => {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assistmapgroup/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          mapId: store.state.coplotting.mapId,
        },
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            allGroupListData.value = response.data;
            allGroupData.value = response.data; // 渲染数据
            console.log('所有分组:');
            console.log(allGroupData.value);
            console.log('要添加的分组id:');
            console.log(chooseCheckArr.value);
            console.log('处理后的要添加的分组');
            console.log(dealGroupArr(allGroupData.value, chooseCheckArr.value));
            returnListData(
              dealGroupArr(allGroupData.value, chooseCheckArr.value),
            );
          } else {
            ElMessage.error(
              `获取分组数据失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`获取分组数据失败，错误信息：${error}`);
        });
    };
    // 处理选择的分组数组
    // arr 所有的分组数据，topicArr 此时选中的分组数据
    const dealGroupArr = (arr: any, topicArr: any) => {
      const returnArr: any = [];
      arr.forEach((item: any) => {
        if (topicArr.includes(item.id)) {
          returnArr.push(item);
        }
      });
      return returnArr;
    };
    // 将获取的数据处理成接口数据
    const returnListData = (arr: any) => {
      const tempArr = props.selectPlatFormData;
      tempArr.forEach((item: any) => {
        item.groupData = arr;
      });
      const sendArrObj: any = [];
      arr.forEach((item: any) => {
        const tempObj: any = {};
        tempObj.groupId = item.id;
        tempObj.name = item.groupName;
        tempObj.rights = '0';
        sendArrObj.push(tempObj);
      });
      const allData: any = [];
      tempArr.forEach((item: any) => {
        const sendObj: any = {};
        sendObj.cooperatePlatformId = item.id;
        sendObj.name = item.name;
        sendObj.enableBasicClassIds = [];
        sendObj.groupRights = sendArrObj;
        allData.push(sendObj);
      });
      (templateRenderData.value as any) = allData;
      console.log(templateRenderData.value); // 分享接口需要的数据格式
    };
    // 添加分享
    function addShareFun() {
      const sendObjData = {
        cooperatePlatforms: templateRenderData.value,
        mapId: thisMapId.value,
        type: 1, // 分享传1、协作传0
      };
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistinvitecooperaterecord/addCooperate',
        headers: {
          'Content-Type': 'application/json',
        },
        data: sendObjData,
      };
      $http(request)
        .then((response: any) => {
          if (response.code === 0) {
            showDialog.value = false;
            // emit('closeEmit'); // 关闭父级弹框
            // store.commit('coplotting/SET_REFRASHCOOP', true);
            ElMessage.success({
              message: '分享成功',
              type: 'success',
            });
            store.commit('coplotting/SET_isRefreshShareList', true);
          } else {
            ElMessage.error(
              `分享失败，错误代码${response.code}，错误信息：${response.msg}`,
            );
          }
        })
        .catch((error: Error) => {
          ElMessage.error(`分享失败，错误信息：${error}`);
        });
    }
    // 多选
    const chooseCheckArr: any = ref([]);
    // 复选框勾选方法
    function getSelectList() {
      console.log(chooseCheckArr.value);
      returnListData(
        dealGroupArr(allGroupListData.value, chooseCheckArr.value),
      );
      console.log('最终的参数数据');
      console.log(templateRenderData.value);
    }
    // 监听开关
    watch(
      () => selectAllValue.value,
      (val, old) => {
        if (selectAllValue.value) {
          chooseCheckArr.value = [];
          allGroupData.value.forEach((item: any) => {
            chooseCheckArr.value.push(item.id);
          });
          console.log(chooseCheckArr.value);
          isDisabled.value = true;
        } else {
          chooseCheckArr.value = [];
          console.log(chooseCheckArr.value);
          isDisabled.value = false;
        }
        returnListData(
          dealGroupArr(allGroupListData.value, chooseCheckArr.value),
        );
        console.log('最终的参数数据');
        console.log(templateRenderData.value);
      },
    );
    return {
      showDialog,
      open,
      close,
      selectAllValue,
      allGroupData,
      getSelectList,
      chooseCheckArr,
      isDisabled,
      getGroupData,
      addShareFun,
    };
  },
});
</script>

<style lang="scss" src="./style/SelectGroup.scss"></style>
