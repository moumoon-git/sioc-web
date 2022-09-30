import {
  ref,
  Ref,
} from 'vue';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';
import $message from '@/product/CommandBrain3.0/Generalparts/utils/Message/index';

export interface RecordItem {
  longitude: number,
  latitude: number,
  id: number,
  name: string,
  size: number,
  url: string,
}
export interface ClassItem {
  id: number,
  name: string,
  // 是否该分类标注被绘制
  drawn: boolean,
  url: string,
  totalMarkRecord: number,
  children: RecordItem[],
}

export interface ListItem {
  id: number,
  name: string,
  // 是否所属的所有分类标注都被绘制
  allDrawn: boolean,
  children: ClassItem[],
}

// 后端响应数据
interface ResponseData {
  id: number,
  // 文件夹名称
  fileName: string,
  // 分类列表
  basicClassList: {
    id: number,
    // 分类名称
    className: string,
    // 默认图标
    classIconUrl: string,
    totalMarkRecord: number,
    // 该分类的记录列表
    records: {
      longitude: number,
      // 后端拼错
      laitude: number,
      latitude?: number,
      id: number,
      markName: string,
      statusStyleJsonObject?: {
        size: 0 | 1 | 2,
      },
      statusIconUrl: string,
      statusName: string,
    }[],
  }[],
}

const processData = (rawData: ResponseData[]) => rawData.map((folder) => ({
  id: folder.id,
  name: folder.fileName ?? '未知',
  allDrawn: false,
  children: (folder.basicClassList ?? []).map((basicClass) => ({
    id: basicClass.id,
    name: basicClass.className,
    drawn: false,
    totalMarkRecord: basicClass.totalMarkRecord,
    url: encodeURI(basicClass.classIconUrl?.startsWith('http')
      ? basicClass.classIconUrl
      : `${(window as any).config.baseURL}${basicClass.classIconUrl}`),
    children: (basicClass.records ?? []).map((record) => ({
      id: record.id,
      longitude: record.longitude,
      latitude: record.latitude ?? record.laitude,
      name: record.markName,
      size: record.statusStyleJsonObject?.size ?? 1,
      url: encodeURI(record.statusIconUrl?.startsWith('http')
        ? record.statusIconUrl
        : `${(window as any).config.baseURL}${record.statusIconUrl}`),
    })).sort((a, b) => a.id - b.id),
  })).sort((a, b) => a.id - b.id),
}));

export default (): [
  Ref<ListItem[]>,
  () => void,
] => {
  const list = ref<ListItem[]>([]);

  const getList = () => {

    const request = {
      method: 'post',
      service: 'solr',
      // url: '/assist/assistmarkrecord/listClassFileMarkRecord',
      url: '/solr/getMarkRecordCount',
      data: {
        polygon: '',
        facetField: 'basicClassId',
        otherParam: {
          basicClassName: '',
          mapId: '',
          basicClassType: '',
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    } as const;

    $http(request).then((response: any) => {
      if (response.code === 0) {
        list.value = processData(response.data.classFileEntities ?? []);
        console.log(list.value);
      } else {
        $message.error(`获取标绘数据失败，错误代码${response.code}，错误信息：${response.msg}`);
      }
    }).catch((error: Error) => {
      $message.error(`获取标绘数据失败，错误信息：${error}`);
    });
  };

  return [
    list,
    getList,
  ];
};
