<template>
	<view class="index">
		<u-navbar :is-back="true" :border-bottom='false' back-icon-color='#333333'>
			<view class="slot-wrap">
				<input type="text" value="" placeholder="请输入待派人员姓名/部门" />
				<image src="/static/image/workbench/product-dispatch/search.png" mode=""></image>
				<text @click="back">确定</text>
			</view>
		</u-navbar>
		<u-index-list :scrollTop="scrollTop" :sticky='false' :index-list='leftList'>
			<view v-for="(item, index) in indexList" :key="index" style="padding: 0 48rpx 0 30rpx;">
				<u-index-anchor :index="item.key" :custom-style='style' />
				<view class="" v-for="(val,index2) in item.list" :key="index2">
					<view class="title" @click="val.show=!val.show">
						{{val.name}}
					</view>
					<view class="list-cell" v-for="(val2,index3) in val.list2" :key="index3" @click="selectOne(val2,index3)" v-if="val.show">
						<view class="list-cell-l">
							<view class="slect-n" v-if="!val2.select">

							</view>
							<image src="/static/image/workbench/product-dispatch/select.png" mode="" v-else
								class="select">
							</image>
							<image :src="val2.img" mode="" class="tx"></image>
							<view class="text">
								<view class="name">
									{{val2.name}}
								</view>
								<view class="from">
									{{val2.from}}
								</view>
							</view>
						</view>
						<view class="list-cell-r">
							在建<text>{{val2.number}}</text>个
						</view>
					</view>
				</view>

			</view>
		</u-index-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				leftList: ['A', 'B', 'C'],
				indexList: [{
						key: 'A',
						list: [{
							name: '创意中心',
							show: true,
							list2: [{
								img: '/static/image/mine/avatar-mis.png',
								name: '陈情',
								from: '生活馆一中心',
								number: 8,
								select: false
							}, {
								img: '/static/image/mine/avatar-mis.png',
								name: '陈情',
								from: '生活馆一中心',
								number: 8,
								select: false
							}, {
								img: '/static/image/mine/avatar-mis.png',
								name: '白羽楠',
								from: '生活馆五中心',
								number: 8,
								select: false
							},]
						},{
							name: '创意中心2',
							show: true,
							list2: [{
								img: '/static/image/mine/avatar-mis.png',
								name: '陈情',
								from: '生活馆一中心',
								number: 8,
								select: false
							}, {
								img: '/static/image/mine/avatar-mis.png',
								name: '陈情',
								from: '生活馆一中心',
								number: 8,
								select: false
							}, {
								img: '/static/image/mine/avatar-mis.png',
								name: '白羽楠',
								from: '生活馆五中心',
								number: 8,
								select: false
							},]
						}]
					},
					{
						key: 'B',
						list: [{
							name: '创意中心',
							show: true,
							list2: [{
								img: '/static/image/mine/avatar-mis.png',
								name: '陈情',
								from: '生活馆一中心',
								number: 8,
								select: false
							}, {
								img: '/static/image/mine/avatar-mis.png',
								name: '陈情',
								from: '生活馆一中心',
								number: 8,
								select: false
							}, {
								img: '/static/image/mine/avatar-mis.png',
								name: '白羽楠',
								from: '生活馆五中心',
								number: 8,
								select: false
							}]
						}]
					},
					{
						key: 'C',
						list: [{
							name: '创意中心',
							show: true,//
							list2: [{
								img: '/static/image/mine/avatar-mis.png',
								name: '陈情',
								from: '生活馆一中心',
								number: 8,
								select: false
							}]
						}]
					}
				],
				style: {
					borderBottom: '1rpx solid #F0F0F0',
					padding: '32rpx 0 8rpx 0',
					color: '#999999',
					fontSize: '28rpx',
					background: 'none'
				},
				currentName: ''
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			selectOne(item, index) {
				if (item.select) {
					item.select = false
					this.currentName = ''
				} else {
					this.indexList.forEach(val => {
						val.list.forEach(val2 => {
							val2.list2.forEach(val3=>{
								val3.select=false
							})
						})
					})
					item.select = true
					this.currentName = item.name
				}
			},
			back() {
				if (this.currentName == '') {
					this.$Toast('请选择')
				} else {
					uni.navigateBack({

					})
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
		align-items: flex-start;
		justify-content: space-between;

		.list-cell-l {
			display: flex;
			align-items: center;

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

			.tx {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin: 0 16rpx 0 20rpx;
			}

			.text {
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				height: 100rpx;

				.name {
					color: #333333;
					font-size: 30rpx;
					font-weight: bold;
				}

				.from {
					color: #999999;
					font-size: 26rpx;
				}
			}
		}

		.list-cell-r {
			padding-top: 10rpx;
			font-size: 24rpx;
			color: #999999;

			text {
				color: #B80201;
				margin: 0 6rpx;
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
