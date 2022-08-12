<template>
	<view class="manage-list">
		<u-navbar back-icon-color="#ffffff" class="navbar fl-cc" :border-bottom="false" :background="navbar_bg">
			<u-search mImage='/static/image/workbench/customer-manage/search.png' :uIconShow="false" bg-color="#F5F5F5"
				placeholder-color="#C0C0C0" v-model="customerName" placeholder="请输入客户姓名或联系方式" @change="searchList"
				:show-action="false">
			</u-search>
			<view class="slot-wrap" slot="right" style="width: 34rpx;">
			</view>
		</u-navbar>
		<image src="/static/image/tab-bar/new-bg.png" mode="" class="list-bg"></image>
		<scroll-view scroll-y="true">
			<view class="lists">
				<view class="list-y" v-for="(val,index) in customList" :key="index">
					<image src="/static/image/workbench/worker-test/left.png" mode="" class="leftborder"></image>
					<view class="list-y-l">
						<image src="/static/image/workbench/construction-manage/tx.png" mode="" class="tx"></image>
						<image src="/static/image/workbench/construction-manage/tip-ing.png" mode="" class="tip">
						</image>
					</view>
					<view class="list-y-r">
						<view class="list-y-r-info">
							<view class="list-y-r-info-y">
								<text class="name"><text
										style="font-weight: bold;">{{val.customerName}}</text>{{val.mobileNumber}}</text>
								<text class="status">{{val.typeName}}</text>
							</view>
							<view class="list-y-r-info-e">
								<image src="/static/image/workbench/construction-manage/adress.png" mode=""></image>
								<text>{{val.finalAddress}}</text>
							</view>
							<view class="list-y-r-info-s">
								<text class="area">{{(val.buildingArea ? val.buildingArea+'㎡':'暂无')}}</text>
								<text class="style" v-if="val.decorationStyleName">{{val.decorationStyleName}}</text>
							</view>
						</view>
						<view class="list-y-r-time">
							<view class="worktype">
								<text>已派工种：</text><text>{{val.dispatchWorkerType}}</text>
							</view>
							<view class="btn" @click="selectWorker(val)">
								派工
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customerName: "",
				currentPage: 1,
				navbar_bg: {
					background: 'none'
				},
				customList: [],
			}
		},
		onShow() {
			this.currentPage = 1
			this.customList = []
			this.getList()
		},
		methods: {
			onReachBottom() {
				this.currentPage++
				this.getList()
			},
			//获取客户列表
			getList() {
				const data = {
					type: 'Construction',
					customerName: this.customerName,
					pageSize: 6,
					currentPage: this.currentPage,
					allData: false
				}
				this.$post({
					url: this.api.CustomInfo.getList,
					data,
				}).then(res => {
					res.rows.forEach(item => {
						this.customList.push(item)
					})
				})
			},
			searchList() {
				this.currentPage = 1
				this.customList = []
				this.getList()
			},
			selectWorker(val) {
				console.log(val)
				uni.navigateTo({
					url: 'workers?customerId=' + val.id
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

		.tabs {
			width: 100%;
			height: 112rpx;
			display: flex;
			align-items: center;
			background-color: #FFFFFF;
			justify-content: center;
			border-bottom: 1rpx solid #F0F0F0;

			.tab {
				width: 278rpx;
				height: 112rpx;
				text-align: center;
				line-height: 112rpx;
				color: #333333;
				font-weight: bold;
				font-size: 28rpx;
				position: relative;
			}

			.tabs-bar {
				position: absolute;
				left: 0;
				right: 0;
				margin: auto;
				bottom: 16rpx;
				width: 44rpx;
				height: 8rpx;
				background: linear-gradient(90deg, #B80201 0%, #D80100 100%);
				opacity: 1;
				border-radius: 4rpx;
			}

			.tabs-r {
				width: 278rpx;
				height: 112rpx;
				text-align: center;
				line-height: 112rpx;
				font-size: 28rpx;
				position: relative;
				color: #999999;
			}
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
						height: 110rpx;
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: flex-end;

						.worktype {
							display: flex;
							// align-items: center;

							text {
								color: #333333;
								font-size: 26rpx;

								&:last-child {
									font-size: 30rpx;
									color: #B80201;
									font-weight: bold;
								}

							}
						}

						.btn {
							width: 136rpx;
							height: 64rpx;
							border-radius: 12rpx;
							background-color: #B80201;
							line-height: 64rpx;
							text-align: center;
							font-size: 26rpx;
							color: #FFFFFF;
							margin-left: 32rpx;
						}
					}
				}
			}
		}
	}
</style>
