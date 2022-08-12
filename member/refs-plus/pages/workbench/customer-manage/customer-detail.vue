<template>
	<view class="detail">
		<view :style="{ height: iStatusBarHeight + 'px',zIndex: zIndex}" class="stat"></view>
		<u-navbar title="客户详情" :is-fixed='true' :isAbsolute='false' :z-index="zIndex" back-icon-color='#ffffff'
			:border-bottom='false' class="navbar" title-size='34' title-color='#ffffff' :background="navbar_bg">
		</u-navbar>
		<image src="/static/image/tab-bar/new-detail-bg.png" mode="" class="detail_bg"></image>
		<view class="center">
			<view class="userinfo">
				<view class="userinfo-l">
					<view class="userinfo-avatar">
						<image
							:src="userinfo.avatar || (userinfo.gender == '1003-10'? defaultWomenAvatar : defaultAvatar)"
							mode=""></image>
					</view>
					<view class="userinfo-text">
						<view class="userinfo-text-t" style="font-size:36rpx ;font-weight: bold;">
							{{ key == 'FlightOrderEscape' || key == 'DesertedOrderEscape' || userinfo.infoShow ?userinfo.customerName:userinfo.customerShowName}}
						</view>
						<!-- 						<view class="" style="opacity: 0.8;font-size: 24rpx;" v-if="userinfo.mobileNumber">
							{{phoneNumShow(userinfo.mobileNumber)}}
						</view> -->
					</view>
					<!-- 					<view class="shu">

					</view>
					<image src="../../../static/image/workbench/customer-manage/phone-w.png" mode=""
						class="userinfo-call" @click="phone(userinfo)"></image> -->
				</view>
				<view class="userinfo-r">
					<image src="../../../static/image/workbench/customer-manage/userinfo-rbg.png" mode=""></image>
					<text>装修档案</text>
				</view>
			</view>
			<view class="" style="padding: 0 30rpx;margin-top: 28rpx;" v-if="btnList.length||progressBtn.length">
				<view class="menus">
					<view class="menu-btn">
						<view class="" v-for="(val,index) in btnList" :key="index" @click="btns(val)"
							v-if='btnshows(val.key)'>
							<image :src="val.icon ? icon[val.icon] : '/static/image/tab-bar/construction.png'" mode="">
							</image>
							<text>{{val.name}}</text>
						</view>
						<view class="" v-for="(val,btnIndex) in progressBtn" @click="topage(val)"
							v-if="val.jurisdiction&&(userinfo.type=='1033-60' || userinfo.type=='1033-70' || userinfo.type=='1033-80')">
							<image :src="val.icon ? icon[val.icon] : '/static/image/tab-bar/construction.png'" mode="">
							</image>
							<text>{{val.name}}</text>
						</view>
					</view>
					<!-- 					<view class="menus-time">
						<text style="margin-right: 16rpx;color: #999999;">下次跟进时间</text>
						<text>2022-3-17 18:30</text>
					</view> -->
				</view>
			</view>
			<view class="info">
				<view class="info-title" @click="userShow=!userShow">
					<text>基本信息</text>
					<image src="../../../static/image/workbench/customer-manage/up.png" mode="" v-if="userShow"></image>
					<image src="../../../static/image/workbench/customer-manage/down.png" mode="" v-else></image>
				</view>
				<view class="" v-if="userShow">
					<view class="info-input">
						<text>客户姓名</text>
						<view class="info-input-r">
							<image src="../../../static/image/workbench/customer-manage/man.png" mode=""></image>
							<text>{{ key == 'FlightOrderEscape' || key == 'DesertedOrderEscape' || userinfo.infoShow ?userinfo.customerName:userinfo.customerShowName}}</text>
						</view>
					</view>
					<!-- 					<view class="info-input">
						<text>电话</text>
						<view class="info-input-r" v-if="userinfo">
							<text>{{userinfo.mobileNumber ? phoneNumShow(userinfo.mobileNumber) :'暂无'}}</text>
						</view>
					</view> -->
					<view class="info-input" v-if="userinfo.infoShow">
						<text>地址</text>
						<view class="info-input-r">
							<text>{{userinfo.finalAddress ? userinfo.finalAddress :'暂无'}}</text>
						</view>
					</view>
					<view class="info-input" v-if="key == 'FlightOrderEscape' || key == 'DesertedOrderEscape'">
						<text>地址</text>
						<view class="info-input-r">
							<text>{{userinfo.finalAddress ? userinfo.finalAddress :'暂无'}}</text>
						</view>
					</view>
					<view class="info-input" v-else>
						<text>小区地址</text>
						<view class="info-input-r">
							<text>{{userinfo.areaNamePath ? userinfo.areaNamePath :'暂无'}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="info">
				<view class="info-input">
					<text>客户来源</text>
					<view class="info-input-r">
						<text>{{userinfo.typeName ? userinfo.typeName :'暂无'}}</text>
					</view>
				</view>
				<view class="info-input">
					<text>客户类型</text>
					<view class="info-input-r">
						<text>{{userinfo.relationshipName ? userinfo.relationshipName :'暂无'}}</text>
					</view>
				</view>
				<!-- 				<view class="info-input">
					<text>所属门店</text>
					<view class="info-input-r">
						<text>{{userinfo.storeName ? userinfo.storeName : '暂无'}}</text>
					</view>
				</view> -->
				<view class="info-input">
					<text>业务员</text>
					<view class="info-input-r">
						<text>{{userinfo.employeeName ? userinfo.employeeName :'暂无' }}</text>
					</view>
				</view>
				<view class="info-input">
					<text>备注</text>
					<view class="info-input-r">
						<text>{{userinfo.remark ? userinfo.remark :'暂无' }}</text>
					</view>
				</view>
			</view>
			<view class="info">
				<view class="info-input" style="border: none;">
					<text>装修进度</text>
					<view class="info-input-r">
						<text style="color: #B80201;"></text>
					</view>
				</view>
			</view>
			<view class="info">
				<view class="info-title" @click="houseShow=!houseShow">
					<text>住房信息</text>
					<image src="../../../static/image/workbench/customer-manage/up.png" mode="" v-if="houseShow">
					</image>
					<image src="../../../static/image/workbench/customer-manage/down.png" mode="" v-else></image>
				</view>
				<view class="" v-if="houseShow">
					<view class="info-input">
						<text>建筑面积</text>
						<view class="info-input-r">
							<text>{{userinfo.buildingArea ? userinfo.buildingArea+'㎡' :'暂无' }}</text>
						</view>
					</view>
					<view class="info-input">
						<text>户型</text>
						<view class="info-input-r">
							<text>{{userinfo.roomTypeName ? userinfo.roomTypeName :'暂无' }}</text>
						</view>
					</view>
					<view class="info-input">
						<text>装修风格</text>
						<view class="info-input-r">
							<text>{{userinfo.decorationStyleName ? userinfo.decorationStyleName :'暂无' }}</text>
						</view>
					</view>
					<view class="info-input">
						<text>收款金额</text>
						<view class="info-input-r">
							<input type="text" disabled="true" value="" />
						</view>
					</view>
					<view class="info-input">
						<text>预算金额</text>
						<view class="info-input-r">
							<input type="text" disabled="true" value="" />
						</view>
					</view>
					<view class="info-input">
						<text>预计装修时间</text>
						<view class="info-input-r">
							<text>{{userinfo.dateForDecoration ? userinfo.dateForDecoration :'暂无' }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="type-imgs">
				<view class="type-imgs-text">
					户型图
				</view>
				<view class="imgs" v-if="userinfo.attachInfoList">
					<image :src="val" mode="" v-for="(val,index) in userinfo.attachInfoList" :key="index"
						@click="previewImage(val)">
					</image>
				</view>
			</view>
		</view>
		<!-- 选择门店 -->
		<view class="">
			<u-popup v-model="showPopup" mode="bottom" border-radius='20' z-index="99999" :mask-close-able="false">
				<view class="popups">
					<view class="popups-title">
						<text class="popups-title-l" @click="showPopup=false">取消</text>
						<text class="popups-title-c">请选择门店</text>
						<text class="popups-title-r" @click="confirmStore">确认</text>
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
		<!-- 根据按钮的key弹出不同的内容 -->
		<u-popup v-model="EarlyHouseApplicationShow" mode="bottom" border-radius='16' :mask-close-able="false">
			<view class="EarlyHouseApplicationStyle">
				<view class="EarlyHouseApplicationStyle-top">
					<view class="EarlyHouseApplicationStyle-top-cancel" @click='cancel'>
						取消
					</view>
					<view class="">
						<view class="EarlyHouseApplicationStyle-t">
							{{currentBtn.title}}
						</view>
					</view>
					<view class="EarlyHouseApplicationStyle-top-confirm" @click="application">
						确定
					</view>
				</view>
				<scroll-view scroll-y="true" :scroll-top="scrollViewTop">
					<view style="max-height: 1000rpx;box-sizing: border-box;">
						<!-- 期房申请，提交 -->
						<view class="EarlyHouseApplicationStyle-submit"
							v-show="currentKey.indexOf('EarlyHouseApplication')!=-1 || currentKey.indexOf('Submit')!=-1">
							<view class="EarlyHouseApplicationStyle-c2-y" v-if="currentKey.indexOf('Submit')!=-1">
								<text class="title">移交部门</text>
								<view class="inputs">
									<input type="" v-model="storeId.name" placeholder="请选择移交部门" :disabled="true"
										@click="showPopup=true" />
									<image src="/static/image/workbench/customer-manage/right.png" mode=""></image>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="currentKey.indexOf('Submit')!=-1&&storeId.value">
								<text class="title">移交审核人</text>
								<view class="inputs">
									<input type="" v-model="designManager.name" placeholder="请选择移交审核人" :disabled="true"
										@click="showStage('designManager')" />
									<image src="/static/image/workbench/customer-manage/right.png" mode=""></image>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-submit-text" style="height: 80rpx;">
								申请原因
							</view>
							<view class="" style="background-color: #F9F9F9;position: relative;"
								:style="onFocus ? 'height: 900rpx;':''">
								<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon"
									v-if="!applicationReason.length"></image>
								<textarea maxlength="30" @focus='getMargin' @blur="removeMargin" @input="iconShow=false"
									:auto-blur="true" :adjust-position="false" v-model="applicationReason"
									placeholder="     请输入申请原因" style="margin: 20rpx 0;"></textarea>
							</view>
						</view>
						<!-- 上传图片 -->
						<view class="EarlyHouseApplicationStyle-submit" v-show="currentKey.indexOf('UploadPhotos')!=-1">
							<view class="" v-show="currentKey.indexOf('UploadPhotos')!=-1"
								style="padding: 10rpx;padding-top: 78rpx;">
								<u-upload :source-type="['camera','album']" :customSelect="true" :isImprint="true"
									ref="uUpload" width="196rpx" height="196rpx" :action="action"
									:formData="{attachType: '1009-60'}" :header="header" name="files"
									:auto-upload="false" max-count="6" :custom-btn="true" @on-uploaded="onUpload"
									@on-list-change="listChange">
									<view slot="addBtn">
										<image src="/static/image/mine/account/add.png"
											style="width: 196rpx; height: 196rpx;margin: 0;">
										</image>
									</view>
								</u-upload>
							</view>
						</view>
						<!-- 飞单申请 -->
						<view class="EarlyHouseApplicationStyle-c2"
							v-show="currentKey == 'AtFirstSight.FlyingOrder' || currentKey =='SecondSee.FlightOrder' || currentKey.indexOf('EorderApply')!=-1 || currentKey.indexOf('RebornApply')!=-1">
							<view class="EarlyHouseApplicationStyle-c2-y">
								<text class="title">客户姓名</text>
								<text
									class="content">{{ key == 'FlightOrderEscape' || key == 'DesertedOrderEscape' || userinfo.infoShow ?userinfo.customerName:userinfo.customerShowName}}</text>
							</view>
							<!-- 							<view class="EarlyHouseApplicationStyle-c2-y">
								<text class="title" style=''>手机号</text>
								<text class="content"
									v-if="userinfo.mobileNumber">{{phoneNumShow(userinfo.mobileNumber)}}</text>
							</view> -->
							<!-- 							<view class="EarlyHouseApplicationStyle-c2-y" v-if="userinfo.infoShow">
								<text class="title">装修地址</text>
								<text class="content">{{userinfo.finalAddress}}</text>
							</view> -->
							<view class="EarlyHouseApplicationStyle-c2-y">
								<text class="title">分类</text>
								<view class="inputs">
									<input type="" v-model="flyType" placeholder="请选择分类" :disabled="true"
										@click="FlyingOrderShow=true" />
									<image src="/static/image/workbench/customer-manage/right.png" mode=""></image>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-e" :style="onFocus ? 'height: 900rpx;':''">
								<!-- <text class="EarlyHouseApplicationStyle-submit-text">备注</text> -->
								<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon"
									v-if="!remark.length"></image>
								<textarea @focus='getMargin' @blur="removeMargin" :auto-blur="true"
									:adjust-position="false" v-model="remark" placeholder="     请输入备注内容"
									maxlength="30"></textarea>
							</view>
						</view>
						<!-- 保留申请 -->
						<view class="EarlyHouseApplicationStyle-c2"
							v-show="currentKey.indexOf('ReservationApplication')!=-1">
							<view class="EarlyHouseApplicationStyle-c2-y">
								<text class="title">申请天数</text>
								<input type="number" maxlength="3" :adjust-position="false" @focus='getMargin'
									@blur="removeMargin" v-model="days" placeholder="请输入申请天数" />
							</view>
							<!-- 							<view class="EarlyHouseApplicationStyle-submit-text" style="height: 80rpx;">
								申请原因
							</view> -->
							<view class="EarlyHouseApplicationStyle-c2-e" :style="onFocus ? 'height: 800rpx;':''">
								<!-- <text class='EarlyHouseApplicationStyle-submit-text'>申请原因</text> -->
								<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon"
									v-if="!remark.length"></image>
								<textarea maxlength="30" @focus='getMargin' @blur="removeMargin" :auto-blur="true"
									:adjust-position="false" v-model="remark" placeholder="     请输入申请原因"></textarea>
							</view>
						</view>
						<!-- 审核 -->
						<view class="EarlyHouseApplicationStyle-c2"
							v-show="currentKey.indexOf('FutureHouseReview')!=-1 || currentKey.indexOf('MultiRoomAudit')!=-1 || currentKey.indexOf('RetentionAudit')!=-1 || currentKey.indexOf('StageAudit')!=-1 || currentKey=='FlightOrderEscape.Flyer' || currentKey == 'DesertedOrderEscape.Evasion' || currentKey.indexOf('RebornTrial')!=-1">
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-show="currentKey.indexOf('MultiRoomAudit')==-1">
								<text class="title">申请内容</text>
								<text class="content"
									style="white-space: pre-wrap;">{{auditContent ? auditContent : '无'}}</text>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-e"
								v-show="currentKey.indexOf('MultiRoomAudit')==-1"
								style="border-bottom: 1rpx solid #EEEEEE;padding-bottom: 20rpx;" v-if="image.length">
								<text class="EarlyHouseApplicationStyle-submit-text">申请图片</text>
								<view class="" style="display: flex;align-items: center;flex-wrap: wrap;">
									<image :src="val" mode="aspectFit" v-for="(val,index) in image"
										style="width: 196rpx;height: 196rpx;margin:0 20rpx 20rpx 0;"
										@click="previewImage(val)">
									</image>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="currentKey.indexOf('RetentionAudit')!=-1">
								<text class="title">申请天数</text>
								<text class="content">{{days}}天</text>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="currentKey=='FlightOrderEscape.Flyer' || currentKey == 'DesertedOrderEscape.Evasion' || currentKey.indexOf('RebornTrial')!=-1">
								<text class="title">申请类型</text>
								<text class="content">{{classificationName}}</text>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="currentKey=='FlightOrderEscape.Flyer' || currentKey == 'DesertedOrderEscape.Evasion' || currentKey.indexOf('RebornTrial')!=-1">
								<text class="title">申请人</text>
								<text class="content">{{applicantName}}</text>
							</view>
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
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="auditStatus=='1010-20'&&currentKey.indexOf('StageAudit')!=-1">
								<text class="title">下一阶段</text>
								<view class="inputs">
									<input type="" v-model="nextStage.name" placeholder="请选择下一阶段" :disabled="true"
										@click="showStage('nextStage')" />
									<image src="/static/image/workbench/customer-manage/right.png" mode=""></image>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="auditStatus=='1010-20'&&currentKey.indexOf('StageAudit')!=-1">
								<text class="title">设计师</text>
								<view class="inputs">
									<input type="" v-model="designer.name" placeholder="请选择设计师" :disabled="true"
										@click="showStage('designer')" />
									<image src="/static/image/workbench/customer-manage/right.png" mode=""></image>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="auditStatus=='1010-20'&&nextStage.value=='1033-60'&&currentKey.indexOf('StageAudit')!=-1">
								<text class="title">分总</text>
								<view class="inputs">
									<input v-model="subTotal.name" placeholder="请选择分总" :disabled="true"
										@click="showStage('subTotal')" />
									<image src="/static/image/workbench/customer-manage/right.png" mode=""></image>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="auditStatus=='1010-20'&&userinfo.type!='1033-70'&&nextStage.value=='1033-70'&&currentKey.indexOf('StageAudit')!=-1">
								<text class="title">设计经理</text>
								<view class="inputs">
									<input type="" v-model="designManager.name" placeholder="请选择设计经理" :disabled="true"
										@click="showStage('designManager')" />
									<image src="/static/image/workbench/customer-manage/right.png" mode=""></image>
								</view>
							</view>
							<view class="" style='margin-top: 20rpx;color: red;' v-if="userID!=''&&!userID">
								智装erp不存在该分总！{{userID}}
							</view>
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="auditStatus=='1010-20'&&userinfo.type!='1033-70'&&(nextStage.value=='1033-70' || nextStage.value=='1033-60')&&currentKey.indexOf('StageAudit')!=-1">
								<text class="title">智装erp账号</text>
								<view class="inputs">
									<input type="" :adjust-position="false" @focus='getMargin' @blur="removeMargin"
										v-model="userCode" maxlength="16" placeholder="请输入智装erp账号" :disabled="false" />
									<image src="/static/image/workbench/customer-manage/right.png" mode=""></image>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-y"
								v-if="auditStatus=='1010-20'&&userinfo.type!='1033-70'&&(nextStage.value=='1033-70' || nextStage.value=='1033-60')&&currentKey.indexOf('StageAudit')!=-1">
								<text class="title">智装erp密码</text>
								<view class="inputs">
									<input type="password" :adjust-position="false" @focus='getMargin'
										@blur="removeMargin" v-model="pwd" maxlength="16" placeholder="请输入智装erp密码"
										:disabled="false" />
									<image src="/static/image/workbench/customer-manage/right.png" mode=""></image>
								</view>
							</view>
							<view class="EarlyHouseApplicationStyle-c2-e" :style="onFocus ? 'height: 800rpx;':''">
								<!-- <text class="EarlyHouseApplicationStyle-submit-text">审核内容:</text> -->
								<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon"
									v-if="!remark.length"></image>
								<textarea v-model="remark" @focus='getMargin' @blur="removeMargin" :auto-blur="true"
									:adjust-position="false" placeholder="     请输入审核内容" maxlength="30"></textarea>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<u-picker mode="selector" cancel-color="#AAAAAA" confirm-color="#B80201" range-key='name' v-model="rangeShow"
			:default-selector="[rangeIndex]" :range="range" @confirm='rangeChange'></u-picker>
		<u-picker mode="selector" range-key='name' v-model="nextStage.show" confirm-color="#B80201"
			:default-selector="[nextStage.index]" :range="nextStage.list" @confirm='selectNextStage'>
		</u-picker>
		<u-picker mode="selector" cancel-color="#AAAAAA" confirm-color="#B80201" range-key='name'
			v-model="subTotal.show" :default-selector="[subTotal.index]" :range="subTotal.list"
			@confirm='selectNextStage'>
		</u-picker>
		<u-picker mode="selector" cancel-color="#AAAAAA" confirm-color="#B80201" range-key='name'
			v-model="designManager.show" :default-selector="[designManager.index]" :range="designManager.list"
			@confirm='selectNextStage'>
		</u-picker>
		<u-picker mode="selector" cancel-color="#AAAAAA" confirm-color="#B80201" range-key='name'
			v-model="designer.show" :default-selector="[designer.index]" :range="designer.list"
			@confirm='selectNextStage'>
		</u-picker>
		<u-picker mode="selector" cancel-color="#AAAAAA" confirm-color="#B80201" range-key='name'
			v-model="FlyingOrderShow" :default-selector="[flyTypeIndex]" :range="flySelector" @confirm='selectFlyType'>
		</u-picker>
		<u-modal v-model="eliminateShow" :confirm-style='confirmStyle' :cancel-style='camcelStyle' :content="content"
			:show-cancel-button='true' title='提醒' @confirm='eliminate' :title-style='titleStyle'
			:content-style="contentStyle">
		</u-modal>
		<u-modal v-model="delCustomersShow" :confirm-style='confirmStyle' :cancel-style='camcelStyle'
			:content="content2" :show-cancel-button='true' title='提醒' @confirm='delCustomers' :title-style='titleStyle'
			:content-style="contentStyle">
		</u-modal>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				iconShow: true,
				currentBtn: {},
				//选择部门
				storeId: {
					name: '',
					value: ''
				},
				showPopup: false,
				storeTabList: [{
					name: '请选择',
					id: '',
					code: ''
				}],
				storeCurrent: 0,
				barStyle: {
					background: 'linear-gradient(270deg, #FF8382 0%, #B80201 100%)'
				},
				storeList: [],
				//
				uploadImg: [],
				rangeShow: false,
				rangeIndex: 0,
				rangeText: '',
				range: [{
					value: 0,
					name: "审核通过"
				}, {
					value: 1,
					name: "审核不通过"
				}, ],
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
				content: '是否确认剔除？',
				content2: '是否确认删除',
				applicationReason: '',
				EarlyHouseApplicationShow: false, //期房申请,飞单申请
				FlyingOrderShow: false, //飞单类型
				flySelector: [],
				flyType: '',
				remark: '',
				classification: '', //飞单类型
				flyTypeIndex: 0,
				// 默认头像男女
				defaultAvatar: '/static/image/mine/avatar-mis.png', //'/static/image/mine/default-user-avatar.png',
				defaultWomenAvatar: '/static/image/mine/avatar-mr.png', //'/static/image/mine/default-women-avatar.png',
				navbar_bg: {
					 backgroundImage:"url('/static/image/tab-bar/new-detail-bg.png')"
				},
				userShow: true,
				houseShow: true,
				flyShow: true,
				evasionShow: true,
				btnList: [],
				userinfo: {},
				currentKey: '',
				eliminateShow: false,
				delCustomersShow: false,
				auditId: '', //审核id
				auditStatus: '1010-20', //审核状态默认同意
				days: '', //天数
				auditContent: '', //审核内容
				textShow: false, //申请内容显示隐藏
				daysOrNum: '', //申请天数
				id: '',
				progressBtn: [], //流程按钮
				key: '', //菜单名称的key
				nextStage: {
					name: '',
					value: '',
					index: 0,
					list: [],
					show: false
				}, //下一阶段
				subTotal: {
					name: '',
					value: '',
					index: 0,
					list: [],
					show: false
				}, //分总
				designManager: {
					name: '',
					value: '',
					index: 0,
					list: [],
					show: false
				}, //设计经理
				designer: {
					name: '',
					value: '',
					index: 0,
					list: [],
					show: false
				}, //设计师
				currentStageName: '',
				applicantName: '', //飞单逃单申请人
				classificationName: '', //飞单逃单申请类型
				iStatusBarHeight: '', //状态栏高度
				userCode: '', //登录账号
				pwd: '', //登录密码
				userID: '',
				zIndex: 999,
				//上传图片
				action: '',
				header: {
					'X-Auth-Token': ''
				},
				image: [],
				scrollViewTop: 0,
				onFocus: false,
				applyDetail: {}, //审核详情
				salesmanId: '',
				preKey: 'SecondSee.',
				surveyType: ''
			}
		},
		onLoad(options) {
			this.userCode = this.vuex_user.zhiAccount
			this.pwd = this.vuex_user.zhiPwd
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
			if (options.key) {
				this.key = options.key
			}
			if (options.btnList) {
				this.btnList = JSON.parse(options.btnList)
			}
			if (options.agencyId) {
				this.toDealWithIsView(options.agencyId)
			}
			this.id = options.id
			this.getTypeList('1041')
			this.getEasyList('1042-03')
			this.getEasyList('1042-06')
			this.getEasyList('1042-05')
			this.getPosition()
			this.header['X-Auth-Token'] = this.vuex_token
			this.getOrg('')
		},
		onShow() {
			this.getDetail(this.id)
		},
		methods: {
			//业务员或设计经理上传附件
			uploadAttach(attachIds) {
				this.$post({
					url: this.api.CustomerAuditInfo.uploadAttach,
					data: {
						attachIds: attachIds,
						id: this.auditId
					}
				}).then(res => {
					this.$Toast('提交成功')
					// this.remark = ''
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			//确认部门
			confirmStore() {
				this.showPopup = false
			},
			//改变部门
			change(index) {
				this.storeCurrent = index;
				this.getOrg(this.storeTabList[index].code)
			},
			//选择部门
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
				// this.storeCode = val.code
				this.storeId.value = val.id
				this.storeId.name = val.name
				this.getOrg(val.code)
				this.getEasyList('1042-05')
			},
			//获取部门	
			getOrg(code) {
				this.$get({
					url: this.api.CustomInfo.getOrg,
					data: {
						code: code
					}
				}).then(res => {
					res.forEach(item => {
						if (item.id == this.vuex_user.orgId) {
							this.vuex_user.organizationId = item.code
						}
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
			//查看图片
			previewImage(e) {
				uni.previewImage({
					current: e,
					urls: this.image //一个数组，可以查看多张图
				});
			},
			listChange(list, name) {
				this.image = list.length

			},
			//上传图片
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

				if (!attaches.length) {
					this.$Toast('图片不能为空')
				} else {
					this.uploadAttach(attaches)
				}

			},
			//删除
			delCustomers() {
				this.$post({
					url: this.api.CustomInfo.delCustomers,
					data: [this.userinfo.id],
				}).then(res => {
					this.$Toast('删除成功！')
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)

				}).catch(err => {
					this.$Toast('删除失败！')
				})
			},
			//阶段审核下拉框显示
			showStage(name) {
				this.currentStageName = name
				if (name == 'designer') {
					if (this.designer.list.length) {
						this[name].show = true
					} else {
						this[name].show = false
						this.$Toast('暂无设计师')
					}
				} else {
					this[name].show = true
				}
			},
			//选择下一个阶段
			selectNextStage(e) {
				this[this.currentStageName].name = this[this.currentStageName].list[e[0]].name
				if (this.currentStageName == 'nextStage') {
					this[this.currentStageName].value = this[this.currentStageName].list[e[0]].value
					this[this.currentStageName].list.forEach((item, index) => {
						if (item.value == this[this.currentStageName].value) {
							this[this.currentStageName].index = index
						}
					})
					this.userID = ''
					this.designManager.name = ''
					this.designManager.value = ''
					this.designManager.index = 0
					this.subTotal.name = ''
					this.subTotal.value = ''
					this.subTotal.index = 0
				} else {
					if (this.currentStageName != 'designer') {
						this.userID = this[this.currentStageName].list[e[0]].userId
					}
					this[this.currentStageName].value = this[this.currentStageName].list[e[0]].id
					this[this.currentStageName].list.forEach((item, index) => {
						if (item.id == this[this.currentStageName].value) {
							this[this.currentStageName].index = index
						}
					})
				}
				// console.log(this[this.currentStageName])
			},
			//获取下一阶段列表
			getNextList(type) {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: '1033'
					}
				}).then(res => {
					let indexOf = 0
					res.rows.forEach((item, index) => {
						if (item.value == this.userinfo.type) {
							indexOf = index
						}
					})
					// if (this.key == 'Agreement' && !this.applyDetail.haveSubManager) {
					// 	res.rows = res.rows.slice(indexOf, res.rows.length)
					// } else {
					// 	res.rows = res.rows.slice(indexOf + 1, res.rows.length)
					// }
					res.rows = res.rows.slice(indexOf + 1, res.rows.length)
					const filterList = ['1033-70', '1033-80', '1033-90']
					const newList = res.rows.filter(item => {
						return !filterList.includes(item.value)
					})
					this.nextStage.list = newList
					this.nextStage.name = newList[0].name
					this.nextStage.value = newList[0].value
				})
			},
			//获取职位
			getPosition() {
				this.$get({
					url: this.api.SysOrganization.getList,
					data: {
						organizationsId: 1042
					}
				}).then(res => {
					res.rows.forEach(item => {
						if (item.positionCode == '1042-01') {
							this.salesmanId = item.id
						}
					})
				})
			},
			//获取分总和设计经理
			getEasyList(positionCode) {
				this.$post({
					url: this.api.Employee.getEasyList,
					data: {
						currentPage: 0,
						pageSize: 0,
						positionCode: positionCode,
						organizationId: positionCode == '1042-06' ? this.vuex_user.organizationId : this.storeId
							.value,
					}
				}).then(res => {
					if (positionCode == '1042-03') {
						this.subTotal.list = res.rows
					} else if (positionCode == '1042-05') {
						this.designManager.list = res.rows
					} else {
						this.designer.list = res.rows
					}
				})
			},
			// 获取设计师
			getDesignerList() {
				this.$post({
					url: this.api.Employee.getEasyList,
					data: {
						currentPage: 0,
						pageSize: 0,
						positionCode: '1042-06',
						organizationId: this.vuex_user.orgId
					}
				}).then(res => {
					this.designer.list = res.rows
				})
			},
			//协议公海池流程
			topage(val) {
				console.log(val)
				if (val.workFlowRelationFormCode == '1059-10') {
					uni.navigateTo({
						url: 'send-designer?workFlowInfoId=' + val.flowId + '&workFlowNodeId=' + val.id +
							'&title=' + val.name
					})
					uni.setStorageSync('positionIds', val.employeePositionIds)
				}
				if (val.workFlowRelationFormCode == '1059-20') {
					uni.navigateTo({
						url: 'measure-room?workFlowInfoId=' + val.flowId + '&workFlowNodeId=' + val.id +
							'&title=' + val.name
					})
				}
				if (val.workFlowRelationFormCode == '1059-30') {
					uni.navigateTo({
						url: 'sign-agreement?workFlowInfoId=' + val.flowId + '&workFlowNodeId=' + val.id +
							'&title=' + val.name
					})
				}
				if (val.workFlowRelationFormCode == '1059-50') {
					uni.navigateTo({
						url: 'measure-room?workFlowInfoId=' + val.flowId + '&workFlowNodeId=' + val.id +
							'&title=' + val.name + '&code=' + val.workFlowRelationFormCode
					})
				}
				if (val.workFlowRelationFormCode == '1059-40') {
					uni.navigateTo({
						url: 'contract?workFlowInfoId=' + val.flowId + '&workFlowNodeId=' + val.id +
							'&title=' + val.name + '&constructionContractId=' + this.userinfo
							.constructionContractId
					})
				}
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
			//按钮权限展示
			btnshows(key) {
				if (key.indexOf('FutureHouseReview') != -1) {
					return this.userinfo.expectHouse
				} else if (key.indexOf('MultiRoomAudit') != -1) {
					return this.userinfo.multiHouse
				} else if (key.indexOf('EarlyHouseApplication') != -1) {
					return !this.userinfo.future && !this.userinfo.expectHouse
				} else if (key == 'AtFirstSight.MultiRoom' || key == 'SecondSee.MultiRoom' || key ==
					'Agreement.MultiRoom') {
					return !this.userinfo.multiHouse
				} else if (key.indexOf('RetentionAudit') != -1) {
					return this.userinfo.retainApply
				} else if (key.indexOf('ReservationApplication') != -1) {
					return !this.userinfo.isRetainApply && !this.userinfo.retainApply
				} else if (key.indexOf('Submit') != -1) {
					return !this.userinfo.onCustomerType && !this.userinfo.auditStatus
				} else if (key.indexOf('StageAudit') != -1) {
					return this.userinfo.onCustomerAudit && this.userinfo.onCustomerType && this.userinfo.auditStatus ==
						'1076-30'
				} else if (key == 'FlightOrderEscape.Flyer' || key == 'DesertedOrderEscape.Evasion') {
					return this.userinfo.status == '1010-10' && !this.userinfo.isReborn && !this.userinfo.lost
				} else if (key.indexOf('RebornApply') != -1) {
					return this.userinfo.status == '1010-20' && !this.userinfo.isReborn && this.userinfo.lost && !
						this
						.userinfo.onApplication
				} else if (key.indexOf('RebornTrial') != -1) {
					return this.userinfo.status == '1010-10' && this.userinfo.isReborn && this.userinfo.lost
				} else if (key == 'Original.Distribution' || key == 'Original.Delete') {
					return !this.userinfo.blocked
				} else if (key.indexOf('UploadPhotos') != -1) {
					return this.userinfo.auditStatus == '1076-10'
				} else if (key.indexOf('Questionnaire') != -1) {
					return this.userinfo.auditStatus == '1076-20' && this.vuex_user.positions.some(item => {
						return item == this.salesmanId
					})
				} else if (key == 'Agreement.Edit') {
					if (!!!this.userinfo.subManager) {
						return true
					} else {
						return false
					}
				} else if (key.indexOf('List') != -1 || key.indexOf('Detail') != -1) {
					return false
				} else {
					return true
				}
			},
			//取消
			cancel() {
				this.EarlyHouseApplicationShow = false
				this.rangeShow = false
				this.rangeIndex = 0
				this.rangeText = ''
				this.remark = ''
				this.flyTypeIndex = 0
				this.flyType = ''
				this.applicationReason = ''
				this.auditStatus = '1010-20'
				this.days = ''
				this.nextStage.name = this.nextStage.list.length ? this.nextStage.list[0].name : ''
				this.nextStage.value = this.nextStage.list.length ? this.nextStage.list[0].value : ''
				this.nextStage.index = 0
				this.designManager.name = ''
				this.designManager.value = ''
				this.designManager.index = 0
				this.subTotal.name = ''
				this.subTotal.value = ''
				this.subTotal.index = 0
				this.userID = ''
				this.storeId = {
					name: '',
					value: ''
				}
				this.storeTabList = [{
					name: '请选择',
					id: '',
					code: ''
				}]
				this.storeCurrent = 0
				this.getOrg()
			},
			rangeChange(e) {
				// console.log(e[0])
				this.rangeIndex = e
				if (e == 0) {
					this.auditStatus = '1010-20'
				} else {
					this.auditStatus = '1010-30'
				}
			},
			getTypeList(type) {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: type
					}
				}).then(res => {
					this.flySelector = res.rows
				})
			},
			application() {
				if (this.currentKey.indexOf('EarlyHouseApplication') != -1) {
					if (!this.applicationReason) {
						this.$Toast('请先输入申请原因')
						return
					}
					this.futureHouseApply()
				}
				if (this.currentKey == 'AtFirstSight.FlyingOrder' || this.currentKey == 'SecondSee.FlightOrder' ||
					this.currentKey.indexOf('EorderApply') != -1 || this.currentKey
					.indexOf('RebornApply') != -1) {
					if (!this.classification) {
						this.$Toast('请先选择类型')
						return
					}
					let type = '1040-10'
					if (this.currentKey.indexOf('EorderApply') != -1 || this
						.currentKey == 'DesertedOrderEscape.RebornApply') {
						type = '1040-20'
					}
					if (this.currentKey.indexOf('RebornApply') != -1) {
						this.flyerApply(type, true)
					} else {
						this.flyerApply(type, false)
					}

				}
				if (this.currentKey.indexOf('RetentionAudit') != -1) {
					if (this.remark == '') {
						this.$Toast('审核内容不能为空！')
						return
					}
					this.examine('1056-10')
				}
				if (this.currentKey.indexOf('FutureHouseReview') != -1) {
					if (this.remark == '') {
						this.$Toast('审核内容不能为空！')
						return
					}
					this.examine('1056-20')
				}
				if (this.currentKey.indexOf('MultiRoomAudit') != -1) {
					if (this.remark == '') {
						this.$Toast('审核内容不能为空！')
						return
					}
					this.examine('1056-30')
				}
				if (this.currentKey.indexOf('StageAudit') != -1) {
					if (this.auditStatus == '1010-20') {
						if (!this.designer.value) {
							this.$Toast('请选择设计师')
							return
						}
						if (this.nextStage.value == '1033-70' || this.nextStage.value == '1033-60') {
							if (this.nextStage.value == '1033-60' && !this.subTotal.value) {
								this.$Toast('请选择分总')
								return
							}
							if (this.nextStage.value == '1033-70' && !this.designManager.value) {
								this.$Toast('请选择设计经理')
								return
							}
						}
					}
					this.examine(this.nextStage.value)
				}
				if (this.currentKey == 'FlightOrderEscape.Flyer' || this.currentKey == 'DesertedOrderEscape.Evasion' ||
					this.currentKey.indexOf('RebornTrial') != -1) {
					this.auditFlyOrEvasion()
				}
				// if (this.currentKey == 'DesertedOrderEscape.Evasion') {
				// 	this.auditFlyOrEvasion()
				// }
				if (this.currentKey.indexOf('ReservationApplication') != -1) {
					if (!this.remark) {
						this.$Toast('请先输入申请原因')
						return
					}
					if (!this.days) {
						this.$Toast('请先输入申请天数')
						return
					}
					if (!this.remark) {
						this.$Toast('请先输入审核内容')
						return
					}
					this.keepApply()
				}
				if (this.currentKey.indexOf('Submit') != -1) {
					this.toSubmit()
				}
				if (this.currentKey.indexOf('UploadPhotos') != -1) {
					this.$refs.uUpload.upload();
				}
			},
			//提交
			toSubmit(attachIds) {
				this.$post({
					url: this.api.CustomInfo.customerStageApply,
					data: {
						id: this.userinfo.id,
						applicationReason: this.applicationReason,
						attachIds: attachIds,
						auditor: this.designManager.value
					}
				}).then(res => {
					this.EarlyHouseApplicationShow = false
					this.$Toast('申请成功')
					// this.remark = ''
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			//期房申请
			futureHouseApply() {
				this.$post({
					url: this.api.CustomInfo.futureHouseApply,
					data: {
						id: [this.userinfo.id],
						applicationReason: this.applicationReason
					}
				}).then(res => {
					this.EarlyHouseApplicationShow = false
					this.$Toast('申请成功')
					// this.applicationReason = ''
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			//保留申请
			keepApply() {
				this.$post({
					url: this.api.CustomInfo.keepApply,
					data: {
						id: this.userinfo.bindId,
						applicationReason: this.remark,
						daysOrNum: this.days
					}
				}).then(res => {
					this.EarlyHouseApplicationShow = false
					this.$Toast('申请成功')
					// this.remark = ''
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			//飞单申请
			flyerApply(type, isReborn) {
				this.$post({
					url: this.api.CustomInfo.flyerApply,
					data: {
						customerId: isReborn ? this.userinfo.customerId : this.userinfo.id,
						remark: this.remark,
						type: type,
						classification: this.classification,
						isReborn: isReborn
					}
				}).then(res => {
					this.EarlyHouseApplicationShow = false
					this.$Toast('申请成功')
					// this.remark = ''
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			//飞单逃单审核
			auditFlyOrEvasion() {
				this.$post({
					url: this.api.CustomInfo.auditFlyOrEvasion,
					data: {
						auditContent: this.remark,
						ids: [this.auditId],
						status: this.auditStatus,
					}
				}).then(res => {
					this.EarlyHouseApplicationShow = false
					this.$Toast('审核成功')
					// this.remark = ''
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			//审核
			examine(type) {
				this.$post({
					url: this.api.CustomInfo.audit,
					data: {
						customerId: this.userinfo.id,
						auditContent: this.remark,
						type: type,
						ids: [this.auditId],
						status: this.auditStatus,
						employeeId: this.nextStage == '1033-70' ? this.designManager.value : this.subTotal
							.value,
						pwd: this.pwd,
						userCode: this.userCode,
						employeeType: type == '1033-70' ? '1042-05' : '1042-03',
						designer: this.designer.value
					}
				}).then(res => {
					this.EarlyHouseApplicationShow = false
					this.$Toast('审核成功')
					// this.remark = ''
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},
			// 选择飞单类型
			selectFlyType(e) {
				this.flyType = this.flySelector[e[0]].name
				this.classification = this.flySelector[e[0]].value
				this.flySelector.forEach((item, index) => {
					if (item.value == this.flySelector[e[0]].value) {
						this.flyTypeIndex = index
					}
				})

			},
			//获取飞单逃单申请信息
			getCustomerFlyOrEvasion(type, id, isReborn) {
				this.$post({
					url: this.api.CustomInfo.getCustomerFlyOrEvasion,
					data: {
						customerId: id,
						type: type,
						isReborn: isReborn
					}
				}).then(res => {
					this.applicantName = res.applicantName
					this.auditId = res.id
					this.auditContent = res.remark
					this.classificationName = res.classificationName
				})
			},
			//获取除飞单逃单外申请信息
			getCustomerAuditLog(type, id) {
				this.$post({
					url: this.api.CustomInfo.getCustomerAuditLog,
					data: {
						customerId: id,
						type: type
					}
				}).then(res => {
					this.image = []
					this.days = res.daysOrNum
					this.auditId = res.id
					this.auditContent = res.applicationReason
					this.applyDetail = res
					res.attachInfos.forEach(item => {
						this.image.push(item.path)
					})
					if (this.currentKey.indexOf('Questionnaire') != -1) {
						if (this.userinfo.type == '1033-40') {
							this.surveyType = '1078-10'
						}
						if (this.userinfo.type == '1033-50') {
							this.surveyType = '1078-30'
						}
						if (this.userinfo.type == '1033-55') {
							this.surveyType = '1078-40'
						}
						console.log(this.surveyType)
						uni.navigateTo({
							url: 'questionnaire?applicationId=' + this.auditId + '&customerId=' + this
								.userinfo.id + '&type=' + this.surveyType
						})
					}
				})
			},
			//按钮
			btns(val) {
				this.currentKey = val.key
				this.currentBtn = val
				if (val.key == 'AtFirstSight.MultiRoom' || val.key == 'SecondSee.MultiRoom' || val.key ==
					'Agreement.MultiRoom') {
					uni.navigateTo({
						url: 'customer-entry?phone=' + this.userinfo.mobileNumber + '&key=' + this.key +
							'&customerName=' + this.userinfo.customerName + '&customerShowName=' + this.userinfo
							.customerShowName + '&infoShow=' + this.userinfo.infoShow
					})
				}
				if (val.key.indexOf('Questionnaire') != -1) {
					this.getCustomerAuditLog('1056-40', this.userinfo.id)
				}
				if (val.key.indexOf('EarlyHouseApplication') != -1 || val.key == 'AtFirstSight.FlyingOrder' || val
					.key ==
					'SecondSee.FlightOrder' || val.key.indexOf('FutureHouseReview') != -1 || val.key.indexOf(
						'MultiRoomAudit') != -1 || val.key.indexOf('ReservationApplication') != -1 || val.key
					.indexOf(
						'RetentionAudit') != -1 || val.key.indexOf('EorderApply') != -1 || val.key.indexOf('Submit') != -
					1 || val.key.indexOf('StageAudit') != -1 || val.key == 'DesertedOrderEscape.Evasion' || val
					.key ==
					'FlightOrderEscape.Flyer' || val.key.indexOf('RebornApply') != -1 || val.key.indexOf('RebornTrial') !=
					-1 || val.key.indexOf('UploadPhotos') != -1) {
					if (val.key.indexOf('FutureHouseReview') != -1) {
						this.getCustomerAuditLog('1056-20', this.userinfo.id)
					}
					if (val.key.indexOf('MultiRoomAudit') != -1) {
						this.getCustomerAuditLog('1056-30', this.userinfo.id)
					}
					if (val.key.indexOf('RetentionAudit') != -1) {
						this.getCustomerAuditLog('1056-10', this.userinfo.bindId)
					}
					if (val.key.indexOf('StageAudit') != -1) {
						// this.getEasyList('1042-06')
						this.getDesignerList()
						this.getCustomerAuditLog('1056-40', this.userinfo.id)
						this.getNextList()
					}
					if (val.key.indexOf('UploadPhotos') != -1) {
						this.getCustomerAuditLog('1056-40', this.userinfo.id)
					}
					if (val.key == 'FlightOrderEscape.Flyer') {
						this.getCustomerFlyOrEvasion('1040-10', this.userinfo.customerId, false)
					}
					if (val.key == 'FlightOrderEscape.RebornTrial') {
						this.getCustomerFlyOrEvasion('1040-10', this.userinfo.customerId, true)
					}
					if (val.key == 'DesertedOrderEscape.RebornTrial') {
						this.getCustomerFlyOrEvasion('1040-20', this.userinfo.customerId, true)
					}
					if (val.key == 'DesertedOrderEscape.Evasion') {
						this.getCustomerFlyOrEvasion('1040-20', this.userinfo.customerId, false)
					}
					this.EarlyHouseApplicationShow = true
				}
				if (val.key.indexOf('Eliminate') != -1) {
					this.eliminateShow = true
				}
				if (val.key.indexOf('Distribution') != -1) {
					uni.navigateTo({
						url: './select-employee?allocationIds=' + JSON.stringify([this.userinfo.id])
					})
				}
				if (val.key.indexOf('Edit') != -1) {
					uni.navigateTo({
						url: 'customer-entry?id=' + this.userinfo.id + '&key=' + this.key
					})
				}
				if (val.key == 'Original.Delete') {
					this.delCustomersShow = true
				}
				if (val.key == 'FlightOrderEscape.See' || val.key == 'DesertedOrderEscape.See') {
					uni.navigateTo({
						url: 'flyer-list?customerId=' + this.userinfo.customerId + '&key=' + this.key
					})
				}
			},
			//剔除
			eliminate() {
				this.$post({
					url: this.api.CustomInfo.promoteCustomer,
					data: {
						customerIds: [this.userinfo.id],
						status: '1054-40',
						type: this.userinfo.type
					}
				}).then(res => {
					uni.navigateBack({

					})
				})
			},
			//获取详情
			getDetail(id) {
				this.$get({
					url: this.key == 'FlightOrderEscape' || this.key == 'DesertedOrderEscape' ? this.api
						.CustomInfo
						.getFlyOrEvasionDetail : this.api.CustomInfo.getDetail,
					data: {
						id: id
					}
				}).then(res => {
					this.userinfo = res
					if (res.customerWorkFlowInfo) {
						res.customerWorkFlowInfo.currentWorkFlowInfos.forEach(item => {
							item.jurisdiction = false
						})
						this.vuex_user.positions.forEach(item => {
							res.customerWorkFlowInfo.currentWorkFlowInfos.forEach(item2 => {
								item2.positionIds.forEach(item3 => {
									if (item3 == item) {
										item2.jurisdiction = true
									}
								})
							})
						})
						this.progressBtn = res.customerWorkFlowInfo.currentWorkFlowInfos
					}
					uni.setStorageSync('customInfo', res)
					this.action = variable.apiServer + this.api.common.upload + "?customerId=" + this.userinfo
						.id // variable.apiServer + this.$api.common.upload
					// console.log(this.action)
				})
			},
			phone(item) {
				this.$get({
					url: this.api.CloudCallInfo.getCloudPhone,
					data: {
						customerId: item.id
					},
					needResponse: true
				}).then(res => {
					// console.log(res)
					uni.makePhoneCall({
						phoneNumber: res.message
					})
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
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

	.detail {
		position: relative;

		.stat {
			position: fixed;
			z-index: 99999;
			height: var(--status-bar-height); // --status-bar-height系统状态栏高度
			width: 100%;
			top: 0;
			left: 0;
			// background: url("/page/static/image/workbench/customer-manage/bg.png") no-repeat center center;
			// background-size: 100% auto;
		}

		.detail_bg {
			width: 100%;
			height: calc(328rpx + var(--status-bar-height));
			position: absolute;
			top: 0rpx;
			left: 0rpx;
			z-index: 3;
		}

		.center {
			position: relative;
			z-index: 4;

			.userinfo {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 60rpx 0rpx 0 30rpx;

				.userinfo-l {
					display: flex;
					align-items: center;

					.userinfo-avatar {
						height: 92rpx;
						width: 91rpx;
						border-radius: 50%;
						overflow: hidden;
						border: 4rpx solid #FFFFFF;
						margin-right: 24rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 100rpx;
							height: 100rpx;
							flex-shrink: 1;
						}
					}

					.userinfo-text {
						height: 100rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						color: #FFFFFF;

						.userinfo-text-t {
							// width: 300rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

					.shu {
						width: 0rpx;
						height: 72rpx;
						border: 2rpx solid #FFFFFF;
						opacity: 0.25;
						margin-left: 16rpx;
					}

					.userinfo-call {
						width: 48rpx;
						height: 48rpx;
						margin-left: 24rpx;
					}
				}

				.userinfo-r {
					width: 184rpx;
					height: 68rpx;
					position: relative;
					z-index: 2;
					text-align: center;
					font-size: 28rpx;
					color: #C05A00;
					line-height: 68rpx;

					image {
						width: 184rpx;
						height: 68rpx;
						position: absolute;
						top: 0rpx;
						left: 0rpx;
						z-index: -1;
					}
				}
			}

			.menus {
				width: 100%;
				background-color: #FFFFFF;
				border-radius: 24rpx;
				padding: 32rpx 10rpx 0rpx 10rpx;
				margin-bottom: 20rpx;

				.menu-btn {
					width: 100%;
					display: flex;
					align-items: flex-start;
					flex-wrap: wrap;
					text-align: center;

					view {
						width: calc(100% / 5);
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						margin-bottom: 32rpx;

						image {
							width: 56rpx;
							height: 56rpx;
							margin-bottom: 10rpx;
						}

						text {
							color: #333333;
							font-size: 24rpx;
						}
					}
				}

				.menus-time {
					font-size: 24rpx;
					color: #666666;
				}
			}

			.info {
				padding: 0 30rpx;
				background-color: #FFFFFF;
				margin-bottom: 22rpx;

				.info-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 102rpx;
					padding-top: 18rpx;
					font-size: 32rpx;
					color: #333333;
					font-weight: bold;

					image {
						width: 20rpx;
						height: 12rpx;
					}
				}

				.info-input {
					display: flex;
					align-items: center;
					justify-content: space-between;
					min-height: 112rpx;
					border-top: 1rpx solid #F0F0F0;

					text {
						color: #666666;
						font-size: 32rpx;
						flex-shrink: 0;
					}

					.info-input-r {
						display: flex;
						align-items: center;

						image {
							width: 19rpx;
							height: 36rpx;
							margin-right: 16rpx;
						}

						text {
							display: inline-block;
							max-width: 500rpx;
							// overflow: hidden;
							// white-space: nowrap;
							// text-overflow: ellipsis;
							width: auto;
							color: #333333;
							font-size: 32rpx;
							word-break: break-all;
							text-align: right;
						}

						input {
							text-align: right;
							color: #333333;
							font-size: 32rpx;
						}
					}
				}
			}

			.type-imgs {
				width: 100%;
				background-color: #FFFFFF;
				padding-bottom: 40rpx;
				padding: 40rpx 30rpx 36rpx 30rpx;

				.type-imgs-text {
					margin-bottom: 30rpx;
					font-size: 32rpx;
					color: #333333;
					font-weight: bold;
				}

				.imgs {
					display: flex;
					align-items: center;
					width: 100%;

					image {
						width: 222rpx;
						margin-right: 12rpx;
						margin-bottom: 20rpx;
						height: 222rpx;

						&:nth-child(3n) {
							margin-right: 0rpx;
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

			.writeIcon {
				position: absolute;
				width: 28rpx;
				height: 25rpx;
				top: 32rpx;
				left: 20rpx;
				z-index: 99999;
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

					input {
						font-size: 30rpx;
					}
				}

				input {
					display: inline-block;
					width: 400rpx;
					text-align: right;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 30rpx;
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

			.EarlyHouseApplicationStyle-c2 {
				width: 100%;
				padding: 0 40rpx;

				.EarlyHouseApplicationStyle-c2-e {
					position: relative;

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
	}
</style>
