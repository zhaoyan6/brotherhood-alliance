/**
 * Created by chenlei on 16/8/25.
 * @desc 自定义百度统计指令
 */
var Vue = require('vue')
Vue.directive('bd-statistic', {
    bind: function () {
        var _hmt = _hmt || [];
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.lib?089eb45a6fecae070944659845cf0377";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    }
});
