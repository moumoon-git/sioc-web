export interface videoObj{
    address?: string,
    groupName?: string,
    name?: string,
    position?: string,
    department?: string,
    roleName?: string,
    userId?: number,
    username?: string,
    liveAddress?: string,
    localRecordUrl?: string,
    txRecordUrl?: string,
}

export interface videoItme {
    id: string,
    roomId: string,
    image: string,
    number: string,
    origin: string,
    title: string,
    type: string,
    eventLinked: number,
    relationId: number,
    liveRoomTitle: string,
    liveType: number,
    platformId: number,
    localRecordUrl: string,
    txRecordUrl: string,
    liveAddress: string,
    uploadContactor: Partial<videoObj>,
    userVo: Partial<videoObj>,
    showMoreButton: boolean,
}

export interface historyData{
    eventLinked: number,
    id: number,
    platformId: number,
    localRecordUrl: string,
    txRecordUrl: string,
    userVo: videoObj,
    uploadContactor: videoObj,
    liveAddress: string,
    origin: string,
}

export interface historyArray {
    date: string,
    records: Array<historyData>,
}
