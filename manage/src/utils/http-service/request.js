import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import labels from '@/utils/labels'
import router from '@/router'

axios.defaults.headers['Content-Type'] = 'application/json'
let outTime = null

const loginOut = (error) => {
  const now = new Date().getTime()
  if (outTime && now - outTime < 3000) {
    outTime = now
    return Promise.reject(error)
  }
  outTime = now
  notification.error({
    message: '登录已失效',
    description: '当前账号已在另一台设备登录，请重新登录！',
    duration: 4
  })
  setTimeout(() => {
    router.push({ path: '/user/login' })
  }, 1500)
  return store.dispatch('Logout').then(() => {
    return Promise.reject(error)
    // setTimeout(() => {
    //   window.location.reload()
    // }, 1500)
  })
}

// 创建 axios 实例
const service = axios.create({
  // baseURL: 'https://yk.yunkeyizhan.com/truefull-manage-uat', // api base_url
  // baseURL: 'http://124.71.176.231/system-api', // api base_url
  // baseURL: 'http://192.168.0.113:9006', // api base_url
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 600000 // 请求超时时间ms
})

const err = (error) => {
  // console.log(error)
  if (error.response) {
    const data = error.response.data
    // const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '访问受限',
        description: data && data.message || labels.RESPONSE_RESULT_EXCEPTION
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin) || error.response.data && error.response.data.code === 401) {
      // notification.error({
      //   message: 'Unauthorized',
      //   description: 'Authorization verification failed'
      // })
      return loginOut(error)
      // if (token) {
        // store.dispatch('Logout').then(() => {
        //   setTimeout(() => {
        //     window.location.reload()
        //   }, 1500)
        // })
      // }
    }
    if (error.response.status === 404) {
      error.message = '请求接口不存在'
    }
    // 请求超时
    if (error.request.readyState === 4 && error.request.status === 0) {
      error.message = '请求超时'
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['X-Auth-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.code === 401) {
    // store.dispatch('Logout')
    // window.location.reload()
    return err({ response })
  }
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
