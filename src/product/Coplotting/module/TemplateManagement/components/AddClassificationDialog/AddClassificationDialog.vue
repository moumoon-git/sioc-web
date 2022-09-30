// 新增分类弹窗
<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="新增分类"
    width="800px"
  >
    <main :class="$style.container">
      <section :class="$style.left">
        <ul>
          <li
            v-for="(folder, folderIndex) in folderList"
            :key="folderIndex"
            :class="{
              [$style.active]: folder?.id === currentFolder?.id
            }"
            @click="handleClickFolder(folder)"
          >
            {{ folder.fileName }}
          </li>
        </ul>
      </section>
      <section :class="$style.right">
        <main>
          <div
            v-for="(classification, classificationIndex) in classificationList"
            :key="classificationIndex"
            @click="toggleClassification(classification)"
          >
            <div>
              <div>
                <!-- 点分类 -->
                <div
                  v-if="classificationType === 0"
                  :class="$style.iconClass"
                  :style="{
                    backgroundImage: `url('${baseURL}${classification?.defaultStatus?.iconUrl}')`,
                  }"
                />
                <!-- 面分类 -->
                <div
                  v-if="classificationType === 1"
                  :class="$style.areaClass"
                  :style="{
                    borderColor: classification?.defaultStatus?.stylePropertyEntity?.strokeColor,
                    borderWidth: `${classification?.defaultStatus?.stylePropertyEntity?.lineHeight}px`,
                    borderStyle: classification?.defaultStatus?.stylePropertyEntity?.lineType ? 'solid' : 'dashed',
                  }"
                >
                  <div
                    :style="{
                      background: classification?.defaultStatus?.stylePropertyEntity?.fillColor,
                      opacity: classification?.defaultStatus?.stylePropertyEntity?.fillOpacity / 100,
                    }"
                  />
                </div>
                <!-- 线分类 -->
                <div
                  v-if="classificationType === 2"
                  :class="$style.lineClass"
                  :style="{
                    color: classification?.defaultStatus?.stylePropertyEntity?.fillColor,
                    borderTopWidth: `${classification?.defaultStatus?.stylePropertyEntity?.lineHeight}px`,
                    borderTopStyle: classification?.defaultStatus?.stylePropertyEntity?.lineType ? 'solid' : 'dashed',
                    opacity: classification?.defaultStatus?.stylePropertyEntity?.fillOpacity / 100,
                  }"
                />
                <!-- 其他 -->
                <div
                  v-if="classificationType === 3"
                  :class="$style.otherClass"
                  :style="{
                    background: classification?.defaultStatus?.stylePropertyEntity?.strokeColor,
                    height: `${classification?.defaultStatus?.stylePropertyEntity?.lineHeight}px`,
                    opacity: classification?.defaultStatus?.stylePropertyEntity?.fillOpacity / 100,
                  }"
                />
              </div>
              <div>{{ classification?.className }}</div>
            </div>
            <div
              :class="{
                [$style.checked]: selectedClassificationSet.get(classification.id),
              }"
            />
          </div>
        </main>
        <footer>
          <ElButton
            type="text"
            @click.stop.prevent="selectAll"
          >
            全选
          </ElButton>
          <ElButton
            type="text"
            @click.stop.prevent="selectReverse"
          >
            反选
          </ElButton>
        </footer>
      </section>
    </main>
    <footer :class="$style.footer">
      <span>已选：<strong>{{ selectedClassificationSet.size }}</strong></span>
      <ElButton
        v-if="selectedClassificationSet.size"
        class="sv-button"
        type="primary"
        @click="handleAdd"
      >
        添加
      </ElButton>
      <ElButton
        class="sv-button"
        @click="showDialog = false;"
      >
        取消
      </ElButton>
    </footer>
  </ElDialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';

interface Classification {
  className: string,
  id: number,
  defaultStatus: {
    iconUrl: string,
    stylePropertyEntity: any,
  } | null,
}

