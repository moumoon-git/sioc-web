import {
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
  watch,
  toRef,
  getCurrentInstance,
} from 'vue';

// 1. Types:

// 联系人对象类型
type Contact = {
  id: number,
  name: string,
};
// 树节点类型
type TreeNode = {
  id: number,
  name: string,
  children?: TreeNode[],
  // 应急负责人
  responsibleContactor?: Contact[],
  // 应急联络人
  contactor?: Contact[],
}
// 类型谓语，判断是否联系人对象
function isContact(val: unknown): val is Contact {
  if (
    typeof val === 'object'
    && Object.prototype.hasOwnProperty.call(val, 'id')
    && Object.prototype.hasOwnProperty.call(val, 'name')
  ) {
    return true;
  }
  return false;
}

// 2. States:

// 组件实例
let instance: any = null;
// 弹窗是否可见
const visible = ref(false);
// 是否加载中
const isLoading = ref(false);
// 树形数据
const treeData = ref<TreeNode[]>([]);
// 筛选后的树形数据
const filteredTreeData = ref<TreeNode[]>([]);
// 搜索关键词
const searchKeyword = ref<string>('');
// 应急负责人列表
const responsiblePersonList = ref<Contact[]>([]);
// 应急联络人列表
const contactPersonList = ref<Contact[]>([]);
// 其他人员列表
const otherPersonList = ref<Contact[]>([]);
// 勾选的联系人
const selectedContact = ref(new Map());
const propsV = ref<any>({});
// 3. Methods:

/**
 * 筛选树形数据
 *
 * @param keyword 搜索关键词
 */
const filterTree = (keyword: string) => {
  if (keyword) {
    const tmpTree: TreeNode[] = [];
    const findAllChild = (list: TreeNode[]) => {
      list.forEach((item: TreeNode) => {
        if (item.name.includes(keyword)) {
          tmpTree.push(item);
        }
        if (item?.children?.length) {
          findAllChild(item.children);
        }
      });
    };
    findAllChild(treeData.value);
    filteredTreeData.value = tmpTree;
  } else {
    filteredTreeData.value = treeData.value;
  }
};
/**
 * 获取树形数据
 */
const getTreeData = () => {
  const request = {
    method: 'get',
    service: 'soc',
    url: '/mail/mailgroup/list',
  };
  isLoading.value = true;
  instance.$http(request).then((response: any) => {
    if (response?.code === 0 && response?.data?.length) {
      treeData.value = response.data;
      searchKeyword.value = '';
      filteredTreeData.value = treeData.value;
    }
  }).finally(() => {
    isLoading.value = false;
  });
};
/**
 * 获取部门对应的其他人员
 *
 * @param id 部门id
 */
const getOtherPerson = (node: TreeNode) => {
  const request = {
    method: 'post',
    service: 'soc',
    url: '/mail/mailcontactor/list',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      // 一次请求所有数据，性能差找后端
      limit: 999999,
      page: 1,
      groupId: [node.id],
    },
  };
  isLoading.value = true;
  instance.$http(request).then((response: any) => {
    if (response?.code === 0) {
      otherPersonList.value = response?.data?.list || [];
      if (propsV.value.judgeActivationApp) {
        // 只显示app用户
        otherPersonList.value = otherPersonList.value.reduce((pre: any, ele: any) => {
          if (ele.appUser === 1) {
            pre.push(ele);
          }
          return pre;
        }, []);
      }
      otherPersonList.value.forEach((contact: any) => {
        /* eslint-disable no-param-reassign */
        contact.groupId = node.id;
        contact.groupName = node.name;
        contact.workUnit = node.name;
      });
    }
  }).finally(() => {
    isLoading.value = false;
  });
};
// 获取通讯录分组成员列表
function getContactList(node: TreeNode) {
  const request = {
    method: 'post',
    service: 'soc',
    url: '/mail/mailgroup/getGroupManageEvent',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      Ids: [node.id],
    },
  };
  instance.$http(request).then((response: any) => {
    if (response.code === 0) {
      console.log(response);
      responsiblePersonList.value = response.data?.map((i: any) => i.groupResponsibleTypeList?.map((j: any) => j?.malicontactorList || []) || [])?.flat(Infinity);
      contactPersonList.value = response.data?.map((i: any) => i.groupContactorTypeList?.map((j: any) => j?.malicontactorList || []) || [])?.flat(Infinity);
      if (propsV.value.judgeActivationApp) {
        // 只显示app用户
        responsiblePersonList.value = responsiblePersonList.value.reduce((pre: any, ele: any) => {
          if (ele.appUser === 1) {
            pre.push(ele);
          }
          return pre;
        }, []);
        contactPersonList.value = contactPersonList.value.reduce((pre: any, ele: any) => {
          if (ele.appUser === 1) {
            pre.push(ele);
          }
          return pre;
        }, []);
      }
      responsiblePersonList.value.forEach((i: any) => {
        i.groupId = node.id;
        i.groupName = node.name;
        i.workUnit = node.name;
      });
      contactPersonList.value.forEach((i: any) => {
        i.groupId = node.id;
        i.groupName = node.name;
        i.workUnit = node.name;
      });
    }
  });
}
/**
 * 点击树形数据
 *
 * @param node 树形项数据
 */
