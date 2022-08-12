<template>
	<view class="record">
		<u-navbar title="测量列表" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
		</u-navbar>
		<view class="tabs">
			<view :class="currentIndex==index ? 'tab' : 'tabs-r' " @click="changeTab(index)"
				v-for="(val,index) in tabList" :key='index'>
				{{val.name}}
				<view class="tabs-bar" v-show="currentIndex==index">

				</view>
			</view>
		</view>
		<scroll-view scroll-y="true">
			<view class="list">
				<template v-if="!currentIndex">
					<view class="list-y" v-for="(val,index) in list" :key="index" @click="toDetail(val)">
						<image src="/static/image/workbench/construction-manage/patrol.png" mode=""></image>
						<view class="list-y-r">
							<view class="list-y-r-title">
								<text>{{ val.classifyName }}</text>
								<view class="">
									{{ val.productInfoList.length }}
								</view>
							</view>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="list-e" v-for="(item,index) in info" :key="index">
						<view class="list-e-title">
							<text>{{ item.measureNo }}</text>
							<text>{{ item.planMeasureDate }}</text>
						</view>
						<view class="list-e-center">
							<image src="/static/image/workbench/construction-manage/patrol.png" mode=""></image>
							<view class="list-y-r">
								<view class="list-y-r-title">
									<text>{{ item.measureName }}</text>
									<view class="">
										{{ item.statusName }}
									</view>
								</view>
							</view>
						</view>
						<view class="list-e-btns">
							<text class="btn-w" @click="toMaterialList(item)">测量列表</text>
							<text class="btn-w" @click="toImgs(item.attachInfos)">测量图片</text>
							<text class="btn-w" @click="toMaterial(customerId)">材料到场</text>
							<text class="btn-r" @click="mainList('1095-10',customerId,'1098-20')">定制退补货</text>
						</view>
					</view>
				</template>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentIndex: 0,
				tabList: [{
					name: '待通知',
					value: ''
				}, {
					name: '已通知',
					value: ''
				}],
				customerId: '',
				list: [],
				info: []
			}
		},
		onLoad(options) {
			this.customerId = options.customerId
			this.getList(options.customerId)
		},
		methods: {
			changeTab(index) {
				this.currentIndex = index
				this.getList(this.customerId)
			},
			getList(customerId){
				if (this.currentIndex === 0){
					this.$get({
						url: this.api.measureNotifyInfo.getSupplyInfo,
						data: {
							isMeasure: true,
							customerId
						}
					}).then(res => {
						this.list = res
					})
				}else {
					this.$get({
						url: this.api.measureNotifyInfo.getNotifiedList,
						data: {
							customerId
						}
					}).then(res => {
						const list = []
						res.rows?.forEach(el=>{
							list.push(el)
						})
						this.info = list
					})
				}
			},
			toDetail(val){
				const item = val.productInfoList
				uni.navigateTo({
					url: `./notified-detail?info=${encodeURIComponent(JSON.stringify(val))}`
				})
			},
			toMaterialList(item){
				uni.navigateTo({
					url: `./material-list?info=${encodeURIComponent(JSON.stringify(item))}`
				})
			},
			toImgs(item){
				uni.navigateTo({
					url: `./measure-picture?info=${encodeURIComponent(JSON.stringify(item))}`
				})
			},
			toMaterial(customerId){
				uni.navigateTo({
					url: `/pages/workbench/material-confirmation/arrival-materials?customerId=` + customerId
				})
			},
			mainList(type, customerId, masterDeclarationType){
				uni.navigateTo({
					url: `/pages/workbench/material-declare/main-list?type=` + type + '&customerId=' + this.customerId + '&masterDeclarationType=' +
							masterDeclarationType
				})
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
	.record {
		.tabs {
			width: 100%;
			height: 112rpx;
			display: flex;
			align-items: center;
			background-color: #FFFFFF;
			justify-content: center;

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
				background: linear-gradient(90deg, #B80201 0%, #D80100 100%);
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

		.list {
			width: 100%;
			height: calc(100vh - 88rpx - 112rpx - var(--status-bar-height));
			padding-top: 20rpx;

			.list-y {
				width: 100%;
				height: 160rpx;
				display: flex;
				align-items: center;
				padding: 0 30rpx;
				background-color: #fff;
				margin-bottom: 20rpx;
				image {
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
				}

				.list-y-r {
					width: 100%;

					.list-y-r-title {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 10rpx;

						text {
							color: #333333;
							font-size: 32rpx;
							font-weight: bold;
						}

						view {
							width: 32rpx;
							height: 32rpx;
							border-radius: 50%;
							background-color: #E53E3D;
							line-height: 32rpx;
							text-align: center;
							color: #FFFFFF;
							font-size: 26rpx;
						}
					}

					.list-y-r-complay {
						color: #999999;
						font-size: 28rpx;
					}
				}
			}

			.list-e {
				background-color: #fff;
				padding: 0 30rpx;
				margin-bottom: 20rpx;
				padding-bottom: 24rpx;
				.list-e-title {
					height: 84rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: #333333;
					font-size: 24rpx;
					border-bottom: 2rpx solid #F0F0F0;
				}

				.list-e-center {
					display: flex;
					align-items: center;
					padding: 28rpx 0 48rpx 0;

					image {
						width: 80rpx;
						height: 80rpx;
						margin-right: 20rpx;
						flex-shrink: 0;
					}

					.list-y-r {
						width: 100%;

						.list-y-r-title {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 10rpx;

							text {
								color: #333333;
								font-size: 32rpx;
								font-weight: bold;
							}

							view {
								color: #B80201;
								font-size: 28rpx;
							}
						}

						.list-y-r-complay {
							color: #999999;
							font-size: 28rpx;
						}
					}
				}
			}

			.list-e-btns {
				display: flex;
				align-items: center;
				justify-content: flex-end;

				text {
					display: inline-block;
					padding: 0 16rpx;
					height: 64rpx;
					line-height: 60rpx;
					border-radius: 12rpx;
					font-size: 26rpx;
					margin-left: 16rpx;
				}

				.btn-w {
					border: 2rpx solid #C0C0C0;
					color: #333333;
				}

				.btn-r {
					background-color: #B80201;
					color: #fff;
				}
			}
		}
	}
</style>
