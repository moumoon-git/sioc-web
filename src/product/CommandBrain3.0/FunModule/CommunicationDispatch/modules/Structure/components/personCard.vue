// 人员卡片
<template>
  <div
    class="personCard"
    @click="clickEmitFun(personData)"
  >
    <div class="personCard__left">
      <img
        :src="personData.images?.startsWith('http') ? personData.images : `${baseURL}${personData.images}`"
        class="personCard__left__icon"
      >
      <div
        v-if="followable"
        class="personCard__left__get"
        @click.stop="starFun(personData.commonlyUsed)"
      >
        {{ personData.commonlyUsed===1?'已关注':'关注' }}
      </div>
    </div>
    <!-- ./assets/default.png -->
    <div class="personCard__right">
      <div class="personCard__right__item">
        <div class="personCard__right__item__left">
          姓名
        </div>
        <div class="personCard__right__item__right">
          {{ personData.name || personData.phone || '暂无' }}
        </div>
      </div>
      <div class="personCard__right__item">
        <div class="personCard__right__item__left">
          单位
        </div>
        <div class="personCard__right__item__right">
          {{ personData.workUnit||'暂无' }}
        </div>
      </div>
      <div class="personCard__right__item">
        <div class="personCard__right__item__left">
          职位
        </div>
        <div class="personCard__right__item__right">
          <div class="personCard__right__item__right__name">
            {{ personData.position || '暂无' }}
          </div>

          <div
            v-if="personData.typelist"
            class="personCard__right__item__right__more"
            @click="showTypeList"
          />
          <div
            class="personCard__list"
            :class="{'personCard__list--active':showType===true}"
          >
            <Tree
              ref="TreeRef"
              :show-check-box="true"
              :is-show-folder="false"
              :data="treeData"
              :isset-check="true"
              :checkdata="checknodes"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="personCard__operation">
      <div
        class="personCard__operation__item"
        @click="sendMqFun"
      >
        <!-- 指令 -->
      </div>
      <div
        class="personCard__operation__item"
        @click="sendMqFun('meeting')"
      >
        会议
      </div>
      <div
        class="personCard__operation__item"
        @click="sendMqFun('phone')"
      >
        拨号
      </div>
      <div v-if="operation" class="personCard__operation__item">
        <ContactMoreButton
          :id="personData.contactorId || personData.id"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
 defineComponent, ref, getCurrentInstance, nextTick,
} from 'vue';
import { useStore } from 'vuex';
import ContactMoreButton from '@/product/CommandBrain3.0/Generalparts/main/ContactMoreButton/ContactMoreButton.vue'; // 详情按钮
import Tree from '@/product/CommandBrain3.0/FunModule/CommunicationDispatch/modules/Structure/components/GroupTree/GroupTree.vue'; // 树形组件
import {
  createOrAddMeeting,
  stopMeeting,
  makePhoneCall,
  uds,
} from '@/product/CommandBrain3.0/mainCapacity/uds/useUDS';

