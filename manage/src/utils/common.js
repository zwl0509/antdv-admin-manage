import moment from 'moment'
import labels from '@/utils/labels'
import notification from 'ant-design-vue/es/notification'
import regular from '@/utils/regular'


/**
 *  moment数据类型转String
 * @param dataStr
 * @param pattern
 * @return {string}
 */
export const dateFormat = (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return dataStr ? moment(dataStr).format(pattern) : ''
}

/**
 *  校验字符长度（中文字： 1），校验中文字符范围：\u4e00-\u9fa5
 * @param string
 * @returns {number}
 */
export const zhStringLength = function (string = '') {
  let length = 0
  string = string && string.toString().split('') || ''
  // const reg = /0xE001,0xE05A]|[0xE101,0xE15A]|[0xE201,0xE253]|[0xE301,0xE34D]|[0xE401,0xE44C]|[0xE501,0xE537]/
  for (const str of string) {
    length += /[\u4e00-\u9fa5]/.test(str) ? 1 : 1
  }
  return length
}
/**
 * v-decorator validator字符超出驗證
 * @param rule
 * @param val
 * @param callback
 * @param max 數據庫字符長度
 */
export const maxLenValidator = (rule, val, callback, max = 36, lable) => {
  const len = val && zhStringLength(val) || 0
  if (val && len > max) {
    callback(inputOverMaxMessage(val, len, max, lable))
  } else {
    callback()
  }
}
/**
 * v-decorator validator数字类规则驗證
 * @param rule
 * @param value
 * @param callback
 * @param type
 */
export const numberValidator = (r, value, callback, type = 'number', digits) => {
  const types = {
    number: {
      reg: /^((\+|-)?(\d{0,8})|((\d{0,8})?\.\d{1,2}))$/,
      message: '超出最大限制，最大：99999999.99。有效小数为两位。'
    },
    int: {
      reg: /^((\+|-)?\d{0,11}$)/,
      message: '超出最大限制，最大：999,9999,9999。'
    }
  }
  const rule = types[type]
  if (!!value && !rule.reg.test(value)) {
    callback(rule.message)
  } else {
    callback()
  }
}
export const regularCheck2 = function(r, v, callback, regName, digits, msg) {
  if (v) {
    const reg = regular[regName]
    if (reg) {
      if (regName === 'int' && digits > 1) {
        !(new RegExp(`^((([-]?)[1-9]\\d{0,${digits - 1}})|[0])$`).test(v)) && callback && callback(msg)
      } else if (regName === 'number' && Array.isArray(digits)) {
        if (!digits[0] || !digits[1] || digits[0] <= digits[1] + 1) {
          callback && callback()
        } else {
          !(new RegExp(`^(((([-]?)[1-9]\\d{0,${digits[0] - digits[1] - 1}})((\\.\\d{1,${digits[1]}})?))|(([0]?)\\.\\d{1,${digits[1]}})|0)$`).test(v)) && callback && callback(msg)
        }
      } else {
        !reg.test(v) && callback && callback(msg)
      }
    }
  }
  callback && callback()
}

/**
 * 判断字符是否为空
 * @param val
 * @returns {boolean}
 */
export const filedIsNull = (val) => {
  return val === '' || val === undefined || val === null
}

/**
 * 字符超出提示語
 * @param text 原字符
 * @param len Unicode length
 * @param max 數據庫字符長度
 * @returns {string}
 */
export const inputOverMaxMessage = (text = '', len = 0, max = 36, lable) => {
  const hasZH = text.toString().length < len
  console.log(lable)
  return hasZH ? `${lable},` + labels.MAX_LENGTH_ZH_WARNING + parseInt(max / 4) :  `${lable},` + labels.MAX_LENGTH_WARNING + max
}

/**
 * 獲取隨機字符
 * @param digit 位數
 * @returns {string}
 */
export const getRandomStr = (digit = 8) => {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < digit; i++) {
    result += str[parseInt(Math.random() * 53)]
  }
  return result
}

/**
 * 请求错误消息弹出
 * @param message
 */
export const defaultErrorMessage = (message, title = '请求错误') => {
  notification.error({
    message: title,
    description: typeof message === 'string' && message || message && message.message || labels.RESPONSE_RESULT_EXCEPTION
  })
}
/**
 * 常用日期转换格式
 * */
export const dateFormatString = 'YYYY-MM-DD'

export const dateTimeFormatString = 'YYYY-MM-DD HH:mm:ss'

/**
 * 设置div.ant-model-body的最大高度
 * @param percentage 百分比(number|x%)|高度(number)
 * @param isBody 高度是否包含header、footer区域， 默认：true
 * @returns {string}
 */
const editHeight = (percentage = 0.8, isBody = true) => {
  const htmlHeight = document.documentElement.clientHeight || 1
  const height = typeof percentage === 'number'
    ? percentage > 1
      ? percentage
      : parseInt(htmlHeight * percentage)
    : parseFloat(percentage)
  return (isBody && (height - 100) > 0 && height - 100 || height) + 'px'
}

/**
 * 正则校验
 * @param reg 对应regular的key
 * @param val 需要校验的值
 * @param callback 回调函数
 * */
export const regularCheck = (reg, val, callback,msg) => {
  /* console.log(val)
  console.log(regular[reg])
  console.log(regular[reg].test(val)) */
  if (!val || regular[reg].test(val)) {
    callback()
  } else {
    callback(msg||''+'格式不正确')
  }
}
/**
 * 字短校验
 * @param keys 需要校验key
 * @param errors 校验失败的message
 * */
export const checkErrors =  (keys, errors) => {
  let key
  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    if (key && errors[key]) {
      return errors[key].errors[0].message
    }
  }
  return null
}

// 保留两位小数
export const XtoFixed = price => {
  let value = Math.round(parseFloat(price) * 100) / 100
  const xsd = value.toString().split('.')
  if (xsd.length == 1) {
    value = value.toString() + '.00'
    return Number(value)
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + '0'
    }
    return Number(value)
  }
}

const common = {
  dateFormat,
  numberValidator,
  maxLenValidator,
  getRandomStr,
  inputOverMaxMessage,
  zhStringLength,
  defaultErrorMessage,
  filedIsNull,
  editHeight,
  regularCheck,
  regularCheck2,
  checkErrors,
  XtoFixed
}

export default common