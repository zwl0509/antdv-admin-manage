<template>
	<view class="record">
		<u-navbar title="巡检记录" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
			<view slot='right' style="padding-right: 30rpx;">
				<!-- <image src="/static/image/workbench/construction-manage/siginin.png" mode=""
					style="width: 34rpx;height: 33rpx;" v-if="currentIndex==0"></image> -->
				<image src="/static/image/workbench/customer-manage/add.png" mode=""
					style="width: 34rpx;height: 33rpx;margin-left: 20rpx;" @click="add"></image>
			</view>
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
				<view class="" v-if="currentIndex==0">
					<view class="daily" @click="todetail(val)" v-for="(val,index) in list" :key="index">
						<view class="daily-title">
							<text class="title">{{val.title}}</text>
							<text class="time">{{val.inspectionTime}}</text>
						</view>
						<view class="daily-content">
							<text>未整改:1 / 已整改:0</text>
							<text>不合格1项</text>
						</view>
						<view class="daily-image">
							<image :src="item.path" mode=""
								v-for="(item,index2) in val.unqualifiedInfoVOS[0].attachInfos" :key="index2"></image>
						</view>
					</view>
					<view v-if="!list.length" style="padding-top:236rpx ;text-align: center;">
						<image src="../../../static/image/workbench/customer-manage/nodata.png"
							style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
						<view style='color: #999999;font-size: 32rpx;'>
							空空如也~
						</view>
					</view>
				</view>
				<view class="" v-else>
					<view class="standard" v-for="(val,index) in list" :key="index" @click="topatrol(val)">
						<view class="standard-t">
							<text>{{val.title}}</text>
							<text>未整改:{{val.unRectify}} / 已整改:{{val.rectified}}</text>
						</view>
						<view class="standard-b">
							不合格{{val.unQualified}}项
						</view>
					</view>
					<view v-if="!list.length" style="padding-top:236rpx ;text-align: center;">
						<image src="../../../static/image/workbench/customer-manage/nodata.png"
							style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
						<view style='color: #999999;font-size: 32rpx;'>
							空空如也~
						</view>
					</view>
				</view>
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
					name: '日常巡检',
					value: '1082-10'
				}, {
					name: '标准巡检',
					value: '1082-20'
				}],
				currentPage: 1,
				customerId: '',
				type: '1082-10',
				list: []
			}
		},
		onLoad(options) {
			this.customerId = options.customerId
		},
		onShow() {
			this.currentPage = 1
			this.list = []
			this.getList()
		},
		methods: {
			//
			topatrol(val) {
				uni.navigateTo({
					url: '/pages/workbench/construction-manage/patrol-list?id=' + val.id
				})
			},
			//上拉加载
			onReachBottom() {
				this.currentPage++
				this.getList()
			},
			changeTab(index) {
				this.currentIndex = index
				this.currentPage = 1
				this.list = []
				this.type = this.tabList[index].value
				this.getList()
			},
			add() {
				if (this.currentIndex == 0) {
					uni.navigateTo({
						url: '../construction-manage/add-daily?customerId=' + this.customerId
					})
				} else {
					uni.navigateTo({
						url: '../construction-manage/patrol-list?customerId=' + this.customerId
					})
				}

			},
			todetail(val) {
				uni.navigateTo({
					url: '../construction-manage/daily-detail?id=' + val.id
				})
			},
			getList() {
				this.$get({
					url: this.api.CustomerInspectionRecordInfo.getList,
					data: {
						currentPage: this.currentPage,
						pageSize: 10,
						customerId: this.customerId,
						type: this.type
					}
				}).then(res => {
					res.rows.forEach(item => {
						this.list.push(item)
					})
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

			// background-color: #fff;
			.daily {
				background-color: #fff;
				padding: 32rpx 30rpx;
				margin-bottom: 20rpx;

				.daily-title {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 8rpx;

					.title {
						color: #333333;
						font-size: 32rpx;
						font-weight: bold;
					}

					.time {
						font-size: 28rpx;
						color: #999999;
					}
				}

				.daily-content {
					display: flex;
					align-items: center;
					margin-bottom: 30rpx;

					text {
						font-size: 28rpx;
						color: #333333;

						&:first-child {
							margin-right: 40rpx;
						}
					}
				}

				.daily-image {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					// justify-content: space-between;

					image {
						height: 222rpx;
						width: 222rpx;
						margin-bottom: 10rpx;
						margin-right: 12rpx;
						border-radius: 8rpx;

						&:nth-child(3n) {
							margin-right: 0;
						}
					}
				}
			}

			.standard {
				width: 100%;
				height: 143rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 0 30rpx;
				border-bottom: 2rpx solid #F6F6F6;
				padding-top: 20rpx;
				background-color: #fff;

				.standard-t {
					margin-bottom: 10rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					text {
						color: #333333;
						font-size: 28rpx;

						&:first-child {
							font-size: 32rpx;
							font-weight: bold;
						}
					}
				}

				.standard-b {
					color: #666666;
					font-size: 28rpx;
				}
			}
		}
	}
</style>
