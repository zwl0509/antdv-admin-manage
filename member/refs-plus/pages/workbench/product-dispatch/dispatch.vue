<template>
	<view class="index">
		<u-navbar :is-back="true" :border-bottom='false' back-icon-color='#333333'>
			<view class="slot-wrap">
				<input type="text" value="" placeholder="请输入客户姓名" />
				<image src="/static/image/workbench/product-dispatch/search.png" mode=""></image>
			</view>
		</u-navbar>
		<view class="tabs">
			<view :class="current==index ? 'tab-a':'tab'" v-for="(val,index) in tabsList" :key="index" @click="current=index">
				{{val.name}}
				<view class="bar" v-if="current==index">

				</view>
			</view>
		</view>
		<scroll-view scroll-y="true">
			<view class="scroll-list">
				<view class="list" v-for="(val,index) in list[current]" :key="index">
					<view class="list-top">
						<view class="list-top-info" @click="todetail">
							<view class="list-top-info-l">
								<text>{{val.name}}</text>
								<text>{{val.phone}}</text>
							</view>
							<view class="list-top-info-r">
								<text>查看详情</text>
								<image src="/static/image/mine/right.png" mode=""></image>
							</view>
						</view>
						<view class="list-top-address">
							<view class="list-top-address-text">
								<view class="list-top-address-text-y">
									<text>{{val.area}}</text>
									<view class="">

									</view>
									<text>{{val.type}}</text>
								</view>
								<view class="list-top-address-text-e">
									<image src="/static/image/workbench/product-dispatch/address.png" mode=""></image>
									<text style="margin-right: 14rpx;">{{val.address}}</text>
									<text>{{val.address_detail}}</text>
								</view>
							</view>
							<view class="list-top-address-btn" v-show="current==0" @click="numberList">
								派工
							</view>
						</view>
					</view>
					<view :class=" val.show ? 'list-bottom' : 'list-bottom hide'" @click="showbottom(index)">
						<view class="list-bottom-type" v-for="(val2,index2) in val.process" :key="index2">
							<view class="list-bottom-type0" v-if="val2.type==0">
								<view class="list-bottom-type0-l">
									<image src="/static/image/workbench/product-dispatch/grey.png" mode="" class="dian">
									</image>
									<text>{{val2.name}}</text>
								</view>
								<view class="list-bottom-type0-r">
									<text>{{val2.time}}</text>
									<image src="/static/image/workbench/product-dispatch/down.png" mode="" class="right"
										v-show="val.show"></image>
									<image src="/static/image/workbench/product-dispatch/up.png" mode="" class="right"
										v-show="!val.show"></image>
								</view>
							</view>
							<view class="list-bottom-type1" v-if="val2.type==1">
								<view class="">
									<image src="/static/image/workbench/product-dispatch/red.png" mode="" class="dian">
									</image>
									<text>{{val2.name}}</text>
								</view>
								<image src="/static/image/workbench/product-dispatch/down.png" mode="" class="right"
									v-show="val.show"></image>
								<image src="/static/image/workbench/product-dispatch/up.png" mode="" class="right"
									v-show="!val.show"></image>
							</view>
							<view class="list-bottom-type2" v-if="val2.type==2">
								<view class="list-bottom-type2-y">
									<view class="dian">

									</view>
									<text>{{val2.name}}</text>
								</view>
								<view class="list-bottom-type2-e">
									{{val2.username}}
								</view>
							</view>
							<view class="list-bottom-type3" v-if="val2.type==3">
								<view class="list-bottom-type3-l">
									<image src="/static/image/workbench/product-dispatch/grey.png" mode="" class="dian">
									</image>
									<text>{{val2.name}}</text>
									<view class="">
										{{val2.status}}
									</view>
								</view>
								<view class="list-bottom-type3-r">
									{{val2.time}}
								</view>
							</view>
						</view>
						<view class="line">

						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabsList: [{
					name: '待派工',
					value: ''
				}, {
					name: '已派工',
					value: ''
				}],
				current: 0,
				list: [
					[{
						name: '周凯雯',
						phone: '188****8910',
						area: '128㎡',
						type: '三室两厅',
						address: '苏州',
						address_detail: '吴中区XXX小区18幢105室',
						show: false,
						process: [{
							type: 1,
							name: '等待指派设计师'
						}, {
							type: 2,
							name: '设计师',
							username: '张顺东'
						}, {
							type: 3,
							name: '指派内控员',
							status: '已完成'
						}, {
							type: 2,
							name: '内控员',
							username: '李晓'
						}, {
							type: 3,
							name: '指派内控员',
							status: '已完成'
						}, {
							type: 2,
							name: '内控员',
							username: '李晓'
						},  {
							type: 3,
							name: '指派内控员',
							status: '已完成'
						}, {
							type: 2,
							name: '内控员',
							username: '李晓'
						},  {
							type: 3,
							name: '指派内控员',
							status: '已完成'
						}, {
							type: 2,
							name: '内控员',
							username: '李晓'
						},  ]
					}, {
						name: '周凯雯',
						phone: '188****8910',
						area: '128㎡',
						type: '三室两厅',
						address: '苏州',
						address_detail: '吴中区XXX小区18幢105室',
						show: false,
						process: [{
							type: 1,
							name: '等待指派设计师'
						}, {
							type: 2,
							name: '设计师',
							username: '张顺东'
						}, {
							type: 3,
							name: '指派内控员',
							status: '已完成'
						}, {
							type: 2,
							name: '内控员',
							username: '李晓'
						}, ]
					}, {
						name: '周凯雯',
						phone: '188****8910',
						area: '128㎡',
						type: '三室两厅',
						address: '苏州',
						address_detail: '吴中区XXX小区18幢105室',
						show: false,
						process: [{
							type: 1,
							name: '等待指派设计师'
						}, {
							type: 2,
							name: '设计师',
							username: '张顺东'
						}, {
							type: 3,
							name: '指派内控员',
							status: '已完成'
						}, {
							type: 2,
							name: '内控员',
							username: '李晓'
						}, ]
					}, ],
					[{
						name: '周凯雯',
						phone: '188****8910',
						area: '128㎡',
						type: '三室两厅',
						address: '苏州',
						address_detail: '吴中区XXX小区18幢105室',
						show: false,
						process: [{
							type: 0,
							name: '已指派设计师',
							time: '2022-05-01'
						}, {
							type: 2,
							name: '设计师',
							username: '张顺东'
						}, {
							type: 3,
							name: '指派内控员',
							status: '已完成',
							time: '2022-05-01'
						}, {
							type: 2,
							name: '内控员',
							username: '李晓'
						}, ]
					}, ]
				],
				show: false
			}
		},
		methods: {
			showbottom(index) {
				this.list[this.current][index].show = !this.list[this.current][index].show
			},
			numberList() {
				uni.navigateTo({
					url: 'number-list'
				})
			},
			todetail() {
				// uni.navigateTo({
				// 	url: '/pages/workbench/customer-manage/customer-detail'
				// })
			}
		}
	}
