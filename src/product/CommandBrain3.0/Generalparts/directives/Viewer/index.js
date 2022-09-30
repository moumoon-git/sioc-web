import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

export default (el) => {
  const element = el;
  let viewer;
  if (element.$_viewer) {
    viewer = element.$_viewer;
  } else {
    viewer = new Viewer(element, {
      zIndex: 10010,
    });
    element.$_viewer = viewer;
  }
  viewer.update();
};
