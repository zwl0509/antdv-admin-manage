<template>
	<view class="customer-entry">
		<!-- 		<u-navbar title="客户录入" :border-bottom='false' class="navbar" :isFixed="true"></u-navbar> -->
		<!-- 		<view class="" style="height: 88rpx;">

		</view> -->
		<view class="tabs">
			<view :class="currentIndex==index ? 'tab' : 'tabs-r' " @click="changeTab(index)"
				v-for="(val,index) in tabList" :key='index'>
				{{val.name}}
				<view class="tabs-bar" v-show="currentIndex==index">

				</view>
			</view>
		</view>
		<view class="" style="height:130rpx;">

		</view>
		<view class="userinfo">
			<view class="" v-for="(val,index) in infoList[currentIndex]" :key="index">
				<view class="userinfo-title" v-if="val.type=='none'">
					{{val.textname}}
				</view>
				<view class="userinfo-input" v-if="val.type=='input' && val.show">
					<view class="userinfo-text">
						{{val.textname}} <text v-if="val.must">*</text>
					</view>
					<!-- @blur="addUnit(val)" @focus="delUnit(val)" -->
					<u-input class="userinfo-input-in" :placeholder-style='placeholderStyle' :type="val.inputType"
						v-model="info[val.infoname]" :maxlength="val.maxlength" :placeholder="val.placeholder"
						:disabled="val.disabled" />
				</view>
				<view class="userinfo-select" v-if="val.type=='select'&&judge(val)&&val.show" @click="selectshow(val)"
					:style="index==3&&currentIndex==1 ? margin:''">
					<view class="userinfo-select-l">
						<view class="userinfo-text">
							{{val.textShow ? val.textname : ''}} <text v-if="val.must">*</text>
						</view>
						<text
							:class="info[val.infoname].name=='' ? '':'userinfo-text-s'">{{info[val.infoname].name=='' ? '请选择'+val.textname:info[val.infoname].name}}</text>
					</view>
					<image src="/static/image/mine/right.png" mode="" class="userinfo-select-r"></image>
				</view>
				<view class="userinfo-select" v-if="val.infoname=='city'" @click="selectshow2(index2)"
					:style="index==3&&currentIndex==1 ? margin:''" v-for="(val2,index2) in areaText" :key="index2">
					<view class="userinfo-select-l">
						<view class="userinfo-text">
						</view>
						<text :class="val2=='请选择' ? '':'userinfo-text-s'">{{val2}}</text>
					</view>
					<image src="/static/image/mine/right.png" mode="" class="userinfo-select-r"></image>
				</view>
				<view class="userinfo-select" v-if="val.infoname=='city'&&area.show" @click="area.showSelect=true"
					:style="index==3&&currentIndex==1 ? margin:''">
					<view class="userinfo-select-l">
						<view class="userinfo-text">
						</view>
						<text :class="area.text=='请选择小区' ? '':'userinfo-text-s'">{{area.text}}</text>
					</view>
					<image src="/static/image/mine/right.png" mode="" class="userinfo-select-r"></image>
				</view>
				<view class="userinfo-radio" v-if="val.type=='radio'">
					<view class="userinfo-text">
						{{val.textname}}
					</view>
					<view class="radios">
						<view class="radio" @click="radioSelect(val,index2)" v-for="(val2,index2) in val.list"
							:key='index2'>
							<image src="/static/image/workbench/customer-manage/dian.png" mode=""
								v-if="val.select==index2"></image>
							<view class="no-select" v-else></view>
							<text :class="val.select==index2 ? 'text':''">{{val2.name}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="remarks" v-show="currentIndex==0">
				<view class="remarks-text">
					客户备注
				</view>
				<textarea :auto-blur="true" @keyboardheightchange="keyboardheightchange" :hold-keyboard="true"
					placeholder-style="color:#999999;font-size: 30rpx" v-model="info.remark" placeholder="请输入备注"
					maxlength="100" />
			</view>
			<!-- 			<view class="userinfo-input" v-show="currentIndex==1">
				<view class="userinfo-text" @click="openMap">
					客户定位
				</view>
				<view class="userinfo-input-in" @click="openMap" style="width: 75%;color: grey;">
					<text :class="info.locationAddress=='' ? '':'userinfo-input-ins'">{{info.locationAddress ? info.locationAddress : '请选择'}}</text>
				</view>
			</view> -->
		</view>
		<view class="" v-if="selectList[currentSelect]">
			<u-select confirm-color='#B80201' :title="selectList[currentSelect].title" v-model="show"
				:default-value=[selectList[currentSelect].index] :value-name="selectList[currentSelect].valueName"
				:list="selectList[currentSelect].list" @confirm='confirm' :label-name="selectList[currentSelect].name">
			</u-select>
		</view>
		<view class="" v-if="areaList[showIndex]">
			<u-select v-model="show2" confirm-color='#B80201' :list="areaList[showIndex]" value-name="id"
				:default-value=[areaIndex[showIndex]] @confirm='confirm2' label-name="name">
			</u-select>
		</view>
		<view class="" v-if="area.list">
			<!-- 			<u-select v-model="area.showSelect" confirm-color='#B80201' :list="area.list" :isSearch="true" value-name="id"
				:default-value='[area.index]' @confirm='confirm3' label-name="name" ref="uSearch" @search="areaSearch">
			</u-select> -->
			<u-picker confirm-color='#B80201' mode="selector" range-key="name" ref="uSearch" :isSearch="true"
				:default-selector="[area.index]" v-model="area.showSelect" :range="area.list" @confirm='confirm3' @search="areaSearch">
			</u-picker>
		</view>
		<view class="">
			<u-popup v-model="showPopup" mode="bottom" border-radius='20'>
				<view class="popups">
					<view class="popups-title">
						<text class="popups-title-l" @click="showPopup=false">取消</text>
						<text class="popups-title-c">请选择门店</text>
						<text class="popups-title-r" @click="showPopup=false">确认</text>
					</view>
					<view class="">
						<u-tabs class="tabs-detail" :list="storeTabList" name='name' :is-scroll="true"
							:current="storeCurrent" @change="change" activeColor2="#333333" inactive-color="#333333"
							bg-color='#F9F9F9' :bar-style="barStyle">
						</u-tabs>
					</view>
					<scroll-view scroll-y="true" style="height: 800rpx;">
						<view class="popups-content">
							<view :class="val.select ? 'popups-content-item-s':'popups-content-item'"
								v-for="(val,index) in storeList" :key="index" @click="selectStore(val)">
								{{val.name}}
							</view>
						</view>
					</scroll-view>
				</view>
			</u-popup>
		</view>
		<!-- 多房申请 -->
		<u-modal v-model="moreHouseShow" :show-cancel-button="true" confirm-color='#B80201'
			content="手机号或详细地址已被录入,是否多房申请？" @confirm="moreHouseConfirm"></u-modal>
		<view class="bottom">
			<view class="btn" @click="clickBtn">
				{{btnList[currentIndex]}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				moreHouseShow: false, //多房申请
				isFocus: false, //备注焦点
				placeholderStyle: "color:#999999,font-size:16px",
				storeTabList: [{
					name: '请选择',
					id: '',
					code: ''
				}],
				storeCurrent: 0,
				storeList: [],
				barStyle: {
					background: 'linear-gradient(270deg, #FF8382 0%, #B80201 100%)'
				},
				areaText: [],
				areaList: [],
				areaIndex: [],
				showIndex: 0,
				show2: false,
				area: {
					text: '请选择小区',
					index: 0,
					list: [],
					show: false,
					showSelect: false
				},
				storeCode: '',
				headStyle: {
					padding: 0,
					marginBottom: '50rpx'
				},
				currentIndex: 0,
				margin: {
					borderBottom: '20rpx solid #F6F6F6'
				},
				show: false,
				showPopup: false,
				tabList: [{
					name: '客户信息'
				}, {
					name: '住房信息'
				}],
				btnList: ['下一步', '提交'],
				currentSelect: '', //当前选择的字段
				selectList: {
					//客户来源
					infoSource: {
						title: '信息来源',
						list: [],
						name: 'name', //展示字段名
						valueName: 'value', //传值字段名
						index: 0
					},
					//客户类型
					relationship: {
						title: '客户类型',
						list: [],
						name: 'name', //展示字段名
						valueName: 'value', //传值字段名
						index: 0
					},
					// marketingType: {
					// 	list: [],
					// 	name: 'name',
					// 	valueName: 'value',
					// 	index: 0
					// },
					storeId: {
						list: [],
						name: 'name',
						index: 0
					},
					// salesmanId: {
					// 	list: [],
					// 	name: 'employeeName',
					// 	valueName: 'id',
					// 	index: 0
					// },
					roomType: {
						title: '户型',
						list: [],
						name: 'name',
						valueName: 'value',
						index: 0
					},
					houseType: {
						title: '房型',
						list: [],
						name: 'name',
						valueName: 'value',
						index: 0
					},
					city: {
						title: '城市',
						list: [],
						name: 'name',
						valueName: 'id',
						index: 0
					}
				},
				info: {
					areaNamePath: '',
					isMultiHouse: false, //是否多房申请
					customerName: '',
					mobileNumber: '',
					infoSource: {
						name: '',
						value: ''
					},
					//客户类型
					relationship: {
						name: '',
						value: ''
					},
					gender: '1003-10',
					visited: true,
					future: false,
					// marketingType: {
					// 	name: '',
					// 	value: ''
					// },
					buildingArea: '',
					actualArea: '',
					roomType: {
						name: '',
						value: ''
					},
					houseType: {
						name: '',
						value: ''
					},
					fullAddress: '',
					floor: '',
					type: '',
					// salesmanId: {
					// 	name: '',
					// 	value: ''
					// },
					storeId: {
						name: '',
						value: ''
					},
					city: {
						name: '',
						value: ''
					},
					areaId: {
						name: '',
						value: ''
					},
					remark: '',
					isSelf: true,
					finalAddress: '', //详细地址
					// locationAddress:'',
					// latitude:'',
					// longitude:''
				},
				infoList: [
					[{
							type: 'input',
							textname: '客户姓名',
							must: true,
							infoname: 'customerName', //添加传参的字段名
							maxlength: 10,
							inputType: 'text',
							placeholder: '请输入客户姓名',
							show: true
						}, {
							type: 'input',
							textname: '手机号码',
							must: true,
							infoname: 'mobileNumber',
							maxlength: 11,
							inputType: 'number',
							disabled: false,
							placeholder: '请输入手机号码',
							show: true
						}, {
							type: 'select',
							textname: '信息来源',
							must: true,
							infoname: 'infoSource',
							code: '1044',
							textShow: true,
							placeholder: '请选择信息来源',
							show: true
						}, {
							type: 'select',
							textname: '客户类型',
							must: true,
							infoname: 'relationship',
							code: '1022',
							textShow: true, //显示标题
							placeholder: '请选择客户来源',
							show: true
						}, {
							type: 'radio',
							textname: '客户性别',
							select: 0,
							must: false,
							infoname: 'gender',
							show: true,
							list: [{
								name: '男',
								value: '1003-10'
							}, {
								name: '女',
								value: '1003-20'
							}, ]
						}, {
							type: 'radio',
							textname: '上门客户',
							select: 0,
							must: false,
							infoname: 'visited',
							show: true,
							list: [{
								name: '是',
								value: true
							}, {
								name: '否',
								value: false
							}],
						}, {
							type: 'radio',
							textname: '期房客户',
							select: 0,
							must: false,
							infoname: 'future',
							show: true,
							list: [{
								name: '否',
								value: false
							}, ]
						}, {
							type: 'radio',
							textname: '是否自留',
							select: 0,
							must: false,
							infoname: 'isSelf',
							show: true,
							list: [{
								name: '是',
								value: true
							}, {
								name: '否',
								value: false
							}, ]
						},
						// {
						// 	type: 'select',
						// 	textname: '营销类型',
						// 	must: false,
						// 	infoname: 'marketingType',
						// 	code: '1023',
						// 	textShow: true,
						// 	placeholder:'请选择营销类型'
						// }, 
						// {
						// 	type: 'select',
						// 	textname: '所属门店',
						// 	must: false,
						// 	infoname: 'storeId',
						// 	textShow: true,
						// 	placeholder: '请选择所属门店',
						// 	show: true
						// },
						// {
						// 	type: 'select',
						// 	textname: '业务员',
						// 	must: false,
						// 	infoname: 'salesmanId',
						// 	textShow: true,
						// 	placeholder:'请选择业务员'
						// }, 
					],
					[{
							type: 'input',
							textname: '建筑面积',
							must: true,
							infoname: 'buildingArea',
							maxlength: 5,
							inputType: 'number',
							placeholder: '请输入建筑面积(㎡)',
							show: true
						}, {
							type: 'input',
							textname: '实用面积',
							must: true,
							infoname: 'actualArea',
							maxlength: 5,
							inputType: 'number',
							placeholder: '请输入实用面积(㎡)',
							show: true
						}, {
							type: 'select',
							textname: '户型',
							must: true,
							infoname: 'roomType',
							code: '1026',
							textShow: true,
							placeholder: '请选择户型',
							show: true
						}, {
							type: 'select',
							textname: '房型',
							must: true,
							infoname: 'houseType',
							code: '1025',
							textShow: true,
							placeholder: '请选择房型',
							show: true
						}, {
							type: 'none',
							textname: '装修地址',
						}, {
							type: 'select',
							textname: '装修城市/区域',
							must: false,
							infoname: 'city',
							disabled: false,
							textShow: false,
							show: true
						}, {
							type: 'input',
							textname: '装修地址',
							must: true,
							infoname: 'fullAddress',
							maxlength: 20,
							inputType: 'text',
							disabled: false,
							placeholder: '请输入装修地址',
							show: true
						},
						{
							type: 'input',
							textname: '详细地址',
							must: false,
							infoname: 'finalAddress',
							maxlength: 200,
							inputType: 'text',
							disabled: true,
							placeholder: '请输入详细地址',
							show: false
						},
						{
							type: 'input',
							textname: '装修楼层',
							must: false,
							infoname: 'floor',
							maxlength: 3,
							inputType: 'number',
							placeholder: '请输入装修楼层',
							show: true
						},
					]
				],
				parentArea: [],
				userDetail: '',
				moreApplyPhone: '',
				customerShowName: '',
				moreCustomerName: '',
				key: '',
				phonetest: /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/,
			}
		},
		onLoad(options) {
			this.key = options.key
			if (options.id) {
				this.infoList[0].splice(7, 1)
				this.infoList[0].splice(8, 1)
				this.getDetail(options.id)
			}
			if (options.phone) {
				this.info.mobileNumber = this.phoneNumShow(options.phone)
				if (options.infoShow == 'true') {
					this.info.customerName = options.customerName
				} else {
					this.info.customerName = options.customerShowName
				}
				this.customerShowName = options.customerShowName
				this.moreApplyPhone = options.phone
				this.moreCustomerName = options.customerName
				this.infoList[0][1].disabled = true
				this.infoList[0][1].inputType = 'text'
				this.info.isMultiHouse = true
			}
			this.infoList.forEach(item => {
				item.forEach(val => {
					if (val.type == 'select' && val.code) {
						this.getTypeList(val.code, val.infoname)
					}
				})
			})
			// this.getYwy()
			this.getTreeMap()
			this.getAreaInfoByLevel('city')
			this.getOrg('')
		},
		onPageScroll(e) {
			if (this.isFocus) {
				uni.hideKeyboard()
				this.isFocus = false
			}
		},
		methods: {
			//搜索小区
			areaSearch(e) {
				this.getAreaList(e)
			},
			//去除平方
			delUnit(val) {
				console.log(val)
				if (val.infoname == "buildingArea" || val.infoname == "actualArea") {
					val.inputType = "number"
					if (this.info[val.infoname].length > 0) {
						this.info[val.infoname] = this.info[val.infoname].slice(0, this.info[val.infoname].length - 1)
						console.log(this.info[val.infoname])
					}
				}
			},
			//加平分
			addUnit(val) {
				console.log(val)
				if (val.infoname == "buildingArea" || val.infoname == "actualArea") {
					if (this.info[val.infoname].length > 0) {
						val.inputType = "text"
						this.info[val.infoname] = this.info[val.infoname] + "㎡"
						console.log(this.info[val.infoname])
					}
				}
			},
			keyboardheightchange(e) {
				if (e.detail.duration != 0) {
					let that = this
					setTimeout(function() {
						that.isFocus = true
					}, e.detail.duration * 1000 + 500)
				}
			},
			changeTab(index) {
				this.currentIndex = index
			},
			//多房申请
			moreHouseConfirm() {
				this.info.isMultiHouse = true
				this.clickBtn()
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
								that.info.locationAddress = res.address
								that.info.latitude = res.latitude
								that.info.longitude = res.longitude
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
			//判断如果是业务员，自留时不展示，不自留展示
			judge(e) {
				if (e.infoname == "salesmanId") {
					if (this.infoList[0][7].select == 0) {
						return false
					} else {
						return true
					}
				} else {
					return this.info[e.infoname]
				}
			},
			//获取详情
			getDetail(id) {
				this.$get({
					url: this.api.CustomInfo.getDetail,
					data: {
						id: id
					}
				}).then(res => {
					this.infoList[0][2].show = false
					this.infoList[0][0].disabled = true
					this.userDetail = res
					this.info.customerName = res.infoShow ? res.customerName : res.customerShowName
					if (!res.infoShow) {
						this.infoList[0][1].show = false
					}
					this.info.mobileNumber = res.mobileNumber ? this.phoneNumShow(res.mobileNumber) : ''
					this.infoList[0][1].inputType = 'text'
					this.info.id = res.id
					this.infoList[0][1].disabled = true
					this.info.infoSource.name = res.infoSourceName ? res.infoSourceName : ''
					this.info.infoSource.value = res.infoSource
					this.selectList.infoSource.index = res.infoSourceNameIndex
					this.info.relationship.name = res.relationshipName ? res.relationshipName : ''
					this.info.relationship.value = res.relationship
					this.selectList.relationship.index = res.relationshipNameIndex
					this.info.gender = res.gender
					// this.info.locationAddress=res.locationAddress
					// this.info.latitude=res.latitude
					// this.info.longitude=res.longitude
					// this.info.isMultiHouse = true
					this.infoList[0][4].list.forEach((item, index) => {
						if (item.value == res.gender) {
							this.infoList[0][4].select = index
						}
					})
					this.info.visited = res.visited
					this.infoList[0][5].list.forEach((item, index) => {
						if (item.value == res.visited) {
							this.infoList[0][5].select = index
						}
					})
					this.info.future = res.future
					this.infoList[0][6].list.forEach((item, index) => {
						if (item.value == res.future) {
							this.infoList[0][6].select = index
						}
					})
					// if(res.isSelf){
					// 	this.infoList[0].splice(9,1)
					// }
					this.info.isSelf = res.isSelf
					// this.infoList[0][7].list.forEach((item, index) => {
					// 	if (item.value == res.future) {
					// 		this.infoList[0][7].select = index
					// 	}
					// })
					// this.info.marketingType.name = res.marketingTypeName ? res.marketingTypeName : ''
					// this.info.marketingType.value = res.marketingType
					// this.selectList.marketingType.index = res.marketingTypeNameIndex
					this.info.remark = res.remark ? res.remark : ''
					this.info.buildingArea = res.buildingArea ? res.buildingArea : ''
					this.info.actualArea = res.actualArea ? res.actualArea : ''
					this.info.roomType.name = res.roomTypeName ? res.roomTypeName : ''
					this.info.roomType.value = res.roomType
					this.selectList.roomType.index = res.roomTypeNameIndex
					this.info.houseType.name = res.houseTypeName ? res.houseTypeName : ''
					this.info.houseType.value = res.houseType
					this.selectList.houseType.index = res.houseTypeNameIndex
					this.info.fullAddress = res.fullAddress
					this.infoList[1][6].disabled = true
					this.info.floor = res.floor
					this.info.storeId.name = res.storeName ? res.storeName : ""
					this.info.storeId.value = res.storeId
					this.storeTabList = this.storeTabList.concat(res.storeParentIds)
					this.storeCurrent = res.storeParentIds.length
					// this.info.salesmanId.name = res.employeeName ? res.employeeName : ""
					// this.info.salesmanId.value = res.employeeId
					this.info.areaId.value = res.areaId
					this.infoList[1][5].disabled = true
					if (!res.infoShow) {
						this.infoList[1][6].show = false
						this.infoList[1][7].show = false
					}
					if (res.parentArea.length) {
						res.parentArea.forEach((item, index) => {
							if (index == res.parentArea.length - 1) {
								this.info.city.name = this.info.city.name + item.name
							} else {
								this.info.city.name = this.info.city.name + item.name + '-'
							}
						})
						this.info.areaNamePath = this.info.city.name
					}
					this.getOrg(res.storeId)
				})
			},
			getOrg(code) {
				this.$get({
					url: this.api.CustomInfo.getOrg,
					data: {
						code: code
					}
				}).then(res => {
					res.forEach(item => {
						if (this.storeTabList.length > 1) {
							if (this.storeTabList[this.storeCurrent + 1] && this.storeTabList[this
									.storeCurrent + 1].id == item.id) {
								item.select = true
							} else {
								item.select = false
							}
						} else {
							item.select = false
						}

					})
					this.storeList = res
					if (res.length == 0) {
						this.storeList = [{
							name: '暂无数据'
						}]
					}
				})
			},
			change(index) {
				this.storeCurrent = index;
				this.getOrg(this.storeTabList[index].code)
			},
			selectStore(val, index) {
				if (val.name == '暂无数据') {
					return
				}
				this.storeList.forEach(item => {
					item.select = false
				})
				val.select = !val.select
				if (this.storeCurrent == 0 || this.storeTabList[this.storeCurrent].name == undefined || this.storeTabList[
						this.storeCurrent].name != '请选择') {
					this.storeTabList.splice(this.storeCurrent + 1, this.storeTabList.length - this.storeCurrent)
					this.storeTabList.push(val)
				} else {
					this.storeTabList.splice(this.storeCurrent + 1, this.storeTabList.length - this.storeCurrent)
					this.storeTabList[this.storeCurrent].name = val.name
					this.storeTabList[this.storeCurrent].id = val.id
					this.storeTabList[this.storeCurrent].code = val.code
				}
				this.storeCurrent = this.storeCurrent + 1
				this.storeCode = val.code
				this.info.storeId.value = val.id
				this.info.storeId.name = val.name
				this.getOrg(val.code)
			},
			getTreeMap() {
				this.$get({
					url: this.api.SysOrganization.getTreeMap
				}).then(res => {
					this.selectList.storeId.list = res
				})
			},
			getAreaInfoByLevel(name) {
				this.$post({
					url: this.api.AreaInfo.getAreaInfoList
				}).then(res => {
					this.selectList[name].list = res[0].children
				})
			},
			radioSelect(val, index) {
				val.select = index
				this.info[val.infoname] = val.list[index].value
			},
			getTypeList(type, name) {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: type
					}
				}).then(res => {
					let data = []
					if (this.key == 'AtFirstSight' || this.key == 'Original') {
						res.rows.forEach(item => {
							if (item.value == '1044-03' || item.value == '1044-07') {
								data.push(item)
							}
						})
					} else {
						res.rows.forEach(item => {
							if (item.value != '1044-03' && item.value != '1044-07') {
								data.push(item)
							}
						})
					}
					if(name=='infoSource'){
						this.selectList[name].list = data
					}else{
						this.selectList[name].list = res.rows
					}
					
				})
			},
			//获取业务员
			// getYwy() {
			// 	this.$get({
			// 		url: this.api.Employee.getEasyList
			// 	}).then(res => {
			// 		this.selectList.salesmanId.list = res.rows
			// 	})
			// },
			selectshow(val, index) {
				// if (this.selectList[infoname].parentId === '') {
				// 	this.$Toast('请先选择上级')
				// 	return
				// }
				if (val.disabled) {
					return
				}
				if (this.selectList[val.infoname].length) {
					this.$Toast('暂无数据')
					return
				}
				this.currentSelect = val.infoname
				if (val.infoname == 'storeId') {
					this.showPopup = true
					return
				}
				this.show = true
			},
			selectshow2(index) {
				this.showIndex = index
				this.show2 = true
			},
			confirm(e) {
				let value = this.selectList[this.currentSelect]
				value.list.forEach((item, index) => {
					if (item[value.name] == e[0].label) {
						value.index = index
					}
				})
				if (this.currentSelect == 'city') {
					this.areaText = []
					this.areaList = []
					this.info.areaNamePath = ''
					if (value.list[value.index].children.length) {
						this.areaText[0] = '请选择'
						this.areaIndex[0] = 0
						this.areaList[0] = value.list[value.index].children
					}
					this.area.list = []
					this.area.text = '请选择小区'
					this.area.show = false
				}
				this.info[this.currentSelect].name = e[0].label
				this.info[this.currentSelect].value = e[0].value
			},
			confirm2(e) {
				let value = this.areaList[this.showIndex]
				this.info.areaNamePath = ''
				value.forEach((item, index) => {
					if (item.id === e[0].value) {
						this.areaIndex[this.showIndex] = index
					}
				})
				let index = this.areaIndex[this.showIndex]
				this.areaText[this.showIndex] = e[0].label
				this.info.city.value = e[0].value
				if (this.areaList[this.showIndex][index].children.length) {
					this.areaText[this.showIndex + 1] = '请选择'
					this.areaIndex[this.showIndex + 1] = 0
					this.areaList[this.showIndex + 1] = this.areaList[this.showIndex][index].children
					this.area.text = '请选择小区'
					this.area.show = false
				} else {
					this.area.text = '请选择小区'
					this.area.show = true
					this.getAreaList('')
				}
				// console.log()
			},
			confirm3(e) {
				//u-picker
				let data = this.area.list[e]
				console.log(data)
				if (data) {
					this.area.list.forEach((item, index) => {
						if (item.id === data.id) {
							this.area.index = index
						}
					})
					this.info.areaNamePath = this.area.list[this.area.index].areaNamePath
					this.area.text = data.name
					this.info.areaId.value = data.id
				}
				//u-select
				// if (e[0].value) {
				// 	this.area.list.forEach((item, index) => {
				// 		if (item.id === e[0].value) {
				// 			this.area.index = index
				// 		}
				// 	})
				// 	this.info.areaNamePath = this.area.list[this.area.index].areaNamePath
				// 	this.area.text = e[0].label
				// 	this.info.areaId.value = e[0].value
				// }

			},
			getAreaList(name) {
				this.$post({
					url: this.api.AreaInfo.getResidenceList,
					data: {
						classifyId: this.info.city.value,
						pageSize: 0,
						currentPage: 0,
						name: name
					}
				}).then(res => {
					this.area.list = res.rows
					this.area = {
						...this.area
					}
					// this.$refs.uSearch.$forceUpdate()
				})
			},
			clickBtn() {
				if (this.currentIndex == 0) {
					this.currentIndex = 1
				} else {
					let data = {
						...this.info
					}
					if (this.info.fullAddress == '') {
						this.$Toast("请输入装修地址")
						return
					}
					data.relationship = this.info.relationship.value
					data.houseType = this.info.houseType.value
					// data.marketingType = this.info.marketingType.value
					data.roomType = this.info.roomType.value
					// data.salesmanId = this.info.salesmanId.value
					data.mobileNumber = this.info.mobileNumber
					data.storeId = this.info.storeId.value
					data.areaId = this.info.areaId.value
					data.finalAddress = this.info.areaNamePath + this.info.fullAddress
					data.infoSource = this.info.infoSource.value
					data.type = this.key == 'Original' ? 'AtFirstSight' : this.key
					if (this.userDetail) {
						data.mobileNumber = this.userDetail.mobileNumber
						data.customerName = this.userDetail.customerName
						data.type = this.userDetail.type
					}
					if (this.customerShowName == data.customerName) {
						data.customerName = this.moreCustomerName
					}
					if (this.moreApplyPhone) {
						data.mobileNumber = this.moreApplyPhone
					}
					if (!data.customerName) {
						this.$Toast("请输入客户姓名")
						return
					}
					if (data.mobileNumber == '') {
						this.$Toast("请输入手机号码")
						return
					}
					if (!this.phonetest.test(data.mobileNumber)) {
						this.$Toast("请输入正确手机号码")
						return
					}
					if (data.infoSource == '') {
						this.$Toast("请选择信息来源")
						return
					}
					if (data.relationship == '') {
						this.$Toast("请选择客户类型")
						return
					}
					if (data.buildingArea == '' || data.buildingArea < 0) {
						this.$Toast("请输入正确建筑面积")
						return
					}
					if (data.actualArea == '' || data.actualArea < 0) {
						this.$Toast("请输入正确实用面积")
						return
					}
					if (data.relationship == '') {
						this.$Toast("请选择客户类型")
						return
					}
					if (data.roomType == '') {
						this.$Toast("请选择户型")
						return
					}
					if (data.houseType == '') {
						this.$Toast("请选择房型")
						return
					}
					this.$post({
						url: this.api.CustomInfo.edit,
						data
					}).then(res => {
						if (res == true) {
							this.moreHouseShow = true
							return
						}
						this.$Toast('操作成功')
						if (this.info.isMultiHouse) {
							setTimeout(function() {
								uni.navigateBack({
									delta: 2
								})
							}, 1000)
						} else {
							setTimeout(function() {
								uni.navigateBack({

								})
							}, 1000)
						}

					}).catch(res => {
						if (this.infoList[0][1].disabled != true) {
							this.info.isMultiHouse = false
						}
					})
				}
			}
		},
		watch: {
			info: {
				handler: function(val) {
					if (val.areaNamePath != '') {
						this.infoList[1][7].show = true
						val.finalAddress = val.areaNamePath + val.fullAddress
						if (this.userDetail != '' && !this.userDetail.infoShow) {
							this.infoList[1][7].show = false
						}
					} else {
						this.infoList[1][7].show = false
						val.finalAddress = val.areaNamePath + val.fullAddress
					}
				},
				deep: true
			}

		}
	}
