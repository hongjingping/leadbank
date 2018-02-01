import getters from '../getters.js';
import mutations from '../mutations.js';

export default {
  state: {
    howStep: 1,
    card: '',
    name: '',
    openAccountStauts: '',
    backHtml: ''
  },
  getters: {
    howStep: getters.howStep,
    card: getters.card,
    name: getters.name,
    openAccountStauts: getters.openAccountStauts,
    backHtml: getters.backHtml
  },
  mutations: {
    UPDATE_HOWSTEP: mutations.UPDATE_HOWSTEP,
    UPDATE_CARD: mutations.UPDATE_CARD,
    UPDATE_NAME: mutations.UPDATE_NAME,
    UPDATE_OPENACCOUNTSTAUTS: mutations.UPDATE_OPENACCOUNTSTAUTS,
    UPDATE_BACkHTML: mutations.UPDATE_BACkHTML,
    UPDATE_BINDCARDSTATE: mutations.UPDATE_BINDCARDSTATE
  },
  actions: {

  }
};
