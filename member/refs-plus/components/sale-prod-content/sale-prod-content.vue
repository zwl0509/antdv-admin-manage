<template>
	<view class="sale-prod-content fl-csb" :class="[homeHeaderClass]">
		<!-- <enterprise-home-header class="manage-home-header" ref="enterpriseHomeHeader" v-if="showOpeningPrice" v-model="homeHeaderClass" :organizationId="organizationId"></enterprise-home-header> -->
		<scroll-view class="category-list" :scroll-y="true">
			<view class="category-item" v-for="(item, index) in categoryList" @click="handleCategoryClick(index)"
				:class="{selected: categoryIndex === index }" :key="index">
				<text>{{item.classifyName}}</text>
			</view>
			<u-empty :text="loadFail ?'加载失败':'暂无分类'" icon-size="60" color="#999" icon-color="#999"
				v-if="!loading && !categoryList.length" style="height: auto;padding-top: 30rpx"></u-empty>
		</scroll-view>
		<scroll-view class="commodity-scroll-list" :scroll-y="true" :scroll-into-view="currentAnchorId"
			:scroll-with-animation="true" @touchstart="touchStart" @scroll="scroll">
			<slot>
				<sale-prod-item v-for="(categoryItem, cIndex) in categoryList" :key="cIndex"
					:anchorId="anchorPre + cIndex" :title="categoryItem.classifyName">
					<view class="commodity-list"
						v-if="categoryItem.productInfoList && categoryItem.productInfoList.length">
						<view class="commodity-item-box" v-for="(item, index) in categoryItem.productInfoList"
							:key="cIndex+'-'+index">
							<view class="commodity-item fl-csb" @click="handleCommodityClick(cIndex, index)">
								<!-- <image class="commodity-img" mode="scaleToFill" :src="item.listDisplayAttach || require ('/static/image/common/product-loading.png')"></image> -->
								<image class="commodity-img" mode="scaleToFill" :src="item.listDisplayAttach"></image>
								<view class="right">
									<view class="line title" style="font-size: 30rpx;color: #333">{{item.productName}}
									</view>
									<view class="line" style="color:#AAAAAA;margin: 6rpx 0;">
										编号：{{item.identifier || ''}}
									</view>
									<view class="line word-wrap" style="color:#666;">
										规格：{{ item.productSkuQuantityVOList[0] && item.productSkuQuantityVOList[0].skuName || '暂无规格'}}
									</view>
									<view class=""
										style="display: flex; align-items: center;overflow: hidden;width: 319rpx;text-overflow: ellipsis;white-space: nowrap;">
										<view class="line fl-su"
											style="color: #666;flex-shrink: 0;margin-right: 16rpx;">
											出库：{{item.deliveryNum || 0}}
										</view>
										<view class="line u-line-1" v-if="item.processingChose">
											{{item.processingChose ||''}}
										</view>
									</view>
									<text class="bot-line word-wrap" style="max-width: calc(100% - 120rpx)"
										v-if="item.productMinPrice || item.productMaxPrice">
										<text class="price-unit">{{priceUnit(item.priceUnit)}}</text>
										<text>{{dealWithPrice(item.productMinPrice,item.productMaxPrice)}}</text>
										<text class="price-unit" style="color: #FF2E2E ;">/{{item.units}}</text>
									</text>
									<text class="bot-line word-wrap" style="max-width: calc(100% - 120rpx)" v-else><text
											class="price-unit">暂无价格</text></text>
									<view class="check-box" v-if="openCheck">
										<!-- <u-checkbox active-color="#0060FF" :name="item.id" v-model="!!item.checked" >
										</u-checkbox> -->
										<view class=""
											style="width: 32rpx; height: 32rpx; border-radius: 50%;border: 1rpx solid #E0E0E0;"
											:name="item.id" v-if="!item.checked">

										</view>
										<image src="/static/image/common/checked-icon.png" mode="" v-else
											style="width: 32rpx;height: 32rpx;" :name="item.id"></image>
									</view>
								</view>
							</view>
							<slot name="categoryItem" :record="item" :index="index"></slot>
						</view>
					</view>
					<view style="height: 60rpx" v-else></view>
				</sale-prod-item>
				<u-empty icon-size="60" color="#999" icon-color="#999" v-if="!loading && !categoryList.length">
				</u-empty>
			</slot>
		</scroll-view>
		<!-- 		<u-mask :show="loading">
			<save-loading :loading="loading" title="正在加载"></save-loading>
		</u-mask> -->
	</view>