export default defineComponent({
  name: 'AddClassificationDialog',
  props: {
    // 分类类型：0-点，1-面，2-线，3-其他
    classificationType: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    'add',
  ],
  setup() {
    // 是否显示弹窗
    const showDialog = ref(false);
    // 文件夹列表
    const folderList = ref<any[]>([]);
    const currentFolder = ref<Classification | null>(null);
    // 分类列表
    const classificationList = ref<Classification[]>([]);
    return {
      showDialog,
      folderList,
      classificationList,
      currentFolder,
    };
  },
  data() {
    return {
      selectedClassificationSet: new Map(),
      baseURL: (window as any).config.baseURL,
      tobeDeletedIds: [] as number[],
    };
  },
  mounted() {
    this.getFolderList();
  },
  beforeUnmount() {
    this.selectedClassificationSet.clear();
  },
  methods: {
    open(addedClassificationList: any[] = []) {
      this.showDialog = true;
      this.currentFolder = null;
      this.classificationList = [];
      this.tobeDeletedIds = [];
      this.getFolderList();
      this.selectedClassificationSet.clear();
      addedClassificationList.forEach((i) => {
        i.id = i.basicClassId;
        this.selectedClassificationSet.set(i.id, i);
      });
    },
    /**
     * 获取文件夹列表
     */
    getFolderList() {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistclassfile/listByType',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          basicClassType: this.classificationType,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0 && response?.data?.data) {
          this.folderList = response.data.data || [];
          // 排序
          /**
           * 对文件夹列表进行排序
           * @param list 文件夹列表
           * @returns 排序后的列表
           */
          const sortFolderList = (list: any[]) => {
            const type1: any = [];
            const type2: any = [];
            const type3: any = [];
            list.forEach((item: any) => {
              if (item.fileType === 1) type1.push(item);
              if (item.fileType === 2) type2.push(item);
              if (item.fileType === 3) type3.push(item);
            });
            type1.sort((a: any, b: any) => a.id - b.id);
            type2.sort((a: any, b: any) => a.id - b.id);
            type3.sort((a: any, b: any) => a.id - b.id);
            return [
              ...type1,
              ...type2,
              ...type3,
            ];
          };
          this.folderList = sortFolderList(this.folderList);
          // 找出第一条数据
          for (let i = 0; i < this.folderList.length; i += 1) {
            if (this.folderList[i]?.basicClassList?.length) {
              this.currentFolder = this.folderList[i];
              this.classificationList = this.folderList[i].basicClassList;
              break;
            }
          }
        } else {
          ElMessage.error(`获取列表失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取列表失败，错误信息：${error}`);
      });
    },
    // 点击文件夹，取出下属分类
    handleClickFolder(data: any) {
      this.currentFolder = data;
      this.classificationList = data?.basicClassList || [];
    },
    // 切换分类选择
    toggleClassification(classification: Classification) {
      if (this.selectedClassificationSet.get(classification.id)) {
        this.selectedClassificationSet.delete(classification.id);
        this.tobeDeletedIds.push(classification.id);
      } else {
        this.selectedClassificationSet.set(classification.id, classification);
      }
    },
    // 点击确认添加
    handleAdd() {
      this.$emit('add', Array.from(this.selectedClassificationSet, (v) => v[1]));
      this.showDialog = false;
    },
    // 全选
    selectAll() {
      this.classificationList.forEach((classification) => {
        this.selectedClassificationSet.set(classification.id, classification);
      });
    },
    // 反选
    selectReverse() {
      const exist = new Set();
      this.selectedClassificationSet.forEach((classification: Classification) => {
        if (this.classificationList.find((item) => item.id === classification.id)) {
          exist.add(classification.id);
        }
      });
      this.classificationList.forEach((classification) => {
        this.selectedClassificationSet.set(classification.id, classification);
      });
      exist.forEach((classificationId) => {
        this.selectedClassificationSet.delete(classificationId);
      });
      exist.clear();
    },
  },
});
</script>

<style lang="scss" module src="./styles/AddClassificationDialog.scss" />
