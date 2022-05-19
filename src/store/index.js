import Vue from 'vue'
import Vuex from 'vuex'

import authModule from './modules/auth/index.js';
import userModule from './modules/user/index.js';
import categoryModule from './modules/category/index.js';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth: authModule,
    user: userModule,
    category: categoryModule
  }
})
