<template>
	<view class="follow-list">
		<u-navbar title="" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
			<view class="slot-wrap">
				<view :class="titleIndex==0 ? 'titleSelect':''" @click="changeTitle(0)">
					跟进记录
				</view>
				<view :class="titleIndex==1 ? 'titleSelect':''" @click="changeTitle(1)">
					申请记录
				</view>
			</view>
			<view slot='right' style="width: 88rpx;text-align: center;" v-if="hasBtnWrite=='true'">
				<u-icon name="plus" color="#333333" size="34" v-show='titleIndex==0' @click="towrite"></u-icon>
			</view>
		</u-navbar>
		<view class="userinfo">
			<view class="info">
				<image src="/static/image/mine/avatar-mis.png" mode=""></image>
				<text>{{customInfo.infoShow ? customInfo.customerName : customInfo.customerNameHide}}</text>
			</view>
		</view>
		<view class="" v-if='titleIndex==0'>
			<view class="tabs">
				<view :class="current==index ? 'tab-a':'tab'" v-for="(val,index) in tabsList" :key="index" @click="clickTab(index)">
					{{val.name}}
					<view class="bar" v-if="current==index">

					</view>
				</view>
			</view>
			<scroll-view scroll-y="true">
				<view class="scroll-list">
					<view class="list-y" v-for="(val,index) in list" :key="index" @click="todetail(val)">
						<view class="list-y-top">
							<view class="list-y-top-userinfo">
								<image src="../../../static/image/workbench/customer-manage/tx.png" mode=""></image>
								<view class="userinfo-text">
									<view class="name">
										{{val.trackerName!==null ? val.trackerName :'暂无'}}
									</view>
									<view class="identity">
										{{val.trackerPosition}}
									</view>
								</view>
							</view>
							<view :class="val.status=='已完成' ? 'list-y-top-status-b' : 'list-y-top-status-a'"
								v-if="val.status">
								{{val.status}}
							</view>
						</view>
						<view class="list-y-center">
							{{val.trackContent}}
						</view>
						<view class="list-y-bottom">
							<view class="list-y-bottom-time">
								<text style="margin-right: 16rpx;">{{val.timestatus ? val.timestatus:'跟进时间'}}</text>
								<text>{{val.modifiedTime}}</text>
							</view>
							<view class="type">
								{{val.trackTypeName}}
							</view>
						</view>
					</view>
					<view class="" v-if="!list.length" style="padding-top:236rpx ;text-align: center;">
						<image src="/static/image/workbench/customer-manage/none.png" mode=""
							style="width:296rpx ;height: 216rpx;"></image>
						<view style="color: #999999;font-size: 32rpx;">空空如也~</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="" v-else>
			<view class="apply" @click="toApplyDetail(val.id)" v-for="(val,index) in applyList" :key="index">
				<view class="apply-title">
					<text class='apply-title-l'>{{val.typeName}}</text>
					<text
						:class="val.status=='1010-20' ? 'apply-title-r-grey':'apply-title-r-red'">{{val.statusName}}</text>
				</view>
				<view class="apply-day" v-if="val.daysOrNum">
					<image src="/static/image/workbench/customer-manage/time.png" mode=""></image>
					<text>{{val.daysOrNum}}天</text>
				</view>
				<view class="apply-content">
					申请原因：{{val.applicationReason}}
				</view>
				<view class="apply-time">
					{{val.applicationDate}}
				</view>
			</view>
			<view class="" v-if="!applyList.length" style="padding-top:236rpx ;text-align: center;">
				<image src="/static/image/workbench/customer-manage/none.png" mode=""
					style="width:296rpx ;height: 216rpx;"></image>
				<view style="color: #999999;font-size: 32rpx;">空空如也~</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customInfo:uni.getStorageSync('customInfo'),
				titleIndex: 0,
				id: '',
				tabsList: [{
					name: '全部',
					value: ''
				}, {
					name: '营销',
					value: '1037-10'
				}, {
					name: '材料',
					value: '1037-20'
				}, {
					name: '施工',
					value: '1037-30'
				}, {
					name: '财务',
					value: '1037-40'
				}, {
					name: '客户',
					value: '1037-50'
				}],
				current: 0,
				list: [
					[{
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已完成',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '跟进时间',
						time: '2022-3-17 18:30',
						type: '施工类'
					}, {
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已完成',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}],
					[{
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '营销类'
					}],
					[{
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已完成',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '材料类'
					}],
					[{
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已完成',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '施工类'
					}],
					[{
						img: '/static/image/mine/avatar-mis.png',
						name: 'GAI super',
						identity: '客服',
						status: '已确认选材',
						content: '电话跟进：此次与客户沟通，明确客户选材标准，客户时间充裕， 后续可邀约进店协商具体事宜',
						timestatus: '下次跟进',
						time: '2022-3-17 18:30',
						type: '财务类'
					}],
					[]
				],
				applyList: [],
				key:'',
				hasBtnWrite:false,
			}
		},
		onLoad(options) {
			if(options.hasBtnWrite){
				this.hasBtnWrite=options.hasBtnWrite
			}
			this.id = options.id
			this.type = options.type
			this.key=options.key
			console.log(this.hasBtnWrite)
		},
		onShow(){
			if(this.titleIndex==0){
				this.getList(this.tabsList[this.current].value)
			}else{
				this.getApplyList()
			}
		},
		methods: {
			changeTitle(index){
				this.titleIndex=index
				if(index==0){
					this.getList(this.tabsList[this.current].value)
				}else{
					this.getApplyList()
				}
			},
			getApplyList() {
				this.$post({
					url: this.api.CustomInfo.getAuditLogInfo,
					data: {
						customerId: this.id
					}
				}).then(res => {
					this.applyList = res.rows
				})
			},
			toApplyDetail(id) {
				uni.navigateTo({
					url: 'apply-detail?id='+id
				})
			},
			getList(trackType) {
				this.$post({
					url: this.api.CustomInfo.getTrackingList,
					data: {
						id: this.id,
						trackType: trackType
					}
				}).then(res => {
					this.list = res.rows
				})
			},
			clickTab(index) {
				this.current = index
				this.getList(this.tabsList[index].value)
			},
			todetail(val) {
				uni.navigateTo({
					url: 'follow-detail?id='+val.id
				})
			},
			towrite() {
				uni.navigateTo({
					url: "write-follow?customerId=" + this.id + '&type=' + this.type
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
				padding: 4rpx 16rpx 2rpx 16rpx;
				text-align: center;
				background-color: #FBE2E2;
				border-radius: 4rpx;
				font-size: 24rpx;
				color: #B80201;
			}

			.apply-title-r-grey {
				display: inline-block;
				padding: 4rpx 16rpx 2rpx 16rpx;
				text-align: center;
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

	.slot-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto;

		view {
			color: #999999;
			font-size: 34rpx;
			margin: 0 24rpx;
		}

		.titleSelect {
			color: #333333;
			font-weight: bold;
		}
	}

	.follow-list {

		.scroll-list {
			height: calc(100vh - 174px);
			padding-top: 20rpx;
		}

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

		.tabs {
			width: 100%;
			height: 112rpx;
			padding: 0 26rpx;
			display: flex;
			align-items: center;
			background-color: #FFFFFF;

			.tab {
				width: 116rpx;
				height: 112rpx;
				line-height: 112rpx;
				text-align: center;
				font-size: 28rpx;
				color: #999999;
				font-weight: 400;
			}

			.tab-a {
				width: 116rpx;
				height: 112rpx;
				line-height: 112rpx;
				text-align: center;
				font-size: 28rpx;
				color: #000000;
				font-weight: 600;
				position: relative;

				.bar {
					width: 44rpx;
					height: 8rpx;
					background: linear-gradient(270deg, #FF8382 0%, #B80201 100%);
					border-radius: 4rpx;
					position: absolute;
					left: 0;
					right: 0;
					margin: auto;
					bottom: 16rpx;
				}
			}
		}

		.list-y {
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			padding: 1rpx 30rpx 20rpx 30rpx;
			box-sizing: border-box;
			.list-y-top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 22rpx;

				.list-y-top-userinfo {
					display: flex;
					align-items: center;

					image {
						width: 76rpx;
						height: 76rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}

					.userinfo-text {
						height: 76rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.name {
							color: #333333;
							font-size: 28rpx;
							font-weight: 500;
						}

						.identity {
							font-size: 20rpx;
							color: #BBBBBB;
							font-size: 500;
						}
					}
				}

				.list-y-top-status-a {
					background-color: #E1FAFA;
					width: 152rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					font-size: 24rpx;
					border-radius: 4rpx;
					color: #0AB4B3;
				}

				.list-y-top-status-b {
					width: 104rpx;
					height: 40rpx;
					background: #F2F2F2;
					border-radius: 4rpx;
					line-height: 40rpx;
					text-align: center;
					font-size: 24rpx;
					color: #999999;
				}
			}

			.list-y-center {
				font-size: 28rpx;
				font-weight: 400;
				line-height: 40rpx;
				color: #333333;
				margin-bottom: 16rpx;
			}

			.list-y-bottom {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.list-y-bottom-time {
					font-size: 24rpx;
					color: #999999;
					font-weight: 400;
				}

				.type {
					font-size: 24rpx;
					color: #999999;
					font-weight: 400;
				}
			}
		}
	}
</style>
