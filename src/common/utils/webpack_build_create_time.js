var fs = require('fs');
var path = require('path');
const execSync = require('child_process').execSync; //同步子进程

class webpackBuildCreateTime {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    apply(compiler) {
        const arg = process.env.npm_lifecycle_event;
        compiler.hooks.afterEmit.tapPromise('webpackBuildCreateTime', (compilation) => new Promise((resolve, reject) => {
            // console.log(compiler.options);
            // console.log(compiler.outputPath);
            // console.log(compiler.context);
            // 平台的src
            const platformSrc = compiler.context;
            if (arg === 'build' && process.env.NODE_ENV === 'production') {
                const name = execSync('git config user.name').toString().trim(); //姓名
                const email = execSync('git config user.email').toString().trim(); //邮箱
                const hours = new Date().getHours() > 10 ? new Date().getHours() : '0' + new Date().getHours();
                const minutes = new Date().getMinutes() > 10 ? new Date().getMinutes() : '0' + new Date().getMinutes();
                const seconds = new Date().getSeconds() > 10 ? new Date().getSeconds() : '0' + new Date().getSeconds();
                const nowTime = `${hours}:${minutes}:${seconds}`;
                // git 信息
                const currentGitBranch = execSync('git branch').toString().split('\n').find((branch) => branch.startsWith('* ')).slice(2);
                const latestGitLog = execSync('git log -1').toString();
                // 兼容ios
                const versionStr = `作者:${name}\n邮箱:<${email}>\n日期:${new Date().toLocaleDateString()} ${nowTime}

所在分支：${currentGitBranch}
最新提交：
${latestGitLog}`;
                const readFileSrc = path.join(platformSrc, (this.outputDir ? this.outputDir : 'dist'));
                // 检查打包路径
                if (fs.existsSync(readFileSrc)) {
                    // 拼接打包日志路径
                    const logSrc = path.join(readFileSrc, 'log', 'buildlogs.txt');
                    // console.log(logSrc);
                    fs.writeFileSync(logSrc, versionStr);
                }
            }
            resolve();
        }));
    }
}
module.exports = webpackBuildCreateTime;