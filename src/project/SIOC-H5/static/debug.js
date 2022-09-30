if (window.config.debug) {
  var script = document.createElement('script')
  let timer = null;
  script.async = true
  script.src = `//cdn.jsdelivr.net/npm/eruda`
  document.head.appendChild(script);
  timer = setInterval(() => {
    if (!!eruda) {
      eruda.init();
      console.log('控制台打印信息');
      clearInterval(timer);
    }
  }, 500);
}