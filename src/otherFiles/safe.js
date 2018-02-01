/* 前端预防DNS劫持和XSS攻击  旨在预防并不能完全解决 */

/* 防御劫持最好的方法还是从后端入手，前端能做的实在太少。而且由于源码的暴露，攻击者很容易绕过我们的防御手段。 */

// 安全域名 白名单
var safeDomainList = [
  'm.leadfund.com.cn',
  'prem.leadfund.com.cn',
  'testwww.leadfund.com.cn',
  'www.leadfund.com.cn',
  'www.leadbank.com.cn',
  'res.wx.qq.com',
  'hm.baidu.com',
  'chrome-extension',
  '10.1.',
  'wvjbscheme'
];

// 运营商重定向标志 黑名单
// var iframeHijackList = ['iframe_hijack_redirected'];

;(function () {
  // 当前window对象
  var self = window.self;
  // 窗口体系中的最顶层窗口的引用。
  var top = window.top;

  // 首先检测是否被运营商劫持将本网站套入iframe展示
  if (self !== top) {
    // iframe父级Url
    var parentUrl = document.referrer;
    // 检测是否被合法的iframe嵌套
    if (parentUrl) {
      for (var i = 0; i < safeDomainList.length; i++) {
        // 此域名合法
        if (parentUrl.indexOf(safeDomainList[i]) >= 0) {
          return;
        }
      }
    }

    // 获取我们自己的重定向标志
    var redirectFlag = window.location.href.indexOf('redirectFlag');
    // 如果已经存在我们储存的重定向标志，并且还处在iframe中  证明重定向失败。运营商重定向标志截取错误 此时便可以放弃治疗 把当前页面窗口内的URL上传服务器方便做分析
    if (redirectFlag > 0) {
      // 此处应该提供一个网页劫持日志上传接口
      return;
    }
    // 我们的正常页面
    var url = window.location.href;

    // 更改 URL 参数绕过运营商标记
    // for (var i = 0; i < iframeHijackList.length; i++) {
    //   if (url.indexOf(iframeHijackList[i]) > 0) {

    //   }

    // }

    // 父级页面重定向
    // 添加我们自己的重定向标志
    var urls = url.split('#');
    if (window.location.search) {
      urls[0] = urls[0] + '&redirectFlag=1';
    } else {
      urls[0] = urls[0] + '?redirectFlag=1';
    }
    url = urls.join('#');
    top.location = url;
  } else {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    // 检测非法脚本并移除 检测非法iframe并移除
    function checkScriptAndIframe (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if ((node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') && node.src) {
          var checkFlag = 0;
          for (var j = 0; j < safeDomainList.length; j++) {
            if (node.src.indexOf(safeDomainList[j]) >= 0) {
              checkFlag = 1;
              break;
            }
          }
          if (!checkFlag) {
            // 此处应将非法脚本提交到服务器
            node.parentNode.removeChild(node);
            console.log('非法脚本：' + node.src);
          }
        }
      }
    }

    if (MutationObserver) {
      // 该构造函数用来实例化一个新的 Mutation 观察者对象
      // Mutation 观察者对象能监听在某个范围内的 DOM 树变化
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          // 返回被添加的节点,或者为null.
          var nodes = mutation.addedNodes;
          checkScriptAndIframe(nodes);
        });
      });

        // 传入目标节点和观察选项
        // 如果 target 为 document 或者 document.documentElement
        // 则当前文档中所有的节点添加与删除操作都会被观察到
      observer.observe(document, {
        subtree: true,
        childList: true
      });

      // 五秒后停止观察
      setTimeout(function () {
        observer.disconnect();
      }, 5000);
    } else {
      var scripts = document.getElementsByTagName('script') || [];
      var iframes = document.getElementsByTagName('iframe') || [];
      checkScriptAndIframe(scripts);
      checkScriptAndIframe(iframes);
    }
  }
})();
