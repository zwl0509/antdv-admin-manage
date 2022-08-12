<template>
	<view class="acceptance-questionnaire">
		<u-navbar :title-bold="true" title="验收问卷" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
		</u-navbar>
		<view class="acceptance-questionnaire-y" v-for="(val,index) in qList" :key="index">
			<view class="acceptance-questionnaire-y-title">
				<text>{{index+1}} {{val.questionTitle}}</text>
				<view class="" @click="toImgs(index)" v-if="val.isPhoto">
					<image src="/static/image/workbench/construction-manage/image-upload.png" mode=""></image>
					<text
						v-if="surveyQuestionDTOList[index].attachIds">{{surveyQuestionDTOList[index].attachIds.length}}</text>
					<text v-else>0</text>
				</view>
			</view>
			<view class="acceptance-questionnaire-y-input">
				<input type="text" placeholder="请输入描述内容:" v-model="val.question_content"
					@input="setRemark(val.question_content,index)">
			</view>
			<view class="acceptance-questionnaire-y-select">
				<view class="acceptance-questionnaire-y-select-y" @click="selectOne(val2,index)"
					v-for="(val2,index2) in val.surveyOptionsInfoVOS" :key="index2">
					<image src="/static/image/workbench/renovation-data/select.png" mode="" v-if="val.select==val2.id">
					</image>
					<view class="no-select" v-else>

					</view>
					<text :class="val.select==val2.id ? 'text-select':''">{{val2.content}}</text>
				</view>
			</view>
		</view>
		<u-modal v-model="showModel" :title-style='titleStyle' :confirm-style='confirmStyle' :cancel-style='camcelStyle'
			:content-style="contentStyle" :show-cancel-button="true" :noContent="true" @confirm="submit()"
			@setTime="setTime">
		</u-modal>
		<view class="btns">
			<text class="btns-unqualified" @click="setStatus('1091-20')" v-if="isFail">验收不通过</text>
			<text class="btns-check" @click="setStatus('1091-10')" v-if="isAdopt">验收通过</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				select: false,
				id: '',
				qList: {},
				surveyQuestionDTOList: [],
				surveyInfoId: '',
				customerId: '',
				showModel: false,
				checkDate: this.dateFormat(new Date().toISOString()),
				titleStyle: {
					fontSize: '26rpx',
					color: '#333333',
					fontWeight: 'bold'
				},
				contentStyle: {
					color: '#333333',
					fontSize: '32rpx'
				},
				camcelStyle: {
					background: '#F5F5F5',
					color: "#333333",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 31rpx 40rpx 40rpx'
				},
				confirmStyle: {
					background: 'linear-gradient(90deg, #E40000 0%, #B80201 100%)',
					color: "#FFFFFF",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 40rpx 40rpx 31rpx'
				},
				customerConstructionTaskId: '',
				ids: [],
				isAdopt: false,
				isFail: false,
			}
		},
		onLoad(options) {
			if (options.ids) {
				this.ids = JSON.parse(options.ids)
				this.getQuestionByIds()
			}
			if (options.id) {
				this.id = options.id
				this.getQuestionList()
			}
			this.getJurisdiction()
			this.customerId = options.customerId
			if (options.customerConstructionTaskId) {
				this.customerConstructionTaskId = options.customerConstructionTaskId
			}

		},
		methods: {
			//获取按钮权限
			getJurisdiction() {
				let targetIds = []
				this.listBtns = []
				this.singleBtns = []
				targetIds.push(this.vuex_user.id)
				this.vuex_user.roles.forEach(item => {
					targetIds.push(item.id)
				})
				this.$post({
					url: this.api.AuthUser.getAuthActionByTargetIds,
					data: {
						backstage: 0,
						sitemapId: uni.getStorageSync('sitemapId'),
						targetIds: targetIds
					}
				}).then(res => {
					res.forEach(item => {
						if (item.key.indexOf('Adopt') != -1) {
							this.isAdopt = true
						}
						if (item.key.indexOf('Fail') != -1) {
							this.isFail = true
						}
					})
				})
			},
			//
			toImgs(index) {
				uni.navigateTo({
					url: 'questionnaire-pictures?index=' + index
				})
			},
			//二次验证列表
			getQuestionByIds() {
				this.$post({
					url: this.api.CustomerSurveyInfo.getQuestionByIds,
					data: this.ids
				}).then(res => {
					res.forEach(item => {
						this.surveyInfoId = item.surveyInfoId
						let a = {
							surveyOptionsDTOList: [{}],
							attachIds: [],
							surveyQuestionId: '',
							sequence: '',
							question_content: ''
						}
						item.select = ''
						this.surveyQuestionDTOList.push(a)
					})
					this.qList = res
				})
			},
			//获取当前时间
			dateFormat(time) {
				let date = new Date(time);
				let year = date.getFullYear();
				// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
				let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
				let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				// 拼接
				return year + "-" + month + "-" + day
				// return year + "-" + month + "-" + day;
			},
			setTime(e) {
				this.checkDate = e
			},
			setStatus(status) {
				this.status = status
				this.showModel = true
			},
			// toFail() {
			// 	uni.navigateTo({
			// 		url: 'check-fail'
			// 	})
			// },
			getQuestionList() {
				this.$get({
					url: this.api.CustomerSurveyInfo.getSurveyDetailById,
					data: {
						id: this.id
					}
				}).then(res => {
					res.surveyQuestionInfoVOList.forEach(item => {
						let a = {
							surveyOptionsDTOList: [{}],
							surveyQuestionId: '',
							sequence: '',
							question_content: '',
							attachIds: []
						}
						item.select = ''
						this.surveyQuestionDTOList.push(a)
					})
					this.surveyInfoId = res.id
					this.qList = res.surveyQuestionInfoVOList
				})
			},
			// 选中某个单选框时，由radio时触发
			selectOne(item, index) {
				this.qList[index].select = item.id
				let a = this.surveyQuestionDTOList[index]
				a.surveyOptionsDTOList[0].surveyOptionId = item.id
				a.surveyQuestionId = this.qList[index].id
				a.sequence = this.qList[index].sequence
				a.question_content = this.qList[index].question_content
				this.surveyQuestionDTOList[index] = a
			},
			setRemark(val, index) {
				this.surveyQuestionDTOList[index].question_content = val
			},
			submit() {
				for (var i = 0; i < this.surveyQuestionDTOList.length; i++) {
					if (!this.surveyQuestionDTOList[i].surveyOptionsDTOList[0].surveyOptionId) {
						this.$Toast('请填写问卷')
						return
					}
				}
				if (this.checkDate == '') {
					this.$Toast('请输入验收时间')
					return
				}
				this.$post({
					url: this.api.CustomerConstructionTaskInfo.constructionTaskCheck,
					data: {
						customerConstructionTaskId: this.customerConstructionTaskId,
						customerSurveyInfoDTO: {
							applicationId: this.customerConstructionTaskId,
							customerId: this.customerId,
							relationId: this.vuex_user.id,
							surveyInfoId: this.surveyInfoId,
							surveyQuestionDTOList: this.surveyQuestionDTOList
						},
						status: '1091-10',
						checkDate: this.checkDate,
					}
				}).then(res => {
					this.$Toast('提交成功')
					// this.remark = ''
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
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
