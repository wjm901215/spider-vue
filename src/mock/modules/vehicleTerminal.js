
// 生成数据列表
var dataList = [{
  "deviceCode": "C9032898912",
  "model": "IDS-2CF8312",
  "factoryDealer": "XXXXXX",
  "validPixel": "2000W",
  "placementArea": "XX区",
  "state": "使用中",
  "releaseTime": "2018-10-01"
},{
  "deviceCode": "C8943939232",
  "model": "IDS-2CF8312",
  "factoryDealer": "XXXXXX",
  "validPixel": "2000W",
  "placementArea": "XX区",
  "state": "使用中",
  "releaseTime": "2018-10-01"
},{
  "deviceCode": "C3884823893",
  "model": "IDS-2CF8312",
  "factoryDealer": "XXXXXX",
  "validPixel": "2000W",
  "placementArea": "XX区",
  "state": "使用中",
  "releaseTime": "2018-10-01"
},{
  "deviceCode": "C3923990584",
  "model": "IDS-2CF8312",
  "factoryDealer": "XXXXXX",
  "validPixel": "2000W",
  "placementArea": "XX区",
  "state": "使用中",
  "releaseTime": "2018-10-01"
},{
  "deviceCode": "C3284899221",
  "model": "IDS-2CF8312",
  "factoryDealer": "XXXXXX",
  "validPixel": "2000W",
  "placementArea": "XX区",
  "state": "使用中",
  "releaseTime": "2018-10-01"
}]

// 获取用户列表
export function list () {
  return {
    // isOpen: false,
    url: '/garbage/sys/vehicleTerminal/list',
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
    url: '/garbage/sys/vehicleTerminal/info',
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
    url: '/garbage/sys/vehicleTerminal/save',
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
    url: '/garbage/sys/vehicleTerminal/update',
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
    url: '/garbage/sys/vehicleTerminal/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
    }
  }
}
