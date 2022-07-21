import Vue from 'vue'
// import { login, getInfo, resetPassword } from '@/api/login'
// import { login, getInfo, logout, resetPassword } from '@/api/login'
import { ACCESS_TOKEN, USER_ACCOUNT } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { $get, $post } from '@/utils/http-service'
import api from '@/api'

const user = {
  state: {
    name: '',
    info: {}
  },

  mutations: {
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      // return new Promise((resolve, reject) => {
      return $post({
        url: api.Login,
        data: userInfo,
        needResponse: true
      })
        .then(response => {
          if (response.code === 200) {
            const result = response.result
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            // resolve(resolve)
            return result
          } else {
            return Promise.reject(response.message)
          }
          // }).catch(error => {
          //   reject(error)
          // })
        })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        $get({ url: api.auth.getUserInfo })
          .then(response => {
            const result = response
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.loginName, welcome: welcome() })
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_TOKEN', '')
        commit('SET_INFO', {})
        commit('SET_NAME', { name: '', welcome: '' })
        const data = localStorage.getItem(USER_ACCOUNT)
        window.localStorage.clear()
        Vue.ls.remove(ACCESS_TOKEN)
        localStorage.setItem(USER_ACCOUNT, data)
        resolve()
      })
    },

    // 修改密码
    ResetPassword ({ commit }, data) {
      return new Promise((resolve, reject) => {
        // resetPassword(data)
          $post({
            url: api.auth.resetPwd,
            data,
            needResponse: true
          })
          .then(res => {
            commit('SET_TOKEN', '')
            commit('SET_NAME', { name: '', welcome: '' })
            Vue.ls.remove(ACCESS_TOKEN)
            if (res && res.code === 200) {
              resolve(res)
            } else {
              reject(res.message)
            }
        })
      })
    },
    // 修改智装信息
    ResetZhiZInfo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        // resetPassword(data)
          $post({
            url: api.auth.setZhiZInfo,
            data,
            needResponse: true
          }).then(res => {
            // commit('SET_MESSAGE',res)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 未读消息
    countIsHasRead({ commit }) {
      return new Promise((resolve, reject) => {
        $get({
          url: api.toDealWith.haveToDeal,
        })
          .then(res => {
            // commit('SET_MESSAGE',res)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 消息日志
    messageList({ commit },params) {
      return new Promise((resolve, reject) => {
        $get({
          url: api.messageList,
          params,
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}

export default user
