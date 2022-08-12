<template>
	<view class="bill-detail">
		<u-navbar title="单据明细" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333' back-icon-color="#333333">
		</u-navbar>
		<view class="detail-y" v-for="(item, index) in materialList">
			<image src="/static/image/workbench/renovation-data/img.png"></image>
			<view class="detail-y-info">
				<view class="info-name">
					{{ item.materialName }}
				</view>
				<view class="info-message">
					{{item.materialType ? item.materialType+';':''}}
					{{item.materialUnit ? item.materialUnit+';':''}}
					{{item.materialColor ? item.materialColor:''}}
				</view>
				<view class="info-much">
<!--					<view class="info-price">-->
<!--						<text style="font-size: 22rpx;">¥</text>35-->
<!--					</view>-->
					<view class="info-count">
						x{{ item.applyNum }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				materialList: [],
			}
		},
		onLoad(options){
			this.id = options.customerId
			this.getDetail(this.id)
		},
		methods: {
			//获取文明材料
			getDetail(id){
				this.$get({
					url: this.api.civilizedDelivery.getDetail,
					data: {
						id
					}
				}).then(res => {
					const data = { ...res }
					this.materialList = data.materials
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
	.bill-detail {
		.detail-y {
			margin-top: 20rpx;
			background-color: #fff;
			padding: 0 30rpx;
			height: 202rpx;
			display: flex;
			align-items: center;

			image {
				width: 138rpx;
				height: 138rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.detail-y-info {
				width: 100%;

				.info-name {
					color: #333333;
					font-size: 28rpx;
					font-weight: bold;
					margin-bottom: 8rpx;
				}

				.info-message {
					color: #666666;
					font-size: 22rpx;
					height: 64rpx;
					overflow:hidden;
					text-overflow: ellipsis;//显示省略号
					display:-webkit-box;
					-webkit-line-clamp:2;//块元素显示的文本行数
					-webkit-box-orient:vertical;
				}

				.info-much {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.info-price {
						color: #B80201;
						font-size: 28rpx;
						font-weight: 800;
					}

					.info-count {
						color: #999999;
						font-size: 28rpx;
					}
				}
			}
		}
	}
</style>
