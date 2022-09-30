<!-- 组件：任务详情 —— 任务成员 -->
<template>
  <div class="member-list">
    <div v-if="memberList.length === 0" class="member-no-list_layout">
      <span class="no-data">暂无任务成员</span>
    </div>
    <div v-else class="member-list_layout" v-for="item in memberList">
      <span :class="memberNameBoxClassName">{{ item.memberName }}</span>
      <span
        :class="
          'member_role ' +
            (item.memberRole === '负责人'
              ? 'role-color_1'
              : item.memberRole === '参与人'
              ? 'role-color_2'
              : 'role-color_3')
        "
        >{{ item.memberRole }}</span
      >
      <span class="member_position">{{ item.memberPosition }}</span>
      <!-- 拨打电话 -->
      <div class="icon-phone" @click="handleCallUp(item.memberPhone)"></div>
      <!-- <a :href="'tel:' + item.memberPhone.phone" class="icon-phone"></a> -->
      <!-- 发送短信：R1版本先不做 -->
      <!-- <a :href="'sms:' + item.memberPhone" class="icon-sms"></a> -->
    </div>
    <!-- 暂无数据 -->
    <van-popup v-model:show="show" round position="bottom" :style="{ height: 'auto' }">
      <div class="member-phone-container-layout">
        <div class="member-phone-container-header">请选择号码</div>
        <div class="member-phone-container-body">
          <a v-if="memberPhone.phone" :href="'tel:' + memberPhone.phone" class="member-phone">
            <div>手机号码1</div>
            <div class="phone">{{ memberPhone.phone }}</div>
          </a>
          <a v-if="memberPhone.mobile1" :href="'tel:' + memberPhone.mobile1" class="member-phone">
            <div>手机号码2</div>
            <div class="phone">{{ memberPhone.mobile1 }}</div>
          </a>
          <a v-if="memberPhone.mobile2" :href="'tel:' + memberPhone.mobile2" class="member-phone">
            <div>手机号码3</div>
            <div class="phone">{{ memberPhone.mobile2 }}</div>
          </a>
          <a
            v-if="memberPhone.officeTel"
            :href="'tel:' + memberPhone.officeTel"
            class="member-phone"
          >
            <div>办公电话</div>
            <div class="phone">{{ memberPhone.officeTel }}</div>
          </a>
          <a v-if="memberPhone.homeTel" :href="'tel:' + memberPhone.homeTel" class="member-phone">
            <div>家庭电话</div>
            <div class="phone">{{ memberPhone.homeTel }}</div>
          </a>
          <a v-if="memberPhone.otherTel" :href="'tel:' + memberPhone.otherTel" class="member-phone">
            <div>其他电话</div>
            <div class="phone">{{ memberPhone.otherTel }}</div>
          </a>
        </div>
        <div class="member-phone-container-footer" @click="handleClosePopup">
          取消
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, shallowReactive } from 'vue';
export default defineComponent({
  name: 'TaskMember',
  props: {
    memberList: {
      type: Array,
      default: () => {
        return [
          {
            memberId: '', // 成员ID
            memberName: '', // 成员姓名
            memberPosition: '', // 成员职务
            memberRole: '', // 成员角色
            memberPhone: '', // 成员电话
          },
        ];
      },
    },
  },
  computed: {},
  setup(props) {
    const memberNameBoxClassName = ref('member_name');
    // 计算人名div的宽
    function countMemberNameBoxWidth() {
      let newMemberList = shallowReactive(props.memberList);
      let isFinish = false;
      for (let i = 0; i < newMemberList.length; i++) {
        let item = newMemberList[i];
        if (isFinish) {
          break;
        }
        if ((item as any).memberName.length > 3) {
          isFinish = true;
          memberNameBoxClassName.value = 'member_name_4';
          break;
        }
      }
    }
    countMemberNameBoxWidth();

    // 是否弹出框选择电话
    const show = ref(false);
    // 成员电话
    const memberPhone = reactive({});
    /**
     * @param {Object} phones 成员电话
     * @description 显示拨打号码弹窗
     */
    function handleCallUp(phones: any) {
      show.value = !show.value;
      Object.assign(memberPhone, phones);
    }
    /**
     * @description 关闭号码弹窗
     */
    function handleClosePopup() {
      show.value = false;
    }

    return {
      memberNameBoxClassName,
      countMemberNameBoxWidth,
      show,
      handleCallUp,
      memberPhone,
      handleClosePopup,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/css/common'; /*引入公共样式*/
$img_phone: url('../../assets/images/icons/phone.png'); // 图片-手机
$img_sms: url('../../assets/images/icons/sms.png'); // 图片-手机

// 图片-手机
.icon-phone {
  background-image: $img_phone;
  width: 0.24rem;
  height: 0.34rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
// 图片-短信
.icon-sms {
  background-image: $img_sms;
  width: 0.36rem;
  height: 0.32rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-left: 0.1rem;
}

// 成员角色对应的颜色
// 负责人
.role-color_1 {
  background: rgba(22, 200, 139, 0.08);
  color: $color_11;
}
// 参与人
.role-color_2 {
  background: rgba(22, 141, 200, 0.08);
  color: $color_5;
}
// 抄送人
.role-color_3 {
  background: #f0f0f0;
  color: $color_12;
}

// 任务成员
.member-list {
  padding: 0 0.18rem;
  .member-list_layout {
    @extend .flex_style;
    align-items: center;
    padding: 0.2rem 0;

    .member_name {
      width: 0.84rem;
      font-size: $font_size_1;
      color: $color_3;
    }

    .member_name_4 {
      width: 1.12rem;
      font-size: $font_size_1;
      color: $color_3;
    }

    .member_role {
      width: 0.9rem;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: $font_size_2;
      border-radius: 0.2rem;
      text-align: center;
      margin-left: 0.06rem;
    }

    .member_position {
      flex: 1;
      text-align: center;
      font-size: $font_size_1;
      color: $color_4;
      padding: 0 0.24rem;
    }
  }
  // 无数据的样式
  .member-no-list_layout {
    @extend .flex_style;
    align-items: center;
    padding: 0.3rem 0 0.1rem 0;
    .no-data {
      flex: 1;
      text-align: center;
      font-size: $font_size_1;
      color: $color_4;
    }
  }
}

.member-phone-container-layout {
  height: 100%;
  @extend .flex_style;
  flex-direction: column;
  justify-content: space-between;

  // 头部
  .member-phone-container-header {
    height: 0.88rem;
    line-height: 0.88rem;
    font-size: 0.24rem;
    color: #333333;
    padding: 0 0.3rem;
  }

  // 身体
  .member-phone-container-body {
    flex: 1;
    padding: 0 0.3rem;

    .member-phone {
      border-top: 0.01rem solid #dddddd;
      @extend .flex_style;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.2rem 0;
      box-sizing: border-box;
      font-size: 0.24rem;
      color: #333333;

      .phone {
        font-size: 0.28rem;
        color: #666666;
      }
    }
  }

  // 尾部
  .member-phone-container-footer {
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    border-top: 0.12rem solid #f5f5f5;
  }
}
</style>
