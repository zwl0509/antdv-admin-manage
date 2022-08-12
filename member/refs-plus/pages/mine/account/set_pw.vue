<template>
	<view class="set_pw">
		<u-navbar :title="isSetPw==true ? '修改密码': '设置密码'" :border-bottom="false">
		</u-navbar>
		<view class="set_pw_content">
			<view class="set_pw_content_y">
				<view class="title" :style="isSetPw==true ? '':'width:144rpx'">
					{{isSetPw==true ? '原密码': '密码'}}
				</view>
				<input type="text" v-model="oldPassword" placeholder="请输入密码" class="input_pw" :password="!showpw1" />
				<view class="eyes" @click="showpw1=!showpw1">
					<image src="/static/image/mine/account/show-pw.png" mode="" v-if="showpw1"></image>
					<image src="/static/image/mine/account/hide-pw.png" mode="" v-else></image>
				</view>
			</view>
			<view class="set_pw_content_y">
				<view class="title" :style="isSetPw==true ? '':'width:144rpx'">
					{{isSetPw==true ? '新密码': '确认密码'}}
				</view>
				<input type="text" v-model="newPassword" placeholder="请确认密码" class="input_pw" :password="!showpw2" />
				<view class="eyes" @click="showpw2=!showpw2">
					<image src="/static/image/mine/account/show-pw.png" mode="" v-if="showpw2"></image>
					<image src="/static/image/mine/account/hide-pw.png" mode="" v-else></image>
				</view>
			</view>
			<!-- 			<view class="set_pw_content_e">
				密码长度8-18位，须包含英文字母、数字或符号至少2种或
				以上元素
			</view> -->
			<view :class="oldPassword.length&&newPassword.length ? 'btn2' :'btn'" @click="uploadPw">
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
				oldPassword: '',
				newPassword: '',
				reg: '^(?=.*\d)(?=.*[a-zA-Z]).{8,18}$',
				reg2: '/(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{6,16}$/'
			}
		},
		onLoad(options) {
			if (options.isSetPw) {
				this.isSetPw = options.isSetPw
			}
		},
		methods: {
			uploadPw() {
				if (!this.oldPassword.length || !this.newPassword.length) {
					return
				}
				this.$post({
					url: this.api.AuthUser.updatePw,
					data: {
						oldPassword: this.oldPassword,
						newPassword: this.newPassword
					}
				}).then(res => {
					this.$Toast('修改密码成功')
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
					width: 102rpx;
				}

				.input_pw {
					border: none;
					outline: none;
					font-size: 34rpx;
					color: #333333;
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
