function  resizeFontSize(){
  //获取根元素
  const docEl = document.documentElement;
  //获取设备宽度
  const clientWidth = docEl.clientWidth ;
  //若未获取到设备宽度，则终止函数执行
  if (!clientWidth) return ;
  //计算rem基础配置：设计图以750px为准时，px rem比例为1：100
  const fs= 100*(clientWidth/750) ;
  //为根元素字体赋值
  docEl.style.fontSize = fs+'px'
}
resizeFontSize();
window.onresize = () => {
  resizeFontSize();
};
