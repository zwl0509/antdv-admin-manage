<template>
	<view class="construction-plan">
		<view :style="{ height: iStatusBarHeight + 'px',zIndex: 999}" class="stat"></view>
		<u-navbar title="施工计划" :is-fixed="true" :isAbsolute="false" :z-index="999" back-icon-color="#ffffff"
			:border-bottom="false" title-size="34" title-color="#ffffff" :background="navbar_bg">
		</u-navbar>
		<image src="@/static/image/workbench/construction-manage/bg2.png" mode="" class="detail_bg"
			v-if="allStatus=='1080-50'"></image>
		<image src="@/static/image/workbench/construction-manage/bg1.png" mode="" class="detail_bg"
			v-else-if="allStatus=='1080-20'"></image>
		<image src="@/static/image/workbench/construction-manage/bg3.png" mode="" class="detail_bg"
			v-else-if="allStatus=='1080-60'"></image>
		<image src="@/static/image/workbench/construction-manage/bg.png" mode="" class="detail_bg" v-else></image>
		<view class="page">
			<view class="top-title" v-if="allStatus=='1080-50'">未开工</view>
			<view class="top-title" v-else-if="allStatus=='1080-20'">已开工</view>
			<view class="top-title" v-else-if="allStatus=='1080-60'">已开工</view>
			<view class="top-title" v-else>正常施工</view>
			<view class="concent">
				<u-time-line>
					<template v-for="(item, index) in list">
						<!-- 父节点 -->
						<u-time-line-item nodeTop="2" :key="index">
							<!-- 自定义图标 -->
							<template v-slot:node>
								<view class="u-node-r" v-if="item.status=='1080-10'">
									<view class="u-node-r-dian">

									</view>
								</view>
								<view class="u-node" v-else>
									<view class="u-node-dian">

									</view>
								</view>
							</template>
							<!-- 自定义内容 -->
							<template v-slot:content>
								<view :class="item.status == '1080-10' ? 'u-time-content-stay' : 'u-time-content' ">
									<view class="u-time-content-time">{{ item.estimateStartTime }}</view>
									<view class="u-time-content-title">
										<view class="u-time-content-action">
											<view @click="taskDetail(item, index)" class="u-line-1 text">
												{{ item.taskName }}
											</view>
											<image v-if="item.child.length" :src="item.action_expand" class="icon"
												@click="expand(index)"></image>
										</view>
										<view :style="{color: item.color}">{{ item.statusName }}</view>
									</view>
								</view>
								<view class="u-flex u-item-content-top">
									<view class="u-flex" :class="item.status == '1080-10' ? 'stay': '' "
										v-if="item.status!='1080-20' || item.status!='1080-40'" @click="showUrge(item)">
										<image v-if="item.status == '1080-10'"
											src="@/static/image/workbench/construction-manage/bell-b.png"></image>
										<image v-else src="@/static/image/workbench/construction-manage/bell-w.png">
										</image>
										<text>催办</text>
									</view>
									<view class="divider" v-if="item.status!='1080-20' || item.status!='1080-40'">
									</view>
									<view class="u-flex" :class="item.status == '1080-10' ? 'stay': '' "
										@click="phone(item.operationPositionPhone)">
										<image v-if="item.status == '1080-10'"
											src="@/static/image/workbench/construction-manage/phone-b.png"></image>
										<image v-else src="@/static/image/workbench/construction-manage/phone-w.png">
										</image>
										<text>电话</text>
									</view>
								</view>
								<view class="u-item-content-bottom">
									<u-line />
								</view>
							</template>
						</u-time-line-item>
						<!-- 子节点 -->
						<template v-if="item.child.length && item.isShowChild">
							<u-time-line-item nodeTop="2" v-for="(info, s_index) in item.child">
								<template v-slot:node>
									<view
										style="width: 8rpx;height: 8rpx;border-radius: 50%;background-color: #C0C0C0;">
									</view>
								</template>
								<template v-slot:content>
									<view :class="info.status == '1080-10' ? 'u-time-content-stay' : 'u-time-content' ">
										<view class="u-time-content-time">{{ info.estimateStartTime }}</view>
										<view class="u-time-content-title">
											<view class="u-time-content-action">
												<view @click="taskDetail(info)" class="u-line-1 samll-text">
													{{ info.taskName }}
												</view>

												<view class="u-time-content-type"
													:style="{color: info.color, background: info.background}">
													{{ info.statusName }}
												</view>
											</view>
										</view>
									</view>
									<view class="u-flex u-item-content-top">
										<view class="u-flex" :class="info.status == '1080-10' ? 'stay': '' "
											@click="showUrge(info)">
											<image v-if="info.status == '1080-10'"
												src="@/static/image/workbench/construction-manage/bell-b.png"></image>
											<image v-else src="@/static/image/workbench/construction-manage/bell-w.png">
											</image>
											<text>催办</text>
										</view>
										<view class="divider"></view>
										<view class="u-flex" :class="info.status == '1080-10' ? 'stay': '' "
											@click="phone(info.operationPositionPhone)">
											<image v-if="info.status == '1080-10'"
												src="@/static/image/workbench/construction-manage/phone-b.png"></image>
											<image v-else
												src="@/static/image/workbench/construction-manage/phone-w.png"></image>
											<text>电话</text>
										</view>
									</view>
									<view class="u-item-content-bottom">
										<u-line />
									</view>
								</template>
							</u-time-line-item>
						</template>
					</template>
				</u-time-line>
			</view>
		</view>
		<view class="footer">
			<view class="primary" @click="stopOrResumeWork">停复工</view>
		</view>
		<u-modal v-model="show" :confirm-style='confirmStyle' :cancel-style='camcelStyle' content="是否确认催办"
			:show-cancel-button='true' title='提醒' @confirm='customerTaskUrge' :title-style='titleStyle'
			:content-style="contentStyle">
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbar_bg: {
					 backgroundImage:"url('/static/image/workbench/construction-manage/bg.png')"
				},
				iStatusBarHeight: '', //状态栏高度
				list: [],
				customerId: '',
				constructionPlanId: '',
				allStatus: '',
				show: false,
				titleStyle: {
					fontSize: '26rpx',
					color: '#333333',
					fontWeight: 'bold'
				},
				contentStyle: {
					color: '#333333',
					fontSize: '32rpx'
				},
				camcelStyle: {
					background: '#F5F5F5',
					color: "#333333",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 31rpx 40rpx 40rpx'
				},
				confirmStyle: {
					background: 'linear-gradient(90deg, #D80100 0%, #B80201 100%)',
					color: "#FFFFFF",
					fontSize: '34rpx',
					width: '216rpx',
					height: '80rpx',
					borderRadius: '40rpx',
					lineHeight: '80rpx',
					margin: '40rpx 40rpx 40rpx 31rpx'
				},
				basicConstructionTaskId: ''
			}
		},
		onLoad(params = {}) {
			this.constructionPlanId = params.constructionPlanId
			this.customerId = params.customerId
			console.log(this.customerId)
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
			if (params.agencyId) {
				this.toDealWithIsView(params.agencyId)
			}
		},
		onShow() {
			this.getDetail(this.customerId)
		},
		methods: {
			//
			showUrge(val) {
				this.basicConstructionTaskId = val.basicConstructionTaskId
				this.show = true
			},
			//待办已读
			toDealWithIsView(id) {
				this.$get({
					url: this.api.toDealWith.toDealWithIsView,
					data: {
						id: id
					}
				}).then(res => {

				})
			},
			//催办
			customerTaskUrge() {
				this.$post({
					url: this.api.CustomerConstructionTaskInfo.customerTaskUrge,
					data: {
						customerConstructionTaskId: this.basicConstructionTaskId
					}
				}).then(res => {
					this.$Toast('操作成功')
					this.getDetail(this.customerId)
				})
			},
			//打电话
			phone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: function(res) {
						console.log(1)
					},
					fail: function(res) {
						console.log(2)
					}
				})
			},
			// 任务详情页面
			taskDetail(item, index) {
				item.index = index
				uni.navigateTo({
					url: `./construction-tasks-detail?info=${encodeURIComponent(JSON.stringify(item))}`
				})
			},
			// 获取详情
			getDetail(customerId) {
				this.$get({
					url: this.api.CustomerConstructionTaskInfo.getTaskList,
					data: {
						customerId
					}
				}).then(res => {
					this.allStatus = res.status
					const data = [...res.customerTaskListVOS]
					this.list = this.handleTasksList(data)
				}).catch(e => {
					console.log(e)
				})
			},
			// 处理任务数据
			handleTasksList(list) {
				list?.forEach(item => {
					if (item.status == '1080-10') {
						item.color = '#999999'
						item.statusName = '待完工'
						item.background = '#F2F2F2'
					} else if (item.status == '1080-20') {
						item.color = '#0AB4B3'
						item.statusName = '待验收'
						item.background = '#E1FAFA'
					} else if (item.status == '1080-30') {
						item.color = '#0AB4B3'
						item.statusName = '待延期'
						item.background = '#E1FAFA'
					}
					item.isShowChild = false
					item.action_expand = require('@/static/image/workbench/construction-manage/up.png')
					if (item.child.length) {
						this.handleTasksList(item.child)
					}
				})
				return list
			},
			// 展开关闭子节点
			expand(index) {
				this.list[index].isShowChild = !this.list[index].isShowChild
				this.list[index].action_expand = this.list[index].isShowChild ?
					require('@/static/image/workbench/construction-manage/down.png') :
					require('@/static/image/workbench/construction-manage/up.png')
			},
			// 停复工
			stopOrResumeWork() {
				uni.navigateTo({
					url: `./resume-list?customerId=` + this.customerId + '&constructionPlanId=' + this
						.constructionPlanId
				})
			}
		},
	}
