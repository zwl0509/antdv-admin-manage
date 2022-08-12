<template>
	<view class="worker-search">
		<u-navbar class="navbar fl-cc" :border-bottom="false">
			<view class="" style="padding-right: 30rpx;width: 100%;">
				<u-search placeholder="请输入客户姓名或联系方式" v-model="searchCondition" @change="getAppCustomerDispatchInfo"
					:show-action="false">
				</u-search>
			</view>
		</u-navbar>
		<view class="detail" v-for="(val,index) in list" :key="index">
			<view class="detail-img">
				<image src="/static/image/workbench/worker-test/detail-bg.png" mode="" class="bg"></image>
				<view class="detail-img-center">
					<image src="/static/image/workbench/worker-test/tx2.png" mode="" class="tx"></image>
					<text>工人图片</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/worker-type.png" mode=""></image>
				<view class="detail-y-info">
					<text>工种</text>
					<text>{{val.typeName}}</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/worker.png" mode=""></image>
				<view class="detail-y-info">
					<text>工人</text>
					<text>{{val.workerName}}</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/worker-phone.png" mode=""></image>
				<view class="detail-y-info">
					<text>联系电话</text>
					<text>{{val.telPhone}}</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/number.png" mode=""></image>
				<view class="detail-y-info">
					<text>身份证号</text>
					<text>{{val.idCard}}</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/card.png" mode=""></image>
				<view class="detail-y-info">
					<text>银行卡号</text>
					<text>{{val.bankAccount}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchCondition: '',
				customerId: '',
				list:[]
			}
		},
		onLoad(options) {
			this.customerId = options.customerId
		},
		methods: {
			getAppCustomerDispatchInfo() {
				this.$get({
					url: this.api.CustomerWorkerDispatchInfo.getCustomerDispatchInfo,
					data: {
						customerId: this.customerId,
						searchCondition: this.searchCondition
					}
				}).then(res => {
					this.list = res
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.detail {
		margin-bottom: 20rpx;

		.detail-img {
			width: 100%;
			height: 340rpx;
			position: relative;
			z-index: 3;
			margin-bottom: 18rpx;

			.bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}

			.detail-img-center {
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				height: 100%;

				.tx {
					width: 170rpx;
					height: 170rpx;
					border-radius: 50%;
					border: 9rpx solid #fff;
					margin-bottom: 20rpx;
				}

				text {
					color: #FFFFFF;
					font-size: 28rpx;
				}
			}
		}

		.detail-y {
			margin-bottom: 8rpx;
			height: 128rpx;
			padding: 0 30rpx;
			display: flex;
			align-items: center;

			image {
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;
			}

			.detail-y-info {
				height: 80rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				text {
					color: #999999;
					font-size: 24rpx;

					&:first-child {
						color: #333333;
						font-size: 28rpx;
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
