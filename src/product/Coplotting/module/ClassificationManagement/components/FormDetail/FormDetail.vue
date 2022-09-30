<template>
  <ElForm
    class="sv-form"
    label-position="right"
    label-width="100px"
  >
    <ElFormItem
      label="文件夹名称"
    >
      <ElSelect
        v-model="selectedFolderId"
        class="sv-select"
        placeholder="请选择"
        style="width: 50%;"
        popper-class="sv-select__popper"
        :disabled="!isClassEditting || isDefaultClass"
      >
        <ElOption
          v-for="item in folderList"
          :key="item.id"
          :label="item.fileName"
          :value="item.id"
          :disabled="!isBasic.value && item.fileType !== 3"
        />
      </ElSelect>
    </ElFormItem>
    <ElFormItem
      label="分类名称"
    >
      <ElInput
        v-model="name"
        class="sv-input"
        style="width: 50%;"
        placeholder="请输入分类名称，15字内"
        maxlength="15"
        clearable
        :disabled="!isClassEditting || isDefaultClass"
      />
    </ElFormItem>
    <ElFormItem
      label="分类状态"
    >
      <ElButton
        v-if="isClassEditting"
        class="sv-button"
        type="primary"
        @click="handleAddState"
      >
        新增
      </ElButton>
      <table
        v-if="statusList?.length"
        class="sv-table"
        style="margin: 10px 0 0 5px;"
      >
        <thead>
          <th>状态名称</th>
          <th>样式图标</th>
          <th v-if="isClassEditting">
            操作
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(status, statusIndex) in statusList"
            :key="statusIndex"
          >
            <td>{{ status?.statusType }}</td>
            <!-- 点分类预览 -->
            <td v-if="activeTabIndex?.value === 0">
              <div :class="$style.preview">
                <div
                  :class="$style.icon"
                  :style="{
                    backgroundImage: `url('${baseURL}${status?.iconUrl}')`,
                  }"
                />
              </div>
            </td>
            <!-- 面分类预览 -->
            <td v-else-if="activeTabIndex?.value === 1">
              <div :class="$style.preview">
                <div
                  :class="$style.area"
                  :style="{
                    borderColor: status?.stylePropertyEntity?.strokeColor,
                    borderWidth: `${status?.stylePropertyEntity?.lineHeight}px`,
                    borderStyle: status?.stylePropertyEntity?.lineType ? 'solid' : 'dashed',
                  }"
                >
                  <div
                    :style="{
                      background: status?.stylePropertyEntity?.fillColor,
                      opacity: status?.stylePropertyEntity?.fillOpacity / 100,
                    }"
                  />
                </div>
              </div>
            </td>
            <!-- 线分类预览 -->
            <td v-else-if="activeTabIndex?.value === 2">
              <div :class="$style.preview">
                <div
                  :class="$style.line"
                  :style="{
                    color: status?.stylePropertyEntity?.fillColor,
                    borderTopWidth: `${status?.stylePropertyEntity?.lineHeight}px`,
                    borderTopStyle: status?.stylePropertyEntity?.lineType ? 'solid' : 'dashed',
                    opacity: status?.stylePropertyEntity?.fillOpacity / 100,
                  }"
                />
              </div>
            </td>
            <!-- 其他分类预览 -->
            <td v-else-if="activeTabIndex?.value === 3">
              <div :class="$style.preview">
                <div
                  :class="$style.other"
                  :style="{
                    background: status?.stylePropertyEntity?.strokeColor,
                    height: `${status?.stylePropertyEntity?.lineHeight}px`,
                    opacity: status?.stylePropertyEntity?.fillOpacity / 100,
                  }"
                />
              </div>
            </td>
            <td v-if="isClassEditting">
              <ButtonSet
                :icon-list="['edit', 'delete']"
                @click="handleStatusItemClick($event, statusIndex)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </ElFormItem>
    <ElFormItem
      label="分类属性"
    >
      <ElButton
        v-if="isClassEditting"
        class="sv-button"
        type="primary"
        @click="handleAddProp"
      >
        新增
      </ElButton>
      <ElButton
        v-if="isClassEditting"
        class="sv-button"
        type="primary"
        @click="handleCopyProp"
      >
        复制
      </ElButton>
      <table
        v-if="propList?.length"
        class="sv-table"
        style="margin: 10px 0 0 5px;"
      >
        <thead>
          <th>属性名称</th>
          <th>属性类型</th>
          <th>单位</th>
          <th v-if="isClassEditting">
            操作
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(prop, propIndex) in propList"
            :key="propIndex"
          >
            <td>{{ prop?.name }}</td>
            <td>
              {{ prop.type === 1 ? '文本' : '' }}
              {{ prop.type === 2 ? '数值' : '' }}
              {{ prop.type === 3 ? '日期' : '' }}
              {{ prop.type === 4 ? '电话' : '' }}
              {{ prop.type === 5 ? '终端号' : '' }}
              {{ prop.type === 6 ? '下拉选项' : '' }}
              {{ prop.type === 7 ? '时间' : '' }}
            </td>
            <td>{{ prop?.unit || '/' }}</td>
            <td v-if="isClassEditting">
              <ButtonSet
                :icon-list="['edit', 'delete']"
                @click="handlePropItemClick($event, propIndex)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </ElFormItem>
    <ElFormItem
      label="属性类别"
    >
      <ElRadioGroup
        v-if="isClassEditting"
        v-model="propType"
      >
        <ElRadio :label="0">
          表单
        </ElRadio>
        <ElRadio
          :label="1"
          disabled
        >
          表格
        </ElRadio>
      </ElRadioGroup>
      <span v-else>
        {{ propType === 0 ? '表单' : '表格' }}
      </span>
    </ElFormItem>
    <ElFormItem
      label="系统属性"
    >
      <ElCheckboxGroup
        v-if="isClassEditting"
        v-model="systemProps"
      >
        <ElCheckbox label="标注创建人" />
        <ElCheckbox label="标注创建时间" />
        <ElCheckbox label="地图地址" />
        <ElCheckbox label="最后编辑人" />
        <ElCheckbox label="最后编辑时间" />
      </ElCheckboxGroup>
      <span v-else>
        {{ systemProps.join('、') }}
      </span>
    </ElFormItem>
  </ElForm>
  <!-- 点分类-新增分类状态弹窗 -->
  <AddDotStateDialog
    ref="AddDotStateDialogRef"
    @save="handleSaveDotState"
  />
  <!-- 线分类-新增分类状态弹窗 -->
  <AddLineStateDialog
    ref="AddLineStateDialogRef"
    @save="handleSaveLineState"
  />
  <!-- 面分类-新增分类状态弹窗 -->
  <AddAreaStateDialog
    ref="AddAreaStateDialogRef"
    @save="handleSaveAreaState"
  />
  <!-- 其他分类-新增分类状态弹窗 -->
  <AddOtherStateDialog
    ref="AddOtherStateDialogRef"
    @save="handleSaveOtherState"
  />
  <!-- 新增分类属性弹窗 -->
  <AddPropDialog
    ref="AddPropDialogRef"
    @save="handleSaveClassificationProp"
  />
  <!-- 复制属性弹窗 -->
  <CopyPropertyDialog
    ref="CopyPropertyDialogRef"
    @save="handleSaveCopyProp"
  />
  <CopyClassificationDialog
    ref="CopyClassificationDialogRef"
    :folder-list="folderList"
    @save="handleCopyClassification"
  />
