<template>
	<view class="message">
		<u-navbar title="系统消息" :border='false' :titleBold='true' class="navbar" title-color='#333333'>
		</u-navbar>
		<view class="message-y" v-for="(val,index) in list" :key="index">
			<view class="message-time">
				{{val.timeKey}}
			</view>
			<view class="message-content" v-for="(item,index2) in val.list" :key="index2" v-if="val.list.length">
				<view class="title">
					<image src="/static/image/workbench/message/system.png" mode=""></image>
					<text>{{item.typeName}}</text>
				</view>
				<view class="content">
					{{item.message}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentPage: 1,
				pageSize: 12,
				type: '',
				list: []
			}
		},
		onLoad(options) {
			this.type = options.type
			this.getTypeList()
		},
		methods: {
			//上拉加载
			onReachBottom() {
				this.currentPage++
				this.getTypeList()
			},

			getTypeList() {
				this.$post({
					url: this.api.SysMessage.getTypeList,
					data: {
						type: this.type,
						currentPage: this.currentPage,
						pageSize: this.pageSize
					}
				}).then(res => {
					res.forEach(item => {
						this.list.push(item)
					})
					// this.list = res
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
	.message-y {
		width: 100%;
		padding: 0 30rpx;
		padding-bottom: 20rpx;
		.message-time {
			width: 100%;
			height: 67rpx;
			line-height: 67rpx;
			text-align: center;
			color: #999999;
			font-size: 20rpx;
			font-weight: 500;
		}

		.message-content {
			width: 100%;
			height: auto;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			box-shadow: 0px 9px 14px 0px rgba(0, 0, 0, 0.02);
			padding: 0 24rpx 30rpx 24rpx;
			margin-bottom: 20rpx;

			.title {
				height: 110rpx;
				display: flex;
				align-items: center;

				image {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					margin-right: 14rpx;
				}

				text {
					color: #333333;
					font-size: 30rpx;
					font-weight: bold;
				}
			}

			.content {
				font-size: 28rpx;
				color: #666666;
				font-weight: 500;
				line-height: 42rpx;
			}
		}
	}
</style>
