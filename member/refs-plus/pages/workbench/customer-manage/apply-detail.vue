<template>
	<view class="apply-detail">
		<u-navbar title="申请详情" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
		</u-navbar>
		<view class="userinfo">
			<view class="info">
				<image src="/static/image/mine/avatar-mis.png" mode=""></image>
				<text>{{customInfo.infoShow ? customInfo.customerName : customInfo.customerNameHide}}</text>
			</view>
		</view>
		<view class="apply">
			<view class="apply-title">
				<text class='apply-title-l'>{{detail.typeName}}</text>
				<text :class="detail.status=='1010-20' ? 'apply-title-r-grey' :'apply-title-r-red'">
					{{detail.statusName}}</text>
			</view>
			<view class="apply-day" v-if="detail.daysOrNum">
				<image src="/static/image/workbench/customer-manage/time.png" mode=""></image>
				<text>{{detail.daysOrNum}}天</text>
			</view>
			<view class="apply-content">
				申请原因：{{detail.applicationReason}}
			</view>
			<view class="apply-time">
				{{detail.applicationDate}}
			</view>
		</view>
		<view class="designer" v-if="detail.designerName">
			<text style="color: #666666;font-size: 28rpx;">设计师</text><text
				style="color: #333333;font-size: 28rpx;font-weight: 400;">{{detail.designerName ? detail.designerName :'暂无'}}</text>
		</view>
		<view class="designer" v-if="detail.type=='1056-40'&&detail.customerSurveyInfo&&hasBtn" style="border-top: 1rpx solid #F8F8FB;margin: 0;">
			<text style="color: #666666;font-size: 28rpx;">调查问卷</text><text
				style="color: #333333;font-size: 28rpx;font-weight: 400;" @click="toquestion">查看</text>
		</view>
		<view class="examine">
			<view class="examine-title">
				审核信息
			</view>
			<view class="examine-center" v-if="detail.status!='1010-10'">
				<view class="examine-user">
					<view class="examine-user-l">
						<image src="../../../static/image/mine/avatar-mis.png" mode=""></image>
						<view class="">
							<text>{{detail.auditorName}}</text>
							<text>审核人</text>
						</view>
					</view>
					<view class="examine-user-r">
						{{detail.auditDate}}
					</view>
				</view>
				<view class="examine-result">
					{{detail.auditTypeName}}
				</view>
				<view class="examine-content">
					{{detail.auditContent}}
				</view>
			</view>
			<view class="" v-else style='text-align: center;padding-top: 156rpx;padding-bottom: 172rpx;'>
				<image src="../../../static/image/workbench/customer-manage/nodata.png" mode=""
					style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
				<view class="" style='color: #999999;font-size: 32rpx;'>
					空空如也~
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customInfo: uni.getStorageSync('customInfo'),
				detail: {},
				managerId: '',
				hasBtn:false
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDetail()
			this.getPosition()
			uni.getStorageSync('btnList').forEach(item=>{
				if(item.key.indexOf("ViewQuestion")!=-1){
					this.hasBtn=true
				}
			})
		},
		methods: {
			//获取职位
			getPosition() {
				this.$get({
					url: this.api.SysOrganization.getList,
					data: {
						organizationsId: 1042
					}
				}).then(res => {
					res.rows.forEach(item => {
						if (item.positionCode == '1042-05') {
							this.managerId = item.id
						}
					})
				})
			},
			toquestion() {
				uni.navigateTo({
					url: 'question-detail?qList=' + JSON.stringify(this.detail.customerSurveyInfo
						.surveyQuestionVOList) + '&createdTime=' + this.detail.customerSurveyInfo.createdTime
				})
			},
			getDetail() {
				this.$get({
					url: this.api.CustomInfo.getAuditLogInfoDetail,
					data: {
						id: this.id
					}
				}).then(res => {
					this.detail = res
				})
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.designer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		padding: 0 30rpx;
		background-color: #FFFFFF;
		margin-top: 20rpx;
	}

	.apply-detail {
		.userinfo {
			width: 100%;
			background-color: #FFFFFF;
			padding: 10rpx 0 12rpx 0;

			.info {
				width: 424rpx;
				height: 64rpx;
				background: #F9F9F9;
				border-radius: 36rpx;
				margin: auto;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 12rpx;
				}

				text {
					font-size: 26rpx;
					color: #666666;
					font-weight: 400;
				}
			}
		}

		.apply {
			width: 100%;
			background-color: #FFFFFF;
			margin-top: 20rpx;
			padding: 24rpx 30rpx 20rpx 30rpx;

			.apply-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 12rpx;

				.apply-title-l {
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}

				.apply-title-r-red {
					display: inline-block;
					width: 104rpx;
					height: 40rpx;
					text-align: center;
					line-height: 40rpx;
					background-color: #FBE2E2;
					border-radius: 4rpx;
					font-size: 24rpx;
					color: #B80201;
				}

				.apply-title-r-grey {
					display: inline-block;
					width: 104rpx;
					height: 40rpx;
					text-align: center;
					line-height: 40rpx;
					background-color: #F2F2F2;
					border-radius: 4rpx;
					font-size: 24rpx;
					color: #999999;
				}
			}

			.apply-day {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;

				image {
					width: 24rpx;
					height: 24rpx;
					margin-right: 12rpx;
				}

				text {
					color: #999999;
					font-size: 24rpx;
				}
			}

			.apply-content {
				color: #333333;
				font-size: 28rpx;
				margin-bottom: 16rpx;
			}

			.apply-time {
				color: #999999;
				font-size: 24rpx;
			}
		}

		.examine {
			background-color: #FFFFFF;
			margin-top: 20rpx;

			.examine-title {
				width: 100%;
				height: 88rpx;
				// line-height: 88rpx;
				padding: 0 30rpx;
				border-bottom: 1rpx solid #F0F0F0;
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.examine-center {
				padding: 0 30rpx;
				padding-bottom: 88rpx;

				.examine-user {
					margin: 28rpx 0 32rpx 0;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.examine-user-l {
						display: flex;
						align-items: center;

						image {
							width: 76rpx;
							height: 76rpx;
							border-radius: 50%;
							margin-right: 20rpx;
						}

						view {
							height: 76rpx;
							display: flex;
							justify-content: space-between;
							flex-direction: column;

							text {
								color: #BBBBBB;
								font-size: 20rpx;
								font-weight: 500%;

								&:first-child {
									color: #333333;
									font-size: 28rpx;
								}
							}
						}
					}

					.examine-user-r {
						color: #999999;
						font-size: 22rpx;
					}
				}

				.examine-result {
					color: #B80201;
					font-size: 30rpx;
					font-weight: bold;
					margin-bottom: 12rpx;
				}

				.examine-content {
					color: #333333;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}
	}
</style>
