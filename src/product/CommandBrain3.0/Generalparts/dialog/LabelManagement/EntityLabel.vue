<template>
  <div
    :class="$style.container"
  >
    <!-- 标签列表 -->
    <span
      v-for="(label, labelIndex) in modelValue"
      :key="label.id"
      :style="{
        color: label.labelStyle,
      }"
      :class="[
        $style.labelItem,
        { [$style.editable]: editable }
      ]"
    >
      {{ label.name }}
      <!-- 标签移除按钮 -->
      <span
        v-if="editable"
        :class="$style.deleteBtn"
        @click="removeLabel(labelIndex)"
      />
    </span>
    <span
      v-if="editable"
      ref="popupAnchor"
    >
      <!-- 尾部添加标签按钮 -->
      <button
        :class="$style.trailAdd"
        @click="togglePopup"
      />
      <!-- 气泡弹窗 -->
      <article
        v-if="popupVisible"
        :class="$style.popup"
      >
        <header>
          <input
            v-model="inputValue"
            placeholder="请输入标签"
            maxlength="20"
            @input="searchLabel(inputValue)"
          >
          <button
            v-if="inputValue"
            style="right: 30px;"
            @click="handleAddLabel"
          />
          <button
            v-if="inputValue"
            @click="inputValue = '';"
          />
        </header>
        <main>
          <!-- 常用标签列表 -->
          <ul
            v-if="!inputValue"
          >
            <div :class="$style.tab">
              <span
                :class="{ [$style.active]: isRecent }"
                @click="isRecent = true"
              >最近标签</span>
              <span
                :class="{ [$style.active]: !isRecent }"
                @click="isRecent = false"
              >常用标签</span>
            </div>
            <li
              v-for="item in (isRecent ? latestUsedLabelList : frequentlyUsedLabelList)"
              :key="item.id"
              :class="{
                [$style.selectedItem]: modelValue.find((i) => item.id === i.id)
              }"
              @click="toggleLabel(item)"
            >
              <EditInput
                v-if="item === editingItem"
                placeholder="请输入标签名称"
                :value="item.name"
                @click.stop
                @confirm="handleUpdateLabel"
                @cancel="editingItem = undefined"
              />
              <template v-else>
                <div>{{ item.name }}</div>
                <button @click.stop="editingItem = item">编辑</button>
                <button @click.stop="handleDeleteLabel(item)">删除</button>
              </template>
            </li>
          </ul>
          <!-- 标签搜索结果 -->
          <ul
            v-else
          >
            <li
              v-for="item in searchLabelResultList"
              :key="item.id"
              :class="{
                [$style.selectedItem]: modelValue.find((i) => item.id === i.id)
              }"
              @click="toggleLabel(item)"
            >
              <EditInput
                v-if="item === editingItem"
                placeholder="请输入标签名称"
                :value="item.name"
                @click.stop
                @confirm="handleUpdateLabel"
                @cancel="editingItem = undefined;"
              />
              <template v-else>
                <div>{{ item.name }}</div>
                <button @click.stop="editingItem = item">编辑</button>
                <button @click.stop="handleDeleteLabel(item)">删除</button>
              </template>
            </li>
          </ul>
        </main>
      </article>
    </span>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  PropType,
} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import siocMessage from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';
import EditInput from '@/product/CommandBrain3.0/Generalparts/right/EditInput/EditInput.vue';
import STYLE_COMMAND from './styles/EntityLabel.command.module.scss';
import STYLE_SBS from './styles/EntityLabel.sbs.module.scss';
import {
  LabelItem,
  LabelType,
  useFrequentlyUsedLabelList,
  useSearchLabel,
  updateLabel,
  createLabel,
  deleteLabel,
  useLatestUsedLabelList,
} from './scripts/useLabelServices';

const props = defineProps({
  // 样式模板
  styleTemplate: {
    type: String as PropType<StyleType>,
    default: 'command',
  },
  // 选择的标签列表
  modelValue: {
    type: Array as PropType<LabelItem[]>,
    required: true,
    default: () => [],
  },
  // 可编辑
  editable: {
    type: Boolean,
    default: true,
  },
  // 标签类型
  type: {
    type: Number,
    default: LabelType.Task,
  },
});
const messageType = {
  command: siocMessage,
  sbs: ElMessage,
};
const $message = messageType[props.styleTemplate];

