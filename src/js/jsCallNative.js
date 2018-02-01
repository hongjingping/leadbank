import {getShareInfo} from 'js/request.js';

export default function createMutual () {
  function a (a) {
    if (window.WebViewJavascriptBridge) {
      return a(window.WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(a);
    }
    window.WVJBCallbacks = [a];
    var b = document.createElement('iframe');
    b.style.display = 'none';
    b.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(b);
    setTimeout(function () {
      document.documentElement.removeChild(b);
    }, 0);
  }

  function b (b) {
    if (f.match(/(iPhone|iPod|iPad);?/i)) {
      a(function (a) {
        a.callHandler('jsCallNative', b);
      });
    } else if (f.match(/android/i)) {
      var c = JSON.stringify(b);
      prompt(c);
    }
  }

  function c (a) {
    if (e.getJsontext && typeof e.getJsontext === 'function') {
      e.getJsontext(a);
      a.parameter.token ? e.loginStatus = 1 : e.loginStatus = 0;
    } else {
      e.getJsontext = function (a) {
        console.log(a);
      };
    }
  }
  function d (a) {
    e.jsCallNative({
      nativeName: 'common.page.open',
      parameter: {
        url: a
      }
    });
  }
  var e = {};
  e.loginStatus = 0;
  e.setTitle = function (a) {
    navigator.userAgent.match(/(iPhone|iPod|iPad);?/i) ? window.location.href = 'tianshengwocai://jstoapp.setTitle/' + a : navigator.userAgent.match(/android/i) && window.jstoapp.toTitle(a);
  };
  var f = navigator.userAgent;
  f.match(/(iPhone|iPod|iPad);?/i) && a(function (a) {
    a.registerHandler('nativeCallJS', c);
  });
  e.jsCallNative = b;
  e.nativeCallJS = c;
  e.setTitles = function (a) {
    e.jsCallNative({
      nativeName: 'common.webcontainer.title.set',
      parameter: {
        title: a
      }
    });
  };
  e.getToken = function () {
    e.jsCallNative({
      nativeName: 'account.login.status.get',
      parameter: {}
    });
  };
  e.openLogin = function () {
    d('leadbank://page.ld/account.login');
  };

  e.closeWebview = function () {
    e.jsCallNative({
      nativeName: 'common.webcontainer.close.return',
      parameter: {}
    });
  };

  e.openURL = d;
  window.mutual = e;

  // app中获取token custID的回调
  window.mutual.getJsontext = function (jsontext) {
    if (jsontext.callbackName == 'account.login.status.get.resp') {
      let token = jsontext.parameter.token;
      let ranking = jsontext.parameter.memberId;
      // app 未登录
      if (token === null || token == '' || token == "''" || token === 'null' || typeof token === 'undefined') {
        window.mutual.openLogin();
      } else {
        // 已登录
        window.localStorage.setItem('CUSTID', ranking);
        window.localStorage.setItem('TOKEN', token);
        window.location.reload();
      }
    }
  };
  // 开启app右上角分享按钮
  window.mutual.isOpenShare = function (shareId, shareInfo, isRightNavi = true) {
    function shareWithId (id) {
      window.mutual.jsCallNative({
        'nativeName': 'common.webcontainer.share',
        'parameter': {
          'isRightNavi': isRightNavi, // 是否开启右侧导航
          'shareId': id
        }
      });
    }

    function shareWithIfor ({title, content, url, imageUrl}) {
      window.mutual.jsCallNative({
        'nativeName': 'common.webcontainer.share',
        'parameter': {
          'isRightNavi': isRightNavi, // 是否开启右侧导航
          'shareId': '',
          'shareInfo': {
            'title': title, //  分享标题
            'content': content, // 分享内容
            'url': url, // 分享出去后跳转链接
            'imageUrl': imageUrl
          }
        }
      });
    }

    if (shareId != '' && typeof shareId !== 'undefined' && !shareInfo) {
      shareWithId(shareId);
    } else if (shareId == '' && typeof shareId == 'undefined' && shareInfo) {
      shareWithIfor(shareInfo);
    } else if (shareId != '' && typeof shareId !== 'undefined' && shareInfo) {
      if (shareInfo.title && shareInfo.content && shareInfo.url && shareInfo.imageUrl) {
        shareWithIfor(shareInfo);
      } else {
        getShareInfo({
          shareId: shareId
        }).then(function (resp) {
          var _d = resp.data;
          if (_d.respCode == '000') {
            var jsonD = {
              'title': _d.data.shareTitle,
              'imageUrl': _d.data.twoCodeUrl,
              'url': _d.data.h5Url,
              'content': _d.data.content
            };
            jsonD = {...jsonD, ...shareInfo};
            shareWithIfor(jsonD);
          }
        });
      }
    } else {
      console.log('请传入分享ID或者分享信息！！');
    }
  };

  // 开启app右上角字体大小调节按钮
  // window.mutual.isOpenFont = function (isFont) {
  //     // 开启字号按钮
  //     if (isFont != null) {
  //         window.mutual.jsCallNative({
  //             'nativeName': 'common.webcontainer.navigation.right',
  //             'parameter': {
  //                 "items": [
  //                     {
  //                         "type": "fontsize",
  //                         "userInfo": ""
  //                     }]
  //             }
  //         })
  //     }
  // }

  // 设置app右上角自定义按钮
  window.mutual.setNavRight = function (obj) {
    let defaultItem = {
      'type': 'custom',
      'style': 'text',
      'text': '完成',
      'userInfo': ''
    };
    let item = {...defaultItem, ...obj};

    window.mutual.jsCallNative({
      'nativeName': 'common.webcontainer.navigation.right',
      'parameter': {
        'items': [item]
      }
    });
  };
};
