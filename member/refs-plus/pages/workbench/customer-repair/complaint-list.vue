<template>
	<view class="">
		<u-navbar :border='false' class="navbar fl-cc" :border-bottom="false">
			<view class="" style="padding-right: 30rpx;width: 100%;">
				<u-search v-model="commonParam" placeholder="请输入客户姓名或联系方式" @change="getList" :show-action="false">
				</u-search>
			</view>
		</u-navbar>
		<view class="tabs">
			<view :class="current==index ? 'tab' : 'tabs-r' " @click="change(index)"
				v-for="(val,index) in tabList" :key='index'>
				{{val.title}}
				<view class="tabs-bar" v-show="current==index">

				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" >
			<view class="list">
				<view class="list-y" v-for="(val,index) in list"  :key="index" @click="todetail(val)">
					<image src="/static/image/workbench/customer-manage/tx.png" mode="" class="avatar"></image>
					<view class="list-r">
						<view class="list-r-info">
							<view class="list-r-info-l">
								<view class="info-user">
									<text style="margin-right: 10rpx;">{{val.customerName}}</text>
									<!-- <text>188****8910</text> -->
								</view>
								<view class="info-address">
									<image src="/static/image/workbench/product-dispatch/address.png" mode=""></image>
									<text>{{val.finalAddress}}</text>
								</view>
							</view>
							<image src="/static/image/workbench/customer-manage/phone.png" mode="" class="phone"></image>
						</view>
						<view class="list-r-time">
							<view class="time">
								{{val.recordTime}}
							</view>
							<view class="from">
								<image src="/static/image/workbench/customer-complaints/complaint.png" mode=""></image>
								<text>{{val.recordSourceName}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view v-if="!list.length" style="padding-top:236rpx ;text-align: center;">
			<image src="../../../static/image/workbench/customer-manage/nodata.png"
				style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
			<view style='color: #999999;font-size: 32rpx;'>
				空空如也~
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [{
					title: '待处理',
					value:false
				}, {
					title: '已完成',
					value:true
				}],
				current: 0,
				barStyle: {
					background: 'linear-gradient(270deg, #FF8382 0%, #B80201 100%)'
				},
				isCompleted:false,
				commonParam:'',
				list:[]
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList(){
				this.$get({
					url:this.api.CustomerServiceInfo.getList,
					data:{
						type:'1071-20',
						commonParam:this.commonParam,
						isCompleted:this.isCompleted,
					}
				}).then(res=>{
					this.list=res.rows
				})
			},
			change(index) {
				this.current = index;
				this.isCompleted=this.tabList[index].value
				this.getList()
			},
			todetail(val){
				uni.navigateTo({
					url:'detail?csComplaintRecordId='+val.csComplaintRecordId+'&id='+val.id+'&role='+val.employeeRole
				})
			}
		}
	}
</script>
<style>
	page{
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.tabs {
		width: 100%;
		height: 112rpx;
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		justify-content: center;
		// margin-bottom: 20rpx;
		// position: fixed;
		// top:0;
		// left: 0rpx;
		// z-index: 999;
		border-bottom: 1rpx solid #F0F0F0;
	
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
	.list{
		max-height: calc( 100vh - 112rpx - 88rpx - var(--status-bar-height));
		.list-y{
			width: 100%;
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			padding: 56rpx 30rpx 0 30rpx;
			.avatar{
				flex-shrink: 0;
				width: 100rpx;
				height: 100rpx;
				margin-right: 24rpx;
			}
			.list-r{
				width: 100%;
				.list-r-info{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 34rpx;
					.phone{
						width: 44rpx;
						height: 44rpx;
					}
					.list-r-info-l{
						display: flex;
						flex-direction: column;
						.info-user{
							margin-bottom: 10rpx;
							color: #333333;
							font-size: 30rpx;
						}
						.info-address{
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: #999999;
							image{
								width: 18rpx;
								height: 24rpx;
								margin-right: 12rpx;
							}
						}
					}
				}
				.list-r-time{
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 72rpx;
					border-top: 1rpx solid #F0F0F0;
					.time{
						color: #333333;
						font-size: 24rpx;
					}
					.from{
						display: flex;
						align-items: center;
						color: #666666;
						font-size: 24rpx;
						image{
							width: 26rpx;
							height: 26rpx;
							margin-right: 8rpx;
						}
					}
				}
			}
		}
	}
</style>
