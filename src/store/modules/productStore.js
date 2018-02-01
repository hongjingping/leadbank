import getters from '../getters.js';
import mutations from '../mutations.js';

export default {
  state: {
    netValueTabFalg: 1,
    dealRuleTabFlag: 1,
    noDataFlag: false,
    dealRuleDetails: ''
  },
  getters: {
    netValueTabFalg: getters.netValueTabFalg,
    dealRuleTabFlag: getters.dealRuleTabFlag,
    noDataFlag: getters.noDataFlag,
    dealRuleDetails: getters.dealRuleDetails
  },
  mutations: {
    UPDATE_NETVALUETABFALG: mutations.UPDATE_NETVALUETABFALG,
    UPDATE_DEALRULETABFLAG: mutations.UPDATE_DEALRULETABFLAG,
    UPDATE_NODATAFLAG: mutations.UPDATE_NODATAFLAG,
    UPDATE_DEALRULEDETAILS: mutations.UPDATE_DEALRULEDETAILS
  },
  actions: {

  }
};
