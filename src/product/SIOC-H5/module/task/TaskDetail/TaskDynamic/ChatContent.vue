<!-- 组件：任务动态 —— 单条信息 -->
<template>
  <div v-for="(item, index) in chatList" :key="index">
    <!-- 时间分割 逻辑复杂，先不做这个逻辑了-->
    <!-- <div class="chat-content-time-division">{{ item.chatContentInformation.timeDivision }}</div> -->

    <div :class="item.contactor.isMe === 1 ? 'chat-content_me' : 'chat-content_others'">
      <!-- 头像 -->
      <div class="member-head-portrait">
        <!-- <van-image
          round
          width="0.74rem"
          height="0.74rem"
          fit="cover"
          :src="item.contactor.headPortraitUrl"
        /> -->
        <div class="member-header" v-if="item.contactor.isMe === 1">
          我
        </div>
        <div class="member-header" v-else>
          {{ item.contactor.name.length > 2 ? item.contactor.name.substring(item.contactor.name.length - 2, item.contactor.name.length) : item.contactor.name }}
        </div>
        <div class="menber-duty">{{ item.contactor.contactorTypeName }}</div>
      </div>
      <!-- 内容 -->
      <div class="chat-content">
        <!-- 聊天时间 -->
        <div class="chat-time">{{ item.chatContentInformation.timeDivision }}</div>
        <!-- 人名 -->
        <div v-if="item.contactor.isMe === 0" class="member-name">
          {{
            item.contactor.contactorTypeCode === 'admin'
              ? item.contactor.name + ' (' + '管理员' + ')'
              : item.contactor.position 
              ? item.contactor.name + ' (' + item.contactor.groupName + '/' + item.contactor.position + ')'
              : item.contactor.name + ' (' + item.contactor.groupName + ')'
          }}
        </div>

        <!-- 正文-普通的聊天内容 -->

        <!-- 语音 R1版本先不做-->
        <!-- <div class="chat-content_item_voice">
            <div :class="'chat-content_voice ' + (item.contactor.isMe === 1 ? 'flex-row-reverse' : '') ">
              <img src="../assets/images/icons/voice.png" alt="" :class="item.contactor.isMe === 1 ? 'icon-voice-right' : 'icon-voice-left'">
              15s
            </div>
        </div> -->

        <div class="chat-content_item">
          <!-- 任务状态 -->
          <div v-if="item.chatContentInformation.taskStatusCode" class="chat-task-status">
            <div v-if="item.chatContentInformation.taskStatusCode == 'finish'" class="task_finish">
              {{ item.chatContentInformation.taskStatusName }}
            </div>
            <div
              v-else-if="item.chatContentInformation.taskStatusCode == 'cancel'"
              class="task_cancel"
            >
              {{ item.chatContentInformation.taskStatusName }}
            </div>
            <div
              v-else-if="item.chatContentInformation.taskStatusCode == 'edit'"
              class="task_editing"
            >
              {{ item.chatContentInformation.taskStatusName }}
            </div>
            <div
              v-else-if="item.chatContentInformation.taskStatusCode == 'start'"
              class="task_editing"
            >
              {{ item.chatContentInformation.taskStatusName }}
            </div>
            <div
              v-else-if="item.chatContentInformation.taskStatusCode == 'restart'"
              class="task_restart"
            >
              {{ item.chatContentInformation.taskStatusName }}
            </div>
          </div>

          <!-- 要回复的内容 R1版本先不开发 -->
          <!-- 人名 + 要回复的内容 -->
          <!-- <div v-if="item.beRepliedContent.isRepliedStatus" class="beReplied-content">
            <div class="member-name">{{ item.beRepliedContent.contactor.name }}</div>

            <div class="beReplied-content_chat-text">
              <span>{{ item.beRepliedContent.chatContentInformation.text }}</span>
            </div>
          </div> -->

          <!-- 无语音 -->
          <div class="chat-content_item_container">
            <!-- 文本 -->
            <div
              v-if="item.chatContentInformation.text && item.chatContentInformation.text !== ''"
              class="chat-text"
            >
              <span>{{ item.chatContentInformation.text }}</span>
            </div>

            <!-- 文件 -->
            <TaskDocument
              v-for="(item, index) in item.attachments.files"
              :key="index"
              :file="item"
              :color="textColor"
              :download="isDownLoad"
            />

            <!-- 图片 -->
            <div
              v-if="item.attachments.images && item.attachments.images.length > 0"
              class="chat-photos"
            >
              <van-image
                v-for="(el, _index) in item.attachments.images"
                :key="_index"
                width="1.78rem"
                height="1.18rem"
                fit="cover"
                :src="baseURL + el.url"
                @click="previewImage(item.attachments.images, _index)"
              />
            </div>

            <!-- 定位 -->
            <TaskLocation
              v-if="
                item.chatContentInformation.location.address &&
                  item.chatContentInformation.location.address !== ''
              "
              :showIcon="item.chatContentInformation.location.latitude && item.chatContentInformation.location.longitude"
              :address="item.chatContentInformation.location.address"
              :color="textColor"
            />
          </div>

          <!-- 回复内容 R1版本先不做 -->
          <!-- <div v-if="item.contactor.isMe === 0" class="chat-response">回复</div> -->
        </div>

        <!-- 未读人数 R1版本先不做-->
        <div 
          v-if="item.contactor.isMe === 1"
          :class="!item.chatContentInformation.unreadNum || item.chatContentInformation.unreadNum === 0 ? 'chat-read' : 'chat-unRead'"
          @click="toRecieverList(item.id)"
        >
          {{item.chatContentInformation.unreadNum && item.chatContentInformation.unreadNum > 0 ? item.chatContentInformation.unreadNum + '人未读' : '全部已读'}}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import TaskDocument from '../../../../generalparts/FileExtensionImage/Document.vue';
