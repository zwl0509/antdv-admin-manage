<template>
	<view class="login-page">
		<u-navbar :background="background" :border-bottom='false' :is-back="false"></u-navbar>
		<view class="top">
			<view class="title">
				<text>登录后更精彩</text>
			</view>
		</view>
		<image src="/static/image/login/bg.png" mode="" class="login-bg"></image>
		<view class="form">
			<view class="form-item">
				<input class="input" type="number" :autocomplete="false" v-model="name" maxlength="20"
					placeholder="请输入账号" placeholder-style="font-size: 34rpx" />
				<view class="suf-icon clean-text" v-if="name && !noClick" @click="() => name = ''"></view>
			</view>
			<view class="form-item">
				<input class="input" v-model="password" maxlength="16" :type="showPwd ? 'text': 'password'"
					placeholder="请输入密码" placeholder-style="font-size: 34rpx" />
				<view class="suf-icon show-password" :class="{ opened: showPwd }" v-if="!noClick"
					@click="() => showPwd = !showPwd"></view>
			</view>
		</view>
<!-- 		<view class="register-line">
			<text @tap="handleRegister">
				注册账号
			</text>
		</view> -->
		<!-- <view class="login-phone" @click="toverify">
			手机验证码登录
		</view> -->
		<view class="bottom">
			<view class="login-btn">
				<button :disabled="!name || !password || !readMe || noClick" @click="handleLogin">登录</button>
			</view>
			<view>
				<view class="read-me fl-cc" style="margin-bottom: 30rpx;">
					<view class="check" :class="{selected: readMe}" @click="readMe = !readMe"></view>
					<text>已阅读并同意</text>
					<text class="text" @click="toservice">《用户使用协议》</text>&
					<text class="text" style="margin-left: 0" @click="toprivacy">《隐私协议》</text>
				</view>
			</view>

		</view>
		<!-- 		<tip-modal ref="tipModal" title="温馨提示" cancelText="不同意" confirmText="同意" @cancel="cancel" @confirm="confirm">
			<view class="tip-modal-text">
				<view class="">
					欢迎使用红蚂蚁APP！

				</view>
				<view class="">
					我们非常重视您的隐私保护和个人信息保护，在您使用红蚂蚁APP服务前，请认真阅读
					<text class="protocol" @click="toPage('service-agreement')">《服务协议》</text>和<text class="protocol"
						@click="toPage('privacy')">《隐私政策》</text>
					全部条款，您同意并接受全部条款后再开始使用我们的服务。
				</view>
			</view>
		</tip-modal> -->
	</view>
</template>

<script>
	// import {
	// 	wxGetUserInfo,
	// 	wxProviderLogin
	// } from '../../utils/weixin/auth'
	// #ifdef APP-PLUS
	import updata from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
	// #endif
	export default {
		data() {
			return {
				noClick: false,
				name: '',
				password: '',
				showPwd: false,
				readMe: false,
				background: {
					background: 'none'
				}
			};
		},
		onLoad(params = {}) {
			// #ifdef APP-PLUS
			const clientInfo = plus.push.getClientInfo()
			uni.setStorageSync('clientInfo', clientInfo)
			console.log(clientInfo)
			updata()
			// #endif
			// if (params.outOfDate) {
			// 	this.$Toast('登录已过期')
			// }
		},
		onReady() {
			let ISPRIVACY = uni.getStorageSync('ISPRIVACY');
			if (!ISPRIVACY) {
				// this.$refs.tipModal.visible = true
			}
		},
		methods: {
			toservice() {
				uni.navigateTo({
					url: '../mine/about-us/service-agreement'
				})
			},
			toprivacy() {
				uni.navigateTo({
					url: '../mine/about-us/privacy'
				})
			},
			goBack() {
				// uni.navigateBack({
				// 	delta: 2
				// })
				uni.switchTab({
					// url: '/pages/home-v1/home-v1'
					url: '/pages/tab-bar/friends'
				})
			},
			// toverify() {
			// 	uni.navigateTo({
			// 		url: 'verify-login'
			// 	})
			// },
			toPage(url) {
				uni.navigateTo({
					url: '/pages/mine/about-us/' + url
				})
			},
			handleLogin() {
				// if (this.name && this.password && this.readMe && !this.noClick)
				// 	this.login()
				if (this.loading) return
				if (!this.password) {
					this.$Toast('请输入密码')
					return
				}
				this.loading = true
				this.$post({
					url: this.api.AuthUser.login,
					data: {
						employeeCode: this.name,
						loginPwd: this.password,
						rememberMe: true,
						clientId: uni.getStorageSync('clientInfo').clientid
					}
				}).then(res => {
					this.loading = false
					this.$u.vuex('vuex_login', true)
					this.$u.vuex('vuex_token', res.token)
					uni.switchTab({
						url: '/pages/tab-bar/workbench'
					})
				}).catch(err => {
					this.$Toast(err?.message || '登录失败')
					this.loading = false
				})
			},
			confirm() {
				// this.$refs.tipModal.visible = false
				uni.setStorageSync('ISPRIVACY', true)
			},
			cancel() {
				// #ifdef APP-PLUS
				if (plus.os.name.toLowerCase() === 'android') {
					plus.runtime.quit();
				} else {
					const threadClass = plus.ios.importClass("NSThread");
					const mainThread = plus.ios.invoke(threadClass, "mainThread");
					plus.ios.invoke(mainThread, "exit");
				}
				// #endif
			},
			// 微信登录
			// wechatLogin() {
			// 	if (this.noClick) return
			// 	// #ifdef APP-PLUS
			// 	wxProviderLogin()
			// 		.then(res => {
			// 			// authResult: { openid, unionid, access_token, refresh_token, scope }
			// 			return wxGetUserInfo()
			// 		})
			// 		.then(res => {
			// 			// userInfo: { openId, nickName, gender, city, province, country, avatarUrl, unionId }
			// 			// this.$Toast(JSON.stringify(res), 5000)
			// 			console.log(res);
			// 			this.login(res)
			// 		})
			// 		.catch(err => {
			// 			this.$Toast(err.message ? err.message : typeof err === 'string' ? err : '微信登录失败')
			// 		})
			// 	// #endif
			// 	// #ifndef APP-PLUS
			// 	this.$Toast('请在APP端打开')
			// 	// #endif
			// },
			login(wxData) {
				this.$Loading('正在登录')
				const {
					gender,
					avatarUrl,
					openId,
					nickName
				} = wxData?.userInfo || {}
				const data = wxData ? {
					gender: gender == 1 ? '1002-10' : gender == 2 ? '1002-20' : '1002-30',
					avatar: avatarUrl,
					openId,
					nickName
				} : {
					name: this.name,
					password: this.password
				}
				uni.switchTab({
					url: '/pages/tab-bar/friends'
				})
				uni.hideLoading()
				/*this.$put({
					url: '',
					data
				}).then(res => {
						if (res.memberPhone) {
							this.$u.vuex('vuex_token', res.jwtResponseVO.token)
							this.$store.dispatch('getUserInfo')
									.then(() => {
										uni.reLaunch({
											url: '/pages/index/index'
										})
									})
						} else {
							uni.navigateTo({
								url: './login-step2?type=1',
								success: (handle) => {
									handle.eventChannel.emit('userData', { token: res.jwtResponseVO.token, memberId: res.id })
								}
							})
						}
						// }, 5000)
					})
					.finally(() => {
						uni.hideLoading()
					})*/
			},
			handleRegister() {
				console.log(1)
				uni.navigateTo({
					url: './register'
				})
			}
		}
	}
