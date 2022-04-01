import Vue from 'vue'

// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading
// 声明一个对象用于存储请求个数
let needLoadingRequestCount = 0
function startLoading (targetdq,message) {
    loading = Vue.prototype.$loading({
        lock: true,
        text: message,
        background: 'rgba(255,255,255,.4)',
        target: document.querySelector(targetdq) // 设置加载动画区域
    })
}

function endLoading () {
    loading.close()
}
export function showFullScreenLoading (targetdq,message='努力加载中...') {
    if (needLoadingRequestCount === 0) {
        startLoading(targetdq,message)
    }
    needLoadingRequestCount++
}
export function hideFullScreenLoading () {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

export default {
    showFullScreenLoading,
    hideFullScreenLoading
}
