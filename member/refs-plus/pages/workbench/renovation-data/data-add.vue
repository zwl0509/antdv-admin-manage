<template>
	<view class="select-data">
		<u-navbar :border='false' class="navbar fl-cc" :border-bottom="false">
			<u-search mImage='/static/image/workbench/customer-manage/search.png' :uIconShow="false"
				placeholder-color="#C0C0C0" v-model="materialNameOrType" placeholder="请输入搜索内容" @change="getCustomerDispatchInfo"
				:show-action="false">
			</u-search>
			<view class="" style="width: 34rpx;">
			</view>
		</u-navbar>
		<view class="" v-if="categoryList.length">
			<sale-prod-content class="scroll-h" :initLoad="categoryList">
				<view class="">
					<sale-prod-item v-for="(categoryItem, cIndex) in categoryList" :key="cIndex"
						:anchorId="'category-anchor-'+categoryItem.anchorId">
						<view class="commodity-list"
							v-if="categoryItem.productInfoList && categoryItem.productInfoList.length">
							<view class="" v-for="(item, index) in categoryItem.productInfoList" :key="cIndex+'-'+index"
								@click="select(item)">
								<view class="commodity-item-box">
									<image src="/static/image/workbench/renovation-data/icon.png" mode=""
										class="commodity-item-img">
									</image>
									<view class="commodity-item-info">
										<view class="commodity-item-info-name">
											<text class="name">{{item.materialName}}</text>
										</view>
										<view class="commodity-item-info-type">
											{{item.materialType ? item.materialType+';':''}}
											{{item.materialName ? item.materialName+';':''}}
											{{item.spec ? item.spec+';':''}}
											{{item.color ? item.color:''}}
										</view>
										<!-- 										<view class="commodity-item-info-from">
											{{item.from}}
										</view> -->
										<view class="commodity-item-info-select">
											<view class="commodity-item-info-money">
												￥{{item.salePrice}}
											</view>
											<view class="commodity-item-info-select-no" v-if="!item.select">

											</view>
											<image src="/static/image/workbench/renovation-data/select.png" mode=""
												v-else>
											</image>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view style="height: 60rpx" v-else></view>
					</sale-prod-item>
				</view>
			</sale-prod-content>
		</view>

		<view class="nodata" v-else>
			<image src="/static/image/workbench/customer-manage/none.png" mode=""></image>
			<view class="">
				空空如也~
			</view>
		</view>
		<view class="bottom">
			<view class="bottom-select" @click="selectAllGoods">
				<view class="" v-if="!selectAll">

				</view>
				<image src="/static/image/workbench/renovation-data/select.png" mode="" v-else></image>
				<text>全选</text>
			</view>
			<view class="bottom-r">
				<text>已选择{{selectNumber}}件</text>
				<view class="bottom-btn" @click="toedit">
					确定
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
				selectNumber: 0, //选择数
				selectAll: false,
				seletList:[],//选择列表
				materialNameOrType: '',
				tabList: [{
					title: '待确认',
					value: false
				}, {
					title: '已确认',
					value: true
				}],
				categoryList: [],//材料列表
				backIndex:2
			}
		},
		onLoad(options) {
			if(options.backIndex){
				this.backIndex=options.backIndex
			}
			this.getCustomerDispatchInfo()
		},
		methods: {
			//全选
			selectAllGoods() {
				if (this.selectAll) {
					this.categoryList.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = false
						})
					})

				} else {
					this.categoryList.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = true
						})
					})
				}
				this.selectAll = !this.selectAll
			},
			//获取材料列表
			getCustomerDispatchInfo() {
				this.$get({
					url: this.api.WorkerInfo.getMaterialInfoList,
					data:{
						materialNameOrType:this.materialNameOrType
					}
				}).then(res => {
					res.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = false
						})
					})
					this.categoryList = res
					console.log(this.categoryList)
				})
			},
			select(item) {
				item.select = !item.select
			},
			toedit() {
				if (this.selectNumber > 0) {
					uni.navigateTo({
						url:'data-deit?data='+JSON.stringify(this.seletList)+'&backIndex='+this.backIndex
					})
				}else{
					this.$Toast('请先选择')
				}
			}
		},
		watch: {
			categoryList: {
				handler: function(val) {
					let res = 0
					this.seletList=[]
					val.forEach(item => {
						this.seletList=this.seletList.concat(item.productInfoList.filter(function(item2, index) {
							return item2.select == true
						}))
						res = res + item.productInfoList.filter(function(item2, index) {
							return item2.select == true
						}).length;
					})
					let allNumber = 0
					val.forEach(item => {
						allNumber = allNumber + item.productInfoList.length;
					})
					if (res == allNumber) {
						this.selectAll = true
					} else {
						this.selectAll = false
					}
					this.selectNumber = res
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
		background-color: #FFFFFF;
		justify-content: center;
		margin-bottom: 20rpx;
		// position: fixed;
		// top:0;
		// left: 0rpx;
		// z-index: 999;
		// border-bottom: 1rpx solid #F0F0F0;

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
			background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
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

	.scroll-h {
		height: calc(100vh - 88rpx - var(--status-bar-height));
		padding-bottom: 100rpx;

		.commodity-list {
			box-sizing: border-box;
			width: 100%;
			position: relative;
			top: 3rpx;
			padding: 0.1rpx;
		}

		.operations {
			padding: 0 30rpx;

			.operation {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 18rpx;
				padding-top: 20rpx;
				border-top: 2rpx solid #F0F0F0;

				text {
					color: #333333;
					font-size: 24rpx;
				}

				.operation-y {
					display: flex;
					align-items: flex-end;

					image {
						width: 28rpx;
						height: 28rpx;
						margin-right: 10rpx;
					}
				}
			}
		}


		.commodity-item-box {
			background: #FFFFFF;
			display: flex;
			align-items: flex-start;
			padding-right: 30rpx;
			padding-left: 20rpx;
			// margin-bottom: 40rpx;
			position: relative;
			z-index: 999;
			margin-top: 24rpx;

			&:nth-child(n + 2) {
				margin-top: 42rpx;
			}

			.commodity-item-img {
				width: 20rpx;
				height: 36rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.commodity-item-info {
				width: 100%;

				.commodity-item-info-name {
					margin-bottom: 8rpx;
					display: flex;
					align-items: center;

					.name {
						font-size: 32rpx;
						color: #333333;
						font-weight: bold;
					}

					.budget {
						display: inline-block;
						width: 50rpx;
						height: 32rpx;
						line-height: 32rpx;
						text-align: center;
						background: #FCEDED;
						border-radius: 4rpx;
						color: #B80201;
						font-size: 20rpx;
						margin-left: 12rpx;
					}

					.new {
						display: inline-block;
						width: 50rpx;
						height: 32rpx;
						line-height: 32rpx;
						text-align: center;
						background: #E1FAFA;
						border-radius: 4rpx;
						color: #0AB4B3;
						font-size: 20rpx;
						margin-left: 12rpx;
					}

					.status-r {
						color: #999999;
						font-size: 24rpx;
					}

					.status-g {
						color: #B80201;
						font-size: 24rpx;
					}
				}

				.commodity-item-info-type {
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis; //显示省略号
					display: -webkit-box;
					-webkit-line-clamp: 2; //块元素显示的文本行数
					-webkit-box-orient: vertical;
					min-height: 55rpx;
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

					.set {}

					.reset {
						display: flex;
						align-items: center;

						text {
							color: #333333;
							font-size: 24rpx;
						}

						image {
							width: 28rpx;
							height: 28rpx;
							margin-right: 10rpx;
						}
					}

					.commodity-item-info-money {
						color: #B80201;
						font-size: 28rpx;
					}

					.commodity-item-info-select-no {
						width: 36rpx;
						height: 36rpx;
						border-radius: 50%;
						border: 1rpx solid #D5D5D5;
						box-sizing: border-box;
					}

					image {
						width: 36rpx;
						height: 36rpx;
					}
				}
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
		z-index: 9999;

		.btn {
			width: 600rpx;
			margin: auto;
			border-radius: 48rpx;
			background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
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
				background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
				line-height: 88rpx;
				text-align: center;
				margin-left: 32rpx;
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}
	}
</style>
