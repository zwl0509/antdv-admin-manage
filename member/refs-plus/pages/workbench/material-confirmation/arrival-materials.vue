<template>
	<view class="arrival-materials">
		<u-navbar title="材料到场" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#FFFFFF' :background="bg" back-icon-color="#ffffff">
			<view class="slot-wrap" slot="right" @click="getSituation">
				<view class="" style="font-size: 28rpx;color: #FFFFFF;padding-right: 30rpx;">
					主材申请
				</view>
			</view>
		</u-navbar>
		<view class="arrival-bg"></view>
		<view class="center">
			<view class="materials-y" v-for="(item, index) in dataList" :key="index" >
				<view class="materials-y-title">
					<view class="materials-y-title-l">
						<text>{{ item.Brand }}</text>
						<text>{{ item.BillNo }}</text>
					</view>
					<view class="materials-y-title-r-already" v-if="!!item.IsMBPCanShip">已通知</view>
					<view class="materials-y-title-r-no" v-else>未通知</view>
				</view>
				<scroll-view scroll-x="true" style="white-space: nowrap;">
					<view v-if="item.MaterialInfo" class="materials-status" >

						<view class="materials-status-y">
							<view>
								<image v-if="item.MaterialInfo.PlaceStatus == 0" src="/static/image/workbench/material-confirmation/2-0.png"></image>
								<image v-else-if="item.MaterialInfo.PlaceStatus == 1" src="/static/image/workbench/material-confirmation/2-1.png"></image>
							</view>
							<view class="status-name-g">{{ PlaceStatusList[item.MaterialInfo.PlaceStatus].name }}</view>
							<view class="status-time-g">{{ item.MaterialInfo.PlaceDate }}</view>
						</view>

						<view class="materials-status-y">
							<view>
								<image v-if="item.MaterialInfo.PlaceStatus == 0" src="/static/image/workbench/material-confirmation/1-0.png"></image>
								<image v-else-if="item.MaterialInfo.PlaceStatus == 1" src="/static/image/workbench/material-confirmation/1-1.png"></image>
								<image v-else-if="item.MaterialInfo.PlaceStatus == 2" src="/static/image/workbench/material-confirmation/1-2.png"></image>
							</view>
							<view class="status-name-g">{{ MBPAcceptStatusList[item.MaterialInfo.MBPAcceptStatus].name }}</view>
							<view class="status-time-g">{{ item.MaterialInfo.MBPAcceptDate }}</view>
						</view>
						
						<view class="materials-status-y">
							<view>
								<image v-if="item.MaterialInfo.PlaceStatus == 0" src="/static/image/workbench/material-confirmation/2-0.png"></image>
								<image v-else-if="item.MaterialInfo.PlaceStatus == 1" src="/static/image/workbench/material-confirmation/2-1.png"></image>
							</view>
							<view class="status-name-g">{{ MBPDeliverStatusList[item.MaterialInfo.MBPDeliverStatus].name }}</view>
							<view class="status-time-g">{{ item.MaterialInfo.MBPDeliverDate }}</view>
						</view>

						<view class="materials-status-y">
							<view>
								<image v-if="item.MaterialInfo.PlaceStatus == 0" src="/static/image/workbench/material-confirmation/2-0.png"></image>
								<image v-else-if="item.MaterialInfo.PlaceStatus == 1" src="/static/image/workbench/material-confirmation/2-1.png"></image>
								<image v-else-if="item.MaterialInfo.PlaceStatus == 2" src="/static/image/workbench/material-confirmation/2-2.png"></image>

							</view>
							<view class="status-name-g">{{ WorkerCheckedStatusList[item.MaterialInfo.WorkerCheckedStatus].name }}</view>
							<view class="status-time-g">{{ item.MaterialInfo.ConfirmDate }}</view>
						</view>

						<view class="materials-status-y">
							<view>
								<image v-if="item.MaterialInfo.PlaceStatus == 0" src="/static/image/workbench/material-confirmation/3-0.png"></image>
								<image v-else-if="item.MaterialInfo.PlaceStatus == 1" src="/static/image/workbench/material-confirmation/3-1.png"></image>
								<image v-else-if="item.MaterialInfo.PlaceStatus == 2" src="/static/image/workbench/material-confirmation/3-2.png"></image>
							</view>
							<view class="status-name-g">{{ MBPInstallStatusList[item.MaterialInfo.MBPInstallStatus].name }}</view>
							<view class="status-time-g">{{ item.MaterialInfo.MBPInstallDate }}</view>
						</view>

						<view class="materials-status-y">
							<view>
								<image v-if="item.MaterialInfo.PlaceStatus == 0" src="/static/image/workbench/material-confirmation/3-0.png"></image>
								<image v-else-if="item.MaterialInfo.PlaceStatus == 1" src="/static/image/workbench/material-confirmation/3-2.png"></image>
							</view>
							<view class="status-name-g">{{ IsNotReceiveList[item.MaterialInfo.IsNotReceive].name }}</view>
							<view class="status-time-g">{{ item.MaterialInfo.NotReceiveDate }}</view>
						</view>
					</view>
				</scroll-view>
				<view class="materials-btns">
					<text @click="toNotice('10',item)">送货通知</text>
					<text @click="toNotice('20',item)">特权送货</text>
					<text>收货不属实</text>
					<text class="materials-btns-red" @click="toConfirm(item)">到场确认</text>
				</view>
				<view class="materials-toDetail" @click="toDetail(item)">
					<text>材料明细</text>
					<image src="/static/image/mine/right.png"></image>
				</view>
			</view>
		</view>
		<u-popup v-model="show" mode="bottom" width="750rpx" border-radius="20">
			<view class="apply-situation">
				<view class="apply-situation-title">
					申请情况
				</view>
				<view class="apply-situation-center" v-if="declareInfo">
					<view class="">
						<text>主材占比</text>
						<text>{{ declareInfo.JichuZhangBiOrJiChuZaojia.toFixed(2) * 100 }}%</text>
					</view>
					<view class="">
						<text>已收工程款</text>
						<text>￥{{ declareInfo.ReceivedEngineerFunds.toFixed(2) }}</text>
					</view>
					<view class="">
						<text>最大可领金额</text>
						<text>￥{{ declareInfo.MaxKeLingMoney.toFixed(2) }}</text>
					</view>
					<view class="">
						<text>已申请金额</text>
						<text>￥{{ declareInfo.YiLingMoney.toFixed(2) }}</text>
					</view>
					<view class="">
						<text>已开单金额</text>
						<text>￥{{ declareInfo.YiKaidanMoney.toFixed(2) }}</text>
					</view>
					<view class="">
						<text>可用金额</text>
						<text>￥{{ declareInfo.KeyongMoney.toFixed(2) }}</text>
					</view>
				</view>
				<view class="apply-situation-btn" @click="show=false">
					<text>确认</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
  const PlaceStatusList = [
    { value: 0, name: '未下订单'},
    { value: 1, name: '已下订单'}
  ]
  const MBPAcceptStatusList = [
    { value: 0, name: '材料商未确认'},
    { value: 1, name: '材料商部分确认'},
    { value: 2, name: '材料商已确认'}
  ]
  const MBPDeliverStatusList = [
    { value: 0, name: '未发货'},
    { value: 1, name: '已发货'}
  ] 
  const WorkerCheckedStatusList = [
    { value: 0, name: '工长未确认'},
    { value: 1, name: '工长部分确认'},
    { value: 2, name: '工长已确认'}
  ]
  const MBPInstallStatusList = [
    { value: 0, name: '未安装'},
    { value: 1, name: '部分安装'},
    { value: 2, name: '已安装'}
  ]
  const IsNotReceiveList = [
    { value: 0, name: '收货不属实'},
    { value: 1, name: '收货属实'}
  ]
	import moment from 'moment'
	export default {
		data() {
			return {
				PlaceStatusList,
        MBPAcceptStatusList,
        MBPDeliverStatusList,
        WorkerCheckedStatusList,
        MBPInstallStatusList,
        IsNotReceiveList,
				bg: { background: 'none' },
				show: false,
				dataList: [],
				declareInfo: null
			}
		},
		onLoad(customerId){
			this.getList()
		},
		methods: {
			getList(){
				this.$get({
						url: this.api.MaterialConfirmInfo.getBillMaster,
						data: {
							customerId: '0'
						}
				}).then(res => {
					const list = [ ...res ]
					list.forEach(item=> {
						item.MaterialInfo = {
							PlaceStatus: item.PlaceStatus || 0,
							PlaceDate: item.PlaceDate ? moment(item.PlaceDate).format('YYYY-MM-DD') : null ,
							MBPAcceptStatus: item.MBPAcceptStatus || 0,
							MBPAcceptDate: item.MBPAcceptDate ? moment(item.MBPAcceptDate).format('YYYY-MM-DD') : null ,
							MBPDeliverStatus: item.MBPDeliverStatus || 0,
							MBPDeliverDate: item.MBPDeliverDate ? moment(item.MBPDeliverDate).format('YYYY-MM-DD') : null ,
							WorkerCheckedStatus: item.WorkerCheckedStatus || 0,
							ConfirmDate: item.ConfirmDate ? moment(item.ConfirmDate).format('YYYY-MM-DD') : null ,
							MBPInstallStatus: item.MBPInstallStatus || 0,
							MBPInstallDate: item.MBPInstallDate ? moment(item.MBPInstallDate).format('YYYY-MM-DD') : null ,
							IsNotReceive: item.IsNotReceive || 0,
							NotReceiveDate: item.NotReceiveDate ? moment(item.NotReceiveDate).format('YYYY-MM-DD') : null ,
						}
					})
					this.dataList = list
				})
			},
			getSituation(){
				this.show = true
				this.$get({
					url: this.api.MaterialConfirmInfo.masterMaterialInfo,
					data: { customerId: '0' }
				}).then(res => {
					this.declareInfo = res
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url: 'materials-detail?id=' + item.BillMasterID
				})
			},
			toConfirm(item){
				uni.navigateTo({
					url: 'materials-confirm?id=' + item.BillMasterID
				})
			},
			toNotice(type, item){
				uni.navigateTo({
					url: `send-notice?type=${type}&id=${item.BillMasterID}`
				})
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
	.arrival-materials {
		.apply-situation {
			padding-bottom: 72rpx;

			.apply-situation-title {
				height: 112rpx;
				text-align: center;
				line-height: 112rpx;
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
				border-bottom: 2rpx solid #EEEEEE;
			}

			.apply-situation-center {
				padding: 0 40rpx;
				margin-bottom: 48rpx;

				view {
					height: 112rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 2rpx solid #EEEEEE;

					text {
						color: #333333;
						font-size: 30rpx;
						font-weight: bold;

						&:last-child {
							font-weight: 400;
						}
					}
				}
			}

			.apply-situation-btn {
				padding: 0 75rpx;

				text {
					display: inline-block;
					width: 100%;
					height: 88rpx;
					background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
					line-height: 88rpx;
					border-radius: 44rpx;
					text-align: center;
					color: #FFFFFF;
					font-size: 32rpx;
				}
			}
		}

		.arrival-bg {
			position: fixed;
			top: 0rpx;
			left: 0rpx;
			width: 100%;
			height: 700rpx;
			background: linear-gradient(180deg, #B80201 0%, #DF8E8D 48%, #F8F8FB 100%);
			z-index: 2;
		}

		.center {
			padding: 0 30rpx;
			position: relative;
			z-index: 3;
		}

		.materials-y {
			width: 100%;
			height: 559rpx;
			border-radius: 20rpx;
			padding: 34rpx 00rpx 32rpx 0rpx;
			background-color: #fff;
			margin-top: 20rpx;

			.materials-y-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;

				.materials-y-title-l {
					display: flex;
					align-items: center;

					text {
						color: #999999;
						font-size: 30rpx;

						&:last-child {
							color: #333333;
							font-size: 32rpx;
							font-weight: bold;
							margin-left: 16rpx;
						}
					}
				}

				.materials-y-title-r-already {
					width: 92rpx;
					height: 36rpx;
					background: #DBEDFF;
					line-height: 36rpx;
					border-radius: 4rpx;
					text-align: center;
					color: #41A1FF;
					font-size: 24rpx;
				}

				.materials-y-title-r-no {
					width: 92rpx;
					height: 36rpx;
					background: #FCEDED;
					line-height: 36rpx;
					border-radius: 4rpx;
					text-align: center;
					color: #B80201;
					font-size: 24rpx;
				}
			}

			.materials-status {
				height: 158rpx;
				margin: 60rpx 0;
				display: flex;

				.materials-status-y {
					width: 200rpx;
					height: 158rpx;
					flex-shrink: 0;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: space-between;
					position: relative;
					z-index: 3;

					&::after {
						content: "";
						width: 128rpx;
						height: 0rpx;
						border: 2rpx dashed #D0D0D0;
						position: absolute;
						top: 32rpx;
						right: -66rpx;
						z-index: -1;
					}

					&:last-child {
						&::after {
							display: none;
						}
					}

					image {
						width: 68rpx;
						height: 68rpx;
					}

					.status-name-g {
						color: #999999;
						font-size: 28rpx;
					}

					.status-time-g {
						color: #999999;
						font-size: 22rpx;
					}
				}
			}

			.materials-btns {
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 20rpx;

				text {
					width: 148rpx;
					height: 64rpx;
					border: 2rpx solid #C0C0C0;
					border-radius: 12rpx;
					line-height: 64rpx;
					text-align: center;
					color: #333333;
					font-size: 24rpx;
				}

				.materials-btns-red {
					background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
					border: none;
					color: #FFFFFF;
				}
			}

			.materials-toDetail {
				margin: 0 30rpx;
				height: 88rpx;
				background: #F9F9F9;
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 24rpx;

				text {
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}

				image {
					width: 14rpx;
					height: 27rpx;
				}
			}
		}
	}
</style>