import TaskLocation from '../components/TaskLocation.vue';
import { ImagePreview } from 'vant';

export default defineComponent({
  name: 'ChatContent',
  components: {
    TaskDocument,
    TaskLocation,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  props: {
    chatList: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: {
    clickRead: null
  },
  setup(props, { emit }) {
    // 文字颜色
    const textColor = '#0091FF';
    const isDownLoad = ref(true);
    const baseURL = (window as any).config.baseURL;
    /**
     * @param {Array} images 图片数组
     * @param {Nubmer}} index 下标
     * @description 图片预览
     */
    function previewImage(images: any, index: any) {
      const imagesList = images.map((item: any) => baseURL + item.url);
      ImagePreview({
        images: imagesList,
        startPosition: index, // 指定图片的初始位置（索引值）
        closeable: true,
        // 监听图片预览的关闭事件
        onClose() {},
      });
    }

    /**
     * @description 跳转到消息接收人列表
     */
    function toRecieverList(id: string | number) {
      emit('clickRead', id)
    }

    return {
      textColor,
      isDownLoad,
      baseURL,
      previewImage,
      toRecieverList,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../assets/css/common'; /*引入公共样式*/

// 图片-语音
.icon-voice-left {
  margin-right: 0.12rem;
  width: 0.4rem;
  height: 0.4rem;
}
.icon-voice-right {
  margin-left: 0.12rem;
  width: 0.4rem;
  height: 0.4rem;
  @extend .rotate_180;
}

.chat-content-time-division {
  @extend .flex_style;
  justify-content: center;
  color: #999999;
  font-size: 0.24rem;
  padding-top: 0.2rem;
}

// 别人的聊天框：
.chat-content_others {
  @extend .flex_style;
  padding: 0.2rem 0.54rem 0.2rem 0.2rem;
  font-size: $font_size_1;
}

.chat-content_me {
  @extend .flex_style;
  flex-direction: row-reverse;
  padding: 0.2rem 0.2rem 0.2rem 0.54rem;
  font-size: $font_size_1;

  .chat-content_item {
    background: #d9efff !important;
  }

  // 聊天时间：
  .chat-time {
    color: $color_12;
    font-size: 0.2rem;
    text-align: right;
  }

  .member-head-portrait {
    position: relative;
    background: #0bd295;
    border-radius: 50%;
    width: 0.74rem;
    height: 0.74rem;
    @extend .flex_style;
    flex-direction: column;
    align-items: center;
    margin-left: 0.16rem;

    .member-header {
      width: 0.74rem;
      height: 0.74rem;
      border-radius: 50%;
      background: #0091ff;
      @extend .flex_style;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-size: 0.28rem;
      text-align: center;
    }
  }
}

// 头像：
.member-head-portrait {
  position: relative;
  background: #0bd295;
  border-radius: 50%;
  width: 0.74rem;
  height: 0.74rem;
  @extend .flex_style;
  flex-direction: column;
  align-items: center;
  margin-right: 0.16rem;

  .member-header {
    width: 0.74rem;
    height: 0.74rem;
    border-radius: 50%;
    background: #0bd295;
    @extend .flex_style;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 0.28rem;
    text-align: center;
  }

  // 负责人：
  .menber-duty {
    position: absolute;
    bottom: -0.22rem;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 0px -0.02rem 0.07rem 0px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    font-size: 0.22rem;
    color: #ffffff;
  }
}

// 聊天内容：
.chat-content {
  // flex: 1;
  // border: 1px solid lightblue;

  // 聊天时间：
  .chat-time {
    color: $color_12;
    font-size: 0.2rem;
  }

  // 聊天成员：
  .member-name {
    font-size: 0.24rem;
    font-weight: 400;
    color: $color_4;
  }

  // 聊天内容：
  .chat-content_item {
    background: #ffffff;
    border: 1px solid #ededed;
    border-radius: 0.1rem;
    padding: 0.2rem 0.2rem 0 0.2rem;
    @extend .flex_style;
    flex-direction: column;
    max-width: 5.86rem;

    .chat-content_item_container {
      padding-bottom: 0.1rem;
      display: inline-block;
    }

    // 文本
    .chat-text {
      display: inline-block;
      margin-bottom: 0.1rem;

      & span {
        font-size: 0.28rem;
        color: #333333;
        overflow-wrap: anywhere;
      }
    }

    .chat-photos {
      :deep(.van-image) {
        margin-right: 0.14rem;
      }
    }
  }
  // 语音
  .chat-content_item_voice {
    display: inline-block;
    .chat-content_voice {
      @extend .flex_style;
      align-items: center;
      flex: 1;
      height: 0.8rem;
      line-height: 0.8rem;
      background: #d9efff;
      border: 0.01rem solid #ededed;
      border-radius: 0.1rem;
      font-size: $font_size_1;
      padding: 0 0.28rem;
    }

    span {
      font-size: $font_size_1;
    }
  }
}

// 回复
.chat-response {
  color: #0091ff;
  font-size: $font_size_1;
  text-align: right;
  padding-bottom: 0.16rem;
}

// 未读
.chat-unRead {
  color: $primary_color;
  font-size: $font_size_2;
  text-align: right;
}
// 全部已读
.chat-read {
  color: $color_2;
  font-size: $font_size_2;
  text-align: right;
}

// 任务状态
.chat-task-status {
  font-size: $font_size_1;
  display: inline-block;

  // 任务取消
  .task_cancel {
    position: relative;
    font-size: $font_size_1;
    color: $error_color;
    padding-left: 0.3rem;

    &::before {
      display: block;
      content: '';
      width: 0.2rem;
      height: 0.2rem;
      background: $error_color;
      position: absolute;
      left: -0rem;
      border-radius: 50%;
      top: 0.1rem;
    }
  }

  // 任务重启
  .task_restart {
    position: relative;
    font-size: $font_size_1;
    color: $primary_color;
    padding-left: 0.3rem;

    &::before {
      display: block;
      content: '';
      width: 0.2rem;
      height: 0.2rem;
      background: $primary_color;
      position: absolute;
      left: -0rem;
      border-radius: 50%;
      top: 0.1rem;
    }
  }

  // 任务完成
  .task_finish {
    position: relative;
    font-size: $font_size_1;
    color: $save_color;
    padding-left: 0.3rem;

    &::before {
      display: block;
      content: '';
      width: 0.2rem;
      height: 0.2rem;
      background: $save_color;
      position: absolute;
      left: -0rem;
      border-radius: 50%;
      top: 0.1rem;
    }
  }

  // 任务修订中
  .task_editing {
    position: relative;
    font-size: $font_size_1;
    color: $warning_color;
    padding-left: 0.3rem;

    &::before {
      display: block;
      content: '';
      width: 0.2rem;
      height: 0.2rem;
      background: $warning_color;
      position: absolute;
      left: -0rem;
      border-radius: 50%;
      top: 0.1rem;
    }
  }
}

.beReplied-content {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 0.04rem;
  border-left: 0.06rem solid rgba(0, 0, 0, 0.1);
  padding: 0.12rem 0.14rem;
  margin: 0.1rem 0 0.2rem 0;

  .member-name {
    font-size: 0.28rem;
    color: #666666;
  }
  .beReplied-content_chat-text {
    color: #666666;
    margin-bottom: 0;
    span {
      font-size: 0.24rem !important;
    }
  }
}
</style>
