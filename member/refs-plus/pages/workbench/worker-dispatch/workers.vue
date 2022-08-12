<template>
	<view class="workers">
		<u-navbar title="工人管理" :title-size='34' title-color='#333333' :titleBold="true" :border-bottom='false'
			class="navbar">
		</u-navbar>
		<view class="center">
			<view class="worker" v-for="(val,index) in typeList" :key="index">
				<view class="info">
					<view class="name">
						{{val.name}}
					</view>
					<view class="number">
						已派人数：<text>{{val.number}}</text>人
					</view>
				</view>
				<view class="btn1" v-if="!val.number" @click="toSelect(val)">
					派工
				</view>
				<view class="btn2" v-else @click="toSelect(val)">
					加派
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isDispatch:true,
				typeList:[],
				customerId:'',
				detail:[]
			}
		},
		onLoad(options) {
			this.customerId=options.customerId
		},
		onShow() {
			this.getAppCustomerDispatchInfo()
		},
		methods:{
			getAppCustomerDispatchInfo(){
				this.$get({
					url: this.api.CustomerWorkerDispatchInfo.getAppCustomerDispatchInfo,
					data: {
						customerId: this.customerId
					}
				}).then(res => {
					this.detail=res
					this.getTypeList('1011')
				})
			},
			getTypeList(type) {
				this.$get({
					url: this.api.System.getList,
					data: {
						type: type
					}
				}).then(res => {
					res.rows.forEach(item=>{
						item.number=0
						item.workerInfos=[]
						this.detail.forEach(item2=>{
							if(item2.type==item.value){
								item.number=item2.workerNum
								item.workerInfos=item2.workerInfos
							}
						})
					})
					this.typeList=res.rows
				})
			},
			toSelect(val){
				uni.navigateTo({
					url:'select-worker?workerType='+val.value+'&customerId='+this.customerId+'&workerInfos='+JSON.stringify(val.workerInfos)
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
	.workers {
		.center {
			margin-top: 20rpx;
			background-color: #fff;
			padding: 0 30rpx;

			.worker {
				width: 100%;
				height: 152rpx;
				border-bottom: 2rpx solid #F0F0F0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.info {
					height: 152rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.name {
						margin-bottom: 10rpx;
						font-size: 30rpx;
						font-weight: bold;
						color: #333333;
					}

					.number {
						font-size: 26rpx;
						color: #999999;

						text {
							font-size: 30rpx;
							color: #666666;
							font-weight: bold;
						}
					}
				}

				.btn1 {
					width: 96rpx;
					height: 56rpx;
					border-radius: 12rpx;
					background-color: #B80201;
					line-height: 56rpx;
					text-align: center;
					font-size: 26rpx;
					color: #FFFFFF;
				}
				.btn2{
					width: 96rpx;
					height: 56rpx;
					border-radius: 12rpx;
					border: 2rpx solid #B80201;
					line-height: 56rpx;
					text-align: center;
					font-size: 26rpx;
					color: #B80201;
				}
			}
		}
	}
</style>
