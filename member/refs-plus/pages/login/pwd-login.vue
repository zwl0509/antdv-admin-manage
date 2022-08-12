<template>
	<view class="pwd-login">
		<view class="input-box u-flex u-row-left phone">
			<view class="icon-box u-flex u-row-center">
				<image src="" mode="widthFix" class="icon"></image>
			</view>
			<input
				type="digit"
				v-model="params.memberPhone"
				placeholder="请输入手机号"
				class="input "
				placeholder-style="color:#999999;font-size: 30rpx"
				maxlength="11"
			/>
		</view>
		<view class="input-box u-flex u-row-left">
			<view class="icon-box u-flex u-row-center">
				<image src="" mode="widthFix" class="icon"></image>
			</view>
			<input
				:password="true"
				:type="showPassword ? 'check': 'password'"
				v-model="params.loginPassword"
				placeholder="请输入您的密码"
				confirm-type="done"
				@confirm="handleLogin"
				class="input"
				placeholder-style="color:#999999;font-size: 30rpx"
			/>
			<view class="eye-icon">
				<view class="slot-icon" :class="{ 'open-eye': showPassword }" @click="handleEyePwd"></view>
			</view>
		</view>
		<view class="choose-box u-flex fl-csb">
			<view class="remember-me fl-cc">
				<view class="chose-box u-flex fl-cc">
					<view class="box" :class="{selected: rememberMe}" v-show="!rememberMe" @click="changeImg"></view>
					<image src="" v-show="rememberMe" @click="changeImg"></image>
				</view>
				<text class="text u-flex fl-cc">记住密码</text>
			</view>
			<view class="forgot-pwd" @click="toForgotPwd">忘记密码？</view>
		</view>
		<view class="read-me fl-cc">
			<view class="check" :class="{selected: readMe}" @click="readMe = !readMe"></view>
			<text>同意</text>
			<text class="text">《用户使用协议》</text>
		</view>
		<common-btn :widthNum="600" :marginNum="150" :msg="'登录'" @click="handleLogin"></common-btn>
		<u-mask v-if="loading">
			<save-loading :loading="!loading" title="正在登录"></save-loading>
		</u-mask>
	</view>
</template>

<script>
	import api from '@/api'
	import { getUserInfo } from '@/utils/common'
	export default {
		props: {
			userInfo: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				params: {
					memberPhone: '',
					loginPassword: '',
					clientId: '',
					loginType: '1005-20'
				},
				showPassword: false,
				value:'',
				loading: false,
				rememberMe: false,
				readMe:false
			}
		},
		created () {
			if (this.userInfo) {
				this.params.memberPhone = this.userInfo.memberPhone
			} else if (this.vuex_user.phoneNumber) {
				this.params.memberPhone = this.vuex_user.phoneNumber
			}
		},
		methods: {
			toForgotPwd(){
				uni.navigateTo({
					url: "/pages/login/forgot-pwd"
				})
			},
			handleLogin () {
				if (!this.params.memberPhone || !this.$u.test.mobile(this.params.memberPhone)) {
					this.$Toast('请输入正确的手机号')
					return
				}
				if (!this.params.loginPassword) {
					this.$Toast('请输入密码')
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
					// uni.setStorageSync(constant.tokenName, res.token)
					setTimeout(()=>{
						getUserInfo(true,true)
						.catch((e) => {
							// this.$Toast(typeof e === 'string' ? e : (e.message || '获取用户信息失败'))
						})
						// this.getUserInfo()
					},100)
					uni.switchTab({
						// url: '/pages/home-v1/home-v1'
						url:'/pages/index/index'
					})
				})
				.catch(() => {
					this.loading = false
					// this.$Toast('登录失败')
				})
			},
			handleEyePwd(){
				this.showPassword = !this.showPassword
			},
			changeImg:function () {
				this.rememberMe = !this.rememberMe;
			},
		},
		watch: {
			userInfo (v) {
				if (v) {
					this.params.memberPhone = v.memberPhone
				}
			}
		}
	}
</script>

<style lang="scss">
	.pwd-login{
		padding: 100rpx 70rpx 0 70rpx;
		.input-box{
			width: 100%;
			height: 88rpx;
			background: #F5F5F5;
			box-shadow: 0 0 0px 1000px #F5F5F5 inset;
			margin: 0 auto 30rpx;
			border-radius: 44rpx;
			.icon-box{
				padding-right: 15rpx;
				padding-left: 38rpx;
				border-right: solid 1px rgba(256,256,256,0.5);
				.icon{
					width: 30rpx;
				}
			}
			.check{
				border: none;
			}
			.input{
				border: none;
				background-color: #F5F5F5;
				box-shadow: 0 0 0px 1000px #F5F5F5 inset;
				padding-left: 15rpx;
				flex: 1;
				font-size: 30rpx;
				outline: none;

			}

			.eye-icon{
				width: 107rpx;
				.slot-icon{
					margin-left: 32rpx;
					/*size: 44rpx;*/
					/*color:#0063FE;*/
					width: 35rpx;
					height: 35rpx;
					background: url("@/static/image/login/close-eye.png") no-repeat center center;
					background-size: 100% auto;
					&.open-eye{
						background: url("@/static/image/login/open-eye.png") no-repeat center center;
						background-size: 100% auto;
					}
				}
			}
			.code-input{
				flex: 1;
			}
			.send-code{
				width: 140rpx;
				color: #1FA6D9;
				font-size: 24rpx;
				font-weight: 400;
				border-left: solid 1px #FFFFFF;
				line-height: 24rpx;
				padding-left: 10rpx;
				text-align: center;
			}
		}
		.choose-box{
			.remember-me{
				text-align: center;
				.text{
					line-height: 48rpx;
					margin-left: 16rpx;
					color: $primaryColor
				}
				.chose-box{
					padding-left: 36rpx;
					.box{
						width: 32rpx;
						height: 32rpx;
						border: 1px solid #0060FF;
						border-radius: 8rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					image{
						width: 32rpx;
						height: 32rpx;
					}
				}
				.text{
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;
				}
			}
			.forgot-pwd{
				padding-left: 10rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: #999999;
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
</style>
