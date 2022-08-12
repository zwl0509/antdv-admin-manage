<template>
	<view class="history">
		<u-navbar title="历史回复记录" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333'>
		</u-navbar>
		<view class="customer-info">
			<view class="customer-info-user">
				<view class="userinfo">
					<image src="/static/image/workbench/customer-manage/tx.png" mode="" class="avatar"></image>
					<view class="userinfo-r">
						<view class="userinfo-r-t">
							<text>{{detail.customerName}}</text>
							<text>{{detail.mobileNumber}}</text>
						</view>
						<view class="userinfo-r-b">
							<image src="/static/image/workbench/product-dispatch/address.png" mode=""></image>
							<text>{{detail.finalAddress}}</text>
						</view>
					</view>
				</view>
				<view class="status" v-if="detail.dispatchInfos">
					{{detail.dispatchInfos[0].statusName}}
				</view>
			</view>
			<view class="customer-info-content">
				<view class="title">
					<view class="title-l">
						<image src="/static/image/workbench/customer-complaints/complaint.png" mode=""></image>
						<text>
							{{detail.recordSourceName}}
						</text>
					</view>
					<view class="title-r">
						{{detail.recordTime}}
					</view>
				</view>
				<view class="content" v-if="detail.dispatchInfos">
					{{openShow ? detail.dispatchInfos[0].question : getLength(detail.dispatchInfos[0].question)}}
					<view class="open" @click="openShow=true" v-if="!openShow">
						展开
					</view>
				</view>
				<view class="imgs" v-if="detail.dispatchInfos">
					<image src="../../../static/image/mine/mine-header.png" mode=""
						v-for="(img,index2) in detail.dispatchInfos[0].attachInfos" :key="index2"></image>
				</view>
			</view>
		</view>
		<view class="record">
			<view class="record-title">
				回复记录
			</view>
			<view class="record-content">
				<view class="record-content-y" v-for="n in 3">
					<view class="record-content-y-l">
						<image src="/static/image/mine/avatar-mis.png" mode="" class="tx"></image>
						<image src="/static/image/workbench/customer-complaints/new.png" mode="" class="new"></image>
						<view class="xian">
							
						</view>
					</view>
					<view class="record-content-y-r">
						<view class="record-content-y-r-name">
							GAI super
						</view>
						<view class="record-content-y-r-time">
							2022-05-18 10:30:29
						</view>
						<view class="record-content-y-r-remark">
							您好用户，关于您的投诉平台一直在与商家及项目相关负责人沟通，稍后平台核实后会立即给您合理处理问题，请您耐心等待，此次给您造成不便，非常抱歉。
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				detail:{},
				openShow:false,
				maxWords: 0,
			}
		},
		onLoad(options) {
			uni.getSystemInfo({
				success: (res) => {
					// 可使用窗口高度，将px转换rpx
					this.phoneWidth = (res.windowWidth * (750 / res.windowWidth))
					this.maxWords = this.phoneWidth / 28 * 2 - 5
					// console.log(this.maxWords, this.phoneWidth)
				}
			})
			this.detail=JSON.parse(options.detail)
		},
		methods:{
			//获取展开前字符
			getLength(string = '') {
				if (!string || string.length < this.maxWords) {
					this.openShow = true
					return
				}
				let length = 0
				string = string.toString().split('')
				// const reg = /0xE001,0xE05A]|[0xE101,0xE15A]|[0xE201,0xE253]|[0xE301,0xE34D]|[0xE401,0xE44C]|[0xE501,0xE537]/
				for (const str of string) {
					length += /[\u4e00-\u9fa5]/.test(str) ? 2 : 1
				}
				let a = string.slice(0, this.maxWords)
				let b = ''
				a.forEach(item => {
					b = b + item
				})
				return b + '...'
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
	.record{
		background-color: #fff;
		margin-top: 20rpx;
		.record-title{
			padding: 32rpx 54rpx 20rpx 54rpx;
			border-bottom: 2rpx solid #F0F0F0;
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
		}
		.record-content{
			padding: 38rpx 30rpx 38rpx 44rpx;
			.record-content-y{
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				position: relative;
				&:last-child{
					.xian{
						display: none !important;
					}
				}
				.record-content-y-l{
					display: flex;
					align-items: center;
					flex-direction: column;
					margin-right: 12rpx;
					flex-shrink: 0;
					.tx{
						width: 40rpx;
						height: 40rpx;
						flex-shrink: 0;
						position: relative;
						z-index: 3;
					}
					.new{
						width: 48rpx;
						flex-shrink: 0;
						position: relative;
						z-index: 3;
						height: 26rpx;
					}
					.xian{
						width: 0rpx;
						border: 1px dashed #D0D0D0;
						height: 100%;
						position: absolute;
						z-index: 2;
					}
				}
				.record-content-y-r{
					padding-bottom: 48rpx;
					.record-content-y-r-name{
						color: #333333;
						font-size: 28rpx;
					}
					.record-content-y-r-time{
						color: #999999;
						font-size: 22rpx;
						margin-top: 4rpx;
						margin-bottom: 20rpx;
					}
					.record-content-y-r-remark{
						font-size: 28rpx;
						color: #333333;
						line-height: 40rpx;
					}
				}
			}
		}
	}
	.customer-info {
		width: 100%;
		background-color: #FFFFFF;
		padding: 24rpx 30rpx 32rpx 24rpx;
		margin-top: 20rpx;
		.customer-info-user {
			width: 100%;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-bottom: 40rpx;
	
			.userinfo {
				display: flex;
				align-items: center;
	
				image {
					width: 76rpx;
					height: 76rpx;
					margin-right: 20rpx;
				}
	
				.userinfo-r {
					height: 76rpx;
					display: flex;
					flex-direction: column;
	
					.userinfo-r-t {
						color: #333333;
						font-size: 28rpx;
					}
	
					.userinfo-r-b {
						display: flex;
						align-items: center;
						font-size: 24rpx;
						color: #999999;
	
						image {
							width: 18rpx;
							height: 24rpx;
							margin-right: 12rpx;
						}
					}
				}
			}
	
			.status {
				font-size: 28rpx;
				color: #B80201;
	
			}
		}
	
		.customer-info-content {
			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 16rpx;
	
				.title-l {
					display: flex;
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
					align-items: center;
	
					image {
						width: 28rpx;
						height: 32rpx;
						margin-right: 12rpx;
					}
				}
	
				.title-r {
					color: #999999;
					font-size: 24rpx;
				}
			}
	
			.content {
				font-size: 28rpx;
				font-weight: 500;
				line-height: 40rpx;
				color: #333333;
				margin-bottom: 24rpx;
				position: relative;
	
				.open {
					position: absolute;
					bottom: 0rpx;
					right: 0rpx;
					color: #333333;
					font-size: 28rpx;
					font-weight: bold;
				}
			}
	
			.imgs {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
	
				image {
					height: 222rpx;
					width: 222rpx;
					margin-right: 12rpx;
					border-radius: 8rpx;
	
					&:nth-child(3n) {
						margin: 0;
					}
				}
			}
		}
	}
</style>
