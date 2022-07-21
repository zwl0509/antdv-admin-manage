import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {
  }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function PhoneCheck (value) {
  return new Promise((resolve, reject) => {
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
    if (!reg.test(value)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('请输入正确的手机号码')
    }
    resolve()
  })
}

// 判断arr是否为一个数组，返回一个bool值
function isArray (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

// 深度克隆
export function deepClone (obj) {
  // 对常见的“非”值，直接返回原来值
  if([null, undefined, NaN, false].includes(obj)) return obj
  if(typeof obj !== 'object' && typeof obj !== 'function') {
    //原始类型直接返回
    return obj
  }
  const o = isArray(obj) ? [] : {}
  for(const i in obj) {
    if(obj.hasOwnProperty(i)){
      o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
    }
  }
  return o
}


export function download (params) {
  return new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest()
    // console.log(process.env.VUE_APP_API_BASE_URL + params.url)
    xhr.open(params.method || 'GET', process.env.VUE_APP_API_BASE_URL + params.url)
    if (params.responseType === undefined) xhr.responseType = 'blob'
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*/*')
    xhr.setRequestHeader('X-Auth-Token', Vue.ls.get(ACCESS_TOKEN))
    xhr.onload = function() {
      const result = xhr.response
      // console.log(xhr)
      const elink = document.createElement('a')
      elink.download = params.fileName || ''
      elink.style.display = 'none'
      const blob = new Blob([result])
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      document.body.removeChild(elink)
      resolve()
    }
    xhr.onerror = function() {
      reject(xhr.response)
    }
    xhr.send()
  })
}
