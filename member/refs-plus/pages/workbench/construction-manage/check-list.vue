<template>
	<view class="check-list">
		<u-navbar :title-bold="true" title="验收列表" back-icon-color="#333333" title-color="#333333" class="navbar fl-cc"
			:border-bottom="false">
		</u-navbar>
		<view class="list-y" v-for="(val,index) in list" :key="index">
			<view class="list-y-show" @click="val.show=!val.show">
				<view class="list-y-show-l">
					<text class="tip-g" v-if="val.score">{{val.surveyOptionName}}</text>
					<text class="tip-r" v-else>{{val.surveyOptionName}}</text>
					<!-- <text class="tip-w">驳回</text> -->
					<text class="title">{{val.title}}</text>
				</view>
				<view class="list-y-show-r">
					<image src="/static/image/workbench/construction-manage/list-up.png" mode="" v-if="val.show">
					</image>
					<image src="/static/image/workbench/construction-manage/list-down.png" mode="" v-else></image>
				</view>
			</view>
			<view class="list-y-hide" v-if="val.show">
				<view class="list-y-hide-info" v-for="(item,index2) in val.detailVOS" :key="index2">
					<view class="list-y-hide-info-time">
						{{item.modifiedTime}}
					</view>
					<view class="list-y-hide-info-text">
						<view class="">
							<text>验收人: {{item.relationName}}</text>
						</view>
						<view class="" v-if="item.statusName">
							<text>整改状态：{{item.statusName}}</text>
							<image src="/static/image/workbench/construction-manage/check.png" mode=""
								v-if="item.rectificationId" @click="toDetail(item)"></image>
						</view>
					</view>
					<view class="" v-if="item.attachInfos.length">
						<scroll-view class="scroll-view_H" scroll-x="true">
							<view class="dataInfo">
								<view class="dataList" v-for="(img,index3) in item.attachInfos" :key="index3">
									<image :src="img.path" mode="" @click="previewImage(item.attachInfos,index3)"></image>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
		<view class="btns">
			<text class="btns-unqualified" @click="toSend" v-if="isAcceptance">不合格整改</text>
			<text class="btns-check" @click="toCheck" v-if="isRectification">去验收</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				id: '',
				list: [],
				checkList: [],
				rectificationList: [],
				operationPositionId:'',
				operationPositionName:'',
				isAcceptance:false,
				isRectification:false
			}
		},
		onLoad(options) {
			this.id = options.id
			this.customerId = options.customerId
		},
		onShow() {
			this.getList()
			this.getJurisdiction()
		},
		methods: {
			previewImage(e,index) {
				let urls=[]
				console.log(e)
				e.forEach(item=>{
					urls.push(item.path)
				})
				uni.previewImage({
					current: urls[index],
					urls: urls //一个数组，可以查看多张图
				});
			},
			//获取按钮权限
			getJurisdiction() {
				let targetIds = []
				this.listBtns = []
				this.singleBtns = []
				targetIds.push(this.vuex_user.id)
				this.vuex_user.roles.forEach(item => {
					targetIds.push(item.id)
				})
				this.$post({
					url: this.api.AuthUser.getAuthActionByTargetIds,
					data: {
						backstage: 0,
						sitemapId: uni.getStorageSync('sitemapId'),
						targetIds: targetIds
					}
				}).then(res => {
					res.forEach(item => {
						if (item.key.indexOf('Acceptance') != -1) {
							this.isAcceptance = true
						}
						if (item.key.indexOf('Rectification') != -1) {
							this.isRectification = true
						}
					})
				})
			},
			toDetail(item){
				// +'&rectification=true'
				uni.navigateTo({
					url:'rectification-detail?id='+item.rectificationId
				})
			},
			toCheck() {
				console.log(this.checkList)
				uni.navigateTo({
					url: 'acceptance-questionnaire?ids=' + JSON.stringify(this.checkList) + '&customerId=' + this
						.customerId + '&customerConstructionTaskId=' + this.id
				})
			},
			toSend() {
				uni.navigateTo({
					url: 'rectification-send?data=' + JSON.stringify(this.rectificationList)+'&operationPositionId='+this.operationPositionId+'&operationPositionName='+this.operationPositionName+ '&customerConstructionTaskId=' + this.id
				})
			},
			getList() {
				this.checkList = []
				this.rectificationList=[]
				this.$get({
					url: this.api.CustomerConstructionTaskInfo.getCheckList,
					data: {
						customerConstructionTaskId: this.id
					}
				}).then(res => {
					res.customerTaskCheckListVOS.forEach(item => {
						item.show = false
						if (item.score == 0) {
							this.checkList.push(item.questionId)
							this.rectificationList.push(item)
						}
					})
					this.list = res.customerTaskCheckListVOS
					this.operationPositionName=res.operationPositionName
					this.operationPositionId=res.operationPositionId
					console.log(this.list)
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #F6F6F6;
	}
</style>
<style scoped lang="less">
	.hand {
		width: 95%;
		margin: 0 auto;
	}

	.dataInfo {
		width: 100%;
		display: flex;
	}

	.dataList {
		margin: 10rpx;

		image {
			width: 222rpx;
			height: 222rpx;
			border-radius: 8rpx;
		}
	}

	.dataList:first-child {
		margin-left: 0;
	}

	.check-list {
		padding-bottom: 118rpx;

		.list-y {
			width: 100%;
			background-color: #fff;
			margin-top: 20rpx;

			.list-y-show {
				padding: 36rpx 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.list-y-show-l {
					display: flex;
					align-items: flex-start;

					.tip-g {
						padding: 4rpx 10rpx 3rpx 10rpx;
						background-color: #E1FAFA;
						border-radius: 4rpx;
						font-size: 24rpx;
						color: #0AB4B3;
						flex-shrink: 0;
					}

					.tip-r {
						padding: 4rpx 10rpx 3rpx 10rpx;
						background-color: #FFE5E3;
						border-radius: 4rpx;
						font-size: 24rpx;
						color: #B80201;
						flex-shrink: 0;
					}

					.tip-w {
						padding: 4rpx 10rpx 3rpx 10rpx;
						background-color: #FFF1DC;
						border-radius: 4rpx;
						font-size: 24rpx;
						color: #FF7E3E;
						flex-shrink: 0;
					}

					.title {
						display: inline-block;
						max-width: 400rpx;
						font-size: 30rpx;
						color: #333333;
						font-weight: bold;
						margin-left: 16rpx;
					}
				}

				.list-y-show-r {
					image {
						width: 27rpx;
						height: 14rpx;
					}

				}
			}

			.list-y-hide {
				padding: 0 30rpx;

				.list-y-hide-info {
					overflow: hidden;
					border-top: 2rpx solid #F6F6F6;
					padding-top: 25rpx;

					.list-y-hide-info-time {
						font-size: 24rpx;
						color: #666666;
						margin-bottom: 20rpx;
					}

					.list-y-hide-info-text {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 26rpx;

						view {
							display: flex;
							align-items: center;
							color: #333333;
							font-size: 28rpx;

							image {
								width: 28rpx;
								height: 28rpx;
								margin-left: 16rpx;
							}
						}
					}

					.scroll-view_H {
						width: auto;
						height: 222rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						image {
							width: 222rpx;
							height: 222rpx;
							border-radius: 8rpx;
						}
					}

					.imgs {
						// width: 100%;
						height: 222rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						image {
							width: 222rpx;
							height: 222rpx;
							border-radius: 8rpx;
						}
					}
				}
			}
		}

		.btns {
			width: 100%;
			height: 96rpx;
			background-color: #fff;
			position: fixed;
			z-index: 99;
			bottom: 0;
			left: 0;
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			text {
				display: inline-block;
				width: 168rpx;
				height: 72rpx;
				line-height: 72rpx;
				text-align: center;
				font-size: 28rpx;
				margin-left: 20rpx;
				border-radius: 44rpx;
			}

			.btns-unqualified {
				border: 2rpx solid #C0C0C0;
				color: #333333;
			}

			.btns-check {
				background: linear-gradient(90deg, #E40000 0%, #B80201 100%);
				color: #FFFFFF;
			}
		}
	}
</style>
