<template>
	<view class="notice">
		<u-navbar :title="type == '10' ? '送货通知' : '特权送货'" :border='false' :titleBold='true' :border-bottom="false" class="navbar"
			title-color='#333333' back-icon-color="#333333">
		</u-navbar>
		<view class="center">
			<view class="notice-input">
				<text>送货时间</text>
				<input type="text" placeholder="请选择" :disabled="true" v-model="sendDate" @click="timeShow = true">
			</view>
			<view style="padding: 34rpx 0 24rpx 0;font-size: 32rpx;color: #333333;font-weight: bold;">
				送货备注
			</view>
			<view class="" style='background-color: #F9F9F9;padding: 20rpx;border-radius: 8rpx;position: relative;'>
				<image src="/static/image/tab-bar/write.png" mode="" class="writeIcon" v-if="!sendRemark.length">
				</image>
				<textarea style="height: 226rpx;width: 100%;" maxlength="200" v-model="sendRemark"
					placeholder="     这里可以填写您的备注哦~" />
				<view class="" style='text-align: right;font-size: 20rpx;margin-bottom: 40rpx;'>
					<text style='color: #F43D1B;'>{{sendRemark.length}}</text><text style='color: #B2B2B2;'>/200</text>
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
		<u-picker mode="time" :isOpen="visible" v-model="timeShow" :params="params" @confirm="selectTime" start-year="2022"></u-picker>
		<view class="btn" @click="handleSubmit">
			<text>确认</text>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				type: '',
				sendRemark: '',
				action: '',
				id: '',
				header: { 'X-Auth-Token': ''},
				sendDate: '',
				timeShow: false, //时间
				visible: true,
				params: { year: true, month: true, day: true },
			}
		},
		onLoad(options) {
			this.type = options.type
			this.id = options.id
			this.action = variable.apiServer + this.api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
		},
		methods: {
			onUpload(lists, name) {
				let files = []
				let attaches = []
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				files.forEach(item => {
					attaches.push(item.response.result[0].id)
				})
			},
			selectTime(e) {
				this.sendDate = moment(e.year + '-' + e.month + '-' + e.day).format('YYYY-MM-DD')
			},
			handleSubmit(){
				const newDate = moment(new Date()).format('YYYY-MM-DD')
				const stopDay = moment(this.sendDate).diff(moment(newDate) , 'days')
				if(stopDay < 0){
					return this.$Toast('请选择大于等于当前时间')
				}
				const data = {
					billMasterId: this.id ,
					sendDate: this.sendDate,
					sendRemark:this.sendRemark
				}
				const url = this.type == '10' ? this.api.MaterialConfirmInfo.deliveryNotice : this.api.MaterialConfirmInfo.deliveryPrivilege
				this.$post({ url, data }).then(res=> {
					this.$Toast(res.Msg)
          setTimeout(() => { 
            uni.navigateBack()
          }, 1000)
				}).catch(e=> { console.log(e)})
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
	.notice {
		.btn {
			width: 100%;
			height: 96rpx;
			position: fixed;
			z-index: 99;
			bottom: 20rpx;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 75rpx;

			text {
				display: inline-block;
				width: 100%;
				height: 88rpx;
				background: linear-gradient(90deg, #D80100 0%, #B80201 100%);
				line-height: 88rpx;
				text-align: center;
				color: #FFFFFF;
				font-size: 32rpx;
				border-radius: 44rpx;
			}
		}

		.center {
			padding: 0 30rpx;
			background-color: #fff;
			margin-top: 20rpx;
			padding-bottom: 32rpx;

			.writeIcon {
				position: absolute;
				width: 28rpx;
				height: 25rpx;
				top: 32rpx;
				left: 24rpx;
				z-index: 99;
			}

			.notice-input {
				height: 112rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2rpx solid #EEEEEE;

				text {
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}

				input {
					color: #333333;
					font-size: 32rpx;
					text-align: right;
				}
			}
		}
	}
</style>
