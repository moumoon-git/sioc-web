// 模板管理弹窗
<template>
  <ElDialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="模板管理"
    width="800px"
  >
    <main :class="$style.container">
      <section :class="$style.left">
        <header>
          <span :class="$style.title">模板类型</span>
          <ElButton
            :class="$style.addBtn"
            type="text"
            @click="isAddingTemplateType = true;"
          >
            新建模板
          </ElButton>
        </header>
        <EditTreeNode
          v-if="isAddingTemplateType"
          origin=""
          style="margin: 5px 15px;"
          @confirm="handleTemplateTypeAdd"
          @cancel="isAddingTemplateType = false;"
        />
        <main :class="$style.list">
          <ul>
            <li
              v-for="(templateType, templateTypeIndex) in templateTypeList"
              :key="templateTypeIndex"
              :class="{
                [$style.activeTemplate]: templateType?.id === currentTemplateType?.id,
              }"
              @click="handleTemplateTypeClick(templateType)"
            >
              <EditTreeNode
                v-if="edittingTemplateTypeID === templateType?.id"
                :origin="templateType?.templateName"
                style="width: 250px;"
                @confirm="handleTemplateTypeRename"
                @cancel="edittingTemplateTypeID = 0;"
              />
              <div
                v-else
                :class="$style.listItem"
              >
                <div>{{ templateType?.templateName }}</div>
                <div>
                  <button @click.stop="edittingTemplateTypeID = templateType?.id" />
                  <button @click.stop="handleDeleteTemplateType(templateType?.id)" />
                </div>
              </div>
            </li>
          </ul>
        </main>
      </section>
      <section
        v-if="currentTemplateType"
        :class="$style.right"
      >
        <!-- 顶部标签 -->
        <header>
          <ElButton
            :class="[
              'sv-button',
              {
                [$style.activeTab]: currentClassifcationType === 0,
              }
            ]"
            @click="currentClassifcationType = 0"
          >
            点分类
          </ElButton>
          <ElButton
            :class="[
              'sv-button',
              {
                [$style.activeTab]: currentClassifcationType === 1,
              }
            ]"
            @click="currentClassifcationType = 1"
          >
            面分类
          </ElButton>
          <ElButton
            :class="[
              'sv-button',
              {
                [$style.activeTab]: currentClassifcationType === 2,
              }
            ]"
            @click="currentClassifcationType = 2"
          >
            线分类
          </ElButton>
          <ElButton
            :class="[
              'sv-button',
              {
                [$style.activeTab]: currentClassifcationType === 3,
              }
            ]"
            @click="currentClassifcationType = 3"
          >
            其他
          </ElButton>
        </header>
        <!-- 图标列表 -->
        <main>
          <div
            :class="$style.addClass"
            @click.stop="handleAddClassification"
          >
            <div />
            <span>添加分类</span>
          </div>
          <div
            v-for="(icon, index) in classificationList"
            :key="index"
            :class="$style.icon"
          >
            <div>
              <div>
                <!-- 点分类 -->
                <div
                  v-if="currentClassifcationType === 0"
                  :class="$style.iconClass"
                  :style="{
                    backgroundImage: `url('${baseURL}${icon.iconUrl}')`,
                  }"
                />
                <!-- 面分类 -->
                <div
                  v-if="currentClassifcationType === 1"
                  :class="$style.areaClass"
                  :style="{
                    borderColor: icon?.stylePropertyJson?.strokeColor,
                    borderWidth: `${icon?.stylePropertyJson?.lineHeight}px`,
                    borderStyle: icon?.stylePropertyJson?.lineType ? 'solid' : 'dashed',
                  }"
                >
                  <div
                    :style="{
                      background: icon?.stylePropertyJson?.fillColor,
                      opacity: icon?.stylePropertyJson?.fillOpacity / 100,
                    }"
                  />
                </div>
                <!-- 线分类 -->
                <div
                  v-if="currentClassifcationType === 2"
                  :class="$style.lineClass"
                  :style="{
                    color: icon?.stylePropertyJson?.fillColor,
                    borderTopWidth: `${icon?.stylePropertyJson?.lineHeight}px`,
                    borderTopStyle: icon?.stylePropertyJson?.lineType ? 'solid' : 'dashed',
                    opacity: icon?.stylePropertyJson?.fillOpacity / 100,
                  }"
                />
                <!-- 其他 -->
                <div
                  v-if="currentClassifcationType === 3"
                  :class="$style.otherClass"
                  :style="{
                    background: icon?.stylePropertyJson?.strokeColor,
                    height: `${icon?.stylePropertyJson?.lineHeight}px`,
                    opacity: icon?.stylePropertyJson?.fillOpacity / 100,
                  }"
                />
              </div>
              <div>{{ icon.className }}</div>
            </div>
            <div>
              <button
                @click.stop.prevent="handleLookupClassification(icon)"
              />
              <button
                @click.stop.prevent="handleDeleteClassification([icon])"
              />
            </div>
          </div>
        </main>
      </section>
    </main>
  </ElDialog>
  <!-- 新增分类弹窗 -->
  <AddClassificationDialog
    ref="AddClassificationDialogRef"
    :classification-type="currentClassifcationType"
    @add="handleAddClassificationToTemplate"
  />
  <LookupClassificationDialog
    ref="LookupClassificationDialogRef"
    :template-type="currentTemplateType"
  />
  <!-- 分类详情弹窗 -->
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent, ref, provide } from 'vue';
import EditTreeNode from './components/EditTreeNode/EditTreeNode.vue';
import AddClassificationDialog from './components/AddClassificationDialog/AddClassificationDialog.vue';
import LookupClassificationDialog from './components/LookupClassificationDialog/LookupClassificationDialog.vue';

