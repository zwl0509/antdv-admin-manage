<template>
	<view class="index">
		<u-navbar :border='false' back-icon-color="#ffffff" class="navbar fl-cc" :border-bottom="false"
			:background="navbar_bg">
			<u-search mImage='/static/image/workbench/customer-manage/search.png' :uIconShow="false"
				placeholder-color="#C0C0C0" v-model="customerName" placeholder="请输入搜索内容" @change="searchList"
				:show-action="false">
			</u-search>
			<view class="slot-wrap" slot="right">
			</view>
		</u-navbar>
		<image src="/static/image/tab-bar/new-bg.png" mode="" class="list-bg"></image>
		<view class="list" v-for="(val,index) in list" :key="index">
			<image src="/static/image/workbench/worker-test/left.png" mode="" class="leftborder"></image>
			<view class="list-info">
				<image src="/static/image/mine/avatar-mr.png" mode="" class="info-tx"></image>
				<view class="info">
					<view class="info-user">
						<view class="info-user-l">
							<text style="margin-right: 14rpx;font-weight: bold;">{{val.customerName}}</text>
							<text>{{val.mobileNumber}}</text>
						</view>
						<text class="info-user-l">{{val.typeName}}</text>
					</view>
					<view class="info-address">
						<image src="/static/image/workbench/customer-manage/address.png" mode=""></image>
						<!-- <text style="margin: 0 12rpx;">苏州</text> -->
						<text>{{val.finalAddress}}</text>
					</view>
					<view class="info-type">
						<text>{{(val.buildingArea ? val.buildingArea+'㎡':'暂无')}}</text>
						<view class="" v-if="val.decorationStyleName">
							{{val.decorationStyleName}}
						</view>
					</view>
					<view class="info-status" v-if="val.promotionOrPackageName">
						<image src="/static/image/workbench/material-declare/bell.png" mode=""></image>
						<text>{{val.promotionOrPackageName}}</text>
					</view>
				</view>
			</view>
			<view class="list-btn">
				<view class="btn-red" @click="toselect(val)">
					常规选材
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customerName: '',
				sitemapId: '',
				currentPage: 1,
				list: [],
				navbar_bg: {
					background: 'none'
				},
			}
		},
		onLoad(options) {
			this.sitemapId = options.sitemapId

		},
		onShow() {
			this.list = []
			this.currentPage = 1
			this.getCustomerInfoList()
		},
		methods: {
			//上拉加载
			onReachBottom() {
				this.currentPage++
				this.getCustomerInfoList()
			},
			searchList() {
				this.list = []
				this.currentPage = 1
				this.getCustomerInfoList()
			},
			toselect(val) {
				uni.navigateTo({
					url: 'select-data?sitemapId=' + this.sitemapId + '&customerId=' + val.id +
						'&isPromotionCustomer=' + val.isPromotionCustomer + '&isPackageCustomer=' + val
						.isPackageCustomer
				})
				uni.setStorageSync('customerId', val.id)
			},
			getCustomerInfoList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$get({
					url: this.api.CommonCustomInfo.getCustomerInfoList,
					data: {
						type: '1033-80',
						pageSize: 10,
						currentPage: this.currentPage,
						customerName: this.customerName
					}
				}).then(res => {
					res.rows.forEach(item => {
						this.list.push(item)
					})
					uni.hideLoading()
				}).catch(res => {
					uni.hideLoading()
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
	.slot-wrap {
		padding-left: 26rpx;
		padding-right: 24rpx;

		.navbar-icon {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.list-bg {
		width: 100%;
		height: calc(88rpx + var(--status-bar-height));
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		z-index: 9;
	}

	.index {
		.list {
			margin-top: 20rpx;
			background-color: #FFFFFF;
			padding: 56rpx 30rpx 0 30rpx;
			position: relative;

			.leftborder {
				width: 8rpx;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}

			.list-info {
				display: flex;
				align-items: flex-start;
				box-sizing: border-box;

				.info-tx {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 24rpx;
					flex-shrink: 0;
				}

				.info {
					width: 100%;
					border-bottom: 1rpx solid #f0f0f0;
					padding-bottom: 26rpx;

					.info-user {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 10rpx;

						.info-user-l {
							display: flex;
							align-items: center;

							text {
								color: #333333;
								font-size: 30rpx;
							}
						}

						.info-user-l {
							color: #B80201;
							font-size: 28rpx;
						}
					}

					.info-address {
						display: flex;
						align-items: center;
						margin-bottom: 18rpx;

						image {
							width: 18rpx;
							height: 24rpx;
						}

						text {
							color: #999999;
							font-size: 26rpx;
						}
					}

					.info-type {
						display: flex;
						align-items: center;
						margin-bottom: 24rpx;

						text {
							color: #333333;
							font-size: 26rpx;
						}

						view {
							width: 100rpx;
							height: 36rpx;
							line-height: 36rpx;
							text-align: center;
							border-radius: 4rpx;
							background-color: #F7F7F7;
							font-size: 22rpx;
							color: #333333;
							margin-left: 20rpx;
						}
					}

					.info-status {
						display: flex;
						align-items: center;

						image {
							height: 25rpx;
							width: 22rpx;
							margin-right: 10rpx;
						}

						text {
							color: #B80201;
							font-size: 26rpx;
						}
					}
				}
			}

			.list-btn {
				height: 110rpx;
				display: flex;
				align-items: center;
				flex-direction: row-reverse;

				view {
					width: 136rpx;
					height: 64rpx;
					margin-left: 16rpx;
					line-height: 64rpx;
					text-align: center;
					border-radius: 12rpx;
					border: 1rpx solid #C0C0C0;
					color: #333333;
					font-size: 26rpx;
				}

				.btn-red {
					background-color: #B80201;
					border: none;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
