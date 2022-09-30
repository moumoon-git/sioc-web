/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export default {
    namespaced: true,
    state: {
        // 启动前的处理过的数据准备
        dispatchDeskData: [],
        // 启动前 去重之后对应的源数据
        flghtPatrolSourceData: [],
        // 巡查的数据格式
        // {
        //   device: [
        //     {
        //       id: '1',
        //       name: '设备名称_1',
        //       num: '上海南京路28s.mp4',
        //     },
        //     {
        //       id: '2',
        //       name: '设备名称_2',
        //       num: '加油站26s.mp4',
        //     }
        //   ]
        // }
        // 备份数据
        backupsData: [],
        // 启动中的数据
        StartingData: [],
        // 巡查的任务ID
        taskid: 0,
        // 启动巡查的状态
        dispatchDeskState: false,
        // 启动时间
        startTime: '2021-04-09 19:01:15',
        // 飞巡记录数据
        flightPatrolRecord: {},
        // 发起预览的缓存池
        flightPatrolPreviewCachePool: [],
        // 飞巡预览数据
        flightPatrolPreview: [],
        // 取消预览
        cancelFlightPatrolPreview: [],
        // 需求428飞巡相关Start
        isShowFlightTip: true, // 是否显示tip操作窗
        isShowFlightWin: false, // 是否显示飞巡右侧窗
        showChecked: true, // 是否查看飞巡详情
        // 需求428飞巡相关End
    },
    mutations: {
        SET_dispatchDeskData(state, val) {
            const backupsData = [];
            const sourceData = [];
            console.log(val);
            const data = val.reduce((pre, ele, index) => {
                const arr = pre;
                const objs = {
                    name: ele.name,
                    order: ele.order ? ele.order : index,
                    devices: ele.devices,
                };
                ele.devices.forEach((eles) => {
                    eles.deviceId = eles.deviceId || eles.id;
                    ele.tag = ele.name || '';
                    if (eles.parent) {
                        ele.tag = eles.parent.name;
                    }
                    const obj = {
                        id: eles.id, // 设备ID
                        name: eles.name || eles.deviceName, // 设备名称
                        num: eles.number, // 设备号码
                        tag: ele.tag, // 标签
                    };
                    // 号码去重
                    const diffArr = arr.filter((x) => x.id === obj.id || x.num === obj.num);
                    if (diffArr.length === 0) {
                        arr.push(obj);
                        sourceData.push(eles);
                    }
                });
                backupsData.push(objs);
                return arr;
            }, []);
            state.backupsData = backupsData;
            state.dispatchDeskData = [{ device: data }];
            state.flghtPatrolSourceData = sourceData;
        },
        SET_StartingData(state, val) {
            state.StartingData = val;
        },
        SET_taskid(state, val) {
            state.taskid = val;
        },
        SET_dispatchDeskState(state, val) {
            state.dispatchDeskState = val;
        },
        SET_startTime(state, val) {
            state.startTime = val;
        },
        SET_flightPatrolRecord(state, val) {
            state.flightPatrolRecord = val;
        },
        SET_flightPatrolPreview(state, val) {
            state.flightPatrolPreview = val;
        },
        // 发起预览的缓存池
        SET_flightPatrolPreviewCachePool(state, val) {
            state.flightPatrolPreviewCachePool = [];
            const handleData = state.flightPatrolPreviewCachePool.concat(val);
            console.log(handleData);
            // 保留号码的唯一性，相同号码时只取第一个
            const obj = handleData.reduce((pre, ele) => {
                const num = ele.codeNum || ele.number;
                if (!pre[num]) {
                    // eslint-disable-next-line no-param-reassign
                    pre[num] = ele;
                }
                return pre;
            }, {});
            console.log(obj);
            // 发起预览
            const data = [];
            const heapData = [];
            for (const key in obj) {
                const x = obj[key];
                x.codeNum = x.number;
                const o = {
                    id: x.id,
                    name: x.name,
                    codeNum: x.codeNum,
                };
                if (!x.visPreview) {
                    data.push(o);
                }
                heapData.push(x);
            }
            // 发起预览的数据
            state.flightPatrolPreview = data;
            // 预览数据的缓存池
            state.flightPatrolPreviewCachePool = heapData;
        },
        // 取消预览
        SET_cancelFlightPatrolPreview(state, val) {
            state.cancelFlightPatrolPreview = val;
        },
        // 取消预览眼睛为虚体
        SET_cancelFlightPatrolPreviewFun(state, val) {
            // 先改变样式
            state.flightPatrolPreviewCachePool.filter((x) => {
                const ele = x;
                if (x.codeNum === val) {
                    ele.visPreview = false;
                    console.log(ele);
                }
            });
            // 在缓存池中去除对应的数据
            state.flightPatrolPreviewCachePool.filter((x, index) => {
                const ele = x;
                if (x.codeNum === val) {
                    state.flightPatrolPreviewCachePool[index] = '';
                }
            });
            const data = Array.from(new Set(state.flightPatrolPreviewCachePool)).filter((x) => x !== '');
            state.flightPatrolPreviewCachePool = data;
        },
        // 在缓存池中去除当个数据
        SET_flightPatrolPreviewCachePoolDel(state, val) {
            state.flightPatrolPreviewCachePool.filter((x, index) => {
                const ele = x;
                if (x.codeNum === val) {
                    state.flightPatrolPreviewCachePool.splice(index, 1);
                }
            });
        },
        // 设置预览眼睛为实体
        SET_visPreview(state, val) {
            // 设置缓存池里面的数据状态
            state.flightPatrolPreviewCachePool.filter((x) => {
                const ele = x;
                if (x.codeNum === val) {
                    ele.visPreview = true;
                }
            });
        },
            // 428需求Start
            SET_isShowFlightTip(state, val) {
                state.isShowFlightTip = val;
            },
            SET_isShowFlightWin(state, val) {
                state.isShowFlightWin = val;
            },
            SET_showChecked(state, val) {
                state.showChecked = val;
            }
            // 428需求End
    },
    actions: {
        changeDeskState(context, val) {
            context.commit('SET_dispatchDeskState', val);
        },
        changeDeskData(context, val) {
            context.commit('SET_dispatchDeskData', val);
        },
        // 处理数据保存接口需要的数据格式
        saveDispatchDeskData(context, val) {
            const obj = {};
            val.forEach((ele) => {
                if (ele.parent && ele.parent.id) {
                    if (obj[ele.parent.id]) {
                        obj[ele.parent.id].devices.push(ele);
                    } else {
                        obj[ele.parent.id] = { ...ele.parent };
                        obj[ele.parent.id].devices = [ele];
                    }
                }
            });
            const data = [];
            for (const key in obj) {
                data.push(obj[key]);
            }
            context.commit('SET_dispatchDeskData', data);
        },
    },
    getters: {},
};
