// 后台返回的数据结构
export interface DynamicFollowList {
  [key: string]: any,
  // 人员
  contactor?: {
    address: string,
    id: number,
    name: string,
    latitude: number,
    longitude: number,
  }[],
  // 资源
  resource?: {
    address: string,
    id: number,
    name: string,
    // 类型
    type: string,
    latitude: number,
    longitude: number,
  }[],
  // 风险
  riskDanger?: {
    id: number,
    address: string,
    // 隐患源
    source: string,
    latitude: number,
    longitude: number,
  }[],
  // 任务
  task?: {
    // 任务地址
    address: string,
    id: number,
    // 任务标题
    title: string,
    latitude: number,
    longitude: number,
  }[],
  // 队伍
  person?: {
    address: string,
    id: number,
    name: string,
    latitude: number,
    longitude: number,
  }[],
  // 设备
  device?: {
    address: string,
    id: number,
    name: string,
    latitude: number,
    longitude: number,
  }[],
}
