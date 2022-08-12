<template>
	<view class="data-detail">
		<u-navbar title="材料详情" :border='false' :titleBold='true' title-size="34" class="navbar" title-color='#333333'>
		</u-navbar>
		<view class="store-info">
			<image src="/static/image/workbench/renovation-data/icon.png" mode=""></image>
			<view class="info">
				<view class="info-name">
					{{detail.materialName}}
				</view>
				<!-- 				<view class="info-tip">
					<view class="">
						客厅
					</view>
					<view class="">
						餐厅
					</view>
				</view> -->
				<view class="info-much">
					<view class="much">
						<text>¥ </text>
						<text>{{detail.salePrice}}</text>
						<text>/㎡</text>
					</view>
					<view class="status-g" v-if="detail.isConfirm">
						已保存
					</view>
					<view class="status-r" v-else>
						待确认
					</view>
				</view>
			</view>
		</view>
		<view class="commodity-info">
			<view class="commodity-info-y">
				<text>规格</text>
				<text>{{detail.spec}}</text>
			</view>
			<view class="commodity-info-y">
				<text>区域</text>
				<text>{{detail.areaName}}</text>
			</view>
			<view class="commodity-info-y">
				<text>型号</text>
				<text>{{detail.materialType}}</text>
			</view>
			<view class="commodity-info-y">
				<text>编码</text>
				<text>{{detail.materialCode}}</text>
			</view>
			<view class="commodity-info-y">
				<text>测量</text>
				<text>{{detail.isMeasure ? '是':'否'}}</text>
			</view>
			<view class="commodity-info-y">
				<text>预估</text>
				<text>{{detail.forecast}}</text>
			</view>
			<view class="commodity-info-y">
				<text>品牌</text>
				<text>{{detail.brand}}</text>
			</view>
		</view>
		<view class="remark">
			<view class="remark-title">
				选材备注
			</view>
			<view class="remark-content">
				{{detail.remark}}
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
						@click="selectChange(val,index)">
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
		<view class="btns">
			<text v-for="(val,index) in btns" :key='index' @click="operationClick(val)">{{val.name}}</text>
			<!-- 			<text>确认</text>
			<text>更换</text>
			<text>编辑</text>
			<text>删除</text> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentChange:'',
				changeList: [{
					name: '扫码更换',
					value: '',
					select: false
				}, {
					name: '手动选择',
					value: '',
					select: false
				}, {
					name: '活动材料',
					value: '',
					select: false
				}, {
					name: '主材包材料',
					value: '',
					select: false
				}], //更换选项
				changeShow: false, //更换方式
				detail: {},
				btns: [],
				show:false,
				confirmName:'',
				content:'',
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
			}
		},
		onLoad(options) {
			this.detail = JSON.parse(options.detail)
			this.btns = JSON.parse(options.btns)
		},
		methods: {
			//选择更换方式
			selectChange(val, index) {
				this.changeList.forEach(item => {
					item.select = false
				})
				val.select = true
				this.currentChange = index
			},
			//确认更换方式
				changeConfirm() {
					this.changeShow = false
					this.changeList.forEach(item => {
						item.select = false
					})
					if (this.currentChange == 1) {
						uni.navigateTo({
							url: 'data-manualadd?id=' +  this.detail.id +'&manual=true'
						})
					}
					if (this.currentChange == 2) {
						uni.navigateTo({
							url: 'data-manualadd?id=' +  this.detail.id + '&isPromotionCustomer=true'
						})
					}
					if (this.currentChange == 3) {
						uni.navigateTo({
							url: 'data-manualadd?id=' + this.detail.id + '&isPackageCustomer=true'
						})
					}
					if (this.currentChange == 0) {
						this.scan()
					}
				},
			//按钮操作
			operationClick(val, item) {
				if (val.key.indexOf('DataChange') != -1) {
					this.changeShow = true
				}
				if (val.key.indexOf('DataEdit') != -1) {
					uni.navigateTo({
						url: 'data-deit?data=' + JSON.stringify([this.detail])+ '&isEdit=' + true
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
			//弹出确认按钮
			confirm(){
				if(this.confirmName=='DataDel'){
					this.del()
				}
				if(this.confirmName=='DataConfirm'){
					this.DataConfirm()
				}
			},
			//确认
			DataConfirm(){
				this.$post({
					url: this.api.CustomerChooseMaterialInfo.confirm,
					data:[this.detail.id]
				}).then(res => {
					this.$Toast('操作成功')
					setTimeout(function() {
						uni.navigateBack({
					
						})
					}, 1000)
				})
			},
			//删除
			del(){
				this.$del({
					url: this.api.CustomerChooseMaterialInfo.delByIds,
					data:[this.detail.id]
				}).then(res=>{
					this.$Toast('操作成功')
					setTimeout(function() {
						uni.navigateBack({
					
						})
					}, 1000)
				})
			},
		}
	}
</script>

<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
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
	.data-detail {
		.store-info {
			margin-top: 20rpx;
			background-color: #fff;
			padding: 32rpx 30rpx;
			display: flex;
			align-items: flex-start;

			image {
				width: 20rpx;
				height: 36rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.info {
				width: 100%;

				.info-name {
					font-size: 32rpx;
					font-weight: bold;
					color: #333333;
					margin-bottom: 16rpx;
				}

				.info-tip {
					display: flex;
					align-items: center;
					margin-bottom: 24rpx;

					view {
						width: auto;
						padding: 0 8rpx;
						font-size: 24rpx;
						color: #999999;
						margin-right: 12rpx;
						border-radius: 4rpx;
						border: 2rpx solid #C0C0C0;
					}
				}

				.info-much {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.much {
						display: flex;
						align-items: flex-end;

						text {
							font-size: 36rpx;
							color: #B80201;

							&:first-child {
								font-size: 22rpx;
							}

							&:last-child {
								font-size: 22rpx;
							}
						}
					}

					.status-g {
						color: #999999;
						font-size: 28rpx;
					}

					.status-r {
						color: #B80201;
						font-size: 28rpx;
					}
				}
			}
		}

		.commodity-info {
			padding: 28rpx 32rpx;
			background-color: #fff;
			margin-top: 20rpx;

			.commodity-info-y {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0;
				}

				text {
					color: #333333;
					font-size: 28rpx;

					&:first-child {
						color: #999999;
						font-size: 28rpx;
						margin-right: 40rpx;
					}
				}
			}
		}

		.remark {
			padding: 28rpx 32rpx 68rpx 32rpx;
			background-color: #fff;
			margin-top: 20rpx;

			.remark-title {
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.remark-content {
				color: #333333;
				font-size: 28rpx;
				line-height: 40rpx;
			}
		}

		.btns {
			width: 100%;
			height: 98rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			background-color: #fff;
			display: flex;
			align-items: center;
			flex-direction: row-reverse;
			padding: 0 30rpx;

			text {
				display: inline-block;
				width: 144rpx;
				height: 72rpx;
				border-radius: 36rpx;
				border: 2rpx solid #C0C0C0;
				line-height: 72rpx;
				text-align: center;
				font-size: 28rpx;
				color: #333333;
				margin-left: 12rpx;

				&:first-child {
					background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
					border: none;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
