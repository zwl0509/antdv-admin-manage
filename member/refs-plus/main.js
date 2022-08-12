import Vue from 'vue';
import App from './App';
// 引入全局uView
import uView from 'uview-ui';
// 此处为演示vuex使用，非uView的功能部分
import store from '@/store';
// i18n部分的配置
// 引入语言包，注意路径
import Chinese from './common/locales/zh.js';
import English from './common/locales/en.js';
// VueI18n
import VueI18n from './common/vue-i18n.min.js';
import service from './common/service'
import api from './api'
import icon from './icon'
Vue.prototype.$get = service.get
Vue.prototype.$post = service.post
Vue.prototype.$del = service.del
Vue.prototype.$put = service.put
Vue.prototype.$request = service.request
Vue.prototype.$getJurisdiction = service.getJurisdiction
Vue.prototype.api = api
Vue.prototype.icon = icon

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.prototype.$Loading = function(title, mask = true) {
	uni.showLoading({
		title,
		mask
	})
}
Vue.prototype.$dyncNumber = function(val, digits) {
	return !val || (new RegExp(
		`^(((([-]?)[1-9]\\d{0,${digits[0] - digits[1] - 1}})((\\.\\d{1,${digits[1]}})?))|(([0]?)\\.\\d{1,${digits[1]}})|0)$`
	).test(val))
}
Vue.prototype.previewImage = function(e) {
	uni.previewImage({
		current: e,
		urls: [e] //一个数组，可以查看多张图
	});
}
Vue.prototype.phoneNumShow = function(tel) {
	let mphone = tel.substring(0, 3) + '****' + tel.substring(7);
	return mphone
}
Vue.prototype.$Toast = function(msg, duration = 2500) {
	uni.showToast({
		icon: 'none',
		title: msg,
		duration
	})
}

Vue.use(uView);

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

// 引入uView对小程序分享的mixin封装
// let mpShare = require('uview-ui/libs/mixin/mpShare.js');
// Vue.mixin(mpShare);

// VueI18n
Vue.use(VueI18n);

const i18n = new VueI18n({
	// 默认语言
	locale: 'zh',
	// 引入语言文件
	messages: {
		'zh': Chinese,
		'en': English,
	}
});

// 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
// Vue.prototype._i18n = i18n;

const app = new Vue({
	i18n,
	store,
	...App
});

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
// import httpInterceptor from '@/common/http.interceptor.js';
// Vue.use(httpInterceptor, app);

// http接口API抽离，免于写url或者一些固定的参数
// import httpApi from '@/common/http.api.js';
// Vue.use(httpApi, app);

app.$mount();
