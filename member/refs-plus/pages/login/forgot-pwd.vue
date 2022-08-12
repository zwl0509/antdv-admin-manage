<template>
	<view class="login-page">
		<view class="enterprise u-flex u-row-center u-col-top">
			<view class="go-back" @click="goBack">
				<image src="/static/image/common/go-back.png" mode="widthFix" class="go-back-icon"></image>
			</view>
			<view class="info u-flex u-flex-col u-row-center">
				<image src="/static/image/login/logo.png" mode="widthFix" class="logo"></image>
			</view>
		</view>
		<view class="verify-login">
			<view class="input-box u-flex u-row-left">
				<view class="icon-box u-flex u-row-center">
					<image src="../../static/image/login/phone.png" mode="widthFix" class="icon"></image>
				</view>
				<input type="digit" v-model="params.newPhoneNo" placeholder="请输入手机号" class="input"
					placeholder-style="color:#999999;font-size: 30rpx" maxlength="11" />
			</view>
			<view class="input-box u-flex u-row-left">
				<view class="icon-box u-flex u-row-center">
					<image src="../../static/image/login/verify.png" mode="widthFix" class="icon"></image>
				</view>
				<input type="digit" v-model="params.verificationCode" placeholder="请输入手机验证码" class="input"
					placeholder-style="color:#999999;font-size: 30rpx" maxlength="11" />
				<view class="send-code" @click="sendCode">
					<text v-if="!send_code">获取</text>
					<text v-else>{{ countdown }}秒</text>
				</view>
			</view>
			<view class="input-box u-flex u-row-left">
				<view class="icon-box u-flex u-row-center">
					<image src="../../static/image/login/pwd.png" mode="widthFix" class="icon"></image>
				</view>
				<input :password="true" v-model="params.newPassWord" placeholder="请设置您新的密码" class="input"
					placeholder-style="color:#999999;font-size: 30rpx" />
			</view>
			<!-- <view class="read-me fl-cc">
				<view class="check" :class="{selected: readMe}" @click="readMe = !readMe"></view>
				<text @click="readMe = !readMe">同意</text>
				<text class="text">《用户使用协议》</text>
			</view> -->
			<common-btn :widthNum="450" :marginNum="150" marginLeftNum="auto" :msg="'确认设置'" @click="handleSubmit"></common-btn>
		</view>
		<u-mask v-if="loading">
			<save-loading :loading="!loading" title="正在修改"></save-loading>
		</u-mask>
		<u-toast ref="utoast"></u-toast>
	</view>
</template>

