<template>
	<view class="detail" style="padding-bottom: 150rpx;">
		<u-navbar title="工人详情" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
		</u-navbar>
		<view class="detail-y" v-for="(val,index) in detail" :key="index">
			<view class="detail-title" @click="val.pickUp=!val.pickUp">
				<text>{{val.typeName}}</text>
				<image src="/static/image/workbench/worker-test/down.png" mode="" v-if="!val.pickUp"></image>
				<image src="/static/image/workbench/worker-test/up.png" mode="" v-else></image>
			</view>
			<view class="detail-content" v-if="val.pickUp">
				<view class="detail-content-y" @click="todetail(item)" v-for="(item,index2) in val.workerInfos" :key="index2">
					<view class="info">
						<image src="/static/image/workbench/worker-test/tx.png" mode=""></image>
						<text>{{item.workerName}}</text>
					</view>
					<text class="status-r" v-if="item.status=='1084-10'">未验证</text>
					<text class="status-g" v-else>已验证</text>
				</view>
			</view>
		</view>
		<view class="btn2" @click="tosearch">
			工人查询
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				pickUp:false,
				isTest:true,
				detail:''
			}
		},
		onLoad(options) {
			this.customerId=options.customerId
		},
		onShow(){
			this.getAppCustomerDispatchInfo()
		},
		methods:{
			getAppCustomerDispatchInfo(){
				this.$get({
					url: this.api.CustomerWorkerDispatchInfo.getAppCustomerDispatchInfo,
					data: {
						customerId: this.customerId
					}
				}).then(res => {
					res.forEach(item=>{
						item.pickUp=false
					})
					this.detail=res
				})
			},
			tosearch(){
				uni.navigateTo({
					url: 'worker-search?customerId='+this.customerId
				})
			},
			todetail(item){
				uni.navigateTo({
					url: 'detail?detail='+JSON.stringify(item)
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
	.btn2 {
		width: 600rpx;
		height: 88rpx;
		background: #B80201;
		border-radius: 48rpx;
		margin: auto;
		line-height: 88rpx;
		text-align: center;
		font-size: 34rpx;
		color: #FFFFFF;
		position: fixed;
		left: 0;
		right: 0;
		margin: auto;
		bottom: 48rpx;
	}
	.detail-y{
		margin-top: 20rpx;
		background-color: #fff;
		padding: 0 30rpx;
		.detail-title{
			height: 112rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #F0F0F0;
			text{
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
			}
			image{
				width: 26rpx;
				height: 14rpx;
			}
		}
		.detail-content{
			.detail-content-y{
				height: 140rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2rpx solid #F0F0F0;
				.info{
					display: flex;
					align-items: center;
					image{
						width: 100rpx;
						height: 100rpx;
						margin-right: 16rpx;
					}
					text{
						display: inline-block;
						width: 400rpx;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						font-size: 28rpx;
						color: #333333;
					}
				}
				.status-r{
					color: #B80201;
					font-size: 28rpx;
				}
				.status-g{
					color: #0AB4B3;
					font-size: 28rpx;
				}
			}
		}
	}
</style>