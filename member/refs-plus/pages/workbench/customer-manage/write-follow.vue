<template>
	<view class="write">
		<u-navbar title="写跟进" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
			<view slot='right' style="padding-right: 36rpx;color: #B80201;font-size: 28rpx;" @click="towrite">
				提交
			</view>
		</u-navbar>
		<view class="" style="height: 74rpx;">

		</view>
		<view class="userinfo">
			<view class="info">
				<image src="/static/image/mine/avatar-mis.png" mode=""></image>
				<text>{{customInfo.infoShow ? customInfo.customerName : customInfo.customerNameHide}}</text>
			</view>
		</view>
		<view class="shownode">
			<text>当前节点</text>
			<view class="" v-if="selectType!==''">
				{{typeList[selectType].name}}
			</view>
		</view>
		<view class="nodeslist">
			<view class="title">
				跟踪类型<text>*</text>
			</view>
			<view class="nodes">
				<view :class="selectType===index ? 'node-a' : 'node' " v-for="(val,index) in typeList" :key="index"
					@click="select('selectType',index)">
					{{val.name}}
				</view>
			</view>
		</view>
		<view class="nodeslist">
			<view class="title">
				记录类型<text>*</text>
			</view>
			<view class="nodes">
				<view :class="selectFollow===index ? 'node-a' : 'node' " v-for="(val,index) in followList" :key="index"
					@click="select('selectFollow',index)">
					{{val.name}}
				</view>
			</view>
		</view>
		<view class="amount">
			<!-- 			<view class="">
				<text>下一阶段</text>
				<view class="selecttime" @click="showSelect('1033','nextTime')">
					<text :class="nextTime.value==='' ? 'grey': ''">{{nextTime.name}}</text>
					<image src="/static/image/workbench/customer-manage/right.png" mode=""
						style='width: 14rpx;height: 27rpx;'></image>
				</view>
			</view> -->
			<view class="amount-y">
				<text class="select-title">客户状态</text>
				<view class="selecttime" @click="showSelect('1057','status')">
					<view :class="status.value==='' ? 'grey': ''">{{status.name}}</view>
					<image src="/static/image/workbench/customer-manage/right.png" mode=""
						style='width: 14rpx;height: 27rpx;'></image>
				</view>
			</view>
			<!-- 			<view class="amount-y">
				<text class="select-title">跟踪定位</text>
				<view class="selecttime">
					<view :class="locationAddress==='' ? 'grey': ''">{{locationAddress}}</view>
				</view>
			</view> -->
			<view class="amount-y">
				<text class="select-title">设置提醒人</text>
				<view class="selecttime" @click="setRemind">
					<view :class="reminderName.length ? 'grey': ''">
						<text v-for="(val,index) in reminderName"
							:key='index'>{{index+1==reminderName.length ? val:val+','}}</text>
						<text v-if="!reminderName.length" class="grey">设置</text>
					</view>
					<image src="/static/image/workbench/customer-manage/right.png" mode=""
						style='width: 14rpx;height: 27rpx;'></image>
				</view>
			</view>
			<view class="amount-y" v-if="reminderName.length">
				<text class="select-title">提醒时间</text>
				<view class="selecttime" @click="timeShow=true">
					<view :class="timeName==='' ? 'grey': ''">{{timeName ?timeName :'请选择时间'}}</view>
					<image src="/static/image/workbench/customer-manage/right.png" mode=""
						style='width: 14rpx;height: 27rpx;'></image>
				</view>
			</view>
			<!-- 			<view class="">
				<text>常用语</text>
				<view class="selecttime" @click="showSelect('1045-30','often')">
					<text :class="often.value==='' ? 'grey': ''">{{often.name}}</text>
					<image src="/static/image/workbench/customer-manage/right.png" mode=""
						style='width: 14rpx;height: 27rpx;'></image>
				</view>
			</view> -->
			<!-- 			<view class="" v-if="nextTime.value=='1033-60'&&type!='1033-60'">
				<text>分总</text>
				<view class="selecttime" @click="showSelect('','subTotal')">
					<text :class="subTotal.value==='' ? 'grey': ''">{{subTotal.name}}</text>
					<image src="/static/image/workbench/customer-manage/right.png" mode=""
						style='width: 14rpx;height: 27rpx;'></image>
				</view>
			</view> -->
			<!-- 			<view class="" v-if="nextTime.value=='1033-70'&&type!='1033-70'">
				<text>设计经理</text>
				<view class="selecttime" @click="showSelect('','manager')">
					<text :class="manager.value==='' ? 'grey': ''">{{manager.name}}</text>
					<image src="/static/image/workbench/customer-manage/right.png" mode=""
						style='width: 14rpx;height: 27rpx;'></image>
				</view>
			</view> -->
		</view>
		<u-select v-model="selectShow" confirm-color="#B80201" :default-value='[selectIndex]' :value-name="valueName" :list="selectList"
			@confirm='confirm' label-name="name">
		</u-select>
		<u-select v-model="oftenShow" confirm-color="#B80201" :default-value='[often.index]' value-name="id" :list="oftenList"
			@confirm='confirm2' label-name="words">
		</u-select>
		<u-picker mode="time" v-model="timeShow" :params="params" @confirm="selectTime" start-year="2022"></u-picker>
		<!-- <u-calendar v-model="showFitTime" :mode="mode" @change='selectFitTime'></u-calendar> -->
		<view class="" style='padding: 30rpx;background-color: #FFFFFF;padding-bottom: 50rpx;'>
			<view class="title" style="display: flex;align-items: center;justify-content: space-between;">
				<text>跟踪记录内容</text>
				<text style="color: #B80201;font-size: 28rpx;font-weight: 400;"
					@click="showSelect('1045-30','often')">选择常用语</text>
			</view>
			<view class="content" style='background-color: #F9F9F9;padding: 20rpx;border-radius: 8rpx;position: relative;'>
				<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon" v-if="!trackContent.length"></image>
				<textarea style="height: 226rpx;width: 100%;" maxlength="200" v-model="trackContent"
					placeholder="     这里可以填写您的跟踪记录内容~" />
				<view class="" style='text-align: right;font-size: 20rpx;margin-bottom: 40rpx;'>
					<text style='color: #F43D1B;'>{{trackContent.length}}</text><text
						style='color: #B2B2B2;'>/200</text>
				</view>
				<u-upload ref="uUpload" width="196rpx" height="196rpx" :action="action"
					:formData="{attachType: '1009-20'}" :header="header" name="files" :auto-upload="false" max-count="3"
					:custom-btn="true" @on-uploaded="onUpload" @on-list-change="listChange">
					<view slot="addBtn">
						<image src="/static/image/mine/account/add.png"
							style="width: 196rpx; height: 196rpx;margin: 0;">
						</image>
					</view>
				</u-upload>
			</view>
		</view>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				timeName: '',
				timeShow: false, //时间
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true
				},
				customInfo: uni.getStorageSync('customInfo'),
				typeList: [],
				followList: [],
				selectType: '',
				selectFollow: '',
				showFitTime: false,
				mode: 'date',
				nextTime: {
					name: '请选择下一阶段类型',
					value: '',
					index: 0,
					valueName: 'value'
				},
				status: {
					name: '请选择客户状态',
					value: '',
					index: 0,
					valueName: 'value'
				},
				often: {
					name: '请选择常用语',
					value: '',
					index: 0
				},
				subTotal: {
					name: '请选择分总',
					value: '',
					index: 0,
					valueName: 'id'
				},
				manager: {
					name: '请选择设计经理',
					value: '',
					index: 0,
					valueName: 'id'
				},
				showFollowTime: false,
				action: '',
				header: {
					'X-Auth-Token': ''
				},
				image: 0,
				customerId: '',
				trackContent: '',
				selectShow: false,
				selectList: [], //当前选项列表
				selectIndex: 0, //当前选项列表的index
				selectName: '', //当前选项列表的名称
				oftenShow: false,
				oftenList: [],
				valueName: '',
				employeeType: '',
				employeeId: '',
				locationAddress: uni.getStorageSync('address'), //跟踪定位
				latitude: uni.getStorageSync('latitude'),
				longitude: uni.getStorageSync('longitude'),
				reminder: [],
				reminderName: []
			}
		},
		onLoad(options) {
			this.action = variable.apiServer + this.api.common.upload +"?customerId="+this.customInfo.id // variable.apiServer + this.$api.common.upload
			console.log(this.action)
			this.header['X-Auth-Token'] = this.vuex_token
			this.getTypeList(1037, 'typeList')
			this.getTypeList(1038, 'followList')
			this.customerId = options.customerId
			this.getOftenList('1045-30')
			this.type = options.type
		},
		methods: {
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
				// if(str.indexOf('y') != -1){
				// 	str = str.replace('y', year)
				// }
				// if(str.indexOf('m') != -1){
				// 	str = str.replace('m', month)
				// }
				// if(str.indexOf('d') != -1){
				// 	str = str.replace('d', day)
				// }
				// if(str.indexOf('h') != -1){
				// 	str = str.replace('h', hour)
				// }
				// if(str.indexOf('i') != -1){
				// 	str = str.replace('i', minute)
				// }
				// if(str.indexOf('s') != -1){
				// 	str = str.replace('s', second)
				// }
				// return str;
			},
			selectTime(e) {
				let isNow = this.dateTimeStr(e)
				if (isNow) {
					this.timeName = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute
				} else {
					this.$Toast('请选择大于等于当前时间')
				}
			},
			setRemind() {
				uni.navigateTo({
					url: 'set-remind'
				})
			},
			//打开地图
			openMap() {
				let that = this
				uni.getLocation({
					type: 'wgs84', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						const latitude = res.latitude;
						const longitude = res.longitude;
						uni.chooseLocation({
							latitude: latitude,
							longitude: longitude,
							success: function(res) {
								console.log(res)
								that.locationAddress = res.address
								that.latitude = res.latitude
								that.longitude = res.longitude
							},
							fail: function(res) {
								console.log(res)
							}
						});
					},
					fail: function(res) {
						console.log(res)
					}
				});
			},
			//获取分总
			getEasyList() {
				this.$post({
					url: this.api.Employee.getEasyList,
					data: {
						currentPage: 0,
						pageSize: 0,
						positionCode: this.employeeType
					}
				}).then(res => {
					this.selectList = res.rows
					this.selectShow = true
				})
			},
			//确认选择（除常用语外
			confirm(e) {
				//当重新选择下一阶段时清空分总和设计经理
				if (this.selectName == 'nextTime') {
					if (this[this.selectName].value != e[0].value) {
						this.employeeType = ''
						this.subTotal = {
							name: '请选择分总',
							value: '',
							index: 0,
							valueName: 'id'
						}
						this.manager = {
							name: '请选择设计经理',
							value: '',
							index: 0,
							valueName: 'id'
						}
					}
				}
				//当选择的是分总或经理时，赋值employeeId
				if (this.selectName == 'subTotal' || this.selectName == 'manager') {
					this.employeeId = e[0].value
				}
				this[this.selectName].name = e[0].label
				this[this.selectName].value = e[0].value
				this.selectList.forEach((item, index) => {
					if (item[this.valueName] == e[0].value) {
						this[this.selectName].index = index
					}
				})
			},
			//常用语的确认选择
			confirm2(e) {
				this.trackContent = this.trackContent + e[0].label
				this.oftenList.forEach((item, index) => {
					if (item.id == e[0].value) {
						this.often.index = index
					}
				})
			},
			showSelect(type, name) {
				if (name == 'often') {
					this.oftenShow = true
				} else {
					if (name == 'subTotal' || name == 'manager') {
						if (name == 'subTotal') {
							this.employeeType = '1042-03'
						}
						if (name == 'manager') {
							this.employeeType = "1042-05"
						}
						this.getEasyList()
					} else {
						this.getSelectList(type)
					}
					this.selectName = name
					this.selectIndex = this[name].index
					this.valueName = this[name].valueName
				}
			},
			getOftenList(type) {
				this.$post({
					url: this.api.CommonWords.getList,
					data: {
						code: type
					}
				}).then(res => {
					this.oftenList = res.rows
				})
			},
			getSelectList(type) {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: type
					}
				}).then(res => {
					if (type == '1033') {
						let indexOf = 0
						res.rows.forEach((item, index) => {
							if (item.value == this.type) {
								indexOf = index
							}
						})
						res.rows = res.rows.slice(indexOf, res.rows.length)
					}
					this.selectList = res.rows
					this.selectShow = true
				})
			},
			towrite() {
				let files = this.$refs.uUpload.lists
				if (this.reminderName.length) {
					if (this.timeName == '') {
						this.$Toast('请选择提醒时间！')
						return
					}
				}
				// if (this.nextTime.value == '1033-60' && this.subTotal.value == '' && this.type != '1033-60') {
				// 	this.$Toast('请选择分总！')
				// 	return
				// }
				// if (this.nextTime.value == '1033-70' && this.manager.value == '') {
				// 	this.$Toast('请选择设计经理！')
				// 	return
				// }
				if (this.selectFollow === '') {
					this.$Toast('请选择记录类型！')
					return
				}
				if (this.selectType === '') {
					this.$Toast('请选择跟踪类型！')
					return
				}
				// if (this.trackContent === '') {
				// 	this.$Toast('请输入内容！')
				// 	return
				// }
				// if (!files.length) {
				// 	this.$Toast('请填写图片！')
				// 	return
				// }
				// if (!this.nextTime.value) {
				// 	this.$Toast('请选择下一阶段类型！')
				// 	return
				// }
				if (!this.status.value) {
					this.$Toast('请选择客户状态！')
					return
				}
				// if(!this.often.value){
				// 	this.$Toast('请选择常用语！')
				// 	return
				// }
				this.$refs.uUpload.upload();
			},
			saveData(attaches = []) {
				this.$post({
					url: this.api.CustomInfo.trackingCustomer,
					data: {
						attachIds: attaches,
						remark: this.trackContent,
						customerIds: [this.customerId],
						recordType: this.followList[this.selectFollow].value,
						trackType: this.typeList[this.selectType].value,
						stage: this.status.value,
						// stage: this.type,
						// type: this.nextTime.value,
						employeeType: this.employeeType,
						employeeId: this.employeeId,
						reminder: this.reminder,
						latitude: this.latitude,
						longitude: this.longitude,
						locationAddress: this.locationAddress,
						remindTime: this.timeName
					}
				}).then(res => {
					this.$Toast('提交成功！')
					setTimeout(() => {
						uni.navigateBack()
					}, 2000)
				}).catch(e => {
					this.$Toast(e)
				})
			},
			getTypeList(type, name) {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: type
					}
				}).then(res => {
					this[name] = res.rows
				})
			},
			listChange(list, name) {
				this.image = list.length

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
			select(name, index) {
				if (this[name] === index) {
					this[name] = ''
				} else {
					this[name] = index
				}
			},
			selectFitTime(e) {
				this.fitTime = e.result
			},
			selectFollowTime(e) {
				this.followTime = e.result
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
	.write {
		.writeIcon{
			position: absolute;
			width: 28rpx;
			height: 25rpx;
			top: 32rpx;
			left: 24rpx;
			z-index: 9;
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

		.shownode {
			height: 88rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;

			text {
				font-size: 28rpx;
				color: #666666;
			}

			view {
				padding: 4rpx 16rpx 2rpx 16rpx;
				background-color: #E1FAFA;
				border-radius: 4rpx;
				font-size: 24rpx;
				color: #0AB4B3;
				margin-left: 16rpx;
			}
		}

		.nodeslist {
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			padding: 32rpx 30rpx;

			.title {
				display: flex;
				align-items: flex-start;
				font-size: 32rpx;
				color: #333333;
				font-weight: bold;
				margin-bottom: 24rpx;

				text {
					font-size: 32rpx;
					color: #B80201;
				}
			}

			.nodes {
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				view {
					width: 218rpx;
					height: 80rpx;
					border-radius: 8rpx;
					margin-right: 18rpx;
					margin-bottom: 18rpx;
					line-height: 80rpx;
					text-align: center;
					font-size: 24rpx;

					&:nth-child(3n) {
						margin-right: 0rpx;
					}
				}

				.node {
					background-color: #F9F9F9;
					color: #333333;
				}

				.node-a {
					background-color: #B80201;
					color: #FFFFFF;
				}
			}

			textarea {
				width: auto;
				height: 192rpx;
				padding: 24rpx 20rpx;
				background-color: #F9F9F9;
				font-size: 28rpx;
				border-radius: 8rpx;
			}

			.followtime {
				height: 112rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				text {
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}

				.selecttime {
					display: flex;
					align-items: center;

					.grey {
						color: grey;
					}

					image {
						width: 14rpx;
						height: 27rpx;
						margin-left: 14rpx;
					}

					text {
						font-size: 32rpx;
						color: #D0D0D0;
						font-weight: 400;
					}
				}
			}
		}

		.title {
			margin-bottom: 24rpx;
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
		}

		.huxing {
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			padding: 30rpx;

			.title {
				margin-bottom: 24rpx;
				font-size: 32rpx;
				color: #333333;
				font-weight: bold;
			}

			image {
				width: 222rpx;
				height: 222rpx;
				margin-right: 12rpx;
				margin-bottom: 20rpx;
			}

			.imgs {
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				image {
					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}

		.amount {
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			padding: 0 30rpx;

			.amount-y {
				min-height: 112rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #F0F0F0;

				&:last-child {
					border: none;
				}

				text {
					display: inline-block;
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}

				.select-title {
					display: inline-block;
					width: 200rpx;
					flex-shrink: 1;
				}

				input {
					color: #333333;
					font-size: 32rpx;
					text-align: right;
				}

				.selecttime {
					display: flex;
					align-items: center;

					.grey {
						color: grey;
					}

					image {
						width: 26rpx;
						height: 28rpx;
						margin-left: 16rpx;
					}

					view {
						width: 480rpx;
						display: inline-block;
						font-size: 32rpx;
						color: #333333;
						font-weight: 400;
						word-wrap: break-word;
						text-align: right;

						text {
							font-weight: 400;
						}
					}
				}
			}
		}
	}
</style>