</script>
<style>
	page {
		background: #F6F6F6;
	}
</style>
<style lang="less" scoped>
	.popups {
		.popups-title {
			height: 126rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 50rpx;
			border-bottom: 2rpx solid #EEEEEE;

			.popups-title-l {
				color: #AAAAAA;
				font-size: 30rpx;
			}

			.popups-title-c {
				color: #333333;
				font-size: 32rpx;
			}

			.popups-title-r {
				color: #B80201;
				font-size: 30rpx;
			}
		}

		.popups-content {
			padding: 40rpx;

			.popups-content-item {
				color: #333333;
				margin-bottom: 40rpx;
				font-size: 28rpx;
			}

			.popups-content-item-s {
				color: #B80201;
				margin-bottom: 40rpx;
				font-size: 28rpx;
			}
		}
	}

	.customer-entry {
		width: 100%;
		padding-bottom: 148rpx;

		.tabs {
			width: 100%;
			height: 112rpx;
			display: flex;
			align-items: center;
			background-color: #FFFFFF;
			justify-content: center;
			// margin-bottom: 20rpx;
			position: fixed;
			// top:0;
			// left: 0rpx;
			z-index: 999;
			// border-bottom: 1rpx solid #F6F6F6;

			.tab {
				width: 278rpx;
				height: 112rpx;
				text-align: center;
				line-height: 112rpx;
				color: #333333;
				font-weight: bold;
				font-size: 28rpx;
				position: relative;
			}

			.tabs-bar {
				position: absolute;
				left: 0;
				right: 0;
				margin: auto;
				bottom: 16rpx;
				width: 44rpx;
				height: 8rpx;
				background: linear-gradient(90deg, #B80201 0%, #D80100 100%);
				opacity: 1;
				border-radius: 4rpx;
			}

			.tabs-r {
				width: 278rpx;
				height: 112rpx;
				text-align: center;
				line-height: 112rpx;
				font-size: 28rpx;
				position: relative;
				color: #999999;
			}
		}

		.userinfo {
			background-color: #FFFFFF;

			// padding: 0 30rpx;
			.userinfo-title {
				height: 77rpx;
				line-height: 120rpx;
				padding: 0rpx 30rpx;
				color: #333333;
				font-size: 28rpx;
				font-weight: bold;
			}

			.userinfo-text {
				width: 148rpx;
				color: #333333;
				font-size: 30rpx;
				margin-right: 20rpx;
				font-weight: 400;
				overflow: hidden;
				flex-shrink: 1;

				text {
					color: #FF0000 !important;
					margin-left: 10rpx;
					margin-top: 10rpx;
				}
			}

			.userinfo-input {
				height: 108rpx;
				display: flex;
				align-items: center;
				border-bottom: 1px solid #EEEEEE;
				padding: 0 30rpx;

				// .userinfo-input-text{
				// 	color: #666666;
				// 	font-size: 30rpx;
				// 	margin-right: 20rpx;
				// 	font-weight: 400;
				// 	overflow: hidden;
				// 	text{
				// 		color: #FF0000;
				// 		margin-left: 10rpx;
				// 		margin-top: 10rpx;
				// 	}
				// }
				input {
					font-size: 30rpx;
					color: #666666;
					border: none;
				}

				.userinfo-input-in {
					border: none;
					outline: none;
					font-size: 30rpx;
					color: #666666;

					.userinfo-input-ins {
						color: #666666;
					}
				}
			}

			.userinfo-select {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 108rpx;
				border-bottom: 1px solid #EEEEEE;
				padding: 0 30rpx;

				.userinfo-select-l {
					display: flex;
					align-items: center;

					text {
						font-size: 30rpx;
						color: #999999;
					}

					.userinfo-text-s {
						color: #333333;
					}
				}

				.userinfo-select-r {
					width: 14rpx;
					height: 26rpx;
				}
			}

			.userinfo-radio {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 108rpx;
				border-bottom: 1px solid #EEEEEE;
				padding: 0 30rpx;

				.radios {
					display: flex;
					align-items: center;

					.no-select {
						width: 36rpx;
						height: 36rpx;
						background: rgba(255, 255, 255, 0.39);
						border: 2rpx solid #999999;
						border-radius: 50%;
					}

					.radio {
						display: flex;
						align-items: center;
						margin-left: 50rpx;

						image {
							width: 36rpx;
							height: 36rpx;
						}

						text {
							margin-left: 10rpx;
							font-size: 30rpx;
							color: #999999;
						}

						.text {
							color: #333333;
						}
					}
				}
			}

			.remarks {
				padding: 30rpx 30rpx;

				view {
					margin-bottom: 20rpx;
					color: #666666;
					font-size: 30rpx;
				}

				textarea {
					width: 100%;
					height: 128rpx;
					background-color: #F9F9F9;
					padding: 20rpx;
					font-size: 30rpx;
					border-radius: 8rpx;
					box-sizing: border-box;
				}
			}
		}

		.bottom {
			width: 100%;
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			background-color: #FFFFFF;
			// padding: 20rpx 0;
			height: 140rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-bottom: 30rpx;

			.btn {
				width: 600rpx;
				height: 88rpx;
				background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
				opacity: 1;
				border-radius: 44rpx;
				margin: auto;
				line-height: 88rpx;
				text-align: center;
				font-size: 32rpx;
				color: #FFFFFF;
				font-weight: 400;
			}
		}
	}
</style>
