<template>
	<view>
		<u-navbar title="在线反馈" :borderBottom="false">
			<view slot="right" class="nav-right" @click="handleProblem">
				<text @click="commonProblem">常见问题</text>
			</view>
		</u-navbar>
		<view class="content">
			<view class="feedbackTitle">问题反馈</view>
			<view class="feedbackContent">
				<textarea v-model="feedbackContent" :placeholder="feedbackPlaceholder" :maxlength="500" placeholder-style="color: #B2B2B2;"></textarea>
				<view style="height: 50rpx;">
					<view class="contentNum">
						<text :style="{'color': feedbackContent.length?'#B2B2B2':'#F43D1B'}">{{ feedbackContent.length }}</text>/500
					</view>
				</view>
				<u-upload ref="uUpload" width="196rpx" height="196rpx" :action="action" :formData="{attachType: '1009-50'}" :header="header" name="files"
									:auto-upload="false" max-count="3" :custom-btn="true" @on-uploaded="onUpload" @on-list-change="listChange">
					<view slot="addBtn">
						<image src="/static/image/mine/account/add.png" style="width: 196rpx; height: 196rpx;"></image>
					</view>
				</u-upload>
			</view>
			<view class="btn">
				<button :disabled="!(!!feedbackContent || !!image) " class="submit-btn" @click="handleClick">提交</button>
			</view>
		</view>
		<view class="divider-line"></view>
<!-- 		<view class="custom-service">
			<view class="title">联系客服</view>
			<view class="wx-title fl-cu">
				<view class="">
					<text>官方客服微信：bwyjb6668</text>
					<text class="copy">复制</text>
				</view>
				<text style="margin-left: 16rpx">{{wxNo}}</text>
				<view class="copy-btn" v-if="wxNo" @click="copyWxNo">复制</view>
			</view>
			<view class="description">紧急问题或需详情沟通，请直接添加官方客服微信。</view>
		</view> -->
	</view>
</template>

<script>
	import variable from '../../../common/service/variable.js'
	export default {
		data() {
			return {
				feedbackPlaceholder: '1、为了节约您的时间，可以点击右上角【常见问题】查看是否正好解答了您的问题。\n\n2、在此输入需要反馈给我们的内容，稍后可在【消息】-【个人消息】查看官方回复。',
				feedbackContent: '',
				// 上传图片服务器地址
				action: '',
				btnMsg: '提交',
				header: {
					'X-Auth-Token': ''
				},
				canClick: true,
				image: 0,
				wxNo: ''
			};
		},
		onLoad () {
			this.action = variable.apiServer + this.api.common.upload// variable.apiServer + this.$api.common.upload
			this.header['X-Auth-Token'] = this.vuex_token
		},
		methods: {
			handleProblem () {
				// 跳转至常见问题页面
			},
			// 提交在线反馈
			handleClick () {
				// 上传图片到服务器
				let files = this.$refs.uUpload.lists
				if(!this.feedbackContent && !files.length){
					this.$Toast('请填写反馈内容或者上传反馈图片！')
					return
				}
				if(this.canClick){
					this.canClick = false
					if(files.length){
						this.$refs.uUpload.upload();
					}else{
						this.saveData()
					}
				}else{
					this.$Toast('请勿重复点击！')
				}
			},
			saveData(attaches = []) {
				this.$post({
					url: this.api.Employee.employeeFeedback,
					data: {
						attachIds: attaches,
						feedbackContent: this.feedbackContent,
						employeeId:this.vuex_user.id
					}
				}).then(res=>{
					this.$Toast('提交成功！')
					setTimeout(()=>{
						this.canClick = true
						uni.navigateBack()
					},2000)
				}).catch(e=>{
					this.canClick = true
					this.$Toast(e)
				})
			},
			// 跳转至常见问题页面
			commonProblem () {
				uni.navigateTo({
					url: "/pages/mine/q-a/index"
				});
			},
			onUpload(lists, name) {
				let files = []
				let attaches = []
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				files.forEach(item=>{
					attaches.push(item.response.result[0].id)
				})
				this.saveData(attaches)
			},
			listChange(list,name){
				this.image = list.length
				
			},
			copyWxNo () {
				uni.setClipboardData({
					data: this.wxNo,
					success() {
						this.$Toast('复制成功！')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.copy{
		display: inline-block;
		width: 80rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		border-radius: 40rpx;
		background-color: #F5F5F5;
		margin-left: 24rpx;
		font-size: 24rpx;
		color: #B80201;
	}
	.nav-right {
		padding: 15rpx 30rpx 15rpx 15rpx;
		text {
			font-size: 28rpx;
			font-weight: 400;
			color: #B80201;
		}
	}
	.content {
		padding: 40rpx 30rpx 48rpx;
		box-sizing: border-box;
		.feedbackTitle {
			font-size: 28rpx;
			font-weight: bold;
			line-height: 40rpx;
			color: #333333;
		}
		.feedbackContent {
			background: #F8F8F8;
			border-radius: 16rpx;
			padding: 24rpx 20rpx;
			margin-top: 24rpx;
			textarea {
				width: 100%;
				height: 372rpx;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 40rpx;
			}
			.contentNum {
				font-size: 20rpx;
				font-weight: 400;
				line-height: 28rpx;
				color: #B2B2B2;
				float: right;
				margin-top: 10rpx;
			}
			.uUpload {
				margin-top: 40rpx;
				// image {
				// 	width: 196rpx;
				// 	height: 196rpx;
				// }
			}
		}
	}
	.btn {
		margin-top: 80rpx;
		text-align: center;
	}
	.submit-btn{
		color: white;
		font-size: 36rpx;
		width: 550rpx;
		margin: 0 auto;
		height: 96rpx;
		border-radius: 48rpx;
		background: linear-gradient(to right, #D80100, #B80201);
		&:after{
			border: none
		}
		&[disabled]{
			color: white;
			background: rgba(255, 182, 181, 0.39);
		}
	}
	.custom-service{
		padding: 32rpx 30rpx 30rpx;
		box-sizing: border-box;
		border-top: 20rpx solid #F8F8FB;
		.title {
			font-size: 28rpx;
			font-weight: bold;
			line-height: 40rpx;
			color: #333;
		}
		.wx-title{
			margin-top: 32rpx;
			line-height: 54rpx;
			color: #333;
			font-size: 28rpx;
			.copy-btn{
				margin-left: 20rpx;
				line-height: 48rpx;
				color: $primaryColor;
				background-color: #f5f5f5;
				padding: 0 20rpx;
				box-sizing: border-box;
				border-radius: 40rpx;
				font-size: 24rpx;
				letter-spacing: 4rpx;
			}
		}
		.description{
			margin-top: 14rpx;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #999
		}
	}
</style>