</template>

<script lang="ts">
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';
import AddDotStateDialog from '../AddDotStateDialog/AddDotStateDialog.vue';
import AddLineStateDialog from '../AddLineStateDialog/AddLineStateDialog.vue';
import AddAreaStateDialog from '../AddAreaStateDialog/AddAreaStateDialog.vue';
import AddOtherStateDialog from '../AddOtherStateDialog/AddOtherStateDialog.vue';
import AddPropDialog from '../AddPropDialog/AddPropDialog.vue';
import CopyPropertyDialog from '../CopyPropertyDialog/CopyPropertyDialog.vue';
import ButtonSet from '../ButtonSet/ButtonSet.vue';
import CopyClassificationDialog from '../CopyClassificationDialog/CopyClassificationDialog.vue';
import useDialogControl from './scripts/useDialogControl';

interface AddStateDialog {
  open: (data?: any) => void
}

export default defineComponent({
  name: 'FormDetail',
  components: {
    AddDotStateDialog,
    AddLineStateDialog,
    AddAreaStateDialog,
    AddOtherStateDialog,
    AddPropDialog,
    CopyPropertyDialog,
    // 按钮集合
    ButtonSet,
    CopyClassificationDialog,
  },
  inject: [
    'isBasic',
    'activeTabIndex',
  ],
  props: {
    // 文件夹列表
    folderList: {
      type: Array,
      default: () => [],
    },
    // 是否编辑
    isClassEditting: {
      type: Boolean,
      default: false,
    },
    // 选中的分类
    selectedClass: {
      type: Object,
      default: null,
    },
    // 是否默认分类，默认分类下不能修改文件夹和名称
    isDefaultClass: {
      type: Boolean,
      default: false,
    },
    // 文件夹的变量使用文件夹名还是id
    useFolderName: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'refresh',
  ],
  setup() {
    // 新增状态弹窗引用 * 4
    const AddDotStateDialogRef = ref<null | AddStateDialog>(null);
    const AddLineStateDialogRef = ref<null | AddStateDialog>(null);
    const AddAreaStateDialogRef = ref<null | AddStateDialog>(null);
    const AddOtherStateDialogRef = ref<null | AddStateDialog>(null);
    // 新增属性弹窗引用
    const AddPropDialogRef = ref<null | AddStateDialog>(null);
    // 复制属性弹窗引用
    const CopyPropertyDialogRef = ref<null | AddStateDialog>(null);
    // 打开弹窗
    const {
      handleAddState,
      handleAddProp,
      handleCopyProp,
    } = useDialogControl(
      AddDotStateDialogRef,
      AddLineStateDialogRef,
      AddAreaStateDialogRef,
      AddOtherStateDialogRef,
      AddPropDialogRef,
      CopyPropertyDialogRef,
    );
    return {
      handleAddState,
      handleAddProp,
      handleCopyProp,
      AddDotStateDialogRef,
      AddLineStateDialogRef,
      AddAreaStateDialogRef,
      AddOtherStateDialogRef,
      AddPropDialogRef,
      CopyPropertyDialogRef,
    };
  },
  data() {
    return {
      baseURL: (window as any).config.baseURL,
      // 选择的文件夹
      selectedFolderId: null,
      // 系统属性
      systemProps: [] as string[],
      // 分类名称
      name: '',
      // 属性类别
      propType: 0,
      // 分类状态列表
      statusList: [] as any,
      // 分类属性列表
      propList: [] as any,
    };
  },
  watch: {
    selectedClass: {
      deep: true,
      handler() {
        this.getClassDetail();
      },
    },
    isClassEditting() {
      this.getClassDetail();
    },
  },
  mounted() {
    this.getClassDetail();
  },
  methods: {
    // 重置所有状态
    reset() {
      this.selectedFolderId = null;
      this.systemProps = [];
      this.name = '';
      this.propType = 0;
      this.statusList = [];
      this.propList = [];
    },
    // 获取分类详情
    getClassDetail() {
      if (this.selectedClass?.id) {
        const request = {
          method: 'get',
          service: 'coplotting',
          url: `/assist/assistbasicclass/info/${this.selectedClass.id}`,
        };
        (this as any).$http(request).then((response: any) => {
          if (response.code === 0 && response?.data?.assistBasicClass) {
            const data = response?.data?.assistBasicClass;
            this.name = data?.className;
            this.selectedFolderId = this.useFolderName ? data?.fileName : data?.classFileId;
            this.propType = data?.propertyType - 1;
            const systemProps = [];
            if (data?.isShowCreator) systemProps.push('标注创建人');
            if (data?.isShowCreateTime) systemProps.push('标注创建时间');
            if (data?.isShowMapAddress) systemProps.push('地图地址');
            if (data?.isShowLastEditor) systemProps.push('最后编辑人');
            if (data?.isShowLastEditTime) systemProps.push('最后编辑时间');
            this.systemProps = systemProps;
            this.statusList = data?.statusList || [];
            this.propList = data?.definedList || [];
          } else {
            ElMessage.error(`获取分类详情失败，错误代码${response.code}，错误信息：${response.msg}`);
          }
        }).catch((error: Error) => {
          ElMessage.error(`获取分类详情失败，错误信息：${error}`);
        });
      } else {
        this.reset();
      }
    },
    // 新增修改点分类状态
    handleSaveDotState(data: any) {
      const newData = {
        statusType: data.name,
        stylePropertyEntity: {
          size: data.size,
        },
        iconUrl: data.icon.iconUrl,
        isDefault: Number(data.isDefault),
      };
      if (newData.isDefault) {
        this.statusList.forEach((status: any) => {
          status.isDefault = 0;
        });
      }
      if (data.index === -1) {
        this.statusList.push(newData);
      } else {
        this.statusList[data.index] = newData;
      }
    },
    // 新增修改线分类状态
    handleSaveLineState(data: any) {
      const newData = {
        statusType: data.name,
        stylePropertyEntity: {
          fillOpacity: data.fillOpacity,
          styleType: data.styleType,
          fillColor: data.fillColor,
          lineType: data.lineType,
          lineHeight: data.lineHeight,
        },
        iconUrl: '',
        isDefault: Number(data.isDefault),
      };
      if (newData.isDefault) {
        this.statusList.forEach((status: any) => {
          status.isDefault = 0;
        });
      }
      if (data.index === -1) {
        this.statusList.push(newData);
      } else {
        this.statusList[data.index] = newData;
      }
    },
    // 新增修改面分类状态
    handleSaveAreaState(data: any) {
      const newData = {
        statusType: data.name,
        stylePropertyEntity: {
          fillOpacity: data.fillOpacity,
          fillColor: data.fillColor,
          strokeColor: data.strokeColor,
          lineType: data.lineType,
          lineHeight: data.lineHeight,
        },
        iconUrl: '',
        isDefault: Number(data.isDefault),
      };
      if (newData.isDefault) {
        this.statusList.forEach((status: any) => {
          status.isDefault = 0;
        });
      }
      if (data.index === -1) {
        this.statusList.push(newData);
      } else {
        this.statusList[data.index] = newData;
      }
    },
    // 新增修改其他分类状态
    handleSaveOtherState(data: any) {
      const newData = {
        statusType: data.name,
        stylePropertyEntity: {
          fillOpacity: data.fillOpacity,
          strokeColor: data.strokeColor,
          lineHeight: data.lineHeight,
        },
        iconUrl: '',
        isDefault: Number(data.isDefault),
      };
      if (newData.isDefault) {
        this.statusList.forEach((status: any) => {
          status.isDefault = 0;
        });
      }
      if (data.index === -1) {
        this.statusList.push(newData);
      } else {
        this.statusList[data.index] = newData;
      }
    },
    // 新增修改分类属性
    handleSaveClassificationProp(data: any) {
      const newData = {
        name: data.propName,
        type: data.selectType + 1,
        unit: data.workplace,
        isSearch: Number(data.searchable),
        dicList: data.options.map((item: { value: string }, index: number) => ({
          dictKey: index,
          dictValue: item.value,
        })),
      };
      // 新增
      if (data.index === -1) {
        this.propList.push(newData);
      } else {
        // 编辑
        this.propList[data.index] = newData;
      }
    },
    // 点击操作分类属性项
    handlePropItemClick(type: string, index: number) {
      switch (type) {
        case 'delete': {
          this.propList.splice(index, 1);
          break;
        }
        case 'edit': {
          const currentProp = this.propList[index];
          if (this.AddPropDialogRef) {
            this.AddPropDialogRef.open({
              propName: currentProp?.name || '',
              selectType: currentProp?.type - 1,
              workplace: currentProp.unit || '',
              searchable: Boolean(currentProp.isSearch),
              options: currentProp.dicList || [],
              index,
            });
          }
          break;
        }
        default:
      }
    },
    // 点击操作分类状态项
    handleStatusItemClick(type: string, index: number) {
      switch (type) {
        case 'delete': {
          this.statusList.splice(index, 1);
          break;
        }
        case 'edit': {
          const currentStatus = this.statusList[index];
          switch ((this as any).activeTabIndex?.value) {
            case 0: {
              if (this.AddDotStateDialogRef) {
                this.AddDotStateDialogRef.open({
                  ...currentStatus,
                  index,
                });
              }
              break;
            }
            case 2: {
              if (this.AddLineStateDialogRef) {
                this.AddLineStateDialogRef.open({
                  ...currentStatus,
                  index,
                });
              }
              break;
            }
            case 1: {
              if (this.AddAreaStateDialogRef) {
                this.AddAreaStateDialogRef.open({
                  ...currentStatus,
                  index,
                });
              }
              break;
            }
            case 3: {
              if (this.AddOtherStateDialogRef) {
                this.AddOtherStateDialogRef.open({
                  ...currentStatus,
                  index,
                });
              }
              break;
            }
            default:
          }
          break;
        }
        default:
      }
    },
    // 新增、修改保存
    handleSave() {
      if (!this.selectedFolderId) {
        ElMessage.error('请选择文件夹');
        return;
      }
      if (!this.name) {
        ElMessage.error('请输入分类名称');
        return;
      }
      if (!this.statusList?.length) {
        ElMessage.error('请选择分类状态');
        return;
      }
      const url = this.selectedClass?.id ? '/assist/assistbasicclass/update' : '/assist/assistbasicclass/save';
      this.checkStatusListDefault();
      const request = {
        method: 'post',
        service: 'coplotting',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: this.selectedClass?.id,
          classFileId: this.selectedFolderId,
          basicClassType: (this as any).activeTabIndex.value,
          className: this.name,
          propertyType: this.propType + 1,
          isShowMapAddress: this.systemProps.includes('地图地址') ? 1 : 0,
          isShowCreator: this.systemProps.includes('标注创建人') ? 1 : 0,
          isShowCreateTime: this.systemProps.includes('标注创建时间') ? 1 : 0,
          isShowLastEditor: this.systemProps.includes('最后编辑人') ? 1 : 0,
          isShowLastEditTime: this.systemProps.includes('最后编辑时间') ? 1 : 0,
          statusList: this.statusList,
          definedList: this.propList,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          ElMessage.success('新增分类成功');
          this.$emit('refresh');
        } else {
          ElMessage.error(`新增分类失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`新增分类失败，错误信息：${error}`);
      });
    },
    // 遍历分类状态列表，如果没有设置默认状态，则设置第一条数据为默认状态，多条数据默认状态则只取第一条
    checkStatusListDefault() {
      const isDefault: any[] = [];
      this.statusList.forEach((status: any, index: number) => {
        if (status.isDefault) {
          isDefault.push(index);
        }
      });
      if (isDefault.length === 0) {
        this.statusList[0].isDefault = 1;
      } else if (isDefault.length > 1) {
        this.statusList.forEach((status: any) => {
          status.isDefault = 0;
        });
        this.statusList[isDefault[0]].isDefault = 1;
      }
    },
    // 复制属性
    handleSaveCopyProp(list: any[]) {
      this.propList.push(...list);
    },
    // 生成导入模板
    generateImportTemplate() {
      const request: AxiosRequestConfig = {
        method: 'post',
        baseURL: (window as any).config.baseURL,
        url: `${(window as any).config.service.coplotting}/assist/assistbasicclass/getTemplate`,
        headers: {
          'Content-Type': 'application/json',
          token: document.cookie.match(/token=([^;]*)/)?.[1],
        },
        responseType: 'blob',
        data: {
          id: this.selectedClass?.id,
          classFileId: this.selectedFolderId,
          basicClassType: (this as any).activeTabIndex.value,
          className: this.name,
          propertyType: this.propType + 1,
          isShowMapAddress: this.systemProps.includes('地图地址') ? 1 : 0,
          isShowCreator: this.systemProps.includes('标注创建人') ? 1 : 0,
          isShowCreateTime: this.systemProps.includes('标注创建时间') ? 1 : 0,
          isShowLastEditor: this.systemProps.includes('最后编辑人') ? 1 : 0,
          isShowLastEditTime: this.systemProps.includes('最后编辑时间') ? 1 : 0,
          statusList: this.statusList,
          definedList: this.propList,
        },
      };
      axios(request).then((response: AxiosResponse) => {
        console.log(response.headers);
        const fileName = response?.headers['content-disposition']?.split('fileName=')[1];
        if (response.status === 200) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(response.data);
          a.download = decodeURI(fileName) || '导入模板.xls';
          a.click();
        }
      });
    },
    // 复制分类
    copyClassification() {
      (this as any).$refs.CopyClassificationDialogRef.open();
    },
    handleCopyClassification(folderId: number) {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistbasicclass/save',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          classFileId: folderId,
          basicClassType: (this as any).activeTabIndex.value,
          className: `${this.name}副本`,
          propertyType: this.propType + 1,
          isShowMapAddress: this.systemProps.includes('地图地址') ? 1 : 0,
          isShowCreator: this.systemProps.includes('标注创建人') ? 1 : 0,
          isShowCreateTime: this.systemProps.includes('标注创建时间') ? 1 : 0,
          isShowLastEditor: this.systemProps.includes('最后编辑人') ? 1 : 0,
          isShowLastEditTime: this.systemProps.includes('最后编辑时间') ? 1 : 0,
          statusList: this.statusList,
          definedList: this.propList,
        },
      };
      (this as any).$http(request).then((response: any) => {
        if (response.code === 0) {
          ElMessage.success('复制分类成功');
          this.$emit('refresh');
        } else {
          ElMessage.error(`复制分类失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`复制分类失败，错误信息：${error}`);
      });
    },
  },
});
</script>

<style lang="scss" module src="./styles/FormDetail.scss" />
