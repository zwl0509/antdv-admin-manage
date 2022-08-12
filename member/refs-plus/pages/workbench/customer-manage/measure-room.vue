<template>
	<view class="">
		<u-navbar :title="title" title-width='500' :title-size='34' title-color='#333333' :titleBold="true"
			:border-bottom='false' class="navbar">
			<view slot='right' style="padding-right: 36rpx;color: #B80201;font-size: 28rpx;" @click="submit">
				提交
			</view>
		</u-navbar>
		<view class="" style="height: 76rpx;">

		</view>
		<view class="userinfo">
			<view class="info">
				<image src="/static/image/mine/avatar-mis.png" mode=""></image>
				<text>{{customInfo.infoShow ? customInfo.customerName :customInfo.customerShowName}}</text>
			</view>
		</view>
		<view class="center" style="margin-top: 20rpx;">
			<view class="setInput" v-if="code!='1059-50'">
				<text>量房日期</text>
				<view class="setInput-r" @click="timeShow=true">
					<input type="text" v-model="actualMeasuringDate" :disabled="true" placeholder="请选择日期" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
			<view class="setInput">
				<text>智装erp账号</text>
				<view class="setInput-r">
					<input type="text" maxlength="16" v-model="userCode" placeholder="请输入智装erp账号" />
				</view>
			</view>
			<view class="setInput" style="border: none;">
				<text>智装erp密码</text>
				<view class="setInput-r">
					<input type="password" maxlength="16" v-model="pwd" placeholder="请输入智装erp密码" />
				</view>
			</view>
		</view>
		<u-picker v-model="timeShow" mode="time" @confirm="confirm"></u-picker>
		<view class="center">
			<view class="title" v-if="code!='1059-50'">
				量房沟通注意事项
			</view>
			<view class="" style="position: relative;" v-if="code!='1059-50'">
				<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon" v-if="!specialReason.length">
				</image>
				<textarea v-model="specialReason" maxlength="200" placeholder="     这里可以填写量房沟通注意事项~" />
				<view class=""
					style='text-align: right;font-size: 20rpx;margin-bottom: 42rpx;width: 100%;background-color: #F9F9F9;padding-right: 12rpx;height: 50rpx;'>
					<text style='color: #F43D1B;'>{{specialReason.length}}</text><text
						style='color: #B2B2B2;'>/200</text>
				</view>
			</view>
			<view class="setInput">
				<text>备注</text>
				<view class="setInput-r">
					<input type="text" v-model="remark" maxlength="50" placeholder="请输入备注信息" />
				</view>
			</view>
			<view class="upload">
				<text>附件上传</text>
				<view class="upload-r" @click="upload" v-if="!isIos">
					<image src="../../../static/image/workbench/customer-manage/upload.png" mode=""></image>
				</view>
				<view class="upload-r" v-else @click="chooseImage">
					<image src="../../../static/image/workbench/customer-manage/upload.png" mode=""></image>
				</view>
			</view>
			<view class="files" v-for="(val,index) in list" :key="index">
				<view class="files-l">
					<image :src="geturl(val.path)" mode=""></image>
					<text>{{substrFile(val.path)}}</text>
				</view>
				<image src="../../../static/image/mine/account/cha.png" mode="" class="files-r" @click="delFile(index)">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fileUpload
	} from '@/common/service/index.js'
	export default {
		data() {
			return {
				customInfo: uni.getStorageSync('customInfo'),
				trackContent: '',
				selectShow: false,
				timeShow: false,
				selectList: [{
					name: '1111',
					value: 1
				}, {
					name: '222',
					value: 2
				}],
				actualMeasuringDate: '', //日期
				specialReason: '', //特殊派单理由
				remark: '', //备注
				preIndedx: 0,
				pre: 'virtualID_',
				list: [], //文件列表
				attachIds: [], //文件id列表
				workFlowInfoId: '',
				workFlowNodeId: '',
				title: '',
				isIos: uni.getStorageSync('isIos'),
				preImagePath: [],
				userCode: '',
				pwd: '',
				code: '', //
				timeOut: true
			}
		},
		onLoad(options) {
			this.userCode = this.vuex_user.zhiAccount
			this.pwd = this.vuex_user.zhiPwd
			this.title = options.title
			this.workFlowInfoId = options.workFlowInfoId
			this.workFlowNodeId = options.workFlowNodeId
			if (options.code) {
				this.code = options.code
				console.log(this.code)
			}
		},
		methods: {
			//获取文件图片
			geturl(url) {
				console.log(url, url.indexOf('.JPG'))
				if (url.indexOf('.JPG') != -1 || url.indexOf('.JPEG') != -1 || url.indexOf('.PNG') != -1 || url.indexOf(
						'.BMP') != -1 || url.indexOf('.jpg') != -1 || url.indexOf('.jpeg') != -1 || url.indexOf('.png') !=
					-1 || url.indexOf('.bmp') != -1) {
					return '/static/image/workbench/customer-manage/img.png'
				} else if (url.indexOf('.xlsx') != -1 || url.indexOf('.XLSX') != -1) {
					return '/static/image/workbench/customer-manage/xlsx.png'
				} else if (url.indexOf('.pds') != -1 || url.indexOf('.PDS') != -1) {
					return '/static/image/workbench/customer-manage/pds.png'
				} else if (url.indexOf('.doc') != -1 || url.indexOf('.DOC') != -1) {
					return '/static/image/workbench/customer-manage/doc.png'
				} else {
					return '/static/image/workbench/customer-manage/other.png'
				}
			},
			goProcess() {
				this.$post({
					url: this.api.CustomWorkFlowInfo.customerUpdateWorkFlowNode,
					data: {
						customerId: this.customInfo.id,
						workFlowInfoId: this.workFlowInfoId,
						workFlowNodeId: this.workFlowNodeId
					}
				}).then(res => {
					this.$Toast('操作成功')
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			delFile(index) {
				this.list.splice(index, 1)
				this.attachIds.splice(index, 1)
			},
			//截取文件名
			substrFile(e) {
				var b = e.substr(e.lastIndexOf("/") + 1, e.length - e.lastIndexOf("/"));
				return b
			},
			//提交
			submit() {
				let that = this
				if (this.code != '1059-50') {
					if (!this.actualMeasuringDate) {
						this.$Toast('请选择日期')
						return
					}
					if (!this.specialReason) {
						this.$Toast('请输入特殊派单理由')
						return
					}
				} else {
					if (!this.list.length) {
						this.$Toast('请上传图片')
						return
					}
				}

				if (!this.remark) {
					this.$Toast('请输入备注')
					return
				}
				if (this.timeOut) {
					this.timeOut = false
					setTimeout(function() {
						that.timeOut = true
					}, 3000)
					this.$post({
						url: this.api.CustomWorkFlowInfo.editCustomerRelatedEmployee,
						data: {
							customerIds: [this.customInfo.id],
							remark: this.remark,
							specialReason: this.specialReason,
							actualMeasuringDate: this.actualMeasuringDate,
							attachIds: this.attachIds,
							workFlowNodeId: this.workFlowNodeId,
							pwd: this.pwd,
							userCode: this.userCode,
							isToIntentCustomer: false,
							workFlowInfoId: this.workFlowInfoId
						}
					}).then(res => {
						// this.goProcess()
						this.$Toast('操作成功')
						setTimeout(function() {
							uni.navigateBack({

							})
						}, 1000)
					})
				} else {
					this.$Toast("请勿重复点击")
				}
			},
			upload() {
				let _this = this
				// #ifdef APP-PLUS
				const plugin = uni.requireNativePlugin('File—Choose')
				plugin.file_choose('', (result) => {
					console.log(result)
					const item = {
						id: _this.pre + _this.preIndedx,
						file: result,
						path: result
					}
					_this.preIndedx++
					if (_this.list.length >= 6) {
						this.$Toast("最多上传6个附件")
						return
					}
					_this.list.push(item)
					_this.upload2()
				})
				// #endif
			},
			//选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: res => {
						// res.tempFilePaths[0]
						// const filePath = res.tempFiles[0]
						this.preImagePath = res.tempFilePaths[0]
						this.handleUploadAvatar()
					},
					fail: err => {}
				})
			},
			// 图片上传
			handleUploadAvatar() {
				fileUpload({
						filePathList: [this.preImagePath],
						formData: {
							attachType: '1009-70'
						},
						name: 'file',
						url: '/common/attachment/uploadSingleFile?customerId=' + this.customInfo.id
					})
					.then(res => {
						this.attachIds.push(res[0][0].id)
						const a = {
							path: res[0][0].requestUrl
						}
						if (this.list.length >= 6) {
							this.$Toast("最多上传6个附件")
							return
						}
						this.list.push(a)
					}).catch(err => {

					})
			},
			// 上传获取ID
			upload2() {
				console.log(33333)
				let attach_type_list = []
				const filePathList = this.list.map((m, i) => {
					attach_type_list.push({
						attachType: '1003-120',
					})
					return m.path
				})
				fileUpload({
					filePathList: filePathList,
					formData: attach_type_list,
					url: '/common/attachment/uploadSingleFile?customerId=' + this.customInfo.id
				}).then((res) => {
					const ids = []
					res.forEach((item) => {
						item.forEach((ele) => {
							ids.push(ele.id)
						})
					})
					this.attachIds = ids
				})
			},
			confirm(e) {
				this.actualMeasuringDate = e.year + '-' + e.month + '-' + e.day
			},
			select() {
				this.selectShow = true
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.writeIcon {
		position: absolute;
		width: 28rpx;
		height: 25rpx;
		top: 32rpx;
		left: 24rpx;
		z-index: 3;
	}

	.userinfo {
		background-color: #FFFFFF;
		padding: 10rpx 0 12rpx 0;
		position: fixed;
		top: calc(66rpx + var(--status-bar-height));
		left: 0rpx;
		width: 100%;
		z-index: 999;
		border-bottom: 1rpx solid #F8F8FB;

		.info {
			width: 424rpx;
			height: 64rpx;
			background: #F9F9F9;
			border-radius: 36rpx;
			margin: auto;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 12rpx;
			}

			text {
				font-size: 26rpx;
				color: #666666;
				font-weight: 400;
			}
		}
	}

	.center {
		width: 100%;
		padding: 0 30rpx;
		background-color: #FFFFFF;
		margin-bottom: 20rpx;

		.files {
			height: 112rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #F8F8FB;

			&:last-child {
				border: none;
			}

			.files-l {
				display: flex;
				align-items: center;

				text {
					width: 550rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #333333;
					font-size: 30rpx;
				}

				image {
					width: 64rpx;
					height: 64rpx;
					margin-right: 16rpx;
				}
			}

			.files-r {
				width: 40rpx;
				height: 40rpx;
			}
		}

		textarea {
			width: 100%;
			height: 352rpx;
			background-color: #F9F9F9;
			padding: 24rpx 20rpx;
			font-size: 28rpx;
			box-sizing: border-box;
		}

		.title {
			padding: 32rpx 0 24rpx 0;
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
		}

		.setInput {
			width: 100%;
			height: 112rpx;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #F0F0F0;
			justify-content: space-between;

			text {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
			}

			.setInput-r {
				display: flex;
				align-items: center;

				input {
					font-size: 32rpx;
					color: #333333;
					text-align: right;
				}

				image {
					height: 27rpx;
					margin-left: 14rpx;
					width: 14rpx;
				}
			}

		}

		.upload {
			width: 100%;
			height: 112rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			text {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
			}

			.upload-r {
				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
	}
</style>
