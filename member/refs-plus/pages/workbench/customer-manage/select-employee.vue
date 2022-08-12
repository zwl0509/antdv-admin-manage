<template>
	<view class="select-employee">
		<u-navbar :border='false' class="navbar fl-cc">
			<u-search v-model="employeeName" placeholder="请输入业务员" @change="getEasyList()" :show-action="false">
			</u-search>
		</u-navbar>
		<view class="lists" v-for="(item, index) in list" :key="index">
			<view class="lists-info">
				<image src="/static/image/mine/avatar-mis.png" mode=""></image>
				<view class="">
					<text>{{ item.name }}</text>
					<text>{{ item.organizationName }}</text>
				</view>
			</view>
			<view class="lists-btn" @click="allocation(item.id)">分配</view>
		</view>
    <u-modal 
      v-model="show"
      :show-cancel-button="true"
      content="是否确认分配该员工？"
      confirm-color="#B80201" 
      cancel-text="取消"
      @cancel="handleCancel" 
      @confirm="handleSubmit"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
        show: false,
				customerIds: [],
				employeeName: '',
        assignor: ''
			}
		},
		onLoad(params) {
			if(params.allocationIds){
				this.customerIds = JSON.parse(params.allocationIds) || []
			}
			console.log(this.customerIds)
			this.getEasyList()
		},
		methods: {
			//获取分总
			getEasyList() {
				this.$post({
					url: this.api.Employee.getEasyList,
					data: {
						employeeName: this.employeeName,
						currentPage: 1,
						pageSize: 10,
					}
				}).then(res => {
					this.list = res.rows
				})
			},
      // 分配
      allocation(id) {
        this.show = true
        this.assignor = id
      },
			back(val) {
				// let pages = getCurrentPages(); //获取所有页面栈实例列表
				// let nowPage = pages[pages.length - 1]; //当前页页面实例
				// let prevPage = pages[pages.length - 2]; //上一页页面实例
				// uni.navigateBack({})
				// // prevPage.$vm.employeeId = val.id;
				// // prevPage.$vm.employeeName = val.name;
			},
      // 保存
      handleSubmit() {
        const data = {
          customerIds: this.customerIds,
          assignor: this.assignor,
          bindType: '1055-30',
          type: '1033-40',
          status:'1054-20'
        }
        this.$post({
          url: this.api.CustomInfo.chooseCustomer,
          data,
        }).then((res)=> {
					this.$Toast('分配成功')
          this.handleCancel()
          uni.navigateBack({})
        }).catch(e=>{
          console.log(e)
        })
      },
      handleCancel() {
        this.show = false
        this.assignor = ''
        this.customerIds = []
      }
		}
	}
</script>

<style scoped lang="less">
	.select-employee {
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
