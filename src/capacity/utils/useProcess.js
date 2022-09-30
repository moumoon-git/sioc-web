export default ({ data, requestApi }) => {
  /**
   * fn1(fn2(fn3(path)))
   * @date 2021-09-08
   * @param {any} path 初始参数
   * @param {any} ...fn 步骤函数列表
   * @returns {any}
   */
  const compose = (path, ...fn) => () => fn.reduce((acc, cur) => cur(acc), path);

  /**
   * 请求批量转换接口
   * @date 2021-09-08
   * @param {any} params
   * @returns {any}
   */
  async function f1({ allPoints, steps, api }) {
    // 请求回来的转换数据
    const res = await api(allPoints);
    // 数据切片 => 原始数据替换
    steps.forEach(item => {
      const ori = res.splice(0, item.transFromLonLat.length).map(i => `${i.x},${i.y}`);
      item.transFromLonLat = ori.join(';');
    });
  }
  /*
  * 数据结构整合
  * {
        instruction: '向东步行89米右转',
        orientation: '东',
        road: [],
        distance: '89',
        duration: '71',
        transFromLonLat: '113.338932,23.107695;113.339779,23.107491',
        action: '右转',
        assistant_action: [],
        walk_type: '0',
      },
  * @date 2021-09-08
  * @param {any} path
  * @returns {any}
  */
  function f2({ steps, api }) {
    const allPoints = steps.reduce((acc, cur, i) => {
      cur.transFromLonLat = cur.transFromLonLat.split(';');

      acc.push(...cur.transFromLonLat);
      return acc;
    }, []);

    return {
      allPoints,
      steps,
      api,
    };
  }

  return {
    process: compose({ steps: data, api: requestApi }, f2, f1),
  };
};
