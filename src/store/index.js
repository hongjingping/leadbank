import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters.js';
import mutations from './mutations.js';
import bindCard from 'store/modules/bindCardStore.js';
import buy from 'store/modules/buyStore.js';
import login from 'store/modules/loginStore.js';
import product from 'store/modules/productStore.js';
import risk from 'store/modules/riskStore.js';

Vue.use(Vuex);
// store对象
export default new Vuex.Store({
  state: {
    /** loadingFlag
    * -1 隐藏loading不显示调取接口也不显示
    *  0 隐藏loading
    *  1 首次加载的loading
    *  2 axios控制请求loadingFlag
    *  3 手动开启关闭loading
    */
    loadingFlag: 1,
    // loading组件的名称  loading 通用公共loading名称  diagnosisLoad 基金诊断独用loading名称
    loadingName: 'loading',
    // 公共请求状态 0 请求完成 1 请求中
    requestSate: 0,
    titleShowFlag: 1,
    titleName: '',
    showBackButton: 1,
    modal: {
      'modalShow': false,
      'title': '',
      'btnLeft': '',
      'btnRight': '',
      'modelText': ''
    },
    redPacketShow: false
  },
  getters: {
    loadingFlag: getters.loadingFlag,
    loadingName: getters.loadingName,
    requestSate: getters.requestSate,
    titleShowFlag: getters.titleShowFlag,
    titleName: getters.titleName,
    showBackButton: getters.showBackButton,
    modal: getters.modal,
    redPacketShow: getters.redPacketShow
  },
  mutations: {
    UPDATE_LOADINGFLAG: mutations.UPDATE_LOADINGFLAG,
    UPDATE_LOADINGNAME: mutations.UPDATE_LOADINGNAME,
    UPDATE_REQUESTSATE: mutations.UPDATE_REQUESTSATE,
    UPDATE_TITLESHOWFLAG: mutations.UPDATE_TITLESHOWFLAG,
    UPDATE_TITLENAME: mutations.UPDATE_TITLENAME,
    UPDATE_SHOWBACKBUTTON: mutations.UPDATE_SHOWBACKBUTTON,
    UPDATE_REDPACKETSHOW: mutations.UPDATE_REDPACKETSHOW,
    UPDATE_MODAL: mutations.UPDATE_MODAL,
    UPDATE_ROOTSTATE: mutations.UPDATE_ROOTSTATE
  },
  actions: {

  },
  modules: {
    bindCard,
    buy,
    login,
    product,
    risk
  }
});
