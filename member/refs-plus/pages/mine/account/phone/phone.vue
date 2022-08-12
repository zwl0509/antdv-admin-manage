<template>
	<view class="phone">
		<u-navbar title="绑定手机" :border-bottom="false">
		</u-navbar>
		<view class="content">
			<view class="phone_img">
				<image src="/static/image/mine/account/phone_img.png" mode="" ></image>
			</view>
			<view class="phone">
				<text class="left">你的手机号</text>
				<text class="right">{{vuex_user.mobileNumber}}</text>
			</view>
			<view class="btn" @click="tochange">
				更改手机号
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			tochange(){
				uni.navigateTo({
					url:'changeNumber'
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.phone{
		.content{
			border-top: 20rpx solid #F6F6F6;
			padding-top: 88rpx;
			.phone_img{
				text-align: center;
				image{
					width: 128rpx;
					height: 174rpx;
					margin: auto;
				}
				margin-bottom: 48rpx;
			}
			.phone{
				text-align: center;
				font-size: 32rpx;
				color: #333333;
				margin-bottom: 16rpx;
				.left{
					font-weight: 400;
				}
				.right{
					font-weight: bold;
					margin-left: 16rpx;
				}
				margin-bottom: 160rpx;
			}
			.status{
				color: #999999;
				font-size: 24rpx;
				text-align: center;
				margin-bottom: 160rpx;
			}
			.btn{
				width: 600rpx;
				height: 88rpx;
				border-radius: 48rpx;
				background:linear-gradient(to right, #D80100 , #B80201);
				line-height: 88rpx;
				margin: auto;
				font-size: 32rpx;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
</style>
