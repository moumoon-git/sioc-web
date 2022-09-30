
/*
 * @Author: DGT 
 * @Date: 2021-05-19 16:46:27 
 * @Last Modified by: DGT
 * props:组件参数
 * @Last Modified time: 2021-05-19 16:48:21
 */
export default function returnClass (props:any) {
    function returnNewClass(tempClassName:string) {
        let topicClassName = ''; // 返回的类名
        if (props.from === 'commandBrain') {
          topicClassName = `${tempClassName}c`;
        } else {
          topicClassName = tempClassName;
        }
        return topicClassName;
      }

  return {
    returnNewClass
  }
}