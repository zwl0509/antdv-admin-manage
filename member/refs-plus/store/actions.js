
const actions = {
  // 获取用户信息
  getUserInfo ({ commit }, data) {

  },
  // 退出登录
  logout ({ commit }, data) {
    commit('$uStore', {
      name: 'vuex_user',
      value: {}
    })
    commit('$uStore', {
      name: 'vuex_login',
      value: false
    })
    commit('$uStore', {
      name: 'vuex_token',
      value: ''
    })
    uni.clearStorage()
    // 已登录过
    uni.setStorageSync('ISPRIVACY', true)
  }
}

export default actions
