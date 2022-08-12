<template>
	<view class="signin">
		<u-navbar title="巡检签到" title-width='500' :title-size='34' title-color='#333333' :titleBold="true"
			:border-bottom='false' class="navbar">
			<view slot='right' style="padding-right: 30rpx;color: #333333;font-size: 28rpx;" @click="torecord">
				巡检记录
			</view>
		</u-navbar>
		<view class="line">

		</view>
		<view class="sign">
			<view class="sign-text">
				<view class="sign-text-t">
					<view class="sign-text-t-l">
						<text class="info">新华苑18-2-1208 张先生</text>
						<text class="tip">最近的工地</text>
					</view>
					<image src="/static/image/workbench/customer-manage/down.png" mode=""></image>
				</view>
				<view class="sign-text-b">
					<image src="/static/image/workbench/product-dispatch/address.png" mode=""></image>
					<text>{{addressDetail}}</text>
				</view>
			</view>
			<view class="sign-btn">
				<text style="font-size: 40rpx;font-weight: bold;margin-bottom: 8rpx;">签到</text>
				<text>{{dateFormat(date)}}</text>
			</view>
			<view class="address">
				<image src="/static/image/workbench/product-dispatch/address.png" mode=""></image>
				<text>{{address}}</text>
			</view>
		</view>
		<view class="map">
			<map name="" :longitude="longitude" :latitude="latitude"></map>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				addressDetail:uni.getStorageSync('addressDetail'),
				address:uni.getStorageSync('address'),
				latitude:uni.getStorageSync('latitude'),
				longitude:uni.getStorageSync('longitude'),
				date: new Date().toISOString(),
			}
		},
		methods:{
			//获取时间
			dateFormat(time) {
				let date = new Date(time);
				let year = date.getFullYear();
				// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
				let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
				let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				// 拼接
				return hours + ":" + minutes;
				// return year + "-" + month + "-" + day;
			},
			torecord(){
				uni.navigateTo({
					url:'record'
				})
			}
		}
	}
</script>

<style>
	page {
		background: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.signin {
		.line {
			width: 100%;
			height: 20rpx;
		}

		.sign {
			width: 100%;
			height: 620rpx;
			background-color: #ffffff;
			padding: 0 30rpx;
			.sign-text{
				width: 100%;
				height: 156rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				border-bottom: 2rpx solid #F0F0F0;
				.sign-text-t{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.sign-text-t-l{
						display: flex;
						align-items: center;
						margin-bottom: 12rpx;
						.info{
							color: #333333;
							font-size: 30rpx;
							font-weight: bold;
							margin-right: 16rpx;
						}
						.tip{
							display: inline-block;
							width: 136rpx;
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							background-color: #FBE2E2;
							font-size: 24rpx;
							color: #B80201;
							border-radius: 8rpx;
						}
					}
					image{
						width: 20rpx;
						height: 12rpx;
					}
				}
				.sign-text-b{
					display: flex;
					align-items: center;
					image{
						width: 16rpx;
						height: 22rpx;
						margin-right: 16rpx;
					}
					text{
						color: #999999;
						font-size: 24rpx;
					}
				}
			}
			.sign-btn{
				width: 204rpx;
				height: 204rpx;
				border-radius: 50%;
				margin: auto;
				margin-top: 76rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: #ffffff;
				margin-bottom: 48rpx;
				background-color: #56D0A7;
			}
			.address{
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width: 19rpx;
					height: 26rpx;
					margin-right: 16rpx;
				}
				text{
					color: #333333;
					font-size: 32rpx;
				}
			}
		}
		.map{
			width: 100%;
			height: calc( 100vh - 88rpx - 20rpx - 620rpx - var(--status-bar-height));
			map{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
