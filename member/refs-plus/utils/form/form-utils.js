/**
 *  校验字符长度（中文字： 4），校验中文字符范围：\u4e00-\u9fa5
 * @param string
 * @returns {number}
 */
export const zhStringLength = function (string = '') {
  let length = 0
  string = string.toString().split('')
  // const reg = /0xE001,0xE05A]|[0xE101,0xE15A]|[0xE201,0xE253]|[0xE301,0xE34D]|[0xE401,0xE44C]|[0xE501,0xE537]/
  for (const str of string) {
    length += /[\u4e00-\u9fa5]/.test(str) ? 3 : 1
  }
  return length
}

// 字段验证
const verify = {
  requiredMessage: '',
  maxlengthMessage: '',
  regMessage: '',
  fieldVerify (rule, message, value) {
    if(rule.required && !value && value !== 0){
      return message ? message.required : ''
    }
    if(rule.maxlength && value && String(value).length && zhStringLength(value.toString()) > rule.maxlength){
      return message ? message.maxlength : ''
    }
    if(rule.reg && value && String(value).length && !rule.reg.test((value+'').trim())){
      return message ? message.reg : ''
    }
  },
  arrayVerify (rule, message, data) {
    for (let i = 0; i< data.length; i++) {
      const msg = this.dataVerify(rule, message, data[i])
      if (msg !== undefined) {
        return msg
      }
    }
  },
  objectVerify (rule, message, data) {
    if (rule) {
      const keys = Object.keys(rule)
      for (let k = 0; k < keys.length; k++) {
        const key = keys[k]
        let msg = ''
        if (rule[key]) {
          const [r, m, d] = [rule[key], message[key], data[key]]
          msg = this.dataVerify(r, m, d)
          if (msg !== undefined) {
            return {field: key, message: msg}
          }
        }
      }
    }
  },
  dataVerify (rule, message, data) {
    let msg = ''
    if(Array.isArray(data)){
      msg = this.arrayVerify(rule, message, data)
    } else if (typeof data === 'object') {
      msg = this.objectVerify(rule,message, data)
    } else {
      msg = this.fieldVerify(rule,message, data)
    }
    if (msg !== undefined) {
      return msg
    }
  }
}

const TValidator = {
  fieldVerify (rule, value) {
    if (rule && rule.length) {
      for (let i =0; i < rule.length; i++) {
        const r = rule[i]
        if (r) {
          if (r.validator && typeof r.validator === 'function') {
            const res = r.validator(value)
            if (res !== undefined) {
              return res
            }
          }
          if (r.required && (!value && value !== 0)) {
            return r.message ? r.message : ''
          }
          if (r.max && value && value.toString().length && zhStringLength(value.toString()) > r.max) {
            return r.message ? r.message : ''
          }
          if (r.min && value && value.toString().length && zhStringLength(value.toString()) < r.min) {
            return r.message ? r.message : ''
          }
          if (value && value.toString().length && r.reg && (typeof r.reg === 'function' ? !r.reg((value+'').trim()) : !r.reg.test((value+'').trim()))) {
            return r.message ? r.message : ''
          }
        }
      }
    }
  },
  objectVerify (rule, data) {
    const keys = Object.keys(rule)
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k]
      let msg = ''
      if (rule[key]) {
        const [r, d] = [rule[key], data[key]]
        msg = this.dataVerify(r, d)
        if (msg !== undefined) {
          return typeof msg === 'string' ? {field: key, message: msg} : msg
        }
      }
    }
  },
  arrayVerify (rule, data) {
    for (let i = 0; i< data.length; i++) {
      const msg = this.dataVerify(rule, data[i])
      if (msg !== undefined) {
        return msg
      }
    }
  },
  dataVerify (rule, data) {
    let msg = ''
    if(Array.isArray(data)){
      msg = this.arrayVerify(rule, data)
    } else if (data && typeof data === 'object') {
      msg = this.objectVerify(rule, data)
    } else {
      msg = this.fieldVerify(rule, data)
    }
    if (msg !== undefined) {
      return msg
    }
  }
}

/**
 * 表单验证
 * verifyOptions: {
 *    name: {
 *      required: true,
 *      maxlength: 50,
 *      reg: /^[a-z][A-Z]$/g
 *    },
 *    message: {
 *      required: "请输入名称",
 *      maxlength: "名称字数过长",
 *      reg: "名称格式不正确"
 *    }
 * }
 * data
 */
export const formValidatorSync = function(verifyOptions, data) {
  const { rule, message } = verifyOptions
  const msg = verify.dataVerify(rule, message, data)

  return msg === undefined ? false : typeof msg === 'object' ? msg : { message: msg }
}
/**
 * 表单验证2
 * @params verifyOptions: {
 *    name: [{ required: true, message: ''},
 *      {max: 50,message: ''},
 *      {reg: /^[a-z][A-Z]$/g,message: ''},
 *      {validator: function(value){} }
 *    }],
 *    dtos: {
 *      title: [
 *      {required: "请输入名称",message: ''},
 *      {min: "名称字数过长"},
 *      {reg: "名称格式不正确",message: ''}
 *      ],
 *      ...
 *    },
 *    ...
 * }
 * @params data
 * @returns {Promise<any>}
 */
export const formValidator = function(verifyOptions, data) {
  return new Promise((resolve, reject) => {
    const msg = TValidator.dataVerify(verifyOptions, data)
    msg === undefined ? resolve() : reject(typeof msg === 'object' ? msg : { message: msg })
  })
}

export default {
}
