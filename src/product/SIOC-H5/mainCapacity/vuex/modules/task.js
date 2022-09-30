export default {
  namespaced: true,
  state: {
    taskForm: {
      // 任务id
      taskId: '',
      // 任务名称
      taskName: '',
      // 任务类型
      taskType: {
        id: '',
        name: '',
      },
      // 任务地点
      taskAddress: '',
      // 任务经度
      taskLongitude: '',
      // 任务纬度
      taskLatitude: '',
      // 执行时间-即时、定时
      taskExecutionType: '',
      // 执行日期
      taskExecutionTimeDate: '',
      // 任务时限
      taskTimeLimit: {
        value: '', // 时限 + 类型
        index: 0, // 下标
        typeName: '', // 类型的名字
        date: '', // 日期，时限
      },
      // 任务时限警告
      alertTypeOptions1: [
        {
          id: 1,
          name: '站内警告',
          checked: true,
        },
        {
          id: 2,
          name: '短信警告',
          checked: true,
        },
        {
          id: 3,
          name: 'APP警告',
          checked: true,
        },
      ],
      // 任务提醒警告
      alertTypeOptions2: [
        {
          id: 1,
          name: '站内警告',
          checked: true,
        },
        {
          id: 2,
          name: '短信警告',
          checked: true,
        },
        {
          id: 3,
          name: 'APP警告',
          checked: true,
        },
      ],
      // 任务提醒
      taskAlert: {
        index: 0,
        typeName: '不提醒',
        date: '', // 自定义-时间
      },
      // 上传附件
      taskAttachments: {
        fileList: [],
        images: [],
        files: [],
        videos: [],
      },
      // 任务说明
      taskDescription: '',
      // 事件
      event: {
        eventId: '', // 事件id
        eventTitle: '', // 事件标题
      },
    },
    taskLocation: {
      address: '', // 地址
      latitude: '', // 纬度
      longitude: '', // 经度
      street: '', // 街道
      distance: 0, // 范围
      transFromLonLat: ''
    },
    taskContactors: {
      cc: [],
      responsiblePerson: [],
      members: []
    }
  },
  mutations: {
    setTaskForm(state, val) {
      state.taskForm = val
    },
    setTaskLocation(state, val) {
      state.taskLocation = val
    },
    setTaskFormContactors(state, val) {
      state.taskContactors = val
    },
    // 数据初始化
    initTaskFormData(state) {
      console.log('数据初始化')
      const taskForm = {
        // 任务id
        taskId: '',
        // 任务名称
        taskName: '',
        // 任务类型
        taskType: {
          id: '',
          name: '',
        },
        // 任务地点
        taskAddress: '',
        // 任务经度
        taskLongitude: '',
        // 任务纬度
        taskLatitude: '',
        // 执行时间-即时、定时
        taskExecutionType: '即时',
        // 执行日期
        taskExecutionTimeDate: '',
        // 任务时限
        taskTimeLimit: {
          value: '', // 时限 + 类型
          index: 0, // 下标
          typeName: '无时限', // 类型的名字
          date: '', // 日期，时限
        },
        // 任务时限警告
        alertTypeOptions1: [
          {
            id: 1,
            name: '站内警告',
            checked: true,
          },
          {
            id: 2,
            name: '短信警告',
            checked: true,
          },
          {
            id: 3,
            name: 'APP警告',
            checked: true,
          },
        ],
        // 任务提醒警告
        alertTypeOptions2: [
          {
            id: 1,
            name: '站内警告',
            checked: true,
          },
          {
            id: 2,
            name: '短信警告',
            checked: true,
          },
          {
            id: 3,
            name: 'APP警告',
            checked: true,
          },
        ],
        // 任务提醒
        taskAlert: {
          index: 0,
          typeName: '不提醒',
          date: '', // 自定义-时间
        },
        // 上传附件
        taskAttachments: {
          fileList: [],
          images: [],
          files: [],
          videos: [],
        },
        // 任务说明
        taskDescription: '',
        // 事件
        event: {
          eventId: '', // 事件id
          eventTitle: '', // 事件标题
        },
      };
      state.taskForm = taskForm
      const taskContactors = {
        cc: [],
        responsiblePerson: [],
        members: [],
      };
      state.taskContactors = taskContactors
      const taskLocation = {
        address: '', // 地址
        latitude: '', // 纬度
        longitude: '', // 经度
        street: '', // 街道
        distance: 0, // 范围
        transFromLonLat: '',
      };
      state.taskLocation = taskLocation
    }
  },
  actions: {},
  getters: {},
};
