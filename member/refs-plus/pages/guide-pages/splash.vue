<template>
	<view class="splash">
		<image src="/static/image/guide/splash-new.png" class="splash-img"></image>
		<view class="splash-logo">
			<!-- <image src="../../static/image/logo.png"></image> -->
			<view class="app-name">红蚂蚁+</view>
		</view>
		<view class="identification">
			<view class="company-name"></view>
			<view class="company-website"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onShow() {
			let not_first_flag = !!uni.getStorageSync('vuex_token');
			if(!not_first_flag){
				// setTimeout(function() {
				// 	uni.reLaunch({
				// 		url:'/pages/login/login'
				// 	})
				// }, 2500)
				setTimeout(function() {
					uni.switchTab({
						url:'/pages/tab-bar/workbench'
					})
				}, 2500)
			}else{
				setTimeout(function() {
					uni.switchTab({
						url:'/pages/tab-bar/workbench'
					})
				}, 2500)
			}
		},
		methods: {
		}
	}
</script>

<style scoped lang="scss">
	.splash{
		width: 100%;
		height: 100vh;
		position: relative;
		text-align: center;
		letter-spacing: 6rpx;
		.splash-img{
			width: 100vw;
			height: 100vh;
		}

		.splash-logo {
			width: 100%;
			position: absolute;
			top: 32.78%;

			image {
				width: 200rpx;
				height: 200rpx;
			}

			.app-name {
				margin-top: 50rpx;
				font-size: 48rpx;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 48rpx;
			}
		}

		.identification {
			width: 100%;
			position: absolute;
			bottom: 60rpx;
			font-weight: 500;
			color: #333333;

			.company-name {
				font-size: 22rpx;
			}

			.company-website {
				margin-top: 10rpx;
				font-size: 20rpx;
			}
		}
	}
</style>
