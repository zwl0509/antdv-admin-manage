<template>
	<view class="index">
		<u-navbar :is-back="true" :border-bottom='false' back-icon-color='#333333'>
			<view class="slot-wrap">
				<u-search mImage='/static/image/workbench/customer-manage/search.png' :uIconShow="false" bg-color="#F5F5F5"
					placeholder-color="#C0C0C0" v-model="name" placeholder="请输入待派工人姓名" @change="search"
					:show-action="false">
				</u-search>
				<!-- <input type="text" v-model="name" placeholder="请输入待派工人姓名/部门" @input='search' /> -->
				<!-- <image src="/static/image/workbench/product-dispatch/search.png" mode=""></image> -->
				<text @click="back">确定</text>
			</view>
		</u-navbar>
		<view class="" style="padding: 0 30rpx;">
			<view class="list-cell" v-for="(val,index) in indexList" :key="index" @click="selectOne(val)">
				<view class="list-cell-info">
					<view class="list-cell-r">
						<view class="slect-n" v-if="!val.selected">

						</view>
						<image src="/static/image/workbench/product-dispatch/select.png" mode="" v-else class="select">
						</image>
					</view>
					<view class="list-cell-l">
						<image src="/static/image/mine/avatar-mis.png" mode=""></image>
						<view class="list-cell-l-title">
							<view class="name">
								<text style="display: inline-block;width: 300rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{val.workerName}}</text>
<!-- 								<view class="building">
									在建 <text> 8 </text> 个
								</view> -->
							</view>
							<text style="font-size: 26rpx;color: #999999;margin-top: 10rpx;">{{val.workerOrgName}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indexList: [],
				style: {
					borderBottom: '1rpx solid #F0F0F0',
					padding: '32rpx 0 8rpx 0',
					color: '#999999',
					fontSize: '28rpx',
					background: 'none'
				},
				customerIds: [],
				names: [],
				name: '',
				type: '',
				currentPage: 1,
				pageSize: 10,
				selected: false,
				workerType:'',
				listName:'',
				list:[],
				idName:''
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(options) {
			this.workerType=options.workerType
			this.listName=options.listName
			this.idName=options.idName
			this.getList()
			// this.getYwy()
		},
		methods: {
			search() {
				this.indexList = []
				this.currentPage = 1
				console.log('11')
				this.getList()
			},
			//上拉加载
			onReachBottom() {
				this.currentPage++
				this.getList()
			},
			getList(){
				this.$post({
					url:this.api.WorkerInfo.getList,
					data:{
						currentPage:this.currentPage,
						workerType:this.workerType,
						workerName:this.name,
						workerPrincipalId:this.vuex_user.id
					}
				}).then(res=>{
					let pages = getCurrentPages(); //获取所有页面栈实例列表
					let nowPage = pages[pages.length - 1]; //当前页页面实例
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					res.rows.forEach(item => {
						item.selected = false
						// console.log(prevPage.$vm[this.idName])
						prevPage.$vm[this.idName].forEach(item2=>{
							if(item.id==item2){
								item.selected = true
								this.list.push(item)
								this.customerIds.push(item.id)
							}
						})
						this.indexList.push(item)
					})
				})
			},
			selectOne(item) {
				if (item.selected) {
					item.selected = false
					let selectIndex = ''
					this.customerIds.forEach((val, index) => {
						if (val == item.id) {
							selectIndex = index
						}
					})
					this.customerIds.splice(selectIndex, 1)
					this.list.splice(selectIndex, 1)
				} else {
					// this.indexList.forEach(val => {
					// 	val.selected = false
					// })
					item.selected = true
					this.customerIds.push(item.id)
					this.list.push(item)
				}
			},
			back() {
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				uni.navigateBack({})
				prevPage.$vm[this.idName] = this.customerIds;
				prevPage.$vm[this.listName] = this.list;
			}
		}
	}
</script>

<style scoped lang="less">
	.title {
		width: 100%;
		height: 92rpx;
		line-height: 92rpx;
		border-bottom: 1rpx solid #F0F0F0;
		color: #333333;
		font-size: 32rpx;
		font-weight: bold;
	}

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
					.name{
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

	.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 0 30rpx;
		position: relative;
		width: 558rpx;
		// margin-left: 30rpx;

		image {
			width: 28rpx;
			height: 28rpx;
			position: absolute;
			top: 0;
			bottom: 0;
			margin: auto;
			left: 48rpx;
		}

		input {
			background-color: #F5F5F5;
			border: none;
			width: 100%;
			height: 60rpx;
			padding-left: 72rpx;
			border-radius: 56rpx;
		}

		text {
			color: #B80201;
			font-size: 28rpx;
			flex-shrink: 0;
			margin-left: 24rpx;
		}
	}
</style>