<script>
	import api from '../../api'
	import constant from '../../utils/labels'
	export default {

		data() {
			return {
				params: {
					newPhoneNo: '',
					verificationCode: '',
					newPassWord: ''
				},
				send_code: false,
				countdown: 60,
				loading: false,
				// readMe:false
			}
		},
		methods: {
			sendCode(){
				if (this.is_send) {
					this.$Toast('请勿重复点击！');
					return false;
				}
				if (!this.send_code) {
					// console.log(this.params.newPhoneNo);
					if (!this.$u.test.mobile(this.params.newPhoneNo)) {
						this.$Toast('手机号码有误，请重填');
						return false;
					}
					// this.is_send = true;
					// this.timer = setInterval(() => {
					// 	this.countDown();
					// }, 1000);
					// this.send_code = true;
					// setTimeout(()=>{
					// 	this.$Toast('短信已发送，请注意查收！');
					// 	this.is_send = false;
					// },1000)
					this.verifyPhoneRegister()
				} else {
					this.$Toast('请勿重复发送短信！');
				}
			},
			verifyPhoneRegister () {
				this.$get({
					url: api.login.verifyPhoneRegister,
					data: { option: this.params.newPhoneNo }
				})
				.then(res => {
					// if (res) {
						this.timer = setInterval(() => {
							this.countDown();
						}, 1000);
						this.send_code = true
						this.$Toast('短信已发送，请注意查收！');
						// this.sendMessage()
					// } else {
					// 	this.is_send = false
					// 	this.$Toast('当前手机号码未注册！')
					// }
				}).catch(err => {
					this.is_send = false
				})
			},
			// sendMessage () {
			// 	this.$post({
			// 		url: api.login.newSendMsg,
			// 		data: {
			// 			code: 'sms-verification-code',
			// 			phone: this.params.newPhoneNo,
			// 			type: '1037-20',
			// 		}
			// 	}).then(res => {
			// 		uniCloud.callFunction({
			// 			name: 'sendCode',
			// 			data: res,
			// 			success: e => {
			// 				this.$Toast('短信已发送，请注意查收！');
			// 				this.is_send = false;
			// 			}
			// 		});
			// 	}).catch(err => {
			// 		this.is_send = false
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
			handleSubmit () {
				if (!this.params.newPhoneNo || !this.$u.test.mobile(this.params.newPhoneNo)) {
					this.$Toast('请输入正确的手机号')
					return
				}
				if (!this.params.verificationCode) {
					this.$Toast('请输入验证码')
					return
				}if (!this.params.newPassWord) {
					this.$Toast('请输入密码')
					return
				}
				this.loading = true
				const data = { ...this.params }
				if (!this.vuex_user || !this.vuex_user.id) {
					data.oldPhoneNo = data.newPhoneNo
					delete data.newPhoneNo
				}
				this.$put({
					url: api.member.resetPassword,
					data
				})
				.then(res => {
					this.loading = false
					this.$refs.utoast.show({
						title: '设置成功',
						type: 'success',
						callback: () => {
							uni.redirectTo({
								url: './login'
							})
						}
					})
				})
				.catch(() => {
					this.loading = false
					this.$Toast('设置失败')
				})
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	.login-page {
		width: 100vw;
		height: 100vh;

		.enterprise {
			width: 100%;
			height: 460rpx;
			background-image: url(../../static/image/login/login-bg.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			.go-back{
				position: fixed;
				top: calc(40rpx + var(--status-bar-height));
				z-index: 3;
				left: 40rpx;
				.go-back-icon{
					width: 22rpx;
					height: 36rpx;
				}
			}
			.info {
				margin-top: 90rpx;
				font-weight: 400;
				color: #FFFFFF;
				text-shadow: 0px 9rpx 13rpx rgba(115, 25, 141, 0.2);

				.logo {
					width: 253rpx;
				}

				&-name {
					font-size: 56rpx;
				}

				&-name-en {
					font-size: 30rpx;
				}
			}
		}

		.change {
			padding-top: 50rpx;
			color: #0060FF;
		}

		.verify-login {
			padding: 100rpx 70rpx 0 70rpx;

			.input-box {
				width: 100%;
				margin: 0 auto 30rpx;
				padding-right: 20rpx;
				height: 88rpx;
				background: #F5F5F5;
				border-radius: 44rpx;
				.icon-box {
					padding-right: 15rpx;
					padding-left: 38rpx;
					border-right: solid 1px rgba(256, 256, 256, 0.5);

					.icon {
						width: 30rpx;
					}
				}

				.input {
					padding-left: 15rpx;
					flex: 1;
					font-size: 30rpx;
				}

				.code-input {
					flex: 1;
				}

				.send-code {
					height: 46rpx;
					width: 170rpx;
					color: #0060FF;
					font-size: 28rpx;
					font-weight: 400;
					border-left: solid 2px #0060FF;
					text-align: center;
					line-height: 46rpx;
				}
			}
			.read-me{
				padding-top: 20rpx;
				text-align: center;
				.text{
					line-height: 48rpx;
					margin-left: 16rpx;
					color: $primaryColor
				}
				.check{
					margin-right: 16rpx;
					width: 32rpx;
					height: 32rpx;
					border: 1px solid $primaryColor;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					&.selected:before{
						content: '';
						width: 20rpx;
						height: 20rpx;
						border-radius: 50%;
						background: linear-gradient(0deg, #0060FF 0%, #11BFFF 100%);
					}
				}
			}
		}
	}
</style>
