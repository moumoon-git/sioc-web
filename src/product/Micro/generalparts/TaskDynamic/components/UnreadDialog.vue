<template>
  <ElDialog
    v-model="visible"
    :modal="false"
    custom-class="sbs-dialog"
    width="500px"
    title="消息接收人列表"
  >
    <div :class="$style.container">
      <div :class="$style.left">
        <div :class="$style.title">
          <span>未读</span>
          <span>{{ data?.unread?.length || 0 }}</span>
        </div>
        <ul>
          <li
            v-for="contact in data?.unread ?? []"
            :key="contact.id"
          >
            <div :class="$style.avatar">{{ contact.name?.slice(0, 2) || '未知' }}</div>
            <div>
              {{ contact.name || '未知' }}
              ({{ contact.contactType }})
            </div>
          </li>
        </ul>
      </div>
      <div :class="$style.right">
        <div :class="$style.title">
          <span>已读</span>
          <span>{{ data?.read?.length || 0 }}</span>
        </div>
        <ul>
          <li
            v-for="contact in data?.read ?? []"
            :key="contact.id"
          >
            <div :class="$style.avatar">{{ contact.name?.slice(0, 2) || '未知' }}</div>
            <div>
              {{ contact.name || '未知' }}
              ({{ contact.contactType }})
            </div>
          </li>
        </ul>
      </div>
    </div>
  </ElDialog>
</template>

<script lang="ts" setup>
import {
  ref,
} from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      read: [],
      unread: [],
    }),
  },
});

const visible = ref(false);

const open = () => {
  visible.value = true;
};

defineExpose({
  open,
});
</script>

<style lang="scss" module>
.container {
  height: 300px;
  display: flex;
  .left {
    border-right: 1px solid #DCDEE0;
    .title > span:last-child {
      color: #FF4D4F;
    }
  }
  .left, .right {
    flex: 1;
    width: 50%;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    .title {
      color: #999;
      font-size: 16px;
      & > span:last-child {
        margin-left: 10px;
        font-weight: bold;
      }
    }
    ul {
      flex: 1;
      margin: 0;
      padding: 10px 0;
      list-style: none;
      overflow: hidden;
      color: #555;
      &:hover {
        overflow-y: auto;
        padding-right: 0;
      }
      &::-webkit-scrollbar {
        background: transparent;
        width: 5px;
        height: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d5d5d5;
        border-radius: 5px;
      }
      li {
        display: flex;
        align-items: center;
      }
      .avatar {
        width: 25px;
        height: 25px;
        line-height: 25px;
        border-radius: 100%;
        background: #0091FF;
        color: #FFF;
        text-align: center;
        margin-right: 10px;
      }
    }
  }
}
</style>
