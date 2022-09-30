// 组织架构
<template>
  <div class="structure__section">
    <div class="structure__section__left">
      <div class="structure__section__left__top">
        <div
          :class="['structure__section__left__top__item',{'structure__section__left__top__item--active':selectId===1}]"
          @click="getContactTree"
        >
          <div class="structure__section__left__top__icon1" />
          <div
            class="structure__section__left__top__title"
          >
            通讯录
          </div>
        </div>
        <div
          :class="['structure__section__left__top__item',{'structure__section__left__top__item--active':selectId===4}]"
          @click="switchToExpert"
        >
          <div class="structure__section__left__top__icon4" />
          <div
            class="structure__section__left__top__title"
          >
            专家
          </div>
        </div>
        <div
          :class="['structure__section__left__top__item',{'structure__section__left__top__item--active':selectId===2}]"
          @click="getSpecilTree"
        >
          <div class="structure__section__left__top__icon2" />
          <div class="structure__section__left__top__title">
            专项指挥部
          </div>
        </div>
        <div
          :class="['structure__section__left__top__item',{'structure__section__left__top__item--active':selectId===3}]"
          @click="getSceneTree"
        >
          <div class="structure__section__left__top__icon3" />
          <div class="structure__section__left__top__title">
            现场指挥部
          </div>
        </div>
      </div>
      <div class="structure__section__left__bottom">
        <!-- 通讯录 -->
        <div
          v-if="selectId===1"
          class="structure__section__left__bottom__contactSection"
        >
          <div class="structure__contactSection__search">
            <Search
              :placeholder="'请输入姓名、电话号码'"
              @searchFun="searchFun"
            />
          </div>
          <template v-if="!isShowSearchContent">
            <!-- 最近 -->
            <div class="structure__contactSection__recent">
              <div
                class="structure__contactSection__recent__title"
                @click="recentContactSectionExpand=!recentContactSectionExpand"
              >
                <div class="structure__contactSection__recent__title--icon" />
                <div
                  class="structure__contactSection__recent__title--name"
                  @click="getRecentPeople()"
                >
                  最近联系人
                </div>
              </div>
            </div>
            <!-- 常用 -->
            <div class="structure__contactSection__use">
              <div
                class="structure__contactSection__use__title"
                @click="useContactSectionExpand=!useContactSectionExpand"
              >
                <div class="structure__contactSection__use__title--icon" />
                <div
                  class="structure__contactSection__use__title--name"
                  @click="getUsePeople()"
                >
                  常用联系人
                </div>
              </div>
            </div>
            <!-- 树 -->
            <div class="structure__contactSection__tree">
              <Tree
                :show-check-box="false"
                :is-show-folder="true"
                :data="treeData"
                @node-click="getInfoByGroupId"
              />
            </div>
          </template>
          <template v-else>
            <!-- 通讯录搜索结果 -->
            <div class="structure__contactSection__searchContent">
              <div class="structure__contactSection__searchContent__tree">
                <div class="structure__contactSection__searchContent__tree__title">
                  部门单位
                </div>
                <div class="structure__contactSection__searchContent__tree__tree">
                  <Tree
                    :show-check-box="false"
                    :is-show-folder="true"
                    :data="searchPeopleTreeList"
                  />
                </div>
              </div>
              <div class="structure__contactSection__searchContent__list">
                <div class="structure__contactSection__searchContent__list__title">
                  人员列表
                </div>
                <div class="structure__contactSection__searchContent__list__list">
                  <PersonCard
                    v-for="(item,index) in searchPeopleList"
                    :key="index"
                    :person-data="item"
                    @clickEmit="personCardClickFun(item)"
                    @updateUsePeopleEmit="getUsePeople"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- 专项指挥部 -->
        <div
          v-if="selectId===2"
          class="structure__section__left__bottom__specialSection"
        >
          <!-- 搜索框 -->
          <div class="structure__specialSection__search">
            <!-- <Search /> -->
          </div>
          <!-- 领导班子 -->
          <div
            class="structure__specialSection__leader"
            :class="{'structure__specialSection__leader--active':isShowSpecilPanel}"
            @click="showSpecilLeaderPanel"
          >
            <div class="structure__specialSection__leader__icon" />
            <div class="structure__specialSection__leader__name">
              领导班子
            </div>
          </div>
          <!-- 树形组件 -->
          <div class="structure__specialSection__tree">
            <Tree
              :show-check-box="false"
              :is-show-folder="true"
              :data="treeData"
              @node-click="getInfoByGroupId"
            />
          </div>
        </div>
        <!-- 现场指挥部 -->
        <div
          v-if="selectId===3"
          class="structure__section__left__bottom__sceneSection"
        >
          <!-- 搜索框 -->
          <div class="structure__sceneSection__search">
            <!-- <Search /> -->
          </div>
          <!-- 领导班子 -->
          <div
            class="structure__sceneSection__leader"
            :class="{'structure__sceneSection__leader--active':isShowScenePanel}"
            @click="showSceneLeaderPanel"
          >
            <div class="structure__sceneSection__leader__icon" />
            <div class="structure__sceneSection__leader__name">
              领导班子
            </div>
          </div>
          <!-- 树形组件 -->
          <div class="structure__sceneSection__tree">
            <Tree
              :show-check-box="false"
              :is-show-folder="true"
              :data="treeData"
              @node-click="getSceneInfoByGroupId"
            />
          </div>
        </div>
        <!-- 专家 -->
        <div
          v-if="selectId===4"
          class="structure__section__left__bottom__sceneSection"
        >
          <!-- 搜索框 -->
          <div class="structure__sceneSection__search">
            <ElCascader
              v-model="platformId"
              class="structure__sceneSection__search__cascader"
              :options="platformList"
              :props="{
                checkStrictly: true,
                emitPath: false,
                value: 'id',
                label: 'platformName',
              }"
              @change="getExpertTree"
            />
            <Search
              placeholder="请输入专家姓名、电话号码进行查询"
              @searchFun="searchExpert"
            />
          </div>
          <!-- 树形组件 -->
          <div
            v-if="!isShowSearchContent"
            class="structure__sceneSection__tree"
          >
            <Tree
              :show-check-box="false"
              :is-show-folder="true"
              :data="treeData"
              @node-click="getExpertInfoByGroupId"
            />
          </div>

          <div v-else class="structure__contactSection__searchContent">
            <div class="structure__contactSection__searchContent__list">
              <div class="structure__contactSection__searchContent__list__list">
                <PersonCard
                  v-for="(item,index) in searchPeopleList"
                  :key="index"
                  :person-data="item"
                  :operation="false"
                  :followable="false"
                  :is-expert="true"
                  @clickEmit="personCardClickFun(item)"
                  @updateUsePeopleEmit="getUsePeople"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="structure__section__right">
      <IndexRight
        v-if="isShowDeptPanel"
        :dept-info-obj="deptInfoObj"
        :is-from-tree-click="isFromTree"
        @refrash="refrash"
        @changeUsePeopleEmit="getUsePeople"
      />
      <ScenePanel
        v-if="isShowRightScenePanel"
        :dept-info-obj="groupInfoObj"
      />
      <SpecilContent v-if="selectId===2&&isShowSpecilPanel" />
      <SceneContent v-if="selectId===3&&isShowScenePanel" />
      <!-- 专家详情 -->
      <ExpertContent
        v-if="selectId===4"
        :list="expertList"
      />
    </div>
  </div>
  <!-- 人员详情弹窗 -->
  <PersonDetail
    ref="PersonDetailRef"
    :person-info-props="personInfoProps"
  />
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, getCurrentInstance, onMounted,
} from 'vue';
import { useStore } from 'vuex';
import IndexRight from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/module/indexRight.vue'; // 右侧面板点击树结构显示
import ScenePanel from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/module/ScenePanel.vue'; // 右侧面板点击现场树结构显示
import SpecilContent from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/module/SpecilContent.vue'; // 右侧面板点击专项领导班子显示
import SceneContent from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/module/SceneContent.vue'; // 右侧面板点击现场指挥领导班子显示
import ExpertContent from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/module/ExpertContent.vue'; // 右侧面板点击专家显示
import Tree from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/GroupTree/GroupTree.vue'; // 树形组件
import Search from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/search/Search.vue'; // 树形组件
import PersonCard from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/personCard.vue'; // 人员卡片
import PersonDetail from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/personDetail/PersonDetail.vue'; // 人员详情弹窗
import { ElCascader } from 'element-plus';

