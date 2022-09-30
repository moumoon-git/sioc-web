<!--选择联系人-->
<template>
  <div class="contactor-search-result-container">
    <main @scroll="handleScroll">
      <ul v-if="newContactorList.length > 0" class="contactor-list">
        <li
          v-for="(item, index) in newContactorList"
          :key="item.id"
          class="contactor-list__item"
          @click="selectContactor(item, index)"
        >
          <div class="contactor-list__item__left">
            <p class="name">{{ item.name }}</p>
            <p class="position">{{ item.workUnit && item.position ? (item.workUnit + '/' + item.position) : ((item.workUnit || '') + (item.position || '')) }}</p>
          </div>
          <div class="contactor-list__item__right">
            <div :class="item.checked ? 'checked' : ''"></div>
          </div>
        </li>
      </ul>
      <div v-else-if="newContactorList.length === 0 && !loading" class="noData">
        <img src="../../Annunciate/assets/svg/noData.svg" alt="" class="noData__img" />
        <span class="noData__text">暂无数据</span>
      </div>
      <van-loading v-if="loading" size="0.36rem" color="#0094ff" class="reset-loading">搜索中...</van-loading>
    </main>

    <footer :class="moduleName === 'annunciate' ? 'footer2' : 'footer1'">
      <template v-if="moduleName === 'task'">
        <div class="footer__left" @click="showPopup">已选择：{{ selectedContactorList.length }}人</div>
        <div class="footer__right">
          <Button class="reset-button-style" type="default" @click="onComfirm">
            确定
          </Button>
        </div>
      </template>

      <template v-if="moduleName === 'annunciate'">
        <Button
          class="button-style"
          type="default"
          :font-size="'0.4rem'"
          @click="transferConfirm"
        >
          转交
        </Button>
        <Button
          class="button-style"
          type="primary"
          :font-size="'0.28rem'"
          @click="transferCancel"
        >
          取消
        </Button>
      </template>
    </footer>

    <van-popup v-model:show="show" round position="bottom" :style="{ height: '30%' }">
      <div class="footer1">
        <div class="footer__left">已选择：{{ selectedContactorList.length }}人</div>
        <div class="footer__right">
          <Button class="reset-button-style" type="default" @click="onComfirm">
            确定
          </Button>
        </div>
      </div>
      <ul v-if="selectedContactorList.length > 0" class="contactor-list">
        <li
          v-for="(item, index) in selectedContactorList"
          :key="index"
          class="contactor-list__item"
        >
          <div class="contactor-list__item__left">
            <p class="name">{{ item.name }}</p>
            <p class="position">{{ item.workUnit && item.position ? (item.workUnit + '/' + item.position) : ((item.workUnit || '') + (item.position || '')) }}</p>
          </div>
          <div class="contactor-list__item__right">
            <div class="close" @click="closeContactor(item, index)"></div>
          </div>
        </li>
      </ul>
    </van-popup>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';
