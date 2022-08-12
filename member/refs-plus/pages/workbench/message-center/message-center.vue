<template>
	<view class="message-center">
		<u-navbar title="消息中心" :border='false' :titleBold='true' class="navbar" title-color='#333333'>
			<view class="slot-wrap" slot="right">
				<view class="" style="font-size: 26rpx;color: #333333;padding-right: 40rpx;" @click='allRead'>
					全部已读
					<!-- <text v-if='oldNum!=0'>{{oldNum > 99 ? '(99+)' : '('+oldNum+')'}}</text> -->
				</view>
			</view>
		</u-navbar>
		<view class="" style="padding-top: 24rpx;">
			<view class="content" v-for="(item,index) in List" :key="index" @tap="toPages(item)">
				<view class="detail">
					<view class="left fl-cc">
						<image :src="item.src" class="message-img"></image>
						<u-tag :text="item.unReadNumber" class="tips fl-cc" shape="circle" size="mini"
							:show="item.unReadNumber!=0 ? true : false "></u-tag>
						<view class="message">
							<view class="top fl-csb">
								<view class="title">{{item.typeName}}</view>
								<view class="time">{{item.sysMessageInfoVO.createdTime}}</view>
							</view>
							<view class="text">{{item.sysMessageInfoVO.message}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="" v-if="!List.length" style="padding-top:236rpx ;text-align: center;">
			<image src="/static/image/workbench/customer-manage/nodata.png" mode=""
				style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
			<view class="" style='color: #999999;font-size: 32rpx;'>
				空空如也~
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				List: [
					// {
					// 	src:'/static/image/workbench/message/system.png',
					// 	number:'3',
					// 	title:'系统消息',
					// 	text:'登录红蚂蚁，在这里奖励多多~',
					// 	time:'08:36'
					// },
					// {
					// 	src:'/static/image/workbench/message/construction.png',
					// 	number:'2',
					// 	title:'施工进度',
					// 	text:'今日施工内容：油工石膏板接缝处理',
					// 	time:'05/01'
					// },
					// {
					// 	src:'/static/image/workbench/message/change.png',
					// 	title:'工程变更',
					// 	number:'3',
					// 	text:'工地变更通知',
					// 	time:'2020/05/08'
					// },
					// {
					// 	src:'/static/image/workbench/message/notice.png',
					// 	number:'1',
					// 	title:'开工交底通知',
					// 	text:'王先生8月9号（周五）项目开工，请安排相...',
					// 	time:'2020/05/08'
					// },
					// {
					// 	src:'/static/image/workbench/message/acceptance.png',
					// 	number:'9',
					// 	title:'工地验收',
					// 	text:'今天瓦工工程验收，请项目经理跟进',
					// 	time:'2020/05/08'
					// }
				],
				show: true,
				oldNum: uni.getStorageSync('oldNum'), //未读数量
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList() {
				this.$get({
					url: this.api.SysMessage.getList
				}).then(res => {
					console.log(res)
					res.forEach(item => {
						if (item.type == '1065-20') {
							item.src = '/static/image/workbench/message/customer.png'
						}
						if (item.type == '1065-10') {
							item.src = '/static/image/workbench/message/system.png'
						}
						if (item.type == '1065-40') {
							item.src = '/static/image/workbench/message/customerService.png'
						}
						if (item.type == '1065-40') {
							item.src = '/static/image/workbench/message/constructionManagement.png'
						}
					})
					this.List = res
				})
			},
			toPages(item) {
				uni.navigateTo({
						url: 'message?type=' + item.type
					}),
					this.show = false
				// 处理ios清除角标
				//#ifdef APP-PLUS  
				if (this.vuex_platform) {
					var UIApplication = plus.ios.import("UIApplication");
					var app = UIApplication.sharedApplication();
					//获取应用图标的数量  
					// var oldNum = app.applicationIconBadgeNumber();  
					var newNum = this.oldNum - item.unReadNumber;
					//设置应用图标的数量  
					plus.runtime.setBadgeNumber(0);
					//导入个推原生类  
					var GeTuiSdk = plus.ios.importClass('GeTuiSdk');
					GeTuiSdk.setBadge(0);
				} else {
					plus.runtime.setBadgeNumber(-1);
				}
				//#endif  
			},
			allRead() {
				// 处理ios清除角标
				//#ifdef APP-PLUS  
				if (this.vuex_platform) {
					var UIApplication = plus.ios.import("UIApplication");
					var app = UIApplication.sharedApplication();
					//获取应用图标的数量  
					// var oldNum = app.applicationIconBadgeNumber();  
					// var newNum = oldNum - 1;  
					//设置应用图标的数量  
					plus.runtime.setBadgeNumber(0);
					//导入个推原生类  
					var GeTuiSdk = plus.ios.importClass('GeTuiSdk');
					GeTuiSdk.setBadge(0);
				} else {
					plus.runtime.setBadgeNumber(-1);
				}
				//#endif  
				this.$get({
					url: this.api.SysMessage.oneKeyRead
				}).then(res => {
					this.getList()
				})
			},
		}
	}
</script>
<style>
	page {
		background-color: #ffffff;
	}
</style>
<style lang="scss" scoped>
	.navbar {
		border-bottom: 20rpx solid #F8F8FB;
	}

	.message-center {
		width: 100%;
		height: 100vh;
		// background: rgba(248, 248, 251, 0.5);

		.content {
			width: 100%;
			padding: 0 30rpx;
			background-color: #FFFFFF;

			.detail {
				position: relative;
				height: 144rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;

				.left {
					width: 100%;
					position: relative;

					.message-img {
						width: 100rpx;
						height: 100rpx;
						flex-shrink: 0;
					}

					.tips {
						position: absolute;
						left: 64rpx;
						top: 22rpx;
						font-size: 18rpx;
						background-color: #E53E3D;
						border: none;
						width: 28rpx;
						height: 28rpx;
						color: #FFFFFF;
					}

					.message {
						width: 100%;
						padding-left: 24rpx;

						.top {
							width: 100%;

							.title {
								// padding-top: 28rpx;
								font-size: 30rpx;
								font-weight: bold;
								color: #333333;
								padding-bottom: 10rpx;
							}

							.time {
								font-size: 22rpx;
								font-weight: 400;
								color: #C0C0C0;

							}
						}

						.text {
							font-size: 26rpx;
							font-weight: 400;
							color: #999999;
						}
					}
				}

			}

		}
	}
</style>
