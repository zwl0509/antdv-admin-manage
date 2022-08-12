<script>
	// #ifdef APP-PLUS
	import updata from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
	// #endif
	export default {
		onLaunch() {
			// #ifdef APP-PLUS
			// updata()
			// #endif
			// 锁定竖屏
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary')
			// #endif
			// 获取状态栏高度
			// uni.getSystemInfo({
			// 	success: (e) => {
			// 		this.$u.vuex('vuex_win_height', e.windowHeight)
			// 		this.$u.vuex('vuex_status_bar_height', e.statusBarHeight)
			// 	}
			// })
			// 判断平台是否为ios
			// let platform = uni.getSystemInfoSync().platform.toLowerCase() === 'ios' ? true : false
			this.$u.vuex('vuex_platform', uni.getSystemInfoSync().platform.toLowerCase() === 'ios' ? true : false)
			uni.setStorageSync('isIos', uni.getSystemInfoSync().platform.toLowerCase() === 'ios' ? true : false)
			console.log(uni.getSystemInfoSync().platform.toLowerCase())

      // #ifdef APP-PLUS
			if (this.vuex_platform) {
				var UIApplication = plus.ios.import("UIApplication");
				var app = UIApplication.sharedApplication();
				var oldNum = app.applicationIconBadgeNumber();
			}

			//获取应用图标的数量
			uni.setStorageSync('oldNum', oldNum)
      // #endif
			// if (oldNum != 0) {
			//     console.log('角标取值', oldNum);
			//     // console.log("oldNum:"+oldNum);
			//     var newNum = oldNum - 1;
			//     //设置应用图标的数量
			//     plus.runtime.setBadgeNumber(newNum);
			//     //导入个推原生类
			//     var GeTuiSdk = plus.ios.importClass('GeTuiSdk');
			//     GeTuiSdk.setBadge(newNum);
			// }
			// let height = uni.getSystemInfoSync().statusBarHeight + 44
			// this.$u.vuex('vuex_tabbar_height', height)
			//#ifdef APP-PLUS
			var info = plus.push.getClientInfo();
			console.log(JSON.stringify(info));
			/* 5+  push 消息推送 ps:使用:H5+的方式监听，实现推送*/
			plus.push.addEventListener("click", function(msg) {
				//这里可以写跳转业务代码
				console.log("click:" + JSON.stringify(msg));
				console.log(msg.payload);
				console.log(JSON.stringify(msg));
				uni.switchTab({
					url: '/pages/tab-bar/workbench',
					success(e) {
						console.log(e)
					},
					fail(e) {
						console.log(e)
					}
				})
			}, false);
			//监听在线消息事件
			// plus.push.addEventListener("receive", function(msg) {
			// 	console.log("recevice:" + JSON.stringify(msg))
			// 	uni.switchTab({
			// 		url: '/pages/tab-bar/workbench',
			// 		success(e) {
			// 			console.log(e)
			// 		},
			// 		fail(e) {
			// 			console.log(e)
			// 		}
			// 	})
			// }, false);

			//#endif
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	@import 'uview-ui/index.scss';
</style>
<style>
	scroll-view ::-webkit-scrollbar {
		display: none !important;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}
</style>