const emits = defineEmits(['update:modelValue']);

/*           动态样式           */
type StyleType = 'command' | 'sbs';

const styleType = {
  command: STYLE_COMMAND,
  sbs: STYLE_SBS,
};

const $style = styleType[props.styleTemplate];

/*           气泡弹窗           */
// 气泡弹窗锚点
const popupAnchor = ref<HTMLSpanElement>();
// 气泡弹窗显隐
const popupVisible = ref(false);
let stop = false;
// 全局点击事件，关闭弹窗
const clickListener = (evt: MouseEvent) => {
  if (!stop) {
    if (!popupAnchor.value!.contains(evt.target as Node)) {
      popupVisible.value = false;
      document.removeEventListener('click', clickListener, true);
    }
  }
};
// 切换气泡弹窗显隐
const togglePopup = () => {
  popupVisible.value = !popupVisible.value;
  if (popupVisible.value) {
    document.addEventListener('click', clickListener, true);
  } else {
    document.removeEventListener('click', clickListener, true);
  }
};

/*           标签操作           */
// 当前 tab 是否为最近标签
const isRecent = ref(true);

// 常用标签
const [frequentlyUsedLabelList, getFrequentlyUsedLabelList] = useFrequentlyUsedLabelList();
getFrequentlyUsedLabelList(props.type).catch((err) => { $message.error(err); });

// 最近标签
const [latestUsedLabelList, getLatestUsedLabelList] = useLatestUsedLabelList();
getLatestUsedLabelList(props.type).catch((err) => { $message.error(err); });

// 搜索标签
const [searchLabelResultList, searchLabel] = useSearchLabel(props.type);

// 输入框值
const inputValue = ref('');

// 移除标签
const removeLabel = (labelIndex: number) => {
  emits('update:modelValue', props.modelValue.filter((item, index) => index !== labelIndex));
};

// 切换标签勾选
const toggleLabel = (label: LabelItem) => {
  const exist = props.modelValue.findIndex((item) => item.id === label.id);
  if (exist !== -1) {
    removeLabel(exist);
  } else {
    emits('update:modelValue', [...props.modelValue, label]);
  }
};

// 正在编辑的标签项
const editingItem = ref<LabelItem>();

// 更新标签
const handleUpdateLabel = (newName: string) => {
  updateLabel({
    ...editingItem.value!,
    name: newName,
  }).then(() => {
    const origin = JSON.parse(JSON.stringify(props.modelValue));
    for (let i = 0; i < origin.length; i += 1) {
      if (origin[i].id === editingItem.value!.id) {
        origin[i].name = newName;
      }
    }
    emits('update:modelValue', origin);
    editingItem.value!.name = newName;
    editingItem.value = undefined;
    $message.success('标签编辑成功');
  }).catch((err) => {
    $message.error(err);
  });
};

// 添加标签
const handleAddLabel = () => {
  const randomColor = ['#56E9FF', '#F2B626', '#F66E6E', '#0091FF'][(Math.random() * 10) % 4];
  createLabel(inputValue.value, props.type, randomColor).then((label) => {
    if (!props.modelValue.find((i) => i.id === label.id)) {
      emits('update:modelValue', [...props.modelValue, label]);
    }
    popupVisible.value = false;
    inputValue.value = '';
  }).catch((err) => {
    $message.error(err);
  });
};

const handleDeleteLabel = (label: LabelItem) => {
  stop = true;
  ElMessageBox.confirm(
    '是否删除该标签，删除后所有应用该标签的任务都将自动移除该标签！',
    '删除标签',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(() => {
    deleteLabel(label.id).then(() => {
      $message.success('标签删除成功');
      frequentlyUsedLabelList.value = frequentlyUsedLabelList.value.filter((i) => i.id !== label.id);
      searchLabelResultList.value = searchLabelResultList.value.filter((i) => i.id !== label.id);
      emits('update:modelValue', props.modelValue.filter((i) => i.id !== label.id));
    }).catch((err) => {
      $message.error(err);
    });
  }).finally(() => {
    stop = false;
  });
};
</script>
