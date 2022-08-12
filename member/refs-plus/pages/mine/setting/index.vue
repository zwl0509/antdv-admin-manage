<template>
	<view class="settings">
		<u-navbar title="设置" titleColor="#333" titleBold titleSize="34" :border-bottom="false"></u-navbar>
		<view style="padding: 0rpx 30rpx;border-top: 20rpx solid #F6F6F6;">
			<view class="line fl-csb" @click="handleCleanStorage">
			  <view class="label">清除缓存</view>
			</view>
			<view class="line fl-csb" @click="checkVersion">
			  <view class="label">系统版本</view>
			  <view class="text">
					<text>{{version}}</text>
			  </view>
			</view>
			<view class="line fl-csb" @click="handleToPage()">
			  <view class="label">用户服务协议</view>
			  <view class="text right-icon">
			  </view>
			</view>
			<view class="line fl-csb" @click="handleToPage(1)">
			  <view class="label">用户隐私政策</view>
			  <view class="text right-icon">
			  </view>
			</view>
		</view>
		<view class="sign-out" @click="handleExit">安全退出</view>
<!-- 		<u-modal
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
				version:uni.getStorageSync('wgtVersion') ? uni.getStorageSync('wgtVersion') : '1.0.1',
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
		onShow() {
		},
		methods: {
			handleCleanStorage () {
				this.title = '清除缓存'
				this.content = '清除缓存后本地数据不会保留，需要重新登录，确认清除吗？'
				this.show  = true
			},
			handleExit () {
				this.title = '退出'
				this.content = '确认退出登录吗？'
				this.show  = true
				this.$u.vuex('vuex_user', {})
				// this.$store.dispatch('logout')
			},
			confirmExit () {
				this.$store.dispatch('logout').then(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				})
			},
			handleToPage (isService) {
				uni.navigateTo({
					url: isService ? '/pages/mine/about-us/privacy': '/pages/mine/about-us/service-agreement'
				})
			},
			checkVersion () {
				this.$Toast('当前已是最新版本')
			}
		}
	}
</script>

<style lang="scss">
	.settings{
		// background-color: #F6F6F6;
	}
	.line{
		height: 112rpx;
		// padding: 0 30rpx;
		box-sizing: border-box;
		color: #999999;
		font-size: 32rpx;
		background: white;
		position: relative;
		border-bottom: 1rpx solid #F0F0F0;
		.label{
			color: #333333;
		}
		.right-icon{
			width: 14rpx;
			height: 27rpx;
			background: url("/static/image/mine/right.png") no-repeat right center;
			background-size: 14rpx auto;
		}
	}
	.sign-out{
		box-sizing: border-box;
		width: 100%;
		// height: 112rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 112rpx;
		color: #F93F3D;
		border-top: 20rpx solid #F6F6F6;
		border-bottom: 20rpx solid #F6F6F6;
	}
</style>
