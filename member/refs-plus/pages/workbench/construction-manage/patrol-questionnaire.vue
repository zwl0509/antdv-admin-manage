<template>
	<view class="acceptance-questionnaire">
		<u-navbar :title-bold="true" title="问卷调查" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
			<view class="slot-wrap" slot="right">
				<view class="" style="font-size: 28rpx;color: #B80201;padding-right: 30rpx;" @click="save">
					保存
				</view>
			</view>
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
				<input type="text" placeholder="请输入描述内容:" v-model="val.questionContent"
					@input="setRemark(val.questionContent,index)">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				select: false,
				type: '',
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
				index: ''
			}
		},
		onLoad(options) {
			this.index = options.index
			if (options.type) {
				this.type = options.type
				this.getQuestionList()
			}
			this.customerId = options.customerId
		},
		methods: {
			toImgs(index) {
				uni.navigateTo({
					url: 'questionnaire-pictures?index=' + index
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
			getQuestionList() {
				this.$get({
					url: this.api.CustomerSurveyInfo.getSurveyDetail,
					data: {
						surveyType: this.type
					}
				}).then(res => {
					let pages = getCurrentPages(); //获取所有页面栈实例列表
					let nowPage = pages[pages.length - 1]; //当前页页面实例
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					if (prevPage.$vm.submitData.surveyInfoDTOS[this.index].surveyInfoId != '') {
						this.surveyQuestionDTOList = prevPage.$vm.submitData.surveyInfoDTOS[this.index]
							.surveyQuestionDTOList
						console.log(this.surveyQuestionDTOList)
						res.surveyQuestionInfoVOList.forEach((item, index) => {
							item.select = this.surveyQuestionDTOList[index].surveyOptionsDTOList[0]
								.surveyOptionId
							item.questionContent = this.surveyQuestionDTOList[index].questionContent
						})
					} else {
						res.surveyQuestionInfoVOList.forEach(item => {
							let a = {
								surveyOptionsDTOList: [{}],
								surveyQuestionId: item.id,
								sequence: '',
								questionContent: '',
								attachIds: [],
								questionType: item.questionType
							}
							item.select = ''
							this.surveyQuestionDTOList.push(a)
						})
					}

					this.surveyInfoId = res.id
					this.qList = res.surveyQuestionInfoVOList
					console.log(this.qList)
				})
			},
			// 选中某个单选框时，由radio时触发
			selectOne(item, index) {
				this.qList[index].select = item.id
				let a = this.surveyQuestionDTOList[index]
				a.surveyOptionsDTOList[0].surveyOptionId = item.id
				// a.surveyQuestionId = this.qList[index].id
				a.sequence = this.qList[index].sequence
				a.questionContent = this.qList[index].questionContent
				this.surveyQuestionDTOList[index] = a
			},
			setRemark(val, index) {
				this.surveyQuestionDTOList[index].questionContent = val
			},
			save() {
				console.log(this.surveyQuestionDTOList)
				for (var i = 0; i < this.surveyQuestionDTOList.length; i++) {
					if (this.surveyQuestionDTOList[i].questionType == '1077-20') {
						if (!this.surveyQuestionDTOList[i].surveyOptionsDTOList[0].surveyOptionId) {
							this.$Toast('请填写问卷')
							return
						}
					}
				}
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				uni.navigateBack({})
				prevPage.$vm.submitData.surveyInfoDTOS[this.index].surveyInfoId = this.surveyInfoId;
				prevPage.$vm.submitData.surveyInfoDTOS[this.index].surveyQuestionDTOList = this.surveyQuestionDTOList;
				// uni.setStorageSync('surveyQuestionDTOList',this.surveyQuestionDTOList)
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
