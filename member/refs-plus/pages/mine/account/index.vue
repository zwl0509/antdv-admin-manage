<template>
	<view class="entirety">
		<u-navbar title="账号管理" :border-bottom="false">
		</u-navbar>
		<view class="divider-line"></view>

		<view class="line-card">
			<view class="line fl-csb">
				<view class="left">头像</view>
				<view class="right" @click="chooseImage">
					<u-avatar class="avatar-img" bg-color="#fafafa" size="98" :src="vuex_user.avatar || defaultAvatar"
						:show-level="isVIP" />
				</view>
			</view>
			<view class="line fl-csb">
				<view class="left">昵称</view>
				<view class="right" @click="show = true">
					{{nickName || '暂无'}}
				</view>
			</view>
			<view class="line fl-csb">
				<view class="left">密码</view>
				<view class="right" @click="setpw">
					修改
				</view>
			</view>
			<view class="line fl-csb">
				<view class="left">智装账号密码</view>
				<view class="right" @click="seterp">
					设置
				</view>
			</view>
			<view class="line fl-csb" style='border: none;'>
				<view class="left">绑定手机</view>
				<view class="right" @click="handleBindPhone">
					{{vuex_user.mobileNumber || '未绑定'}}
				</view>
			</view>
		</view>
		<view class="divider-line"></view>
		<view class="line-card">
			<!-- 			<view class="line fl-csb">
				<view class="left">微信绑定</view>
				<view class="right" @click="handleBindWX">
					{{vuex_user.openId ? '已绑定' : '未绑定'}}
				</view>
			</view> -->
			<view class="line fl-csb" @click="handleWriteOff" style='border: none;'>
				<view class="left">安全设置</view>
				<view class="right">
				</view>
			</view>
		</view>
		<view class="divider-line"></view>
		<u-popup class="popups" v-model="show" mode="center" width="590rpx" height="400rpx" border-radius="16">
			<view>
				<text class="modify">修改昵称</text>
				<input class="input1" v-model="nickName" placeholder="请输入昵称" maxlength="15" />
				<image class="straight-line" src="../../../static/image/mine/account/line.png" />
				<u-button class="cancel-style" @click="cancel" shape="circle" :hair-line="false">
					<text class="canceled">取消</text>
				</u-button>
				<u-button class="affirm-style" @click="handleConfirm" shape="circle" :hair-line="false">
					<text class="sure">确认</text>
				</u-button>
			</view>
		</u-popup>

		<view v-if="showPreImg" class="pre-img-popup">
			<view class="status-bar"></view>
			<view class="header fl-csb">
				<view class="top-btn cancel" @click="() => showPreImg = false">取消</view>
				<view class="top-btn confirm" @click="handleUploadAvatar">确定</view>
			</view>
			<view class="content fl-cc">
				<view class="pre-img-box fl-cc">
					<image class="pre-img" :src="preImagePath" mode="aspectFit"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fileUpload
	} from '../../../common/service'
	import {
		wxGetUserInfo,
		wxProviderLogin
	} from '@/utils/weixin/auth'

	export default {
		data() {
			return {
				nickName: '',
				show: false,
				showPreImg: false,
				preImagePath: '',
				defaultAvatar: require('static/image/mine/avatar-mr.png'),
				info: {}
			}
		},
		computed: {
			isVIP() {
				const date = this.vuex_user.validDate || ''
				if (date) {
					const now = new Date().getTime()
					return now < new Date(date).getTime()
				}
				return false
			}
		},
		onLoad() {
			this.nickName = this.vuex_user.realName
			// this.$store.dispatch('getUserInfo', !!this.vuex_user.id)
			// 		.then(res => {
			// 			this.info = res
			// 		})
		},
		methods: {
			seterp() {
				uni.navigateTo({
					url: 'erp-account'
				})
			},
			backMine() {
				uni.navigateBack()
			},
			// 确认修改昵称
			handleConfirm() {
				this.$Loading('正在修改')
				const data = {
					...this.vuex_user
				}
				data.realName = this.nickName
				this.updateUserInfo(data)
					.then(() => {
						this.cancel()
					})
			},
			// 隐藏昵称修改弹出框
			cancel() {
				this.show = false
			},
			handleBindPhone() {
				let url = './phone/phone'
				if (!this.vuex_user.mobileNumber) {
					url = './phone/changeNumber?type=set'
				}
				uni.navigateTo({
					url
				})
			},
			// 选择头像
			// chooseImage() {
			// 	uni.chooseImage({
			// 		count: 1, //默认9
			// 		sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			// 		sourceType: ['album', 'camera'], //从相册选择、摄像头
			// 		success: res => {
			// 			let image_size = (res.tempFiles[0].size/(1024*1024)).toFixed(2)
			// 			if(image_size > 10){
			// 				this.$Toast('请选择小于10M的图片！')
			// 				return
			// 			}else{
			// 				let url = res.tempFilePaths[0]
			// 				this.avatar_file_url = url
			// 				this.is_change_image = true
			// 			}
			// 		}
			// 	});
			// },
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: res => {
						// res.tempFilePaths[0]
						// const filePath = res.tempFiles[0]
						this.showPreImg = true
						this.preImagePath = res.tempFilePaths[0]
					},
					fail: err => {}
				})
			},
			// 图片上传
			handleUploadAvatar() {
				this.$Loading('正在上传头像')
				fileUpload({
						filePathList: [this.preImagePath],
						formData: {
							attachType: '1009-40'
						},
						name: 'file',
						url: '/common/attachment/uploadSingleFile'
					})
					.then(res => {
						const path = res[0][0].requestUrl
						const data = {
							...this.vuex_user
						}
						data.avatar = path
						this.vuex_user.avatar = path
						// this.$Toast(JSON.stringify(this.info), 20000)
						uni.hideLoading()
						this.updateUserInfo(data)
					}).catch(err => {

					})
			},

			// 修改用户信息
			updateUserInfo(data) {
				console.log(data)
				this.$post({
					url: this.api.Employee.updateInfo,
					data: {
						id: data.id,
						nickName: data.realName,
						requestUrl: data.avatar
					}
				}).then(res => {
					this.$Toast('修改成功')
					this.showPreImg = false
					this.preImagePath = ''
					this.show = false
					// const user = {
					// 	...this.vuex_user,
					// 	avatar: data.avatar,
					// 	nickName: data.nickName,
					// 	openId: data.openId
					// }
					// this.nickName = user.nickName
					// this.$u.vuex('vuex_user', user)
				})
			},
			handleBindWX() {
				if (this.vuex_user.openId) return
				wxProviderLogin()
					.then(res => {
						// authResult: { openid, unionid, access_token, refresh_token, scope }
						return res
					})
					.then(res => {
						return wxGetUserInfo()
					})
					.then(res => {
						// userInfo: { openId, nickName, gender, city, province, country, avatarUrl, unionId }
						// this.$Loading('正在绑定微信')
						const data = {
							...this.vuex_user
						}
						data.openId = res.userInfo.openId
						data.nickName = res.userInfo.nickName
						data.avatar = res.userInfo.avatarUrl
						return this.updateUserInfo(data)
					})
					.catch(err => {
						this.$Toast(err.message ? err.message : '绑定微信失败')
					})
			},
			// 安全设置
			handleWriteOff() {
				uni.navigateTo({
					url: '/pages/mine/member/security-setting'
				})
			},
			// 设置密码，修改密码
			setpw() {
				uni.navigateTo({
					url: 'set_pw'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.entirety {
		background: #F3F4F6;
	}

	.divider-line {
		height: 20rpx;
		background: #f6f6f6;
	}

	.modify {
		position: absolute;
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #131E34;
		margin-top: 48rpx;
		margin-left: 224rpx;
	}

	.straight-line {
		width: 494rpx;
		height: 1rpx;
		position: absolute;
		margin-top: 115px;
		margin-left: 50rpx;
	}

	.input1 {
		width: 472rpx;
		height: 40rpx;
		position: absolute;
		margin-top: 146rpx;
		margin-left: 50rpx;
	}

	.cancel-style {
		width: 216rpx;
		height: 80rpx;
		background: #F5F5F5;
		position: absolute;
		margin-top: 280rpx;
		margin-left: 48rpx;
		border: 0;
	}

	.affirm-style {
		width: 216rpx;
		height: 80rpx;
		// background: #2E6CF7;
		background: linear-gradient(to right, #D80100, #B80201);
		border: 0;
		position: absolute;
		margin-top: 280rpx;
		margin-left: 326rpx;
	}

	.canceled {
		ont-size: 17px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 24px;
		color: #333333;
	}

	.sure {
		font-size: 17px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 24px;
		color: #FFFFFF;
	}

	.line-card {
		background-color: white;
		padding: 0 30rpx;
		box-sizing: border-box;

		.line {
			min-height: 112rpx;
			padding: 14rpx 26rpx 14rpx 0;
			box-sizing: border-box;
			font-size: 32rpx;
			background: url("/static/image/mine/right.png") no-repeat 100% center;
			background-size: auto 27rpx;
			border-bottom: 1rpx solid #F0F0F0;

			.left {
				color: #333333;
			}

			.right {
				color: #999;
			}
		}
	}

	.avatar-img {
		max-height: 98rpx;
		max-width: 98rpx;
		display: block;
	}

	.pre-img-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, .7);

		.header {
			height: 88rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			border-bottom: 1px solid rgba(255, 255, 255, .05);
			position: relative;
			top: var(--status-bar-height);

			.top-btn {
				height: 64rpx;
				padding: 0 24rpx;
				line-height: 64rpx;
				box-sizing: border-box;
				color: white;
			}

			.confirm {
				background-color: $primaryColor;
				border-radius: 4rpx;
			}
		}

		.content {
			height: calc(100% - 88rpx);

			.pre-img-box {
				max-width: 100%;
				max-height: 100%;

				.pre-img {
					max-width: 100%;
					max-height: 100%;
				}
			}
		}
	}
</style>
