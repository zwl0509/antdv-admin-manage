import { axios } from '@/utils/http-service/request'

// 通用文件上传
export function commonFileUpload(parameter) {
  return axios({
    url: '/common/attachment/uploadFiles',
    method: 'post',
    data: parameter,
    timeout: 600000
  }).then(res => {
    return res && res.code === 200 ? (res && res.result) || [] : Promise.reject(res)
  })
}

// 根据type获取系统编码数据
export function commonGetCode (parameter) {
  return axios({
    url: '/common/search/getSysCodeByType?type=' + parameter,
    method: 'get'
  })
}

// 根据types获取系统编码数据
export function commonGetCodes (parameter) {
  return axios({
    url: '/common/search/SysCodeByTypeList',
    data: parameter,
    method: 'post'
  })
}