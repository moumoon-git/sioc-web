
export interface RecordItem {
  longitude: number|string,
  latitude?: number|string,
  laitude?: number|string,
  id: number,
  name: string,
  size: number,
  url: string,
  markName?: string,
  address?: string,
}
export interface ClassItem {
  id: number,
  name: string,
  // 是否该分类标注被绘制
  drawn: boolean,
  url: string,
  totalMarkRecord: number,
  count?: number,
  laber?: string,
  children: RecordItem[],
}

export interface ListItem {
  id: number,
  name: string,
  // 是否所属的所有分类标注都被绘制
  allDrawn: boolean,
  active?: boolean,
  count?: number,
  laber?: string,
  children: ClassItem[],
}
