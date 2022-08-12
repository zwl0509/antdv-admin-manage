<template>
	<view class="patrol-fine">
		<u-navbar title="巡检罚款" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333'>
			<view class="slot-wrap" slot="right">
				<view class="" style="font-size: 28rpx;color: #B80201;padding-right: 30rpx;" @click="">
					提交
				</view>
			</view>
		</u-navbar>
		<view class="center">
			<view class="userinfo">
				<image src="/static/image/workbench/worker-test/tx.png" mode="" class="userinfo-tx"></image>
				<view class="userinfo-info">
					<view class="userinfo-info-y">
						<text>张文国</text>
						<text style="color: #B80201;font-size: 26rpx;font-weight: 400;" @click="toFineList">罚款记录</text>
					</view>
					<view class="userinfo-info-e">
						<image src="/static/image/workbench/product-dispatch/address.png" mode=""></image>
						<text>苏州 吴中区XXX小区18幢105室</text>
					</view>
				</view>
			</view>
			<view class="center-input">
				<text>项目经理</text>
				<text>张文国</text>
			</view>
			<view class="center-input">
				<text>项目经理</text>
				<input type="text" placeholder="请输入处罚金额">
			</view>
			<view class="center-input" style="margin-bottom: 20rpx;">
				<text>图片</text>
			</view>
			<view class="" style='background-color: #F9F9F9;padding: 20rpx;border-radius: 8rpx;position: relative;'>
				<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon" v-if="!remark.length">
				</image>
				<textarea style="height: 226rpx;width: 100%;" maxlength="200" v-model="remark"
					placeholder="     请输入申请原因" />
				<view class="" style='text-align: right;font-size: 20rpx;margin-bottom: 40rpx;'>
					<text style='color: #F43D1B;'>{{remark.length}}</text><text style='color: #B2B2B2;'>/200</text>
				</view>
				<u-upload ref="uUpload" width="196rpx" height="196rpx" :action="action"
					:formData="{attachType: '1009-20'}" :header="header" name="files" :auto-upload="false" max-count="3"
					:custom-btn="true" @on-uploaded="onUpload">
					<view slot="addBtn">
						<image src="/static/image/mine/account/add.png"
							style="width: 196rpx; height: 196rpx;margin: 0;">
						</image>
					</view>
				</u-upload>
			</view>
		</view>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				remark: '',
				action: '',
				header: {
					'X-Auth-Token': ''
				},
			}
		},
		onLoad() {
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
		},
		methods: {
			toFineList() {
				uni.navigateTo({
					url: 'fine-list'
				})
			},
			onUpload(lists, name) {
				let files = []
				let attaches = []
				// console.log(lists)
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				files.forEach(item => {
					attaches.push(item.response.result[0].id)
				})
			},
		}
	}
</script>
<style>
	page {
		background-color: #F6F6F6;
	}
</style>
<style scoped lang="less">
	.patrol-fine {
		.writeIcon {
			position: absolute;
			width: 28rpx;
			height: 25rpx;
			top: 32rpx;
			left: 24rpx;
			z-index: 99;
		}

		.center {
			background-color: #fff;
			margin-top: 20rpx;
			padding: 30rpx;

			.userinfo {
				display: flex;
				align-items: center;
				padding-bottom: 30rpx;
				border-bottom: 2rpx solid #F6F6F6;

				.userinfo-tx {
					width: 100rpx;
					height: 100rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
				}

				.userinfo-info {
					width: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.userinfo-info-y {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 10rpx;
						font-size: 30rpx;
						color: #333333;
						font-weight: bold;
					}

					.userinfo-info-e {
						display: flex;
						align-items: center;

						image {
							width: 18rpx;
							height: 24rpx;
							margin-right: 12rpx;
						}

						text {
							font-size: 26rpx;
							color: #999999;
						}
					}
				}
			}

			.center-input {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 24rpx;

				text {
					font-size: 26rpx;
					color: #333333;
				}

				input {
					font-size: 26rpx;
					color: #333333;
					text-align: right;
				}
			}
		}
	}
</style>
