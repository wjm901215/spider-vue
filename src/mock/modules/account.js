// 生成数据列表
var dataList = [{
    "accountNo": "99832991",
    "name": "张小小",
    "phone": "13788831112",
    "accountType": "微信",
    "state": "有效",
    "payTime": "2018-09-17"
}, {
    "accountNo": "18288888888",
    "name": "李四仁",
    "phone": "13287328111",
    "accountType": "支付宝",
    "state": "有效",
    "payTime": "2018-09-17"
}, {
    "accountNo": "3321984788839838832",
    "name": "王小五",
    "phone": "13848391121",
    "accountType": "市民卡",
    "state": "有效",
    "payTime": "2018-09-17"
}, {
    "accountNo": "62281818874838178827",
    "name": "李思思",
    "phone": "138739182",
    "accountType": "银行卡",
    "state": "有效",
    "payTime": "2018-09-17"
}]

// 获取用户列表
export function list() {
    return {
        // isOpen: false,
        url: '/garbage/liquidation/account/list',
        type: 'post',
        data: {
            'msg': 'success',
            'code': 200,
            'page': {
                'totalCount': dataList.length,
                'pageSize': 10,
                'totalPage': 1,
                'currPage': 1,
                'records': dataList
            }
        }
    }
}

export function info() {
    return {
        // isOpen: false,
        url: '/garbage/liquidation/account/info',
        type: 'post',
        data: {
            'msg': 'success',
            'code': 200,
            'user': dataList[0]
        }
    }
}

export function add() {
    return {
        // isOpen: false,
        url: '/garbage/liquidation/account/save',
        type: 'post',
        data: {
            'msg': 'success',
            'code': 200,
        }
    }
}

export function update() {
    return {
        // isOpen: false,
        url: '/garbage/liquidation/account/update',
        type: 'post',
        data: {
            'msg': 'success',
            'code': 200,
        }
    }
}

export function del() {
    return {
        // isOpen: false,
        url: '/garbage/liquidation/account/delete',
        type: 'post',
        data: {
            'msg': 'success',
            'code': 200,
        }
    }
}
