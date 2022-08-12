<template>
	<view>
		<u-navbar title="问题详情"></u-navbar>
		<view class="divider-line"></view>
		<view class="body">
			<view class="question">问: {{info.title || ''}}</view>
			<view class="answer"><text>{{info.content || '暂无'}}</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info : {}
			}
		},
		onLoad () {
			this.getOpenerEventChannel().on('getData', (data) => {
				this.info = data
			})
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	page{
		background: white;
	}
	.body{
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		color: #333
	}
	.question{
		font-size: 32rpx;
		line-height: 44rpx;
		font-weight: bold;
	}
	.answer{
		margin-top: 24rpx;
		font-size: 28rpx;
		line-height: 40rpx;
	}
</style>
