# 双栏式布局

## `DoubleTemplate.vue`

双栏式布局的 UI 框架，只包含左右两个块容器，左容器可以折叠。

## `DoubleImpl.vue`

双栏式布局的一种实现，左容器为树形，右容器为表格。

封装了以下功能：

- 树形筛选
- 表格筛选
- 表格分页

重要插槽：

- `<template #tree="{node, data}">`：自定义树形项
- `<template #treetop>`：树形搜索框顶部区域
- `<template #operation>`：表格搜索栏右侧
- `<template #table>`：自定义表格项

### 使用举例

```vue
<template>
  <DoubleImpl
    title="避难场所"
    :table-setting="tableSetting"
    :tree-setting="treeSetting"
  >
    <template #table>
      <ElTableColumn
        label="队伍名称"
        prop="name"
      />
    </template>
  </DoubleImpl>
</template>

<script lang="ts" setup>
import { ElTableColumn } from 'element-plus';
import DoubleImpl from '@/product/Micro/generalparts/DoubleTemplate/DoubleImpl.vue';

const tableSetting = {
  url: '/resoure/resourearea/list',
  // 对请求参数进行操作
  beforeRequest: (request: any) => ({
    ...request,
    data: {
      ...request.data,
      areaTypeId: request.data.groupIds,
      platformId: 27,
    },
  }),
  // 对响应进行操作，返回表格数据的数组，以及总数
  afterResponse: (response: any) => ({
    data: response.page.list ?? [],
    totalCount: response.page.totalCount || 0,
  }),
};

const treeSetting = {
  url: '/resoure/resourareatype/list',
  // 对请求参数进行操作
  beforeRequest: (request: any) => request,
  // 对响应进行操作，返回树形数据的数组
  afterResponse: (response: any) => ({
    data: response.data ?? [],
  }),
};
</script>
```