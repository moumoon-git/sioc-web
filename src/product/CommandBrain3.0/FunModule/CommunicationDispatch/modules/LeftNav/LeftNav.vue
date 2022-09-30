<template>
  <nav :class="$style.container">
    <ul>
      <li
        v-for="(icon, iconIndex) in iconList"
        :key="iconIndex"
        :style="{
          color: modelValue === icon.className ? '#56E9FF' : '',
        }"
        @click.stop="$emit('update:modelValue', icon.className)"
      >
        <!-- 图标 -->
        <div :class="$style[icon.className]" />
        <!-- 名称 -->
        <div>{{ icon.name }}</div>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'LeftNav',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: [
    'update:modelValue',
  ],
  setup() {
    const iconList = ref([
      // {
      //   name: '消息',
      //   className: 'message',
      // },
      {
        name: '电话',
        className: 'phone',
      },
      {
        name: '短信',
        className: 'sms',
      },
      {
        name: '会议',
        className: 'meeting',
      },
      // {
      //   name: '通告',
      //   className: 'announcement',
      // },
      {
        name: '组织架构',
        className: 'structure',
      },
      {
        name: '设备',
        className: 'device',
      },
        {
        name: '传真',
        className: 'message',
      },
    ] as const);
    const activeIcon = ref(iconList.value[0]);
    const switchIcon = (icon: typeof iconList.value[0]) => {
      activeIcon.value = icon;
    };
    return {
      iconList,
      activeIcon,
      switchIcon,
    };
  },
});
</script>

<style lang="scss" module>
.container {
  border-right: 1px solid rgba(255, 255, 255, .15);
  width: 88px;
  flex-shrink: 0;
  color: #FFF;
  & > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    & > li {
      height: 85px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      transition: all .3s;
      &:hover {
        color: #56E9FF;
      }
      & > div:first-child {
        width: 30px;
        height: 30px;
        margin: 10px auto;
        background: currentColor;
        $icon-list: message, phone, sms, meeting, announcement, structure, device;
        @each $icon in $icon-list {
          &.#{$icon} {
            mask: no-repeat center/100% 100% url(./assets/icon-#{$icon}.svg);
          }
        }
      }
      & > div:last-child {
        font-size: 16px;
      }
    }
  }
}
</style>
