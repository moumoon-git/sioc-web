import { ref } from 'vue'
import $http from '@/product/Coplotting/mainCapacity/axios/apiRequest';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
export default function returnPageOptions() {
  const store = useStore(); // 使用vuex
  const currentPage = ref(1); // 当前页数
  const totalNums = ref(0); // 总条数
  const itemsBypage = ref(20); // 每页的条数
  const panelId = ref(1); // 当前是哪一个类型的地图
  const mapListData = ref([]); // 地图列表数据
  const searchValue = ref('');// 搜索的值
  /**
  * @desc 每页
  * @param {}
  * @returns {}
  */
  function handleSizeChange(val: number) {
    itemsBypage.value = val;
    getMapList(panelId.value)
  }
  /**
  * @desc 当前页
  * @param {}
  * @returns {}
  */
  function handleCurrentChange(val: number) {
    currentPage.value = val;
    getMapList(panelId.value)
  }
  /**
  * @desc 获取地图列表
  * @param {}
  * @returns {}
  */
  function getMapList(type: number) {
    panelId.value = type;
    mapListData.value = [];
    const request: any = {
      method: 'post',
      service: 'coplotting',
      url: '/assist/assistmap/getMapPage',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        mapType: type,
        mapName: searchValue.value,
        currPage: currentPage.value,
        pageSize: itemsBypage.value,
      },
    };
    $http(request).then((response: any) => {
      if (response.code === 0) {
        mapListData.value = response?.data?.records || [];
        totalNums.value = response?.data?.total || 0;
        store.commit('coplotting/SET_AllMAPSDATA', mapListData.value);
      } else {
        ElMessage.error(`获取失败，错误代码${response.code}，错误信息：${response.msg}`);
      }
    }).catch((error: Error) => {
      ElMessage.error(`获取失败，错误信息：${error}`);
    });
  }
  return {
    handleCurrentChange,
    handleSizeChange,
    getMapList,
    currentPage,
    totalNums,
    panelId,
    mapListData,
    searchValue,
  }
}
