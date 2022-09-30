import { reactive } from 'vue';
import { getEventByArea } from '../../services/services';

export default function useKeyArea() {
  const areaOptions = reactive<any>({});

  const getAreaOptions = async ({ year, quarter }: { year: number; quarter: number }) => {
    const res: Record<string, any> = await getEventByArea({ year, quarter });
    const legendData = [];
    const xAxis = res[Object.keys(res)[0]].map((item: any) => item.name);
    const series = [];
    for (const key in res) {
      legendData.push(key);

      series.push({
        name: key,
        type: 'bar',
        emphasis: {
          focus: 'series',
        },
        data: res[key].map((item: any) => item.num),
      });
    }
    areaOptions.legendData = legendData;
    areaOptions.xAxis = xAxis;
    areaOptions.series = series;
  };

  return {
    getAreaOptions,
    areaOptions,
  };
}
