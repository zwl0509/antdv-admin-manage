<template>
	<view class="index">
		<u-navbar :is-back="true" :border-bottom='false' back-icon-color='#333333'>
			<view class="slot-wrap">
				<input type="text" v-model="materialName" placeholder="请输入搜索材料" @input="getMaterialsWithClassify(stockId)"/>
				<image src="/static/image/workbench/product-dispatch/search.png" mode=""></image>
			</view>
		</u-navbar>
		<!-- 		<view class="" style="padding: 13rpx 15rpx;margin-bottom: 20rpx;background-color: #FFFFFF;">
			<u-tabs :list="list" name="stockName" :is-scroll='true' :current="current" @change="change" bar-height="6"
				bar-width="44" gutter='20' active-color2="#333333" active-color="#B80201" inactive-color='#999999'
				height='86' bg-color='#ffffff'></u-tabs>
		</view> -->
		<sale-prod-content style="height: calc(100vh - 128rpx - 88rpx - var(--status-bar-height));"
			:initLoad="categoryList" v-if="categoryList.length">
			<sale-prod-item v-for="(categoryItem, cIndex) in categoryList" :key="cIndex"
				:anchorId="'category-anchor-'+categoryItem.anchorId">
				<view class="commodity-list" v-if="categoryItem.productInfoList && categoryItem.productInfoList.length">
					<view class="commodity-item-box" v-for="(item, index) in categoryItem.productInfoList"
						:key="cIndex+'-'+index">
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
							<view class="commodity-item-info-add">
								<view class="commodity-item-info-add-l">
									<!-- 	<view class="commodity-item-info-from">
										{{item.from}}
									</view> -->
									<view class="commodity-item-info-money">
										￥{{item.salePrice}}
									</view>
								</view>
								<view class="commodity-item-info-add-r">
									<image src="/static/image/workbench/material-declare/reduce.png" mode=""
										v-show="item.applyNum>0" @click="reduce(item)"></image>
									<text v-show="item.applyNum>0">{{item.applyNum}}</text>
									<image src="/static/image/workbench/material-declare/add.png" mode=""
										@click="add(item)"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="height: 60rpx" v-else></view>
			</sale-prod-item>
		</sale-prod-content>
		<view v-else style="padding-top:236rpx ;text-align: center;">
			<image src="/static/image/workbench/customer-manage/nodata.png"
				style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
			<view style='color: #999999;font-size: 32rpx;'>
				空空如也~
			</view>
		</view>
		<view class="bottom">
			<view class="bottom-btn">
				<view class="bottom-btn-l">
					<view class="bottom-btn-l-icon">
						<image src="/static/image/workbench/material-declare/bug.png" mode=""></image>
						<text class="" v-show="allNum>0">{{allNum}}</text>
					</view>
					<text class="bottom-btn-l-text">合计</text>
					<text class="bottom-btn-l-num">￥{{allCount.toFixed(2)}}</text>
				</view>
				<view class="bottom-btn-r" @click="back">
					确认材料
				</view>
			</view>
		</view>
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
				allNum: 0,
				allCount: 0,
				list: [{
					name: '苏州文明施工'
				}, {
					name: '苏州辅材'
				}, {
					name: '无锡文明设施'
				}, {
					name: '无锡辅材'
				}, {
					name: '无锡文明设施'
				}, {
					name: '无锡辅材'
				}],
				current: 0,
				categoryList: [],
				selectList: [],
				customerId: '',
				warehouseEmployeeId: '',
				isAdd: false,
				id: '',
				materialName:'',
				relations: [],
				unifiedArrivedTime:''
			}
		},
		onLoad(options) {
			this.stockId = options.stockId
			this.warehouseEmployeeId = options.warehouseEmployeeId
			this.customerId = options.customerId
			if (options.id) {
				this.id = options.id
			}
			if (options.isAdd) {
				this.isAdd = options.isAdd
			}
			if (options.relations) {
				this.relations = JSON.parse(options.relations)
			}
			if (options.unifiedArrivedTime) {
				this.unifiedArrivedTime = options.unifiedArrivedTime
			}
			this.getMaterialsWithClassify(this.stockId)
			// this.getStockList()
		},
		methods: {
			//获取仓库列表
			getStockList() {
				this.$get({
					url: this.api.AuxiliaryMaterialsInfo.getStockList
				}).then(res => {
					this.list = res.rows
					this.getMaterialsWithClassify(this.list[0].id)
				})
			},
			//
			getMaterialsWithClassify(stockId) {
				this.$get({
					url: this.api.AuxiliaryMaterialsInfo.getMaterialsWithClassify,
					data: {
						stockId: stockId,
						materialName:this.materialName
					}
				}).then(res => {
					res.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.applyNum = 0
						})
					})
					this.categoryList = res
				})
			},
			change(index) {
				this.current = index;
				this.getMaterialsWithClassify(this.list[index].id)
			},
			add(item) {
				item.applyNum = item.applyNum + 1
			},
			reduce(item) {
				item.applyNum = item.applyNum - 1
			},
			back() {
				if (this.selectList.length) {
					uni.navigateTo({
						url: 'bill-detail?type=1095-20' + '&ismodify=false&list=' + JSON.stringify(this
								.selectList) + '&customerId=' + this.customerId + '&stockId=' + this.stockId +
							'&warehouseEmployeeId=' + this.warehouseEmployeeId + '&isAdd=true' +
							'&id=' + this.id + '&relations=' + JSON.stringify(this.relations)+
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
					this.allCount = 0
					this.selectList = []
					val.forEach(item => {
						item.productInfoList.forEach(item2 => {
							if (item2.applyNum != 0) {
								this.selectList.push(item2)
							}
							this.allNum = this.allNum + item2.applyNum
							this.allCount = this.allCount + item2.applyNum * item2.salePrice
						});
					})
				},
				deep: true
			}
		}
	}
