import {
  ref,
  toRefs,
  computed,
  Ref,
} from 'vue';

export default (props: {
  pageSize: number,
  interval: number,
  listData: any[],
}): {
  page: Ref<number>,
} => {
  const {
    pageSize,
    interval,
    listData,
  } = toRefs(props);
  const page = ref(0);
  const maxPage = computed(() => Math.max(Math.ceil(listData.value.length / pageSize.value), 1));
  let prevTimer = 0;
  const changePage = (timer: number) => {
    if (timer - prevTimer > interval.value * 1000) {
      prevTimer = timer;
      page.value = (page.value + 1) % maxPage.value;
    }
    requestAnimationFrame(changePage);
  };
  requestAnimationFrame(changePage);
  return {
    page,
  };
};
