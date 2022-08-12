<template>
	<view class="security-setting">
		<u-navbar title="安全设置" :border-bottom="false">
		</u-navbar>
		<view class="content">
			<view class="security-setting-y" @click="tocancellation">
				<text>注销账号</text>
				<image src="/static/image/mine/right.png" mode=""></image>
			</view>
		</view>

	</view>
</template>

<script>
	export default{
		methods:{
			tocancellation(){
				uni.navigateTo({
					url:'cancellation'
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.security-setting {


		.content {
			border-top: 20rpx solid #F6F6F6;

			.security-setting-y {
				width: 100%;
				height: 132rpx;
				border-bottom: 20rpx solid #F6F6F6;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;

				text {
					font-size: 32rpx;
					color: #333333;
					font-weight: 400;
				}

				image {
					width: 12rpx;
					height: 24rpx;
				}
			}
		}

	}
</style>
