<template>
	<view class="index" :style="{paddingBottom: ismodify==='true' ? '128rpx':'' }">
		<u-navbar :title="ismodify==='true' ? '单据明细':'申报确认'" :title-size='34' title-color='#333333' :titleBold="true"
			:border-bottom='false' class="navbar">
			<view slot='right' style="padding-right: 36rpx;color: #B80201;font-size: 28rpx;" @click="towrite"
				v-if="status!='1097-20'">
				{{ismodify==='true' ? '修改':'申报'}}
			</view>
		</u-navbar>
		<view class="remind" @click="setRemind">
			<view class="remind-title">
				提醒人
			</view>
			<view class="set">
				<text v-if="!reminderName.length">设置</text>
				<view class="" v-else>
					<text v-for="(name,index) in reminderName">{{name+' '}}</text>
				</view>
				<image src="/static/image/mine/right.png" mode=""></image>
			</view>
		</view>
		<view class="remind">
			<view class="">
				统一到场时间
			</view>
			<input type="text" v-model="unifiedArrivedTime" placeholder="请输入时间" @input="setAllTime" />
		</view>
		<view class="commodity" v-for="(item,index) in list" :key="index">
			<view class="commodity-info">
				<image src="/static/image/tab-bar/workbench-bg.png" mode="" class="commodity-info-img"></image>
				<view class="commodity-info-text">
					<view class="commodity-name">
						{{item.name}}
					</view>
					<view class="commodity-type">
						{{item.materialType ? item.materialType+';':''}}
						{{item.name ? item.name+';':''}}
						{{item.spec ? item.spec+';':''}}
						{{item.color ? item.color:''}}
					</view>
					<view class="commodity-from">
						{{item.areaName}}
					</view>
					<view class="commodity-much">
						<view class="money">
							<text>￥</text>{{item.price}}
						</view>
						<text class="number">x{{item.applyNum}}</text>
					</view>
				</view>
			</view>
			<view class="commodity-selects" v-if="ismodify==='false'">
				<view class="commodity-selects-tltle">
					配送方式
				</view>
				<view class="commodity-select">
					<view :class="item.deliveryMethod=='1096-10' ? 'commodity-select-s':'commodity-select-n'"
						style="margin-right: 40rpx;" @click="item.deliveryMethod='1096-10'">
						<image src="/static/image/workbench/product-dispatch/select.png" mode=""
							v-if="item.deliveryMethod=='1096-10'"></image>
						<view class="select-no" v-else>

						</view>
						<text>自提</text>
					</view>
					<view :class="item.deliveryMethod=='1096-20'  ? 'commodity-select-s':'commodity-select-n'"
						@click="item.deliveryMethod='1096-20'">
						<image src="/static/image/workbench/product-dispatch/select.png" mode=""
							v-if="item.deliveryMethod=='1096-20'"></image>
						<view class="select-no" v-else>

						</view>
						<text>配送</text>
					</view>
				</view>
			</view>
			<view class="commodity-input">
				<view class="">
					申请数量(付)
				</view>
				<input type="text" v-model="item.applyNum" placeholder="请输入申请数量" />
			</view>
			<view class="commodity-input">
				<view class="">
					换算量
				</view>
				<input type="text" v-model="item.transNum" placeholder="请输入换算量" />
			</view>
			<view class="commodity-input">
				<view class="">
					到场时间
				</view>
				<input type="text" v-model="item.arriveTime" placeholder="请输入到场时间" />
			</view>
			<view class="commodity-add-img" v-if="ismodify==='false'">
				<view class="commodity-add-img-title">
					申请图片
				</view>
				<view class="imgs">
					<u-upload ref="uUpload" width="138rpx" height="138rpx" :action="action"
						:formData="{attachType: '1009-20'}" :header="header" name="files" :auto-upload="false"
						max-count="3" :custom-btn="true" @on-uploaded="onUpload($event,index)">
						<view slot="addBtn">
							<image src="/static/image/mine/account/add.png"
								style="width: 138rpx; height: 138rpx;margin: 10rpx;">
							</image>
						</view>
					</u-upload>
				</view>
			</view>
			<view class="commodity-textarea">
				<view class="">
					申报备注
				</view>
				<textarea v-model="item.remark" placeholder="请输入备注内容" />
			</view>
		</view>
		<view class="btn" v-if="ismodify==='true'">
			<view class="btn-l" v-if="isAddMaterial&&status=='1097-10'" @click="edit('1097-20')">
				特权提交
			</view>
			<view :class="status=='1097-20' ? 'btn-r2': 'btn-r'" v-if="isPrivilegeSubmission" @click="toAdd">
				添加材料
			</view>
		</view>
		<u-popup v-model="showConfirm" mode="center" border-radius="16">
			<view class="confirm-show">
				<image src="/static/image/workbench/material-declare/finish.png" mode=""></image>
				<view class="confirm-show-text">
					操作成功
				</view>
				<view class="confirm-show-btn" @click="confirm">
					知道了
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				type: '',
				ismodify: true,
				select: false,
				showConfirm: false,
				detailDTOS: [],
				list: [],
				reminder: [], //提醒人id
				reminderName: [],
				action: '',
				header: {
					'X-Auth-Token': ''
				},
				uploadNumber: 0,
				customerId: '',
				stockId: '', //仓库id
				warehouseEmployeeId: '', //仓库管理员id
				id: '',
				isAddMaterial: false,
				isPrivilegeSubmission: false,
				isAdd: false, //是否材料添加
				relations: [], //材料添加时带过来的提醒人
				status: '1097-10',
				isRetreat: false,
				masterDeclarationType: '',
				unifiedArrivedTime: ''
			}
		},
		onLoad(options) {
			if (options.stockId) {
				this.stockId = options.stockId
			}
			if (options.warehouseEmployeeId) {
				this.warehouseEmployeeId = options.warehouseEmployeeId
			}
			if (options.id) {
				this.id = options.id
			}
			if (options.isAdd) {
				this.isAdd = options.isAdd
			}
			if (options.status) {
				this.status = options.status
				console.log(this.status)
			}
			if (options.masterDeclarationType) {
				this.masterDeclarationType = options.masterDeclarationType
			}
			if (options.unifiedArrivedTime) {
				this.unifiedArrivedTime = options.unifiedArrivedTime
			}
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
			this.type = options.type
			this.ismodify = options.ismodify
			this.customerId = options.customerId
			if (options.relations) {
				this.relations = JSON.parse(options.relations)
				JSON.parse(options.relations).forEach(item => {
					this.reminder.push(item.relationId)
					this.reminderName.push(item.relationName)
				})
			}
			JSON.parse(options.list).forEach(item => {
				let data = {
					applyNum: item.applyNum ? item.applyNum : 1,
					attachIds: [],
					brand: item.brand,
					arriveTime: item.arriveTime ? item.arriveTime : '',
					materialType: item.materialType,
					deliveryMethod: '1096-10',
					id: this.ismodify === 'false' ? '' : item.id,
					materialId: item.materialId,
					name: item.materialName,
					price: this.ismodify === 'false' ? item.salePrice : item.price,
					remark: item.remark ? item.remark : '',
					spec: item.spec,
					texture: item.texture,
					transNum: item.transNum ? item.transNum : '',
					typeSerial: item.typeSerial,
					workerType: item.workerType
				}
				this.list.push(data)
			})
			// this.list = JSON.parse(options.list)
			this.getJurisdiction()
		},
		methods: {
			//统一到场时间
			setAllTime() {
				this.list.forEach(item => {
					item.arriveTime = this.unifiedArrivedTime
				})
			},
			//材料添加
			addMaterial() {
				let reminders = []
				this.reminder.forEach(item => {
					let data = {
						relationId: item
					}
					reminders.push(data)
				})
				this.$post({
					url: this.api.AuxiliaryMaterialsInfo.addMaterial,
					data: {
						detailDTOS: this.list,
						reminders: reminders,
						stockId: this.stockId,
						warehouseEmployeeId: this.warehouseEmployeeId,
						id: this.id,
						unifiedArrivedTime: this.unifiedArrivedTime
					}
				}).then(res => {
					this.showConfirm = true
				})
			},
			//材料添加跳转
			toAdd() {
				if (this.type == '1095-10') {
					uni.navigateTo({
						url: 'main-list?type=' + this.type + '&customerId=' + this.customerId + '&isAdd=true' +
							'&id=' + this.id + '&relations=' + JSON.stringify(this.relations) +
							'&unifiedArrivedTime=' + this.unifiedArrivedTime
					})
				} else {
					uni.navigateTo({
						url: 'main-list?type=' + this.type + '&customerId=' + this.customerId + '&stockId=' + this
							.stockId + '&warehouseEmployeeId=' + this.warehouseEmployeeId + '&isAdd=true' +
							'&id=' + this.id + '&relations=' + JSON.stringify(this.relations) +
							'&unifiedArrivedTime=' + this.unifiedArrivedTime
					})
				}
			},
			//获取按钮权限
			getJurisdiction() {
				//全局（首页除外）
				this.$getJurisdiction().then(res => {
					res.forEach(item => {
						if (item.key.indexOf('PrivilegeSubmission') != -1) {
							this.isPrivilegeSubmission = true
						}
						if (item.key.indexOf('AddMaterial') != -1) {
							this.isAddMaterial = true
						}
					})
				})
			},
			onUpload(lists, index) {
				let files = []
				let attaches = []
				// files = this.$refs.uUpload[index].lists.filter(val => {
				// 	return val.progress == 100;
				// })
				files = lists.filter(val => {
					return val.progress == 100;
				})
				files.forEach(item => {
					attaches.push(item.response.result[0].id)
				})
				this.list[index].attachIds = attaches
				this.uploadNumber++
				if (this.uploadNumber === this.list.length) {
					// submit
					if (this.isAdd === 'true') {
						this.addMaterial()
					} else {
						this.edit('1097-10')
					}

				}
			},
			setRemind() {
				uni.navigateTo({
					url: '../customer-manage/set-remind'
				})
			},
			towrite() {
				if (this.ismodify === 'true') {
					this.edit('1097-10')
				} else {
					this.uploadNumber = 0
					for (let i = 0; i < this.$refs.uUpload.length; i++) {
						this.$refs.uUpload[i].upload()
					}
					// this.showConfirm = true
				}
			},
			//申请
			edit(status) {
				let reminders = []
				this.reminder.forEach(item => {
					let data = {
						relationId: item
					}
					reminders.push(data)
				})
				this.$post({
					url: this.api.AuxiliaryMaterialsInfo.edit,
					data: {
						customerId: this.customerId,
						detailDTOS: this.list,
						reminders: reminders,
						status: status,
						type: this.type,
						stockId: this.stockId,
						warehouseEmployeeId: this.warehouseEmployeeId,
						id: this.id,
						masterDeclarationType: this.masterDeclarationType,
						unifiedArrivedTime: this.unifiedArrivedTime
					}
				}).then(res => {
					this.showConfirm = true
				})
			},
			confirm() {
				uni.redirectTo({
					url: '/pages/workbench/material-declare/declare-list'
				})
				this.showConfirm = false
			}
		}
	}
