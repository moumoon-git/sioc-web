<template>
  <article :class="$style.container">
    <!-- 头部 -->
    <header :class="$style.header">
      <span class="sbs-title">任务动态</span>
    </header>
    <!-- 列表 -->
    <main :class="$style.main">
      <ul
        ref="scrollContainer"
        @scroll="loadMore"
      >
        <TaskDynamicItem
          v-for="item in taskDynamicList"
          :key="item.id"
          :data="item"
          :ongoing="ongoing"
          @reply="handleReply"
          @unread="openUnreadDialog"
        />
      </ul>
    </main>
    <!-- 底部 -->
    <footer :class="$style.footer">
      <!-- 被回复的消息 -->
      <div
        v-if="pendingReplyRecord"
        :class="$style.pendingReply"
      >
        <div>回复 {{ pendingReplyRecord.user?.username || pendingReplyRecord.mailContactorVo?.name || '未知' }}：</div>
        <div :class="$style.pendingReplyContent">{{ pendingReplyRecord.content || pendingReplyRecord.operateTypeName }}</div>
        <button
          :class="$style.cancelReply"
          @click.stop="pendingReplyRecord = null"
        />
      </div>
      <div
        v-show="uploadedList.length"
        :class="$style.uploaded"
      >
        <div
          v-for="(file, index) in uploadedList"
          :key="file.id"
        >
          <a
            :href="baseURL + file.url"
            :download="file.title"
            target="_blank"
          >
            <span>{{ file.title }}</span>
          </a>
          <button
            :class="$style.remove"
            @click.stop="deleteFileByIndex(index)"
          >移除</button>
        </div>
      </div>
      <div
        v-if="props.ongoing"
        :class="$style.editor"
      >
        <div :class="$style.operation">
          <span
            :class="$style.iconPic"
            @click="handleUploadFiles(true)"
          />
          <span
            :class="$style.iconFile"
            @click="handleUploadFiles(false)"
          />
          <ElButton
            class="sbs-button"
            type="text"
            @click="handleSubmit"
          >发送</ElButton>
        </div>
        <ElInput
          v-model="content"
          class="sbs-input"
          :rows="2"
          type="textarea"
          resize="none"
          :clearable="true"
        />
      </div>
    </footer>
    <UnreadDialog
      ref="unreadDialog"
      :data="currentUnread"
    />
  </article>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import {
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import { debounce } from 'lodash';
import TaskDynamicItem from './components/TaskDynamicItem.vue';
import UnreadDialog from './components/UnreadDialog.vue';
import useTaskDynamicService, { TaskDynamicListItem, getRawTaskList } from './scripts/useTaskDynamicService';
import { FileListItem, handleUpload } from './scripts/useUpload';
import { addTaskDynamic } from './scripts/useAddTaskDynamicService';
import { ws } from '@/product/CommandBrain3.0/mainCapacity/uds/useSingletonWS';

const { baseURL } = window.config;

const props = defineProps({
  // 任务 ID
  taskId: {
    type: Number,
    required: true,
    // TODO: 开发时使用
    // default: 96,
  },
  // 任务是否进行中，非进行中任务不能添加动态
  ongoing: {
    type: Boolean,
    required: true,
    // TODO: 开发时使用
    // default: true,
  },
});

/*            列表数据 start            */
/**
 * 滚动列表的容器 <ul>
 */
const scrollContainer = ref<HTMLUListElement>();

/**
 * 列表数据 hooks
 */
const [
  taskDynamicList,
  getTaskDynamicList,
  currentPage,
  totalPage,
] = useTaskDynamicService(props.taskId);

onMounted(() => {
  // 首次加载数据，滚动列表跳转到最底部
  getTaskDynamicList().then(() => {
    scrollContainer.value!.scrollTop = scrollContainer.value!.scrollHeight;
  });
});

/**
 * 滚动到顶，滚动事件防抖，加载下一页数据节流
 */
let isLoading = false;
const loadMore = debounce((e: MouseEvent) => {
  const el = e.target as HTMLUListElement;
  if (el.scrollTop < 50 && currentPage.value + 1 <= totalPage.value && !isLoading) {
    currentPage.value += 1;
    isLoading = true;
    getTaskDynamicList().finally(() => {
      isLoading = false;
    });
  }
}, 100);

/**
 * 新增新的动态项到列表末尾
 */
const appendNewDynamic = async () => {
  try {
    const rsp = await getRawTaskList(props.taskId);
    if (rsp.code === 0) {
      const list = rsp.data?.data || [];
      const idSet = new Set(taskDynamicList.value.map((item) => item.id));
      taskDynamicList.value.push(...list.filter((item: any) => !idSet.has(item.id)));
    } else {
      throw Error(`代码${rsp.code}，${rsp.msg}`);
    }
  } catch (err) {
    ElMessage.error(`更新任务动态列表失败：${err}`);
  }
};
/*            列表数据 end            */

/*            文件上传 start            */
/**
 * 已上传的文件列表
 */
const uploadedList = ref<FileListItem[]>([]);

/**
 * 上传文件
 */
const handleUploadFiles = (isImage = false) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = isImage ? 'image/*' : '.doc,.docx,.xls,.xlsx,.txt,.pdf,.zip,.rar,.mp3,.mp4';
  input.onchange = () => {
    if (input.files) {
      handleUpload(input.files).then((list) => {
        if (list) {
          uploadedList.value.push(...list);
        }
      });
    }
  };
  input.click();
};

