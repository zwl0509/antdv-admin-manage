<template>
	<view class="repair">
		<u-navbar title="报修记录" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333'>
		</u-navbar>
		<view class="customer-info">
			<view class="customer-info-content">
				<view class="title">
					<view class="title-l">
						<image src="/static/image/workbench/customer-complaints/raplier.png" mode=""></image>
						<text>
							工人未按时到场施工
						</text>
					</view>
					<view class="title-r">
						待处理
					</view>
				</view>
				<view class="content">
					一、装修材料未按时送达，导致工期延后, 且装修工人存
					在消极怠工情况，未按约定时间完成。后期造成费用...
				</view>
				<view class="imgs">
					<image src="/static/image/workbench/construction-manage/img1.png" mode="" v-for="n in 3"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>
<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.customer-info {
		width: 100%;
		background-color: #FFFFFF;
		padding: 24rpx 30rpx 32rpx 24rpx;
		margin-top: 20rpx;
		.customer-info-user {
			width: 100%;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-bottom: 40rpx;
	
			.userinfo {
				display: flex;
				align-items: center;
	
				image {
					width: 76rpx;
					height: 76rpx;
					margin-right: 20rpx;
				}
	
				.userinfo-r {
					height: 76rpx;
					display: flex;
					flex-direction: column;
	
					.userinfo-r-t {
						color: #333333;
						font-size: 28rpx;
					}
	
					.userinfo-r-b {
						display: flex;
						align-items: center;
						font-size: 24rpx;
						color: #999999;
	
						image {
							width: 18rpx;
							height: 24rpx;
							margin-right: 12rpx;
						}
					}
				}
			}
	
			.status {
				font-size: 28rpx;
				color: #B80201;
	
			}
		}
	
		.customer-info-content {
			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 16rpx;
	
				.title-l {
					display: flex;
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
					align-items: center;
	
					image {
						width: 28rpx;
						height: 32rpx;
						margin-right: 12rpx;
					}
				}
	
				.title-r {
					color: #B80201;
					font-size: 28rpx;
				}
			}
	
			.content {
				font-size: 28rpx;
				font-weight: 500;
				line-height: 40rpx;
				color: #333333;
				margin-bottom: 24rpx;
				position: relative;
	
				.open {
					position: absolute;
					bottom: 0rpx;
					right: 0rpx;
					color: #333333;
					font-size: 28rpx;
					font-weight: bold;
				}
			}
	
			.imgs {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
	
				image {
					height: 222rpx;
					width: 222rpx;
					margin-right: 12rpx;
					border-radius: 8rpx;
	
					&:nth-child(3n) {
						margin: 0;
					}
				}
			}
		}
	}
</style>