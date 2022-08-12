<template>
	<view class="aboutUs">
		<u-navbar title="关于我们" :borderBottom="false"></u-navbar>
		<view class="logo">
			<image src="/static/image/logo.png"></image>
			<view class="appName">红蚂蚁+</view>
			<view class="line-item">
				<view class="label">当前版本</view>
				<view class="version">
					<text class="versionNum">{{version ? version: '1.0.1'}}</text>
				</view>
			</view>
		</view>
		<view class="list">
			<view></view>
			<view class="line-item" v-for="(item, index) in muneList" :key="index" @click="changePage(item.url)">
				<view class="label">{{ item.name }}</view>
			</view>
		</view>
		<view class="copyright">
			<view class="">@2021 </view>
			<text></text>
		</view>
		<!-- <updated-version ref="updatedVersion" :remark="remark" :version="latestVersion"></updated-version>
		 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				muneList: [{
						name: '用户服务协议',
						url: '/pages/mine/about-us/service-agreement'
					},
					{
						name: '用户隐私政策',
						url: '/pages/mine/about-us/privacy'
					},
					// {
					// 	name: '去评分',
					// }
				],
				version: uni.getStorageSync('wgtVersion'),
				latestVersion: '',
				remark: '',

			};
		},
		onLoad() {
			// #ifdef APP-PLUS || APP-VUE
			// plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
			// 	this.version = widgetInfo.version
			// })
			// #endif
		},
		methods: {
			// 获取版本
			handleCheckVersion() {
				this.$Loading('检查版本中')
				const params = {
					appCode: '',
					appName: '霸王演讲宝',
					// appType: '1034-10',
					// publishPlatform: '1035-10'
				}
				this.$get({
						url: this.$api.common.checkVersion,
						data: params
					}).then(res => {
						this.remark = res.remark
						this.latestVersion = res.versionNumber
						if (this.latestVersion) {
							this.update(this.latestVersion)
						} else {
							this.$Toast('未发现新版本')
						}
					}).catch(e => {
						console.log(e);
					})
					.finally(() => {
						uni.hideLoading()
					})
			},
			changePage(url) {
				if (url) {
					uni.navigateTo({
						url: url
					})
				} else {
					this.toMarket()
				}
			},
			toNum(version) {
				let version_list = version.toString().split('.');
				let num_place = ["", "0", "00", "000", "0000"],
					r = num_place.reverse();
				for (let i = 0; i < version_list.length; i++) {
					let len = version_list[i].length;
					version_list[i] = r[len] + version_list[i];
				}
				let res = version_list.join('');
				return res;
			},
			update(version) {
				let that = this
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					let online = that.toNum(version);
					let local = that.toNum(widgetInfo.version);
					if (online == local) {
						that.$Toast('您已是最新版本！')
						return false;
					} else if (online > local) {
						that.$refs.updatedVersion.visible = true
						return false;
					} else {
						// console.log("版本号服务器版本:" + b + "是新版本!");
						return true;
					}
				});
			},
			toMarket() {
				const phoneInfo = uni.getSystemInfoSync()
				// console.log(JSON.stringify(phoneInfo))
				// const userAgent = navigator.userAgent
				const model = phoneInfo.model
				const regs = [/(MI|Mi|Redmi).*/, /(SAMSUNG|SM-).*/, /(HUAWEI|HONOR).*/i, /OPPO.*/, /(vivo|VIVO).*/]
				const values = ['mimarket://details?id=', 'samsungapps://ProductDetail/', 'appmarket://details?id=',
					'oppomarket://details?packagename=', 'vivomarket://details?id='
				]
				let scheme = 'market://details?id='
				// #ifdef APP-PLUS
				if (phoneInfo.platform.toLowerCase() == "android") {
					regs.forEach((m, i) => {
						if (m.test(model)) {
							scheme = values[i]
						}
					})
					var Uri = plus.android.importClass("android.net.Uri");
					var uri = Uri.parse(scheme + 'com.'); // 当前APP的包名
					var Intent = plus.android.importClass('android.content.Intent');
					var intent = new Intent(Intent.ACTION_VIEW, uri);
					var main = plus.android.runtimeMainActivity();
					main.startActivity(intent);
				} else {
					this.$Toast('仅Android手机支持')
				}
				// #endif
				// #ifndef APP-PLUS
				this.$Toast('仅Android手机支持')
				// #endif
			},
		}
	}
</script>

<style lang="scss">
	.aboutUs {
		height: 100vh;
		background-color: #F6F6F6;
	}

	.logo {
		background-color: #FFFFFF;
		text-align: center;
		padding-top: 54rpx;

		image {
			width: 144rpx;
			height: 144rpx;
		}

		.appName {
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
			margin-bottom: 88rpx;
		}
	}

	.line-item {
		height: 112rpx;
		font-weight: 400;
		padding: 30rpx 60rpx 30rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		background: url("/static/image/mine/right.png") no-repeat calc(100% - 30rpx) center;
		background-size: auto 27rpx;

		&:after {
			content: '';
			position: absolute;
			bottom: 0;
			height: 1px;
			left: 30rpx;
			right: 30rpx;
			background: #f0f0f0;
		}

		&:last-child:after {
			display: none;
		}

		.label {
			font-size: 32rpx;
			color: #333333;
		}

		.version {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.versionNum {
				font-size: 32rpx;
				color: #999999;
			}

			.arrows_right {
				width: 16rpx;
				height: 28rpx;
			}
		}
	}

	.list {
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.copyright {
		position: absolute;
		bottom: 108rpx;
		width: 100%;
		text-align: center;
		line-height: 34rpx;
		color: #999;
		font-size: 24rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
	}
</style>
