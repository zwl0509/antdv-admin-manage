<template>
	<view class="login-page">
		<u-navbar title="" :background="background" :border-bottom='false' :custom-back='goBack'></u-navbar>
		<view class="top">
			<view class="title">
				<text>登录后更精彩</text>
			</view>
		</view>
		<image src="/static/image/login/bg.png" mode="" class="login-bg"></image>
		<view class="form">
			<view class="form-item">
				<input class="input" type="text" v-model="name" placeholder="请输入您的手机号"
					placeholder-style="font-size: 34rpx" />
				<view class="suf-icon clean-text" v-if="name && !noClick" @click="() => name = ''"></view>
			</view>
			<view class="form-item">
				<input class="input" v-model="password" type="text" placeholder="请输入验证码"
					placeholder-style="font-size: 34rpx" />
				<image src="/static/image/login/getcode.png" mode="" class="suf-icon2" v-if="!send_code&&name.length!=0" @click="sendCode"></image>
				<view class="suf-icon3" v-else>
					{{send_code ? countdown+'秒后重发':'获取验证码'}}
				</view>
			</view>
		</view>
		<view class="login-phone" @click="tologin">
			密码登录
		</view>
		<view class="bottom">
			<view class="login-btn">
				<button :disabled="!name || !password || !readMe || noClick" @click="handleLogin">登录</button>
			</view>
			<view>
				<view class="read-me fl-cc" style="margin-bottom: 30rpx;">
					<view class="check" :class="{selected: readMe}" @click="readMe = !readMe"></view>
					<text>已阅读并同意</text>
					<text class="text">《用户使用协议》</text>&
					<text class="text" style="margin-left: 0">《隐私协议》</text>
				</view>
			</view>
			<view class="divider-line">
				<u-divider border-color="#131E34" color="#131E34" bg-color="transparent" fontSize="28" half-width="96"
					:use-slot="true">
					<view class="wechat-icon" @click="wechatLogin"></view>
				</u-divider>
			</view>
		</view>
		<tip-modal ref="tipModal" title="温馨提示" cancelText="不同意" confirmText="同意" @cancel="cancel" @confirm="confirm">
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
		</tip-modal>
	</view>
</template>

