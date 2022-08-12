<template>
	<view class="acceptance-questionnaire">
		<u-navbar :title-bold="true" title="问卷调查" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
			<view class="slot-wrap" slot="right">
				<view class="" style="font-size: 28rpx;color: #B80201;padding-right: 30rpx;" @click="toRectification">
					不合格整改
				</view>
			</view>
		</u-navbar>
		<view class="acceptance-questionnaire-y" v-for="(val,index) in qList" :key="index">
			<view class="acceptance-questionnaire-y-title">
				<text>{{index+1}} {{val.questionTitle}}</text>
				<view class="" @click="toImgs(val.attachInfos)" v-if="val.attachInfos.length">
					<image src="/static/image/workbench/construction-manage/image-upload.png" mode=""></image>
					<text>{{val.attachInfos.length}}</text>
				</view>
			</view>
			<view class="acceptance-questionnaire-y-input">
				<input type="text" placeholder="暂无" v-model="val.questionContent" :disabled="true">
			</view>
			<view class="acceptance-questionnaire-y-select">
				<view class="acceptance-questionnaire-y-select-y" v-for="(val2,index2) in val.surveyOptionsInfoVOS"
					:key="index2">
					<image src="/static/image/workbench/renovation-data/select.png" mode=""
						v-if="val2.id==val.surveyOptionsVOList[0].surveyOptionId">
					</image>
					<view class="no-select" v-else>

					</view>
					<text
						:class="val2.id==val.surveyOptionsVOList[0].surveyOptionId ? 'text-select':''">{{val2.content}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				qList: {},
				unqualifiedInfoVOS: []
			}
		},
		onLoad(options) {
			this.qList = JSON.parse(options.qList).surveyQuestionVOList
			this.qList.forEach(item => {
				console.log(item)
				if (item.score==0) {
					this.unqualifiedInfoVOS.push(item)
				}
			})
		},
		methods: {
			toRectification() {
				uni.navigateTo({
					url: 'rectification-send?data=' + JSON.stringify(this.unqualifiedInfoVOS) + '&Inspection=true'
				})
			},
			//
			toImgs(val) {
				uni.navigateTo({
					url: 'questionnaire-pictures?imgs=' + JSON.stringify(val)
				})
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
	.acceptance-questionnaire {
		padding-bottom: 116rpx;
	}

	.btns {
		width: 100%;
		height: 96rpx;
		background-color: #fff;
		position: fixed;
		z-index: 99;
		bottom: 0;
		left: 0;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		text {
			display: inline-block;
			width: 168rpx;
			height: 72rpx;
			line-height: 72rpx;
			text-align: center;
			font-size: 28rpx;
			margin-left: 20rpx;
			border-radius: 44rpx;
		}

		.btns-unqualified {
			border: 2rpx solid #C0C0C0;
			color: #333333;
		}

		.btns-check {
			background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
			color: #FFFFFF;
		}
	}

	.acceptance-questionnaire-y {
		padding: 24rpx 30rpx;
		background-color: #fff;
		margin-top: 20rpx;

		.acceptance-questionnaire-y-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 24rpx;
			border-bottom: 2rpx solid #F6F6F6;

			text {
				color: #333333;
				font-size: 30rpx;
				font-weight: bold;
			}

			image {
				width: 30rpx;
				height: 30rpx;
			}

			view {
				text {
					color: #FC7032;
					font-weight: 400;
					margin-left: 10rpx;
				}
			}
		}

		.acceptance-questionnaire-y-input {
			margin: 24rpx;
			font-size: 30rpx;
			color: #666666;
		}

		.acceptance-questionnaire-y-select {
			display: flex;
			align-items: center;
			justify-content: flex-end;

			.acceptance-questionnaire-y-select-y {
				display: flex;
				align-items: center;
				margin-left: 50rpx;

				image {
					width: 32rpx;
					height: 32rpx;
				}

				view {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					border: 2rpx solid #999999;
				}

				text {
					font-size: 28rpx;
					color: #999999;
					margin-left: 10rpx;
				}

				.text-select {
					color: #333333;
				}
			}
		}
	}
</style>