export default defineComponent({
  components: {
    // 详情按钮
    ContactMoreButton,
    // 树形
    Tree,
  },
  props: {
    personData: {
      type: Object,
      default: () => ({}),
    },
    // 是否有扩展功能，非通讯录的联系人没有
    operation: {
      type: Boolean,
      default: true,
    },
    // 是否能关注，非通讯录的联系人不能关注
    followable: {
      type: Boolean,
      default: true,
    },
    // 专家打电话时要额外参数
    isExpert: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['clickEmit', 'updateUsePeopleEmit'],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http, $message }: any = instance?.appContext.config.globalProperties;
    const store = useStore(); // 使用vuex
    const treeData = ref([]);
    // 遍历树获取自动勾选的数据
    const checknodes:any = ref([]);
    const TreeRef = ref<null>(null);
    function clickEmitFun(item:any) {
      emit('clickEmit', item); // 详细信息
    }
    // 收藏
    const isStar = ref(false);
    if (props.personData.commonlyUsed === 1) {
      isStar.value = true;
    } else {
      isStar.value = false;
    }
    /**
    * @desc
    * @param {} starId 是否已关注，1是已关注，0是未关注
    * @returns {} returns
    */
    function starFun(starId :number) {
      const request:any = {
        method: 'post',
        service: 'soc',
        url: '/mail/mailcontactor/updateIsCommonlyUsed',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      // 已关注则取消关注
      if (starId === 1) {
        request.data = {
          contactId: props.personData.id,
          isCommonlyUsed: 0, // 1为是，0为否
        };
        isStar.value = false;
        props.personData.commonlyUsed = 0;
        $message.info('取消成功');
      } else {
        // 未关注则关注
        request.data = {
          contactId: props.personData.id,
          isCommonlyUsed: 1, // 1为是，0为否
        };
        isStar.value = true;
        props.personData.commonlyUsed = 1;
        $message.info('关注成功');
      }
      $http(request).then((response: any) => {
        if (response.code === 0) {
          // emit('updateUsePeopleEmit'); // 更新常用联系人
        } else {
          $message.error(`操作失败，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`操作失败，错误信息：${error}`);
      });
    }

    // 返回关注状态
    function returnStarText() {

    }
    // 返回树形组件应该选中的数据
    function returnTreeData(array:any) {
      array.forEach((item:any) => {
        if (item.children) {
          returnTreeData(item.children);
          if (props?.personData?.typelist.includes(item.id)) {
            checknodes.value.push(item);
          }
        } else if (!item.children) {
          // 获得符合的 node
          if (props.personData?.typelist.includes(item.id)) {
            checknodes.value.push(item);
          }
        }
      });
    }
    // 显示分管类型
    const showType = ref(false);
    function showTypeList() {
      (window as any).event.stopPropagation(); // 阻止冒泡
      showType.value = !showType.value;
      const request = {
        method: 'post',
        service: 'eoc',
        url: '/eos/caseClass/getTree',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {},
      };
      $http(request).then((response: any) => {
        if (response.errorcode === 0) {
          treeData.value = response.data;
          returnTreeData(treeData.value);
          if (TreeRef.value) {
            (TreeRef.value as any).setChe();
          }
        } else {
          treeData.value = [];
          $message.error(`获取事件类型失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        $message.error(`获取事件类型失败，错误信息：${error}`);
      });
    }
    // uds操作
    function sendMqFun(type:string) {
      (window as any).event.stopPropagation(); // 阻止冒泡
      if (type === 'meeting') {
        // 开会
        const params:any = {
          id: props.personData.id,
          Name: props.personData.name,
          Number: props.personData.mobile1 || props.personData.phone || props.personData.mobile2,
          Type: 1,
        };
        createOrAddMeeting(params, 1);
      }
      if (type === 'phone') {
        // 电话
        const params:any = {
          id: props.personData.id,
          name: props.personData.name,
          phone: props.personData.mobile1 || props.personData.phone || props.personData.mobile2,
          type: 1,
        };
        const paramsArg = [{
            key: 'eventId',
            value: store.state.event?.id,
            type: 1,
          }];
        if (props.isExpert) {
          paramsArg.push({
            key: 'callType',
            value: 'expert',
            type: 1,
          }, {
            key: 'expertId',
            value: props.personData.id,
            type: 1,
          });
        }
        makePhoneCall(params, paramsArg);
      }
    }

    return {
      clickEmitFun,
      starFun,
      showTypeList,
      showType,
      sendMqFun,
      treeData,
      checknodes,
      TreeRef,
      isStar,
    };
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
  watch: {
    personData: {
      handler(val) {
        console.log(val);
      },
      deep: true,
      immediate: true,
    },
  },
});
</script>

<style lang="scss">
.personCard {
  width: 346px;
  height: 108px;
  border: 1px solid rgba(86, 233, 255, 0);
  background: linear-gradient(
    90deg,
    rgba(0, 193, 222, 0.3) 0%,
    rgba(24, 38, 50, 0) 100%
  );
  margin-bottom: 16px;
  display: flex;
  position: relative;
  // overflow: hidden;
  cursor: pointer;
  &__left {
    width: 91px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &__icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      // border: 1px solid rgba(0, 193, 222, 1);
      // background: url(./assets/default.png) no-repeat
    }
    &__get {
      width: 44px;
      height: 22px;
      border: 1px solid #56e9ff;
      text-align: center;
      line-height: 22px;
      cursor: pointer;
      color: rgba(86, 233, 255, 1);
      margin-top: 7px;
    }
  }
  &__right {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #fff;
    &__item {
      display: flex;
      &:nth-child(1) {
        background: url(./assets/person.svg) no-repeat;
        background-position: 0% 50%;
      }
      &:nth-child(2) {
        background: url(./assets/unit.svg) no-repeat;
        background-position: 0% 50%;
      }
      &:nth-child(3) {
        background: url(./assets/position.svg) no-repeat;
        background-position: 0% 50%;
      }
      &__left {
        width: 44px;
        height: 100%;
        color: rgba(255, 255, 255, 0.8);
        text-align: right;
      }
      &__right {
        width: 188px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-left: 10px;
        // overflow: hidden;
        &__more {
          background: url(./assets/more.svg) no-repeat;
          width: 16px;
          height: 16px;
          margin-left: 5px;
          cursor: pointer;
        }
        .personCard__list {
          width: 147px;
          max-height: 300px;
          padding: 5px;
          overflow-x: auto;
          position: absolute;
          top: 108px;
          left: 161px;
          background: #000000;
          border: 1px solid #00c1de;
          align-items: center;
          display: none;
          z-index: 2;
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
          &__item {
            width: 100%;
          }
        }
        .personCard__list--active {
          transition: display 1s;
          display: block;
        }
        &__name {
        }
      }
    }
  }
  &__operation {
    width: 73px;
    height: 108px;
    background: rgba(0, 0, 0, 0.85);
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    display: none;
    // transition: opacity 1s;
    &__item {
      width: 72%;
      text-align: right;
      margin: 2px auto;
      cursor: pointer;
      &:nth-child(1) {
        background: url(./assets/op1.svg) no-repeat;
        background-position: 10% 50%;
      }
      &:nth-child(2) {
        background: url(./assets/op2.svg) no-repeat;
        background-position: 10% 50%;
      }
      &:nth-child(3) {
        background: url(./assets/op3.svg) no-repeat;
        background-position: 10% 50%;
      }
      &:nth-child(4) {
        background: url(./assets/op4.svg) no-repeat;
        background-position: 10% 50%;
      }
      &:hover {
        color: rgba(86, 233, 255, 1);
        &:nth-child(1) {
          background: url(./assets/op1Active.svg) no-repeat;
          background-position: 10% 50%;
        }
        &:nth-child(2) {
          background: url(./assets/op2Active.svg) no-repeat;
          background-position: 10% 50%;
        }
        &:nth-child(3) {
          background: url(./assets/op3Active.svg) no-repeat;
          background-position: 10% 50%;
        }
        &:nth-child(4) {
          background: url(./assets/op4Active.svg) no-repeat;
          background-position: 10% 50%;
        }
      }
    }
  }
  &:hover {
    .personCard__operation {
      display: block;
      transition: display 2s;
    }
    border: 1px solid rgba(86, 233, 255, 0.7);
    background: linear-gradient(
      90deg,
      rgba(0, 193, 222, 0.5) 0%,
      rgba(24, 38, 50, 0) 100%
    );
  }
}
</style>
