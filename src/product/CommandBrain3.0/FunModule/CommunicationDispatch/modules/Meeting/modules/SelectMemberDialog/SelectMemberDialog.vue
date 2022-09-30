<template>
  <ModalDialog
    v-model="showDialog"
    :title="sms ? '添加联系人' : '邀请入会'"
    :z-index="10005"
    @close="handleClose"
  >
    <div :class="$style.container">
      <main>
        <!-- A. 左边栏 -->
        <section :class="$style.left">
          <!-- A-1. 类型切换 -->
          <header>
            <TitleMenu
              v-model="groupTypeIndex"
              :menu-list="groupTypeList"
              style="margin: 0 45px; font-size: 16px;"
            />
          </header>
          <main>
            <!-- A-2. 分组树形 -->
            <div v-if="groupTypeList[groupTypeIndex] === '专家'">
              <ElCascader
                v-model="platformId"
                style="margin:10px 10px 0;"
                :options="platformList"
                :props="{
                  checkStrictly: true,
                  emitPath: false,
                  value: 'id',
                  label: 'platformName',
                }"
                @change="getExpertGroup"
              />
              <Search
                v-if="groupTypeList[groupTypeIndex] === '专家'"
                v-model="searchKeyword"
                style="width: calc(100% - 20px); margin: 10px; background: rgba(41, 47, 48, .77);"
                placeholder="请输入专家名称、电话检索"
              />
              <div>
                <DepartmentTree
                  v-if="!searchKeyword"
                  :tree-data="expertGroup"
                  @node-click="handleTreeNodeClick"
                />
                <template v-else>
                  <h2>专家列表</h2>
                  <li
                    v-for="item in searchExpertList || []"
                    :key="item?.id"
                    :class="$style.leftItem"
                    @click="toggleCheck(item, 3)"
                  >
                    <!-- 勾选框 -->
                    <span
                      :class="[
                        $style.checkbox,
                        { [$style.checked]: selectedExpertMap.has(item.id) }
                      ]"
                    />
                    <span>
                      {{ item.name || '未知' }}
                      {{ `（${item.workUnit || '暂无单位信息'}/${item.position || '暂无职位信息'}）` }}
                    </span>
                  </li>
                </template>
              </div>
            </div>
            <div v-else-if="groupTypeList[groupTypeIndex] !== '设备'">
              <Search
                v-if="groupTypeList[groupTypeIndex] === '通讯录'"
                v-model="searchKeyword"
                style="width: calc(100% - 20px); margin: 10px; background: rgba(41, 47, 48, .77);"
                placeholder="请输入部门、成员名称检索"
              />
              <div>
                <DepartmentTree
                  v-if="!searchKeyword"
                  :tree-data="treeData"
                  @node-click="handleTreeNodeClick"
                />
                <template v-else>
                  <h2>部门单位</h2>
                  <li
                    v-for="item in contactSearchResult?.groupTree || []"
                    :key="item?.id"
                    :class="$style.leftItem"
                    @click="handleTreeNodeClick(item)"
                  >
                    <span>
                      {{ item.name || '未知' }}
                    </span>
                  </li>
                  <h2>人员列表</h2>
                  <li
                    v-for="item in contactSearchResult?.mailContacotor || []"
                    :key="item?.id"
                    :class="[
                      $style.leftItem,
                      { [$style.disableItem]: !isValidItem(item) }
                    ]"
                    @click="isValidItem(item) && toggleCheck(item, true)"
                    @contextmenu.prevent="isValidItem(item) && handleContextmenu($event, item)"
                  >
                    <!-- 勾选框 -->
                    <span
                      :class="[
                        $style.checkbox,
                        { [$style.checked]: selectedContactMap.has(item.id) }
                      ]"
                    />
                    <span>
                      {{ item.name || '未知' }}
                      {{ `（${item.workUnit || '暂无单位信息'}/${item.position || '暂无职位信息'}）` }}
                    </span>
                    <ContactMoreButton
                      :id="item.id || item.contactorId"
                      :class="$style.moreButton"
                    />
                  </li>
                </template>
              </div>
            </div>
            <div v-else>
              <Search
                v-model="searchKeyword"
                style="width: calc(100% - 20px); margin: 10px; background: rgba(41, 47, 48, .77);"
                placeholder="请输入关键词检索"
              />
              <div>
                <div
                  :class="[
                    $style.deviceGroup,
                    {
                      [$style.deviceGroupActive]: currentDeviceGroupIndex === 0,
                    },
                  ]"
                  @click="currentDeviceGroupIndex = 0;"
                >
                  视频监控
                </div>
                <DepartmentTree
                  v-if="currentDeviceGroupIndex === 0"
                  :tree-data="deviceGroup.video"
                  @node-click="handleTreeNodeClick"
                />
                <div
                  :class="[
                    $style.deviceGroup,
                    {
                      [$style.deviceGroupActive]: currentDeviceGroupIndex === 1,
                    },
                  ]"
                  @click="currentDeviceGroupIndex = 1;"
                >
                  会场终端
                </div>

                <DepartmentTree
                  v-if="currentDeviceGroupIndex === 1"
                  :tree-data="deviceGroup.assembly"
                  @node-click="handleTreeNodeClick"
                />
                <div
                  :class="[
                    $style.deviceGroup,
                    {
                      [$style.deviceGroupActive]: currentDeviceGroupIndex === 2,
                    },
                  ]"
                  @click="currentDeviceGroupIndex = 2;"
                >
                  集群
                </div>

                <DepartmentTree
                  v-if="currentDeviceGroupIndex === 2"
                  :tree-data="[...deviceGroup.cluster, ...deviceGroup.mobile]"
                  @node-click="handleTreeNodeClick"
                />
                <!-- <div
                  :class="[
                    $style.deviceGroup,
                    {
                      [$style.deviceGroupActive]: currentDeviceGroupIndex === 3,
                    },
                  ]"
                  @click="currentDeviceGroupIndex = 3;"
                >
                  WeComm
                </div>

                <DepartmentTree
                  v-if="currentDeviceGroupIndex === 3"
                  :tree-data="deviceGroup.mobile"
                  @node-click="handleTreeNodeClick"
                /> -->
              </div>
            </div>
            <!-- A-3. 分组详情 -->
            <div>
              <div>
                <ul>
                  <template v-if="groupTypeList[groupTypeIndex] === '通讯录'">
                    <h3>应急负责人</h3>
                    <li
                      v-for="
                        item in listData
                          .map(
                            (i) => i?.groupResponsibleTypeList
                              ?.map((j) => j?.malicontactorList || []) || []
                          ).flat(Infinity)
                      "
                      :key="item?.id"
                      :class="[
                        $style.leftItem,
                        { [$style.disableItem]: !isValidItem(item) }
                      ]"
                      @click="isValidItem(item) && toggleCheck(item, true)"
                      @contextmenu.prevent="isValidItem(item) && handleContextmenu($event, item)"
                    >
                      <!-- 勾选框 -->
                      <span
                        :class="[
                          $style.checkbox,
                          { [$style.checked]: selectedContactMap.has(item.id) }
                        ]"
                      />
                      <span>
                        {{ item.name || '未知' }}
                        {{ `（${item.workUnit || '暂无单位信息'}/${item.position || '暂无职位信息'}）` }}
                      </span>
                      <ContactMoreButton
                        :id="item.id"
                        :class="$style.moreButton"
                      />
                    </li>
                    <h3>应急联络人</h3>
                    <li
                      v-for="
                        item in listData
                          .map(
                            (i) => i?.groupContactorTypeList
                              ?.map((j) => j?.malicontactorList || []) || []
                          ).flat(Infinity)
                      "
                      :key="item?.id"
                      :class="[
                        $style.leftItem,
                        { [$style.disableItem]: !isValidItem(item) }
                      ]"
                      @click="isValidItem(item) && toggleCheck(item, true)"
                      @contextmenu.prevent="isValidItem(item) && handleContextmenu($event, item)"
                    >
                      <!-- 勾选框 -->
                      <span
                        :class="[
                          $style.checkbox,
                          { [$style.checked]: selectedContactMap.has(item.id) }
                        ]"
                      />
                      <span>
                        {{ item.name || '未知' }}
                        {{ `（${item.workUnit || '暂无单位信息'}/${item.position || '暂无职位信息'}）` }}
                      </span>
                      <ContactMoreButton
                        :id="item.id"
                        :class="$style.moreButton"
                      />
                    </li>
                    <h3>其他人员</h3>
                    <li
                      v-for="item in listData.map(i => i?.groupContactor || []).flat(Infinity)"
                      :key="item?.id"
                      :class="[
                        $style.leftItem,
                        { [$style.disableItem]: !isValidItem(item) }
                      ]"
                      @click="isValidItem(item) && toggleCheck(item, true)"
                      @contextmenu.prevent="isValidItem(item) && handleContextmenu($event, item)"
                    >
                      <!-- 勾选框 -->
                      <span
                        :class="[
                          $style.checkbox,
                          { [$style.checked]: selectedContactMap.has(item.id) }
                        ]"
                      />
                      <span>
                        {{ item.name || '未知' }}
                        {{ `（${item.workUnit || '暂无单位信息'}/${item.position || '暂无职位信息'}）` }}
                      </span>
                      <ContactMoreButton
                        :id="item.id"
                        :class="$style.moreButton"
                      />
                    </li>
                  </template>
                  <template
                    v-else-if="
                      (groupTypeList[groupTypeIndex] === '专项指挥部' || groupTypeList[groupTypeIndex] === '现场指挥部')
                        && listData?._isLeader
                    "
                  >
                    <template
                      v-for="job in listData"
                      :key="job.id"
                    >
                      <h3>{{ job.name }}</h3>
                      <li
                        v-for="item in job.list"
                        :key="item.id"
                        :class="[
                          $style.leftItem,
                          { [$style.disableItem]: !isValidItem(item) }
                        ]"
                        @click="isValidItem(item) && toggleCheck(item, true)"
                        @contextmenu.prevent="isValidItem(item) && handleContextmenu($event, item)"
                      >
                        <!-- 勾选框 -->
                        <span
                          :class="[
                            $style.checkbox,
                            { [$style.checked]: selectedContactMap.has(item.id) }
                          ]"
                        />
                        <span>
                          {{ item.name || '未知' }}
                          {{ `（${item.workUnit || '暂无单位信息'}/${item.position || '暂无职位信息'}）` }}
                        </span>
                      </li>
                    </template>
                  </template>
                  <template
                    v-else-if="
                      (groupTypeList[groupTypeIndex] === '专项指挥部' || groupTypeList[groupTypeIndex] === '现场指挥部')
                        && !listData?._isLeader
                    "
                  >
                    <li
                      v-for="item in listData"
                      :key="item.id"
                      :class="[
                        $style.leftItem,
                        { [$style.disableItem]: !isValidItem(item) }
                      ]"
                      @click="isValidItem(item) && toggleCheck(item, true)"
                      @contextmenu.prevent="isValidItem(item) && handleContextmenu($event, item)"
                    >
                      <!-- 勾选框 -->
                      <span
                        :class="[
                          $style.checkbox,
                          { [$style.checked]: selectedContactMap.has(item.id) }
                        ]"
                      />
                      <span>
                        {{ item.name || '未知' }}
                        {{ `（${item.workUnit || '暂无单位信息'}/${item.position || '暂无职位信息'}）` }}
                      </span>
                    </li>
                  </template>
                  <template v-else-if="groupTypeList[groupTypeIndex] === '设备'">
                    <li
                      v-for="item in deviceList"
                      :key="item.id"
                      :class="$style.leftItem"
                      @click="toggleCheck(item, false)"
                    >
                      <!-- 勾选框 -->
                      <span
                        :class="[
                          $style.checkbox,
                          { [$style.checked]: selectedDeviceMap.has(item.id) }
                        ]"
                      />
                      <span
                        :class="{
                          [$style.deviceOffline]: item.status !== 0 && item.status !== '0',
                        }"
                      >
                        {{ item.name || '未知' }}
                      </span>
                    </li>
                  </template>
                  <!-- 专家 -->
                  <template v-else-if="groupTypeList[groupTypeIndex] === '专家'">
                    <h3>应急专家</h3>
                    <li
                      v-for="item in expertList"
                      :key="item?.id"
                      :class="$style.leftItem"
                      @click="toggleCheck(item, 3)"
                    >
                      <!-- 勾选框 -->
                      <span
                        :class="[
                          $style.checkbox,
                          { [$style.checked]: selectedExpertMap.has(item.id) }
                        ]"
                      />
                      <span>
                        {{ item.name || '未知' }}
                        {{ `（${item.workUnit || '暂无单位信息'}/${item.position || '暂无职位信息'}）` }}
                      </span>
                    </li>
                  </template>
                </ul>
              </div>
              <div>
                <button
                  :class="$style.textButton"
                  @click="checkAll(false)"
                >
                  全选
                </button>
                <button
                  :class="$style.textButton"
                  @click="checkAll(true)"
                >
                  全部取消
                </button>
              </div>
            </div>
          </main>
        </section>
        <!-- B. 右边栏 -->
        <section :class="$style.right">
          <!-- B-1. 标题 -->
          <header>
            <h2>已选</h2>
          </header>
          <main>
            <!-- B-2. 类型切换 -->
            <div>
              <TitleMenu
                v-if="!sms"
                v-model="selectedTypeIndex"
                :menu-list="selectedTypeList.map((item) => `${item.name} ${item.count}`)"
                style="margin: 0 20px;"
              />
            </div>
            <!-- B-3. 列表 -->
            <div>
              <ul>
                <!-- 联系人 -->
                <template v-if="selectedTypeIndex < 2">
                  <li
                    v-for="item in Array.from(selectedContactMap, (entry) => entry[1])"
                    :key="item.id"
                    :class="[$style.rightItem, $style[`type${item.memberType}`]]"
                  >
                    <!-- 人员类型图标 -->
                    <span />
                    <div>
                      {{ item.name || '未知' }}
                      {{ `（${item.workUnit || '暂无单位信息'}/${item.position || '暂无职位信息'}）` }}
                    </div>
                    <button v-if="!item.undeletable" @click="removeCheck(item, true)" />
                  </li>
                </template>
                <!-- 设备 -->
                <!-- 全部 -->
                <template v-if="selectedTypeIndex === 0">
                  <li
                    v-for="item in Array.from(selectedDeviceMap, (entry) => entry[1])"
                    :key="item.id"
                    :class="[$style.rightItem, $style[`type${item.memberType}`]]"
                  >
                    <!-- 人员类型图标 -->
                    <span />
                    <div>
                      {{ item.name || '未知' }}
                    </div>
                    <button v-if="!item.undeletable" @click="removeCheck(item, false)" />
                  </li>
                </template>
                <!-- 专家 -->
                <template v-if="selectedTypeIndex === 2 || selectedTypeIndex === 0">
                  <li
                    v-for="item in Array.from(selectedExpertMap, (entry) => entry[1]) || []"
                    :key="item.id"
                    :class="[$style.rightItem, $style[`type${item.memberType}`]]"
                  >
                    <!-- 人员类型图标 -->
                    <span />
                    <div>
                      {{ item.name || '未知' }}
                    </div>
                    <button @click="removeCheck(item, 3)" />
                  </li>
                </template>
                <!-- 监控视频 -->
                <template v-if="selectedTypeIndex === 3">
                  <li
                    v-for="item in Array.from(selectedDeviceMap, (entry) => entry[1]).filter(i => i.memberType === 5) || []"
                    :key="item.id"
                    :class="[$style.rightItem, $style[`type${item.memberType}`]]"
                  >
                    <!-- 人员类型图标 -->
                    <span />
                    <div>
                      {{ item.name || '未知' }}
                    </div>
                    <button v-if="!item.undeletable" @click="removeCheck(item, false)" />
                  </li>
                </template>
                <!-- 会场终端 -->
                <template v-if="selectedTypeIndex === 4">
                  <li
                    v-for="item in Array.from(selectedDeviceMap, (entry) => entry[1]).filter(i => i.memberType === 6) || []"
                    :key="item.id"
                    :class="[$style.rightItem, $style[`type${item.memberType}`]]"
                  >
                    <!-- 人员类型图标 -->
                    <span />
                    <div>
                      {{ item.name || '未知' }}
                    </div>
                    <button v-if="!item.undeletable" @click="removeCheck(item, false)" />
                  </li>
                </template>
                <!-- WeComm -->
                <!-- <template v-if="selectedTypeIndex === 4">
                  <li
                    v-for="item in Array.from(selectedDeviceMap, (entry) => entry[1]).filter(i => i.memberType === 7) || []"
                    :key="item.id"
                    :class="[$style.rightItem, $style[`type${item.memberType}`]]"
                  >
                    <span />
                    <div>
                      {{ item.name || '未知' }}
                    </div>
                    <button v-if="!item.undeletable" @click="removeCheck(item, false)" />
                  </li>
                </template> -->
                <!-- 集群 -->
                <template v-if="selectedTypeIndex === 5">
                  <li
                    v-for="item in Array.from(selectedDeviceMap, (entry) => entry[1]).filter(i => i.memberType === 8 || i.memberType === 7) || []"
                    :key="item.id"
                    :class="[$style.rightItem, $style[`type${item.memberType}`]]"
                  >
                    <!-- 人员类型图标 -->
                    <span />
                    <div>
                      {{ item.name || '未知' }}
                    </div>
                    <button v-if="!item.undeletable" @click="removeCheck(item, false)" />
                  </li>
                </template>
                <!-- 其他 -->
                <template v-if="selectedTypeIndex === 6">
                  <li
                    v-for="item in Array.from(selectedDeviceMap, (entry) => entry[1]).filter(i => i.memberType === 9 || i.memberType === 4) || []"
                    :key="item.id"
                    :class="[$style.rightItem, $style[`type4`]]"
                  >
                    <!-- 人员类型图标 -->
                    <span />
                    <div>
                      {{ item.name || item.memberCode }}
                    </div>
                    <button v-if="!item.undeletable" @click="item.memberType === 4 ? removeCheck(item, true) : removeCheck(item, false)" />
                  </li>
                </template>
              </ul>
            </div>
            <!-- B-4. 按钮 -->
            <div>
              <button
                :class="$style.textButton"
                @click="handleClearAll"
              >
                全部清除
              </button>
              <button
                v-if="!sms"
                :class="$style.textButton"
                @click="handleDial"
              >
                添加号码
              </button>
              <div v-else>
                已选
                <span style="color: #56E9FF;">{{ selectedContactMap.size }}</span>
              </div>
            </div>
          </main>
        </section>
      </main>
      <!-- C. 页脚 -->
      <footer>
        <Button
          type="ghost"
          @click="handleClose"
        >
          取消
        </Button>
        <Button @click="handleConfirm">
          确定
        </Button>
      </footer>
    </div>
    <ContextMenu
      :xy="xy"
      :data="contextItem"
      @add="handleContextMenuAdd"
      @add-device="handleContextMenuAddDevice"
    />
  </ModalDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs,
  watch,
  ref,
} from 'vue';
import { ElCascader } from 'element-plus';
import ModalDialog from '@/product/CommandBrain3.0/Generalparts/dialog/ModalDialog/ModalDialog.vue';
import Button from '@/product/CommandBrain3.0/Generalparts/dialog/Button/Button.vue';
import DepartmentTree from '@/product/CommandBrain3.0/Generalparts/dialog/SelectContactDialog/components/DepartmentTree.vue';
import Search from '@/product/CommandBrain3.0/Generalparts/dialog/Search/Search.vue';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue';
import TitleMenu from '../../components/TitleMenu/TitleMenu.vue';
import useGroupTree from './scripts/useGroupTree';
import useCheckList from './scripts/useCheckList';
import ContextMenu from './components/ContextMenu.vue';

