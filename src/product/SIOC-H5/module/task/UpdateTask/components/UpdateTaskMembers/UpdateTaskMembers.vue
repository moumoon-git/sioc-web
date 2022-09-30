<template>
  <div class="update-task-members-container reset-vant">
    <div class="body__top">
      <div class="form-row">
        <div class="form-row__top" @click="selectPersonInCharge('负责人')">
          <div class="form-row__left">
            <span class="form-row__left__label">负责人</span>
          </div>
          <div class="form-row__center">
            <span v-if="personInChargeName" class="form-row__center__value">{{
              personInChargeName
            }}</span>
            <span v-else class="form-row__center__placeholder">请选择负责人</span>
          </div>
          <div class="form-row__right">
            <van-icon name="arrow" size="0.4rem" color="#969799" />
          </div>
        </div>
      </div>
    </div>
    <div class="body__center">
      <div class="form-row form-row1">
        <div class="form-row__top" @click="selectPersonInCharge('参与人')">
          <div class="form-row__left">
            <span class="form-row__left__label">参与人</span>
          </div>
          <div class="form-row__center"></div>
          <div class="form-row__right">
            <van-icon name="add-o" size="0.4rem" color="#969799" />
          </div>
        </div>
        <ul class="form-row__bottom">
          <li v-for="(item, index) in membersNames" :key="item" class="list">
            <div class="list-label">{{ item }}</div>
            <div class="list-icon" @click="deleteContactor('参与人', item, index)"></div>
          </li>
        </ul>
      </div>
      <div class="form-row form-row1">
        <div class="form-row__top" @click="selectPersonInCharge('抄送人')">
          <div class="form-row__left">
            <span class="form-row__left__label">抄送人</span>
          </div>
          <div class="form-row__center"></div>
          <div class="form-row__right">
            <van-icon name="add-o" size="0.4rem" color="#969799" />
          </div>
        </div>
        <ul class="form-row__bottom">
          <li v-for="(item, index) in ccNames" :key="item" class="list">
            <div class="list-label">{{ item }}</div>
            <div class="list-icon" @click="deleteContactor('抄送人', item, index)"></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    // 负责人
    const personInCharge: any = ref([]);
    const personInChargeName = ref('');
    // 参与人
    const members: any = ref([]);
    const membersNames: any = ref([]);
    // 抄送人
    const cc: any = ref([]);
    const ccNames: any = ref([]);

    /**
     * @description 去重
     */
    function removeDuplication(arr: any) {
      let newArr: any = []
      if (arr.length > 0) {
        const ids = new Set(arr.map((el: any) => el.id))
        ids.forEach((el: any) => {
          newArr = newArr.concat(arr.filter((item: any) => item.id === el)[0])
        });
      }
      return newArr;
    }

    /**
     * @description 数据初始化
     */
    function initTaskContactors() {
      // console.log('searchContactorsPage', store.state.searchContactorsPage);
      // console.log('taskFormContactors', store.state.task.taskContactors);
      // 负责人 - 如果缓存里有数据的话，就读缓存的数据
      if (store.state?.searchContactorsPage?.navBarConfig?.title.indexOf('负责人') > -1) {
        const selectedContactors: any = ref(store.state.task.taskContactors.responsiblePerson);
        const contactors: any = ref(store.state.searchContactorsPage?.selectedContactors);
        if (selectedContactors.value.length > 0 || contactors.value.length > 0) {
          personInCharge.value =
            contactors.value.length > 0
              ? contactors.value
              : selectedContactors.length > 0
              ? selectedContactors.value
              : [];
          personInCharge.value = removeDuplication(personInCharge.value); // 去重
          personInChargeName.value = personInCharge.value[0]?.name;
          // console.log('负责人', personInChargeName);
        }
        const taskContactors = {
          cc: store.state.task.taskContactors.cc,
          responsiblePerson: personInCharge.value,
          members: store.state.task.taskContactors.members,
        };
        store.commit('task/setTaskFormContactors', taskContactors);
      } else {
        const selectedContactors: any = ref(store.state.task.taskContactors.responsiblePerson);
        personInCharge.value = selectedContactors.value;
        personInCharge.value = removeDuplication(personInCharge.value); // 去重
        personInChargeName.value = personInCharge.value[0]?.name;
      }

      // 参与人 - 如果缓存里有数据的话，就读缓存的数据
      if (store.state?.searchContactorsPage?.navBarConfig?.title.indexOf('参与人') > -1) {
        // console.log('参与人', members.value, membersNames.value);
        const selectedContactors: any = ref(store.state.task.taskContactors?.members);
        const contactors: any = ref(store.state.searchContactorsPage?.selectedContactors);
        members.value = selectedContactors.value.concat(contactors.value);
        members.value = removeDuplication(members.value); // 去重
        if (members.value.length > 0) {
          membersNames.value =
            members.value.length > 0 ? members.value.map((el: any) => el.name) : [];
        }
        // console.log('参与人', members.value, membersNames.value);
        const taskContactors = {
          cc: store.state.task.taskContactors.cc,
          responsiblePerson: store.state.task.taskContactors.responsiblePerson,
          members: members.value,
        };
        store.commit('task/setTaskFormContactors', taskContactors);
      } else {
        const selectedContactors: any = ref(store.state.task.taskContactors?.members);
        members.value = selectedContactors.value;
        members.value = removeDuplication(members.value); // 去重
        membersNames.value =
          members.value.length > 0 ? members.value.map((el: any) => el.name) : [];
      }

      // 抄送人 - 如果缓存里有数据的话，就读缓存的数据
      if (store.state?.searchContactorsPage?.navBarConfig?.title.indexOf('抄送人') > -1) {
        // console.log('抄送人', cc.value, ccNames.value);
        const contactors: any = ref(store.state.searchContactorsPage?.selectedContactors);
        const selectedContactors: any = ref(store.state.task.taskContactors?.cc);
        cc.value = selectedContactors.value.concat(contactors.value);
        cc.value = removeDuplication(cc.value); // 去重
        if (cc.value.length > 0) {
          ccNames.value = cc.value.length > 0 ? cc.value.map((el: any) => el.name) : [];
        }
        // console.log('抄送人', cc.value, ccNames.value);
        const taskContactors = {
          cc: cc.value,
          responsiblePerson: store.state.task.taskContactors.responsiblePerson,
          members: store.state.task.taskContactors.members,
        };
        store.commit('task/setTaskFormContactors', taskContactors);
      } else {
        const selectedContactors: any = ref(store.state.task.taskContactors?.cc);
        cc.value = selectedContactors.value;
        cc.value = removeDuplication(cc.value); // 去重
        ccNames.value = cc.value.length > 0 ? cc.value.map((el: any) => el.name) : [];
      }
    }

    /**
     * @description 跳转页面选择联系人
     */
    function selectPersonInCharge(label: string) {
      const searchContactorsPage = {
        // 搜索联系人页面的导航栏配置
        navBarConfig: {
          title: `选择${label}`,
          type: 'left',
          path: '/UpdateTask',
        },
        // 搜索记录
        searchHistory: store.state.searchContactorsPage.searchHistory,
        // 选中的联系人
        selectedContactors: store.state.searchContactorsPage.selectedContactors,
        choiceNumber: label === '负责人' ? 'single' : 'multiple', // single or multiple
        moduleName: 'task', // 模块名
      };
      store.commit('setSearchContactorsPage', searchContactorsPage);
      router.push({
        path: '/SearchContactors',
      });
    }

    function deleteContactor(type: string, item: any, index: number) {
      if (type === '参与人') {
        membersNames.value.splice(index, 1);
        members.value.splice(index, 1);

        const searchContactorsPage = {
          // 搜索联系人页面的导航栏配置
          navBarConfig: store.state.searchContactorsPage.navBarConfig,
          // 搜索记录
          searchHistory: store.state.searchContactorsPage.searchHistory,
          // 选中的联系人
          selectedContactors: members.value,
          choiceNumber: store.state.searchContactorsPage, // single or multiple
          moduleName: store.state.searchContactorsPage.moduleName, // 模块名
        };
        store.commit('setSearchContactorsPage', searchContactorsPage);

        const taskContactors = {
          cc: store.state.task.taskContactors.cc,
          responsiblePerson: store.state.task.taskContactors.responsiblePerson,
          members: members.value,
        };
        store.commit('task/setTaskFormContactors', taskContactors);
      } else if (type === '抄送人') {
        ccNames.value.splice(index, 1);
        cc.value.splice(index, 1);
        const searchContactorsPage = {
          // 搜索联系人页面的导航栏配置
          navBarConfig: store.state.searchContactorsPage.navBarConfig,
          // 搜索记录
          searchHistory: store.state.searchContactorsPage.searchHistory,
          // 选中的联系人
          selectedContactors: cc.value,
          choiceNumber: store.state.searchContactorsPage, // single or multiple
          moduleName: store.state.searchContactorsPage.moduleName, // 模块名
        };
        store.commit('setSearchContactorsPage', searchContactorsPage);

        const taskContactors = {
          cc: cc.value,
          responsiblePerson: store.state.task.taskContactors.responsiblePerson,
          members: store.state.task.taskContactors.members,
        };
        store.commit('task/setTaskFormContactors', taskContactors);
      }
    }
    onMounted(() => {
      initTaskContactors();
    })
    return {
      selectPersonInCharge,
      personInCharge,
      members,
      cc,
      personInChargeName,
      membersNames,
      ccNames,
      deleteContactor,
      store,
    };
  },
});
</script>

<style lang="scss">
@use './assets/index.scss';
</style>
