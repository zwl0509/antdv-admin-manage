import $Variable from './variable'
import labels from '@/utils/labels'
import api from '@/api'
import store from '@/store'

/**
 * 请求结果异常处理
 * @param options 请求参数
 * @param response 响应数据
 */
const responseInterceptor = function(options, response) {
	if (response.data.code == 401) {
		uni.showToast({
			title: labels.NO_LOGIN,
			icon: 'none',
			duration: 2000
		})
		uni.redirectTo({
			url: '/pages/login/login'
		});
		store.dispatch('logout')
	} else if (options.toast !== false) {
		uni.showToast({
			title: response.data.message || labels.REQUEST_FAIL,
			icon: 'none',
			duration: 2000
		});
	}
}

const Service = function() {
	const that = this
	// 全局配置
	this.common = {
		baseUrl: $Variable.apiServer,
		mqttUrl: $Variable.mqttServer,
		socketServer: $Variable.socketServer,
		header: {
			// 'Content-Type':'application/json;charset=UTF-8',
		},
		data: {},
		method: 'GET',
		dataType: 'json',
		timeout: 20000,
		token: ''
	}
	// 请求 返回promise
	/**
	 *
	 * @property options { }
	 * url 请求地址,
	 * header: 请求头,
	 * data: 请求参数 Object,
	 * method: 请求方式[GET|POST|PUT|DELETE],
	 * dataType: 请求响应数据类型 [json|text],
	 * timeout: 请求超时时间 ms,
	 * needResponse: default: false, 是否需要整个响应数据
	 * @returns {Promise<data|Error>}
	 */
	this.request = function(options = {}) {
		if (!options.url) return Promise.reject({
			code: 417,
			message: '请求地址未填写'
		})
		// 组织参数
		options.url = (options.mqtt ? that.common.mqttUrl : that.common.baseUrl) + options.url
		options.header = options.header || that.common.header
		options.data = options.data || that.common.data
		options.method = options.method || that.common.method
		options.dataType = options.dataType || that.common.dataType
		options.timeout = options.timeout || that.common.timeout
		options.needResponse = options.needResponse !== undefined ? options.needResponse : false
		const token = store.state.vuex_token
		that.common.token = token || ''
		options.header['X-Auth-Token'] = that.common.token

		// 请求
		return new Promise((res, rej) => {
			// 请求中...
			uni.request({
				...options,
				success: (result) => {
					// 返回原始数据
					if (options.native) {
						return res(result)
					}
					// 白名单不进行登陆验证，返回服务器数据
					if (options.isWhite) {
						return res(result.data)
					}
					// 服务端失败
					if (result.data && result.data.code !== 200) {
						responseInterceptor(options, result)
						return rej(result.data)
					}
					if (!result.data) {
						return rej(labels.INTERNET_CONNECT_FAIL)
					}
					// 成功
					let data = result.data
					res(options.needResponse ? data : data.result)
				},
				fail: (error) => {
					let msg = ''
					if (error && error.errMsg) {
						msg = error.errMsg === 'request fail' ?
							labels.INTERNET_CONNECT_FAIL :
							error.errMsg.toString().indexOf('timeout') ?
							labels.INTERNET_CONNECT_TIMEOUT :
							error.errMsg || labels.REQUEST_FAIL
					}
					uni.showToast({
						title: msg,
						icon: 'none'
					});
					rej(error)
				}
			});
		})
	}
	/**
	 * 替换get请求中的{**}
	 * @param params
	 * @returns {{}}
	 */
	this.urlReplace = function(params = {}) {
		const pre = params.url.indexOf('{')
		if (pre < 0) {
			return params
		}
		const aft = params.url.indexOf('}')
		const key = params.url.substring(pre + 1, aft)
		if (params.data[key]) {
			params.url = params.url.replace(params.url.substring(pre, aft + 1), params.data[key])
			delete params.data[key]
		} else if (params.data.option) {
			params.url = params.url.replace(params.url.substring(pre, aft + 1), params.data.option)
			delete params.data.option
		}
		return params
	}
	// get请求
	this.get = function(options = {}) {
		if (options.data && Object.keys(options.data).length) {
			const arr = Object.keys(options.data)
			for (let i = 0; i < arr.length; i++) {
				const key = arr[i]
				if (Array.isArray(options.data[key])) {
					let params = ''
					options.data[key].map(m => {
						params += '&' + key + '=' + m
					})
					if (options.url.indexOf('?') > 0) {
						options.url.indexOf('?') === options.url.length - 1 ? (options.url += (params.length ?
							params.substring(1) : '')) : (options.url += params)
					} else {
						options.url += '?' + (params.length ? params.substring(1) : '')
					}
					delete options.data[key]
				}
			}
		}
		return that.request({
			...that.urlReplace(options),
			method: 'GET'
		})
	}
	// post请求
	this.post = function(options = {}) {
			return that.request({
				...that.urlReplace(options),
				method: 'POST'
			})
		},
		// delete请求
		this.del = function(options = {}) {
			return that.request({
				...that.urlReplace(options),
				method: 'DELETE'
			})
		}
	// put请求
	this.put = function(options = {}) {
		return that.request({
			...that.urlReplace(options),
			method: 'PUT'
		})
	}
	//获取按钮权限
	this.getJurisdiction = function() {
			let targetIds = []
			this.listBtns = []
			this.singleBtns = []
			targetIds.push(this.vuex_user.id)
			this.vuex_user.roles.forEach(item => {
				targetIds.push(item.id)
			})
			return that.request({
				...that.urlReplace({
					url: this.api.AuthUser.getAuthActionByTargetIds,
					data: {
						backstage: 0,
						sitemapId: uni.getStorageSync('sitemapId'),
						targetIds: targetIds
					}
				}),
				method: 'POST'
			})
			// this.$post({
			// 	url: this.api.AuthUser.getAuthActionByTargetIds,
			// 	data: {
			// 		backstage: 0,
			// 		sitemapId: uni.getStorageSync('sitemapId'),
			// 		targetIds: targetIds
			// 	}
			// }).then(res => {
			// 	console.log(res)
			// 	return res
			// })
		},
		/**
		 *
		 * @param {Object} options 上传参数. uni.uploadFile 参数
		 * @props options.needResponse 是否需要
		 * @returns {Promise<Array|Error>}
		 */
		this.upload = function(options = {}) {
			return new Promise((resolve, reject) => {
				if (!that.common.token) {
					const token = store.state.vuex_token
					// const token = uni.getStorageSync(constant.tokenName)
					that.common.token = token || ''
				}
				options.header = options.header || {}
				options.header['X-Auth-Token'] = that.common.token
				options.url = that.common.baseUrl + (options.url || api.common.upload)
				options.needResponse = options.needResponse !== undefined ? options.needResponse : false
				options.name = options.name || 'files'
				uni.uploadFile({
					...options,
					success: (result) => {
						if (result.data && typeof result.data === 'string') {
							result.data = JSON.parse(result.data)
						}
						if (result.data && result.data.code !== 200) {
							responseInterceptor(options, result)
							return reject(result.data)
						}
						if (!result.data) {
							return reject(labels.INTERNET_CONNECT_FAIL)
						}
						// 成功
						let data = result.data
						data.result[0].attachType = options.formData.attachType
						resolve(options.needResponse ? data : data.result)
					},
					fail: (error) => {
						uni.showToast({
							title: error && error.errMsg || '上传失败',
							icon: 'none'
						});
						reject(error)
					}
				})
			})
		}
	/**
	 *
	 * @params {Object} options 上传参数，同uni.uploadFile
	 * @props {Array} filePathList 需要上传的文件路径数组
	 * @returns {Promise<Array||Error>}
	 */
	this.filePathUpload = function(options = {}) {
		const array = []
		const {
			filePathList,
			...option
		} = options
		filePathList.forEach((m, i) => {
			m ? array.push(that.upload({
					...option,
					filePath: m,
					formData: Array.isArray(options.formData) ? options.formData[i] : (options
						.formData || {})
				})) :
				array.push(Promise.resolve(null))
		})
		return Promise.all(array)
	}
}
const service = new Service()
export const fileUpload = service.filePathUpload
export default service
