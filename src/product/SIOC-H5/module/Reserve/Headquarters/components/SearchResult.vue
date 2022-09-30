<template>
  <div class="search-result-container">
    <header>
      <!-- 搜索框 -->
      <Search
        ref="searchRef"
        v-model:modelValue="searchTxt"
        :placeholder="'请输入联系人姓名、单位、职务、电话关键字'"
      >
        <Button type="text" :fontSize="'0.28rem'" @click="cancelSearch">取消</Button>
      </Search>
    </header>
    <!-- 主体内容 -->
    <main>
      <template v-if="searchTxt === ''">
        <section class="search-record-title">
          <label class="search-record-title__label">搜索记录</label>
          <i class="search-record-title__delete" @click="showDeleteIcon"></i>
        </section>
        <ul class="search-record-content">
          <li
            v-if="searchHistory.length > 0"
            v-for="item in searchHistory"
            :key="item"
            @click="handleDelectSearchHistory(item)"
          >
            <label>{{ item }}</label>
            <i v-if="isDeleteVisible"></i>
          </li>
          <span v-else class="no-data">暂无数据</span>
        </ul>
      </template>

      <div v-else class="search-result-container__body" style="display:none;">
        <!-- 联系人 -->
        <div class="contactors-container">
          <div class="groups-type__label">联系人</div>
          <template v-if="dutyPersonArray.length > 0">
            <Contactor
              v-for="(item, index) in dutyPersonArray"
              :key="item.id"
              :contactor="item"
              :style="{ border: index === dutyPersonArray.length - 1 ? 'none' : '' }"
              @click="jumpToContactorInformation"
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
              @click="handleSelectUnit(item)"
            >
              <span>{{ item.name }}</span>
              <img src="../assets/svg/right.png" alt="" />
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
              @click="handleSelectUnit(item)"
            >
              <span>{{ item.name }}</span>
              <img src="../assets/svg/right.png" alt="" />
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
export default defineComponent({
  name: 'SearchResult',
  components: {
    Search,
    Button,
    Contactor,
  },
  setup() {
    const instance: any = getCurrentInstance();
    const { $http } = instance?.appContext.config.globalProperties;
    const store = useStore();
    const isSearching: any = inject('isSearching');
    const isDeleteVisible = ref(false);
    const searchTxt = ref('');
    const eventId: any = inject('eventId');
    const groupArray: any = ref([]); // 功能组
    const dutyPersonArray: any = ref([]); // 领导班子的负责人
    const deptArray: any = ref([]); // 部门
    const searchHistory: any = ref(
      store.state.reserve.searchHistory ? store.state.reserve.searchHistory : [],
    );
    const searchRef = ref<typeof Search | null>(null);

    /**
     * @description 取消搜索
     */
    function cancelSearch() {
      isSearching.value = false;
    }

    /**
     * @description 开启删除历史
     */
    function showDeleteIcon() {
      isDeleteVisible.value = !isDeleteVisible.value;
    }

    /**
     * @description 删除历史
     */
    function handleDelectSearchHistory(item: string) {
      if (isDeleteVisible.value) {
        const _index: number = searchHistory.value.findIndex((el: string) => el === item);
        if (_index > -1) {
          searchHistory.value.splice(_index, 1);
        }
        store.commit('reserve/setSearchHistory', searchHistory.value);
      } else {
        if (searchRef.value) {
          searchRef.value.searchTxt = item;
          searchStructTreeEvent(); // 搜索
        }
      }
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

    watch(searchTxt, (newValue: any, oldValue: any) => {
      if (newValue === '') {
        return;
      }
      const _index: number = searchHistory.value.findIndex((el: string) => el === newValue);
      if (_index > -1) {
        searchHistory.value.splice(_index, 1);
      }
      searchHistory.value.unshift(newValue);
      store.commit('reserve/setSearchHistory', searchHistory.value);
      if (newValue !== '') {
        searchStructTreeEvent(); // 搜索
      }
    });

    return {
      cancelSearch,
      showDeleteIcon,
      isDeleteVisible,
      searchTxt,
      groupArray,
      deptArray,
      dutyPersonArray,
      searchHistory,
      handleDelectSearchHistory,
      searchRef,
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
        background: url(../assets/svg/deleteIcon.svg) no-repeat 0rem/0.2rem;
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
          background: url(../assets/svg/closeIcon.svg) no-repeat 0rem/0.2rem;
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