export default defineComponent({
  name: 'SelectMemberDialog',
  components: {
    ElCascader,
    ModalDialog,
    Button,
    DepartmentTree,
    Search,
    ContactMoreButton,
    TitleMenu,
    ContextMenu,
  },
  props: {
    // 短信模块使用
    sms: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const {
      $http,
      $message,
      $dial,
    }: any = getCurrentInstance()?.appContext.config.globalProperties;
    const {
      contactTreeData,
      getContactTree,
      contactListData,
      getContactList,
      specialCommandDepData,
      onSceneCommandDepData,
      getDeviceGroup,
      deviceGroup,
      deviceList,
      expertGroup,
      expertList,
      getExpertGroup,
      getExpertList,
      searchExpert,
      searchExpertList,
      platformId,
      platformList,
    } = useGroupTree($http, $message);
    const {
      selectedContactMap,
      selectedDeviceMap,
      selectedExpertMap,
      toggleCheck,
      removeCheck,
    } = useCheckList(keepUndeletableList);
    const state = reactive({
      showDialog: false,
      treeData: [] as any,
      listData: [] as any,
      groupTypeList: props.sms ? ['通讯录', '专家', '专项指挥部', '现场指挥部'] : ['通讯录', '专家', '专项指挥部', '现场指挥部', '设备'],
      groupTypeIndex: 0,
      selectedTypeList: [
        { name: '全部', count: 0 },
        { name: '联系人', count: 0 },
        { name: '专家', count: 0 },
        { name: '监控视频', count: 0 },
        { name: '会场终端', count: 0 },
        // { name: 'WeComm', count: 0 },
        { name: '集群', count: 0 },
        { name: '其他', count: 0 },
      ],
      selectedTypeIndex: 0,
      searchKeyword: '',
      contactSearchResult: null as any,
      currentDeviceGroupIndex: 0,
    });
    watch([selectedContactMap, selectedDeviceMap, selectedExpertMap], ([newVal1, newVal2, newVal3]) => {
      state.selectedTypeIndex = 0;
      const newValue1 = Array.from(newVal1, (entry) => entry[1]);
      const newValue2 = Array.from(newVal2, (entry) => entry[1]);
      state.selectedTypeList = [
        { name: '全部', count: newValue1?.length + newValue2?.length + newVal3.size },
        { name: '联系人', count: newValue1?.filter((i: any) => i.memberType < 4).length || 0 },
        { name: '专家', count: newVal3.size || 0 },
        { name: '监控视频', count: newValue2?.filter((i: any) => i.memberType === 5).length || 0 },
        { name: '会场终端', count: newValue2?.filter((i: any) => i.memberType === 6).length || 0 },
        // { name: 'WeComm', count: newValue2?.filter((i: any) => i.memberType === 7).length || 0 },
        { name: '集群', count: newValue2?.filter((i: any) => i.memberType === 8 || i.memberType === 7).length || 0 },
        { name: '其他', count: (newValue1?.filter((i: any) => i.memberType === 4 || i.memberType === 9).length || 0) + (newValue2?.filter((i: any) => i.memberType === 4 || i.memberType === 9).length || 0) },
      ];
    }, {
      deep: true,
    });
    let res: any;
    let rej: any;
    const undeletableList = ref<any>([]);
    function keepUndeletableList() {
      const list = undeletableList.value;
      if (list?.length) {
        list.forEach((i: any) => {
          i.undeletable = true;
          if (i.memberType && i.memberType < 5) {
            selectedContactMap.value.set(i.id, i);
          }
          if (i.memberType && i.memberType > 4) {
            selectedDeviceMap.value.set(i.id, i);
          }
        });
      }
    }
    // 打开弹窗，返回Promise
    function open(list?: any) {
      selectedContactMap.value.clear();
      selectedDeviceMap.value.clear();
      undeletableList.value = list || [];
      keepUndeletableList();
      state.showDialog = true;
      return new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
      });
    }
    // 初始化赋值
    watch(contactTreeData, (newVal) => {
      if (state.groupTypeIndex === 0) {
        state.treeData = newVal;
      }
    }, {
      deep: true,
    });
    // 切换标签页
    watch(() => state.groupTypeIndex, (newVal) => {
      state.listData = [];
      state.searchKeyword = '';
      switch (state.groupTypeList[newVal]) {
        case '通讯录': {
          state.treeData = contactTreeData.value;
          state.listData = contactListData;
          break;
        }
        case '专家': {
          getExpertGroup();
          break;
        }
        case '专项指挥部': {
          state.treeData = specialCommandDepData.value;
          break;
        }
        case '现场指挥部': {
          state.treeData = onSceneCommandDepData.value;
          break;
        }
        case '设备': {
          break;
        }
        default:
      }
    });
    // 搜索
    let timer: any;
    watch(() => state.searchKeyword, (search) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (state.groupTypeList[state.groupTypeIndex] === '通讯录') {
          const request = {
            method: 'get',
            service: 'soc',
            url: '/mail/mailgroup/getSearchGroupOrContactor',
            params: {
              search,
            },
          };
          $http(request).then((response: any) => {
            if (response.code === 0) {
              state.contactSearchResult = response.data;
              state.contactSearchResult?.mailContacotor?.forEach((contact: any) => {
                contact.memberType = 1;
              });
            }
          });
        }
        if (state.groupTypeList[state.groupTypeIndex] === '专家') {
          searchExpert(search);
        }
        if (state.groupTypeList[state.groupTypeIndex] === '设备') {
          getDeviceGroup(state.currentDeviceGroupIndex, search, 0);
        }
      }, 300);
    });
    watch(() => state.currentDeviceGroupIndex, (val) => {
      getDeviceGroup(val, state.searchKeyword, 0);
    });
    // 树节点点击
    function handleTreeNodeClick(node: any) {
      switch (state.groupTypeList[state.groupTypeIndex]) {
        case '通讯录': {
          getContactList(node);
          state.listData = contactListData;
          break;
        }
        case '专项指挥部':
        case '现场指挥部': {
          state.listData = node.list;
          break;
        }
        case '设备': {
          getDeviceGroup(state.currentDeviceGroupIndex, undefined, node.id, node);
          break;
        }
        case '专家': {
          getExpertList(node);
          break;
        }
        default:
      }
    }
    // 全部清除
    function handleClearAll() {
      switch (state.selectedTypeIndex) {
        case 0: {
          selectedContactMap.value.clear();
          selectedDeviceMap.value.clear();
          break;
        }
        case 1: {
          selectedContactMap.value.clear();
          break;
        }
        case 2: {
          selectedExpertMap.value.clear();
          break;
        }
        case 3: {
          break;
        }
        case 4: {
          break;
        }
        case 5: {
          break;
        }
        case 6: {
          break;
        }
        default:
      }
      keepUndeletableList();
    }
    // 全选、取消全选
    function checkAll(isUncheck: boolean) {
      /* eslint-disable */
      switch (state.groupTypeList[state.groupTypeIndex]) {
        case '通讯录': {
          const list1 = state.listData
            .map(
              (i: any) => i?.groupResponsibleTypeList
                ?.map((j: any) => j?.malicontactorList || []) || [],
            ).flat(Infinity);
          const list2 = state.listData
            .map(
              (i: any) => i?.groupContactorTypeList
                ?.map((j: any) => j?.malicontactorList || []) || [],
            ).flat(Infinity);
          const list3 = state.listData
            .map(
              (i: any) => i?.groupContactor || []
            ).flat(Infinity);
          const list = [...list1, ...list2, ...list3];
          if (isUncheck) {
            list.forEach((i: any) => { selectedContactMap.value.delete(i.id); });
          } else {
            list.forEach((i: any) => { selectedContactMap.value.set(i.id, i); });
          }
          break;
        }
        case '专项指挥部':
        case '现场指挥部': {
          if (state.listData?._isLeader) {
            state.listData.forEach((job: any) => {
              job?.list?.forEach((i: any) => {
                isUncheck ? selectedContactMap.value.delete(i.id) : selectedContactMap.value.set(i.id, i);
              })
            });
          } else {
            state.listData.forEach((i: any) => {
              isUncheck ? selectedContactMap.value.delete(i.id) : selectedContactMap.value.set(i.id, i);
            });
          }
          break;
        }
        case '设备': {
          deviceList.value.forEach((i: any) => {
            isUncheck ? selectedDeviceMap.value.delete(i.id) : selectedDeviceMap.value.set(i.id, i);
          });
          break;
        }
        case '专家': {
          expertList.value.forEach((i: any) => {
            isUncheck ? selectedExpertMap.value.delete(i.id) : selectedExpertMap.value.set(i.id, i);
          })
          break;
        }
        default:
      }
      /* eslint-enable */
      keepUndeletableList();
    }
    // 点击取消
    function handleClose() {
      state.showDialog = false;
      rej();
    }
    // 点击确定
    function handleConfirm() {
      state.showDialog = false;
      const result = [
        ...Array.from(selectedContactMap.value, (entry) => entry[1]),
        ...Array.from(selectedDeviceMap.value, (entry) => entry[1]),
        ...Array.from(selectedExpertMap.value, (entry) => entry[1]),
      ];
      res(result);
    }
    function handleDial() {
      $dial().then((newNum: string) => {
        if (state.groupTypeList[state.groupTypeIndex] !== '设备') {
          const request = {
            method: 'post',
            service: 'soc',
            url: '/message/messageinfor/getContactorByPhone',
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              phone: newNum,
            },
          };
          $http(request).then((response: any) => {
            if (response.code === 0 && response.data?.[0]?.id > 0) {
              const newContact = response.data[0];
              newContact.memberType = 1;
              selectedContactMap.value.set(newContact.id, newContact);
            } else {
              const newContact = {
                memberType: 4,
                memberCode: newNum,
                name: newNum,
                joinType: 1,
                id: newNum,
              };
              selectedContactMap.value.set(newNum, newContact);
            }
          });
        } else {
          const request = {
            method: 'get',
            service: 'flight',
            url: '/device/appdevice/findOne',
            params: {
              number: newNum,
            },
          };
          $http(request).then((response: any) => {
            console.log(response.data.device);
            if (response.data?.device) {
              const newContact = response.data.device;
              newContact.memberCode = newNum;
              let memberType = 9;
              if (newContact.type === 0) memberType = 5;
              if (newContact.type === 1) memberType = 6;
              if (newContact.type === 2) memberType = 8;
              if (newContact.type === 3) memberType = 7;
              newContact.memberType = memberType;
              selectedDeviceMap.value.set(newContact.id, newContact);
            } else {
              const newContact = {
                memberType: 9,
                memberCode: newNum,
                name: newNum,
                joinType: 8,
                id: newNum,
              };
              selectedDeviceMap.value.set(newNum, newContact);
            }
          });
        }
      });
    }
    onMounted(() => {
      getContactTree();
    });

    const xy = ref([0, 0]);
    const resetXY = () => {
      xy.value = [0, 0];
      document.removeEventListener('click', resetXY, true);
    };
    const contextItem = ref();
    function handleContextmenu(e: MouseEvent, item: any) {
      if (!props.sms) {
        xy.value = [e.clientX, e.clientY];
        document.addEventListener('click', resetXY, true);
        contextItem.value = item;
      }
    }
    const contextType = [
      'mobile',
      'officeTel',
      'homeTel',
      'mobile1',
      'mobile2',
    ];
    function handleContextMenuAdd(type: number) {
      contextItem.value.contextValue = contextItem.value[contextType[type]];
      toggleCheck(contextItem.value, true);
    }
    function handleContextMenuAddDevice(device: any, deviceType: number) {
      // memberType 会场 6 监控 5 集群8 we 7 其他9
      const item = device.entity;
      item.memberType =
        deviceType === undefined
          ? // 联系人
            1
          : deviceType === 11
          ? // 集群
            8
          : deviceType === 9
          ? // 监控
            5
          : deviceType === 10
          ? // 会场终端
            6
          : // 其他设备
            9,
      toggleCheck(item, false);
    }

    // 是否能邀请入会
    function isValidItem(item: any) {
      if (item.mobile || item.mobile1 || item.mobile2 || item.officeTel || item.homeTel || item.resoures?.length) {
        return true;
      }
      return false;
    }

    return {
      ...toRefs(state),
      open,
      selectedContactMap,
      selectedDeviceMap,
      toggleCheck,
      removeCheck,
      handleTreeNodeClick,
      handleClearAll,
      checkAll,
      handleClose,
      handleConfirm,
      handleDial,
      deviceGroup,
      deviceList,
      xy,
      contextItem,
      handleContextmenu,
      handleContextMenuAdd,
      handleContextMenuAddDevice,
      expertList,
      expertGroup,
      searchExpertList,
      searchExpert,
      getExpertGroup,
      platformId,
      platformList,
      selectedExpertMap,
      isValidItem,
    };
  },
});
</script>

<style lang="scss" module src="./styles/SelectMemberDialog.scss" />
