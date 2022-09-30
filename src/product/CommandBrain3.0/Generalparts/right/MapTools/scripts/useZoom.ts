export default () => {
  /**
   * 放大
   */
  const zoomIn = () => {
    if (window.map?.map) {
      window.map.map.zoomIn();
    }
  };

  /**
   * 缩小
   */
  const zoomOut = () => {
    if (window.map?.map) {
      window.map.map.zoomOut();
    }
  };
  return {
    zoomIn,
    zoomOut,
  };
};
