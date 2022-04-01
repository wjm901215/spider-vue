
// 生成数据列表
var dataList = [{
  "inOrderDate": "2018-09-28",
  "outOrderDate": "2018-09-29",
  "payType": "支付宝",
  "reconciliaAccount": "支付宝",
  "tradeState": "已支付",
  "reconciliaNum": "10314.00",
  "serviceCharge": "5.00",
  "reconciliaState": "平账"
},{
  "inOrderDate": "2018-09-28",
  "outOrderDate": "2018-09-29",
  "payType": "微信",
  "reconciliaAccount": "微信",
  "tradeState": "已支付",
  "reconciliaNum": "21218.00",
  "serviceCharge": "13.00",
  "reconciliaState": "平账"
},{
  "inOrderDate": "2018-09-28",
  "outOrderDate": "2018-09-29",
  "payType": "市民卡",
  "reconciliaAccount": "市民卡",
  "tradeState": "已支付",
  "reconciliaNum": "11224.00",
  "serviceCharge": "6.00",
  "reconciliaState": "平账"
},{
  "inOrderDate": "2018-09-28",
  "outOrderDate": "2018-09-29",
  "payType": "银联",
  "reconciliaAccount": "银联",
  "tradeState": "已支付",
  "reconciliaNum": "13237.00",
  "serviceCharge": "7.00",
  "reconciliaState": "平账"
},{
  "inOrderDate": "2018-09-28",
  "outOrderDate": "2018-09-29",
  "payType": "支付宝",
  "reconciliaAccount": "支付宝",
  "tradeState": "已支付",
  "reconciliaNum": "9021.00",
  "serviceCharge": "4.00",
  "reconciliaState": "平账"
}]

// 获取用户列表
export function list () {
  return {
    // isOpen: false,
    url: '/garbage/liquidation/reconcilia/list',
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

export function info () {
  return {
    // isOpen: false,
    url: '/garbage/liquidation/reconcilia/info',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
      'user': dataList[0]
    }
  }
}

export function add () {
  return {
    // isOpen: false,
    url: '/garbage/liquidation/reconcilia/save',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
    }
  }
}

export function update () {
  return {
    // isOpen: false,
    url: '/garbage/liquidation/reconcilia/update',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
    }
  }
}

export function del () {
  return {
    // isOpen: false,
    url: '/garbage/liquidation/reconcilia/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
    }
  }
}
