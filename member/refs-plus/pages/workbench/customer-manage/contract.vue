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
		<view class="center">
			<view class="setInput">
				<text>施工合同号<text style="color:red;">*</text></text>
				<!-- @click="selectAgreement" -->
				<view class="setInput-r">
					<input type="number" v-model="info.buildContractNo" :disabled="false" maxlength="9"
						placeholder="请输入合同号" />
					<!-- <image src="../../../static/image/mine/right.png" mode=""></image> -->
				</view>
			</view>
			<view class="setInput" style="border: none;">
				<text>签订日期</text>
				<view class="setInput-r" @click="getTime('contractDate')">
					<input type="text" v-model="info.contractDate" :disabled="true" placeholder="请选择日期" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="center">
			<view class="setInput">
				<text>是否允许签合同</text>
				<view class="setInput-r">
					<view class="select-y" @click="info.isAllowSign=true">
						<view class="" v-if="!info.isAllowSign">

						</view>
						<image src="/static/image/workbench/customer-manage/select.png" mode="" v-else></image>
						<text>是</text>
					</view>
					<view class="select-y" @click="info.isAllowSign=false">
						<view class="" v-if="info.isAllowSign">

						</view>
						<image src="/static/image/workbench/customer-manage/select.png" mode="" v-else></image>
						<text>否</text>
					</view>
				</view>
			</view>
			<view class="setInput">
				<text>预计开工日期</text>
				<view class="setInput-r" @click="getTime('estimateStartDate')">
					<input type="text" v-model="info.estimateStartDate" :disabled="true" placeholder="请选择" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
			<view class="setInput">
				<text>预计完工日期</text>
				<view class="setInput-r" @click="getTime('estimateCompleteDate')">
					<input type="text" v-model="info.estimateCompleteDate" :disabled="true" placeholder="请选择" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
			<view class="setInput" style="border: none;">
				<text>合同工期<text style="color:red;">*</text></text>
				<view class="setInput-r">
					<input type="text" v-model="info.buildContractWorkDate" maxlength="20" placeholder="请输入合同工期" />
				</view>
			</view>
		</view>
		<view class="center">
			<view class="setInput">
				<text>预算总额</text>
				<view class="setInput-r">
					<input type="number" v-model="info.estimateTotalAmount" maxlength="9" placeholder="请输入预算总额(元)" />
				</view>
			</view>
			<view class="setInput">
				<text>预算优惠金额</text>
				<view class="setInput-r">
					<input type="number" v-model="info.estimatePreferentialAmount" maxlength="9"
						placeholder="请输入优惠金额(元)" />
				</view>
			</view>
			<view class="setInput">
				<text>预算优惠折率</text>
				<view class="setInput-r">
					<input type="digit" v-model="info.estimateDiscountRate" maxlength="11" placeholder="请输入优惠折率" />
				</view>
			</view>
			<view class="setInput">
				<text>合同金额</text>
				<view class="setInput-r">
					<input type="number" v-model="info.contractAmount" maxlength="9" placeholder="请输入合同金额(元)" />
				</view>
			</view>
			<view class="setInput" style="border: none;">
				<text>中期款日期</text>
				<view class="setInput-r" @click="getTime('interimPaymentDate')">
					<input type="text" v-model="info.interimPaymentDate" :disabled="true" placeholder="请选择" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="center">
			<view class="setInput">
				<text>身份证号<text style="color:red;">*</text></text>
				<view class="setInput-r">
					<input type="text" v-model="info.idCard" maxlength="18" placeholder="请输入身份证号" />
				</view>
			</view>
			<view class="setInput" style="border: none;">
				<text>有效地址<text style="color:red;">*</text></text>
				<view class="setInput-r">
					<input type="text" v-model="info.postalAddress" maxlength="20" placeholder="请输入有效地址" />
				</view>
			</view>
		</view>
		<view class="center" style="margin-bottom: 0rpx;">
			<view class="setInput">
				<text>甲方代表人<text style="color:red;">*</text></text>
				<view class="setInput-r">
					<input type="text" v-model="info.representativePartA" maxlength="9" placeholder="请输入姓名" />
				</view>
			</view>
			<view class="upload">
				<text>指定人员</text>
				<view class="upload-r" @click="addAppoint">
					<image src="../../../static/image/workbench/customer-manage/upload.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="center" style="background: #FCFCFC;margin-bottom: 0;" v-for="(val,index) in info.appointors"
			:key="index">
			<view class="setInput" style="height: 96rpx;">
				<text style="font-weight: 400;font-size: 30rpx;">姓名</text>
				<view class="setInput-r">
					<input type="text" style="font-size: 30rpx;" v-model="val.appointorName" maxlength="9"
						placeholder="请输入姓名" />
				</view>
			</view>
			<view class="setInput" style="height: 96rpx;">
				<text style="font-weight: 400;font-size: 30rpx;">身份证号</text>
				<view class="setInput-r">
					<input type="text" style="font-size: 30rpx;" v-model="val.appointorIdCard" maxlength="18"
						placeholder="请输入身份证号" />
				</view>
			</view>
			<view class="setInput" style="height: 96rpx;border: none;">
				<text style="font-weight: 400;font-size: 30rpx;">签署方关系</text>
				<view class="setInput-r">
					<input type="text" style="font-size: 30rpx;" v-model="val.appointorRelationship" maxlength="9"
						placeholder="请输入签署方关系" />
				</view>
			</view>
		</view>
		<view class="center">
			<view class="setInput">
				<text>乙方代表人<text style="color:red;">*</text></text>
				<view class="setInput-r">
					<input type="text" v-model="info.representativePartB" maxlength="9" placeholder="请输入姓名" />
				</view>
			</view>
		</view>
		<view class="center">
			<view class="setInput">
				<text>紧急联系人<text style="color:red;">*</text></text>
				<view class="setInput-r">
					<input type="text" v-model="info.urgentContact" maxlength="9" placeholder="紧急联系人" />
				</view>
			</view>
			<view class="setInput">
				<text>联系电话<text style="color:red;">*</text></text>
				<view class="setInput-r">
					<input type="number" v-model="info.urgentContactMobile" maxlength="11" placeholder="请输入联系电话" />
				</view>
			</view>
			<view class="setInput">
				<text>联系地址<text style="color:red;">*</text></text>
				<view class="setInput-r">
					<input type="text" v-model="info.urgentContactAddress" maxlength="20" placeholder="请输入联系地址" />
				</view>
			</view>
		</view>
		<view class="center">
			<view class="setInput">
				<text>参与活动</text>
				<view class="setInput-r" @click="activityShow=true">
					<input type="text" v-model="info.activityName" maxlength="9" :disabled="true" placeholder="请选择" />
					<image src="../../../static/image/mine/right.png" mode=""></image>
				</view>
			</view>
			<view class="setInput">
				<text>折前设计费</text>
				<view class="setInput-r">
					<input type="number" v-model="info.beforeDesignPrice" maxlength="9" placeholder="请输入折前设计费(元)" />
				</view>
			</view>
			<view class="setInput">
				<text>折后设计费</text>
				<view class="setInput-r">
					<input type="number" v-model="info.afterDesignPrice" maxlength="9" placeholder="请输入折后设计费(元)" />
				</view>
			</view>
			<view class="setInput">
				<text>是否主材包客户</text>
				<view class="setInput-r">
					<view class="select-y" @click="info.isMasterMaterial=true">
						<view class="" v-if="!info.isMasterMaterial">

						</view>
						<image src="/static/image/workbench/customer-manage/select.png" mode="" v-else></image>
						<text>是</text>
					</view>
					<view class="select-y" @click="info.isMasterMaterial=false">
						<view class="" v-if="info.isMasterMaterial">

						</view>
						<image src="/static/image/workbench/customer-manage/select.png" mode="" v-else></image>
						<text>否</text>
					</view>
				</view>
			</view>
		</view>
		<u-select v-model="agreeShow" :default-value='[agreeIndex]' value-name="designNo" label-name="designNo"
			:list="agreeList" @confirm='confirm2'>
		</u-select>
		<u-picker v-model="timeShow" mode="time" @confirm="timeSelect"></u-picker>
		<view class="center">
			<view class="title">
				补充约定内容
			</view>
			<view class="" style="position: relative;">
				<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon"
					v-if="!info.supplyAppointmentInfo.length"></image>
				<textarea v-model="info.supplyAppointmentInfo" maxlength="200" placeholder="     这里可以填写您的补充约定内容~" />
				<view class=""
					style='text-align: right;font-size: 20rpx;margin-bottom: 42rpx;width: 100%;background-color: #F9F9F9;padding-right: 12rpx;height: 50rpx;'>
					<text style='color: #F43D1B;'>{{info.supplyAppointmentInfo.length}}</text><text
						style='color: #B2B2B2;'>/200</text>
				</view>
			</view>
			<view class="setInput">
				<text>备注</text>
				<view class="setInput-r">
					<input type="text" v-model="info.remark" maxlength="50" placeholder="请输入备注信息" />
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
		<u-select v-model="activityShow" :default-value='[info.activityIndex]' value-name="id" :list="activityList"
			@confirm='activityConfirm' label-name="promotionName">
		</u-select>
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
				timeName: '',
				trackContent: '',
				preIndedx: 0,
				pre: 'virtualID_',
				list: [], //文件列表
				info: {
					activityId: '', //活动id
					activityIndex: 0, //活动当前选择
					activityName: '', //活动名
					buildContractNo: '', //施工合同号
					attachIds: [], //文件id列表
					beforeDesignPrice: '', //折前设计费单价
					afterDesignPrice: '', //折后设计费单价
					buildContractWorkDate: '', //合同工期
					contractAmount: '', //合同金额
					contractDate: '', //合同日期
					estimateCompleteDate: '', //预计完工日期
					estimateStartDate: '', //预计开工日期
					estimateDiscountRate: '', //预算优惠折率
					estimatePreferentialAmount: '', //预算优惠金额
					estimateTotalAmount: '', //预算总金额
					idCard: '', //身份证号
					interimPaymentDate: '', //中期款日期
					isAllowSign: false, //是否允许签合同
					isMasterMaterial: false, //是否主材包
					postalAddress: '', //联系地址
					userCode: '', //账号
					pwd: '', //密码
					remark: '', //备注
					representativePartA: '', //甲方代表人
					representativePartB: '', //乙方代表人
					signDate: '', //施工合同签订日期
					supplyAppointmentInfo: '', //补充约定内容
					urgentContact: '', //紧急联系人
					urgentContactAddress: '', //紧急联系人地址
					urgentContactMobile: '', //紧急联系人电话
					appointors: [],
					workFlowNodeId: '', //流程节点ID
					workFlowInfoId: '',
					customerId: uni.getStorageSync('customInfo').id,
					type: '1081-10'
				},
				title: '',
				isIos: uni.getStorageSync('isIos'),
				preImagePath: [],
				mustList: [{
					name: 'buildContractNo',
					toast: '请输入施工合同',
					must: true,
					test: ''
				}, {
					name: 'buildContractWorkDate',
					toast: '请输入合同工期',
					must: true,
					test: ''
				}, {
					name: 'idCard',
					toast: '请输入身份证号',
					must: true,
					test: ''
				}, {
					name: 'postalAddress',
					toast: '请输入有效地址',
					must: true,
					test: ''
				}, {
					name: 'representativePartA',
					toast: '请输入甲方代表人',
					must: true,
					test: ''
				}, {
					name: 'representativePartB',
					toast: '请输入乙方代表人',
					must: true,
					test: ''
				}, {
					name: 'urgentContact',
					toast: '请输入紧急联系人',
					must: true,
					test: ''
				}, {
					name: 'urgentContactMobile',
					toast: '请输入联系电话',
					must: true,
					test: /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/
				}, {
					name: 'urgentContactAddress',
					toast: '请输入联系地址',
					must: true,
					test: ''
				}],
				constructionContractId: '',
				activityList: [], //活动列表
				activityShow: false, //活动列表展示
			}
		},
		onLoad(options) {
			if (options.constructionContractId && options.constructionContractId != 'null') {
				this.constructionContractId = options.constructionContractId
				this.info.type = '1081-20'
				this.getDetail()
			}
			this.userCode = this.vuex_user.zhiAccount
			this.pwd = this.vuex_user.zhiPwd
			this.title = options.title
			this.getDiscountList()
			this.info.workFlowInfoId = options.workFlowInfoId
			this.info.workFlowNodeId = options.workFlowNodeId
			this.getDesignNoList()
		},
		methods: {
			//确定活动
			activityConfirm(e) {
				this.info.activityName = e[0].label
				this.info.activityId = e[0].value
				this.activityList.forEach((item, index) => {
					if (item.id == e[0].value) {
						this.info.activityIndex = index
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
					this.activityList = res.rows
					// console.log(this.activityList)
				})
			},
			getDetail() {
				this.$get({
					url: this.api.CustomWorkFlowInfo.getBuildContract,
					data: {
						constructionContractId: this.constructionContractId
					}
				}).then(res => {
					this.info.activityId = res.activityId ? res.activityId : ''
					this.info.activityName = res.activityName ? res.activityName : ''
					this.info.buildContractNo = res.buildContractNo ? res.buildContractNo : ''
					this.info.attachIds = res.attachIds ? res.attachIds : []
					this.info.beforeDesignPrice = res.beforeDesignPrice ? res.beforeDesignPrice : ''
					this.info.afterDesignPrice = res.afterDesignPrice ? res.afterDesignPrice : ''
					this.info.buildContractWorkDate = res.buildContractWorkDate ? res.buildContractWorkDate : ''
					this.info.contractAmount = res.contractAmount ? res.contractAmount : ''
					this.info.contractDate = res.contractDate ? res.contractDate : ''
					this.info.estimateCompleteDate = res.estimateCompleteDate ? res.estimateCompleteDate : ''
					this.info.estimateStartDate = res.estimateStartDate ? res.estimateStartDate : ''
					this.info.estimateDiscountRate = res.estimateDiscountRate ? res.estimateDiscountRate : ''
					this.info.estimatePreferentialAmount = res.estimatePreferentialAmount ? res
						.estimatePreferentialAmount : ''
					this.info.estimateTotalAmount = res.estimateTotalAmount ? res.estimateTotalAmount : ''
					this.info.idCard = res.idCard ? res.idCard : ''
					this.info.interimPaymentDate = res.interimPaymentDate ? res.interimPaymentDate : ''
					this.info.isAllowSign = res.isAllowSign ? res.isAllowSign : ''
					this.info.isMasterMaterial = res.isMasterMaterial ? res.isMasterMaterial : ''
					this.info.postalAddress = res.postalAddress ? res.postalAddress : ''
					this.info.userCode = res.userCode ? res.userCode : ''
					this.info.representativePartA = res.representativePartA ? res.representativePartA : ''
					this.info.representativePartB = res.representativePartB ? res.representativePartB : ''
					this.info.signDate = res.signDate ? res.signDate : ''
					this.info.supplyAppointmentInfo = res.supplyAppointmentInfo ? res.supplyAppointmentInfo : ''
					this.info.urgentContact = res.urgentContact ? res.urgentContact : ''
					this.info.urgentContactAddress = res.urgentContactAddress ? res.urgentContactAddress : ''
					this.info.urgentContactMobile = res.urgentContactMobile ? res.urgentContactMobile : ''
					this.info.appointors = res.appointors ? res.appointors : ''
					this.info.id = res.id
				})
			},
			//展示时间
			getTime(name) {
				this.timeName = name
				this.timeShow = true
			},
			//添加指定人员
			addAppoint() {
				let a = {
					appointorName: '',
					appointorIdCard: '',
					appointorRelationship: ''
				}
				this.info.appointors.push(a)
			},
			//获取协议号
			getDesignNoList() {
				this.$get({
					url: this.api.CustomWorkFlowInfo.getDesignNoList,
					data: {
						type: '1061-20',
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
				if (url.indexOf('.JPG') != -1 || url.indexOf('.JPEG') != -1 || url.indexOf('.PNG') != -1 || url
					.indexOf(
						'.BMP') != -1 || url.indexOf('.jpg') != -1 || url.indexOf('.jpeg') != -1 || url.indexOf(
						'.png') !=
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
				this.info.attachIds.splice(index, 1)
			},
			goProcess() {
				this.$post({
					url: this.api.CustomWorkFlowInfo.customerUpdateWorkFlowNode,
					data: {
						customerId: this.customInfo.id,
						workFlowInfoId: this.info.workFlowInfoId,
						workFlowNodeId: this.info.workFlowNodeId
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
				console.log('11111')
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
						this.info.attachIds.push(res[0][0].id)
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
					this.info.attachIds = ids
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
			select() {
				this.selectShow = true
			},
			timeSelect(e) {
				this.info[this.timeName] = e.year + '-' + e.month + '-' + e.day
			},
			//提交
			submit() {
				if (!this.$dyncNumber(this.info.estimateDiscountRate, [11, 4])) {
					this.$Toast('预算优惠折率为小数点前七位，小数点后四位')
					return
				}
				for (let i = 0; i < this.mustList.length; i++) {
					if (!this.info[this.mustList[i].name].length) {
						this.$Toast(this.mustList[i].toast)
						return
					}
				}
				this.$post({
					url: this.api.CustomWorkFlowInfo.customerBindBuildContract,
					data: this.info
				}).then(res => {
					// this.goProcess()
					this.$Toast('操作成功')
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
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

	.center {
		width: 100%;
		padding: 0 30rpx;
		background-color: #FFFFFF;
		margin-top: 20rpx;

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

			&:last-child {
				border: none;
			}

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

				.select-y {
					display: flex;
					align-items: center;
					margin-left: 48rpx;

					view {
						width: 36rpx;
						height: 36rpx;
						border: 2rpx solid #D0D0D0;
						border-radius: 50%;
					}

					image {
						width: 36rpx;
						height: 36rpx;
						margin: 0;
					}

					text {
						color: #333333;
						font-size: 32rpx;
						margin-left: 10rpx;
						font-weight: 400;
					}
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
