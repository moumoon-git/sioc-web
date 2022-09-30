export default function utilFun() {
    /**
    * @desc 设置动态列表动画并防止外层容器滚动条抖动
    * @param {
    * @el:列表项dom元素
    * @done:回调函数
    * } 
    * @returns {} returns
    */
    const setAnimation = (el:any, done:any) => {
      return new Promise((resolve, reject) => {
        const delay = el.dataset.index * 50;
        setTimeout(() => {
          el.style.transition = 'opacity .1s ';
          el.style.opacity = 1;
          el.style.animation = 'one-in .1s infinite';
          el.style['animation-iteration-count'] = 1;
          done();
          resolve(el);
        }, delay);
      });
    }
    /**
    * @desc 每一条列表项加载前的钩子函数
    * @param {
    * @el:列表项dom元素
    * } 
    * @returns {} returns
    */
    const beforeEnter = (el: any) => {
      el.style.opacity = 0;
    }
    /**
    * @desc 每一条列表项进入
    * @param {
    * @el:列表项dom元素
    * @done :回调
    * @allNum:列表总数
    * } 
    * @returns {} returns
    */
     const enter = async (el: any, done: any) => {
      await setAnimation(el, done);
      // preventBounce()
    }
    /**
    * @desc 滚动条防抖
    * @param {
    * @el:列表项dom元素
    * @allNum:列表总数
    * } 
    * @returns {} returns
    */
   const preventBounce = (el:any,allNum:number) =>{
    // 加载完最后一个数据的时候才设置外层容器的样式
    // if (Number(el.dataset.index) === allNum - 1) {
    //   el.parentNode.style.overflow = 'auto';
    // }
   }
    return {
        beforeEnter,
        enter
    }
  }