</script>

<style lang="scss">
	.construction-plan {
		.stat {
			.stat {
				position: fixed;
				z-index: 99999;
				height: var(--status-bar-height); // --status-bar-height系统状态栏高度
				width: 100%;
				top: 0;
				left: 0;
			}
		}

		.detail_bg {
			width: 100%;
			height: calc(328rpx + var(--status-bar-height));
			position: absolute;
			top: 0rpx;
			left: 0rpx;
			z-index: 3;
		}

		.page {
			position: relative;
			z-index: 4;
			padding-bottom: 140rpx;

			.top-title {
				margin: 90rpx 0 0 60rpx;
				font-size: 52rpx;
				color: #FFF;
			}

			.concent {
				margin-top: 120rpx;

				.u-node {
					width: 24rpx;
					height: 24rpx;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #EBEBEB;

					.u-node-dian {
						width: 8rpx;
						height: 8rpx;
						background: #C0C0C0;
						border-radius: 50%;
					}
				}

				.u-node-r {
					width: 24rpx;
					height: 24rpx;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #FFE6E6;

					.u-node-r-dian {
						width: 8rpx;
						height: 8rpx;
						background: #B80201;
						border-radius: 50%;
					}
				}

				.u-time-axis {
					padding-left: 80rpx;
				}

				.u-time-content {
					font-size: 28rpx;
					color: #333333;
				}

				.u-time-content-stay {
					font-size: 28rpx;
					color: #999999;
				}

				.u-time-content-time {
					font-size: 20rpx;
					margin-bottom: 20rpx;
				}

				.u-time-axis::before {
					content: '';
					position: absolute;
					left: 40rpx;
					top: 8rpx;
					width: 2rpx;
					border-left: 2rpx dashed #ddd;
					transform-origin: 0 0;
					-webkit-transform: scaleX(.5);
					transform: scaleX(.5);
				}

				.u-item-content-top {
					margin-top: 20rpx;

					.stay {
						color: #999999;
					}

					image {
						width: 30rpx;
						height: 30rpx;
					}

					text {
						font-size: 28rpx;
						margin-left: 15rpx;
					}
				}

				.u-item-content-bottom {
					margin-top: 20rpx;
					margin-right: 40rpx;
				}


				.u-time-content-title {
					margin-right: 40rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.u-time-content-action {
					display: flex;
					align-items: center;

					.text {
						max-width: 400rpx;
						font-size: 32rpx;
					}

					.icon {
						margin-left: 24rpx;
						width: 24rpx;
						height: 24rpx;
					}

					.samll-text {
						font-size: 24rpx;
					}
				}

				.u-time-content-type {
					margin-left: 20rpx;
					width: 90rpx;
					height: 36rpx;
					line-height: 36rpx;
					font-size: 16rpx;
					text-align: center;
					border-radius: 8rpx;
					transform: scale(.8);
				}
			}
		}
	}
</style>
