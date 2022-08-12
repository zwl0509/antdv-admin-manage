<template>
	<view class="fine-list">
		<u-navbar title="罚款记录" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333'>
		</u-navbar>
		<view class="center">
			<view class="center-y">
				<view class="center-y-l">
					<text>罚款金额</text><text style="color: #B80201;">198</text>
				</view>
				<view class="center-y-r">
					2022-05-07
				</view>
			</view>
			<view class="center-e">
				<text>发起人</text>
				<text>亿数测试账号</text>
			</view>
			<view class="center-e">
				<text>负责人</text>
				<text>张文国</text>
			</view>
			<view class="center-e" style="margin-bottom: 20rpx;">
				<text>罚款图片</text>
			</view>
			<view class="center-imgs">
				<image src="/static/image/workbench/construction-manage/img1.png" mode=""></image>
			</view>
			<view class="center-e">
				<text>备注: 故意闯红灯</text>
			</view>
		</view>
	</view>
</template>

<script>
</script>
<style>
	page {
		background-color: #F6F6F6;
	}
</style>
<style scoped lang="less">
	.fine-list {
		.center {
			margin-top: 20rpx;
			padding: 30rpx;
			background-color: #fff;
			.center-y {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 6rpx;

				.center-y-l {
					color: #333333;
					font-size: 32rpx;
				}

				.center-y-r {
					color: #999999;
					font-size: 28rpx;
				}
			}

			.center-e {
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #333333;
				font-size: 26rpx;
				margin-top: 24rpx;
			}

			.center-imgs {
				display: flex;
				align-items: center;
				image{
					width: 222rpx;
					height: 222rpx;
					border-radius: 8rpx;
					margin-right: 12rpx;
					&:nth-child(3n){
						margin-right: 0;
					}
				}
			}
		}
	}
</style>
