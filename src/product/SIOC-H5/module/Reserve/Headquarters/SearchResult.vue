<template>
  <div class="search-result-container">
    <header>
      <!-- 导航栏 -->
      <NavBar :config="navBarConfig" />
      <!-- 搜索框 -->
      <Search
        ref="searchRef"
        v-model:modelValue="searchTxt"
        :readonly="false"
        :placeholder="'请输入联系人姓名、单位、职务、电话关键字'"
        @click="cancelSearch"
      >
        <Button type="text" @click="cancelSearch">取消</Button>
      </Search>
    </header>
    <!-- 主体内容 -->
    <main>
      <div class="search-result-container__body">
        <!-- 联系人 -->
        <div class="contactors-container">
          <div class="groups-type__label">联系人</div>
          <template v-if="dutyPersonArray.length > 0">
            <Contactor
              v-for="(item, index) in dutyPersonArray"
              :key="item.id"
              :contactor="item"
              :style="{ border: index === dutyPersonArray.length - 1 ? 'none' : '' }"
              @click="jumpToContactorInformation(item)"
            />
          </template>
          <span v-else class="no-data">暂无数据</span>
        </div>

        <!-- 功能组 -->
        <div class="functional-groups" style="border-bottom: 0.2rem solid #F5F5F5;">
          <div class="groups-type__label">功能组</div>
          <template v-if="groupArray.length > 0">
            <div
              v-for="(item, index) in groupArray"
              :key="item.id"
              class="headquarters-unit-item"
              :style="{ border: index === groupArray.length - 1 ? 'none' : '' }"
              @click="handleSelectFunGroup(index, item)"
            >
              <span>{{ item.name }}</span>
              <img src="./assets/svg/right.png" alt="" />
            </div>
          </template>
          <span v-else class="no-data">暂无数据</span>
        </div>

        <!-- 单位 -->
        <div class="functional-groups">
          <div class="groups-type__label">单位</div>
          <template v-if="deptArray.length > 0">
            <div
              v-for="(item, index) in deptArray"
              :key="item.id"
              class="headquarters-unit-item"
              @click="handleSelectUnit(index, item)"
            >
              <span>{{ item.name }}</span>
              <img src="./assets/svg/right.png" alt="" />
            </div>
          </template>
          <span v-else class="no-data">暂无数据</span>
        </div>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch, getCurrentInstance } from 'vue';
