const fs = require('fs');
const projectConfig = require('./config/project.config');
// 生成打包作者和日期
const webpackBuildCreateTime = require('./src/common/utils/webpack_build_create_time');
const outputDir = 'dist';

module.exports = {
    // 关闭文件保存时启用 eslint 校验
    lintOnSave: false,
    // publicPath: './', // 打包后不需要通过架设服务，直接html就能运行
    // 多页面配置
    pages: {
        ...projectConfig.pages,
    },
    css: {
        requireModuleExtension: true,
    },
    configureWebpack: {
        plugins: [
            // 生成打包作者和日期
            new webpackBuildCreateTime(outputDir),
        ],
        // qiankun 打包配置
        output: {
            library: 'micro',
            libraryTarget: 'umd', // 把微应用打包成 umd 库格式
            jsonpFunction: 'webpackJsonp_micro',
        },
    },
    // 给安卓打包时，加上publicPath: './'，默认注释
    // publicPath: './',
    outputDir,
    // webpack 配置
    chainWebpack: (config) => {
        // 修改 copy-webpack-plugin 的配置参数
        config
            .plugin('copy')
            .tap((args) => {
                args[0].push(...projectConfig.patterns);
                // 判断路径合法性
                args[0].forEach((setting) => {
                    if (!fs.existsSync(setting.from)) {
                        throw new Error(`静态文件夹${setting.from}路径不存在`);
                    }
                });
                return args;
            });
        // 生产环境关闭 source-map
        if (process.env.NODE_ENV === 'production') {
            config.devtool('none');
        }
    },

    devServer: {
        // 允许跨域
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        proxy: {
            // 科大讯飞语音转文字API访问地址
            '/raasr': { //使用"/raasr"来代替"https://raasr.xfyun.cn/"
                target: 'https://raasr.xfyun.cn/', //源地址
                changeOrigin: true, //改变源
                pathRewrite: {
                    '^/raasr': '' //路径重写
                }
            },
            // 彩云天气API访问地址
            '/caiyun': {
                target: 'http://api.caiyunapp.com/', //源地址
                changeOrigin: true, //改变源
                pathRewrite: {
                    '^/caiyun': '' //路径重写
                }
            },
        },
        open: true,
        hot: true,
    },
};