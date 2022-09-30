// 启用的项目
const projectBuildList = [
    // 'demo',
    'command@3.0',
    'coplotting',
    'SIOC-H5',
    'flightPatrol',
    'largeScreen',
    'micro',
];

/* 重要：后续内容不能修改!!! */
/* eslint-disable */
const path = require('path');
const fs = require('fs');
const library = require('./library.config');

// 导出的配置
const projectConfig = {
    pages: {},
    patterns: [],
};
// 实际被使用的共享静态资源
const usedCommonStatic = new Set();
// 批量配置每个项目的入口脚本、HTML模板、静态文件路径
projectBuildList.forEach((project) => {
    // 入口文件选取js或ts
    const entry = fs.existsSync(path.join(__dirname, '../src/project', project, './index.js')) ?
        path.join(__dirname, '../src/project', project, './index.js') :
        path.join(__dirname, '../src/project', project, './index.ts');
    // 配置html和入口
    projectConfig.pages[project] = {
        entry,
        template: path.join(__dirname, '../src/project', project, './index.html'),
        fileName: `${project}.html`,
        title: project,
    };
    // 配置静态文件夹
    projectConfig.patterns.push({
        from: path.resolve(__dirname, '../src/project', project, './static'),
        to: path.resolve(__dirname, '../dist'),
    });
    // 配置共享静态资源
    if (library.project[project]) {
        library.project[project].static.forEach((item) => {
            usedCommonStatic.add(item);
        });
    }
});
Array.from(usedCommonStatic).forEach((commonStatic) => {
    if (!fs.existsSync(library.common[commonStatic])) {
        throw new Error(`共享静态文件${commonStatic}路径不存在！`);
    }
    projectConfig.patterns.push({
        from: library.common[commonStatic],
        to: path.resolve(__dirname, '../dist', commonStatic),
    });
});
usedCommonStatic.clear();

module.exports = projectConfig;
