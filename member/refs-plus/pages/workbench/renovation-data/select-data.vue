<template>
	<view class="select-data">
		<u-navbar :border='false' class="navbar fl-cc" :border-bottom="false">
			<u-search mImage='/static/image/workbench/customer-manage/search.png' :uIconShow="false"
				placeholder-color="#C0C0C0" v-model="searchCondition" placeholder="请输入搜索内容" @change="getList"
				:show-action="false">
			</u-search>
			<!-- <view class="search"></view> -->
			<view class="slot-wrap" slot="right">
				<u-icon name="more-dot-fill" color="#333333" size="40" @click="otherShow=!otherShow"></u-icon>
			</view>
		</u-navbar>
		<view class="other" v-if="otherShow">
			<view class="other-y" @click="btnOperation(item,index)" v-for="(item,index) in listBtns">
				<image :src="item.icon ? icon[item.icon] : ''" mode="">
				</image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="tabs">
			<view :class="current==index ? 'tab' : 'tabs-r' " @click="change(index)" v-for="(val,index) in tabList"
				:key='index'>
				{{val.title}}
				<view class="tabs-bar" v-show="current==index">

				</view>
			</view>
		</view>
		<sale-prod-content class="scroll-h" v-if="categoryList.length"
			:style="{paddingBottom: AllConfirm&&current==0 ?'100rpx':''}" :initLoad="categoryList">
			<view class="">
				<sale-prod-item v-for="(categoryItem, cIndex) in categoryList" :key="cIndex"
					:anchorId="'category-anchor-'+categoryItem.anchorId">
					<view class="commodity-list"
						v-if="categoryItem.productInfoList && categoryItem.productInfoList.length">
						<view class="" v-for="(item, index) in categoryItem.productInfoList" :key="cIndex+'-'+index"
							@click="select(item)">
							<view class="commodity-item-box">
								<image src="/static/image/tab-bar/workbench-bg.png" mode="" class="commodity-item-img">
								</image>
								<view class="commodity-item-info">
									<view class="commodity-item-info-name"
										:style="{justifyContent: current==0 ?'':'space-between'}">
										<text class="name">{{item.materialName}}</text>
										<view class="" v-if="current==0">
											<!-- 											<text class="budget">
												预算
											</text>
											<text class="new">
												新增
											</text> -->
										</view>
										<view class="" v-if="current==1">
											<view class="status-r" v-if="item.isCommit">
												已提交
											</view>
											<view class="status-g" v-else>
												未提交
											</view>
										</view>
									</view>
									<view class="commodity-item-info-type">
										{{item.materialType ? item.materialType+';':''}}
										{{item.materialName ? item.materialName+';':''}}
										{{item.spec ? item.spec+';':''}}
										{{item.color ? item.color:''}}
									</view>
									<!-- 									<view class="commodity-item-info-from">
										{{item.from}}
									</view> -->
									<view class="commodity-item-info-select">
										<view class="commodity-item-info-money">
											￥{{item.salePrice}}
										</view>
										<view class="" v-if="AllConfirm&&current==0" style="height: 36rpx;">
											<view class="commodity-item-info-select-no" v-if="!item.select">

											</view>
											<image src="/static/image/workbench/renovation-data/select.png" mode=""
												v-else>
											</image>
										</view>
										<view class="" v-else style="height: 36rpx;display: flex;align-items: center;">
											<view class="set" v-if="current==0" @click.stop="item.set=!item.set">
												<image src="/static/image/workbench/renovation-data/edit.png" mode="">
												</image>
											</view>
											<view class="reset" v-if="current==1"
												@click.stop="showWindow(item,'是否确认重置','reset')">
												<image src="/static/image/workbench/renovation-data/reset.png" mode="">
												</image>
												<text>重置</text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="operations" v-if="item.set">
								<view class="operation">
									<view class="operation-y" v-for="(val,index2) in singleBtns" :key="index2"
										@click.stop="operationClick(val,item)">
										<image :src="val.icon ? icon[val.icon] : ''" mode="">
										</image>
										<text>{{val.name}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view style="height: 60rpx" v-else></view>
				</sale-prod-item>
			</view>
			<!-- 更换方式 -->
		</sale-prod-content>
		<view class="nodata" v-else>
			<image src="/static/image/workbench/customer-manage/none.png" mode=""></image>
			<view class="">
				空空如也~
			</view>
		</view>
		<u-popup v-model="changeShow" mode="center" border-radius="16" width="590">
			<view class="change">
				<view class="change-title">
					<text>选择更换方式</text>
					<image src="/static/image/workbench/renovation-data/close.png" mode="" @click="changeShow=false">
					</image>
				</view>
				<view class="change-select">
					<view class="change-select-y" v-for="(val,index) in changeList" :key="index"
						@click="selectChange(val,index)" v-if="val.show">
						<text>{{val.name}}</text>
						<view class="" v-if="!val.select">

						</view>
						<image src="/static/image/workbench/renovation-data/select.png" mode="" v-else></image>
					</view>
				</view>
				<view class="change-btn" @click="changeConfirm">
					确定
				</view>
			</view>
		</u-popup>
		<u-modal v-model="show" :title-style='titleStyle' :confirm-style='confirmStyle' :cancel-style='camcelStyle'
			:content-style="contentStyle" :show-cancel-button='true' confirm-color='#B80201' :content="content"
			@confirm="confirm"></u-modal>
		<u-popup v-model="canCodeShow" mode="bottom" border-radius="16">
			<scroll-view scroll-y="true">
				<view class="popupSelect">
					<view class="popupSelect-title">
						<view class="popupSelect-title-info">
							<image src="/static/image/workbench/renovation-data/img.png" mode=""></image>
							<view class="info">
								<view class="info-name">
									{{dataDetail.materialName}}
								</view>
								<view class="">
									<view class="info-money">
										<text>¥</text><text>{{dataDetail.salePrice}}</text>
									</view>
									<view class="info-discount">
										更换主材包899，需补差价<text>200</text>元
									</view>
								</view>
							</view>
						</view>
						<view class="popupSelect-kong">

						</view>
						<image src="/static/image/workbench/renovation-data/close.png" mode="" class="popupSelect-cha"
							@click="canCodeShow=false">
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
					<view class="popupSelect-xian">

					</view>
					<view class="popupSelect-y">
						<view class="popupSelect-y-title">
							是否测量
						</view>
						<view class="popupSelect-y-content">
							<text :class="dataDetail.isMeasure ? 'popupSelect-y-content-red':''"
								@click="dataDetail.isMeasure=true">是</text>
							<text :class="!dataDetail.isMeasure ? 'popupSelect-y-content-red':''"
								@click="dataDetail.isMeasure=false">否</text>
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
		<view class="bottom" v-if="AllConfirm&&current==0">
			<view class="bottom-select" @click="selectAllGoods">
				<view class="" v-if="!selectAll">

				</view>
				<image src="/static/image/workbench/renovation-data/select.png" mode="" v-else></image>
				<text>全选</text>
			</view>
			<view class="bottom-r">
				<text>已选择{{selectNumber}}件</text>
				<view class="bottom-btn" @click="selectAllClick">
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
				areaList: [], //区域列表
				canCodeShow: false, //扫码展示
				selectNumber: '',
				titleStyle: {
					fontSize: '26rpx',
					color: '#333333',
					fontWeight: 'bold'
				},
				contentStyle: {
					color: '#333333',
					fontSize: '32rpx'
				},
				camcelStyle: {
					background: '#F5F5F5',
					color: "#333333",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 31rpx 40rpx 40rpx'
				},
				confirmStyle: {
					background: 'linear-gradient(90deg, #E40000 0%, #B80201 100%)',
					color: "#FFFFFF",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 40rpx 40rpx 31rpx'
				},
				content: '', //弹窗内容
				show: false, //弹窗
				currentChange: '',
				changeList: [{
					name: '扫码更换',
					value: '',
					show: true,
					select: false
				}, {
					name: '手动选择',
					value: '',
					show: true,
					select: false
				}, {
					name: '活动材料',
					value: '',
					show: true,
					select: false
				}, {
					name: '主材包材料',
					value: '',
					show: true,
					select: false
				}], //更换选项
				changeShow: false, //更换方式
				singleBtns: [],
				listBtns: [],
				otherShow: false,
				AllConfirm: false, //批量确认
				selectAll: false,
				searchCondition: '',
				tabList: [{
					title: '待确认',
					value: false
				}, {
					title: '已确认',
					value: true
				}],
				isConfirm: false, //是否确认
				current: 0,
				barStyle: {
					background: '#B80201'
				},
				categoryList: [],
				sitemapId: '',
				customerId: '',
				currentItem: {},
				confirmName: '', //
				seletList: [], //选中的
				selectIds: [],
				dataDetail: {}
			}
		},
		onLoad(options) {
			this.changeList[2].show = options.isPromotionCustomer == "true" ? true : false
			this.changeList[3].show = options.isPackageCustomer == "true" ? true : false
			this.sitemapId = options.sitemapId
			this.customerId = options.customerId
			this.getJurisdiction(this.sitemapId)
			this.getTypeList()
		},
		onShow() {
			// uni.$on('updateEquipmentList', this.getList());
			this.getList()
			this.currentItem = {}
		},
		methods: {
			//保存
			save() {
				if (!this.dataDetail.areas.length) {
					this.$Toast('请选择所属区域')
					return
				}
				this.$post({
					url: this.api.CustomerChooseMaterialInfo.edit,
					data: [this.dataDetail]
				}).then(res => {
					this.canCodeShow = false
					this.currentItem = {}
					this.$Toast('操作成功')
					this.getList()
				})
			},
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
			//弹出确认按钮
			confirm() {
				if (this.confirmName == 'reset') {
					this.reset()
				}
				if (this.confirmName == 'DataDel') {
					this.del()
				}
				if (this.confirmName == 'DataConfirm') {
					this.DataConfirm()
				}
				if (this.confirmName == 'OneImport') {
					this.OneImport()
				}
			},
			//确认
			DataConfirm() {
				let data = []
				if (this.AllConfirm) {
					this.seletList.forEach(item => {
						data.push(item.id)
					})
				} else {
					data = [this.currentItem.id]
				}
				this.$post({
					url: this.api.CustomerChooseMaterialInfo.confirm,
					data: data
				}).then(res => {
					this.getList()
					this.AllConfirm = false
					this.currentItem = {}
				})
			},
			//删除
			del() {
				this.$del({
					url: this.api.CustomerChooseMaterialInfo.delByIds,
					data: [this.currentItem.id]
				}).then(res => {
					this.getList()
					this.currentItem = {}
				})
			},
			//重置
			reset() {
				this.$post({
					url: this.api.CustomerChooseMaterialInfo.reset,
					data: [this.currentItem.id]
				}).then(res => {
					this.getList()
					this.currentItem = {}
				})
			},
			//显示弹出
			showWindow(item, content, name) {
				this.currentItem = item
				this.show = true
				this.content = content
				this.confirmName = name
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
			//确认更换方式
			changeConfirm() {
				this.changeShow = false
				this.changeList.forEach(item => {
					item.select = false
				})
				if (this.currentChange == 1) {
					uni.navigateTo({
						url: 'data-manualadd?id=' + (this.currentItem.id ? this.currentItem.id : '') +
							'&manual=true'
					})
					this.currentItem = {}
				}
				if (this.currentChange == 2) {
					uni.navigateTo({
						url: 'data-manualadd?id=' + (this.currentItem.id ? this.currentItem.id : '') +
							'&isPromotionCustomer=true'
					})
					this.currentItem = {}
				}
				if (this.currentChange == 3) {
					uni.navigateTo({
						url: 'data-manualadd?id=' + (this.currentItem.id ? this.currentItem.id : '') +
							'&isPackageCustomer=true'
					})
					this.currentItem = {}
				}
				if (this.currentChange == 0) {
					this.scan()
				}
			},
			//扫码
			scan() {
				let that = this
				// that.getMaterialInfoById('26dbda06a5394195819bfdc0594932ef')
				// that.canCodeShow = true
				uni.scanCode({
					success: function(res) {
						console.log('条码内容：' + res.result);
						that.getMaterialInfoById(res.result)
						that.canCodeShow = true
					},
					fail(res) {
						console.log(res)
					}
				});
			},
			//获取单个材料信息
			getMaterialInfoById(id) {
				this.$get({
					url: this.api.WorkerInfo.getMaterialInfoById,
					data: {
						id: id
					}
				}).then(res => {
					console.log(res)
					this.dataDetail = {
						id: this.currentItem.id ? this.currentItem.id : '',
						customerId: uni.getStorageSync('customerId'),
						materialId: res.id,
						materialName: res.materialName,
						areas: [],
						pavingLocation: '',
						color: '',
						addRelationId: '',
						isMeasure: true,
						spec: res.spec,
						unit: res.unit,
						salePrice: res.salePrice,
						brand: res.brand,
						texture: res.texture,
						materialType: res.materialType,
						materialCode: res.materialCode,
						typeSerial: res.typeSerial,
						finalPrice: res.salePrice,
						isConfirm: res.isConfirm
					}
				})
			},
			//选择更换方式
			selectChange(val, index) {
				this.changeList.forEach(item => {
					item.select = false
				})
				val.select = true
				this.currentChange = index
			},
			//按钮操作
			operationClick(val, item) {
				this.currentItem = item
				if (val.key.indexOf('DataChange') != -1) {
					this.changeShow = true
				}
				if (val.key.indexOf('DataEdit') != -1) {
					uni.navigateTo({
						url: 'data-deit?data=' + JSON.stringify([item]) + '&isEdit=' + true
					})
				}
				if (val.key.indexOf('DataDel') != -1) {
					this.show = true
					this.content = '是否确认删除'
					this.confirmName = 'DataDel'
				}
				if (val.key.indexOf('DataConfirm') != -1) {
					this.show = true
					this.content = '是否确认'
					this.confirmName = 'DataConfirm'
				}
			},
			//批量确认按钮
			selectAllClick() {
				this.show = true
				this.content = '是否确认'
				this.confirmName = 'DataConfirm'
			},
			//获取按钮权限
			getJurisdiction(sitemapId) {
				let targetIds = []
				this.listBtns = []
				this.singleBtns = []
				targetIds.push(this.vuex_user.id)
				this.vuex_user.roles.forEach(item => {
					targetIds.push(item.id)
				})
				this.$post({
					url: this.api.AuthUser.getAuthActionByTargetIds,
					data: {
						backstage: 0,
						sitemapId: sitemapId,
						targetIds: targetIds
					}
				}).then(res => {
					res.forEach(item => {
						if (item.key.indexOf('All') != -1) {
							this.listBtns.push(item)
						} else {
							this.singleBtns.push(item)
						}
					})

				})
			},
			change(index) {
				this.current = index;
				this.isConfirm = this.tabList[index].value
				this.getList()
			},
			select(item) {
				if (this.AllConfirm) {
					item.select = !item.select
				} else {
					uni.navigateTo({
						url: 'data-detail?detail=' + JSON.stringify(item) + '&btns=' + JSON.stringify(this
							.singleBtns)
					})
				}

			},
			btnOperation(item, index) {
				this.otherShow = !this.otherShow
				if (item.key.indexOf('Confirm') != -1) {
					this.AllConfirm = !this.AllConfirm
				}
				if (item.key.indexOf('Add') != -1) {
					this.changeShow = true
				}
				if (item.key.indexOf('OneImport') != -1) {
					this.content = '是否一键导入'
					this.confirmName = 'OneImport'
					this.show = true
				}
			},
			//一键导入
			OneImport() {
				this.$put({
					url: this.api.CustomerChooseMaterialInfo.importBudMaterial,
					data: {
						customerId: this.customerId
					}
				}).then(res => {
					this.$Toast('操作成功')
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
					this.areaList = res.rows
				})
			},
		},
		watch: {
			categoryList: {
				handler: function(val) {
					let res = 0
					this.seletList = []
					val.forEach(item => {
						this.seletList = this.seletList.concat(item.productInfoList.filter(function(item2,
							index) {
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
			},
			areaList: {
				handler: function(val) {
					this.dataDetail.areas = []
					val.forEach(item => {
						if (item.select) {
							this.dataDetail.areas.push(item.value)
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
							font-size: 28rpx;

							&:last-child {
								font-size: 40rpx;
							}
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
			}
		}

		.popupSelect-xian {
			width: 100%;
			height: 20rpx;
			background-color: #F8F8FB;
			margin-bottom: 40rpx;
		}
	}

	.change {
		padding: 0 48rpx 40rpx 48rpx;

		.change-title {
			height: 125rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;

			text {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
			}

			image {
				width: 51rpx;
				height: 51rpx;
				position: relative;
				right: -10rpx;
			}
		}

		.change-select {
			margin-bottom: 40rpx;

			.change-select-y {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 20rpx;

				text {
					color: #333333;
					font-size: 32rpx;
				}

				image {
					width: 36rpx;
					height: 36rpx;
				}

				view {
					width: 36rpx;
					height: 36rpx;
					border-radius: 50%;
					border: 2rpx solid #707070;
				}
			}
		}

		.change-btn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 34rpx;
			color: #FFFFFF;
			background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
			border-radius: 48rpx;
		}
	}

	.other {
		position: fixed;
		top: calc(88rpx + var(--status-bar-height));
		right: 12rpx;
		background-color: #FFFFFF;
		width: 208rpx;
		// height: 270rpx;
		// padding: 0 20rpx;
		padding-top: 26rpx;
		z-index: 9999;
		box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.16);
		border-radius: 25rpx;
		padding-bottom: 20rpx;

		.other-y {
			// margin-bottom: 32rpx;
			display: flex;
			align-items: center;
			height: 80rpx;
			padding-left: 20rpx;

			image {
				width: 28rpx;
				height: 28rpx;
				margin-right: 12rpx;
				flex-shrink: 0;
			}

			text {
				display: inline-block;
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				border-bottom: 1rpx solid #F0F0F0;
				color: #333333;
				font-size: 28rpx;
			}

			&:last-child {
				text {
					border: none;
				}
			}
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
		height: calc(100vh - 88rpx - 132rpx - var(--status-bar-height));

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
			align-items: center;
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
				width: 192rpx;
				height: 192rpx;
				border-radius: 16rpx;
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
						width: 230rpx;
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
						flex-shrink: 0;
					}

					.status-g {
						color: #B80201;
						font-size: 24rpx;
						flex-shrink: 0;
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

					.set {
						image {
							width: 56rpx;
							height: 28rpx;
						}
					}

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
