import './style/index.scss';

export default (el, { value }) => {
  const element = el;
  if (value && element) {
    if (!element.style.position) {
      element.style.position = 'relative';
    }
    if (
      !element.lastChild
      || (
        element.lastChild
        && element.lastChild.className !== 'sv-loading'
      )
    ) {
      const modal = document.createElement('div');
      modal.style.width = `${element.offsetWidth}px`;
      modal.style.height = `${element.offsetHeight}px`;
      // 一定延迟后再显示载入动画，参照 iOS 和 React 的实现和调研，优化交互体验
      setTimeout(() => {
        modal.innerHTML = '<div class="la-square-jelly-box la-2x"><div></div><div></div></div><div>正在加载中...</div>';
      }, 300);
      modal.className = 'sv-loading';
      element.appendChild(modal);
    }
  } else if (!value && element) {
    if (element.lastChild.className === 'sv-loading') {
      element.removeChild(element.lastChild);
    }
  }
};
