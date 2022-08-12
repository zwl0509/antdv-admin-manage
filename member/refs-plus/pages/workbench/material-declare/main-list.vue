<template>
	<view class="index">
		<u-navbar :is-back="true" :border-bottom='false' back-icon-color='#333333'
			:title="type=='1095-10' ? (masterDeclarationType=='1098-20' ? '材料退货':'主材申报'): '辅材申报'" :title-bold='true'>
			<view slot='right' style="padding-right: 36rpx;" @click="toadd" v-if="type=='1095-20'">
				<u-icon name="plus" color="#333333" size="34"></u-icon>
			</view>
		</u-navbar>
		<view class="survey">
			<view class="survey-title" @click="showsurvey=!showsurvey">
				<text>总体概况</text>
				<image src="/static/image/mine/account/down.png" mode="" v-if="showsurvey"></image>
				<image src="/static/image/workbench/customer-manage/up.png" mode="" v-else></image>
			</view>
			<view class="survey-content" v-show="!showsurvey">
				<view class="content-y">
					<view class="">
						主材占比
					</view>
					<text>{{((mainDetail.JichuZhangBiOrJiChuZaojia ? mainDetail.JichuZhangBiOrJiChuZaojia : 0)*100).toFixed(0)}}%</text>
				</view>
				<view class="content-y">
					<view class="">
						已申请金额
					</view>
					<text>{{numToFixed(mainDetail.YiLingMoney)}}</text>
				</view>
				<view class="content-y">
					<view class="">
						已收工程款
					</view>
					<text>{{numToFixed(mainDetail.ReceivedEngineerFunds)}}</text>
				</view>
				<view class="content-y">
					<view class="">
						已开单金额
					</view>
					<text>{{numToFixed(mainDetail.YiKaidanMoney)}}</text>
				</view>
				<view class="content-y">
					<view class="">
						最大可领金额
					</view>
					<text>{{numToFixed(mainDetail.MaxKeLingMoney)}}</text>
				</view>
				<view class="content-y">
					<view class="">
						可用金额
					</view>
					<text>{{numToFixed(mainDetail.KeyongMoney)}}</text>
				</view>
			</view>
		</view>
		<view class="tabs" v-if="type=='1095-10'">
			<view :class="current==index ? 'tab-a':'tab'" v-for="(val,index) in tabsList" :key="index"
				@click="changeTab(index)">
				{{val.name}}
				<view class="bar" v-if="current==index">

				</view>
			</view>
		</view>
		<sale-prod-content
			:class="type=='1095-10'? (showsurvey ? 'scroll-h1' : 'scroll-h2') : (showsurvey ? 'scroll-h3' : 'scroll-h4') "
			v-if="categoryList.length" :initLoad="categoryList" ref="saleProd">
			<view class="">
				<!-- 				<view class="search-item" style="height: 90rpx;" :style="{overflow: showOptions?'':'hidden'}">
					<u-dropdown @open="handleShowOptions(!0, 'value1')" @close="handleShowOptions(!1, 'value1')">
						<u-dropdown-item title="综合排序" :options="options1"></u-dropdown-item>
						<u-dropdown-item title="预约排名" :options="options2"></u-dropdown-item>
						<u-dropdown-item title="价格区间" :options="options1"></u-dropdown-item>
					</u-dropdown>
				</view> -->
				<sale-prod-item v-for="(categoryItem, cIndex) in categoryList" :key="cIndex"
					:anchorId="'category-anchor-'+categoryItem.anchorId">
					<view class="commodity-list"
						v-if="categoryItem.productInfoList && categoryItem.productInfoList.length">
						<view class="commodity-item-box" v-for="(item, index) in categoryItem.productInfoList"
							:key="cIndex+'-'+index" @click.stop="select(item)">
							<image src="/static/image/tab-bar/workbench-bg.png" mode="" class="commodity-item-img">
							</image>
							<view class="commodity-item-info">
								<view class="commodity-item-info-name">
									{{item.materialName}}
								</view>
								<view class="commodity-item-info-type">
									{{item.materialType ? item.materialType+';':''}}
									{{item.materialName ? item.materialName+';':''}}
									{{item.spec ? item.spec+';':''}}
									{{item.color ? item.color:''}}
								</view>
								<!-- 								<view class="commodity-item-info-from">
									{{item.from}}
								</view> -->
								<view class="commodity-item-info-select">
									<view class="commodity-item-info-money">
										{{item.salePrice}}
									</view>
									<view class="commodity-item-info-select-no" v-if="!item.select">

									</view>
									<image src="/static/image/workbench/product-dispatch/select.png" mode="" v-else>
									</image>
								</view>
							</view>
						</view>
					</view>
					<view style="height: 60rpx" v-else></view>
				</sale-prod-item>
			</view>
		</sale-prod-content>
		<view class="nodata" v-else>
			<image src="/static/image/workbench/customer-manage/none.png" mode=""></image>
			<view class="">
				您还没有仓库材料哦~
			</view>
		</view>
		<view class="bottom" v-if="categoryList.length">
			<view class="bottom-select" @click="chooseAll">
				<view class="" v-if="!selectAll">

				</view>
				<image src="/static/image/workbench/product-dispatch/select.png" mode="" v-else></image>
				<text>全选</text>
			</view>
			<view class="bottom-r" @click="todetail">
				<text>已选择{{allNum}}件</text>
				<view class="bottom-btn">
					{{type=='1095-10' ? (masterDeclarationType=='1098-20' ? '材料退货':'主材申报'): '辅材申报'}}
				</view>
			</view>
		</view>
