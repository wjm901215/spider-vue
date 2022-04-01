import {export_json_to_excel} from '@/vendor/Export2Excel' //引入文件　　　　　　
import store from '@/store'


/**
 *
 * 导出excel
 *
 * @param tHeader  表头集合
 * @param filterVal 表头对应字段名集合
 * @param list 数据集合
 * @param fileName 文件名
 */
export function exportExcel(tHeader, filterVal, list, fileName) {
    const data_excel = list.map(v => filterVal.map(j => v[j]))
    export_json_to_excel(tHeader, data_excel, fileName)
}


/**
 * 获取uuid
 */
export function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
    return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 读取excel 返回 对象数组
 * @param obj excel 对象
 * @param method 回调   function(callback) { } //return the data in the excel
 *
 *
 */
export function excel2Data(obj, method) {
    let rABS = false
    let f = obj
    let reader = new FileReader()
    let dataList = null
    FileReader.prototype.readAsBinaryString = function (f) {
        let binary = ""
        let rABS = false
        let wb
        let reader = new FileReader()
        reader.onload = function (e) {
            let bytes = new Uint8Array(reader.result)
            let length = bytes.byteLength
            for (let i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i])
            }
            let XLSX = require('xlsx')
            if (rABS) {
                wb = XLSX.read(btoa(fixdata(binary)), {
                    type: 'base64'
                })
            } else {
                wb = XLSX.read(binary, {
                    type: 'binary'
                })
            }
            dataList = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
            method(dataList)
        }
        reader.readAsArrayBuffer(f)
    }
    if (rABS) {
        reader.readAsArrayBuffer(f)
    } else {
        reader.readAsBinaryString(f)
    }
}

/**
 * 将excel获取到数据更换key
 * @param dataList  要转换的数据
 * @param tHeader   excel的title数组
 * @param filterVal 要替换的key数组
 * @return {Array}  替换好的数据
 */
export function fmtExcelData(dataList, tHeader, filterVal) {
    let list = []
    dataList.forEach(row => {
        let data = {}
        tHeader.forEach((h, i) => {
            data[filterVal[i]] = row[h]
        })
        list.push(data)
    })
    return list
}

export function queryFromTreeData({treeData, id, childrenKey = 'children', idKey = 'id'}) {
    let tmpTreeData = []
    for (let i = 0; i < treeData.length; i++) {
        if (treeData[i][idKey] == id) {
            return treeData[i]
        } else if (treeData[i][childrenKey] && treeData[i][childrenKey].length > 0) {
            tmpTreeData.push(...treeData[i][childrenKey])
        }
    }
    return tmpTreeData.length > 0 ? queryFromTreeData({
        treeData: tmpTreeData,
        id,
        childrenKey,
        idKey
    }) : null
}


/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = []
            }
            if (!temp[data[k][pid]]['_level']) {
                temp[data[k][pid]]['_level'] = 1
            }
            data[k]['_level'] = temp[data[k][pid]]._level + 1
            temp[data[k][pid]]['children'].push(data[k])
        } else {
            res.push(data[k])
        }
    }
    return res
}


/**
 * 级联选择器数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function cascaderDataTranslate(data, id = 'id', pid = 'parentId') {
    let res = []
    let temp = {}
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = []
            }
            temp[data[k][pid]]['children'].push(data[k])
        } else {
            res.push(data[k])
        }
    }
    return res
}

/**
 * 递归向上查找ID
 * @param data
 * @param id
 */
export function recursiveUpFindId (data, id = 'id', value = 'value', isReturnParentId = true, otherKey = 'id') {
    let ids = []
    let tempid = id
    let len = 0
    while (true) {
        let vKey = len++ === 0 ? value : otherKey
        let tempData = data.filter(item => item[vKey] === tempid)
        if (tempData != null && tempData.length > 0) {
            tempid = tempData[0].parentId
            ids.push(tempData[0][value])
        } else {
            break
        }
    }
    if (!isReturnParentId) {
        return ids.reverse()
    }
    var index = ids.findIndex((value, index, arr) => {
        return value === id
    })
    ids.splice(index, 1)
    ids.reverse()
    return ids
}


/**
 * format money
 * @param money
 * @returns {*}
 */
export function fmtMoney(money) {
    let tpMoney = '0.00'
    if (money != null) {
        tpMoney = money
    }
    tpMoney = new Number(tpMoney)
    if (isNaN(tpMoney)) {
        return '0.00'
    }
    tpMoney = tpMoney.toFixed(2) + ''
    let re = /^(-?\d+)(\d{3})(\.?\d*)/
    while (re.test(tpMoney)) {
        tpMoney = tpMoney.replace(re, "$1,$2$3")
    }
    return tpMoney
}


/**
 * 格式化对象
 * @param {*} obj
 */
export function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date()
        copy.setTime(obj.getTime())
        return copy
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = []
        var len = obj.length
        for (var i = 0; i < len; ++i
        ) {
            copy[i] = clone(obj[i])
        }
        return copy
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {}
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
        }
        return copy
    }

    throw new Error("Unable to copy obj! Its type isn't supported.")
}

/**
 * 格式化时间 (yyyy-MM-dd HH:mm:ss)
 * @param {String} dateString
 */
export function parse2Date(dateString) {
    if (dateString) {
        var arr1 = dateString.split(" ")
        var sdate = arr1[0].split('-')
        var date = new Date(sdate[0], sdate[1] - 1, sdate[2])
        return date
    }
}

/**
 * 格式化时间 (HH:mm:ss)
 * @param {String} timeString
 */
export function parse2Time(timeString) {
    if (timeString) {
        var now = new Date()
        var arr1 = timeString.split(":")
        now.setHours(arr1[0])
        now.setMinutes(arr1[1])
        now.setSeconds(arr1[2])
        return now
    }
}

/**
 *  获取两个时间相差分钟数
 * @param {String} timeString
 */
export function getTwoTimeDiffMin(endDate, startDate) {
    if (endDate && startDate) {
        var minute = parseInt(Math.abs(endDate - startDate) / 1000 / 60)
        return minute
    }
}

/**
 * 时间格式化
 * @param {} fmt
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    }
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    }
    return fmt
}