</script>
<style>
	page {
		background-color: #F8F8FB !important;
	}
</style>
<style scoped lang="less">
	.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		// flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		// padding: 0 30rpx;
		position: relative;
		width: 558rpx;
		margin-left: 30rpx;

		image {
			width: 28rpx;
			height: 28rpx;
			position: absolute;
			top: 0;
			bottom: 0;
			margin: auto;
			left: 28rpx;
		}

		input {
			background-color: #F5F5F5;
			border: none;
			width: 100%;
			height: 60rpx;
			padding-left: 72rpx;
			border-radius: 56rpx;
		}
	}

	.index {
		.tabs {
			width: 100%;
			height: 112rpx;
			// padding: 0 26rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #FFFFFF;

			.tab {
				width: 242rpx;
				height: 112rpx;
				line-height: 112rpx;
				text-align: center;
				font-size: 28rpx;
				color: #999999;
				font-weight: 400;
			}

			.tab-a {
				width: 242rpx;
				height: 112rpx;
				line-height: 112rpx;
				text-align: center;
				font-size: 28rpx;
				color: #000000;
				font-weight: 600;
				position: relative;

				.bar {
					width: 44rpx;
					height: 8rpx;
					background: linear-gradient(270deg, #FF8382 0%, #B80201 100%);
					border-radius: 4rpx;
					position: absolute;
					left: 0;
					right: 0;
					margin: auto;
					bottom: 16rpx;
				}
			}
		}

		.scroll-list {
			height: calc(100vh - 174px);
			padding: 0.1rpx;
			padding: 0 30rpx;

			.list {
				background-color: #FFFFFF;
				border-radius: 16rpx;
				margin-top: 20rpx;
				padding: 0 24rpx;

				.list-top {
					padding-top: 32rpx;
					padding-bottom: 26rpx;
					border-bottom: 1rpx solid #F0F0F0;

					.list-top-info {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 24rpx;

						.list-top-info-l {
							text {
								color: #333333;
								font-size: 30rpx;
								font-weight: 400;

								&:first-child {
									font-size: 32rp;
									font-weight: bold;
									margin-right: 24rpx;
								}
							}
						}

						.list-top-info-r {
							display: flex;
							align-items: center;

							text {
								font-size: 24rpx;
								color: #999999;
								font-weight: 400;
							}

							image {
								width: 8rpx;
								height: 16rpx;
								margin-left: 16rpx;
							}
						}
					}

					.list-top-address {
						display: flex;
						align-items: flex-end;
						justify-content: space-between;

						.list-top-address-text {
							.list-top-address-text-y {
								display: flex;
								align-items: center;
								margin-bottom: 12rpx;

								text {
									font-size: 26rpx;
									color: #666666;
								}

								view {
									width: 0px;
									height: 24px;
									border: 1px solid #D5D5D5;
									margin: 0 20rpx;
								}
							}

							.list-top-address-text-e {
								display: flex;
								align-items: center;

								image {
									width: 18rpx;
									height: 24rpx;
									margin-right: 12rpx;
								}

								text {
									color: #666666;
									font-size: 26rpx;
								}
							}
						}

						.list-top-address-btn {
							width: 96rpx;
							height: 56rpx;
							line-height: 56rpx;
							border-radius: 8rpx;
							background-color: #B80201;
							text-align: center;
							font-size: 28rpx;
							color: #FFFFFF;
						}
					}
				}

				.hide {
					height: 88rpx;
					padding: 24rpx 0 24rpx 0 !important;
				}

				.list-bottom {
					padding: 24rpx 0 0 0;
					position: relative;
					z-index: 2;
					overflow: hidden;

					.line {
						height: calc(100% - 34rpx);
						position: absolute;
						top: 34rpx;
						left: 12rpx;
						width: 0rpx;
						border: 1rpx dotted #C0C0C0;
						z-index: -1;
					}

					.list-bottom-type {
						.list-bottom-type0 {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 24rpx;

							.list-bottom-type0-l {
								display: flex;
								align-items: center;

								text {
									color: #333333;
									font-size: 28rpx;
								}

								.dian {
									width: 24rpx;
									height: 24rpx;
									margin-right: 16rpx;
								}
							}

							.list-bottom-type0-r {
								text {
									color: #999999;
									font-size: 22rpx;
								}

								.right {
									width: 24rpx;
									height: 24rpx;
									margin-left: 24rpx;
									position: relative;
								}
							}

						}

						.list-bottom-type1 {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 24rpx;

							view {
								display: flex;
								align-items: center;

								text {
									color: #B80201;
									font-size: 28rpx;
								}

								.dian {
									width: 24rpx;
									height: 24rpx;
									margin-right: 16rpx;
								}
							}

							.right {
								width: 24rpx;
								height: 24rpx;
							}
						}

						.list-bottom-type2 {
							padding-left: 10rpx;
							margin-bottom: 40rpx;

							.list-bottom-type2-y {
								display: flex;
								align-items: center;
								margin-bottom: 8rpx;

								view {
									width: 8rpx;
									height: 8rpx;
									background: #C0C0C0;
									border-radius: 50%;
									margin-right: 28rpx;
								}

								text {
									color: #666666;
									font-size: 22rpx;
								}
							}

							.list-bottom-type2-e {
								padding-left: 36rpx;
								color: #333333;
								font-size: 26rpx;
							}
						}

						.list-bottom-type3 {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 24rpx;
							.list-bottom-type3-l {
								display: flex;
								align-items: center;

								image {
									width: 24rpx;
									height: 24rpx;
									margin-right: 16rpx;
								}

								text {
									color: #333333;
									font-size: 28rpx;
								}

								view {
									width: 68rpx;
									height: 32rpx;
									background-color: #F2F2F2;
									border-radius: 4rpx;
									line-height: 32rpx;
									text-align: center;
									color: #999999;
									font-size: 20rpx;
									margin-left: 16rpx;
								}
							}
							.list-bottom-type3-r{
								color: #999999;
								font-size: 22rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