</template>
<script>
	// import { getPrefixValue } from '@/utils/currency'
	import SaleProdItem from '@/components/sale-prod-content/sale-prod-item'

	export default {
		components: {
			SaleProdItem
		},
		props: {
			openCheck: {
				type: Boolean,
				default: false
			},
			//已选择数据 [id] || [id1, id2, id3 ...]
			selectedData: {
				type: Array,
				default: null
			},
			// 产品分类查询参数
			searchParams: {
				type: Object,
				default: null
			},
			// 产品查询参数
			commoditySearchParams: {
				type: Object,
				default: null
			},
			// 初始加载数据
			initLoad: {
				type: Array,
				default: null
			},
			// 显示当前企业开盘价
			showOpeningPrice: {
				type: Boolean,
				default: false
			},
			showSequence: {
				type: Boolean,
				default: false
			},
			commodityId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				anchorPre: 'category-anchor-',
				categoryList: [],
				categoryLoading: false,
				categoryIndex: 0,
				commodityList: [],
				//
				checkedList: [],
				checkedItemList: [],
				currentAnchorId: '',
				loading: false,
				loadFail: false,
				organizationId: '',
				openPriceText: '',
				homeHeaderClass: '',
				anchorList: [], // 锚点的位置
				isClickAnchor: false,
				lastItemHeight: 0
			}
		},
		created() {
			// this.organizationId = this.vuex_user.organizationId
			this.loadCategoryData()
		},
		onShow() {
			this.loadCategoryData()
		},
		mounted() {
			if (this.categoryList.length) {
				this.setAnchorPointer()
			}
		},
		methods: {
			// 加载产品分类数据
			loadCategoryData() {
				this.initLoad.forEach(item => {
					let a = {
						classifyName: item.classifyName
					}
					this.categoryList.push(a)
				})
				return
				this.loading = true
				this.loadFail = false
				this.$get({
						// url: this.api.product.category.getList,
						url: this.api.home.getEnterpriseProdList,
						data: {
							...this.searchParams,
							organizationId: this.commodityId || this.organizationId
						}
					})
					.then(res => {
						this.categoryList = res || []
						if (this.$slots.default) {
							this.$emit('loadFinish', this.categoryList)
						}
						this.$emit('initData', this.categoryList)
						this.selectedData && this.initCheckData(this.selectedData)
						this.$nextTick(() => {
							this.setAnchorPointer()
						})
						// this.loadCommodityData()
					})
					.catch(err => {
						this.loadFail = true
					})
					.finally(() => {
						this.loading = false
					})
			},
			refresh() {
				this.refreshCategory()
			},
			refreshCategory() {
				this.categoryList = []
				this.loadCategoryData()
			},
			refreshBanner() {
				this.$refs.enterpriseHomeHeader.getGraphicPath()
			},
			refreshOpeningPrice() {
				this.$refs.enterpriseHomeHeader.getOrganizationInfo(true)
			},
			handleCategoryClick(index) {
				this.categoryIndex = index
				this.currentAnchorId = this.anchorPre + index
				this.isClickAnchor = true
				this.setAnchorPointer()
				this.$emit('categoryClick', index, this.categoryList[index])
			},
			handleCommodityClick(cIndex, index) {
				if (this.openCheck) {
					const item = this.categoryList[cIndex].productInfoList[index]
					item.checked = !item.checked
					this.$set(this.categoryList, cIndex, this.categoryList[cIndex])
					if (this.checkedList.includes(item.id)) {
						const checkIndex = this.checkedList.indexOf(item.id)
						this.checkedItemList.splice(checkIndex, 1)
						this.checkedList.splice(checkIndex, 1)
					} else {
						this.checkedList.push(item.id)
						this.checkedItemList.push(item)
					}
					this.$emit('itemClick', this.checkedList, this.checkedItemList || [])
				} else {
					this.$emit('itemClick', index, this.categoryList[cIndex].productInfoList[index])
				}
			},
			priceUnit(v) {
				return getPrefixValue(v)
			},
			getSpecs(item) {
				let specs = ''
				let title = ''
				let skuName = ''
				item.productSkuQuantityVOList && item.productSkuQuantityVOList.forEach((pItem, pIndex) => {
					if (pItem.attributeJsonStr && JSON.parse(pItem.attributeJsonStr).length) {
						let attributeJsonList = JSON.parse(pItem.attributeJsonStr)
						if (!pIndex) {
							attributeJsonList.forEach((ele, eIndex) => {
								if (ele) {
									title +=
										`${ele.parentSkuName}${eIndex === attributeJsonList.length - 1? '' : '/'}`
								}
							})
						}
						attributeJsonList.forEach((ele, eIndex) => {
							if (ele) {
								skuName +=
									`${ele.cSkuName}${eIndex === attributeJsonList.length - 1? '' : '/'}${ele.isMachiningCost? item.weightUnit || ' ':''}` +
									' '
							}
						})
					}
				})
				if (title && skuName) {
					specs += `${title}:${skuName}`
				}
				return specs
			},
			amountText(value) {
				return value ? value.toFixed(2) : ''
			},
			dealWithPrice(minPrice, maxPrice) {
				if (minPrice && maxPrice || (minPrice === 0 || maxPrice === 0)) {
					return minPrice === maxPrice ? minPrice : `${minPrice}~${maxPrice}`
				} else {
					return ''
				}
			},
			initCheckData(v = []) {
				if (this.openCheck) {
					this.checkedList = this.selectedData
					this.checkedItemList = []
					this.categoryList.map(m => {
						m.productInfoList && m.productInfoList.map(m2 => {
							m2.checked = v.includes(m2.id)
							if (v.includes(m2.id)) {
								this.checkedItemList.push(m2.id)
							}
						})
					})
				}
			},
			selectAll() {
				if (this.checkedList.length === (this.categoryList.map(m => m.productInfoList.length)).reduce((a, b) => (
						a || 0) + (b || 0))) {
					this.clearSelect()
					this.$emit('itemClick', [], [])
				} else {
					this.categoryList.map(m => {
						m.productInfoList.map(m2 => {
							m2.checked = true
							this.checkedList.push(m2.id)
							this.checkedItemList.push(m2.id)
						})
					})
					this.categoryList = [...this.categoryList]
					this.$emit('itemClick', this.checkedList, this.checkedItemList || [])
				}
			},
			clearSelect() {
				this.checkedList = []
				this.checkedItemList = []
				this.categoryList.map(m => {
					m.productInfoList.map(m2 => {
						m2.checked = false
					})
				})
				this.categoryList = [...this.categoryList]
			},
			// 设置各锚点的位置
			setAnchorPointer() {
				if (this.anchorList.length) return
				const query = uni.createSelectorQuery() //.in(this)
				query.selectAll('.category-commodity-item').fields({
					rect: true,
					scrollOffset: true,
				}).exec((res) => {
					console.log(res)
					const list = res[0]
					if (list.length) {
						this.anchorList = list.map(m => m.top)
						this.lastItemHeight = list[list.length - 1].bottom - list[list.length - 1].top
						const first = this.anchorList[0] || 0
						this.anchorList = this.anchorList.map(m => (m || 0) - first)
					}
				})
			},
			touchStart() {
				if (this.isClickAnchor) this.isClickAnchor = false
				this.setAnchorPointer()
			},
			// 列表滚动
			scroll(e) {
				// console.log(this.anchorList.length, this.isClickAnchor, this.categoryIndex)
				if (this.anchorList.length && !this.isClickAnchor) {
					// 不是点菜单而滚动的
					// if (!this.isClickAnchor) {
					// console.log(this.categoryIndex)
					let index = this.anchorList.findIndex(m => m >= e.detail.scrollTop)
					if (index > -1 && e.detail.scrollTop < this.anchorList[index]) index -= 1
					else if (e.detail.scrollTop > this.anchorList[this.anchorList.length - 1]) index = this.anchorList
						.length - 1
					if (!this.isClickAnchor && index > -1 && index !== this.categoryIndex) {
						this.categoryIndex = index
					}
					// console.log(this.categoryIndex)
					// }
				}
			}
		},
		watch: {
			selectedData(v) {
				this.initCheckData(v)
			},
			initLoad: {
				handler: function(val) {
					this.categoryList=[]
					val.forEach(item => {
						let a = {
							classifyName: item.classifyName
						}
						this.categoryList.push(a)
					})
				},
				deep: true
			}
		}
	}