const handleTreeClick = (node: TreeNode) => {
  getOtherPerson(node);
  getContactList(node);
};
/**
 * 勾选、取消勾选
 *
 * @param contact 联系人
 */
const handleCheck = (contact: Contact, multiple = true): void => {
  if (selectedContact.value.has(contact.id)) {
    selectedContact.value.delete(contact.id);
  } else {
    if (!multiple) {
      selectedContact.value.clear();
    }
    selectedContact.value.set(contact.id, contact);
  }
};
/**
 * 勾选当前全部
 */
const handleCheckAll = (): void => {
  responsiblePersonList.value.forEach((contact) => {
    selectedContact.value.set(contact.id, contact);
  });
  contactPersonList.value.forEach((contact) => {
    selectedContact.value.set(contact.id, contact);
  });
  otherPersonList.value.forEach((contact) => {
    selectedContact.value.set(contact.id, contact);
  });
};
/**
 * 取消勾选当前全部
 */
const handleUncheckAll = (): void => {
  responsiblePersonList.value.forEach((contact) => {
    selectedContact.value.delete(contact.id);
  });
  contactPersonList.value.forEach((contact) => {
    selectedContact.value.delete(contact.id);
  });
  otherPersonList.value.forEach((contact) => {
    selectedContact.value.delete(contact.id);
  });
};

export default (props: {
  modelValue: unknown[],
  judgeActivationApp: boolean,
}): {
  visible: Ref<boolean>,
  isLoading: Ref<boolean>,
  treeData: Ref<TreeNode[]>,
  filteredTreeData: Ref<TreeNode[]>,
  getTreeData: () => void,
  searchKeyword: Ref<string>,
  handleCheck: (contact: Contact) => void,
  filterTree: (keyword: string) => void,
  contactPersonList: Ref<Contact[]>,
  responsiblePersonList: Ref<Contact[]>,
  otherPersonList: Ref<Contact[]>,
  handleTreeClick: (node: TreeNode) => void,
  selectedContact: Ref<Map<number, Contact>>,
  handleCheckAll: () => void,
  handleUncheckAll: () => void,
} => {
  propsV.value = props;
  instance = getCurrentInstance()?.appContext.config.globalProperties;
  onMounted(() => {
    getTreeData();
  });
  onBeforeUnmount(() => {
    selectedContact.value.clear();
  });
  // 监听父组件传参更改
  const parentSelectedContact = toRef(props, 'modelValue');
  watch(parentSelectedContact, (newVal) => {
    selectedContact.value.clear();
    newVal.forEach((contact) => {
      if (isContact(contact)) {
        selectedContact.value.set(contact.id, contact);
      }
    });
  });
  return {
    visible,
    isLoading,
    treeData,
    getTreeData,
    handleCheck,
    searchKeyword,
    filteredTreeData,
    filterTree,
    responsiblePersonList,
    contactPersonList,
    handleTreeClick,
    selectedContact,
    otherPersonList,
    handleCheckAll,
    handleUncheckAll,
  };
};
