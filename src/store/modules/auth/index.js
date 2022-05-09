import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  state() {
    return {
      token: null,
      email: null,
      tokenExpirateAt: null,
      tokenCreateAt: null
    };
  },
  mutations,
  actions,
  getters
};