import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

const vuexPersist = new VuexPersist({
  key: 'owli-chat',
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: null
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('setToken', null)
        commit('setUser', null)
        resolve()
      })
    }
  },
  plugins: [vuexPersist.plugin]
})