/**
 * 移除待上传的文件
 * @param index 文件所在数组索引
 */
const deleteFileByIndex = (index: number) => {
  uploadedList.value.splice(index, 1);
};
/*            文件上传 end            */

/*            提交回复 start            */
/**
 * 被要回复的记录
 */
const pendingReplyRecord = ref<TaskDynamicListItem | null>();

/**
 * 点击回复
 */
const handleReply = (record: TaskDynamicListItem) => {
  pendingReplyRecord.value = record;
};

/**
 * 回复输入的文本内容
 */
const content = ref('');

/**
 * 提交回复
 */
const handleSubmit = () => {
  if (!uploadedList.value.length && !content.value) {
    ElMessage.error('请输入内容');
    return;
  }
  addTaskDynamic(
    props.taskId,
    uploadedList.value.map((i) => i.id),
    content.value,
    pendingReplyRecord.value?.id,
  ).then(() => {
    // 重置状态
    pendingReplyRecord.value = null;
    content.value = '';
    uploadedList.value = [];
    taskDynamicList.value = [];
    currentPage.value = 1;
    totalPage.value = 1;
    // 刷新列表
    isLoading = true;
    getTaskDynamicList().finally(() => { isLoading = false; });
  });
};
/*            提交回复 end            */
/*            已读未读弹窗 start            */
const unreadDialog = ref<InstanceType<typeof UnreadDialog>>();
const currentUnread = ref<any>({
  read: [],
  unread: [],
});
const openUnreadDialog = (unread: {
  read: any[],
  unread: any[],
}) => {
  currentUnread.value = unread;
  if (unreadDialog.value) {
    unreadDialog.value.open();
  }
};
/*            已读未读弹窗 end            */

/*            ws            */
const un = ws.subscribe(
  '/topic/eventTask/dynamic',
  (msg: any) => {
    appendNewDynamic();
  },
);
const seatInformation = document.cookie.match(
  /seatInformation=([^;]*)/,
)?.[1];
let uns: () => void;
if (
  seatInformation !== 'null'
  && seatInformation !== 'undefined'
  && seatInformation
) {
  const str = (window as any).decodeURIComponent(seatInformation);
  const objs: any = JSON.parse(str);
  uns = ws.subscribe(
    `/platform/${objs?.platformId}/message`,
    (msg: any) => {
      appendNewDynamic();
    },
  );
}
onBeforeUnmount(() => {
  un();
  uns();
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 14px;

  .header {
    flex-shrink: 0;
    height: 40px;
    line-height: 40px;
  }

  .main {
    flex: 1 1;
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    ul {
      flex: 1;
      height: 100%;
      list-style: none;
      padding: 0 5px;
      margin: 0;
      overflow: hidden;
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
    }
  }

  .footer {
    flex-shrink: 0;
    .editor {
      background: #F2F3F5;
      border-top: 1px solid #DDDDDD;
      padding: 0 20px 10px;
    }
    .operation {
      display: flex;
      align-items: center;
      :global(.sbs-button) {
        margin-left: auto;
      }
    }
    .uploaded {
      background: #F2F3F5;
      border-top: 1px solid #DDDDDD;
      padding: 10px 20px;
      display: flex;
      flex-direction: column;
      a {
        color: #0091FF;
        text-decoration: none;
      }
      .remove {
        color: #F66E6E;
        background: none;
        outline: none;
        border: none;
        margin-left: 10px;
        cursor: pointer;
        &:hover { filter: brightness(110%); }
        &:active { filter: brightness(90%); }
      }
    }
    .pendingReply {
      background: #F2F3F5;
      border-top: 1px solid #DDDDDD;
      padding: 10px 20px;
      color: #666;
      position: relative;
      .pendingReplyContent {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cancelReply {
        background: #666;
        mask: no-repeat center/100% 100% url('./assets/imgs/clear.svg');
        &:hover { background: #333; }
        border: none;
        cursor: pointer;
        width: 14px;
        height: 14px;
        position: absolute;
        top: 50%;
        right: 5px;
        transform: translateY(-50%);
      }
    }
    @mixin icon {
      margin-right: 10px;
      display: block;
      width: 16px;
      height: 16px;
      cursor: pointer;
      background: #99C8FB;
      &:hover {
        background: #0091FF;
      }
      &:active {
        filter: brightness(80%);
      }
    }
    .iconPic {
      @include icon;
      mask: no-repeat center/100% 100% url('./assets/imgs/pic.svg');
    }
    .iconFile {
      @include icon;
      mask: no-repeat center/100% 100% url('./assets/imgs/file.svg');
    }
  }
}
</style>
