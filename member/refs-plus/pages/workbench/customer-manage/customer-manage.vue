<template>
	<view class="customerManege">
		<u-navbar :border='false' back-icon-color="#ffffff" :background="navbar_bg" class="navbar fl-cc"
			:border-bottom="false">
			<u-search mImage='/static/image/workbench/customer-manage/search.png' :uIconShow="false" bg-color="#ffffff"
				placeholder-color="#C0C0C0" v-model="customerName" @focus="otherShow=false" placeholder="请输入搜索客户名称"
				@change="searchList" :show-action="false">
			</u-search>
			<view v-if="!listBtns.length" class="search"></view>
			<view class="slot-wrap" slot="right" v-if="listBtns.length">
				<u-icon name="more-dot-fill" color="#ffffff" size="40" @click="otherShow=!otherShow"></u-icon>
			</view>
		</u-navbar>
		<image src="/static/image/tab-bar/new-bg.png" mode="" class="list-bg"></image>
		<view class="other" v-if="otherShow">
			<view class="other-y" @click="btnOperation(item,index)" v-for="(item,index) in listBtns">
				<image :src="item.icon ? icon[item.icon] : ''" mode="">
				</image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="tabs" @click="otherShow=false">
			<u-tabs class="tabs-detail" bg-color='none' :list="list" name='title'
				:is-scroll=" list.length > 6 ? true : false " :current="current" @change="change"
				active-color2="#FFFFFF" inactive-color="#FFFFFF" :bar-style="barStyle">
			</u-tabs>
			<view class="line"></view>
			<view class="" v-if="list[current].component != 'EnterLog'">
				<view class="custom-detail" v-for="(item,index) in customList" :key="index"
					@click="selectCustomer(index)">
					<image src="/static/image/workbench/worker-test/left.png" mode="" class="list-y-left"></image>
					<view class="custom-detail-select"
						v-show="eliminateShow || distributionShow || isAllocation || isDel || applyShow || examineShow">
						<template v-if="list[current].component == 'Original'">
							<u-checkbox v-model="item.checked" :disabled="item.blocked" shape="circle"
								active-color="#B80201"></u-checkbox>
						</template>
						<template v-else>
							<view class="custom-detail-select-s"
								v-if="(applyShow&&item.multiHouse)||(examineShow&&item.multiHouseAudit)"
								style="background-color: #ebedf0;">

							</view>
							<view class="" v-else>
								<view class="custom-detail-select-s" v-if="!item.select"></view>
								<image src="/static/image/workbench/renovation-data/select.png" v-else></image>
							</view>
						</template>
					</view>
					<view class="detail">
						<image src="/static/image/workbench/customer-manage/tx.png" class="customer-img">
						</image>
						<view class="detail-rg">
							<view class="top">
								<view class="info">
									<view
										style="display: flex;align-items: center;justify-content:  space-between;font-size: 28rpx;400;color: #B80201;margin-bottom: 10rpx;">
										<view class="custom-info">
											<text
												class="name">{{list[current].component == 'FlightOrderEscape' || list[current].component =='DesertedOrderEscape' || item.infoShow ? item.customerName : item.customerNameHide}}</text>
											<!-- 										<text class="number"
												v-if="item.mobileNumber">{{phoneNumShow(item.mobileNumber)}}</text> -->
											<!-- <text class="status"
												:style="{background : item.bgColor,color:item.color}">{{item.typeName}}</text> -->
										</view>
										<view v-if="list[current].name=='at-first-sight'">
											{{item.multiHouseStatus==1 || item.multiHouseStatus==2 ? (item.multiHouseStatus==1 ?'多房待审核':'多房已驳回'):'待一见'}}
										</view>
										<view v-else-if="list[current].name=='second-see'">
											{{item.multiHouseStatus==1 || item.multiHouseStatus==2 ? (item.multiHouseStatus==1 ?'多房待审核':'多房已驳回'):'待二见'}}
										</view>
										<view style="flex-shrink: 1;min-width: 60rpx;" v-else>
											{{item.multiHouseStatus==1 || item.multiHouseStatus==2 ? (item.multiHouseStatus==1 ?'多房待审核':'多房已驳回'):item.typeName}}
										</view>
									</view>
									<view style="display: flex;align-items: center;justify-content: space-between;">
										<view>
											<view class="address" v-if="item.infoShow">
												<image
													src="../../../static/image/workbench/customer-manage/address.png">
												</image>
												<text>{{item.finalAddress}}</text>
											</view>
											<view class="address" v-else>
												<image
													src="../../../static/image/workbench/customer-manage/address.png">
												</image>
												<text>{{item.areaNamePath}}</text>
											</view>
											<view class="style">
												<view class="area">{{(item.buildingArea ? item.buildingArea+'㎡':'暂无')}}
												</view>
												<view class="style" v-if="item.decorationStyleName">
													{{item.decorationStyleName}}
												</view>
											</view>
										</view>
										<view @click.stop="phone(item)"
											v-show="list[current].component !== 'FlightOrderEscape' && list[current].component !=='DesertedOrderEscape'">
											<image src="../../../static/image/workbench/customer-manage/phone.png"
												style="width: 44rpx;height: 44rpx;"></image>
										</view>
									</view>
								</view>
							</view>
							<view class="bottom fl-csb">
								<view class="bottom-lf fl-cc" @click.stop="tofollow(item)" style="align-items: center;">
									<view class="time">{{ item.lastFallowTime ? item.lastFallowTime+ "  跟进" : '暂无'}}
									</view>
									<image src="../../../static/image/tab-bar/arrow-rg.png"></image>
								</view>
								<template>
									<view class="bottom-rg">
										<!-- 原始公海池删除 -->
										<template v-if="hasBtnDel">
											<image v-if="!item.blocked" class="manage-icon"
												@click.stop="handleDel([item.id])"
												src="../../../static/image/icon/eliminate.png">
											</image>
										</template>
										<template v-else>
											<view class="" v-if="!item.multiHouseStatus">
												<image src="../../../static/image/icon/track.png" class="manage-icon"
													@click.stop="towritefollow(item)" v-if="hasBtnWrite"></image>
												<image class="manage-icon"
													src="../../../static/image/icon/eliminate2.png"
													@click.stop="showEliminate(item)" v-if="hasBtnEli">
												</image>
											</view>
										</template>
									</view>
								</template>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="center" v-else>
				<view class="journal-y" v-for="(val,index) in logList" :key="index">
					<view class="journal-info">
						<view class="journal-user">
							<image src="/static/image/mine/avatar-mis.png" mode=""></image>
							<view class="journal-user-text">
								<view class="">
									{{val.relationName}}
								</view>
								<view class="">
									{{val.orgName}}
								</view>
							</view>
						</view>
						<view class="journal-time">
							{{val.createdTime}}
						</view>
					</view>
					<view class="journal-title">
						{{val.typeName}}
					</view>
					<view class="journal-content">
						{{val.repeatType+'：'}}{{val.repeatAddress ? val.repeatAddress: ''}}{{val.repeatPhone ? val.repeatPhone :''}}
					</view>
				</view>
			</view>
			<u-modal v-model="show" :title-style='titleStyle' :confirm-style='confirmStyle' :cancel-style='camcelStyle'
				:content-style="contentStyle" :show-cancel-button='true' confirm-color='#B80201' :content="content"
				@confirm="eliminate()"></u-modal>
			<view
				v-if="(list[current].component != 'EnterLog'&&!customList.length) || (list[current].component == 'EnterLog' && !logList.length)"
				style="padding-top:236rpx ;text-align: center;">
				<image src="../../../static/image/workbench/customer-manage/nodata.png"
					style="width: 296rpx;height: 216rpx;margin-bottom: 32rpx;"></image>
				<view style='color: #999999;font-size: 32rpx;'>
					空空如也~
				</view>
			</view>

			<view class="botton-btn" v-if="eliminateShow && customerIds.length" @click="batchRejection">
				<text>
					剔除
				</text>
			</view>
			<view class="botton-btn" v-if="isDel && allocationIds.length" @click="handleDel(allocationIds)">
				<text>
					删除
				</text>
			</view>
			<view class="botton-btn" v-if="isAllocation && allocationIds.length" @click="handleSubmit">
				<text>
					确定
				</text>
			</view>
			<view class="botton-btn" v-if="applyShow && customerIds.length" @click="popupShow=true">
				<text>
					期房申请
				</text>
			</view>
			<view class="botton-btn" v-if="examineShow && customerIds.length" @click="popupShow=true">
				<text>
					期房审核
				</text>
			</view>
			<view v-if='customerIds.length||distributionShow || allocationIds.length'
				style="width: 100%;height: 100rpx;">
			</view>
		</view>
		<!-- 删除 && 批量删除 -->
		<u-modal v-model="showDelModel" :title-style='titleStyle' :confirm-style='confirmStyle'
			:cancel-style='camcelStyle' :content-style="contentStyle" :show-cancel-button="true" confirm-color='#B80201'
			content="是否确认删除客户？" @confirm="delCustomers()"></u-modal>
		<!-- 批量期房申请&&批量期房审核 -->
		<u-popup v-model="popupShow" mode="bottom" border-radius='16'>
			<view class="EarlyHouseApplicationStyle">
				<view class="EarlyHouseApplicationStyle-top">
					<view class="EarlyHouseApplicationStyle-top-cancel" @click='cancel'>
						取消
					</view>
					<view class="">
						<view class="EarlyHouseApplicationStyle-t" v-show="applyShow">
							期房申请
						</view>
						<view class="EarlyHouseApplicationStyle-t" v-show="examineShow">
							期房审核
						</view>
					</view>
					<view class="EarlyHouseApplicationStyle-top-confirm" @click="application">
						确定
					</view>
				</view>
				<scroll-view scroll-y="true" :scroll-top="scrollViewTop">
					<view style="max-height: 1000rpx;box-sizing: border-box;">
						<!-- 期房申请，提交 -->
						<view class="EarlyHouseApplicationStyle-submit" v-show="applyShow">
							<view class="" style="background-color: #F9F9F9;" :style="onFocus ? 'height: 900rpx;':''">
								<textarea maxlength="30" @focus='getMargin' @blur="removeMargin" :auto-blur="true"
									:adjust-position="false" v-model="applicationReason" placeholder="请输入申请原因"
									style="margin: 20rpx 0;"></textarea>
							</view>
						</view>
						<!-- 审核 -->
						<view class="EarlyHouseApplicationStyle-c2" v-show="examineShow">
							<view class="EarlyHouseApplicationStyle-c2-y">
								<text class="title">审核状态 </text>
								<view class="radios">
									<view class="radios-l" @click="rangeChange(0)">
										<image src="/static/image/workbench/customer-manage/dian.png" mode=""
											v-if="rangeIndex==0"></image>
										<view class="" v-else>

										</view>
										<text :class="rangeIndex==0 ? 'radios-l-s':''">通过</text>
									</view>
									<view class="radios-l" @click="rangeChange(1)">
										<image src="/static/image/workbench/customer-manage/dian.png" mode=""
											v-if="rangeIndex==1"></image>
										<view class="" v-else>

										</view>
										<text :class="rangeIndex==1 ? 'radios-l-s':''">不通过</text>
									</view>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-e" :style="onFocus ? 'height: 900rpx;':''">
								<!-- <text class="EarlyHouseApplicationStyle-submit-text">审核内容:</text> -->
								<textarea v-model="remark" @focus='getMargin' @blur="removeMargin" :auto-blur="true"
									:adjust-position="false" placeholder="请输入审核内容" maxlength="30"></textarea>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				applicationReason: '',
				remark: '',
				scrollViewTop: 0,
				onFocus: false,
				rangeIndex: 0,
				popupShow: false, //弹层
				applyShow: false, //期房审核
				examineShow: false, //期房申请
				popupName: '',
				customerName: '',
				distributionShow: false, //批量指派
				eliminateShow: false,
				otherShow: false, //搜索右边三个点展示
				isAllocation: false, // 是否分配
				isDel: false, // 是否批量删除
				showDelModel: false,
				show: false,
				content: '是否剔除',
				list: [],
				current: 0,
				barStyle: {
					background: '#ffffff'
				},
				navbar_bg: {
					background: 'none'
				},
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
					background: 'linear-gradient(90deg, #D80100 0%, #B80201 100%)',
					color: "#FFFFFF",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 40rpx 40rpx 31rpx'
				},
				customList: [],
				btnList: [],
				customerIds: [],
				allocationIds: [],
				type: '',
				currentPage: 1, //分页
				auditStatus: '1010-20', //默认通过
				high: '',
				low: '',
				logList: [],
				listBtns: [], //列表按钮
				listBtnsCurrent: '', //列表按钮当前index
				hasBtnDel: false, //是否拥有删除按钮权限
				hasBtnEli: false, //是否拥有剔除按钮权限
				hasBtnWrite: false, //是否拥有写跟进权限
			}

		},
		onLoad(options) {
			this.list = JSON.parse(options.tabs)
			let that = this
			// #ifdef APP-PLUS
			uni.getLocation({
				type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				geocode: true,
				success: function(res) {
					console.log(res)
					uni.setStorageSync('address', res.address.city + res.address.district + res.address.street)
					uni.setStorageSync('latitude', res.latitude)
					uni.setStorageSync('longitude', res.longitude)
					that.getWeather(res.address.city)
				},
				fail: function(res) {
					console.log(res)
				}
			});
			this.$u.vuex('vuex_platform', uni.getSystemInfoSync().platform.toLowerCase() === 'ios' ? true : false)
			uni.setStorageSync('isIos', uni.getSystemInfoSync().platform.toLowerCase() === 'ios' ? true : false)
			// #endif
		},
		onShow() {
			this.currentPage = 1
			this.customList = []
			this.logList = []
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			if (this.list[this.current].component == 'FlightOrderEscape' || this.list[this.current].component ==
				'DesertedOrderEscape') {
				this.getFlyList(this.list[this.current].component)
			} else if (this.list[this.current].component == 'EnterLog') {
				this.getRepeatRecord()
			} else {
				this.getList(this.list[this.current].component)
			}
			this.getJurisdiction(this.list[this.current].id)
		},
		methods: {
			//按钮操作
			btnOperation(item, index) {
				this.listBtnsCurrent = index
				if (item.key.indexOf('Add') != -1) {
					this.handleEntry()
				} else if (item.key.indexOf('Fishing') != -1) {
					this.fishing()
				} else if (item.key.indexOf('Distribution') != -1) {
					this.batchAllocation()
				} else if (item.key.indexOf('Delete') != -1) {
					this.batchDel()
				} else if (item.key.indexOf('Eliminate') != -1) {
					this.showBtn2()
				} else if (item.key.indexOf('ApplyFutureHouse') != -1) {
					this.apply()
				} else if (item.key.indexOf('ReviewFutureHouse') != -1) {
					this.showExamine()
				}
			},
			//获取录入日志列表
			getRepeatRecord() {
				// uni.showLoading({
				// 	title: '加载中',
				// 	mask: true
				// })
				this.$get({
					url: this.api.CustomInfo.getRepeatRecord,
					data: {
						pageSize: 6,
						currentPage: this.currentPage,
						relationName: this.customerName
					}
				}).then(res => {
					res.rows.forEach(item => {
						this.logList.push(item)
					})
					uni.hideLoading()
					// console.log(this.logList)
				}).catch(res => {
					uni.hideLoading()
				})
			},
			//获取天气
			getWeather(address) {
				uni.request({
					url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + address,
					method: 'GET',
					data: {
						city: address
					},
					success: res => {
						console.log(res)
						var obj = res.data;
						// this.high=obj.data.forecast[0].high;
						// this.low=obj.data.forecast[0].low
						uni.setStorageSync('weather', obj.data.forecast[0].type + obj.data.forecast[0].high)
					},
				});
			},
			//选择通过不通过
			rangeChange(e) {
				console.log(e[0])
				this.rangeIndex = e
				if (e == 0) {
					this.auditStatus = '1010-20'
				} else {
					this.auditStatus = '1010-30'
				}
			},
			//前往日志列表
			toJournal() {
				uni.navigateTo({
					url: 'journal'
				})
				this.otherShow = false
			},
			//期房申请
			futureHouseApply() {
				this.$post({
					url: this.api.CustomInfo.futureHouseApply,
					data: {
						id: this.customerIds,
						applicationReason: this.applicationReason
					}
				}).then(res => {
					this.popupShow = false
					this.applyShow = false
					this.$Toast('申请成功')
					// this.applicationReason = ''
					this.currentPage = 1
					this.customList = []
					if (this.list[this.current].component == 'FlightOrderEscape' || this.list[this.current]
						.component ==
						'DesertedOrderEscape') {
						this.getFlyList(this.list[this.current].component)
					} else {
						this.getList(this.list[this.current].component)
					}
					this.getJurisdiction(this.list[this.current].id)
				})
			},
			//期房审核
			examine(type) {
				this.$post({
					url: this.api.CustomInfo.audit,
					data: {
						ids: this.customerIds,
						status: this.auditStatus,
						auditContent: this.remark
					}
				}).then(res => {
					this.popupShow = false
					this.examineShow = false
					this.$Toast('审核成功')
					// this.applicationReason = ''
					this.currentPage = 1
					this.customList = []
					if (this.list[this.current].component == 'FlightOrderEscape' || this.list[this.current]
						.component ==
						'DesertedOrderEscape') {
						this.getFlyList(this.list[this.current].component)
					} else {
						this.getList(this.list[this.current].component)
					}
					this.getJurisdiction(this.list[this.current].id)
				})
			},
			//确认
			application() {
				if (this.applyShow) {
					if (!this.applicationReason) {
						this.$Toast('请先输入申请原因')
						return
					}
					this.futureHouseApply()
				}
				if (this.examineShow) {
					if (this.remark == '') {
						this.$Toast('审核内容不能为空！')
						return
					}
					this.examine('1056-20')
				}
			},
			//取消
			cancel() {
				this.popupShow = false
				this.remark = ''
				this.applicationReason = ''
			},
			//批量期房审核
			showExamine() {
				if (this.examineShow == true) {
					this.customList.forEach(item => {
						item.select = false
					})
				}
				this.examineShow = !this.examineShow
				this.applyShow = false
				// this.distributionShow = false
				this.otherShow = false
				this.eliminateShow = false
			},
			//批量期房申请
			apply() {
				if (this.applyShow == true) {
					this.customList.forEach(item => {
						item.select = false
					})
				}
				this.applyShow = !this.applyShow
				this.examineShow = false
				// this.distributionShow = false
				this.otherShow = false
				this.eliminateShow = false
			},
			getMargin(e) {
				// #ifdef APP-PLUS
				this.onFocus = true
				this.$nextTick(function() {
					this.scrollViewTop = 99999;
				})
				// #endif
			},
			removeMargin(e) {
				// #ifdef APP-PLUS
				this.onFocus = false
				this.scrollViewTop = 0;
				// #endif
			},
			//批量剔除
			batchRejection() {
				if (!this.customerIds.length) {
					this.$Toast('请选择')
					return
				}
				this.show = true
			},
			// 判断 是否展示操作按钮
			isShowActionBtn() {
				switch (this.list[this.current].component) {
					case 'Agreement':
						return true
					case 'Contract':
						return false
					case 'FlightOrderEscape':
						return false
					case 'DesertedOrderEscape':
						return false
					case 'EnterLog':
						return false
					case 'AgreementPool':
						return false
					default:
						return true
				}
			},
			// 批量分配
			batchAllocation() {
				this.isAllocation && this.customList.forEach(item => {
					item.select = false
				})
				this.isAllocation = !this.isAllocation
				this.otherShow = false
				// this.distributionShow = false
				this.eliminateShow = false
				this.isDel = false
			},
			batchDel() {
				this.isDel && this.customList.forEach(item => {
					item.select = false
				})
				this.isDel = !this.isDel
				this.otherShow = false
				// this.distributionShow = false
				this.eliminateShow = false
				this.isAllocation = false
			},
			//搜索
			searchList() {
				this.currentPage = 1
				this.customList = []
				this.logList = []
				if (this.list[this.current].component == 'FlightOrderEscape' || this.list[this.current].component ==
					'DesertedOrderEscape') {
					this.getFlyList(this.list[this.current].component)
				} else if (this.list[this.current].component == 'EnterLog') {
					this.getRepeatRecord()
				} else {
					this.getList(this.list[this.current].component)
				}
			},
			//上拉加载
			onReachBottom() {
				this.currentPage++
				if (this.list[this.current].component == 'FlightOrderEscape' || this.list[this.current].component ==
					'DesertedOrderEscape') {
					this.getFlyList(this.list[this.current].component)
				} else if (this.list[this.current].component == 'EnterLog') {
					this.getRepeatRecord()
				} else {
					this.getList(this.list[this.current].component)
				}
			},
			//捞取
			fishing() {
				let type = ''
				if (this.list[this.current].name == 'at-first-sight') {
					type = '1033-40'
				}
				if (this.list[this.current].name == 'second-see') {
					type = '1033-50'
				}
				if (this.list[this.current].name == 'agreement') {
					type = '1033-60'
				}
				this.$post({
					url: this.api.CustomInfo.getRandCustomer,
					data: {
						type: type
					},
					needResponse: true
				}).then(res => {
					this.$Toast(res.message)
					this.currentPage = 1
					this.customList = []
					this.getList(this.list[this.current].component)
					this.otherShow = false
				})
			},
			showEliminate(item) {
				this.show = true
				this.customerIds = [item.id]
				this.type = item.type
			},
			//剔除
			eliminate() {
				this.$post({
					url: this.api.CustomInfo.promoteCustomer,
					data: {
						customerIds: this.customerIds,
						status: '1054-40',
						type: this.type
					}
				}).then(res => {
					this.currentPage = 1
					this.customList = []
					this.getList(this.list[this.current].component)
					this.otherShow = false
					this.eliminateShow = false
				})
			},
			toDistribution() {
				if (this.customerIds.length != 0) {
					uni.navigateTo({
						url: '/pages/workbench/material-declare/set-remind?isAssign=true&customerIds=' + JSON
							.stringify(this.customerIds)
					})
					this.distributionShow = false
				} else {
					this.$Toast('请选择')
				}

			},
			selectCustomer(index) {
				if (this.eliminateShow || this.distributionShow || this.isAllocation || this.isDel || this.applyShow ||
					this
					.examineShow) {
					if ((this.applyShow && this.customList[index].multiHouse) || (this.examineShow && this.customList[
							index].multiHouseAudit) || this.list[this.current].component == 'Original') {
						return
					}
					// if(this.list[this.current].component == 'Original'){
					// 	console.
					// }
					this.customList[index].select = !this.customList[index].select
					this.type = this.customList[index].type
				} else {
					uni.setStorageSync('customInfo', this.customList[index])
					//如果是多房按钮不展示
					let btns = this.customList[index].multiHouseStatus ? [] : JSON.stringify(this.btnList)
					uni.navigateTo({
						url: 'customer-detail?btnList=' + btns + '&id=' + this.customList[
							index].id + '&key=' + this.list[this.current].component
					})

				}

			},
			showBtn1() {
				if (this.distributionShow == true) {
					this.customList.forEach(item => {
						item.select = false
					})
				}
				this.distributionShow = !this.distributionShow
				this.eliminateShow = false
				this.otherShow = false
			},
			showBtn2() {
				if (this.eliminateShow == true) {
					this.customList.forEach(item => {
						item.select = false
					})
				}
				this.eliminateShow = !this.eliminateShow
				// this.distributionShow = false
				this.otherShow = false
				this.applyShow = false
				this.examineShow = false
			},
			towritefollow(item) {
				uni.setStorageSync('customInfo', item)
				console.log(this.list[this.current].component)
				uni.navigateTo({
					url: "/pages/workbench/customer-manage/write-follow?customerId=" + item.id + '&type=' + item
						.type
				})
			},
			getJurisdiction(sitemapId) {
				let targetIds = []
				targetIds.push(this.vuex_user.id)
				this.vuex_user.roles.forEach(item => {
					targetIds.push(item.id)
				})
				this.listBtns = []
				this.hasBtnDel = false
				this.hasBtnEli = false
				this.hasBtnWrite = false
				this.$post({
					url: this.api.AuthUser.getAuthActionByTargetIds,
					data: {
						backstage: 0,
						sitemapId: sitemapId,
						targetIds: targetIds
					}
				}).then(res => {
					this.btnList = res
					uni.setStorageSync('btnList', res)
					res.forEach(item => {
						if (item.key.indexOf('List') != -1) {
							if (item.name.length > 5) {
								item.name = item.name.replace('批量', '')
							}
							res.show = false
							if (item.key.indexOf('WriteFollow') == -1) {
								this.listBtns.push(item)
							} else {
								this.hasBtnWrite = true
							}

						} else {
							if (item.key.indexOf('Delete') != -1) {
								this.hasBtnDel = true
							}
							if (item.key.indexOf('Eliminate') != -1) {
								this.hasBtnEli = true
							}
						}
					})
				})
			},
			//获取逃单飞单列表
			getFlyList(type) {
				// uni.showLoading({
				// 	title: '加载中',
				// 	mask: true
				// })
				this.$get({
					url: this.api.CustomInfo.getFlyOrEvasionOrderList,
					data: {
						type: type,
						customerName: this.customerName,
						pageSize: 6,
						currentPage: this.currentPage
					}
				}).then(res => {
					res.rows.forEach(item => {
						item.select = false
						this.customList.push(item)
					})
					uni.hideLoading()
					// this.customList = res.rows
				}).catch(res => {
					uni.hideLoading()
				})
			},
			//获取客户列表
			getList(type) {
				const data = {
					type: type == 'Original' ? '' : type,
					customerName: this.customerName,
					pageSize: 6,
					currentPage: this.currentPage,
					allData: type == 'Original' ? true : false
				}
				this.$post({
					url: this.api.CustomInfo.getList,
					data,
				}).then(res => {
					res.rows.forEach(item => {
						item.select = false
						this.customList.push(item)
					})
					uni.hideLoading()
					// this.customList = res.rows
				}).catch(res => {
					uni.hideLoading()
				})
			},
			tofollow(item) {
				if (item.multiHouseStatus) {
					return
				}
				uni.setStorageSync('customInfo', item)
				if (this.list[this.current].component == 'FlightOrderEscape' || this.list[this.current].component ==
					'DesertedOrderEscape') {
					uni.navigateTo({
						url: 'follow-list?id=' + item.customerId + '&type=' + item.type + '&key=' + this.list[this
							.current].component + '&hasBtnWrite=' + this.hasBtnWrite
					})
				} else {
					uni.navigateTo({
						url: 'follow-list?id=' + item.id + '&type=' + item.type + '&key=' + this.list[this.current]
							.component + '&hasBtnWrite=' + this.hasBtnWrite
					})
				}

			},
			// 删除
			handleDel(ids) {
				this.showDelModel = true
				this.customerIds = ids
			},
			delCustomers() {
				this.$post({
					url: this.api.CustomInfo.delCustomers,
					data: this.customerIds,
				}).then(res => {
					this.$Toast('删除成功！')
					this.currentPage = 1
					this.customList = []
					this.getList(this.list[this.current].component)
					this.showDelModel = false
				}).catch(err => {
					this.$Toast('删除失败！')
				})
			},
			change(index) {
				this.current = index;
				this.currentPage = 1
				this.customList = []
				this.isShowActionBtn()
				this.customerIds = []
				this.isAllocation = this.distributionShow = this.eliminateShow = this.applyShow = this.examineShow = this
					.isDel = false
				this.logList = []
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				if (this.list[this.current].component == 'FlightOrderEscape' || this.list[this.current].component ==
					'DesertedOrderEscape') {
					this.getFlyList(this.list[this.current].component)
				} else if (this.list[this.current].component == 'EnterLog') {
					this.getRepeatRecord()
				} else {
					this.getList(this.list[this.current].component)
				}
				this.getJurisdiction(this.list[index].id)
			},
			handleEntry() {
				uni.navigateTo({
					url: '/pages/workbench/customer-manage/customer-entry?key=' + this.list[this.current].component
				})
				this.otherShow = false
				this.eliminateShow = false
			},
			handleClick() {
				// uni.navigateTo({
				// 	url: '/pages/workbench/customer-manage/customer-detail'
				// })
			},
			//打电话
			phone(item) {
				this.$get({
					url: this.api.CloudCallInfo.getCloudPhone,
					data: {
						customerId: item.id
					},
					needResponse: true
				}).then(res => {
					console.log(res)
					uni.makePhoneCall({
						phoneNumber: res.message,
						success: function(res) {
							console.log(1)
						},
						fail: function(res) {
							console.log(2)
						}
					})
				})
			},
			handleSubmit() {
				// console.log(this.customerIds)
				if (!this.allocationIds.length) {
					this.$Toast('请选择分配客户')
					return
				}
				uni.navigateTo({
					url: './select-employee?allocationIds=' + JSON.stringify(this.allocationIds)
				})
			}
		},
		watch: {
			customList: {
				handler(val) {
					this.customerIds = []
					this.allocationIds = []
					val.forEach(item => {
						if (this.list[this.current].component == 'Original' && item.checked) {
							this.allocationIds.push(item.id)
						}
						// console.log(item)
						if (item.select) {
							this.customerIds.push(item.multiHouseAuditId)
						}
					})
				},
				deep: true
			}
		}
	}
