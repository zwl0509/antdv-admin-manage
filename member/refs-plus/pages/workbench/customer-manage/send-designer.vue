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
			<view class="setInput">
				<text>派单用户</text>
				<view class="setInput-r" @click="tosalesman">
					<input type="text" v-model="employeeName" :disabled="true" placeholder="请选择" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
			<view class="setInput">
				<text>派单理由</text>
				<view class="setInput-r">
					<input type="text" maxlength="50" v-model="reason" placeholder="请输入派单理由" />
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
		<u-select v-model="selectShow" :default-value='[selectIndex]' value-name="id" :list="selectList"
			@confirm='confirm' label-name="name">
		</u-select>
		<view class="center" style="padding-bottom: 40rpx;">
			<view class="title">
				特殊派单理由
			</view>
			<view class="" style="position: relative;">
				<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon" v-if="!specialReason.length">
				</image>
				<textarea maxlength="200" v-model="specialReason" placeholder="     这里可以填写您的特殊条款~" />
				<view class=""
					style='text-align: right;font-size: 20rpx;width: 100%;background-color: #F9F9F9;padding-right: 12rpx;height: 50rpx;'>
					<text style='color: #F43D1B;'>{{specialReason.length}}</text><text
						style='color: #B2B2B2;'>/200</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customInfo: uni.getStorageSync('customInfo'),
				trackContent: '',
				selectShow: false,
				timeShow: false,
				selectList: [],
				selectIndex: 0,
				employeeId: '', //派单用户id
				employeeName: '', //派单用户名字
				reason: '', //派单理由
				specialReason: '', //特殊派单理由
				workFlowInfoId: '',
				workFlowNodeId: '',
				employeePositionIds: [],
				title: '',
				userCode: '',
				pwd: '',
				timeOut: true
			}
		},
		onLoad(options) {
			this.userCode = this.vuex_user.zhiAccount
			this.pwd = this.vuex_user.zhiPwd
			this.title = options.title
			this.workFlowInfoId = options.workFlowInfoId
			this.workFlowNodeId = options.workFlowNodeId
			// this.employeePositionIds=options.employeePositionIds
			// this.getEasyList(JSON.parse(options.employeePositionIds))
		},
		methods: {
			tosalesman() {
				uni.navigateTo({
					url: 'saleman?employeeId=' + this.employeeId
				})
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
			confirm(e) {
				this.employeeId = e[0].value
				this.employeeName = e[0].label
				this.selectList.forEach((item, index) => {
					if (item.id == e[0].value) {
						this.selectIndex = index
					}
				})
			},
			//提交
			submit() {
				let that=this
				if (!this.employeeId) {
					this.$Toast('请选择派单用户')
					return
				}
				if (!this.reason) {
					this.$Toast('请输入派单理由')
					return
				}
				if (this.timeOut) {
					this.timeOut=false
					setTimeout(function() {
						that.timeOut=true
					}, 3000)
					this.$post({
						url: this.api.CustomWorkFlowInfo.editCustomerRelatedEmployee,
						data: {
							customerIds: [this.customInfo.id],
							employeeId: this.employeeId,
							reason: this.reason,
							specialReason: this.specialReason,
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
				}else{
					this.$Toast("请勿重复点击")
				}

			},
			select() {
				this.selectShow = true
			},
			//获取分总
			getEasyList(employeePositionIds) {
				console.log(employeePositionIds)
				this.$post({
					url: this.api.Employee.getEasyList,
					data: {
						currentPage: 0,
						pageSize: 0,
						// ids: employeePositionIds 
						positionIds: employeePositionIds
					}
				}).then(res => {
					this.selectList = res.rows
				})
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
		z-index: 99999;
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
