import { ref } from 'vue';
import { getTop10ClassEvent } from '../../services/services';

export default function useHighlight() {
  const littleBallList = ref<any[]>([]);

  const getLittleBallList = async ({ year, quarter }: { year: number; quarter: number }) => {
    littleBallList.value = await getTop10ClassEvent({ year, quarter });
  };

  return {
    getLittleBallList,
    littleBallList,
  };
}
