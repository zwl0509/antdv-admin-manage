<template>
	<view class="list">
		<u-navbar :title="title" :border='false' :titleBold='true' class="navbar" title-color='#333333'>
		</u-navbar>
		<view class="center">
			<view class="list-y" v-for="(val,index) in list" :key='index'>
				<image src="/static/image/workbench/customer-manage/fly.png" mode=""></image>
				<view class="list-y-content">
					<view class="list-y-content-t">
						<view class="name">
							{{val.applicantName}}
						</view>
						<view class="remark">
							备注：{{val.remark}}
						</view>
					</view>
					<view class="list-y-content-b">
						<text>{{val.applicationDate}}</text>
						<text>{{val.typeName}}</text>
					</view>
				</view>
			</view>
			<view class="" v-if="!list.length" style="padding-top:236rpx ;text-align: center;">
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
				list: [],
				customerId: '',
				key: '',
				title: '',
				type:''
			}
		},
		onLoad(options) {
			this.customerId = options.customerId
			this.key = options.key
			if (this.key == 'DesertedOrderEscape') {
				this.title = '逃单列表'
				this.type='1040-20'
			} else {
				this.title = '飞单列表'
				this.type='1040-10'
			}
			this.getCustomerFlyOrEvasionList()
		},
		methods: {
			//查看
			getCustomerFlyOrEvasionList() {
				this.$post({
					url: this.api.CustomInfo.getCustomerFlyOrEvasionList,
					data: {
						customerId: this.customerId,
						type:this.type
					}
				}).then(res => {
					this.list = res
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
	.center {
		padding-top: 20rpx;
		.list-y{
			margin-bottom: 20rpx;
			padding: 32rpx 30rpx 0 30rpx;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			background-color: #FFFFFF;
			image{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 20rpx;
				flex-shrink: 0;
			}
			.list-y-content{
				width: 100%;
				.list-y-content-t{
					width: 100%;
					border-bottom: 2rpx solid #F0F0F0;
					padding-bottom: 26rpx;
					.name{
						color: #333333;
						font-size: 32rpx;
						font-weight: 800;
						margin-bottom: 10rpx;
					}
					.remark{
						font-size: 30rpx;
						color: #666666;
					}
				}
				.list-y-content-b{
					height: 72rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 24rpx;
					color: #999999;
				}
			}
		}
	}
</style>
