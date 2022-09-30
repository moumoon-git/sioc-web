import { ref, reactive } from 'vue';
import { getStatisticByClassTotal } from '../../services/services';

export default function useEventTotal() {
  const totalData = reactive<{ eventAll: number; list: Record<string, string>[] }>({
    eventAll: 0,
    list: [],
  });
  const point = ref(0);
  const eventTotalSlide = ref('');
  const createSwiper = () => {
    let prevTimer = 0;
    return (
      {
        defaultLine,
        length,
      }: {
        defaultLine: number;
        length: number;
      },
      callback: () => void,
    ) => {
      const updateList = () => {
        callback();
        eventTotalSlide.value = 'event-total-slide';

        setTimeout(() => {
          eventTotalSlide.value = '';
          // 指针移动
          point.value = (point.value + defaultLine) % length;
        }, 1000);
      };
      // updateList();
      const step = (timer: number) => {
        if (timer - prevTimer >= 3000) {
          prevTimer = timer;

          updateList();
        }
        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };
  };

  const getTotalData = async ({ year, quarter }: { year: number; quarter: number }) => {
    const res: any = await getStatisticByClassTotal({ year, quarter });
    totalData.eventAll = res.all;
    totalData.list = res.list;
  };

  return {
    point,
    eventTotalSlide,
    getTotalData,
    totalData,
    createSwiper,
  };
}
