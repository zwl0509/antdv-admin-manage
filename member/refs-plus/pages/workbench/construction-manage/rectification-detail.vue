<template>
	<view class="" style="padding-bottom: 126rpx;">
		<u-navbar :title-bold="true" title="整改详情" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
		</u-navbar>
		<view class="xian">

		</view>
		<view class="rectification-send-y">
			<view class="content">
				<view class="content-y">
					<text>标题</text>
					<text>{{detail.title}}</text>
				</view>
				<view class="content-y">
					<text>描述</text>
					<text>{{detail.content}}</text>
				</view>
				<view class="content-imgs">
					<view class="content-imgs-title">
						图片
					</view>
					<view class="content-imgs-img" v-if="detail.sysAttachInfoVOS">
						<image :src="img.path" mode="" v-for="(img,index2) in detail.sysAttachInfoVOS" :list="index2"
							@click="previewImage(detail.sysAttachInfoVOS,index2)"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="xian">

		</view>
		<view class="rectification-send-y">
			<view class="content" style="padding-bottom: 20rpx;padding-top: 0;">
				<view class="content-e">
					<view class="content-e-l">
						处理时间
					</view>
					<view class="content-e-r" @click="timeShow=true">
						<input type="text" :disabled="true" placeholder="请选择" v-model="dealTime">
						<image src="/static/image/mine/right.png" mode=""></image>
					</view>
				</view>
				<view class="content-e">
					<view class="content-e-l">
						整改负责人
					</view>
					<view class="content-e-r">
						<input type="text" v-model="detail.chargePersonName" :disabled="true">
						<image src="/static/image/mine/right.png" mode=""></image>
					</view>
				</view>
				<view class="content-e">
					<view class="content-e-l">
						整改抄送人
					</view>
					<view class="content-e-r">
						<input type="text" :disabled="true" v-model="detail.notifyNames">
						<image src="/static/image/mine/right.png" mode=""></image>
					</view>
				</view>
				<view class="" style='background-color: #F9F9F9;padding: 20rpx;border-radius: 8rpx;position: relative;'
					v-if="rectification">
					<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon" v-if="!remark.length">
					</image>
					<textarea style="height: 226rpx;width: 100%;" maxlength="200" v-model="remark"
						placeholder="     这里可以填写您的跟踪记录内容~" />
					<view class="" style='text-align: right;font-size: 20rpx;margin-bottom: 40rpx;'>
						<text style='color: #F43D1B;'>{{remark.length}}</text><text style='color: #B2B2B2;'>/200</text>
					</view>
					<u-upload ref="uUpload" width="196rpx" height="196rpx" :action="action"
						:formData="{attachType: '1009-20'}" :header="header" name="files" :auto-upload="false"
						max-count="3" :custom-btn="true" @on-uploaded="onUpload">
						<view slot="addBtn">
							<image src="/static/image/mine/account/add.png"
								style="width: 196rpx; height: 196rpx;margin: 0;">
							</image>
						</view>
					</u-upload>
				</view>
				<view class="" style='background-color: #F9F9F9;padding: 20rpx;border-radius: 8rpx;position: relative;'
					v-if="!rectification&&detail.rectificationDealVO">
					<view class="" style="font-size: 28rpx;color: #333333;" v-if="detail.rectificationDealVO">
						<text style="color: #B80201;">回复详情：</text><text>{{detail.rectificationDealVO.remark}}</text>
					</view>
					<view class="" style="display: flex;align-items: center;flex-wrap: wrap;margin-top: 20rpx;"
						v-if="detail.rectificationDealVO">
						<image :src="img.path" mode=""
							style="width: 196rpx;height: 196rpx;margin-bottom: 10rpx;margin-right: 10rpx;"
							v-for="(img,index3) in detail.rectificationDealVO.sysAttachInfoVOS"
							@click="previewImage(detail.rectificationDealVO.sysAttachInfoVOS,index3)" :key="index3">
						</image>
					</view>
				</view>
			</view>
		</view>
		<u-picker mode="time" v-model="timeShow" :params="params" @confirm="selectTime" start-year="2022"></u-picker>
		<view class="btn" @click="submit" v-if="rectification">
			<text>提交</text>
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
				rectification: false,
				detail: {},
				dealTime: '',
				timeShow: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
			}
		},
		onLoad(options) {
			if (options.rectification) {
				this.rectification = options.rectification
			}
			if (options.agencyId) {
				this.toDealWithIsView(options.agencyId)
			}
			let time = new Date().toISOString()
			this.dealTime = this.dateFormat(time)
			this.id = options.id
			this.getDetail()
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
		},
		methods: {
			selectTime(e) {
				let isNow = this.dateTimeStr(e)
				if (isNow) {
					this.dealTime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':' + e.second
				} else {
					this.$Toast('请选择大于等于当前时间')
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
			//获取时间
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
				return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
				// return year + "-" + month + "-" + day;
			},
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
			//待办已读
			toDealWithIsView(id) {
				this.$get({
					url: this.api.toDealWith.toDealWithIsView,
					data: {
						id: id
					}
				}).then(res => {

				})
			},
			getDetail() {
				this.$post({
					url: this.api.CustomerConstructionTaskInfo.getRectificationDetail,
					data: {
						id: this.id
					}
				}).then(res => {
					this.detail = res
				})
			},
			submit() {
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
				this.rectificationReply(attaches)
			},
			//整改信息回复
			rectificationReply(attachIds) {
				this.$post({
					url: this.api.CustomerConstructionTaskInfo.rectificationReply,
					data: {
						attachIds: attachIds,
						customerInspectionRectificationId: this.id,
						content: this.detail.content,
						remark: this.remark,
						dealTime: this.dealTime
					}
				}).then(res => {
					this.$Toast('操作成功')
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			}
		}
	}
</script>

<style scoped lang="less">
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

	.xian {
		width: 100%;
		height: 20rpx;
		background-color: #F6F6F6;
	}

	.writeIcon {
		position: absolute;
		width: 28rpx;
		height: 25rpx;
		top: 32rpx;
		left: 24rpx;
		z-index: 99;
	}

	.rectification-send {
		padding-bottom: 136rpx;
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

	.rectification-send-y {
		// margin-top: 20rpx;

		.content {
			background-color: #fff;
			padding: 30rpx 30rpx 0 30rpx;

			.content-y {
				margin-bottom: 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				text {
					color: #333333;
					font-size: 28rpx;
				}
			}

			.content-imgs {
				.content-imgs-title {
					color: #333333;
					font-size: 28rpx;
					margin-bottom: 20rpx;
				}

				.content-imgs-img {
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
					flex-wrap: wrap;

					image {
						width: 222rpx;
						height: 222rpx;
						border-radius: 8rpx;
						margin-right: 12rpx;
						margin-bottom: 12rpx;

						&:nth-child(3n) {
							margin-right: 0rpx;
						}
					}
				}
			}

			.content-e {
				min-height: 96rpx;
				padding: 0 10rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2rpx solid #EEEEEE;

				.content-e-l {
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}

				.content-e-r {
					display: flex;
					align-items: center;

					input {
						color: #333333;
						font-size: 32rpx;
						text-align: right;
					}

					image {
						width: 14rpx;
						height: 27rpx;
						margin-left: 24rpx;
					}
				}
			}
		}
	}
</style>
