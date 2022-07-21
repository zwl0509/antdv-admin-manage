import api from '@/api'
import { axios } from './request'
/**
 *  将请求url中的{key} 自动替换为数据值，obj.params.option | obj.params.key
 * @param params
 * @return {string}
 */
export const urlReplace = function (params = '') {
  const pre = params.url.indexOf('{')
  if (pre < 0) {
    return params
  }
  const aft = params.url.indexOf('}')
  const key = params.url.substring(pre + 1, aft)
  if (params.params[key]) {
    params.url = params.url.replace(params.url.substring(pre, aft + 1), params.params[key])
    delete params.params[key]
  } else {
    params.url = params.url.replace(params.url.substring(pre, aft + 1), params.params.option)
    delete params.params.option
  }
  return params
}

/**
 *  返回url的前缀
 * @param url 对应src/api/index.js 中的key
 * @param isLocal
 * @return String
 */
export const getApiUrl = function (url = '', isLocal = !1) {
  return isLocal ? api.localApiPrefix : process.env.VUE_APP_API_BASE_URL
}
/**
 *  请求后台调用axios，返回axios的返回值，
 * @param httpRequest.isLocal // `isLocal` 是用于本地调试的url前缀, default: false
 * 以下为axios的参数
 * @param httpRequest.url type String // `url` 是用于请求的服务器 URL
 * @param httpRequest.params // `params` 是即将与请求一起发送的 URL 参数；必须是一个无格式对象(plain object)或 URLSearchParams 对象
 * @param httpRequest.data // `data` 是作为请求主体被发送的数据；只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'；
 * @param httpRequest.needResponse // `needResponse` 是否需要返回response
 * @param httpRequest.headers // `headers` 是即将被发送的自定义请求头
 * @param httpRequest.method // `method` 是创建请求时使用的方法
 * @param httpRequest.timeout // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)；如果请求话费了超过 `timeout` 的时间，请求将被中断
 * @param httpRequest.baseURL // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
 * @param httpRequest.paramsSerializer // `paramsSerializer` 是一个负责 `params` 序列化的函数
 * @param httpRequest.responseType  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
 * @param httpRequest.onUploadProgress // `onUploadProgress` 允许为上传处理进度事件
 * @param httpRequest.onDownloadProgress  // `onDownloadProgress` 允许为下载处理进度事件
 * @param httpRequest.transformResponse // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
 * @return {Promise<any>|*} 返回axios的
 */
export const apiRequest = (httpRequest) => {
  if (!httpRequest.url) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ code: 417, message: '请求地址未填写', data: null })
    })
  }
  !httpRequest.baseURL && (httpRequest.baseURL = getApiUrl(httpRequest.url, httpRequest.isLocal))
  return axios(httpRequest).then(res => {
    if (res && res.code === 200) {
      return httpRequest.needResponse === true ? res : res.result
    } else {
      return Promise.reject(res)
    }
  })
}
/**
 *  get请求 ，后台接口中带有{**}的
 * @param httpRequest.isLocal // `isLocal` 是用于本地调试的url前缀, default: false
 * @param httpRequest.url type String // `url` 后端接口action名称
 * @param httpRequest.params // `params` 是即将与请求一起发送的 URL 参数；必须是一个无格式对象(plain object)或 URLSearchParams 对象
 * @param httpRequest.needResponse // `needResponse` 是否需要返回response, default: false
 * @param httpRequest.headers // `headers` 是即将被发送的自定义请求头
 * @param httpRequest.timeout // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)；如果请求话费了超过 `timeout` 的时间，请求将被中断
 * @param httpRequest.paramsSerializer // `paramsSerializer` 是一个负责 `params` 序列化的函数
 * @param httpRequest.responseType  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
 * @param httpRequest.onUploadProgress // `onUploadProgress` 允许为上传处理进度事件
 * @param httpRequest.onDownloadProgress  // `onDownloadProgress` 允许为下载处理进度事件
 * @param httpRequest.transformResponse // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
 * @return {Promise<any>|*}
 */
