<template>
	<view class="detail">
		<u-navbar title="跟进详情" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
		</u-navbar>
		<view class="" style="height: 88rpx;">

		</view>
		<view class="userinfo">
			<view class="info">
				<image src="/static/image/mine/avatar-mis.png" mode=""></image>
				<text>{{customInfo.infoShow ? customInfo.customerName : customInfo.customerNameHide}}</text>
			</view>
		</view>
		<view class="list-y">
			<view class="list-y-top">
				<view class="list-y-top-userinfo">
					<image src="/static/image/mine/avatar-mis.png" mode=""></image>
					<view class="userinfo-text">
						<view class="name">
							{{detail.employeeName}}
						</view>
						<view class="identity">
							{{detail.trackerPosition}}
						</view>
					</view>
				</view>
				<view :class="detail.status!='1054-10' ? 'list-y-top-status-b' : 'list-y-top-status-a'">
					{{detail.statusName ? detail.statusName:'暂无'}}
				</view>
			</view>
			<view class="list-y-center">
				{{detail.remark ? detail.remark : '暂无'}}
			</view>
			<view class="list-y-bottom">
				<view class="list-y-bottom-time">
					<!-- <text style="margin-right: 16rpx;">{{detail.timestatus}}</text> -->
					<text>{{detail.createdTime ? detail.createdTime : '暂无'}}</text>
				</view>
				<view class="type">
					{{detail.trackTypeName ? detail.trackTypeName :'暂无'}}
				</view>
			</view>
		</view>
		<view class="amount">
<!-- 			<view class="">
				<text>跟踪定位</text>
				<text style="display: inline-block;width: 480rpx;text-align: right;">{{detail.locationAddress ? detail.locationAddress:'暂无'}}</text>
			</view> -->
<!-- 			<view class="">
				<text>下一阶段</text>
				<text style="display: inline-block;width: 480rpx;text-align: right;">{{detail.stageName ? detail.stageName:'暂无'}}</text>
			</view> -->
			<view class="">	
				<text>客户状态</text>
				<text style="display: inline-block;width: 480rpx;text-align: right;">{{detail.stageName ? detail.stageName :'暂无'}}</text>
			</view>
			<view class="">
				<text>提醒人</text>
				<text style="display: inline-block;width: 480rpx;text-align: right;">{{detail.reminderNames ? detail.reminderNames:'暂无'}}</text>
			</view>
			<!-- <view class="">
				<text>预计装修时间</text>
				<text>2021-10-08</text>
			</view> -->
		</view>
		<view class="huxing" v-if="detail.attachInfos">
			<view class="title">
				记录图片
			</view>
			<view class="imgs">
				<image :src="val.path" mode="aspectFit" v-for="(val,index) in detail.attachInfos" :key="index" @click="previewImage(val.path)"></image>
			</view>
			<view class="" v-if="!detail.attachInfos.length">
				暂无数据
			</view>
		</view>
		<!-- 		<view class="bottom-select" @click="tomaterial">
			<view class="bottom-select-l">
				选材清单
			</view>
			<view class="bottom-select-r">
				<text>查看全部</text>
				<image src="/static/image/mine/right.png" mode=""></image>
			</view>
		</view>
		<view class="" style="height: 99rpx;width: 100%;">

		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customInfo: uni.getStorageSync('customInfo'),
				detail: {},
				id: '',
				imgs:[]
			}
		},
		onLoad(options) {
			if (options.id) {
				this.getdetail(options.id)
			}
		},
		methods: {
			previewImage(e) {
				uni.previewImage({
					current: e,
					urls: this.imgs //一个数组，可以查看多张图
				});
			},
			tomaterial() {
				uni.navigateTo({
					url: 'file'
				})
			},
			getdetail(id) {
				this.$get({
					url: this.api.CustomInfo.getTrackingListDetail,
					data: {
						id: id
					}
				}).then(res => {
					this.detail = res
					res.attachInfos.forEach(item=>{
						this.imgs.push(item.path)
					})
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
	.detail {
		.userinfo {
			background-color: #FFFFFF;
			padding: 10rpx 0 12rpx 0;
			margin-bottom: 20rpx;
			position: fixed;
			top: calc(66rpx + var(--status-bar-height));
			left: 0rpx;
			width: 100%;
			z-index: 999;
			border-bottom: 1rpx solid #F8F8FB;

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

		.list-y {
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			padding: 24rpx 30rpx 20rpx 30rpx;

			.list-y-top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 22rpx;

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

		.amount {
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			padding: 24rpx 30rpx;
			// height: 304rpx;
			// display: flex;
			// flex-direction: column;
			// justify-content: space-evenly;

			view {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 24rpx;
				&:last-child{
					margin-bottom: 0;
				}
				text {
					color: #333333;
					font-size: 28rpx;

					&:first-child {
						color: #666666;
					}
				}
			}
		}

		.huxing {
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			padding: 30rpx;

			.title {
				margin-bottom: 24rpx;
				font-size: 32rpx;
				color: #333333;
				font-weight: bold;
			}

			image {
				width: 222rpx;
				height: 222rpx;
				margin-right: 12rpx;
				margin-bottom: 20rpx;
			}

			.imgs {
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				image {
					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}

		.bottom-select {
			width: 100%;
			height: 99rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			background-color: #FFFFFF;
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;

			.bottom-select-l {
				font-size: 32rpx;
				color: #333333;
				font-weight: bold;
			}

			.bottom-select-r {
				display: flex;
				align-items: center;

				text {
					font-size: 32rpx;
					color: #999999;
					font-weight: 400;
				}

				image {
					width: 14rpx;
					height: 27rpx;
					margin-left: 16rpx;
				}
			}
		}
	}
</style>
