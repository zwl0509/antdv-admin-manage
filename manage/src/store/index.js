import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
// import permission from './modules/permission'

// dynamic router permission control (Experimental)
import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
    token: '',
    enabledList: [
      {
        value: 1,
        name: '是'
      },
      {
        value: 0,
        name: '否'
      }
    ],
    levelList: [
      {
        value: 1,
        name: '1'
      },
      {
        value: 2,
        name: '2'
      }
    ],
  },
  mutations: {
    SET_TOKEN (state, value) {
      state.token = value
    }
  },
  actions: {},
  getters
})
