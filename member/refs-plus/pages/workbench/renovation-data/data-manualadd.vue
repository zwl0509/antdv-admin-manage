<template>
	<view class="select-data">
		<u-navbar :border='false' class="navbar fl-cc" :border-bottom="false">
			<u-search mImage='/static/image/workbench/customer-manage/search.png' :uIconShow="false"
				placeholder-color="#C0C0C0" v-model="materialNameOrType" placeholder="请输入搜索内容"
				@change="getCustomerDispatchInfo" :show-action="false">
			</u-search>
			<view class="" style="width: 34rpx;">
			</view>
		</u-navbar>
		<view class="main-package" @click="packageShow=true" v-if="isPackageCustomer">
			<view class="main-package-l">
				<image src="/static/image/workbench/renovation-data/package.png" mode=""></image>
				<text>{{currentPackage.name}}</text>
			</view>
			<image src="/static/image/workbench/renovation-data/right2.png" mode="" class="main-package-r"></image>
		</view>
		<view class="" v-if="categoryList.length">
			<sale-prod-content class="scroll-h" :style="{height: isPackageCustomer ? 'calc(100vh - 88rpx - 92rpx - var(--status-bar-height))':'calc(100vh - 88rpx - var(--status-bar-height))'}" :initLoad="categoryList">
				<view class="">
					<sale-prod-item v-for="(categoryItem, cIndex) in categoryList" :key="cIndex"
						:anchorId="'category-anchor-'+categoryItem.anchorId">
						<view class="commodity-list"
							v-if="categoryItem.productInfoList && categoryItem.productInfoList.length">
							<view class="" v-for="(item, index) in categoryItem.productInfoList"
								:key="cIndex+'-'+index">
								<view class="commodity-item-box">
									<image src="/static/image/workbench/renovation-data/img.png" mode=""
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
											<view class="set" @click="showChoose(item)">
												选规格
											</view>
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
		<u-popup v-model="show" mode="bottom" border-radius="16">
			<scroll-view scroll-y="true">
				<view class="popupSelect">
					<view class="popupSelect-title">
						<view class="popupSelect-title-info">
							<image src="/static/image/workbench/renovation-data/img.png" mode=""></image>
							<view class="info">
								<view class="info-name">
									{{selectItem.materialName}}
								</view>
								<view class="">
									<view class="info-money">
										<text style="font-size: 28rpx;">¥</text><text :style="{textDecoration:identifications_price? 'line-through':'' }">{{selectItem.salePrice}}</text>
										<text style="font-size: 28rpx;margin-left: 20rpx;" v-if="identifications_price">   ¥</text><text>{{identifications_price}}</text>
									</view>
									<view class="info-discount"
										v-if="isPackageCustomer&&pavingPrice>selectItem.pavementPrice">
										更换{{currentPackage.name}}，需补差价<text>{{pavingPrice-selectItem.pavementPrice}}</text>元
									</view>
								</view>
							</view>
						</view>
						<view class="popupSelect-kong">

						</view>
						<image src="/static/image/workbench/renovation-data/close.png" mode="" class="popupSelect-cha"
							@click="show=false">
						</image>
					</view>
					<view class="popupSelect-y">
						<view class="popupSelect-y-title">
							所属区域
						</view>
						<view class="popupSelect-y-content">
							<text v-for="(val,index) in areaList" :key="index"
								:class="val.select ? 'popupSelect-y-content-red':''"
								@click="val.select=!val.select">{{val.name}}</text>
						</view>
					</view>
					<view class="popupSelect-y" v-if="isPackageCustomer">
						<view class="popupSelect-y-title">
							铺装位置
						</view>
						<view class="popupSelect-y-content">
							<text v-for="(val,index) in selectItem.pavements" :key="index"
								:class="val.select ? 'popupSelect-y-content-red':''"
								@click="selectPaving(val)">{{val.positionName}}</text>
						</view>
					</view>
					<view class="popupSelect-y" v-else>
						<view class="popupSelect-y-title">
							铺装位置
						</view>
						<view class="popupSelect-y-content">
							<text v-for="(val,index) in pavements" :key="index"
								:class="val.select ? 'popupSelect-y-content-red':''"
								@click="selectPaving2(val)">{{val.name}}</text>
						</view>
					</view>
					<view class="popupSelect-y">
						<view class="popupSelect-y-title">
							材料标识
						</view>
						<view class="popupSelect-y-content">
							<text v-for="(val,index) in selectItem.priceSigns" :key="index"
								:class="val.select ? 'popupSelect-y-content-red':''"
								@click="selectIdentification(val)">{{val.priceSignName}}</text>
						</view>
					</view>
					<view class="popupSelect-y">
						<view class="popupSelect-y-title">
							颜色
						</view>
						<view class="popupSelect-y-content">
							<text v-for="(val,index) in selectItem.attributes" :key="index"
								:class="val.select ? 'popupSelect-y-content-red':''"
								@click="selectColor(val)">{{val.attributeName}}</text>
						</view>
					</view>
					<view class="popupSelect-xian">

					</view>
					<view class="popupSelect-y">
						<view class="popupSelect-y-title">
							是否测量
						</view>
						<view class="popupSelect-y-content">
							<text :class="seletList.isMeasure ? 'popupSelect-y-content-red':''"
								@click="seletList.isMeasure=true">是</text>
							<text :class="!seletList.isMeasure ? 'popupSelect-y-content-red':''"
								@click="seletList.isMeasure=false">否</text>
						</view>
					</view>
					<view class="popupSelect-y" v-if="selectItem.promotionName">
						<view class="popupSelect-y-title">
							参与活动
						</view>
						<view class="popupSelect-y-content">
							<text class="popupSelect-y-content-red">{{selectItem.promotionName}}</text>
						</view>
					</view>
					<view class="popupSelect-y">
						<view class="popupSelect-y-title">
							选材备注
						</view>
						<view class="popupSelect-y-content">
							<textarea v-model="seletList.remarkReveal" id="" cols="30" rows="10"
								placeholder="这里可以填写您的备注信息哦~"></textarea>
						</view>
					</view>
					<view class="" style="height: 150rpx;">

					</view>
					<view class="popupSelect-btn" @click="save">
						<text>确定</text>
					</view>
				</view>
			</scroll-view>
		</u-popup>
		<u-popup v-model="packageShow" width="750" border-radius="16" mode="bottom">
			<view class="packagePopup">
				<view class="packagePopup-title">
					选择主材包
				</view>
				<scroll-view scroll-y="true">
					<view class="packagePopup-scroll">
						<view :class="currentPackage.id==item.id ? 'packagePopup-scroll-y-r':'packagePopup-scroll-y'"
							v-for="(item,index) in packageList" @click="selectPackage(item)">
							{{item.name}}
						</view>
					</view>
				</scroll-view>
				<view class="packagePopup-btn" @click="packageShow=false">
					取消
				</view>
			</view>
		</u-popup>
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
				show: false,
				selectNumber: 0, //选择数
				selectAll: false,
				seletList: {}, //选择上传的参数
				selectItem: {}, //选择的材料
				materialNameOrType: '',
				tabList: [{
					title: '待确认',
					value: false
				}, {
					title: '已确认',
					value: true
				}],
				categoryList: [], //材料列表
				backIndex: 2,
				areaList: [],
				id: '',
				packageList: [], //主材包列表
				currentPackage: {}, //当前主材包
				isPackageCustomer: false, //是否主材包选材
				packageShow: false, //主材包展示
				pavingPrice: 0,
				manual: false,
				addType: '',
				pavements: [], //铺装位置
				identifications:[],//材料标识
				identifications_price:''
			}
		},
		onLoad(options) {
			if (options.backIndex) {
				this.backIndex = options.backIndex
			}
			if (options.id) {
				this.id = options.id
				console.log(this.id)
			}
			if (options.isPromotionCustomer) {
				this.getPromotionMaterialsWithClass()
				this.addType = '1087-30'
			}
			if (options.isPackageCustomer) {
				this.isPackageCustomer = options.isPackageCustomer
				this.getPackages()
				this.addType = '1087-40'
			}
			if (options.manual) {
				this.manual = options.manual
				this.addType = '1087-20'
				this.getCustomerDispatchInfo()
			}

			this.getTypeList('1086')
			this.getTypeList('10100')
			this.getTypeList('1088')
		},
		methods: {
			//选择材料标识
			selectIdentification(val) {
				this.selectItem.priceSigns.forEach(item => {
					item.select = false
				})
				val.select = true
				this.identifications_price=val.saleOfferPrice
				this.seletList.priceSign = val.value
			},
			//选择铺装位置
			selectPaving(val) {
				this.selectItem.pavements.forEach(item => {
					item.select = false
				})
				val.select = true
				this.pavingPrice = val.price
				this.seletList.pavingLocation = val.positionName
			},
			//选择铺装位置
			selectPaving2(val) {
				this.pavements.forEach(item => {
					item.select = false
				})
				val.select = true
				this.seletList.pavingLocation = val.name
			},
			//选择颜色
			selectColor(val) {
				this.selectItem.attributes.forEach(item => {
					item.select = false
				})
				val.select = true
				this.seletList.color = val.attributeName
			},
			//获取活动材料列表
			getPromotionMaterialsWithClass() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$get({
					url: this.api.CustomerChooseMaterialInfo.getPromotionMaterialsWithClass,
					data: {
						materialNameOrType: this.materialNameOrType,
						customerId: uni.getStorageSync('customerId')
					}
				}).then(res => {
					res.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = false
							item2.attributes.forEach(item3 => {
								item3.select = false
							})
							item2.priceSigns.forEach(item3 => {
								item3.select = false
							})
						})
					})
					this.categoryList = res
					uni.hideLoading()
				}).catch(res => {
					uni.hideLoading()
				})
			},
			//选择主材包
			selectPackage(item) {
				this.currentPackage = item
				this.packageShow = false
				this.getAppPackageMaterials(this.currentPackage.id)
			},
			//获取主材包列表
			getPackages() {
				this.$get({
					url: this.api.CustomerChooseMaterialInfo.getPackages
				}).then(res => {
					this.packageList = res
					this.currentPackage = res[0]
					this.getAppPackageMaterials(this.currentPackage.id)
				})
			},
			//获取主材包材料列表
			getAppPackageMaterials(packageId) {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$get({
					url: this.api.CustomerChooseMaterialInfo.getAppPackageMaterials,
					data: {
						materialNameOrType: this.materialNameOrType,
						customerId: uni.getStorageSync('customerId'),
						isPick: true,
						packageId: packageId
					}
				}).then(res => {
					res.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = false
							item2.attributes.forEach(item3 => {
								item3.select = false
							})
							item2.pavements.forEach(item3 => {
								item3.select = false
								if (item2.pavementName == item3.positionName) {
									item3.select = true
									this.pavingPrice = item3.price
								}
							})
						})
					})
					this.categoryList = res
					uni.hideLoading()
				}).catch(res => {
					uni.hideLoading()
				})
			},
			//保存
			save() {
				if (!this.seletList.areas.length) {
					this.$Toast('请选择所属区域')
					return
				}
				let data = this.seletList
				if (this.isPackageCustomer && this.pavingPrice > this.selectItem.pavementPrice) {
					data.remark = data.remarkReveal + "(" + "更换" + this.currentPackage.name + "，需补差价" + (this.pavingPrice -
						this.selectItem.pavementPrice) + "元" + ")"
				}

				this.$post({
					url: this.api.CustomerChooseMaterialInfo.edit,
					data: [data]
				}).then(res => {
					this.$Toast("操作成功")
					setTimeout(function() {
						uni.navigateBack({
							success: () => {
								// uni.$emit('updateEquipmentList')
							}
						})
					}, 1000)

				})
			},
			//获取code列表
			getTypeList(type) {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: type
					}
				}).then(res => {
					res.rows.forEach(item => {
						item.select = false
					})
					if (type == '1086') {
						this.areaList = res.rows
					}
					if (type == '10100') {
						this.pavements = res.rows
					}
					if (type == '1088') {
						this.identifications = res.rows
					}
				})
			},
			showChoose(item) {
				this.areaList.forEach(item => {
					item.select = false
				})
				this.selectItem = item
				console.log(item)
				this.seletList = {
					id: this.id,
					addType: this.addType,
					customerId: uni.getStorageSync('customerId'),
					materialId: this.manual ? item.id : item.materialId,
					materialName: item.materialName,
					areas: [],
					pavingLocation: '',
					color: '',
					addRelationId: this.currentPackage.id ? this.currentPackage.id : '',
					isMeasure: true,
					spec: item.spec,
					unit: item.unit,
					salePrice: item.salePrice,
					brand: item.brand,
					texture: item.texture,
					materialType: item.materialType,
					materialCode: item.materialCode,
					typeSerial: item.typeSerial,
					finalPrice: item.salePrice,
					isConfirm: item.isConfirm,
					remark: '',
					priceSign:''
				}
				this.show = true
			},
			//获取手动选材材料列表
			getCustomerDispatchInfo() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$get({
					url: this.api.WorkerInfo.getMaterialInfoList,
					data: {
						materialNameOrType: this.materialNameOrType
					}
				}).then(res => {
					res.forEach(item => {
						item.productInfoList.forEach(item2 => {
							item2.select = false
							item2.attributes.forEach(item3 => {
								item3.select = false
							})
							item2.priceSigns.forEach(item3 => {
								item3.select = false
							})
						})
					})
					this.categoryList = res
					uni.hideLoading()
				}).catch(res => {
					uni.hideLoading()
				})
			},
		},
		watch: {
			areaList: {
				handler: function(val) {
					this.seletList.areas = []
					val.forEach(item => {
						if (item.select) {
							this.seletList.areas.push(item.value)
						}
					})
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
	.packagePopup {
		width: 100%;
		background-color: #fff;
		padding: 56rpx 40rpx 62rpx 40rpx;

		.packagePopup-title {
			text-align: center;
			margin-bottom: 44rpx;
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
		}

		.packagePopup-scroll {
			height: 288rpx;

			.packagePopup-scroll-y {
				height: 96rpx;
				line-height: 96rpx;
				color: #333333;
				font-size: 28rpx;
			}

			.packagePopup-scroll-y-r {
				height: 96rpx;
				line-height: 96rpx;
				font-size: 28rpx;
				color: #B80201;
			}
		}

		.packagePopup-btn {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			border-radius: 56rpx;
			background-color: #F5F5F5;
			font-size: 36rpx;
			font-weight: bold;
			color: #333333;
			margin-top: 68rpx;
		}
	}

	.main-package {
		width: 100%;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		background-color: #FFF2DE;
		margin-top: 20rpx;

		.main-package-l {
			display: flex;
			align-items: center;

			image {
				width: 24rpx;
				height: 31rpx;
				margin-right: 16rpx;
			}

			text {
				color: #944000;
				font-size: 28rpx;
			}
		}

		.main-package-r {
			width: 12rpx;
			height: 20rpx;
		}
	}

	.popupSelect {
		width: 100%;
		max-height: 1000rpx;
		background: #FFFFFF;

		.popupSelect-cha {
			width: 40rpx;
			height: 40rpx;
			position: fixed;
			right: 30rpx;
			top: 30rpx;
		}

		// position: relative;
		.popupSelect-btn {
			width: 100%;
			padding: 0 74rpx;
			position: fixed;
			bottom: 46rpx;
			left: 0;

			text {
				display: inline-block;
				width: 100%;
				height: 88rpx;
				border-radius: 48rpx;
				line-height: 88rpx;
				text-align: center;
				background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}

		.popupSelect-title {
			width: 100%;
			padding: 30rpx 30rpx;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-bottom: 16rpx;

			.popupSelect-title-info {
				display: flex;
				align-items: center;

				image {
					width: 192rpx;
					height: 192rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
				}

				.info {
					height: 192rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.info-name {
						color: #333333;
						font-size: 28rpx;
						font-weight: bold;
					}

					.info-money {
						display: flex;
						align-items: flex-end;
						margin-bottom: 4rpx;

						text {
							color: #B80201;
								font-size: 40rpx;
						}
					}

					.info-discount {
						font-size: 24rpx;
						color: #999999;

						text {
							color: #B80201;
						}
					}
				}
			}

			.popupSelect-kong {
				width: 40rpx;
				height: 40rpx;
				margin-left: 40rpx;
				flex-shrink: 0;
			}
		}

		.popupSelect-y {
			margin-bottom: 32rpx;
			padding: 0 30rpx;

			.popupSelect-y-title {
				color: #333333;
				font-size: 24rpx;
				font-weight: bold;
				margin-bottom: 24rpx;
			}

			.popupSelect-y-content {
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				text {
					display: inline-block;
					padding: 12rpx 28rpx 10rpx 28rpx;
					background-color: #F3F3F3;
					border-radius: 28rpx;
					color: #333333;
					font-size: 24rpx;
					margin-bottom: 32rpx;
					margin-right: 32rpx;
				}

				.popupSelect-y-content-red {
					background-color: #B80201;
					color: #FFFFFF;
				}

				textarea {
					width: 100%;
					box-sizing: border-box;
					height: 168rpx;
					background-color: #F9F9F9;
					font-size: 28rpx;
					color: #333333;
					padding: 24rpx;
					border-radius: 8rpx;
				}
			}
		}

		.popupSelect-xian {
			width: 100%;
			height: 20rpx;
			background-color: #F8F8FB;
			margin-bottom: 40rpx;
		}
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
		height: calc(100vh - 88rpx - 92rpx - var(--status-bar-height));

		.commodity-list {
			box-sizing: border-box;
			width: 100%;
			position: relative;
			top: 3rpx;
			padding: 0.1rpx;
			padding-bottom: 20rpx;
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
			align-items: center;
			padding-right: 30rpx;
			padding-left: 20rpx;
			// margin-bottom: 40rpx;
			position: relative;
			z-index: 999;
			padding-top: 26rpx;

			.commodity-item-img {
				width: 192rpx;
				height: 192rpx;
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
					min-height: 100rpx;
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

					.set {
						width: 100rpx;
						height: 40rpx;
						background: #B80201;
						border-radius: 20rpx;
						line-height: 40rpx;
						text-align: center;
						font-size: 24rpx;
						color: #FFFFFF;
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
