<template>
	<view class="settings">
		<u-navbar title="设置" titleColor="#333" titleBold titleSize="34"></u-navbar>
		<view style="background-color: #F6F6F6; padding: 20rpx 0;">
			<view class="line fl-csb" @click="handleLogout">
				<view class="label">注销账号</view>
				<view class="text">
					<text></text>
				</view>
			</view>
		</view>
		<!--    <u-modal
        v-model="show"
        mode="bottom"
        :title="title"
        :content="content"
        border-radius="16"
        confirm-color="#B80201"
        show-cancel-button
        cancel-text="取消"
        :safe-area-inset-bottom="true"
        @confirm="confirmExit"
    ></u-modal> -->
		<u-modal v-model="show" :confirm-style='confirmStyle' :cancel-style='camcelStyle' :content="content"
			:show-cancel-button='true' :title='title' @confirm='confirmExit' :title-style='titleStyle'
			:content-style="contentStyle">
		</u-modal>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				title: '',
				content: '',
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
			}
		},
		onShow() {},
		methods: {
			handleLogout() {
				this.title = '注销账号'
				this.content = '注销账号后此号将无法登录'
				this.show = true
			},
			confirmExit() {
				this.$store.dispatch('logout').then(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				})
			},
			handleToPage(isService) {
				uni.navigateTo({
					url: isService ? '/pages/mine/about-us/privacy' : '/pages/mine/about-us/service-agreement'
				})
			},
			checkVersion() {
				this.$Toast('当前已是最新版本')
			}
		}
	}
</script>

<style lang="scss">
	.settings {
		background-color: #F6F6F6;
	}

	.line {
		height: 112rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		color: #999999;
		font-size: 32rpx;
		background: white;
		position: relative;

		&:after {
			content: '';
			display: block;
			position: absolute;
			height: 1px;
			width: 100%;
			bottom: 0;
			background: #F0F0F0;
		}

		&:nth-last-child(2):after {
			display: none;
		}

		.label {
			color: #333333;
		}

		.right-icon {
			width: 14rpx;
			height: 27rpx;
			background: url("/static/image/mine/right.png") no-repeat right center;
			background-size: 14rpx auto;
		}
	}

	.sign-out {
		width: 100%;
		height: 112rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 112rpx;
		color: #F93F3D;
		background-color: #FFFFFF;
		margin-top: 20rpx;
	}
</style>
