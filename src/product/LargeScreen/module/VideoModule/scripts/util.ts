export default function utilFun(){
    /**
    * @desc 获取div相对于屏幕的位置
    * @param {
    *  @div 右侧视频墙的dom
    * } 
    * @returns {} returns
    */
    function getDivPosition(div:any){
        var x = div.getBoundingClientRect().left;
        var y = div.getBoundingClientRect().top;
        return {x:x,y:y};
    }
    /**
    * @desc 
    * @param {
    *  @arr 视频数组
    * } 
    * @returns {} returns
    */
   function returnNumberStr(arr:Array<any>){
    let str = ``
    for (let i = 0; i < arr.length; i++) {
        str += arr[i].code?arr[i].code:''
        if (i != arr.length - 1) {
            str += `,`
        }
    }
    return str
   }
       /**
    * @desc 
    * @param {
        *  @arr 视频数组
        * } 
        * @returns {} returns
        */
       function returnNameStr(arr:Array<any>){
        let str = ``
        for (let i = 0; i < arr.length; i++) {
            str += arr[i].name?arr[i].name:''
            if (i != arr.length - 1) {
                str += `,`
            }
        }
        return str
       }
    return {
        getDivPosition,
        returnNumberStr,
        returnNameStr,
    }
}