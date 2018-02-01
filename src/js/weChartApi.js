import axios from 'axios';
import encrypts from 'lib/RSA.js';
// import md5 from 'md5';

// 动态引入微信JSDK
if (window.isWechat) {
  let wxjsdk = document.createElement('script');
  wxjsdk.src = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js';
  let h = document.getElementsByTagName('head')[0];
  h.appendChild(wxjsdk);
}

// 公共参数
let ajaxData = {
  'terminal': window.isApp ? 'APP' : 'H5',
  'reqTime': new Date().toUTCString(),
  'clientVersion': '4.0.0',
  'version': '1.0',
  // 'custId': window.isApp ? window.localStorage.CUSTID : (window.localStorage.CUSTID ? md5(window.localStorage.CUSTID) : ''),
  'custId': window.localStorage.CUSTID,
  'token': window.localStorage.TOKEN || '',
  'utm_source': sessionStorage.getItem('utm_source')
};

// 参数合并
function mergeData (data) {
  ajaxData.custId = window.localStorage.CUSTID;
  ajaxData.token = window.localStorage.TOKEN || '';
  let datas;
  if (!!data && typeof (data) === 'object') {
    datas = {...ajaxData, ...data};
  } else {
    datas = ajaxData;
  }
  return datas;
}

const weChatApi = {
  // 分享方法
  shareApp: function (jsonD, config) {
    var _config = (Object.prototype.toString.call(config) === '[object Object]') ? config : console.log('参数必须是对象！');

    // 分享到微信朋友圈
    var shareTimeD = {
      title: jsonD.desc,
      link: jsonD.link,
      imgUrl: jsonD.imgUrl,
      success: _config.success || function () { /* do nothing */ },
      cancel: _config.cancel || function () { /* do nothing */ }
    };

    // 分享到微信好友
    var shareAppMessageD = {
      title: jsonD.title,
      desc: jsonD.desc,
      link: jsonD.link,
      imgUrl: jsonD.imgUrl,
      type: 'link',
      dataUrl: '',
      success: _config.success || function () { /* do nothing */ },
      cancel: _config.cancel || function () { /* do nothing */ }
    };

    // 分享到QQ好友 & QQ空间
    var shareQqAndQzoned = {
      title: jsonD.title,
      desc: jsonD.desc,
      link: jsonD.link,
      imgUrl: jsonD.imgUrl,
      success: _config.success || function () { /* do nothing */ },
      cancel: _config.cancel || function () { /* do nothing */ }
    };

    if (_config.appid === undefined) {
      axios({
        method: 'post',
        url: '/front-gateway-web/getWeChatSign.app',
        data: 'data=' + encrypts(JSON.stringify(mergeData({
          url: window.location.href
        })))
      }).then(function (resp) {
        var objData = resp.data;
        if (objData.respCode == '000') {
          window.wx.config({
            debug: false,
            appId: objData.data.appId,
            timestamp: objData.data.timestamp,
            nonceStr: objData.data.nonceStr,
            signature: objData.data.signature,
            jsApiList: [
              'hideOptionMenu',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareWeibo',
              'onMenuShareQQ',
              'onMenuShareQZone',
              'showOptionMenu'
            ]
          });
          window.wx.ready(function (res) {
            try {
              window.wx.showOptionMenu();
              window.wx.onMenuShareTimeline(shareTimeD);
              window.wx.onMenuShareAppMessage(shareAppMessageD);
              window.wx.onMenuShareQQ(shareQqAndQzoned);
              window.wx.onMenuShareQZone(shareQqAndQzoned);
              window.wx.onMenuShareWeibo(shareQqAndQzoned);
            } catch (e) {
              alert('noShareData');
            }
          });
        }
      });
    } else {
      axios.get('/wechatgateweb/JsApiSignature.html', {
        params: {
          appid: _config.appid,
          url: escape(window.location.href),
          callback: ''
        }
      }).then(function (resp) {
        if (resp.status == 200) {
          let result = JSON.parse(resp.data.replace('(', '').replace(')', ''));
          window.wx.config({
            debug: false,
            appId: _config.appid,
            timestamp: result.timestamp,
            nonceStr: result.noncestr,
            signature: result.signature,
            jsApiList: [
              'hideOptionMenu',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareWeibo',
              'onMenuShareQQ',
              'onMenuShareQZone',
              'showOptionMenu'
            ]
          });
          window.wx.ready(function () {
            try {
              window.wx.showOptionMenu();
              window.wx.onMenuShareTimeline(shareTimeD);
              window.wx.onMenuShareAppMessage(shareAppMessageD);
              window.wx.onMenuShareQQ(shareQqAndQzoned);
              window.wx.onMenuShareQZone(shareQqAndQzoned);
              window.wx.onMenuShareWeibo(shareQqAndQzoned);
            } catch (e) {
              alert('noShareData');
            }
          });

          if (_config.callback && typeof _config.callback === 'function') {
            _config.callback();
          }
        }
      });
    };
  },
  wechatShare: function (shareId, link) {
    axios({
      method: 'post',
      url: '/front-gateway-web/shareFriends.app',
      data: 'data=' + encrypts(JSON.stringify(mergeData({
        shareId: shareId
      })))
    }).then(function (resp) {
      // console.log(resp);
      var _d = resp.data;
      if (_d.respCode == '000') {
        var jsonD = {
          'title': _d.data.shareTitle,
          'imgUrl': _d.data.twoCodeUrl,
          'link': link || _d.data.h5Url,
          'desc': _d.data.content
        };
        weChatApi.shareApp(jsonD, {});
      }
    });
  }
};
export default weChatApi;
