/*
 * @Author: DGT 
 * @Date: 2021-05-31 14:55:03 
 * @Last Modified by: DGT_
 * arr:树形结构的数组数据
 * @Last Modified time: 2021-05-31 16:48:57
 */
export default function returnNodes () {
    let topicArr:any = []; // 返回的节点数组
  function returnAllNodes(arr:any) {
        arr.forEach((item:any) => {
            if (item.children) {
                returnAllNodes(item.children);
            } else if (!item.children) {
              // 获得符合的 node
              topicArr.push(item);
            }
          });
        return topicArr;
      }
      
  return {
    returnAllNodes
  }
}