export default defineComponent({
  components: {
    IndexRight, // 右侧面板
    ScenePanel, //
    SpecilContent,
    SceneContent,
    ExpertContent,
    Tree,
    Search,
    PersonCard,
    PersonDetail, // 人员详情弹窗
  },
  props: {},
  setup() {
    const instance = getCurrentInstance();
    const { $http, $message }: any = instance?.appContext.config.globalProperties;
    const store = useStore(); // 使用vuex
    const clickType = ref(false);
    const treeData = ref([]);
    const selectId = ref(0); // 当前选中的tab
    const isShowDeptPanel = ref(false);// 显示通讯录树形点击右侧面板
    const isShowRightScenePanel = ref(false);// 显示现场指挥树形点击右侧面板
    const isShowSpecilPanel = ref(false);// 显示领导班子
    const isShowScenePanel = ref(false);// 显示领导班子
    const isShowSearchContent = ref(false);// 是否显示搜索结果
    const searchPeopleList = ref([]);// 搜索出来的人员列表
    const searchPeopleTreeList = ref([]);// 搜索出来的部门树
    const nowPreplanId = ref(0); // 现在的全局预案组织架构
    const PersonDetailRef = ref<any>(null); // 人员详情Ref
    const recentContactSectionExpand = ref(true); // 最近联系人展开
    const useContactSectionExpand = ref(true); // 常用联系人展开
    const isFromTree = ref(true);// 是来自树形结构点击还是来自常用联系人或者最近联系人点击
    // 获取默认预案的版本ID
    function getDefaultContingencyPlan() {
      const request = {
        method: 'get',
        service: 'eoc',
        url: '/eos/event/preplan/getDefault',
        params: {
          eventId: store.state.event?.id,
          caseId: store.state.event?.caseClassId,
          type: 1,
        },
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0) {
          const vid = response.data?.preplans?.versionId;
          // 存在版本ID说明启动了预案，查询预案对应的指挥部数据
          if (vid) {
            nowPreplanId.value = vid;
          }
        }
      });
    }

    // 获取通讯录左侧树结构
    function getContactTree() {
      selectId.value = 1;
      clickType.value = true;
      // getUsePeople();// 获取常用联系人列表
      // getRecentPeople();// 获取最近联系人列表
      const request = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailgroup/list',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          console.log(response.data);
          treeData.value = response.data;
        } else {
          $message.error(`获取通讯录失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取通讯录失败，错误信息：${error}`);
      });
    }

    // 获取专家左侧树结构
    const platformId = ref(Number(document.cookie.match(/platformId=([^;]*)/)?.[1]));
    const platformList = ref([]);
    function getPlatform() {
      const request = {
        method: 'GET',
        service: 'soc',
        url: '/sys/platform/getPlatformTree',
      };
      $http(request).then((response: any) => {
        platformList.value = response.data || [];
      });
    }
    const expertList = ref([]);
    function getExpertInfoByGroupId(group: any) {
      const request = {
        method: 'POST',
        service: 'soc',
        url: '/resoure/resourexpert/list',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          page: 1,
          limit: 9999,
          platformId: Number(platformId.value),
          search: '',
          groupIds: [group.id],
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          expertList.value = response.page?.list || [];
        }
      });
    }
    function getExpertTree() {
      const request = {
        method: 'GET',
        service: 'soc',
        url: '/resoure/expertGroup/listTree',
        params: {
          platformId: Number(platformId.value),
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          treeData.value = response.data || [];
          if (treeData.value.length) {
            getExpertInfoByGroupId(treeData.value[0]);
          }
        } else {
          $message.error(`获取专家分组失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取专家分组失败，错误信息：${error}`);
      });
    }
    function searchExpert(search: string) {
      if (search) {
        isShowSearchContent.value = true;
        const request = {
          method: 'POST',
          service: 'soc',
          url: '/resoure/resourexpert/list',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            page: 1,
            limit: 9999,
            platformId: Number(platformId.value),
            search,
            groupIds: [],
          },
        };
        $http(request).then((response: any) => {
          if (response.code === 0) {
            searchPeopleList.value = response.page?.list || [];
          }
        });
      } else {
        isShowSearchContent.value = false;
        searchPeopleList.value = [];
      }
    }
    function switchToExpert() {
      selectId.value = 4;
      isShowDeptPanel.value = false;
      isShowRightScenePanel.value = false;
      isShowSearchContent.value = false;
      getPlatform();
      getExpertTree();
    }

    // 获取专项左侧树结构
    function getSpecilTree() {
      getDefaultContingencyPlan();
      isShowDeptPanel.value = false;
      isShowRightScenePanel.value = false;
      selectId.value = 2;
      const request = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailgroup/getGroupResponseAndContactor',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          versionId: nowPreplanId.value, // 先写死
          structType: 1, // 1专项2现场指挥部
          type: 2,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          treeData.value = JSON.parse(JSON.stringify(response.data).replace(/id/g, 'falseid').replace(/groupId/g, 'id'));
        } else {
          $message.error(`获取专项组织架构失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取专项组织架构失败，错误信息：${error}`);
      });
      showSpecilLeaderPanel();
    }
    // 获取现场左侧树结构
    function getSceneTree() {
      getDefaultContingencyPlan();
      isShowDeptPanel.value = false;
      isShowRightScenePanel.value = false;
      selectId.value = 3;
      const request = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailgroup/getGroupResponseAndContactor',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          versionId: nowPreplanId.value, // 先写死
          structType: 2, // 1专项2现场指挥部
          type: 2,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          treeData.value = JSON.parse(JSON.stringify(response.data).replace(/id/g, 'falseid').replace(/groupId/g, 'id'));
        } else {
          $message.error(`获取现场组织架构失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取现场组织架构失败，错误信息：${error}`);
      });
      showSceneLeaderPanel();
    }
    // 打开专项领导班子面板
    function showSpecilLeaderPanel() {
      isShowSpecilPanel.value = true;
      isShowDeptPanel.value = false;
      isShowRightScenePanel.value = false;
      isShowScenePanel.value = false;
    }
    // 打开现场领导班子面板
    function showSceneLeaderPanel() {
      isShowSpecilPanel.value = false;
      isShowDeptPanel.value = false;
      isShowRightScenePanel.value = false;
      isShowScenePanel.value = true;
    }
    // 根据部门id获取对应的联系人、负责人等信息
    const deptInfoObj:any = ref({});
    const selectGroupId = ref(0); // 当前选中的分组id
    function getInfoByGroupId(info:any) {
      const groupId:number = info.id;
      selectGroupId.value = info.id;
      const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailgroup/getGroupManageEvent',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          Ids: [groupId],
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          isFromTree.value = true;
          if (response.data.length > 0) {
            deptInfoObj.value = response.data[0];
          } else {
            deptInfoObj.value = response.data;
          }
          isShowDeptPanel.value = true;
          isShowSpecilPanel.value = false;
          isShowScenePanel.value = false;
          console.log(deptInfoObj.value);
        } else {
          $message.error(`获取分组联系人失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取分组联系人失败，错误信息：${error}`);
      });
    }
    // 根据现场组织架构部门id获取对应的联系人负责人信息

    const groupInfoObj:any = ref([]);
    function getSceneInfoByGroupId(info:any) {
      console.log(info);
      groupInfoObj.value = info;
      isShowDeptPanel.value = false;
      isShowSpecilPanel.value = false;
      isShowScenePanel.value = false;
      isShowRightScenePanel.value = true;
    }
    // 刷新当前panel
    function refrash() {
      if (selectId.value === 1) {
        getContactTree();
      } else {
        getSpecilTree();
      }
    }
    // 回车事件
    function searchFun(e: string) {
      console.log(e);
      if (e === '') {
        isShowSearchContent.value = false;
      } else {
        const request = {
          method: 'get',
          service: 'soc',
          url: '/mail/mailgroup/getSearchGroupOrContactor',
          headers: {
            'Content-Type': 'application/json',
          },
          params: { search: e },
        };
        $http(request).then((response: any) => {
          if (response.code === 0) {
            searchPeopleList.value = response.data.mailContacotor;
            searchPeopleTreeList.value = response.data.groupTree;
          } else {
            $message.error(`失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error: Error) => {
          $message.error(`失败，错误信息：${error}`);
        });
        isShowSearchContent.value = true;
      }
    }
    // 人员卡片点击方法
    const personInfoProps:any = reactive({});
    function personCardClickFun(obj:any) {
      (window as any).event.stopPropagation();
      console.log(obj);
      personInfoProps.value = obj;
      if (PersonDetailRef.value) {
        PersonDetailRef.value.open();
      }
    }
    /**
    * @desc 获取常用联系人
    * @param {} params
    * @returns {} returns
    */
   const usePeoples = ref([]); // 常用联系人
   function getUsePeople() {
    const request = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailcontactor/commonContactorList',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          page: 1,
          limit: 1000,
          search: '',
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          usePeoples.value = response.data?.list || [];
          deptInfoObj.value = {
            groupContactor: response.data?.list || [],
            name: '常用联系人',
          };
          isShowDeptPanel.value = true;
          isShowSpecilPanel.value = false;
          isShowScenePanel.value = false;
          isFromTree.value = false;
        } else {
          $message.error(`获取常用联系人失败，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取常用联系人失败，错误信息：${error}`);
      });
   }
   /**
   * @desc 获取最近联系人
   * @param {} params
   * @returns {} returns
   */
    const recentPeoples = ref([]); // 最近联系人
   function getRecentPeople() {
    const request = {
        method: 'get',
        service: 'soc',
        url: '/mail/mailcontactor/recentContactorList',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          num: 10,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          recentPeoples.value = response?.list || [];
          deptInfoObj.value = {
            groupContactor: response?.list || [],
            name: '最近联系人',
          };
          isShowDeptPanel.value = true;
          isShowSpecilPanel.value = false;
          isShowScenePanel.value = false;
          isFromTree.value = false;
        } else {
          $message.error(`获取最近联系人失败，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取最近联系人失败，错误信息：${error}`);
      });
   }
    onMounted(() => {
      getDefaultContingencyPlan();
      getContactTree(); // 默认加载通讯录树结构
    });
    return {
      treeData,
      selectId,
      searchFun,
      getContactTree,
      getInfoByGroupId,
      deptInfoObj,
      switchToExpert,
      platformId,
      platformList,
      getExpertTree,
      getExpertInfoByGroupId,
      searchExpert,
      expertList,
      clickType,
      isShowDeptPanel,
      getSpecilTree,
      isShowSpecilPanel,
      isShowScenePanel,
      isShowRightScenePanel,
      showSpecilLeaderPanel,
      showSceneLeaderPanel,
      isShowSearchContent,
      searchPeopleList,
      searchPeopleTreeList,
      getSceneTree,
      getSceneInfoByGroupId,
      groupInfoObj,
      refrash,
      personCardClickFun,
      PersonDetailRef,
      personInfoProps,
      getUsePeople,
      getRecentPeople,
      usePeoples,
      recentPeoples,
      recentContactSectionExpand,
      useContactSectionExpand,
      isFromTree,
    };
  },
});
</script>

<style lang="scss" src="./style/style.scss"></style>