<script>
	import {
		wxGetUserInfo,
		wxProviderLogin
	} from '../../utils/weixin/auth'

	export default {
		data() {
			return {
				noClick: false,
				name: '',
				password: '',
				showPwd: false,
				readMe: false,
				send_code: false,
				countdown: 60
			};
		},
		onLoad(params = {}) {
			if (params.outOfDate) {
				this.$Toast('登录已过期')
			}
		},
		onReady() {
			let ISPRIVACY = uni.getStorageSync('ISPRIVACY');
			if (!ISPRIVACY) {
				this.$refs.tipModal.visible = true
			}
		},
		methods: {
			goBack() {
				// uni.navigateBack({
				// 	delta: 2
				// })
				uni.switchTab({
					// url: '/pages/home-v1/home-v1'
					url:'/pages/tab-bar/friends'
				})
			},
			tologin(){
				uni.navigateTo({
					url:'login'
				})
			},
			toPage(url) {
				uni.navigateTo({
					url: '/pages/mine/about-us/' + url
				})
			},
			handleLogin() {
				if (this.name && this.password && this.readMe && !this.noClick)
					this.login()
			},
			confirm() {
				this.$refs.tipModal.visible = false
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
			wechatLogin() {
				if (this.noClick) return
				// #ifdef APP-PLUS
				wxProviderLogin()
					.then(res => {
						// authResult: { openid, unionid, access_token, refresh_token, scope }
						return wxGetUserInfo()
					})
					.then(res => {
						// userInfo: { openId, nickName, gender, city, province, country, avatarUrl, unionId }
						// this.$Toast(JSON.stringify(res), 5000)
						console.log(res);
						this.login(res)
					})
					.catch(err => {
						this.$Toast(err.message ? err.message : typeof err === 'string' ? err : '微信登录失败')
					})
				// #endif
				// #ifndef APP-PLUS
				this.$Toast('请在APP端打开')
				// #endif
			},
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
			sendCode() {
				if (this.is_send) {
					this.$Toast('请勿重复点击！');
					return false;
				}
				if (!this.send_code) {
					// if (!this.$u.test.mobile(this.params.memberPhone)) {
					// 	this.$Toast('手机号码有误，请重填');
					// 	return false;
					// }
					// this.verifyPhoneRegister()
						this.timer = setInterval(() => {
							this.countDown();
						}, 1000);
						this.send_code = true
						this.$Toast('短信已发送，请注意查收！');
						// this.sendMessage()
				} else {
					this.$Toast('请勿重复发送短信！');
				}
			},
			verifyPhoneRegister() {
				this.$get({
						url: api.login.verifyPhoneRegister,
						data: {
							option: this.params.memberPhone
						}
					})
					.then(res => {
						if (res) {
							this.timer = setInterval(() => {
								this.countDown();
							}, 1000);
							this.send_code = true
							this.$Toast('短信已发送，请注意查收！');
							// this.sendMessage()
						} else {
							this.is_send = false
							this.$Toast('当前手机号码未注册！')
						}
					}).catch(err => {
						this.is_send = false
					})
			},
			// sendMessage () {
			// 	this.$post({
			// 		url: api.login.newSendMsg,
			// 		data: {
			// 			code: 'sms-verification-code',
			// 			phone: this.params.memberPhone,
			// 			type: '1037-20',
			// 		}
			// 	})
			// 	.then(res => {
			// 		console.log(res);
			// 		uniCloud.callFunction({
			// 			name: 'sendCode',
			// 			data: res,
			// 			success: e => {
			// 				this.$Toast('短信已发送，请注意查收！');
			// 				this.is_send = false;
			// 			},
			// 			complete(r) {
			// 				console.log(r);
			// 			}
			// 		});
			// 	}).catch(() => {
			// 		this.send_code = false
			// 		clearInterval(this.timer)
			// 	})
			// },
			countDown() {
				if (this.countdown) {
					this.countdown--;
				} else {
					clearInterval(this.timer);
					this.send_code = false;
					this.countdown = 59;
				}
			},
			handleLogin() {
				if (!this.params.memberPhone || !this.$u.test.mobile(this.params.memberPhone)) {
					this.$Toast('请输入正确的手机号')
					return
				}
				if (!this.params.verificationCode) {
					this.$Toast('请输入验证码')
					return
				}

				if (!this.readMe) {
					this.$Toast('请同意用户使用协议')
					return
				}

				let clientId = ''
				// #ifdef APP-PLUS
				// const clientInfo = plus.push.getClientInfo()
				// clientId = clientInfo.clientid
				// #endif
				this.params.clientId = clientId
				this.loading = true
				this.$post({
						url: api.login.login,
						data: this.params
					})
					.then(res => {
						this.loading = false
						getApp().globalData.tabBarPage = [true, true, true, true, true]
						this.$u.vuex('vuex_login', true)
						this.$u.vuex('vuex_token', res.token)
						getUserInfo(true, true)
							.catch((e) => {
								// this.$Toast(typeof e === 'string' ? e : (e.message || '获取用户信息失败'))
							})
						// uni.setStorageSync(constant.tokenName, res.token)
						uni.switchTab({
							// url: '/pages/home-v1/home-v1'
							url: '/pages/index/index'
						})
					})
					.catch(() => {
						this.loading = false
						this.$Toast('登录失败')
					})
			}
		}
	}
</script>

<style lang="scss">
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
				.suf-icon2{
					position: absolute;
					right: 0;
					width: 184rpx;
					height: 60rpx;
					top: 30rpx;
					
				}
				.suf-icon3{
					position: absolute;
					right: 0;
					top: 30rpx;
					width: 184rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 26rpx;
					color: #999999;
					font-weight: 400;
					background: rgba(240, 240, 240, 0.39);
					opacity: 1;
					border-radius: 48px;
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

			.divider-line {
				position: absolute;
				bottom: 118rpx;
				width: 100%;
			}

			.wechat-icon {
				margin: 0 40rpx;
				width: 80rpx;
				height: 80rpx;
				background: url("/static/image/login/weixin.png") no-repeat center center;
				background-size: 100% auto;
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