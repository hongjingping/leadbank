import Vue from 'vue';
import store from 'store/index.js';
import Router from 'vue-router';

import resume from 'components/resume.vue';

import profitList from 'components/productModule/profitList.vue';
import netWorth from 'components/productModule/netWorth.vue';
import netValue from 'components/productModule/netValue.vue';
import announcementPage from 'components/productModule/announcement.vue';
import dealRule from 'components/productModule/dealRule.vue';
import buyRulePage from 'components/productModule/buyRulePage.vue';
import saleRulePage from 'components/productModule/saleRulePage.vue';
import protocol from 'components/openAccountStep/protocol.vue';
import openAccountStep1 from 'components/openAccountStep/openAccountInformation.vue';
import openAccountStep2 from 'components/openAccountStep/openAccountPassword.vue';
import openAccountStep5 from 'components/openAccountStep/openAccountResult.vue';
import riskTestPage from 'components/riskTest.vue';
import riskResultPage from 'components/riskResult.vue';
import openAccountStep4 from 'components/openAccountStep/openAccountConfirm.vue';
import login from 'components/login.vue';
import openAccountStep3 from 'components/openAccountStep/openAccountBindCard.vue';
import OpenAccountPage from 'components/openAccount.vue';
import informationResult from 'components/informationResult.vue';
import diagnosisSearch from 'components/diagnosisSearch.vue';

const productDetails = () => import('components/productDetails.vue');
const buyFundPage = () => import('components/buyFund.vue');
const buyFundAffirmPage = () => import('components/buyFundAffirm.vue');
const tradingDetailPage = () => import('components/tradingDetail.vue');
const information = () => import('components/information.vue');
const search = () => import('components/search.vue');
const fundRanking = () => import('components/fundRanking.vue');
const diagnosisDetail = () => import('components/diagnosisDetail.vue');
const fundConsultingRoom = () => import('components/fundConsultingRoom.vue');
Vue.use(Router);

/** meta中公共参数说明
 * title 必须 头部名称 String
 * titleShowFlag 是否显示title 非必传 默认显示title  0 不显示  1 显示
 * showBackButton 是否显示头部返回按钮  非必传 默认显示  0 不显示  1 显示
 * noRequest  标注当前页面是否有请求 用来控制首次访问无请求页面时的loading时间 非必传 0 有请求 1 无请求  注：页面无请求时请一定填写，不然页面会一直处于loading状态
 * loadingName 进入当前页面前的loading组件名称  非必传 默认通用loading  loading 通用loading名称  diagnosisLoad 基金诊断独用loading名称
 * loadingTimes 是否每次进入当前路由页面都打开全屏loading  非必传  默认'once'  应用首次加载时显示  'all' 每次进入当前页面都显示
 * specialLoading 是否是需要特殊处理的loadng动画 非必传 默认0 非特殊  1需要特殊处理  注：如果需要特殊处理则需要另一个参数 specialLoadingTime来控制loading的时间
 * specialLoadingTime 控制需要特殊处理的loading的时间 非必传 单位ms 默认500  注：开启specialLoading时有效
 */
