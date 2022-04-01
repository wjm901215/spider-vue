import Vue from 'vue'
import AMap from './amap.js'
import VueCookie from 'vue-cookie'
import {isAuth} from '@/utils'
import store from '@/store'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
// 引入Leaflet对象 挂载到Vue上，便于全局使用，也可以单独页面中单独引用
// import * as L from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// 挂载全局
Vue.use(AMap)
Vue.use(VueCookie)
// Vue.use(L)
Vue.prototype.isAuth = isAuth // 权限方法
Vue.prototype.queryDictionary = store.getters['sys/dictionary/queryDictionary'] //获取数据字典
Vue.prototype.queryDictionaryText = store.getters['sys/dictionary/queryDictionaryText'] //获取数据字典CodeText
Vue.prototype.$http = httpRequest // ajax请求方法

/**
 * 添加indexOf方法
 * @param val
 * @returns {number}
 */
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
/**
 * 添加remove方法
 * @param val
 */
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
/**
 * 添加格式化方法
 * @param fmt
 * @returns {void | string}
 */
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
    require('@/mock')
}

/**
 * 退出全屏事件
 */

document.addEventListener('fullscreenchange', (event) => {
    if (document.fullscreenElement) {
        console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
    } else {
        store.dispatch('common/fullscreenToggle')
    }
});


