<template>
  <CardWrapper style="height: 237px; margin: 10px 0;">
    <template #title>
      <h3 :class="$style.title">
        会议成员
      </h3>
      <TitleMenu
        v-model="currentMenuIndex"
        :menu-list="menuList.map((item) => `${item.name} ${item.count}`)"
      />
    </template>
    <template #default>
      <ul :class="$style.list">
        <li
          v-for="member in memberList"
          :key="member.id"
          :class="$style[`type${member.memberType}`]"
        >
          {{ member.memberName || member.memberCode }}
        </li>
      </ul>
    </template>
  </CardWrapper>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  computed,
} from 'vue';
import CardWrapper from '../../components/CardWrapper/CardWrapper.vue';
import TitleMenu from '../../components/TitleMenu/TitleMenu.vue';

export default defineComponent({
  name: 'MeetingMembers',
  components: {
    CardWrapper,
    TitleMenu,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const currentMenuIndex = ref(0);
    const menuList = ref([
      { name: '全部', count: props.data?.length || 0 },
      { name: '联系人', count: props.data?.filter((i: any) => i.memberType < 4).length || 0 },
      { name: '监控视频', count: props.data?.filter((i: any) => i.memberType === 5).length || 0 },
      { name: '会场终端', count: props.data?.filter((i: any) => i.memberType === 6).length || 0 },
      { name: '手持终端', count: props.data?.filter((i: any) => i.memberType === 7).length || 0 },
      { name: '集群', count: props.data?.filter((i: any) => i.memberType === 8).length || 0 },
      { name: '其他', count: props.data?.filter((i: any) => i.memberType === 4 || i.memberType === 9).length || 0 },
    ]);
    watch(() => props.data, (newValue) => {
      currentMenuIndex.value = 0;
      menuList.value = [
        { name: '全部', count: newValue?.length || 0 },
        { name: '联系人', count: newValue?.filter((i: any) => i.memberType < 4).length || 0 },
        { name: '监控视频', count: newValue?.filter((i: any) => i.memberType === 5).length || 0 },
        { name: '会场终端', count: newValue?.filter((i: any) => i.memberType === 6).length || 0 },
        { name: '手持终端', count: newValue?.filter((i: any) => i.memberType === 7).length || 0 },
        { name: '集群', count: newValue?.filter((i: any) => i.memberType === 8).length || 0 },
        { name: '其他', count: newValue?.filter((i: any) => i.memberType === 4 || i.memberType === 9).length || 0 },
      ];
    });
    const memberList = computed(() => {
      switch (currentMenuIndex.value) {
        // 全部
        case 0: {
          return props.data || [];
        }
        // 联系人
        case 1: {
          return props.data?.filter((i: any) => i.memberType < 4) || [];
        }
        // 监控视频
        case 2: {
          return props.data?.filter((i: any) => i.memberType === 5) || [];
        }
        // 会场终端
        case 3: {
          return props.data?.filter((i: any) => i.memberType === 6) || [];
        }
        // 手持终端
        case 4: {
          return props.data?.filter((i: any) => i.memberType === 7) || [];
        }
        // 集群
        case 5: {
          return props.data?.filter((i: any) => i.memberType === 8) || [];
        }
        // 其他
        case 6: {
          return props.data?.filter((i: any) => i.memberType === 4 || i.memberType === 9) || [];
        }
        default:
          return [];
      }
    });
    return {
      currentMenuIndex,
      menuList,
      memberList,
    };
  },
});
</script>

<style lang="scss" module>
.title {
  font-size: 16px;
  font-weight: 500;
  margin-left: 10px;
  &::before {
    content: '';
    display: inline-block;
    width: 21px;
    height: 21px;
    vertical-align: -5px;
    background: no-repeat center/100% 100% url(./assets/icon-members.svg);
  }
}
.list {
  list-style: none;
  & > li {
    line-height: 32px;
    padding: 0 18px;
    &::before {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      vertical-align: -2px;
      margin-right: 10px;
      background: no-repeat center/100% 100% url(../../assets/icon-type-4.svg);
    }
    &.type1::before,
    &.type2::before,
    &.type3::before {
      background-image: url(../../assets/icon-type-123.svg);
    }
    &.type5::before {
      background-image: url(../../assets/icon-type-5.svg);
    }
    &.type6::before {
      background-image: url(../../assets/icon-type-6.svg);
    }
    &.type7::before {
      background-image: url(../../assets/icon-type-7.svg);
    }
    &.type8::before {
      background-image: url(../../assets/icon-type-8.svg);
    }
  }
}
</style>