</script>

<style lang="scss">
	.register-line {
		width: 100%;
		margin: 20rpx auto 0rpx;
		color: $primaryColor;
		text-align: left;
		line-height: 48rpx;
		font-size: 32rpx;
		padding: 0 56rpx;
		text {
			margin-right: 12rpx;
		}
	}
	.login-page {
		width: 100vw;
		height: 100vh;
		background-size: 100% 100%;
		position: relative;

		.login-bg {
			width: 264rpx;
			height: 400rpx;
			position: absolute;
			top: 0rpx;
			right: 0rpx;
		}

		.top {
			width: 100%;
			height: 312rpx;
			padding-top: 128rpx;
			box-sizing: border-box;

			.title {
				margin-left: 56rpx;
				font-size: 56rpx;
				line-height: 80rpx;
				font-weight: bold;
				color: #111111;
			}
		}

		.form {
			padding: 0 56rpx;
			box-sizing: border-box;

			.form-item {
				height: 108rpx;
				position: relative;
				border-bottom: 1px solid #e0e0e0;

				.input {
					font-family: PingFang SC;
					color: #333;
					font-weight: normal;
					font-size: 34rpx;
					height: 100%;
					line-height: 104rpx;
					padding-right: 48rpx;
					box-sizing: border-box;
					border: 0;
					width: 100%;
					box-shadow: none;

					&:focus,
					&:focus-visible {
						border: none;
						outline: none;
					}
				}

				.suf-icon {
					position: absolute;
					right: 0;
					width: 44rpx;
					height: 44rpx;
					top: 30rpx;
				}

				.clean-text {
					background: url("/static/image/login/clean.png") no-repeat center center;
					background-size: 100% auto;
				}

				.show-password {
					background: url("/static/image/login/close.png") no-repeat center center;
					background-size: 100% auto;

					&.opened {
						background: url("/static/image/login/open.png") no-repeat center center;
						background-size: 100% auto;
					}
				}
			}
		}

		.login-phone {
			font-size: 32rpx;
			color: #B80201;
			font-weight: 400;
			padding-left: 56rpx;
			margin-top: 32rpx;
		}

		.bottom {
			margin-top: 82rpx;
			width: 100%;

			.login-btn {
				width: 100%;

				button {
					color: white;
					font-size: 36rpx;
					width: 550rpx;
					margin: 0 auto;
					height: 96rpx;
					border-radius: 48rpx;
					background: linear-gradient(to right, #D80100, #B80201);

					&:after {
						border: none
					}

					&[disabled] {
						background: rgba(255, 182, 181, 0.39);
					}
				}
			}

			.read-me {
				padding-top: 32rpx;
				text-align: center;
				color: #c0c0c0;
				line-height: 34rpx;

				.text {
					line-height: 48rpx;
					margin-left: 16rpx;
					color: #333
				}

				.check {
					margin-right: 16rpx;
					width: 32rpx;
					height: 32rpx;
					border: 1px solid #333;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;

					&.selected:before {
						content: '';
						width: 20rpx;
						height: 20rpx;
						border-radius: 50%;
						background: #333
					}
				}
			}

		}
	}

	.tip-modal-text {
		padding: 10rpx;
		font-size: 28rpx;
		font-weight: 400;
		line-height: 44rpx;
		color: #333333;
		text-align: left;

		.protocol {
			color: #2E6CF7;
		}
	}
</style>
