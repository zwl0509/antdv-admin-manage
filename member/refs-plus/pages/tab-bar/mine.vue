<template>
	<view>
		<view class="header-bg"></view>
		<view class="header-line">
			<view class="setter" @click="handleSetting"></view>

		</view>
		<view class="user-board">
			<view class="main-board fl-cs">
				<view class="user-avatar fl-cc" @click="handleUserClick">
					<u-avatar
						:src="vuex_user.avatar || (vuex_user.gender == '1001-20'? defaultWomenAvatar : defaultAvatar)"
						:size="128"></u-avatar>
				</view>
				<view class="right">
					<!-- 未登录 -->
					<template v-if="!vuex_login">
						<text class="no-login" @click="handleUserClick">未登录</text>
					</template>
					<!-- 登录后用户信息 -->
					<template v-else>
						<view class="user-name u-flex">
							<text class="u-line-1 name" @click="handleUserClick">{{ vuex_user.realName }}</text>
							<!--<image mode="widthFix" class="id-code" src="" @click.stop.prevent="showMask" style="width: 38rpx; height: 38rpx;"></image>-->
						</view>
						<view class="user-id">
							<text @click="handleUserClick">ID:&ensp;{{ vuex_user.employeeCode }}</text>
						</view>
					</template>
				</view>
			</view>
		</view>
		<view class="bot-line-list">
			<view class="line-item fl-cu" v-for="(item,index) in line_list" :key="index" @tap="toPage(item.url)">
				<image class="line-icon" :src="item.img"></image>
				<view class="line-text">{{item.name}}</view>
			</view>
		</view>
		<!--<id-mask ref="idMask"></id-mask>-->
	</view>
</template>

<script>
	import api from '@/api'
	export default {
		components: {},
		data() {
			return {
				// 默认头像男女
				defaultAvatar: '../../static/image/mine/avatar-mr.png', //'/static/image/mine/default-user-avatar.png',
				defaultWomenAvatar: '../../static/image/mine/avatar-mis.png', //'/static/image/mine/default-women-avatar.png',
				// 菜单列表
				line_list: [{
						name: '账号管理',
						img: '/static/image/mine/account.png',
						url: '/pages/mine/account/index'
					},
					{
						name: '常见问题',
						img: '/static/image/mine/qa.png',
						url: '/pages/mine/q-a/index'
					},
					{
						name: '在线反馈',
						img: '/static/image/mine/feedback.png',
						url: '/pages/mine/feedback/index'
					},
					{
						name: '关于我们',
						img: '/static/image/mine/about-us.png',
						url: '/pages/mine/about-us/index'
					}
				],
				centerList: [],
				can_trial: false,
				user:{}
			}
		},
		onLoad() {},
		onShow() {
			if (this.vuex_login) {
				this.getInfo()
			}
		},
		methods: {
			getInfo() {
				this.$get({
					url: this.api.AuthUser.getCurrentUser
				}).then(res => {
					this.$u.vuex('vuex_user', res)
					// let targetIds = []
					// targetIds.push(res.id)
					// targetIds.push(res.orgId)
					// res.roles.forEach(item => {
					// 	targetIds.push(item.id)
					// })
					// this.getAuthSiteMapByTargetId(targetIds)
				})
			},
			// getAuthSiteMapByTargetId(targetIds) {
			// 	this.$post({
			// 		url: this.api.common.getAuthSiteMapByTargetId,
			// 		data: {
			// 			targetIds: targetIds,
			// 			backstage: 0

			// 		}
			// 	}).then(res => {
			// 		console.log(res)
			// 	})
			// },
			handleSetting() {
				this.toPage('/pages/mine/setting/index')
			},
			toPage(url) {
				if (!this.vuex_login) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				if (url) uni.navigateTo({
					url
				})
			},
			// 判断是否登录，登录则进去个人信息页面
			handleUserClick() {
				if (!this.vuex_login) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else {
					uni.navigateTo({
						url: 'my-profile/my-profile'
					})
				}
			},
		},
		watch: {
			vuex_login: {
				handler: function(val, val2) {
					console.log(val, val2)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.header-bg {
		position: absolute;
		height: 400rpx;
		top: 0;
		left: 0;
		width: 100%;
		background: url("/static/image/tab-bar/new-bg.png") no-repeat center center;
		background-size: 100% 100%;
	}

	.header-line {
		position: relative;
		padding-top: 108rpx;
		padding-right: 30rpx;
		padding-bottom: 20rpx;
		box-sizing: border-box;
		z-index: 2;

		.setter {
			float: right;
			width: 48rpx;
			height: 48rpx;
			background: url("/static/image/mine/setting.png") no-repeat center;
			background-size: 100% 100%;
		}

		&:after {
			content: '';
			display: block;
			clear: both;
			width: 0;
			height: 0;
			margin: 0;
			padding: 0;
		}
	}

	.user-board {
		height: 224rpx;
		padding: 40rpx 36rpx;
		box-sizing: border-box;
		position: relative;
		color: white;

		.user-avatar {
			width: 128rpx;
			height: 128rpx;
			border-radius: 50%;
			color: #333;
			font-weight: bold;
			font-size: 32rpx;
			letter-spacing: 4rpx;

			&.no-login {
				background-color: #ffffff;
			}

			.user-icon {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.right {
			width: calc(100% - 152rpx);
			margin-left: 24rpx;
			// height: 128rpx;
			// display: flex;
			flex: 1;
			// padding-top: 20rpx;
			// align-items: center;
			// flex-direction: column;
			text-align: left;

			.no-login {
				font-size: 36rpx;
				font-weight: 400;
				color: #FFFFFF;
			}

			.user-name {
				height: 70rpx;
				font-size: 36rpx;
				font-family: Helvetica;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 70rpx;

				.name {
					max-width: 300rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}

			.user-id {
				height: 70rpx;
				line-height: 70rpx;
				margin-top: 10rpx;
				font-size: 24rpx;
				// line-height: 34rpx;
			}

			.info-list {
				padding-right: 60rpx;
				box-sizing: border-box;
			}

			.item {
				font-size: 30rpx;
				font-weight: 500rpx;
				line-height: 50rpx;
				text-align: center;
			}
		}
	}

	.bot-line-list {
		border-top: 20rpx solid #f8f8fb;
		padding-top: 40rpx;
		box-sizing: border-box;

		.line-item {
			padding: 0 30rpx 0 44rpx;
			box-sizing: border-box;
			width: 100%;
			height: 96rpx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				right: 30rpx;
				pointer-events: none;
				top: 40rpx;
				height: 16rpx;
				width: 8rpx;
				background: url("/static/image/common/right.png") no-repeat center center;
				background-size: 8rpx 16rpx;
			}

			.line-icon {
				width: 48rpx;
				height: 48rpx;
			}

			.line-text {
				margin-left: 32rpx;
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				line-height: 38rpx;
			}
		}
	}
</style>