const vueRouter = new Router({
  routes: [
    {
      path: '',
      name: '/resume',
      redirect: 'resume'
    },
    {
      path: '/resume',
      component: resume,
      meta: {
        title: 'resume',
        noRequest: 1,
      }
    },
    // {
    //   path: '',
    //   name: '',
    //   redirect: 'productDetails'
    // },
    // {
    //   path: '/productDetails',
    //   component: productDetails,
    //   meta: {
    //     title: '基金详情'
    //   }
    // },
    {
      path: '/netValue',
      component: netValue,
      meta: {
        title: '净值和分红'
      },
      children: [
        {
          path: '/netValue/',
          component: netWorth,
          name: 'netWorth',
          meta: {
            title: '净值和分红',
            tab: 1
          }
        },
        {
          path: '/netValue/profitList',
          component: profitList,
          name: 'profitList',
          meta: {
            title: '净值和分红',
            tab: 2
          }
        }
      ]
    },
    {
      path: '/dealRule',
      component: dealRule,
      meta: {
        title: '交易规则'
      },
      children: [
        {
          path: '/dealRule',
          component: buyRulePage,
          name: 'buyRulePage',
          meta: {
            title: '交易规则',
            tab: 1
          }
        },
        {
          path: '/dealRule/salePage',
          component: saleRulePage,
          name: 'saleRulePage',
          meta: {
            title: '交易规则',
            tab: 2
          }
        }
      ]
    },
    {
      path: '/announcement',
      component: announcementPage,
      meta: {
        title: '基金公告'
      }
    },
    {
      path: '/openAccount',
      component: OpenAccountPage,
      meta: {
        title: '开户'
      },
      children: [
        {
          path: '',
          component: openAccountStep1,
          meta: {
            title: '开户',
            step: 1
          }
        },
        {
          path: 'openAccountPassword',
          component: openAccountStep2,
          meta: {
            title: '开户',
            step: 2
          }
        },
        {
          path: 'openAccountBindCard',
          component: openAccountStep3,
          meta: {
            title: '',
            step: 3
          }
        },
        {
          path: 'openAccountConfirm',
          component: openAccountStep4,
          meta: {
            title: '',
            step: 3
          }
        },
        {
          path: 'openAccountResult',
          component: openAccountStep5,
          meta: {
            title: '',
            step: 6
          }
        }
      ]
    },
    {
      path: '/protocol',
      component: protocol,
      meta: {
        title: '协议',
        noRequest: 1
      }
    },
    {
      path: '/login',
      component: login,
      meta: {
        title: '登录',
        titleShowFlag: 0,
        noRequest: 1
      }
    },
    {
      path: '/buyFund',
      name: 'buyFund',
      component: buyFundPage,
      meta: {
        title: '购买'
      }
    },
    {
      path: '/buyFundAffirm',
      name: 'buyFundAffirm',
      component: buyFundAffirmPage,
      meta: {
        title: '购买'
      }
    },
    {
      path: '',
      name: 'tradingDetail',
      component: tradingDetailPage,
      meta: {
        title: '购买'
      },
      children: [{
        path: '/tradingDetail',
        component: tradingDetailPage,
        meta: {
          title: '交易详情'
        }
      }]
    },
    {
      path: '/riskTest',
      name: 'riskTest',
      component: riskTestPage,
      meta: {
        title: '风险测评'
      }
    },
    {
      path: '/riskResult',
      name: 'riskResult',
      component: riskResultPage,
      meta: {
        title: '风险测评'
      }
    },
    {
      path: '/information',
      name: 'information',
      component: information,
      meta: {
        title: '投资者测评'
      }
    },
    {
      path: '/informationResult',
      name: 'informationResult',
      component: informationResult,
      meta: {
        title: '结果',
        noRequest: 1
      }
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      meta: {
        title: '搜索',
        noRequest: 1
      }
    },
    {
      path: '/fundRanking',
      name: 'fundRanking',
      component: fundRanking,
      meta: {
        title: '好基排行'
      }
    },
    {
      path: '/diagnosisDetail',
      name: 'diagnosisDetail',
      component: diagnosisDetail,
      meta: {
        title: '基诊室',
        loadingName: 'diagnosisLoad',
        loadingTimes: 'all',
        specialLoading: 1,
        specialLoadingTime: 2000
      }
    },
    {
      path: '/diagnosisSearch',
      name: 'diagnosisSearch',
      component: diagnosisSearch,
      meta: {
        title: '基诊室',
        noRequest: 1
      }
    },
    {
      path: '/fundConsultingRoom',
      name: 'fundConsultingRoom',
      component: fundConsultingRoom,
      meta: {
        title: '基诊室',
        noRequest: 1,
        loadingName: 'diagnosisLoad',
        loadingTimes: 'all',
        specialLoading: 1,
        specialLoadingTime: 2000
      }
    }
  ]
});

// 全局前置守卫
vueRouter.beforeEach((to, from, next) => {
  // 手动将路由页面推送给百度统计
  if (window._hmt) {
    window._hmt.push([
      '_trackPageview',
      to.fullPath
    ]);
  }

  next();
});

// vue-router全局守卫 导航被确认之前
// 拦截路由做一些事情
vueRouter.beforeResolve(function (to, from, next) {
  // 设置页面title
  document.title = to.meta.title || '利得基金';
  // app中设置title
  if (window.isApp) {
    let titleName = to.meta.title || '利得基金';
    window.mutual.setTitles(titleName);
  }
  /** 判断是否需要title */
  if (window.isWebview || window.isApp || window.isWechat || (typeof (to.meta.titleShowFlag) === 'number' && to.meta.titleShowFlag == 0)) {
    store.commit('UPDATE_TITLESHOWFLAG', 0);
  } else {
    if (to.meta.title && to.meta.title != '') {
      store.commit('UPDATE_TITLENAME', to.meta.title);
    }

    if (typeof (to.meta.showBackButton) === 'number') {
      store.commit('UPDATE_SHOWBACKBUTTON', to.meta.showBackButton);
    } else {
      store.commit('UPDATE_SHOWBACKBUTTON', 1);
    }

    store.commit('UPDATE_TITLESHOWFLAG', 1);
  }

  // 页面加载需要的loading动画
  if (to.meta.loadingName && typeof (to.meta.loadingName) === 'string') {
    store.commit('UPDATE_LOADINGNAME', to.meta.loadingName);
  } else {
    store.commit('UPDATE_LOADINGNAME', 'loading');
  }

  // 进入页面前是否需要全屏loading
  if (to.meta.loadingTimes === 'all' && !to.meta.specialLoading) {
    store.commit('UPDATE_LOADINGFLAG', 1);
  }

  // 检查页面DOM
  let oldEles = document.getElementsByTagName('*').length;
  let finalEles;
  let checkPageLoad = function () {
    setTimeout(function () {
      finalEles = document.getElementsByTagName('*').length;
      if (finalEles === oldEles) {
        store.commit('UPDATE_LOADINGFLAG', 0);
      } else {
        oldEles = finalEles;
        checkPageLoad();
      }
    }, 300);
  };

  // 首次加载应用时的Loading时间
  if (to.meta.noRequest && !to.meta.specialLoading) {
    checkPageLoad();
  }

  // 是否是需要特殊处理的loadng动画
  if (to.meta.specialLoading) {
    let delayTime = to.meta.specialLoadingTime >= 0 ? to.meta.specialLoadingTime : 500;
    store.commit('UPDATE_LOADINGFLAG', 3);
    setTimeout(function () {
      // 查看当前页面请求是否结束
      if (store.getters.requestSate === 0) {
        checkPageLoad();
      } else {
        store.commit('UPDATE_LOADINGFLAG', 1);
      }
    }, delayTime);
  }

  next();
});

export default vueRouter;
