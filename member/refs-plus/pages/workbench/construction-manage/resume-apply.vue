<template>
	<view class="resume-apply">
		<u-navbar :title-bold="true" title="复工申请" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
		</u-navbar>
		<view class="center">
			<view class="add-input">
				<view class="add-input-l">复工时间</view>
				<view class="add-input-r"  @click="timeShow = true">
					<input type="text" placeholder="请选择复工时间" v-model="info.actualStartDate" :disabled="true" placeholder-style="font-size: 32rpx;color:#D0D0D0">
					<image src="/static/image/mine/right.png"></image>
				</view>
			</view>
		</view>
		<view class="" style="background-color: #fff;padding-bottom: 32rpx;">
			<view class="remark-title">复工备注</view>
			<view class="unqualified-del-s">
				<view class="content">
					<image src="/static/image/tab-bar/write.png" class="writeIcon" v-if="!info.remark.length"></image>
					<textarea maxlength="200" v-model="info.remark" placeholder="请输入复工备注" placeholder-style="margin-left: 40rpx"/>
					<view class="count">
						<text class="count-r">{{ info.remark.length }}</text>
						<text class="count-g">/200</text>
					</view>
					<u-upload ref="uUpload" width="196rpx" height="196rpx" :action="action"
						:formData="{attachType: '1009-20'}" :header="header" name="files" :auto-upload="false"
						max-count="6" :custom-btn="true" @on-uploaded="onUpload">
						<view slot="addBtn">
							<image src="/static/image/mine/account/add.png"
								style="width: 196rpx;height: 196rpx;margin: 0;">
							</image>
						</view>
					</u-upload>
				</view>
			</view>
		</view>
		<u-picker mode="time" v-model="timeShow" :params="params" @confirm="selectTime" start-year="2022"></u-picker>
    <view class="footer-page">
			<view class="primary" @click="handleSubmit">提交</view>
		</view>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				action: '',
				header: { 'X-Auth-Token': '' },
				params: {
					year: true,
					month: true,
					day: true,
				},
				info: {
					actualStartDate: '',
					remark: ''
				},
				timeShow: false,
				constructionPlanId: '',
				parentId: ''
			}
		},
		onLoad(params= {}) {
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
			this.constructionPlanId = params.constructionPlanId
			this.parentId = params.parentId
		},
		methods: {
			selectTime(e){
				this.info.actualStartDate = e.year + '-' + e.month + '-' + e.day
			},
  		handleSubmit(){
        this.$refs.uUpload.upload()
      },
			onUpload(lists) {
				let files = []
				let attachIds = []
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				files.forEach(item => {
					attachIds.push(item.response.result[0].id)
				})
				this.save(attachIds)
			},
			save(attachIds){
				const data = {
					customerConstructionPlanId: this.constructionPlanId,
					parentId: this.parentId,
					status: '1010-10',
					attachIds,
					...this.info
				}
				const url = this.api.CustomerConstructionTaskInfo.createShutDownApply
				this.$post({ url, data }).then(res=> {
					this.$Toast('申请成功')
          setTimeout(() => { 
            uni.navigateBack()
          }, 1000)
				}).catch(e=> { console.log(e)})
			}
		}
	}
</script>

<style lang="scss">
page {
	background: #F8F8FB;
}
.resume-apply {
	padding-bottom: 140rpx;

	.center {
		padding: 0 30rpx 0 40rpx;
		margin-top: 20rpx;
		background: #fff;

		.add-input {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 112rpx;
			border-bottom: 2rpx solid #EEEEEE;

			.add-input-l {
				font-size: 32rpx;
				color: #333333;
				font-weight: bold;

				text {
					color: #B80201;
				}
			}

			.add-input-r {
				display: flex;
				align-items: center;

				image {
					width: 14rpx;
					height: 27rpx;
					margin-left: 16rpx;
				}

				input {
					color: #333333;
					font-size: 32rpx;
					text-align: right;
				}
			}
		}
	}

	.remark-title {
		padding: 32rpx 30rpx 24rpx 40rpx;
		font-size: 32rpx;
		color: #333333;
		font-weight: bold;
	}

	.unqualified-del-s {
		background-color: #fff;
		padding: 0 30rpx;
	}

	.content {
		background-color: #F9F9F9;
		padding: 20rpx;
		border-radius: 8rpx;
		position: relative;

		.writeIcon {
			position: absolute;
			width: 28rpx;
			height: 25rpx;
			top: 32rpx;
			left: 24rpx;
			z-index: 3;
		}

		textarea {
			height: 226rpx;
			width: 100%;
		}

		.count {
			text-align: right;
			font-size: 20rpx;
			margin-bottom: 40rpx;

			.count-r {
				color: #F43D1B;
			}

			.count-g {
				color: #B2B2B2;
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
