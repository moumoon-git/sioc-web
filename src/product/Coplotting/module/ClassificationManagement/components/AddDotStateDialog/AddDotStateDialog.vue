<template>
  <!-- 使用ElDialog会导致未知的BUG，vue scheduler flush 时报错 -->
  <Dialog
    v-model="showDialog"
    custom-class="sv-dialog"
    title="点分类-新增状态"
    width="650px"
  >
    <ElForm
      :class="[
        'sv-form',
        $style.form
      ]"
      label-position="right"
      label-width="100px"
      style="margin-top: 10px; width: 650px;"
    >
      <ElFormItem
        label="显示尺寸"
      >
        <ElRadioGroup v-model="iconSize">
          <ElRadio :label="0">
            大号64px
          </ElRadio>
          <ElRadio :label="1">
            常规32px
          </ElRadio>
          <ElRadio :label="2">
            小号24px
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <section :class="$style.iconSet">
        <!-- 图标类型列表 -->
        <header>
          <ElButton
            v-for="(item, index) in iconTypeList"
            :key="index"
            :class="[
              'sv-button',
              {
                [$style.currentIconType]: iconTypeIndex === index,
              }
            ]"
            @click="handleIconTypeClick(item, index)"
          >
            {{ item.typeName || item.name || '未知类别' }}
          </ElButton>
        </header>
        <!-- 图标列表 -->
        <main>
          <IconUpload
            v-if="iconTypeList?.[iconTypeIndex]?.typeName === '自定义图标'"
            :selected-icon="selectedIcon"
            :icon-type-id="iconTypeList?.[iconTypeIndex]?.id"
            @icon-click="handleIconSelect"
            @icon-delete="handleCustomIconDelete"
          />
          <div
            v-else
            :class="$style.iconList"
          >
            <!-- 标签切换 -->
            <TabSwitch
              v-if="iconTypeList?.[iconTypeIndex]?.isChildren === 1"
              :list-data="iconTypeList?.[iconTypeIndex]?.children || []"
              @tab-click="handleSubTypeClick"
            />
            <div :class="$style.scroll">
              <!-- 图标 -->
              <div
                v-for="(icon, index) in iconList"
                :key="icon.id || `icon_${index}`"
                :class="[
                  {
                    [$style.selectedIcon]: icon?.iconUrl && icon.iconUrl === selectedIcon?.iconUrl
                  },
                  iconTypeList?.[iconTypeIndex]?.isChildren === 1
                    ? $style.sceneIcon
                    : $style.icon
                ]"
                :style="{
                  backgroundImage: `url('${baseURL}${icon?.iconUrl}')`,
                }"
                :title="icon.iconName?.split('_')?.[1] || icon.iconName"
                @click="handleIconSelect(icon)"
              >
                <p v-if="iconTypeList?.[iconTypeIndex]?.isChildren === 1">
                  {{ icon.iconName?.split('_')?.[1] || icon.iconName }}
                </p>
                <!-- 删除按钮 -->
                <button
                  v-if="isBasic"
                  @click.stop.prevent="handleDeleteIcon(icon)"
                />
              </div>
            </div>
            <div
              v-if="isBasic"
              :class="$style.operation"
            >
              <ElPopover
                v-if="iconTypeList?.[iconTypeIndex]?.isChildren === 1"
                placement="top"
                trigger="click"
              >
                <template #reference>
                  <ElButton
                    type="text"
                  >
                    创建文件夹
                  </ElButton>
                </template>
                <template #default>
                  <AddFolder
                    @confirm="handleCreateFolder"
                  />
                </template>
              </ElPopover>
              <ElButton
                type="text"
                @click="selectFiles"
              >
                上传图标
              </ElButton>
            </div>
          </div>
        </main>
      </section>
      <!-- 样式预览 -->
      <ElFormItem
        label="样式预览"
      >
        <div
          :class="$style.icon"
          :style="{
            backgroundImage: `url('${baseURL}${selectedIcon?.iconUrl}')`,
            margin: '5px 0 0 0',
            pointerEvents: 'none',
            width: iconSize === 0 ? '64px' : iconSize === 2 ? '24px' : '32px',
            height: iconSize === 0 ? '64px' : iconSize === 2 ? '24px' : '32px',
          }"
        />
      </ElFormItem>
      <ElFormItem
        label="分类状态"
      >
        <ElInput
          v-model="statusName"
          class="sv-input"
          style="width: 200px; margin-right: 10px;"
          autofocus
          clearable
        />
        <ElCheckbox
          v-model="isDefault"
          label="设为默认状态"
        />
      </ElFormItem>
    </ElForm>
    <!-- 弹窗页脚 -->
    <footer :class="$style.footer">
      <ElButton
        class="sv-button"
        type="primary"
        @click="handleSave"
      >
        保存
      </ElButton>
      <ElButton
        class="sv-button"
        @click="handleClose"
      >
        取消
      </ElButton>
    </footer>
  </Dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  onMounted,
  inject,
} from 'vue';
import { ElMessage } from 'element-plus';
import AddFolder from '../AddFolder/AddFolder.vue';
import Dialog from './components/ModalDialog/ModalDialog.vue';
import IconUpload from './components/IconUpload/IconUpload.vue';
import TabSwitch from './components/TabSwitch/TabSwitch.vue';
import useState from './scripts/useState';
import useIcon from './scripts/useIcon';

