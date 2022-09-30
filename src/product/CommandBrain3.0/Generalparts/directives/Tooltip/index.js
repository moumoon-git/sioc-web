import './style/index.scss';

export default (el, { value, modifiers }) => {
  const element = el;
  if (value) {
    element.classList.add('sv-tooltip__target');
    if (!element.style.position) {
      element.style.position = 'relative';
    }
    let tooltip = Array.from(element.children).find((child) => child.className === 'sv-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('span');
      tooltip.className = 'sv-tooltip';
      element.appendChild(tooltip);
    }
    if (modifiers.bottom) {
      tooltip.className = 'sv-tooltip sv-tooltip--bottom';
    }
    tooltip.innerHTML = value;
  }
};
