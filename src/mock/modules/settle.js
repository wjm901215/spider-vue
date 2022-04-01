
// 生成数据列表
var dataList = [{
  "launchTime": "2018-10-01",
  "inOrderNum": "I8983983948",
  "outOrderNum": "O233983904",
  "inAccount": "支付宝",
  "outAccount": "银行卡",
  "businessType": "银行卡转账",
  "state": "已结算",
  "money": "11293.00"
},{
  "launchTime": "2018-10-01",
  "inOrderNum": "I3321983987",
  "outOrderNum": "O763983983",
  "inAccount": "支付宝",
  "outAccount": "银行卡",
  "businessType": "银行卡转账",
  "state": "已结算",
  "money": "15293.00"
},{
  "launchTime": "2018-10-01",
  "inOrderNum": "I8934857223",
  "outOrderNum": "O903983927",
  "inAccount": "支付宝",
  "outAccount": "银行卡",
  "businessType": "银行卡转账",
  "state": "已结算",
  "money": "11293.00"
},{
  "launchTime": "2018-10-01",
  "inOrderNum": "I1198398337",
  "outOrderNum": "O563983958",
  "inAccount": "支付宝",
  "outAccount": "银行卡",
  "businessType": "银行卡转账",
  "state": "已结算",
  "money": "11293.00"
},{
  "launchTime": "2018-10-01",
  "inOrderNum": "I4342323915",
  "outOrderNum": "O673983952",
  "inAccount": "支付宝",
  "outAccount": "银行卡",
  "businessType": "银行卡转账",
  "state": "已结算",
  "money": "21492.00"
}]

// 获取用户列表
export function list () {
  return {
    // isOpen: false,
    url: '/garbage/liquidation/settle/list',
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
    url: '/garbage/liquidation/settle/info',
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
    url: '/garbage/liquidation/settle/save',
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
    url: '/garbage/liquidation/settle/update',
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
    url: '/garbage/liquidation/settle/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
    }
  }
}
