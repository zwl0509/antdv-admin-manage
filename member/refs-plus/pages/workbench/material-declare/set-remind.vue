<template>
	<view class="index">
		<u-navbar :is-back="true" :border-bottom='false' back-icon-color='#333333'>
			<view class="slot-wrap">
				<input type="text" v-model="name" placeholder="搜索" @input='search' />
				<image src="/static/image/workbench/product-dispatch/search.png" mode=""></image>
				<text @click="back">{{isAssign ? '指派':'添加'}}</text>
			</view>
		</u-navbar>
		<view class="" style="padding: 0 30rpx;">
			<view class="list-cell" v-for="(val,index) in indexList" :key="index" @click="selectOne(val,index)">
				<view class="list-cell-l">
					<image src="/static/image/mine/avatar-mis.png" mode=""></image>
					<view class="" style="height: 100rpx;display: flex;flex-direction: column;justify-content: center;">
						<text>{{val.employeeName}}</text>
						<text style="font-size: 26rpx;color: #999999;margin-top: 10rpx;">{{val.organizationName}}</text>
					</view>
				</view>
				<view class="list-cell-r">
					<view class="slect-n" v-if="!val.selected">

					</view>
					<image src="/static/image/workbench/product-dispatch/select.png" mode="" v-else class="select">
					</image>
				</view>
			</view>
		</view>
		<!-- 		<u-index-list :scrollTop="scrollTop" :sticky='false' :index-list='leftList'>
			<view v-for="(item, index) in indexList" :key="index" style="padding: 0 48rpx 0 30rpx;">
				<u-index-anchor :index="item.key" :custom-style='style' />
				<view class="list-cell" v-for="(val,index2) in item.employeeEasyList" :key="index2" @click="selectOne(item,index2)">
					<view class="list-cell-l">
						<text>{{val.employeeName}}</text>
					</view>
					<view class="list-cell-r">
						<view class="slect-n" v-if="!val.selected">

						</view>
						<image src="/static/image/workbench/product-dispatch/select.png" mode="" v-else class="select">
						</image>
					</view>
				</view>
			</view>
		</u-index-list> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAssign: false,
				scrollTop: 0,
				leftList: [],
				indexList: [],
				style: {
					borderBottom: '1rpx solid #F0F0F0',
					padding: '32rpx 0 8rpx 0',
					color: '#999999',
					fontSize: '28rpx',
					background: 'none'
				},
				assignor: '',
				customerIds: [],
				name: '',
				type: '',
				currentPage: 1,
				pageSize: 10
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(options) {
			if (options.isAssign) {
				this.isAssign = options.isAssign
				this.type = options.type
				this.customerIds = JSON.parse(options.customerIds)
				this.assignEmployeeList()
			}
			// this.getYwy()
		},
		methods: {
			search() {
				this.indexList = []
				this.currentPage = 1
				this.assignEmployeeList()
			},
			//上拉加载
			onReachBottom() {
				this.currentPage++
				this.assignEmployeeList()
			},
			assignEmployeeList() {
				this.$post({
					url: this.api.Employee.getEasyList,
					data: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						employeeName: this.name
					}
				}).then(res => {
					res.rows.forEach(item => {
						item.selected = false
						this.indexList.push(item)
					})
					// this.indexList = res.rows
				})
			},
			selectOne(item, index) {
				if (item.selected) {
					item.selected = false
					this.assignor = ''
				} else {
					this.indexList.forEach(val => {
						val.selected = false
					})
					item.selected = true
					this.assignor = item.id
				}
			},
			back() {
				if (this.assignor == '') {
					this.$Toast('请选择')
				} else {
					if (this.isAssign) {
						this.$post({
							url: this.api.CustomInfo.promoteCustomer,
							data: {
								assignor: this.assignor,
								customerIds: this.customerIds,
								type: this.type,
								status: '1054-20',
								bindType: '1055-30'
							}
						}).then(res => {
							this.$Toast('指派成功')
							setTimeout(() => {
								uni.navigateBack({
									delta: 2
								})
							}, 1000)

						})
					}

				}

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
		padding: 20px 0;
		border-bottom: 1rpx solid #F0F0F0;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.list-cell-l {
			display: flex;
			align-items: center;

			image {
				width: 100rpx;
				height: 100rpx;
				margin-right: 10rpx;
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
		}

		.list-cell-r {
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
