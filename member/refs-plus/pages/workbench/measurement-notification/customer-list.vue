<template>
	<view class="manage-list">
		<u-navbar back-icon-color="#ffffff" class="navbar fl-cc" :border-bottom="false" :background="navbar_bg">
			<u-search mImage='/static/image/workbench/customer-manage/search.png' :uIconShow="false" bg-color="#F5F5F5"
				placeholder-color="#C0C0C0" v-model="keyword" placeholder="请输入客户姓名或联系方式" @change="search"
				:show-action="false">
			</u-search>
			<view class="slot-wrap" slot="right" style="width: 34rpx;">
			</view>
		</u-navbar>
		<image src="/static/image/tab-bar/new-bg.png" mode="" class="list-bg"></image>
		<scroll-view scroll-y="true">
			<view class="lists">
				<view class="list-y" v-for="(val,index) in list" :key="index" @click="toMeasurementList(val)">
					<image src="/static/image/workbench/worker-test/left.png" mode="" class="leftborder"></image>
					<view class="list-y-l">
						<image src="/static/image/workbench/construction-manage/tx.png" mode="" class="tx"></image>
						<image src="/static/image/workbench/measurement-notification/ing.png" mode="" class="tip">
						</image>
					</view>
					<view class="list-y-r">
						<view class="list-y-r-info">
							<view class="list-y-r-info-y">
								<text class="name"><text style="font-weight: bold;">{{val.customerName}}</text>
									{{val.mobileNumber}}</text>
							</view>
							<view class="list-y-r-info-e">
								<image src="/static/image/workbench/construction-manage/adress.png" mode=""></image>
								<text>{{val.finalAddress}}</text>
							</view>
						</view>
						<view class="list-y-r-time">
							<view class="list-y-r-time-y">
								<text>已发 | 未发</text>
								<text class="list-y-r-time-y-red">9</text>
								<text>/</text>
								<text class="list-y-r-time-y-red">2</text>
							</view>
							<view class="list-y-r-time-y">
								<text>已测 | 驳回</text>
								<text class="list-y-r-time-y-red">10</text>
								<text>/</text>
								<text class="list-y-r-time-y-red">2</text>
							</view>
						</view>
					</view>
				</view>
<!-- 				<view v-if="!list.length" style="padding-top:236rpx ;text-align: center;">
					<image src="/static/image/workbench/customer-manage/nodata.png"
						style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
					<view style='color: #999999;font-size: 32rpx;'>
						空空如也~
					</view>
				</view> -->
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: "",
				currentIndex: 0,
				currentPage: 1,
				status: ['1080-10', '1080-50'],
				list: [],
				navbar_bg: {
					background: 'none'
				}
			}
		},
		onLoad() {
			this.getCustomerBuildList()
		},
		methods: {
			//上拉加载
			onReachBottom() {
				this.currentPage++
				this.getCustomerBuildList()
			},
			search() {
				this.currentPage = 1
				this.list = []
				this.getCustomerBuildList()
			},
			getCustomerBuildList() {
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
				})
			},
			changeTab(index) {
				this.currentPage = 1
				this.list = []
				this.currentIndex = index
				this.status = this.tabList[index].value
				this.getCustomerBuildList()
			},
			toMeasurementList(val) {
				uni.navigateTo({
					url: 'measurement-list?customerId='+val.id
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
	.manage-list {
		.list-bg {
			width: 100%;
			height: calc(88rpx + var(--status-bar-height));
			position: fixed;
			top: 0rpx;
			left: 0rpx;
			z-index: 9;
		}

		.lists {
			height: calc(100vh - 88rpx - var(--status-bar-height));
			padding-top: 20rpx;

			.list-y {
				width: 100%;
				background-color: #fff;
				padding: 56rpx 30rpx 0 30rpx;
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				margin-bottom: 20rpx;
				position: relative;

				.leftborder {
					width: 8rpx;
					height: 100%;
					position: absolute;
					left: 0;
					top: 0;
				}

				.list-y-l {
					position: relative;
					flex-shrink: 0;
					margin-right: 24rpx;

					.tx {
						width: 100rpx;
						height: 100rpx;
					}

					.tip {
						width: 80rpx;
						height: 36rpx;
						position: absolute;
						top: -14rpx;
						right: -12rpx;
					}
				}

				.list-y-r {
					width: 100%;

					.list-y-r-info {
						width: 100%;
						border-bottom: 1rpx solid #F0F0F0;
						padding-bottom: 26rpx;

						.list-y-r-info-y {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-bottom: 10rpx;

							.name {
								color: #333333;
								font-size: 30rpx;
							}

							.status {
								font-size: 28rpx;
								color: #B80201;
							}
						}

						.list-y-r-info-e {
							display: flex;
							align-items: center;
							margin-bottom: 18rpx;

							image {
								width: 18rpx;
								height: 24rpx;
								margin-right: 12rpx;
							}

							text {
								color: #999999;
								font-size: 26rpx;
							}
						}

						.list-y-r-info-s {
							display: flex;
							align-items: center;

							.area {
								font-size: 26rpx;
								color: #333333;
								margin-right: 24rpx;
							}

							.style {
								display: inline-block;
								padding: 2rpx 6rpx;
								background-color: #F7F7F7;
								border-radius: 4rpx;
								font-size: 22rpx;
								color: #333333;
							}
						}
					}

					.list-y-r-time {
						height: 88rpx;
						width: 100%;
						display: flex;
						align-items: center;

						.list-y-r-time-y {
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: #333333;
							margin-right: 72rpx;

							text {
								&:first-child {
									margin-right: 20rpx;
								}
							}

							.list-y-r-time-y-red {
								color: #B80201;
								font-size: 30rpx;
								font-weight: bold;
							}
						}
					}
				}
			}
		}
	}
</style>