</script>
<style lang="scss" scoped>
	.sale-prod-content {
		box-sizing: border-box;
		align-items: flex-start !important;

		.category-list {
			z-index: 1;
			background-color: #F8F8F8;
			overflow: hidden;
			width: 180rpx;
			height: 100%;

			.category-item {
				text-align: center;
				z-index: 2;
				font-size: 26rpx;
				color: #666666;
				box-sizing: border-box;
				word-wrap: break-word;
				cursor: pointer;
				pointer-events: all;
				min-height: 82rpx;
				// line-height: 82rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 !important;
				padding: 0 !important;

				&.selected {
					font-weight: bold;
					// color: $primaryColor;
					color: #333333;
					position: relative;
					background-color: white;

					// &:before {
					// 	content: '';
					// 	position: absolute;
					// 	top: 0rpx;
					// 	bottom: 0rpx;
					// 	margin: auto;
					// 	left: 0;
					// 	width: 6rpx;
					// 	height: 28rpx;
					// 	background: linear-gradient(90deg, #0060FF 0%, #11BFFF 100%);
					// 	border-radius: 3rpx;
					// }
				}
			}
		}

		.commodity-scroll-list {
			background-color: white;
			width: calc(100% - 180rpx);
			height: 100%;
			box-sizing: border-box;

			.category-commodity-item:first-child {
				padding-top: 30rpx;
				box-sizing: border-box;
			}

			.category-commodity-item:last-child {
				padding-bottom: 30rpx;
				box-sizing: border-box;
			}

			.commodity-list {
				padding: 20rpx 30rpx 20rpx 20rpx;
				box-sizing: border-box;
				width: 100%;
			}

			.commodity-item-box {
				background: #FFFFFF;

				/*box-shadow: 0px 0px 8rpx 0px rgba(170, 170, 170, 0.3);*/
				/*border-radius: 10rpx;*/
				&:nth-child(n + 2) {
					margin-top: 48rpx;
				}

				.check-box {
					pointer-events: none;
				}

				.commodity-img {
					width: 192rpx;
					height: 192rpx;
					border-radius: 10rpx;
					overflow: hidden;

					image {
						border-radius: 10rpx;
					}
				}

				.right {
					width: calc(100% - 200rpx);
					padding: 0 10rpx 40rpx 15rpx;
					box-sizing: border-box;
					position: relative;
					min-height: 200rpx;

					.line {
						font-size: 20rpx;
						font-weight: 500;
						color: #666666;
						line-height: 36rpx;
						word-break: break-all;

						.text {
							padding-left: 2rpx;
							color: #AAAAAA;
						}
					}

					.two-c {
						.line {
							width: 50%;
						}
					}

					.three-c {
						height: 36rpx;

						.line {
							width: 33.333%;
						}
					}

					.check-box {
						position: absolute;
						right: 16rpx;
						bottom: 0rpx;
						width: 33rpx;
						height: 36rpx;
					}

					.bot-line {
						position: absolute;
						bottom: 0;
						left: 15rpx;
						font-size: 30rpx;
						color: #FF2232;
						right: 50rpx;

						.price-unit {
							font-size: 20rpx;
						}
					}
				}

				.item-sequence {
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
		}

		/*&.show-open-price{*/
		/*	padding-top: 72rpx;*/
		/*	box-sizing: border-box;*/

		/*}*/
		.manage-home-header {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 0rpx;
		}
	}

	.has-open-price {
		padding-top: 82rpx;

		.manage-home-header {
			height: 82rpx
		}
	}

	.has-two-price {
		padding-top: 154rpx;

		.manage-home-header {
			height: 154rpx
		}
	}

	.has-banner {
		padding-top: 440rpx;

		.manage-home-header {
			height: 440rpx
		}

		&.has-open-price {
			padding-top: 522rpx;

			.manage-home-header {
				height: 522rpx
			}
		}

		&.has-two-price {
			padding-top: 594rpx;

			.manage-home-header {
				height: 594rpx
			}
		}
	}

	::v-deep .manage-home-header {
		.chart-intro {
			padding-top: 12rpx;
		}
	}
</style>
