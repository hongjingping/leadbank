import axios from 'axios';
// import md5 from 'md5';
import encrypts from 'lib/RSA.js';
import store from 'store/index.js';
import {GetQueryString, toast} from 'js/api.js';

// ajax请求
axios.defaults.baseURL = window.location.origin;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 添加拦截器
export function addInterceptors (vm) {
  // 添加发送拦截 打开loading
  axios.interceptors.request.use(function (config) {
    window.devFlag && console.log(config.data);

    // 请求开始
    store.commit('UPDATE_REQUESTSATE', 1);

    if (store.getters.loadingFlag == 0) {
      // 请求前将loading动画重置为通用loading组件
      store.commit('UPDATE_LOADINGNAME', 'loading');
      store.commit('UPDATE_LOADINGFLAG', 2);
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  // 添加响应拦截器 关闭loading
  axios.interceptors.response.use(function (response) {
    // 请求结束
    store.commit('UPDATE_REQUESTSATE', 0);

    if (response.data.respCode == '777' || response.data.respMessage == '未登录') {
      if (window.isApp) {
        window.mutual.getToken();
      } else {
        vm.$router.push('/login');
      }
    }
    if (store.getters.loadingFlag !== 3) {
      vm.$nextTick(function () {
        store.commit('UPDATE_LOADINGFLAG', 0);
      });
    }
    return Promise.resolve(response);
  }, function (error) {
    // 请求结束
    store.commit('UPDATE_REQUESTSATE', 0);

    vm.$nextTick(function () {
      store.commit('UPDATE_LOADINGFLAG', 0);
    });
    toast(error);
    return Promise.reject(error);
  });
}

// 存储用户来源
if (GetQueryString('utm_source')) {
  sessionStorage.setItem('utm_source', GetQueryString('utm_source'));
}

// 请求json数据的 动态添加时间戳
const cacheTime = function () {
  let nowDate = new Date();
  let getTime;
  getTime = '' + nowDate.getFullYear() + (nowDate.getMonth() + 1) + nowDate.getDate();
  return getTime;
};


// 参数合并
function mergeData (data) {
  let ajaxData = {
    'terminal': window.isApp ?'APP' : 'H5',
    'reqTime': new Date().toUTCString(),
    'clientVersion': '4.0.0',
    'version': '1.0',
    // 'custId': window.isApp ? window.localStorage.CUSTID : (window.localStorage.CUSTID ? md5(window.localStorage.CUSTID) : ''),
    'custId': window.localStorage.CUSTID,
    'token': window.localStorage.TOKEN || '',
    'utm_source': sessionStorage.getItem('utm_source')
  };

  let datas;
  if (!!data && typeof (data) === 'object') {
    datas = {...ajaxData, ...data};
  } else {
    datas = ajaxData;
  }
  return datas;
}

// 公共请求方法
const request = function ({
  method = 'post',
  url,
  data = {},
  params = {},
  headers
}, encryptsFlag = 1) {
  if (method === 'post') {
    window.devFlag && console.log(mergeData(data));
    if (encryptsFlag) {
      return axios({
        method,
        url,
        data: 'data=' + encrypts(JSON.stringify(mergeData(data)))
      });
    } else {
      return axios({
        method,
        url,
        data: 'data=' + JSON.stringify(mergeData(data))
      });
    }
  } else {
    window.devFlag && console.log(mergeData(params));
    return axios({
      method,
      url,
      params: mergeData(params)
    });
  }
};

// 通过分享ID获取分享信息
export const getShareInfo = data => request({
  url: '/front-gateway-web/shareFriends.app',
  data: data
});

// 判断是否登录
export const checkLoginState = data => request({
  url: '/front-gateway-web/checkLoginState.app',
  data: data
});

// 基金详情
export const getFundDetails = data => request({
  url: '/front-gateway-web/fundPageInfo.app',
  data: data
});

// 历史净值列表
export const getnetValues = data => request({
  url: '/front-gateway-web/qryFundHisRanking.app',
  data: data
});

// 分红配送
export const qryFundDividends = data => request({
  url: '/front-gateway-web/qryFundDividends.app',
  data: data
});

// 交易规则
export const qryFundRate = data => request({
  url: '/front-gateway-web/qryFundRate.app',
  data: data
});

// 公告列表
export const getAnnouncementList = data => request({
  url: '/front-gateway-web/qryFundNoticeList.app',
  data: data
});

// 开户start
// 城市列表
export const cityList = data => request({
  url: '/front-gateway-web/qryAreaList.app',
  data: data
});

// 输入银行卡号带入卡号信息
export const showBankInformation = data => request({
  url: '/front-gateway-web/qryCardBin.app',
  data: data
});

// 查询银行卡所有列表
export const allBankList = data => request({
  url: '/front-gateway-web/qryBankCardList.app',
  data: data
});

// 开户验证
export const openAccountVerification = data => request({
  url: '/front-gateway-web/openAccount.app',
  data: data
});

// 获取用户基金信息
export const getUserInformation = data => request({
  url: '/front-gateway-web/qryCustInfo.app',
  data: data
});

// 开户发送短信
export const openAccountMessage = data => request({
  url: '/front-gateway-web/openConfirmSms.app',
  data: data
});

// 开户确认
export const openAccountConfirm = data => request({
  url: '/front-gateway-web/openConfirm.app',
  data: data
});

// 开户结果轮询
export const openAccountSucess = data => request({
  url: '/front-gateway-web/queryOpenAccInfo.app',
  data: data
});
// 开户end

// 购买流程---start
// 购买基金页面
export const buyDetailFund = data => request({
  url: '/front-gateway-web/buyDetailFund.app',
  data: data
});

// 查询购买基金交易费率
export const qryBuyFundRate = data => request({
  url: '/front-gateway-web/qryBuyFundRate.app',
  data: data
});

// 购买权限验证(1220新增加)
export const buyPermissionsValidation = data => request({
  url: '/front-gateway-web/buyPermissionsValidation.app',
  data: data
});

// 查询是否有红包
export const queryBuyEquityCount = data => request({
  url: '/front-gateway-web/queryBuyEquityCount.app',
  data: data
});

// 购买基金
export const purchaseFund = data => request({
  url: '/front-gateway-web/purchaseFund.app',
  data: data
});

// 购买基金结果查询
export const qryFundOrd = data => request({
  url: '/front-gateway-web/qryFundOrd.app',
  data: data
});

// 用户使用权益查询
export const queryEquityMax = data => request({
  url: '/front-gateway-web/queryEquityMax.app',
  data: data
});

// 红包列表
export const queryWorkEquityFlagList = data => request({
  url: '/front-gateway-web/queryWorkEquityFlagList.app',
  data: data
});

// 基金交易详情
export const fundNewTradeDetail = data => request({
  url: '/front-gateway-web/fundNewTradeDetail.app',
  data: data
});

// 购买流程---end

// 登录start
// 获取登录短信验证码
export const getLoginCode = data => request({
  url: '/front-gateway-web/sendMemSMS.app',
  data: data
});

// 快速登录验证
export const loginVerification = data => request({
  url: '/front-gateway-web/quickLogin.app',
  data: data
});

// 注册,绑卡协议
export const allProtocol = data => request({
  url: '/front-gateway-web/queryAgreementList.app',
  data: data
});

// 实时估值图表
export const queryActuTimeAssess = data => request({
  url: '/cms-gateway/queryActuTimeAssess.app',
  data: data
});

// 收益曲线
export const qryFundTraChart = data => request({
  url: '/front-gateway-web/qryFundTraChart.app',
  data: data
});

// 信息采集风险测评题库
export const qryTestQuestions = data => request({
  url: '/front-gateway-web/qryTestQuestions.app',
  data: data
});

// 投资者测评提交
export const riskQstnAnsECreate = data => request({
  url: '/front-gateway-web/riskQstnAnsECreate.app',
  data: data
});

// 风险测评结果
export const queryRiskRecord = data => request({
  url: '/front-gateway-web/riskLevelEQuery.app',
  data: data
});

// 基金诊断开始
// 热搜基金
export const hotFund = data => request({
  url: '/front-gateway-web/qryRecommendFund.app',
  data: data
});

// 基金搜索
export const searchFund = data => request({
  url: '/front-gateway-web/fundSearch.app',
  data: data
});

// 智能诊断
export const diagnosisSearch = data => request({
  method: 'get',
  url: '/appjson/intelligent_diagnosis.json?',
  params: {
    date: cacheTime()
  }
});

// 诊断详情
export const diagnosisDetail = (data, code) => request({
  method: 'get',
  url: '/appjson/funddiagnose/fundDiagnose_' + code + '.json?',
  params: {
    date: cacheTime()
  }
});

// 基金诊断排行榜
export const fundDiagnoseRank = data => request({
  url: '/cms-gateway/rw_fundDiagnoseRank.app',
  // url : 'https://easy-mock.com/mock/5a5dad5d4867c704e5c50fcb/diagnosis/rankList',
  data: data
});

// 广告位
export const advertising = (data, code) => request({
  method: 'get',
  url: '/appjson/diagnose_detail.json?',
  params: {
    date: cacheTime()
  }
});
// 基金诊断结束
