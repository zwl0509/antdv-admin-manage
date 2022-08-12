<template>
	<view class="application-record">
		<u-navbar title="单据列表" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333' back-icon-color="#333333">
		</u-navbar>
		<view class="record-y" @click="toDetail(item)"  v-for="(item,index) in list" :key="index">
			<view class="record-y-info">
				<image src="/static/image/workbench/customer-manage/fly.png" mode="" class="info-img"></image>
				<view class="info-text">
					<view class="bill">
						{{ item.applyNo }}
					</view>
					<view class="applyer">
						申请人: {{ item.employeeName }}
					</view>
					<view class="time">
						申请时间: {{ item.applyTime }}
					</view>
				</view>
			</view>
			<image src="/static/image/mine/right.png" mode="" class="record-y-right"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			//获取单据列表
			getList(){
				this.$get({
					url: this.api.civilizedDelivery.getList,
					data: {
					}
				}).then(res => {
					this.list = res.rows || []
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url: 'bill-detail?id='+item.id
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
	.application-record {
		.record-y {
			width: 100%;
			height: 212rpx;
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			margin-top: 20rpx;

			.record-y-right {
				width: 14rpx;
				height: 27rpx;
			}

			.record-y-info {
				display: flex;
				align-items: flex-start;

				.info-img {
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
				}

				.info-text {
					.bill {
						color: #333333;
						font-size: 32rpx;
						font-weight: bold;
						margin-bottom: 16rpx;
					}

					.applyer {
						color: #999999;
						font-size: 30rpx;
						margin-bottom: 4rpx;
					}

					.time {
						color: #999999;
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>
