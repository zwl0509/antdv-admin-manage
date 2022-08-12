<template>
	<view class="data-detail">
		<u-navbar title="材料详情" :border='false' :titleBold='true' title-size="34" class="navbar" title-color='#333333'>
		</u-navbar>
		<view class="store-info">
			<image src="/static/image/workbench/renovation-data/img.png" mode=""></image>
			<view class="info">
				<view class="info-name">
					{{list.materialName}}
				</view>
				<view class="info-tip">
					<view class="">
						{{ list.pavingLocationName }}
					</view>
				</view>
				<view class="info-much">
					<view class="much">
						<text>¥ </text>
						<text>{{list.salePrice}}</text>
						<text>/㎡</text>
					</view>
					<view class="info-much-btn" @click="show=true">
						转不测量
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="show" :confirm-style='confirmStyle' :cancel-style='camcelStyle' content="是否确认转不测量"
			:show-cancel-button='true' title='提醒' @confirm='confirm' :title-style='titleStyle' :content-style="contentStyle">
		</u-modal>
		<view class="commodity-info">
			<view class="commodity-info-y">
				<text>规格</text>
				<text>{{list.spec}}</text>
			</view>
			<view class="commodity-info-y">
				<text>区域</text>
				<text>{{list.areaName}}</text>
			</view>
			<view class="commodity-info-y">
				<text>型号</text>
				<text>{{list.materialType}}</text>
			</view>
			<view class="commodity-info-y">
				<text>编码</text>
				<text>{{list.materialCode}}</text>
			</view>
			<view class="commodity-info-y">
				<text>预估</text>
				<text>{{list.forecast}}</text>
			</view>
			<view class="commodity-info-y">
				<text>品牌</text>
				<text>{{list.brand}}</text>
			</view>
		</view>
		<view class="remark">
			<view class="remark-title">
				选材备注
			</view>
			<view class="remark-content">
				{{list.remark}}
			</view>
		</view>
		<view class="btn" @click="toNotice">
			<text>通知测量</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titleStyle: {
					fontSize: '26rpx',
					color: '#333333',
					fontWeight: 'bold'
				},
				contentStyle: {
					color: '#333333',
					fontSize: '32rpx'
				},
				camcelStyle: {
					background: '#F5F5F5',
					color: "#333333",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 31rpx 40rpx 40rpx'
				},
				confirmStyle: {
					background: 'linear-gradient(90deg, #D80100 0%, #B80201 100%)',
					color: "#FFFFFF",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 40rpx 40rpx 31rpx'
				},
				show: false,
				list: null,
				data: [],
				chooseMaterialIds: []
			}
		},
		onLoad(options) {
			this.list = JSON.parse(decodeURIComponent(options.info))
			const info = []
			info.push(this.list)
			this.data = this.$u.deepClone(info)
		},
		methods: {
			toNotice() {
				uni.navigateTo({
					url: `measure-notice?list=${encodeURIComponent(JSON.stringify(this.data))}`
				})
			},
			confirm(){
				this.$post({
					url: this.api.measureNotifyInfo.notMeasure,
					data: [this.list.id]
				}).then(res => {
					uni.navigateBack({

					})
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.btn {
		width: 100%;
		height: 96rpx;
		position: fixed;
		z-index: 99;
		bottom: 20rpx;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 75rpx;

		text {
			display: inline-block;
			width: 100%;
			height: 88rpx;
			background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
			line-height: 88rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 32rpx;
			border-radius: 44rpx;
		}
	}

	.change {
		padding: 0 48rpx 40rpx 48rpx;

		.change-title {
			height: 125rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;

			text {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
			}

			image {
				width: 51rpx;
				height: 51rpx;
				position: relative;
				right: -10rpx;
			}
		}

		.change-select {
			margin-bottom: 40rpx;

			.change-select-y {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 20rpx;

				text {
					color: #333333;
					font-size: 32rpx;
				}

				image {
					width: 36rpx;
					height: 36rpx;
				}

				view {
					width: 36rpx;
					height: 36rpx;
					border-radius: 50%;
					border: 2rpx solid #707070;
				}
			}
		}

		.change-btn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 34rpx;
			color: #FFFFFF;
			background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
			border-radius: 48rpx;
		}
	}

	.data-detail {
		.store-info {
			margin-top: 20rpx;
			background-color: #fff;
			padding: 32rpx 30rpx;
			display: flex;
			align-items: flex-start;

			image {
				width: 136rpx;
				height: 136rpx;
				margin-right: 24rpx;
				flex-shrink: 0;
			}

			.info {
				width: 100%;

				.info-name {
					font-size: 32rpx;
					font-weight: bold;
					color: #333333;
					margin-bottom: 12rpx;
				}

				.info-tip {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;

					view {
						width: auto;
						padding: 0 8rpx;
						font-size: 24rpx;
						color: #999999;
						margin-right: 12rpx;
						border-radius: 4rpx;
						border: 2rpx solid #C0C0C0;
					}
				}

				.info-much {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.much {
						display: flex;
						align-items: center;

						text {
							font-size: 36rpx;
							color: #B80201;

							&:first-child {
								font-size: 22rpx;
							}

							&:last-child {
								font-size: 22rpx;
							}
						}
					}

					.info-much-btn {
						width: 128rpx;
						height: 40rpx;
						line-height: 40rpx;
						border-radius: 20rpx;
						background-color: #FCEDED;
						text-align: center;
						color: #B80201;
						font-size: 24rpx;
					}
				}
			}
		}

		.commodity-info {
			padding: 28rpx 32rpx;
			background-color: #fff;
			margin-top: 20rpx;

			.commodity-info-y {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0;
				}

				text {
					color: #333333;
					font-size: 28rpx;

					&:first-child {
						color: #999999;
						font-size: 28rpx;
						margin-right: 40rpx;
					}
				}
			}
		}

		.remark {
			padding: 28rpx 32rpx 68rpx 32rpx;
			background-color: #fff;
			margin-top: 20rpx;

			.remark-title {
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.remark-content {
				color: #333333;
				font-size: 28rpx;
				line-height: 40rpx;
			}
		}
	}
</style>