<!-- 		<view class="bottom" v-else>
			<view class="btn">
				{{type=='1095-10' ? '主材申报': '辅材申报'}}
			</view>
		</view> -->
	</view>
</template>

<script>
	import saleProdItem from '../../../components/sale-prod-content/sale-prod-item.vue'
	export default {
		components: {
			saleProdItem
		},
		data() {
			return {
				showsurvey: false,
				selectAll: false,
				showOptions: false,
				tabsList: [{
					name: '品牌',
					value: ''
				}, {
					name: '供应商',
					value: ''
				}],
				current: 0,
				value1: 1,
				value2: 2,
				options1: [{
						label: '默认排序',
						value: 1,
					},
					{
						label: '距离优先',
						value: 2,
					},
					{
						label: '价格优先',
						value: 3,
					}
				],
				options2: [{
						label: '去冰',
						value: 1,
					},
					{
						label: '加冰',
						value: 2,
					},
				],
				categoryList: [],
				type: '',
				allNum: 0,
				selectList: [],
				stockId: '',
				warehouseEmployeeId: '',
				mainDetail: {},
				isAdd: false, //是否材料添加
				id: '',
				relations: [],
				masterDeclarationType: '',
				unifiedArrivedTime: '',
			}
		},
		onLoad(options) {
			this.type = options.type
			this.customerId = options.customerId
			if (options.stockId) {
				this.stockId = options.stockId
			}
			if (options.warehouseEmployeeId) {
				this.warehouseEmployeeId = options.warehouseEmployeeId
			}
			if (options.isAdd) {
				this.isAdd = options.isAdd
			}
			if (options.id) {
				this.id = options.id
			}
			if (options.relations) {
				this.relations = JSON.parse(options.relations)
			}
			if (options.masterDeclarationType) {
				this.masterDeclarationType = options.masterDeclarationType
			}
			if (options.unifiedArrivedTime) {
				this.unifiedArrivedTime = options.unifiedArrivedTime
			}
			if (this.type == '1095-20') {
				this.getStockMaterials()
			} else {
				this.getListForBrand()
				// this.getList()
			}
			this.masterMaterialInfo()
		},
		methods: {
			//元转k
			numToFixed(num) {
				return ((num ? num : 0) / 1000).toFixed(0) + 'k'
			},
			//
			changeTab(index) {
				this.current = index
				if (index == 0) {
					this.getListForBrand()
				} else {
					this.getList()
				}
			},
			//获取客户对应仓库已申报的材料
			getStockMaterials() {
				this.$get({
					url: this.api.AuxiliaryMaterialsInfo.getStockMaterials,
					data: {
						customerId: this.customerId,
						stockId: this.stockId
					}
				}).then(res => {
					res.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = false
							item2.set = false
						})
					})
					this.categoryList = res
				})
			},
			//获取总体概况
			masterMaterialInfo() {
				this.$get({
					url: this.api.MaterialConfirmInfo.masterMaterialInfo,
					data: {
						customerId: this.customerId
					}
				}).then(res => {
					this.mainDetail = res
				})
			},
			chooseAll() {
				if (this.selectAl) {
					this.categoryList.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = false
						});
					})
				} else {
					this.categoryList.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = true
						});
					})
				}
				this.selectAl = !this.selectAll
			},
			//获取品牌材料
			getListForBrand() {
				this.$get({
					url: this.api.CustomerChooseMaterialInfo.getListForBrand,
					data: {
						customerId: this.customerId
					}
				}).then(res => {
					res.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = false
							item2.set = false
						})
					})
					this.categoryList = res
				})
			},
			//获取列表
			getList() {
				this.$get({
					url: this.api.CustomerChooseMaterialInfo.getList,
					data: {
						customerId: this.customerId,
						isConfirm: this.isConfirm,
						searchCondition: this.searchCondition
					}
				}).then(res => {
					res.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = false
							item2.set = false
						})
					})
					this.categoryList = res
				})
			},
			handleShowOptions(e, key) {
				console.log(e)
				this[key] = e
				if (!e) {
					setTimeout(() => {
						this.showOptions = e
					}, 100)
				} else {
					this.showOptions = e
				}
			},
			select(item) {
				item.select = !item.select
			},
			toadd() {
				uni.navigateTo({
					url: 'declare-add?stockId=' + this.stockId + '&customerId=' + this.customerId +
						'&warehouseEmployeeId=' + this.warehouseEmployeeId + '&isAdd=' + this.isAdd + '&id=' +
						this.id + '&relations=' + JSON.stringify(this.relations) +
						'&unifiedArrivedTime=' + this.unifiedArrivedTime
				})
			},
			todetail() {
				if (this.selectList.length) {
					uni.navigateTo({
						url: 'bill-detail?type=' + this.type + '&ismodify=false&list=' + JSON.stringify(this
								.selectList) + '&customerId=' + this.customerId + '&warehouseEmployeeId=' + this
							.warehouseEmployeeId + '&stockId=' + this.stockId + '&isAdd=' + this.isAdd + '&id=' +
							this.id + '&relations=' + JSON.stringify(this.relations) + '&masterDeclarationType=' +
							this.masterDeclarationType +
							'&unifiedArrivedTime=' + this.unifiedArrivedTime
					})
				} else {
					this.$Toast('请选择')
				}

			}
		},
		watch: {
			categoryList: {
				handler: function(val) {
					this.allNum = 0
					this.selectList = []
					let num = 0
					val.forEach(item => {
						item.productInfoList.forEach(item2 => {
							num = num + 1
							if (item2.select) {
								this.allNum = this.allNum + 1
								this.selectList.push(item2)
							}
						});
					})
					if (this.allNum == num) {
						this.selectAll = true
					} else {
						this.selectAll = false
					}
				},
				deep: true
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
	.scroll-h1 {
		height: calc(100vh - 418rpx - var(--status-bar-height))
	}

	.scroll-h2 {
		height: calc(100vh - 618rpx - var(--status-bar-height))
	}

	.scroll-h3 {
		height: calc(100vh - 306rpx - var(--status-bar-height))
	}

	.scroll-h4 {
		height: calc(100vh - 506rpx - var(--status-bar-height))
	}

	.index {
		padding-bottom: 80rpx;

		.survey {
			margin-top: 20rpx;
			margin-bottom: 8rpx;
			background-color: #FFFFFF;
			padding: 0 30rpx;

			.survey-title {
				height: 98rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #F0F0F0;
				justify-content: space-between;

				text {
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}

				image {
					width: 20rpx;
					height: 12rpx;
				}
			}

			.survey-content {
				padding: 24rpx 0 16rpx 0;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.content-y {
					width: 50%;
					display: flex;
					margin-bottom: 16rpx;

					view {
						width: 200rpx;
						height: 40rpx;
						font-size: 28rpx;
						color: #666666;
					}

					text {
						color: #000000;
						font-size: 28rpx;
						display: inline-block;
						width: calc(100% - 200rpx);
					}
				}
			}
		}

		.tabs {
			width: 100%;
			padding: 0rpx 6rpx;
			// padding: 0 30rpx;
			display: flex;
			align-items: center;


			.tab {
				width: 112rpx;
				height: 112rpx;
				line-height: 112rpx;
				text-align: center;
				font-size: 28rpx;
				color: #999999;
				font-weight: 400;
			}

			.tab-a {
				width: 112rpx;
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

		.nodata {
			padding-top: 260rpx;
			text-align: center;

			image {
				width: 296rpx;
				height: 216rpx;
			}

			view {
				color: #999999;
				margin-top: 30rpx;
				font-size: 32rpx;
			}
		}

		.search-item {
			height: 82rpx;
			position: sticky;
			top: 0rpx;
			background-color: #FFFFFF;
			z-index: 9999;
		}

		.commodity-list {
			box-sizing: border-box;
			width: 100%;
			position: relative;
			top: 3rpx;
		}

		.commodity-item-box {
			background: #FFFFFF;
			display: flex;
			align-items: center;
			padding-right: 30rpx;
			padding-left: 20rpx;
			margin-bottom: 40rpx;
			position: relative;
			z-index: 999;

			&:nth-child(n + 2) {
				margin-top: 48rpx;
			}

			.commodity-item-img {
				width: 192rpx;
				height: 192rpx;
				border-radius: 16rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.commodity-item-info {
				width: 100%;

				.commodity-item-info-name {
					font-size: 32rpx;
					color: #333333;
					font-weight: bold;
					margin-bottom: 8rpx;
				}

				.commodity-item-info-type {
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis; //显示省略号
					display: -webkit-box;
					-webkit-line-clamp: 2; //块元素显示的文本行数
					-webkit-box-orient: vertical;
					height: 66rpx;
					font-size: 24rpx;
					color: #666666;
					margin-bottom: 8rpx;
				}

				.commodity-item-info-from {
					display: inline-block;
					margin-bottom: 20rpx;
					padding: 0 4rpx;
					border: 1rpx solid #C0C0C0;
					border-radius: 4rpx;
					color: #999999;
					font-size: 20rpx;
				}

				.commodity-item-info-select {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.commodity-item-info-money {
						color: #B80201;
						font-size: 28rpx;
					}

					.commodity-item-info-select-no {
						width: 36rpx;
						height: 36rpx;
						border-radius: 50%;
						border: 1rpx solid #D5D5D5;
					}

					image {
						width: 36rpx;
						height: 36rpx;
					}
				}
			}
		}

		.bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 98rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			background-color: #FFFFFF;

			.btn {
				width: 600rpx;
				margin: auto;
				border-radius: 48rpx;
				background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
				line-height: 88rpx;
				text-align: center;
				margin-left: 32rpx;
				color: #FFFFFF;
				font-size: 32rpx;
				height: 88rpx;
			}

			.bottom-select {
				display: flex;
				align-items: center;

				view {
					width: 36rpx;
					height: 36rpx;
					border-radius: 50%;
					border: 1rpx solid #D5D5D5;
				}

				image {
					width: 36rpx;
					height: 36rpx;
				}

				text {
					color: #000000;
					font-size: 28rpx;
					margin-left: 16rpx;
				}
			}

			.bottom-r {
				display: flex;
				align-items: center;

				text {
					color: #333333;
					font-size: 28rpx;
				}

				.bottom-btn {
					width: 204rpx;
					height: 88rpx;
					border-radius: 48rpx;
					background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
					line-height: 88rpx;
					text-align: center;
					margin-left: 32rpx;
					color: #FFFFFF;
					font-size: 32rpx;
				}
			}
		}
	}
</style>
