// 重写toFixed算法，实现精度统一
Number.prototype.toFixed = function (s) {
  let changenum = (parseInt(this * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
  let index = changenum.indexOf('.');
  if (index < 0 && s > 0) {
    changenum = changenum + '.';
    for (let i = 0; i < s; i++) {
      changenum = changenum + '0';
    }
  } else {
    index = changenum.length - index;
    for (let i = 0; i < (s - index) + 1; i++) {
      changenum = changenum + '0';
    }
  }
  return changenum;
};

// 金额转大写
export const convertCurrency = function (money) {
  // 汉字的数字
  var cnNums = [
    '零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'
  ];
  // 基本单位
  var cnIntRadice = [
    '', '拾', '佰', '仟'
  ];
  // 对应整数部分扩展单位
  var cnIntUnits = [
    '', '万', '亿', '兆'
  ];
  // 对应小数部分单位
  var cnDecUnits = [
    '角', '分', '厘', '毫'
  ];
  // 整数金额时后面跟的字符
  var cnInteger = '整';
  // 整型完以后的单位
  var cnIntLast = '元';
  // 最大处理的数字
  var maxNum = 999999999999999.9999;
  // 金额整数部分
  var integerNum;
  // 金额小数部分
  var decimalNum;
  // 输出的中文金额字符串
  var chineseStr = '';
  // 分离金额后用的数组，预定义
  var parts;
  if (money == '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    // 超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  // 转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        // 归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  // 小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var j = 0; j < decLen; j++) {
      var n2 = decimalNum.substr(j, 1);
      if (n2 != '0') {
        chineseStr += cnNums[Number(n2)] + cnDecUnits[j];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
};

/** 根据返回URL判断是否是需要路由跳转 */
export const isRouterPath = function (url, vm) {
  // 返回url是在同一域名下并且满足路由需要的格式，如果不在直接采用location.href的形式跳转
  if (url.indexOf(window.location.origin + window.location.pathname) > -1 && url.indexOf('index.html#/') > 0) {
    let urlArry = url.split('index.html#/');
    // 判断是否是同一个路由系统中
    if (urlArry.length >= 2) {
      let routerPath = urlArry[1];
      // 判断URL后面是否携带参数
      if (routerPath.indexOf('?') > -1) {
        let routerObj = {
          path: '/' + routerPath.substr(0, routerPath.indexOf('?'))
        };
        let queryArry = routerPath.substr(routerPath.indexOf('?') + 1).split('&');
        let querys = {};
        for (var i = 0; i < queryArry.length; i++) {
          querys[queryArry[i].substr(0, queryArry[i].indexOf('='))] = queryArry[i].substr(queryArry[i].indexOf('=') + 1);
        }
        routerObj['query'] = querys;
        return routerObj;
      } else {
        return '/' + routerPath;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// 解决浮点数相减
export const subFloat = function (num1, num2) {
  let numString1 = String(num1);
  let numString2 = String(num2);

  let floatLength1 = numString1.indexOf('.') > -1 ? numString1.substr(numString1.indexOf('.') + 1).length : 0;
  let floatLength2 = numString2.indexOf('.') > -1 ? numString2.substr(numString2.indexOf('.') + 1).length : 0;

  if (floatLength1 != 0 || floatLength2 != 0) {
    if (floatLength1 > floatLength2) {
      return (num1 * Math.pow(10, floatLength1) - num2 * Math.pow(10, floatLength1)) / Math.pow(10, floatLength1);
    } else {
      return (num1 * Math.pow(10, floatLength2) - num2 * Math.pow(10, floatLength2)) / Math.pow(10, floatLength2);
    }
  } else {
    return num1 - num2;
  }
};

/** 打开APP 未打开会跳转应用宝下载地址 */
export const openApp = function () {
  var iosApppUrl = 'tianshengwocai://jstoapp.toHome()';
  var androidAppUrl = 'tianshengwocai://jstoapp.toHome/';
  var ua = navigator.userAgent;
  var wx = ua.indexOf('MicroMessenger');
  if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    window.location = iosApppUrl;
  } else if (navigator.userAgent.match(/android/i)) {
    window.location = androidAppUrl;
  }
  setTimeout(function () {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i) || wx != -1) {
      window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.leadbank.lbf';
    } else if (navigator.userAgent.match(/android/i)) {
      window.location = 'http://a.leadfund.com.cn/adnld/leadfund.apk?randNum=' + Math.random() * 10;
    }
  }, 2000);
};

// 取得url参数 不建议在业务逻辑中继续使用 路由系统内参数可以由vue-router的query获得
export const GetQueryString = function (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let index;
  let r;
  if (window.location.search && window.location.hash) {
    index = window.location.hash.indexOf('?');
    r = window.location.hash.substr(index + 1).match(reg);
  } else {
    index = window.location.href.indexOf('?');
    r = window.location.href.substr(index + 1).match(reg);
  }
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return null;
};

// toast弹窗
let timeOutId;
export const toast = function (msg, duration, moreclass) {
  let toastEle = document.getElementsByClassName('toast');
  if (toastEle.length > 0) {
    toastEle[0].innerHTML = "<div style='padding:5px 15px;font-size:0.7rem;color:#fff;text-align:center;word-break: break-all;background:rgba(0,0,0,.5);border-radius:30px;'>" + msg + '</div>';
  } else {
    toastEle = document.createElement('div');
    toastEle.className = 'modal toast' + (moreclass || '');
    toastEle.style.cssText = 'box-sizing:border-box;position: absolute;left: 50%;top: 50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);padding:0 15px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;width:100%;background-color:transparent;z-index:999;';
    toastEle.innerHTML = "<div style='padding:5px 15px;font-size:0.7rem;color:#fff;text-align:center;word-break: break-all;background:rgba(0,0,0,.5);border-radius:30px;'>" + msg + '</div>';
    document.body.appendChild(toastEle);
  }
  if (timeOutId) {
    clearTimeout(timeOutId);
  }
  timeOutId = setTimeout(function () {
    toastEle = document.getElementsByClassName('toast');
    if (toastEle.length > 0) {
      document.body.removeChild(toastEle[0]);
    }
  }, 2000 || duration);
};
