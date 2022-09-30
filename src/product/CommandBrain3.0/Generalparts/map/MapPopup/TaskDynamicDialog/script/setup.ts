/**
 * 业务如下：
 * 1、收到websocket上报的任务动态，自动打开上报地点的弹窗，并且落点，5秒后关闭弹窗，点不消失;
 * 2、点击右侧的任务动态列表，打开弹窗并且落点，手动关闭弹窗，点不用消失
 **/
import { defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
// 逻辑——时间相关业务
import $time from '../assets/js/time';
// 逻辑——文件相关业务
import $file from '../assets/js/file';

/**
 * @description 封装数据
 */
function formatData(item: any) {
  return new Promise(resolve => {
    let reportTime = $time.getTimeDivision(item.reportTime.replace(/\-/g, '/'));
    let data = {
      taskTitle: item.appEventTask?.title || '',
      taskId: item.taskId,
      id: item.id,
      // 聊天内容
      reportTime: item.reportTime, // 报送时间 | 发送时间
      timeDivision: reportTime, // 时间分割
      taskStatusName: item.operateTypeName, // 任务状态-name
      taskStatusCode: item.operateTypeCode, // 任务状态-code
      text: item.content, // 聊天文本
      // 定位信息
      address: item.address || '', // 地址
      longitude: item.longitude, // 纬度
      latitude: item.latitude, // 纬度
      // 附件内容
      attachments: {
        files: [],
        images: [],
        videos: [],
      },
      visible: true,
    };

    // 任务附件数据格式拼接：
    let attachments = {};
    if (item.appAttachments.length > 0) {
      let files: any = [];
      let images: any = [];
      let videos: any = [];
      const appAttachments = item.appAttachments.map((el: any) => {
        return {
          id: el.id || '', // 文件ID
          fileName: el.filename || '', // 文件名字
          name: el.title + el.extension, // 文件名字
          url: el.url || '', // 文件路径
          size: el.size || '', // 文件大小
          extension: $file.getExtensions(el.filename) || '', // 文件后缀
          code: el.dictionaryType.code || '',
        };
      });

      // 文档类型:
      files = appAttachments.filter((el: any) => el.code === 'file');
      // 图片类型:
      images = appAttachments.filter((el: any) => el.code === 'image');
      // 视频类型:
      videos = appAttachments.filter((el: any) => el.code === 'video');

      Object.assign(attachments, { files: files });
      Object.assign(attachments, { images: images });
      Object.assign(attachments, { videos: videos });
      Object.assign(data, { attachments: attachments });
    }
    resolve(data);
  });
}


/**
 * @description 给图层添加marker
 */
function assignCoverageAddMark(el: any) {
  (window as any).map.assignCoverageAddMark(
    '任务动态',
    {
      longitude: el.longitude || '',
      latitude: el.latitude || '',
      // imgInfo 落图标记设置
      wd: 40, //宽度 type Number
      hg: 40, //高度 type Number
      src: require('../assets/images/mapIcon__task.svg'),
      label: '',
      color: '', //颜色16进制
      fontSize: '', //字体大小
      textPosition: '', //显示位置 'tp' 顶部 'bt' 底部
    },
    {},
  );
}



export default function loadSetup() {
  const store: any = useStore();
  /**
   * @param {object} result 任务动态数据
   * @param {boolean} timingToHide 定时隐藏 （业务：通过websocket接受的任务动态在地图上显示弹窗，5秒后要隐藏。通过实时动态点击的不需要隐藏）
   * @description 设置任务动态数据
   */
  function setDynamicData(result: any, timingToHide: boolean) {
    // 任务动态的数据
    let dynamicData = {
      id: 0,
      // 聊天内容
      reportTime: '', // 报送时间 | 发送时间
      timeDivision: '', // 时间分割
      taskStatusName: '', // 任务状态-name
      taskStatusCode: '', // 任务状态-code
      text: '', // 聊天文本
      // 定位信息
      address: '', // 地址
      longitude: '', // 纬度
      latitude: '', // 纬度
      // 附件内容
      attachments: {
        files: [],
        images: [],
        videos: [],
      },
      timingToHide: true
    };
    // 事件id
    const eventId = store.state.event?.id;
    // 动态列表
    const dynamicList = store.state.taskDynamicDialog.taskDynamicDialogData;
    // 避免接收到重复的消息，先判断是否有加入任务动态列表，如果有加入的话，就不用重复加入
    // 1、判断事件
    if (eventId !== result.eventId) {
      return;
    }
    if (dynamicList && dynamicList.length > 0) {
      // 2、判断任务 3、判断任务动态id
      let _index = dynamicList.findIndex((el: any) => {
        return el.id === result.data.id && el.taskId === result.data.taskId;
      });

      // 列表中没有这条数据，可以添加到任务动态列表里
      if (_index < 0) {
        formatData(result.data).then((res: any) => {
          let list = Array.from(dynamicList);
          dynamicData = res;
          dynamicData.timingToHide = timingToHide;
          list.push(dynamicData);
          store.commit('taskDynamicDialog/SET_taskDynamicDialogData', list);
        });
      } else {
        // 如果已经添加过askDynamicDialogData，就把visible改为true，避免重复添加
        dynamicList[_index].visible = true;
        dynamicList[_index].timingToHide = timingToHide;
      }
      return;
    }

    // 第一次添加数据
    formatData(result.data).then((res: any) => {
      let list = [];
      dynamicData = res;
      dynamicData.timingToHide = timingToHide;
      list.push(dynamicData);
      store.commit('taskDynamicDialog/SET_taskDynamicDialogData', list);
    });
    console.log('任务动态：', dynamicData)
  }

  /**
   * @description 拿到消息后的回调
   */
  function websocketCallback(params: any) {
    const result = JSON.parse(params.body);
    console.log('websocket=>任务动态：', result)
    if (result.data.latitude && result.data.longitude) {
      // 设置任务动态数据
      setDynamicData(result, true);
    }
  }
  /**
 * @description 创建图层
 */
function createdMarkCoverage() {
  if((window as any).map) {
    (window as any).map.createdMarkCoverage('任务动态').then((res: any) => {});
  }else{
    setTimeout(()=>{
      createdMarkCoverage()
    },200)
  }
}

/**
 * @description 清空该图层的数据
 */
function clearAtPresentMarkData() {
  if((window as any).map) {
    (window as any).map.clearAtPresentMarkData('任务动态').then((res: any) => {});
  }else{
    setTimeout(()=>{
      clearAtPresentMarkData()
    },200)
  }
}

/**
 * @description 获取落点信息
 */
function getMarksData(data: any) {
  return new Promise(resolve => {
    const marks: any = ref([]);
    data.forEach((el: any) => {
      if (el.longitude && el.latitude) {
        marks.value.push({
          longitude: el.longitude || '',
          latitude: el.latitude || '',
          // imgInfo 落图标记设置
          wd: 40, //宽度 type Number
          hg: 40, //高度 type Number
          src: require('../assets/images/mapIcon__task.svg'),
          label: '',
          color: '', //颜色16进制
          fontSize: '', //字体大小
          textPosition: '', //显示位置 'tp' 顶部 'bt' 底部
        });
      }
    });
    resolve(marks.value);
  });
}
  /**
   * @description 设置多个mark落点
   */
  function setMultiMarker(data: any) {
    console.log('设置落点：', data)
    createdMarkCoverage();
    getMarksData(data).then((res: any) => {
      // 落点
      (window as any).map.setMultiMarker('任务动态', res, {});
    });
  }
  /**
   * @description 显示任务动态弹窗
   */
  function showTaskDynamicDialog() {
    setMultiMarker(store.state.taskDynamicDialog.taskDynamicDialogData);
  }
  return {
    // 设置任务动态数据
    setDynamicData,
    // 封装数据
    formatData,
    // 拿到消息后的回调
    websocketCallback,
    // 显示任务动态弹窗
    showTaskDynamicDialog,
    // 获取落点信息
    getMarksData,
    // 创建图层
    createdMarkCoverage,
    // 清空该图层的数据
    clearAtPresentMarkData,
    // 给图层添加marker
    assignCoverageAddMark,
    // 设置多个mark落点
    setMultiMarker,
  };
}
