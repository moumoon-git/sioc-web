export default (initLayer: '影像' | '矢量' = '影像') => {
  const layerTypeList = ['影像', '矢量'];
  let currentLayerIndex = layerTypeList.indexOf(initLayer);
  const switchLayer = () => {
    currentLayerIndex = (currentLayerIndex + 1) % 2;
    let color = currentLayerIndex === 0 ? '#fff' : '#000';
    window.map.setCoverTextColor(color)
    window.map.tabCoverage(layerTypeList[currentLayerIndex]);
  };
  return {
    switchLayer,
  };
};
