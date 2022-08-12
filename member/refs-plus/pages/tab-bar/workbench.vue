<template>
	<view class="workbench">
		<image src="/static/image/tab-bar/bg.png" mode="" class="workbench-bg"></image>
		<view class="workbench-top">
			<view class="message" @click="handleIn">
				<image src="../../static/image/tab-bar/message-b.png" mode=""></image>
				<view class="tips" v-if="this.hasRead==1"></view>
			</view>
			<view class="user-content fl-cu">
				<!-- 				<u-avatar :src="vuex_user.avatar || (vuex_user.gender == '1001-20'? defaultWomenAvatar : defaultAvatar)"
					:size="88"></u-avatar> -->
				<view class=""
					style="width: 96rpx;height: 96rpx;border-radius: 50%;border: 6rpx solid #FFFFFF;overflow: hidden;display: flex;align-items: center;justify-content: center;">
					<image
						:src="vuex_user.avatar || (vuex_user.gender == '1001-20'? defaultWomenAvatar : defaultAvatar)"
						mode=""></image>
				</view>
				<view class="user-info">
					<view class="user-name">{{ vuex_user.realName }}</view>
					<view class="address-info">
						<view>ID:<text>{{vuex_user.employeeCode}}</text></view>
						<view class="address">
							<image src="../../static/image/tab-bar/address-b.png"></image>
							<text>{{address}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="workbench-body" v-if="btnlist.length">
			<!-- 			<swiper :class="getLength(current) ? 'swiper':''" indicator-active-color="#B80201"
				:indicator-dots="btnlist.length>1 ? true : false" :autoplay="false" :duration="500" @change="change">
				<swiper-item v-for="(item,index) in btnlist" :key="index">
					<view class="manage">
						<view :class="getBorder(current,index2) ? 'manage-detail':'manage-detail2'"
							@click="customerManage(val)" v-for="(val,index2) in item" :key="index2">
							<view class="detail">
								<image :src="val.src"></image>
								<view class="text">{{val.title}}</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper> -->
			<view class="menus-title">
				常用功能
			</view>
			<view class="menus">
				<view class="menus-y" @click="customerManage(val)" v-for="(val,index) in btnlist" :key="index">
					<view class="menus-y-detail">
						<image :src="val.src"></image>
						<view class="text">{{val.title}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-to-do">
			<view class="list-title fl-csb">
				<view class="title-lf">待办事项</view>
				<view class="title-rg fl-cc" @click.stop="toMoreList" style="height: 100%;">
					<view>查看更多</view>
					<image src="../../static/image/tab-bar/arrow-rg.png"></image>
				</view>
			</view>
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
			<view v-if="!List.length" style="padding-top:40rpx ;text-align: center;">
				<image src="/static/image/workbench/customer-manage/nodata.png"
					style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
				<view style='color: #999999;font-size: 32rpx;'>
					空空如也~
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		wsInit
	} from '../../utils/ws.js'
	// #ifdef APP-PLUS
	import updata from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
	// #endif
	export default {
		data() {
			return {
				// 默认头像男女
				defaultAvatar: '../../static/image/mine/avatar-mr.png', //'/static/image/mine/default-user-avatar.png',
				defaultWomenAvatar: '../../static/image/mine/avatar-mis.png', //'/static/image/mine/default-women-avatar.png',
				List: [], //待办
				btnlist: [], //
				show: true,
				targetIds: [],
				hasRead: '',
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
				address: '',
				mainList: [{
					component: 'DataBoard',
					src: '../../static/image/tab-bar/data-board.png',
					page: ''
				}, {
					component: 'CustomerManagement',
					src: '../../static/image/tab-bar/customer-manage.png',
					page: '/pages/workbench/customer-manage/customer-manage'
				}, {
					component: 'EngineeringDispatch',
					src: '../../static/image/tab-bar/product-manage.png',
					page: '../workbench/product-dispatch/dispatch'
				}, {
					component: 'MaterialDeclaration',
					src: '../../static/image/tab-bar/material-declaration.png',
					page: '../workbench/material-declare/declare-list'
				}, {
					component: 'ConstructionManagement',
					src: '../../static/image/tab-bar/construction-manage.png',
					page: '/pages/workbench/construction-manage/manage-list'
				}, {
					component: 'CostManagement',
					src: '../../static/image/tab-bar/cost-manage.png',
					page: ''
				}, {
					component: 'CustomerComplaints',
					src: '../../static/image/tab-bar/customer-complaints.png',
					page: "/pages/workbench/customer-complaints/complaint-list?type=1071-10"
				}, {
					component: 'CustomerRepair',
					src: '../../static/image/tab-bar/customer-repair.png',
					page: "/pages/workbench/customer-complaints/complaint-list?type=1071-20"
				}, {
					component: 'WorkerDispatch',
					src: '../../static/image/tab-bar/worker-dispatch.png',
					page: '/pages/workbench/worker-dispatch/dispatch-list'
				}, {
					component: 'WorkerTest',
					src: '../../static/image/tab-bar/worker-test.png',
					page: '/pages/workbench/worker-test/worker-test'
				}, {
					component: 'RenovationData',
					src: '../../static/image/tab-bar/renovation-data.png',
					page: '/pages/workbench/renovation-data/customer-list'
				}, {
					component: 'OnsiteMaintenance',
					src: '../../static/image/tab-bar/onsite-maintenance.png',
					page: '/pages/workbench/customer-complaints/complaint-list?type=1071-30'
				}, {
					component: 'MeasurementNotification',
					src: '../../static/image/tab-bar/onsite-maintenance.png',
					page: '/pages/workbench/measurement-notification/customer-list'
				}, {
					component: 'MaterialConfirmation',
					src: '../../static/image/tab-bar/onsite-maintenance.png',
					page: '/pages/workbench/material-confirmation/customer-list'
				}, {
					component: 'CivilizedDelivery',
					src: '../../static/image/tab-bar/onsite-maintenance.png',
					page: '/pages/workbench/civilized-delivery/product-list'
				}, {
					component: 'RectificationManagement',
					src: '../../static/image/tab-bar/onsite-maintenance.png',
					page: '/pages/workbench/rectification-management/manage-list'
				}],
				current: 0, //
				address: "",
			}
		},
		onShow() {
			if (this.vuex_login) {
				this.targetIds = []
				this.getInfo()
				this.toDealWith()
				this.unRead()
			} else {
				this.$Toast('请先登录')
				this.$u.vuex('vuex_user', '')
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			updata()
			uni.getLocation({
				type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				geocode: true,
				success: function(res) {
					console.log(res)
					uni.setStorageSync('address', res.address.city + "  " + res.address.district + "  " + res
						.address.street)
					that.address = res.address.city + res.address.district + res.address.street
					uni.setStorageSync('latitude', res.latitude)
					uni.setStorageSync('longitude', res.longitude)
					uni.setStorageSync('addressDetail', res.address.poiName)
				},
				fail: function(res) {
					console.log(res)
				}
			});
			this.$u.vuex('vuex_platform', uni.getSystemInfoSync().platform.toLowerCase() === 'ios' ? true : false)
			uni.setStorageSync('isIos', uni.getSystemInfoSync().platform.toLowerCase() === 'ios' ? true : false)
			// #endif
			let that = this
			uni.$on('onSocketMessage', function(data) {
				console.log('监听到事件来自 onSocketMessage ，携带参数 msg 为：' + JSON.stringify(data));
				if (data) {
					that.toDealWith()
				}
			})
		},
		methods: {
			getLength(current) {
				if (this.btnlist[current]) {
					return this.btnlist[current].length > 3
				}

			},
			getBorder(current, index) {
				if (this.btnlist[current].length > 3) {
					return index <= 2
				} else {
					return false
				}
			},
			change(e) {
				this.current = e.detail.current
			},
			//消息提示
			unRead() {
				this.$get({
					url: this.api.CustomInfo.unRead
				}).then(res => {
					this.hasRead = res
				})
			},
			toMoreList() {
				uni.navigateTo({
					url: 'agency-list'
				})
			},
			//获取待办
			toDealWith() {
				this.$post({
					url: this.api.toDealWith.getToDealWithList,
					data: {
						currentPage: 1,
						pageSize: 3,
						isAll: false,
						isDeal: false
					}
				}).then(res => {
					res.rows.forEach(item => {
						this.btnImg.forEach(item2 => {
							if (item2.value == item.applyType) {
								item.src = item2.src
								item.page = item2.page
							}
						})
					})
					this.List = res.rows
				})
			},
			getInfo() {
				this.$get({
					url: this.api.AuthUser.getCurrentUser
				}).then(res => {
					this.$u.vuex('vuex_user', res)
					wsInit()
					this.getAuthSiteMapByTargetId(res)
				})
			},
			getAuthSiteMapByTargetId(res) {
				this.targetIds.push(res.id)
				this.targetIds.push(res.orgId)
				res.roles.forEach(item => {
					this.targetIds.push(item.id)
				})
				this.$post({
					url: this.api.common.getAuthSiteMapByTargetId,
					data: {
						targetIds: this.targetIds,
						backstage: 0
					}
				}).then(res => {
					// this.btnlist = []
					res.forEach(item => {
						this.mainList.forEach(item2 => {
							if (item.component == item2.component) {
								item.src = item2.src
								item.page = item2.page
							}
						})
					})
					this.btnlist = res
					// for (let i = 0; i < Math.ceil(res.length / 6); i++) {
					// 	if ((i + 1) * 6 < res.length) {
					// 		this.btnlist[i] = res.slice(i * 6, (i + 1) * 6)
					// 	} else {
					// 		this.btnlist[i] = res.slice(i * 6, res.length)
					// 	}
					// }
					// this.$forceUpdate() //强制更新
				})
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
			customerManage(val) {
				uni.setStorageSync('sitemapId', val.id)
				if (val.component == 'CustomerManagement') {
					uni.navigateTo({
						url: val.page + '?tabs=' + JSON.stringify(val.children)
					})
				} else if (val.component == 'RenovationData' || val.component == 'ConstructionManagement') {
					uni.navigateTo({
						url: val.page + '?sitemapId=' + val.id
					})
				} else {
					uni.navigateTo({
						url: val.page
					})
				}
			},
			productDispatch() {
				uni.navigateTo({
					url: '../workbench/product-dispatch/dispatch'
				})
			},
			materialDeclare() {
				uni.navigateTo({
					url: '../workbench/material-declare/declare-list'
				})
			},
			handleIn() {
				uni.navigateTo({
					url: '/pages/workbench/message-center/message-center'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.workbench {
		width: 100%;
		// height: 100vh;
		background: rgba(248, 248, 251, 0.5);

		.workbench-bg {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 380rpx;
			z-index: 2;
		}

		.workbench-top {
			width: 100%;
			height: 344rpx;
			padding: 100rpx 40rpx;
			position: relative;
			z-index: 3;
			// background: url("@/static/image/tab-bar/bg.png") no-repeat center center;
			// background-size: 100% auto;

			.message {
				display: flex;
				float: right;
				position: relative;
				z-index: 3;

				image {
					width: 28rpx;
					height: 32rpx;
				}

				.tips {
					width: 12rpx;
					height: 12rpx;
					background-color: #F9381B;
					border-radius: 50%;
					position: relative;
					right: -2rpx;
					top: -6rpx;
					width: 14rpx;
					height: 14rpx;
				}
			}

			.user-content {
				padding-top: 100rpx;

				image {
					width: 96rpx;
					height: 96rpx;
					position: relative;
					z-index: 999;
				}

				.user-info {
					color: #333333;
					padding-left: 28rpx;
					opacity: 1;

					.user-name {
						font-size: 36rpx;
						font-family: PingFang SC;
						font-weight: bold;
					}

					.address-info {
						display: flex;
						padding-top: 12rpx;

						.address {
							padding-left: 40rpx;

							image {
								width: 16rpx;
								height: 22rpx;
							}

							text {
								padding-left: 16rpx;
							}
						}
					}
				}
			}
		}

		.workbench-body {
			// background-color: #FFFFFF;
			position: relative;
			z-index: 3;

			.menus-title {
				padding: 32rpx 30rpx 40rpx 30rpx;
				height: 116rpx;
				overflow: hidden;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
				font-size: 32rpx;
				color: #222222;
				font-weight: bold;
				background: #fff;
			}

			.menus {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				background: #FFFFFF;

				.menus-y {
					width: 25vw;
					text-align: center;
					margin-bottom: 48rpx;

					image {
						width: 64rpx;
						height: 64rpx;
						margin-bottom: 20rpx;
					}

					text {
						color: #333333;
						font-size: 24rpx;
						font-weight: 400;
					}
				}
			}

			.swiper {
				height: 500rpx;
			}

			.manage {
				height: auto;
				display: flex;
				flex-wrap: wrap;
				// &:last-child {
				// 	border-bottom: none;
				// }
				width: 100%;

				.manage-detail2 {
					width: 250rpx;
					height: 224rpx;
					border-right: 1rpx solid rgba(240, 240, 240, 0.5);
					display: flex;
					align-items: center;
					justify-content: center;

					.detail {
						text-align: center;
						position: relative;

						image {
							width: 64rpx;
							height: 64rpx;
						}

						.tips {
							position: absolute;
							left: 68rpx;
							top: -14rpx;
							font-size: 18rpx;
							background-color: #B80201;
							border: none;
							width: 32rpx;
							height: 32rpx;
							color: #FFFFFF;
						}

						.text {
							padding-top: 20rpx;
						}
					}
				}

				.manage-detail {
					width: 250rpx;
					height: 224rpx;
					border-right: 1rpx solid rgba(240, 240, 240, 0.5);
					border-bottom: 1rpx solid rgba(240, 240, 240, 0.5);
					display: flex;
					align-items: center;
					justify-content: center;

					.detail {
						text-align: center;
						position: relative;

						image {
							width: 64rpx;
							height: 64rpx;
						}

						.tips {
							position: absolute;
							left: 68rpx;
							top: -14rpx;
							font-size: 18rpx;
							background-color: #B80201;
							border: none;
							width: 32rpx;
							height: 32rpx;
							color: #FFFFFF;
						}

						.text {
							padding-top: 20rpx;
						}
					}
				}
			}
		}

		.list-to-do {
			background-color: #FFFFFF;
			// margin-top: 20rpx;
			width: 100%;
			// height: 560rpx;
			height: auto;
			padding: 0 30rpx;

			// padding-bottom: 100rpx;
			.list-title {
				height: 84rpx;
				border-bottom: 1rpx solid rgba(240, 240, 240, 0.5);

				.title-lf {
					font-weight: bold;
					line-height: 20px;
					color: #222222;
					opacity: 1;
					font-size: 28rpx;
				}

				.title-rg {
					color: #C0C0C0;
					font-size: 24rpx;

					image {
						margin-left: 14rpx;
						width: 15rpx;
						height: 26rpx;
					}
				}
			}

			.list-detail {

				// padding-bottom: 100rpx;
				.detail {
					width: 100%;
					height: 124rpx;
					background: rgba(255, 255, 255, 0.39);

					.detail-lf {
						.img {
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
		}
	}
</style>
