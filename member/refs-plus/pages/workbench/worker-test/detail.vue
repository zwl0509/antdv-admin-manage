<template>
	<view class="worker-search">
		<u-navbar :border='false' title="工人信息" back-icon-color="#ffffff" title-color="#ffffff" :background="navbar_bg"
			class="navbar fl-cc" :border-bottom="false">
		</u-navbar>
		<image src="/static/image/workbench/worker-test/detail-bg.png" mode="" class="bg"></image>
		<view class="detail">
			<view class="detail-img">
				<view class="detail-img-center">
					<image src="/static/image/workbench/worker-test/tx2.png" mode="" class="tx" v-if="!detail.workerPicture.length"></image>
					<image :src="detail.workerPicture[0].path" mode="" class="tx" v-else @click="previewImage(detail.workerPicture,0)"></image>
					<text>工人图片</text>
				</view>
				<view class="detail-img-center">
					<image :src="path" mode="" class="tx" v-if="path!=''" @click="chooseImage(detail.attachInfos,0)">
					</image>
					<image src="/static/image/workbench/worker-test/add.png" mode="" class="tx" v-else
						@click="chooseImage">
					</image>
					<text>验证图片</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/worker-type.png" mode=""></image>
				<view class="detail-y-info">
					<text>工种</text>
					<text>{{detail.typeName}}</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/worker.png" mode=""></image>
				<view class="detail-y-info">
					<text>工人</text>
					<text>{{detail.workerName}}</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/worker-phone.png" mode=""></image>
				<view class="detail-y-info">
					<text>联系电话</text>
					<text>{{detail.telPhone}}</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/number.png" mode=""></image>
				<view class="detail-y-info">
					<text>身份证号</text>
					<text>{{detail.idCard}}</text>
				</view>
			</view>
			<view class="detail-y">
				<image src="/static/image/workbench/worker-test/card.png" mode=""></image>
				<view class="detail-y-info">
					<text>银行卡号</text>
					<text>{{detail.bankAccount}}</text>
				</view>
			</view>
		</view>
		<view class="btn2" @click="verification" v-if="detail.status=='1084-10'">
			验证
		</view>
	</view>
</template>

<script>
	import {
		fileUpload
	} from '../../../common/service'
	export default {
		data() {
			return {
				navbar_bg: {
					background: 'none'
				},
				detail: {},
				preImagePath: '',
				path: '',
				attachIds: []
			}
		},
		onLoad(options) {
			this.detail = JSON.parse(options.detail)
			if (JSON.parse(options.detail).attachInfos.length) {
				this.path = JSON.parse(options.detail).attachInfos[0].path
			}
			console.log(this.detail)
		},
		methods: {
			previewImage(e, index) {
				let urls = []
				console.log(e)
				e.forEach(item => {
					urls.push(item.path)
				})
				uni.previewImage({
					current: urls[index],
					urls: urls //一个数组，可以查看多张图
				});
			},
			chooseImage(e,index) {
				if (this.detail.status != '1084-10') {
					this.previewImage(e,index)
					return
				}
				uni.chooseImage({
					count: 1,
					success: res => {
						this.preImagePath = res.tempFilePaths[0]
						this.handleUploadAvatar()
					},
					fail: err => {}
				})
			},
			// 图片上传
			handleUploadAvatar() {
				let that = this
				this.$Loading('正在上传头像')
				fileUpload({
						filePathList: [this.preImagePath],
						formData: {
							attachType: '1009-40'
						},
						name: 'file',
						url: '/common/attachment/uploadSingleFile'
					})
					.then(res => {
						uni.hideLoading()
						that.path = res[0][0].requestUrl
						that.attachIds[0] = res[0][0].id
					}).catch(err => {

					})
			},
			verification() {
				this.$post({
					url: this.api.CustomerWorkerDispatchInfo.verify,
					data: {
						customerId: this.detail.customerId,
						isLeader: this.detail.isLeader,
						type: this.detail.type,
						attachIds: this.attachIds,
						id: this.detail.id
					}
				}).then(res => {
					this.$Toast("操作成功")
					uni.navigateBack({

					})
				})
			}
		}
	}
</script>

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

	.bg {
		width: 100%;
		height: calc(340rpx + 88rpx + var(--status-bar-height));
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		z-index: 9;
	}

	.detail {
		.detail-img {
			width: 100%;
			height: 340rpx;
			margin-bottom: 18rpx;
			padding: 0 108rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.detail-img-center {
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				height: 100%;
				position: relative;
				z-index: 10;

				.tx {
					width: 170rpx;
					height: 170rpx;
					border-radius: 50%;
					border: 9rpx solid #fff;
					margin-bottom: 20rpx;
					background: #fff;
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
