<template>
	<view class="question">
		<view class="center">
			<image src="/static/image/workbench/customer-manage/center-top.png" mode="" class="center-top"></image>
			<view class="userinfo">
				<image src="/static/image/workbench/customer-manage/q-tx.png" mode=""></image>
				<view class="userinfo-text">
					<view class="">
						{{customInfo.infoShow ? customInfo.customerName :customInfo.customerShowName}}
					</view>
					<!-- 					<view class="">
						最近提交于7月3日 16时35分
					</view> -->
				</view>
			</view>
			<view class="line">
			</view>
			<view class="question-y" v-for="(val,index) in qList" :key="index">
				<view class="title">
					<view class="title-l">
						{{index >= 10 ? index :'0'+(index+1)}}
						<image src="/static/image/workbench/customer-manage/title-bg.png" mode=""></image>
					</view>
					<view class="">
						<view class="title-r">
							<text v-if="val.isRequired" style="color: red;">*</text> {{val.questionTitle}}
						</view>
						<view class="title-r2" v-if="val.questionSubtitle">
							{{val.questionSubtitle}}
						</view>
					</view>
				</view>
				<view class="answer" v-if="val.questionType=='1077-10'">
					<input type="text" value="" placeholder="请输入" @input="aInput(index,$event)" />
				</view>
				<view class="answer" v-if="val.questionType=='1077-20'">
					<u-radio-group :wrap="true" v-model="val.value" @change="radioGroupChange">
						<u-radio icon-size="16" @change="radioChange(item,index)"
							v-for="(item, index2) in val.surveyOptionsInfoVOS" :key="index2" :name="item.content">
							{{item.content}}
						</u-radio>
					</u-radio-group>
				</view>
				<view class="answer" v-if="val.questionType=='1077-30'">
					<u-checkbox-group :wrap="true" @change="checkboxGroupChange($event,index)">
						<u-checkbox @change="checkboxChange" v-model="item.checked"
							v-for="(item, index2) in val.surveyOptionsInfoVOS" :key="index2" :name="item.id">
							{{item.content}}
						</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="answer" v-if="val.questionType=='1077-40'">
					<u-select v-model="show" :list="list" value-name="id" label-name="content"
						@confirm="confirm($event,index)"></u-select>
					<input type="text" v-model="val.value" placeholder="请选择" :disabled="true"
						@click="showSelect(val.surveyOptionsInfoVOS)" />
				</view>
			</view>
			<view class="btn">
				<text @click="submit">
					提交问卷
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customInfo: uni.getStorageSync('customInfo'),
				list: [],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: 'orange',
				show: false,
				applicationId: '',
				customerId: '',
				qList: [],
				surveyQuestionDTOList: [],
				type: '',
				isQrCode: false,
				relationId: '',
			};
		},
		onLoad(options) {
			if (options.relationId) {
				this.relationId = options.relationId
			}
			if (options.isQrCode) {
				this.isQrCode = options.isQrCode
			}
			if (options.type) {
				this.type = options.type
			}
			if (options.surveyType) {
				this.type = options.surveyType
			}
			if (options.applicationId) {
				this.applicationId = options.applicationId
			}
			this.customerId = options.customerId
			this.getList()
		},
		methods: {
			confirm(e, index) {
				let a = {
					surveyOptionsDTOList: [{}],
					surveyQuestionId: '',
					sequence: ''
				}
				a.surveyOptionsDTOList[0].surveyOptionId = e[0].value
				a.surveyOptionsDTOList[0].content = e[0].label
				a.surveyQuestionId = this.qList[index].id
				a.sequence = this.qList[index].sequence
				this.qList[index].value = e[0].label
				this.surveyQuestionDTOList[index] = a
			},
			showSelect(e) {
				this.list = e
				this.show = true
			},
			aInput(index, event) {
				let a = {
					surveyOptionsDTOList: [{
						content: ''
					}],
					surveyQuestionId: '',
					sequence: ''
				}
				a.surveyOptionsDTOList[0].content = event.detail.value
				a.surveyQuestionId = this.qList[index].id
				a.sequence = this.qList[index].sequence
				this.surveyQuestionDTOList[index] = a
			},
			getList() {
				this.$get({
					url: this.api.CustomerSurveyInfo.getSurveyDetail,
					data: {
						surveyType: this.type
					}
				}).then(res => {
					this.surveyInfoId = res.id
					this.qList = res.surveyQuestionInfoVOList
				})
			},
			// 选中某个单选框时，由radio时触发
			radioChange(item, index) {
				let a = {
					surveyOptionsDTOList: [{}],
					surveyQuestionId: '',
					sequence: ''
				}
				a.surveyOptionsDTOList[0].surveyOptionId = item.id
				a.surveyOptionsDTOList[0].score = item.score
				a.surveyQuestionId = this.qList[index].id
				a.sequence = this.qList[index].sequence
				this.surveyQuestionDTOList[index] = a
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e);
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(index, item) {
				// console.log(index,item);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e, index) {
				// console.log(e,index)
				let a = {
					surveyOptionsDTOList: [],
					surveyQuestionId: '',
					sequence: ''
				}
				e.forEach(item => {
					let b = {
						surveyOptionId: ''
					}
					b.surveyOptionId = item
					a.surveyOptionsDTOList.push(b)
				})
				this.qList[index].surveyOptionsInfoVOS.forEach(item => {
					a.surveyOptionsDTOList.forEach((item2, index) => {
						if (item2.surveyOptionId == item.id) {
							item2.score = item.score
						}
					})
				})
				a.surveyQuestionId = this.qList[index].id
				a.sequence = this.qList[index].sequence
				this.surveyQuestionDTOList[index] = a
			},
			towrite() {
				uni.navigateTo({
					url: 'autograph'
				})
			},
			submit() {
				let a = this.qList.every((item, index) => {
					if (item.isRequired) {
						if (!!this.surveyQuestionDTOList[index]) {
							if (item.questionType == '1077-10') {
								return this.surveyQuestionDTOList[index].surveyOptionsDTOList[0].content != ''
							} else if (item.questionType == '1077-30') {
								return !!this.surveyQuestionDTOList[index].surveyOptionsDTOList.length
							} else {
								return true
							}
						} else {
							return false
						}
					} else {
						return true
					}
				})
				if (!a) {
					this.$Toast("请确认问卷是否填写完整")
					return
				}
				if (this.isQrCode) {
					this.submitSurveyByWeb()
				} else {
					this.submitSurvey()
				}
			},
			submitSurvey() {
				this.$post({
					url: this.api.CustomerSurveyInfo.submitSurvey,
					data: {
						applicationId: this.applicationId,
						customerId: this.customerId,
						relationId: this.vuex_user.id,
						surveyInfoId: this.surveyInfoId,
						surveyQuestionDTOList: this.surveyQuestionDTOList
					}
				}).then(res => {
					this.$Toast('提交成功')
					// this.remark = ''
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			submitSurveyByWeb() {
				this.$post({
					url: this.api.CustomerSurveyInfo.submitSurveyByWeb,
					data: {
						customerId: this.customerId,
						relationId: this.relationId,
						surveyInfoId: this.surveyInfoId,
						surveyQuestionDTOList: this.surveyQuestionDTOList
					}
				}).then(res => {
					this.$Toast('提交成功')
					// this.remark = ''
				})
			},
		}
	};
</script>

<style scoped lang="less">
	.question {
		padding: 0 30rpx;
		padding-top: 96rpx;
		min-height: calc(100vh - 80rpx - var(--status-bar-height));
		background: url('/static/image/workbench/customer-manage/q-bg.png');
		background-size: 100% 4910rpx;
		padding-bottom: 78rpx;

		.center {
			width: 100%;
			min-height: calc(100vh - 80rpx - var(--status-bar-height) - 186rpx - 78rpx);
			background-color: #FFFFFF;
			border-radius: 20rpx;
			position: relative;
			// padding: 0 24rpx;
			padding-bottom: 168rpx;
			padding-top: 40rpx;

			.center-top {
				width: 100%;
				height: 48rpx;
				position: absolute;
				top: 0rpx;
				left: 0rpx;
			}

			.userinfo {
				width: 100%;
				display: flex;
				align-items: center;
				padding: 0 10rpx 10rpx 10rpx;

				image {
					height: 106rpx;
					width: 106rpx;
					margin-right: 4rpx;
				}

				.userinfo-text {
					height: 106rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;

					view {
						color: #999999;
						font-size: 24rpx;

						&:first-child {
							color: #333333;
							font-size: 28rpx;
						}
					}
				}
			}

			.line {
				height: 0px;
				border: 1px dashed #7BB4FF;
				margin: 0 24rpx;
				opacity: 1;
				box-sizing: border-box;
				margin-bottom: 58rpx;
			}

			.question-y {
				padding: 0 32rpx;
				width: 100%;
				margin-bottom: 76rpx;

				.title {
					display: flex;
					align-items: flex-start;
					margin-bottom: 32rpx;

					.title-l {
						width: 42rpx;
						height: 42rpx;
						line-height: 42rpx;
						text-align: center;
						position: relative;
						color: #FFFFFF;
						font-size: 24rpx;
						font-weight: bold;
						z-index: 2;
						margin-right: 24rpx;
						flex-shrink: 0;

						image {
							width: 49rpx;
							height: 50rpx;
							position: absolute;
							top: 0rpx;
							bottom: 0rpx;
							margin: auto;
							left: -8rpx;
							z-index: -1;
						}
					}

					.title-r {
						color: #333333;
						font-size: 32rpx;
						font-weight: bold;
					}

					.title-r2 {
						color: #999999;
						font-size: 28rpx;
						margin-top: 20rpx;
					}
				}

				.answer {

					// width: 100%;
					input {
						width: 100%;
						height: 80rpx;
						line-height: 80rpx;
						font-size: 28rpx;
						padding-left: 24rpx;
						border: 2rpx solid #7BB4FF;
						border-radius: 16rpx;
						box-sizing: border-box;
					}

					.u-radio {
						margin-bottom: 14rpx;

						&:last-child {
							margin: 0;
						}
					}

					.u-checkbox {
						margin-bottom: 14rpx;

						&:last-child {
							margin: 0;
						}
					}
				}
			}

			.btn {
				width: 100%;
				height: 96rpx;
				position: absolute;
				bottom: 72rpx;
				left: 0rpx;
				padding: 0 30rpx;

				text {
					display: inline-block;
					width: 100%;
					height: 96rpx;
					text-align: center;
					line-height: 96rpx;
					color: #FFFFFF;
					font-size: 32rpx;
					background: linear-gradient(to right, #388CF8, #3254E2);
					border-radius: 48rpx;
				}
			}
		}
	}
</style>
