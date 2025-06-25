// store/auth.js
import authService from '@/services/auth'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_REFRESH_TOKEN(state, refreshToken) {
      state.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.refreshToken = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const { data } = await authService.login(credentials.email, credentials.password)
        commit('SET_TOKEN', data.session.accessToken)
        commit('SET_REFRESH_TOKEN', data.session.refreshToken)
        commit('SET_USER', data.user)
        return true
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },
    async refreshToken({ commit, state }) {
      try {
        const { data } = await authService.refresh(state.refreshToken)
        commit('SET_TOKEN', data.session.accessToken)
        commit('SET_REFRESH_TOKEN', data.session.refreshToken)
        return data.accessToken
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },
    async logout({ commit }) {
      try {
        await authService.logout()
      } catch (e) {
        commit('CLEAR_AUTH')
        console.log('Erro ao chamar logout na API', e)
      } finally {
        commit('CLEAR_AUTH')
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user
  }
})
