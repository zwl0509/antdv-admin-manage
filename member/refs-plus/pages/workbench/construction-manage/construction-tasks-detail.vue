<template>
	<view class="construction-tasks-detail">
		<view :style="{ height: iStatusBarHeight + 'px',zIndex: 999}" class="stat"></view>
		<u-navbar :title="info.taskName" :is-fixed="true" title-width="500" :isAbsolute="false" :z-index="999"
			back-icon-color="#ffffff" :border-bottom="false" title-size="34" title-color="#ffffff"
			:background="navbar_bg">
		</u-navbar>
		<image src="@/static/image/workbench/construction-manage/task-bg.png" mode="" class="detail_bg"></image>
		<view class="page">
			<view class="box-head">
				<view class="head-flex">
					<view class="head-t">计划开工</view>
					<view class="head-b">{{info.actualStartTime}}</view>
				</view>
				<view class="head-flex">
					<view class="head-t">计划完工</view>
					<view class="head-b">{{info.actualStartTime}}</view>
				</view>
			</view>
			<view class="box-content">
				<view class="content-card" v-for="(item, index) in list" :key="index">
					<view class="content-card-show" @click="item.showContent=!item.showContent">
						<view class="card-head u-flex">
							<image :src="item.src" mode="" class="card-icon"></image>
							<view class="u-flex-col fl-col u-row-between head-content">
								<view class="content-t">{{ item.text }}</view>
								<view class="content-b" v-if="!item.info">{{ item.subtitle }}</view>
							</view>
						</view>
						<view class="content-card-show-r">
							<image src="/static/image/workbench/construction-manage/list-down.png" mode=""
								v-if="!item.showContent"></image>
							<image src="/static/image/workbench/construction-manage/list-up.png" mode="" v-else></image>
						</view>
					</view>
					<view v-if="item.info && item.showContent" class="card-content">
						<view class="">
							{{item.info.remark}}
						</view>
						<view class="content-imgs" v-if="item.info.attachInfos.length">
							<image v-for="(info, s_index) in item.info.attachInfos" :src="info.path"
								class="content-image">
						</view>
						<view class="nodata" v-else>
							<image src="/static/image/workbench/customer-manage/none.png" mode=""></image>
							<view class="">
								空空如也~
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="white" v-if="info.status == '1080-10'" @click="actionBtn('1080-30')">延期</view>
			<view class="white" v-if="info.index == 0 && !info.status" @click="actionBtn('1080-10')">开工</view>
			<view class="primary" v-else-if="info.status == '1080-10'" @click="actionBtn('1080-20')">完工</view>
			<!-- <view class="primary" v-else-if="info.status == '1080-20' && info.surveyId" @click="actionBtn('1080-40')">验收 -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbar_bg: {},
				iStatusBarHeight: '', //状态栏高度'
				info: null,
				tab_list: [{
						type: '1080-10',
						text: '开工信息',
						src: require('@/static/image/workbench/construction-manage/icon-1.png'),
						subtitle: '当前项目还没有开工'
					},
					{
						type: '1080-20',
						text: '完工信息',
						src: require('@/static/image/workbench/construction-manage/icon-2.png'),
						subtitle: '当前项目还没有完工'
					},
					{
						type: '1080-30',
						text: '延期申请',
						src: require('@/static/image/workbench/construction-manage/icon-3.png'),
						subtitle: '当前项目还没有延期记录'
					}
				],
				list: []
			}
		},
		onLoad(params) {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
			this.info = JSON.parse(decodeURIComponent(params.info))
		},
		onShow() {
			this.getDetail()
		},
		methods: {
			getDetail() {
				this.$get({
					url: this.api.CustomerConstructionTaskInfo.getTaskDetail,
					data: {
						customerConstructionTaskId: this.info.id
					}
				}).then(res => {
					const data = {
						...res
					}
					const list = this.$u.deepClone(this.tab_list)
					list.forEach(item => {
						item.showContent = false
						item.info = data[item.type]?. [0] || null
					})
					this.list = list
				}).catch(e => {
					console.log(e)
				})
			},
			// 施工操作
			actionBtn(type) {
				const data = {
					id: this.info.id,
					type: type,
				}
				if (type !== '1080-40') {
					uni.navigateTo({
						url: `./construction-action?info=${encodeURIComponent(JSON.stringify(data))}`
					})
				}
			}
		},
	}
</script>

<style lang="scss">
	.construction-tasks-detail {
		.nodata {
			padding-top: 20rpx;
			text-align: center;
		
			image {
				width: 296rpx;
				height: 216rpx;
			}
		
			view {
				color: #999999;
				margin-top: 30rpx;
				font-size: 32rpx;
			}
		}
		.stat {
			position: fixed;
			z-index: 99999;
			height: var(--status-bar-height); // --status-bar-height系统状态栏高度
			width: 100%;
			top: 0;
			left: 0;
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

			.box-head {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 114rpx 50rpx 0;
				color: #FFF;

				.head-flex {
					display: flex;
					flex-direction: column;
					align-items: center;

					.head-t {
						font-size: 30rpx;
						margin-bottom: 10rpx;
					}

					.head-b {
						font-size: 24rpx;
					}
				}
			}

			.box-content {
				margin-top: 48rpx;

				.content-card {
					padding: 30rpx;

					.content-card-show {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.content-card-show-r {
							image{
								width: 27rpx;
								height: 14rpx;
							}
						}
					}

					.card-head {
						.head-content {
							margin-left: 20rpx;

							// height: 80rpx;
							.content-t {
								font-size: 28rpx;
								color: #333;
							}

							.content-b {
								font-size: 24rpx;
								color: #999;
							}
						}

						.card-icon {
							width: 80rpx;
							height: 80rpx;
						}
					}

					.card-content {
						margin-top: 30rpx;

						.content-imgs {
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							align-items: center;
						}

						.content-image {
							margin: 0 12rpx 8rpx 0;
							width: 210rpx;
							height: 210rpx;
						}
					}
				}

			}
		}
	}
</style>
