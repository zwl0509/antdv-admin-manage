<template>
	<view class="repair">
		<u-navbar title="历史记录" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333'>
		</u-navbar>
		<view class="customer-info" @click="todetail(val)" v-for="(val,index) in list" :key="index">
			<view class="customer-info-content">
				<view class="title">
					<view class="title-l">
						<image src="/static/image/workbench/customer-complaints/raplier.png" mode=""></image>
						<text>
							{{val.recordSourceName}}
						</text>
					</view>
					<view class="title-r" v-if="val.dispatchInfosLength">
						{{val.dispatchInfos[0].statusName}}
					</view>
				</view>
				<view class="content" v-if="val.dispatchInfosLength">
					{{val.dispatchInfos[0].question}}
				</view>
				<view class="imgs" v-if="val.dispatchInfosLength">
					<image :src="img.path" mode="" v-for="(img,index2) in val.dispatchInfos[0].attachInfos"
						:key="index2"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customerId: '',
				type: '',
				list: []
			}
		},
		onLoad(options) {
			this.customerId = options.customerId
			this.type = options.type
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList() {
				this.$get({
					url: this.api.CustomerServiceInfo.getHistoryList,
					data: {
						customerId: this.customerId,
						type: this.type
					}
				}).then(res => {
					res.forEach(item => {
						item.dispatchInfosLength = item.dispatchInfos.length
					})
					this.list = res
				})
			},
			todetail(val) {
				uni.navigateTo({
					url: 'repair-detail?csComplaintRecordId=' + val.dispatchInfos[0].csComplaintRecordId + '&id=' +
						val.dispatchInfos[0].id
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
