import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import {Message} from 'element-ui';
import {delToken, getToken} from "@/utils/auth";

const req = axios.create()

const getBaseOptions = () => {
    const config = {
        timeout: 1000 * 30,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    return config
}

/**
 * 请求拦截
 */
req.interceptors.request.use(config => {
    config.headers['token'] = getToken() // 请求头带上token
    return config
}, error => {
    return Promise.reject(error)
})

/**
 * 响应拦截
 */
req.interceptors.response.use(response => {
    if (response.data && response.data.code === 401) { // 401, token失效
        delToken()
        router.options.isAddDynamicMenuRoutes = false
        router.push({name: 'login'})
    }
    if (response.data.code == 500) {
        Message.warning("服务繁忙，请稍后再试")
    }
    return response
}, error => {
    return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
export const adornUrl = (actionName) => {
    return actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
export const adornParams = (params = {}, openDefultParams = true) => {
    let defaults = {
        't': new Date().getTime()
    }
    return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
export const adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
    let defaults = {
        't': new Date().getTime()
    }
    data = openDefultdata ? merge(defaults, data) : data
    return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

const http = (options) => {
    options = Object.assign(getBaseOptions(), options)
    return req(options)
}

export default http
