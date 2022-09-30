import { ElMessage } from 'element-plus';
import $http from '@/product/CommandBrain3.0/mainCapacity/axios/apiRequest';

export interface FileListItem {
  title: string,
  url: string,
  id: number,
}

export const handleUpload = async (files: FileList, type = '3') => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('files', file);
  });
  formData.append('type', type);
  const request = {
    method: 'POST' as const,
    url: '/fileupload/appAttachment/fileUploadAttachments',
    headers: {
      'Content-Type': 'multipart/form-data ',
    },
    data: formData,
  };
  try {
    const rsp = await $http(request);
    if (rsp.errorcode === 0) {
      return (rsp.data || []) as FileListItem[];
    } else {
      ElMessage.error(`上传失败，错误代码${rsp.errorcode}，错误信息：${rsp.msg}`);
    }
  } catch (error) {
    ElMessage.error(`上传发生错误，错误信息：${error}`);
  }
};