export const $get = (httpRequest = {}) => {
  return apiRequest(urlReplace({
    ...httpRequest,
    method: 'GET'
  }))
}
/**
 *  post请求
 ** @param httpRequest.isLocal // `isLocal` 是用于本地调试的url前缀, default: false
 * @param httpRequest.url type String // `url` 后端接口action名称
 * @param httpRequest.data // `data` 是作为请求主体被发送的数据；只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'；
 * @param httpRequest.needResponse // `needResponse` 是否需要返回response, default: false
 * @param httpRequest.headers // `headers` 是即将被发送的自定义请求头
 * @param httpRequest.timeout // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)；如果请求话费了超过 `timeout` 的时间，请求将被中断
 * @param httpRequest.paramsSerializer // `paramsSerializer` 是一个负责 `params` 序列化的函数
 * @param httpRequest.responseType  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
 * @param httpRequest.onUploadProgress // `onUploadProgress` 允许为上传处理进度事件
 * @param httpRequest.onDownloadProgress  // `onDownloadProgress` 允许为下载处理进度事件
 * @param httpRequest.transformResponse // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
 * @return {Promise<any>|*}
 */
export const $post = (httpRequest) => {
  return apiRequest({ ...httpRequest, method: 'POST' })
}
/**
 *  put请求
 * @param httpRequest.isLocal // `isLocal` 是用于本地调试的url前缀, default: false
 * @param httpRequest.url type String // `url` 后端接口action名称
 * @param httpRequest.data // `data` 是作为请求主体被发送的数据；只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'；
 * @param httpRequest.needResponse // `needResponse` 是否需要返回response, default: false
 * @param httpRequest.headers // `headers` 是即将被发送的自定义请求头
 * @param httpRequest.timeout // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)；如果请求话费了超过 `timeout` 的时间，请求将被中断
 * @param httpRequest.baseURL // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
 * @param httpRequest.paramsSerializer // `paramsSerializer` 是一个负责 `params` 序列化的函数
 * @param httpRequest.responseType  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
 * @param httpRequest.onUploadProgress // `onUploadProgress` 允许为上传处理进度事件
 * @param httpRequest.onDownloadProgress  // `onDownloadProgress` 允许为下载处理进度事件
 * @param httpRequest.transformResponse // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
 * @return {Promise<any>|*}
 */
export const $put = (httpRequest) => {
  return apiRequest(urlReplace({ ...httpRequest, method: 'PUT' }))
}
/**
 *  delete请求
 * @param httpRequest.isLocal // `isLocal` 是用于本地调试的url前缀, default: false
 * @param httpRequest.url type String // `url` 后端接口action名称
 * @param httpRequest.data // `data` 是作为请求主体被发送的数据；只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'；
 * @param httpRequest.needResponse // `needResponse` 是否需要返回response, default: false
 * @param httpRequest.headers // `headers` 是即将被发送的自定义请求头
 * @param httpRequest.timeout // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)；如果请求话费了超过 `timeout` 的时间，请求将被中断
 * @param httpRequest.baseURL // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
 * @param httpRequest.paramsSerializer // `paramsSerializer` 是一个负责 `params` 序列化的函数
 * @param httpRequest.responseType  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
 * @param httpRequest.onUploadProgress // `onUploadProgress` 允许为上传处理进度事件
 * @param httpRequest.onDownloadProgress  // `onDownloadProgress` 允许为下载处理进度事件
 * @param httpRequest.transformResponse // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
 * @param httpRequest
 */
export const $delete = (httpRequest) => {
  return apiRequest(urlReplace({ ...httpRequest, method: 'DELETE' }))
}

// /**
//  * 根據codeType獲取當前type下的數據
//  * @param type
//  * @returns {Promise<*>|*}
//  */
// export const getCodeByType = (type) => {
//   if (!type) {
//     return Promise.reject(new Error('function getCodeByType param type is undefined'))
//   }
//   return $post({
//     url: api.system.code.getList,
//     data: { type }
//   })
// }