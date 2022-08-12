<template>
	<view class="">
		<u-navbar :border='false' class="navbar fl-cc" title="待办事项" z-index='999' title-color='#333333'>
			<view class="slot-wrap" slot="right">
				<image @click="show=!show" src="../../static/image/tab-bar/search.png" mode="" class="navbar-icon"
					style="width: 32rpx;height: 32rpx;margin-right: 30rpx;"></image>
			</view>
		</u-navbar>
		<u-popup v-model="show" mode="top" z-index='990'>
			<view class="search">
				<view class="search-input">
					<text>类型</text>
					<input type="text" v-model="applyTypeName" placeholder="请输入搜索类型" />
				</view>
				<view class="search-time">
					<text>时间</text>
					<view class="search-time-select">
						<view :class="startTime ? 'search-time-select-s' : 'search-time-select-s2'"
							@click="showStartTime=true">
							{{startTime ? startTime : '开始时间'}}
						</view>
						<view class="xian">

						</view>
						<view :class="endTime ? 'search-time-select-s' : 'search-time-select-s2'"
							@click="showEndTime=true">
							{{endTime ?  endTime:'结束时间'}}
						</view>
					</view>
				</view>
				<view class="search-btn">
					<view class="search-btn-reset" @click="reset">
						重置
					</view>
					<view class="search-btn-complete" @click="finish">
						完成
					</view>
				</view>
			</view>
		</u-popup>
		<u-picker v-model="showStartTime" mode="time" @confirm="confirm"></u-picker>
		<u-picker v-model="showEndTime" mode="time" @confirm="confirm2"></u-picker>
		<view class="list-detail">
			<view class="detail fl-csb" v-for="(item,index) in List" :key="index" @tap="toPages(item)">
				<view class="detail-lf fl-cc">
					<view class="img">
						<image :src="item.src"></image>
						<image src="../../static/image/common/tip.png" class="tips" v-show="!item.isView"></image>
					</view>
					<view class="text">
						<view class="big">{{item.typeName}}</view>
						<view class="little">{{item.applyTypeName}}</view>
					</view>
				</view>
				<view class="detail-rg">
					<view style="margin-bottom: 14rpx;">{{item.showDate}}</view>
					<view class="" v-if="item.isDeal" style="color: #999999;font-size: 24;text-align: right;">
						已处理
					</view>
					<view class="" v-else style="color: #B80201;font-size: 24;text-align: right;">
						待处理
					</view>
				</view>
			</view>
		</view>
		<view class="" v-if="!List.length" style="padding-top:236rpx ;text-align: center;">
			<image src="/static/image/workbench/customer-manage/nodata.png" mode=""
				style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
			<view class="" style='color: #999999;font-size: 32rpx;'>
				空空如也~
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				applyTypeName: '',
				startTime: '',
				endTime: '',
				showStartTime: false,
				showEndTime: false,
				show: false, //搜索显示
				List: [],
				currentPage: 1,
				pageSize: 12,
				btnImg: [{
					value: null,
					src: '/static/image/tab-bar/construction.png',
					page: '/pages/workbench/customer-manage/customer-detail'
				}, {
					value: '1056-30',
					src: '/static/image/icon/MultiRoom.png',
					page: '/pages/workbench/customer-manage/customer-detail'
				}, {
					value: '1056-20',
					src: '/static/image/icon/EarlyHouseApplication.png',
					page: '/pages/workbench/customer-manage/customer-detail'
				}, {
					value: '1040-20',
					src: '/static/image/icon/FlyingOrder.png',
					page: '/pages/workbench/customer-manage/customer-detail'
				}, {
					value: '1040-10',
					src: '/static/image/icon/FlyingOrder.png',
					page: '/pages/workbench/customer-manage/customer-detail'
				}, {
					value: '1056-40',
					src: '/static/image/icon/Submit.png',
					page: '/pages/workbench/customer-manage/customer-detail'
				}, {
					value: '1056-10',
					src: '/static/image/icon/ReservationApplication.png',
					page: '/pages/workbench/customer-manage/customer-detail'
				}, {
					value: '1060-40',
					src: '/static/image/tab-bar/remind.png',
					page: "/pages/workbench/construction-manage/rectification-detail?rectification=true"
				}, {
					value: '1060-50',
					src: '/static/image/tab-bar/remind.png',
					page: "/pages/workbench/construction-manage/construction-plan"
				}, {
					value: '1060-60',
					src: '/static/image/tab-bar/artificial.png',
					page: "/pages/workbench/customer-complaints/detail"
				}, {
					value: '1060-70',
					src: '/static/image/tab-bar/remind.png',
					page: ""
				}, {
					value: '1060-80',
					src: '/static/image/tab-bar/overhaul.png',
					page: "/pages/workbench/construction-manage/check-type"
				}, {
					value: '1060-90',
					src: '/static/image/tab-bar/overhaul.png',
					page: ""
				}, {
					value: '1060-100',
					src: '/static/image/tab-bar/returnVisit.png',
					page: ""
				}, {
					value: '1060-110',
					src: '/static/image/tab-bar/returnVisit.png',
					page: "/pages/workbench/construction-manage/construction-plan"
				}, {
					value: '1060-120',
					src: '/static/image/tab-bar/returnVisit.png',
					page: "/pages/workbench/construction-manage/resume-list"
				}, ],
			}
		},
		// onLoad() {
		// 	this.toDealWith()
		// },
		onShow() {
			this.currentPage = 1
			this.List = []
			this.toDealWith()
		},
		methods: {
			finish() {
				this.currentPage = 1
				this.List = []
				this.toDealWith()
				this.show = false
			},
			toPages(item) {
				if (item.isDeal) {
					this.$Toast('已被处理')
					return
				}
				if (item.applyType == '1060-70' || item.applyType == '1060-90' || item.applyType == '1060-100') {
					this.$Toast('请去pc端处理')
					return
				}
				this.$post({
					url: this.api.toDealWith.getActionId,
					data: {
						type: item.customerType,
						applyType: item.applyType,
						csTaskType: item.csTaskType,
						buildTaskType: item.applyType
					}
				}).then(res => {
					if (res != null) {
						uni.setStorageSync('sitemapId', res.id)
						if (item.csTaskType) {
							this.dealtCustomerService(item)
						} else if (item.type == '1060-80') {
							this.dealtCheck(item)
						} else if (item.type == '1060-120' || item.type == '1060-50' || item.type == '1060-110') {
							this.dealtResumeList(item)
						} else if (item.type == '1060-40') {
							this.dealtRectification(item)
						} else {
							this.getJurisdiction(res, item)
						}
					} else {
						if (item.csTaskType) {
							this.dealtCustomerService(item)
						} else if (item.type == '1060-80') {
							this.dealtCheck(item)
						} else if (item.type == '1060-120' || item.type == '1060-50' || item.type == '1060-110') {
							this.dealtResumeList(item)
						} else if (item.type == '1060-40') {
							this.dealtRectification(item)
						} else {
							this.dealtCustomerManagement(item, [], {
								component: ''
							})
						}
					}

				})
			},
			//待办整改跳转
			dealtRectification(item) {
				uni.navigateTo({
					url: item.page + '&id=' + item.rectificationId + '&agencyId=' + item.id
				})
			},
			//待办停复工管理跳转,施工管理
			dealtResumeList(item) {
				uni.navigateTo({
					url: item.page + '?customerId=' + item.customerId + '&constructionPlanId=' + item
						.constructionPlanId + '&agencyId=' + item.id
				})
			},
			//待办验收管理跳转
			dealtCheck(item) {
				uni.navigateTo({
					url: item.page + '?id=' + item.customerId + '&agencyId=' + item.id
				})
			},
			//待办客服跳转
			dealtCustomerService(item) {
				uni.navigateTo({
					url: item.page + '?type=' + item.csTaskType + '&customerId=' + item
						.customerId + '&role=1' + '&csComplaintRecordId=' + item.csTaskId +
						'&id=' + item.csDispatchId + '&agencyId=' + item.id
				})
			},
			//待办客户管理跳转
			dealtCustomerManagement(item, res, sitemapId) {
				if (item.applyType == '1040-10' || item.applyType == '1040-20') {
					uni.navigateTo({
						url: item.page + '?btnList=' + JSON
							.stringify(
								res) + '&id=' + item.applyId + '&agencyId=' + item.id +
							'&key=' +
							sitemapId.component
					})
				} else {
					uni.navigateTo({
						url: item.page + '?btnList=' + JSON
							.stringify(
								res) + '&id=' + item.applyRelationId + '&agencyId=' + item.id +
							'&key=' +
							sitemapId.component
					})
				}
			},
			//获取按钮权限
			getJurisdiction(sitemapId, item) {
				this.$post({
					url: this.api.AuthUser.getAuthActionByTargetIds,
					data: {
						backstage: 0,
						sitemapId: sitemapId.id,
						targetIds: [this.vuex_user.id]
					}
				}).then(res => {
					this.dealtCustomerManagement(item, res, sitemapId)
				})
			},
			//重置
			reset() {
				this.applyTypeName = ''
				this.startTime = ''
				this.endTime = ''
				this.currentPage = 1
				this.List = []
				this.toDealWith()
				this.show = false
			},
			confirm(e) {
				this.startTime = e.year + "-" + e.month + "-" + e.day
			},
			confirm2(e) {
				this.endTime = e.year + "-" + e.month + "-" + e.day
			},
			//上拉加载
			onReachBottom() {
				this.currentPage++
				this.toDealWith()
			},
			//获取待办
			toDealWith() {
				this.$post({
					url: this.api.toDealWith.getToDealWithList,
					data: {
						beginDate: this.startTime,
						endDate: this.endTime,
						applyTypeName: this.applyTypeName,
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						isAll: true,
						isDeal: ''
					}
				}).then(res => {
					res.rows.forEach(item => {
						this.btnImg.forEach(item2 => {
							if (item2.value == item.applyType) {
								item.src = item2.src
								item.page = item2.page
							}
						})
						this.List.push(item)
					})
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
	.search {
		width: 100%;
		background-color: #FFFFFF;
		padding-top: calc(88rpx + var(--status-bar-height));

		.search-input {
			height: 109rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;

			text {
				color: #333333;
				font-size: 28rpx;
				flex-shrink: 0;
			}

			input {
				font-size: 28rpx;
				color: #333333;
				text-align: right;
			}
		}

		.search-time {
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			margin-bottom: 69rpx;
			justify-content: space-between;

			text {
				color: #333333;
				font-size: 28rpx;
				flex-shrink: 0;
				margin-right: 20rpx;
			}

			.search-time-select {
				display: flex;
				align-items: center;

				.xian {
					width: 18rpx;
					height: 2rpx;
					background: rgba(153, 153, 153, 0.39);
					opacity: 1;
					border-radius: 1rpx;
					margin: 0 10rpx;
				}

				.search-time-select-s {
					width: 288rpx;
					height: 62rpx;
					background-color: #F5F5F5;
					border-radius: 8rpx;
					line-height: 62rpx;
					padding: 0 20rpx;
					color: #333333;
					font-size: 26rpx;
				}

				.search-time-select-s2 {
					width: 288rpx;
					height: 62rpx;
					background-color: #F5F5F5;
					border-radius: 8rpx;
					line-height: 62rpx;
					padding: 0 20rpx;
					color: #999999;
					font-size: 26rpx;
				}
			}
		}

		.search-btn {
			width: 100%;
			display: flex;
			align-items: center;

			.search-btn-reset {
				width: 50%;
				height: 98rpx;
				line-height: 98rpx;
				background-color: #F5F5F5;
				color: #333333;
				text-align: center;
				font-size: 32rpx;
			}

			.search-btn-complete {
				width: 50%;
				height: 98rpx;
				line-height: 98rpx;
				text-align: center;
				background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}
	}

	.list-detail {
		margin-top: 20rpx;

		.detail {
			width: 100%;
			height: 124rpx;
			background: #FFFFFF;
			padding: 0 30rpx;
			margin-bottom: 20rpx;

			.detail-lf {
				.img {
					height: 80rpx;
					position: relative;

					image {
						width: 80rpx;
						height: 80rpx;
					}

					.tips {
						position: absolute;
						right: 16rpx;
						top: 16rpx;
						width: 14rpx;
						height: 14rpx;
					}
				}

				.text {
					padding-left: 24rpx;

					.big {
						font-size: 28rpx;
						font-weight: 400;
						color: #333333;
					}

					.little {
						padding-top: 6rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #999999;
					}
				}
			}

			.detail-rg {
				font-size: 22rpx;
				font-weight: 400;
				color: #C0C0C0;
			}
		}
	}
</style>
