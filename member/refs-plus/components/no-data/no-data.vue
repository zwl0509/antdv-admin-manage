<template>
	<view class="nodata">
		<image :src="iconPath" :style="{width: iconWidth,height:iconHeight}"></image>
		<view class="nodata-text">{{message}}</view>
		<view class="refresh-btn" v-if="refreshBtnEnable" @click="refresh">
			<text>刷新</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 提示语
			message: {
				type: String,
				default: '暂无数据'
			},

			// 缺省图
			iconPath: {
				type: String,
				default: ''
			},

			// 刷新按钮
			refreshBtnEnable: {
				type: Boolean,
				default: false
			},
			
			iconWidth: {
				type: String,
				default: ''
			},
			
			iconHeight: {
				type: String,
				default: ''
			},
		},
		data() {
			return {

			};
		},
		methods: {
			refresh() {
				this.$emit('refresh')
			}
		}
	}
</script>

<style lang="scss">
	.nodata {
		padding: 87rpx 0 250rpx;
		text-align: center;

		image {
			width: 490rpx;
			height: 300rpx;
			margin-bottom: 66rpx;
		}

		.nodata-text {
			font-size: 32rpx;
			font-weight: 500;
			color: #AAAAAA;
		}

		.refresh-btn {
			width: 333rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			background: linear-gradient(90deg, #00449B 0%, #34BDE7 100%);
			box-shadow: 0 7rpx 13rpx 0 rgba(0, 68, 155, 0.3);
			border-radius: 40rpx;
			margin: 80rpx auto 0;

			text {
				font-size: 36rpx;
				font-weight: 500;
				color: #FDFBFB;
			}
		}
	}
</style>
