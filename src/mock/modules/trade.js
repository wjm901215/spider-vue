
// 生成数据列表
var dataList = [{
  "tradeTime": "2018-09-28 12:10:29",
  "tradeNo": "A1809284382511134",
  "payType": "支付宝",
  "tradeState": "已支付",
  "tradeNum": "14.00"
},{
  "tradeTime": "2018-09-28 12:10:29",
  "tradeNo": "W1809284382511831",
  "payType": "微信",
  "tradeState": "已支付",
  "tradeNum": "18.00"
},{
  "tradeTime": "2018-09-28 12:10:29",
  "tradeNo": "C1809284382510098",
  "payType": "市民卡",
  "tradeState": "已支付",
  "tradeNum": "24.00"
},{
  "tradeTime": "2018-09-28 12:10:29",
  "tradeNo": "U1809267236810449",
  "payType": "银联",
  "tradeState": "已支付",
  "tradeNum": "37.00"
},{
  "tradeTime": "2018-09-28 12:10:29",
  "tradeNo": "A1809267236810382",
  "payType": "支付宝",
  "tradeState": "已支付",
  "tradeNum": "8.00"
}]

// 获取用户列表
export function list () {
  return {
    // isOpen: false,
    url: '/garbage/liquidation/trade/list',
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
    url: '/garbage/liquidation/trade/info',
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
    url: '/garbage/liquidation/trade/save',
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
    url: '/garbage/liquidation/trade/update',
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
    url: '/garbage/liquidation/trade/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
    }
  }
}
