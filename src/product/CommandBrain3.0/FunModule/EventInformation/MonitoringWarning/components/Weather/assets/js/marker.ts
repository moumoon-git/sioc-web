function createMarker(src: any) {
  removeMarker();
  (window as any).map
    .createdMarkCoverage('天气预报');
  (window as any)
    .map.setOneMarker('天气预报', {
      longitude: 113.1,
      latitude: 23.1,
      // imgInfo 落图标记设置
      wd: 30, //宽度 type Number
      hg: 30, //高度 type Number
      src: src, //图片路径 type String
      label: '标注',
      color: '', //颜色16进制
      fontSize: '', //字体大小
      textPosition: '', //显示位置 'tp' 顶部 'bt' 底部
    },
      {
        'click': clickMark,
        // 'mouseup':fun
      }
    );
}

function clickMark() {
  alert('点击')
}

function removeMarker() {
  (window as any)
    .map.clearAtPresentMarkData('天气预报');
}

export default {
  createMarker,
  clickMark,
  removeMarker
}