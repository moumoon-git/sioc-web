<!--任务动态-消息接收人列表-->
<template>
  <div :class="$style['chat-reciever-list-module']">
    <!-- 导航栏 -->
    <NavBar :config="navBarConfig" :reset-back="true" @back="handleClickBack" />
    <!-- tabs页 -->
    <Tabs :active="activeNavIndex" :tabList="tabList" @handleClickTab="handleClickTab" />
    <main :class="$style.main">
      <!-- 未读 -->
      <template v-if="activeNavIndex === 0">
        <div v-for="item in unread" :key="item.id" :class="$style.list">
          <div :class="$style['list__left']">
            <div :class="$style.head">
              {{
                item.name.length > 2
                  ? item.name.substring(
                      item.name.length - 2,
                      item.name.length,
                    )
                  : item.name
              }}
            </div>
          </div>
          <div :class="$style['list__right']">
            <span :class="$style.name">{{ item.name + '（' + item.contactType + '）' }}</span>
          </div>
        </div>
      </template>
      <!-- 已读 -->
      <template v-else>
        <div v-for="item in read" :key="item.id" :class="$style.list">
          <div :class="$style['list__left']">
            <div :class="$style.head">
              {{
                item.name.length > 2
                  ? item.name.substring(
                      item.name.length - 2,
                      item.name.length,
                    )
                  : item.name
              }}
            </div>
          </div>
          <div :class="$style['list__right']">
            <span :class="$style.name">{{ item.name + '（' + item.contactType + '）' }}</span>
          </div>
        </div>
      </template>
      <div
        v-if="
          (activeNavIndex === 0 && unread.length === 0) ||
            (activeNavIndex === 1 && read.length === 0)
        "
        :class="$style.noData"
      >
        <div
          v-if="activeNavIndex === 0 && unread.length === 0"
          :class="$style['noData-icon1']"
        ></div>
        <div v-if="activeNavIndex === 1 && read.length === 0" :class="$style['noData-icon2']"></div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from 'vue';
import NavBar from '@/product/SIOC-H5/generalparts/NavBar/NavBar.vue';
import Tabs from '@/product/SIOC-H5/generalparts/Tabs/Tabs.vue';

export default defineComponent({
  name: 'ChatRecieverList',
  components: {
    NavBar,
    Tabs,
  },
  props: {
    id: {
      default: '',
      type: [String, Number]
    },
  },
  setup(props, {emit}) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    // 导航栏配置
    const navBarConfig = {
      title: '消息接收人列表',
      type: 'left',
      path: '',
    };
    const activeNavIndex = ref(0); // 当前激活的Tabs页面
    // Tabs页面菜单
    const tabList = ref([
      {
        tabName: '未读',
      },
      {
        tabName: '已读',
      },
    ]);
    // 已读
    const read = ref([]);
    // 未读
    const unread = ref([]);
    // 切换Tabs页面菜单
    function handleClickTab(val: any) {
      activeNavIndex.value = val;
    }

    getReadStatusDetail(props.id);
    /**
     * @description 获取反馈阅读状态
     */
    function getReadStatusDetail(id: any) {
      let data = new FormData();
      data.append('resultId', id);
      // 接口请求数据
      const requestData = {
        method: 'post',
        service: 'app',
        url: `/task/getReadStatusDetail`,
        data,
      };
      ($http as any)(requestData).then((res: any) => {
        if (res.errorcode === 0) {
          read.value = res.data.read;
          unread.value = res.data.unread;
          tabList.value[0].tabName =
            res.data.unread.length > 0 ? `未读（${res.data.unread.length}）` : '未读';
          tabList.value[1].tabName =
            res.data.read.length > 0 ? `已读（${res.data.read.length}）` : '已读';
        }
      });
    }
    /**
     * @description 返回
     */
    function handleClickBack() {
      emit('back')
    }
    return {
      tabList,
      activeNavIndex,
      handleClickTab,
      navBarConfig,
      read,
      unread,
      handleClickBack,
    };
  },
});
</script>

<style lang="scss" module>
.chat-reciever-list-module {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .main {
    border-top: 0.2rem solid #f5f5f5;
    overflow-y: scroll;
    flex: 1;
    background: #ffffff;
  }

  .list {
    display: flex;
    align-items: center;
    border-bottom: 0.01rem solid #dddddd;
    margin: 0 0.4rem;
    height: 1.04rem;
    width: calc(100% - 0.8rem);
    box-sizing: border-box;

    &__left {
      display: flex;
      align-items: center;
      justify-content: center;

      .head {
        width: 0.64rem;
        height: 0.64rem;
        line-height: 0.64rem;
        background: #0bd295;
        border-radius: 50%;
        font-size: 0.24rem;
        font-weight: 400;
        color: #ffffff;
        text-align: center;
      }
    }

    &__right {
      padding-left: 0.24rem;

      .name {
        font-size: 0.32rem;
        font-weight: 400;
        color: #333333;
      }
    }
  }

  .noData {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background: #F5F5F5;
    justify-content: center;
    padding-top: 40%;
    box-sizing: border-box;

    &-icon1 {
      width: 1rem;
      height: 1rem;
      background: url(./assets/images/unread.svg);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;

      &::after {
        width: 2rem;
        position: absolute;
        top: 1.18rem;
        left: calc(50% - 1rem);
        content: '全部成员已读';
        display: block;
        color: #c8c9cc;
        text-align: center;
      }
    }

    &-icon2 {
      width: 1rem;
      height: 1rem;
      background: url(./assets/images/read.svg);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;

      &::after {
        width: 2rem;
        position: absolute;
        top: 1.18rem;
        left: calc(50% - 1rem);
        content: '全部成员未读';
        display: block;
        color: #c8c9cc;
        text-align: center;
      }
    }
  }
}
</style>
