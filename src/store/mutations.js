export default {
  // root store
  // ����loadingFlag��־
  UPDATE_LOADINGFLAG (state, flag) {
    state.loadingFlag = flag;
  },
  // ����loadingName
  UPDATE_LOADINGNAME (state, name) {
    state.loadingName = name;
  },
  // 更新requestSate状态
  UPDATE_REQUESTSATE (state, flag) {
    state.requestSate = flag;
  },
  // ����titleShowFlag��־
  UPDATE_TITLESHOWFLAG (state, flag) {
    state.titleShowFlag = flag;
  },
  // ����titleName
  UPDATE_TITLENAME (state, name) {
    state.titleName = name;
  },
  // ����showBackButton��־
  UPDATE_SHOWBACKBUTTON (state, flag) {
    state.showBackButton = flag;
  },
  // ����redPacketShow��־
  UPDATE_REDPACKETSHOW (state, flag) {
    state.redPacketShow = flag;
  },
  // ����modal����
  UPDATE_MODAL (state, data) {
    state.modal = data;
  },
  // state����ͨ�÷���
  UPDATE_ROOTSTATE (state, payload) {
    if (typeof (payload) === 'object' && payload.length) {
      for (let i in payload) {
        if (typeof (payload[i].data) === 'object' && payload[i].data !== null) {
          state[payload[i].stateName] = {...state[payload[i].stateName], ...payload[i].data};
        } else {
          state[payload[i].stateName] = payload[i].data;
        }
      }
    } else {
      if (typeof (payload.data) === 'object' && payload.data !== null) {
        state[payload.stateName] = {...state[payload.stateName], ...payload.data};
      } else {
        state[payload.stateName] = payload.data;
      }
    }
  },

  // product store
  // ����netValueTabFalg��־
  UPDATE_NETVALUETABFALG (state, flag) {
    state.netValueTabFalg = flag;
  },
  // ����dealRuleTabFlag��־
  UPDATE_DEALRULETABFLAG (state, flag) {
    state.dealRuleTabFlag = flag;
  },
  // ����noDataFlag��־
  UPDATE_NODATAFLAG (state, flag) {
    state.noDataFlag = flag;
  },
  // ����dealRuleDetails����
  UPDATE_DEALRULEDETAILS (state, data) {
    state.dealRuleDetails = data;
  },
  // state����ͨ�÷���
  UPDATE_FUNDMSGSTATE (state, payload) {
    if (typeof (payload) === 'object' && payload.length) {
      for (let i in payload) {
        if (typeof (payload[i].data) === 'object' && payload[i].data !== null) {
          state[payload[i].stateName] = {...state[payload[i].stateName], ...payload[i].data};
        } else {
          state[payload[i].stateName] = payload[i].data;
        }
      }
    } else {
      if (typeof (payload.data) === 'object' && payload.data !== null) {
        state[payload.stateName] = {...state[payload.stateName], ...payload.data};
      } else {
        state[payload.stateName] = payload.data;
      }
    }
  },

  // bindCard store
  // ����howStep
  UPDATE_HOWSTEP (state, step) {
    state.howStep = step;
  },
  // ����card
  UPDATE_CARD (state, card) {
    state.card = card;
  },
  // ����name
  UPDATE_NAME (state, name) {
    state.name = name;
  },
  // ����openAccountStauts
  UPDATE_OPENACCOUNTSTAUTS (state, flag) {
    state.openAccountStauts = flag;
  },
  // ����dealRuleDetails����
  UPDATE_BACkHTML (state, data) {
    state.backHtml = data;
  },
  // state����ͨ�÷���
  UPDATE_BINDCARDSTATE (state, payload) {
    if (typeof (payload) === 'object' && payload.length) {
      for (let i in payload) {
        if (typeof (payload[i].data) === 'object' && payload[i].data !== null) {
          state[payload[i].stateName] = {...state[payload[i].stateName], ...payload[i].data};
        } else {
          state[payload[i].stateName] = payload[i].data;
        }
      }
    } else {
      if (typeof (payload.data) === 'object' && payload.data !== null) {
        state[payload.stateName] = {...state[payload.stateName], ...payload.data};
      } else {
        state[payload.stateName] = payload.data;
      }
    }
  },

  // buy store
  // ����bankCardDetail
  UPDATE_BANKCARDDETAIL (state, data) {
    state.bankCardDetail = data;
  },
  // ����rate
  UPDATE_RATE (state, data) {
    state.rate = data;
  },
  // ����showEnterPwd
  UPDATE_SHOWENTERPWD (state, flag) {
    state.showEnterPwd = flag;
  },
  // ����redPacketDetail
  UPDATE_REDPACKETDETAIL (state, data) {
    state.redPacketDetail = data;
  },
  // ����buyMon
  UPDATE_BUYMON (state, data) {
    state.buyMon = data;
  },
  // state����ͨ�÷���
  UPDATE_BUYSTATE (state, payload) {
    if (typeof (payload) === 'object' && payload.length) {
      for (let i in payload) {
        if (typeof (payload[i].data) === 'object' && payload[i].data !== null) {
          state[payload[i].stateName] = {...state[payload[i].stateName], ...payload[i].data};
        } else {
          state[payload[i].stateName] = payload[i].data;
        }
      }
    } else {
      if (typeof (payload.data) === 'object' && payload.data !== null) {
        state[payload.stateName] = {...state[payload.stateName], ...payload.data};
      } else {
        state[payload.stateName] = payload.data;
      }
    }
  }
};
