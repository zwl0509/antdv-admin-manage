<template>
	<view class="set_pw">
		<u-navbar title="设置智装账号" :border-bottom="false">
		</u-navbar>
		<view class="set_pw_content">
			<view class="set_pw_content_y">
				<view class="title">
					智装账号
				</view>
				<input type="text" maxlength="18" v-model="userCode" placeholder="请输入账号" class="input_pw" style="width: 100%;" />
				<!-- 				<view class="eyes" @click="showpw1=!showpw1">
					<image src="/static/image/mine/account/show-pw.png" mode="" v-if="showpw1"></image>
					<image src="/static/image/mine/account/hide-pw.png" mode="" v-else></image>
				</view> -->
			</view>
			<view class="set_pw_content_y">
				<view class="title">
					智装密码
				</view>
				<input type="text" maxlength="18" v-model="pwd" placeholder="请输入密码" class="input_pw" :password="!showpw2" />
				<view class="eyes" @click="showpw2=!showpw2">
					<image src="/static/image/mine/account/show-pw.png" mode="" v-if="showpw2"></image>
					<image src="/static/image/mine/account/hide-pw.png" mode="" v-else></image>
				</view>
			</view>
			<view :class="userCode.length&&pwd.length ? 'btn2' :'btn'" @click="uploadPw">
				确认
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isSetPw: true,
				showpw1: false,
				showpw2: false,
				userCode: '',
				pwd: '',
				reg: '^(?=.*\d)(?=.*[a-zA-Z]).{8,18}$',
				reg2: '/(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{6,16}$/'
			}
		},
		onLoad(options) {
			this.userCode=this.vuex_user.zhiAccount ? this.vuex_user.zhiAccount :''
			this.pwd=this.vuex_user.zhiPwd ? this.vuex_user.zhiPwd  :''
		},
		methods: {
			uploadPw() {
				if (!this.userCode.length || !this.pwd.length) {
					return
				}
				this.$post({
					url: this.api.AuthUser.setZhiZInfo,
					data: {
						userCode: this.userCode,
						pwd: this.pwd
					}
				}).then(res => {
					this.vuex_user.zhiAccount=this.userCode
					this.vuex_user.zhiPwd=this.pwd
					this.$Toast('设置成功')
					setTimeout(() => {
						uni.navigateBack({})
					}, 1000)

				})
			}
		}
	}
</script>

<style scoped lang="less">
	.set_pw {
		.set_pw_content {
			border-top: 20rpx solid #F6F6F6;
			padding: 0 56rpx;

			.set_pw_content_y {
				height: 120rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #E0E0E0;
				padding-top: 40rpx;

				.title {
					color: #333333;
					font-size: 34rpx;
					margin-right: 40rpx;
					width: 144rpx;
					flex-shrink: 0;
				}

				.input_pw {
					border: none;
					outline: none;
					font-size: 34rpx;
					color: #333333;
					width: 100%;
				}

				.eyes {
					margin-left: 40rpx;

					image {
						width: 44rpx;
						height: 44rpx;
					}
				}
			}

			.set_pw_content_e {
				margin-top: 20rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				line-height: 34rpx;
				color: #C0C0C0;
				opacity: 1;
				margin-bottom: 104rpx;
			}

			.btn {
				width: 600rpx;
				height: 88rpx;
				background: rgba(255, 182, 181, 0.39);
				opacity: 1;
				border-radius: 48rpx;
				margin: auto;
				line-height: 88rpx;
				text-align: center;
				font-size: 34rpx;
				color: #FFFFFF;
				margin-top: 30rpx;
			}

			.btn2 {
				width: 600rpx;
				height: 88rpx;
				background: linear-gradient(to right, #D80100, #B80201);
				opacity: 1;
				border-radius: 48rpx;
				margin: auto;
				line-height: 88rpx;
				text-align: center;
				font-size: 34rpx;
				color: #FFFFFF;
				margin-top: 30rpx;
			}
		}
	}
</style>
