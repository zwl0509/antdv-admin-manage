<template>
	<view class="commonProblem">
		<u-navbar title="常见问题"></u-navbar>
		<view class="problemList">
			<view class="problemList-y" v-for="(item, index) in dataList" :key="index" @click="handleClick(index)">
				<view class="problemItem">
					<view class="item">
						<view class="title">{{ index + 1 }}.{{ item.title }}</view>
						<image class="arrow" src=""></image>
					</view>
					<view class="time">{{ item.modifiedTime }}</view>
				</view>
				<image src="../../../static/image/mine/right2.png" mode=""></image>
			</view>
			<view v-if="!dataList.length">
				<no-data iconPath=""></no-data>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: []
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList() {
				this.$post({
					url: this.api.SysAppQuestionAnswerLibrary.getList
				}).then(res => {
					console.log(res)
					this.dataList = res.rows
				}).catch(e => {
					console.log(e);
				})
			},
			handleClick(index) {
				console.log(index)
				const item = this.dataList[index]
				uni.navigateTo({
					url: './problem-detail',
					success: (res) => {
						res.eventChannel.emit('getData', item)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.commonProblem {
		background-color: #F8F8FB;
	}
	.problemList-y{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 30rpx;
		image{
			width: 8rpx;
			height: 16rpx;
		}
	}
	.problemList {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;

		.problemItem {
			height: 144rpx;
			padding: 30rpx 30rpx 28rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			font-weight: 400;

			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.title {
					max-width: 584rpx;
					font-size: 28rpx;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.arrow {
					width: 8rpx;
					height: 16rpx;
				}
			}

			.time {
				font-size: 24rpx;
				color: #999999;
			}
		}
	}
</style>
