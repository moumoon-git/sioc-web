import { ref } from 'vue';
import { ElMessage } from 'element-plus';

interface Icon {
  id: number,
  iconTypeId: number,
  iconName: string,
  iconUrl: string,
}

interface IconType {
  id: number,
  typeName: string,
  children: IconType[],
}

// 图标类型列表
const iconTypeList = ref<IconType[]>([]);
// 图标类型下标
const iconTypeIndex = ref(0);
// 图标列表
const iconList = ref<Icon[]>([]);
// 当前图标类型的id
const currentTypeId = ref(0);
/**
 * 获取对应类型的图标
 *
 * @param http 封装过的axios实例
 * @param id 图标类型id
 */
const getIconList = (http: any, id: number): void => {
  iconList.value = [];
  const request = {
    method: 'post',
    service: 'coplotting',
    url: '/assist/assisticon/listByType',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      iconTypeId: id,
    },
  };
  currentTypeId.value = id;
  http(request).then((response: any) => {
    if (response.code === 0 && response?.data?.data) {
      iconList.value = response?.data?.data || [];
    } else {
      ElMessage.error(`获取图标列表失败，错误代码${response.code}，错误信息：${response.msg}`);
    }
  }).catch((error: Error) => {
    ElMessage.error(`获取图标列表失败，错误信息：${error}`);
  });
};
/**
 * 获取图标类别列表
 *
 * @param http 封装过的axios实例
 */
const getIconTypeList = (http: any): void => {
  if (!http) {
    throw new Error('缺少aixos方法');
  }
  const request = {
    method: 'post',
    service: 'coplotting',
    url: '/assist/assistbasicclassstyle/list',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      // 点分类传值1
      basicClassType: 1,
    },
  };
  http(request).then((response: any) => {
    if (response.code === 0 && response?.data?.data?.iconTypeList) {
      iconTypeList.value = response?.data?.data?.iconTypeList || [];
      iconTypeIndex.value = 0;
      if (iconTypeList.value.length) {
        if (iconTypeList.value[0]?.children?.length) {
          getIconList(http, iconTypeList.value[0].children[0].id);
        } else {
          getIconList(http, iconTypeList.value[0].id);
        }
      }
    } else {
      ElMessage.error(`获取图标类别列表失败，错误代码${response.code}，错误信息：${response.msg}`);
    }
  }).catch((error: Error) => {
    ElMessage.error(`获取图标类别列表失败，错误信息：${error}`);
  });
};
// 点击选择的图标
const selectedIcon = ref<Icon | null>(null);
const handleIconSelect = (icon: Icon) => {
  selectedIcon.value = icon;
};

const resetIconState = (): void => {
  selectedIcon.value = null;
  iconTypeIndex.value = 0;
  iconTypeList.value = [];
  iconList.value = [];
};

export default {
  iconTypeList,
  iconTypeIndex,
  getIconTypeList,
  getIconList,
  iconList,
  handleIconSelect,
  selectedIcon,
  resetIconState,
  currentTypeId,
};
