<template>
	<view class="patrol-list">
		<u-navbar title="巡检列表" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333'>
			<view class="slot-wrap" slot="right" v-if="!inspectionId">
				<view class="" style="font-size: 28rpx;color: #B80201;padding-right: 30rpx;" @click="submit">
					提交
				</view>
			</view>
		</u-navbar>
		<view class="list-y" v-for="(val,index) in list" :key="index" @click="toQuestion(val,index)">
			<view class="list-y-l">
				<image src="/static/image/workbench/construction-manage/patrol.png" mode=""></image>
				<view class="list-y-l-info">
					<view class="name">
						{{inspectionId ? val.surveyTypeName : val.name}}
					</view>
					<!-- <view class="count">
						图片:0
					</view> -->
				</view>
			</view>
			<view class="list-y-r">
				<!-- <text>已检</text> -->
				<image src="/static/image/mine/right.png" mode=""></image>
			</view>
		</view>
<!-- 		<view class="btn" @click="toFine" v-if="inspectionId">
			<text :style="{ opacity: false ? '1':'0.4'}">罚款</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				submitData: {
					customerId: '',
					surveyInfoDTOS: [],
					type: '1082-20',
				},
				inspectionId: '',
			}
		},
		onLoad(options) {
			if (options.customerId) {
				this.submitData.customerId = options.customerId
				this.getTypeList('1078')
			}
			if (options.id) {
				this.inspectionId = options.id
				this.getStandardInspectionInfo()
			}
		},
		methods: {
			//查询标准巡检记录问卷列表 
			getStandardInspectionInfo() {
				this.$get({
					url: this.api.CustomerInspectionRecordInfo.getStandardInspectionInfo,
					data: {
						inspectionId: this.inspectionId
					}
				}).then(res => {
					this.list = res
				})
			},
			submit() {
				let data = this.submitData
				this.$post({
					url: this.api.CustomerInspectionRecordInfo.editStandard,
					data
				}).then(res => {
					this.$Toast('上传成功')
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			toFine() {
				uni.navigateTo({
					url: 'patrol-fine'
				})
			},
			//获取code列表
			getTypeList(type) {
				this.list = []
				this.$get({
					url: this.api.System.getList,
					data: {
						type: type
					}
				}).then(res => {
					res.rows.forEach(item => {
						if (item.value == '1078-50' || item.value == '1078-60' || item.value ==
							'1078-70' || item.value == '1078-80') {
							this.list.push(item)
						}
					})
				})
			},
			toQuestion(val, index) {
				if (this.inspectionId) {
					uni.navigateTo({
						url: '/pages/workbench/construction-manage/patrol-questionnaire-detail?qList=' + JSON
							.stringify(val.customerSurveyInfo)
					})
				} else {
					let data = {
						surveyInfoId: '',
						surveyQuestionDTOList: []
					}
					if (!this.submitData.surveyInfoDTOS[index]) {
						this.submitData.surveyInfoDTOS[index] = data
					}
					uni.navigateTo({
						url: 'patrol-questionnaire?type=' + val.value + '&index=' + index
					})
				}

			}
		}
	}
</script>

<style>
	page {
		background-color: #F6F6F6;
	}
</style>
<style scoped lang="less">
	.patrol-list {
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

		.list-y {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #FFFFFF;
			padding: 0 30rpx;
			height: 160rpx;

			.list-y-l {
				display: flex;
				align-items: center;

				image {
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
				}

				.list-y-l-info {
					.name {
						color: #333333;
						font-size: 32rpx;
						font-weight: bold;
					}

					.count {
						color: #999999;
						font-size: 30rpx;
						margin-top: 10rpx;
					}
				}
			}

			.list-y-r {
				display: flex;
				align-items: center;

				text {
					color: #4686FD;
					font-size: 28rpx;
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
