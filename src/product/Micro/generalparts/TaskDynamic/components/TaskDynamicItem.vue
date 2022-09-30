<template>
  <li
    :class="[
      $style.container,
      {
        [$style.myself]: currentUser === data.user?.username || currentUser === data.mailContactorVo?.name
      },
    ]"
  >
    <!-- 头像 -->
    <div :class="$style.avatar">
      <div>{{ data.user?.username || data.mailContactorVo?.name || '未知' }}</div>
      <div>{{ data.contactorTypeName }}</div>
    </div>
    <div>
      <!-- 用户信息 + 时间戳 -->
      <div :class="$style.title">
        <span>{{ data.user?.username || data.mailContactorVo?.name || '未知' }}</span>
        <span :class="$style.timeline">{{ data.reportTime }}</span>
      </div>
      <!-- 气泡内容 -->
      <div :class="$style.bubble">
        <div
          v-if="data.replyResult"
          :class="$style.replyResult"
        >
          <div>{{ data.replyResult.user?.username || data.replyResult.mailContactorVo?.name || '未知' }}：</div>
          <div>{{ data.replyResult.content || data.replyResult.operateTypeName }}</div>
        </div>
        <div>{{ data.operateTypeName }}</div>
        <div>{{ data.content }}</div>
        <div>
          <!-- 图片 -->
          <div v-viewer>
            <img
              v-for="img in data.appAttachments.filter((i) => isImg(i.title))"
              :key="img.id"
              :src="baseURL + img.url"
              :title="img.title"
              :alt="img.title"
              height="50"
              width="50"
              style="cursor: zoom-in"
            >
          </div>
          <!-- 音频 -->
          <div>
            <VoiceRecord
              v-for="audio in data.appAttachments.filter((i) => isAudio(i.title))"
              :key="audio.id"
              :title="audio.title"
              :src="baseURL + audio.url"
            />
          </div>
          <!-- 其他 -->
          <div>
            <a
              v-for="file in data.appAttachments.filter((i) => !isImg(i.title) && !isAudio(i.title))"
              :key="file.id"
              :href="baseURL + file.url"
              :title="file.title"
              :download="file.title"
              target="_blank"
            >
              {{ file.title }}
            </a>
          </div>
        </div>
        <div
          v-if="data.address"
          :class="$style.address"
        >{{ data.address }}</div>
        <el-button
          v-if="ongoing"
          :class="[$style.reply, 'sbs-button']"
          type="text"
          @click="$emit('reply', data)"
        >回复</el-button>
        <div
          v-if="currentUser === data.user?.username || currentUser === data.mailContactorVo?.name"
          :class="$style.unread"
        >
          <span
            @click="getReadList(data)"
          >
            <span
              v-if="data.unreadNum"
              style="color:#0091FF;font-size:12px;"
            >{{ `${data.unreadNum}人未读` }}</span>
            <span
              v-else
              style="color:#C8C9CC;font-size:12px;"
            >全部已读</span>
          </span>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  PropType,
} from 'vue';
import cookie from 'js-cookie';
import { ElDropdown } from 'element-plus';
import VoiceRecord from './VoiceRecord.vue';
import { TaskDynamicListItem } from '../scripts/useTaskDynamicService';
import getTaskDynamicReadList from '../scripts/useTaskDynamicReadListService';

const { baseURL } = window.config;

const emit = defineEmits(['reply', 'unread']);

const props = defineProps({
  data: {
    type: Object as PropType<TaskDynamicListItem>,
    required: true,
  },
  // 任务是否进行中，非进行中任务不能添加动态
  ongoing: {
    type: Boolean,
    required: true,
  },
});

const isImg = (filename: string) => {
  const regexp = /.*\.(png|jp(e)?g|svg)$/i;
  return regexp.test(filename);
};

const isAudio = (filename: string) => {
  const regexp = /.*\.(mp3)/i;
  return regexp.test(filename);
};

const currentUser = cookie.get('userName');

const showReadList = (resultId: number) => {
  getTaskDynamicReadList(resultId).then((res) => {
    console.log(res);
  });
};

const getReadList = (data: any) => {
  if (!data.readList) {
    getTaskDynamicReadList(data.id).then((res) => {
      data.readList = res;
      emit('unread', res);
    });
  } else {
    emit('unread', data.readList);
  }
};
</script>

<style lang="scss" module>
.container {
  display: flex;
  position: relative;
  color: #333;
  margin-bottom: 25px;

  &:hover {
    .reply {
      display: block;
    }
  }

  &.myself {
    flex-direction: row-reverse;
    .bubble {
      background: #57DFA9;
      margin-right: 0;
      margin-left: 50px;
      &::after {
        left: auto;
        right: -5px;
        clip-path: polygon(0 0, 100% 50%, 0 100%);
      }
    }
    .title {
      text-align: right;
      flex-direction: row-reverse;
    }
    .reply {
      left: -35px;
      right: auto;
    }
  }

  .avatar {
    text-align: center;
    margin: 0 10px;
    $basis: 50px;
    & > div:first-child {
      width: $basis;
      height: $basis;
      line-height: $basis;
      background: #0091FF;
      border-radius: 4px;
      color: #FFF;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    & > div:last-child {
      width: $basis;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: absolute;
      background: rgba(0, 0, 0, 0.39);
      color: #FFF;
      font-size: 12px;
      transform: translateY(-100%);
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }

  .title {
    color: #C8C9CC;
    display: flex;
    align-items: center;
    .timeline {
      margin: 0 10px;
    }
  }

  .bubble {
    background: #F1F4F6;
    border-radius: 4px;
    margin-top: 5px;
    margin-right: 50px;
    padding: 8px 10px;
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 5px;
      height: 10px;
      position: absolute;
      top: 12px;
      left: -5px;
      clip-path: polygon(100% 0, 0 50%, 100% 100%);
      background: inherit;
    }
    a {
      color: #0091FF;
      text-decoration: none;
    }
  }
  .replyResult {
    border-left: 1px solid #999;
    margin-bottom: 5px;
    color: #666;
    padding-left: 10px;
  }
  .address {
    margin-top: 5px;
    font-size: 12px;
    color: #666;
    &::before {
      content: '';
      display: inline-block;
      width: 12px;
      height: 12px;
      color: inherit;
      background: currentColor;
      vertical-align: middle;
      margin-right: 5px;
      mask: no-repeat center/100% 100% url('../assets/imgs/address.svg');
    }
  }
  .reply {
    display: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -35px;
  }
  .unread {
    font-size: 10px;
    position: absolute;
    bottom: -17px;
    right: 0;
    cursor: pointer;
  }
}
</style>
