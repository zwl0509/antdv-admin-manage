<template>
	<view class="cancellation">
		<u-navbar title="注销账号" :border-bottom="false">
		</u-navbar>
		<view class="content">
			<view class="top">
				<image src="/static/image/mine/cancellation.png" mode=""></image>
				<view class="">
					申请注销红蚂蚁账号
				</view>
			</view>
			<view class="warning">
				账号一旦注销将无法登录红蚂蚁，且所有的数据将无法找回，请
				您谨慎操作！
			</view>
			<view class="center">
				<view class="rule">
					<view class="rule-y">
						<view class="rule-y-title">
							1、账号处于安全状态
							<view class="heng">

							</view>
						</view>
						<view class="rule-y-content">
							账号注销的前提是你的账号没有被盗、被封和违规等风险。
						</view>
					</view>
					<view class="rule-y">
						<view class="rule-y-title">
							2、账号内的已创建内容将被清除
							<view class="heng">

							</view>
						</view>
						<view class="rule-y-content">
							账号注销后，会清空账号所有的身份信息和账号信息：包括
							但不限于用户名、认证和密保手机号、微信，以及接触该账
							号对外授权的绑定关系。该操作不可逆，请谨慎操作。
						</view>
					</view>
					<view class="rule-y">
						<view class="rule-y-title">
							3、账号内的已创建内容将被清除
							<view class="heng">

							</view>
						</view>
						<view class="rule-y-content">
							账号注销后，会清空账号所有的包括但不限于APP端及PC
							端导入的文本、创建的文本、文件夹等。
						</view>
					</view>
					<view class="rule-y">
						<view class="rule-y-title">
							4、账号内的权益将被清除
							<view class="heng">

							</view>
						</view>
						<view class="rule-y-content">
							账号注销后，优惠券、会员权益、推荐官收益等将被清除且
							无法恢复。
						</view>
					</view>
					<view class="rule-y">
						<view class="rule-y-title">
							5、相关平台的同一账号被注销
							<view class="heng">

							</view>
						</view>
						<view class="rule-y-content">
							与红蚂蚁相关的红蚂蚁官网、PC端创作者中心数据将一并
							进行注销。
						</view>
					</view>
				</view>
			</view>

			<view class="bottom">
				<view class="agreement" @click="agree=!agree">
					<image src="/static/image/mine/dian.png" mode="" class="agreement_agree" v-if="agree"></image>
					<view class="agreement_disagree" v-else>

					</view>
					<view class="agreement_text">
						<text style="color: #333333;">阅读并同意</text>
						<text style="color: #B80201;">《红蚂蚁账号注销协议》</text>
					</view>
				</view>
				<view :class="agree ? 'btn2':'btn'" @click="del">
					注销账号
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agree: false
			}
		},
		methods:{
			del(){
				if(this.agree){
					this.$del({
						url:this.api.Employee.delEmployee,
						data:{
							id:this.vuex_user.id
						}
					}).then(res=>{
						this.$Toast('注销成功')
						// this.remark = ''
						setTimeout(function() {
							uni.navigateTo({
								url:'../../login/login'
							})
						}, 1000)
					})
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.cancellation {
		padding-bottom: 110rpx;
		background-color: #F8F8FB;

		.content {
			.top {
				text-align: center;
				padding-top: 40rpx;
				margin-bottom: 20rpx;

				image {
					width: 88rpx;
					height: 92rpx;
					margin-bottom: 24rpx;
				}

				view {
					font-size: 28rpx;
					font-weight: bold;
					color: #000000;
				}
			}

			.warning {
				background-color: #F6EBEE;
				width: 100%;
				height: 104rpx;
				padding: 18rpx 30rpx;
				line-height: 38rpx;
				color: #B80201;
				font-size: 24rpx;
				font-weight: 400;
				margin-bottom: 24rpx;
			}

			.center {
				padding: 0 30rpx;

				.rule {
					width: 100%;
					// height: 726rpx;
					background: #FFFFFF;
					opacity: 1;
					border-radius: 16rpx;
					margin: auto;
					padding: 24rpx 32rpx;

					.rule-y {
						margin-bottom: 22rpx;

						.rule-y-title {
							position: relative;
							color: #333333;
							font-size: 28rpx;
							font-weight: bold;
							margin-bottom: 10rpx;

							.heng {
								width: 32rpx;
								height: 8rpx;
								background: #B80201;
								border-radius: 4rpx;
								position: absolute;
								bottom: 0rpx;
								left: 0rpx;
							}
						}

						.rule-y-content {
							color: #999999;
							font-size: 24rpx;
							line-height: 34rpx;
						}
					}
				}
			}

			.bottom {
				margin-top: 96rpx;

				.agreement {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 24rpx;

					.agreement_agree {
						width: 28rpx;
						height: 28rpx;
						margin-right: 16rpx;
					}

					.agreement_disagree {
						width: 28rpx;
						height: 28rpx;
						border: 2rpx solid #B80201;
						border-radius: 50%;
						margin-right: 16rpx;
					}

					.agreement_text {
						font-size: 24rpx;
						font-weight: 400;
					}
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
	}
</style>
