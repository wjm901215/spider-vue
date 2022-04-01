/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

export function isIdentifyCode(s) {
  return /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(s)
}

/**
 * valid phone in form
 * @param rule
 * @param value
 * @param callback function()
 */
export function validatePhone(rule, value, callback) {
  if (value == '' || value == null) {
    callback()
  } else if (!isMobile(value)) {
    callback(new Error("手机号码格式错误"))
  } else {
    callback()
  }
}

export function validateIdentifyCode(rule, value, callback) {
  if (value == '' || value == null) {
    callback()
  } else if (!isIdentifyCode(value)) {
    callback(new Error("身份证号码格式错误"))
  } else {
    callback()
  }
}

//身份证验证
export function identityNoVali (rule, sId, callback){
  var iSum=0 ;
  var sBirthday;
  var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",
    33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",
    50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",
    81:"香港",82:"澳门",91:"国外 "};
  if(!/^\d{17}(\d|x)$/i.test(sId)){
    callback(new Error('你输入的身份证长度或格式错误'));
  }
  sId=sId.replace(/x$/i,"a");
  if(aCity[parseInt(sId.substr(0,2))]==null){
    callback(new Error('你的身份证地区非法'));
  }
  sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
  var d=new Date(sBirthday.replace(/-/g,"/")) ;
  if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
    callback(new Error('身份证上的出生日期非法'));
  }
  for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
  if(iSum%11!=1){
    callback(new Error('你输入的身份证号非法'));
  } else {
    callback();
  }
};