</script>
<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style lang="scss" scoped>
	* {
		box-sizing: border-box;
	}

	.list-bg {
		width: 100%;
		height: calc(182rpx + var(--status-bar-height));
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		z-index: 9;
	}

	.center {

		// padding-top: 20rpx;
		.journal-y {
			width: 100%;
			padding: 24rpx 30rpx 32rpx 30rpx;
			background-color: #FFFFFF;
			margin-bottom: 20rpx;

			.journal-info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 34rpx;

				.journal-user {
					display: flex;
					align-items: center;

					image {
						width: 76rpx;
						height: 76rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}

					.journal-user-text {
						height: 76rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						view {
							font-size: 24rpx;
							font-weight: 500;
							color: #999999;

							&:first-child {
								font-size: 28rpx;
								font-weight: bold;
								color: #333333;
							}
						}
					}
				}

				.journal-time {
					color: #999999;
					font-size: 22rpx;
				}
			}

			.journal-title {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 12rpx;
			}

			.journal-content {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}
		}
	}

	.customerManege {
		width: 100%;
		height: 100vh;
		background: rgba(248, 248, 251, 0.5);

		.search {
			width: 90rpx;
		}

		.other {
			position: fixed;
			top: calc(88rpx + var(--status-bar-height));
			right: 12rpx;
			background-color: #FFFFFF;
			width: 208rpx;
			// height: 270rpx;
			// padding: 0 20rpx;
			padding-top: 26rpx;
			z-index: 9999;
			box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.16);
			border-radius: 25rpx;
			padding-bottom: 20rpx;

			.other-y {
				// margin-bottom: 32rpx;
				display: flex;
				align-items: center;
				height: 80rpx;
				padding-left: 20rpx;

				image {
					width: 28rpx;
					height: 28rpx;
					margin-right: 12rpx;
					flex-shrink: 0;
				}

				text {
					display: inline-block;
					width: 100%;
					height: 80rpx;
					line-height: 80rpx;
					border-bottom: 1rpx solid #F0F0F0;
					color: #333333;
					font-size: 28rpx;
				}

				&:last-child {
					text {
						border: none;
					}
				}
			}
		}

		.botton-btn {
			width: 100%;
			height: 100rpx;
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			padding: 0 30rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;

			text {
				display: inline-block;
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				font-size: 32rpx;
				color: #FFFFFF;
				font-weight: bold;
				border-radius: 45rpx;
				background-color: #B80201;
			}
		}

		.navbar {
			height: 88rpx var(--status-bar-height);

			.slot-wrap {
				padding-left: 26rpx;
				padding-right: 24rpx;

				.navbar-icon {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}

		.tabs {
			width: 100%;

			.tabs-detail {
				background-color: none !important;
				padding: 10rpx 0;
				width: 100%;
				border: none;
				// padding-bottom: 16rpx;
				position: fixed;
				z-index: 99;
				top: calc(80rpx + var(--status-bar-height));
				// border-bottom: 1rpx solid #F8F8FB;
			}

			.line {
				width: 100%;
				height: 122rpx;
			}

			.custom-detail {
				width: 100%;
				display: flex;
				align-items: flex-start;
				background-color: #FFFFFF;
				padding: 40rpx 30rpx 0 30rpx;
				margin-bottom: 20rpx;
				box-shadow: 0px 6px 10px #FAE3E2;
				position: relative;

				.list-y-left {
					width: 8rpx;
					height: 100%;
					position: absolute;
					top: 0rpx;
					left: 0rpx;
				}

				.custom-detail-select {
					margin-right: 36rpx;
					padding-top: 30rpx;

					.custom-detail-select-s {
						width: 36rpx;
						height: 36rpx;
						border-radius: 50%;
						border: 2rpx solid #C0C0C0;
					}

					image {
						width: 36rpx;
						height: 36rpx;
					}
				}

				.select-disabled {
					background: #efefef;

				}

				.detail {
					width: 100%;
					background-color: #FFFFFF;
					display: flex;
					align-items: flex-start;
					justify-content: space-between;

					.customer-img {
						width: 100rpx;
						height: 100rpx;
						flex-shrink: 0;
						margin-right: 20rpx;
					}

					.detail-rg {
						width: 100%;
						padding-top: 6rpx;

						.top {
							// height: 166rpx;
							padding-bottom: 28rpx;

							.info {
								width: 100%;

								.custom-info {
									font-size: 30rpx;
									font-weight: 400;
									color: #333333;
									padding-bottom: 10rpx;

									.number {
										padding-left: 20rpx;
									}

									.status {
										width: 48rpx;
										height: 32rpx;
										font-size: 20rpx;
										position: relative;
										left: 16rpx;
									}
								}

								.address {
									padding-bottom: 20rpx;
									width: 460rpx;
									text-overflow: ellipsis;
									overflow: hidden;
									white-space: nowrap;

									image {
										width: 18rpx;
										height: 24rpx;
									}

									text {
										padding-left: 12rpx;
										font-size: 26rpx;
										font-weight: 400;
										color: #999999;
									}
								}

								.style {
									display: flex;

									.area {
										height: 36rpx;
										line-height: 36rpx;
										font-size: 26rpx;
										font-weight: 400;
										color: #333333;
										padding-right: 26rpx;
									}

									.style {
										width: 110rpx;
										height: 36rpx;
										font-size: 22rpx;
										font-weight: 400;
										color: #333333;
										background: rgba(247, 247, 247, 0.5);
										border-radius: 4rpx;
									}
								}
							}

							.right {
								height: 182rpx;
								padding-left: 78rpx;
								position: relative;
								left: 440rpx;
								bottom: 144rpx;
								font-size: 28rpx;
								font-weight: 400;
								color: #B80201;

								// .state {
								// 	width: 100rpx;
								// 	position: relative;
								// 	top: 18rpx;
								// 	left: -12rpx;
								// 	flex-shrink: 1;
								// }

								.phone {
									position: relative;
									right: -8rpx;
									top: 54rpx;

									image {
										width: 44rpx;
										height: 44rpx;
									}
								}
							}
						}

						.bottom {
							width: 100%;
							height: 94rpx;
							border-top: 1rpx solid #F0F0F0;
							display: flex;
							align-items: center;
							justify-content: space-between;

							.bottom-lf {
								.time {
									padding-right: 12rpx;
								}

								image {
									width: 12rpx;
									height: 24rpx;
								}
							}

							.bottom-rg {
								.manage-icon {
									width: 56rpx;
									height: 56rpx;
									margin-left: 28rpx;
								}
							}
						}
					}
				}
			}
		}
	}

	.EarlyHouseApplicationStyle {
		background-color: #FFFFFF;
		height: auto;
		padding-bottom: 80rpx;

		.EarlyHouseApplicationStyle-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 112rpx;
			padding: 0 50rpx;
			border-bottom: 1rpx solid #EEEEEE;

			.EarlyHouseApplicationStyle-top-cancel {
				color: #AAAAAA;
				font-size: 30rpx;
			}

			.EarlyHouseApplicationStyle-top-confirm {
				color: #B80201;
				padding: 0 10rpx;
				font-size: 30rpx;
			}

			.EarlyHouseApplicationStyle-t {
				width: 100%;
				font-size: 32rpx;
				color: #333333;
				text-align: center;
				font-weight: bold;
			}
		}

		textarea {
			width: 100%;
			padding: 24rpx 20rpx;
			background-color: #F9F9F9;
			height: 228rpx;
			font-size: 30rpx;
			box-sizing: border-box;
			border-radius: 8rpx;
		}

		.EarlyHouseApplicationStyle-submit {
			padding: 0 40rpx;

			.EarlyHouseApplicationStyle-submit-text {
				height: 112rpx;
				line-height: 112rpx;
				font-size: 30rpx;
				color: #333333;
				font-weight: bold;
			}
		}

		.EarlyHouseApplicationStyle-c {
			width: 100%;
			padding: 0 30rpx 20rpx 30rpx;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;

			text {
				font-size: 28rpx;
				color: #333333;
				padding-top: 20rpx;
				flex-shrink: 0;
				margin-right: 20rpx;
			}

			textarea {
				width: 371rpx;
				height: 148rpx;
				background-color: #F9F9F9;
				border-radius: 8rpx;
				font-size: 26rpx;
				padding: 14rpx 20rpx;
			}
		}

		.EarlyHouseApplicationStyle-c2 {
			width: 100%;
			padding: 0 40rpx;

			.EarlyHouseApplicationStyle-c2-y {
				min-height: 112rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #EEEEEE;
				font-size: 30rpx;
				color: #333333;

				.title {
					font-weight: bold;
				}

				.content {
					display: inline-block;
					width: 500rpx;
					text-align: right;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.inputs {
					display: flex;
					align-items: center;

					image {
						width: 14rpx;
						height: 26rpx;
						margin-left: 14rpx;
					}
				}

				input {
					display: inline-block;
					width: 400rpx;
					text-align: right;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.radios {
					display: flex;
					align-items: center;

					.radios-l {
						margin-left: 50rpx;
						display: flex;
						align-items: center;

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
							color: #999999;
							font-size: 30rpx;
							margin-left: 6rpx;
						}

						.radios-l-s {
							color: #333333;
						}
					}
				}
			}

			.EarlyHouseApplicationStyle-c2-e {

				.EarlyHouseApplicationStyle-submit-text {
					display: inline-block;
					width: 100%;
					height: 112rpx;
					line-height: 112rpx;
					font-size: 30rpx;
					color: #333333;
					font-weight: bold;
				}
			}

		}

		.EarlyHouseApplicationStyle-b {
			height: 160rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 48rpx;

			view {
				width: 216rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 34rpx;
				border-radius: 40rpx;
			}

			.EarlyHouseApplicationStyle-b-confirm {
				background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
				color: #FFFFFF;
			}

			.EarlyHouseApplicationStyle-b-cancel {
				background-color: #F5F5F5;
				color: #333333;
			}
		}
	}
</style>
