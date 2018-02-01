import 'less/common.less';

import Vue from 'vue';
import App from './app.vue';
import router from 'router/router.js';
import store from 'store/index.js';
import {addInterceptors} from 'js/request.js';
import createMutual from 'js/jsCallNative.js';

// 创建一个环境监测标志
window.devFlag = window.location.origin.indexOf('10.1.') > -1 || window.location.origin.indexOf('test') > -1 ? 1 : 0;
// 判断是否在webview中
const ua = window.navigator.userAgent;
const chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
window.isWebview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);

// 是否是安卓机
window.isAndroid = window.navigator.userAgent.indexOf('Android') > -1 ? 1 : 0;
// 判断是否在利得APP中
window.isApp = window.navigator.userAgent.indexOf('leadbank|APP') > -1 ? 1 : 0;
// 判断是否在微信中
window.isWechat = window.navigator.userAgent.indexOf('MicroMessenger') > -1 ? 1 : 0;

// 如果是在APP中引入交互JS
if (window.isApp) {
  createMutual();
}

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 指令的定义
  update: function (el, binding) {
    if (binding.value) {
      el.focus();
    }
  }
});

export default new Vue({
  router,
  store,
  components: {
    App
  },
  data: {

  },
  beforeCreate () {
    // 开启axios拦截器
    addInterceptors(this);
  }
}).$mount('#app');
