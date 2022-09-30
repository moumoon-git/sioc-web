
import { useStore } from 'vuex';
import { onMounted, Ref, ref } from 'vue'
import { ElMessage } from 'element-plus';
const usePlatformShare = ($http: any): {
  allGroupData: Ref<any[]>,
  showShareItem: Ref<Boolean>,
  getAllGroupInfo: (
    id: number
  ) => void
} => {
  const allGroupData = ref([]) // 分组列表
  const showShareItem = ref(false) // 显示
  const store = useStore(); // 使用vuex
  // 生成一键分享链接
  const getAllGroupInfo = (id: number) => {
    const request = {
      method: 'get',
      service: 'coplotting',
      url: '/assist/assistmapgroup/list',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        mapId: store.state.coplotting.mapId
      }
    };
    $http(request)
      .then((response: any) => {
        if (response.code === 0) {
          allGroupData.value = response.data
          // showShareItem.value = true
        } else {
          ElMessage.error(
            `获取分组列表失败，错误代码${response.code}，错误信息：${response.msg}`,
          );
        }
      })
      .catch((error: Error) => {
        ElMessage.error(`获取分组列表失败，错误信息：${error}`);
      });
  }
  onMounted(() => {

  })
  return {
    allGroupData,
    showShareItem,
    getAllGroupInfo

  }
}
export default usePlatformShare;