export default {
  // root store getters
  loadingFlag: state => state.loadingFlag,
  loadingName: state => state.loadingName,
  requestSate: state => state.requestSate,
  titleShowFlag: state => state.titleShowFlag,
  titleName: state => state.titleName,
  showBackButton: state => state.showBackButton,
  modal: state => state.modal,
  redPacketShow: state => state.redPacketShow,

  // product store getters
  netValueTabFalg: state => state.netValueTabFalg,
  dealRuleTabFlag: state => state.dealRuleTabFlag,
  noDataFlag: state => state.noDataFlag,
  dealRuleDetails: state => state.dealRuleDetails,

  // bindCardStore getters
  howStep: state => state.howStep,
  card: state => state.card,
  name: state => state.name,
  openAccountStauts: state => state.openAccountStauts,
  backHtml: state => state.backHtml,

  // buystore getters
  bankCardDetail: state => state.bankCardDetail,
  rate: state => state.rate,
  showEnterPwd: state => state.showEnterPwd,
  redPacketDetail: state => state.redPacketDetail,
  buyMon: state => state.buyMon
};
