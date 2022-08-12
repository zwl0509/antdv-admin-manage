<template>
	<view class="add-daily">
		<u-navbar :title-bold="true" title="巡检查看" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
		</u-navbar>
		<view class="center">
			<view class="add-input">
				<text class="add-input-l">巡检日期</text>
				<text class="add-input-r">{{detail.inspectionTime}}</text>
			</view>
			<view class="add-input">
				<text class="add-input-l">巡检标题</text>
				<text class="add-input-r">{{detail.title}}</text>
			</view>
			<view class="add-input">
				<text class="add-input-l">巡检内容</text>
				<text class="add-input-r">{{detail.content}}</text>
			</view>
		</view>
		<view class="unqualified">
			<text class="title">不合格情况说明</text>
		</view>
		<view class="unqualified-content" v-for="(val,index) in detail.unqualifiedInfoVOS" :key="index">
			<view class="title">
				{{val.unqualifiedTypeName}}
			</view>
			<view class="content">
				描述：{{val.unqualifiedContent}}
			</view>
			<view class="imgs">
				<image :src="item.path" mode="" v-for="(item,index2) in val.attachInfos" :key="index2"></image>
			</view>
		</view>
		<view class="btn" @click="toRectification">
			<text>不合格整改</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				detail:{}
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDetail()
		},
		methods: {
			getDetail() {
				this.$get({
					url: this.api.CustomerInspectionRecordInfo.getDetail,
					data: {
						id:this.id
					}
				}).then(res => {
					this.detail=res
				})
			},
			toRectification(){
				uni.navigateTo({
					url:'rectification-send?data='+JSON.stringify(this.detail.unqualifiedInfoVOS)+'&Inspection=true'
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
	.add-daily {
		padding-bottom: 120rpx;

		.center {
			margin-top: 20rpx;
			background: #fff;
			padding: 24rpx 30rpx;

			.add-input {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 24rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.add-input-l {
					font-size: 28rpx;
					color: #666666;
				}

				.add-input-r {
					font-size: 28rpx;
					color: #333333;
				}

			}
		}

		.unqualified {
			padding: 32rpx 30rpx 30rpx 16rpx;
			color: #333333;
			font-size: 28rpx;
			font-weight: bold;
		}

		.unqualified-content {
			background-color: #fff;
			padding: 32rpx 30rpx;
			margin-bottom: 20rpx;

			.title {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 16rpx;
			}

			.content {
				margin-bottom: 30rpx;
				color: #333333;
				font-size: 28rpx;
				line-height: 40rpx;
			}

			.imgs {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				image {
					width: 222rpx;
					height: 222rpx;
					border-radius: 8rpx;
					margin-bottom: 10rpx;
					margin-right: 12rpx;
					&:nth-child(3n){
						margin-right: 0;
					}
				}
			}
		}

		.btn {
			width: 100%;
			height: 96rpx;
			position: fixed;
			z-index: 99;
			bottom: 20rpx;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 75rpx;

			text {
				display: inline-block;
				width: 100%;
				height: 88rpx;
				background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
				line-height: 88rpx;
				text-align: center;
				color: #FFFFFF;
				font-size: 32rpx;
				border-radius: 44rpx;
			}
		}
	}
</style>
