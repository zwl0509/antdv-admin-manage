<template>
	<view class="changeNumber">
		<u-navbar :title="type=='set' ?'设置手机号':'修改手机号'" :border-bottom="false" titleColor='#333333' >
		</u-navbar>
		<view class="content">
			<view class="content_y">
				<view class="phone_start" @click="showpicker">
					<text>{{current_start}}</text>
					<image  placeholder-style="color: #999999" src="/static/image/mine/account/down.png" mode=""></image>
				</view>
				<input type="number" maxlength="11" v-model="mobileNumber" class="input_phone" placeholder="请输入手机号" />
<!-- 				<image src="/static/image/mine/account/cha.png" mode="" v-if="mobileNumber.length" class="cha"
					@click="clearphone"></image> -->
			</view>
<!-- 			<view class="content_y">
				<input type="text" value="" class="input_code" placeholder="请输入验证码" />
				<view class="btn_code">
					获取验证码
				</view>
			</view> -->
		</view>
		<view class="btn" @click='setPhone'>
			提交
		</view>
		<u-picker v-model="show" :range="selector" @confirm='confirm' mode="selector"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				selector: ['+86', '+87', '+88'],
				current_start: '+86',
				mobileNumber: '',
				type: '',
				style:{
					color:'#999999'
				},
				phonetest: /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/,
			}
		},
		onLoad(options) {
			if (options.type) {
				this.type = options.type
			}
		},
		methods: {
			confirm(e) {
				this.current_start = this.selector[e[0]]
			},
			setPhone() {
				if (!this.phonetest.test(this.mobileNumber)) {
					this.$Toast("请输入正确手机号码")
					return
				}
				this.$post({
					url:this.api.AuthUser.updatePhone,
					data:{
						mobileNumber:this.mobileNumber
					}
				}).then(res=>{
					this.vuex_user.mobileNumber=this.mobileNumber
					this.$Toast('修改成功')
				})
				
			},
			showpicker() {
				this.show = true
			}
		}
	}
</script>

<style scoped lang="less">
	.changeNumber {
		.content {
			border-top: 20rpx solid #F6F6F6;
			padding: 0 56rpx;

			.content_y {
				height: 120rpx;
				display: flex;
				justify-content: space-between;
				border-bottom: 1rpx solid #E0E0E0;
				padding-top: 40rpx;
				align-items: center;

				.phone_start {
					display: flex;
					align-items: center;
					margin-right: 32rpx;

					text {
						font-size: 40rpx;
						font-weight: 400;
						color: #333333;
						margin-right: 10rpx;
					}

					image {
						width: 20rpx;
						height: 10rpx;
					}
				}

				.input_phone {
					width: 100%;
					height: 100%;
					border: none;
					outline: none;
					font-size: 34rpx;
					color: #333333;
					caret-color: red;
				}

				.cha {
					width: 54rpx;
					height: 54rpx;
					margin-left: 32rpx;
					flex-shrink: 0;
				}

				.input_code {
					width: 100%;
					height: 100%;
					border: none;
					outline: none;
					font-size: 34rpx;
					color: #333333;
					caret-color: red;
				}

				.btn_code {
					flex-shrink: 0;
					margin-left: 32rpx;
					width: 184rpx;
					height: 60rpx;
					border-radius: 48rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 26rpx;
					color: #FFFFFF;
					background: linear-gradient(to right, #D80100, #B80201);
				}
			}
		}

		.btn {
			width: 600rpx;
			height: 88rpx;
			border-radius: 48rpx;
			background: linear-gradient(to right, #D80100, #B80201);
			line-height: 88rpx;
			margin: auto;
			font-size: 32rpx;
			color: #FFFFFF;
			text-align: center;
			margin-top: 174rpx;
		}
	}
</style>