import Search from '@/product/SIOC-H5/generalparts/SearchInput/SearchInput.vue';
import Button from '@/product/SIOC-H5/generalparts/Button/Button.vue';
import Contactor from '@/product/SIOC-H5/generalparts/Contactor/Contactor.vue';
import { Notify, Toast } from 'vant';
import { useStore } from 'vuex';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'SearchResult',
  components: {
    Search,
    Button,
    Contactor,
    NavBar,
  },
  setup() {
    const router = useRouter();
    const instance: any = getCurrentInstance();
    const { $http } = instance?.appContext.config.globalProperties;
    const store = useStore();
    const searchTxt: any = ref(
      router.currentRoute.value.params.searchTxt ? router.currentRoute.value.params.searchTxt : '',
    );
    const eventId: any = ref(store.state.reserve.eventId);
    const groupArray: any = ref([]); // 功能组
    const dutyPersonArray: any = ref([]); // 领导班子的负责人
    const deptArray: any = ref([]); // 部门
    const searchRef = ref<typeof Search | null>(null);

    // 导航栏配置
    const navBarConfig = ref({
      title: '现场指挥部',
      type: 'left',
      path: '',
    });

    /**
     * @description 跳转到联系人详情
     */
    function jumpToContactorInformation(item: any) {
      router.push({
        path: `/ContactorInformation/${item.contactorId}`,
      });
    }

    /**
     * @description 取消搜索
     */
    function cancelSearch() {
      router.go(-1);
    }

    function handleSelectUnit(index: number, item: any) {
      router.push({
        path: '/SearchResultDetail',
      });
      store.commit('reserve/setIsFunctionalGroup', false);
      store.commit('reserve/setSearchResultData', deptArray.value[index]);
      store.commit('reserve/setSelectedResultData', item);
    }
    function handleSelectFunGroup(index: number, item: any) {
      router.push({
        path: '/SearchResultDetail',
      });
      store.commit('reserve/setIsFunctionalGroup', true);
      store.commit('reserve/setSearchResultData', groupArray.value[index]);
      store.commit('reserve/setSelectedResultData', item);
    }

    /**
     * @description 获取预案事件的经纬度等信息
     */
    function searchStructTreeEvent() {
      const formData = new FormData();
      formData.append('key', String(searchTxt.value)); // 1:指挥部2:为功能组
      formData.append('eventId', String(eventId.value)); // 事件Id
      formData.append('deptOnly', ''); // 传空串表示 包括部门下的人，不为空表示人
      let requestData: any = ref({
        method: 'post',
        service: 'soc',
        // url: `/eventconduct/eventSceneonductSign/searchStructTreeEvent`,
        url: `/eventconduct/eventSceneonductSign/searchStructTreeEvent?apiVersion=0.0.2`,
        headers: {
          'Content-Type': 'multipart/form-data ',
        },
        data: formData,
      });
      ($http as any)(requestData.value)
        .then((res: any) => {
          if (res.code === 0) {
            if (
              (!res.data.groupArray && !res.data.deptArray && !res.data.dutyPersonArray) ||
              (res.data.groupArray.length === 0 &&
                res.data.deptArray.length === 0 &&
                res.data.dutyPersonArray.length === 0)
            ) {
              Toast({
                message: '暂无数据',
                icon: 'close',
              });
            }
            groupArray.value = res.data.groupArray;
            deptArray.value = res.data.deptArray;
            res.data.dutyPersonArray.forEach((el: any) => {
              dutyPersonArray.value.push({
                contactorId: el.contactorId,
                id: el.id,
                picture: el.images, // 头像图片
                sex: el.sex ? (el.sex === 0 ? '男' : '女') : '男', // 性别
                name: el.name, // 姓名
                position: el.dutyName, // 职务
                unit: el.deptName, // 单位
                title: el.remark, // 头衔
              });
            });
          } else {
          }
        })
        .catch((error: any) => {
          if (error.code) {
            Notify({
              type: 'danger',
              message: `获取经纬度信息失败，错误代码${error.code}，错误信息：${error.msg}`,
            });
          }
        });
    }

    onMounted(() => {
      if (searchRef.value) {
        searchRef.value.searchTxt = searchTxt.value;
        searchStructTreeEvent(); // 搜索
      }
    });
    return {
      cancelSearch,
      searchTxt,
      groupArray,
      deptArray,
      dutyPersonArray,
      searchRef,
      navBarConfig,
      handleSelectUnit,
      handleSelectFunGroup,
      jumpToContactorInformation,
    };
  },
});
</script>
<style lang="scss">
.search-result-container {
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;

  // 搜索框
  .search-container {
    box-sizing: border-box;
    height: 0.9rem;
    padding: 0.2rem 0.12rem 0.2rem 0.32rem;

    & > button {
      padding: 0 0.2rem;
    }
  }

  .contactors-container {
    background: #ffffff;
    padding: 0 0.32rem;
    box-sizing: border-box;
    border-bottom: 0.2rem solid #f5f5f5;
    border-top: 0.2rem solid #f5f5f5;
  }

  .groups-type__label {
    width: 100%;
    height: 0.8rem;
    font-size: 0.28rem;
    font-weight: 500;
    color: #333333;
    line-height: 0.8rem;
    box-sizing: border-box;
    border-bottom: 1px solid #dddddd;
  }

  // 单位
  .functional-groups {
    padding: 0 0.32rem;
    box-sizing: border-box;
    background: #ffffff;
    flex: 1;
    overflow: auto;

    .headquarters-unit-item {
      height: 0.9rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 0.01rem solid #dddddd;

      & > span {
        font-size: 0.28rem;
        font-weight: 400;
        color: #333333;
        line-height: 0.9rem;
      }

      & > img {
        width: 0.18rem;
        height: 0.3rem;
      }
    }
  }

  main {
    .search-record-title {
      margin: 0.05rem 0rem;
      padding: 0rem 4%;
      position: relative;
      display: flex;
      align-items: center;
      .search-record-title__label {
        color: #333333;
        font-size: 0.3rem;
        font-weight: 500;
      }
      .search-record-title__delete {
        cursor: pointer;
        width: 0.2rem;
        height: 0.2rem;
        display: inline-block;
        background: url(./assets/svg/deleteIcon.svg) no-repeat 0rem/0.2rem;
        position: absolute;
        right: 4%;
      }
    }
    .search-record-content {
      margin: 0.05rem 0rem;
      padding: 0rem 4%;
      position: relative;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      li {
        position: relative;
        margin: 2.5% 1.5%;
        label {
          color: #7e7e7e;
          background: #f8f8f8;
          border-radius: 1rem;
          padding: 0.1rem 0.3rem;
          white-space: nowrap;
        }
        i {
          cursor: pointer;
          width: 0.2rem;
          height: 0.2rem;
          display: inline-block;
          background: url(./assets/svg/closeIcon.svg) no-repeat 0rem/0.2rem;
          position: absolute;
          top: -0.15rem;
          right: -0.02rem;
        }
      }
    }
  }
  .no-data {
    font-size: 0.28rem;
    color: #cccccc;
    height: 0.9rem;
    line-height: 0.9rem;
  }
}
</style>
