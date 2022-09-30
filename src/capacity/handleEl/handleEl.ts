// 使用translate 实现拖拽
export function dragEl(el: any) {
  el.data = {
    mousePos: { x: 0, y: 0 },
    offsetX: 0,
    offsetY: 0,
    radio: 1,
    dragging: false,
  };
  el.style.cursor = 'move';
  el.style.transform = `translate(${0}px, ${0}px) scale(${el.data.radio})`;
  function mouseupFunction() {
    el.data.dragging = false;
  }
  function mousedown(e: any) {
    const event = window.event || e;
    event.preventDefault();
    const nx = event.clientX;
    const ny = event.clientY;
    el.data.mousePos.x = nx - el.data.offsetX;
    el.data.mousePos.y = ny - el.data.offsetY;
    el.data.dragging = true;
  }
  function mousemove(event: any) {
    if (el.data.dragging) {
      const e = window.event || event;
      e.preventDefault();
      const nx = event.clientX;
      const ny = event.clientY;
      const offsetX = nx - el.data.mousePos.x;
      const offsetY = ny - el.data.mousePos.y;
      el.data.offsetX = offsetX;
      el.data.offsetY = offsetY;
      console.log('赋值');
      el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${el.data.radio})`;
    }
  }
  el.onmousedown = function (e: any) {
    mousedown(e);
  };
  el.onmouseup = function (e: any) {
    mouseupFunction();
  };
  el.onmoseout = function (e: any) {
    mouseupFunction();
  };
  el.onmousemove = function (e: any) {
    mousemove(e);
  };
  document.addEventListener('mouseup', mouseupFunction, false);
}

export default {
  dragEl,
}
