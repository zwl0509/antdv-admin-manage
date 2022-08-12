<template>
	<view class="index">
		<u-navbar title="单据列表" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
			<view slot='right' style="padding-right: 36rpx;color: #B80201;font-size: 28rpx;" @click="chooseData">
				选材
			</view>
		</u-navbar>
		<view class="" style="padding: 0 30rpx;background-color: #FFFFFF;">
			<view class="tabs">
				<view :class="current==index ? 'tab-a':'tab'" v-for="(val,index) in tabsList" :key="index"
					@click="change(val,index)">
					{{val.name}}
					<view class="bar" v-if="current==index">

					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true">
			<view class="scroll-list">
				<view class="list" v-for="(val,index) in list" :key="index" @click="billDetail(val)">
					<image src="/static/image/tab-bar/user.png" mode=""></image>
					<view class="list-info">
						<view class="list-info-y">
							<view class="list-info-y-name">
								{{val.typeName}}
							</view>
							<view :class="val.status!='1097-10' ? 'list-info-y-status' : 'list-info-y-status2'">
								{{val.statusName}}
							</view>
						</view>
						<view class="list-info-e">
							{{val.materialDeclarationNo}}
						</view>
					</view>
				</view>
				<view style="padding-top:236rpx ;text-align: center;" v-if="!list.length">
					<image src="/static/image/workbench/customer-manage/nodata.png"
						style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
					<view style='color: #999999;font-size: 32rpx;'>
						空空如也~
					</view>
				</view>
			</view>
		</scroll-view>
		<u-picker mode="selector" v-model="warehouseShow" :default-selector="[0]" :range="warehouseList"
			range-key="stockName" @confirm="selectWarehouse"></u-picker>
		<u-picker mode="selector" v-model="managerShow" :default-selector="[0]" :range="managerList"
			range-key="realName" @confirm="selectManager">
		</u-picker>
		<u-picker mode="selector" v-model="mainShow" :default-selector="[0]" :range="mainList" range-key="name"
			@confirm="selectMain">
		</u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabsList: [{
					name: '主材单据',
					value: '1095-10'
				}, {
					name: '辅材单据',
					value: '1095-20'
				}],
				mainList: [{
					name: '主材申报',
					value: '1095-10'
				}, {
					name: '主材退货',
					value: '1095-10'
				}],
				mainShow: false,
				warehouseList: [],
				warehouseShow: false,
				managerShow: false,
				managerList: [],
				current: 0,
				list: [],
				type: '1095-10',
				customerId: '',
				stockId: '',
				warehouseEmployeeId: '',
			}
		},
		onLoad(options) {
			this.customerId = options.customerId
			this.getDeclarationList()
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
			selectMain() {
				uni.navigateTo({
					url: 'main-list?type=' + this.type + '&customerId=' + this.customerId
				})
			},
			//获取仓库列表
			getStockList() {
				this.$get({
					url: this.api.AuxiliaryMaterialsInfo.getStockList
				}).then(res => {
					this.warehouseList = res.rows
				})
			},
			chooseData() {
				if (this.type == '1095-10') {
					this.mainShow = true
				} else {
					this.warehouseShow = true
				}
			},
			change(val, index) {
				this.current = index
				this.type = val.value
				this.getDeclarationList()
			},
			billDetail(val) {
				uni.navigateTo({
					url: 'bill-detail?type=' + this.type + '&ismodify=true&list=' + JSON.stringify(val.detailVOS) +
						"&relations=" + JSON.stringify(val.relations) + '&customerId=' + this.customerId + '&id=' +
						val.id + "&stockId=" + val.stockId + '&warehouseEmployeeId=' + val.warehouseEmployeeId +
						'&status=' + val.status + '&masterDeclarationType=' + val.masterDeclarationType +
						'&unifiedArrivedTime=' + (val.unifiedArrivedTime ? val.unifiedArrivedTime : '')
				})
			},
			getDeclarationList() {
				this.$get({
					url: this.api.AuxiliaryMaterialsInfo.getDeclarationList,
					data: {
						customerId: this.customerId,
						type: this.type
					}
				}).then(res => {
					this.list = res.rows
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
	.index {
		height: 100vh;

		.tabs {
			width: 100%;
			height: 112rpx;
			// padding: 0 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #FFFFFF;
			border-bottom: 1rpx solid #F0F0F0;

			.tab {
				width: 242rpx;
				height: 112rpx;
				line-height: 112rpx;
				text-align: center;
				font-size: 28rpx;
				color: #999999;
				font-weight: 400;
			}

			.tab-a {
				width: 242rpx;
				height: 112rpx;
				line-height: 112rpx;
				text-align: center;
				font-size: 28rpx;
				color: #000000;
				font-weight: 600;
				position: relative;

				.bar {
					width: 44rpx;
					height: 8rpx;
					background: linear-gradient(270deg, #FF8382 0%, #B80201 100%);
					border-radius: 4rpx;
					position: absolute;
					left: 0;
					right: 0;
					margin: auto;
					bottom: 16rpx;
				}
			}
		}

		.scroll-list {
			height: calc(100vh - 88rpx - 112rpx - var(--status-bar-height));

			.list {
				background-color: #FFFFFF;
				margin-bottom: 20rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				height: 160rpx;

				image {
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
				}

				.list-info {
					width: 100%;

					.list-info-y {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 10rpx;

						.list-info-y-name {
							color: #333333;
							font-size: 32rpx;
							font-weight: 800;
						}

						.list-info-y-status {
							color: #B80201;
							font-size: 28rpx;
						}

						.list-info-y-status2 {
							color: #999999;
							font-size: 28rpx;
						}
					}

					.list-info-e {
						color: #999999;
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>
