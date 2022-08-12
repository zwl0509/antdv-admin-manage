<template>
	<view class="detail">
		<u-navbar title="详情" :border='false' :titleBold='true' :border-bottom="false" title-color='#333333'>
			<!-- 			<view class="slot-wrap" slot="right">
				<view class="" style="font-size: 26rpx;color: #333333;padding-right: 40rpx;" @click="toRepair">
					投诉记录
				</view>
			</view> -->
		</u-navbar>
		<view class="customer-info">
			<view class="customer-info-user">
				<view class="userinfo">
					<image src="/static/image/workbench/customer-manage/tx.png" mode="" class="avatar"></image>
					<view class="userinfo-r">
						<view class="userinfo-r-t">
							<text>{{detail.customerName}}</text>
							<text>{{detail.mobileNumber}}</text>
						</view>
						<view class="userinfo-r-b">
							<image src="/static/image/workbench/product-dispatch/address.png" mode=""></image>
							<text>{{detail.finalAddress}}</text>
						</view>
					</view>
				</view>
				<view class="status" v-if="dispatchInfosLength">
					{{detail.dispatchInfos[0].statusName}}
				</view>
			</view>
			<view class="customer-info-content">
				<view class="title">
					<view class="title-l">
						<image src="/static/image/workbench/customer-complaints/complaint.png" mode=""></image>
						<text>
							{{detail.recordSourceName}}
						</text>
					</view>
					<view class="title-r">
						{{detail.recordTime}}
					</view>
				</view>
				<view class="content" v-if="dispatchInfosLength">
					{{openShow ? detail.dispatchInfos[0].question : getLength(detail.dispatchInfos[0].question)}}
					<view class="open" @click="openShow=true" v-if="!openShow">
						展开
					</view>
				</view>
			</view>
		</view>
		<view class="dispatch-info">
			<view class="">
				<text class="dispatch-l">所属门店</text>
				<text class="dispatch-r">{{detail.storeName ? detail.storeName :'暂无'}}</text>
			</view>
			<!-- 			<view class="">
				<text class="dispatch-l">项目经理</text>
				<text class="dispatch-r">张起灵</text>
			</view> -->
			<view class="">
				<text class="dispatch-l">设计师</text>
				<text class="dispatch-r">{{detail.designer ? detail.designer : '暂无'}}</text>
			</view>
		</view>
		<view class="handle-info" v-if="dispatchInfosLength">
			<view class="handle-info-y">
				<view class="handle-info-y-l">
					处理人
				</view>
				<view class="handle-info-y-r">
					<view class="handle-info-y-r-t">
						<text>{{detail.dispatchInfos[0].handlerName}}</text>
					</view>
					<image src="/static/image/workbench/customer-complaints/right.png" mode=""></image>
				</view>
			</view>
			<view class="handle-info-y">
				<view class="handle-info-y-l">
					处理时间
				</view>
				<view class="handle-info-y-r" >
					<input type="text" v-model="detail.dispatchInfos[0].dealTime" :disabled="true"
						placeholder-style="color:#D0D0D0;" />
					<image src="/static/image/workbench/customer-complaints/right.png" mode=""></image>
				</view>
			</view>
			<view class="">
				<view class="handle-info-y" style="border: none;height: auto;padding-top: 32rpx;padding-bottom: 20rpx;">
					<view class="handle-info-y-l">
						抄送人
					</view>
					<view class="handle-info-y-r" >
						<view class="handle-info-y-r-t">
							<text v-for="(reminder,index4) in detail.dispatchInfos[0].reminders"
								:key="index4">{{index4==0 ? reminder.employeeName :'、'+ reminder.employeeName}}</text>
						</view>
						<image src="/static/image/workbench/customer-complaints/right.png" mode=""></image>
					</view>
				</view>
				<view class="feedbackContent">
					<view class="" style="font-size: 28rpx;color: #333333;">
						<text style="color: #B80201;">回复详情：</text><text>{{detail.dispatchInfos[0].replayContent}}</text>
					</view>
					<view class="feedbackContent-img">
						<image :src="img.path" mode="" v-for="(img,index2) in detail.dispatchInfos[0].attachInfos"
							:key="index2" @click="previewImage(detail.dispatchInfos[0].attachInfos,index2)">
						</image>
					</view>
				</view>
			</view>
			<view class="handle-info-y" style="border: none;">
				<view class="handle-info-y-l">
					下次处理时间
				</view>
				<view class="handle-info-y-r">
					<input type="text" value="" placeholder="请选择时间" v-model="detail.dispatchInfos[0].nextDealTime"
						:disabled="true" placeholder-style="color:#D0D0D0;" />
					<image src="/static/image/workbench/customer-complaints/time.png" mode=""
						style="width: 26rpx;height: 28rpx;margin-left: 16rpx;"></image>
				</view>
			</view>
		</view>
		<u-picker mode="time" v-model="select" :params="params" @confirm="selectTime" start-year="2022"></u-picker>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				nowTime: '',
				nextTime: '',
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				select: false,
				timeName: '',
				feedbackPlaceholder: '填写您的回复信息',
				feedbackContent: '',
				openShow: false,
				maxWords: 0,
				// 上传图片服务器地址
				action: '',
				header: {
					'X-Auth-Token': ''
				},
				csComplaintRecordId: '',
				id: '',
				detail: {},
				reminders: [],
				handlers: [],
				role: '',
				status: '',
				dispatchInfosLength: 0,
				isComplete: false,
				isReject: false,
				type: ''
			}
		},
		onLoad(options) {
			this.role += options.role
			this.csComplaintRecordId = options.csComplaintRecordId
			this.id = options.id
			this.customerId = options.customerId
			this.type = options.type
			this.header['X-Auth-Token'] = this.vuex_token
			uni.getSystemInfo({
				success: (res) => {
					// 可使用窗口高度，将px转换rpx
					this.phoneWidth = (res.windowWidth * (750 / res.windowWidth))
					this.maxWords = this.phoneWidth / 28 * 2 - 5
					// console.log(this.maxWords, this.phoneWidth)
				}
			})
			// this.getLength(this.contentText)
			this.getDetail()
			this.getJurisdiction()
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
						if (item.key.indexOf('Complete') != -1) {
							this.isComplete = true
						}
						if (item.key.indexOf('Reject') != -1) {
							this.isReject = true
						}
					})
				})
			},
			toRepair() {
				uni.navigateTo({
					url: 'repair-record?customerId=' + this.customerId + '&type=' + this.type
				})
			},
			toHistory() {
				uni.navigateTo({
					url: 'history-record?detail=' + JSON.stringify(this.detail)
				})
			},
			listChange(list, name) {
				this.image = list.length
			},
			finish(status) {
				if (this.nowTime == '') {
					this.$Toast('请选择处理时间')
					return
				}
				if (this.feedbackContent == '') {
					this.$Toast('请输入回复内容')
					return
				}
				this.status = status
				this.$refs.uUpload.upload();
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
				this.saveData(attaches)
			},
			saveData(attachIds) {
				this.$post({
					url: this.api.CustomerServiceInfo.dispatch,
					data: {
						attachIds: attachIds,
						csComplaintRecordId: this.detail.id,
						dealTime: this.nowTime,
						handlerId: this.vuex_user.id,
						nextDealTime: this.nextTime,
						status: this.status,
						reminders: this.reminders,
						id: this.detail.dispatchInfos[0].id,
						question: this.detail.dispatchInfos[0].question,
						replayContent: this.feedbackContent
					}
				}).then(res => {
					this.$Toast('操作成功')
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			showSelect(e) {
				this.timeName = e
				this.select = true
			},
			//获取详情
			getDetail() {
				this.$get({
					url: this.api.CustomerServiceInfo.getDetail,
					data: {
						csComplaintRecordId: this.csComplaintRecordId,
						id: this.id
					}
				}).then(res => {
					this.detail = res
					if (res.dispatchInfos.length) {
						this.dispatchInfosLength = res.dispatchInfos.length
						res.dispatchInfos[0].handlers.forEach(item => {
							this.handlers.push(item.employeeId)
						})
						res.dispatchInfos[0].reminders.forEach(item => {
							this.reminders.push(item.employeeId)
						})
					}

					this.action = variable.apiServer + this.api.common.upload + "?customerId=" + res
						.customerId // variable.apiServer + this.$api.common.upload
				})
			},
			//获取展开前字符
			getLength(string = '') {
				if (!string || string.length < this.maxWords) {
					this.openShow = true
					return
				}
				let length = 0
				string = string.toString().split('')
				// const reg = /0xE001,0xE05A]|[0xE101,0xE15A]|[0xE201,0xE253]|[0xE301,0xE34D]|[0xE401,0xE44C]|[0xE501,0xE537]/
				for (const str of string) {
					length += /[\u4e00-\u9fa5]/.test(str) ? 2 : 1
				}
				let a = string.slice(0, this.maxWords)
				let b = ''
				a.forEach(item => {
					b = b + item
				})
				return b + '...'
			},
			selectTime(e) {
				if (this.timeName == 'nowTime') {
					this[this.timeName] = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':' + e
						.second
				} else {
					let isNow = this.dateTimeStr(e)
					if (isNow) {
						this[this.timeName] = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':' +
							e.second
					} else {
						this.$Toast('请选择大于等于当前时间')
					}
				}

			},
			//获取当前时间
			dateTimeStr(str) {
				var date = new Date(),
					year = date.getFullYear(), //年
					month = date.getMonth() + 1, //月
					day = date.getDate(), //日
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //时
					minute = date.getMinutes() < 10 ? date.getMinutes() : date.getMinutes(), //分
					second = date.getSeconds() < 10 ? date.getSeconds() : date.getSeconds(); //秒
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				hour >= 0 && hour <= 9 ? hour : "";
				minute >= 0 && minute <= 9 ? (minute = "0" + minute) : "";
				second >= 0 && second <= 9 ? (second = "0" + second) : "";
				if (str.year > year) {
					return true
				} else if (str.year == year) {
					if (str.month > month) {
						return true
					} else if (str.month == month) {
						if (str.day > day) {
							return true
						} else if (str.day == day) {
							if (str.hour > hour) {
								return true
							} else if (str.hour == hour) {
								if (str.minute >= minute) {
									return true
									// if(str.second >= second){
									// 	return true
									// }else{
									// 	return false
									// }
								} else {
									return false
								}
							} else {
								return false
							}
						} else {
							return false
						}
					} else {
						return false
					}
				} else {
					return false
				}
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
	.detail {
		padding-top: 20rpx;
		padding-bottom: 160rpx;

		.feedbackContent {
			background: #F8F8F8;
			border-radius: 16rpx;
			padding: 24rpx 20rpx;

			.feedbackContent-img {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 54rpx;

				image {
					width: 222rpx;
					height: 222rpx;
					border-radius: 8rpx;
					margin-right: 24rpx;

					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}

		.handle-info-y {
			width: 100%;
			height: 112rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #F0F0F0;

			.handle-info-y-l {
				font-size: 32rpx;
				color: #333333;
				font-weight: bold;
				flex-shrink: 0;
			}

			.handle-info-y-r {
				font-size: 32rpx;
				color: #333333;
				display: flex;
				align-items: center;

				.handle-info-y-r-t {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					justify-content: flex-end;

					text {
						white-space: nowrap;
					}
				}

				input {
					font-size: 32rpx;
					text-align: right;
				}

				image {
					width: 14rpx;
					height: 27rpx;
					margin-left: 28rpx;
				}
			}
		}

		.customer-info {
			width: 100%;
			background-color: #FFFFFF;
			padding: 24rpx 30rpx 32rpx 24rpx;

			.customer-info-user {
				width: 100%;
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				margin-bottom: 40rpx;

				.userinfo {
					display: flex;
					align-items: center;

					image {
						width: 76rpx;
						height: 76rpx;
						margin-right: 20rpx;
					}

					.userinfo-r {
						height: 76rpx;
						display: flex;
						flex-direction: column;

						.userinfo-r-t {
							color: #333333;
							font-size: 28rpx;
						}

						.userinfo-r-b {
							display: flex;
							align-items: center;
							font-size: 24rpx;
							color: #999999;

							image {
								width: 18rpx;
								height: 24rpx;
								margin-right: 12rpx;
							}
						}
					}
				}

				.status {
					font-size: 28rpx;
					color: #B80201;

				}
			}

			.customer-info-content {
				.title {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 16rpx;

					.title-l {
						display: flex;
						color: #333333;
						font-size: 32rpx;
						font-weight: bold;
						align-items: center;

						image {
							width: 28rpx;
							height: 32rpx;
							margin-right: 12rpx;
						}
					}

					.title-r {
						color: #999999;
						font-size: 24rpx;
					}
				}

				.content {
					font-size: 28rpx;
					font-weight: 500;
					line-height: 40rpx;
					color: #333333;
					margin-bottom: 24rpx;
					position: relative;

					.open {
						position: absolute;
						bottom: 0rpx;
						right: 0rpx;
						color: #333333;
						font-size: 28rpx;
						font-weight: bold;
					}
				}

				.imgs {
					display: flex;
					align-items: center;
					flex-wrap: wrap;

					image {
						height: 222rpx;
						width: 222rpx;
						margin-right: 12rpx;
						border-radius: 8rpx;

						&:nth-child(3n) {
							margin: 0;
						}
					}
				}
			}
		}

		.dispatch-info {
			height: 216rpx;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			margin-top: 20rpx;
			padding: 0 30rpx;

			view {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.dispatch-l {
				color: #666666;
				font-size: 28rpx;
			}

			.dispatch-r {
				font-size: 28rpx;
				color: #333333;
			}
		}

		.handle-info {
			background-color: #FFFFFF;
			padding: 0 30rpx;
			margin-top: 20rpx;
		}

		.history {
			margin-top: 20rpx;
			background-color: #FFFFFF;
			padding: 0 30rpx;
		}

		.btns {
			width: 100%;
			height: 98rpx;
			display: flex;
			align-items: center;
			flex-direction: row-reverse;
			padding: 0 30rpx;
			background-color: #FFFFFF;
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;

			.btn-y {
				width: 168rpx;
				height: 72rpx;
				border-radius: 36rpx;
				line-height: 72rpx;
				text-align: center;
				font-size: 28rpx;
				color: #FFFFFF;
				background: linear-gradient(to right, #D80100, #B80201);
				margin-left: 20rpx;
			}

			.btn-e {
				width: 168rpx;
				height: 72rpx;
				border-radius: 36rpx;
				line-height: 72rpx;
				text-align: center;
				font-size: 28rpx;
				color: #333333;
				border: 2rpx solid #C0C0C0;
				margin-left: 20rpx;
			}
		}
	}
</style>
