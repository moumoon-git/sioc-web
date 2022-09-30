import {
  ref,
  provide,
} from 'vue';
import { requestOptions } from './useRoutesRecord';

// 是否显示轨迹跟踪
export const isRoutesTrackShown = ref(false);

/**
 * 关闭轨迹跟踪
 */
export const closeRoutesTrack = (): void => {
  isRoutesTrackShown.value = false;
  // 恢复所有图层
  const { map } = window;
  map.setAllCoverageShowHide(true);
};

/**
 * 启动轨迹跟踪
 */
export const openRoutesTrack = (options: typeof requestOptions.value): void => {
  requestOptions.value = options;
  isRoutesTrackShown.value = true;
  // 隐藏所有图层
  const { map } = window;
  map.setAllCoverageShowHide(false);
};

export default (): {
  isRoutesTrackShown: typeof isRoutesTrackShown,
  closeRoutesTrack: typeof closeRoutesTrack,
  openRoutesTrack: typeof openRoutesTrack,
} => {
  provide('isRoutesTrackShown', isRoutesTrackShown);
  provide('openRoutesTrack', openRoutesTrack);
  provide('closeRoutesTrack', closeRoutesTrack);
  return {
    isRoutesTrackShown,
    closeRoutesTrack,
    openRoutesTrack,
  };
};
