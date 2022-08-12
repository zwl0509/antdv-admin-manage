<template>
	<view class="guide-page">
		<view class="jump-over" @click="toHome">跳过</view>
		<swiper class="swiper" :indicator-dots="true" :autoplay="false" indicator-active-color="#FFFFFF"
			indicator-color="#FFFFFF" mode="dot">
			<swiper-item v-for="(item,index) in guide_list" :key="index">
				<view class="swiper-item">
					<image :src="item.image" mode="heightFix" class="guide-img"></image>
				</view>
				<view class="describe">
					<view class="guide-title">{{ item.title }}</view>
					<view class="guide-detail">{{ item.detail }}</view>
				</view>
				<view class="go-home u-flex u-row-center" v-if="index == 1" @click="toHome">
					开启体验
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				guide_list: [{
						image: '/static/image/guide/guide1.png',
						title:'资源整合',
						detail:'全面一体化管理的管理信息系统'
					},
					// {
					// 	image: '/static/image/guide/guide2.png',
					// 	title:'系统管理',
					// 	detail:'有效利用外部资源，使企业利润最大化'
					// },
					// {
					// 	image: '/static/image/guide/guide3.png',
					// 	title:'掌上ERP',
					// 	detail:'查询和归纳大量的原始记录'
					// },
				]
			}
		},
		methods: {
			toHome() {
				uni.switchTab({
					url:'/pages/tab-bar/workbench'
				})

			}
		}
	}
</script>

<style scoped lang="scss">
	/deep/ .uni-swiper-dots {
		bottom: 50rpx;
	}

	/deep/ .uni-swiper-dot {
		width: 20rpx;
		height: 20rpx;
	}

	/deep/ .uni-swiper-dot-active {
		width: 58rpx;
		height: 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
	}

	.guide-page {
		width: 100%;
		height: 100vh;
		position: relative;

		.jump-over {
			position: fixed;
			top: 92rpx;
			right: 42rpx;
			width: 88rpx;
			height: 88rpx;
			background: #ffffff;
			text-align: center;
			line-height: 88rpx;
			opacity: 0.9;
			border-radius: 50%;
			font-weight: bold;
			color: #3380FF;
			font-size: 26rpx;
			font-weight: 400;
			z-index: 9999999;
		}

		.swiper {
			width: 100%;
			height: 100%;

			.swiper-item {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.describe {
			width: 100%;
			position: absolute;
			left: 0;
			top: 150rpx;
			text-align: center;

			.guide-title {
				font-size: 80rpx;
				font-weight: 500;
				font-style: italic;
				color: #FFFFFF;
				text-shadow: 0px 6px 6px rgba(56, 82, 126, 0.6);
				letter-spacing: 10rpx;
			}

			.guide-detail {
				margin-top: 20rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #F1F1F1;
				line-height: 44rpx;
				letter-spacing: 4rpx;
			}
		}


		.go-home {
			width: 54%;
			height: 100rpx;
			background: #FFFFFF;
			border-radius: 50rpx;
			position: absolute;
			bottom: 10%;
			left: 23%;
			font-size: 36rpx;
			font-weight: bold;
			color: #3380FF;
			z-index: 666;
			letter-spacing: 4rpx;
		}
	}
</style>
