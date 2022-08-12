<template>
	<view class="saleman">
		<u-navbar :border='false' class="navbar fl-cc">
			<u-search v-model="employeeName" placeholder="请输入姓名" @change="getEasyList()" :show-action="false">
			</u-search>
		</u-navbar>
		<view class="lists" v-for="(val,index) in list" :key="index">
			<view class="lists-info">
				<image src="/static/image/mine/avatar-mis.png" mode=""></image>
				<view class="">
					<text>{{val.name}}</text>
					<text>{{val.organizationName}}</text>
				</view>
			</view>
			<view class="lists-btn" @click="back(val)" v-if="val.id!=employeeId">
				添加
			</view>
			<view class="lists-btn2" v-else>
				添加
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				employeeId:'',
				employeeName:''
			}
		},
		onLoad(options) {
			if(options.employeeId){
				this.employeeId=options.employeeId
			}
			this.getEasyList()
		},
		methods: {
			//获取分总
			getEasyList() {
				this.$post({
					url: this.api.Employee.getEasyList,
					data: {
						employeeName:this.employeeName,
						currentPage: 0,
						pageSize: 0,
						// ids: employeePositionIds 
						positionIds: uni.getStorageSync('positionIds')
					}
				}).then(res => {
					this.list = res.rows
				})
			},
			back(val) {
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				uni.navigateBack({})
				prevPage.$vm.employeeId = val.id;
				prevPage.$vm.employeeName = val.name;
			}
		}
	}
</script>

<style scoped lang="less">
	.saleman {
		padding: 0 30rpx;

		.lists {
			height: 140rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #E8E8E8;

			.lists-info {
				display: flex;
				align-items: center;

				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 16rpx;
				}

				view {
					height: 100rpx;
					padding: 6rpx 0;
					display: flex;
					justify-content: space-between;
					flex-direction: column;

					text {
						font-size: 26rpx;
						color: #999999;

						&:first-child {
							color: #333333;
							font-size: 30rpx;
							font-weight: bold;
						}
					}
				}
			}

			.lists-btn {
				width: 96rpx;
				height: 56rpx;
				background: #B80201;
				line-height: 56rpx;
				text-align: center;
				font-size: 28rpx;
				color: #FFFFFF;
				border-radius: 8rpx;
			}
			.lists-btn2{
				background-color: #F0F0F0;
				width: 96rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				font-size: 28rpx;
				color: #999999;
				border-radius: 8rpx;
			}
		}
	}
</style>
