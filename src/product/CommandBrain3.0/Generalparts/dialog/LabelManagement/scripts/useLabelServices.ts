import { ref } from 'vue';
import { debounce } from 'lodash';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

// 标签类型
export enum LabelType {
  // 监控标签
  Monitor = 1,
  // 任务标签
  Task,
  // 联系人标签
  Contact,
}

// 标签项
export type LabelItem = {
  id: number,
  labelStyle: string,
  labelType: LabelType,
  name: string,
};

// 常用标签列表
export function useFrequentlyUsedLabelList() {
  const frequentlyUsedLabelList = ref<LabelItem[]>([]);

  /**
   * 获取常用标签列表
   * @param type 标签类型
   * @returns 常用标签列表
   */
  const getFrequentlyUsedLabelList = async (type: LabelType): Promise<LabelItem[]> => {
    const request = {
      method: 'GET' as const,
      service: 'flight',
      url: '/applabel/frequentlyList',
      params: {
        type,
      },
    };
    try {
      const response = await $http(request);
      if (response.code === 0) {
        frequentlyUsedLabelList.value = (response.data || []) as LabelItem[];
        return frequentlyUsedLabelList.value;
      } else {
        throw Error(`代码${response.code}，${response.msg}`);
      }
    } catch (err) {
      throw Error(`获取常用标签失败，错误信息：${err}`);
    }
  };

  return [frequentlyUsedLabelList, getFrequentlyUsedLabelList] as const;
}

// 搜索已有标签
export function useSearchLabel(labelType: LabelType = LabelType.Task) {
  const searchLabelResultList = ref<LabelItem[]>([]);

  const searchLabel = debounce(async (keyword: string, type: LabelType = labelType) => {
    const request = {
      method: 'GET' as const,
      service: 'flight',
      url: '/applabel/list',
      params: {
        type,
        key: keyword,
      },
    };
    try {
      const response = await $http(request);
      if (response.code === 0) {
        searchLabelResultList.value = response.data || [];
        return searchLabelResultList.value;
      } else {
        throw Error(`代码${response.code}，${response.msg}`);
      }
    } catch (err) {
      throw Error(`搜索标签失败，错误信息：${err}`);
    }
  }, 500, { trailing: true });

  return [searchLabelResultList, searchLabel] as const;
}

// 最近使用标签列表
export function useLatestUsedLabelList() {
  const latestUsedLabelList = ref<LabelItem[]>([]);

  /**
   * 获取最近使用标签列表
   * @param type 标签类型
   * @returns 最近使用标签列表
   */
  const getLatestUsedLabelList = async (type: LabelType): Promise<LabelItem[]> => {
    const request = {
      method: 'GET' as const,
      service: 'flight',
      url: '/applabel/frequentlyUsedList',
      params: {
        type,
      },
    };
    try {
      const response = await $http(request);
      if (response.code === 0) {
        latestUsedLabelList.value = (response.data || []) as LabelItem[];
        return latestUsedLabelList.value;
      } else {
        throw Error(`代码${response.code}，${response.msg}`);
      }
    } catch (err) {
      throw Error(`获取最近使用标签失败，错误信息：${err}`);
    }
  };

  return [latestUsedLabelList, getLatestUsedLabelList] as const;
}

/**
 * 创建标签
 * @param name 标签名称
 * @param labelType 标签类型
 * @param labelStyle 标签样式
 * @returns 标签项
 */
export async function createLabel(
  name: string,
  labelType: LabelType = LabelType.Task,
  labelStyle = '',
): Promise<LabelItem> {
  const request = {
    method: 'POST' as const,
    service: 'flight',
    url: '/applabel/save',
    headers: {
      'content-type': 'application/json',
    },
    data: {
      name,
      labelType,
      labelStyle,
    },
  };
  try {
    const response = await $http(request);
    if (response.code === 0) {
      return response.data?.entity ?? {
        name,
        labelType,
        labelStyle,
        ...response.data,
      };
    } else {
      throw Error(`代码${response.code}，${response.msg}`);
    }
  } catch (err) {
    throw Error(`新增标签失败，错误信息：${err}`);
  }
}

/**
 * 更新标签
 * @param id 标签 id
 * @param name 标签名称
 * @param labelType 标签类型
 * @param labelStyle 标签样式
 */
export async function updateLabel({
  id,
  name,
  labelType = LabelType.Task,
  labelStyle = '',
}: LabelItem): Promise<void> {
  const request = {
    method: 'POST' as const,
    service: 'flight',
    url: '/applabel/update',
    headers: {
      'content-type': 'application/json',
    },
    data: {
      id,
      name,
      labelType,
      labelStyle,
    },
  };
  try {
    const response = await $http(request);
    if (response.code !== 0) {
      throw Error(`代码${response.code}，${response.msg}`);
    }
  } catch (err) {
    throw Error(`新增标签失败，错误信息：${err}`);
  }
}

export async function deleteLabel(ids: number[]): Promise<void>
export async function deleteLabel(id: number): Promise<void>
export async function deleteLabel(idOrIds: number | number[]): Promise<void> {
  const request = {
    method: 'POST' as const,
    service: 'flight',
    url: '/applabel/delete',
    headers: {
      'content-type': 'application/json',
    },
    data: Array.isArray(idOrIds) ? idOrIds : [idOrIds],
  };
  try {
    const response = await $http(request);
    if (response.code !== 0) {
      throw Error(`代码${response.code}，${response.msg}`);
    }
  } catch (err) {
    throw Error(`新增标签失败，错误信息：${err}`);
  }
}

export default {
  useFrequentlyUsedLabelList,
  useSearchLabel,
  createLabel,
};