</script>
<style>
	page {
		background-color: #F6F6F6;
	}
</style>
<style scoped lang="less">
	.confirm-show {
		width: 512rpx;
		height: 512rpx;
		background-color: #FFFFFF;
		padding-top: 60rpx;
		text-align: center;

		image {
			width: 250rpx;
			height: 239rpx;
			margin-bottom: 28rpx;
		}

		.confirm-show-text {
			color: #333333;
			font-size: 32rpx;
			margin-bottom: 20rpx;
		}

		.confirm-show-btn {
			width: 425rpx;
			line-height: 80rpx;
			text-align: center;
			height: 80rpx;
			margin: auto;
			border-radius: 48rpx;
			background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
			color: #FFFFFF;
			font-size: 34rpx;
		}
	}

	.index {

		.remind {
			margin: 20rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			background-color: #FFFFFF;
			height: 98rpx;

			input {
				font-size: 26rpx;
				text-align: right;
			}

			.remind-title {
				font-size: 28rpx;
				color: #333333;
			}

			.set {
				display: flex;
				align-items: center;

				text {
					color: #999999;
					font-size: 26rpx;
				}

				image {
					width: 13rpx;
					height: 24rpx;
					margin-left: 10rpx;
				}
			}
		}

		.commodity {
			padding: 0 30rpx;
			background-color: #FFFFFF;
			padding-bottom: 30rpx;
			margin-bottom: 20rpx;

			.commodity-info {
				padding: 24rpx 0;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #EEEEEE;
				margin-bottom: 16rpx;

				.commodity-info-img {
					width: 138rpx;
					height: 138rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
					border-radius: 16rpx;
				}

				.commodity-info-text {
					.commodity-name {
						color: #333333;
						font-size: 28rpx;
						font-weight: bold;
					}

					.commodity-type {
						color: #666666;
						font-size: 22rpx;
						margin-bottom: 8rpx;
					}

					.commodity-from {
						color: #999999;
						font-size: 22rpx;
					}

					.commodity-much {
						width: calc(100vw - 218rpx);
						display: flex;
						align-items: center;
						justify-content: space-between;

						.money {
							display: flex;
							align-items: flex-end;
							font-size: 28rpx;
							font-weight: bold;
							color: #B80201;

							text {
								font-size: 22rpx;
							}
						}

						.number {
							color: #999999;
							font-size: 28rpx;
						}
					}
				}
			}

			.commodity-input {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 16rpx;

				view {
					color: #333333;
					font-size: 28rpx;
				}

				input {
					color: #333333;
					font-size: 28rpx;
					text-align: right;
				}
			}

			.commodity-add-img {
				margin-bottom: 30rpx;

				.commodity-add-img-title {
					color: #333333;
					font-size: 28rpx;
					margin-bottom: 16rpx;
				}

				.imgs {
					display: flex;
					align-items: center;

					image {
						width: 138rpx;
						height: 138rpx;
						margin-right: 12rpx;
					}
				}
			}

			.commodity-selects {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 16rpx;

				.commodity-selects-tltle {
					color: #333333;
					font-size: 28rpx;
				}

				.commodity-select {
					display: flex;
					align-items: center;

					.select-no {
						width: 32rpx;
						height: 32rpx;
						border-radius: 50%;
						border: 1rpx solid #999999;
					}

					text {
						font-size: 28rpx;
						margin-left: 10rpx;
					}

					image {
						width: 32rpx;
						height: 32rpx;
					}

					.commodity-select-s {
						display: flex;
						align-items: center;
						color: #333333;
					}

					.commodity-select-n {
						display: flex;
						align-items: center;
						color: #999999;
					}
				}
			}

			.commodity-textarea {
				view {
					color: #333333;
					font-size: 28rpx;
					margin-bottom: 16rpx;
				}

				textarea {
					width: 690rpx;
					height: 128rpx;
					padding: 14rpx 20rpx;
					background-color: #F9F9F9;
					border-radius: 8rpx;
					font-size: 26rpx;
					box-sizing: border-box;
				}
			}
		}

		.btn {
			width: 100%;
			height: 128rpx;
			position: fixed;
			left: 0rpx;
			bottom: 0rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #FFFFFF;

			.btn-l {
				width: 330rpx;
				height: 88rpx;
				border-radius: 44rpx;
				border: 1rpx solid #B80201;
				line-height: 88rpx;
				text-align: center;
				color: #B80201;
				font-size: 32rpx;
			}

			.btn-r {
				width: 330rpx;
				height: 88rpx;
				border-radius: 44rpx;
				background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
				line-height: 88rpx;
				text-align: center;
				color: #FFFFFF;
				font-size: 32rpx;
				margin-left: 30rpx;
			}

			.btn-r2 {
				width: 600rpx;
				height: 88rpx;
				background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
				border-radius: 44rpx;
				text-align: center;
				line-height: 88rpx;
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}
	}
</style>
