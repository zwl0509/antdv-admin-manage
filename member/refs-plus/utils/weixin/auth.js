const AuthService = {
  AUTH: 'oauth',
  SHARE: 'share',
  PAYMENT: 'payment',
  PUSH: 'push'
}

const constants = {
  WX: 'weixin',
  ALI_PAY: 'alipay',
  WX_PAY: 'wxpay'
}

const getProvider = (service = AuthService.AUTH) => {
  return new Promise((resolve, reject) => {
    uni.getProvider({
      service,
      success: resolve,
      fail: reject
    })
  })
}

const providerLogin = (provider = '') => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider,
      success: resolve,
      fail: reject
    })
  })
}

/**
 *  获取第三方用户信息
 * @param provider
 * @returns {Promise<unknown>}
 */
const providerGetUserInfo = (provider = '') => {
  return new Promise((resolve, reject) => {
    uni.getUserInfo({
      provider,
      lang: 'zh_CN',
      timeout: 18000,
      success: resolve,
      fail: reject
    })
  })
}

export const wxProviderLogin = () => {
  return providerLogin(constants.WX)
}

export const wxGetUserInfo = () => {
  return providerGetUserInfo(constants.WX)
}
