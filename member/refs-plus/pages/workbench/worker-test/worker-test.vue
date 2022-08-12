<template>
	<view class="worker-text">
		<u-navbar :border='false' back-icon-color="#ffffff" :background="navbar_bg" class="navbar fl-cc"
			:border-bottom="false">
			<u-search mImage='/static/image/workbench/customer-manage/search.png' :uIconShow="false" bg-color="#ffffff"
				placeholder-color="#C0C0C0" v-model="customerName" placeholder="请输入客户姓名或联系方式" @change="searchList"
				:show-action="false">
			</u-search>
			<!-- <view class="search"></view> -->
			<view class="slot-wrap" slot="right">
				<!-- <u-icon name="more-dot-fill" color="#ffffff" size="40"></u-icon> -->
			</view>
		</u-navbar>
		<image src="/static/image/tab-bar/new-bg.png" mode="" class="list-bg"></image>
		<view class="tabs">
			<view :class="currentIndex==index ? 'tab' : 'tabs-r' " @click="changeTab(index)"
				v-for="(val,index) in tabList" :key='index'>
				{{val.name}}
				<view class="tabs-bar" v-show="currentIndex==index">

				</view>
			</view>
		</view>
		<scroll-view scroll-y="true">
			<view class="lists">
				<view class="list-y" v-for="(val,index) in customList" :key="index">
					<image src="/static/image/workbench/worker-test/left.png" mode="" class="list-y-left"></image>
					<view class="list-y-l">
						<image src="/static/image/workbench/construction-manage/tx.png" mode="" class="tx"></image>
					</view>
					<view class="list-y-r">
						<view class="list-y-r-info">
							<view class="list-y-r-info-y">
								<text class="name"><text style="font-weight: bold;">{{val.customerName}}</text>
									{{val.mobileNumber}}</text>
								<!-- 								<text class="status-yx">意向</text>
								<text class="status-sj">设计</text> -->
							</view>
							<view class="list-y-r-info-c">
								<view class="">
									<view class="list-y-r-info-e">
										<image src="/static/image/workbench/construction-manage/adress.png" mode="">
										</image>
										<text>{{val.finalAddress}}</text>
									</view>
									<view class="list-y-r-info-s">
										<text class="area">{{(val.buildingArea ? val.buildingArea+'㎡':'暂无')}}</text>
										<text class="style">{{val.decorationStyleName}}</text>
									</view>
								</view>
								<image src="/static/image/workbench/worker-test/phone.png" mode="" class="phone">
								</image>
							</view>
						</view>
						<view class="list-y-r-time">
							<view class="list-y-r-time-l">
								<text>{{ val.lastFallowTime ? val.lastFallowTime+"  跟进" : '暂无'}}</text>
								<image src="/static/image/workbench/construction-manage/right.png" mode=""></image>
							</view>
							<view class="list-y-r-time-r" @click="todetail(val)">
								<image src="/static/image/workbench/worker-test/wokerlist.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>
				<view v-if="!customList.length" style="padding-top:236rpx ;text-align: center;">
					<image src="/static/image/workbench/customer-manage/nodata.png"
						style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
					<view style='color: #999999;font-size: 32rpx;'>
						空空如也~
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
				customerName: '',
				navbar_bg: {
					background: 'none'
				},
				currentIndex: 0,
				tabList: [{
					name: '未完工',
					value: '1080-10'
				}, {
					name: '已完工',
					value: '1080-20'
				}],
				currentPage: 1,
				customList: [],
				customerStatus: '1080-10'
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
					allData: false,
					customerStatus: this.customerStatus
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
			changeTab(index) {
				this.currentIndex = index
				this.customerStatus = this.tabList[index].value
				console.log(this.tabList[index])
				this.currentPage = 1
				this.customList = []
				this.getList()
			},
			todetail(val) {
				uni.navigateTo({
					url: 'worker-detail?customerId=' + val.id
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
	.list-bg {
		width: 100%;
		height: calc(200rpx + var(--status-bar-height));
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		z-index: 9;
	}

	.slot-wrap {
		padding-left: 26rpx;
		padding-right: 24rpx;

		.navbar-icon {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.tabs {
		width: 100%;
		height: 112rpx;
		display: flex;
		align-items: center;
		// background-color: #FFFFFF;
		justify-content: center;
		// border-bottom: 1rpx solid #F0F0F0;
		position: relative;
		z-index: 99;

		.tab {
			width: 278rpx;
			height: 112rpx;
			text-align: center;
			line-height: 112rpx;
			color: #FFFFFF;
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
			background: #FFFFFF;
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
			color: #FFFFFF;
		}
	}

	.lists {
		height: calc(100vh - 88rpx - 112rpx - var(--status-bar-height));
		padding-top: 20rpx;

		.list-y {
			width: 100%;
			background-color: #fff;
			padding: 56rpx 30rpx 0 30rpx;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-bottom: 20rpx;
			box-shadow: 0px 6px 10px #FAE3E2;
			position: relative;

			.list-y-left {
				width: 8rpx;
				height: 100%;
				position: absolute;
				top: 0rpx;
				left: 0rpx;
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
						// justify-content: space-between;
						align-items: center;
						margin-bottom: 10rpx;

						.name {
							color: #333333;
							font-size: 30rpx;
						}

						.status-yx {
							width: 48rpx;
							height: 32rpx;
							line-height: 32rpx;
							text-align: center;
							color: #0AB4B3;
							font-size: 20rpx;
							background: rgba(225, 250, 250, 0.3900);
							border-radius: 4rpx;
							margin-left: 12rpx;
						}

						.status-sj {
							width: 48rpx;
							height: 32rpx;
							line-height: 32rpx;
							text-align: center;
							color: #B80201;
							font-size: 20rpx;
							background: rgba(252, 237, 237, 0.3900);
							border-radius: 4rpx;
							margin-left: 12rpx;
						}
					}

					.list-y-r-info-c {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.phone {
							width: 44rpx;
							height: 44rpx;
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
					height: 96rpx;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.list-y-r-time-l {
						display: flex;
						align-items: center;

						text {
							color: #333333;
							font-size: 24rpx;
							margin-right: 12rpx;
						}

						image {
							width: 12rpx;
							height: 20rpx;
						}
					}

					.list-y-r-time-r {
						display: flex;
						align-items: center;

						image {
							width: 56rpx;
							height: 56rpx;
							margin-left: 20rpx;
						}
					}
				}
			}
		}
	}
</style>
