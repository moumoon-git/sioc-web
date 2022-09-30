/* eslint-disable */
const path = require('path');

// 项目库配置
const project = {
    // demo 项目
    demo: {
        // 用到的共享静态资源
        static: [
            'SuperMap',
        ],
    },
    'command@3.0': {
        // 用到的共享静态资源
        static: [
            'SuperMap',
            'PuHuiTi',
            'pdf',
            'stomp',
            'rewritePrimordial',
        ],
    },
    coplotting: {
        // 用到的共享静态资源
        static: [
            'SuperMap',
            'PuHuiTi',
            'stomp',
            'rewritePrimordial',
        ],
    },
    'SIOC-H5': {
        // 用到的共享静态资源
        static: [
            'SuperMap',
            'PuHuiTi',
            'pdf',
            'stomp',
            'rewritePrimordial',
        ],
    },
    largeScreen: {
        // 用到的共享静态资源
        static: [
            'SuperMap',
            'PuHuiTi',
            'pdf',
            'YouSheBiaoTiHei',
            'DIN',
            'stomp',
            'rewritePrimordial',
        ],
    },
    flightPatrol: {
        // 用到的共享静态资源
        static: [
            'SuperMap',
            'PuHuiTi',
            'pdf',
            'YouSheBiaoTiHei',
            'DIN',
            'stomp',
            'rewritePrimordial',
        ],
    },
    micro: {
        // 用到的共享静态资源
        static: [
            'PuHuiTi',
        ],
    },
};

// 共享静态文件基址
const commonBaseURL = path.join(__dirname, '../src/common/static');
// 共享静态资源
const common = {
    // 超图
    SuperMap: path.join(commonBaseURL, 'SuperMap'),
    // 阿里巴巴普惠体
    PuHuiTi: path.join(commonBaseURL, 'PuHuiTi'),
    // pdf.js
    pdf: path.join(commonBaseURL, 'pdf'),
    // YouSheBiaoTiHei字体
    YouSheBiaoTiHei: path.join(commonBaseURL, 'YouSheBiaoTiHei'),
    // DIN字体
    DIN: path.join(commonBaseURL, 'DIN'),
    // stomp.js
    stomp: path.join(commonBaseURL, 'stomp'),
    // 重写原生方法
    rewritePrimordial: path.join(commonBaseURL, 'rewritePrimordial'),
};

module.exports = {
    project,
    common,
};
