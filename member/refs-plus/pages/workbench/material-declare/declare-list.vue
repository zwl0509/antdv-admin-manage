Z<template>
	<view class="index">
		<u-navbar :is-back="true" :border-bottom='true' back-icon-color='#333333' :custom-back='backto'>
			<view class="slot-wrap">
				<input type="text" v-model="customerName" placeholder="请输入搜索内容" @input="searchList" />
				<image src="/static/image/workbench/product-dispatch/search.png" mode=""></image>
			</view>
		</u-navbar>
		<view class="list" v-for="(val,index) in list" :key="index">
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
						<text style="margin: 0 12rpx;">{{val.finalAddress}}</text>
						<!-- <text></text> -->
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
				<view class="btn-red" @click="mainList('1095-10',val,'1098-10')">
					主材申请
				</view>
				<view class="" @click="mainList('1095-10',val,'1098-20')">
					主材退货
				</view>
				<view class="" @click="showWarehouse('1095-20',val)">
					辅材申请
				</view>
				<view class="" @click="billList(val)">
					单据列表
				</view>
			</view>
		</view>
		<view v-if="!list.length" style="padding-top:236rpx ;text-align: center;">
			<image src="/static/image/workbench/customer-manage/nodata.png"
				style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
			<view style='color: #999999;font-size: 32rpx;'>
				空空如也~
			</view>
		</view>
		<u-picker mode="selector" v-model="warehouseShow" :default-selector="[0]" :range="warehouseList"
			range-key="stockName" @confirm="selectWarehouse"></u-picker>
		<u-picker mode="selector" v-model="managerShow" :default-selector="[0]" :range="managerList"
			range-key="realName" @confirm="selectManager">
		</u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentPage: 1,
				customerName: '',
				list: [],
				warehouseList: [],
				warehouseShow: false,
				managerShow: false,
				managerList: [],
				type: '',
				customerId: '',
				stockId: '',
				warehouseEmployeeId: ''
			}
		},
		onShow() {
			this.list = []
			this.currentPage = 1
			this.getCustomerInfoList()
			this.getStockList()
		},
		methods: {
			//获取仓库管理员
			getStockManager(stockId) {
				this.$get({
					url: this.api.AuxiliaryMaterialsInfo.getStockManager,
					data: {
						stockId: stockId
					}
				}).then(res => {
					this.managerList = res.rows
					this.managerShow = true
				})
			},
			selectManager(e) {
				this.warehouseEmployeeId = this.managerList[e[0]].id
				if (this.warehouseEmployeeId) {
					uni.navigateTo({
						url: 'main-list?type=' + this.type + '&customerId=' + this.customerId + '&stockId=' + this
							.stockId + '&warehouseEmployeeId=' + this.warehouseEmployeeId
					})
				}
			},
			selectWarehouse(e) {
				this.stockId = this.warehouseList[e[0]].id
				this.getStockManager(this.stockId)
			},
			//获取仓库列表
			getStockList() {
				this.$get({
					url: this.api.AuxiliaryMaterialsInfo.getStockList
				}).then(res => {
					this.warehouseList = res.rows
				})
			},
			showWarehouse(type, val) {
				console.log(val)
				this.type = type
				this.customerId = val.id
				this.warehouseShow = true
			},
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
			},
			billList(val) {
				uni.navigateTo({
					url: 'bill-list?customerId=' + val.id
				})
			},
			mainList(type, val, masterDeclarationType) {
				uni.navigateTo({
					url: 'main-list?type=' + type + '&customerId=' + val.id + '&masterDeclarationType=' +
						masterDeclarationType
				})
			},
			backto() {
				uni.switchTab({
					url: '/pages/tab-bar/workbench'
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
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		// flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		// padding: 0 30rpx;
		position: relative;
		width: 558rpx;
		margin-left: 30rpx;

		image {
			width: 28rpx;
			height: 28rpx;
			position: absolute;
			top: 0;
			bottom: 0;
			margin: auto;
			left: 28rpx;
		}

		input {
			background-color: #F5F5F5;
			border: none;
			width: 100%;
			height: 60rpx;
			padding-left: 72rpx;
			border-radius: 56rpx;
		}
	}

	.index {
		.list {
			margin-top: 20rpx;
			background-color: #FFFFFF;
			padding: 56rpx 30rpx 0 30rpx;

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
