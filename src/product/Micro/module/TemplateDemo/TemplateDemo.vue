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
      <ElTableColumn
        label="队伍名称"
        prop="name"
      />
      <ElTableColumn
        label="队伍名称"
        prop="name"
      />
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
  beforeRequest: (request: any) => ({
    ...request,
    data: {
      ...request.data,
      areaTypeId: request.data.groupIds,
      platformId: 27,
    },
  }),
  afterResponse: (response: any) => ({
    data: response.page.list ?? [],
    totalCount: response.page.totalCount || 0,
  }),
};

const treeSetting = {
  url: '/resoure/resourareatype/list',
  beforeRequest: (request: any) => request,
  afterResponse: (response: any) => ({
    data: response.data ?? [],
  }),
};
</script>