import { Notify, Toast } from 'vant';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ContactorSearchResult',
  components: {
    Button,
  },
  props: {
    contactorList: {
      type: Array,
      default: () => [],
    },
    moduleName: {
      type: String,
      default: '',
    },
    // 加载效果
    loading: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    contactorList: {
      handler(newVal) {
        if (newVal) {
          this.newContactorList = newVal.map((item: any) => {
            let contactor = { ...item };
            Object.assign(contactor, { checked: false });
            return contactor;
          }) 
        }
      },
      deep: true,
      immediate: true,
    }
  },
  setup(props, {emit}) {
    console.log(props)
    const store = useStore();
    const router = useRouter();
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    // 已选中的联系人
    const selectedContactorList: any = ref([]);
    // 弹出层
    const show = ref(false);
    const newContactorList: any = ref([]);
    const choiceNumber = ref(store.state.searchContactorsPage.choiceNumber); // multiple or single
    console.log('searchContactorsPage', store.state.searchContactorsPage)
    /**
     * @description 显示弹出层
     */
    function showPopup() {
      show.value = true;
    }

    /**
     * @description 确定提交选中的联系人
     */
    function onComfirm() {
      const searchContactorsPage = {
        // 搜索联系人页面的导航栏配置
        navBarConfig: store.state.searchContactorsPage.navBarConfig,
        // 搜索记录
        searchHistory: store.state.searchContactorsPage.searchHistory,
        // 选中的联系人
        selectedContactors: selectedContactorList.value,
        choiceNumber:  choiceNumber.value, // single or multiple
        moduleName: props.moduleName, // 模块名
      }
      store.commit('setSearchContactorsPage', searchContactorsPage);
       
      console.log('确定', selectedContactorList)
      router.push({
        path: '/UpdateTask',
        query: {
          activeTabIndex: 1 // 跳转到任务成员
        }
      })
    }
    /**
     * @description 转接联系人
     */
    function transferResponse(contactorId: string | number) {
      let requestData: any = ref({
        method: 'post',
        service: 'app',
        url: `/response/transferResponseDetail?distributionId=${store.state.reserve.distributionId}&contactorId=${contactorId}`,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          if (res.errorcode === 0) {
            router.push({
              path: `/Annunciate/${store.state.reserve.distributionId}`
            })
             Notify({
              type: 'success',
              message: `转交成功`,
            });
          }
        })
        .catch((error: any) => {
          if (error.errorcode) {
            Notify({
              type: 'danger',
              message: `转交失败，错误代码${error.errorcode}，错误信息：${error.msg}`,
            });
          }
        });
    }

    /**
     * @description 触底加载下一页数据
     */
    function handleScroll(e: any) {
      const {scrollHeight, scrollTop, clientHeight} = e.target;
      if(scrollHeight - scrollTop === clientHeight) {
        emit('scroll');
      }
    }
    return {
      selectedContactorList,
      showPopup,
      show,
      onComfirm,
      newContactorList,
      choiceNumber,
      transferResponse,
      handleScroll,
    };
  },
  methods: {
    /**
     * @description 选择联系人
     */
    selectContactor(item: any, index: number) {
      // 单选
      if(this.choiceNumber === 'single') {
        this.newContactorList = this.newContactorList.map((el: any) => {
          el.checked = false;
          return el;
        })
      }
      this.newContactorList[index].checked = !this.newContactorList[index].checked;
      this.selectedContactorList = [...this.newContactorList.filter((el: any) => !!el.checked)];
    },

    /**
     * @description 删除联系人
     */
    closeContactor(item: any, index: number) {
      const _index = this.newContactorList.findIndex((el: any) => el.id === item.id);
      this.newContactorList[_index].checked = !this.newContactorList[_index].checked;
      this.selectedContactorList = [...this.newContactorList.filter((el: any) => !!el.checked)];
    },

    /**
     * @description 确认转交
     */
    transferConfirm() {
      console.log('转交：', this.selectedContactorList)
      this.transferResponse(this.selectedContactorList[0].id)
    },
    
    /**
     * @description 取消转交
     */
    transferCancel() {
      this.$router.go(-1);
    },

  }
});
</script>

<style lang="scss">
.contactor-search-result-container {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 0.2rem solid #f5f5f5;

  .contactor-list {
    width: 100%;

    &__item {
      min-height: 1.17rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.31rem;
      box-sizing: border-box;
      border-bottom: 0.01rem solid #dddddd;

      &__left {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name {
          font-size: 0.32rem;
          font-weight: 400;
          color: #333333;
          line-height: 0.45rem;
          margin: 0;
        }

        .position {
          font-size: 0.24rem;
          font-weight: 400;
          color: #999999;
          line-height: 0.33rem;
          margin: 0;
        }
      }

      &__right {
        width: 0.34rem;
        height: 0.25rem;

        .checked {
          width: 0.34rem;
          height: 0.25rem;
          background: url('../assets/svg/tick.svg');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        .close {
          width: 0.32rem;
          height: 0.32rem;
          background: url('../assets/svg/close.svg');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }

  main {
    flex: 1;
    overflow: scroll;

    .noData {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50%;

      &__text {
        font-size: 0.28rem;
        font-weight: 400;
        color: #999999;
      }

      &__img {
        width: 1.52rem;
        height: 1.37rem;
      }
    }
  
    .reset-loading {
      width: 100%;
      height: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.36rem;
    }
  }

  .footer1 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 7.5rem;
    height: 0.89rem;
    background: #ffffff;
    padding: 0 0.14rem;
    box-sizing: border-box;

    .footer__left {
      padding: 0 0.12rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #0091ff;
    }

    .footer__right {
      .reset-button-style {
        width: 1.36rem;
        height: 0.61rem;
        border-radius: 0.06rem;
        background: #0091ff;
        box-shadow: none;
        font-size: 0.32rem;
      }
    }
  }

  .footer2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 2.3rem;
    background: #FFFFFF;
    box-shadow: 0rem -0.01rem 0.01rem 0rem rgba(116, 116, 116, 0.3);
    box-sizing: border-box;
    padding-top: 0.3rem;

    .button-style {
      width: 6.4rem;
      height: 0.9rem;
    }
  }
}
</style>
