// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/http-service/request'
import VueUeditorWrap  from 'vue-ueditor-wrap'
import VueAMap from 'vue-amap'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'
import { Dialog } from '@/components'
import { commonGetCode,commonGetCodes } from '@/api/common'
import { defaultErrorMessage } from '@/utils/common'
import api from './api'
import * as http from './utils/http-service'

// import aMap from 'vue-amap'

import sysCode from './config/sysCode'

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
// Vue.use(VueAxios)
Vue.use(Dialog)
Vue.use(VueUeditorWrap)
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '1f753071fc185cf351ecc4ad223d624f',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.Geolocation',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geocoder',
    'AMap.CitySearch'
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
// 高德安全密钥
window._AMapSecurityConfig = {
  securityJsCode: '2e307ad943ff6d1a92d2fda18c9db8c2',
}
Vue.prototype.$getCodeList = function (type, func) {
  commonGetCode(type).then(res => {
    func(res.result)
  }).catch(err => defaultErrorMessage(err, '获取code失败'))
}

Vue.prototype.$getCodesList = function (type, func) {
  commonGetCodes(type).then(res => {
    func(res.result)
  }).catch(err => defaultErrorMessage(err, '获取codes失败'))
}

Vue.prototype.$myTrim = function (obj) {
  const newObj = {}
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      newObj[key] = obj[key].trim()
    } else {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

//统一systemsCode
Vue.prototype.$sysCode = sysCode
//
Vue.prototype.$api = api

// 请求封装
Vue.prototype.$axios = http.apiRequest
Vue.prototype.$get = http.$get
Vue.prototype.$post = http.$post
Vue.prototype.$put = http.$put
Vue.prototype.$delete = http.$delete

// 引入地图

// Vue.use(aMap)

// aMap.initAMapApiLoader({
//   key: '27c0152da52c16133e58b7bcec9efb26',
//   plugin: ['AMap.Geolocation', 'AMap.Geocoder']
// })

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
