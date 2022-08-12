<template>
	<view class="">
		<u-navbar :title="title" title-width='500' :title-size='34' title-color='#333333' :titleBold="true"
			:border-bottom='false' class="navbar">
			<view slot='right' style="padding-right: 36rpx;color: #B80201;font-size: 28rpx;" @click="submit">
				提交
			</view>
		</u-navbar>
		<view class="" 
				style="height: 76rpx;">
		
		</view>
		<view class="userinfo">
			<view class="info">
				<image src="/static/image/mine/avatar-mis.png" mode=""></image>
				<text>{{customInfo.infoShow ? customInfo.customerName :customInfo.customerShowName}}</text>
			</view>
		</view>
		<view class="center" style="margin-top: 20rpx;">
			<view class="setInput">
				<text>设计协议号</text>
				<!-- @click="selectAgreement" -->
				<view class="setInput-r">
					<input type="number" v-model="designAgreementNo" :disabled="false" maxlength="9"
						placeholder="请输入协议号" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
			<view class="setInput" style="">
				<text>智装erp账号</text>
				<view class="setInput-r">
					<input type="text" maxlength="16" v-model="userCode" placeholder="请输入智装erp账号" />
				</view>
			</view>
			<view class="setInput" style="">
				<text>智装erp密码</text>
				<view class="setInput-r">
					<input type="password" maxlength="16" v-model="pwd" placeholder="请输入智装erp密码" />
				</view>
			</view>
			<view class="setInput" style="border: none;">
				<text>签订日期</text>
				<view class="setInput-r" @click="timeShow=true">
					<input type="text" v-model="signDate" :disabled="true" placeholder="请选择日期" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
		</view>
		<u-select v-model="selectShow" :default-value='[selectIndex]' value-name="id" :list="selectList"
			@confirm='confirm' label-name="promotionName">
		</u-select>
		<u-select v-model="agreeShow" :default-value='[agreeIndex]' value-name="designNo" label-name="designNo"
			:list="agreeList" @confirm='confirm2'>
		</u-select>
		<u-picker v-model="timeShow" mode="time" @confirm="timeSelect"></u-picker>
		<view class="center">
			<view class="setInput">
				<text>优惠活动</text>
				<view class="setInput-r" @click="select">
					<input type="text" v-model="discountName" :disabled="true" placeholder="请选择" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
			<view class="setInput">
				<text>定金单价</text>
				<view class="setInput-r">
					<input type="digit" v-model="depositUnitPrice" maxlength="11" placeholder="请输入定金单价(元)" />
				</view>
			</view>
			<view class="setInput">
				<text>设计费单价</text>
				<view class="setInput-r">
					<input type="digit" v-model="designUnitPrice" maxlength="11" placeholder="请输入设计费单价(元)" />
				</view>
			</view>
			<view class="setInput">
				<text>折前设计费</text>
				<view class="setInput-r">
					<input type="digit" v-model="beforeDesignUnitPrice" :disabled="false" maxlength="11"
						placeholder="请输入折前设计费(元)" />
				</view>
			</view>
			<view class="setInput" style="border: none;">
				<text>折后设计费</text>
				<view class="setInput-r">
					<input type="digit" v-model="afterDesignUnitPrice" :disabled="false" maxlength="11"
						placeholder="请输入折后设计费(元)" />
				</view>
			</view>
		</view>
		<view class="center">
			<view class="title">
				合同特殊条款
			</view>
			<view class="" style="position: relative;">
				<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon" v-if="!specialClause.length">
				</image>
				<textarea v-model="specialClause" maxlength="200" placeholder="     这里可以填写您的特殊条款~" />
				<view class=""
					style='text-align: right;font-size: 20rpx;margin-bottom: 42rpx;width: 100%;background-color: #F9F9F9;padding-right: 12rpx;height: 50rpx;'>
					<text style='color: #F43D1B;'>{{specialClause.length}}</text><text
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
				agreeIndex: 0,
				agreeShow: false,
				agreeList: [], //协议号列表
				selectIndex: 0, //当前优惠的index
				customInfo: uni.getStorageSync('customInfo'),
				selectShow: false,
				timeShow: false,
				selectList: [], //优惠列表
				trackContent: '',
				designAgreementNo: '', //设计协议号
				signDate: '', //签订日期
				depositUnitPrice: '', //定金单价
				designUnitPrice: '', //设计费单价
				specialClause: '', //合同特殊条款
				remark: '', //备注
				discountActivityId: '', //优惠活动id
				discountName: '', //优惠活动名字
				preIndedx: 0,
				pre: 'virtualID_',
				list: [], //文件列表
				attachIds: [], //文件id列表
				workFlowInfoId: '',
				workFlowNodeId: '',
				beforeDesignUnitPrice: '', //折前设计费单价
				afterDesignUnitPrice: '', //折后设计费单价
				title: '',
				isIos: uni.getStorageSync('isIos'),
				preImagePath: [],
				userCode: '',
				pwd: '',
				timeOut: true,
				numberTest: /(^-?[0-9]{1,7}$)|(^-?[0-9]{1,11}[\.]{1}[0-9]{1,4}$)/,
			}
		},
		onLoad(options) {
			this.userCode = this.vuex_user.zhiAccount
			this.pwd = this.vuex_user.zhiPwd
			this.title = options.title
			this.getDiscountList()
			this.workFlowInfoId = options.workFlowInfoId
			this.workFlowNodeId = options.workFlowNodeId
			this.getDesignNoList()
		},
		methods: {
			//获取协议号
			getDesignNoList() {
				this.$get({
					url: this.api.CustomWorkFlowInfo.getDesignNoList,
					data: {
						type: '1061-10',
						// sysOrganizationId:'12c885a188859ad23a83e7db42bafe65',
						sysOrganizationId: this.customInfo.storeId,
						isCancel: false,
						isUse: false,
						isWriteOff: false
					}
				}).then(res => {
					this.agreeList = res.rows
				})
			},
			selectAgreement() {
				this.agreeShow = true
			},
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
			delFile(index) {
				this.list.splice(index, 1)
				this.attachIds.splice(index, 1)
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
			//截取文件名
			substrFile(e) {
				var b = e.substr(e.lastIndexOf("/") + 1, e.length - e.lastIndexOf("/"));
				console.log(e)
				return b
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
				this.discountName = e[0].label
				this.discountActivityId = e[0].value
				this.selectList.forEach((item, index) => {
					if (item.id == e[0].value) {
						this.selectIndex = index
					}
				})
			},
			confirm2(e) {
				this.designAgreementNo = e[0].label
				this.agreeList.forEach((item, index) => {
					if (item.designNo == e[0].label) {
						this.agreeIndex = index
					}
				})
			},
			//获取活动列表
			getDiscountList() {
				this.$get({
					url: this.api.BasicCommonInfo.getList,
					data: {
						currentPage: 0,
						pageSize: 0
					}
				}).then(res => {
					this.selectList = res.rows
				})
			},
			select() {
				this.selectShow = true
			},
			timeSelect(e) {
				this.signDate = e.year + '-' + e.month + '-' + e.day
			},
			//提交
			submit() {
				let that = this
				if (!this.discountActivityId) {
					this.$Toast('请选择优惠活动')
					return
				}
				if (!this.signDate) {
					this.$Toast('请选择签订日期')
					return
				}
				if (!this.designAgreementNo) {
					this.$Toast('请选择设计协议号')
					return
				}
				if (!this.remark) {
					this.$Toast('请输入备注')
					return
				}
				if (!this.specialClause) {
					this.$Toast('请输入合同特殊条款')
					return
				}
				if (!this.designUnitPrice || !this.$dyncNumber(this.designUnitPrice, [11, 4])|| this.designUnitPrice<0) {
					this.$Toast('请输入正确设计费单价')
					return
				}
				if (!this.depositUnitPrice || !this.$dyncNumber(this.depositUnitPrice, [11, 4])|| this.depositUnitPrice<0) {
					this.$Toast('请输入正确定金单价')
					return
				}
				if (!this.beforeDesignUnitPrice || !this.$dyncNumber(this.beforeDesignUnitPrice, [11, 4]) || this.beforeDesignUnitPrice<0) {
					this.$Toast('请输入正确折前设计费')
					return
				}
				if (!this.afterDesignUnitPrice || !this.$dyncNumber(this.afterDesignUnitPrice, [11, 4])|| this.afterDesignUnitPrice<0) {
					this.$Toast('请输入正确折后设计费')
					return
				}
				if (this.timeOut) {
					this.timeOut = false
					setTimeout(function() {
						that.timeOut = true
					}, 3000)
					this.$post({
						url: this.api.CustomWorkFlowInfo.customerBindDesignContract,
						data: {
							pwd: this.pwd,
							userCode: this.userCode,
							customerId: this.customInfo.id,
							remark: this.remark,
							specialClause: this.specialClause,
							designAgreementNo: this.designAgreementNo,
							signDate: this.signDate,
							depositUnitPrice: this.depositUnitPrice,
							specialClause: this.specialClause,
							discountActivityId: this.discountActivityId,
							attachIds: this.attachIds,
							workFlowNodeId: this.workFlowNodeId,
							beforeDesignUnitPrice: this.beforeDesignUnitPrice,
							afterDesignUnitPrice: this.afterDesignUnitPrice,
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
