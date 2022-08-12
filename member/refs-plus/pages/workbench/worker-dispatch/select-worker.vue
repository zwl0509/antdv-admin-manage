<template>
	<view class="index">
		<u-navbar title="选择工人" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
		</u-navbar>
		<view class="select">
			<view class="select-y" @click="toLeaders('leaders','leaderId')">
				<view class="title">
					带班人员
				</view>
				<view class="content">
					<input type="text" :value="leaders.length ? leaders.length+'人':''" id="" placeholder="请选择带班人员" :disabled="true">
					<image src="/static/image/workbench/worker-dispatch/right.png" mode=""></image>
				</view>
			</view>
				<view class="list-cell" v-for="(val,index) in leaders" :key="index">
					<view class="list-cell-info">
						<view class="list-cell-l">
							<image src="/static/image/mine/avatar-mis.png" mode=""></image>
							<view class="list-cell-l-title">
								<view class="name">
									<text
										style="display: inline-block;width: 300rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{val.workerName}}</text>
									<!-- 								<view class="building">
												在建 <text> 8 </text> 个
											</view> -->
								</view>
								<text
									style="font-size: 26rpx;color: #999999;margin-top: 10rpx;">{{val.workerOrgName}}</text>
							</view>
						</view>
					</view>
				</view>
			<view class="select-y" @click="toLeaders('workers','workerId')">
				<view class="title">
					施工工人
				</view>
				<view class="content">
					<input type="text" :value="workers.length ? workers.length+'人':''" id="" placeholder="请选择工人" :disabled="true">
					<image src="/static/image/workbench/worker-dispatch/right.png" mode=""></image>
				</view>
			</view>
			<view class="">
				<view class="list-cell" v-for="(val,index) in workers" :key="index">
					<view class="list-cell-info">
						<view class="list-cell-l">
							<image src="/static/image/mine/avatar-mis.png" mode=""></image>
							<view class="list-cell-l-title">
								<view class="name">
									<text
										style="display: inline-block;width: 300rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{val.workerName}}</text>
									<!-- 								<view class="building">
												在建 <text> 8 </text> 个
											</view> -->
								</view>
								<text
									style="font-size: 26rpx;color: #999999;margin-top: 10rpx;">{{val.workerOrgName}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn2" @click="dispatch">
			派工
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				workers: [],
				leaders: [],
				workerType: '',
				workerId:[],
				leaderId:[],
				customerId:'',
				detail:{},
			}
		},
		onLoad(options) {
			this.workerType = options.workerType
			this.customerId=options.customerId
			if(options.workerInfos){
				JSON.parse(options.workerInfos).forEach(item=>{
					if(item.isLeader){
						this.leaderId.push(item.workerId)
						this.leaders.push(item)
					}else{
						this.workerId.push(item.workerId)
						this.workers.push(item)
					}
				})
			}
		},
		methods: {
			toWorkers() {
				uni.navigateTo({
					url: 'workers'
				})
			},
			toLeaders(listName,idName) {
				uni.navigateTo({
					url: 'leaders?workerType=' + this.workerType + '&listName=' + listName+'&idName='+idName
				})
			},
			dispatch(){
				this.$post({
					url:this.api.CustomerWorkerDispatchInfo.dispatch,
					data:{
						customerId:this.customerId,
						type:this.workerType,
						workerIds:this.workerId,
						leaderIds:this.leaderId
					}
				}).then(res=>{
					this.$Toast('操作成功')
					setTimeout(function() {
						uni.navigateBack({
					
						})
					}, 1000)
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
	.list-cell {
		width: 100%;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #F0F0F0;
		.list-cell-info {
			width: 100%;
			display: flex;
			align-items: center;

			.list-cell-l {
				display: flex;
				align-items: center;

				image {
					width: 100rpx;
					height: 100rpx;
					margin-right: 16rpx;
				}

				.tx {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}

				text {
					color: #333333;
					font-size: 32rpx;
				}

				.list-cell-l-title {
					height: 100rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.name {
						width: 520rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
					}

					.building {
						font-size: 24rpx !important;
						color: #999999;

						text {
							color: #B80201;
							font-size: 24rpx !important;
							margin: 0 8rpx;
						}
					}
				}
			}

			.list-cell-r {
				margin-right: 20rpx;

				.slect-n {
					width: 36rpx;
					height: 36rpx;
					border-radius: 50%;
					border: 1rpx solid #C0C0C0;
				}

				.select {
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
	}

	.index {
		padding-bottom: 150rpx;
		.select {
			margin-top: 20rpx;
			background-color: #fff;
			padding: 0 30rpx;

			.select-y {
				width: 100%;
				padding: 34rpx 0;
				border-bottom: 2rpx solid #F0F0F0;

				&:last-child {
					border: none;
				}

				display: flex;
				align-items: center;
				justify-content: space-between;

				.title {
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}

				.content {
					display: flex;
					align-items: center;

					input {
						width: 460rpx;
						color: #999999;
						font-size: 32rpx;
						text-align: right;
					}

					image {
						width: 14rpx;
						height: 27rpx;
						margin-left: 14rpx;
					}
				}
			}
		}

		.btn2 {
			width: 600rpx;
			height: 88rpx;
			background: linear-gradient(to right, #D80100, #B80201);
			opacity: 1;
			border-radius: 48rpx;
			margin: auto;
			line-height: 88rpx;
			text-align: center;
			font-size: 34rpx;
			color: #FFFFFF;
			position: fixed;
			left: 0;
			right: 0;
			margin: auto;
			bottom: 48rpx;
		}
	}
</style>
