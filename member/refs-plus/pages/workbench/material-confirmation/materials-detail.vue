<template>
	<view class="materials-detail">
		<u-navbar title="材料明细" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333' back-icon-color="#333333">
		</u-navbar>
		<view class="detail-y" v-for="(item, index) in dataList" :key="index">
			<!-- <view class="detail-y-info">
				<image src="/static/image/workbench/renovation-data/img.png" mode=""></image>
				<view class="detail-y-info-text">
					<view class="detail-y-info-text-y">
						红蚂蚁标识牌插头
					</view>
					<view class="detail-y-info-text-e">
						<text>客厅</text>
					</view>
					<view class="detail-y-info-text-s">
						¥<text>35</text>/㎡
					</view>
				</view>
			</view> -->
			<view class="detail-y-detailed">
				<view><text>名称</text><text>{{ item.MaterialName }}</text></view>
				<view><text>规格</text><text>{{ item.Spec }}</text></view>
				<view><text>数量</text><text>{{ item.SaleNum }}</text></view>
				<view><text>型号</text><text>{{ item.MaterialType }}</text></view>
				<view><text>颜色</text><text>{{ item.Color }}</text></view>
				<view><text>材质</text><text>{{ item.Texture }}</text></view>
				<view><text>品牌</text><text>{{ item.Brand }}</text></view>
				<view><text>类别</text><text>{{ item.TypeSeial }}</text></view>
				<view><text>备注</text><text>{{ item.Remark }}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataList: []
		}
	},
	onLoad(params = {}) {
		this.getDetail(params.id)
	},
	methods: {
		getDetail(id) {
			this.$get({
				url: this.api.MaterialConfirmInfo.getBillMasterDetail,
				data: { billMasterId: id }
			}).then((res) => {
				const list = [ ... res ]
				this.dataList = list  
			}).catch((err) => { console.log(e) })
		}
	},
}
</script>

<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.materials-detail {
		.detail-y {
			margin-top: 20rpx;
			background-color: #fff;
			padding: 32rpx 30rpx;

			.detail-y-info {
				display: flex;
				align-items: center;
				padding-bottom: 41rpx;
				border-bottom: 2rpx solid #EEEEEE;

				image {
					width: 138rpx;
					height: 138rpx;
					margin-right: 20rpx;
				}

				.detail-y-info-text {
					.detail-y-info-text-y {
						color: #333333;
						font-size: 32rpx;
						font-weight: bold;
						margin-bottom: 12rpx;
					}

					.detail-y-info-text-e {
						display: flex;
						align-items: center;
						margin-bottom: 16rpx;

						text {
							display: inline-block;
							height: 36rpx;
							padding: 0 8rpx;
							line-height: 36rpx;
							border-radius: 4rpx;
							border: 2rpx solid #C0C0C0;
							margin-right: 12rpx;
						}
					}

					.detail-y-info-text-s {
						color: #B80201;
						font-size: 22rpx;

						text {
							font-size: 32rpx;
							font-weight: bold;
						}
					}
				}
			}

			.detail-y-detailed {
				view {
					margin-bottom: 20rpx;

					text {
						font-size: 28rpx;
						color: #999999;

						&:last-child {
							color: #333333;
							margin-left: 40rpx;
							font-size: 26rpx;
						}
					}
				}
			}
		}
	}
</style>