export default defineComponent({
  name: 'TemplateManagement',
  components: {
    EditTreeNode,
    AddClassificationDialog,
    LookupClassificationDialog,
  },
  setup() {
    // 显示弹窗
    const showDialog = ref(false);
    const open = () => {
      showDialog.value = true;
    };
    // 模板类型列表
    const templateTypeList = ref<any>([]);
    // 正在编辑的模板类型id
    const edittingTemplateTypeID = ref<number>(0);
    // 正在新增模板类型
    const isAddingTemplateType = ref<boolean>(false);
    // 当前的分类类型：0-点，1-面，2-线，3-其他
    const currentClassifcationType = ref<number>(0);
    provide('activeTabIndex', currentClassifcationType);
    // 当前点击选中的模板类型
    const currentTemplateType = ref<any>(null);
    // 当前分类的列表
    const classificationList = ref<any[]>([]);
    return {
      showDialog,
      templateTypeList,
      edittingTemplateTypeID,
      isAddingTemplateType,
      currentClassifcationType,
      currentTemplateType,
      classificationList,
      open,
    };
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
  watch: {
    currentClassifcationType() {
      this.getClassificationList();
    },
  },
  mounted() {
    this.getTemplateTypeList();
  },
  methods: {
    // 获取模板类型列表
    getTemplateTypeList() {
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assisttemplatetype/list',
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.templateTypeList = response.data || [];
          if (this.templateTypeList.length) {
            this.handleTemplateTypeClick(this.templateTypeList[0]);
          }
        } else {
          ElMessage.error(`获取模板类型列表失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取模板类型列表失败，错误信息：${error}`);
      });
    },
    // 点击模板类型
    handleTemplateTypeClick(data: any) {
      this.currentClassifcationType = 0;
      this.currentTemplateType = data;
      this.getClassificationList();
    },
    // 获取对应模板类型的分类点数据
    getClassificationList() {
      this.classificationList = [];
      const request = {
        method: 'get',
        service: 'coplotting',
        url: '/assist/assisttemplatebasicclassrelated/list',
        params: {
          type: this.currentClassifcationType,
          templateTypeId: this.currentTemplateType?.id,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.classificationList = response.data || [];
        } else {
          ElMessage.error(`获取分类数据失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`获取分类数据失败，错误信息：${error}`);
      });
    },
    // 模板类型重命名
    handleTemplateTypeRename(newName: string) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisttemplatetype/update',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: this.edittingTemplateTypeID,
          templateName: newName,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.getTemplateTypeList();
        } else {
          ElMessage.error(`修改模板类型名称失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`修改模板类型名称失败，错误信息：${error}`);
      }).finally(() => {
        this.edittingTemplateTypeID = 0;
      });
    },
    // 删除模板类型
    handleDeleteTemplateType(id: number) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisttemplatetype/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [id],
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.getTemplateTypeList();
          if (this.currentTemplateType?.id === id) {
            this.currentTemplateType = null;
          }
        } else {
          ElMessage.error(`删除模板类型失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除模板类型失败，错误信息：${error}`);
      });
    },
    // 新增模板类型
    handleTemplateTypeAdd(name: string) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisttemplatetype/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          templateName: name,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.getTemplateTypeList();
        } else {
          ElMessage.error(`新增模板类型失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`新增模板类型失败，错误信息：${error}`);
      }).finally(() => {
        this.isAddingTemplateType = false;
      });
    },
    // 点击新增分类
    handleAddClassification() {
      (this as any).$refs.AddClassificationDialogRef.open(this.classificationList);
    },
    // 将选择的分类添加到模板
    handleAddClassificationToTemplate(list: any) {
      // 找出需要新增的分类
      const toBeAddedIcons: any[] = [];
      list.forEach((icon: any) => {
        const tmp = this.classificationList.find((i) => i.id === icon.id);
        if (!tmp) {
          toBeAddedIcons.push(icon);
        }
      });
      // 找出需要删除的分类
      const toBeDeletedIcons: any[] = [];
      this.classificationList.forEach((icon: any) => {
        const tmp = list.find((i: any) => i.id === icon.id);
        if (!tmp) {
          toBeDeletedIcons.push(icon);
        }
      });
      if (toBeDeletedIcons.length) {
        this.handleDeleteClassification(toBeDeletedIcons);
      }
      // 新增
      if (toBeAddedIcons.length) {
        const request = {
          method: 'post',
          service: 'coplotting',
          url: '/assist/assisttemplatebasicclassrelated/save',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            templateTypeId: this.currentTemplateType?.id,
            classIds: toBeAddedIcons.map((item: { id: number }) => item.id),
          },
        };
        (this as any).$http(request).then((response: any) => {
          if (response.code === 0) {
            this.getClassificationList();
          } else {
            ElMessage.error(`添加分类失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error: Error) => {
          ElMessage.error(`添加分类失败，错误信息：${error}`);
        });
      }
    },
    // 点击分类，查看详情
    handleLookupClassification(icon: { basicClassId: number }) {
      (this as any).$refs.LookupClassificationDialogRef.open(icon.basicClassId);
    },
    handleDeleteClassification(icons: { relatedId: number }[]) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisttemplatebasicclassrelated/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: icons.map((icon) => icon.relatedId),
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          this.getClassificationList();
        } else {
          ElMessage.error(`删除分类关联失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除分类关联失败，错误信息：${error}`);
      });
    },
  },
});
</script>

<style lang="scss" module src="./styles/TemplateManagement.scss" />
