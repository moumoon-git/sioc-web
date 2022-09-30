import {
  render,
  createVNode,
} from 'vue';

import SMSShortcut from './SMSShortcut.vue';

export default (phone: number, id: number, eventID: number) => {
  const container = document.createElement('div');
  const vnode = createVNode(SMSShortcut, {
    destroy: () => {
      render(null, container);
      document.body.removeChild(container);
    },
    phone,
    id,
    eventID,
  });
  render(vnode, container);
  document.body.appendChild(container);
  const destroy = () => {
    render(null, container);
    document.body.removeChild(container);
  };
  return destroy;
};
