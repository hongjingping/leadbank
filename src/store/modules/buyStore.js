import getters from '../getters.js';
import mutations from '../mutations.js';

export default {
  state: {
    // 银行卡信息
    'bankCardDetail': '',
    // 申购费率
    'rate': {
      // 折扣后
      'rateList': '0.00',
      // 折扣费率
      'disList': '0.00'
    },
    // 输入密码
    'showEnterPwd': false,
    // 红包列表
    'redPacketDetail': {
      'equityAmount': '',
      'days': '',
      'equityName': '',
      'model.rules_1': '',
      'model.rules_2': '',
      'model.rules_3': '',
      'equityNo': ''
    },
    // 实付金额
    'buyMon': '700'
  },
  getters: {
    bankCardDetail: getters.bankCardDetail,
    rate: getters.rate,
    showEnterPwd: getters.showEnterPwd,
    redPacketDetail: getters.redPacketDetail,
    buyMon: getters.buyMon
  },
  mutations: {
    UPDATE_BANKCARDDETAIL: mutations.UPDATE_BANKCARDDETAIL,
    UPDATE_RATE: mutations.UPDATE_RATE,
    UPDATE_SHOWENTERPWD: mutations.UPDATE_SHOWENTERPWD,
    UPDATE_REDPACKETDETAIL: mutations.UPDATE_REDPACKETDETAIL,
    UPDATE_BUYMON: mutations.UPDATE_BUYMON,
    UPDATE_BUYSTATE: mutations.UPDATE_BUYSTATE
  },
  actions: {

  }
};
