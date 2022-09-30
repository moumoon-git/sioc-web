import {
  ref, Ref, onMounted, watch, computed,
} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const useFolder = (
  // axios实例
  $http: any,
  // 当前分类下标
  activeTabIndex: Ref<number>,
  isBasic: Ref<boolean>,
): {
  folderList: Ref<any[]>,
  filteredFolderList: Ref<any[]>,
  getFolderList(): void,
  isAddingFolder: Ref<boolean>,
  handleAddFolder: (
    name: string
  ) => void,
  handleDeleteFolder: (
    id: number
  ) => void,
  handleDeleteClass: (
    id: number
  ) => void,
} => {
  const folderList = ref<any[]>([]);
  const filteredFolderList = computed(() => {
    if (isBasic.value) {
      return folderList.value.filter((item) => item.fileType === 1);
    }
    return folderList.value;
  });
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
  /**
   * 获取文件夹列表
   */
  const getFolderList = () => {
    const request = {
      method: 'post',
      service: 'coplotting',
      url: '/assist/assistclassfile/listByType',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        basicClassType: activeTabIndex.value,
      },
    };
    $http(request).then((response: any) => {
      if (response.code === 0 && response?.data?.data) {
        folderList.value = sortFolderList(response.data.data || []);
      } else {
        ElMessage.error(`获取列表失败，错误代码${response.code}，错误信息：${response.msg}`);
      }
    }).catch((error: Error) => {
      ElMessage.error(`获取列表失败，错误信息：${error}`);
    });
  };
  onMounted(() => {
    getFolderList();
  });
  watch(activeTabIndex, () => {
    getFolderList();
  });
  // 是否正在新增文件夹
  const isAddingFolder = ref<boolean>(false);
  /**
   * 执行新增文件夹
   *
   * @param name 新增文件夹的名称
   */
  const handleAddFolder = (name: string) => {
    const request = {
      method: 'post',
      service: 'coplotting',
      url: '/assist/assistclassfile/save',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        basicClassType: activeTabIndex.value,
        fileName: name,
        // 基础分类-1，平台分类-0
        isSysDafault: isBasic.value ? 1 : 0,
        // 基础-1，默认-2，自定义-3
        fileType: isBasic.value ? 1 : 3,
      },
    };
    $http(request).then((response: any) => {
      if (response.code === 0) {
        isAddingFolder.value = false;
        getFolderList();
      } else {
        ElMessage.error(`新增文件夹失败，错误代码${response.code}，错误信息：${response.msg}`);
      }
    }).catch((error: Error) => {
      ElMessage.error(`新增文件夹失败，错误信息：${error}`);
    });
  };
  /**
   * 执行删除文件夹
   *
   * @param id 文件夹id
   */
  const handleDeleteFolder = (id: number) => {
    ElMessageBox.confirm(
      '是否确认要删除？\n删除后，数据不可恢复',
      '删除提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    ).then(() => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistclassfile/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [id],
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getFolderList();
        } else {
          ElMessage.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除失败，错误信息：${error}`);
      });
    });
  };
  /**
   * 执行删除分类
   *
   * @param id 分类id
   */
  const handleDeleteClass = (id: number) => {
    ElMessageBox.confirm(
      '是否确认要删除？\n删除后，数据不可恢复',
      '删除提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    ).then(() => {
      const request = {
        method: 'post',
        service: 'coplotting',
        url: '/assist/assistbasicclass/delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: [id],
      };
      $http(request).then((response: any) => {
        if (response.code === 0) {
          getFolderList();
        } else {
          ElMessage.error(`删除失败，错误代码${response.code}，错误信息：${response.msg}`);
        }
      }).catch((error: Error) => {
        ElMessage.error(`删除失败，错误信息：${error}`);
      });
    });
  };
  return {
    folderList,
    filteredFolderList,
    getFolderList,
    isAddingFolder,
    handleAddFolder,
    handleDeleteFolder,
    handleDeleteClass,
  };
};

export default useFolder;
