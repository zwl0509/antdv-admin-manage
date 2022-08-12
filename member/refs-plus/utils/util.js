import service from '../common/service'
import api from '../api'
/**
 * u-picker的日期值转换为String值
 * @param pickerDate
 * @param format
 * @returns {string}
 */
export const dateToString = (pickerDate = {}, format = '-') => {
	const date = []
	const time = []
	if (Object.keys(pickerDate).length) {
		date.push(pickerDate.year || '')
		date.push(pickerDate.month || '')
		date.push(pickerDate.day || '')
		time.push(pickerDate.hour || '')
		time.push(pickerDate.minute || '')
		time.push(pickerDate.second || '')
	}
	return (date[0] ? date.join(format) : '') + (date[0] && time[0] !== '' ? ' ' : '') + (time[0] ? time.join(':') :
		'')
}

/**
 * 根据type获取code list
 * @param type
 * @returns {Promise<array|Error>}
 */
export const getCodeByType = (type) => {
	return service.get({
		url: api.common.getCodeByType,
		data: {
			type
		}
	})
}

/**
 * 把一位的字符转换为两位的字符
 * @param str
 * @param isSuf
 * @param insetStr
 * @returns {string}
 */
export const getTwoBitString = (str = '', isSuf = false, insetStr = '0') => {
	const str2 = str.toString()
	const length = str2.length
	if (length < 2) {
		return isSuf ? (str2||0) + insetStr : insetStr + (str2||0)
	}
	return str2
}

/**
 * 深度克隆数据
 * @param obj Array|Object
 * @returns {RegExp|[]|Object|Date|*}
 */
export const deepClone = (obj) => {
	// 对常见的“非”值，直接返回原来值
	if([null, undefined, NaN, false].includes(obj)) return obj;
	if(typeof obj !== "object" && typeof obj !== 'function') {
		//原始类型直接返回
		return obj;
	}
	var o = Array.isArray(obj) ? [] : new Object();
	if (obj instanceof Date) {
		return new Date(obj)
	}
	if (obj instanceof RegExp) {
		return new RegExp(obj)
	}
	for(let i in obj) {
		if(obj.hasOwnProperty(i)){
			o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
		}
	}
	return o;
}

/**
 * 文件下载
 * @param url 文件地址
 */
export const download = (url) => {
	if (!url) return
	uni.downloadFile({
		url,
		success: (res) => {
			if (res.statusCode === 200) {
				uni.saveFile({
					tempFilePath: res.tempFilePath,
					success: (res) => {
						// #ifdef APP-PLUS
						plus.nativeUI.toast('已保存:' + res.savedFilePath)
						// #endif
						// #ifndef APP-PLUS
						uni.showToast({
							icon: 'none',
							title: '已保存:' + res.savedFilePath,
							duration: 2500
						})
						// #endif
					}
				})
			} else {
				uni.showToast({
					icon: 'none',
					title: '下载失败',
					duration: 2500
				})
			}
		},
		fail: (err) => {
			uni.showToast({
				icon: 'none',
				title: err && err.message || '下载失败',
				duration: 2500
			})
		}
	})
}


