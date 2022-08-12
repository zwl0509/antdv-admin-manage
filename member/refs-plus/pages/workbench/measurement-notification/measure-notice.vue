<template>
	<view class="measure-notice">
		<u-navbar title="测量通知" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333'>
			<view class="slot-wrap" slot="right">
				<view class="" style="font-size: 28rpx;color: #B80201;padding-right: 30rpx;" @click="submit">
					确定
				</view>
			</view>
		</u-navbar>
		<view class="center">
			<view class="center-input">
				<view class="center-input-l">
					<text>供应商</text>
				</view>
				<view class="center-input-r">
					<input type="text" placeholder="请选择" :value="supplyName" :disabled="true">
				</view>
			</view>
			<view class="center-input">
				<view class="center-input-l">
					<text>计划时间</text>
					<text style="color: #B80201;">*</text>
				</view>
				<view class="center-input-r" @click="timeShow=true">
					<input type="text" placeholder="请选择" v-model="info.planMeasureDate" :disabled="true">
					<image src="/static/image/workbench/customer-complaints/time.png" mode=""></image>
				</view>
			</view>
			<view class="center-title">
				<text>备注</text>
			</view>
			<view class="" style='background-color: #F9F9F9;padding: 20rpx;border-radius: 8rpx;position: relative;'>
				<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon" v-if="!info.remark.length">
				</image>
				<textarea style="height: 226rpx;width: 100%;" maxlength="200" v-model="info.remark"
					placeholder="     这里可以填写您的备注哦~" />
				<view class="" style='text-align: right;font-size: 20rpx;margin-bottom: 40rpx;'>
					<text style='color: #F43D1B;'>{{info.remark.length}}</text><text style='color: #B2B2B2;'>/80</text>
				</view>
				<u-upload ref="uUpload" width="196rpx" height="196rpx" :action="action"
					:formData="{attachType: '1009-20'}" :header="header" name="files" :auto-upload="false" max-count="3"
					:custom-btn="true" @on-uploaded="onUpload">
					<view slot="addBtn">
						<image src="/static/image/mine/account/add.png"
							style="width: 196rpx; height: 196rpx;margin: 0;">
						</image>
					</view>
				</u-upload>
			</view>
		</view>
		<u-picker mode="time" v-model="timeShow" :params="params" @confirm="selectTime" start-year="2022"></u-picker>
		<view class="center" style="padding: 0;overflow: hidden;">
			<view class="center-title" style="border-bottom: 2rpx solid #F0F0F0;padding: 32rpx 30rpx 24rpx 32rpx;margin-bottom: 40rpx;">
				<text>测量材料</text>
			</view>
			<view class="list-y-r" v-for="(item,index) in list" :key="index">
				<image src="/static/image/workbench/renovation-data/img.png" mode=""></image>
				<view class="list-y-r-content">
					<view class="list-y-r-content-y">
						<text>{{ item.materialName }}</text>
						<image src="/static/image/mine/account/cha.png" mode=""></image>
					</view>
					<view class="list-y-r-content-e">
						{{item.materialType ? item.materialType+';':''}}
						{{item.color ? item.color:''}}
						{{item.spec ? item.spec+';':''}}
					</view>
					<view class="list-y-r-content-s">
						<text>¥</text>{{ item.salePrice }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	import moment from "moment";
	export default {
		data() {
			return {
				action: '',
				header: {
					'X-Auth-Token': ''
				},
				time: '',
				supplyName:'',
				timeShow: false, //时间
				params: {
					year: true,
					month: true,
					day: true,
				},
				list:[],
				info:{
					planMeasureDate:'',
					remark:'',
					status:'',
				},
				data:[],
				infoList:[],
			}
		},
		onLoad(options) {
			const info = JSON.parse(decodeURIComponent(options.list))
			this.supplyName = info[0].supplyName
			const data= []
			info?.forEach(el=>{
				data.push(el)
			})
			this.list = this.$u.deepClone(data)
			console.log(this.list)
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
		},
		methods: {
			selectTime(e) {
				let isNow = this.dateTimeStr(e)
				if (isNow) {
					this.info.planMeasureDate = e.year + '-' + e.month + '-' + e.day
				} else {
					this.$Toast('请选择大于等于当前时间')
				}
			},
			//获取当前时间
			dateTimeStr(str) {
				var date = new Date(),
					year = date.getFullYear(), //年
					month = date.getMonth() + 1, //月
					day = date.getDate(); //日
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				if (str.year > year) {
					return true
				} else if (str.year == year) {
					if (str.month > month) {
						return true
					} else if (str.month == month) {
						if (str.day > day) {
							return true
						}
					} else {
						return false
					}
				} else {
					return false
				}
			},
			submit(){
				this.$refs.uUpload.upload()
			},
			onUpload(lists, name) {
				let files = []
				let attachIds = []
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				files.forEach(item => {
					attachIds.push(item.response.result[0].id)
				})
				this.save(attachIds,files)
			},
			save(attachIds,files) {
				if(!this.info.planMeasureDate) {
					return this.$Toast('请选择计划时间！')
				}
				if(!attachIds) {
					return this.$Toast('请选择图片！')
				}
				const ids = []
				this.list?.forEach(el=>{
					ids.push(el.id)
				})
				const data = {
					attachIds,
					files,
					chooseMaterialIds: ids,
					customerId: this.list[0].customerId,
					supplyId: this.list[0].supplyId,
					supplyName: this.list[0].supplyName,
					...this.info
				}
				const url = this.api.measureNotifyInfo.sendMeasureNotify
				this.$post({ url, data }).then(res=> {
					this.$Toast('申请成功')
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}).catch(e=> { console.log(e)})
			},
		}
	}
</script>
<style>
	page {
		background-color: #F8F8FB;
	}
</style>
<style scoped lang="less">
	.measure-notice {
		.writeIcon {
			position: absolute;
			width: 28rpx;
			height: 25rpx;
			top: 32rpx;
			left: 24rpx;
			z-index: 99;
		}

		.center {
			padding: 0 30rpx;
			background-color: #fff;
			margin-top: 20rpx;
			padding-bottom: 32rpx;

			.center-input {
				height: 112rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2rpx solid #F0F0F0;

				.center-input-l {
					display: flex;
					align-items: center;
					flex-shrink: 0;

					text {
						font-size: 32rpx;
						color: #333333;
						font-weight: bold;
					}
				}

				.center-input-r {
					display: flex;
					align-items: center;

					image {
						width: 26rpx;
						height: 28rpx;
						margin-left: 16rpx;
					}

					input {
						width: 510rpx;
						font-size: 32rpx;
						color: #333333;
						text-align: right;
					}
				}
			}

			.center-title {
				height: auto;
				border: none;
				padding: 32rpx 0 24rpx 0;
				font-size: 32rpx;
				color: #333333;
				font-weight: bold;
			}
			.list-y-r {
				display: flex;
				align-items: center;
				padding: 0 30rpx;
				margin-bottom: 40rpx;
				image {
					width: 136rpx;
					height: 136rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
				}
			
				.list-y-r-content {
					height: 136rpx;
					display: flex;
					flex-direction: column;
			
					.list-y-r-content-y {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 10rpx;
						width: calc(100vw - 136rpx - 60rpx - 20rpx);
			
						text {
							color: #333333;
							font-weight: bold;
							font-size: 28rpx;
						}
			
						image{
							width: 40rpx;
							height: 40rpx;
							margin: 0;
						}
					}
			
					.list-y-r-content-e {
						color: #666666;
						font-size: 24rpx;
						margin-bottom: 20rpx;
					}
			
					.list-y-r-content-s {
						font-size: 28rpx;
						font-weight: 800;
						color: #B80201;
			
						text {
							font-size: 22rpx;
							font-weight: 400;
						}
					}
				}
			}
		}
	}
</style>