</script>
<style>
	page {
		background-color: #F6F6F6;
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
		.commodity-list {
			padding-top: 20rpx;
			padding-bottom: 10rpx;
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

				.commodity-item-info-add {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.commodity-item-info-add-l {
						.commodity-item-info-money {
							color: #B80201;
							font-size: 28rpx;
						}

						.commodity-item-info-from {
							color: #999999;
							font-size: 24rpx;
							margin-bottom: 16rpx;
						}
					}

					.commodity-item-info-add-r {
						display: flex;
						align-items: center;

						image {
							width: 40rpx;
							height: 40rpx;
						}

						text {
							color: #999999;
							font-size: 30rpx;
							margin: 0 14rpx;
						}
					}
				}
			}
		}

		.bottom {
			width: 100%;
			height: 120rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #FFFFFF;
			z-index: 9999;

			.bottom-btn {
				border-radius: 49rpx;
				width: 690rpx;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;

				.bottom-btn-l {
					height: 88rpx;
					width: 510rpx;
					display: flex;
					align-items: center;
					padding-left: 30rpx;
					color: #FFFFFF;
					background-color: #000000;

					.bottom-btn-l-icon {
						position: relative;

						image {
							width: 34rpx;
							height: 36rpx;
						}

						text {
							display: inline-block;
							position: absolute;
							top: -13rpx;
							right: -13rpx;
							width: 26rpx;
							height: 26rpx;
							border-radius: 50%;
							background-color: #B80201;
							line-height: 26rpx;
							text-align: center;
							font-size: 20rpx;
						}
					}

					.bottom-btn-l-text {
						font-size: 24rpx;
						margin-left: 25rpx;
						margin-right: 4rpx;
					}

					.bottom-btn-l-num {
						font-size: 34rpx;
					}
				}

				.bottom-btn-r {
					width: 180rpx;
					background-color: #B80201;
					height: 88rpx;
					line-height: 88rpx;
					text-align: center;
					color: #FFFFFF;
					font-size: 32rpx;
				}
			}
		}
	}
</style>