export default defineComponent({
  name: 'AddDotStateDialog',
  components: {
    // 自定义图标上传管理
    IconUpload,
    // 标签切换
    TabSwitch,
    Dialog,
    // 新增文件夹输入框
    AddFolder,
  },
  emits: [
    'save',
  ],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $http }: any = instance?.appContext.config.globalProperties;
    const isBasic = inject('isBasic');
    // 弹窗是否显示
    const showDialog = ref(false);
    const edittingIndex = ref(-1);
    // 状态值管理
    const {
      statusName,
      isDefault,
      iconSize,
      resetState,
    } = useState;
    // 图标相关
    const {
      currentTypeId,
      getIconTypeList,
      iconTypeIndex,
      iconTypeList,
      getIconList,
      iconList,
      handleIconSelect,
      selectedIcon,
      resetIconState,
    } = useIcon;
    // 获取图标类型列表
    onMounted(() => {
      getIconTypeList($http);
    });
    /**
     * 点击切换图标分类
     *
     * @param iconType 图标类型对象
     * @param index 图标类型对象下标
     */
    const handleIconTypeClick = (iconType: { id: number, children: any[] }, index: number) => {
      if (iconTypeIndex.value === index) {
        return;
      }
      iconTypeIndex.value = index;
      if (iconType?.children?.length) {
        getIconList($http, iconType.children[0].id);
      } else {
        getIconList($http, iconType.id);
      }
    };
    /**
     * 点击切换场景图标子图标分类
     *
     * @param iconType 图标类型对象
     */
    const handleSubTypeClick = (iconType: { id: number }) => {
      getIconList($http, iconType.id);
    };
    // 关闭弹窗
    const handleClose = () => {
      resetState();
      resetIconState();
      showDialog.value = false;
    };
    // 保存
    const handleSave = () => {
      if (!statusName.value) {
        ElMessage.error('请输入分类状态');
        return;
      }
      if (!selectedIcon.value) {
        ElMessage.error('请点选图标');
        return;
      }
      emit('save', {
        name: statusName.value,
        size: iconSize.value,
        icon: selectedIcon.value,
        isDefault: isDefault.value,
        index: edittingIndex.value,
      });
      handleClose();
    };
    // 自定义图标删除时判断是否需要清空已选图标
    const handleCustomIconDelete = (ids: number[]) => {
      if (selectedIcon.value && ids.includes(selectedIcon.value.id)) {
        selectedIcon.value = null;
      }
    };
    // 打开弹窗
    const open = (data?: any) => {
      edittingIndex.value = -1;
      if (data) {
        edittingIndex.value = data.index;
        statusName.value = data.statusType;
        iconSize.value = data?.stylePropertyEntity?.size ?? 1;
        selectedIcon.value = {
          iconUrl: data.iconUrl,
          id: -1,
          iconName: '',
          iconTypeId: -1,
        };
        isDefault.value = Boolean(data.isDefault);
      }
      showDialog.value = true;
      getIconTypeList($http);
    };
    // 创建文件夹
    const handleCreateFolder = (name: string) => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisticontype/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          parentId: iconTypeList.value[iconTypeIndex.value].id,
          typeName: name,
          status: 0,
          isChildren: 0,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getIconTypeList($http);
        } else {
          ElMessage.error(`新增文件夹失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`新增文件夹失败，错误信息：${error}`);
      });
    };
    // 删除图标
    const handleDeleteIcon = (icon: { id: number }) => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisticon/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [icon.id],
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          if (selectedIcon.value?.id === icon.id) {
            selectedIcon.value = null;
          }
          getIconList($http, currentTypeId.value);
        } else {
          ElMessage.error(`删除图标失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除图标失败，错误信息：${error}`);
      });
    };
    // 保存上传图标的地址
    const saveUploadIcon = (iconObj: {id: number, name: string, url: string}) => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assisticon/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          iconTypeId: currentTypeId.value,
          iconUrl: iconObj.url,
          iconName: iconObj.name,
          status: 0,
        },
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          // 刷新列表
          getIconList($http, currentTypeId.value);
        } else {
          ElMessage.error(`上传失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      });
    };
    const handleUpload = (files: FileList) => {
      if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
        formData.append('type', '4');
        const request = {
          method: 'post',
          service: 'file',
          url: '/appAttachment/fileUploadAttachments',
          headers: {
            'Content-Type': 'multipart/form-data ',
          },
          data: formData,
        };
        $http(request).then((response: any) => {
          if (response.errorcode === 0) {
            const resList = response.data || [];
            resList.forEach((file: { id: number, title: string, url: string }) => {
              saveUploadIcon({
                id: file.id,
                name: file.title,
                url: file.url,
              });
            });
          } else {
            ElMessage.error(`上传失败，错误代码${response.errorcode}，错误信息：${response.msg}`);
          }
        }).catch((error: Error) => {
          ElMessage.error(`上传失败，错误信息：${error}`);
        });
      }
    };
    const selectFiles = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      input.onchange = () => {
        handleUpload(input.files as FileList);
        input.remove();
      };
      input.click();
    };
    return {
      isBasic,
      showDialog,
      open,
      statusName,
      isDefault,
      iconSize,
      iconTypeIndex,
      iconTypeList,
      getIconList,
      iconList,
      handleIconTypeClick,
      handleClose,
      handleSave,
      handleIconSelect,
      selectedIcon,
      handleCustomIconDelete,
      handleSubTypeClick,
      handleCreateFolder,
      handleDeleteIcon,
      selectFiles,
    };
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
    };
  },
});
</script>

<style lang="scss" module src="./styles/AddDotStateDialog.scss" />
