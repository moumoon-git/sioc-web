import Vue from 'vue';
import SvgIcon from '../../components/svgIcon.vue'; // svg组件

// register globally
Vue.component('svg-icon', SvgIcon);

const requireAll = requireContext => requireContext.keys().map(requireContext);

// require.context(directory, useSubdirectories, regExp)
// directory: 要查找的文件路径
// useSubdirectories: 是否查找子目录
// regExp: 要匹配文件的正则
const req = require.context('../icons/', true, /\.svg$/);

requireAll(req);
